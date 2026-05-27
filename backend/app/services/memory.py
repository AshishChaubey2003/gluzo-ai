"""
Gluzo AI — Conversation Memory Manager
In-memory store (upgrade to Redis for production multi-instance)
"""

import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Set


class ConversationMemory:
    """
    Per-session memory that tracks:
    - User profile (skin type, concerns, budget)
    - Conversation history (for LLM context)
    - Previously shown products (for novelty reranking)
    """

    def __init__(self, session_id: str, max_turns: int = 10):
        self.session_id = session_id
        self.max_turns = max_turns
        self.history: List[Dict[str, str]] = []
        self.profile: Dict[str, Any] = {
            "skin_type": None,
            "concerns": [],
            "budget": None,
            "preferred_categories": [],
        }
        self.shown_products: Set[str] = set()
        self.created_at = time.time()
        self.last_active = time.time()

    def add_turn(self, role: str, content: str):
        """Add a conversation turn (user or assistant)."""
        self.history.append({"role": role, "content": content})
        self.last_active = time.time()
        # Keep only last max_turns * 2 messages
        if len(self.history) > self.max_turns * 2:
            self.history = self.history[-(self.max_turns * 2):]

    def update_profile(self, intent: dict):
        """Merge new intent extraction into the profile."""
        if intent.get("skin_type") and intent["skin_type"] != "unknown":
            self.profile["skin_type"] = intent["skin_type"]

        new_concerns = intent.get("concerns", [])
        if new_concerns:
            existing = set(self.profile["concerns"])
            existing.update(new_concerns)
            self.profile["concerns"] = list(existing)

        if intent.get("budget"):
            self.profile["budget"] = intent["budget"]

        if intent.get("category"):
            cats = set(self.profile["preferred_categories"])
            cats.add(intent["category"])
            self.profile["preferred_categories"] = list(cats)

    def get_profile_summary(self) -> str:
        p = self.profile
        parts = []
        if p["skin_type"]:
            parts.append(f"Skin type: {p['skin_type']}")
        if p["concerns"]:
            parts.append(f"Concerns: {', '.join(p['concerns'])}")
        if p["budget"]:
            parts.append(f"Budget: ₹{p['budget']}")
        if p["preferred_categories"]:
            parts.append(f"Interested in: {', '.join(p['preferred_categories'])}")
        return " | ".join(parts) if parts else "No profile built yet"

    def get_history_for_llm(self, last_n: int = 6) -> List[Dict[str, str]]:
        """Return last N turns formatted for the LLM API."""
        return self.history[-last_n * 2:]

    def add_shown_products(self, product_ids: List[str]):
        self.shown_products.update(product_ids)

    def get_shown_products(self) -> Set[str]:
        return self.shown_products

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id,
            "profile": self.profile,
            "history_length": len(self.history),
            "shown_products_count": len(self.shown_products),
            "created_at": self.created_at,
            "last_active": self.last_active,
        }


class MemoryStore:
    """
    In-process memory store. Swap Redis client here for production.
    Includes TTL-based session expiration (4 hours).
    """
    TTL_SECONDS = 4 * 60 * 60  # 4 hours

    def __init__(self):
        self._store: Dict[str, ConversationMemory] = {}

    def get_or_create(self, session_id: str) -> ConversationMemory:
        self._evict_expired()
        if session_id not in self._store:
            self._store[session_id] = ConversationMemory(session_id)
        return self._store[session_id]

    def get(self, session_id: str) -> Optional[ConversationMemory]:
        return self._store.get(session_id)

    def delete(self, session_id: str):
        self._store.pop(session_id, None)

    def _evict_expired(self):
        now = time.time()
        expired = [sid for sid, m in self._store.items()
                   if now - m.last_active > self.TTL_SECONDS]
        for sid in expired:
            del self._store[sid]

    def active_sessions(self) -> int:
        return len(self._store)


# Singleton — shared across all requests
memory_store = MemoryStore()
