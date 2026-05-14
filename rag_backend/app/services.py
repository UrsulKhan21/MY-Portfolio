from pathlib import Path
import re
from uuid import NAMESPACE_URL, uuid5

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams
from sentence_transformers import SentenceTransformer

from .config import Settings


def chunk_text(text: str, chunk_size: int = 3000, overlap: int = 300) -> list[str]:
    normalized = "\n".join(line.strip() for line in text.splitlines())
    normalized = "\n".join(line for line in normalized.splitlines() if line)
    if not normalized:
        return []

    chunks: list[str] = []
    start = 0
    while start < len(normalized):
        end = min(start + chunk_size, len(normalized))
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == len(normalized):
            break
        start = max(0, end - overlap)
    return chunks


class EmbeddingService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.embedder = SentenceTransformer(settings.embed_model_name)
        self.qdrant_client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )

    def ensure_collection(self) -> None:
        try:
            self.qdrant_client.get_collection(self.settings.qdrant_collection)
        except Exception:
            self.qdrant_client.create_collection(
                collection_name=self.settings.qdrant_collection,
                vectors_config=VectorParams(
                    size=self.settings.embed_dim,
                    distance=Distance.COSINE,
                ),
            )

    def recreate_collection(self) -> None:
        try:
            self.qdrant_client.delete_collection(self.settings.qdrant_collection)
        except Exception:
            pass

        self.qdrant_client.create_collection(
            collection_name=self.settings.qdrant_collection,
            vectors_config=VectorParams(
                size=self.settings.embed_dim,
                distance=Distance.COSINE,
            ),
        )

    def index_texts(self, items: list[tuple[str, str]]) -> int:
        self.ensure_collection()

        texts: list[str] = []
        ids: list[str] = []
        payloads: list[dict[str, str]] = []

        for source, text in items:
            for index, chunk in enumerate(chunk_text(text)):
                texts.append(chunk)
                ids.append(str(uuid5(NAMESPACE_URL, f"{source}:{index}:{chunk[:80]}")))
                payloads.append({"text": chunk, "source": source, "chunk": str(index)})

        if not texts:
            return 0

        vectors = self.embedder.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        points = [
            PointStruct(id=ids[i], vector=vectors[i].tolist(), payload=payloads[i])
            for i in range(len(ids))
        ]

        self.qdrant_client.upsert(
            collection_name=self.settings.qdrant_collection,
            points=points,
        )
        return len(points)

    def index_data_dir(self) -> int:
        data_dir = self.settings.data_dir
        data_dir.mkdir(parents=True, exist_ok=True)
        items: list[tuple[str, str]] = []

        for path in sorted(data_dir.glob("*.txt")):
            items.append((path.name, path.read_text(encoding="utf-8")))

        self.recreate_collection()
        indexed_count = self.index_texts(items)
        self.write_index_state()
        return indexed_count

    def data_signature(self) -> dict[str, float]:
        self.settings.data_dir.mkdir(parents=True, exist_ok=True)
        return {
            path.name: path.stat().st_mtime
            for path in sorted(self.settings.data_dir.glob("*.txt"))
        }

    def write_index_state(self) -> None:
        state = "\n".join(
            f"{name}:{modified_at}" for name, modified_at in self.data_signature().items()
        )
        (self.settings.data_dir / ".index_state").write_text(state, encoding="utf-8")

    def is_data_changed(self) -> bool:
        state_path = self.settings.data_dir / ".index_state"
        if not state_path.exists():
            return True

        current_state = "\n".join(
            f"{name}:{modified_at}" for name, modified_at in self.data_signature().items()
        )
        return state_path.read_text(encoding="utf-8") != current_state

    def sync_if_data_changed(self) -> None:
        if self.is_data_changed():
            self.index_data_dir()

    def search(self, query: str, top_k: int = 3) -> dict[str, list[str]]:
        self.sync_if_data_changed()
        self.ensure_collection()

        query_vector = self.embedder.encode(
            [query],
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )[0]

        if hasattr(self.qdrant_client, "search"):
            results = self.qdrant_client.search(
                collection_name=self.settings.qdrant_collection,
                query_vector=query_vector.tolist(),
                limit=top_k,
            )
        else:
            query_result = self.qdrant_client.query_points(
                collection_name=self.settings.qdrant_collection,
                query=query_vector.tolist(),
                limit=top_k,
            )
            results = query_result.points

        contexts: list[str] = []
        sources: list[str] = []
        for result in results:
            if result.payload and "text" in result.payload:
                contexts.append(str(result.payload["text"]))
                source = str(result.payload.get("source", "unknown"))
                chunk = str(result.payload.get("chunk", "0"))
                sources.append(f"{source}#{chunk}")

        return {"contexts": contexts, "sources": sources}


