# Blue Glasses source generation

Built-in image_gen mode; source is patient.adult.039, original
`Photos for Codex 2/Patients or Staff or Other Characters/exec-492d528d-52f8-422a-a1dc-fe63b3cd04cb.png`,
SHA248c1222bef1cd5333b870c9179c6182966b6d47fd266da69a88bec70cedb420.
Parent viewed the original and standard upper layout before generation.

- `upper-generated-v1.png`: exec-ddddbf75-06cb-4b81-91b1-c1178908873f.png.
  Exact prompt in `upper-generated-v1-prompt.txt`. Original character + standard
  upper layout references. Use rows2–5 for sleeves/forearms only; generated row1
  retained sleeves and is rejected as a trunk source. Inspect actual anatomy,
  not requested row labels. Sleeves rolled near elbow; forearms bare.
- `seated-generated-v1.png`: exec-626aacc2-b6cc-4ebd-ba1a-50da87590b0f.png.
  Exact prompt in `seated-generated-v1-prompt.txt`. Four complete seated bodies
  S/E/W/N; original source reference. Parent inspected identity/clothing/poses.
- `torso-generated-v1.png`: exec-315ed2a6-d4f7-49b5-b015-bd44dc4fdcab.png.
  Exact prompt in `torso-generated-v1-prompt.txt`. Four opaque arm-free trunk
  sources S/E/W/N, original source reference. Use if original extraction lacks
  full cloth; normalize to ownstatic torso proportions, not generated neckwidth.

All selected generated files copied into this project; originals retained at
the tool-generated location. No API/CLI generation used. Head identity and
standing poses must retain original source pixels, not these generated faces.

## Sleeve correction
First assembled walk revealed upper-v1 sleeves ended too high: original low
rolled cuffs sit nearly at belt height with short bare wrists/hands. V1 arms
are superseded, not accepted. Corrected `upper-generated-v2.png` derives from
exec-d19f813a-a06a-44f6-910f-5c247d338a7f.png; exact prompt in
`upper-generated-v2-prompt.txt`, same original/layout references. Upper-arm
rows are cloth throughout; forearm rows own low rolled cuffs and hands.
Inspect and correct actual thumb direction independently of requested row labels.
Row1 is still rejected; continue separate arm-free torso donor/original torso.
