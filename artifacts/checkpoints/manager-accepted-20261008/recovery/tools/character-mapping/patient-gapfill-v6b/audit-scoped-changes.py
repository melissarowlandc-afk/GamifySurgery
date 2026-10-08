"""Read-only filesystem diff against the immutable pre-edit v6b baseline.

Writes review artifacts only; never invokes Git or changes a source/art file.
"""
import difflib
import hashlib
import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
ROOT = REPO / "artifacts/character-statics/patient-gapfill-v6b"
BASELINE = json.loads((ROOT / "runtime-integration-baseline/manifest.json").read_text(encoding="utf-8"))
ALLOWED = {
    "packages/game-domain/src/characterStillCatalog.ts",
    "packages/game-domain/src/characterStillCatalog.test.ts",
    "apps/player/src/art/characterStillRegistry.generated.json",
    "apps/player/src/art/characterStillRegistry.ts",
    "apps/player/src/art/characterStillRegistry.test.ts",
    "tools/character-mapping/gs026-runtime-stills/provenance-manifest.json",
    *["tools/character-mapping/patient-gapfill-v6b/" + name for name in (
        "runtime-baseline.mjs", "validate-roster.mjs", "validate-placement-qa.mjs",
        "validate-worker-review.mjs", "validate-all-catalog-comparison.mjs", "README.md",
    )],
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

patches, changes = [], []
for item in BASELINE["files"]:
    snapshot, live = REPO / item["copiedTo"], REPO / item["path"]
    assert digest(snapshot) == item["sha256"], "immutable snapshot changed"
    after = digest(live)
    if after == item["sha256"]:
        continue
    assert item["path"] in ALLOWED, "unexpected mutation: " + item["path"]
    diff = list(difflib.unified_diff(
        snapshot.read_text(encoding="utf-8").splitlines(keepends=True),
        live.read_text(encoding="utf-8").splitlines(keepends=True),
        fromfile="before/" + item["path"], tofile="after/" + item["path"],
    ))
    patches.extend(diff)
    changes.append({"path": item["path"], "beforeSha256": item["sha256"], "afterSha256": after,
                    "addedLines": sum(line.startswith("+") and not line.startswith("+++") for line in diff),
                    "removedLines": sum(line.startswith("-") and not line.startswith("---") for line in diff)})
for item in BASELINE["approvedInputs"]:
    assert digest(REPO / item["path"]) == item["sha256"], "source/control/art changed: " + item["path"]

sources = json.loads((ROOT / "validation/pre-integration-suite-source-hashes.json").read_text(encoding="utf-8"))
suite_drift = [{**item, "afterSha256": digest(REPO / item["path"])} for item in sources["inputs"]
               if digest(REPO / item["path"]) != item["sha256"]]
result = {"status": "PASS", "immutableSnapshots": len(BASELINE["files"]),
          "unchangedSourceControlArtHashes": len(BASELINE["approvedInputs"]),
          "changedSnapshotPaths": changes, "suiteSourceDrift": suite_drift,
          "note": "Unrelated concurrent suite-source changes are recorded, not reverted. Runtime preservation is checked separately by validate-runtime-integration.mjs."}
(ROOT / "validation/scoped-source-diff.patch").write_text("".join(patches), encoding="utf-8", newline="\n")
(ROOT / "validation/scoped-change-report.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({"status": "PASS", "changedSnapshotPaths": len(changes),
                  "unchangedSourceControlArtHashes": len(BASELINE["approvedInputs"]), "suiteSourceDrift": len(suite_drift)}))
