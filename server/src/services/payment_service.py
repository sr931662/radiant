import json

import razorpay
import hmac
import hashlib
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
            "payment_capture": 1,  # auto capture
        }
        order = razorpay_client.order.create(data=order_data)  # type: ignore[attr-defined]
        return order

    @staticmethod
    def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
        msg = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            settings.razorpay_key_secret.encode(),
            msg.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(generated_signature, signature)

    @staticmethod
    def verify_webhook_signature(payload: dict, signature: str) -> bool:
        # Webhook secret based verification
        secret = settings.razorpay_webhook_secret
        msg = json.dumps(payload, separators=(",", ":"))
        generated_signature = hmac.new(
            secret.encode(), msg.encode(), hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(generated_signature, signature)