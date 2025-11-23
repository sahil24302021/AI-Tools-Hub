from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

pdf_tools_bp = Blueprint("pdf_tools", __name__)

@pdf_tools_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def pdf_tools():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or data.get("content") or data.get("prompt") or "").strip()
        action = (data.get("action") or "summarize").strip()
        if not text:
            return current_app.success({"text": ""})  # type: ignore[attr-defined]
        if action == "summarize":
            prompt = "Summarize this PDF text:\n\n" + text
        elif action == "extract_topics":
            prompt = "Extract key topics and headings from this PDF text:\n\n" + text
        else:
            prompt = "Process this PDF text helpfully:\n\n" + text
        output = generate_text(prompt).strip()
        return current_app.success({"text": output})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("PDF tools error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
