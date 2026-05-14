from functools import lru_cache

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .schemas import (
    IngestResponse,
    IngestTextRequest,
    ContactMessageRequest,
    QueryRequest,
    QueryResponse,
    StatusResponse,
)
from .services import EmbeddingService, RAGService, write_text_source


app = FastAPI(title="ABDUR URSUL KHAN portfolio RAG chatbot")


def settings_dependency() -> Settings:
    return get_settings()


settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService(get_settings())


@lru_cache
def get_rag_service() -> RAGService:
    return RAGService(get_settings())


@app.on_event("startup")
def warm_rag_service() -> None:
    get_rag_service()


def require_admin_token(
    settings: Settings = Depends(settings_dependency),
    x_admin_token: str | None = Header(default=None),
) -> None:
    if settings.admin_token and x_admin_token != settings.admin_token:
        raise HTTPException(status_code=401, detail="Invalid admin token.")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/messages")
def contact_message(request: ContactMessageRequest) -> dict[str, str]:
    print(
        "Portfolio contact message:",
        {"name": request.name, "email": request.email, "message": request.message},
    )
    return {"status": "received"}


@app.get("/api/rag/status", response_model=StatusResponse)
def rag_status(settings: Settings = Depends(settings_dependency)) -> StatusResponse:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    return StatusResponse(
        collection_name=settings.qdrant_collection,
        data_files=[path.name for path in sorted(settings.data_dir.glob("*.txt"))],
    )


@app.post("/api/rag/reindex", response_model=IngestResponse)
def reindex(
    _: None = Depends(require_admin_token),
    settings: Settings = Depends(settings_dependency),
) -> IngestResponse:
    service = get_embedding_service()
    indexed_count = service.index_data_dir()
    return IngestResponse(
        message="Knowledge base reindexed from rag_backend/data/*.txt.",
        indexed_count=indexed_count,
        collection_name=settings.qdrant_collection,
    )


@app.post("/api/rag/ingest-text", response_model=IngestResponse)
def ingest_text(
    request: IngestTextRequest,
    _: None = Depends(require_admin_token),
    settings: Settings = Depends(settings_dependency),
) -> IngestResponse:
    path = write_text_source(settings.data_dir, request.title, request.text)
    service = get_embedding_service()
    indexed_count = service.index_texts([(path.name, request.text)])
    return IngestResponse(
        message=f"Saved and indexed {path.name}.",
        indexed_count=indexed_count,
        collection_name=settings.qdrant_collection,
    )


@app.post("/api/rag/query", response_model=QueryResponse)
def query(
    request: QueryRequest,
    settings: Settings = Depends(settings_dependency),
) -> QueryResponse:
    service = get_rag_service()
    result = service.query(request.question, top_k=request.top_k)
    return QueryResponse(**result)
