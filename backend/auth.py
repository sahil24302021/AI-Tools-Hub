import os
from functools import wraps
from typing import Any, Dict, Optional

import jwt
from flask import g, current_app, request

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
DEV_AUTH_BYPASS = os.getenv("DEV_AUTH_BYPASS", "0") == "1" or os.getenv("FLASK_ENV") == "development"


class AuthError(Exception):
    """Custom auth error."""


def _get_bearer_token(auth_header: Optional[str]) -> Optional[str]:
    if not auth_header:
        return None
    parts = auth_header.split()
    if len(parts) != 2:
        return None
    if parts[0].lower() != "bearer":
        return None
    return parts[1]


def verify_supabase_token(auth_header: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Verify Supabase JWT using HS256 and SUPABASE_JWT_SECRET.

    If valid, attaches decoded token to g.user and returns it.
    If invalid, clears g.user and returns None.
    """
    token = _get_bearer_token(auth_header)
    g.user = None

    if not token:
        return None

    if not SUPABASE_JWT_SECRET:
        # If secret is not configured, treat as no auth.
        current_app.logger.warning("SUPABASE_JWT_SECRET not set")
        return None

    try:
        decoded = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        g.user = decoded
        return decoded
    except jwt.ExpiredSignatureError:
        current_app.logger.info("JWT expired")
    except jwt.InvalidTokenError as e:
        current_app.logger.info("Invalid JWT: %s", str(e))

    g.user = None
    return None


def require_user(f):
    """Decorator to enforce authenticated user.

    Rules:
    - OPTIONS always passes (CORS preflight)
    - If no valid JWT, allow ONLY for chat, quiz, vision endpoints (dev allowance)
    - Otherwise return standardized auth error envelope
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        from flask import current_app, request

        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization")
        user = verify_supabase_token(auth_header)

        if user:
            return f(*args, **kwargs)

        # No valid user
        if DEV_AUTH_BYPASS:
            # Attach dummy user in dev bypass mode for ALL endpoints
            g.user = {"id": "dev_anon", "email": None}
            return f(*args, **kwargs)

        # Production strict mode: allow only chat/quiz/vision dev exceptions? (Spec now wants prod strict for ALL)
        return current_app.fail("unauthorized", "Authentication required", 401)  # type: ignore[attr-defined]
    return wrapper

