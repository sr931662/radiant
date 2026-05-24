import qrcode
from io import BytesIO
import base64


def generate_qr_code(data: str) -> str:
    """
    Generate a QR code containing the given data,
    return it as a base64-encoded PNG image string.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # type: ignore[attr-defined]
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, kind="PNG")  # type: ignore[call-arg]
    img_bytes = buffer.getvalue()
    return base64.b64encode(img_bytes).decode("utf-8")