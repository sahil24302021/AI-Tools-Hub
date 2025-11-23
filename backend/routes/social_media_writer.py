from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

social_media_writer_bp = Blueprint("social_media_writer", __name__)

@social_media_writer_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def social_media_writer():
    try:
        data = request.get_json(silent=True) or {}
        platform = (data.get("platform") or "").strip()
        topic = (data.get("topic") or data.get("prompt") or "").strip()
        tone = (data.get("tone") or "Neutral").strip()
        if not topic:
            return current_app.success({"post": ""})  # type: ignore[attr-defined]
        prompt = f"Write a concise social media post. Platform: {platform}. Topic: {topic}. Tone: {tone}. Max 50 words."
        post_text = generate_text(prompt).strip()
        return current_app.success({"post": post_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Social Media Writer error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
