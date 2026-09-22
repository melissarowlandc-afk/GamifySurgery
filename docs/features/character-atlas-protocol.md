# Standard character atlas protocol v1

> Latest owner review rejects the current fitted walking quality. Keep this v1
> specification as a historical baseline; do not expand it across the roster.
> Whole-body static production is accepted separately. The replacement walking
> experiment is in `../execplans/walking-appearance-reset.md`: complete limb
> drawings by phase, with visual approval required before rollout. Existing
> technical checks do not establish natural-looking joins or source resemblance.

This protocol defines one fixed parts layout and one anatomical contract for every layered character. The layout and slot IDs are immutable under `character-atlas/v1`. A future incompatible change requires a new schema version. The protocol standardizes semantics and attachment behavior; each character keeps its own measured proportions, art, landmarks, and bone lengths.

## Fixed pages

Every cell is 256×256 with at least eight transparent pixels of padding around visible art. Direction columns always appear South, East, West, North.

| Page | Dimensions | Rows |
|---|---:|---|
| `upper` | 1024×1280 | arm-free torso; anatomical-left upper arm; anatomical-right upper arm; anatomical-left forearm+hand; anatomical-right forearm+hand |
| `lower` | 1024×1536 | anatomical-left thigh; right thigh; left shin; right shin; left shoe; right shoe |
| `identity` | 1024×768 | exact original head+nape; optional back hair; optional front hair |
| `actions` | 1024×1024 | optional seated torso; required seated lower body when sitting is enabled; optional seated left arm; optional seated right arm |
| `clipboard` | 512×256 | South anatomical-left arm; South anatomical-right arm |

The blank PNGs in `tools/character-mapping/standard-atlas/templates` are import canvases. The labeled PNGs are visual references and must never be used as art inputs. `standard-atlas-v1-layout.json` is the machine-readable slot map.

Sitting does not require duplicate art when the base torso and two-bone arms make a natural pose. A sitting-capable manifest must provide all four seated-lower slots. Any omitted seated torso or seated arm override must declare a `base-slot` or `articulated-chain` fallback naming the actual base slots used.

## Anatomy and projection

Left and right always mean the character's anatomical sides:

| View | Anatomical left | Anatomical right | Depth |
|---|---|---|---|
| South | screen-right | screen-left | both frontal |
| North | screen-left | screen-right | both behind torso |
| East | far | near | left behind torso, right in front |
| West | near | far | left in front, right behind torso |

Accessories attach to an anatomical part. A watch declared on anatomical left remains on that forearm in every view, even when the arm is hidden. Mirroring a part never transfers or duplicates an accessory.

## Authored landmarks

Every non-empty slot supplies source provenance, a source crop, visible bounds, and the landmark set required by its slot type. These points are authored from anatomy and the actual pixels; the importer does not replace them with alpha centroids.

- Torso: two neck-socket edges, both shoulder sockets, and both hip sockets. An optional authored `body.axis` marks the visible trunk center near the hips; when present, the renderer centers the trunk on this point and registers the head to the transformed neck socket separately. Measure this point from retained cloth pixels, not from the neck midpoint or the crop bounds.
- Head: two neck-base edges plus crown and chin coverage points. Exact opaque pixels must match the original source. Garment and collar pixels do not belong in the head mask.
- Upper arm: shoulder, elbow, and `orientation.outerElbow`. In profile this marker means the posterior cuff/elbow edge (behind the direction of travel), rather than an arbitrary biceps silhouette edge. South and North use the anatomical outer edge. Runtime checks compare its transformed position with the facing direction as well as its declared sign.
- Forearm+hand: elbow, anatomical wrist at the palm root, hand end, thumb tip, and anterior marker. A watch center is an accessory point, never the wrist joint. The generated Overshirt watch-band center was initially used as a wrist; it made the anatomical-left hand about nine runtime pixels longer than the right. Check the palm root in the actual source at native resolution before annotating it.
- Thigh and shin: both joint endpoints and an outer-surface marker.
- Shoe: a left-to-right horizontal sole baseline, anatomical ankle, rear/front entry edges, rear heel, toe tip, and sole contact. The baseline is the packing axis; ankle-to-toe is never used as a normalization axis because its slope can rotate otherwise upright art.
- Seated parts: waist, seat, sole, shoulder, elbow, wrist, hand-contact, and thumb landmarks appropriate to the slot.

Each oriented bone declares the sign of its surface marker relative to the authored start-to-end axis. This lets the renderer reject a donor whose endpoints fit but whose elbow, palm, thumb, or trouser surface faces backward.

