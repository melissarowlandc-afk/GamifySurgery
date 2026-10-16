# Third character: apply the approved fitting process

## Goal
Owner approved Green and Gray braid and requested another character, with fewer
owner corrections each time. Produce a faithful third-character review using
the approved motion/action system and make the learned acceptance checks reusable.

## Scope and constraints
Stand/walk South/East/West/North, South star jump and clipboard, four static
sitting directions. Preserve original identity/head at native proportions;
prepare separate torso, arms, legs and any hair accessories. No whole-image
stretch-fill. Existing Green/Gray code and generated outputs are frozen.
Local owner preview only; no game integration, roster rollout, commit or push.
Preserve unrelated dirty work in the beta checkout.

## Approved baselines
Gray manifest e954be5d89fedea444381c51ec7c5441ffa55e336452223b81e3a079a24989a2.
Green directional 7c8ebc5615ad3bd425957376acc1fc99a523e9a024bc1fb6e6bdcf835ee45932.
Green actions 40ec1233e16bc52650817646b564da7fed669ac1a99f2cd738e8aa79e7b3dc59.

## Learned acceptance gates
1. Exact original face/hair coverage: compare crown, chin, neck and side outlines
   on light and dark backgrounds. No rectangular exclusions through anatomy.
2. Source proportions: compare full original and fitted standing in each view.
3. Arm-free torso; correct sleeve elbow curvature and thumb facing independently.
   Far shoulder/hand behind opaque trunk; near cap covers socket without rings.
4. Shoes use actual authored seam, no duplicated trouser stub; ankle at heel,
   cuff-to-shoe overlap, rear heel supports visible trailing cuff throughout
   both E/W cycles. Use character-specific measured anchors, not Gray offsets.
5. Check all eight E/W frames at enlarged scale, including clean leg closeups;
   never accept contact-point metadata alone as proof of visible attachment.
6. Preserve shared cadence/gait, floor contact and jump endpoint. Sitting garment
   needs authored folds when its hem obscures the lap; snap transitions allowed.
7. Original identity stays rigid. No torso duplication, matte/checker remnants,
   unintentional seams, head clipping or shoulder gaps. Parent visual gate before
   owner preview; don't claim automated tests establish appearance approval.
8. Safe preview: decode gate, internal clock, finite indices, pause/scrub/speed,
   all directions/actions, optional separate chair, 320/736 layout, under1MB.

## Milestones and ownership
1. Sol action_pose_design: bounded read-only roster/source inventory and next
   character recommendation. Parent chooses and prepares any missing art.
2. Delegate character assets/adapter and core validation. Prefer measured config
   and reusable checks; don't refactor approved characters while adding this one.
3. Parent independently reviews original-vs-fit, all directions and actions,
   enlarged profile leg/arm frames and validation evidence; return defects.
4. Delegate compact source/new/approved comparison preview; parent independently
   validates browser behavior and updates handoff for owner review.

## Progress and next action
Owner approval of Gray recorded. Sol inventory active. Next choose candidate,
inspect original references, prepare parts and delegate implementation.

## Selected character and preparation
Selected patient.adult.032, Gray overshirt: short dark hair/beard, gray rolled
sleeve overshirt, cream tee, dark jeans, brown shoes, watch on anatomical left.
Original Photos for Codex 2/Patients or Staff or Other Characters/
exec-33437146-564e-4cb1-a7e2-ad41504ea752.png,
SHA b1fc32d443e65c5dcae0237ed51cbdc6838ef37a83fce9eefb0b5a254286d670.
Reusable base atlas artifacts/character-movement/reauthored-pilot/sources/
gray-rig-ready-v1.png, SHA ee1cdc49ee7ab74471c3883475be95a632a5f49a3006d86da357ff75dd67999e.
Measured profiles tools/character-mapping/reauthored-pilot/source-profiles.json.
Parent inspected both images: reuse base torso/arms/legs, keep original heads.
Sol owns base adapter/preparation/validation in new gray-overshirt folder and
gray-overshirt-v1 artifacts. Parent generating missing seated/clipboard limbs
with built-in imagegen, source referenced. No new base-generation needed.
Watch handedness and rolled-sleeve/forearm articulation are extra visual gates.

