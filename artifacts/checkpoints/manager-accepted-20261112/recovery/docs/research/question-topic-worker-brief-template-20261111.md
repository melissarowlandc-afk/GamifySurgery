# Topic-worker brief template

Manager fills every angle-bracket field before dispatch. Assign one topic to one worker. The working tree is shared with the manager, other topic workers, Claude Code and the owner. Preserve their edits and accommodate concurrent changes within the assigned lane.

## Assignment

- Topic slug `<slug>`
- Topic title `<title>`
- Wave `<wave-number>`
- Included scope `<copy taxonomy.scopeIn>`
- Boundary assignments `<copy taxonomy.scopeOut and relevant secondary-topic notes>`
- Priority and reason `<copy priority and priorityReason>`
- Starting counts `<live concepts / live nodes / retained draft rows / unkeyed holds>`
- Exact assigned inventory record IDs `<manager attaches the complete filtered inventory list>`
- Registered concept IDs, including identities with no live node `<attach complete concept list>`
- Case/header owners and cross-topic sequences `<attach relevant caseAssignments and identityReuseNotes>`
- Existing source, quality and clinical holds `<attach the exact recordedHoldIds, unkeyed slots and withheld teaching points>`
- Exact frozen independent PASS and clinical approval references `<IDs, versions, hashes and original decision files>`
- Active manager plan or handoff `<path and relevant milestone>`
- Baseline snapshot `<program capture time, manifest ID and relevant source hashes>`

Read the current root AGENTS.md, the complete question-authoring standard, this brief, the program taxonomy and the assigned inventory before authoring. Recheck the actual files because the shared tree may have advanced since the planning snapshot. Record relevant drift in the topic packet and preserve concurrent work. Ask the manager to resolve conflicting ownership or an exact-version freeze.

Use GPT-6.1 Sol at max for the topic milestone. The manager owns dispatch, review, integration and acceptance. The worker carries this single topic through research, complete audit, drafting, focused validation and handoff.

## Five owned files

```text
packages/clinical-content/src/question-topic-<slug>-20261111.ts
packages/clinical-content/src/question-topic-<slug>-20261111.test.ts
docs/research/question-topic-<slug>-20261111.json
docs/research/question-topic-<slug>-20261111.md
docs/research/sources-question-topic-<slug>-20261111.json
```

Keep all durable topic progress, decisions, discoveries and next actions in the owned research Markdown/JSON. The manager maintains shared plans and the current thread handoff.

Write only within these five paths. Existing question files, ship manifest, shared registries/barrels, timing/order registries, schema, runtime, selector, FSRS, saves, art, other topics and shared planning files are read-only inputs. Reuse existing representations and helpers through imports where they preserve correctness. Keep the new module an explicitly imported, self-contained authoring sidecar with its own exports. The manager installs accepted definitions later.

Provide timing, order, source-link, concept and case-composition proposals as data in the owned files. External clinical link metadata uses `target="_blank"` and `rel="noopener noreferrer"`, with the existing `referrerPolicy="no-referrer"` convention. Record any integration dependency that needs a shared-file change. Keep multi-decision cases within the topic's scored scope and report cross-topic companion needs to the manager.

This brief authorizes research and changes in the five-file lane. Commits, pushes, deployment, publication, dependency installation, agents and external messages require a separate express manager authorization. Use the owner's existing subscription and owned credits.

## Outcome

Produce a researched topic program with a ranked concept list, a verdict for every existing assigned question, complete supported replacement drafts and new questions for consequential gaps. Prefer natural multi-part cases in clinical topics. Each scored node has one narrow objective and one complete task. The statistics exception below governs every statistics node.

The owner is Melissa Rowland, surgery resident and named clinical sign-off. Every new or revised clinical question, concept, evidence claim, explanation, phenotype and presentation remains `needs_clinician_review`. Retain original exact approvals as historical metadata. Author self-checks and automated tests retain their separate validation roles. Independent review and manager acceptance are required for the release pipeline.

## Repository clinical-content and source rules

The following repository requirements apply in full.

Clinical content in this repository is software content, not medical advice. New AI-assisted diagnoses, phenotypes, evidence claims, concepts, question variants, explanations, and chart summaries must remain `needs_clinician_review` until a named clinician explicitly approves a version. Automated tests are not clinical approval. Draft content may be exposed only through the owner/development preview or an explicitly unapproved prototype release.

Keep educational tier, patient acuity, facility capability, and facility progression level as separate fields. Clinical relationships and editorial simulation weights must also remain separate. Do not use race or ethnicity as a disease-selection variable. Do not invent exact probabilities, thresholds, timelines, medication rules, or demographic weights. An exact value requires a source that directly supports that exact value.

