# Unique employee character coverage

Status: complete locally, validated September29 2026; not pushed or published.

## Authorized outcome
Owner requests enough employee character options for every potential employee
opening, filling gaps now, and no exact character hired twice concurrently.
Audit configured capacity across roles/levels and shared art pools. Preserve
existing approved character art,3px/2Hz standing bounce, historical work and saves.
New identity artwork if required must match existing staff style and complete
cardinal standing/seated registration; no walking generation.

## State and ownership
Read AGENTS/current handoff, inspected large dirty shared tree. Concurrent
room-capacity/Periop/alerts work exists; don't undo it. Terra tick_profile owns
read-only staffing capacity/art eligibility/hiring/load audit. Root owns product
decisions and existing art pipeline review. Delegate implementation after exact
gaps established, capture baselines. One production writer at a time; image work
may be disjoint. No dependencies/commit/push/deploy/owner save mutation.

## Acceptance and milestones
1. Role-by-role maximum simultaneous openings versus distinct eligible art;
   include shared pools, current/higher configured levels and capacity limits.
2. Fill actual art/eligibility gaps; keep approved sources intact and distinguish
   owner approval from agent production QA. Add role-appropriate identities if
   insufficient complete art exists. Root visual QA before runtime acceptance.
3. Deterministic unique hiring allocation across all employed identities; reuse
   an identity only after it is no longer employed. Save/load preserves unique
   assignments; repair existing duplicate staff predictably without changing
   employment IDs, roles, skills, routes or progress. Handle exhaustion explicitly.
4. Coverage/uniqueness/hire-fire-rehire/reload tests and applicable runtime proof.
   Review actual scoped diff/art, update handoff and report limits/counts.

## Pathway
Owner remains START_GAME.cmd -> http://127.0.0.1:4173 usual profile. Test only
isolated storage/unused private port; stop own servers. Local-only checkpoint;
remind owner to request "push to GitHub" after validated completion.

## Progress
Terra capacity audit complete; exact capacity and production decision below.
Root read imagegen skill and reviewed existing employee20 sources/contracts.
Root source visual acceptance:001-004 and014-018, pending final transparent
light/dark composites, packaging, seat-contact and runtime QA.015-018 have
distinct EVS/NP identities and coherent seated proportions. Exact prompt
placeholders discovered in017/018 were returned to the artist for correction.
Sol packaging tooling/pilot active; runtime implementation not yet started.

## Audit and production decision
Current authorized room capacities allow43 staff: reception1, imaging3, periop6,
endoscopy nurse5, endoscopist5, phlebotomy3, EVS10, GLP NP10.22 existing staff
identities have24 role-constrained gaps because one nurse is shared. Generate25
new identities, giving47 staff designs: dedicated pools cover every opening
without competing for the shared nurse (four spare designs overall).
New IDs gs026-employee-001..025:001-003periop,004-005endo nurse,006-008scope,
009phlebotomy,010-017EVS,018-025GLP NP. Distinct age/build/face/hair/outfit details,
consistent established role clothing. Eight whole-body standing/seated cardinals
per identity; all200 new poses use one scale per person, no oversized seats.

Terra movement_alternatives owns source images001-013; Terra tick_profile owns
014-025. Both builtin imagegen only, exact prompts/provenance, style refs not
identity copies, first sheet parent review before bulk. Sol seated_correction_pilot
owns isolated tools/artifact packaging only at this milestone. Assets root:
tools/character-mapping/gs026-employee-expansion-v1/assets; artifact root matching
under artifacts/character-statics/. Runtime promotion after actual visual QA.
Do not rerun historical builders. Preserve all128 old identities/1054asset hashes.
Resulting runtime target153identities/1254assets, including unchanged30clipboards.

Hiring uniqueness is global across active staff; also reserve stills of visible
departing staff until they leave to avoid a visible duplicate on immediate rehire.
If all eligible designs are temporarily reserved, reject hiring clearly without
charging cash. Stable load repair must preserve first retained assignments and
reserve all existing nonconflicting identities before filling collisions; avoid
stealing a later employee's already unique design. Preserve employment/gameplay
fields and old art. No whole-campaign failure/layoff on legacy load exhaustion.
Runtime implementation remains a subsequent delegated milestone.

