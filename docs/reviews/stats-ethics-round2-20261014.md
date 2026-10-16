# Statistics and ethics, round 2: audit and owner tone sample

Date: 2026-10-14  
Phase: **1 — documentation and editorial review only**  
Review status of every proposed rewrite: **`needs_clinician_review`**  
Owner feedback: “They are certainly better, but I still feel like they sort of don't give enough information or background. I want some of them to be funny. I just feel like they aren't quite right yet.”

The current questions have much better settings and structure than before October 7, but most still read like the minimum information needed to select an answer. Round 2 should give the player a short story, a reason to make the decision now, and enough explanation to learn the idea without prior familiarity. More words are useful only when they supply one of those missing pieces.

This document contains the inventory, concrete diagnosis, proposed writing rules, eight complete before/after samples, and a Phase 2 plan. It changes no content, rendering, scheduling, saves, source records or review approvals. The sample order is intentionally four statistics variants followed by four ethics variants; sample 5 includes an additional, existing clinical decision to demonstrate an ethics-first clinical sequence.

Read-only inputs: [AGENTS.md](../../AGENTS.md), the [October 7 brief](../handoffs/STATS_ETHICS_OVERHAUL_BRIEF.md), the [GS-028 ExecPlan and owner decisions](../execplans/gs028-stats-ethics-overhaul-20261007.md), every file in the September 29 statistics/ethics directory, related development-batch content listed below, and [ChartPanel.tsx](../../apps/player/src/ui/ChartPanel.tsx) / [EmployeeDiscussionPanel.tsx](../../apps/player/src/ui/EmployeeDiscussionPanel.tsx). The whole development-batch tree was searched for topic terms and related decision-making/safety methods. No web or source-page retrieval occurred. Search used native filesystem tools after `rg` proved unavailable.

The October 7 owner-approved setting decision still applies: patient-facing statistics and ethics reach level 1; methods discussions begin at level 2 with a hired eligible clinical host. There is no proposal here to reverse it, change the layout, add wrong-answer consequences, or turn draft content into approved material.

## 1. Inventory

### Reading the tables

“Level reach” is the authored earliest facility stage, not educational tier, acuity or a capability. **L0+ includes L1.** A stage does not guarantee an encounter is immediately supplied: employee discussions need an eligible hired host, and the pediatric standalone draft requires admission and its pediatric capability. Later progression retains earlier eligible content.

In the variant column, `prefix.{v1,v2,v3,v4}` explicitly enumerates four existing IDs by appending each suffix to that prefix; the four descriptions are in that same order. These are inventories of authored identities, not proposed new IDs. Full prefixes are included to expose the exceptions.

### Main batch: 28 concepts, 112 variants, 108 cases

All 112 nodes in [2026-09-29-statistics-ethics](../../packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/) remain draft. Its catalog contains 63 claims and 30 sources. There are 60 staff-discussion cases and 48 patient cases; the latter contain 52 nodes because four cases pair interpretation with consent.

| Existing concept ID | Topic | Existing variant IDs and focus, in order | Setting | Educational tier | Level reach |
| --- | --- | --- | --- | ---: | --- |
| `concept.statistics-ethics.independent-t` | Independent-samples t test | `question.statistics-ethics.independent-t.{v1,v2,v3,v4}`<br>v1: two teams; v2: two cohorts; v3: two shifts; v4: two scripts | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.paired-t` | Paired t test | `question.statistics-ethics.paired-t.{v1,v2,v3,v4}`<br>v1: same rooms; v2: same trainees; v3: matched sites; v4: same workers | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.one-way-anova` | One-way ANOVA | `question.statistics-ethics.one-way-anova.{v1,v2,v3,v4}`<br>v1: three teams; v2: four formats; v3: three sites; v4: five signs | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.rank-sum` | Wilcoxon rank-sum | `question.statistics-ethics.rank-sum.{v1,v2,v3,v4}`<br>v1: ordinal team ratings; v2: skewed delays; v3: ordinal cohort ratings; v4: two queues | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.signed-rank` | Wilcoxon signed-rank | `question.statistics-ethics.signed-rank.{v1,v2,v3,v4}`<br>v1: workload changes; v2: room delays; v3: matched dyads; v4: office time changes | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.chi-square` | Chi-square association | `question.statistics-ethics.chi-square.{v1,v2,v3,v4}`<br>v1: role × preference; v2: shift × response; v3: badge × completion; v4: site × category | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.fisher-exact` | Fisher exact test | `question.statistics-ethics.fisher-exact.{v1,v2,v3,v4}`<br>v1: rare event; v2: tiny pilot; v3: sparse exposure; v4: small response | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.study-design` | Study design | `question.statistics-ethics.study-design.{v1,v2,v3,v4}`<br>v1: prospective cohort; v2: randomized experiment; v3: case-control; v4: cross-sectional | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.bias-confounding` | Bias and confounding | `question.statistics-ethics.bias-confounding.{v1,v2,v3,v4}`<br>v1: shift confounding; v2: day-only selection; v3: unequal recall; v4: residual confounding | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.sensitivity-specificity` | Sensitivity and specificity | `question.statistics-ethics.sensitivity-specificity.{v1,v2,v3,v4}`<br>v1: sensitivity 90%; v2: specificity 95%; v3: sensitivity 80%; v4: specificity 70% | Patient clinic | 1 | L0+ |
| `concept.statistics-ethics.predictive-value-prevalence` | PPV and prevalence | `question.statistics-ethics.predictive-value-prevalence.{v1,v2,v3,v4}`<br>v1: higher prevalence; v2: lower prevalence; v3: PPV 2×2 table; v4: same test, different PPV | Patient clinic | 1 | L0+ |
| `concept.statistics-ethics.risk-ratio-odds-ratio` | RR versus OR | `question.statistics-ethics.risk-ratio-odds-ratio.{v1,v2,v3,v4}`<br>v1: cohort risk ratio; v2: case-control OR; v3: adjusted odds; v4: rare-outcome naming | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.arr-nnt` | ARR and NNT | `question.statistics-ethics.arr-nnt.{v1,v2,v3,v4}`<br>v1: 20% → 10%; v2: 15% → 10%, unequal totals; v3: 30% → 10%; v4: 20% → 14%, round up | Patient clinic | 1 | L0+ |
| `concept.statistics-ethics.p-value` | P-value interpretation | `question.statistics-ethics.p-value.{v1,v2,v3,v4}`<br>v1: p = 0.03; v2: p = 0.40; v3: p = 0.001; v4: p = 0.08, equality claim | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.confidence-interval` | Confidence intervals | `question.statistics-ethics.confidence-interval.{v1,v2,v3,v4}`<br>v1: ratio null 1; v2: difference null 0; v3: interval width; v4: repeated-sampling coverage | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.errors-power` | Testing errors and power | `question.statistics-ethics.errors-power.{v1,v2,v3,v4}`<br>v1: type I error; v2: type II error; v3: planned power; v4: post-hoc power | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.quality-improvement.pdsa-act-and-iterate` | PDSA: act and iterate | `question.quality-improvement.pdsa-act-and-iterate.{v1,v2,v3,v4}`<br>v1: adopt locally; v2: adapt burden; v3: abandon version; v4: repair measurement | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.qi-measures` | QI measures | `question.statistics-ethics.qi-measures.{v1,v2,v3,v4}`<br>v1: check-in; v2: reminders; v3: supply-cart map; v4: handoff template | Staff huddle / journal club | 1 | L2+; eligible host |
| `concept.statistics-ethics.qualified-interpreter` | Qualified interpretation | `question.statistics-ethics.qualified-interpreter.{v1,v2,v3,v4}`<br>v1: child offers; v2: unclear app; v3: partner speaks; v4: unqualified employee | Patient clinic; paired nodes | 0 | L0+ |
| `concept.statistics-ethics.informed-consent` | Understandable, voluntary consent | `question.statistics-ethics.informed-consent.{v1,v2,v3,v4}`<br>v1: missing risks/options; v2: declining biopsy; v3: scar misunderstanding; v4: coercive companion | Patient clinic; paired nodes | 0 | L0+ |
| `concept.statistics-ethics.capacity-refusal` | Capacity and refusal | `question.statistics-ethics.capacity-refusal.{v1,v2,v3,v4}`<br>v1: capable refusal; v2: new confusion; v3: treated depression; v4: supported cognitive impairment | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.surrogate-decisions` | Surrogate decisions | `question.statistics-ethics.surrogate-decisions.{v1,v2,v3,v4}`<br>v1: known wishes; v2: unknown wishes; v3: conflict with wishes; v4: include patient | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.perioperative-dnr` | Perioperative DNR | `question.statistics-ethics.perioperative-dnr.{v1,v2,v3,v4}`<br>v1: no automatic suspension; v2: feasible limits; v3: reinstatement endpoint; v4: DNR scope | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.error-disclosure` | Error disclosure and safety | `question.statistics-ethics.error-disclosure.{v1,v2,v3,v4}`<br>v1: report-routing error; v2: symptomatic medication error; v3: lost specimen, uncertain cause; v4: wrong-chart information | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.impaired-colleague` | Fitness for safe practice | `question.statistics-ethics.impaired-colleague.{v1,v2,v3,v4}`<br>v1: unsafe performance; v2: assessment/reporting; v3: disability with safe performance; v4: self-requested relief | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.research-consent` | Voluntary research consent | `question.statistics-ethics.research-consent.{v1,v2,v3,v4}`<br>v1: ordinary care not contingent; v2: additional research procedure; v3: allocation/benefit misunderstanding; v4: voluntary withdrawal | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.qi-versus-research` | QI and research oversight | `question.statistics-ethics.qi-versus-research.{v1,v2,v3,v4}`<br>v1: publication alone; v2: experimental QI label; v3: local implementation; v4: combined aims | Patient clinic | 0 | L0+ |
| `concept.statistics-ethics.confidentiality` | Confidentiality | `question.statistics-ethics.confidentiality.{v1,v2,v3,v4}`<br>v1: friend's request; v2: neighbor employee; v3: public discussion; v4: authorized coordination | Patient clinic | 0 | L0+ |

The eight content-owned host roles are `staff.glp1_np`, `staff.endoscopy_nurse`, `staff.endoscopist`, `staff.periop_nurse`, `staff.surgeon`, `staff.or_nurse`, `staff.pharmacist`, and `staff.radiologist`. The existing role gate remains. The three early patient statistics concepts supply 12 variants; all ten ethics concepts supply 40 nodes in 36 cases. No new patient-acuity, demographic-frequency or simulation-weight rule is proposed.