### Source restrictions

Do not do any of the following.

- Upload, read, ingest, scrape, or commit proprietary textbook PDFs.
- Use UpToDate, AccessSurgery, commercial question banks, paid review products, proprietary SCORE modules, or recalled ABSITE questions as a corpus.
- Copy or closely paraphrase source prose.
- Copy tables, figures, algorithms, illustrations, question stems, or answer explanations.
- Store full article text or source excerpts in the repository.
- Treat a citation as permission to copy.
- Treat public web access as permission for AI ingestion when a site's terms prohibit automated or AI use.
- Assume PubMed Central availability grants reusable rights.
- Rely on inaccessible or paywalled search-result snippets.
- Create placeholder citations.

Permitted work includes reading current government guidance, suitably licensed open-access articles, and professional-society guidelines. Extract underlying medical facts and independently synthesize short original statements. Store bibliographic metadata, atomic claim mappings, reuse status, and external links. Copyrighted society guidance may be used for targeted factual verification and citation without reproducing protected expression. Follow all attribution requirements for Creative Commons material.

Every source record must include a stable ID, complete citation, organization or journal, authors when applicable, publication year, DOI or official URL, access date, source class, license/reuse status, intended evidence or cross-check use, and the supported evidence-claim IDs. Record medical authority separately from license permissiveness.

Every substantive clinical statement must be represented by an atomic, independently written evidence claim with a stable ID, supporting source IDs, evidence category, certainty or limitation, last-checked date, and clinical review status. Prefer a current guideline plus an independent source for management claims. If only one adequate source exists, record that limitation. If adequate sources conflict, preserve the disagreement and withhold the disputed teaching point for clinician review instead of averaging or guessing.

External clinical links must open safely in a new tab. Do not retrieve web content or call an AI model during gameplay.

### Change discipline

Preserve stable concept IDs when only patient details or question wording change so FSRS history remains attached to the intended concept. Create a new concept version when the underlying clinical meaning changes materially. Keep new clinical data replaceable without rewriting the patient generator, preserve existing frozen encounters and saves, and do not silently promote draft content into an approved public release.

## Research and ranked concepts

1. Survey the topic from permitted sources. Check current primary guidance, its date and scope, and its reuse/AI-access terms before use. A professional-society guideline can support targeted factual verification under its permitted terms. Record excluded sources and the concrete access or reuse limitation.
2. Build a ranked list of the topic's most testable concepts in original language. Consider relevant anatomy, embryology, physiology, pathology, diagnosis, staging, operative decisions, complications and follow-up. Explain expected testing relevance and practical importance qualitatively. Record scope uncertainty for manager review.
3. For each ranked concept, state the decision a surgery resident must make, the raw evidence the resident must interpret, the closest credible clinical error and the consequence of that error. Link existing stable concept IDs and all assigned live/draft versions. Mark concepts with no coverage or redundant coverage.
4. Verify the facts required by each proposed key and the closest alternative. Exact drug regimens, thresholds, timing, eligibility criteria and procedure rankings need direct support. Distinguish constructed patient observations from empirical claims and clinical decision cutoffs.
5. Preserve original access dates and last-checked dates when reusing verified local claims offline. Record a local mapping-check date separately. Several source IDs for the same publication supply one publication. Document source authority, rights and limitations independently.
6. Produce a gap matrix linking each ranked concept to existing variants, audit decisions and new proposed cases. Prefer consequential untested decisions over another surface variant of a represented rule. A new question ID can reuse an existing concept when the clinical meaning is already represented.

The source ledger is `sources-question-topic-<slug>-20261111.json`. Store bibliographic metadata, reuse decisions, atomic claims and links. Include the exact source-to-claim and claim-to-question mappings. Keep source text and excerpts outside the repository.

Use source and claim IDs that incorporate the topic slug. Reuse stable existing IDs where their identity and support remain exact. Keep new topic-local IDs unique across concurrently authored lanes.

## Complete question audit

Audit every assigned exact variant and every distinct visible case/node context, including live original, live accepted, retained drafts, explicit parks and owner holds. Group sibling variants by stable concept to inspect repeated cues and duplicated objectives. Carry registry-only identities into the coverage/history table even when they have no current question. Keep unkeyed slots and withheld teaching points visible in their own ledger.

Each audit row contains the program inventory record ID, concept/case/node/variant IDs, source file and export locator, before-version hash or exact version, current status, clinical approval/freeze reference, verdict and concrete reasons. Use exactly one question verdict from the following set.

