from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

research_bp = Blueprint("research", __name__)

@research_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def research():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        topic = (data.get("topic") or data.get("prompt") or "").strip()
        if not topic:
            return current_app.success({"research": ""})  # type: ignore[attr-defined]
        research_text = generate_text("Provide structured research summary, key points, pros/cons, and examples about:\n\n" + topic).strip()
        return current_app.success({"research": research_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Research error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
