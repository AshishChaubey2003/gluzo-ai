"""
Gluzo AI — Advanced RAG Pipeline
The core intelligence: query understanding → semantic retrieval → reranking → response
"""

import logging
import re
from typing import List, Optional, Tuple

from app.core.config import settings
from app.core.vectorstore import VectorStore
from app.models.product import Product, RetrievedProduct
from app.models.memory import ConversationMemory
from app.services.llm_client import LLMClient

logger = logging.getLogger(__name__)


class RAGPipeline:
    """
    Production-grade RAG pipeline for Gluzo AI.

    Architecture:
    User Query
      → Query Understanding (extract skin type, concern, budget)
      → Query Rewriting (expand to semantic richness)
      → FAISS Semantic Search (top-K candidates)
      → Hybrid Filter (skin type, price, category)
      → Product Reranking (relevance + context score)
      → Context Compression (only what LLM needs)
      → LLM Response Generation
    """

    def __init__(self, vectorstore: VectorStore, llm_client: LLMClient):
        self.vs = vectorstore
        self.llm = llm_client

    # ─── Stage 1: Query Understanding ───────────────────────────────────────────

    async def understand_query(
        self, query: str, memory: ConversationMemory
    ) -> dict:
        """
        Extract structured intent from raw user query.
        Returns: {skin_type, concerns, budget, category, intent_type}
        """
        context = memory.get_profile_summary() if memory else ""

        prompt = f"""
You are a beauty expert extracting structured information from a user's message.

User profile so far: {context}

User says: "{query}"

Extract:
- skin_type: (oily/dry/combination/sensitive/normal/unknown)
- concerns: list of skin concerns mentioned (acne, dark spots, dryness, anti-aging, etc.)
- budget: maximum price in INR if mentioned (null if not)
- category: product category if mentioned (serum/moisturizer/cleanser/sunscreen/toner/etc.)
- intent_type: (product_search/routine_request/question/complaint/greeting)

Respond ONLY in JSON. No explanation.
"""
        response = await self.llm.complete(prompt, temperature=0.1)
        try:
            import json
            # Clean markdown fences if any
            clean = re.sub(r"```json|```", "", response).strip()
            return json.loads(clean)
        except Exception:
            return {"skin_type": "unknown", "concerns": [], "budget": None,
                    "category": None, "intent_type": "product_search"}

    # ─── Stage 2: Query Rewriting ────────────────────────────────────────────────

    async def rewrite_query(
        self, original_query: str, intent: dict, memory: ConversationMemory
    ) -> str:
        """
        Rewrite the user's casual query into a semantically rich
        retrieval query optimised for the product embedding space.

        Example:
          "I want glow for my wedding" 
          → "brightening hydrating skincare serum for glowing skin wedding radiance"
        """
        profile = memory.get_profile_summary() if memory else ""

        prompt = f"""
You are a semantic search expert for a beauty platform.

User profile: {profile}
User intent: {intent}
Original query: "{original_query}"

Rewrite this into a rich, specific beauty product search query.
- Expand casual phrases to technical skincare terms
- Include skin type, concern, and product category
- Add ingredient-level terms if applicable
- Keep it under 30 words
- Output ONLY the rewritten query, nothing else
"""
        rewritten = await self.llm.complete(prompt, temperature=0.2)
        logger.info(f"Query rewrite: '{original_query}' → '{rewritten.strip()}'")
        return rewritten.strip()

    # ─── Stage 3: Retrieval + Reranking ─────────────────────────────────────────

    async def retrieve_and_rerank(
        self,
        query: str,
        intent: dict,
        memory: ConversationMemory,
        top_k: int = settings.TOP_K_FINAL,
    ) -> List[RetrievedProduct]:
        """
        Semantic retrieval followed by context-aware reranking.
        """
        # Build metadata filters from intent
        filters = {}
        if intent.get("skin_type") and intent["skin_type"] != "unknown":
            filters["skin_type"] = intent["skin_type"]
        if intent.get("budget"):
            filters["max_price"] = float(intent["budget"])
        if intent.get("category"):
            filters["category"] = intent["category"]

        # Retrieve candidates
        candidates = await self.vs.search(query, top_k=settings.TOP_K_RETRIEVAL, filters=filters)

        if not candidates:
            # Fallback: retrieve without filters
            candidates = await self.vs.search(query, top_k=settings.TOP_K_RETRIEVAL)

        if not candidates:
            return []

        # Rerank
        reranked = await self._rerank(candidates, intent, memory, query)
        return reranked[:top_k]

    async def _rerank(
        self,
        candidates: List[RetrievedProduct],
        intent: dict,
        memory: ConversationMemory,
        query: str,
    ) -> List[RetrievedProduct]:
        """
        Multi-factor reranking:
        1. Vector similarity score (from FAISS)
        2. Concern match score
        3. Skin type compatibility
        4. Budget fit
        5. Context relevance (products NOT already recommended)
        """
        previously_shown = memory.get_shown_products() if memory else set()

        for r in candidates:
            p = r.product
            score = r.similarity  # base: FAISS cosine similarity

            # Concern match (+0.15 per matching concern)
            user_concerns = [c.lower() for c in intent.get("concerns", [])]
            product_concerns = p.concern.lower()
            for concern in user_concerns:
                if concern in product_concerns:
                    score += 0.15

            # Skin type compatibility (+0.1)
            user_skin = (intent.get("skin_type") or "").lower()
            if user_skin and (user_skin in p.skin_type.lower() or "all" in p.skin_type.lower()):
                score += 0.10

            # Budget fit — prefer products well within budget
            if intent.get("budget"):
                budget = float(intent["budget"])
                if p.price <= budget * 0.8:
                    score += 0.05

            # Novelty — prefer products not recently shown
            if p.id in previously_shown:
                score -= 0.20

            r.final_score = score

        candidates.sort(key=lambda x: x.final_score, reverse=True)
        return candidates

    # ─── Stage 4: Context Compression ───────────────────────────────────────────

    def compress_context(self, products: List[RetrievedProduct], max_tokens: int = 800) -> str:
        """
        Build a compact product context string for the LLM.
        Only include fields relevant to the recommendation — not full descriptions.
        """
        lines = []
        for i, r in enumerate(products, 1):
            p = r.product
            lines.append(
                f"[PRODUCT {i}]\n"
                f"Name: {p.name}\n"
                f"Brand: {p.brand}\n"
                f"Category: {p.category}\n"
                f"Price: ₹{p.price:.0f}\n"
                f"For: {p.skin_type} skin | Concerns: {p.concern}\n"
                f"Key ingredients: {p.ingredients[:150]}\n"
                f"Why it works: {p.description[:200]}"
            )

        context = "\n\n".join(lines)

        # Truncate at approximate token limit (1 token ≈ 4 chars)
        if len(context) > max_tokens * 4:
            context = context[: max_tokens * 4] + "\n[...truncated]"

        return context

    # ─── Full Pipeline ───────────────────────────────────────────────────────────

    async def run(
        self,
        user_message: str,
        memory: ConversationMemory,
        session_id: str,
    ) -> Tuple[str, List[Product]]:
        """
        Execute the full RAG pipeline and return (ai_response, recommended_products).
        """
        # 1. Understand intent
        intent = await self.understand_query(user_message, memory)

        # 2. Rewrite query (skip for greetings/questions)
        if intent.get("intent_type") in ("greeting", "question"):
            search_query = user_message
        else:
            search_query = await self.rewrite_query(user_message, intent, memory)

        # 3. Retrieve + Rerank
        results = await self.retrieve_and_rerank(search_query, intent, memory)

        # 4. Compress context
        product_context = self.compress_context(results) if results else "No matching products found."

        # 5. Update memory with intent
        memory.update_profile(intent)

        # 6. Generate response
        response = await self._generate_response(
            user_message=user_message,
            product_context=product_context,
            memory=memory,
            has_products=len(results) > 0,
        )

        # 7. Update shown products
        if results:
            memory.add_shown_products([r.product.id for r in results])

        return response, [r.product for r in results]

    async def _generate_response(
        self,
        user_message: str,
        product_context: str,
        memory: ConversationMemory,
        has_products: bool,
    ) -> str:
        """Generate the final conversational response using the LLM."""
        from app.core.prompts import PromptManager
        pm = PromptManager()
        system_prompt = pm.get_system_prompt()
        conversation_history = memory.get_history_for_llm()

        user_turn = pm.build_user_turn(
            user_message=user_message,
            product_context=product_context if has_products else None,
            profile=memory.get_profile_summary(),
        )

        messages = conversation_history + [{"role": "user", "content": user_turn}]

        return await self.llm.chat(system_prompt=system_prompt, messages=messages)
