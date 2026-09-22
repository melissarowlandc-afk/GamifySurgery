# Canonical master body — review contract

Status: complete master pose set approved by owner on 2026-09-13, including
final South clipboard height at915cc7a0...fad7de9. Earlier pending review notes
below are historical. See the [successor handoff](../../handoffs/APPROVED_CHARACTER_SURFACE_FITTING.md).
This replaces character-by-character source fitting. Earlier accepted pilot
images are visual references, not permission to reuse their fitting exceptions.

## Geometry owns motion

One body definition owns proportions, topology, joint centers, left/right IDs,
hand geometry, foot geometry, head/neck connection, and per-view layer order.
All four eight-phase walks and static poses use that definition. Shins and
thighs are rigid segments; knee bending cannot become curvature along a shin.
Body surface regions have stable local coordinates for later skin/clothing
textures. Materials cannot change joints, phase targets or anatomical lengths.

Textures and accessories are separate inputs. Head/face artwork uses fixed
head-local coordinates. Front/back hair and garment extensions attach to named
anchors and declared layers. A costume that needs a new silhouette uses an
approved reusable garment attachment; it cannot smuggle in a new body rig.

## First review deliverable

- Plain, clothed-looking neutral mannequin with the approved stylized scale.
- Eight poses each for East, West, South and North; South standing and sitting.
- Contact/transition/passing/recovery phases visible with opposite arm/leg swing.
- Independent geometry overlay and manual phase selection, play/pause/resume.
- Clear native-resolution artwork without sprite crops or enlarged low-res tiles.

## Semantic acceptance

Check both numerical landmarks and actual images:

- Thigh/shin centerlines are straight; bending occurs only at the knee.
- Segment lengths are fixed in body space; projected shortening is explainable.
- Elbows keep the same anatomical bend direction throughout the walk; forward
  swing flexes more and rear swing approaches straight without hyperextension.
  Check signed bend direction, not only an unsigned angle bounded by 180.
- South standing leaves visible sleeve/arm contours beside the torso while
  preserving arms-behind-torso depth and relaxed shoulders.
- Heel/toe landmarks define foot orientation; South feet are parallel or mildly
  outward, never unintentionally inward. Shoes stay attached to ankles.
- Thumbs point forward with a medial bias: visible subtly in East/West and
  inward in South; North artwork shows the back of the hand with thumbs hidden.
  Diagnostic guides may still show the hidden anatomical landmark.
- Both arms remain behind torso for North/South; lateral far arm is behind legs,
  and both East/West legs remain behind the torso.
- Visible neck/chin-to-body contact exists, not merely hair-to-torso overlap.
- Complete crown and all limb extremities remain inside the canvas margins.
- Floor contacts, support/passing phase relationships and contralateral swing
  are coherent. Sitting has explicit bent knees and correctly attached feet.
- Pause holds phase, orientation and canvas pixels; static modes do not animate.

## Following proof (after master review)

Owner accepts walk/stand version c9ccf24d...18c309. Approval is still needed for
seated East/West/North and the added star-jump and clipboard poses. Review all
four directions for sitting/holding and eight phases per direction for jumping.
Jump foot contacts must distinguish grounded gather/landing from airborne
opening/star/closing. Hands rotate with the action; clipboard has fixed hand
grips and view-correct occlusion. These actions use the same anatomy and native
body scale; extra canvas padding is permitted to retain overhead hands.

Subsequent owner review accepts seated/jump actions from ebd077d0...dc359c.
Clipboard revision: anatomical left forearm supports the board underside;
anatomical right hand rests on the upper writing surface. Use common board
plane/support anchors and view-correct occlusion, never screen-left/right roles.

Owner's subsequent explicit correction controls clipboard rendering: facing
South, LEFT arm is in front of board and RIGHT arm behind it. Top edge is farther
away from torso (greater anatomical forward coordinate) than bottom edge in
East/West. Earlier opposite layering/tilt was rejected.

Green cardigan and Gray braid use identical canonical body geometry and poses.
Their material/attachment assets preserve the approved identity. Compare the
body/pose geometry hash across both costumes to prove actual reuse. Reject a
conversion that introduces private joint offsets, whole-head crop patches,
shoe mirroring exceptions or character-specific shin deformation.

No game integration or broad roster conversion until the two-costume proof is
accepted. A few later body archetypes may vary proportions under the same
contract; hundreds of distinct rigs are not the target.
