import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from src.config import settings


class FileUploadService:
    @staticmethod
    async def upload_pdf(file: UploadFile) -> str:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            folder=settings.cloudinary_folder,
            allowed_formats=["pdf"],
        )
        return result["secure_url"]

    @staticmethod
    async def upload_image(file: UploadFile) -> str:
        result = cloudinary.uploader.upload(
            file.file,
            folder=settings.cloudinary_folder,
            transformation=[{"quality": "auto", "fetch_format": "auto"}],
        )
        return result["secure_url"]

    @staticmethod
    async def upload_gallery_media(file: UploadFile, file_type: str) -> str:
        resource_type = "video" if file_type == "VIDEO" else "image"
        result = cloudinary.uploader.upload(
            file.file,
            resource_type=resource_type,
            folder=settings.cloudinary_folder,
        )
        return result["secure_url"]

    @staticmethod
    async def upload_receipt(donation) -> str:
        # Generate PDF receipt and upload
        from src.utils.pdf_generator import generate_donation_receipt_pdf
        pdf_bytes = generate_donation_receipt_pdf(donation)
        upload_result = cloudinary.uploader.upload(
            pdf_bytes,
            resource_type="raw",
            folder=f"{settings.cloudinary_folder}/receipts",
            public_id=f"donation_{donation.id}",
            format="pdf",
        )
        return upload_result["secure_url"]