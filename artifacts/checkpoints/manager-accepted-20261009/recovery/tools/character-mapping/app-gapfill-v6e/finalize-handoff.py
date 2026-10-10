"""One-time, append-only authorized program progress and owned-lane inventory."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

repo = Path(__file__).resolve().parents[3]
tool = repo / "tools/character-mapping/app-gapfill-v6e"
root = repo / "artifacts/character-statics/app-gapfill-v6e"
plan = repo / "docs/execplans/character-gapfill-v6-20261007.md"
receipt_file = tool / "analysis/plan-progress-append-receipt.json"
validation = json.loads((root / "validation/worker-validation.json").read_text(encoding="utf-8"))
assert validation["status"] == "PASS"
assert len(validation["results"]) == 7
assert all(result["exitCode"] == 0 and result["records"][0]["status"] == "PASS" for result in validation["results"])
assert (tool / "HANDOFF.md").read_text(encoding="utf-8").endswith("```\n")

def sha(data):
    return hashlib.sha256(data).hexdigest()

def relative(path):
    return path.relative_to(repo).as_posix()

def write_json(path, value):
    path.write_bytes((json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))

line = (
    "- 2026-10-09: v6e APP extension generation/packaging complete: eight APP candidates "
    "(`app-gapfill-v6e.001`-`.008`), 64 transparent standing/seated S/E/W/N poses at 160x320, "
    "four women and four men aged 28-60, two glasses identities. Built-in image generation used "
    "16 initial calls with no corrections; originals and exact receipts preserved. Seven CLI checks "
    "PASS: roster/pose/alpha/anchor/hash, 32 authored contacts, eight authentic chair proofs, "
    "2544 all-catalog comparisons against 318 identities, 16 approved-APP comparisons, all 28 "
    "within-batch pairs, 16 static gallery pages, 22 module syntax checks and UTF-8/no-BOM/LF. "
    "Zero near-duplicate flags. Existing 318 identities/2574 assets/179 patient designs and accepted "
    "native art preserved. Gallery: `artifacts/character-statics/app-gapfill-v6e/review/index.html`; "
    "two-approved-on-top/new-eight-below sheet: `review/manager/approved-apps-top-new-eight-below.png` "
    "under that artifact root. Exact output: `artifacts/character-statics/app-gapfill-v6e/validation/worker-validation.txt`. "
    "Handoff and style concerns: `tools/character-mapping/app-gapfill-v6e/HANDOFF.md`. Manager visual/alpha "
    "acceptance and browser validation pending; no runtime integration, Git mutations, installs or web access. "
    "One inadvertent read-only Git status is disclosed in the handoff. Local-only checkpoint; manager owns "
    "the GitHub backup reminder.\n"
)

if receipt_file.exists():
    receipt = json.loads(receipt_file.read_text(encoding="utf-8"))
    current = plan.read_bytes()
    assert sha(current[:receipt["priorBytes"]]) == receipt["priorSha256"], "plan prefix changed since this worker's append"
    assert current.count(line.encode("utf-8")) == 1, "missing or repeated v6e progress line"
else:
    prior = plan.read_bytes()
    prior.decode("utf-8")
    assert line.encode("utf-8") not in prior, "line already exists without this worker's receipt; investigate"
    suffix = (b"" if prior.endswith(b"\n") else b"\n") + line.encode("utf-8")
    with plan.open("ab") as stream:
        stream.write(suffix)
    current = plan.read_bytes()
    assert current.startswith(prior), "existing plan bytes were not preserved"
    assert current.count(line.encode("utf-8")) == 1
    receipt = {
        "schemaVersion": "app-gapfill-v6e-plan-append/v1",
        "appendedAt": datetime.now(timezone.utc).isoformat(),
        "path": relative(plan),
        "priorBytes": len(prior),
        "priorSha256": sha(prior),
        "observedBytesAfter": len(current),
        "observedSha256After": sha(current),
        "appendedLine": line,
        "appendedLineSha256": sha(line.encode("utf-8")),
        "prefixBytesPreserved": True,
        "policy": "Append only; do not normalize the existing shared document or modify any earlier line."
    }
    write_json(receipt_file, receipt)

manifest_file = root / "validation/worker-files-manifest.json"
text_report = root / "validation/final-text-results.json"
exclusions = {manifest_file, text_report}
files = sorted(path for lane in (tool, root) for path in lane.rglob("*") if path.is_file() and path not in exclusions)
records = [{"path": relative(path), "bytes": path.stat().st_size, "sha256": sha(path.read_bytes())} for path in files]
write_json(manifest_file, {
    "schemaVersion": "app-gapfill-v6e-worker-files/v1",
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "ownedLanes": [relative(tool), relative(root)],
    "authorizedSharedWrite": {"path": relative(plan), "receipt": relative(receipt_file)},
    "excludedSelfReports": [relative(path) for path in sorted(exclusions)],
    "fileCount": len(records),
    "bytes": sum(record["bytes"] for record in records),
    "files": records,
    "runtimeReady": False,
    "managerAcceptance": "pending",
    "localOnly": True
})

text_extensions = {".mjs", ".json", ".html", ".txt", ".md", ".py", ".ps1"}
text_files = sorted(path for lane in (tool, root) for path in lane.rglob("*") if path.is_file() and path.suffix in text_extensions and path != text_report)
for path in text_files:
    data = path.read_bytes()
    data.decode("utf-8")
    assert not data.startswith(b"\xef\xbb\xbf"), "BOM: " + relative(path)
    assert b"\r" not in data, "CR line ending: " + relative(path)
write_json(text_report, {
    "status": "PASS",
    "auditedAt": datetime.now(timezone.utc).isoformat(),
    "textFilesAudited": len(text_files),
    "selfReportExcluded": relative(text_report),
    "encoding": "UTF-8 without BOM",
    "lineEndings": "LF",
    "issues": []
})
print(json.dumps({"status": "PASS", "ownedLaneFilesInventoried": len(records), "textFilesAudited": len(text_files), "planPrefixBytesPreserved": True, "progressLineOccurrences": 1, "managerAcceptance": "pending", "runtimeReady": False, "localOnly": True}, separators=(",", ":")))
