import json
import re
from typing import Any


def repair_json_str(s: str) -> str:
    """
    Very lightweight JSON fixer.

    - Strips whitespace
    - Replaces single quotes with double quotes in a naive way
    - Removes trailing commas before closing } or ]
    If parsing still fails, returns the original string.
    """
    original = s
    s = s.strip()

    # Remove trailing commas: ,} or ,]
    s = re.sub(r",\s*([}\]])", r"\1", s)

    # Replace single quotes around keys/values with double quotes (naive)
    if "'" in s and '"' not in s:
        s = s.replace("'", '"')

    try:
        # If this works, return normalized JSON string
        obj: Any = json.loads(s)
        return json.dumps(obj)
    except Exception:
        return original
