# Character fitting review

Use one character-specific adapter over the approved shared gait. Keep source art and generated part atlases immutable, and record their hashes in the output manifest.

1. Extract each original head at native scale. Remove only checker pixels connected to the crop boundary. Keep crown, chin, beard, neck, glasses, and hair edge pixels; use no rectangular anatomy exclusions.
2. Measure the torso, sleeve cap, hand end, hip, authored trouser-to-shoe seam, heel, and sole from actual visible pixels. Calibrate the character's own shoulders and garment width instead of copying another character's absolute offsets.
3. Keep the torso and head rigid. Map complete limbs from measured source anchors. In profiles, draw the far arm behind the opaque torso and the near arm in front. Preserve accessories on their anatomical side.
4. Cut profile shoes at their authored seam. End the trouser on a horizontal shoe-entry section with a small overlap, and register the heel under the trailing cuff while preserving the floor contact.
5. Review source-versus-fit stands, heads on light and dark fields, every East/West/North phase, and enlarged leg extremes. Metadata checks support this review but do not replace it.
6. Add action-specific art only where the base pieces cannot make a natural pose. A seated garment needs authored folds if its hem hides the lap; the chair remains a separate prop.
7. Prove accessories from their source-pixel region, then verify the rendered pixels at the intended visible wrist. For South-facing poses, redraw the full forearm and hand above the torso when a lower-wrist accessory would otherwise be occluded.

Acceptance requires exact retained RGB, rigid source heads, complete head coverage, natural source proportions, covered shoulder sockets, correct thumb/elbow/toe direction, no matte fringe, grounded shoes, and deterministic frames.
