# GS-015 — Level 4 room design

## Goal and current owner direction

Design Level4 rooms as isolated, reviewable GS015 proofs. First room: Radiology
Reading Room. Owner: "Can we do the radiology reading room? I want there to be
four desk cubicles set up exactly like they are in Severance and have similar
colors as the severance office. Should look like the room is dark though".
Use four interconnected pinwheel cubicles in one central cluster, not four
unrelated desks. Muted green carpet, teal dividers/equipment, ivory surfaces;
dim ambient lighting and bright radiology screens. Preserve established GS015
orthographic elevated-front art style and uniform furniture/character scale.

## Constraints

- Proof/design only; owner approval pending. No runtime, progression, save,
  clinical teaching, global character resizing, commit/push/deploy/install.
- All7 Level3 designs and approvals remain frozen. Final Level3 review closed:
  compact OR desk height accepted; Break/Office plant/bookcase pass-through.
- Shared beta tree has524 dirty entries at intake; preserve all unrelated work.
- Existing seated desks80px worktop, chairs45px at120px/tile are references.
  Use current authored directional seated poses and true seat/floor anchors.
- Four usable chair contacts and accessible transitions. Permanent central
  desk/cubicle assembly; independent optional wall decor hides for owned door
  and north backing segment. Doors possible on every wall segment.
- Start geometry exploration at4×4, enlarge only if scale/routes need it;
  size is proposed, not owner-approved. One orientation for square proof.
- No claim of exact show replica until actual reference geometry is checked;
  distinguish the faithful four-part pinwheel from game-view adaptations.
- No logos or copyrighted character imagery are needed. Reference facts only,
  no copied production photos in repo. Builtin imagegen with exact provenance.

## References / repository state

- docs/features/facility-levels-and-clinical-release-points.md: Level4 includes
  Reading, MRI, Pediatric Waiting/Examination, Wound/Ostomy and Call rooms.
- https://www.setdecorators.org/sites/setdecorators/pdf/SEVERANCE-Rev-8-25.pdf
  (set-decorator reference, accessed2026-10-03): central pedestal desk and
  matching chairs/green carpet, concealed wiring. Store link, not copied PDF.
- Existing SurgeonOffice and Break proofs supply seating/rendering/validation
  patterns; do not alter them. Current character registry is authoritative.
- tools/room-design/level-4/radiology-reading/ is additive ownership root.

## Milestones / ownership

