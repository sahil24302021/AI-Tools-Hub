from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

summarizer_bp = Blueprint("summarizer", __name__)

@summarizer_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def summarizer():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("content") or data.get("prompt") or "").strip()
        if not text:
            return current_app.success({"summary": ""})  # type: ignore[attr-defined]
        summary = generate_text("Summarize clearly and concisely:\n\n" + text).strip()
        return current_app.success({"summary": summary})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Summarizer error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
