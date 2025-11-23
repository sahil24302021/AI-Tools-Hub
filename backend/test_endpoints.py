"""Smoke test all /api endpoints with standard envelope.
Assumes dev auth bypass when DEV_AUTH_BYPASS=1 so no JWT needed.
"""
import os
from app import app

TESTS = [
    ("chat", {"prompt": "Say hello in one sentence."}),
    ("quiz", {"topic": "python", "count": 3, "difficulty": "medium"}),
    ("math", {"problem": "2 + 2 * 5"}),
    ("summarizer", {"text": "Long text about AI tools..."}),
    ("translator", {"text": "Hello world", "target_lang": "Hindi"}),
    ("notes", {"text": "Explain HTTP, REST, and JSON APIs."}),
    ("research", {"topic": "benefits of learning Python"}),
    ("code-generator", {"description": "simple Flask hello world API", "language": "python"}),
    ("image-generator", {"prompt": "A futuristic city at night", "style": "digital-art"}),
    ("resume", {"role": "Junior Python Developer", "experience": "Fresher", "skills": ["Python", "Flask", "Git"]}),
    ("seo-optimizer", {"text": "Short paragraph about AI tools hub website.", "keywords": ["AI tools", "productivity"], "tone": "friendly"}),
    ("social-media-writer", {"platform": "Twitter", "topic": "launching my AI Tools Hub", "tone": "excited"}),
    ("email-writer", {"purpose": "requesting internship opportunity", "tone": "professional", "details": "I am a BTech CSE student."}),
    ("blog-writer", {"topic": "Why every developer should learn Python", "length": "medium"}),
    ("pdf-tools", {"text": "Sample PDF extracted text about AI.", "action": "summarize"}),
    ("voice-to-text", {"text": "this is a raw transcription without punctuation"}),
    ("text-to-voice", {"text": "Welcome to AI Tools Hub", "style": "narration"}),
]


def main():
    bypass = os.getenv("DEV_AUTH_BYPASS", "0") == "1"
    if not bypass:
        print("[warn] DEV_AUTH_BYPASS not enabled; protected endpoints may 401")
    with app.test_client() as client:
        for name, payload in TESTS:
            url = f"/api/{name}/"
            try:
                resp = client.post(url, json=payload)
                status = resp.status_code
                error_code = None
                ok = None
                data = None
                try:
                    data = resp.get_json()
                except Exception:
                    data = None
                if isinstance(data, dict):
                    ok = data.get("ok")
                    err = data.get("error")
                    if ok is False:
                        if isinstance(err, dict):
                            error_code = err.get("code") or "unknown_error"
                        else:
                            error_code = "unknown_error"
                else:
                    error_code = "non_json_response" if status >= 400 else None
                print(f"{name}: status={status}, ok={ok}, error={error_code}")
            except Exception as e:
                print(f"{name}: exception={e}")


if __name__ == "__main__":
    main()
