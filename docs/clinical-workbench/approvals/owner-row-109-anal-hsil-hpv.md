# Owner approval — row 109 anal HSIL and high-risk HPV

- Date: 2026-08-31
- Reviewer: Melissa Rowland, MD
- Approval ID: `approval.melissa-rowland-md.owner-row-109.2026-08-31`
- Workbook provenance: `Gamify Surgery Concepts (4).xlsx`, Sheet1 row 109,
  `owner-concept.sheet1.row-109`.
- Stable concept: `concept.anal-hsil.high-risk-hpv-association`
- Release point: `release.l0.clinic_evaluation`, off-site-pathology review only;
  actively implemented in the development-preview runtime.

## Immutable approval boundary

Melissa Rowland, MD approved exactly the four patient-linked versions below.
The key appears first only in this review receipt; runtime independently
shuffles every presentation. Each question scores only the stable concept.
Any wording change or new variant requires exact named-clinician re-review.

The scope uses anal HSIL, with historical high-grade AIN terminology where
helpful. It teaches the etiologic viral association only: persistent high-risk
HPV is the association; HIV is a risk context and, in 3A and 3B, an incorrect
answer. The receipt does not imply that every HPV infection is HSIL and does
not teach a screening or treatment decision.

## Exact approved versions

### 3A

A patient’s biopsy shows anal high-grade squamous intraepithelial lesion (anal
HSIL; historically high-grade AIN). Which viral category is etiologically
associated with this lesion?

A. High-risk human papillomavirus
B. Human immunodeficiency virus
C. Hepatitis C virus

**Answer: A.** Anal HSIL is HPV-associated; this does not mean every HPV
infection represents HSIL.

### 3B

A patient with anal HSIL asks which virus is etiologically linked to this
dysplastic lesion. Which answer is appropriate?

A. High-risk human papillomavirus
B. Human immunodeficiency virus
C. Epstein–Barr virus

**Answer: A.**

### 3C

A solid-organ transplant recipient has off-site pathology confirming anal
HSIL. Which viral category is directly associated with the dysplastic lesion?

A. High-risk human papillomavirus
B. BK polyomavirus
C. Cytomegalovirus

**Answer: A.** Immunosuppression is patient context; high-risk HPV is the
lesion’s viral association.

### 3D

Patient with a prior vulvar HSIL is evaluated for a new anal squamous
intraepithelial lesion. Which persistent infection is the shared oncogenic
association?

A. High-risk human papillomavirus
B. Herpes simplex virus type 2
C. Epstein–Barr virus

**Answer: A.**

## Source metadata and atomic claim map

The following records support targeted factual verification and citation only.
No source prose or full text is stored. Authority is distinct from reuse status.

| Source ID | Citation and official locator | Accessed | Source class / authority | Reuse status and intended use | Supports |
| --- | --- | --- | --- | --- | --- |
| `source.stier.ians-anal-screening.2024` | Stier EA, Clarke MA, Deshmukh AA, et al. *International Anal Neoplasia Society’s consensus guidelines for anal cancer screening.* Int J Cancer. 2024;154(10):1694-1702. doi: [10.1002/ijc.34850](https://doi.org/10.1002/ijc.34850). | 2026-08-31 | IANS consensus guideline; high authority for anal-HSIL terminology and screening-context limits. | Copyrighted guidance; targeted factual verification/citation only; independently written content. | `claim.anal-hsil.hrhpv-association`, `claim.anal-hsil.no-screening-decision` |
| `source.cdc.hpv-basics.current` | U.S. Centers for Disease Control and Prevention. *About HPV.* Updated July 3, 2024. Official locator: [CDC HPV](https://www.cdc.gov/hpv/about/index.html). | 2026-08-31 | U.S. public-health guidance; high authority for HPV cross-check. | U.S. government guidance; targeted factual verification/citation only; independently written content. | `claim.anal-hsil.hrhpv-association` |
| `source.nih.nci.hpv-cancer.current` | National Cancer Institute. *HPV and Cancer.* Updated May 9, 2025. Official locator: [NCI HPV and Cancer](https://www.cancer.gov/about-cancer/causes-prevention/risk/infectious-agents/hpv-and-cancer). | 2026-08-31 | U.S. government cancer guidance; high authority for HPV cross-check. | U.S. government guidance; targeted factual verification/citation only; independently written content. | `claim.anal-hsil.hrhpv-association` |

| Claim ID | Independently written atomic claim | Category / limitation | Review status |
| --- | --- | --- | --- |
| `claim.anal-hsil.hrhpv-association` | In the approved pathology-follow-up scope, anal HSIL is associated with persistent high-risk HPV; HIV can be a risk context but is not the etiologic viral answer tested here. | Etiologic-association teaching only; does not equate all HPV infection with HSIL or determine an individual patient’s lesion. | `needs_clinician_review`; the exact approved Q/A wording above is the clinical approval. |
| `claim.anal-hsil.no-screening-decision` | The approved questions begin after pathology is available and make no screening, referral, interval, capacity, or treatment decision. | Product/release boundary; IANS screening recommendations are deliberately out of scope. | `needs_clinician_review`; the exact approved Q/A wording above is the clinical approval. |

## Runtime boundary

The exact approved variants are actively implemented in the development-preview
Level 0 release at `release.l0.clinic_evaluation`. The independent source and
atomic-claim prose remain `needs_clinician_review`.

## Implementation authorization — 2026-08-31

The exact four approved variants above are authorized for additive admission to
`release.l0.clinic_evaluation`. This authorization does not approve the
independent source or atomic-claim prose, which remains
`needs_clinician_review`.