### Other focused ethics/QI concepts: 2 concepts, 6 variants

| Existing concept ID | Topic | Every existing variant ID and focus | File / setting | Educational tier | Level reach and admission |
| --- | --- | --- | --- | ---: | --- |
| `concept.gs028f.outcomes.rca-versus-fmea-purpose` | Retrospective RCA versus prospective healthcare FMEA | `question.gs028f.outcomes.rca-versus-fmea-purpose.{v1,v2,v3,v4}`<br>v1: medication-handoff close call; v2: future discharge handoff; v3: delayed-report investigation; v4: prospective labeling review | [patient-safety.ts](../../packages/clinical-content/src/development-batch/2026-10-07-variety-2/patient-safety.ts); patient clinic / outside-center review | 0 | L0+, including L1 |
| `concept.pediatric-clinic.developmental-assent-discussion` | Child participation and developmental assent | `question.pediatric-clinic.child-asks-about-examination.v1` — Lily Walker, girl age 6, mother Susan<br>`question.pediatric-clinic.child-wants-plan-explained.v2` — Ruby Anderson, girl age 11, father Thomas | [assent.ts](../../packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/assent.ts); named child and parent in clinic | 0 | Authored L4; `release.l4.pediatrics` and `capability.pediatric_examination`; batch manifest is a standalone draft with `assemblyAuthorized: false` |

The focused inventory therefore totals **30 concepts / 118 variants**. The two pediatric identities are constrained; changing their age, sex, art identity or parent to create variety would violate their current authoring contract. Their existence as exports does not itself establish release admission.

Also inventory the withheld record `withheld.pediatric-clinic.adolescent-confidentiality` in [evidence-claims.ts](../../packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts): adolescent privacy, refusal and legal consent. It has **no concept, question variant or playable level reach**. Context and jurisdiction review are required; do not turn the same-room parent prototype constraint into a universal confidentiality rule.

### Integrated consent, preference and disclosure content

These eight clinical concepts add **32 variants** worth checking for the same prose problem. They are listed separately because their main objectives are clinical decisions, not general ethics or statistics. Their inclusion is an audit of relevant teaching already in the tree; it is not authorization to rewrite every surrounding disease concept.

| Existing concept ID | Related topic | Every existing variant ID and focus, in order | File / setting | Educational tier | Level reach |
| --- | --- | --- | --- | ---: | --- |
| `concept.graves.rai-appropriate-candidate` | Preference-sensitive treatment counseling; catalog includes pre-treatment informed consent | `question.graves-rai-appropriate-candidate.{v1,v2,v3,v4}`<br>v1: patient goal; v2: confirmed recurrence; v3: course after remission; v4: RAI not compulsory | [2026-09-09/graves.ts](../../packages/clinical-content/src/development-batch/2026-09-09/graves.ts); patient clinic | Not separately recorded on exported concept | L0+ |
| `concept.lynch-tumor.germline-counseling-after-suggestive-ihc` | Counseling before inherited diagnosis / germline discussion | `question.lynch-tumor.germline-counseling-after-suggestive-ihc.{v1,v2,v3,v4}`<br>v1: new diagnosis; v2: resection review; v3: oncology visit; v4: family-history question | [2026-09-13/lynch-tumor.ts](../../packages/clinical-content/src/development-batch/2026-09-13/lynch-tumor.ts); patient clinic after returned tumor study | 1 | L1+ |
| `concept.inguinal-hernia.selected-watchful-waiting` | Informed observation choice, restricted to selected men | `question.inguinal-hernia.selected-watchful-waiting.{v1,v2,v3,v4}`<br>v1: painless bulge; v2: mild awareness; v3: options visit; v4: rare mild discomfort | [2026-09-17-bread-and-butter/groin-hernia-management.ts](../../packages/clinical-content/src/development-batch/2026-09-17-bread-and-butter/groin-hernia-management.ts); patient clinic | 0 | L0+ |
| `concept.umbilical-epigastric-hernia.symptomatic-elective-referral` | Individualized elective options and emergency boundary | `question.umbilical-epigastric-hernia.symptomatic-elective-referral.{v1,v2,v3,v4}`<br>v1: activity-limiting pain; v2: enlarging epigastric hernia; v3: observation versus repair; v4: incarceration warning | [2026-09-28-pre-endoscopy/primary-midline-hernia.ts](../../packages/clinical-content/src/development-batch/2026-09-28-pre-endoscopy/primary-midline-hernia.ts); patient clinic | 0 | L0+ |
| `concept.varicose-veins.intervention-referral-after-axial-reflux` | Informed procedure preference / conservative alternative | `question.varicose-veins.intervention-referral-after-axial-reflux.{v1,v2,v3,v4}`<br>v1: wants treatment; v2: compression difficult; v3: prefers conservative care; v4: mobility/comorbidity | [2026-09-28-pre-endoscopy/varicose-veins.ts](../../packages/clinical-content/src/development-batch/2026-09-28-pre-endoscopy/varicose-veins.ts); patient clinic | 1 | L1+ |
| `concept.appendicitis.appendicolith-operative-pathway` | Shared treatment counseling without absolute antibiotics ban | `question.appendicitis.appendicolith-operative-pathway.{v1,v2,v3,v4}`<br>v1: CT-confirmed appendicolith; v2: asks about antibiotics; v3: stone without perforation; v4: revisit prior preference | [2026-10-02-pre-endoscopy/urgent-families.ts](../../packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts); patient clinic | 1 | L0+ |
| `concept.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan` | Communicate known susceptibility during preoperative planning | `question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.{v1,v2,v3,v4}`<br>v1: documented susceptibility; v2: family/genetics record; v3: prior reviewed event; v4: alert bracelet / referral | [2026-10-03-coverage-gaps/anesthesia.ts](../../packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/anesthesia.ts); patient clinic | 1 | L0+ |
| `concept.spontaneous-pneumothorax.recurrence-prevention-referral` | Conditional recurrence-prevention discussion / informed preference | `question.spontaneous-pneumothorax.recurrence-prevention-referral.{v1,v2,v3,v4}`<br>v1: travel priority; v2: occupation priority; v3: prefers follow-up; v4: secondary-population boundary | [2026-10-03-coverage-gaps/thoracic.ts](../../packages/clinical-content/src/development-batch/2026-10-03-coverage-gaps/thoracic.ts); patient clinic | 1 | L0+ |

Across the focused and integrated tables: **38 distinct concepts / 150 variants**, plus one explicitly withheld topic. The eight integrated rows are a conservative, separately sized follow-up lane; the six focused variants outside GS-028 must not be overlooked in a “full stats/ethics/QI” rewrite.

Search-boundary checks: transplant donor/recipient nomenclature mentions “consent paperwork” but tests graft categories, not consent; MRI catalogs mention implant disclosure but the questions test device-specific imaging clearance. “Methicillin,” oxygen-binding or lymphatic “capacity,” thyroid “autonomy,” medication “sensitivity,” and source publication types are not ethics/statistics concepts. No additional dedicated consent, capacity, confidentiality, assent, disclosure or QI objective was found under development-batch after checking those matches and the RCA/FMEA and preference-decision matches. Disease counseling in general is not counted as a separate ethics concept.

## 2. Diagnosis: why it still reads as thin

The October 7 brief describes the earlier content, not everything still present today. Research-literacy follow-ups, prose-only data and concatenated “Correct answer” paragraphs have already been removed from the main batch. The diagnosis below uses **current, repository-authored text**, not protected source wording.

| Problem | Short quote from our current authored content | What the player still needs |
| --- | --- | --- |
| A setting label substitutes for a scene | Independent t, v1: “brings a turnover-time project to the team huddle” | Who is asking, what the team is trying to report, what one observation represents, and why an analysis choice is needed now. “Turnover-time project” assumes shared background. |
| The scenario jumps straight to the exercise | P-value, v1: “before the team interprets its reported probability” | What probability is being discussed and what its starting model means. The learner is sent immediately to a jargon choice, “Null-model tail probability is 0.03.” |
| The background is assumed | ARR, v1: “is choosing between two care options” | What the patient is unsure about, what the comparison counts, and whether the figures describe a teaching calculation or the patient's own prognosis. A procedure-specific effect must not be invented to make this feel real. |
| Feedback gives a label without a useful mental step | Independent t, v1: “A two-sample t procedure compares means from two separate groups” | How to identify the observation unit and distinguish two groups from two readings on the same unit. A novice needs the route to the answer, not just the method definition. |
| The apparent second explanation adds nothing | Capacity/refusal, v1: “Disagreement with a recommendation does not itself establish incapacity.” | A decision-specific explanation of what this patient's demonstrated abilities tell us, why disagreement differs from inability, and what to do next. The existing sentence is a good rule; it is almost the whole lesson. |
| An exhibit has labels but insufficient framing | PPV, v3: “Teaching dataset: positive screening results”; ARR: “unwanted outcome by 30 days” | Are cells counts or percentages? What does “reference positive” mean? Which group is the comparator? Why are we using this table, and what may we conclude from it? Put assumptions and units in the caption or a short exhibit introduction. |
| Four variants change nouns more than decisions | Independent t: “two teams,” “two cohorts,” “two shifts,” “two scripts” | Different practical questions and misconceptions within the same stable objective. All four are substantially the same two-group mean-selection exercise with different objects. The observation pattern should remain valid, but the surrounding decision and feedback can vary. |
| Explanations repeat boilerplate across variants | Lynch counseling, all four: “Refer for genetics counseling and germline-testing discussion” | Why a suggestive tumor result is not yet an inherited diagnosis, what counseling is for at this point, and why relatives' testing should not leap ahead. Any extra genetics detail must stay inside its existing claims. |
| Voice is operationally correct but generic | Paired t: “asks the team to review a room-layout pilot”; signed-rank: “brings the room-workflow test to journal club” | A small recognizably human purpose, colleague concern, or patient question. These are interchangeable introductions rather than distinct encounters. |
| Some humor is decoration without a story | QI measures: “A stapler mascot guards the old clipboard.” | The mascot does not affect any answer, which is good. But one random prop attached to a thin sentence does not create character or make the concept easier to remember. Keep humor attached to the situation and, occasionally, the feedback. |
| Existing ethics sequences still end at another ethics step | Interpreter cases continue to “With qualified Spanish interpretation in place” and a consent question | Those four pairings are coherent. They do not yet show communication support enabling an actual clinical pathway decision. A supported clinical companion can do that, with explicit cross-batch provenance and no invented treatment guidance. |

