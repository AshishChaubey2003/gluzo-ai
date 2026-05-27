"""
Gluzo AI — Recommend API
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional

from app.core.rag_pipeline import RAGPipeline
from app.services.llm_client import LLMClient
from app.services.memory import memory_store, ConversationMemory

router = APIRouter()


class RecommendRequest(BaseModel):
    skin_type: str
    concerns: List[str]
    budget: Optional[float] = None
    category: Optional[str] = None
    session_id: Optional[str] = None


@router.post("/recommend")
async def recommend(req: RecommendRequest, request: Request):
    """Direct recommendation endpoint — bypasses chat."""
    vs = request.app.state.vectorstore
    llm = LLMClient()
    pipeline = RAGPipeline(vectorstore=vs, llm_client=llm)

    query = f"{req.skin_type} skin {' '.join(req.concerns)} {req.category or 'skincare'}"

    intent = {
        "skin_type": req.skin_type,
        "concerns": req.concerns,
        "budget": req.budget,
        "category": req.category,
    }

    from app.services.memory import ConversationMemory as CM
    memory = CM("direct_recommend")
    memory.update_profile(intent)

    results = await pipeline.retrieve_and_rerank(query, intent, memory)

    return {
        "products": [r.product for r in results],
        "count": len(results),
    }
