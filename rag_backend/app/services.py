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
        self.client = (
            OpenAI(
                api_key=settings.groq_api_key,
                base_url="https://api.groq.com/openai/v1",
            )
            if settings.groq_api_key
            else None
        )

    @property
    def embedding_service(self) -> EmbeddingService:
        if self._embedding_service is None:
            self._embedding_service = EmbeddingService(self.settings)
        return self._embedding_service

    def query(self, question: str, top_k: int = 3) -> dict[str, object]:
        understanding = self.understand_question(question)

        direct_answer = self.answer_direct_question(question)
        if direct_answer:
            return {
                "answer": direct_answer,
                "sources": [],
                "num_contexts": 0,
                **understanding,
            }

        search_results = self.embedding_service.search(
            self.retrieval_query(question, understanding),
            top_k=top_k,
        )
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
                **understanding,
            }

        if not self.settings.groq_api_key:
            return {
                "answer": self.answer_from_context(question, contexts, understanding),
                "sources": sources,
                "num_contexts": len(contexts),
                **understanding,
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
                        "Use the detected sentiment to adjust tone without changing facts. "
                        "Keep answers concise, friendly, and specific."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Detected intent: {understanding['intent']}\n"
                        f"Detected sentiment: {understanding['sentiment']}\n\n"
                        f"Context:\n{context_block}\n\nQuestion: {question}"
                    ),
                },
            ],
            temperature=0.2,
            max_tokens=256,
        )

        answer = completion.choices[0].message.content.strip()
        return {
            "answer": answer,
            "sources": sources,
            "num_contexts": len(contexts),
            **understanding,
        }

    def understand_question(self, question: str) -> dict[str, str]:
        normalized = re.sub(r"[^a-z0-9\s]", " ", question.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()

        negative_terms = {
            "bad",
            "wrong",
            "error",
            "angry",
            "annoyed",
            "frustrated",
            "hate",
            "not good",
            "don t know",
            "don't know",
            "confused",
            "problem",
        }
        positive_terms = {
            "good",
            "great",
            "nice",
            "love",
            "thanks",
            "thank",
            "awesome",
            "perfect",
        }

        sentiment = "neutral"
        if any(term in normalized for term in negative_terms):
            sentiment = "frustrated"
        elif any(term in normalized for term in positive_terms):
            sentiment = "positive"

        intent = "general"
        intent_patterns = [
            ("private_personal", r"\b(religion|religious|religius|muslim|hindu|christian|faith|belief|beliefs|beliefe)\b"),
            ("profile", r"\b(about\s+(you|yourself|abdur)|tell\s+me\s+about\s+(you|yourself|abdur)|introduce|what\s+(do\s+)?you\s+do|what\s+can\s+you\s+do)\b"),
            ("skills", r"\b(skill|skills|stack|tech|technology|tools|framework|frameworks|use|uses|know)\b"),
            ("projects", r"\b(project|projects|built|work|portfolio|rag|llm|stock|sentiment|nlp)\b"),
            ("education", r"\b(cgpa|education|btech|b tech|degree|college|graduate|graduation)\b"),
            ("experience", r"\b(experience|internship|intern|anwimac|job)\b"),
            ("contact", r"\b(email|contact|reach|mail)\b"),
            ("location", r"\b(location|based|live|from|city|udaipur|rajasthan)\b"),
            ("opportunities", r"\b(open|available|opportunity|opportunities|role|roles|hire|hiring|collaboration|collaborate)\b"),
        ]
        for label, pattern in intent_patterns:
            if re.search(pattern, normalized):
                intent = label
                break

        return {"intent": intent, "sentiment": sentiment}

    def retrieval_query(self, question: str, understanding: dict[str, str]) -> str:
        intent_expansions = {
            "private_personal": "religious beliefs personal faith private spiritual views not included portfolio knowledge",
            "profile": "Abdur Ursul Khan B.Tech Computer Science Artificial Intelligence graduate projects skills portfolio background",
            "skills": "skills technology stack tools frameworks programming languages AI ML full stack",
            "projects": "projects RAG LLM fine tuning stock market analytics NLP full stack applications",
            "education": "education B.Tech Computer Science Artificial Intelligence Aravali Institute CGPA",
            "experience": "internship work experience ANWIMAC web development",
            "contact": "email contact reach",
            "location": "based location city Udaipur Rajasthan",
            "opportunities": "open full-time roles collaborations research projects AI engineering machine learning full stack",
        }
        expansion = intent_expansions.get(understanding["intent"], "")
        return f"{question}\n{expansion}".strip()

    def answer_from_context(
        self,
        question: str,
        contexts: list[str],
        understanding: dict[str, str],
    ) -> str:
        context = "\n".join(contexts)
        normalized_question = re.sub(r"[^a-z0-9\s]", " ", question.lower())
        normalized_question = re.sub(r"\s+", " ", normalized_question).strip()

        if understanding["sentiment"] == "frustrated":
            prefix = "You're right to expect the portfolio chat to answer from its knowledge base. "
        else:
            prefix = ""

        if understanding["intent"] == "private_personal":
            return (
                prefix
                + "Abdur's religious beliefs, personal faith, and private spiritual views are not included in the current portfolio knowledge base. "
                "I can answer about his education, skills, projects, experience, location, or contact information."
            )

        sentences = re.split(r"(?<=[.!?])\s+", context.strip())
        question_terms = {
            term
            for term in normalized_question.split()
            if len(term) > 2 and term not in {"what", "tell", "about", "your", "you", "are", "the", "kind"}
        }

        ranked_sentences: list[tuple[int, str]] = []
        for sentence in sentences:
            normalized_sentence = re.sub(r"[^a-z0-9\s]", " ", sentence.lower())
            score = sum(1 for term in question_terms if term in normalized_sentence)
            if understanding["intent"] != "general" and understanding["intent"] in normalized_sentence:
                score += 2
            ranked_sentences.append((score, sentence.strip()))

        ranked_sentences.sort(key=lambda item: item[0], reverse=True)
        selected = [sentence for score, sentence in ranked_sentences[:3] if sentence and score > 0]

        if not selected:
            selected = [sentence.strip() for sentence in sentences[:2] if sentence.strip()]

        if not selected:
            return (
                prefix
                + "I don't have that detail in Abdur's current portfolio knowledge yet. "
                "I can still help with his skills, projects, education, experience, location, and contact information."
            )

        return prefix + " ".join(selected)

    def answer_direct_question(self, question: str) -> str | None:
        normalized = re.sub(r"[^a-z0-9\s]", " ", question.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()

        if not normalized:
            return None

        if re.search(r"\b(what|who)\s+(is|are)\s+(your|ur)\s+name\b", normalized):
            return "I'm Abdur's portfolio assistant. I can tell you about Abdur Ursul Khan's skills, projects, education, experience, and goals."

        if re.search(r"\b(who\s+are\s+you|what\s+are\s+you)\b", normalized):
            return "I'm Abdur's portfolio assistant, built to answer questions about his portfolio and background."

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
