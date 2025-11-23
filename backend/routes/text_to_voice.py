from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

text_to_voice_bp = Blueprint("text_to_voice", __name__)

@text_to_voice_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def text_to_voice():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("prompt") or "").strip()
        style = (data.get("style") or data.get("voice_style") or "narration").strip()
        if not text:
            return current_app.success({"voice_script": ""})  # type: ignore[attr-defined]
        script = generate_text(f"Rewrite as natural spoken script (voice style: {style}):\n\n{text}").strip()
        return current_app.success({"voice_script": script})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Text to voice error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