1. Terra bounded geometry/seat study: owns layout-study/** only. Explore compact
   4×4 four-way pinwheel, chair/desk footprints, four seat facings/transitions,
  16 door paths, backing ownership and scale targets. Read existing sources,
   produce JSON, route validator/audit and brief. No asset generation/runtime/
   planning edits. Parent reviews dimensions, source anchors and actual routes.
2. Parent art direction/builtin imagegen: separate transparent furniture art
   and/or atlas components appropriate for depth layering; save originals and
   exact prompts at assets/**. Geometry/art reconciliation before renderer.
3. Bounded worker proof kit after study: owns proof/** and README only, plus
   named delivery fragment. Prepare native art with uniform scales/provenance;
   dim shell/carpet, true4seat occupancy, all door/backing controls, comparison
   and focused browser validator/captures/manifest. No old proof overwrite.
4. Parent inspect actual code/diff/art/captures, rerun focused validations and
   hash preservation; repair through worker if substantive. Record candidate,
   show proof for owner review. Runtime integration remains separate.

## Acceptance / validation

- All individual doors and north-backed states hide exactly owned optional
  fixtures and restore shadows. Central desk and4chairs remain permanent.
- Interpolate every door route and chair transition at.005tile spacing against
  declared footprints+.18actor radius; boundary.20. Seated pelvis contact
  handled through owning-chair model, not transparent bitmap bounds.
- Four proper facing seated sources, consistent identity scales/current registry
  hashes, hip anchors, seat45/worktop80, occlusion layers. Empty/one/all occupied.
- Dim lighting without hiding route-critical geometry; screen light restrained.
- Controls/widget restoration, no saves on load, keyboard and320px proof.
- Unclipped approved-reference scale comparison. Approved Level3 hashes intact.
- No broad runtime/test-readiness claim; provisional approvalnull/runtimefalse.

## Progress / discoveries / next action

Intake complete. Existing dirty tree and prior handoffs reviewed. Reference
search confirms central four-part cluster with green carpet. Next: delegate
Terra layout study before implementing any new proof; parent prepares art.

Terra radiology_layout ran the first4×4 geometry study:16doors/4transitions
passed. Parent actual-source review found arms touched core only at corners
and cardinal chairGround/hip offsets incorrectly rotated seat height. Returned
to Terra for edge-connected pinwheel and constant image-vertical45px seat rise
across facings, followed by full route revalidation. Proposed extras removed:
keep the minimalist four-station room and blank walls; no fifth wall screen,
credenza, lamp or art panel. Door/backing controls still cover full shell.

Parent builtin imagegen made island01, targeted island02 edit (tallerbases/
SE monitor face), and4cardinal chair atlas01. Originals/exact prompts/provenance
preserved under assets/**. Selected island02 provisional uniform80px worktop;
native packing must remove exterior alpha halo and preserve furniture details.
No character size/art changes. Next: revised study review, then delegate proof.

Revised study accepted by parent after actualJSON/validator review and independent
rerun: all16door routes and4seat transitions pass. Deskarms nowedgeconnect to
core; allfacings usechairGroundY-seatContactY=.375tile. Nooptionalwallfixtures.
Sol radiology_proof now owns the proof kit/README/delivery milestone, with
authority for measured art-to-layout reconciliation only (preserve oldstudy).
Fullislandnative feet/worktop projections do not exactly match the first logical
rectangles; reconcile per-station contacts/source depthpieces and reroute rather
than blindly asserting studydimensions fit. Preserve80desk/45chair and current
pose scales. Parent will inspect earlycomposedart if alignmentrequiresdecision.
Next: Sol handback withactual calibration/renderer/browser/captures/manifest,
then parentreview/revalidation and provisionalowner display. No runtime scope.

Parent inspected early empty/all4/NW/SE captures and actualtemplate/preview/
assetcontract code. Pinwheel/dimcolors accepted as candidate direction, but
NW/NEcasters project ondesktops andSWreader is toooccluded; Sol independently
identified sameproblems and is revisingcontacts, calibratedfootprints/routes,
source-preservingdepthclips. SE contact reads correctly. Also returned initial
image-loading render bug, backing-controls door dependency and clipped comparison
toSol. These are not an acceptedproof yet; allcapture/validation stages must
repeat after corrections. Do not describe draft collider bounds as conservative
unless they actually cover measuredopaquegroundbases.

Final candidate ready for owner review (2026-10-03). Terra radiology_layout
completed the corrected study; Sol radiology_proof completed proof, measured
art/geometry reconciliation, depth layers, controls, captures and delivery.
Parent reviewed actual study/contracts/packing/build/renderer/validator sources
and all10 final captures; independently reran study and browser validators PASS.
Parent independently interpolated16,526 route samples against declared solids
expanded by.18, boundary.20 and checked all16 door endpoints/4seat transitions.
Native packed opaque lower-base checks: SE677/677 andNW515/515 covered.
SE chair movedwest to(2.64,2.91)ground to preserve measured base clearance;
NE chair east ofits desk, SE divider masksNE shoe, SWface remains visible.
Rounded current actor widths121/113/116/116; desks80/chairs45 at120px/tile.
Keyboard/widget restoration/noautoloadsave/320/unclippedcomparison PASS.
All7 Level3 source/delivery hashes and3 generated originals preserved.

Fragment721302bytes, source/delivery SHA256:
E5657E5E3B274A0D1DDF4390265603B8B93F6081E3D2147AED227BC206C35D52.
Provisional4x4, approvalnull/runtimefalse; empty default, fourindividual/all
reader options,16door/4independentbackingcontrols. Nooptionalwallfixtures.
Reference-faithful pinwheel/palette adapted togamecamera; noexactproduction-set
replica claim. Role samples do not establish staffing rules. Runtime, saves,
progression andglobal seated/standing size issue remain separate. Shared dirty
tree527entries preserved; localcheckpoint only, no commit/push/deploy.
Next: owner visual feedback/approval ofthis exactcandidate, then anotherbounded
Level4 room when directed. No remaining implementation milestone this turn.

Owner review-controls correction (2026-10-04): north backing checkboxes produce
no visual change when doors closed; side door controls are mixed rather than
grouped like earlier proofs. Reproduced in drawShell: adjacent only changes an
open north door cut, leaving closed-wall height unchanged. Bounded revision:
four independent north wall segments collapse to established low29px style when
backed, including closed doors; openings and restoring wall/shadow remain correct.
Group all16door controls into explicit North/South/West/East rows at736/320px.
Sol radiology_proof resumes ownership of proof/**, roomREADME and exactdelivery;
preserve prior candidate under proof/history before editing. No furniture/art/
chair/actor/route changes, all prior approved proofs untouched. Parent reviews
actualdiff and focused backing pixel/keyboard/320/capture/manifest validations.
Shared dirtytree529entries preserved. Next: delegated repair and parent review.

Controls repair completed for owner review (2026-10-04). Sol radiology_proof
archived E5657E5E... and changed sources under proof/history/pre-controls-repair-
2026-10-04/ before modifying only shell/controls and focused evidence. Each
closed backed north segment now lowers to29px; corner caps followN1/N4 and
backed/open door cuts only thelow wall. North/South/West/East labeled groups
each have4buttons, stacked at320. Parent reviewed renderer/template/validator
changes and closed-backed/allbacked/320 captures; independently reran focused
browser validator PASS and separate pixel test: all4 actualcheckboxes change
onlytheir north segment, north-shell rawbytes restore, backedN2opening correct.
Layout/seat-sources/asset-contract/prepared-metadata hashes remain unchanged.
Canvas floor readback can vary during browserGPU/CPU transitions; exactrestore
assertions apply to north-shell pixels, not an unsupported wholecanvas claim.
Prior candidate furniture/floor comparison and source hashes preserve art.
New source/delivery723115bytes SHA256:
D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB.
Approvalnull/runtimefalse, allprevious room approvals preserved. Next: owner
review the corrected controls; no remaining repair milestone or runtime changes.


## Radiology Reading Room — design approved, backup authorized (2026-10-07)

Owner: "Okay, that is approved. Push to GitHub". Approves corrected4×4 candidate D574AA0FC11292D8A2F8A92A3BA082C8755B00067A99066FDAD3BA30C72EB1BB,723115bytes. Receipt: tools/room-design/level-4/radiology-reading/approval-2026-10-07.md. Frozen review-time metadata remains unchanged and is superseded for design approval by this receipt. Runtime integration remains separate. Current source/delivery hash and focused layout/browser checks independently PASS on October7. Scoped reading-room backup on beta in progress; unrelated shared work excluded. Next: verify remote checkpoint and record branch/commit.
