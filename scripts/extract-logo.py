import base64
import json
import re
from pathlib import Path

html_path = Path(r"c:\Users\1stop\Downloads\Display ID Card.html")
out_path = Path(r"c:\Users\1stop\Documents\apps\DISPLAY APP\public\1stop-logo.png")

content = html_path.read_text(encoding="utf-8")

for line in content.splitlines():
    if line.startswith("{") and "9ab9afa6" in line:
        manifest = json.loads(line.rstrip(","))
        entry = manifest["9ab9afa6-26bd-4732-87e5-76a78be0a4f8"]
        data = base64.b64decode(entry["data"])
        out_path.write_bytes(data)
        print(f"Wrote {out_path} ({len(data)} bytes)")
        break
