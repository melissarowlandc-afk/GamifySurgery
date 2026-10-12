"""Append only the authorized v6f progress line and preserve the current prefix."""
import hashlib
import json
from pathlib import Path

repo = Path(__file__).resolve().parents[3]
plan = repo / "docs/execplans/character-gapfill-v6-20261007.md"
validation = json.loads((repo / "artifacts/character-statics/inspector-v6f/validation/worker-validation.json").read_text(encoding="utf-8"))
assert validation["status"] == "PASS"
assert len(validation["results"]) == 8
assert all(r["exitCode"] == 0 for r in validation["results"])
line = "- 2026-10-11 v6f inspection-agent art worker: inspector-v6f.001-.010 complete (10 identities, 80 poses; 5 women/5 men, two glasses); 30 built-in native outputs and 10 targeted clipboard/office-shoe corrections preserved; 40 authored contacts and 10 authentic Front Desk chair proofs; all 326 catalog identities/3,260 comparisons plus 45 inspector pairs checked, zero flags; eight CLI validators PASS. Gallery: artifacts/character-statics/inspector-v6f/review/index.html; handoff: tools/character-mapping/inspector-v6f/HANDOFF.md. Rear seated clipboard edges and far-side grips require manager visual acceptance; browser launch blocked by spawn EPERM (manager rerun pending). Art-only, runtimeReady=false, no runtime edits or Git; LOCAL ONLY, no GitHub backup."
before = plan.read_bytes()
assert not before.startswith(b"\xef\xbb\xbf") and b"\r" not in before
before.decode("utf-8")
assert line.encode("utf-8") not in before, "progress line already appended"
addition = ("" if before.endswith(b"\n") else "\n") + "\n" + line + "\n"
addition_bytes = addition.encode("utf-8")
assert plan.read_bytes() == before, "concurrent plan change; reread before append"
with plan.open("ab") as stream:
    stream.write(addition_bytes)
after = plan.read_bytes()
assert after == before + addition_bytes, "concurrent append; inspect without reverting"
digest = lambda b: hashlib.sha256(b).hexdigest()
receipt = {"operation": "append-only-authorized-v6f-progress-line", "path": plan.relative_to(repo).as_posix(),
           "preservedPrefixBytes": len(before), "preservedPrefixSha256": digest(before),
           "appendedBytes": len(addition_bytes), "appendedSha256": digest(addition_bytes),
           "finalSha256": digest(after), "line": line, "utf8NoBomLf": True}
output = Path(__file__).resolve().parent / "analysis/plan-progress-append-receipt.json"
output.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({"status": "PASS", "operation": receipt["operation"], "preservedPrefixBytes": len(before), "appendedBytes": len(addition_bytes)}, separators=(",", ":")))
