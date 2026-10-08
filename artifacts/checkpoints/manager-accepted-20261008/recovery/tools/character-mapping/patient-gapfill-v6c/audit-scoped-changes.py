"""Read-only filesystem diff against the immutable per-batch intake; no Git."""
import difflib
import hashlib
import json
from pathlib import Path

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
root = repo / "artifacts/character-statics" / tool.name
baseline = json.loads((root / "runtime-integration-baseline/manifest.json").read_text(encoding="utf-8"))
allowed = {
    "packages/game-domain/src/characterStillCatalog.ts",
    "packages/game-domain/src/characterStillCatalog.test.ts",
    "apps/player/src/art/characterStillRegistry.generated.json",
    "apps/player/src/art/characterStillRegistry.ts",
    "apps/player/src/art/characterStillRegistry.test.ts",
    "tools/character-mapping/gs026-runtime-stills/provenance-manifest.json",
}
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

patches, changes = [], []
for item in baseline["files"]:
    before, after = repo / item["copiedTo"], repo / item["path"]
    assert digest(before) == item["sha256"], "immutable snapshot changed"
    after_hash = digest(after)
    if after_hash == item["sha256"]:
        continue
    assert item["path"] in allowed, "out-of-lane mutation: " + item["path"]
    diff = list(difflib.unified_diff(
        before.read_bytes().decode("utf-8").splitlines(keepends=True),
        after.read_bytes().decode("utf-8").splitlines(keepends=True),
        fromfile="before/" + item["path"], tofile="after/" + item["path"],
    ))
    patches.extend(diff)
    changes.append({"path": item["path"], "beforeSha256": item["sha256"], "afterSha256": after_hash,
                    "addedLines": sum(line.startswith("+") and not line.startswith("+++") for line in diff),
                    "removedLines": sum(line.startswith("-") and not line.startswith("---") for line in diff)})
for item in baseline["approvedInputs"]:
    assert digest(repo / item["path"]) == item["sha256"], "frozen source/control/art changed: " + item["path"]
sources = json.loads((repo / "artifacts/character-statics/patient-gapfill-v6c/validation/pre-integration-suite-source-hashes.json").read_text(encoding="utf-8"))
drift = [{**item, "afterSha256": digest(repo / item["path"])} for item in sources["inputs"] if digest(repo / item["path"]) != item["sha256"]]
result = {"status": "PASS", "batch": tool.name, "immutableSnapshots": len(baseline["files"]),
          "unchangedSourceControlArtHashes": len(baseline["approvedInputs"]), "changedSnapshotPaths": changes,
          "suiteSourceDrift": drift, "unrelatedConcurrentSuiteChanges": [item for item in drift if item["path"] not in allowed],
          "note": "Concurrent reducer/UI changes are recorded and preserved. No Git commands or out-of-lane edits."}
(root / "validation/scoped-source-diff.patch").write_bytes("".join(patches).encode("utf-8"))
(root / "validation/scoped-change-report.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({"status": "PASS", "batch": tool.name, "changedSnapshotPaths": len(changes), "unchangedSourceControlArtHashes": len(baseline["approvedInputs"]), "suiteSourceDrift": len(drift), "unrelatedConcurrentSuiteChanges": len(result["unrelatedConcurrentSuiteChanges"])}))