## Implementation and QA progress
All25 selected source sheets visually reviewed by root.005 wrong white-coat
nurse rejected/preserved and regenerated correctly in scrubs.001/014 packaged
native light composites accepted;001 seat contact authored at outputY238.
Sol captured immutable1054asset hash ledger and owns additive packaging/proofs.
Root is reviewing source008 crop-boundary warning before any regeneration;
source bottom edge itself contains no alpha>=13 pixels in root measurement.

Terra tick_profile implemented catalog, occupied-ID allocation/hire guard and
initial active-save collision repair. Fresh Terra staff_uniqueness_validation
owns regression coverage and repairs found in review: retain deterministic first
duplicate keeper, reserve every keeper before reassignment, retain free preferred
hash choice. Departing actors are already transient/not restored by persistence;
preserve that behavior, reserve them for LIVE hiring only. No broader save feature.

Art production process limitation: full verbatim prompts for part of002-013 were
not durably retained. Preserve available exact files; explicitly label others as
reconstructed, retaining selected source output paths/hashes and reference roles.
Do not regenerate accepted art solely to recreate provenance. Luna owns mechanical
sidecar completion after Spark failed as unsupported for this account (not quota;
shared Spark quota record unchanged). No owner approval is asserted for new art.

## Completion and reviewed validation
All25/200 new poses are locally integrated; staff47 for configured43 openings,
runtime153 identities/1254 images. Root visually reviewed all source sheets,
packed25 board, seat-contact proofs (including coat-obscured pelvis), and final
Phaser screenshot.008 warning was two alpha13 nonprincipal pixels at an INTERNAL
crop boundary, not clipped source anatomy; retained and documented, no repaint.
Durable frozen baselines and additive composer support clean-checkout rebuilds,
reject unrelated future registry additions and preserve all128 original records
and1054 original image bytes. Pipeline runbook records build/review/promote checks.

Terra tick_profile: capacity audit,014-025 art, initial domain implementation.
Terra movement_alternatives:001-013 art/correction; prompt-record loss noted above.
Sol seated_correction_pilot: packaging, authored anchors, registry promotion.
Terra staff_uniqueness_validation: keeper/preference corrections, domain regression
tests and isolated browser proof. Luna prompt_sidecars_fallback: reconstructed
prompt/provenance completion after unsupported Spark invocation. Root reviewed
actual code/art and made only tiny test integration corrections: configured room
maximum assertions and updated catalog count assertions153/47.

Parent independently ran25 domain tests (uniqueness, persistence, room capacity,
catalog),3 player registry tests,2 pipeline tests, both domain/player TypeScript,
Vite production build and candidate/promotion validators: all PASS. Promotion
validator proves128 old records and1054 image hashes preserved,200 new copies
match source package. Browser worker ran2 Playwright checks PASS in16.8s, reviewed
by parent: all47 catalog IDs/376 standing-seated assets fetched,43-unique browser
fixture survives reload,001/014/018 exact cardinal texture hashes,3px bounce,
equal seated/standing display scale and no walk-art requests. Screenshot:
artifacts/screenshots/employee-character-coverage/new-staff-runtime.png.

Limits:43 configured-capacity allocation/roundtrip is tested in the domain;
the browser43 roster is an injected visual fixture, not43 UI hiring interactions.
Legacy over-capacity art exhaustion preserves employees/save rather than layoffs;
ordinary hires always reject exhausted pools without charging. Departure actors
retain their prior transient reload semantics. Tests used private4203/separate
storage, stopped after proof. Owner4173 pathway and campaign untouched.

Next action: owner playtest via START_GAME.cmd -> http://127.0.0.1:4173 in usual
profile; refresh/resume loads duplicate repair. This valuable checkpoint is only
local; owner must explicitly say "push to GitHub" for audited backup. No release,
deployment, commit or push was performed by this task.

## Authorized backup and closeout follow-up
Owner accepted the new roster ("Okay looks good") and then explicitly requested
"push to GitHub" and task closure. Sol checkpoint_scope_audit found that beta
HEAD lacks the still baseline and shared gameplay diffs include substantial
unrelated active work. Preserve a scoped archival checkpoint under
artifacts/checkpoints/gs026-20260929/, with mirrored owned files and narrow
implementation recovery patches/snippets. This is a recovery backup, not a
standalone deployable game tree. Do not stage shared runtime files or other
tasks. Exclude rejected/private source art and clinical material. Root reviews
manifest/hash/security audit, commits only the checkpoint, pushes beta and
verifies remote SHA. Update handoff with exact commit after verification.