- **Keep** retains the exact existing item as an editorial proposal and records any limitation in context, evidence or deliberately basic purpose.
- **Rewrite** proposes a new version in the topic sidecar and specifies the reasoning, fairness or presentation repair.
- **Retire-and-replace** proposes omitting a low-value or duplicate item from future supply and identifies the supported replacement objective and draft. The manager decides retirement and integration. Preserve the old definition and history.

For an unkeyed held slot, record its evidence or clinical decision hold and next action. Keep that planning disposition separate from scored-question verdict totals.

Apply every owner lesson in `docs/clinical/question-authoring-standard.md`, currently `question-authoring.2026-11-08.v15`. Read its entire current version. The audit must address all of the following.

### Objective and clinical reasoning

- State a practical, important decision a general-surgery resident would make. Remove duplicated or inconsequential report-label objectives through a documented replacement proposal.
- Default clinical items require two consequential reasoning steps, interpreting raw findings and applying their meaning to a clinical decision. The resident performs both inferences. A supplied interpretation followed by matching an associated label fails this requirement.
- Name the credible resident error, the closest competing option, the observation separating it from the key and the consequence of misinterpretation. Change that observation in a counterfactual and re-solve the options. The decision should change for the stated reason.
- Match the current care phase. All options compare the same decision stage and semantic category. Give specific named investigations, medicines, procedures, operations, referrals or plans with comparable scope.
- Supply the supported goals, eligibility criteria, acquisition details, treatment response and constraints required for a single best answer. Preserve clinically necessary negatives and urgent warning signs.
- Preserve actual chronology, site, anatomy and tissue/sample provenance. Distinguish a missing exported series from an unperformed acquisition, an adequate negative examination from a wrong-site examination, represented tissue from unsampled tissue and current response from a hypothetical future response.
- Apply the deletion test to each sentence and the whole update/exhibit. Every included detail should change the decision, key boundary or necessary patient context. Replace preinterpretation with supported observations and independently re-solve the revised item.
- Inspect the complete visible sequence, finite profiles, prior results and feedback. A prior explanation can supply the next answer. Each later scored node needs a distinct consequential decision. Record any frozen companion or selector/eligibility constraint for manager review.
- Deliberately easy safety or onboarding items need their exact accepted purpose and review reference. Tier, tutorial eligibility and a management companion do not establish an accepted basic exception.

### Cue attack and options

- Cover the choices and confirm that the task is complete. Cover the key and attack every visible field for wording overlap, diagnosis disclosure, rationale paraphrase, length/specificity outliers, convergence, option-eliminating negatives, named missing actions, availability permissions and teaching sentences.
- Inspect the task separately. A word or property matched uniquely by the key can reveal the answer. Legitimate named comparisons and necessary goals need a reason for their inclusion.
- Use three or four credible options with parallel grammar, comparable specificity and length, and the same semantic category. Every option should sound like an actual proposed action or interpretation.
- Remove “X alone” caricatures, generic individualized/shared-decision labels, uniquely complete or cautious plans, explanatory distractors, unsupported absolutes, grammatical clues, near-duplicates, overlapping answers and implausible anatomy or clinical actions.
- Give every distractor a specific temptation, the error it represents, the observation making it less appropriate here and a counterfactual where it would become reasonable. Keep rationales in post-answer feedback.
- Inspect component frequency and novelty in paired or matrix options. Majority components, a new comparison appearing only in the key or a unique phrase can allow logical elimination without interpreting data.
- Use real competing choices at the same stage. Keep shared background care common across options. Avoid a cautious information-gathering key versus treatments that the vignette has already made premature.
- For QI or process exhibits, preserve compatible denominators and comparable baselines. Require a real tradeoff or confounding problem. Separate counts from time totals and proposed testing from demonstrated benefit.
- Use usable exhibits when interpretation of a tracing/image is the objective. Confirm an asset exists and renders. Independently constructed teaching material must be labelled and supported. Protected figures remain excluded. Accessibility observations preserve the inference required of the learner.

### Owner presentation rules

