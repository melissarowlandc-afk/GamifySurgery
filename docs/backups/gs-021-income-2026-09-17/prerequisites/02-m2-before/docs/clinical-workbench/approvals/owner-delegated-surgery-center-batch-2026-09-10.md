# Owner-delegated surgery-center development batch review receipt

- Reviewed on: 2026-09-10
- Reviewer: Astra primary agent, under owner delegation
- Authors/integrators: Terra and Sol workers, under owner delegation
- Clinical sign-off: none
- Clinical review status: `needs_clinician_review`
- Content version: `development-batch.2026-09-10.1`

This receipt records technical, editorial, source-traceability, and internal-consistency review for the twenty concepts below. The latest user authorization is recorded in the [surgery-center source brief](../../execplans/surgery-center-source-brief-2026-09-10.md):

> “Independently create, approve, and implement 20 concepts that are applicable for the surgery center. You can continue using my spreadsheet, or your can come up with your own concepts of patients appropriate for the surgery center on highly tested ABSITE and general surgery concepts”.

The 2026-09-10 wording and timing revision follows the owner's additional direction:

> "Natal cleft" shouldn't show up in the question stem but instead be described for the player to interpret.

> Every time there are answer choices that can have testing, there needs to be a time listed for how much time that test will take.

The timing revision is presentation-only and is tracked in the [patient wording and answer test-times plan](../../execplans/patient-wording-and-answer-test-times.md). It does not change result gates, scheduling, evidence claims, or clinician-review status.

This delegates implementation and editorial approval for this surgery-center batch. It remains a local `synthetic_unapproved_prototype`, with no public release authority or named-clinician sign-off. A named clinician must review each record before clinical approval. The batch contains 20 concepts, 80 variants, 40 two-node cases, and 32 result gates. The onsite endoscopy route uses 180 editorial simulation ticks, including a final non-resource-bound return/report phase; existing frozen 120-tick pending results remain unchanged.

## Concepts

1. `concept.thyroid-nodule.fna-selection`
2. `concept.thyroid-nodule.follicular-invasion-histology`
3. `concept.primary-hyperparathyroidism.biochemical-confirmation`
4. `concept.primary-hyperparathyroidism.symptomatic-surgery-assessment`
5. `concept.inguinal-hernia.equivocal-exam-ultrasound`
6. `concept.inguinal-hernia.symptomatic-elective-repair`
7. `concept.anal-fissure.acute-recognition`
8. `concept.anal-fissure.initial-conservative-care`
9. `concept.internal-hemorrhoids.anoscopy-evaluation`
10. `concept.internal-hemorrhoids.office-banding-selection`
11. `concept.esophageal-dysphagia.upper-endoscopy`
12. `concept.barrett-esophagus.intestinal-metaplasia`
13. `concept.achalasia.high-resolution-manometry`
14. `concept.achalasia.manometric-recognition`
15. `concept.pigmented-skin-lesion.complete-diagnostic-biopsy`
16. `concept.melanoma.sentinel-node-staging`
17. `concept.postoperative-seroma.ultrasound-characterization`
18. `concept.postoperative-seroma.uncomplicated-observation`
19. `concept.pilonidal-disease.chronic-sinus-recognition`
20. `concept.pilonidal-disease.off-midline-closure-planning`

## Canonical production file hashes

Hashes use UTF-8 without BOM after normalizing CRLF to LF. The expected set is exactly the twelve files below.

| SHA-256 | Path |
| --- | --- |
| `8689f462e5f76a7f7477e302707e982897a3db891f7c831cec2ed04cc7b2c939` | `packages/clinical-content/src/development-batch/2026-09-10/batch-helpers.ts` |
| `997f3ed67a7e267fee977c7070df5ecf74525100d37230ba9d5aca00c4e764c5` | `packages/clinical-content/src/development-batch/2026-09-10/thyroid-nodule.ts` |
| `20994c571fe13776ef70460622965f5dea867b21b2b7a6ff7403009907276639` | `packages/clinical-content/src/development-batch/2026-09-10/primary-hyperparathyroidism.ts` |
| `7aac476ca950787acce3743f4cb868f2995eb24ea2dc9faed39650b253e607d3` | `packages/clinical-content/src/development-batch/2026-09-10/inguinal-hernia.ts` |
| `fa2c540f6ca2bb504f7c1a513f0ca10fa2155fdee04663226f201bee996f2838` | `packages/clinical-content/src/development-batch/2026-09-10/anal-fissure.ts` |
| `667a1bb2fae09ae5751e3aefe2c5e4ec30d2c9dc5b28387f2dad28764948e4a2` | `packages/clinical-content/src/development-batch/2026-09-10/internal-hemorrhoids.ts` |
| `714e68d26fa76447c2c3593ce9a1a6dba63a6b6ec3345565278732b51a053fab` | `packages/clinical-content/src/development-batch/2026-09-10/esophageal-dysphagia.ts` |
| `69ede140743fcaa8768ce80d17ff89bac8fe4c5a545d2ef808575dc9adb868b8` | `packages/clinical-content/src/development-batch/2026-09-10/achalasia.ts` |
| `856efd75322d671c2fce01c8c5cef0e86f3ced45adf0b44e48f991b8ca5115a5` | `packages/clinical-content/src/development-batch/2026-09-10/pigmented-skin-lesion.ts` |
| `be194edda71c7f999e0e1f09cc0c1848c5c9fab2630eb77eebdda987e5702e90` | `packages/clinical-content/src/development-batch/2026-09-10/postoperative-seroma.ts` |
| `2997ffa9adf31d7ac56abfb9eabe127532613c2090218388c56364cb8e885118` | `packages/clinical-content/src/development-batch/2026-09-10/pilonidal-disease.ts` |
| `5de413be03fb4c14e03877e4d42a4e0df5369d5f3bc3cbe547822638e1cfe49f` | `packages/clinical-content/src/development-batch/2026-09-10/surgery-center-batch.ts` |
