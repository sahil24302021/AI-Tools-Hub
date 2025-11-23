from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def resume():
    try:
        data = request.get_json(silent=True) or {}
        role = (data.get("role") or "").strip()
        experience = (data.get("experience") or "").strip()
        skills = data.get("skills") or []
        if not role:
            return current_app.success({"resume": ""})  # type: ignore[attr-defined]
        skills_str = ", ".join([s for s in skills if isinstance(s, str)])
        resume_text = generate_text(f"Create a professional resume. Role: {role}. Experience: {experience}. Skills: {skills_str}").strip()
        return current_app.success({"resume": resume_text})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Resume error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
