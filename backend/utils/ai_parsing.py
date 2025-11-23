import json
import re

def safe_json_parse(raw: str):
    """Attempt to parse JSON from raw model output; fallback to {"output": raw}."""
    if not isinstance(raw, str) or not raw.strip():
        return {"output": ""}
    # Direct parse
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, (dict, list)):
            return parsed
    except Exception:
        pass
    # Regex block extraction
    match = re.search(r"\{[\s\S]*\}" , raw)
    if match:
        block = match.group(0)
        try:
            parsed = json.loads(block)
            if isinstance(parsed, (dict, list)):
                return parsed
        except Exception:
            pass
    return {"output": raw.strip()}

def force_object(parsed):
    if isinstance(parsed, dict):
        return parsed
    if isinstance(parsed, list):
        return {"output": parsed}
    return {"output": str(parsed)}
