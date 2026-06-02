import hmac
import hashlib
import uuid as _uuid

import razorpay

from src.config import settings

_PLACEHOLDER_KEYS = {
    "rzp_test_xxxxxxxxxxxxxxxxxx", "rzp_test_xxxxxxxxx",
    "rzp_live_xxxxxxxxxxxxxxxxxx", "yyyyyyyyyyyyyyyy",
    "yyyyyyyyyyyyyyyyyyyyyyyy", "", None,
}


def _razorpay_configured() -> bool:
    key = settings.razorpay_key_id or ""
    secret = settings.razorpay_key_secret or ""
    return (
        key not in _PLACEHOLDER_KEYS
        and secret not in _PLACEHOLDER_KEYS
        and len(key) > 15
        and len(secret) > 15
    )


# Build client lazily so startup doesn't fail on placeholder creds
_client: razorpay.Client | None = None


def _get_client() -> razorpay.Client:
    global _client
    if _client is None:
        _client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    return _client


class PaymentService:
    @staticmethod
    async def create_razorpay_order(amount: float, receipt: str) -> dict:
        amount_in_paise = int(amount * 100)

        if not _razorpay_configured():
            # Return a realistic-looking demo order — no real API call
            demo_id = f"demo_order_{_uuid.uuid4().hex[:16]}"
            return {
                "id": demo_id,
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": receipt,
                "status": "created",
                "_demo": True,
            }

        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,
        }
        return _get_client().order.create(data=order_data)  # type: ignore[attr-defined]

    @staticmethod
    def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
        """Verify Razorpay payment signature.
        Demo orders (id starts with 'demo_') always pass — no real money involved.
        """
        if order_id.startswith("demo_"):
            return True

        msg = f"{order_id}|{payment_id}"
        generated = hmac.new(
            settings.razorpay_key_secret.encode("utf-8"),
            msg.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        try:
            return hmac.compare_digest(generated, signature)
        except TypeError:
            return False

    @staticmethod
    def verify_webhook_signature(raw_body: bytes, signature: str) -> bool:
        """Verify Razorpay webhook signature."""
        secret = settings.razorpay_webhook_secret
        generated = hmac.new(
            secret.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        try:
            return hmac.compare_digest(generated, signature)
        except TypeError:
            return False