- Use a chief complaint of usually 1–5 words, describing a symptom, question or visit reason.
- Present the specific named patient. Preserve a consistent age and sex, generated name/character and clinically constrained profile. Avoid abstract “A patient with” openings and complaint/presentation duplication.
- Employee or methods discussions retain their actual identity and work/study context. Patient-encounter exercises use the required short clinic frame when the engine requires one.
- Every task remains complete after presentation and question text are separated for display. Name the actual patient/site/stage when the decision depends on them.
- Keep patient preferences, setting and mechanism descriptions only when they earn their role in the decision. The clinical story, imaging acquisition, examination and proposed action must agree.
- Randomize runtime answer choices. Label every key-first review display **“key shown first for review only.”**
- Supply runtime wait metadata for every testing choice, including distractors. Use existing placeholder profiles and exact choice identity/label mappings. Fixed wait durations stay out of authored prose. Record required new timing/order identities in the sidecar and handoff for manager integration.
- Keep service/result-gate scope aligned with the proposed action. A planned estimate does not establish that gameplay executes the test. Preserve legacy/frozen records and avoid array-position reuse after options change.

### Harder author gate

Manually record the five author checks for each new or revised exact item.

1. Cover-the-key cue attack across the full visible context and finite profiles.
2. One decision stage and one category, with specific named options.
3. Two consequential supported reasoning steps for clinical items.
4. Predicted resident difficulty from credible competing errors. A PGY-2/3 should plausibly find the item moderate or hard.
5. One defensible best answer under the stated goals, evidence and resources, with the deciding observation and a decision-changing counterfactual.

Record the actual attacks, reasoning and repairs. Repair a failing draft and repeat the manual gate on its new exact version before handoff. Automatically populated successful booleans are insufficient. Preserve independent PASS and exact clinician-approved versions and any batch currently frozen for review. Author self-checks confer no independent PASS or clinical approval.

Difficulty is a qualitative author/reviewer prediction. Per-question correctness collection, answer-statistics mining, FSRS/save analysis for performance and statistical release gates are outside this program. Voluntary flags may identify wording or fairness issues and must be matched to the exact variant and visible context.

## Statistics-specific owner standard

For any statistics node, the 2026-11-08 owner direction takes precedence over the clinical two-step, multi-part and moderate/hard defaults.

- Test one concept and one skill per node. Ask for one quantity, interpretation, study design or test choice. Keep secondary clinical actions, protocol decisions, compound answers and multi-part chains out of the item.
- Target at most 45 words before the task, with a hard cap of 60. Count prose and exhibits separately and also count the combined pre-task material, including captions, labels and numbers. Use a compact 2×2 table when needed.
- Name the exact requested quantity. Supply values once, with necessary units, grouping, independence/pairing, outcome type, group count, distribution, confidence level, effect scale, null model and horizon where relevant.
- Use small, round constructed values and mental arithmetic with one correct result or explicit rounding. Label constructed data. Keep invented audit stories, unused values and narrative padding out of the stem.
- Feedback gives the reusable rule/formula and worked values in 2–4 short lines, followed by one short line addressing the closest error. Test-selection feedback explains the data structure and applicable assumption. Keep the rule and worked answer after the choice.
- Use three or four parallel alternatives based on credible denominator, inversion, scale, effect-measure or test-selection errors. Randomize runtime choices and explicitly label key-first review displays.
- A resident who knows the rule should plausibly finish in under a minute. This is authoring intent. Re-solve every calculation and test selection, including the closest alternative and assumptions.
- Pure methods exercises retain a minimal study frame. If the patient engine needs a clinic frame, use one short named age/sex line and a 1–5-word complaint. A complete study-quantity task can stand without repeating the patient's name.
- Reuse permitted methods sources and atomic claims when adequate. Record constructed algebra separately from empirical clinical claims. New versions remain `needs_clinician_review`, with stable concept identity preserved for unchanged meaning.

The five-check author gate still requires fairness, cue resistance and one defensible key. Record the one-skill statistics exception explicitly in the reasoning/difficulty fields.

## Rewrites and new gap-filling cases

Preserve stable concept IDs when wording, patient details or difficulty improve without changing the clinical meaning. Use a new question version and retain its exact before reference. When the scored clinical meaning materially changes, create an explicit new concept version with the previous concept ID, changed objective, clinical reason, evidence claims and `needs_clinician_review`. Preserve all old definitions, frozen encounters, timing/order records and FSRS history.

Review all variants of each concept together. Vary consequential observations and competing errors. Cosmetic name/number substitutions and a repeated unique key phrase add little coverage.

Fill untested high-priority concepts after the complete audit. Prefer natural multi-part clinical cases with several sequential decisions, such as diagnosis, interpretation, intervention and a later complication or response. Each node has its own complete task and one narrow scored objective. Later nodes must earn their inference despite prior results and feedback. Keep task stages clinically realistic and ensure the encounter does not reveal future findings prematurely.

