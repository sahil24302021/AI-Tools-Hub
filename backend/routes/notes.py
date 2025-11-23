from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

notes_bp = Blueprint("notes", __name__)

@notes_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def notes():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("content") or data.get("prompt") or "").strip()
        if not text:
            return current_app.success({"notes": ""})  # type: ignore[attr-defined]
        notes_text = generate_text("Create structured bullet-point study notes with headings and indentation:\n\n" + text).strip()
        return current_app.success({"notes": notes_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Notes error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
