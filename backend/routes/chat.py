from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def chat():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        # Prefer explicit prompt/message
        prompt = (data.get("prompt") or data.get("message") or "").strip()
        messages = data.get("messages")
        if not prompt and isinstance(messages, list):
            lines = []
            for m in messages:
                if isinstance(m, dict):
                    content = (m.get("content") or "").strip()
                    if content:
                        lines.append(content)
            prompt = "\n".join(lines).strip()
        if not prompt:
            return current_app.success({"message": ""})  # type: ignore[attr-defined]
        reply = generate_text(prompt).strip()
        return current_app.success({"message": reply})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Chat error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
