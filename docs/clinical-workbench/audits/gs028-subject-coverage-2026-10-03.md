# GS-028 subject coverage audit — October 3, 2026

The owner requested twenty new concept groups chosen from subjects with little
or no existing coverage. The audit counted stable scored objectives rather than
question variants or patients. Before this batch, the active game contained
271 objectives; another 41 exported authored identifiers were outside the active
release. Those 41 were inspected for overlapping meanings before selection.
The combined 312 identifiers do not establish 312 clinically distinct meanings:
some legacy pilot records overlap active objectives.

Every active ID was manually assigned to one of the 44 ABSITE subject leaves.
Organ-specific cancer, imaging and management questions stay with their organ;
general mechanisms and decision frameworks use knowledge subjects. Secondary
tags and 15 ambiguous assignments are retained in the accompanying
[machine-readable audit](gs028-subject-coverage-2026-10-03.json).
These are editorial classifications. The official outline supplies the subject
frame, not a classification of repository IDs or individual-topic frequency.
A zero primary count does not imply that no question mentions that subject.
Equal subject shares are not a target.

The largest baseline subjects included Endocrine (28/271, 10.33%), Large
Intestine (25/271, 9.23%) and Breast (24/271, 8.86%). Surgical Critical Care,
Thoracic, Vascular Access, Anesthesia and Geriatric/End-of-Life each had zero
primary active objectives. Trauma had four (1.48%); Fluids/Electrolytes/Acid-Base
had two (0.74%). The 41 nonactive records added five Trauma identifiers but no
additional identifiers in the other six selected subjects. Their trauma topics
did not duplicate the new objectives.

## Selected batch

| Primary subject | Active before / share of 271 | Added | Active after / share of 291 |
| --- | ---: | ---: | ---: |
| Surgical Critical Care | 0 / 0% | 2 | 2 / 0.69% |
| Trauma | 4 / 1.48% | 4 | 8 / 2.75% |
| Thoracic | 0 / 0% | 4 | 4 / 1.37% |
| Fluids/Electrolytes/Acid-Base | 2 / 0.74% | 4 | 6 / 2.06% |
| Vascular Access | 0 / 0% | 2 | 2 / 0.69% |
| Anesthesia | 0 / 0% | 2 | 2 / 0.69% |
| Geriatric/End-of-Life | 0 / 0% | 2 | 2 / 0.69% |

The [source contract](../../execplans/gs028-coverage-gaps-source-contract-2026-10-03.md)
records the twenty stable IDs, source restrictions and clinical boundaries.
Each objective has four substantive variants and independent beginning access.
Hospital care is represented through appropriate referral or stable review of
outside records; it does not create clinic ICU, anesthesia, trauma surgery,
vascular-access surgery or chest-drain capabilities. Two clinically purposeful
access-ultrasound result pathways use the existing outsourced route.

Other gaps remain. Pediatrics requires the real later pediatric facility and
age-appropriate characters. Hospital operations and unsupported capabilities
were not forced into early clinic encounters to fill a zero count.

Current linked ABSITE and general-surgery qualifying-examination outlines were
checked October 3; both retain the January 2021 update label. Historical public
SCORE 2025–26 mappings retain their earlier verification date; this audit does
not claim a freshly verified 2026–27 edition. No recalled exam questions, paid
question banks, proprietary modules or copied source expression were used.

The live owner sheet was refreshed read-only through row 168, including guidance
columns I:M, with an empty checked tail through row 1000: 167 candidate rows.
No sheet mutation or raw private export was created. Clinical content remains
`needs_clinician_review`; editorial and technical acceptance are separate from
named clinician approval.

Independent final audit passed and was repeated by Astra. The active release is
291 concepts/856 encounters/1,135 nodes. After subtracting this batch, all old
271 concepts/778 encounters/1,055 nodes compare exactly to the protected baseline.
The JSON retains before/after active and generated shares for all 44 subjects,
the twenty new stable-ID mappings, exact hashes and actual eligibility fixtures.
Exported authored identifiers rise 312 to 332; the 41 nonactive records remain
unchanged. Generated Trauma identifiers rise 9 to 13, without treating overlapping
legacy pilot identifiers as separate clinical meanings.

Beginning ordinary supply rises 433 to 511 encounters and 121 to 141 objectives.
Stage-1 clinic and reachable-ultrasound fixtures each rise 668 to 746 encounters
and 227 to 247 objectives. Every new objective has at least two standalone
beginning cases and passes unseen/due selection individually. Future-due and
unresolved-case rules remain in force; arrival cadence and economics are unchanged.
Technical and browser acceptance is recorded in the
[dated receipt](../approvals/owner-delegated-coverage-gaps-2026-10-03.md).
