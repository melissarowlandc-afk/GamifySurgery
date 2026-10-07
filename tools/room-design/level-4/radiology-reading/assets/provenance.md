# Radiology Reading Room artwork provenance

Owner direction2026-10-03: four cubicles arranged exactly like the Severance
office, similar colors, but dark room. All artwork below is provisional and
generated with builtin image_gen, transparent_background=true. No CLI/API key,
downloaded show artwork or clinical teaching source is used as project art.

Visual layout reference inspected in browser (not copied to repo):
https://www.surfacemag.com/articles/severance-workplace-set-design/
and its overhead desk photo. Primary set-decorator reference:
https://www.setdecorators.org/sites/setdecorators/pdf/SEVERANCE-Rev-8-25.pdf
(accessed2026-10-03). Four offset rectangular desk arms form a clockwise
pinwheel around small core; NWchairS, NEchairW, SEchairN, SWchairE. The game
view adapts camera/scale/lighting; not a technical replica of production set.

In-repo style references: SurgeonOffice office-desk-height-02.png and
office-chairs-alpha-02.png. Existing artwork stays unchanged.

## Preserved originals

- reading-island-01.png: initial4desk island. Exact prompt in sibling
  reading-island-01.prompt.txt. Original builtin output:
  C:/Users/rowla/.codex/generated_images/01a0ca1d-9c4b-7921-847b-5a7b20244b12/exec-9527135c-98c9-45eb-a4c9-3595bfcbd3c9.png
  SHA256 E926F3E0CB0E4DA7D2CDA3548328D4EC4F6C1EB947E5EC33BA8BD348AA64AF0A.
- reading-island-02.png: builtin edit of01, longer desk bases for uniform80px
  seated worktop calibration and SE monitor facing its south chair. Exact
  prompt reading-island-02.prompt.txt. Original:
  C:/Users/rowla/.codex/generated_images/01a0ca1d-9c4b-7921-847b-5a7b20244b12/exec-88471dcd-208c-461d-83c4-f29f68fe0214.png
  SHA256 D54860AA5579D078DCA018726E07D9E4803795E99F9318405A0E002B2ACFA230.
- reading-chairs-01.png:4matching cardinal swivel chairs. Exact prompt
  reading-chairs-01.prompt.txt. Original:
  C:/Users/rowla/.codex/generated_images/01a0ca1d-9c4b-7921-847b-5a7b20244b12/exec-9a2c06bd-7fb0-4692-b181-bcb2bf1aa387.png
  SHA256 327FAA6145AA27B1C9BC0821D256600BA0F8273D9AF6E1747866BEFD7151B015.

Parent visually inspected all outputs. Island02 is the selected candidate;
its SE worktop-to-foot difference is approximately260nativepx, with uniform
80px-rise scale~.3077 and overallwidth~323px. Exact measured native landmarks
must be documented in proof contracts rather than treating this estimate as
physical collider geometry. Chair views are S/N/E/W in TL/TR/BL/BRquadrants.

Outputs retain unwanted diffuse exterior alpha despite transparent requests.
Proof preparation may isolate measured connected opaque silhouettes with native
canvas component masks and preserved original alpha at their immediate edges,
as in prior GS015 packing. Document thresholds/seeds/crops/kept pixels and
inspect result; preserve all original PNGs byte-for-byte. No Python image edit,
redrawing/stretched sprites or altered character source. Renderer depth masks
must come from source pixels and preserve real occlusion, not guessed blockers.
