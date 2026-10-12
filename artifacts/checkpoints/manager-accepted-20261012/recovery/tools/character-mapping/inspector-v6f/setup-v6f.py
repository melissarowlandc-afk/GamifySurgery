"""Non-overwriting v6f art-only scaffold, adapted from the v6e generation lane."""
from pathlib import Path
import hashlib
import json

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
source = tool.parent / "app-gapfill-v6e"
modules = ["build-roster.mjs", "build-placement-qa.mjs", "validate-roster.mjs",
           "validate-placement-qa.mjs", "bind-worker-contacts.mjs", "prepare-request.mjs",
           "save-native.mjs", "prepare-correction.mjs", "save-correction.mjs",
           "check-syntax.mjs", "validate-gallery.mjs", "build-comparison.mjs",
           "validate-all-catalog-comparison.mjs", "bind-worker-review.mjs",
           "validate-worker-review.mjs", "build-qa-atlases.mjs", "build-style-review.mjs",
           "record-worker-validation.mjs", "runtime-baseline.mjs", "validate-text.py"]

def replace(code, old, new):
    assert old in code, f"Missing adaptation seam: {old}"
    return code.replace(old, new)

manifest = []
for name in modules:
    destination = tool / name
    assert not destination.exists(), f"Refusing to overwrite {destination}"
    original = (source / name).read_bytes()
    code = original.decode("utf-8").replace("app-gapfill-v6e", "inspector-v6f")
    code = code.replace("sol-v6e-worker", "sol-v6f-worker").replace("V6E", "V6F").replace("v6e", "v6f")
    code = code.replace("/^00[1-8]$/", "/^0(0[1-9]|10)$/")
    code = code.replace("m.identity.eligibleStaffRoleDefinitionIds[0]", "m.identity.artRole")
    if name == "build-roster.mjs":
        for old, new in [("identities.length, 8", "identities.length, 10"),
                         ("exactly 8 identities", "exactly 10 identities"),
                         ("length: 8 },", "length: 10 },"),
                         ("stableId)).size, 8", "stableId)).size, 10"),
                         ("{staff: 8, patient: 0}", "{staff: 10, patient: 0}"),
                         ("Array.from({length:8},()=>[roles[0]])", "Array.from({length:10},()=>[])"),
                         ("c.intendedAge<=60", "c.intendedAge<=65"),
                         ("length<=2,'at most two glasses identities'", "length<=3,'at most three glasses identities'"),
                         ("Label==='Female').length,4", "Label==='Female').length,5"),
                         ("Label==='Male').length,4", "Label==='Male').length,5"),
                         ("entries.length === 8", "entries.length === 10"),
                         ("expected: 8,", "expected: 10,"),
                         ("Eight gap-fill staff", "Ten inspection-agent"),
                         ("'/8 identities", "'/10 identities"),
                         ("'/64 poses", "'/80 poses")]:
            code = replace(code, old, new)
        code = code.replace("'Employee: ' + staffLabel(identity)", "'Inspection agent: ' + staffLabel(identity)")
        seam = "  const roleSource = readFileSync"
        code = replace(code, seam, "  assert(roster.identities.every(c=>c.artRole===roles[0] && c.clipboard.hand==='right' && c.clipboard.requiredPoses===8),'inspector art and clipboard contract');\n" + seam)
    elif name == "runtime-baseline.mjs":
        code = code.replace("318", "326").replace("2574", "2638")
        code = replace(code, "'staff-gapfill-v6d'];", "'staff-gapfill-v6d','app-gapfill-v6e'];")
        code = code.replace("Concurrent Level 4", "Concurrent Level 5").replace("concurrent Level4 M5", "concurrent Level5")
    elif name == "validate-roster.mjs":
        for old, new in [("totals.expected, 8", "totals.expected, 10"),
                         ("staging.issues.length, 8", "staging.issues.length, 10"),
                         ("item.number)).size, 8", "item.number)).size, 10"),
                         ("exactly8 manual", "exactly10 manual"),
                         ("entries.length === 8", "entries.length === 10"),
                         ("sourceReview.pages.length, 2", "sourceReview.pages.length, 3"),
                         ("entries.length, 8", "entries.length, 10"),
                         ("totals.poses, 64", "totals.poses, 80"),
                         ("318 prior identities/2574", "326 prior identities/2638")]:
            code = replace(code, old, new)
    elif name == "validate-placement-qa.mjs":
        code = replace(code, "placement.diagnostics.length, 8", "placement.diagnostics.length, 10")
        code = code.replace("both current boards", "all three current boards")
    elif name == "bind-worker-contacts.mjs":
        code = code.replace("complete32", "complete40").replace("identities:8", "identities:10").replace("workerReviewedContacts:32", "workerReviewedContacts:40")
    elif name == "build-comparison.mjs":
        code = replace(code, "import {roles}", "import {roles,referenceStaffIds}")
        code = code.replace("318", "326").replace("2544", "3260")
        code = replace(code, "staging.entries.length,8", "staging.entries.length,10")
        code = replace(code, "p.roles.includes(c.role)", "referenceStaffIds.includes(p.id)")
        code = replace(code, "p.roles.includes(role)", "referenceStaffIds.includes(p.id)")
        code = code.replace("createCanvas(1600,384)", "createCanvas(1920,384)").replace("fillRect(0,0,800,combined.height)", "fillRect(0,0,combined.width,combined.height)")
        code = code.replace("totalExistingComparisons:16", "totalExistingComparisons:20").replace("totalWithinBatchComparisons:28", "totalWithinBatchComparisons:45")
        code = code.replace("All 28 within-batch", "All 45 within-batch").replace("and 28 within-batch", "and 45 within-batch")
        code = code.replace("16 existing APP comparisons", "20 existing staff-reference comparisons").replace("28 within-batch pairs", "45 within-batch pairs")
        code = code.replace("identities:8", "identities:10").replace("sameRoleComparisons:16", "sameRoleComparisons:20").replace("sameRoleNewPairs:28", "sameRoleNewPairs:45").replace("withinBatchPairs:28", "withinBatchPairs:45")
        code = code.replace("new eight", "new ten").replace("eight additions", "ten additions").replace("eight new APP identities", "ten new inspectors")
        code = code.replace("existing eligible looks for this role", "existing staff style references; inspectors are an art-only future visitor group")
        code = code.replace("existing same-role", "existing staff-reference").replace("same-role comparisons", "staff-reference comparisons")
    elif name == "validate-all-catalog-comparison.mjs":
        code = replace(code, "import {roles}", "import {roles,referenceStaffIds}")
        code = code.replace("318", "326").replace("2544", "3260")
        code = replace(code, "old.filter(c=>c.category==='staff'&&c.roles.some(r=>roles.includes(r)))", "old.filter(c=>referenceStaffIds.includes(c.id))")
        code = replace(code, "eligible.filter(c=>c.roles.includes(b.role))", "eligible")
        code = replace(code, "eligible.filter(o=>o.roles.includes(c.role))", "eligible")
        code = replace(code, "eligible.filter(c=>c.roles.includes(b.role))", "eligible") if "eligible.filter(c=>c.roles.includes(b.role))" in code else code
        code = code.replace("fresh.length,8", "fresh.length,10").replace("length:8", "length:10")
        code = code.replace("rolePairs,16", "rolePairs,20").replace("within.length,28", "within.length,45").replace("roleWithin.length,28", "roleWithin.length,45")
    elif name == "bind-worker-review.mjs":
        code = code.replace("entries.length,8", "entries.length,10")
        code = code.replace("workerReviewedIdentities:8", "workerReviewedIdentities:10").replace("posesReviewed:64", "posesReviewed:80").replace("ComparisonBoards:8", "ComparisonBoards:10").replace("chairProofs:8", "chairProofs:10").replace("authoredContactDirections:32", "authoredContactDirections:40")
        code = code.replace("regenerations:0,managerAcceptance", "regenerations:notes.totalRegenerations,managerAcceptance")
    elif name == "validate-worker-review.mjs":
        code = code.replace("length,8", "length,10").replace("length:8", "length:10")
        code = code.replace("alpha.summary.poses,64", "alpha.summary.poses,80").replace("alpha.summary.identities,8", "alpha.summary.identities,10")
        code = code.replace("v.age>=21&&v.age<=64", "v.age>=28&&v.age<=65")
        code = code.replace("['004','007']", "['004','008']").replace("glasses/8", "glasses/10")
        code = code.replace("styles.darkBoards.length,2", "styles.darkBoards.length,3").replace("managerAPPComparison", "managerInspectorComparison")
        code = code.replace("'future-roster20-v5.001','future-roster20-v5.002'", "'app-gapfill-v6e.002','app-gapfill-v6e.007'")
        code = code.replace("atlases.groups.length,8", "atlases.groups.length,11").replace("kind==='contact-overlays'?4:2", "kind==='contact-overlays'?5:3")
        code = code.replace("images:24,articles:8", "images:30,articles:10").replace("images:8,articles:8", "images:10,articles:10")
        code = code.replace("review/source-review.html',images:2", "review/source-review.html',images:3").replace("review/manager/index.html',images:4", "review/manager/index.html',images:5")
        code = code.replace("identities:8,poses:64", "identities:10,poses:80").replace("authoredSeatedContacts:32", "authoredSeatedContacts:40").replace("reviewedChairProofs:8", "reviewedChairProofs:10").replace("reviewedCatalogIdentities:318", "reviewedCatalogIdentities:326").replace("reviewedComparisonBoards:16", "reviewedComparisonBoards:20").replace("mainGalleryImages:24", "mainGalleryImages:30")
    elif name == "build-qa-atlases.mjs":
        code = code.replace("start<=8", "start<=10").replace("9-start", "11-start").replace("16 comparison boards and 8", "20 comparison boards and 10").replace("nearestComparisonBoardsShown:16", "nearestComparisonBoardsShown:20").replace("contactOverlaysShown:8", "contactOverlaysShown:10")
    elif name == "build-style-review.mjs":
        code = code.replace("entries.length,8", "entries.length,10").replace("createCanvas(1280,1072)", "createCanvas(1280,1416)").replace("createCanvas(1280,688)", "createCanvas(1600,688)").replace("fillRect(0,0,1280,688)", "fillRect(0,0,1600,688)")
        code = code.replace("'future-roster20-v5.001','future-roster20-v5.002'", "'app-gapfill-v6e.002','app-gapfill-v6e.007'")
        code = code.replace("approved-apps-top-new-eight-below", "existing-staff-top-ten-inspectors-below").replace("managerAPPComparison", "managerInspectorComparison")
        code = code.replace("eight new APP", "ten new inspector").replace("all eight new APPs", "all ten new inspectors").replace("Approved APPs", "Existing staff").replace("approved APPs", "existing staff")
        code = code.replace("Two approved APPs", "Two existing staff").replace("APP v6f", "Inspector v6f").replace("app-v6f.", "inspector-v6f.")
        code = code.replace("all 64", "all 80").replace("two dark boards", "three dark boards").replace("White coats/provider jackets over V-neck scrubs.", "Professional blazers/cardigans/button-downs, lanyards and blank badges. A right-hand clipboard in every pose, resting on the lap when seated.")
        code = code.replace("approvedAPPReferences:2,newAPPIdentities:8,sameScaleV6dComparisons:8", "existingStaffReferences:2,newInspectorIdentities:10,sameScaleV6dComparisons:10").replace("normalizedDarkPoseBoards:2,posesShown:64", "normalizedDarkPoseBoards:3,posesShown:80")
        code = code.replace("'staff-gapfill-v6d.012':'staff-gapfill-v6d.011'", "'app-gapfill-v6e.002':'app-gapfill-v6e.007'").replace("v6d-top-v6f-bottom", "v6e-top-v6f-bottom")
    elif name == "validate-gallery.mjs":
        code = code.replace("registry.entries.length, 8", "registry.entries.length, 10").replace("all 8 identities", "all 10 identities").replace("expectedImages: 4", "expectedImages: 5")
    destination.write_text(code, encoding="utf-8", newline="\n")
    manifest.append({"module": name, "template": (source / name).relative_to(repo).as_posix(), "templateSha256": hashlib.sha256(original).hexdigest(), "adaptedSha256": hashlib.sha256(destination.read_bytes()).hexdigest()})

(tool / "role-contract.mjs").write_text("// Art-review grouping only. No new staff definition or runtime eligibility.\nexport const roles = ['inspection-agent-art'];\nexport const count = 10;\nexport const poses = 80;\nexport const roleCounts = {};\nexport const referenceStaffIds = ['app-gapfill-v6e.002','app-gapfill-v6e.007'];\n", encoding="utf-8", newline="\n")
(tool / "review-acceptance.json").write_text(json.dumps({"schemaVersion": "inspector-v6f-review/v1", "reviewer": "sol-v6f-worker", "scope": "Worker source/pose/style/clipboard/contact QA; manager acceptance pending. No runtime integration.", "accepted": {}, "rejected": {}, "seatContacts": {}, "manualContactEvidence": {}}, indent=2) + "\n", encoding="utf-8", newline="\n")
(tool / "analysis").mkdir(exist_ok=True)
(tool / "analysis/scaffold-template-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8", newline="\n")
print(json.dumps({"status": "PASS", "isolatedGenerationModules": len(modules), "identities": 10, "poses": 80, "template": "v6e / unchanged GS026 extraction", "runtimeEligibility": []}))