Each part records its source path, SHA-256, crop, derivation method, and prompt or original-source lineage when applicable. Accessories include their ID, anatomical side, source landmark, and source ROI where available. One accessory ID may occur only once in each mutually active pose set and view. Base, seated override, and clipboard art are separate pose sets, so the same anatomical watch can be authored once in each without being treated as a duplicate.

## Import and packing

Image generation may return any canvas dimensions. The source does not need to use 256px cells. Inspect and measure each source part, then pass its authored crop and landmarks to `packAtlasPageV1`. Every part type has an immutable canonical anchor, rest axis, default length, and fit padding in `REST_PLACEMENT`. A character may supply only `targetLength` to preserve its measured proportions; it cannot move the canonical attachment or choose a different rest axis. Torso and head center their authored neck seam at `(128, 48)` and `(128, 196)` respectively, independent of seam width. Every shoe uses its authored horizontal sole baseline and the same left-to-right canonical axis. Toe, heel, and ankle landmarks retain anatomical direction separately.

Treat generated source sheet row labels as requests, not evidence. Verify each actual sleeve cap, thumb, heel and clipboard bend at native resolution, then assign crops to the immutable anatomical destination slots. Brown Beanie's South/North forearm rows, profile-leg columns and clipboard pair arrived in different orders from their prompts. Check original trouser/boot color and width against generated parts before packing, and register seated waist to the torso's visible pelvic axis rather than a leg or source-cell midpoint.

The legacy South pose geometry calls screen-left `left`, while atlas parts use anatomical-left (screen-right when facing South). Convert the pose side at the geometry-to-atlas boundary for *both* arms and lower parts; North already agrees with atlas anatomy. Verify South mapped left hip is to the right of mapped right hip, South source left leg/shoe remains on screen-right, and North left hip/source is on screen-left. This catches inward toes caused by otherwise valid but exchanged source boots.

Exact identity slots are stricter. Head and separate hair layers must be packed at scale 1, rotation 0, and integer translation so canvas resampling cannot alter source RGB or soften the crown and chin. Their authored seam length therefore becomes `targetLength`. Runtime placement may translate the packed identity layer by integer pixels but never scale or rotate it.

The packer applies one uniform scale, one rotation, and one translation. It never applies independent X/Y scales, mesh deformation, or inferred joint placement. It checks landmarks only against alpha inside the declared source crop. Before drawing or clipping, it transforms every visible source pixel and rejects a part that would lose pixels beyond the padded slot. This prevents an oversized crown, shoe, or sleeve from appearing valid merely because clipping hid the error.

The packer transforms every landmark and accessory point with the same matrix and records the normalization transform. Character-specific authored bone lengths remain data in the manifest. Pose code consumes these lengths and landmarks; adding a character must not require character-specific pose branches.

`rigidBoneTransform` maps a source bone to a target bone with a similarity transform. `solveTwoBoneIK` returns the elbow and reachable wrist for explicit upper-arm and forearm lengths and a declared bend sign. The upper sleeve includes a complete shoulder cap and hidden elbow underlap. Garment construction determines cuff ownership: a rolled short sleeve keeps its cuff on the upper arm over the distal forearm, while a long sleeve keeps its wrist cuff on the forearm+hand part and overlaps plain cloth at the elbow. Clip heavy source cut borders inside the hidden elbow overlap instead of showing a false joint ring. Do not put collar pixels on an upper sleeve cap.

Lower sampling must use `loadNormalizedLowerParts` when the packer scales or rotates source parts. It transforms the source crop and nominal trouser rectangle into their actual packed-page bounds; source-pixel rectangle arithmetic applies only at scale 1 with no rotation. `drawNormalizedLowerLeg` maps a bent trouser quad through two affine triangles so its fourth corner reaches the actual knee/ankle edge. It seals their shared diagonal under the unchanged outer quad clip and retains a single affine draw for straight near-parallelograms. Measure texture width and boot size from the character's original sheet; the old renderer's source scale is only its approved default, not a universal source-pixel dimension.

