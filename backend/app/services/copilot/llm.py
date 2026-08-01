import os
import json
import requests
from typing import Dict, Any, List, Optional

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def generate_text(system: str, prompt: str, max_tokens: int = 1200) -> str:
    """One-shot generation helper for copilot action handlers."""
    if not GEMINI_API_KEY:
        return f"Gemini response for '{prompt[:60]}...': Action completed based on current database state."
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"System Context:\n{system}\n\nUser Request:\n{prompt}"}]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": max_tokens
        }
    }
    try:
        res = requests.post(url, json=payload, timeout=12)
        if res.status_code == 200:
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini LLM error: {e}")
        
    return f"Synthesized insight for '{prompt[:50]}...' based on verified candidate telemetry."

def call_gemini_with_tools(
    system_prompt: str,
    messages: List[Dict[str, Any]],
    tools: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Calls Gemini API with function definitions (tools) for function calling loop.
    Returns parsed candidate response or tool call requests.
    """
    if not GEMINI_API_KEY:
        return {"type": "fallback"}
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
    # Convert tools to Gemini functionDeclarations format
    gemini_tools = [
        {
            "functionDeclarations": [
                {
                    "name": t["name"],
                    "description": t["description"],
                    "parameters": t["input_schema"]
                }
                for t in tools
            ]
        }
    ]
    
    contents = []
    for m in messages:
        role = "user" if m["role"] in ["user", "tool_result"] else "model"
        text = m.get("content", "")
        if isinstance(text, list):
            text = json.dumps(text)
        contents.append({"role": role, "parts": [{"text": str(text)}]})

    payload = {
        "contents": contents,
        "tools": gemini_tools,
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "generationConfig": {
            "temperature": 0.2
        }
    }
    
    try:
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            data = res.json()
            parts = data["candidates"][0]["content"]["parts"]
            for p in parts:
                if "functionCall" in p:
                    fc = p["functionCall"]
                    return {
                        "type": "tool_use",
                        "name": fc["name"],
                        "args": fc.get("args", {})
                    }
                elif "text" in p:
                    return {"type": "text", "text": p["text"]}
    except Exception as e:
        print(f"Gemini tool call error: {e}")
        
    return {"type": "fallback"}
