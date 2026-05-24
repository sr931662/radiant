from io import BytesIO


def generate_donation_receipt_pdf(donation) -> bytes:
    """
    Generate a simple donation receipt PDF.
    For production, use WeasyPrint or ReportLab to create a proper design.
    Returns PDF bytes.
    """
    # Placeholder implementation – replace with actual PDF generation
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, f"Donation Receipt")
    c.drawString(100, 730, f"Donation ID: {donation.id}")
    c.drawString(100, 710, f"Amount: {donation.amount} {donation.currency}")
    c.drawString(100, 690, f"Date: {donation.created_at}")
    c.drawString(100, 670, "Thank you for your generous contribution!")
    c.save()
    return buffer.getvalue()


def generate_certificate_pdf(certificate, user_name: str) -> bytes:
    """
    Generate a certificate PDF for FDP/Course/Membership completion.
    """
    from reportlab.lib.pagesizes import landscape, A4
    from reportlab.pdfgen import canvas

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    c.drawString(100, 400, f"Certificate of Completion")
    c.drawString(100, 380, f"This is to certify that {user_name}")
    c.drawString(100, 360, f"has successfully completed the {certificate.type}")
    c.drawString(100, 340, f"Certificate ID: {certificate.unique_id}")
    c.drawString(100, 320, f"Issued on: {certificate.issued_at}")
    c.save()
    return buffer.getvalue()