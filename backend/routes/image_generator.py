from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

image_generator_bp = Blueprint("image_generator", __name__)

@image_generator_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def image_generator():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        prompt = (data.get("prompt") or data.get("description") or "").strip()
        style = (data.get("style") or "digital-art").strip()
        if not prompt:
            return current_app.success({"image_prompt": ""})  # type: ignore[attr-defined]
        refined = generate_text(f"Refine into a detailed generative image prompt (style: {style}): {prompt}").strip()
        return current_app.success({"image_prompt": refined})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Image generator error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
