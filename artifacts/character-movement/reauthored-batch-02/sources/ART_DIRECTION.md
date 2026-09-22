# Batch 02 — approved designs on the accepted shared gait

Latest owner-feedback revision uses unchanged generated source PNGs with larger
arms, shaped torso row envelopes, inward South thumbs, and complete braid crown
selection. Final fitted manifest SHA256:
be69cfe393a8a5eeb896eb3e92d1b97efe0c53f5c673fc140ea49a06e7372d32.
This supersedes the earlier y43 crown-cutoff approach below. Original rounded
crown is retained with margin; bounded E/N/W pixel exclusions remove only the
detached source outline runs, reviewed against original-source crown proof.

2026-09-12. Owner accepted pilot bd090ff4 and authorized two additional examples.
No runtime integration or full-roster conversion. Built-in image_gen used for
identity-preserving animation layers; approved originals remain immutable.

Final fitted batch manifest SHA256:
18439dc47d03dccdfa82dbc397a767e4a64f2e41d47f45707f43f3aebeb0c890.
Final original-head cleanup uses the crown-following East polygon and West
top edge y43, followed by complete East/West rebakes; no frame-specific paint.
Seated source crops x1000/y20/210x310 exclude neighboring poses, axis110.

## Sources and identity

- Cardigan: `Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png`, patient.adult.046,
  SHA256 fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63.
- Gray braid: `Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png`, preview key retained.gray-braid;
  roster has no verified runtime identity. SHA256
  1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4.

Selected generated source copies:

- cardigan-rig-ready-v1.png from exec-94294653-d9b0-4679-a28c-2fa173d67687.png.
- braid-rig-ready-v1.png from exec-668701da-5851-4b76-bab8-795d00cdd61c.png.

Generated originals retained under the thread .codex/generated_images directory.
These are complete source surfaces, not final motion frames. Original per-view
heads replace generated heads. Braid mask must retain full original hair while
excluding the original jacket; torso donors contain no duplicate braid.

## Prompt set and corrections

Identity-preserve production prompt: exact approved face, hair, clothing,
palette and proportions; 1536x1024 atlas, six columns by four rows. Rows
South/East/North/West, columns full reference, head plus armless torso core,
complete anatomical left arm, right arm, left leg plus shoe, right leg plus shoe.
Complete hidden shoulder/hip fabric overlap, slim relaxed arms, anterior thumbs,
connected hands/feet, both profile shoes face travel, no sockets or armstubs.
Flat magenta extraction background, no grid/text/shadows/checkerboard.

Cardigan correction: remove sleeves/stubs from all column-two torso cores;
solid hidden fabric, preserve width/collar/buttons/hem. Correct West right shoe
to face left and North shoes to show heels, not front laces.

Braid correction: remove below-neck hair from all torso cores and reconstruct
matching jacket/blouse, retaining column-one references. Correct profile shoes.
Final targeted prompt flipped row-two column-six entire leg to face right.
Inspection still finds row-four column-six shoe facing right: local complete-leg
reflection with matching rig coordinates is required for West; never detach or
independently flip only the foot.

## Reusable acceptance gates

Pin original and atlas hashes. Measure full source bounds, anatomical joints,
actual sleeve cap and cuff/sole separately. Fit each body to approved proportions;
share motion semantics, not prior characters' pixel anchors. Keep arm width
consistent, stable torso, contralateral eight phases and connected rigid shoes.
Inspect thumb orientation per donor/view. Far arm behind legs in lateral views;
BOTH arms behind torso in North/South walking per owner steering. Standing shoulder
caps seated under torso. Original head seated on neck with direct overlap;
guide uses identical registration. Verify neutral plus 01/03 before full bake,
then all eight phases on light/dark background and motion at display scale.
Original sitting remains an explicitly labeled reference, not a new seated rig.
After the owner's frontal-layer correction, accepted pilot baseline a70e4915
remains byte-identical throughout this batch.
