"""Read-only UTF-8/no-BOM/LF audit of the assigned character-art lanes."""
import json
from pathlib import Path

repo = Path(__file__).resolve().parents[3]
lanes = [repo / "tools/character-mapping/app-gapfill-v6e", repo / "artifacts/character-statics/app-gapfill-v6e"]
extensions = {".mjs", ".json", ".html", ".txt", ".md", ".py", ".ps1"}
files = sorted(path for lane in lanes for path in lane.rglob("*") if path.is_file() and path.suffix in extensions)
issues = []
for path in files:
    data = path.read_bytes()
    reasons = []
    if data.startswith(b"\xef\xbb\xbf"):
        reasons.append("UTF-8 BOM")
    if b"\r" in data:
        reasons.append("CR line ending")
    try:
        data.decode("utf-8")
    except UnicodeDecodeError:
        reasons.append("invalid UTF-8")
    if reasons:
        issues.append({"path": path.relative_to(repo).as_posix(), "issues": reasons})
print(json.dumps({"status": "PASS" if not issues else "FAIL", "textFiles": len(files), "issues": issues}, separators=(",", ":")))
raise SystemExit(bool(issues))
