ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB


def validate_file_size(file_size: int, max_size: int = MAX_UPLOAD_SIZE) -> bool:
    return file_size <= max_size


def validate_file_type(content_type: str, allowed_types: list[str]) -> bool:
    return content_type in allowed_types