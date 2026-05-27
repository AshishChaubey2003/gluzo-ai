import uuid
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.core.rag_pipeline import RAGPipeline
from app.models.product import ProductCard
from app.services.llm_client import LLMClient
from app.services.memory import memory_store

router = APIRouter()

_llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    message: str
    products: List[ProductCard] = []
    profile: dict = {}


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    session_id = req.session_id or str(uuid.uuid4())
    memory = memory_store.get_or_create(session_id)
    memory.add_turn("user", req.message)

    vectorstore = request.app.state.vectorstore
    pipeline = RAGPipeline(vectorstore=vectorstore, llm_client=get_llm_client())

    try:
        ai_response, recommended_products = await pipeline.run(
            user_message=req.message,
            memory=memory,
            session_id=session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    memory.add_turn("assistant", ai_response)

    product_cards = [
        ProductCard(
            id=p.id,
            name=p.name,
            brand=p.brand,
            category=p.category,
            price=p.price,
            skin_type=p.skin_type,
            concern=p.concern,
            image_url=p.image_url,
            product_url=p.product_url,
        )
        for p in recommended_products
    ]

    return ChatResponse(
        session_id=session_id,
        message=ai_response,
        products=product_cards,
        profile=memory.profile,
    )
