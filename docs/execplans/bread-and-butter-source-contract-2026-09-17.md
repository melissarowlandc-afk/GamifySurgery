# Bread-and-butter batch authoring contract

Root editorial direction, September 17, 2026. Twenty original objectives with four
variants each. Clinical status remains needs_clinician_review; no clinician sign-off.
Use separate 2026-09-17-bread-and-butter files and BREAD_BUTTER_20260917 exports.

## Roster and encounter structure

1. Groin management: informed watchful waiting for minimally symptomatic men with
   reducible inguinal hernia; timely elective repair evaluation for stable reducible
   femoral hernia. Eight single-step cases. Not the existing symptomatic repair or
   equivocal-groin ultrasound objectives.
2. Hernia anatomy: indirect sac lateral to inferior epigastric vessels; isolated
   anterolateral thigh sensory change localizes to lateral femoral cutaneous nerve.
   Four two-step postoperative visits reviewing an operative report and symptoms,
   without invented testing or elapsed surgery during the encounter.
3. Cutaneous abscess: ultrasound for genuinely equivocal examination; drainage of
   a returned discrete superficial collection. Four two-step diagnostic pathways.
   Distinct from lactational breast abscess; no universal no-antibiotic teaching.
4. Wounds: open/drain superficial incisional infection with intact fascia; visible
   bowel through a wound requires moist protection and immediate emergency transfer.
   Eight single-step cases. No outpatient test delay for evisceration.
5. Perianal abscess: prompt drainage of clinically evident superficial abscess;
   no routine antibiotics after adequate drainage in healthy patients without
   cellulitis/systemic illness. Eight single-step cases, with drainage already
   completed before the second objective's visit. No fictitious diagnostic gate.
6. Urinary retention: postoperative bladder scan; catheter decompression of clearly
   large symptomatic retention. Four two-step diagnostic cases. Exclude trauma.
7. Breast: image-guided core of an imaging-suspicious accessible solid mass;
   no routine excision of a stable asymptomatic concordant fibroadenoma without
   atypia, phyllodes concern or patient preference for removal. Four diagnostic
   pathways. Distinct from initial imaging, simple cysts, Paget and IBC sequencing.
8. Ileostomy: renal/electrolyte/magnesium assessment of stable high output;
   sodium-glucose oral rehydration rather than increasing plain water. Four
   diagnostic pathways, excluding shock, significant AKI, infection or obstruction.
9. Preoperative medication: continue a tolerated chronic beta blocker; interrupt
   warfarin without heparin bridging in selected nonvalvular AF without recent
   stroke/high-risk exceptions. Four same-visit two-step medication reviews.
10. Postoperative prophylaxis: do not prolong prophylactic antibiotics solely for
    a drain; selected high-VTE-risk abdominopelvic cancer patients can receive an
    extended approximately 28-day LMWH prophylaxis plan. Four same-visit two-step
    reviews, low bleeding risk and adequate renal function, no universal rule.

Expected total: 52 cases / 80 nodes; 28 two-step and 24 single-step encounters;
16 true diagnostic result gates. Clinical appropriateness takes precedence over
adding unnecessary tests. Every diagnostic choice, including distractors and
surveillance, gets a central runtime estimate. Durations remain game placeholders.
Reuse existing services/profiles where appropriate. No fabricated clinical cutoff.

## Presentation and evidence

Chief complaints 1–5 words, brief complete questions, specific named-patient
templates, runtime age/sex and coherent character profiles (four per case).
No test names in initial prose when that test is being selected. Parallel answer
choices with comparable length/specificity; do not make keys uniquely verbose.
Questions randomized at runtime. Original atomic claims support teaching and
explanations, with complete source/reuse/authority metadata and honest limits.

Owner sheet was read live on September 17, 2026 using native read-only metadata
and bounded ranges Sheet1!A1:F3 and A140:F180. Last modification September 11;
158 populated rows. Rows 2, 142, 150 and 151 informed candidate selection;
clinical sources independently verify and narrow these ideas. No spreadsheet edits.

Public ABSITE outline (2021 edition, official ABS URL) confirms relevant hernia,
skin/soft tissue, anorectal, breast, perioperative, fluid/electrolyte, infection and
coagulation domains; it does not establish individual question frequency.
SCORE 2025–26 public outline verified from official PDF, SHA256
2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09:
physical pages 3 (hernia), 8 (ileostomy), 9 (anorectal), 10 (breast),
19 (acute urinary retention), 23 (perioperative/VTE/wound care). No proprietary
SCORE modules, question banks or textbooks used. Do not infer depth from plain
PDF text that loses formatting.

Source packets in ignored .local-dev are research aids, not production provenance.
The final batch must contain complete verified metadata/claim mappings. Root
rejected thin additional-source metadata; Sol completed verification and corrected
the CHEST DOI, anatomy citations and license details. Inaccessible ASCO 2020
full-recommendation support was replaced by the retrievable SEOM 2024 guideline,
with ASCO 2023 as an agent-options cross-check. Root directly retrieved the AHA
2024 official slide PDF through its current science-news hub: the valid path is
/Science-News/2/2024/2024-Guideline-for-Perioperative-Cardiovascular-Management-slide-set.pdf,
physical page 87, recommendation 1. Unsupported Nightingale reuse metadata was
replaced by directly verified BIFA/BAPEN 2023 and 2025 society guidance.

Immutable pre-edit release: .local-dev/bread-butter-baseline-20260917.json,
163 concepts / 398 cases / 623 nodes. Expected integrated 183 / 450 / 703.
