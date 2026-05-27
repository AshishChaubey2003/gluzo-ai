"""Gluzo AI — Routine Generation API"""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional

from app.core.rag_pipeline import RAGPipeline
from app.core.prompts import PromptManager
from app.services.llm_client import LLMClient
from app.services.memory import memory_store

router = APIRouter()


class RoutineRequest(BaseModel):
    skin_type: str
    concern: str
    budget: Optional[float] = None
    session_id: Optional[str] = None


@router.post("/routine")
async def generate_routine(req: RoutineRequest, request: Request):
    """Generate a full AM/PM skincare routine."""
    vs = request.app.state.vectorstore
    llm = LLMClient()
    pipeline = RAGPipeline(vectorstore=vs, llm_client=llm)
    pm = PromptManager()

    categories = ["cleanser", "serum", "moisturizer", "sunscreen", "toner"]
    all_products = []

    from app.services.memory import ConversationMemory as CM
    memory = CM("routine")
    memory.update_profile({"skin_type": req.skin_type, "concerns": [req.concern]})

    for cat in categories:
        intent = {"skin_type": req.skin_type, "concerns": [req.concern], "category": cat}
        query = f"{req.skin_type} skin {req.concern} {cat}"
        results = await pipeline.retrieve_and_rerank(query, intent, memory, top_k=1)
        if results:
            all_products.append(results[0].product)

    context = pipeline.compress_context(
        [type("R", (), {"product": p, "similarity": 1.0, "final_score": 1.0})() for p in all_products]
    )

    prompt = pm.get_routine_prompt(req.concern, req.skin_type, context)
    routine_text = await llm.complete(prompt, temperature=0.7)

    return {
        "routine_text": routine_text,
        "products": all_products,
    }
