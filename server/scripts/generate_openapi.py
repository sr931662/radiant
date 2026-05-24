"""Export OpenAPI spec to openapi.json."""
import json
from src.main import app

spec = app.openapi()
with open("openapi.json", "w") as f:
    json.dump(spec, f, indent=2)

print("OpenAPI spec written to openapi.json")
