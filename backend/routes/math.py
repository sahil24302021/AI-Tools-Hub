from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text

math_bp = Blueprint("math", __name__)

@math_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def math():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        problem = (data.get("problem") or data.get("prompt") or "").strip()
        if not problem:
            return current_app.success({"steps": "", "answer": ""})  # type: ignore[attr-defined]
        prompt = "Solve this math problem step-by-step. Finish with line 'ANSWER: <final>'.\n\n" + problem
        steps = generate_text(prompt).strip()
        answer = ""
        for line in reversed(steps.splitlines()):
            if line.strip().upper().startswith("ANSWER:"):
                answer = line.split(":", 1)[-1].strip()
                break
        return current_app.success({"steps": steps, "answer": answer or steps})  # type: ignore[attr-defined]
    except Exception as e:
        current_app.logger.exception("Math error")
        return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
