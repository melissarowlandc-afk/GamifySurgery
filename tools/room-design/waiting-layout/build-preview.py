from pathlib import Path
import base64

HERE = Path(__file__).resolve().parent
template = (HERE / "waiting-layout.template.html").read_text(encoding="utf-8")
script = (HERE / "waiting-preview.js").read_text(encoding="utf-8")
assets = {
    "__ORIGINAL_ATLAS__": HERE / "waiting-assets.webp",
    "__WEST_ATLAS__": HERE / "waiting-west-assets.webp",
    "__ACTOR_ASSET__": HERE / "waiting-actor.webp",
}
for marker, path in assets.items():
    if not path.exists():
        raise FileNotFoundError(path)
    script = script.replace(marker, base64.b64encode(path.read_bytes()).decode("ascii"))
output = template.replace("__WAITING_SCRIPT__", script)
(HERE / "waiting-layout.html").write_text(output, encoding="utf-8")
print(f"wrote {len(output.encode('utf-8'))} bytes")
