import json
import re

with open(r"c:\Users\1stop\Downloads\Display ID Card.html", "r", encoding="utf-8") as f:
    content = f.read()

for line in content.splitlines():
    if line.startswith('"<!DOCTYPE'):
        html = json.loads("[" + line.rstrip(",") + "]")[0]
        text = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.S)
        text = re.sub(r"<[^>]+>", "\n", text)
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        print("TEXT:")
        print("\n".join(lines[:50]))
        colors = sorted(set(re.findall(r"#[0-9a-fA-F]{3,8}", html[:200000])))
        print("\nCOLORS:", colors[:30])
        sizes = re.findall(r'width:\s*(\d+)px|height:\s*(\d+)px', html[:50000])
        print("SIZES sample:", sizes[:10])
        # save extracted html snippet
        with open("card-extract.html", "w", encoding="utf-8") as out:
            out.write(html[:50000])
        break
