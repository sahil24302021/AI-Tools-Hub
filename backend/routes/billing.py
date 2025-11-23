import os
import stripe
from flask import Blueprint, request, current_app
from auth import require_user

billing_bp = Blueprint("billing", __name__)

@billing_bp.route("/create-checkout-session", methods=["POST", "OPTIONS"])
@require_user
def create_checkout_session():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(silent=True) or {}
        price_id = data.get("price_id")
        # No 400 errors: if missing price_id return empty url success
        if not price_id:
            return current_app.success({"url": ""})  # type: ignore[attr-defined]
        frontend_url = current_app.config.get("FRONTEND_URL") or os.getenv("FRONTEND_URL", "http://localhost:5173")
        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{frontend_url}/billing/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/billing/cancel",
        )
        return current_app.success({"url": session.url})  # type: ignore[attr-defined]
    except RuntimeError as e:
        msg = str(e)
        if msg == "rate_limit":
            return current_app.fail("rate_limit", "Gemini rate limit reached", 429)  # type: ignore[attr-defined]
        return current_app.fail("internal_error", msg, 500)  # type: ignore[attr-defined]
    except Exception as e:
        return current_app.fail("internal_error", str(e), 500)  # type: ignore[attr-defined]

@billing_bp.route("/webhook", methods=["POST", "OPTIONS"])
def stripe_webhook():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        payload = request.data
        sig_header = request.headers.get("Stripe-Signature")
        webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
        if not webhook_secret:
            current_app.logger.warning("Webhook secret missing; accepting event")
            return current_app.success({"status": "accepted"})  # type: ignore[attr-defined]
        event = stripe.Webhook.construct_event(payload=payload, sig_header=sig_header, secret=webhook_secret)
        current_app.logger.info("Stripe event: %s", event.get("type"))
        return current_app.success({"status": "ok"})  # type: ignore[attr-defined]
    except Exception as e:
        return current_app.fail("internal_error", str(e), 500)  # type: ignore[attr-defined]
