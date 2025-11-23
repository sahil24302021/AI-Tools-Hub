from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

code_generator_bp = Blueprint("code_generator", __name__)

@code_generator_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def code_generator():
    try:
        data = request.get_json(silent=True) or {}
        description = (data.get("description") or data.get("prompt") or "").strip()
        language = (data.get("language") or "python").strip()
        if not description:
            return current_app.success({"code": ""})  # type: ignore[attr-defined]
        code = generate_text(f"Write {language} code only (include helpful comments) for: {description}").strip()
        return current_app.success({"code": code})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Code generator error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