Useful scale checks from the authored base presentations, counted by whitespace and excluding exhibits/current updates: statistics median **16 words**; ethics median **33.5 words**. All 60 methods-discussion introductions are at most 25 words. Length alone is not the acceptance test, but these counts explain why a huddle title often stands in for a scene.

All **112 main-batch variants have `teachingPoint === explanation`**. Statistical feedback often supplies one definition; ethical feedback often states the governing principle. Per-choice rationales are present, so the loss is explanatory depth rather than a missing data field.

### What the player actually sees

The current [ChartPanel](../../apps/player/src/ui/ChartPanel.tsx) displays the complaint in the identity header; the presentation, reached `currentUpdate` and exhibits in the story column; and a complete question plus answer grid in the decision column. A source/review view may appear on the chart back. The exhibit card already labels itself “Teaching dataset”; authored captions often repeat that label. Remove duplicated boilerplate when revising captions, while retaining the teaching-data distinction.

After answering, the question stays visible. The answer rows identify the selected answer and, for a wrong pick, the revealed key. The feedback card shows **`teachingPoint ?? feedbackBody`** and the chosen answer's rationale. Other rationales are available through **Show all choices → Why this choice**. It does **not** display a second explanation paragraph when `teachingPoint` exists.

[EmployeeDiscussionPanel](../../apps/player/src/ui/EmployeeDiscussionPanel.tsx) adapts staff discussions onto that same chart, using the employee's name and role in the header, the topic as complaint, and the same exhibit and feedback behavior. It has no separate discussion-summary page.

**Consequence for round 2:** background placed only in `explanation` will remain invisible in the normal feedback card. Put the mini-lesson in the visible `teachingPoint`; use the chosen rationale to explain the specific decision. Keep a short, self-contained `explanation` fallback. A separately visible background block would require a manager-owned UI decision, not a content-only workaround. No UI change is needed for the samples below.

### Where the missing information should go

- **Before the answer:** a short scene supplies who/what/why now, relevant known facts, uncertainty, and the immediate decision. The exhibit supplies observations, denominators, units, assumptions and time horizon. Give enough to solve the task without teaching the key in the stem.
- **After the answer:** the visible teaching point defines the unfamiliar idea in ordinary language and offers a useful rule. The rationale applies it to this case and, for a wrong choice, identifies the actual misconception.
- **Outside the draft:** unsupported legal requirements, treatment-specific benefits or harms, probabilities, cutoffs and deadlines. Their absence must be explicit rather than filled by plausible-sounding prose.

## 3. Proposed round 2 writing guide

### Scenario and background

Aim for **one short paragraph of story plus key facts**, usually 60–100 words before the exhibit. This is an editorial target, not a clinical number or a mandatory minimum. A simple scene may be shorter; a two-step case can introduce facts through a reached update. Each sentence should supply a person, practical purpose, decision-relevant fact, uncertainty or purposeful voice.

A usable scene answers: who is here; what brought the question up; what is already established; what remains unsettled; why the decision is being made now. A patient may ask about a screening result or advertised benefit. A colleague may need to write an analysis plan or correct report wording. Do not make the patient attend methods homework disguised as a clinical visit.

Give a **1–3 sentence “what you need to know” mini-lesson** in the teaching point or explanation. With today's renderer, the necessary lesson belongs in `teachingPoint`. Usually this is about 35–70 words: define the idea in plain language, give the reasoning step or memorable rule, and connect it to the current case. Keep `explanation` about 20–40 words as a complete fallback. Do not concatenate all distractor rationales or repeat “Correct answer.”

For a calculation, show the denominator and a compact worked step after answering. For a methods choice, show how the unit, outcome and assumptions lead to the method. For ethics, explain the patient's interest, the governing distinction and the action it supports. A learner who has never encountered the concept should be able to learn it from the feedback.

### Exhibits and variants

Give an exhibit a short purpose, units and explicit assumptions. Define unfamiliar row labels without displaying the answer. State whether its numbers are counts, percentages or an estimate. Keep group order, comparator, outcome and horizon consistent with the question. Preserve existing teaching numbers when arithmetic is unchanged; never present them as clinical probabilities for the named patient.

Across four variants, vary the problem that makes the concept useful: a patient's misconception, a report-editing decision, a changed observation structure within scope, or a different plausible competing action. Changing a logo, age or noun is not enough. Retain the intended objective and existing supported population boundaries; vary the story without quietly creating a different FSRS concept.

### Humor

Use a light funny touch in **roughly one in three variants**, spread across the set, rather than adding a mascot sentence everywhere. The eight samples deliberately contain three humorous and five straight variants. Serious topics can remain entirely straight; a quota must not force a joke into a harmful event.

Humor can come from the situation, hospital bureaucracy, an enthusiastic colleague, a patient's **own** wit, absurd advertisements or a misread headline. One good beat is enough. Let it live in the presentation and occasionally the feedback; remove it and the same facts must still lead to the same answer.

Never mock a patient's illness, body, weight, age, disability, culture or identity. Never trivialize harm, error disclosure, abuse, capacity or end-of-life care. Do not portray language needs as comic, or make the patient's misunderstanding a punch line. The consent example jokes about a coffee machine, not about the patient's ability to understand.

**Humor must neither change nor hint at the key.** Answer choices stay neutral, parallel and joke-free, with comparable specificity and length in the same semantic category. Do not make three serious choices compete with one joke, or put all the needed qualifications only in the key. Read each choice set for clinical plausibility and grammatical cues, not only character-count balance.

### Presentation and safety rules carried forward

- Complaint: usually **1–5 words**, a symptom, question or visit reason, not a full sentence. Do not repeat it as the opening presentation sentence.
- Every patient: a specific name, age and sex consistent with the chosen profile, story and character. Preserve clinically constrained profiles and the Spanish/Female interpreter cases. Staff discussions use a named employee and role; do not add patient demographics to staff.
- Every question: state the entire task, even when shown apart from the presentation. It may refer to an exhibit whose data are necessary. Methods-selection stems must not name the answer's method.
- Four choices: neutral actions, methods, interpretations or quantities of comparable form. Runtime randomizes. Review artifacts may show the key first only with an explicit notice.
- Testing choices, including distractors: retain runtime wait estimates from the timing contract. No fixed testing duration goes into authored prose. An NNT study's 30-day outcome horizon is teaching-data context, not a testing wait.
- All new wording: `needs_clinician_review`, owner/development preview only until named clinician approval. Educational tier, facility progression, capability, acuity, clinical relationships and editorial weights remain separate.
- Existing source/claim mappings: retain limits, rights status and dates. New background can use additional **existing** claims when needed; bind them explicitly. No new facts are licensed merely by pointing at a source. No gameplay web retrieval or AI call, race/ethnicity selection variable, copied source prose or silent promotion.
- No stats/ethics wrong-answer consequence stories. After feedback, a nonfinal ethics step can correct forward so the supported clinical step proceeds with communication already arranged.

## 4. Eight fully rewritten owner tone samples

**KEY FIRST FOR REVIEW ONLY:** option **A** is the correct answer in every current and proposed choice table below. Runtime must randomize all choices. This documentation's ordering is not a gameplay answer cue.

“Current” is the current generated authoring record, with only `{patientName}` materialized into the illustrative name used beside it. Base patient profiles shown here are the existing 43-year-old Female profile; employee names stand for the hired host. Reached updates are shown separately where present. Comparison text is our own repository wording, not source-page prose.

Each sample includes complaint, presentation, exhibit (or explicitly none), complete question, four choices, every rationale, visible teaching point and short explanation fallback. Its mapping table lists each existing evidence claim and the source IDs it already references; additional bindings needed for richer feedback are identified. Facts in the fictional scene and teaching datasets are editorial inputs, not prevalence or patient-risk claims. The statistical principles and ethical/clinical teaching are mapped below.

All eight focal rewrites and the sample 5 clinical continuation are **`needs_clinician_review`**. Across them, 18 existing claims link to 14 existing sources. There is no newly researched source and no claim promoted to approval.

### 1. Statistics: what a positive screen means

**Tone:** Straight. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.predictive-value-prevalence.v3`  
**Current case:** `case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 1.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Positive result questions | Screen follow-up |
| **Presentation** | Maya Reed, a 43-year-old woman, brings a positive screening result and asks whether it establishes the diagnosis. You use a teaching table to explain what the positive-result denominator includes. | Maya Reed, a 43-year-old woman, comes to clinic to discuss a positive screening result. She has read the report but is unsure whether “positive” means the diagnosis is settled. Before discussing her own result, you show her a teaching dataset in which screening results were compared with a reference assessment, treated as correct for this exercise. She asks how often a positive screen matched the condition in that dataset. |
| **Exhibit** | **Caption:** Teaching dataset: positive screening results<br>**Columns:** Test positive; Test negative<br>**Reference positive:** 40; 20<br>**Reference negative:** 10; 30 | Framed version below; existing numerical inputs are retained. |
| **Question** | For counseling about the patient's positive screening result, what positive predictive value does the teaching table show? | In the teaching dataset, what percentage of positive screening results came from people with the condition? |
| **teachingPoint** | Positive predictive value uses all positive test results as its denominator, including false positives. | Positive predictive value asks, “Of all positive results, how many were true positives?” Its denominator includes both true and false positives; sensitivity instead starts with people known to have the condition. Here, 40 of 50 positive screens were true positives, so the teaching dataset's positive predictive value is 80%. |
| **Short explanation** | Positive predictive value uses all positive test results as its denominator, including false positives. | Read the positive-result column: 40 true positives and 10 false positives. Divide 40 by all 50 positives to get 80%; do not use either reference-status row as the denominator. |

**Proposed exhibit:** Screening results compared with a reference assessment. Cells are sample counts, not percentages; these are teaching data, not Maya's personal probability.