`createStandardCharacterRenderer` consumes only packed slot IDs and character profile data. `standardWalkArmProjection` owns the shared direction projection, rearward profile swing reduction, and phase deltas; character adapters supply measured bone lengths, sockets, and numeric projection scales rather than branching on pose anatomy. South/North depth swing uses a small pose-dependent uniform projection scale on both arm bones, so wrists travel relative to fixed shoulder sockets without a large sideways elbow bend. Anatomical bone lengths remain fixed in the profile; their two-dimensional projected lengths vary together. Verify both wrist travel and lateral elbow range from rendered poses. Optional back/front hair is drawn only when its registered midpoint matches the head's packed canonical neck midpoint. Because exact identity and hair slots use scale 1, rotation 0, integer packing, this common midpoint makes the same integer runtime head translation valid for all identity layers. The shared `prop` callback executes at the immutable prop layer.

Shoulder sockets and distal hand targets are separate fit measurements. Moving a shoulder inward must keep the accepted wrist path in screen space, then verify the **rendered hand end** as well as the wrist; rigid arm orientation can move fingers even when the wrist target is fixed. Profile shoulders can be registered higher while preserving source-relative cuff/hand height by measuring the true upper-bone reach. This requires source-versus-fit shoulder, cuff and hand proofs rather than moving the whole arm as one image.

`standardStarJumpArmTarget` and `solveStraightTwoBone` define the reusable South star-jump rule: the two bones remain collinear at fixed character-authored lengths through gather, takeoff, raise, open, lower and recover, mirrored by anatomical side. The last frame is the exact South standing endpoint. New characters use the same stage directions with their own lengths; check every actual rendered frame for straight elbows, continuous sleeves, margin and floor contact.

## Layer order

The executable schema exports fixed orders for South, North, East, West, all seated views, and South clipboard. The default lower renderer executes once before upper-body composition and is responsible for its own far/near leg order; the empty lower role callbacks do not claim per-leg dispatch. Profiles render the far arm behind the opaque torso and the near arm in front. When a profile swing crosses the trousers, use the renderer's opt-in deferred lower layer and explicit `farArm → lower → torso → nearArm` order so the upstage hand cannot appear through either the trunk or legs; existing characters retain the default order byte-for-byte. Validate with actual far-arm/lower and far-arm/torso pixel intersections, then compare against the same composite with the far arm omitted. South renders complete upper sleeve caps behind the torso, then distal forearms/hands in front, then only a narrow source sleeve-cuff underlap in front to seal the elbow. The cap is not globally repainted across the torso. North keeps arms behind the torso. Back hair precedes the torso/head as defined, and front hair follows the exact head. A semantic layer-ID buffer should accompany the color render during validation so occlusion claims can be checked directly.

When the original sheet has usable trunk pixels, extract an arm-free torso from that source before generating a replacement. Preserve the collar, shirt details and native RGB, and mask both sleeves/hands at the actual cloth seam. Record original trunk width, neckline-to-hem height, body-axis row centers and shoulder/cuff/hand heights separately. A new generated torso must be compared against those source proportions before its uniform fit is accepted.

If a profile torso mask leaves only the exposed front strip or a vertical sleeve boundary, the source cannot provide the missing back cloth. Use a source-referenced, sleeve-free torso donor in the same fixed slot, then register its visible pelvic center to the original trousers and compare actual alpha widths at chest and hem. Measure source hand-end height relative to the garment hem before changing arm reach: Brown Beanie's source hands end only about 11 pixels below its hem, so broader sleeve art corrected the small-arm appearance without an excessive wrist extension.

## Validation and visual review

Run:

```powershell
node --test tools/character-mapping/standard-atlas/standard-atlas.test.mjs
node tools/character-mapping/standard-atlas/generate-templates.mjs
```

The linter checks immutable slots, page dimensions and hashes, required capability parts and fallbacks, fixed padding, required content bounds, finite landmarks, alpha proximity, non-collinear orientation markers, source provenance, accessory ownership, pose-local duplicates, blank unused slots, and required layer order. Runtime validation must additionally check transformed thumb and toe direction, elbow-marker sign, two-bone lengths, joint alpha overlap, neck continuity, shoulder-cap coverage, cuff-to-shoe entry coverage, sole contact, render margins, and semantic occlusion. Midpoint agreement alone cannot prove a profile neck is visually aligned: verify source-relative nape and collar edge overlap. Compare the combined source-to-packed and packed-to-runtime **uniform scales** of anatomical-left and right parts in every view and action override; packed-to-runtime scale alone can falsely report a size difference. South/North wrist travel should be measured relative to shoulders across all phases, with a lateral-elbow limit, so body bob cannot masquerade as arm motion.

Visual review remains required. Review exact heads on light and dark backgrounds, source-versus-fit proportions, all eight East/West/North walk frames, South walk, enlarged joints and shoes, full jump, all sitting directions with chair context, and clipboard contacts. Automated validation does not establish appearance approval.

