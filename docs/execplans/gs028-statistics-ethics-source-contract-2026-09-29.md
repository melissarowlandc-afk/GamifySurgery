# Statistics and ethics source/authoring contract

September29,2026. Original factual synthesis; not clinician approval. Governing
plan: gs028-statistics-ethics-2026-09-29.md. New records need clinician review.

## Curriculum mapping

Target exams: ABSITE and general surgery QE. Fresh official linked outlines both
show Updated01/2021. ABSITE physical p3 explicitly names Biostatistics and
Evaluation of Evidence, Outcomes, Ethics; QE physical p2 lists these under
Surgical/Medical Knowledge, Miscellaneous Topics. Category alignment is explicit;
the selected individual test/ethics objectives are inferred within those
categories. Do not claim individual exam frequency or exhaustive exam coverage.

- https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/
- https://www.absurgery.org/resources/exam-content-outlines/general-surgery-qualifying-examination-qe-content-outline/

Sources above are copyrighted public curriculum metadata, factual scope only.
No new SCORE download, private module, recalled item, paid bank or textbook corpus.
The active223-objective bank has no dedicated statistics/ethics/QI objectives.
The deferred PDSA meaning must retain its stable ID; its new draft does not
inherit clinical approval from an older approved record. The existing GCS V-NT
language-barrier scenario has a different objective and remains unchanged.

## Statistics methods and numerical data

NIST/SEMATECH e-Handbook and NIST Dataplot are primary federal methods sources.
Use specific pages for each atomic claim; undated pages have null publication
year rather than invented dates. Dataplot rank-sum/signed-rank pages show last
updated2023. Parent/reviewer directly checked these pages:

- https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm
- https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm
- https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm
- https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm
- https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm
- https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm
- https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm
- https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm
- https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm
- https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm
- https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm

Specify design and relevant assumptions. Paired t concerns normally distributed
differences; signed-rank needs independent symmetric paired differences and
suitable measurement. Rank-sum concerns independent samples/distributions, not
an unconditional median comparison. ANOVA uses independent observations and
appropriate within-group normality/variance assumptions. Fisher concerns sparse
contingency information, not a universal total-sample cutoff. Do not present two
valid tests as competing keys without specifying the intended analysis.

P-values condition on the null model and concern at-least-as-extreme data; they
are not the probability the null is true or the effect matters. Confidence
coverage is a repeated-sampling property, not a posterior probability for a
fixed parameter. Nonsignificance does not prove equivalence. Power depends on
the specified alternative/design; preserve type-I/type-II directions.

CDC Field Epidemiology Manual, current website chapters (original underlying
methods may be older), for designs, risks/odds, bias and confounding:
- https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html
- https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html

CDC archived Principles of Epidemiology, Lesson5 AppendixA (last reviewed2012),
for sensitivity/specificity/predictive denominators:
https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html
Use source facts only; do not reproduce its table or adapted examples.

Cochrane Handbook chapter15 for NNT, comparator/outcome/time horizon and rounding:
https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15
Copyrighted targeted factual verification, not an asserted reusable license.
Authored numbers are explicitly fictional study/project datasets, independently
calculated, never real medication/disease-effectiveness claims. Show all needed
denominators and observation periods. Interpret NNT as expected comparative
benefit, not a guarantee that exactly one of every N individuals benefits.

## Ethics and communication

AMA current Code opinions (undated when page does not state publication):
informed consent2.1.1, adults lacking capacity2.1.2, withholding/withdrawing5.3,
patient safety8.6, colleague impairment9.3.2, research consent7.1.2,
confidentiality3.2.1. Base: https://code-medical-ethics.ama-assn.org/ethics-opinions/
Use original short factual claims; copyrighted professional guidance is not
automatically reusable prose. Do not turn ethical guidance into universal law.

- ASA Committee on Ethics, Statement on Ethical Guidelines for the Anesthesia
  Care of Patients with Do-Not-Resuscitate Orders, reaffirmed October18,2023
  (original approval2001), plus AMA Code opinion5.4 DNAR:
  https://www.asahq.org/standards-and-practice-parameters/statement-on-ethical-guidelines-for-the-anesthesia-care-of-patients-with-do-not-resuscitate-orders
  https://code-medical-ethics.ama-assn.org/ethics-opinions/orders-not-attempt-resuscitation-dnar
- AHRQ LEP safety guide chapter2, original2012/reviewed2020:
  https://www.ahrq.gov/health-literacy/professional-training/lepguide/chapter2.html
- HHS OCR interpreter FAQ, reviewed2015:
  https://www.hhs.gov/civil-rights/for-individuals/faqs/may-an-lep-person-use-a-family-member-as-an-interpreter/index.html
- HHS OHRP QI FAQ (older nonbinding guidance; current definitions require
  institution-specific review):
  https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html

Interpreter cases: stable elective setting, actual language discordance, no
assumption language implies incapacity, qualified interpreter before meaningful
consent. Entire presentation body Spanish with coherent generated identity;
English task/choices and feedback allowed. Do not teach a categorical family
interpreter prohibition or translate the patient before the interpreter action.
Consent is a voluntary understandable discussion, not a signature alone.
Capacity is decision-specific; capable refusal alone is not incapacity.
Surrogate follows patient values then best interests when unknown, with no
invented legal hierarchy. DNR requires reconsideration, not automatic suspension.
Disclosure includes candid communication and safety response without speculative
blame/compensation promises. Impairment requires immediate patient protection and
appropriate assistance, not stigma for a safe accommodated disability. Research
participation is voluntary; care cannot be contingent on enrollment. Publication
alone does not decide QI versus research; seek appropriate institutional oversight.
Confidentiality scenarios must state facts making permission/exceptions clear.

Rights correction: parent found the ACS site explicitly prohibits incorporation
into AI tools. The initially considered ACS statement is excluded from source
records and claims; no further retrieval. ASA and AMA primary guidance were
independently read and support the perioperative resuscitation discussion.

## Quality improvement

AHRQ Digital Healthcare Research PDCA/PDSA tool and VTE improvement guide ch6:
- https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle
- https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html

Teach adapting/adopting/abandoning and retesting based on observed results, not
automatically rolling out every intervention. Distinguish process, outcome and
balancing measures; do not label a metric without context. Funny fictional
projects may use mascots/clipboard hunts/reminder signs, never mock patients.
Federal pages are recorded conservatively as factual verification unless a
specific reuse notice is verified. No figures/prose copied.

## Version and verification

Every substantive claim needs complete source metadata, supported claim IDs,
limitations and checked date; sources/claims link both ways. Single-source
methods or older guidance limits remain explicit. Content/runtime review must
verify exactly one key, meaningful variants, units/calculation correctness,
no longest-key clues, early eligibility, ordinary patient language formatting,
employee identity/location and no fees for employee learning. Exact roster,
fingerprints and acceptance will be recorded after implementation, not assumed.

Additional September29 targeted primary verification: NIST Dataplot McNemar Test
(https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm)
supports the paired-binary distractor boundary. FDA, Antibody (Serology) Testing
for COVID-19: Information for Patients and Consumers, predictive-value FAQ
(https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers)
independently verifies PPV/NPV prevalence directions. Only the underlying
statistical relationship is used; no COVID clinical recommendation is authored.
Both are factual verification records, no prose/tables reproduced.
