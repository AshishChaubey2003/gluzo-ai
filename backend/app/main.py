"""
Gluzo AI — FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging

from app.api.chat import router as chat_router
from app.api.products import router as products_router
from app.core.config import settings
from app.core.vectorstore import VectorStore

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    logger.info("Starting Gluzo AI Backend...")
    vs = VectorStore()
    app.state.vectorstore = vs
    # Initialize in background so port binds immediately
    asyncio.create_task(vs.initialize())
    logger.info("Backend ready — FAISS initializing in background...")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="Gluzo AI",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])
app.include_router(products_router, prefix="/api/v1", tags=["Products"])


@app.get("/")
async def root():
    return {"status": "running", "service": "Gluzo AI"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Gluzo AI"}