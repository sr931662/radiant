from fastapi.responses import JSONResponse


def success_response(data=None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "message": message, "data": data}
    )


def error_response(message: str = "Error", error_code: str = "ERROR", status_code: int = 400, details=None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "message": message, "error_code": error_code, "details": details}
    )


def paginated_response(items: list, total: int, page: int, size: int) -> dict:
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size,
    }