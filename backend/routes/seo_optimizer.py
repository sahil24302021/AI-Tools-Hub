from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

seo_optimizer_bp = Blueprint("seo_optimizer", __name__)

@seo_optimizer_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def seo_optimizer():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("content") or data.get("prompt") or "").strip()
        keywords = data.get("keywords") or []
        tone = (data.get("tone") or "neutral").strip()
        if not text:
            return current_app.success({"seo_text": ""})  # type: ignore[attr-defined]
        keywords_str = ", ".join([k for k in keywords if isinstance(k, str)])
        seo_text = generate_text(f"Rewrite for SEO (tone: {tone}) using keywords: {keywords_str}\n\n{text}").strip()
        return current_app.success({"seo_text": seo_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("SEO optimizer error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
