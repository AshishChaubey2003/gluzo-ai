from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class MemoryProfile(BaseModel):
    skin_type: Optional[str] = None
    concerns: List[str] = []
    budget: Optional[float] = None
    preferred_categories: List[str] = []


class ConversationMemory:
    """Defined in services/memory.py — imported here for type hints."""
    pass
