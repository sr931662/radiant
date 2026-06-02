import hmac
import hashlib

import razorpay

from src.config import settings

razorpay_client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


class PaymentService:
    @staticmethod
    async def create_razorpay_order(amount: float, receipt: str) -> dict:
        amount_in_paise = int(amount * 100)
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,
        }
        order = razorpay_client.order.create(data=order_data)  # type: ignore[attr-defined]
        return order

    @staticmethod
    def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
        msg = f"{order_id}|{payment_id}"
        generated = hmac.new(
            settings.razorpay_key_secret.encode(),
            msg.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(generated, signature)

    @staticmethod
    def verify_webhook_signature(raw_body: bytes, signature: str) -> bool:
        """Verify Razorpay webhook using the raw request body bytes (NOT re-serialized JSON)."""
        secret = settings.razorpay_webhook_secret
        generated = hmac.new(
            secret.encode(),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(generated, signature)