Exact RGB checks of retained head pixels do not reveal pixels omitted by a mask. Mark mandatory crown, chin, beard and nape pixels on the **original source** before extraction; require their mask alpha and their appearance in every rendered pose. For torso-to-trouser contact, sample the composed alpha through the actual hem/pelvis seam and compare visible cloth/trouser centers at rest. A walking trouser cross-section shifts with the stride, so evaluate its gap coverage separately from rest-axis registration.

For seated profile lower art, annotate the actual center waist rather than the rear seat edge, then invert the recorded atlas normalization rotation and scale when registering the packed part to the torso pelvic axis. Verify the combined source-to-packed and packed-to-runtime matrix has no residual rotation or shear, waist x meets torso axis, and both soles meet the floor. A translation-only inverse can shift East/West seats even if the packed sheet looks correct.

Long-sleeve forearms own the wrist cuff and hands; upper sleeves end in plain cloth at the elbow. If a generated source adds a dark cut band there, mask only that source endpoint before packing, preserving the broader opaque sleeve. Compare source and assembled sleeve strips after head registration; an envelope width alone can hide a skinny arm behind a wide torso.

For continuous profile trouser art, split donor crops with opaque overlap on *both* sides of the annotated knee. Brown Beanie uses 155 shared source rows around its knee; a 15-row overlap normalized to runtime gives only about 2px of underlap against a 9–10px half-width trouser. Register each segment to canonical hip/knee/ankle without frame-dependent four-corner texture shears. A fixed transverse width calibration can retain the original cloth thickness; individually round-clip thigh and shin and tuck the full shin ankle behind the boot. Measure an original whole-body walking donor at the same 1x head scale before choosing the multiplier and clip width: Brown's original East donor has independent 22/27px shin runs, while the accepted rigid fit spans 19–24.5px across all phases. Verify isolated knee/shin alpha and mid-bone width across all eight East/West phases, and keep at least one sole on the floor while the other follows the authored walking lift.

Author a profile hip or knee joint **inside** continuous opaque cloth, leaving enough real source fabric beyond the joint to hide beneath the adjacent garment after runtime scaling. A crop that merely begins at the joint can satisfy marker registration while leaving a transparent waist or knee gap. Validate the composed alpha vertically from the visible torso hem through each rendered trouser hip in all eight phases. Keep source-relative garment hem, palm-root wrist, cuff, and hand-end measurements together; do not compensate for a misplaced hem by lengthening the torso or compensate for a cuff marker by shrinking the arm.

Profile donor labels do not establish anatomy. Record the expected screen direction of the thumb and posterior outer-elbow marker independently, inspect the pixels at native resolution, and assign or reflect every affected landmark with the image. East requires thumbs forward to screen-right and posterior elbows to screen-left; West requires the inverse. Reusing one verified donor for both independently rigged profile arms is valid when the character has no side-specific accessory.

For South/North, inspect actual opaque trunk width and center at chest, waist and hem rows in every pose, independent of the declared neck and body-axis landmarks. Compare shoulder-to-cuff and cuff-to-hand heights with the source after head registration. Check visible upper-sleeve pixels continuously from the shoulder region through the cuff in stand, every walk phase, sitting, jump and clipboard; counting hidden shoulder-cap pixels alone can pass a floating cuff.

Review the *whole* assembled pose alongside numerical gates. In particular, source upper-arm slots must show a sleeve cap without a duplicated collar or lapel; check this on enlarged profile stands, walks and seats. Compare both arm sizes and elbow outline in clipboard, all jump phases, the distal hand path after shoulder changes, and source garment proportions. Automated PASS records attachment and pixel evidence; parent/owner visual approval remains separate.

## Repeatable next-character sequence