class RAGService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._embedding_service: EmbeddingService | None = None
        self.client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    @property
    def embedding_service(self) -> EmbeddingService:
        if self._embedding_service is None:
            self._embedding_service = EmbeddingService(self.settings)
        return self._embedding_service

    def query(self, question: str, top_k: int = 3) -> dict[str, object]:
        if not self.settings.groq_api_key:
            raise RuntimeError("GROQ_API_KEY is required to generate answers.")

        direct_answer = self.answer_direct_question(question)
        if direct_answer:
            return {"answer": direct_answer, "sources": [], "num_contexts": 0}

        search_results = self.embedding_service.search(question, top_k=top_k)
        contexts = search_results["contexts"]
        sources = search_results["sources"]

        if not contexts:
            return {
                "answer": (
                    "I don't have that detail in Abdur's current portfolio knowledge yet. "
                    "I can still help with his skills, projects, education, experience, and goals."
                ),
                "sources": [],
                "num_contexts": 0,
            }

        context_block = "\n\n".join(contexts)
        completion = self.client.chat.completions.create(
            model=self.settings.llm_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Abdur Ursul Khan's portfolio chatbot. "
                        "You are the assistant, not Abdur himself. "
                        "Answer only using the provided context for facts about Abdur. "
                        "If a personal detail is not in the context, say that it is not in Abdur's current portfolio knowledge yet. "
                        "Read the user's tone with care, be warm and emotionally natural, and avoid blunt one-line refusals. "
                        "Keep answers concise, friendly, and specific."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context_block}\n\nQuestion: {question}",
                },
            ],
            temperature=0.2,
            max_tokens=256,
        )

        answer = completion.choices[0].message.content.strip()
        return {"answer": answer, "sources": sources, "num_contexts": len(contexts)}

    def answer_direct_question(self, question: str) -> str | None:
        normalized = re.sub(r"[^a-z0-9\s]", " ", question.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()

        if not normalized:
            return None

        if re.search(r"\b(what|who)\s+(is|are)\s+(your|ur)\s+name\b", normalized):
            return "I'm Abdur's portfolio assistant. I can tell you about Abdur Ursul Khan's skills, projects, education, experience, and goals."

        if re.search(r"\b(who\s+are\s+you|what\s+are\s+you)\b", normalized):
            return "I'm Abdur's portfolio assistant, built to answer questions about his portfolio and background."

        knowledge_text = self.local_knowledge_text()

        if "chess" in normalized and "chess" in knowledge_text.lower():
            return "Yes. Abdur plays chess and enjoys strategy-focused games."

        if re.search(r"\b(cgpa|education|btech|b tech|degree|college)\b", normalized):
            if "8.5" in knowledge_text and "b.tech" in knowledge_text.lower():
                return "Abdur has passed out with a B.Tech in Computer Science and Artificial Intelligence from Aravali Institute with an 8.5 CGPA."

        if re.search(r"\b(project|projects|built|work)\b", normalized):
            if "retrieval-augmented generation" in knowledge_text.lower():
                return "Abdur has built RAG pipelines, LLM fine-tuning work, stock market analytics, NLP sentiment analysis, and full-stack web applications."

        if re.search(r"\b(skill|skills|tech stack|technologies|know)\b", normalized):
            if "javascript" in knowledge_text.lower():
                return "Abdur works with Python, JavaScript, LangChain, TensorFlow, Qdrant, Docker, React, Next.js, Tailwind CSS, Framer Motion, Django, FastAPI, and AI deployment workflows."

        return None

    def local_knowledge_text(self) -> str:
        self.settings.data_dir.mkdir(parents=True, exist_ok=True)
        return "\n\n".join(
            path.read_text(encoding="utf-8")
            for path in sorted(self.settings.data_dir.glob("*.txt"))
        )


def write_text_source(data_dir: Path, title: str, text: str) -> Path:
    data_dir.mkdir(parents=True, exist_ok=True)
    safe_title = "".join(
        char.lower() if char.isalnum() else "_" for char in title.strip()
    ).strip("_")
    path = data_dir / f"{safe_title or 'source'}.txt"
    path.write_text(text, encoding="utf-8")
    return path
