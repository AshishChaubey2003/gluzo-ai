"""
Gluzo AI — Configuration
Centralised settings with environment variable support
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Gluzo AI"
    DEBUG: bool = False

    # API Keys
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""       # Gemini
    GROQ_API_KEY: str = ""

    # LLM Provider: "openai" | "gemini" | "groq"
    LLM_PROVIDER: str = "groq"
    LLM_MODEL: str = "llama3-70b-8192"  # Groq model (fast, free tier)

    # Embedding
    EMBEDDING_MODEL: str = "text-embedding-3-small"  # OpenAI
    EMBEDDING_DIMENSION: int = 1536

    # FAISS
    FAISS_INDEX_PATH: str = "data/faiss_index"
    PRODUCTS_CSV_PATH: str = "data/products.csv"

    # RAG
    TOP_K_RETRIEVAL: int = 15       # retrieve top 15 before reranking
    TOP_K_FINAL: int = 5            # return top 5 to LLM
    SIMILARITY_THRESHOLD: float = 0.70

    # Memory
    MAX_MEMORY_TURNS: int = 10      # conversation turns to remember
    REDIS_URL: str = ""             # optional: use dict-based memory if empty

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://gluzo.ai",
        "https://gluzo-ai.vercel.app",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
