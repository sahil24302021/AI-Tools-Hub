"""Universal Gemini REST helper exposing only generate_text(image/text).

Adds optional temperature (default 0.7) and structured error codes.
"""

import os
import base64
import requests

DEFAULT_TEMPERATURE = 0.7

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-2.0-flash"
BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}"

_NO_API_KEY = False
if not API_KEY:
    _NO_API_KEY = True

def generate_text(prompt: str, temperature: float = DEFAULT_TEMPERATURE) -> str:
    """Generate text for a given prompt.

    Parameters
    ----------
    prompt: str
        Input text prompt.
    temperature: float, default=0.7
        Sampling temperature for generation (0 = deterministic, higher = more creative).

    Returns
    -------
    str
        Model output text (first candidate part).

    Raises
    ------
    RuntimeError
        With one of the codes: rate_limit, model_http_error, empty_response, no_text_part
    """
    if _NO_API_KEY:
        # Graceful no-key fallback: return empty string to avoid crashing endpoints.
        return ""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": float(temperature)},
    }
    resp = requests.post(BASE_URL, json=payload, timeout=60)
    if resp.status_code == 429:
        raise RuntimeError("rate_limit")
    if resp.status_code >= 400:
        raise RuntimeError(f"model_http_error {resp.status_code}: {resp.text}")
    data = resp.json()
    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError("empty_response")
    parts = candidates[0].get("content", {}).get("parts", [])
    for part in parts:
        txt = part.get("text")
        if txt:
            return txt.strip()
    raise RuntimeError("no_text_part")

def image_to_text(image_bytes: bytes, temperature: float = DEFAULT_TEMPERATURE) -> str:
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = (
        "Describe the following image provided as base64. Include objects, colors, any text (transcribe exactly), and overall scene context. Base64: "
        + b64[:40000]
    )
    return generate_text(prompt, temperature=temperature)
