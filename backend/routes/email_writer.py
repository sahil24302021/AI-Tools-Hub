from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

email_writer_bp = Blueprint("email_writer", __name__)

@email_writer_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def email_writer():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        purpose = (data.get("purpose") or data.get("prompt") or "").strip()
        tone = (data.get("tone") or "professional").strip()
        extra = (data.get("details") or "").strip()
        if not purpose:
            return current_app.success({"email": ""})  # type: ignore[attr-defined]
        email_text = generate_text(f"Write a {tone} email. Purpose: {purpose}. Details: {extra}").strip()
        return current_app.success({"email": email_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Email writer error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
