# Fuller planted beds after manager review

Built-in imagegen made two precise-object edits on 2026-10-08. Targets were the
reviewed west/east v2 PNGs; concept 05 was viewed for direction only. Complete
generated originals and exact submitted prompts are retained here. No API/CLI,
purchase, concept extraction or hand-painted postprocessing was used.

Dense unequal foliage mounds fill the soil aperture, with white/pink bloom
clusters, clean pale rim and stone face. Runtime v3 PNGs are still 512×160 with
anchor (256,160), displayed at 1.55T×0.484375T and sidewalkTop+0.50T. All alpha
is contained within that existing envelope/rear sidewalk band; no new plant
sprites, foreground shadows, room/tree art or scene geometry.

Runtime paths:

- apps/player/public/art/environment/frontage-v2/bed-west-v3.png
- apps/player/public/art/environment/frontage-v2/bed-east-v3.png

The active eleven-piece kit now binds the two v3 beds plus the existing nine
v2 lawn/grass/surface assets. Reviewed v2 beds and the original kit provenance
remain byte-exact for comparison and reproduction. Run
`python tools/exterior-frontage-v1/refinement-20261008/export_beds.py` to reproduce
only the v3 exports, provenance and proofs. It reuses the original uniform-fit
export routine; it never paints or replaces alpha.

provenance.json records original/prompt/export SHA-256 hashes, native anchors,
alpha bounds, edit-target hashes and the preserved old-kit inventory. Proofs
compare both versions at native size and actual reduced pixels at T=24,52,41,
37,27,20,7. Zoom examples use the declared offline 920×325 / 64×40 fixture;
live browser tile sizes/DPR must be recorded separately. At T=27 (70%), the
foliage mound and white/pink masses separate from the clean rim and stone face.

Fresh QA at origin 5183 is separate from owner play at exact 127.0.0.1:4173.
Validation and the beacon-free entry-inset check's status are recorded in the ExecPlan.
Manager owns final acceptance. No Git/install/push/deployment.
