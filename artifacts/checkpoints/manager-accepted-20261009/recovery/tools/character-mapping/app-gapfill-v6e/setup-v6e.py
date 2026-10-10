"""One-time, non-overwriting art-only scaffold from the v6d lane."""
from pathlib import Path
import re
import json

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
source = tool.parent / 'staff-gapfill-v6d'
modules = ['build-roster.mjs', 'build-placement-qa.mjs', 'validate-roster.mjs',
           'validate-placement-qa.mjs', 'bind-worker-contacts.mjs',
           'prepare-request.mjs', 'save-native.mjs', 'prepare-correction.mjs',
           'save-correction.mjs', 'check-syntax.mjs', 'validate-gallery.mjs',
           'build-comparison.mjs', 'validate-all-catalog-comparison.mjs',
           'bind-worker-review.mjs', 'validate-worker-review.mjs',
           'build-qa-atlases.mjs']

for name in modules:
    destination = tool / name
    assert not destination.exists(), f'Refusing to overwrite {destination}'
    code = (source / name).read_text(encoding='utf-8')
    code = code.replace('staff-gapfill-v6d', 'app-gapfill-v6e').replace('sol-v6d-worker', 'sol-v6e-worker')
    code = code.replace('v6d', 'v6e').replace('V6D', 'V6E')
    code = re.sub(r'\b14\b', '8', code)
    code = code.replace('exactly14', 'exactly8').replace('complete14', 'complete8')
    code = re.sub(r'\b112\b', '64', code) if name not in ['build-comparison.mjs', 'validate-all-catalog-comparison.mjs'] else code
    code = re.sub(r'\b56\b', '32', code)
    code = code.replace('complete56', 'complete32').replace('Fourteen', 'Eight').replace('fourteen', 'eight')
    code = code.replace('/^0(0[1-9]|1[0-4])$/', '/^00[1-8]$/')
    if name == 'build-roster.mjs':
        code = code.replace("import {correctPose,correctionReceipt} from './navy-palette.mjs';\n", '')
        begin = code.index('  const palette=correctionReceipt(repo,identity.number);')
        end = code.index('  let contacts =', begin)
        code = code[:begin] + '  const palette = null; // No derived character edits in this batch.\n' + code[end:]
        code = code.replace('roles.flatMap(role=>[[role],[role]])', 'Array.from({length:8},()=>[roles[0]])')
        code = code.replace('c.intendedAge>=21&&c.intendedAge<=64', 'c.intendedAge>=28&&c.intendedAge<=60')
        code = code.replace("length<=4,'glasses maximum is 30%'", "length<=2,'at most two glasses identities'")
        needle = "  const roleSource = readFileSync"
        code = code.replace(needle, "  assert.equal(roster.identities.filter(c=>c.compatibleSexLabel==='Female').length,4);\n  assert.equal(roster.identities.filter(c=>c.compatibleSexLabel==='Male').length,4);\n" + needle)
    elif name == 'validate-roster.mjs':
        code = code.replace("import {correctPose,correctionReceipt} from './navy-palette.mjs';\n", '')
        begin = code.index('    const corrected=correctPose(')
        end = code.index('    poseHashes.push', begin)
        code = code[:begin] + "    assert.equal(detail.sha256, createHash('sha256').update(expectedFrames[index].canvas.toBuffer('image/png')).digest('hex'), 'derived pose differs from immutable GS026 extraction');\n    assert.equal(detail.paletteCorrection,undefined);\n" + code[end:]
        begin = code.index('  const palette=correctionReceipt(')
        end = code.index('  assert.equal(Object.keys(manifest.poses.stand)', begin)
        code = code[:begin] + "  assert.equal(entry.paletteCorrection,undefined); assert.equal(manifest.postNormalizationCorrection,undefined);\n" + code[end:]
        code = code.replace("sourceReview.pages.length, 4", "sourceReview.pages.length, 2")
        code = code.replace('265 prior identities/2150 assets and140 selectable patients preserved; accepted v6b art pinned', '318 prior identities/2574 assets and179 selectable patients preserved; existing art pinned')
    elif name == 'build-comparison.mjs':
        code = code.replace('roleInventory.identities.length,16', 'roleInventory.identities.length,2')
        code = code.replace('allInventory.identities.length,285', 'allInventory.identities.length,318')
        code = code.replace('comparedExisting:285', 'comparedExisting:318')
        code = code.replace('createCanvas(800,7*384)', 'createCanvas(1600,384)')
        code = code.replace('totalExistingComparisons:32,totalWithinBatchComparisons:7', 'totalExistingComparisons:16,totalWithinBatchComparisons:28')
        code = code.replace('totalCatalogComparisons:3990,totalWithinBatchComparisons:91', 'totalCatalogComparisons:2544,totalWithinBatchComparisons:28')
        code = code.replace('all 265 prior runtime identities and all 20 accepted v6b identities. All 91', 'all 318 prior runtime identities. All 28')
        code = code.replace('32 existing comparisons and 7 same-role new pairs', '16 existing APP comparisons and 28 within-batch pairs')
        code = code.replace('All seven role pools beside their two additions', 'The two approved APPs beside the eight additions')
        code = code.replace('All 16 existing role looks at left, both new identities for each role at right', 'The two approved APPs at left and eight new APP identities at right')
        code = code.replace('Seven-role overview', 'APP overview').replace('new two', 'new eight')
        code = code.replace('existing left, new two right', 'existing left, new eight right')
        code = code.replace(' / 285', ' / 318')
        code = code.replace('3990 comparisons against 265 prior runtime +20 accepted v6b identities, and 91 within-batch pairs', '2544 comparisons against 318 prior runtime identities and 28 within-batch pairs')
        code = code.replace('identities:8,existingRoleLooks:16,sameRoleComparisons:32,sameRoleNewPairs:7,perRoleSheets:7,allCatalogIdentities:285,allCatalogComparisons:3990,withinBatchPairs:91', 'identities:8,existingRoleLooks:2,sameRoleComparisons:16,sameRoleNewPairs:28,perRoleSheets:1,allCatalogIdentities:318,allCatalogComparisons:2544,withinBatchPairs:28')
    elif name == 'validate-all-catalog-comparison.mjs':
        begin = code.index('const v6b=json(')
        end = code.index('assert.deepEqual(inventory.identities.map', begin)
        code = code[:begin] + "assert.equal(old.length,318);assert.equal(new Set(old.map(c=>c.id)).size,318);\nassert.equal(inventory.priorRuntimeIdentities,318);\n" + code[end:]
        code = code.replace('eligible.length,16', 'eligible.length,2')
        code = code.replace('roles.flatMap(r=>[r,r])', 'Array.from({length:8},()=>roles[0])')
        code = code.replace('allPairs,3990', 'allPairs,2544').replace('rolePairs,32', 'rolePairs,16')
        code = code.replace('within.length,91', 'within.length,28').replace('roleWithin.length,7', 'roleWithin.length,28')
        code = code.replace('all.catalogBoards.length,6', 'all.catalogBoards.length,7')
        code = code.replace('priorRuntimeIdentities:265,acceptedV6bIdentities:20,allCatalogIdentities:285,existingRoleLooks:16', 'priorRuntimeIdentities:318,allCatalogIdentities:318,existingRoleLooks:2')
        code = code.replace('perRoleComparisonSheets:7', 'perRoleComparisonSheets:1')
    elif name == 'bind-worker-review.mjs':
        code = code.replace('roleSheets:7', 'roleSheets:1').replace('regenerations:1', 'regenerations:0')
    elif name == 'validate-worker-review.mjs':
        code = code.replace('visual.preGenerationExamples.length,16', 'visual.preGenerationExamples.length,2')
        code = code.replace('roles[Math.floor(i/2)]', 'roles[0]')
        code = code.replace("assert.deepEqual(notes.glassesIdentities,['003','012']);", "assert.deepEqual(notes.glassesIdentities,['004','007']);")
        code = code.replace("assert.equal(regenerations,1);assert.equal(visual.identities.find(c=>c.regenerations===1).number,'005');", "assert.equal(regenerations,notes.totalRegenerations);")
        code = code.replace('styles.styleBoards.length,2', 'styles.styleBoards.length,2').replace('styles.darkBoards.length,4', 'styles.darkBoards.length,2')
        code = code.replace('atlases.groups.length,15', 'atlases.groups.length,8')
        code = code.replace("kind==='contact-overlays'?7:4", "kind==='contact-overlays'?4:2")
        code = code.replace("images:42,articles:8", "images:24,articles:8").replace("images:4},{file:'contact", "images:2},{file:'contact")
        code = code.replace("images:7,articles:7", "images:1,articles:1").replace("images:6}", "images:4}")
        code = code.replace('roles:7', 'roles:1').replace('reviewedRoleSheets:7', 'reviewedRoleSheets:1').replace('reviewedCatalogIdentities:285', 'reviewedCatalogIdentities:318').replace('reviewedComparisonBoards:28', 'reviewedComparisonBoards:16').replace('mainGalleryImages:42', 'mainGalleryImages:24')
    elif name == 'build-qa-atlases.mjs':
        code = code.replace('start<=8', 'start<=8').replace('15-start', '9-start')
        code = code.replace('28 comparison boards and 8', '16 comparison boards and 8').replace('nearestComparisonBoardsShown:28', 'nearestComparisonBoardsShown:16')
    elif name == 'validate-gallery.mjs':
        code = code.replace('expectedImages: 7, expectedCards: 7', 'expectedImages: 1, expectedCards: 1').replace('expectedImages: 6', 'expectedImages: 4')
    elif name == 'validate-placement-qa.mjs':
        # Cohort contact totals must never replace a fixed fixture coordinate.
        code = code.replace('{ left: 32, top: 39, width: 45, height: 65 }', '{ left: 56, top: 39, width: 45, height: 65 }')
        code = code.replace('all four current boards', 'both current boards')
    destination.write_text(code, encoding='utf-8', newline='\n')

(tool / 'review-acceptance.json').write_text(json.dumps({
    'schemaVersion': 'app-gapfill-v6e-review/v1', 'reviewer': 'sol-v6e-worker',
    'scope': 'Worker source/pose/style/contact QA; manager acceptance pending. No runtime integration.',
    'accepted': {}, 'rejected': {}, 'seatContacts': {}, 'manualContactEvidence': {}
}, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps({'status': 'PASS', 'isolatedGenerationModules': len(modules), 'identities': 8, 'poses': 64, 'template': 'staff-gapfill-v6d / unchanged GS026 extraction'}))
