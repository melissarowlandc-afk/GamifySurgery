# GS-013: owner-directed statics / motion split

Status: parent production stopped; scope transferred, not blanket art approval.
PM creates two standalone successor tasks. GS-013 must not create tasks, send
peer messages, edit the PM board, or fit further characters. Existing workers
are complete; the dormant fourth-character worker was interrupted. Only scoped
backup/closeout remains. Repository is C:/Users/Kyle Kent/Projects/GamifySurgery,
shared dirty beta checkout; preserve unrelated changes and successor outputs.

## Owner's current scope (supersedes older restrictions)

1. Independently create and implement statics for EVERY already-generated
   character. No owner proof approval required except CLIPBOARD statics.
   Technical and visual QA remain mandatory. No new identities, walking or
   jumping in this successor.
2. Founders ONLY walking and star jumps, with the explicitly authorized initial
   exception/proof: Blue Glasses West only, eight poses. Use complete
   shoulder-to-hand arms and hip-to-shoe legs with internal joints drawn together.
   Compare to Blue's approved standing art at game size. Expand only when
   convincingly better; if shoulder/hip assembly still shows, use complete
   whole-body walking frames. Pause all other walking fittings meanwhile.

Blue is patient.adult.039, NOT a founder; the Blue pilot does not authorize
walking production for the rest of the patient roster. Historically star jump
and clipboard practice were South-only, walking cardinal S/E/W/N. Do not infer
new founder action directions from the older four-direction master approval.

## Authoritative plans and approval status

- Latest motion plan: docs/execplans/walking-appearance-reset.md.
- Static method and first-four approval: docs/execplans/whole-body-static-review.md.
- Latest Blue sources/build/evidence: docs/execplans/blue-glasses-hybrid-fit.md.
- Navy history: docs/execplans/next-character-hybrid-fit.md.
- docs/features/character-atlas-protocol.md documents historical v1 and lessons;
  small-segment fitting restrictions are superseded by this split/reset.
- docs/handoffs/APPROVED_CHARACTER_SURFACE_FITTING.md is an OLDER GS-012-to-GS-013
  handoff, not current acceptance or constraints.

Approved whole-body statics: standing S/E/W/N and sitting S/E/W/N for Green,
Gray Braid, Gray Overshirt, Brown Beanie (32 poses; owner "Looks good!"), Navy
Vest statics carried through later feedback, and Blue Glasses all eight statics
(explicit latest owner acceptance). These GS-013 results are not game-integrated.
Historical founder/other source poses exist; no new approval of them is inferred.

Clipboard: earlier segmented South practice was accepted on initial test designs,
but the whole-body static registry deliberately contains no clipboard poses and
the tested four are not verified founders. New clipboard statics require owner
approval under the latest split. Do not treat old canonical/action or fitted
clipboard approval as automatic approval of new whole-body clipboard artwork.

Walking: first-four historical approved cycles remain comparison references.
Navy West walking approval is REOPENED (shin ahead of ankle/cutoff remains).
Blue walking is REJECTED despite technical PASS. Never promote either as approved
motion. Parent completion means transfer, not acceptance of rejected walking.

## Existing identities and sources

Metadata inventory: artifacts/character-movement/retained-roster/retained-roster.json.
Tool: tools/character-mapping/retained-roster/build-retained-roster.mjs.
Existing evidence: 55 retained PNG sheets, 50 exact patient hash joins, five
unmatched references, 30 founders including 10 nonhuman exceptions. Its coverage
flags are historical metadata, not proof of current art readiness.
Patient manifest: apps/player/public/art/characters/patients-v1/manifest.json.
Founder manifest: apps/player/public/art/characters/founders-v4/manifest.json
(founders-v4-r10-feet); original founder sheets: Photos for Codex 2/Founders/.
Do not assign unmatched references a fabricated runtime ID.

All following filenames are under Photos for Codex 2/Patients or Staff or Other Characters/:

| Review name | Existing identity | Source PNG |
|---|---|---|
| Green | patient.adult.046 | exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png |
| Gray Braid | retained.gray-braid preview; unmatched runtime ID | exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png |
| Gray Overshirt | patient.adult.032 | exec-33437146-564e-4cb1-a7e2-ad41504ea752.png |
| Brown Beanie | patient.adult.043 | exec-092d31ac-7592-4634-8883-167ddac564df.png |
| Navy Vest | patient.adult.035 | exec-ee82180f-799f-4617-9159-27eefa97f158.png |
| Blue Glasses | patient.adult.039 | exec-492d528d-52f8-422a-a1dc-fe63b3cd04cb.png |

EVERY generated character also includes the newer four-character foundation,
not just this retained inventory. Reuse the existing manifest/crosswalk without
inventing identities: Photos for Codex 2/Codex Patients or Staff or Other Characters 2/
mixed-batch-2026-09-10/production-foundation-v2/manifest.json and characters/.
Existing accepted standalone seats/exam pose: sibling production-poses-v2/.
Their IDs, source lineage and historical hold are described in
docs/handoffs/PATIENT_EMPLOYEE_CHARACTERS_HANDOFF.md. The owner's new statics scope
supersedes the production hold for static work; do not resubmit old remote jobs.

## Frozen reusable inputs and outputs

First-four static source/tool root: tools/character-mapping/whole-body-static-v1/.
Registry: registry-v1.json, SHA256
5e9ba1ad208e1db6bdd1752939f43f6f684da4a9afcab0cdc2e074886959df54.
It records exact source paths/hashes, original stands, generated complete seats,
pose file paths, floor/seat anchors and prompts. Output root:
artifacts/character-movement/whole-body-static-v1/.
Standing originals use exact1x pixels; canonical canvas160x320, axis80,floor287.
Seated artwork is scaled as a whole, not assembled from fitted limbs. Preserve
white identity pixels during connected-background removal and measure natural
seat contact separately per view. Review chair placement as well as silhouette.

