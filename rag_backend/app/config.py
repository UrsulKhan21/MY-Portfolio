import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    qdrant_url: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key: str | None = os.getenv("QDRANT_API_KEY") or None
    qdrant_collection: str = os.getenv(
        "QDRANT_COLLECTION",
        "abdur_ursul_khan_portfolio",
    )
    groq_api_key: str | None = os.getenv("GROQ_API_KEY") or None
    llm_model: str = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
    embed_model_name: str = os.getenv("EMBED_MODEL_NAME", "all-MiniLM-L6-v2")
    embed_dim: int = int(os.getenv("EMBED_DIM", "384"))
    allowed_origins: list[str] = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:4173").split(",")
        if origin.strip()
    ]
    admin_token: str | None = os.getenv("ADMIN_TOKEN") or None
    data_dir: Path = Path(__file__).resolve().parent.parent / "data"


@lru_cache
def get_settings() -> Settings:
    return Settings()
