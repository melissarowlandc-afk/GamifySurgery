"""Apply only the approved v6b count increases and integration assertions.

Uses immutable pre-edit snapshots, preserves line endings, and refuses unrelated
test edits. --check-only prepares and reports the diff without runtime writes.
"""
import json
import sys
from pathlib import Path

repo = Path(__file__).resolve().parents[3]
root = repo / "artifacts/character-statics/patient-gapfill-v6b"
baseline = root / "runtime-integration-baseline"
roster = json.loads((repo / "tools/character-mapping/patient-gapfill-v6b/roster.json").read_text(encoding="utf-8"))


def replace_once(source, before, after):
    assert source.count(before) == 1, "test seam must occur exactly once: " + before
    return source.replace(before, after)


def prepare_domain(before):
    source = before.replace("265", "285")
    source = replace_once(source, "expect(PATIENT_CHARACTER_STILLS).toHaveLength(140);",
                          "expect(PATIENT_CHARACTER_STILLS).toHaveLength(160);")
    # v6a's pool-exhaustion assertions include the appended v6b identities.
    for original, expanded in [("38, total: 25", "38, total: 28"),
                               ("38, total: 18", "38, total: 22"),
                               ("54, total: 29", "54, total: 36"),
                               ("54, total: 25", "54, total: 31")]:
        source = replace_once(source, original, expanded)
    start = source.index('  it("admits the twenty manager-approved v6a patients')
    end = source.index('  it("selects all twelve new radiologists', start)
    addition = source[start:end].replace("v6a", "v6b")
    rows_start = addition.index("    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([")
    rows_end = addition.index("    ]);", rows_start) + len("    ]);")
    rows = "\n".join(f'      ["{item["stableId"]}", "{item["compatibleSexLabel"]}", {item["intendedAge"]}],'
                     for item in roster["identities"])
    expected = "    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([\n" + rows + "\n    ]);"
    addition = addition[:rows_start] + expected + addition[rows_end:]
    addition = replace_once(addition, "38, total: 28, added: 4", "38, total: 28, added: 3")
    addition = replace_once(addition, "38, total: 22, added: 3", "38, total: 22, added: 4")
    return source[:end] + addition + source[end:]


def prepare_player(before):
    source = before.replace("identities: 265, cardinalPoses: 2120, clipboardPoses: 30, assets: 2150",
                            "identities: 285, cardinalPoses: 2280, clipboardPoses: 30, assets: 2310")
    for original, expanded in [("toHaveLength(265)", "toHaveLength(285)"),
                               ("toBe(265)", "toBe(285)"),
                               ("toHaveLength(1060)", "toHaveLength(1140)")]:
        source = replace_once(source, original, expanded)
    source = replace_once(source,
                          'import v6aApproval from "../../../../tools/character-mapping/patient-gapfill-v6a/owner-approval.json";',
                          'import v6aApproval from "../../../../tools/character-mapping/patient-gapfill-v6a/owner-approval.json";\n'
                          'import v6bApproval from "../../../../tools/character-mapping/patient-gapfill-v6b/owner-approval.json";')
    source = replace_once(source, '? "patient-gapfill-v6a"\n                      : "gs026-stills-v1";',
                          '? "patient-gapfill-v6a"\n                      : entry.cohort === "patientGapfillV6b"\n'
                          '                        ? "patient-gapfill-v6b"\n                        : "gs026-stills-v1";')
    start = source.index('  it("renders all twenty v6a patients')
    end = source.index('  it("registers the GS-033 batch', start)
    addition = source[start:end].replace("v6a", "v6b").replace("V6a", "V6b")
    return source[:end] + addition + source[end:]


changes = []
for path, prepare in [("packages/game-domain/src/characterStillCatalog.test.ts", prepare_domain),
                      ("apps/player/src/art/characterStillRegistry.test.ts", prepare_player)]:
    original = (baseline / path).read_bytes().decode("utf-8")
    newline = "\r\n" if "\r\n" in original else "\n"
    expanded = prepare(original.replace("\r\n", "\n")).replace("\n", newline)
    target = repo / path
    current = target.read_bytes().decode("utf-8")
    assert current in (original, expanded), "unrelated concurrent test edit: " + path
    if current == original:
        if "--check-only" not in sys.argv:
            assert (root / "runtime-integration.json").exists(), "promote the runtime before updating assertions"
            target.write_bytes(expanded.encode("utf-8"))
        changes.append(path)
print(json.dumps({"status": "PASS", "checkOnly": "--check-only" in sys.argv,
                  "countTestPaths": changes, "newDomainTests": 2, "newPlayerTests": 1}))