Navy source/rig: tools/character-mapping/layered-pilot/navy-vest-v1/.
Output root artifacts/character-movement/navy-vest-v1/, manifest SHA256
1a6938d11630dde23024d4d7c85a4c44cc3b4587ecc3d77db6ffbc85678c16c7.
Its frames/stand/ and frames/sit/ are static references; frames/walk/ are only
the latest rejected/reopened comparison, not a new approval baseline.

Blue source SHA256248c1222bef1cd5333b870c9179c6182966b6d47fd266da69a88bec70cedb420.
Source/rig/assets: tools/character-mapping/layered-pilot/blue-glasses-v1/.
Generated donor images and exact prompts are under assets/; generation-record.md
records built-in imagegen use. upper-generated-v1.png is superseded; v2 fixed
low rolled cuffs. Torso donor is torso-generated-v1.png; complete seated source
is seated-generated-v1.png. These arm donors remain evidence of failed fitting,
not a requirement for the reset.

Blue output root: artifacts/character-movement/blue-glasses-v1/.
Manifest SHA2562f5efba7c624429a16467b9877fb31d02e273d0aec6047689404983cc0673d83.
Atlas manifest tools/character-mapping/layered-pilot/blue-glasses-v1/manifest-v1.json
SHA256ecc4c3d14ad7ab94558d2feb3551818edc7be17b210410ca397f7c676426a3fa.
Approved West standing reference: frames/stand/west.png, SHA256
ea7c8af64fb7a6348c204f53401ca96dfc4d3579f2d7b7dd684f64d181736872.
Approved all-eight statics: frames/stand/{south,east,west,north}.png and
frames/sit/{south,east,west,north}.png, all pinned by the manifest.
Eight-pose rejected West baseline: frames/walk/west/01.png through08.png;
each hash is pinned in frames.walk.west in the above immutable manifest.
Proofs: proofs/walk-west-all8.png, proofs/source-vs-fitted-neutral.png,
proofs/statics-contact.png and proofs/lower-detail-west-all8.png.
Keep these unchanged and write the new pilot to a distinct output directory.

## Useful commands, previews and known limitations

Static: node tools/character-mapping/whole-body-static-v1/validate-static-v1.mjs.
Blue: node tools/character-mapping/layered-pilot/blue-glasses-v1/validate-blue-glasses-v1.mjs.
Navy: node tools/character-mapping/layered-pilot/navy-vest-v1/validate-navy-v1.mjs.
Shared: node --test tools/character-mapping/standard-atlas/standard-atlas.test.mjs
tools/character-mapping/standard-atlas/normalized-lower.test.mjs.
Builders/importers sit beside these validators. The existing scripts rely on
locally installed canvas/Playwright and private source paths; don't silently
substitute missing art or install dependencies without following task policy.

Review builders/validators: tools/character-mapping/whole-body-static-v1/
build-review.mjs + validate-review.mjs; tools/character-mapping/blue-glasses-v1/
build-inline-review.mjs + validate-inline-review.mjs; equivalent navy-vest-v1/.
Inline reviews live outside Git at C:/Users/Kyle Kent/.codex/visualizations/2026/09/13/
01a09b55-147e-72f0-b413-e8b6827c7287/: whole-body-static-review.html,
blue-glasses-hybrid-review.html, navy-vest-hybrid-review.html.
Project review/ subdirectories contain UI provenance and host screenshots.

Technical checks previously passed (18 shared tests,8Blue statics/32walks,
470prior referenced files; browser controls), but owner rejects visual walking.
Do not equate aligned landmarks/one alpha sample with cohesive silhouettes.
Rejected approaches: forced silhouette stretching; separate rigid upper/forearm
joins; per-scanline normalization of thigh/shin texture; enlarging shoes to hide
bad ankle markers; arbitrary per-character offsets treated as reusable rules.
The reset standardizes timing/layers and complete limbs; no internal elbow/knee/
ankle splits. Inspect every phase at game size before requesting motion review.

## Ownership, private art and backup boundary

No active art writer owns these frozen inputs. Successors own new outputs only.
Do not edit PM board. Existing first-four/Blue/Navy outputs stay available as
evidence even where appearance is rejected. No website deployment/main merge.

Photos for Codex/ and Photos for Codex 2/ are Git-ignored. Historical source
instructions explicitly label references and unapproved candidates private and
prohibit adding them to Git or public services. Existing local/source-based art
work is authorized; the split does not automatically authorize publishing every
private source or rejected candidate. Backup must respect this distinction and
state any private dependency needed to reproduce results. No new remote image
service authorization is implied by old Cortan history. Use current imagegen
skill/tool policy for new artwork and preserve existing provenance.

## Closeout

Owner-directed parent completion is by transfer. Do not wait for successor
production, clipboard approval, or new walking approval. Scoped backup audit is
in progress in an isolated snapshot; final commit/remote verification or actual
blocker will be recorded in docs/execplans/gs-013-split-closeout.md. No new art
has been generated for this handoff.

Final receipt: GS-018/GS-019 own production. Parent scope completed by transfer;
archive does not approve rejected motion. Reviewed461filetext-only backup is
committed locally as5654ca11c0fd9f3403c9661e2a50a483655963ea on
backup/gs-013-character-snapshot-2026-09-17 in isolated checkout
C:/Users/Kyle Kent/Projects/GamifySurgery-gs013-closeout-audit.
GitHub push was rejected by automatic approval review for lack of accepted
trusted authorization for that exact payload/destination. Remote not verified;
read-only ls-remote also could not connect to github.com:443. Full recovery and
privacy/reproduction limitations are in docs/execplans/gs-013-split-closeout.md.