| Reference / group | Screen positive | Screen negative |
| --- | ---: | ---: |
| Condition present by reference | 40 | 20 |
| Condition absent by reference | 10 | 30 |

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | 80% | There are 40 true positives among 50 positive test results: 40/(40 + 10). | 80% | Start with everyone whose screen was positive: 40 + 10 = 50. Of those 50, 40 had the condition by the reference assessment, so 40/50 = 80%. |
| B | 75% | This uses the reference-negative row, 30/(10 + 30), rather than all positive test results. | 75% | This uses the condition-absent row: 30/(10 + 30). It answers a specificity question, not the question about all positive screens. |
| C | 20% | This is the false-positive share of positive results, 10/(40 + 10). | 20% | This is 10/50: the false-positive share of positive screens. The question asks for the true-positive share. |
| D | 67% | This uses the reference-positive row, 40/(40 + 20), rather than the positive-result column. | 67% | This is 40/(40 + 20), rounded to a whole percentage. It starts with people who had the condition and calculates sensitivity instead. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.statistics.predictive-value-prevalence` | `source.cdc.test-accuracy.2026`<br>`source.fda.predictive-values.2026` | Question; positive-result denominator; choices A and C; teachingPoint and explanation. The exhibit's counts are unchanged editorial teaching data, and all calculations are arithmetic from those counts. |
| `claim.gs028se.statistics.sensitivity-specificity` | `source.cdc.test-accuracy.2026` | Choices B and D and the teachingPoint's sensitivity contrast; this existing claim must be added to the rewritten variant's bindings. |

**Original variant binding:** `claim.gs028se.statistics.predictive-value-prevalence`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** The rewrite teaches the denominator without prescribing a follow-up test or asserting a patient-specific probability. Maya's name is illustrative; age/sex match an existing main-batch profile.

### 2. Statistics: “the ad said it halves the risk”

**Tone:** Light humor. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.arr-nnt.v1`  
**Current case:** `case.gs028se.arr-nnt-p-value.a-arr-ten`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 1.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Benefit numbers | Benefit question |
| **Presentation** | Joanna Brooks, a 43-year-old woman, is choosing between two care options and asks what an advertisement's 'halves the risk' claim means for the decision. You use a teaching table to explain absolute benefit before the patient chooses. | Joanna Brooks, a 43-year-old woman, comes to clinic while considering an optional addition to her care. She has saved an advertisement that announces “halves the risk” while an animated shield puts on sunglasses. Joanna wants plain numbers before deciding; the shield has not answered her questions. You use the teaching comparison below, which records the same unwanted outcome in both groups by 30 days, to explain what the advertisement's wording leaves unstated. |
| **Exhibit** | **Caption:** Teaching dataset: two options; unwanted outcome by 30 days<br>**Columns:** Outcome; Total<br>**Comparator:** 20; 100<br>**Intervention:** 10; 100 | Framed version below; existing numerical inputs are retained. |
| **Question** | What 30-day absolute risk reduction and NNT should you explain when the patient weighs the two options in the teaching table? | Using the teaching dataset, what absolute risk reduction and number needed to treat over 30 days describe the intervention compared with the comparator? |
| **teachingPoint** | Absolute reduction subtracts the two risks; NNT is its reciprocal. Always retain the comparator, outcome, and time horizon. | Calculate each group's risk first: absolute risk reduction is the comparator risk minus the intervention risk. Here, 20% minus 10% is 10 percentage points, and NNT is 1/0.10 = 10 for the stated outcome over 30 days. “Half” and a 10-point drop describe the same teaching numbers from different starting points. |
| **Short explanation** | Absolute reduction subtracts the two risks; NNT is its reciprocal. Always retain the comparator, outcome, and time horizon. | The teaching outcome falls from 20 in 100 to 10 in 100: 10 fewer per 100 over 30 days. ARR is 0.10 and NNT is 10; keep the outcome, comparator and period attached to that number. |

**Proposed exhibit:** Teaching comparison of two care options. Count the specified unwanted outcome by 30 days; these figures are not a prediction for Joanna.

| Reference / group | People with the unwanted outcome | People in the group |
| --- | ---: | ---: |
| Comparator | 20 | 100 |
| Intervention | 10 | 100 |

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | ARR 10 percentage points; NNT 10 over 30 days | The risks are 0.20 and 0.10; ARR = 0.10 and NNT = 1/0.10 = 10. | ARR 10 percentage points; NNT 10 over 30 days | Comparator risk is 20/100 and intervention risk is 10/100. Subtract to get 0.10, then take 1/0.10 = 10 for the same outcome and 30-day period. |
| B | ARR 50 percentage points; NNT 2 over 30 days | Fifty percent is the relative reduction, not a 50-point absolute difference. | ARR 50 percentage points; NNT 2 over 30 days | The event count falls from 20 to 10 out of 100—half the starting count. That is not a drop of 50 percentage points; the absolute drop is 10 points. |
| C | ARR 10 percentage points; NNT 100 over 30 days | Use the proportion 0.10 when taking the reciprocal. | ARR 10 percentage points; NNT 100 over 30 days | The absolute difference is correct, but its reciprocal uses 0.10, not a percentage-point label. 1/0.10 is 10. |
| D | ARR 5 percentage points; NNT 20 over 30 days | The two risks differ by ten points rather than five. | ARR 5 percentage points; NNT 20 over 30 days | An NNT of 20 would fit an absolute difference of 0.05. This table's two risks differ by 0.10. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.statistics.arr-nnt` | `source.cochrane.chapter-15.2026` | ARR/NNT definitions and framing; question, all choices and rationales, teachingPoint and explanation. The “half” comparison is direct arithmetic from the existing 20/100 and 10/100 teaching dataset, not a new treatment-effect claim. |

**Original variant binding:** `claim.gs028se.statistics.arr-nnt`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** The ad and animated shield are invented scenery. Neither identifies the key. No particular drug, procedure, personal risk, harm rate or clinical benefit is asserted.

### 3. Statistics: the pilot acquired a logo first

**Tone:** Light humor. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.paired-t.v1`  
**Current case:** `case.gs028se.independent-t-paired-t.b-same-rooms`  
**Setting / reach:** Named staff discussion, L2+ with eligible host; educational tier 1.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Layout-change review | Layout-change review |
| **Presentation** | Dana Rivera asks the team to review a room-layout pilot before comparing average turnaround time. | Dana Rivera, the perioperative nurse, brings a room-layout pilot to the staff huddle. The team changed where supplies are kept and now needs to report whether average turnaround time changed. Someone has already designed a logo for “Operation Less Chaos”; the analysis plan is still a blank page. Dana has brought the measurement summary below and asks you to choose the analysis before the logo becomes the project's main finding. |
| **Exhibit** | **Title:** Room-layout pilot<br>The same 18 rooms were measured before and after a layout change. Turnaround time is recorded in minutes. The room-level changes are approximately normal. | Framed version below; existing numerical inputs are retained. |
| **Question** | Which analysis best evaluates mean turnaround-time change in the teaching dataset? | Which statistical analysis best evaluates mean turnaround-time change for the room-layout pilot described in the teaching exhibit? |
| **teachingPoint** | A paired t procedure analyzes within-unit differences; its normality assumption concerns those differences. | When the same room is measured twice, start with one change for each room. A paired t test evaluates the mean of those linked changes when its assumptions are reasonable; the normality assumption concerns the changes, not the two original columns separately. Remember the unit before choosing the test. |
| **Short explanation** | A paired t procedure analyzes within-unit differences; its normality assumption concerns those differences. | Eighteen rooms supply 18 before-to-after changes. Compare their mean with a paired t test under the stated assumptions; a new logo does not supply a nineteenth observation. |

**Proposed exhibit — Room-layout pilot: what was measured:** The same 18 rooms each supplied one turnaround-time measurement before the change and one afterward, recorded in minutes. Each room's two readings can be linked. The distribution of the 18 room-level changes is approximately normal for this exercise. The target is average change, not a category count or a ranked-distribution contrast.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Paired t test | Each room supplies its own before-and-after difference, and those differences are approximately normal. | Paired t test | Keep each room's before and after readings together and calculate its change. The target is the mean of those changes, whose distribution meets the stated normal-model assumption. |
| B | Independent-samples t test | Treating the repeated or matched measurements as separate samples discards the link between them. | Independent-samples t test | That would compare two separate samples. Here the same rooms supply both measurements, so treating the columns as unrelated loses the room-level link. |
| C | Wilcoxon signed-rank test | The requested mean change and stated normal differences support the t model rather than a ranked-difference comparison. | Wilcoxon signed-rank test | This works with ranked within-pair differences under its own assumptions. The task asks for mean change, and the stated approximately normal differences support the paired t procedure. |
| D | Wilcoxon rank-sum test | The observations are linked within units, rather than two separate samples. | Wilcoxon rank-sum test | This compares ranked observations from two separate groups. The exhibit instead supplies linked measurements on the same rooms. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.statistics.paired-t` | `source.nist.paired-t.2026` | Question, key, rationale A, teachingPoint and explanation; same-room observations and 18 changes are editorial teaching data/arithmetic. |
| `claim.gs028se.statistics.independent-t` | `source.nist.independent-t.2026` | Rationale B and the contrast with separate samples. |
| `claim.gs028se.statistics.signed-rank` | `source.nist.signed-rank.2026` | Rationale C's ranked within-pair differences. |
| `claim.gs028se.statistics.rank-sum` | `source.nist.rank-sum.2026` | Rationale D's two separate ranked samples. |

**Original variant binding:** `claim.gs028se.statistics.paired-t`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** Dana is an employee subject, not a patient, so the header uses name and role rather than invented patient demographics. The observation structure appears in the exhibit, not as a named method in the question. The final joke is confined to operational teaching data, not patient harm.

### 4. Statistics: what p = 0.03 actually says

