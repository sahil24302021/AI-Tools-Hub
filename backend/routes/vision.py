from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import image_to_text, generate_text

vision_bp = Blueprint("vision", __name__)

@vision_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def vision():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        if request.files:
            f = request.files.get("file")
            if not f:
                return current_app.success({"text": ""})  # type: ignore[attr-defined]
            description = image_to_text(f.read()).strip()
            return current_app.success({"text": description})  # type: ignore[attr-defined]
        data = request.get_json(silent=True) or {}
        prompt = (data.get("prompt") or "").strip()
        if not prompt:
            return current_app.success({"text": ""})  # type: ignore[attr-defined]
        text = generate_text("Describe in detail: " + prompt).strip()
        return current_app.success({"text": text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Vision error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
