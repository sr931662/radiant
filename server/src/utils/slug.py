import re
import unicodedata


def generate_slug(title: str) -> str:
    """
    Convert a title into a URL-friendly slug.
    Example: 'Hello World!' -> 'hello-world'
    """
    # Normalize unicode characters
    slug = unicodedata.normalize("NFKD", title)
    # Remove non-ASCII
    slug = slug.encode("ascii", "ignore").decode("ascii")
    # Lowercase
    slug = slug.lower()
    # Replace anything not alphanumeric or hyphen with a hyphen
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")