**Tone:** Straight. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.p-value.v1`  
**Current case:** `case.gs028se.arr-nnt-p-value.b-p-003`  
**Setting / reach:** Named staff discussion, L2+ with eligible host; educational tier 1.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Study-result review | Study-result wording |
| **Presentation** | Alex Morgan brings a preplanned study analysis to journal club before the team interprets its reported probability. | Alex Morgan, the clinic's nurse practitioner, brings a reminder-script study to journal club before its results go into a staff briefing. The report compares mean practice scores and prints p = 0.03 beside the comparison; the effect estimate appears separately. The analysis plan specified the comparison model before data collection. Alex asks for one accurate sentence about that p-value so the team does not give the number a meaning the analysis never supplied. |
| **Exhibit** | **Caption:** Teaching dataset: preplanned analysis<br>Null model and analysis: Specified before data collection<br>p-value: 0.03 | Framed version below; existing numerical inputs are retained. |
| **Question** | Which interpretation of the p-value in the teaching exhibit is accurate? | Which interpretation of p = 0.03 is accurate for the reminder-script comparison under the teaching exhibit's specified null model? |
| **teachingPoint** | A p-value describes observed-or-more-extreme data under a specified null model, rather than the probability that a hypothesis is true. | The null model is the comparison's starting assumption—here, no mean score difference. A p-value asks how often data this incompatible with that model, or more so, would arise if the model and analysis assumptions held. It does not tell you the probability that the hypothesis is true or how large the score change is. |
| **Short explanation** | A p-value describes observed-or-more-extreme data under a specified null model, rather than the probability that a hypothesis is true. | The 0.03 belongs to data under the specified null model. It is neither a 3% probability of no effect, a 97% probability of an effect, nor a 0.03-point effect size. |

**Proposed exhibit:** Teaching analysis: the probability's starting assumption

| Item | Value |
| --- | --- |
| Specified null model | No difference in mean practice score between the reminder groups; the stated analysis assumptions apply. |
| Analysis plan | Specified before data collection. |
| Reported p-value | 0.03. |
| Effect estimate | Reported separately; not given by the p-value. |

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Null-model tail probability is 0.03 | Under the specified null model, data this extreme or more have probability 0.03. | A 3% chance of data this extreme or more, assuming the null model | Assume the specified null model and its analysis conditions. The probability refers to results at least as incompatible with that model as those observed. |
| B | Null-hypothesis probability is 0.03 | The p-value does not assign probability to the fixed hypothesis. | A 3% chance that the null hypothesis is true after seeing these data | That reverses the conditioning. A p-value is calculated assuming the null model, not as a probability that the hypothesis is true after seeing the data. |
| C | True-effect probability is 0.97 | One minus p is not a posterior probability. | A 97% chance that the reminder produced a true difference in mean scores | Subtracting p from one does not turn it into the probability of a true effect. |
| D | Effect magnitude is 0.03 outcome units | The p-value is not an effect-size estimate. | An estimated difference of 0.03 points between the two groups' mean practice scores | A probability is not an effect estimate. The score difference has to be read from the separately reported estimate. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.statistics.p-value` | `source.nist.p-values.2026` | Null-conditional interpretation and limits; question, all choices and rationales, teachingPoint and explanation. The score comparison and null mean difference are stated teaching-model assumptions, not a clinical treatment claim. |

**Original variant binding:** `claim.gs028se.statistics.p-value`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** No significance cutoff, posterior hypothesis probability or clinical-importance threshold is added. Alex is a staff subject with name and role.

### 5. Ethics: interpretation first, then the hernia plan

**Tone:** Straight; two-step case. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.qualified-interpreter.v1`  
**Current case:** `case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 0.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Consent discussion | Navel bulge |
| **Presentation** | Marta López, una mujer de 43 años, viene a hablar de una operación electiva de hernia. Dice: «No entiendo el formulario en inglés». Está estable; el cirujano no habla español. Su hijo de diez años ofrece traducir. | Marta López, una mujer de 43 años, llega a la clínica para hablar de una hernia umbilical. Tiene tiempo para preguntar antes de decidir sobre una reparación electiva. Dice: «Quiero entender mis opciones, pero no entiendo el formulario en inglés». El cirujano solo habla inglés. Su hijo de diez años se ofrece a traducir; una empleada también habla español, pero no se ha establecido que esté cualificada para interpretar información clínica. Marta espera que la conversación le permita hacer sus propias preguntas. |
| **Exhibit** | None authored. | None. |
| **Question** | How should you begin consent for elective hernia repair when the patient cannot understand the clinician's language? | Before discussing elective hernia repair with Marta López, what communication support should you arrange when she and the clinician cannot communicate adequately? |
| **teachingPoint** | Qualified interpretation supports meaningful consent when patient and clinician cannot communicate adequately. A child's offer does not establish interpreter competence. | Consent needs an understandable conversation, including the patient's own questions. When patient and clinician cannot communicate adequately, arrange qualified interpretation; a relative's offer or conversational bilingual skill does not establish the needed competence. Make the conversation possible before asking for a decision. |
| **Short explanation** | Qualified interpretation supports meaningful consent when patient and clinician cannot communicate adequately. A child's offer does not establish interpreter competence. | Marta needs qualified Spanish interpretation before the clinical discussion continues. Written material and family support can accompany her participation without replacing that communication support. |

**Proposed exhibit:** None. The decision uses the scenario and, for the multi-step case, its reached update.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Arrange qualified Spanish interpretation | The clinician and patient cannot communicate adequately, and the child is not a qualified interpreter. | Arrange qualified Spanish interpretation | Qualified interpretation gives Marta an understandable clinical discussion in which she can ask her own questions. Her son's offer and the employee's bilingual ability do not establish interpreter competence. |
| B | Use the child's interpretation for consent | A willing child does not establish the competence needed for this consent discussion. | Use her son's Spanish interpretation | His willingness to help does not establish the competence needed to interpret this consent discussion. |
| C | Ask a bilingual clinic clerk to interpret | Speaking Spanish does not establish that the clerk is qualified to interpret clinical information. | Use the employee's Spanish interpretation | Speaking both languages does not, by itself, establish qualification to interpret the clinical discussion. |
| D | Use a translated Spanish consent handout | Written information can help, but it does not provide the qualified interpretation needed for the patient's questions. | Use translated Spanish written materials | A handout can accompany the discussion, but it does not provide the two-way qualified interpretation needed for Marta's questions. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.qualified-interpreter.1` | `source.gs028se.ahrq-lep-2020`<br>`source.gs028se.hhs-ocr-interpreter-2015`<br>`source.gs028se.ama-consent-2-1-1` | Language-discordant consent setting, child-offer boundary, question, key and rationales A/B; teachingPoint and explanation. |
| `claim.gs028se.qualified-interpreter.3` | `source.gs028se.ahrq-lep-2020`<br>`source.gs028se.hhs-ocr-interpreter-2015`<br>`source.gs028se.ama-consent-2-1-1` | Marta's own questions and the limits of substituting family participation. |
| `claim.gs028se.qualified-interpreter.4` | `source.gs028se.ahrq-lep-2020`<br>`source.gs028se.hhs-ocr-interpreter-2015`<br>`source.gs028se.ama-consent-2-1-1` | Bilingual employee competence boundary in the presentation and rationales A/C. |

**Original variant binding:** `claim.gs028se.qualified-interpreter.1`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** The Spanish presentation and constrained Female profile are preserved. Naming the navel hernia prepares the existing clinical companion below; it does not alter the interpreter objective. No joke targets language or the child's offer.

#### Sample 5 continuation: ethics step before a clinical step

**Current runtime sequence:** `question.statistics-ethics.qualified-interpreter.v1` → `question.statistics-ethics.informed-consent.v1`. Its existing second-step update says: “With qualified Spanish interpretation in place, Marta López says the hernia-repair form was signed at reception without a discussion of risks or alternatives. The operation has not started.” Its task is: “What should happen before elective hernia repair when the patient signed a form without a discussion of risks and options?” The complete current consent variant is compared in sample 6.

**Proposed owner sample sequence:** interpreter decision above → Continue → the existing symptomatic primary-midline-hernia referral objective below. This is a **new proposed pairing**, not a description of the current game. The clinical comparison comes from its own current September 28 case, which currently follows hernia recognition. Preserve the early consent supply if the manager later selects this alternative pairing.

The ethics step enables an understandable clinical discussion. The clinical step does not imply that choosing an interpreter has consented Marta to surgery. Both correct and incorrect first-step picks proceed after feedback with qualified interpretation established; no adverse-outcome story is written.

The GS-028 statistics/ethics catalog itself has no disease-management claim. This continuation reuses two already-authored claims and their already-cataloged source from **2026-09-28-pre-endoscopy/primary-midline-hernia.ts**. It needs an explicitly scoped cross-batch content lane and manager pairing decision in Phase 2; it needs no new source. The source is single society guidance with recorded evidence limitations. The Spanish interpreter Female profile and the midline-hernias Female age-43 profile are compatible; the male-only inguinal watchful-waiting objective was deliberately not borrowed for Marta.

### 5b. Clinical continuation: a symptomatic navel hernia

**Tone:** Straight. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.umbilical-epigastric-hernia.symptomatic-elective-referral.v1`  
**Current case:** `case.gs028.primary-midline-hernia.paired-umbilical-cough-bulge`  
**Setting / reach:** Existing patient clinical objective, L0+; educational tier 0.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Navel bulge | Navel bulge |
| **Presentation** | Marta López is a 43-year-old woman who presents with a soft focal bulge at the umbilicus that appears with coughing and reduces while supine. There is no vomiting, skin change, or persistent pain. | The same patient and presentation continue. Current update: Qualified Spanish interpretation is now in place. Marta López explains that pain from her navel bulge limits lifting at work. Examination confirms an umbilical hernia that remains reducible; there is no vomiting, persistent severe pain or skin compromise. She wants to discuss options, and the task is to choose the care pathway, not a repair technique. |
| **Reached currentUpdate** | Examination confirms a reducible umbilical defect without obstruction; the patient adds that pain during work now limits activity. | Qualified Spanish interpretation is now in place. Marta López explains that pain from her navel bulge limits lifting at work. Examination confirms an umbilical hernia that remains reducible; there is no vomiting, persistent severe pain or skin compromise. She wants to discuss options. |
| **Exhibit** | None authored. | None. |
| **Question** | Which plan best addresses the stable symptomatic hernia? | After qualified interpretation is arranged, which care plan best fits Marta López's confirmed reducible umbilical hernia with activity-limiting discomfort and no acute warning findings? |
| **teachingPoint** | Not authored on this existing clinical node. | A stable symptomatic umbilical or epigastric hernia supports an individualized elective repair discussion. Acute nonreducibility with severe pain, vomiting, obstruction or skin compromise changes the pathway to urgent assessment; Marta's supplied finding stays on the elective side of that boundary. Choose the care pathway before choosing a technique. |
| **Short explanation** | Refer the stable symptomatic hernia for an individualized elective discussion; do not prescribe one universal technique. | Marta has activity-limiting symptoms, a reducible hernia and no acute warning findings. Arrange an elective consultation for an individualized repair discussion now that the conversation can be understood. |

