import json, re
from flask import Blueprint, request, current_app
from auth import require_user
from utils.gemini_client import generate_text
from .usage import log_usage

quiz_bp = Blueprint("quiz", __name__)


@quiz_bp.route("/", methods=["POST", "OPTIONS"])
@require_user
def quiz():
  if request.method == "OPTIONS":
    return ("", 204)
  try:
    data = request.get_json(silent=True) or {}
    topic = (data.get("topic") or "").strip()
    count = int(data.get("count", 5))
    difficulty = (data.get("difficulty") or "medium").strip()
    if not topic:
      return current_app.success({"questions": [], "topic": "", "difficulty": difficulty, "raw": None})  # type: ignore[attr-defined]
    prompt = (
      "You are QUIZ_JSON_BOT. Respond ONLY with strict minified JSON. "
      f"Generate EXACTLY {count} multiple-choice questions about '{topic}' (difficulty: {difficulty}). "
      "Return ONLY this JSON schema: {\"questions\":[{\"q\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"answer\":\"A\"}]} . "
      "NO commentary, NO prefixes, NO markdown, NO code fences."
    )
    raw = generate_text(prompt, temperature=0.2).strip()
    parsed = None
    try:
      candidate = json.loads(raw)
      if isinstance(candidate, dict):
        parsed = candidate
    except Exception:
      pass
    if parsed is None:
      match = re.search(r"\{[\s\S]*\}\s*$", raw)
      if match:
        try:
          block_candidate = json.loads(match.group(0))
          if isinstance(block_candidate, dict):
            parsed = block_candidate
        except Exception:
          pass
    questions = []
    if parsed:
      for item in parsed.get("questions", []):
        if isinstance(item, dict):
          q = (item.get("q") or item.get("question") or "").strip()
          opts = item.get("options") if isinstance(item.get("options"), list) else []
          ans = (item.get("answer") or "").strip()
          if q:
            questions.append({"q": q, "options": opts, "answer": ans})
    if not questions:
      # Server-side deterministic fallback synthesis
      base_opts = ["A", "B", "C", "D"]
      questions = []
      for i in range(count):
        q_text = f"Placeholder question {i+1} about {topic}?"
        questions.append({"q": q_text, "options": base_opts, "answer": "A"})
    result = {"questions": questions, "topic": topic, "difficulty": difficulty, "raw": raw if parsed is None else None}
    log_usage("quiz", request.headers.get("Authorization"), data, result)
    return current_app.success(result)  # type: ignore[attr-defined]
  except Exception as e:
    current_app.logger.exception("Quiz error")
    return current_app.fail("server_error", str(e))  # type: ignore[attr-defined]
