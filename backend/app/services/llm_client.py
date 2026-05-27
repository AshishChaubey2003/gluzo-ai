"""
Gluzo AI — LLM Client
Unified interface for Groq / Gemini / OpenAI
"""

import logging
from typing import List, Dict

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    """
    Pluggable LLM backend.
    Provider is selected via LLM_PROVIDER env var.
    Default: Groq (llama3-70b — fast, near-free at low volume).
    """

    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.model = settings.LLM_MODEL
        self._client = self._init_client()

    def _init_client(self):
        if self.provider == "groq":
            from groq import AsyncGroq
            return AsyncGroq(api_key=settings.GROQ_API_KEY)
        elif self.provider == "openai":
            from openai import AsyncOpenAI
            return AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        elif self.provider == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            return genai.GenerativeModel(self.model or "gemini-1.5-pro")
        else:
            raise ValueError(f"Unknown LLM provider: {self.provider}")

    async def complete(self, prompt: str, temperature: float = 0.3) -> str:
        """Single-turn completion (for query rewriting, intent extraction)."""
        return await self.chat(
            system_prompt="You are a helpful assistant.",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
        )

    async def chat(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.75,
    ) -> str:
        """Multi-turn chat with system prompt."""
        try:
            if self.provider in ("groq", "openai"):
                full_messages = [{"role": "system", "content": system_prompt}] + messages
                response = await self._client.chat.completions.create(
                    model=self.model,
                    messages=full_messages,
                    temperature=temperature,
                    max_tokens=150,
                )
                return response.choices[0].message.content.strip()

            elif self.provider == "gemini":
                # Gemini uses a different message format
                history = []
                for m in messages[:-1]:
                    history.append({
                        "role": "user" if m["role"] == "user" else "model",
                        "parts": [m["content"]],
                    })
                chat = self._client.start_chat(history=history)
                last_msg = messages[-1]["content"]
                full_input = f"{system_prompt}\n\n{last_msg}" if not history else last_msg
                response = await chat.send_message_async(full_input)
                return response.text.strip()

        except Exception as e:
            logger.error(f"LLM error ({self.provider}): {e}")
            return (
                "I'm having a little moment right now — try again in a sec? ✨"
            )
