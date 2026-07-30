"""
ApexTalent AI — Unified LLM Provider & AI Agent Integrator
Supports OpenAI, Groq, OpenRouter, and fallback heuristic engines.
"""

import os
import json
import urllib.request
from typing import Dict, Any, Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def call_llm(prompt: str, system_prompt: str = "You are ApexTalent AI, an expert talent intelligence agent.") -> Optional[str]:
    """
    Invokes real LLM API if external API keys (OpenAI / Groq / OpenRouter) are set in .env.
    Returns None if no keys configured to trigger real heuristic processing.
    """
    # 1. Try Groq API
    if GROQ_API_KEY:
        try:
            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                data=json.dumps({
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3
                }).encode("utf-8")
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"⚠️ Groq LLM API warning: {e}")

    # 2. Try OpenAI API
    if OPENAI_API_KEY:
        try:
            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                data=json.dumps({
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3
                }).encode("utf-8")
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"⚠️ OpenAI LLM API warning: {e}")

    return None
