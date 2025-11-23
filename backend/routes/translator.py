from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

translator_bp = Blueprint("translator", __name__)

@translator_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def translator():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("prompt") or "").strip()
        target_lang = (data.get("target_lang") or data.get("targetLanguage") or "English").strip()
        if not text:
            return current_app.success({"translated_text": ""})  # type: ignore[attr-defined]
        translated = generate_text(f"Translate into {target_lang}:\n\n{text}").strip()
        return current_app.success({"translated_text": translated})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Translator error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
