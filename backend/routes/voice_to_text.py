from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

voice_to_text_bp = Blueprint("voice_to_text", __name__)

@voice_to_text_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def voice_to_text():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        raw = (data.get("prompt") or data.get("text") or "").strip()
        if not raw:
            return current_app.success({"transcript": ""})  # type: ignore[attr-defined]
        transcript = generate_text("Clean and punctuate this raw transcription:\n\n" + raw).strip()
        return current_app.success({"transcript": transcript})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Voice to text error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