Use a single-node case when the concept naturally has one consequential decision. The statistics lane uses the minimal single-skill exception. Avoid adding an unrelated objective to increase difficulty or satisfy a case-size quota.

Reused concepts add variants. A genuinely distinct meaning adds a new concept version. Report those counts separately. Include standalone versus paired-only selection limitations in the handoff without changing the selector or FSRS eligibility.

## Owner approvals needed

Use this exact heading in the topic packet. List specific unresolved clinical choices for Melissa, each with the affected exact item/concept, the competing named actions, the evidence boundary or disagreement and the precise question she must decide. Carry forward the supplied owner holds until an explicit applicable decision resolves them. Keep the unkeyed state when a defensible key cannot yet be supported.

Record ordinary wording, file organization and implementation choices in the decision log. Route architecture, cross-topic ownership and integration questions to the manager. Exact new/revised clinical versions retain their review state pending named clinical sign-off.

## Review packet format

The Markdown packet should be readable by an independent reviewer with no worker-chat context. The JSON packet provides the same exact identities and structured mappings.

Include the following sections.

1. Topic scope, inventory snapshot, relevant drift, progress and next action.
2. Ranked testable concepts with reasoning, sources and coverage/gap matrix.
3. Complete audit table with every assigned record/variant, one verdict and specific reasons.
4. Before/after review packet for each rewrite or replacement. Include the exact old IDs/version, presentation, complaint, demographics/profiles, current update, exhibits, complete task, key-first review-only options, key, explanation and every distractor rationale. New questions have an explicit empty before field.
5. For every proposed node, show both reasoning steps or the statistics exception, closest credible error, deciding observation, deletion/counterfactual result, cue attack and manual author gate record.
6. Stable-concept versus new-meaning decisions, previous IDs, retained histories and frozen/PASS/clinical-approval constraints.
7. Atomic claims and full source records or exact ledger references, rights/access findings, limitations and withheld disagreements. Link each substantive statement to its claim.
8. Local timing/order proposals for every testing choice, safe source-link metadata and shared integration dependencies.
9. Owner approvals needed, including the exact clinical questions and unresolved evidence boundaries.
10. Validation commands, complete outcomes, failures and relevant pre-existing/out-of-lane limitations.

Keep runtime options randomized in the authored data. Label the packet **“key shown first for review only.”** The review order is a presentation choice for inspection.

## Focused validation

Run from the repository root in PowerShell after substituting the exact slug.

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads src/question-topic-<slug>-20261111.test.ts
npm.cmd run typecheck --workspace @gamify-surgery/clinical-content
```

The focused file should verify the topic module's identities, required mappings, supported structures, randomized runtime flags and all testing-choice metadata using existing representations. Check the new topic sidecar through its normal explicit import entry point. Keep checks for exact preserved inputs where the proposed revision depends on them. Tests validate structure and implementation.

Validate the two owned JSON outputs by parsing them. Record exact commands, exit codes and test totals. Clinical-content typecheck covers the package and may reveal concurrent failures. Report those with file/line evidence to the manager and keep repairs within the owned lane.

The manager runs assembled-release advisory lint, cross-topic composition and broader integration checks after acceptance. Document manual cue dispositions and any advisory lint evidence available from the existing tooling in the topic packet.

## Acceptance and final handoff

Before ending, reconcile the assigned inventory against the audit table. Every exact assigned question has a verdict and reasons. Every proposed new/revised item has evidence/rights mappings, a concrete author gate record, timing metadata where applicable and `needs_clinician_review`. All five output files remain within the slug lane. Record unfinished clinical decisions and integration work precisely.

End with this compact handoff format.

```text
Topic <slug>
Files changed <the five paths actually written>
Inventory <snapshot and any relevant drift>
Counts audited <n>, kept <n>, rewritten <n>, retired-and-replaced proposed <n>, new <n>
Count basis <unique exact variants and case/node audit rows, with reused/new concepts separated>
Held/unkeyed <counts and exact IDs>
Research <ranked gaps covered and remaining source limitations>
Packet <Markdown, JSON and source-ledger paths>
Identity preservation <unchanged concepts, new meanings, exact frozen/approved versions>
Owner approvals needed <specific unresolved clinical decisions>
Integration <shared-file dependencies and cross-topic/selection constraints>
Validation <exact commands, exit codes, tests passed/failed, typecheck and JSON results>
Open work <precise next action and responsible owner>
```

Stop after this bounded topic handoff. The manager reviews the actual diff and validation evidence, obtains independent review, coordinates clinical decisions and decides exact acceptance/integration.
