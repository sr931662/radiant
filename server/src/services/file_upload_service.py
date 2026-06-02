import asyncio
import functools

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from src.config import settings


def _run_sync(func, *args, **kwargs):
    """Run a blocking Cloudinary call in a thread pool so the event loop isn't blocked."""
    loop = asyncio.get_event_loop()
    return loop.run_in_executor(None, functools.partial(func, *args, **kwargs))


class FileUploadService:
    @staticmethod
    async def upload_pdf(file: UploadFile) -> str:
        result = await _run_sync(
            cloudinary.uploader.upload,
            file.file,
            resource_type="raw",
            folder=settings.cloudinary_folder,
            allowed_formats=["pdf"],
        )
        return result["secure_url"]

    @staticmethod
    async def upload_image(file: UploadFile) -> str:
        result = await _run_sync(
            cloudinary.uploader.upload,
            file.file,
            folder=settings.cloudinary_folder,
            transformation=[{"quality": "auto", "fetch_format": "auto"}],
        )
        return result["secure_url"]

    @staticmethod
    async def upload_gallery_media(file: UploadFile, file_type: str) -> str:
        resource_type = "video" if file_type == "VIDEO" else "image"
        result = await _run_sync(
            cloudinary.uploader.upload,
            file.file,
            resource_type=resource_type,
            folder=settings.cloudinary_folder,
        )
        return result["secure_url"]

    @staticmethod
    async def upload_receipt(donation) -> str:
        from src.utils.pdf_generator import generate_donation_receipt_pdf
        pdf_bytes = generate_donation_receipt_pdf(donation)
        result = await _run_sync(
            cloudinary.uploader.upload,
            pdf_bytes,
            resource_type="raw",
            folder=f"{settings.cloudinary_folder}/receipts",
            public_id=f"donation_{donation.id}",
            format="pdf",
        )
        return result["secure_url"]