## Base gate completed
Parent accepted original head light/dark proof, then reviewed source-vs-fit,
E/W/N full cycles and enlarged shoes/knees. Internal review corrected watch
side to actual source (West near watch, East near bare), measured shoe seams
S203/E438/N678/W920 rather than copying Gray's85%, cropped trousers separately
from asymmetric shoes, removed triangle hairlines and closed knee gaps with
overlap inside continuous leg mask. These are transferable preparation lessons.
Parent independently passed validate-overshirt-v1.mjs:32 grounded deterministic
walks,21237 exact original-head pixels,229315 retained atlas pixels,64 cap checks,
288 shoe checks and32 watch checks. Core base pin
a413e7d17b745102a870ce9c41e43c0a895611cf3e48bdc1ea311ecfb1695a1b.
Sol now owns action adaptation with frozen base frames. Action PNG generated
built-in at exec-2d634fbd-f888-4046-a0b0-a9625e4a0ed5.png, copied as
gray-overshirt/assets/overshirt-action-parts-v1.png (1619x972 true alpha).
Actual full prompt saved action-parts-v1-prompt.txt; parent inspected and accepted
separate bent arms/seat lowerbodies. Next: review all action poses, then UI.

First action gate: clipboard and seats accepted for ownerreview. Parent rejected
jump arms shrinking to roughly half standing length under inherited projection.
Keep shared jump phases/body/legs, but calibrate raised arms to a steeper V inside
160px frame so actual limb length stays consistent. Base frames remain frozen.
Add action limb-length consistency to reusable acceptance checks.

Final core visual gate accepted after steeper-V jump correction. Parent viewed
all action sheets and independently passed base/action validator:13 deterministic
actions,4 grounded/4 airborne jump frames,exact standing endpoint,4 seated floor
checks,20 action anchor checks. Original action alpha retained. All36 base frames
unchanged. Final core pin
211af7304f28f908dc58b315c15a8452fad0d79b4a2e9c5868f560b1ae92d763.
Terra owns new gray-overshirt-character-fit.html and builder/browser validator.
Next: parent review actual UI and independently validate, then owner review.

UI draft built by Terra,848701bytes atWebP75 after parent requested improved
preview fidelity. Parent final source/code review caught false South watch
metadata: atlas's left-listed component visibly carries watch, but rig labelled
right donor as watched. Actual South walk/jump watch was wrong-side versus
original/actionposes. Terra owns focused physical donor correction, actual wrist
pixel evidence, intentional South baseline pin update and UI refresh. E/W/N,
sitting and clipboard must remain unchanged. This visual check overrides earlier
metadata-only watch assertions; record measured source accessory regions.

Final South correction accepted after parent rejected watch hidden behind torso:
swapped actual South arm donors, watch donor now left-listed source component;
South arms/forearms render in front of torso, consistent with Green lesson.
Parent viewed4x source-wrist/standing/jump proof with visible viewer-right watch.
E/W/N, sit/clipboard remain unchanged; South base/jump intentionally updated.
Parent independently reran core validator PASS. Final core manifest
df451d8cf9d97209749aea6558a56d2224a7c0a086bc960b45f3f0bca07c7ec6.
Terra refreshing UI finalpin and adding accessory/foreground lesson to guide.

## Completed for owner review
Final preview gray-overshirt-character-fit.html854201bytes atWebP75. Parent
inspected final browser screenshot and independently reran browser validator
PASS (decode gate, malformed RAF, pause/scrub/speed, directions/actions, jump
completion, chair and320/736layout). Final core validator also independently
passed32walk/13actionframes andsourceidentity/foot/accessory checks.
Reusable fitting-review.md includes source accessory verification and foreground
South forearms. Sol performed inventory/base/actions; Terra packaged/reviewed
and corrected final South accessory/layering. Parent owned art preparation,
visual gates, actual code review and independent validation. All authorized
implementation complete; next action owner visual feedback. No game integration,
commit/push. This is a local GitHub-backup checkpoint.
