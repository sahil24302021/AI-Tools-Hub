from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

blog_writer_bp = Blueprint("blog_writer", __name__)

@blog_writer_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def blog_writer():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        topic = (data.get("topic") or data.get("prompt") or "").strip()
        length = (data.get("length") or "medium").strip()
        if not topic:
            return current_app.success({"blog": ""})  # type: ignore[attr-defined]
        blog_text = generate_text(f"Write a {length} length blog post on: {topic}. Include intro, clear headed sections, conclusion.").strip()
        return current_app.success({"blog": blog_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Blog writer error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