1. Pin the original source sheet by path and SHA-256. Extract the original head, nape, and any separate hair layers without garment pixels; do not regenerate the face.
2. Generate or draw against the labeled fixed-page templates. Keep the torso arm-free, use anatomical left/right rows exactly, keep upper arms separate from forearm/hands, and keep every direction in S/E/W/N column order. Use the [Gray Overshirt v2 prompts](../../tools/character-mapping/layered-pilot/gray-overshirt-v2/assets/generation-prompts.md) as the concrete reference; its source-referenced upper prompt and narrow cleanup edits are preserved beside the resulting images. The [action-parts prompt](../../tools/character-mapping/layered-pilot/gray-overshirt/assets/action-parts-v1-prompt.txt) shows the corresponding seated and clipboard request.
3. Inspect the returned source at native resolution. Record explicit crops, shoulder/elbow/palm-root wrist/hand, hip/knee/ankle, sole baseline, neck edges, orientation markers, accessories, and source component bounds. Mark the watch separately from the wrist. Do not infer anatomy from a percentage or centroid.
4. Pack those measured records with `packAtlasPageV1`, then run the atlas linter. Correct the source crop or authored point when padding, alpha, component, accessory, or orientation validation fails.
5. Supply only character profile measurements and calibration values to the shared renderer. Reuse `standardWalkArmProjection`, rigid two-bone chains, semantic layer order, registered identity/hair, and the established lower renderer rather than adding view-specific pose code.
6. Build every frame and run runtime validation. Then inspect source-versus-fit stands, all eight frames in every direction, enlarged neck/elbow/knee/cuff proofs, the complete jump, four chair-context seats, and clipboard contacts. Record visual approval separately from automated PASS output.

For high-volume future characters, begin with standing, four-direction walking, and four-direction sitting. Clipboard and star jump need art and review only for the founder characters that actually use those actions; Brown Beanie retains both as fitting practice and validation evidence.

Prefer a hybrid whole-body/rig workflow for future volume. Retain or create complete static whole-body images for approved stands and sits, preserving their silhouette and texture without decomposing them merely for consistency. Use the standardized anatomical atlas and rigid renderer for walking, where reusable motion and depth ordering provide the value. A character registry should record each static image's standing foot anchor or sitting seat anchor, shared head size/registration, palette or color-consistency reference, and the walking atlas/profile. Reuse good source whole-body views directly; generate only missing views and keep the exact face, hair or hat when identity art already exists. Static and walking representations must still meet at the same floor, body axis, head scale and garment colors.

### Whole-body static import

Before approving walking, render a fitted neutral standing pose beside the same
character's whole-body standing artwork in all four directions. Compare garment
width at chest, waist and hem, hip/thigh volume, and the resting hand position at
the same head scale and floor. Approved Green supplies motion references; the
character's own standing art supplies body proportions. Measure individual legs
as well as their combined silhouette so overlapping legs are not mistaken for
one broad thigh. Preserve that volume through every walking phase, inspecting
clipping at hips and knees and far-arm occlusion. North thumbs must visibly point
toward the body axis; verify the actual artwork before authoring thumb markers.
Keep the character's whole-body standing image visible beside paused walking in
the review. Joint registration alone is not evidence of appearance consistency.

### Approved upper recipe freeze

Once every walking upper body is visually approved, freeze the upper recipe
before correcting trousers or shoes. For every direction and phase, hash the
isolated head, torso and both arm canvases together with their part IDs,
matrices, solved shoulder/elbow/palm-root wrist geometry, thumb points and arm
projection targets. Pin the upper and identity atlas-page hashes as well. A
lower-body validator must recompute all of these records and compare them with
the immutable freeze; regenerating the freeze is an upper-body approval event,
not a normal build step.

Navy Vest establishes the concrete recipe. Its exact original head excludes
the garment collar while retaining crown, chin, beard, nape and neck pixels.
The torso is arm-free, registered from the source neckline and measured cloth
hem; generated profile cloth fills only the missing trunk area. Forearm anchors
sit at the palm root rather than the cuff edge. Thumb and posterior-elbow
directions come from inspecting the actual pixels, independent of donor labels.
Profile resting hands are compared with the whole-body static, then their walk
uses forward-biased travel. The semantic profile order remains `farArm → lower
→ torso → nearArm`, so later trouser-width work cannot expose the upstage hand.

For straight trousers, derive hip coverage from the actual opaque torso hem and
measure each leg independently along its bone normal. Keep cloth width separate
from shoe scale. Source `contentBounds` describe a packed component, not the
longitudinal hip/knee/ankle interval: crop texture length from joint landmarks
with small seam underlap, normalize only the cloth rows, and map each thigh and
shin once with an overlapping knee. This avoids repeated texture bands, crop
ledges and a broad thigh collapsing into a narrow shin. The cuff ends inside
the shoe top; horizontal shoe calibration may cover the cuff without changing
shoe height, sole contact or toe direction.

