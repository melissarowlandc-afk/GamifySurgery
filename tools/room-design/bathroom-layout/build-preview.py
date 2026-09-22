from pathlib import Path
import base64

HERE = Path(__file__).resolve().parent
template = (HERE / "bathroom-layout.template.html").read_text(encoding="utf-8")
script = (HERE / "bathroom-preview.js").read_text(encoding="utf-8")
asset = base64.b64encode((HERE / "bathroom-assets.webp").read_bytes()).decode("ascii")
output = template.replace("__BATHROOM_SCRIPT__", script.replace("__BATHROOM_ATLAS__", asset))
(HERE / "bathroom-layout.html").write_text(output, encoding="utf-8")
print(f"wrote {len(output.encode('utf-8'))} bytes")
