"""Create v6d's matching new integration tools; never edits generation tools."""
from pathlib import Path

source = Path(__file__).resolve().parent
destination = source.parent / "staff-gapfill-v6d"
text = (source / "runtime-contract.mjs").read_text(encoding="utf-8")
substitutions = [
    ("export const batch = 'patient-gapfill-v6c';", "export const batch = 'staff-gapfill-v6d';"),
    ("export const cohort = 'patientGapfillV6c';", "export const cohort = 'staffGapfillV6d';"),
    ("priorCounts = Object.freeze({ identities: 285, cardinalPoses: 2280, clipboardPoses: 30, assets: 2310 })", "priorCounts = Object.freeze({ identities: 304, cardinalPoses: 2432, clipboardPoses: 30, assets: 2462 })"),
    ("resultingCounts = Object.freeze({ identities: 304, cardinalPoses: 2432, clipboardPoses: 30, assets: 2462 })", "resultingCounts = Object.freeze({ identities: 318, cardinalPoses: 2544, clipboardPoses: 30, assets: 2574 })"),
    ("priorPatientCount = 160, resultingPatientCount = 179, addedIdentities = 19, addedAssets = 152", "priorPatientCount = 179, resultingPatientCount = 179, addedIdentities = 14, addedAssets = 112"),
    ("export const successor = 'staff-gapfill-v6d';", "export const successor = null;"),
]
for old, new in substitutions:
    assert text.count(old) == 1, old
    text = text.replace(old, new)
target = destination / "runtime-contract.mjs"
assert not target.exists(), "new-tool setup refuses overwrite"
target.write_text(text, encoding="utf-8", newline="\n")
for name in ["bind-owner-approval.mjs", "capture-integration-baseline.mjs", "integration-validator-hooks.mjs", "validate-approved-batch.mjs"]:
    target = destination / name
    assert not target.exists(), "new-tool setup refuses overwrite"
    target.write_bytes((source / name).read_bytes())
print("Created separate v6d integration tools; historical files preserved")