**Proposed exhibit:** None. The decision uses the scenario and, for the multi-step case, its reached update.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Elective hernia-surgery referral | Not carried on this current question record. | Arrange elective surgical consultation to discuss repair | Activity-limiting symptoms from a stable reducible umbilical hernia support an individualized elective repair discussion. |
| B | Emergency transfer now | The hernia is reducible without obstruction or ischemia. | Arrange emergency transfer for immediate surgical assessment | The supplied finding remains reducible without acute severe pain, vomiting or skin compromise. The urgent boundary described in the catalog is not present. |
| C | Routine antibiotics | There is no evidence of infection. | Continue observation without offering a surgical discussion | This omits an elective repair discussion despite symptoms that now limit work. Referral offers individualized discussion rather than requiring an operation. |
| D | Continue observation without referral | Persistent activity-limiting symptoms merit a repair discussion. | Schedule a standard repair technique without individualized assessment | The existing claim supports individualized elective discussion, not a universal technique. This plan settles the technical choice before that assessment. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.primary-midline-hernia.symptomatic-referral` | `source.hernia.ehs-ahs-2020` | Stable symptomatic clinical setting; question, rationale A/C/D; individualized discussion in teachingPoint and explanation. |
| `claim.primary-midline-hernia.urgent-boundary` | `source.hernia.ehs-ahs-2020` | The stated negative acute findings, rationale B and the urgent-versus-elective contrast in teachingPoint. |
| `claim.gs028se.qualified-interpreter.1` | `source.gs028se.ahrq-lep-2020`<br>`source.gs028se.hhs-ocr-interpreter-2015`<br>`source.gs028se.ama-consent-2-1-1` | Communication continuity from step 1. Qualified interpretation is carried forward, not replaced by a diagnosis or treatment shortcut. |

**Original variant binding:** `claim.primary-midline-hernia.symptomatic-referral`, `claim.primary-midline-hernia.urgent-boundary`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** This is a separately sourced clinical companion to focal ethics sample 5, not a ninth requested stats/ethics tone variant. Its clinical objective and variant already exist in the September 28 batch. No pairing was implemented.

For this older clinical variant the key's rationale is present in its source VariantSpec (“Persistent symptoms support individualized elective repair discussion.”), but is not carried on the generated question record used in the comparison. Its three distractor rationales are carried there; it has no authored teachingPoint/exhibit. The proposed continuation supplies the complete visible feedback contract without changing its clinical objective.

### 6. Ethics: a signature with the conversation missing

**Tone:** Light humor. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.informed-consent.v1`  
**Current case:** `case.gs028se.qualified-interpreter-informed-consent.paired-qualified-interpreter-1`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 0.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Consent discussion | Procedure questions |
| **Presentation** | Marisol Reyes, una mujer de 43 años, viene a hablar de una operación electiva de hernia. Dice: «No entiendo el formulario en inglés». Está estable; el cirujano no habla español. Su hijo de diez años ofrece traducir. | Marisol Reyes, a 43-year-old woman, is in clinic for an elective hernia-repair discussion, with qualified Spanish interpretation already in place. The waiting-room coffee machine has acquired an “Out of Office” sign. “Even the coffee gets leave,” she says. Marisol brings a form she signed at reception, then explains that nobody has discussed the operation's risks, expected benefits or alternatives with her. The operation has not started, and she wants that conversation before deciding whether to go ahead. |
| **Reached currentUpdate** | With qualified Spanish interpretation in place, Marisol Reyes says the hernia-repair form was signed at reception without a discussion of risks or alternatives. The operation has not started. | The reached context is included in the owner-readable presentation above; implement it as currentUpdate, preserving the earlier story. |
| **Exhibit** | None authored. | None. |
| **Question** | What should happen before elective hernia repair when the patient signed a form without a discussion of risks and options? | Before Marisol Reyes's elective hernia repair, which next step addresses a signed form without a discussion of risks, benefits and alternatives? |
| **teachingPoint** | Consent requires an understandable discussion of the intervention, relevant risks and benefits, and alternatives including foregoing treatment; a signature alone is insufficient. | Informed consent helps a person understand the proposed intervention, its relevant risks and benefits, and alternatives including declining, so the person can choose voluntarily. A signature cannot replace that conversation. Marisol needs the missing discussion before her form can be relied on for this elective procedure. |
| **Short explanation** | Consent requires an understandable discussion of the intervention, relevant risks and benefits, and alternatives including foregoing treatment; a signature alone is insufficient. | The missing step is the clinical discussion, not another signature. Explain the relevant options in an understandable conversation and support Marisol's voluntary decision. |

**Proposed exhibit:** None. The decision uses the scenario and, for the multi-step case, its reached update.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Discuss risks, benefits, and alternatives | The form was signed without the clinical discussion needed for an informed choice. | Discuss surgical risks, benefits, and alternatives | Marisol has not received the information needed to choose. An understandable discussion should cover the proposed intervention and its relevant risks, benefits and alternatives, including foregoing it. |
| B | Confirm the form was signed voluntarily | Voluntariness matters, but it does not supply the missing discussion of risks, benefits and alternatives. | Ask her to confirm that signing was her choice | Voluntariness matters, but confirming it does not fill the missing information about risks, benefits and alternatives. |
| C | Have the patient reread the consent document | Rereading a document does not replace the omitted clinical discussion. | Ask her to reread the consent document with you | Reading the document again does not, by itself, supply the clinical conversation Marisol says never occurred. |
| D | Ask the patient to describe the planned operation | Understanding the procedure's name or purpose alone does not address the missing risks and alternatives. | Ask her to describe the intended purpose of surgery | Checking the procedure's purpose addresses only part of understanding; it leaves the stated gaps about risks, benefits and alternatives. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.informed-consent.1` | `source.gs028se.ama-consent-2-1-1` | Missing-discussion scenario; question, all four rationales, teachingPoint and explanation. |
| `claim.gs028se.informed-consent.4` | `source.gs028se.ama-consent-2-1-1` | The voluntariness component of the teachingPoint, rationale B and explanation. |
| `claim.gs028se.qualified-interpreter.1` | `source.gs028se.ahrq-lep-2020`<br>`source.gs028se.hhs-ocr-interpreter-2015`<br>`source.gs028se.ama-consent-2-1-1` | Existing qualified-interpretation context. Interpretation is already arranged; this node does not retest its selection. |

**Original variant binding:** `claim.gs028se.informed-consent.1`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** This is a tone rewrite of the existing second node, not a proposal to erase its interpreter predecessor. The proposed presentation is an owner-readable reached-step view; Phase 2 can place these added facts in currentUpdate. The coffee joke does not supply information about any answer.

### 7. Ethics: an informed refusal the surgeon dislikes

**Tone:** Straight. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.capacity-refusal.v1`  
**Current case:** `case.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-1`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 0.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Declining surgery | Hernia decision |
| **Presentation** | Claire Bennett, a 43-year-old woman, declines elective hernia repair after explaining its benefits, risks, alternatives and consequences of refusal accurately. The patient gives consistent personal reasons; the surgeon strongly disagrees. | Claire Bennett, a 43-year-old woman, comes to clinic after considering elective hernia repair. She accurately explains why it was offered, the relevant benefits and risks, the alternatives, and what declining would mean for her. She gives a coherent, consistent reason for declining and wants to discuss follow-up. There is no emergency. The surgeon believes repair would be the better choice and asks whether Claire's disagreement means someone else should decide for her. |
| **Exhibit** | None authored. | None. |
| **Question** | How should you respond to a capable adult's informed refusal of elective hernia repair? | How should you respond to Claire Bennett's informed refusal of elective hernia repair when she demonstrates the abilities needed for this decision? |
| **teachingPoint** | Disagreement with a recommendation does not itself establish incapacity. A capable adult's informed refusal should be respected. | Capacity is assessed for the decision in front of you using the person's demonstrated decision-making abilities, rather than agreement with the clinician. Claire understands the options and their personal implications and gives coherent, consistent reasons. That supports respecting her informed refusal while discussing follow-up. |
| **Short explanation** | Disagreement with a recommendation does not itself establish incapacity. A capable adult's informed refusal should be respected. | Claire's disagreement is not evidence of incapacity. She demonstrates an informed choice; respect the refusal and continue the care discussion through follow-up. |

**Proposed exhibit:** None. The decision uses the scenario and, for the multi-step case, its reached update.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Respect refusal and discuss follow-up | The patient accurately explains the options and consistently refuses; clinician disagreement does not establish incapacity. | Respect her refusal and discuss a follow-up plan | Claire demonstrates understanding and gives a consistent informed choice. The surgeon's disagreement does not establish incapacity, so her refusal should be respected. |
| B | Request psychiatric clearance before accepting refusal | Disagreement with the surgeon does not establish incapacity or a need for psychiatric clearance. | Request psychiatric clearance before accepting her treatment refusal | No separate capacity concern is supplied beyond disagreement. That disagreement alone does not establish the need for psychiatric clearance. |
| C | Ask the family to confirm the treatment decision | Family agreement is not required to validate a capable adult's informed refusal. | Request family agreement before accepting her treatment refusal | A capable adult's informed decision does not require the family to agree before it can be respected. |
| D | Repeat consent counseling until surgery is accepted | Counseling can clarify uncertainty, but it should not be used to replace a capable patient's informed choice. | Repeat the surgical discussion until she accepts the repair | Further discussion can address a question or misunderstanding. Using it to obtain agreement replaces the informed choice the scenario already establishes. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.capacity-refusal.1` | `source.gs028se.ama-consent-2-1-1`<br>`source.gs028se.ama-capacity-2-1-2` | Capable-refusal scenario; question, key, all rationales and follow-up direction. |
| `claim.gs028se.capacity-refusal.3` | `source.gs028se.ama-consent-2-1-1`<br>`source.gs028se.ama-capacity-2-1-2` | Decision-specific abilities and the described understanding, reasoning and stable choice in the presentation and teachingPoint. |

**Original variant binding:** `claim.gs028se.capacity-refusal.1`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** No capacity score, diagnosis-based rule, legal adjudication, refusal-risk number or recommended repair technique is introduced. The refusal and its reasons are not used for humor.

### 8. Ethics: the specimen is lost, the cause is unknown

**Tone:** Straight. **Status:** `needs_clinician_review`.  
**Existing focal variant:** `question.statistics-ethics.error-disclosure.v3`  
**Current case:** `case.gs028se.perioperative-dnr-error-disclosure.b-error-disclosure-3`  
**Setting / reach:** Patient clinic, L0+ including L1; educational tier 0.  

