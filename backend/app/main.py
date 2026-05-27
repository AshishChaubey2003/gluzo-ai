"""
Gluzo AI — FastAPI Backend
Startup-grade AI beauty commerce platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.chat import router as chat_router
from app.api.products import router as products_router
from app.api.recommend import router as recommend_router
from app.api.memory import router as memory_router
from app.api.routine import router as routine_router
from app.core.config import settings
from app.core.vectorstore import VectorStore

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    logger.info("🚀 Starting Gluzo AI Backend...")
    vs = VectorStore()
    await vs.initialize()
    app.state.vectorstore = vs
    logger.info("✅ FAISS vector store ready")
    yield
    logger.info("🛑 Shutting down Gluzo AI Backend...")


app = FastAPI(
    title="Gluzo AI",
    description="AI-powered beauty commerce platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])
app.include_router(products_router, prefix="/api/v1", tags=["Products"])
app.include_router(recommend_router, prefix="/api/v1", tags=["Recommendations"])
app.include_router(memory_router, prefix="/api/v1", tags=["Memory"])
app.include_router(routine_router, prefix="/api/v1", tags=["Routine"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Gluzo AI"}
