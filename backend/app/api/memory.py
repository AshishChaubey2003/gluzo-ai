"""Gluzo AI — Memory API"""
from fastapi import APIRouter, HTTPException
from app.services.memory import memory_store

router = APIRouter()


@router.get("/memory/{session_id}")
async def get_memory(session_id: str):
    memory = memory_store.get(session_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Session not found")
    return memory.to_dict()


@router.delete("/memory/{session_id}")
async def clear_memory(session_id: str):
    memory_store.delete(session_id)
    return {"status": "cleared"}