| Field | Current authored version | Proposed round 2 version |
| --- | --- | --- |
| **Complaint** | Care explanation | Specimen follow-up |
| **Presentation** | Ellen Walker, a 43-year-old woman, asks why a specimen was lost. The clinic has verified the loss but not its cause. A supervisor suggests blaming a courier because 'that is probably what happened.' | Ellen Walker, a 43-year-old woman, returns to clinic because she has not received the result of a specimen taken during an earlier procedure. The clinic has verified that the specimen is lost, but the investigation has not established how it happened or what the implications will be. Ellen asks what is known and what happens next. A supervisor thinks the courier may be responsible and suggests giving Ellen that explanation while the team works out the care plan. |
| **Exhibit** | None authored. | None. |
| **Question** | What should initial disclosure communicate when the patient's specimen is lost but the cause remains unknown? | What should initial disclosure tell Ellen Walker when her specimen's loss is verified but its cause and implications remain uncertain? |
| **teachingPoint** | Disclosure should distinguish verified facts from uncertainty and explain the care and investigation plan; unverified blame is not a factual explanation. | Honest disclosure separates verified facts from theories; you can explain a known error while its cause is still being investigated. State what is known, what remains uncertain, and the care and investigation plan. Here the verified fact is the specimen loss, not the suspected courier explanation. |
| **Short explanation** | Disclosure should distinguish verified facts from uncertainty and explain the care and investigation plan; unverified blame is not a factual explanation. | Tell Ellen about the confirmed loss and the current uncertainty, then explain next steps. Do not present the unverified courier theory as the cause or let an incomplete investigation replace disclosure of known facts. |

**Proposed exhibit:** None. The decision uses the scenario and, for the multi-step case, its reached update.

**Choices and per-choice rationale — A is the key in this review table only**

| Choice | Current choice | Current authored rationale | Proposed choice | Proposed rationale |
| --- | --- | --- | --- | --- |
| A (key) | Explain known facts, uncertainty, and next steps | The specimen loss is verified, but the courier theory and consequences have not been established. | Explain the verified loss, uncertainty, and next steps | The loss is known; the cause and implications are not. Disclose those facts separately and explain the care and investigation plan. |
| B | Explain the likely courier cause and offer a replacement plan | The suspected cause has not been verified and should not be presented as the explanation. | Explain the suspected courier cause and replacement plan | The courier explanation has not been verified. Presenting it as the reason for the loss turns a theory into a purported fact. |
| C | Wait for a cause to be established before discussing the loss | Known facts and next steps can be disclosed while the cause remains uncertain. | Defer the discussion until the cause is confirmed | The clinic can explain the verified loss and the next steps while acknowledging that the investigation is incomplete. |
| D | Discuss replacement sampling and defer the reason for it | A next-step plan does not replace explaining the verified loss and current uncertainty. | Discuss further sampling without mentioning the verified loss | A care plan does not replace disclosure of the known error and uncertainty. Further sampling must not serve as a way to leave the loss unexplained. |

**Existing claim/source mapping for this proposed sample**

| Existing claim ID | Existing source IDs | Statements / fields covered |
| --- | --- | --- |
| `claim.gs028se.error-disclosure.3` | `source.gs028se.ama-safety-8-6` | Verified-loss/unknown-cause setting; question, all choices and rationales, teachingPoint and explanation. |

**Original variant binding:** `claim.gs028se.error-disclosure.3`. All added bindings above refer to existing catalog claims; Phase 1 does not change any code.

**Editorial / provenance note:** This is a disclosure decision, not a rule that every lost specimen must be recollected. No specific repeat procedure, deadline, diagnosis, harm estimate or narrative wrong-answer consequence is added. Single-source limitation is retained.

### Existing source metadata used by the samples

These are references to source records already in the repository, not new source records or fresh source checks. Complete metadata, authority assessments and reuse limits remain in the linked catalogs. All main-batch sample claims were last checked **2026-09-29**; the two clinical companion claims were last checked **2026-09-28**. Access/check dates are not advanced merely because this document was written on October 14.

| Existing source ID | Existing citation | Recorded access date | Class / reuse boundary |
| --- | --- | --- | --- |
| `source.cdc.test-accuracy.2026` | Centers for Disease Control and Prevention. Principles of Epidemiology: Lesson 5, Appendix A. Last reviewed 2012-05-18. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.fda.predictive-values.2026` | U.S. Food and Drug Administration. Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers. Section: What does predictive value mean? Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.cochrane.chapter-15.2026` | Schünemann HJ, Vist GE, Higgins JPT, Santesso N, Deeks JJ, Glasziou P, Akl EA, Guyatt GH. Chapter 15: Interpreting results and drawing conclusions [last updated August 2023]. In: Cochrane Handbook for Systematic Reviews of Interventions, version 6.5. Cochrane; 2024. Accessed 2026-09-29. | 2026-09-29 | narrative_review; `copyrighted_targeted_verification_only` |
| `source.nist.paired-t.2026` | National Institute of Standards and Technology. Engineering Statistics Handbook: Paired t-Test. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.nist.independent-t.2026` | National Institute of Standards and Technology. Engineering Statistics Handbook: Two-Sample t-Test. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.nist.signed-rank.2026` | National Institute of Standards and Technology. Dataplot Reference Manual: Signed Rank Test. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.nist.rank-sum.2026` | National Institute of Standards and Technology. Dataplot Reference Manual: Rank Sum Test. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.nist.p-values.2026` | National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.gs028se.ahrq-lep-2020` | Agency for Healthcare Research and Quality. Five Key Recommendations To Improve Patient Safety for LEP Patients. 2012; last reviewed 2020. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.gs028se.hhs-ocr-interpreter-2015` | U.S. Department of Health and Human Services Office for Civil Rights. May an LEP person use a family member or friend as interpreter? Last reviewed 2015. Accessed 2026-09-29. | 2026-09-29 | government_guidance; `copyrighted_targeted_verification_only` |
| `source.gs028se.ama-consent-2-1-1` | American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29. | 2026-09-29 | professional_society_guideline; `copyrighted_targeted_verification_only` |
| `source.gs028se.ama-capacity-2-1-2` | American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29. | 2026-09-29 | professional_society_guideline; `copyrighted_targeted_verification_only` |
| `source.gs028se.ama-safety-8-6` | American Medical Association. Code of Medical Ethics Opinion 8.6: Promoting Patient Safety. Accessed 2026-09-29. | 2026-09-29 | professional_society_guideline; `copyrighted_targeted_verification_only` |
| `source.hernia.ehs-ahs-2020` | Henriksen NA, Montgomery A, Kaufmann R, et al. Guidelines for treatment of umbilical and epigastric hernias from the European Hernia Society and Americas Hernia Society. Br J Surg. 2020;107(3):171-190. doi:10.1002/bjs.11489. | 2026-09-28 | professional_society_guideline; `copyrighted_targeted_verification_only` |

Catalog paths: [statistics sources](../../packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/source-catalog.ts), [ethics sources](../../packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics-source-catalog.ts), [clinical companion](../../packages/clinical-content/src/development-batch/2026-09-28-pre-endoscopy/primary-midline-hernia.ts) and its [existing source catalog](../../packages/clinical-content/src/development-batch/2026-09-28-pre-endoscopy/source-catalog.ts).

Limits retained: test-accuracy teaching uses an archived 2012 CDC source, with the FDA cross-check limited to predictive values; ARR/NNT uses one Cochrane methods source; the sampled statistical methods mainly have one methods authority each. Consent's material-information claim and disclosure have one adequate AMA source for those points. Capacity/refusal has the existing AMA consent and capacity sources. The clinical companion has one EHS/AHS guideline, with limited evidence for technique details. These are editorial mappings, not independent clinical revalidation or proof of legal compliance.

### Background ideas explicitly withheld

No unsupported sentence is inserted into a playable-looking sample. If later enrichment needs one of these points, keep it out of the teaching text until there is an adequate atomic claim and permitted source.

| Tempting addition | Status and reason |
| --- | --- |
| A named screening test's actual prevalence, a patient's post-test probability, required follow-up test or exact retesting interval | **NEEDS SOURCE.** The sampled catalog supports generic denominators and teaching datasets, not that patient-specific management or risk estimate. |
| A named advertised drug/procedure's benefit, side effects, contraindications, personal NNT or outcome probability | **NEEDS SOURCE.** No such intervention is identified in the ARR/NNT claim. Keep the ad attached to anonymous teaching numbers. |
| A universal statistical-significance cutoff or rule that p = 0.03 establishes clinical benefit | **NEEDS SOURCE.** Neither a clinical threshold nor treatment benefit is supported by the p-value claim; do not teach it here. |
| A legal capacity score, mandatory psychiatric clearance rule, universal surrogate hierarchy or jurisdiction-specific consent requirement | **NEEDS SOURCE.** Existing ethics claims explicitly defer law/policy and focus on decision-making and informed choice. |
| Guaranteed non-emergency safety, a specific hernia technique, a complication percentage or an exact referral deadline | **NEEDS SOURCE.** The companion supports the supplied stable phenotype's individualized elective discussion and the stated urgent boundary, not those extensions. |
| A required interpreter credential, universal certification route or legal rule applying in every institution | **NEEDS SOURCE.** The catalog supports qualified interpretation and competence boundaries, not an invented credential requirement. |
| Legal adolescent confidentiality, refusal or mature-minor rules in a parent-present encounter | **NEEDS SOURCE; already withheld.** Preserve `withheld.pediatric-clinic.adolescent-confidentiality` and seek context/jurisdiction review. |

## 5. Phase 2 plan

Phase 2 is **not started**. This Phase 1 brief authorizes only this review document. The manager can use the owner's reaction to the samples to issue the next bounded content brief; no content, UI or admission change should be inferred from the sample's existence.

### Scope, size and ownership

Default full focused rewrite: **118 variants across 30 concepts**—the main batch's 112, RCA/FMEA's four and assent's two. That means 472 choice labels/rationales, 118 presentations/reached scenarios, visible mini-lessons and fallback explanations. Preserve the 72 main statistics exhibits' data while improving framing. A working editorial estimate is **26,000–38,000 words of new/revised scenario and feedback text**, not counting IDs or preserved bibliographic metadata. The scope is a whole-bank writing pass, not eight samples pasted in place.

