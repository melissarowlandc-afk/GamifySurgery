# Endoscopy scale comparison provenance

This comparison preserves the accepted Endoscopy occupied-bed sizes: 205 px high in the South view and 110 px high in the East view. It embeds the exact packed bed frames and registration metadata from `tools/room-design/endoscopy-layout/`; the comparison does not resize either bed to fit a character.

## Approved P01 stills

The four character stills come from the `patient.adult.001` entries in `artifacts/character-statics/gs-018-v1/coverage-manifest.json`, where each is marked `parent-visual-approved`:

- `artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/stand-west.png`
- `artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/sit-west.png`
- `artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/stand-south.png`
- `artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/sit-south.png`

All four source frames are 160 x 320 px. Their shared authored axis is x=80 and their floor/sole anchor is y=287. The comparison uses one scale for all four stills, so standing and seated figures retain their authored size relationship.

## Live runtime calibration

The live calibration cells are copied losslessly from P01 column 0, row 0 of:

- `apps/player/public/assets/characters/patients-left-idle-v1.png`
- `apps/player/public/assets/characters/patients-front-idle-v1.png`

`apps/player/src/facility/characterPresentation.ts` produces a 162 x 243 px presentation cell at a 120 px tile. `FacilityScene.drawFacilityPatient` passes Endoscopy's default `displayScale` of 1, and its actor container adds no bitmap scale. The source floor anchor is y=181 in the 128 x 192 cell. The side-idle label deliberately avoids asserting a visual West-facing direction because that legacy cell visibly faces right.

## Provisional approved-still mapping

The live P01 has a 171 px visible source height. At the runtime cell scale, its visible height is `171 * 243 / 192 = 216.421875 px`. The approved standing still has a 287 px visible height, so the comparison scale is:

`216.421875 / 287 = 0.7540831881533101`

This is a comparison-only mapping pending integration/registration of the latest approved stills. It is not a runtime scale decision. The 120 px tile outline, common 220 x 300 px internal canvases, and shared floor baseline make the bed and character proportions directly comparable without independently fitting any image.
