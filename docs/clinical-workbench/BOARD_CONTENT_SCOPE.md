# Board-content scope guide

Verified 2026-09-10; celiac and new-batch scope checked 2026-09-11. This is coverage provenance for editorial planning, not
clinical guidance, an exam-question source, or permission to reproduce source
content.

## Decision order

Prioritize an explicit General Surgery SCORE topic, then documented ABSITE/QE
category emphasis, then a care setting that the game can represent honestly.
Do not infer board relevance from a plausible clinic presentation or from a
test-dependent game flow.

## SCORE General Surgery scope

- **SCORE-GS-2025-26** — Surgical Council on Resident Education (SCORE),
  *General Surgery Curriculum Outline | 2025-2026*, public curriculum outline,
  [ABS landing page](https://www.absurgery.org/resources/score-curriculum-outlines/score-curriculum-outline-for-general-surgery/) and
  [official PDF](https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf),
  accessed 2026-09-10. The document identifies itself as the 2025-2026 edition;
  see printed p. 1 (physical PDF p. 2). The introduction says the outline is
  updated annually. The PDF endpoint is versionless, so record its displayed
  edition and access date with every future use.
- Direct-download verification: 27 physical PDF pages; SHA-256
  `2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
  The authorized download was used only for targeted verification; no PDF or
  raw excerpt is stored in this repository.
- Intended use: identify broad residency-curriculum scope and stated depth. It
  does not state an ABSITE question frequency.
- Rights/access: public, copyrighted SCORE/ABS material; retain links and short
  original factual mappings only. Do not copy tables, use the SCORE Portal, or
  use protected examination content.

Current SCORE uses the visible labels **Common** and **Uncommon**. Common covers
material for which a graduate should be able to provide comprehensive care;
Uncommon covers material for which a graduate should at least diagnose and
initially manage.
ABS's CE page separately uses Core and Advanced. Preserve each source's terms;
do not assert a formal equivalence or convert either label into an unverified
claim about individual exam questions.

### Urinary-stone audit

| Candidate / topic | SCORE locator and depth | Scope conclusion |
| --- | --- | --- |
| `concept.nephrolithiasis.noncontrast-ct-evaluation` | No explicit urinary stone, ureteral stone, renal calculi, nephrolithiasis, urolithiasis, kidney/renal stone, or metabolic-evaluation topic in the current outline. | **Supplemental**; do not describe as explicitly SCORE-mapped. |
| `concept.nephrolithiasis.recurrent-metabolic-evaluation` | Same absence; neither recurrent-stone prevention nor metabolic evaluation appears as an explicit topic. | **Supplemental**; retain existing content without an explicit SCORE claim. |
| Acute urinary retention | Genitourinary, Diseases/Conditions, printed p. 18 / physical p. 19, Common. | Explicit related GU scope, but not evidence that stone evaluation or prevention is included. |
| Upper and lower urinary-tract injuries | Trauma, Diseases/Conditions, printed p. 13 / physical p. 14, Common; urinary-tract-injury repair is in Trauma Operations/Procedures, printed p. 14 / physical p. 15, Common. | Explicit trauma scope; do not generalize it to nontraumatic stones. |
| Nephrectomy | Genitourinary, Operations/Procedures, printed p. 18 / physical p. 19, Uncommon. | Explicit procedure scope only; it does not map the two stone-workup concepts. |

The two existing nephrolithiasis concepts should therefore be marked
`retain-existing/supplemental` in future planning. This means only that the
current public outline does not explicitly name their teaching points; it does
not support a claim that they are never tested.

## ABS examination context

### September 11 celiac scope review (GS-011-007)

`concept.celiac.initial-serology` has no explicit celiac, tTG or total-IgA topic
in the reviewed public SCORE 2025–2026 outline. The broad Small Intestine heading
(printed p. 6 / physical p. 7) does not establish a specific serology mapping.
Retain this existing concept as supplemental. This finding does not establish
that celiac disease is never tested. Clinical appropriateness and curriculum
coverage are separate questions; the existing clinical content remains unchanged.
See the [source review](../execplans/concept-expansion-source-review-2026-09-11.md)
for the NIDDK cross-check and the exact scope finding.

The September 11 expansion maps every new concept to a named general-surgery
family or procedure in its [editorial review](approvals/owner-delegated-board-expansion-2026-09-11.md).
Specific diagnostic and management details are marked as inferred within that
explicit family instead of being mislabeled as separately named SCORE entries.

### Exam documents

- **ABS-ABSITE-2021** — American Board of Surgery, *General Surgery
  In-Training Examination (ABSITE) Content Outline*, public examination content
  outline, [official page](https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/),
  document signal `Updated 01/2021`, accessed 2026-09-10. Intended use:
  category-level context only. It targets about 72% SCORE Patient Care, 24%
  SCORE Medical Knowledge, and 4% Other; about 80% Clinical Management and 20%
  Applied Science. Its Genitourinary category has a 1% target. Targets are
  approximate and are not per-topic frequencies.
- **ABS-QE-2021** — American Board of Surgery, *General Surgery Qualifying
  Examination (QE) Content Outline*, public examination content outline,
  [official page](https://www.absurgery.org/resources/exam-content-outlines/general-surgery-qualifying-examination-qe-content-outline/),
  document signal `Updated 01/2021`, accessed 2026-09-10. Intended use:
  category-level context only. It targets 80% Patient Care and 20%
  Surgical/Medical Knowledge. Genitourinary is grouped with plastic surgery,
  gynecology, and nervous system in a combined 4% Surgical Specialties category;
  the outline gives no GU-specific weight.
- **ABS-GSCE-current** — American Board of Surgery, *General Surgery
  Certifying Examination*, public exam-information page,
  [official page](https://www.absurgery.org/get-certified/general-surgery/certifying-exam/),
  publication date undated, accessed 2026-09-10. Intended use: scope, not
  frequency. It describes diagnostic evaluation, therapy, clinical reasoning, and surgical judgment;
  it says the majority of its content is SCORE Core, with Advanced topics or
  complications comprising the remainder. It supplies no topic weights.

All three ABS documents above are public copyrighted official material used only
for targeted scope verification; no reusable license is asserted. ABS says
ABSITE content is aligned with SCORE, but its examination contents are
copyrighted and must not be reproduced or disclosed. No question, recalled
item, or question-bank material belongs in this repository.

## Required record for a future concept

Record the target exam(s), precise SCORE PDF locator/topic/depth, SCORE category,
and relevance as `explicit`, `inferred`, or `supplemental`. Keep clinical sources
separate from coverage sources. When a clinical encounter warrants it, use a
purposeful evaluation -> returned result -> management/complication sequence;
do not add a test merely to create gameplay gating.

For each new batch, reread the owner's live **Gamify Surgery Concepts** sheet in
Google Drive → Research → Gamify Surgery Research. The owner adds rows
intermittently. Use a bounded live read to identify candidates and verify their
clinical keys independently; a saved prior-batch snapshot is not the current
candidate list. Do not edit or copy the sheet wholesale without authorization.