Separately, the eight integrated clinical concepts contain 32 variants. Their consent/preference/communication clauses and explanatory depth merit a follow-up pass; a full rewrite would add roughly 7,000–10,000 words. Decide this lane explicitly rather than expanding to entire disease families. Source revalidation is not included in those size estimates. New clinical pairings can change case/node counts and add integration work, so they need a separate structural milestone.

| Milestone | Proposed owned files / modules | Work and acceptance |
| --- | --- | --- |
| P2-A: select tone and audit boundaries | This review; manager's next brief/active ExecPlan | Owner responds to story depth and humor examples. Manager names the focused versus integrated lanes, pairing choice and acceptance criteria; preserves approved level reach and clinical-review gates. |
| P2-B: main statistics/QI prose | Main batch `statistics-variants.ts`; only necessary claim-binding changes in `statistics-qi.ts` | Rewrite 72 variants with different practical purposes, complete questions, framed existing exhibits and visible beginner lessons. Preserve all stable objectives, data meanings, stages, hosts, choice correctness and no-test semantics. Add existing claim bindings for method contrasts rather than inferring support from a method name in prose. |
| P2-C: main ethics prose | Main batch `ethics.ts`; existing `currentUpdate` content | Rewrite 40 variants, retain Spanish/profile constraints, strengthen why/next-step feedback and use humor selectively in safe scenes. Default is to retain four interpreter/consent pairings and current early supply. No harm or wrong-answer consequence narrative. |
| P2-D: other focused content | `2026-10-07-variety-2/patient-safety.ts`; `2026-10-08-pediatric-clinic/assent.ts` | Rewrite six focused variants using their own existing claims. Preserve patient-safety method boundaries and both constrained child/parent identities. The pediatric standalone admission status and parent contract remain unchanged by wording work. Carry a richer visible teachingPoint where the current feedback contract needs it; do not assume a generic explanation will be visible. |
| P2-E: optional clinical pairing / integrated follow-up | An explicitly scoped case-authoring adapter or CaseSpec lane; selected related content files only | If the sample 5 pairing is selected, reuse the existing clinical objective/claims/source, preserve consent supply, map sources per node and make the reached update explicit. Do not reuse the male-only watchful-waiting phenotype for a Female interpreter case. Recheck case mix, level reach, FSRS and corrected-forward behavior. Otherwise leave pairings unchanged. |
| P2-F: validation and manager acceptance | Batch tests and specifically affected domain/player tests; manager-owned review/handoff | Check the actual diff and mapping graph, read every variant, verify sample rendering and legacy saves, then run applicable suites. Keep all drafts pending named clinician review. Manager retains integration, admission, owner report and checkpoint ownership. |

Normally one write-capable worker per bounded milestone. The live tree is shared: auth, playtime, menu, beta-invite tools, Supabase and setup documentation are other workers' lanes. This task does not grant edits there. Rendering or schema changes, if requested later, require their own named lane; today's samples use the existing visible feedback shape.

### Identity, version and save rules

Retain every stable concept ID when the story, patient detail, choice wording or explanatory depth changes without changing the underlying clinical meaning. Keep question and choice IDs stable when their tested objective and correctness are unchanged; retain explicit claim bindings such as the nine McNemar-boundary mappings. An authored content revision should identify the wording update.

Create a new **concept version** only if the objective's clinical meaning, population boundary or required decision changes materially. Adding a supported explanation or a different logo is not that event. A newly paired case may need a new case identity while reusing the same concepts; do not mint a new FSRS concept just because two existing nodes share a story.

Frozen encounters must continue to use their saved wording, choices, exhibits and explanations. Do not mutate old saves to “upgrade” text, assume all old optional fields exist, or require a removed case ID to remain in the current catalog. Check reload before, between and after nodes; each intended concept must receive one review, not duplicate FSRS events. Keep new clinical data replaceable through authoring records rather than changing the patient generator.

Do not silently refresh unrelated protected snapshots or aggregate counts. Review a content-scoped change and its case-mix effect before updating a historical hash; a changed hash is a consequence of a verified allowed change, not a substitute for that verification.

### Validation

The current tests deliberately enforce `explanation === teachingPoint` in `ethics.test.ts` and `statistics-qi.test.ts`; the ethics test also expects one supporting claim per question. Round 2's visible mini-lesson plus distinct short fallback, and some additional existing claim bindings, will require those particular assumptions to be revised. Replace them with meaningful checks for complete fallback text, authoring/runtime alignment, correct claim/source links and preserved review status; retain semantic and save regressions. Do not weaken population, shuffle, count, safety or identity guards to fit new wording.

Suggested exact commands after content edits, using installed tools and the worker's thread pool:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-09-29-statistics-ethics --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-07-variety-2 src/development-batch/2026-10-08-pediatric-clinic --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/gs028-statistics-ethics-batch.test.ts --pool=threads --maxWorkers=1
npm.cmd run typecheck --workspace @gamify-surgery/clinical-content
```

For a pairing change, rerun existing `schema-runtime.test.ts` / `runtime-flow.test.ts` and extend their legacy-frozen-case, wrong-first-answer corrected-forward, single-FSRS-review and continuation checks. Add the exact affected cross-batch admission/supply tests to the next brief. Wording-only milestones retain existing case counts and stages; structural milestones must demonstrate the intentional change.

Before final acceptance, run full clinical-content and game-domain suites and the root workspace typecheck once the assigned lanes are stable:

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

Player-side validation belongs to the manager's renderer lane if any UI/schema mapping changes occur. The manager should inspect actual rendered patient and employee examples: presentation/update separation, table labels, long choice wrapping, teaching-point visibility, chosen rationale and all-choice reveal. If local playtesting is used, retain `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the intended persistent profile; this audit changes no origin, launcher, save or opening pathway. Any disposable QA origin has separate storage and must be labeled.

Human editorial acceptance is essential: read all four siblings together; test whether someone new to the topic can learn the idea from feedback; remove each joke and confirm unchanged answer logic; check neutral parallel choices and that humor never touches harm, capacity or identity. Mechanical length and keyword checks cannot establish tone quality or clinician approval.

### Decisions for the owner and manager

The owner can react to three concrete aspects already shown: **story depth** (roughly 70–80 words here), **visible lesson depth** (roughly 40–55 words), and **humor** (three of eight). No clinical approval is implied by accepting that voice. The manager can then set one bank-wide default and assign bounded rewrite milestones.

The sample 5 choice is a real sequencing decision: keep the current interpreter → consent sequence as the default, or add selected interpreter → existing clinical-pathway cases while preserving early consent supply. The proposed navel-hernia continuation is reviewable, but no code pairing has been authorized in this phase. Do not reverse the owner-confirmed level-2 methods setting merely to make a longer story.

There is no owner decision needed to fix ordinary clarity, grammar, units, captions or fallback completeness within approved direction. Separate owner decisions would be needed for a new visible background panel, changed early methods access or another major gameplay/layout direction; none is required by these samples. The 32 integrated variants need an explicit manager scope decision before a worker touches their surrounding clinical files.

## Phase 1 handoff and checks

This worker's only output path is `docs/reviews/stats-ethics-round2-20261014.md`. The owner/manager handoff is contained here because the brief expressly prohibits any second output; `CURRENT_THREAD_HANDOFF.md` and the active ExecPlan are left to the manager.

Read-only audit checks: current manifest 28/112/108 and 63 claims/30 sources; all 112 main current teachingPoint/explanation pairs identical; 72 exhibits (18 tables, 17 keyValue, 37 abstracts); closed focused inventory 30/118, integrated follow-up 8/32; eight focal samples with three humorous/five straight, four neutral choices per node, 1–5-word complaints, and 18 existing claim IDs resolving to 14 existing source IDs including the two cross-batch clinical claims. The eight focal sample presentations are 69–82 words; all named patient sample profiles remain Female age 43, with Spanish retained for the interpreter step. Staff samples have name/role rather than patient demographics.

Document validation: UTF-8 without BOM, LF line endings; 37 Markdown tables have consistent column counts; inventory IDs and all 18 claim / 14 source mappings resolve against generated current records; current comparison fields match repository data after illustrative name substitution. All eight focal choice sets and the clinical companion have four neutral options and no uniquely longest key; all focal complaints are two words. No content tests were run for this docs-only task: no content or runtime code changed, and mechanical checks are not clinical approval. Pre-write/final SHA-256 comparison confirms all 261 audited existing paths byte-unchanged, covering development-batch files, both inspected UI files and the three instruction/brief/plan inputs. The on-disk document matches the reviewed text. Validation was split into smaller read-only batches after the first command exceeded Windows' command-length limit; that rejected command performed no work.

No Git, installs, web access, proprietary corpus, external messages, agents, credentials, browser storage, commit, push, deploy or publication. **Local review document only; no GitHub backup created.** After accepting the eventual validated content milestone, the manager owns the handoff update and reminder to say **“push to GitHub”** for an audited checkpoint; a backup push does not authorize a merge or release.

**Next action:** manager reads this artifact with the owner, records the desired voice and pairing scope, and issues the first Phase 2 content-only brief. All proposed clinical/statistical/ethical teaching remains `needs_clinician_review`.

## Owner decisions on the tone sample (2026-10-15)

- Round 2 is better. **Scenarios slightly too long:** target about 45-60 words of story (excluding the exhibit), keeping who/why-now/known facts/decision.
- **Funnier:** bigger, character-driven situational humor, roughly half of variants (manager default), never at a patient's expense; never in answer choices; never on harm, capacity, abuse, error disclosure or end-of-life. Lesson length: no change requested (keep the visible mini-lesson about 40-55 words).
- **Decision 4 = yes:** ethics steps should lead into real clinical decisions where an existing, sourced clinical objective fits the patient profile (sample 5 pattern), preserving early consent supply.
- Manager additions: vary patient ages and sexes within each objective's clinical constraints; keep the four variants of each concept meaningfully different situations.

## Owner direction (2026-10-15, after reading the full rewrite)

"The rewritten questions are mostly vague ideas... on tests they always try to link it to a real diagnosis or something real. Not just hypothetical scenarios. So like a patient with colon cancer is wondering about a new biologic." Manager direction: anchor every variant in a real diagnosis or clinical situation, board-style. Invented study numbers stay attached to an unnamed investigational drug, test or trial described in the vignette, never to a real named drug, trial or screening test (no false real-world efficacy). Diagnoses come from conditions already in the game catalog, with any clinical statement mapped to existing claims. Sample-first: 8 anchored samples for owner review before the full pass.
