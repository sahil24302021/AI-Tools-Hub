from datetime import datetime, timezone
from typing import Any, Dict, List
from flask import Blueprint, request, current_app
from auth import require_user

usage_bp = Blueprint("usage", __name__)
_usage_log: List[Dict[str, Any]] = []

def log_usage(tool: str, user: str | None, input_data: Any, result_data: Any) -> None:
    try:
        _usage_log.append({
            "id": f"{tool}-{len(_usage_log)+1}",
            "tool": tool,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user": user,
            "input": input_data,
            "result": result_data,
        })
    except Exception as e:
        current_app.logger.warning("log_usage failed: %s", e)

@usage_bp.route("/", methods=["GET", "OPTIONS"])
@require_user
def usage():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        return current_app.success({"usage": _usage_log})  # type: ignore[attr-defined]
    except Exception as e:
        return current_app.fail("internal_error", str(e), 500)  # type: ignore[attr-defined]