Profile depth offsets must translate a leg lane without changing its anatomy:
apply the same lateral offset to hip, knee, ankle and sole contact. Different
per-joint lane offsets can make the planted upstage knee hyperextend even when
the canonical gait is sound. For each single-support profile phase, measure the
signed knee displacement from the hip-to-ankle line in the direction of travel
and reject backward stance bends. Place the shoe by its authored ankle joint,
not by a content-box center or a later cuff-cover clamp. Then verify the authored
shoe ankle and rendered cloth ankle coincide, the cuff overlaps opaque shoe art,
and heel/toe direction and floor contact remain unchanged.

Owner approved the first-four whole-body static review on September17,2026
("Looks good!"). Green, Gray Braid, Gray Overshirt and Brown Beanie establish
the approved baseline for this hybrid process: complete standing/sitting artwork
and standardized anatomical atlas walking. Clipboard and star jump remain
founder-only requirements. Approved static registry SHA-256:
`5e9ba1ad208e1db6bdd1752939f43f6f684da4a9afcab0cdc2e074886959df54`.

The first-four static registry is rebuilt with:

```powershell
node tools/character-mapping/whole-body-static-v1/build-static-v1.mjs
node tools/character-mapping/whole-body-static-v1/validate-static-v1.mjs
```

For each character, crop the four original S/E/W/N standing cells with enough vertical space to include curved sole pixels. The current source cells begin at `(50,20)`, `(300,20)`, `(550,20)`, and `(800,20)`, each `240×330`. These originals contain a baked checkerboard despite opaque alpha. Remove only neutral pixels connected to the crop border, then retain the largest connected figure; do not globally delete bright pixels because white hair, moustaches, shirts, and shoe highlights are character art. Render the retained stand at exact scale `1` with integer translation, body axis `80`, and sole `287`, and verify every opaque output RGB value against its original source coordinate.

Import generated whole-body seated sheets from true alpha as four horizontal S/E/W/N cells. Choose one uniform scale for the complete body by matching the generated South seated content height to the original whole-body South seated reference, then translate only to body axis `80` and floor `287`. Record the natural seat marker rather than forcing it to a shared y value. Store source/prompt hashes, crops, content bounds, uniform matrices, head bounds, sole/body/seat anchors, output hashes, and all approved walking manifest and file hashes in `registry-v1.json`. Review the four-view stand and seat sheets plus an adjacent original-seat/static-stand/new-seat/frozen-walk comparison. Technical validation must count all 32 poses, preserve true output alpha and margins, report head-scale and seat-height variation, prove bright identity pixels survived extraction, and byte-check every frozen walking frame.

Measure the under-pelvis chair-contact row separately in every new seated source cell. Never copy seat coordinates from another character or force every direction to a prior character's runtime height; only the shared body scale, body axis, and floor contract carry across characters.

Before generating missing arms, measure the original shoulder, elbow, cuff,
palm-root and hand-end levels. Describe that garment coverage explicitly in the
prompt: rolled cuffs do not imply elbow-length sleeves. Reject donors whose
skin exposure changes the outfit. Compare neutral fitted arms to the original
standing figure before reviewing movement. Inspect extracted thigh and shoe
parts enlarged for neighboring hand pixels and duplicate feet; alpha and joint
checks alone cannot detect artwork from the wrong body part.

When original profile feet overlap, isolate one complete foreground shoe and
mark its ankle over that shoe's actual trouser shaft. Do not infer the ankle
from the combined feet's bounding box or use the other leg's shaft. Compare
heel and toe distances around the ankle before applying any width calibration;
an oversized rear extension is a failed extraction even if cuff coverage passes.

Brown Beanie reproduces the fourth atlas-first fit with one importer, one 49-frame/proof builder and one validation entrypoint:

```powershell
node tools/character-mapping/layered-pilot/brown-beanie-v1/prepare-beanie-v1.mjs
node tools/character-mapping/layered-pilot/brown-beanie-v1/build-beanie-v1.mjs
node tools/character-mapping/layered-pilot/brown-beanie-v1/validate-beanie-v1.mjs
```

Gray Overshirt v2 is reproduced with:

```powershell
node tools/character-mapping/layered-pilot/gray-overshirt-v2/prepare-overshirt-v2.mjs
node tools/character-mapping/layered-pilot/gray-overshirt-v2/build-overshirt-v2.mjs
node tools/character-mapping/layered-pilot/gray-overshirt-v2/validate-overshirt-v2.mjs
node --test tools/character-mapping/standard-atlas/standard-atlas.test.mjs
node --test tools/character-mapping/layered-pilot/gray-overshirt-v2/lower-v2.test.mjs
```
