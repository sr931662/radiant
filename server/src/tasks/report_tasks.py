import csv
import io
from src.core.celery_app import celery_app


@celery_app.task(name="generate_export_csv")
def generate_export_csv_task(model_name: str, filters: dict | None = None):
    """
    Generate a CSV export for any model (e.g., Donation, Membership).
    Saves the CSV to Cloudinary / S3 and returns the URL.
    """
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_export_async(model_name, filters))


async def _export_async(model_name: str, filters: dict | None = None):
    from src.core.database import async_session_factory
    from src.models import Donation, Membership
    from src.services.file_upload_service import FileUploadService

    model_map = {
        "donation": Donation,
        "membership": Membership,
    }
    model = model_map.get(model_name)
    if not model:
        raise ValueError(f"Unknown model: {model_name}")

    async with async_session_factory() as session:
        from sqlalchemy import select
        query = select(model).where(model.deleted_at == None)
        if filters:
            for key, value in filters.items():
                if hasattr(model, key):
                    query = query.where(getattr(model, key) == value)
        result = await session.execute(query)
        records = result.scalars().all()

    # Generate CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    if records:
        # Write header
        columns = [col.name for col in model.__table__.columns]
        writer.writerow(columns)
        for record in records:
            writer.writerow([getattr(record, col) for col in columns])

    csv_bytes = output.getvalue().encode("utf-8")
    # Upload via FileUploadService (simplified)
    import cloudinary.uploader
    upload_result = cloudinary.uploader.upload(
        csv_bytes,
        resource_type="raw",
        folder="exports",
        public_id=f"{model_name}_export",
        format="csv",
    )
    return upload_result["secure_url"]