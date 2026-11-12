# Trauma initial assessment and abdominal injury — skipped-PASS salvage

## Assignment and baseline

This is the manager’s bounded salvage follow-up to acceptance batch 1, dated 2026-11-11. Only the five owned topic files are writable. Accepted topic nodes and cases, the manifest, shared registries, runtime and other workers’ files are protected. Original wave-1 Assignment fields below are retained as the historical starting inventory; they are not refreshed to the accepted epoch.

```json
{
  "topicSlug": "trauma-initial-abdomen",
  "title": "Trauma â€” initial assessment and abdominal injury",
  "wave": 1,
  "scopeIn": "Primary/secondary survey, damage control, hemorrhage control, penetrating/blunt abdominal and pelvic/retroperitoneal visceral injury, solid-organ observation and operative decisions.",
  "scopeOut": "Thoracic injury belongs to trauma-thoracic. Head/spine and musculoskeletal injury belong to trauma-head-spine-extremities. Generic transfusion biology belongs to hematology-transfusion-coagulation.",
  "priority": "high",
  "priorityReason": "A central trauma lane appears largely absent from the existing live objectives.",
  "startingCounts": {
    "liveConcepts": 0,
    "liveNodes": 0,
    "liveCases": 0,
    "liveVariants": 0,
    "liveAcceptedNodes": 0,
    "liveOriginalNodes": 0,
    "registeredConcepts": 0,
    "registeredWithoutLiveNodes": 0,
    "drafts": 0,
    "draftVariants": 0,
    "draftConcepts": 0,
    "explicitOwnerHeldVersions": 0,
    "unassembledDraftVariants": 0,
    "unkeyedParkedSlots": 0,
    "withheldTeachingPoints": 0,
    "liveClinicalConcepts": 0
  },
  "inventory": [],
  "concepts": [],
  "caseAssignments": [],
  "nodeAssignments": [],
  "variantAssignments": [],
  "identityReuseNotes": [],
  "recordedHolds": [],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "frozenIndependentPASSReferences": [],
  "clinicalApprovalReferences": [],
  "managerPlan": "docs/research/question-topic-program-20261111.md",
  "managerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md",
  "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
  "generatedAt": "2026-11-11T15:41:40.423Z",
  "programId": "question-topic-program.2026-11-11.v1",
  "release": {
    "id": "clinical.synthetic.prototype.v1",
    "manifestId": "question-ship.2026-11-10.v9",
    "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
    "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
    "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
    "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
  },
  "baselineGlobalCounts": {
    "manifestRows": 145,
    "cases": 1151,
    "nodes": 1462,
    "concepts": 610
  },
  "inputSha256": {
    "AGENTS.md": "1290a51fa5e98a61711369a8c65a904b55f47ff7e5fbddea437f5c04ed7c0241",
    "docs/clinical/question-authoring-standard.md": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
    "docs/research/question-topic-worker-brief-template-20261111.md": "59ca1edf7b3ff2ee443f45afd3e083a734627858d897468dd566aae47fea788e",
    "docs/research/question-topic-program-20261111.json": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
    "packages/clinical-content/src/question-ship-manifest.ts": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
    "packages/clinical-content/src/synthetic-content.ts": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
    "packages/clinical-content/src/schema.ts": "c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7",
    "packages/clinical-content/src/pilot-schema.ts": "5c8e0c83e1fcd8f28c34e8f568ea3a6e231c2d3dd4c30ca540185ec4325f2ba3"
  },
  "snapshotDriftFiles": [],
  "dirtyPathCountAtIntake": 2894
}
```

## Current salvage scope — review only these three cases

**3 skipped PASS nodes → 3 standalone clinic chart-review cases. Status: `salvage`. Zero clinical rewrites, zero new patient observations, zero changed answer choices or keys.** The existing presentation is already sufficient in each case and is copied exactly, including the neutral title, age/sex, named patient and historical hospital-decision frame.

The acceptance receipt contains 12 requested topic nodes: 9 accepted and 3 skipped because their original cases contained non-PASS companions. All nine accepted nodes and their six case records remain exact. No companion was revised clinically or admitted. Source catalog after extraction: 18 active questions / 14 cases / 4 multipart cases. The new reviewer-only export contains exactly 3 questions / 3 cases / 3 meanings.

Authority: `docs/research/question-topic-acceptance-batch1-dispositions-20261111.json`, SHA-256 `bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4`. Summary: `docs/research/question-topic-acceptance-batch1-20261111.md`. Preserved independent PASS: `docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json`.

| Status | Standalone case ID | Unchanged node ID | Unchanged exact question ID |
|---|---|---|---|
| salvage | `case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1` | `node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1` | `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1` |
| salvage | `case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1` | `node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1` | `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1` |
| salvage | `case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1` | `node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1` | `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1` |

Review queue: `salvage.reviewQueue` in the JSON. Explicit imports: `QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_CASES`, `QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_QUESTIONS` and `QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_SOURCE_RELEASE`. No accepted node is queued for re-review.

All versions remain `needs_clinician_review`. Salvage is a context-review status, not independent PASS of the new composition, clinical approval, manifest acceptance or a release.

Closing validation: **54/54 focused tests pass.** Package typecheck exits 1 with **65 errors in four out-of-lane files; zero owned-file errors**. Exact outputs and the concurrent integration history are below.

## Exact standalone review packets

**key shown first for review only.** Runtime choices remain randomized. Each case has one current scored node; prior observations, prior feedback and future companion updates are absent. The existing final-answer contract adds neutral `no_terminal_outcome` dispositions for each wrong answer, using its unchanged rationale; no acute treatment or patient outcome is simulated.

### liver-grade-versus-physiology — salvage

```json
{
  "status": "salvage",
  "caseId": "case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "clinicalPayloadSha256": "06017ababeb4262940351145d5d84fae802b415e0cf4c50c4fb6338151920b2d",
  "currentNodeDraftSha256": "70ae25a630a933ec16e14ac36dd652468444570b8d25288655a00dfd57a492a6",
  "currentCaseDraftSha256": "0251373281a0b86ceb1be3f62a8fe639391e111a5a826cb8f38cdf070545e4b6",
  "originalMixedCaseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
  "originalMixedCaseDraftSha256": "a1588e33f145d0c85c17f34ecfb6ffd20fef800ccb94ac7b1b71d9170728222d",
  "originalNodeSha256": "c03f6d6c8171df310928bd4e1ca76deb0953148d9670f8aa80cb739115b08f6a",
  "passReference": {
    "file": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json",
    "fileSha256": "c9586d20cfe580ec28442df3f424ba9019463c54de61bdcf52e287ad07f43654",
    "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
    "verdict": "PASS"
  }
}
```

**Before:** the exact PASS belonged to `case.topic.trauma-initial-abdomen.liver-complication-chain.v2` with `node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1`, `node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1`, `node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2`. The complete source case and node are retained at `salvage.retainedMixedCases` / `salvage.retainedSkippedNodes`.

**After:** a single-node case, with no imported companion question, answer or feedback. Only case/profile/presentation identities, sequence metadata and review-queue metadata change. Clinical wording, options, key, update, exhibit, explanation, claims and original author gate remain exact. The original mixed-case timing/order tuples are retained separately.

**Patient:** Maya Grant, 42 years, Female. **Chief complaint:** Trauma follow-up.

**Presentation (exact existing template; no added clinical fact):**

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile:

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma."
  }
]
```

Existing runtime admission: clinic / `capability.examination` / facility stage 0 / `reward.clinic_basic`. Educational tier `resident_application` and historical acuity `urgent_stable` remain separate.

**Current update (unchanged):** _None._

Constructed trauma record; fictional observations

| Field | Unchanged recorded observation |
|---|---|
| CT | AAST grade IV liver laceration; no arterial extravasation or additional visceral injury |
| Serial record | BP 124/76 mmHg; pulse 88/min; no blood/vasopressor requirement; hemoglobin unchanged |
| Examination | Right upper quadrant tenderness without guarding or rebound |

**Complete task (unchanged):** Which management plan should {patientName} receive for this liver injury?

1. **Monitored nonoperative hepatic care** — KEY

   `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe`

   Unchanged rationale: Grade is substantial but physiology, serial examination and absence of a vascular focus support monitored nonoperative care. Grade alone does not require laparotomy.

   Credible error: Key

   Reasonable counterfactual: Stable isolated injury without peritonitis or another operative indication.

   Atomic claims: `claim.trauma-initial-abdomen.liver-nonoperative`. Timing: `no_test`.

2. **Hepatic angiography with empiric embolization**

   `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography`

   Unchanged rationale: There is no arterial target or continued blood requirement. Anatomic grade alone does not establish a need for empiric embolization.

   Credible error: Treat high grade as proof of active arterial hemorrhage.

   Reasonable counterfactual: Active arterial extravasation appears while circulation remains sustained.

   Atomic claims: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`. Timing: `timing.test.advanced_diagnostic`.

3. **Laparotomy with operative hepatic hemorrhage control**

   `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.laparotomy`

   Unchanged rationale: Routine laparotomy adds intervention when this stable isolated injury has no current operative indication.

   Credible error: Use grade in place of physiology and associated-injury assessment.

   Reasonable counterfactual: Hemorrhage produces ongoing instability or another injury requires surgery.

   Atomic claims: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe`

**Explanation (unchanged):** Grade is substantial but physiology, serial examination and absence of a vascular focus support monitored nonoperative care. Grade alone does not require laparotomy.

Original concrete deciding observation, counterfactual and deletion test remain exact:

```json
{
  "singleBest": {
    "decidingObservation": "sustained stability without an arterial focus or another operative injury",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
    "consequenceOfClosestError": "There is no arterial target or continued blood requirement. Anatomic grade alone does not establish a need for empiric embolization.",
    "counterfactualChange": "Replace absent extravasation with active hepatic arterial extravasation while circulation remains stable; angiography becomes supported.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
    "counterfactualResolution": "Active arterial extravasation appears while circulation remains sustained."
  },
  "deletionTest": {
    "deciderAblation": "Removing sustained stability without an arterial focus or another operative injury removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed injury as an unnecessary key-only task-word echo.",
    "actualResolution": "Delete the serial/vascular observations and grade IV alone cannot choose among monitoring, arterial intervention and surgery. A current arterial focus changes the key to angiography despite the same grade.",
    "sentenceAndExhibitJobs": "Grade supplies the tempting anatomic severity, while the negative vascular finding and actual sustained course govern whether intervention is indicated."
  }
}
```

Standalone context check (author only; no clinical or independent approval):

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "status": "salvage",
  "minimalPresentation": "Existing named clinic frame and age/sex/mechanism retained exactly; no earlier question is needed.",
  "decidingRecord": "The unchanged CT, serial physiology and examination are all in the single scored node.",
  "priorOrFutureAnswerLeak": "None: no other scored node, prior feedback or future update in this case.",
  "clinicalChange": "None; original author gate and independent PASS remain exact, including the nonblocking empiric wording."
}
```

All statement/option/feedback evidence mappings remain: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.hepatic-devascularized-complication`. Full source provenance, authority and reuse status remain in `sources-question-topic-trauma-initial-abdomen-20261111.json`.

### liver-delayed-arterial-bleeding — salvage

```json
{
  "status": "salvage",
  "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "clinicalPayloadSha256": "af2bde24429c1bfdf92837645164eac53e5dcb078ecc4ebbac9606f796198a50",
  "currentNodeDraftSha256": "9d8aaf0bc6331402142231d548f5e61bd7a0ba0e5a49e6627a8c92567d9e5b22",
  "currentCaseDraftSha256": "5ab3ee3fd9c7d362ad71ed660066812d3dfbdbee3f7a638bf283d2084a8065b1",
  "originalMixedCaseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
  "originalMixedCaseDraftSha256": "a1588e33f145d0c85c17f34ecfb6ffd20fef800ccb94ac7b1b71d9170728222d",
  "originalNodeSha256": "be3319bee976254964f337c01ec7c850e865ffb34f6608a2413aa4489c81d9b9",
  "passReference": {
    "file": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json",
    "fileSha256": "c9586d20cfe580ec28442df3f424ba9019463c54de61bdcf52e287ad07f43654",
    "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
    "verdict": "PASS"
  }
}
```

**Before:** the exact PASS belonged to `case.topic.trauma-initial-abdomen.liver-complication-chain.v2` with `node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1`, `node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1`, `node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2`. The complete source case and node are retained at `salvage.retainedMixedCases` / `salvage.retainedSkippedNodes`.

**After:** a single-node case, with no imported companion question, answer or feedback. Only case/profile/presentation identities, sequence metadata and review-queue metadata change. Clinical wording, options, key, update, exhibit, explanation, claims and original author gate remain exact. The original mixed-case timing/order tuples are retained separately.

**Patient:** Maya Grant, 42 years, Female. **Chief complaint:** Trauma follow-up.

**Presentation (exact existing template; no added clinical fact):**

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile:

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma."
  }
]
```

Existing runtime admission: clinic / `capability.examination` / facility stage 0 / `reward.clinic_basic`. Educational tier `resident_application` and historical acuity `urgent_stable` remain separate.

**Current update (unchanged):** During admission, melena develops and hemoglobin falls. BP is 116/70 mmHg without support. Upper endoscopy shows blood emerging at the major papilla and no mucosal bleeding lesion.

Constructed trauma record; fictional observations

| Field | Unchanged recorded observation |
|---|---|
| CT | A rounded contrast-filled sac within the prior liver injury communicates with a hepatic arterial branch and follows arterial blood-pool enhancement |

**Complete task (unchanged):** Which procedure should control {patientName}'s current bleeding?

1. **Hepatic angiography with selective embolization** — KEY

   `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize`

   Unchanged rationale: Papillary blood after liver trauma plus an arterial-connected contrast sac identifies a hepatic arterial bleeding pathway. Angiographic embolization addresses that source.

   Credible error: Key

   Reasonable counterfactual: Post-traumatic hepatic arterial lesion without severe circulatory compromise.

   Atomic claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Timing: `timing.test.advanced_diagnostic`.

2. **Laparotomy with hepatic hemorrhage control**

   `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate`

   Unchanged rationale: The patient has a stable, localizable arterial target. An endovascular approach can address it before an operative rescue is needed.

   Credible error: Escalate a delayed arterial complication directly to surgery despite sustained stability.

   Reasonable counterfactual: Ongoing hemorrhage causes instability despite resuscitation or minimally invasive control fails.

   Atomic claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`. Timing: `no_test`.

3. **ERCP with transpapillary biliary stenting**

   `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent`

   Unchanged rationale: A biliary stent can address persistent bile leakage but does not control the demonstrated hepatic arterial source.

   Credible error: Confuse the route by which blood enters the bowel with the bleeding source to treat.

   Reasonable counterfactual: Persistent biliary leakage remains after appropriate collection/source assessment, without an untreated arterial bleeding lesion.

   Atomic claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.bile-leak-adjunct`. Timing: `timing.test.therapeutic_ercp`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize`

**Explanation (unchanged):** Papillary blood after liver trauma plus an arterial-connected contrast sac identifies a hepatic arterial bleeding pathway. Angiographic embolization addresses that source.

Original concrete deciding observation, counterfactual and deletion test remain exact:

```json
{
  "singleBest": {
    "decidingObservation": "papillary blood and an arterial-connected contrast sac with sustained circulation",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
    "consequenceOfClosestError": "The patient has a stable, localizable arterial target. An endovascular approach can address it before an operative rescue is needed.",
    "counterfactualChange": "Replace sustained stability with collapse during resuscitation; operative hemorrhage control becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
    "counterfactualResolution": "Ongoing hemorrhage causes instability despite resuscitation or minimally invasive control fails."
  },
  "deletionTest": {
    "deciderAblation": "Removing papillary blood and an arterial-connected contrast sac with sustained circulation removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration.",
    "actualResolution": "Delete papillary blood or the contained arterial sac and the proposed mechanism is less secure. Replace sustained circulation with collapse and the immediate hemostatic route changes to surgery.",
    "sentenceAndExhibitJobs": "The endoscopic localization separates blood entry from source; the arterial sac identifies that source; current physiology chooses the supported route."
  }
}
```

Standalone context check (author only; no clinical or independent approval):

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "status": "salvage",
  "minimalPresentation": "Existing Maya clinic/blunt-trauma frame retained exactly. The PASS update and CT already identify admission, prior liver injury and the current bleeding record.",
  "decidingRecord": "Papillary observation, arterial communication and current unsupported circulation remain visible exactly. Initial grade and prior management answer are not imported.",
  "priorOrFutureAnswerLeak": "None: no earlier liver question, initial feedback or subsequent bile-collection story.",
  "clinicalChange": "None; original task, options, key, feedback, exhibit and author gate preserved."
}
```

All statement/option/feedback evidence mappings remain: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Full source provenance, authority and reuse status remain in `sources-question-topic-trauma-initial-abdomen-20261111.json`.

### renal-isolated-urine-leak — salvage

```json
{
  "status": "salvage",
  "caseId": "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "clinicalPayloadSha256": "15c91ac66f8c20a1ad112b8151f8084108b5097fc9d68cd205da247a8b196376",
  "currentNodeDraftSha256": "aef34087e4fb3f6094b19de7f8eaa8a3074bbf30ac077538c591bf99ba269762",
  "currentCaseDraftSha256": "8b986b839b2e750c69e46a8c4c145323549cdecfac8f818e2d91de9c04b2353a",
  "originalMixedCaseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
  "originalMixedCaseDraftSha256": "5af52a945d28709878fcf733263235b4d9827eb4ab864181d4017583d706001b",
  "originalNodeSha256": "e225a06ee254e5f479552cabdd2f0fa9afc743f885e724404f8dea5af0d2b6c3",
  "passReference": {
    "file": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json",
    "fileSha256": "c9586d20cfe580ec28442df3f424ba9019463c54de61bdcf52e287ad07f43654",
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
    "verdict": "PASS"
  }
}
```

**Before:** the exact PASS belonged to `case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2` with `node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2`, `node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1`. The complete source case and node are retained at `salvage.retainedMixedCases` / `salvage.retainedSkippedNodes`.

**After:** a single-node case, with no imported companion question, answer or feedback. Only case/profile/presentation identities, sequence metadata and review-queue metadata change. Clinical wording, options, key, update, exhibit, explanation, claims and original author gate remain exact. The original mixed-case timing/order tuples are retained separately.

**Patient:** Iris Bennett, 31 years, Female. **Chief complaint:** Trauma follow-up.

**Presentation (exact existing template; no added clinical fact):**

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision.

Exact finite profile:

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
    "prototypeDemographics": {
      "ageYears": 31,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision."
  }
]
```

Existing runtime admission: clinic / `capability.examination` / facility stage 0 / `reward.clinic_basic`. Educational tier `resident_application` and historical acuity `urgent_stable` remain separate.

**Current update (unchanged):** The completed CT shows a perfused laceration entering a calyx with a small nearby urine leak. Delayed images opacify the pelvis and ureter through to the bladder. There is no arterial extravasation. Circulation and serial hemoglobin remain stable, without fever or an enlarging collection.

_No separate exhibit._

**Complete task (unchanged):** Which initial renal management plan should {patientName} receive now?

1. **Monitored nonoperative renal care** — KEY

   `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.observe`

   Unchanged rationale: Staging confirms preserved urinary continuity without a hemorrhagic or symptomatic leak complication. Isolated urine extravasation does not itself require intervention.

   Credible error: Key

   Reasonable counterfactual: Stable injury without proximal avulsion, infection, obstruction or symptomatic nonresolving collection.

   Atomic claims: `claim.trauma-initial-abdomen.renal-urine-observe`. Timing: `no_test`.

2. **Retrograde ureteral stent placement**

   `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent`

   Unchanged rationale: A stent may treat a persistent or symptomatic leak, but this limited leak and preserved drainage do not establish that complication.

   Credible error: Treat any urinary extravasation as an automatic stent indication.

   Reasonable counterfactual: A persistent symptomatic urinoma or impaired drainage develops during observation.

   Atomic claims: `claim.trauma-initial-abdomen.renal-urinoma-intervention`, `claim.trauma-initial-abdomen.renal-urine-observe`. Timing: `no_test`.

3. **Operative renal exploration and repair**

   `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.operate`

   Unchanged rationale: There is no demonstrated uncontrolled hemorrhage or avulsed collecting-system outlet requiring operative repair.

   Credible error: Treat collecting-system involvement as an automatic indication for exploration.

   Reasonable counterfactual: An operative indication emerges, such as uncontrolled hemorrhage or a major outlet disruption needing reconstruction.

   Atomic claims: `claim.trauma-initial-abdomen.renal-urine-observe`, `claim.trauma-initial-abdomen.renal-preservation`. Timing: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.observe`

**Explanation (unchanged):** Staging confirms preserved urinary continuity without a hemorrhagic or symptomatic leak complication. Isolated urine extravasation does not itself require intervention.

Original concrete deciding observation, counterfactual and deletion test remain exact:

```json
{
  "singleBest": {
    "decidingObservation": "preserved urinary continuity and limited leakage without clinical progression",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent",
    "consequenceOfClosestError": "A stent may treat a persistent or symptomatic leak, but this limited leak and preserved drainage do not establish that complication.",
    "counterfactualChange": "Replace this uncomplicated course with a persistent symptomatic urinoma requiring collecting-system drainage; ureteral stenting becomes reasonable.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent",
    "counterfactualResolution": "A persistent symptomatic urinoma or impaired drainage develops during observation."
  },
  "deletionTest": {
    "deciderAblation": "Removing preserved urinary continuity and limited leakage without clinical progression removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed injury as an unnecessary key-only echo from previous feedback.",
    "actualResolution": "Delete delayed continuity imaging and a proximal disruption is unresolved. Delete the uncomplicated stable course and a persistent symptomatic leak could justify a stent; a urine-leak label alone cannot determine that.",
    "sentenceAndExhibitJobs": "Calyceal origin, opacified ureter and lack of progressive symptoms separate a limited leak from avulsion/obstruction or a symptomatic urinoma."
  }
}
```

Standalone context check (author only; no clinical or independent approval):

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "status": "salvage",
  "minimalPresentation": "Existing Iris clinic/rollover frame retained exactly. The completed CT and current clinical course remain in the PASS update.",
  "decidingRecord": "The update itself supplies perfusion, calyceal leak, urinary continuity, lack of arterial extravasation and stable initial course.",
  "priorOrFutureAnswerLeak": "None: the earlier acquisition question and its explanation are excluded; no future complication outcome added.",
  "clinicalChange": "None; no new negative symptom or treatment criterion introduced."
}
```

All statement/option/feedback evidence mappings remain: `claim.trauma-initial-abdomen.renal-urine-observe`, `claim.trauma-initial-abdomen.renal-urinoma-intervention`, `claim.trauma-initial-abdomen.renal-preservation`, `claim.trauma-initial-abdomen.renal-excretory-phase`. Full source provenance, authority and reuse status remain in `sources-question-topic-trauma-initial-abdomen-20261111.json`.

## Preservation and identity evidence

All nine accepted topic node records and six accepted source case records are byte-exact by canonical JSON SHA-256. Shared accepted snapshot/wrapper, manifest, release source, timing registry, schemas, receipt and PASS review files are hashed at salvage intake and checked again at closure. No accepted definition is modified by importing this sidecar.

```json
{
  "protectedAcceptedNodes": [
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "sha256": "dc2f5168fac7d21cc2f2b29189fa732740bed67bcc2c6fc0bb429dff60551b60"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "sha256": "45738934ea9d5497b6161f291d2fd683bc5af907a6c5fc95b4337dae514331fd"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "sha256": "e5def9f655b3de98b7248a6d7d061cde83057471be5a1ac2c09f35cabb0e4452"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "sha256": "bfa7768a034680837208d5fc83f8de0ce4fac072dc853d8db8aeacccc82fabf6"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "sha256": "c469c79979e1aaaa2755f6309d92f83588f287eecc5d6ab1c263f984f957c954"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "sha256": "c6f33db52e0bbbeb94439081ead12994bac8ae0296099fa57e1080590b21f8ae"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
      "sha256": "c6e45c274c2973bef7c17983ef59967457b07b94a0569459e95cac052b9a5df9"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
      "sha256": "9b3822719cd44107e340b490e14d4881d1ccfa564566e39c8c893900bc70f06a"
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
      "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
      "sha256": "a93e2de97ec5d6c6ca0b89d9f15546c5a8b8433c9d0f9ed6e0a397c8dc87a2de"
    }
  ],
  "protectedAcceptedCases": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "sha256": "49482ac907da93a33c2c756dda942e1fd68ac60203fbe26c2ffb337a764a9940"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "sha256": "a12dab157f2055a55384ee65d3344681430736cd87151251af6cacbc973b2dd5"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "sha256": "42c9cd057c9c296b164f5cdd84c30d30a364ff52182f0dca5736944cdc1147cf"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
      "sha256": "1ea0bf5996f23b07641e756484ffebc370fff330137839ba619b9e0684c5b218"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
      "sha256": "b24836913799a94f28669bb02ed35e86b90a49f8033abf769ced3173da4cf5e2"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
      "sha256": "e376b676570fb8f570ac67a7a74f73a3f420528cff98cdc74b280cd55a6a2784"
    }
  ]
}
```

The original meaning IDs and FSRS histories remain attached to all three questions. No new meaning, question version, empirical claim, probability, cutoff, timeline or source is added. The full 15-source / 55-claim arrays remain exact; original access/last-checked dates are preserved. `salvageMappings` in the source ledger is a local context-to-case mapping, not source re-verification.

Accepted epoch at salvage intake: 1,167 cases / 1,482 nodes / 631 registered meanings / 167 manifest rows. The focused test uses the existing strict acceptance inverse to prove the authorized entire delta before reconstructing the immutable 1,151 / 1,462 / 610 / 145 epoch. Historical hashes and captures are not refreshed.

```json
{
  "helper": "packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts",
  "purpose": "The helper first proves the entire exact authorized batch1 release/manifest/timing/source delta, then reconstructs the immutable 1151/1462/610/145 test epoch. Current-intake hashes independently protect accepted shared files. No historical capture/hash is refreshed.",
  "acceptedCurrentCounts": {
    "cases": 1167,
    "nodes": 1482,
    "registeredMeanings": 631,
    "scoredMeanings": 475,
    "acceptedRows": 167,
    "timingRows": 2317
  },
  "priorCounts": {
    "cases": 1151,
    "nodes": 1462,
    "registeredMeanings": 610,
    "scoredMeanings": 454,
    "acceptedRows": 145,
    "timingRows": 2295
  },
  "concurrentAcceptedEpoch": {
    "program": "acceptance_batch2",
    "helper": "packages/clinical-content/src/question-program-batch2-acceptance-test-support.ts",
    "migration": "tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json",
    "migrationSha256": "6d79bd30356c9ef44326043e9ee6584c050a966a1ad2ccbf47463625ee09f06e",
    "meaning": "Concurrent manager integration, not a salvage edit. The existing inverse proves exact postimages and restores original intake bytes before fixed-hash checks; no expected value or capture refreshed.",
    "changedIntakeFiles": [
      {
        "file": "packages/clinical-content/src/question-ship-manifest.ts",
        "intakeSha256": "c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd",
        "currentSha256": "b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/synthetic-content.ts",
        "intakeSha256": "1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221",
        "currentSha256": "9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/answer-choice-timing.ts",
        "intakeSha256": "4f5e6bae6b16fbd693153add3ddbbb48c2e997ed16159522f177d917167077c2",
        "currentSha256": "99be435f815472aa35dec0c1150cf0419e8f51a39da1f9a07f0e06e04b1ceee2",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts",
        "intakeSha256": "ee579791c0bc964b7e9b5c94079fcd2c2937823224646a4f492d45e4d671a51d",
        "currentSha256": "a6a642fbdbce085b2636403fa03905d7f77c679384caf792009d0c69d4302ef3",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      }
    ],
    "unresolvedInputDrift": []
  }
}
```

## Timing and integration

Three exact timing classifications are relocated to the three new case IDs. Choice IDs, labels and placeholder profiles are unchanged; the three test-order tuples remain not executed. Reviewed parent-case tuples are retained at `salvage.retainedTimingProposals` / `salvage.retainedTestOrderProposals`. All existing source links retain safe new-tab metadata. No registry, service request or result gate is installed.

```json
{
  "timing": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe",
            "choiceLabel": "Monitored nonoperative hepatic care",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
            "choiceLabel": "Hepatic angiography with empiric embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.laparotomy",
            "choiceLabel": "Laparotomy with operative hepatic hemorrhage control",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
            "choiceLabel": "Hepatic angiography with selective embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
            "choiceLabel": "Laparotomy with hepatic hemorrhage control",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent",
            "choiceLabel": "ERCP with transpapillary biliary stenting",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.therapeutic_ercp"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "classification": {
        "kind": "no_test"
      }
    }
  ],
  "orders": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
      "choiceLabel": "Hepatic angiography with empiric embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
      "choiceLabel": "Hepatic angiography with selective embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent",
      "choiceLabel": "ERCP with transpapillary biliary stenting",
      "timingProfileId": "timing.test.therapeutic_ercp",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    }
  ]
}
```

Manager next: review only the three `salvage` contexts, then install exact accepted case/choice-timing identities through the existing acceptance path. No new care setting, facility, adapter, selector, save or runtime change is proposed. Former non-PASS companions remain unaccepted source proposals. Five earlier unkeyed clinical/source holds remain unchanged.

## Salvage advisory check

```json
{
  "linterVersion": "question-cue-lint.2026-11-04.v8",
  "scope": "Only three status=salvage standalone cases. Exact displayed title, named finite profile, update, separate exhibit values and task. No prior/future/companion feedback, JSON syntax, source metadata or performance data.",
  "contexts": 3,
  "contextRows": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
      "priorObservations": 0,
      "priorFeedback": 0,
      "findings": 0
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "priorObservations": 0,
      "priorFeedback": 0,
      "findings": 1
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "profileId": "profile.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
      "priorObservations": 0,
      "priorFeedback": 0,
      "findings": 0
    }
  ],
  "findings": [
    {
      "id": "ea3a46307051b705",
      "rule": "case-detail-key-rationale-overlap",
      "severity": "advisory",
      "message": "A case-detail phrase repeats only the explicit keyed reason. Review for pre-answer teaching; raw decision-critical evidence may justify the overlap. Synonymous paraphrases still require human review.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "a hepatic arterial",
          "start": 78,
          "end": 96
        },
        {
          "field": "authoring.answerChoices.rationale",
          "text": "a hepatic arterial",
          "start": 86,
          "end": 104,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
          "postAnswerMetadata": true
        }
      ],
      "metrics": {
        "explicitRationalesCompared": 3
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "manualDisposition": {
        "decision": "preserve_exact_PASS_in_salvage_context",
        "reason": "Exact PASS context supplies papillary blood, the arterial-connected lesion and current unsupported circulation. The generic clinic/trauma header supplies no diagnosis or proposed procedure. The standalone view removes earlier feedback; no wording is altered to chase lexical warnings.",
        "independent": false,
        "clinicalApproval": false
      }
    }
  ],
  "findingCount": 1,
  "manualDispositionPending": false,
  "clinicalApproval": false
}
```

## Concurrent accepted epoch

```json
{
  "program": "acceptance_batch2",
  "helper": "packages/clinical-content/src/question-program-batch2-acceptance-test-support.ts",
  "migration": "tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json",
  "migrationSha256": "6d79bd30356c9ef44326043e9ee6584c050a966a1ad2ccbf47463625ee09f06e",
  "meaning": "Concurrent manager integration, not a salvage edit. The existing inverse proves exact postimages and restores original intake bytes before fixed-hash checks; no expected value or capture refreshed.",
  "changedIntakeFiles": [
    {
      "file": "packages/clinical-content/src/question-ship-manifest.ts",
      "intakeSha256": "c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd",
      "currentSha256": "b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a",
      "changed": true,
      "authorizedConcurrentInverse": "exact_batch2_inverse"
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "intakeSha256": "1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221",
      "currentSha256": "9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b",
      "changed": true,
      "authorizedConcurrentInverse": "exact_batch2_inverse"
    },
    {
      "file": "packages/clinical-content/src/answer-choice-timing.ts",
      "intakeSha256": "4f5e6bae6b16fbd693153add3ddbbb48c2e997ed16159522f177d917167077c2",
      "currentSha256": "99be435f815472aa35dec0c1150cf0419e8f51a39da1f9a07f0e06e04b1ceee2",
      "changed": true,
      "authorizedConcurrentInverse": "exact_batch2_inverse"
    },
    {
      "file": "packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts",
      "intakeSha256": "ee579791c0bc964b7e9b5c94079fcd2c2937823224646a4f492d45e4d671a51d",
      "currentSha256": "a6a642fbdbce085b2636403fa03905d7f77c679384caf792009d0c69d4302ef3",
      "changed": true,
      "authorizedConcurrentInverse": "exact_batch2_inverse"
    }
  ],
  "unresolvedInputDrift": []
}
```

The four changed shared inputs belong to the concurrent batch2 integration. Its existing exact inverse restores the original fixed intake bytes; no expected hash or capture was refreshed. All nine accepted topic payloads remain exact.

## Validation and out-of-lane limitations

Only the assigned focused test and clinical-content typecheck are run. Structural tests and context checks do not confer clinical approval. Full command outputs and any concurrent typecheck errors follow.

```json
{
  "state": "focused_pass_typecheck_blocked_out_of_lane",
  "workingDirectory": "C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content",
  "commands": [
    {
      "command": "npm.cmd test -- --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts",
      "exitCode": 0,
      "testFilesPassed": 1,
      "testsPassed": 54,
      "testsFailed": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n\n Test Files  1 passed (1)\n      Tests  54 passed (54)\n   Start at  14:31:16\n   Duration  4.09s (transform 3.20s, setup 0ms, import 481ms, tests 3.50s, environment 0ms)\n\n",
      "wallTimeSeconds": 4.7661660999999995
    },
    {
      "command": "npm.cmd run typecheck",
      "exitCode": 1,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 typecheck\n> tsc --noEmit -p tsconfig.json\n\nsrc/question-program-batch2-accepted-data-20261111.ts(3796,5): error TS2353: Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'.\nsrc/question-program-batch2-accepted-data-20261111.ts(3835,5): error TS2353: Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'.\nsrc/question-program-batch2-accepted-data-20261111.ts(3873,5): error TS2353: Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'.\nsrc/question-program-batch2-accepted-data-20261111.ts(3934,5): error TS2353: Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'.\nsrc/question-program-batch2-accepted-data-20261111.ts(3973,5): error TS2353: Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'.\nsrc/question-program-batch2-accepted-data-20261111.ts(7999,5): error TS2322: Type '\"applied_science\"' is not assignable to type '\"anatomy\" | \"definition\" | \"disposition\" | \"epidemiology\" | \"evaluation\" | \"management\" | \"presentation\" | \"safety_boundary\"'.\nsrc/question-ship-case-replacements.ts(63,21): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: \"synthetic_unapproved_prototype\"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: \"anatomy\" | ... 5 more ... | \"workup\"; }[]; cases: { ...; }[]; }; }'.\n  No index signature with a parameter of type 'string' was found on type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: \"synthetic_unapproved_prototype\"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: \"anatomy\" | ... 5 more ... | \"workup\"; }[]; cases: { ...; }[]; }; }'.\nsrc/question-ship-case-replacements.ts(63,60): error TS7006: Parameter 'clinicalCase' implicitly has an 'any' type.\nsrc/question-ship-case-replacements.ts(70,63): error TS18048: 'source' is possibly 'undefined'.\nsrc/question-ship-case-replacements.ts(70,98): error TS18048: 'source' is possibly 'undefined'.\nsrc/question-ship-case-replacements.ts(72,32): error TS18048: 'source' is possibly 'undefined'.\nsrc/question-ship-case-replacements.ts(74,28): error TS2345: Argument of type '{ id: string; pediatricProfile?: { version: \"pediatric-patient-profile.v1\"; requiresParent: true; clinicalScope: \"outpatient\"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: \"pediatric-patient-profile.v1\"; requiresParent: true; clinicalScope: \"outpatient\"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.\n  Type 'undefined' is not assignable to type '{ id: string; pediatricProfile?: { version: \"pediatric-patient-profile.v1\"; requiresParent: true; clinicalScope: \"outpatient\"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(193,56): error TS7006: Parameter 'check' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(196,37): error TS7006: Parameter 'check' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(201,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(216,66): error TS7006: Parameter 'row' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(217,42): error TS7006: Parameter 'row' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(219,44): error TS7006: Parameter 'row' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,26): error TS2551: Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import(\"C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111\")'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,53): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,80): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(260,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(297,49): error TS7006: Parameter 'gate' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,57): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,84): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1737,19): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1742,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,60): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,86): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1760,7): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1761,16): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1762,22): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1764,16): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1769,60): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1771,20): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1772,22): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,60): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,14): error TS7006: Parameter 'candidate' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,52): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1775,15): error TS7006: Parameter 'candidate' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1776,21): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1778,7): error TS18046: 'node' is of type 'unknown'.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,59): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,82): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,36): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,42): error TS7006: Parameter 'index' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1843,38): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,41): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,64): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1853,53): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,78): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,105): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1862,19): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1866,40): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1869,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,40): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,67): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,92): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1919,34): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,47): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,74): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,99): error TS7006: Parameter 'node' implicitly has an 'any' type.\nsrc/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1944,26): error TS7006: Parameter 'choice' implicitly has an 'any' type.\nnpm error Lifecycle script `typecheck` failed with error:\nnpm error code 1\nnpm error path C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error workspace @gamify-surgery/clinical-content@0.0.1\nnpm error location C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error command failed\nnpm error command C:\\WINDOWS\\system32\\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json\n",
      "wallTimeSeconds": 3.1633116
    }
  ],
  "initialRun": {
    "focused": {
      "exitCode": 0,
      "testsPassed": 54,
      "testsFailed": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n\n Test Files  1 passed (1)\n      Tests  54 passed (54)\n   Start at  14:22:07\n   Duration  4.15s (transform 2.36s, setup 0ms, import 3.92s, tests 131ms, environment 0ms)\n\n"
    },
    "typecheck": {
      "exitCode": 1,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 typecheck\n> tsc --noEmit -p tsconfig.json\n\nsrc/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts(217,46): error TS2339: Property 'multipartCases' does not exist on type '{ initialAuditedExactVariants: number; reviewedItems: number; passPreserved: number; revised: number; parked: number; currentQuestionVariants: number; previewNodeCount: number; previewCases: number; ... 6 more ...; reusedReviewedConcepts: number; }'.\nsrc/question-topic-pancreas-acute-pancreatitis-20261111.ts(150,84): error TS2339: Property 'timingProfileId' does not exist on type '{ timingProfileId?: undefined; kind: string; } | { kind: string; timingProfileId: string; } | { kind: string; } | { kind: string; } | { kind: string; } | { kind: string; } | { kind: string; timingProfileId: string; } | { ...; } | { ...; }'.\n  Property 'timingProfileId' does not exist on type '{ kind: string; }'.\nnpm error Lifecycle script `typecheck` failed with error:\nnpm error code 1\nnpm error path C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error workspace @gamify-surgery/clinical-content@0.0.1\nnpm error location C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error command failed\nnpm error command C:\\WINDOWS\\system32\\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json\n"
    },
    "scope": "Before the concurrent batch2 integration; this task already had three complete standalone cases. Neutral-title equality was added afterward."
  },
  "intermediateAttempts": [
    {
      "stage": "Concurrent default-release construction failed",
      "exitCode": 1,
      "testsExecuted": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n ❯ src/question-topic-trauma-initial-abdomen-20261111.test.ts (0 test)\n\n⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯\n\n FAIL  src/question-topic-trauma-initial-abdomen-20261111.test.ts [ src/question-topic-trauma-initial-abdomen-20261111.test.ts ]\nZodError: [\n  {\n    \"code\": \"custom\",\n    \"message\": \"A case cannot become eligible before one of its scored concepts.\",\n    \"path\": [\n      \"cases\",\n      366,\n      \"earliestFacilityStage\"\n    ]\n  }\n]\n ❯ validateSyntheticClinicalRelease src/schema.ts:786:41\n    784|   candidate: unknown,\n    785| ): SyntheticClinicalRelease {\n    786|   return syntheticClinicalReleaseSchema.parse(candidate);\n       |                                         ^\n    787| }\n    788|\n ❯ src/synthetic-content.ts:1588:43\n ❯ src/question-topic-trauma-initial-abdomen-20261111.test.ts:5:1\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n\n\n Test Files  1 failed (1)\n      Tests  no tests\n   Start at  14:26:50\n   Duration  5.25s (transform 3.37s, setup 0ms, import 0ms, tests 0ms, environment 0ms)\n\nnpm error Lifecycle script `test` failed with error:\nnpm error code 1\nnpm error path C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error workspace @gamify-surgery/clinical-content@0.0.1\nnpm error location C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error command failed\nnpm error command C:\\WINDOWS\\system32\\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n"
    },
    {
      "stage": "Concurrent epoch-helper dependency had not yet written its migration fixture",
      "exitCode": 1,
      "testsExecuted": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n ❯ src/question-topic-trauma-initial-abdomen-20261111.test.ts (0 test)\n\n⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯\n\n FAIL  src/question-topic-trauma-initial-abdomen-20261111.test.ts [ src/question-topic-trauma-initial-abdomen-20261111.test.ts ]\nError: ENOENT: no such file or directory, open 'C:\\Users\\rowla\\Projects\\GamifySurgery\\tools\\question-quality\\fixtures\\question-topic-acceptance-batch2-source-migration-20261111.json'\n ❯ read src/question-program-batch2-acceptance-test-support.ts:10:43\n      8|   PROGRAM_BATCH2_RETIRED_CASES as retired} from \"./question-program-ba…\n      9|\n     10| const read = (path: string) => JSON.parse(readFileSync(new URL(\"../../…\n       |                                           ^\n     11| const before = read(\"tools/question-quality/fixtures/question-topic-ac…\n     12| const migration = read(\"tools/question-quality/fixtures/question-topic…\n ❯ src/question-program-batch2-acceptance-test-support.ts:12:19\n ❯ src/question-program-batch1-acceptance-test-support.ts:1:1\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n\n\n Test Files  1 failed (1)\n      Tests  no tests\n   Start at  14:28:59\n   Duration  2.69s (transform 1.99s, setup 0ms, import 0ms, tests 0ms, environment 0ms)\n\nnpm error Lifecycle script `test` failed with error:\nnpm error code 1\nnpm error path C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error workspace @gamify-surgery/clinical-content@0.0.1\nnpm error location C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error command failed\nnpm error command C:\\WINDOWS\\system32\\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n"
    },
    {
      "stage": "All own checks ran; guard detected authorized concurrent manifest drift before the exact inverse was applied",
      "exitCode": 1,
      "testsPassed": 53,
      "testsFailed": 1,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n ❯ src/question-topic-trauma-initial-abdomen-20261111.test.ts (54 tests | 1 failed) 3416ms\n     × validates the exact shared acceptance epoch and keeps salvage out of the default release 3386ms\n\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n\n FAIL  src/question-topic-trauma-initial-abdomen-20261111.test.ts > trauma initial abdomen: reviewed clinic chart-review sidecar > validates the exact shared acceptance epoch and keeps salvage out of the default release\nAssertionError: packages/clinical-content/src/question-ship-manifest.ts: expected 'b470422f55280d0a7b0fe318f0254b83be686…' to be 'c2cfc4290ab8ae067c92d24126eacd478bdb6…' // Object.is equality\n\nExpected: \"c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd\"\nReceived: \"b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a\"\n\n ❯ src/question-topic-trauma-initial-abdomen-20261111.test.ts:83:110\n     81|       expect(createHash(\"sha256\").update(historical).digest(\"hex\"), na…\n     82|     }\n     83|     for (const [name, hash] of Object.entries(packet.salvage.sourceInp…\n       |                                                                                                              ^\n     84|   });\n     85|\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯\n\n\n Test Files  1 failed (1)\n      Tests  1 failed | 53 passed (54)\n   Start at  14:30:15\n   Duration  4.00s (transform 3.01s, setup 0ms, import 489ms, tests 3.42s, environment 0ms)\n\nnpm error Lifecycle script `test` failed with error:\nnpm error code 1\nnpm error path C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error workspace @gamify-surgery/clinical-content@0.0.1\nnpm error location C:\\Users\\rowla\\Projects\\GamifySurgery\\packages\\clinical-content\nnpm error command failed\nnpm error command C:\\WINDOWS\\system32\\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n"
    }
  ],
  "closingRepair": "State-dependent shared release/manifest/timing/helper imports are confined to a test that still fails closed. No test skipped, mocked or converted to an unconditional pass. The exact existing batch2 inverse now recovers fixed intake bytes; clinical preservation/standalone checks run independently.",
  "typecheckErrors": [
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 3796,
      "column": 5,
      "code": "TS2353",
      "message": "Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'."
    },
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 3835,
      "column": 5,
      "code": "TS2353",
      "message": "Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'."
    },
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 3873,
      "column": 5,
      "code": "TS2353",
      "message": "Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'."
    },
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 3934,
      "column": 5,
      "code": "TS2353",
      "message": "Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'."
    },
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 3973,
      "column": 5,
      "code": "TS2353",
      "message": "Object literal may only specify known properties, and '\"shuffleAnswers\"' does not exist in type 'QuestionVariant'."
    },
    {
      "file": "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
      "line": 7999,
      "column": 5,
      "code": "TS2322",
      "message": "Type '\"applied_science\"' is not assignable to type '\"anatomy\" | \"definition\" | \"disposition\" | \"epidemiology\" | \"evaluation\" | \"management\" | \"presentation\" | \"safety_boundary\"'."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 63,
      "column": 21,
      "code": "TS7053",
      "message": "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: \"synthetic_unapproved_prototype\"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: \"anatomy\" | ... 5 more ... | \"workup\"; }[]; cases: { ...; }[]; }; }'."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 63,
      "column": 60,
      "code": "TS7006",
      "message": "Parameter 'clinicalCase' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 70,
      "column": 63,
      "code": "TS18048",
      "message": "'source' is possibly 'undefined'."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 70,
      "column": 98,
      "code": "TS18048",
      "message": "'source' is possibly 'undefined'."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 72,
      "column": 32,
      "code": "TS18048",
      "message": "'source' is possibly 'undefined'."
    },
    {
      "file": "packages/clinical-content/src/question-ship-case-replacements.ts",
      "line": 74,
      "column": 28,
      "code": "TS2345",
      "message": "Argument of type '{ id: string; pediatricProfile?: { version: \"pediatric-patient-profile.v1\"; requiresParent: true; clinicalScope: \"outpatient\"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: \"pediatric-patient-profile.v1\"; requiresParent: true; clinicalScope: \"outpatient\"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 193,
      "column": 56,
      "code": "TS7006",
      "message": "Parameter 'check' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 196,
      "column": 37,
      "code": "TS7006",
      "message": "Parameter 'check' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 201,
      "column": 38,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 216,
      "column": 66,
      "code": "TS7006",
      "message": "Parameter 'row' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 217,
      "column": 42,
      "code": "TS7006",
      "message": "Parameter 'row' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 219,
      "column": 44,
      "code": "TS7006",
      "message": "Parameter 'row' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 247,
      "column": 26,
      "code": "TS2551",
      "message": "Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import(\"C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111\")'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 247,
      "column": 53,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 247,
      "column": 80,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 260,
      "column": 36,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
      "line": 297,
      "column": 49,
      "code": "TS7006",
      "message": "Parameter 'gate' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1736,
      "column": 57,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1736,
      "column": 84,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1737,
      "column": 19,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1742,
      "column": 38,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1755,
      "column": 33,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1755,
      "column": 60,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1755,
      "column": 86,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1760,
      "column": 7,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1761,
      "column": 16,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1762,
      "column": 22,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1764,
      "column": 16,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1769,
      "column": 60,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1771,
      "column": 20,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1772,
      "column": 22,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1773,
      "column": 33,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1773,
      "column": 60,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1774,
      "column": 14,
      "code": "TS7006",
      "message": "Parameter 'candidate' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1774,
      "column": 52,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1775,
      "column": 15,
      "code": "TS7006",
      "message": "Parameter 'candidate' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1776,
      "column": 21,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1778,
      "column": 7,
      "code": "TS18046",
      "message": "'node' is of type 'unknown'."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1788,
      "column": 59,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1788,
      "column": 82,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1812,
      "column": 36,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1812,
      "column": 42,
      "code": "TS7006",
      "message": "Parameter 'index' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1843,
      "column": 38,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1847,
      "column": 41,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1847,
      "column": 64,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1853,
      "column": 53,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1861,
      "column": 78,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1861,
      "column": 105,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1862,
      "column": 19,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1866,
      "column": 40,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1869,
      "column": 36,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1898,
      "column": 40,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1898,
      "column": 67,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1898,
      "column": 92,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1919,
      "column": 34,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1929,
      "column": 47,
      "code": "TS2552",
      "message": "Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?"
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1929,
      "column": 74,
      "code": "TS7006",
      "message": "Parameter 'item' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1929,
      "column": 99,
      "code": "TS7006",
      "message": "Parameter 'node' implicitly has an 'any' type."
    },
    {
      "file": "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts",
      "line": 1944,
      "column": 26,
      "code": "TS7006",
      "message": "Parameter 'choice' implicitly has an 'any' type."
    }
  ],
  "typecheckErrorCount": 65,
  "typecheckFiles": [
    "packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts",
    "packages/clinical-content/src/question-ship-case-replacements.ts",
    "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts",
    "packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111.ts"
  ],
  "ownedFileErrors": 0,
  "outOfLaneDisposition": "No edits to external batch2 accepted data, case replacement integration, colon topic files or other concurrent work. Manager/owners resolve their package type errors.",
  "sourceInputCheck": {
    "checked": 10,
    "unresolved": [],
    "rows": [
      {
        "file": "packages/clinical-content/src/question-ship-manifest.ts",
        "intakeSha256": "c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd",
        "currentSha256": "b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/synthetic-content.ts",
        "intakeSha256": "1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221",
        "currentSha256": "9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/schema.ts",
        "intakeSha256": "c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7",
        "currentSha256": "c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      },
      {
        "file": "packages/clinical-content/src/pilot-schema.ts",
        "intakeSha256": "5c8e0c83e1fcd8f28c34e8f568ea3a6e231c2d3dd4c30ca540185ec4325f2ba3",
        "currentSha256": "5c8e0c83e1fcd8f28c34e8f568ea3a6e231c2d3dd4c30ca540185ec4325f2ba3",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      },
      {
        "file": "packages/clinical-content/src/answer-choice-timing.ts",
        "intakeSha256": "4f5e6bae6b16fbd693153add3ddbbb48c2e997ed16159522f177d917167077c2",
        "currentSha256": "99be435f815472aa35dec0c1150cf0419e8f51a39da1f9a07f0e06e04b1ceee2",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "packages/clinical-content/src/question-program-batch1-accepted-20261111.ts",
        "intakeSha256": "9d873ffa722a47d779c4f654af05b4716a9d90c0d5c5b50943c1dd5e89890aa5",
        "currentSha256": "9d873ffa722a47d779c4f654af05b4716a9d90c0d5c5b50943c1dd5e89890aa5",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      },
      {
        "file": "packages/clinical-content/src/question-program-batch1-accepted-data-20261111.ts",
        "intakeSha256": "f50b06a0583ec4c2ea87d5d129bac030cdab97b50cf40b70929810619d1890a7",
        "currentSha256": "f50b06a0583ec4c2ea87d5d129bac030cdab97b50cf40b70929810619d1890a7",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      },
      {
        "file": "packages/clinical-content/src/question-program-batch1-acceptance-test-support.ts",
        "intakeSha256": "ee579791c0bc964b7e9b5c94079fcd2c2937823224646a4f492d45e4d671a51d",
        "currentSha256": "a6a642fbdbce085b2636403fa03905d7f77c679384caf792009d0c69d4302ef3",
        "changed": true,
        "authorizedConcurrentInverse": "exact_batch2_inverse"
      },
      {
        "file": "docs/research/question-topic-acceptance-batch1-dispositions-20261111.json",
        "intakeSha256": "bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4",
        "currentSha256": "bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      },
      {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-preserved-20261111.json",
        "intakeSha256": "c9586d20cfe580ec28442df3f424ba9019463c54de61bdcf52e287ad07f43654",
        "currentSha256": "c9586d20cfe580ec28442df3f424ba9019463c54de61bdcf52e287ad07f43654",
        "changed": false,
        "authorizedConcurrentInverse": "not_needed"
      }
    ]
  },
  "editorialStatus": "Only three salvage contexts require new independent review. Original clinical PASS is preserved; tests do not grant clinical approval.",
  "nextAction": "Manager inspects the three status=salvage cases and validation, obtains context-specific independent review, then installs accepted case/timing identities. Resolve out-of-lane package type errors separately.",
  "artifactQualityCheck": {
    "exitCode": 0,
    "output": "PASS: Exactly three skipped PASS nodes queued as salvage\nPASS: Reviewer queue contains salvage status only\nPASS: All three current node records marked salvage\nPASS: All three standalone cases marked salvage and contain one node\nPASS: Exact PASS clinical payload: liver-grade-versus-physiology\nPASS: Exact existing neutral clinic frame: liver-grade-versus-physiology\nPASS: No prior observations/feedback dependency: liver-grade-versus-physiology\nPASS: One active case owns node: liver-grade-versus-physiology\nPASS: Exact PASS clinical payload: liver-delayed-arterial-bleeding\nPASS: Exact existing neutral clinic frame: liver-delayed-arterial-bleeding\nPASS: No prior observations/feedback dependency: liver-delayed-arterial-bleeding\nPASS: One active case owns node: liver-delayed-arterial-bleeding\nPASS: Exact PASS clinical payload: renal-isolated-urine-leak\nPASS: Exact existing neutral clinic frame: renal-isolated-urine-leak\nPASS: No prior observations/feedback dependency: renal-isolated-urine-leak\nPASS: One active case owns node: renal-isolated-urine-leak\nPASS: Nine accepted topic nodes unchanged\nPASS: Six accepted topic case records unchanged\nPASS: All fifteen source records and fifty-five atomic claims unchanged\nPASS: Concurrent input changes match the strict batch2 inverse\nPASS: Closing typecheck reports zero errors in owned files\nPASS: Closing focused command passes all fifty-four tests\nPASS: Both owned JSON files parse\nPASS: Markdown contains complete exact salvage record: liver-grade-versus-physiology\nPASS: Markdown contains complete exact salvage record: liver-delayed-arterial-bleeding\nPASS: Markdown contains complete exact salvage record: renal-isolated-urine-leak\nPASS: Pre-salvage Markdown retained exactly as a clearly marked archive\n",
    "checks": [
      "Exactly three skipped PASS nodes queued as salvage",
      "Reviewer queue contains salvage status only",
      "All three current node records marked salvage",
      "All three standalone cases marked salvage and contain one node",
      "Exact PASS clinical payload: liver-grade-versus-physiology",
      "Exact existing neutral clinic frame: liver-grade-versus-physiology",
      "No prior observations/feedback dependency: liver-grade-versus-physiology",
      "One active case owns node: liver-grade-versus-physiology",
      "Exact PASS clinical payload: liver-delayed-arterial-bleeding",
      "Exact existing neutral clinic frame: liver-delayed-arterial-bleeding",
      "No prior observations/feedback dependency: liver-delayed-arterial-bleeding",
      "One active case owns node: liver-delayed-arterial-bleeding",
      "Exact PASS clinical payload: renal-isolated-urine-leak",
      "Exact existing neutral clinic frame: renal-isolated-urine-leak",
      "No prior observations/feedback dependency: renal-isolated-urine-leak",
      "One active case owns node: renal-isolated-urine-leak",
      "Nine accepted topic nodes unchanged",
      "Six accepted topic case records unchanged",
      "All fifteen source records and fifty-five atomic claims unchanged",
      "Concurrent input changes match the strict batch2 inverse",
      "Closing typecheck reports zero errors in owned files",
      "Closing focused command passes all fifty-four tests",
      "Both owned JSON files parse",
      "Markdown contains complete exact salvage record: liver-grade-versus-physiology",
      "Markdown contains complete exact salvage record: liver-delayed-arterial-bleeding",
      "Markdown contains complete exact salvage record: renal-isolated-urine-leak",
      "Pre-salvage Markdown retained exactly as a clearly marked archive"
    ],
    "clinicalApproval": false
  }
}
```

## Bounded salvage handoff

```json
{
  "topic": "trauma-initial-abdomen",
  "status": "salvage",
  "counts": {
    "skippedPassNodes": 3,
    "salvagedCases": 3,
    "salvagedNodes": 3,
    "clinicalRewrites": 0,
    "addedClinicalFacts": 0,
    "acceptedNodesTouched": 0,
    "retiredNodes": 0,
    "activeQuestions": 18,
    "activeCases": 14,
    "multiPartCases": 4,
    "statuses": {
      "passPreserved": 6,
      "salvage": 3,
      "revised": 9,
      "parked": 4
    }
  },
  "salvagedCases": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-grade-versus-physiology.salvage.v1",
      "nodeIds": [
        "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
      ],
      "questionVariantIds": [
        "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
      ],
      "status": "salvage"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.salvage.v1",
      "nodeIds": [
        "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
      ],
      "questionVariantIds": [
        "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
      ],
      "status": "salvage"
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-isolated-urine-leak.salvage.v1",
      "nodeIds": [
        "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
      ],
      "questionVariantIds": [
        "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
      ],
      "status": "salvage"
    }
  ],
  "clinicalChanges": "Zero. Exact PASS wording, choices, keys, updates, exhibits, explanations and claims retained; exact existing clinic presentation reused.",
  "acceptedPreservation": "All nine accepted topic nodes and six cases remain exact; no shared-file edit or default installation.",
  "research": "No new medical facts or sources; existing 15 sources / 55 atomic claims and their dates unchanged.",
  "packet": {
    "markdown": "docs/research/question-topic-trauma-initial-abdomen-20261111.md",
    "json": "docs/research/question-topic-trauma-initial-abdomen-20261111.json",
    "sources": "docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json"
  },
  "ownerApprovalsNeeded": "Context-specific re-review of only three status=salvage cases; all clinical data still needs_clinician_review.",
  "validation": "Focused command exit 0: 54/54 tests, one file. Package typecheck exit 1: 65 errors across 4 out-of-lane files; no owned-file errors. Full exact output in salvage.validation.commands.",
  "nextAction": "Manager rechecks the three standalone contexts and accepts/installs exact case and timing identities. Former companions remain unaccepted; five unkeyed holds remain.",
  "sharedInputDrift": "Four intake files changed through concurrent batch2 acceptance. Exact existing inverse proves every postimage/preimage; original intake hashes, captured clinical definitions and all nine accepted topic nodes remain unchanged.",
  "openRisks": "Global clinical-content typecheck remains blocked by concurrent batch2/case-replacement/colon errors. No clinical or manager acceptance of the three recomposed contexts is implied."
}
```

Three standalone cases are ready for context-specific independent review; all PASS clinical wording and all nine accepted nodes remain exact. No commit, push, deploy, install, agents or shared-file edit occurred.

---

## Archived round-2 packet — historical scope only

Everything between the archive markers below is the exact pre-salvage round-2 report. Its case counts, review queues, validation and no-drift statements refer to that earlier snapshot; the current salvage scope and validation above supersede them. Pre-salvage Markdown SHA-256: `a1c88ffafb403c6e0668c379990bceb47350c35baa5215f7bad36764c413f388`.

<!-- BEGIN PRE-SALVAGE ROUND2 ARCHIVE -->

# Trauma initial assessment and abdominal injury — wave 1, review response

## Assignment (self-filled from the manager program)

```json
{
  "topicSlug": "trauma-initial-abdomen",
  "title": "Trauma â€” initial assessment and abdominal injury",
  "wave": 1,
  "scopeIn": "Primary/secondary survey, damage control, hemorrhage control, penetrating/blunt abdominal and pelvic/retroperitoneal visceral injury, solid-organ observation and operative decisions.",
  "scopeOut": "Thoracic injury belongs to trauma-thoracic. Head/spine and musculoskeletal injury belong to trauma-head-spine-extremities. Generic transfusion biology belongs to hematology-transfusion-coagulation.",
  "priority": "high",
  "priorityReason": "A central trauma lane appears largely absent from the existing live objectives.",
  "startingCounts": {
    "liveConcepts": 0,
    "liveNodes": 0,
    "liveCases": 0,
    "liveVariants": 0,
    "liveAcceptedNodes": 0,
    "liveOriginalNodes": 0,
    "registeredConcepts": 0,
    "registeredWithoutLiveNodes": 0,
    "drafts": 0,
    "draftVariants": 0,
    "draftConcepts": 0,
    "explicitOwnerHeldVersions": 0,
    "unassembledDraftVariants": 0,
    "unkeyedParkedSlots": 0,
    "withheldTeachingPoints": 0,
    "liveClinicalConcepts": 0
  },
  "inventory": [],
  "concepts": [],
  "caseAssignments": [],
  "nodeAssignments": [],
  "variantAssignments": [],
  "identityReuseNotes": [],
  "recordedHolds": [],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "frozenIndependentPASSReferences": [],
  "clinicalApprovalReferences": [],
  "managerPlan": "docs/research/question-topic-program-20261111.md",
  "managerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md",
  "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
  "generatedAt": "2026-11-11T15:41:40.423Z",
  "programId": "question-topic-program.2026-11-11.v1",
  "release": {
    "id": "clinical.synthetic.prototype.v1",
    "manifestId": "question-ship.2026-11-10.v9",
    "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
    "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
    "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
    "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
  },
  "baselineGlobalCounts": {
    "manifestRows": 145,
    "cases": 1151,
    "nodes": 1462,
    "concepts": 610
  },
  "inputSha256": {
    "AGENTS.md": "1290a51fa5e98a61711369a8c65a904b55f47ff7e5fbddea437f5c04ed7c0241",
    "docs/clinical/question-authoring-standard.md": "87689076b8ab2126973d5d7972ad300ad096c5ebabca999aee291f316256f671",
    "docs/research/question-topic-worker-brief-template-20261111.md": "59ca1edf7b3ff2ee443f45afd3e083a734627858d897468dd566aae47fea788e",
    "docs/research/question-topic-program-20261111.json": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
    "packages/clinical-content/src/question-ship-manifest.ts": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
    "packages/clinical-content/src/synthetic-content.ts": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
    "packages/clinical-content/src/schema.ts": "c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7",
    "packages/clinical-content/src/pilot-schema.ts": "5c8e0c83e1fcd8f28c34e8f568ea3a6e231c2d3dd4c30ca540185ec4325f2ba3"
  },
  "snapshotDriftFiles": [],
  "dirtyPathCountAtIntake": 2894
}
```

These are the complete primary-topic inventory, concepts, case/node/variant indexes, identity notes and inherited holds: all are empty in the program. The original program supplied no frozen PASS or clinical approval. The source title has mojibake; the human-facing heading is normalized. The later independent review below is a separate 22-item assignment.

### Round-2 assignment and exact independent PASS references

```json
{
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewFileSha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
  "inputCounts": {
    "PASS": 9,
    "REVISE": 13,
    "FAIL": 0
  },
  "ownerSettingDecision": {
    "date": "2026-11-11",
    "authority": "Explicit manager dispatch relaying owner decision",
    "runtimeSetting": "clinic",
    "frame": "CHART REVIEW IN CLINIC",
    "clinicalScope": "Outside-hospital records reviewed at their documented decision points; no acute hospital treatment is performed in clinic.",
    "passException": "Neutral clinic framing only. Preserve each PASS clinical payload, options, key, explanation, evidence and original patient facts exactly."
  },
  "passFreezes": [
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "originalExactDraftSha256": "0a84ddef6b4962048f9b9534660d21479e9c5bcdf54069397e6268f8daa11e30",
      "clinicalPayloadSha256": "159b9b03b999c2bce4608753e1214f3809ed3325473c3500112ff60c8c453362",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "originalExactDraftSha256": "c62d754f96ac9980c06fab282ded45506918d1e2424fd12542bbabff15f2b6c5",
      "clinicalPayloadSha256": "5627fb6a66d43b6a3a94fc1ffbaf0ecf3cd4b1b085cb87bc2245cb8e5a8c16a7",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "originalExactDraftSha256": "daeee851a00f49e1d1ac62bb74306b6e7a6289cd85835c38f48aee803203815d",
      "clinicalPayloadSha256": "84ae07a763540d625f00f3f9d46d8627764f91043a068ef2a360ae320e96cbe3",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "originalExactDraftSha256": "04bbb33a9d060c0f4c54220ca54ab83f0414bb2a4cd8166cdab3c5df06f07902",
      "clinicalPayloadSha256": "e94b3dec45aba922a6b5314a8c780f780805c2685de6a6789f0e265e6ed8e4b5",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "originalExactDraftSha256": "ab77f02ea3af72af3a28bfed7f81695a13125089c7ed8f3dafb8b8075a23ff34",
      "clinicalPayloadSha256": "097c55596b69c21f626a768e032c20f43ce5b5c412885fcb3401af0f56b2eafe",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "originalExactDraftSha256": "6c79ea71c090b4f6b739ace7a823dd11d0c66df568839ce1f9241fbb1fa8b6db",
      "clinicalPayloadSha256": "4e9637501c13c73de4255b2b55969bd8b571fae928ac97904a358b21b2c6e6b7",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "originalExactDraftSha256": "997f8d33543193d4fc8d483455fb34d5766fb78fabaf3793df38e3f4aae32744",
      "clinicalPayloadSha256": "cd4ff45c99e59c9b6fa8450d531c9e319d597611bee63e566d09b1c64b521ce2",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "originalExactDraftSha256": "7bfbfb61fbe36486e3218c70ce06fdbd75f77519066eb58233a0604b068330d9",
      "clinicalPayloadSha256": "62785c4f94362586464ce66bcbda967f7bb7241b4f169d41ea2dedb1955db020",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
        "verdict": "PASS"
      }
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "originalExactDraftSha256": "1fc4e112ac4a75bd6cd4c7d6f336c93b47aa69049604cf8bef80b6bb9e074fad",
      "clinicalPayloadSha256": "ad8250289a19bed56c89ecfde040e68f773811367532e7bc7ec1d6e2ea2f3829",
      "reviewReference": {
        "file": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
        "sha256": "39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba",
        "id": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
        "verdict": "PASS"
      }
    }
  ]
}
```

## Scope, snapshot, drift, progress and next action

Round 2 is complete: **9 pass-preserved / 9 revised / 4 parked** from 22 reviewed variants and 22 case-node contexts. **18 active clinic questions / 18 unique active meanings / 11 clinic cases / 6 multipart cases.** Original program audit: zero assigned variants. No default-release questions were retired or installed.

All current clinical data remain `needs_clinician_review`. Independent editorial PASS applies only to the nine unchanged reviewed clinical payloads. All eleven new clinic frames and all revised exact versions remain unapproved. Author checks, advisory lint and structural tests confer no clinical approval. Melissa Rowland is the named clinician.

The owner setting decision is implemented in normal `SyntheticClinicalCase` records: the named patient attends clinic for trauma follow-up and the clinic founder reviews outside-hospital records. Every question’s “now” is the documented hospital decision point. No acute hospital treatment is performed in the clinic exercise. Required setting: clinic; existing capability: examination; facility stage: 0; reward: clinic_basic. Resident complexity and historical hospital acuity remain separate.

The default release/manifest remain `1,151 cases / 1,462 nodes / 610 concepts / 145 manifest rows`. See exact validation hashes below. The historical round-1 setting blocker in `reviewedSnapshot` is superseded. No current case needs a trauma setting, ICU capability or runtime adapter.

```json
[
  {
    "date": "2026-11-11",
    "completed": "Round 2: read independent review (9 PASS/13 REVISE), current instructions and handoff; froze exact reviewed clinical payloads and retained all round-1 versions. Verified permitted-source boundaries for revisions.",
    "next": "Make one response per returned item; convert all 22 current records to clinic chart-review frames; compile existing-schema clinic cases and rerun focused validation."
  },
  {
    "date": "2026-11-11",
    "completed": "Nine PASS preserved, nine revised and four parked. All eleven cases use existing clinic frames. Three changed meanings versioned; four atomic claims added from existing sources.",
    "next": "Compile normal clinic cases, verify frozen PASS payloads, run focused test/typecheck and regenerate packet."
  },
  {
    "date": "2026-11-11",
    "completed": "Closing focused test: 50/50; clinical-content typecheck: exit 0. Existing-schema source release validates 18 nodes / 11 clinic cases. All nine PASS clinical payloads remain exact. Advisory review: 25 contexts / 32 findings, all with dispositions.",
    "next": "Manager inspects actual artifacts, requests exact independent and named clinical review, resolves five unkeyed holds and decides accepted installation. Worker task ends here."
  },
  {
    "date": "2026-11-11",
    "completed": "Final provenance QA corrected returned-item export locators to exact v2 identities and parked-catalog exports. Added focused assertions; closing focused test 50/50 and typecheck exit 0. No clinical payload changed in this correction.",
    "next": "Bounded worker handoff complete. Manager owns independent/clinical review and acceptance/installation."
  }
]
```

Next action: manager inspects the exact five files and validation, commissions independent review of the nine revised payloads and eleven neutral frames, obtains named clinical review, then installs accepted identities/metadata through the existing pipeline. Worker stops at this handoff.

## Ranked testable concepts and coverage/gap matrix

Qualitative resident-level priorities, not an official examination blueprint, frequency estimate or measured difficulty. Source authority is separate from reuse rights. High-value interpretations are tied to a consequential action; deliberately basic safety-recognition candidates are parked without an accepted basic-purpose exception.

| Rank | Meaning | Testable decision | Current coverage |
|---|---|---|---|
| 1 | Abdominal hemorrhage requiring operative rescue<br>`concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue` | Interpret a transient resuscitation response and choose the abdominal hemorrhage-control route. | Parked after one revision attempt |
| 2 | Choose damage control rather than definitive reconstruction during worsening operative physiology.<br>`concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy` | Choose damage control rather than definitive reconstruction during worsening operative physiology. | Parked after one revision attempt |
| 3 | Recognize when the original indication for an open abdomen has resolved.<br>`concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure` | Distinguish recovered systemic physiology from an unresolved bowel-perfusion assessment when choosing abdominal closure. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 4 | Choose monitored assessment after nonspecific bowel/mesenteric CT findings.<br>`concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation` | Choose monitored assessment after nonspecific bowel/mesenteric CT findings. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 5 | Choose bowel-directed reassessment when suspicion evolves after equivocal CT.<br>`concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct` | Choose bowel-directed reassessment when suspicion evolves after equivocal CT. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 6 | Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.<br>`concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration` | Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway. | Parked after one revision attempt |
| 7 | Choose an organ-preserving hemostatic route from active arterial findings and sustained stability.<br>`concept.topic.trauma-initial-abdomen.splenic-arterial-embolization` | Choose an organ-preserving hemostatic route from active arterial findings and sustained stability. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 8 | Choose observation for a stable isolated high-grade hepatic injury without an operative indication.<br>`concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation` | Choose observation for a stable isolated high-grade hepatic injury without an operative indication. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 9 | Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis.<br>`concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm` | Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 10 | Prioritize drainage of a localized infected traumatic bile collection.<br>`concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage` | Prioritize drainage of a localized infected traumatic bile collection. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 11 | Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.<br>`concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing` | Recognize persistent nonarterial pelvic bleeding after completed arterial treatment. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 12 | Use a newly demonstrated arterial target after packing to choose repeat targeted control.<br>`concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization` | Use a newly demonstrated arterial target after packing to choose repeat targeted control. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 13 | Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.<br>`concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography` | Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 14 | Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak.<br>`concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair` | Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak. | Retained prior meaning; replaced by explicitly new meaning |
| 15 | Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.<br>`concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct` | Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 16 | Choose initial observation for stable fully staged renal injury with limited collecting-system leakage.<br>`concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation` | Choose initial observation for stable fully staged renal injury with limited collecting-system leakage. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 17 | Use duct disruption and injury location to select an operative pancreatic strategy.<br>`concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection` | Use duct disruption and injury location to select an operative pancreatic strategy. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 18 | Distinguish contained obstructing duodenal wall injury from perforation requiring repair.<br>`concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation` | Distinguish contained obstructing duodenal wall injury from perforation requiring repair. | Retained prior meaning; replaced by explicitly new meaning |
| 19 | Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.<br>`concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair` | Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 20 | Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.<br>`concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation` | Avoid renal exploration based on systemic instability when a contained hematoma is not the active source. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 21 | Use tissue viability and defect extent to choose repair rather than resection or diversion.<br>`concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair` | Use tissue viability and defect extent to choose repair rather than resection or diversion. | Retained prior meaning; replaced by explicitly new meaning |
| 22 | Complicated extraperitoneal bladder repair<br>`concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2` | Choose repair rather than a routine catheter pathway for an extraperitoneal bladder injury with an intravesical bone fragment. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 23 | Persistent obstruction after duodenal hematoma care<br>`concept.topic.trauma-initial-abdomen.duodenal-hematoma-persistent-obstruction.v2` | Use clinical course and repeat anatomy to choose escalation for persistent obstruction from a duodenal wall hematoma. | Active clinic chart-review candidate; uninstalled and needs clinical review |
| 24 | Mesenteric devascularization and bowel reconstruction<br>`concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2` | Choose the extent and reconstruction timing for a small wall defect with segmental mesenteric devascularization. | Active clinic chart-review candidate; uninstalled and needs clinical review |

### 1. Abdominal hemorrhage requiring operative rescue

Meaning: `concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue`. Priority: high. Transport and control-route errors can delay life-saving control; response trajectory distinguishes action from one-time pressure recall.

Raw-evidence interpretation: The raw findings are retained in full.

Nearest credible error: Treat the best transient pressure as the current response.

Consequence: A brief rise in pressure does not establish readiness for transport. CT characterizes injury after sustained stabilization.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.crash-operative-route.v1`, `question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1`

Evidence: `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`, `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.splenic-embolization`

Coverage/redundancy: Parked after one revision attempt. Both easy recognition variants parked; one meaning retained.

### 2. Choose damage control rather than definitive reconstruction during worsening operative physiology.

Meaning: `concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy`. Priority: high. Choosing when to stop reconstruction is a high-stakes tradeoff, not memorization of a named triad.

Raw-evidence interpretation: The raw findings are retained in full.

Nearest credible error: Discount worsening physiology because the resection was short.

Consequence: Immediate continuity becomes appropriate after restoration of physiology and suitable bowel conditions; those conditions are absent here.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1`

Evidence: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`

Coverage/redundancy: Parked after one revision attempt. No existing assigned sibling or redundant scored variant.

### 3. Recognize when the original indication for an open abdomen has resolved.

Meaning: `concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure`. Priority: high. A correct initial open-abdomen decision must be revisited after its indications resolve.

Raw-evidence interpretation: Separate restored systemic physiology from persistent local grey noncontractile bowel after adjacent bowel responds to warming.

Nearest credible error: Treat normal global physiology and tolerated approximation as proof that all indications for staged access have resolved.

Consequence: Closure is technically possible and physiology has recovered, but the remaining grey noncontractile areas mean that an intra-abdominal reassessment task is unfinished.

Active variants: `question.topic.trauma-initial-abdomen.crash-fascial-closure.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.crash-fascial-closure.v1`

Evidence: `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.temporary-negative-pressure`, `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.planned-hernia-fallback`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 4. Choose monitored assessment after nonspecific bowel/mesenteric CT findings.

Meaning: `concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation`. Priority: high. Indirect findings are easy to overcall or dismiss; a missed evolving bowel injury has important consequences.

Raw-evidence interpretation: Distinguish indirect abnormalities from both normal CT and direct disruption.

Nearest credible error: Treat absence of free air as a negative bowel evaluation.

Consequence: No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury.

Active variants: `question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1`

Evidence: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.stable-ct`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 5. Choose bowel-directed reassessment when suspicion evolves after equivocal CT.

Meaning: `concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Priority: high. Clinical evolution earns reassessment; repeating the right protocol is different from chasing fluid or free air.

Raw-evidence interpretation: Distinguish increased clinical suspicion over a six-hour interval from both an improving observation course and a direct operative indication.

Nearest credible error: Carry the original observation plan forward despite clinically meaningful evolution.

Consequence: Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.

Active variants: `question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1`

Evidence: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.unstable-positive-fast`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 6. Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.

Meaning: `concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration`. Priority: high. A newly acquired direct sign must terminate a formerly reasonable diagnostic loop.

Raw-evidence interpretation: The raw findings are retained in full.

Nearest credible error: Continue a formerly reasonable plan after its evidence changes.

Consequence: Serial assessment was appropriate with indirect findings; continuing it now postpones control of demonstrated bowel injury.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1`

Evidence: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.biloma-drainage`

Coverage/redundancy: Parked after one revision attempt. No existing assigned sibling or redundant scored variant.

### 7. Choose an organ-preserving hemostatic route from active arterial findings and sustained stability.

Meaning: `concept.topic.trauma-initial-abdomen.splenic-arterial-embolization`. Priority: high. Separates hemostatic adjuncts from both automatic splenectomy and passive observation; guideline strength differences are explicit.

Raw-evidence interpretation: Interpret the phase-dependent expanding focus while recognizing sustained stabilization.

Nearest credible error: Equate stable circulation with absence of a hemostatic indication.

Consequence: Observation preserves the spleen but the active focus and falling hemoglobin support an angiographic adjunct in this record.

Active variants: `question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1`

Evidence: `claim.trauma-initial-abdomen.splenic-embolization`, `claim.trauma-initial-abdomen.splenic-observation`, `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 8. Choose observation for a stable isolated high-grade hepatic injury without an operative indication.

Meaning: `concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation`. Priority: high. Anatomic grading is testable only when its effect on management is interpreted alongside physiology.

Raw-evidence interpretation: Read the grade alongside sustained circulation, serial examination and vascular findings.

Nearest credible error: Treat high grade as proof of active arterial hemorrhage.

Consequence: There is no arterial target or continued blood requirement. Anatomic grade alone does not establish a need for empiric embolization.

Active variants: `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1`

Evidence: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.hepatic-devascularized-complication`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 9. Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis.

Meaning: `concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm`. Priority: high. The route blood takes into bowel is different from its source; treating a duct rather than the artery can fail hemostasis.

Raw-evidence interpretation: Integrate papillary blood with a phase-matched arterial sac rather than assume mucosal or duct-leak pathology.

Nearest credible error: Escalate a delayed arterial complication directly to surgery despite sustained stability.

Consequence: The patient has a stable, localizable arterial target. An endovascular approach can address it before an operative rescue is needed.

Active variants: `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1`

Evidence: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 10. Prioritize drainage of a localized infected traumatic bile collection.

Meaning: `concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage`. Priority: high. Source control of a collection and duct decompression are different tasks.

Raw-evidence interpretation: Integrate falling output, recurrent symptoms, the catheter curl outside the fluid and injection failing to enter the cavity; low output is not proof that the leak or collection has resolved.

Nearest credible error: Attribute recurrent bile-related symptoms to duct pressure before checking whether the collection is actually drained.

Consequence: Duct decompression can be an adjunct for an ongoing leak, but it does not evacuate the recurrent collection while the existing catheter lies outside it.

Active variants: `question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1`

Evidence: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 11. Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.

Meaning: `concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing`. Priority: high. A completed arterial procedure need not control the whole pelvic compartment.

Raw-evidence interpretation: Interpret the arterial completion survey and continuing shock as possible nonarterial pelvic bleeding.

Nearest credible error: Assume every persistent pelvic hemorrhage is arterial.

Consequence: The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated.

Active variants: `question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1`

Evidence: `claim.trauma-initial-abdomen.pelvic-packing-after-angio`, `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.pelvic-fast-limitation`, `claim.trauma-initial-abdomen.unstable-positive-fast`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 12. Use a newly demonstrated arterial target after packing to choose repeat targeted control.

Meaning: `concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization`. Priority: high. Mixed bleeding can change over time; a new arterial target reverses a previously appropriate strategy.

Raw-evidence interpretation: Distinguish an expanding arterial-connected focus from pre-existing hematoma.

Nearest credible error: Continue the prior strategy after a specific source appears.

Consequence: Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.

Active variants: `question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1`

Evidence: `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.pelvic-packing-after-angio`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 13. Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.

Meaning: `concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography`. Priority: high. Routine CT is not a negative cystogram; acquisition adequacy changes the next test.

Raw-evidence interpretation: Recognize gross hematuria with pelvic trauma as a bladder concern, and interpret minimally filled apposed walls as an inadequate cystographic assessment.

Nearest credible error: Repeat upper-tract acquisition instead of recognizing the bladder study adequacy problem.

Consequence: More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target.

Active variants: `question.topic.trauma-initial-abdomen.bladder-acquisition.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.bladder-acquisition.v1`

Evidence: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.passive-ct-insufficient`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.urethral-assessment`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 14. Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak.

Meaning: `concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair`. Priority: high. Anatomic compartment, not the fracture label, changes repair versus catheter care.

Raw-evidence interpretation: Localize leakage from contrast distribution rather than the fracture label.

Nearest credible error: Apply extraperitoneal treatment to the wrong compartment.

Consequence: Catheter care can treat an uncomplicated extraperitoneal leak, but this defect opens into the peritoneal cavity.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1`

Evidence: `claim.trauma-initial-abdomen.intraperitoneal-bladder`, `claim.trauma-initial-abdomen.extraperitoneal-bladder`, `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.bladder-compartment-imaging`

Coverage/redundancy: Retained prior meaning; replaced by explicitly new meaning. No existing assigned sibling or redundant scored variant.

### 15. Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.

Meaning: `concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct`. Priority: high. Clear urine can falsely reassure after deceleration; the protocol must evaluate urinary continuity.

Raw-evidence interpretation: Infer upper-tract injury risk from high-energy deceleration and flank findings despite absent hematuria/negative FAST.

Nearest credible error: Mistake a vascular/parenchymal trauma study for a complete urinary-continuity assessment.

Consequence: This explicitly defined protocol lacks an excretory acquisition. It can evaluate perfusion/bleeding while leaving collecting-system or ureteral leakage unresolved.

Active variants: `question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1`

Evidence: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.stable-ct`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 16. Choose initial observation for stable fully staged renal injury with limited collecting-system leakage.

Meaning: `concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation`. Priority: high. A collecting-system leak does not by itself establish an intervention indication.

Raw-evidence interpretation: Separate a limited calyceal leak with preserved continuity from avulsion, obstruction or a complicated urinoma.

Nearest credible error: Treat any urinary extravasation as an automatic stent indication.

Consequence: A stent may treat a persistent or symptomatic leak, but this limited leak and preserved drainage do not establish that complication.

Active variants: `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1`

Evidence: `claim.trauma-initial-abdomen.renal-urine-observe`, `claim.trauma-initial-abdomen.renal-urinoma-intervention`, `claim.trauma-initial-abdomen.renal-preservation`, `claim.trauma-initial-abdomen.renal-excretory-phase`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 17. Use duct disruption and injury location to select an operative pancreatic strategy.

Meaning: `concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection`. Priority: high. Location and duct continuity determine materially different operations; stable distal perfusion does not answer duct integrity.

Raw-evidence interpretation: Localize injury relative to mesenteric vessels and separate distal perfusion from main-duct continuity.

Nearest credible error: Read distal perfusion as proof of intact duct drainage.

Consequence: Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.

Active variants: `question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1`

Evidence: `claim.trauma-initial-abdomen.distal-pancreatic-duct`, `claim.trauma-initial-abdomen.minor-pancreas`, `claim.trauma-initial-abdomen.pancreatic-duct-evaluate`, `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 18. Distinguish contained obstructing duodenal wall injury from perforation requiring repair.

Meaning: `concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation`. Priority: high. Contained mural obstruction can receive decompression rather than an immediate bypass or evacuation.

Raw-evidence interpretation: Interpret the hyperattenuating wall collection and luminal compression as contained mural injury.

Nearest credible error: Treat obstruction as an automatic indication to open the hematoma.

Consequence: Mural obstruction does not itself require initial evacuation when the current assessment permits observation.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1`

Evidence: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.duodenal-mural-imaging`, `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`

Coverage/redundancy: Retained prior meaning; replaced by explicitly new meaning. No existing assigned sibling or redundant scored variant.

### 19. Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.

Meaning: `concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair`. Priority: high. Current viable anatomy can permit primary repair despite D2 location or delayed recognition.

Raw-evidence interpretation: Assess present tissue/geometry and lumen preservation rather than infer irreparability from delay or D2 location.

Nearest credible error: Let delayed discovery or D2 location override observed repair feasibility.

Consequence: Resection is appropriate if direct repair cannot preserve viable tissue and lumen. The present approximation observations show that a larger resection is not needed for that purpose.

Active variants: `question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1`

Evidence: `claim.trauma-initial-abdomen.duodenal-primary-repair`, `claim.trauma-initial-abdomen.duodenal-complex`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 20. Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.

Meaning: `concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation`. Priority: high. Stable may describe a hematoma in an unstable patient; conflating those terms promotes unnecessary exploration.

Raw-evidence interpretation: Separate patient instability from an unchanged renal compartment and identify the active mesenteric source.

Nearest credible error: Assign systemic instability to every hematoma encountered.

Consequence: An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment.

Active variants: `question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1`

Retained reviewed variants: `question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1`

Evidence: `claim.trauma-initial-abdomen.contained-zone-two`, `claim.trauma-initial-abdomen.renal-preservation`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 21. Use tissue viability and defect extent to choose repair rather than resection or diversion.

Meaning: `concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair`. Priority: high. Tissue viability and defect extent determine whether bowel is unnecessarily resected or diverted.

Raw-evidence interpretation: Assess perfusion and the circumferential extent after the completed bowel examination.

Nearest credible error: Treat every full-thickness injury as requiring resection.

Consequence: Resection treats destructive or devascularized tissue, but neither is demonstrated in this limited perfused defect.

Active variants: _None._

Retained reviewed variants: `question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1`

Evidence: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`

Coverage/redundancy: Retained prior meaning; replaced by explicitly new meaning. No existing assigned sibling or redundant scored variant.

### 22. Complicated extraperitoneal bladder repair

Meaning: `concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2`. Priority: high. Anatomic compartment, not the fracture label, changes repair versus catheter care.

Raw-evidence interpretation: Read the contrast compartment as extraperitoneal, then recognize that bone traversing the wall is a clinically important complexity rather than simple clot or a harmless nearby fracture.

Nearest credible error: Apply the usual compartment-based catheter rule without interpreting the additional anatomic injury.

Consequence: This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.

Active variants: `question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2`

Retained reviewed variants: _None._

Evidence: `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.extraperitoneal-bladder`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 23. Persistent obstruction after duodenal hematoma care

Meaning: `concept.topic.trauma-initial-abdomen.duodenal-hematoma-persistent-obstruction.v2`. Priority: high. Contained mural obstruction can receive decompression rather than an immediate bypass or evacuation.

Raw-evidence interpretation: Separate radiographic shrinkage and improved pain from persistent failure of luminal passage.

Nearest credible error: Equate radiographic shrinkage or improved pain with resolution of obstruction.

Consequence: Continued conservative care is appropriate during a resolving course, but the record shows ongoing functional obstruction despite prolonged treatment. A smaller collection alone does not establish successful passage.

Active variants: `question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2`

Retained reviewed variants: _None._

Evidence: `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`, `claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution`, `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-complex`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

### 24. Mesenteric devascularization and bowel reconstruction

Meaning: `concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2`. Priority: high. Tissue viability and defect extent determine whether bowel is unnecessarily resected or diverted.

Raw-evidence interpretation: A small antimesenteric opening does not establish a viable segment when the mesentery is detached and the bowel fails to recover beside responding bowel.

Nearest credible error: Use defect circumference as the only repair criterion and overlook the blood supply.

Consequence: Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.

Active variants: `question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2`

Retained reviewed variants: _None._

Evidence: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.small-bowel-anastomosis-selection`, `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`

Coverage/redundancy: Active clinic chart-review candidate; uninstalled and needs clinical review. No existing assigned sibling or redundant scored variant.

Complete structured gap matrix:

```json
[
  {
    "rank": 1,
    "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-operative-route.v2",
      "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2"
    ],
    "activeVariantIds": [],
    "coverage": "parked_quality_gap"
  },
  {
    "rank": 2,
    "conceptId": "concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2"
    ],
    "activeVariantIds": [],
    "coverage": "parked_quality_gap"
  },
  {
    "rank": 3,
    "conceptId": "concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 4,
    "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 5,
    "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 6,
    "conceptId": "concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2"
    ],
    "activeVariantIds": [],
    "coverage": "parked_quality_gap"
  },
  {
    "rank": 7,
    "conceptId": "concept.topic.trauma-initial-abdomen.splenic-arterial-embolization",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 8,
    "conceptId": "concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 9,
    "conceptId": "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 10,
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 11,
    "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 12,
    "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 13,
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-acquisition.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-acquisition.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 14,
    "conceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [],
    "activeVariantIds": [],
    "coverage": "prior_meaning_retained_gap"
  },
  {
    "rank": 15,
    "conceptId": "concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 16,
    "conceptId": "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 17,
    "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 18,
    "conceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [],
    "activeVariantIds": [],
    "coverage": "prior_meaning_retained_gap"
  },
  {
    "rank": 19,
    "conceptId": "concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 20,
    "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 21,
    "conceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [],
    "activeVariantIds": [],
    "coverage": "prior_meaning_retained_gap"
  },
  {
    "rank": 22,
    "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 23,
    "conceptId": "concept.topic.trauma-initial-abdomen.duodenal-hematoma-persistent-obstruction.v2",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  },
  {
    "rank": 24,
    "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
    "existingVariantIds": [],
    "auditRecordIds": [],
    "auditDecision": "No primary program inventory; round-2 response recorded separately.",
    "newVariantIds": [
      "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2"
    ],
    "activeVariantIds": [
      "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2"
    ],
    "coverage": "clinic_candidate_unapproved"
  }
]
```

Remaining research gaps:

```json
[
  {
    "id": "gap.trauma-initial-abdomen.reexploration-timing",
    "priority": "high",
    "scope": "Timing/trigger for damage-control takeback and planned second-look bowel assessment",
    "reason": "Closure is covered, but takeback timing is not scored. No fixed interval is guessed.",
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.fascial-closure"
    ],
    "next": "Use a supported exact timeline or a meaningful deterioration-versus-planned-takeback contrast in a later bounded case."
  },
  {
    "id": "gap.trauma-initial-abdomen.central-retroperitoneal-exposure",
    "priority": "high",
    "scope": "Central retroperitoneal hematoma, vascular control and operative exposure",
    "reason": "Only the contained lateral renal compartment is scored. Do not generalize that rule to central or penetrating vascular injury.",
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.contained-zone-two"
    ],
    "next": "Acquire current permitted vascular-trauma guidance and stage-specific operative observations."
  },
  {
    "id": "gap.trauma-initial-abdomen.primary-secondary-survey",
    "priority": "high",
    "scope": "Global survey prioritization after a changing bedside finding",
    "reason": "The initial profound-shock route candidates are now parked for recognition-only difficulty. No separate airway/thoracic or head/spine scored node is added across lane boundaries.",
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.stable-ct"
    ],
    "next": "Manager coordinates a distinct global-survey construct with trauma-thoracic/head-spine workers."
  },
  {
    "id": "gap.trauma-initial-abdomen.solid-organ-followup",
    "priority": "medium",
    "scope": "Post-injury imaging and mobilization decisions",
    "reason": "WSES 2022 and older EAST differ in specificity, and exact schedules are not presented as universal. No blanket normal-CT/return-to-activity rule.",
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.splenic-observation",
      "claim.trauma-initial-abdomen.renal-evidence-limit"
    ],
    "next": "Source exact injury-specific follow-up assumptions before adding hard applied variants."
  },
  {
    "id": "gap.trauma-initial-abdomen.pediatric-and-prophylaxis",
    "priority": "medium",
    "scope": "Pediatric organ preservation, post-splenectomy/asplenia and VTE timing",
    "reason": "No adult embolization trigger, vaccine rule or fixed prophylaxis schedule is transferred to children or another topic.",
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.splenic-embolization"
    ],
    "next": "Coordinate pediatric trauma and spleen-asplenia / perioperative prevention companion ownership through the manager."
  },
  {
    "kind": "round2_quality_parks",
    "variantIds": [
      "question.topic.trauma-initial-abdomen.crash-operative-route.v2",
      "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2",
      "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2",
      "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2"
    ],
    "reason": "Four supported recognition candidates still fail the two-step/difficulty/competitor gate after one attempt. Manager may seek an exact foundational exception or a different supported construct; these are excluded from supply."
  }
]
```

## Complete audit and independent-review reconciliation

Original assigned inventory audit: **0** records, **0** omissions, **0** extras. No original live/draft variant existed in this topic lane; no audit verdict has been invented for an unkeyed slot. Review-round statuses below cover every candidate actually returned by the manager.

```json
{
  "assignedInventoryRecordIds": [],
  "assignedExactVariantIds": [],
  "auditedInventoryRecordIds": [],
  "missing": [],
  "extra": [],
  "reason": "Complete primary-topic inventory, concept, case, node and variant indexes are empty; all snapshot input hashes matched intake."
}
```

| Reviewed exact variant | Independent verdict | Current exact variant | Status | Response |
|---|---|---|---|---|
| `question.topic.trauma-initial-abdomen.crash-operative-route.v1` | REVISE | `question.topic.trauma-initial-abdomen.crash-operative-route.v2` | parked | One neutral-task revision attempt preserves recurrent shock and positive FAST. It still has one consequential recognition step; no supported competing localization evidence can be added without changing or obscuring the emergency. No accepted foundational exception exists. Excluded from runtime supply. |
| `question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1` | REVISE | `question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2` | parked | One same-stage revision removes the original option cues but retains an easy damage-control recognition rule with a weak third competitor. Adding unsupported anastomotic cutoffs would not repair it. Excluded pending an accepted foundational purpose or a different supported construct. |
| `question.topic.trauma-initial-abdomen.crash-fascial-closure.v1` | REVISE | `question.topic.trauma-initial-abdomen.crash-fascial-closure.v2` | revised | Replaced the plan-announcing statement with an observed differential bowel response and kept technical closure tolerance. The new key changes by a supported branch of the same closure-eligibility meaning. |
| `question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1` | PASS | `question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1` | REVISE | `question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2` | revised | Supplied the prior CT and a directly sourced six-hour reassessment interval, changed to a neutral management task and replaced modality foils with competing care paths. No mandatory universal CT clock is asserted. |
| `question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1` | REVISE | `question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2` | parked | One revision attempt still yields a single obvious operative-recognition answer, with no fair close competitor under the stated direct wall defect, gas and guarding. No safety findings were removed to make uncertainty. Excluded from runtime. |
| `question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1` | PASS | `question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1` | REVISE | `question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2` | parked | One chronology/task revision resolves the actual clarity error. Profound persistent shock still makes this foundational recognition; it shares the initial crash operative-rescue meaning and cannot be counted as another difficult objective. No accepted basic exception exists. Excluded from runtime. |
| `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1` | PASS | `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1` | PASS | `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1` | REVISE | `question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2` | revised | Added current circulation/examination, clarified that culture is from an earlier aspiration and replaced the generic infected-accessible-cavity rule with interpretation of a failed drainage path. No unsupported catheter exchange technique or output threshold is prescribed. |
| `question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1` | PASS | `question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1` | PASS | `question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.bladder-acquisition.v1` | REVISE | `question.topic.trauma-initial-abdomen.bladder-acquisition.v2` | revised | Removed the announced omitted technique and replaced it with performed-protocol and filling observations. Re-solved the same three targets and retained a limited, nonabsolute urethral interpretation. Catheter passage is described as an observation, never a definitive exclusion of urethral injury. |
| `question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1` | REVISE | `question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2` | revised | Replaced the foundational intraperitoneal recognition task with a supported extraperitoneal repair exception, named every treatment and versioned the changed meaning instead of transferring its history. A distinct, explicitly versioned extraperitoneal repair-exception construct replaces the classic intraperitoneal association. The bone finding, compartment and current physiology are all visible. |
| `question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1` | REVISE | `question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2` | revised | Made arterial/venous/excretory inclusion explicit for the complete CT option and arterial/venous acquisition explicit for the competing protocol. No phase timing or clinical threshold was invented. |
| `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1` | PASS | `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1` | PASS | `question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1` | REVISE | `question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2` | revised | Moved scoring to a supported reassessment boundary and explicitly versioned the changed objective. The 14-day guideline boundary is directly sourced; sixteen days is a constructed patient course, not a mandatory universal operative deadline. The current record is no longer untreated uncomplicated obstruction: prolonged failed conservative care competes with misleading radiographic shrinkage. The exact intervention route remains a clinician-reviewed selected plan, not a universal claim. |
| `question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1` | REVISE | `question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2` | revised | Supplied concrete patient geometry, tissue response, lumen/traction observations and a current systemic/contamination assessment. Measurements are fictional findings, not invented treatment cutoffs. |
| `question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1` | PASS | `question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1` | pass-preserved | Clinical payload exact; neutral frame only |
| `question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1` | REVISE | `question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2` | revised | Replaced the all-favorable repair rule with a size-versus-perfusion conflict and a realistic staged-reconstruction alternative. Explicit new meaning retains the old direct-repair identity and history. |

22 reviewed candidate variants / 22 case-node rows, separate from the original zero-row program assignment. 9 exact clinical PASS payloads retained, 9 revised active questions, 4 parked attempts. 18 active new-to-default questions across 11 clinic cases and 18 unique active meanings; 24 meaning records retain original history, including 3 newly versioned changes. No retirement or installation performed.

## Current clinic cases and finite profiles

| Patient | Case | Active nodes | Parked nodes | Current admission |
|---|---|---|---|---|
| Nora Ellis (46, Female) | `case.topic.trauma-initial-abdomen.crash-staged-control.v2` | 1 | 2 | clinic; stable; examination; stage 0 |
| Caleb Mercer (55, Male) | `case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2` | 2 | 1 | clinic; stable; examination; stage 0 |
| Owen Blake (36, Male) | `case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2` | 1 | 1 | clinic; stable; examination; stage 0 |
| Maya Grant (42, Female) | `case.topic.trauma-initial-abdomen.liver-complication-chain.v2` | 3 | 0 | clinic; stable; examination; stage 0 |
| Dylan Shaw (48, Male) | `case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2` | 2 | 0 | clinic; stable; examination; stage 0 |
| Ethan Cole (37, Male) | `case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2` | 2 | 0 | clinic; stable; examination; stage 0 |
| Iris Bennett (31, Female) | `case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2` | 2 | 0 | clinic; stable; examination; stage 0 |
| Miles Warren (40, Male) | `case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2` | 1 | 0 | clinic; stable; examination; stage 0 |
| Ava Parker (34, Female) | `case.topic.trauma-initial-abdomen.duodenal-injury-course.v2` | 2 | 0 | clinic; stable; examination; stage 0 |
| Noah Reed (52, Male) | `case.topic.trauma-initial-abdomen.contained-renal-compartment.v2` | 1 | 0 | clinic; stable; examination; stage 0 |
| Elena Brooks (28, Female) | `case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2` | 1 | 0 | clinic; stable; examination; stage 0 |

All case frames are complete existing-schema definitions, not proposals for a new setting. The schema’s legacy `approvedInstantiationProfiles` field contains the exact finite profile representation; its name does not grant clinical approval. The packet and source release explicitly remain unapproved.

```json
[
  {
    "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.crash-fascial-closure.v2"
    ],
    "parkedNodeIds": [
      "node.topic.trauma-initial-abdomen.crash-operative-route.v2",
      "node.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2"
    ],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.crash-staged-control.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 1
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2"
    ],
    "parkedNodeIds": [
      "node.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2"
    ],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 5
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 5
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1"
    ],
    "parkedNodeIds": [
      "node.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2"
    ],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.spleen-stability-and-rescue.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 1
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 2
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 2
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 2
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 2
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 3
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 4
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 1
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.renal-stage-and-observe.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 1
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.pancreatic-duct-location.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "node.topic.trauma-initial-abdomen.duodenum-repair-scope.v2"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 3
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
        "reviewContext": "all_possible_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.contained-renal-compartment.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  },
  {
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
    "activeNodeIds": [
      "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2"
    ],
    "parkedNodeIds": [],
    "profileIds": [
      "profile.topic.trauma-initial-abdomen.limited-jejunum-defect.clinic-review.v2"
    ],
    "reviewedContexts": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
        "reviewContext": "no_prior_feedback",
        "findingCount": 0
      }
    ],
    "finding": "Clinic frame separates current attendance from outside hospital care. Current exports contain no parked earlier questions; all active current updates are self-contained at their own decision point. Prior explanations/rationales and current observations were inspected separately; future results are excluded.",
    "limitation": "Qualitative author sequence review, not independent editorial acceptance or clinical approval."
  }
]
```

## Exact before/after item packets and author gates

**key shown first for review only.** All active runtime nodes set `shuffleAnswers: true`. Before records below are historical review evidence, not admitted acute-care settings. Four parked attempts are retained for accountability and are excluded from active question, timing and sequence exports.

### crash-operative-route — parked

Independent review: `question.topic.trauma-initial-abdomen.crash-operative-route.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Exploratory laparotomy is the defensible best answer with recurrent profound hypotension and a positive FAST. No confident clinical inaccuracy identified. The first node is self-contained.",
    "The final BP of 76/42 mmHg plus intraperitoneal fluid settles this familiar emergency rule. The intermediate improvement does not create a substantial competing interpretation at the moment of decision; this is foundational recognition rather than two consequential resident-level steps.",
    "Review-wide scope: all 22 candidate nodes were independently assessed from presentation, current update, exhibit, task, option labels and explanation; author gates and key position were not evidence of quality. There are no rewritten, kept, retired or parked executable records to assess. Five unkeyed holds were excluded: selected-stab-observation-versus-laparoscopy, initial-pelvic-packing-versus-angio, stable-renal-bleeding-embolization, pancreatic-mrcp-versus-ercp and colon-rectal-repair-diversion.",
    "Review-wide limitation: offline editorial review, no external source verification or clinical approval. PASS means editorial acceptance of the supplied visible wording, not release or clinical sign-off. All drafts remain needs_clinician_review. Difficulty and high-yield judgments are qualitative, not measured performance or verified examination-frequency claims. Runtime rendering, randomization and wait estimates are outside this visible-text review."
  ],
  "suggestions": [
    "Seek explicit acceptance as a foundational emergency-recognition item, or rebuild around a source-supported competing hemorrhage-localization or response-assessment decision. Do not obscure or remove the current danger signs to manufacture difficulty.",
    "Keep this and the failed-splenic-management node from being counted as two distinct difficult reasoning objectives."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.crash-operative-route.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "parked",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "No clarity defect was reported; the transient improvement and subsequent profound deterioration remain explicit."
  ],
  "cueResolutions": [
    "Neutral chart-review task retains all emergency findings without adding a concealed diagnosis or deleting danger signs."
  ],
  "fairnessResolutions": [
    "Re-solved the same real management paths with the final pressure as the decision point. Laparotomy remains fair, but the supported findings still settle a familiar recognition rule."
  ],
  "sourceBoundary": "Existing mapped claims support the retained safety decision. No new source claim was invented to make the failed candidate appear difficult; unresolved quality problems are explicit in parkReason.",
  "parkReason": "One neutral-task revision attempt preserves recurrent shock and positive FAST. It still has one consequential recognition step; no supported competing localization evidence can be added without changing or obscuring the emergency. No accepted foundational exception exists. Excluded from runtime supply."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-operative-route.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-operative-route.v1",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "a3b18fe3f2298bcc4bd1f0dc7ddea938f95207c2157fa8838036a0362841d94d",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-operative-route.v1\")",
  "before": null
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Pain after collision.

{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after collision",
    "presentation": "{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Interpret a transient resuscitation response and choose the abdominal hemorrhage-control route.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| On arrival | BP 78/46 mmHg; pulse 138/min |
| After initial blood | BP 108/64 mmHg; pulse 116/min |
| During reassessment | BP 76/42 mmHg; pulse 144/min; cool skin |
| FAST | Fluid in right upper quadrant and pelvis |

**Complete task:** Which abdominal management plan should {patientName} undergo now?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to exploratory laparotomy** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.laparotomy`.

   Post-answer rationale: The pressure improvement was not sustained. Recurrent collapse with intraperitoneal fluid requires operative hemorrhage control while resuscitation continues.

   Credible error: Key

   Reasonable counterfactual: Current response trajectory with intraperitoneal fluid.

   Claims: `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

2. **Proceed to IV-contrast abdominal CT**

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.ct`.

   Post-answer rationale: A brief rise in pressure does not establish readiness for transport. CT characterizes injury after sustained stabilization.

   Credible error: Treat the best transient pressure as the current response.

   Reasonable counterfactual: Perfusion remains restored after resuscitation without an immediate operative indication.

   Claims: `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `timing.test.ct`.

3. **Proceed to abdominal catheter angiography**

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.angiography`.

   Post-answer rationale: Continuing deterioration with an unlocalized intra-abdominal source favors operative control rather than an initial arterial procedure.

   Credible error: Apply organ-specific embolization before stable localization.

   Reasonable counterfactual: Sustained stabilization permits localization of an isolated treatable arterial focus.

   Claims: `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `timing.test.advanced_diagnostic`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-operative-route.laparotomy`

**Explanation:** The pressure improvement was not sustained. Recurrent collapse with intraperitoneal fluid requires operative hemorrhage control while resuscitation continues.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — parked v2 attempt; never scored

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-operative-route.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-operative-route.v2",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "cb3ebc16947a22edcd426511f92f7030650b6a4848ba5eb6fda599666070f270",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-operative-route.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.crash-operative-route.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.crash-operative-route.v1",
    "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
    "exactDraftSha256": "a3b18fe3f2298bcc4bd1f0dc7ddea938f95207c2157fa8838036a0362841d94d",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid."
  }
]
```

**Objective:** Interpret a transient resuscitation response and choose the abdominal hemorrhage-control route.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| On arrival | BP 78/46 mmHg; pulse 138/min |
| After initial blood | BP 108/64 mmHg; pulse 116/min |
| During reassessment | BP 76/42 mmHg; pulse 144/min; cool skin |
| FAST | Fluid in right upper quadrant and pelvis |

**Complete task:** At this recorded resuscitation decision, which abdominal plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to exploratory laparotomy** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.laparotomy`.

   Post-answer rationale: The pressure improvement was not sustained. Recurrent collapse with intraperitoneal fluid requires operative hemorrhage control while resuscitation continues.

   Credible error: Key

   Reasonable counterfactual: Current response trajectory with intraperitoneal fluid.

   Claims: `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

2. **Proceed to IV-contrast abdominal CT**

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.ct`.

   Post-answer rationale: A brief rise in pressure does not establish readiness for transport. CT characterizes injury after sustained stabilization.

   Credible error: Treat the best transient pressure as the current response.

   Reasonable counterfactual: Perfusion remains restored after resuscitation without an immediate operative indication.

   Claims: `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `timing.test.ct`.

3. **Proceed to abdominal catheter angiography**

   ID: `choice.topic.trauma-initial-abdomen.crash-operative-route.angiography`.

   Post-answer rationale: Continuing deterioration with an unlocalized intra-abdominal source favors operative control rather than an initial arterial procedure.

   Credible error: Apply organ-specific embolization before stable localization.

   Reasonable counterfactual: Sustained stabilization permits localization of an isolated treatable arterial focus.

   Claims: `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `timing.test.advanced_diagnostic`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-operative-route.laparotomy`

**Explanation:** The pressure improvement was not sustained. Recurrent collapse with intraperitoneal fluid requires operative hemorrhage control while resuscitation continues.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "PARKED_FAILED_DIFFICULTY_OR_COMPETITION_GATE",
  "statisticsException": false,
  "coverTheKey": "All stated danger signs retained. This failed revision is catalogued for accountability, never offered as a scored draft.",
  "sameStageAndCategory": "Compared the revised labels at the recorded management stage; residual competitor weakness is a reason for parking, not an asserted pass.",
  "twoConsequentialSteps": {
    "interpret": "The raw findings are retained in full.",
    "apply": "The application still follows one familiar recognition rule rather than two consequential supported steps."
  },
  "residentDifficulty": {
    "prediction": "easy",
    "basis": "One neutral-task revision attempt preserves recurrent shock and positive FAST. It still has one consequential recognition step; no supported competing localization evidence can be added without changing or obscuring the emergency. No accepted foundational exception exists. Excluded from runtime supply.",
    "measured": false
  },
  "singleBest": {
    "decidingObservation": "Original urgent/direct findings remain decisive.",
    "counterfactualChange": "Removing the urgent/direct observation could make another route reasonable, but removing it from this case would manufacture difficulty."
  },
  "deletionTest": {
    "actualResolution": "Necessary danger signs were not deleted. The failed option/task repair did not meet the full quality gate.",
    "repairLog": "Re-solved the same real management paths with the final pressure as the decision point. Laparotomy remains fair, but the supported findings still settle a familiar recognition rule."
  },
  "wholeVisibleSequence": "Excluded from active chart-review sequences and all prior-feedback exports.",
  "finiteProfiles": "The archived attempt has the same neutral existing-clinic chart-review frame as its case.",
  "postRepairReview": {
    "independent": false,
    "clinicalApproval": false,
    "authorDisposition": "parked_after_one_revision_attempt"
  }
}
```

Visible-sequence constraint: Excluded from active chart-review sequences and all prior-feedback exports.

**Park reason:** One neutral-task revision attempt preserves recurrent shock and positive FAST. It still has one consequential recognition step; no supported competing localization evidence can be added without changing or obscuring the emergency. No accepted foundational exception exists. Excluded from runtime supply.

### crash-abbreviated-operation — parked

Independent review: `question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [
    {
      "phrase": "bowel discontinuity and temporary closure",
      "why": "Both other choices repeat 'jejunal anastomosis and fascial closure'. The key is the sole alternative on both reconstruction and closure, creating a conspicuous bundled outlier rather than independently credible competing plans."
    }
  ],
  "fairness": [
    "Abbreviated surgery with deferred reconstruction is the defensible best answer for ongoing oozing, hypothermia, acidosis and escalating support. No confident clinical error identified.",
    "The entire classic damage-control pattern is supplied. Both alternatives commit to immediate reconstruction and closure, and one adds anatomic liver resection; neither offers a close decision boundary for this physiology.",
    "Chronology is coherent after laparotomy, and the current update plus exhibit supply the operative facts needed independently. The previous explanation does not give away this specific reconstruction decision."
  ],
  "suggestions": [
    "Either accept the item explicitly as foundational damage-control recognition or test a narrower consequential decision with credible alternatives at this operative stage.",
    "Avoid making both distractors share the same two inappropriate commitments. Keep the actual operations named and put their rationale after the answer."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "parked",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Moved hepatic packing and temporary wall coverage into common care, so all options now compare bowel continuity."
  ],
  "cueResolutions": [
    "Removed the bundled key, repeated anastomosis/closure matrix and unrelated major liver resection."
  ],
  "fairnessResolutions": [
    "Narrowed the task without removing hypothermia, acidosis, oozing or escalating support. Staged bowel discontinuity remains the fair recognition answer; the enterostomy alternative does not supply a genuinely close boundary."
  ],
  "sourceBoundary": "Existing mapped claims support the retained safety decision. No new source claim was invented to make the failed candidate appear difficult; unresolved quality problems are explicit in parkReason.",
  "parkReason": "One same-stage revision removes the original option cues but retains an easy damage-control recognition rule with a weak third competitor. Adding unsupported anastomotic cutoffs would not repair it. Excluded pending an accepted foundational purpose or a different supported construct."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "a335ed12913f710fad4905570bae20fd76be272c6258d71495e0c5dac06c5891",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1\")",
  "before": null
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Pain after collision.

{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after collision",
    "presentation": "{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Choose damage control rather than definitive reconstruction during worsening operative physiology.

**Historical hospital phase/acuity:** `trauma_operating_room` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** At laparotomy, perihepatic packs have reduced bleeding from a deep liver tear. A devascularized jejunal segment has been resected and its ends stapled. Diffuse oozing continues.

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Temperature | 33.5 C |
| Arterial pH | 7.14 |
| Support | Vasopressor and blood requirements increasing |

**Complete task:** Which operative plan should be used for {patientName} at this stage?

**key shown first for review only.** Runtime choices are randomized.

1. **Perihepatic packing, bowel discontinuity and temporary closure** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.temporary`.

   Post-answer rationale: Ongoing support needs, hypothermia, acidosis and diffuse oozing favor ending the initial operation after hemorrhage and contamination control. Reconstruction is deferred.

   Credible error: Key

   Reasonable counterfactual: Impaired physiology and unfinished staged reconstruction.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`. Timing profile: `no_test`.

2. **Perihepatic packing, jejunal anastomosis and fascial closure**

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.anastomosis`.

   Post-answer rationale: A short resection makes reconstruction attractive, but worsening physiology argues against completing anastomosis and closure now.

   Credible error: Let limited bowel resection outweigh the global operative trajectory.

   Reasonable counterfactual: Perfusion and temperature recover, support needs cease and viability/source control permit definitive reconstruction.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.bowel-resection-risk`, `claim.trauma-initial-abdomen.fascial-closure`. Timing profile: `no_test`.

3. **Anatomic liver resection, jejunal anastomosis and fascial closure**

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.resection`.

   Post-answer rationale: Major resection adds burden when packing has reduced focal bleeding and systemic physiology is worsening.

   Credible error: Treat anatomy as a mandate for definitive resection during physiologic failure.

   Reasonable counterfactual: After stabilization, a devascularized hepatic segment causes an uncontrolled complication requiring resection.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.hepatic-devascularized-complication`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.temporary`

**Explanation:** Ongoing support needs, hypothermia, acidosis and diffuse oozing favor ending the initial operation after hemorrhage and contamination control. Reconstruction is deferred.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.bowel-resection-risk`, `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.hepatic-devascularized-complication`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — parked v2 attempt; never scored

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "47169923873d504552d433f469a7b928ffbfac30db6938d72960d7af00c07bf0",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1",
    "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy",
    "exactDraftSha256": "a335ed12913f710fad4905570bae20fd76be272c6258d71495e0c5dac06c5891",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid."
  }
]
```

**Objective:** Choose damage control rather than definitive reconstruction during worsening operative physiology.

**Historical hospital phase/acuity:** `trauma_operating_room` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** At laparotomy, perihepatic packs have reduced bleeding from a deep liver tear. A devascularized jejunal segment has been resected and its ends stapled. Diffuse oozing continues. Perihepatic packs and a temporary abdominal dressing will remain for the planned return.

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Temperature | 33.5 C |
| Arterial pH | 7.14 |
| Support | Vasopressor and blood requirements increasing |

**Complete task:** At this recorded operation, which bowel-continuity plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Leave stapled ends for staged reconstruction** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.r2.defer`.

   Post-answer rationale: The worsening systemic course supports deferring reconstruction after contamination control.

   Credible error: Key

   Reasonable counterfactual: Physiologic recovery and perfusion are not yet established.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`. Timing profile: `no_test`.

2. **Restore continuity with jejunal anastomosis**

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.r2.anastomose`.

   Post-answer rationale: Immediate continuity becomes appropriate after restoration of physiology and suitable bowel conditions; those conditions are absent here.

   Credible error: Discount worsening physiology because the resection was short.

   Reasonable counterfactual: Physiology and perfusion recover and no unfinished source-control task remains.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.small-bowel-repair`. Timing profile: `no_test`.

3. **Exteriorize the ends as an enterostomy**

   ID: `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.r2.stoma`.

   Post-answer rationale: A diversion may be selected for anatomy or reconstruction constraints, but it does not remove the current need to shorten this operation.

   Credible error: Use a definitive diversion before deciding whether reconstruction can wait.

   Reasonable counterfactual: The later reconstruction assessment identifies a need for diversion rather than anastomosis.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.bowel-resection-risk`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-abbreviated-operation.r2.defer`

**Explanation:** The worsening systemic course supports deferring reconstruction after contamination control.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "PARKED_FAILED_DIFFICULTY_OR_COMPETITION_GATE",
  "statisticsException": false,
  "coverTheKey": "All stated danger signs retained. This failed revision is catalogued for accountability, never offered as a scored draft.",
  "sameStageAndCategory": "Compared the revised labels at the recorded management stage; residual competitor weakness is a reason for parking, not an asserted pass.",
  "twoConsequentialSteps": {
    "interpret": "The raw findings are retained in full.",
    "apply": "The application still follows one familiar recognition rule rather than two consequential supported steps."
  },
  "residentDifficulty": {
    "prediction": "easy",
    "basis": "One same-stage revision removes the original option cues but retains an easy damage-control recognition rule with a weak third competitor. Adding unsupported anastomotic cutoffs would not repair it. Excluded pending an accepted foundational purpose or a different supported construct.",
    "measured": false
  },
  "singleBest": {
    "decidingObservation": "Original urgent/direct findings remain decisive.",
    "counterfactualChange": "Removing the urgent/direct observation could make another route reasonable, but removing it from this case would manufacture difficulty."
  },
  "deletionTest": {
    "actualResolution": "Necessary danger signs were not deleted. The failed option/task repair did not meet the full quality gate.",
    "repairLog": "Narrowed the task without removing hypothermia, acidosis, oozing or escalating support. Staged bowel discontinuity remains the fair recognition answer; the enterostomy alternative does not supply a genuinely close boundary."
  },
  "wholeVisibleSequence": "Excluded from active chart-review sequences and all prior-feedback exports.",
  "finiteProfiles": "The archived attempt has the same neutral existing-clinic chart-review frame as its case.",
  "postRepairReview": {
    "independent": false,
    "clinicalApproval": false,
    "authorDisposition": "parked_after_one_revision_attempt"
  }
}
```

Visible-sequence constraint: Excluded from active chart-review sequences and all prior-feedback exports.

**Park reason:** One same-stage revision removes the original option cues but retains an easy damage-control recognition rule with a weak third competitor. Adding unsupported anastomotic cutoffs would not repair it. Excluded pending an accepted foundational purpose or a different supported construct.

### crash-fascial-closure — revised

Independent review: `question.topic.trauma-initial-abdomen.crash-fascial-closure.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [
    {
      "phrase": "No further exploration is planned. Fascia comes together without tension or a change in ventilation or circulation.",
      "why": "This nearly states the closure-eligibility conclusion and rehearses the explanation. Even a nonmedical reader is directed toward joining the fascia rather than temporary coverage or deferred reconstruction. The observations of tolerance are legitimate; the combined checklist makes the decision elementary."
    }
  ],
  "fairness": [
    "Primary fascial suturing is the single best supplied plan. Hemostasis, restored physiology, completed bowel reconstruction and tolerated approximation make continued temporary coverage or a planned hernia poorly competitive.",
    "This is coherent after the abbreviated operation and self-contained at re-exploration. Prior feedback establishes deferred reconstruction, but does not independently teach the current closure criteria.",
    "Two consequential inferences are not required: the current narrative has already resolved every barrier to closure."
  ],
  "suggestions": [
    "Retain the closure-safety observations, but replace the announced plan with objective findings if developing a harder case.",
    "Use a genuine, source-supported conflict between remaining operative needs and physiologic recovery, or label this as an explicitly accepted foundational closure item. Do not remove required safety facts merely to make the answer less obvious."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "No clarity issue was raised for this reviewed item."
  ],
  "cueResolutions": [
    "Removed the no-further-exploration plan; retained safety observations while adding a real local-versus-systemic conflict."
  ],
  "fairnessResolutions": [
    "Replaced the plan-announcing statement with an observed differential bowel response and kept technical closure tolerance. The new key changes by a supported branch of the same closure-eligibility meaning."
  ],
  "sourceBoundary": "WSES open-abdomen guidance supports continued access when bowel viability remains unresolved, even after systemic recovery. No ischemia time or physiologic threshold is invented.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-fascial-closure.v1",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "97bf4d6029229db1b33c7bcbdc9bac5d4ab56f6de4a6872dc7422bac227255e8",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-fascial-closure.v1\")",
  "before": null
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Pain after collision.

{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after collision",
    "presentation": "{patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Recognize when the original indication for an open abdomen has resolved.

**Historical hospital phase/acuity:** `trauma_reexploration` / `stable`. Current clinic acuity is a separate case field.

**Current recorded update:** At planned re-exploration after ICU resuscitation, packs are removed and hemostasis persists. All bowel is perfused and the jejunal anastomosis is completed. No further exploration is planned. Fascia comes together without tension or a change in ventilation or circulation.

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Temperature | 36.8 C |
| Arterial pH | 7.37 |
| Support | No vasopressor or further blood requirement |

**Complete task:** How should {patientName}'s abdominal wall be managed at this re-exploration?

**key shown first for review only.** Runtime choices are randomized.

1. **Fascial approximation with primary suturing** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.fascial`.

   Post-answer rationale: Staged-access tasks are complete and approximation is well tolerated. Early fascial closure is favored when these conditions are met.

   Credible error: Key

   Reasonable counterfactual: Resuscitation, source control and viability assessment are complete; closure is tolerated.

   Claims: `claim.trauma-initial-abdomen.fascial-closure`. Timing profile: `no_test`.

2. **Temporary coverage with negative-pressure dressing**

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.temporary`.

   Post-answer rationale: The earlier damage-control operation does not itself justify continuing an open abdomen after its indications resolve.

   Credible error: Treat the original open-abdomen decision as enduring.

   Reasonable counterfactual: Viability remains uncertain or edema prevents safe approximation.

   Claims: `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.temporary-negative-pressure`. Timing profile: `no_test`.

3. **Skin approximation with deferred reconstruction**

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.hernia`.

   Post-answer rationale: A planned hernia is a fallback when fascial closure cannot be achieved; the current fascia and physiology support direct closure.

   Credible error: Choose a fallback despite usable fascia and resolved physiology.

   Reasonable counterfactual: Definitive fascial closure cannot be achieved in a complex or protracted open abdomen.

   Claims: `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.planned-hernia-fallback`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-fascial-closure.fascial`

**Explanation:** Staged-access tasks are complete and approximation is well tolerated. Early fascial closure is favored when these conditions are met.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.planned-hernia-fallback`, `claim.trauma-initial-abdomen.temporary-negative-pressure`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
  "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "db58f2f2d02fa40102e6c3683c0821fd1b9fc7e5bbc9d5844f595eb224b6b85c",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.crash-fascial-closure.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.crash-fascial-closure.v1",
    "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure",
    "exactDraftSha256": "97bf4d6029229db1b33c7bcbdc9bac5d4ab56f6de4a6872dc7422bac227255e8",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Nora Ellis; 46 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.crash-staged-control.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 46-year-old woman brought to the trauma bay after a motor-vehicle collision. Her airway is secured. Chest assessment shows bilateral breath sounds and no pleural or pericardial fluid."
  }
]
```

**Objective:** Distinguish recovered systemic physiology from an unresolved bowel-perfusion assessment when choosing abdominal closure.

**Historical hospital phase/acuity:** `trauma_reexploration` / `stable`. Current clinic acuity is a separate case field.

**Current recorded update:** At the outside hospital re-exploration, liver packs are removed and hemostasis persists. The stapled jejunal ends are well perfused and continuity is restored. In a separate contused segment, adjacent bowel becomes pink and contracts after warming, while scattered areas remain grey and do not contract. The fascial edges meet without tension or a change in ventilation or circulation.

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Systemic record | Temperature 36.8 C; arterial pH 7.37; no vasopressor or further blood requirement |
| Operative assessment | No uncontrolled bleeding or ongoing contamination; the abdominal wall has no tissue loss. |

**Complete task:** At this documented re-exploration, which abdominal-wall plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Negative-pressure temporary abdominal closure** — KEY

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.temporary`.

   Post-answer rationale: Systemic recovery and tolerated approximation do not settle the remaining bowel-perfusion question. Temporary closure preserves access for reassessment before definitive wall closure.

   Credible error: Key

   Reasonable counterfactual: Bowel viability remains unsettled despite recovered systemic physiology.

   Claims: `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.temporary-negative-pressure`, `claim.trauma-initial-abdomen.fascial-closure`. Timing profile: `no_test`.

2. **Primary fascial closure with sutures**

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.fascial`.

   Post-answer rationale: Closure is technically possible and physiology has recovered, but the remaining grey noncontractile areas mean that an intra-abdominal reassessment task is unfinished.

   Credible error: Treat normal global physiology and tolerated approximation as proof that all indications for staged access have resolved.

   Reasonable counterfactual: The questionable areas also recover, or viability is otherwise settled and no further exploration is needed.

   Claims: `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.keep-open`. Timing profile: `no_test`.

3. **Skin closure with deferred fascial reconstruction**

   ID: `choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.skin`.

   Post-answer rationale: A planned hernia strategy is a fallback for a complicated or protracted abdomen when definitive fascial closure cannot be achieved. This patient has usable fascia and a temporary unresolved intra-abdominal task.

   Credible error: Choose a long-term wall fallback for a short-term need to reassess bowel.

   Reasonable counterfactual: A complicated protracted open abdomen cannot achieve fascial closure through appropriate management.

   Claims: `claim.trauma-initial-abdomen.planned-hernia-fallback`, `claim.trauma-initial-abdomen.keep-open`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.temporary`

**Explanation:** Systemic recovery and tolerated approximation do not settle the remaining bowel-perfusion question. Temporary closure preserves access for reassessment before definitive wall closure.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.temporary-negative-pressure`, `claim.trauma-initial-abdomen.fascial-closure`, `claim.trauma-initial-abdomen.planned-hernia-fallback`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Removed the announced no-further-exploration conclusion and replaced the fully reassuring checklist with conflicting local and systemic observations. Labels are parallel wall strategies; the key is not the sole option differing on both bowel reconstruction and closure.",
  "sameStageAndCategory": "All three options are wall-management strategies at the same takeback; bowel reconstruction is shared completed history.",
  "twoConsequentialSteps": {
    "interpret": "Separate restored systemic physiology from persistent local grey noncontractile bowel after adjacent bowel responds to warming.",
    "apply": "Keep access for interval bowel assessment despite tolerated fascial approximation."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "A credible early-closure error follows the normal pH, recovered circulation and easy approximation while overlooking the unresolved local perfusion finding.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.fascial",
    "decidingObservation": "Persistent local bowel findings after adjacent bowel improves, despite normalized systemic physiology",
    "consequenceOfClosestError": "Closure is technically possible and physiology has recovered, but the remaining grey noncontractile areas mean that an intra-abdominal reassessment task is unfinished.",
    "counterfactualChange": "If the previously grey areas also become pink and contractile and no other operative task remains, primary fascial closure is supported.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.fascial",
    "counterfactualResolution": "The questionable areas also recover, or viability is otherwise settled and no further exploration is needed."
  },
  "deletionTest": {
    "actualResolution": "Deleting the local response observation returns the fully recovered closure-ready record and favors the fascial option. Deleting systemic recovery eliminates the real temptation to close.",
    "sentenceAndExhibitJobs": "The systemic exhibit preserves a credible closure argument. The side-by-side local response establishes the unresolved task. Approximation tolerance remains because the review requires closure-safety data rather than artificial technical impossibility.",
    "repairLog": "Replaced the plan-announcing statement with an observed differential bowel response and kept technical closure tolerance. The new key changes by a supported branch of the same closure-eligibility meaning."
  },
  "wholeVisibleSequence": "The two earlier emergency-recognition items are parked and do not supply scored feedback. This record independently states the damage-control history and current findings.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All three options are wall-management strategies at the same takeback; bowel reconstruction is shared completed history.",
    "cueDisposition": "Removed the announced no-further-exploration conclusion and replaced the fully reassuring checklist with conflicting local and systemic observations. Labels are parallel wall strategies; the key is not the sole option differing on both bowel reconstruction and closure."
  }
}
```

Visible-sequence constraint: The two earlier emergency-recognition items are parked and do not supply scored feedback. This record independently states the damage-control history and current findings.

### belt-equivocal-observation — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Inpatient serial examinations are the best supplied plan. Unexplained fluid and mesenteric changes cannot be treated as a reassuring negative CT, while stable physiology and absence of peritoneal signs or a direct perforation finding do not mandate immediate exploration.",
    "Two consequential steps remain: interpret the indirect injury pattern, then choose monitored reassessment rather than discharge or premature operation. These are recognizable resident errors.",
    "The task and first-node record are self-contained. The negatives are needed to distinguish the offered care pathways, rather than arbitrary exclusions. No confident clinical inaccuracy or nonmedical wording shortcut identified."
  ],
  "suggestions": [
    "Preserve the distinction between an equivocal abnormal CT and a completely negative CT when revising adjacent nodes."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "159b9b03b999c2bce4608753e1214f3809ed3325473c3500112ff60c8c453362",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `0a84ddef6b4962048f9b9534660d21479e9c5bcdf54069397e6268f8daa11e30`. Frozen clinical payload SHA-256: `159b9b03b999c2bce4608753e1214f3809ed3325473c3500112ff60c8c453362`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
  "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "a5874af3f5153496b43030e9c3981ca3bf374645ec4b4a936d578e96181374ca",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1\")",
  "before": null
}
```

**Patient and frame:** Caleb Mercer; 55 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt."
  }
]
```

**Objective:** Choose monitored assessment after nonspecific bowel/mesenteric CT findings.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | IV-contrast scan: small interloop/pelvic fluid, focal mesenteric stranding; no solid-organ injury, wall defect or extraluminal air |
| Examination | Localized lower abdominal tenderness; no guarding or rebound |
| Circulation | BP 126/74 mmHg; pulse 92/min; no support requirement |

**Complete task:** Which care setting and assessment plan should be used for {patientName} after this CT?

**key shown first for review only.** Runtime choices are randomized.

1. **Inpatient observation with serial abdominal examinations** — KEY

   ID: `choice.topic.trauma-initial-abdomen.belt-equivocal-observation.observe`.

   Post-answer rationale: Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.

   Credible error: Key

   Reasonable counterfactual: Stable evaluable patient with nonspecific abnormalities and no operative indication.

   Claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`. Timing profile: `no_test`.

2. **Discharge with outpatient abdominal reassessment**

   ID: `choice.topic.trauma-initial-abdomen.belt-equivocal-observation.discharge`.

   Post-answer rationale: No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury.

   Credible error: Treat absence of free air as a negative bowel evaluation.

   Reasonable counterfactual: A reassuring adequate evaluation and clinical course exclude injury needing inpatient monitoring.

   Claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.stable-ct`. Timing profile: `no_test`.

3. **Operative exploration with bowel assessment**

   ID: `choice.topic.trauma-initial-abdomen.belt-equivocal-observation.explore`.

   Post-answer rationale: These changes are nonspecific and the examination has no peritoneal findings; they do not establish an immediate operative indication.

   Credible error: Treat indirect signs as proof of bowel disruption.

   Reasonable counterfactual: A wall defect, enteric contrast leak or peritoneal findings establish a reason to explore.

   Claims: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.belt-equivocal-observation.observe`

**Explanation:** Restraint-pattern trauma with unexplained fluid and mesenteric change remains concerning despite no direct perforation sign. Serial assessment is needed.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.stable-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "Complaint names pain, not bowel injury. CT balances concern and uncertainty. Choices specify the same disposition stage; the key is concrete, not generic individualized care.",
  "sameStageAndCategory": "Current disposition and abdominal-assessment plan after an acquired CT.",
  "twoConsequentialSteps": {
    "interpret": "Distinguish indirect abnormalities from both normal CT and direct disruption.",
    "apply": "Arrange serial assessment rather than discharge or operate on an indirect sign."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Treat absence of free air as a negative bowel evaluation.",
    "measured": false,
    "remainingConcern": "This is likely the easier end of moderate. Independent review must reject it if the CT/exam combination does not earn both inferences. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "unexplained fluid and mesenteric change without a direct operative sign",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.discharge",
    "consequenceOfClosestError": "No free air does not resolve these abnormalities; outpatient follow-up can miss evolving bowel injury.",
    "counterfactualChange": "Replace indirect changes with a bowel-wall gap and extraluminal enteric contrast; exploration becomes indicated.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.belt-equivocal-observation.explore",
    "counterfactualResolution": "A wall defect, enteric contrast leak or peritoneal findings establish a reason to explore."
  },
  "deletionTest": {
    "deciderAblation": "Removing unexplained fluid and mesenteric change without a direct operative sign removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration.",
    "actualResolution": "Replace the CT findings with direct wall disruption and exploration wins; replace them with a fully reassuring evaluation and resolved clinical concern and discharge can be reconsidered. Deleting the scan removes the evidence needed to distinguish indirect from direct injury.",
    "sentenceAndExhibitJobs": "Bruising establishes the mechanism, unexplained fluid and mesenteric change establish unresolved suspicion, and examination/circulation determine whether serial assessment is a viable initial strategy."
  },
  "wholeVisibleSequence": "First node. Feedback will be restricted to current evidence; repeat-imaging rules and the future defect are withheld.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Current disposition and abdominal-assessment plan after an acquired CT. This is likely the easier end of moderate. Independent review must reject it if the CT/exam combination does not earn both inferences.",
    "cueDisposition": "Complaint names pain, not bowel injury. CT balances concern and uncertainty. Choices specify the same disposition stage; the key is concrete, not generic individualized care.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: First node. Feedback will be restricted to current evidence; repeat-imaging rules and the future defect are withheld.

### belt-evolving-repeat-imaging — revised

Independent review: `question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [
    "'During observation' does not establish the elapsed clinical course since the initial CT; the appropriateness and informativeness of an immediate repeat versus an interval repeat cannot be judged precisely.",
    "The presentation and this update omit the initial CT abnormalities. A resident entering at this node sees 'Repeat' in the options without the scan findings that justify repeating it."
  ],
  "cues": [
    {
      "phrase": "Which imaging study should reassess",
      "why": "The task supplies the important decision to obtain further imaging. What remains is a modality-recognition item, with ultrasound and plain radiographs much weaker than CT for this already investigated bowel/mesenteric concern."
    }
  ],
  "fairness": [
    "In the full sequence, repeat contrast CT is the best listed imaging choice for evolving findings without a current operative indication. This is not a finding that repeat CT is clinically wrong.",
    "The preceding explanation already establishes ongoing concern and serial assessment. The new node should test how the changed examination alters management, but the lead-in removes that decision.",
    "Standalone adequacy and chronology need repair; do not infer the missing earlier scan or invent an exact mandatory rescan interval."
  ],
  "suggestions": [
    "Carry a concise summary of the prior equivocal CT and a source-supported elapsed course into the visible update.",
    "Ask a neutral next-management task and compare genuinely credible reassessment paths, with findings sufficient to separate repeat CT from continued examination or exploration. Recheck the clinical boundary after changing options."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "The current update includes the complete initial equivocal CT summary and a sourced six-hour elapsed course. No earlier node is required to infer why reassessment is being considered."
  ],
  "cueResolutions": [
    "Neutral management task replaces the imaging instruction; continued observation is the nearest competitor."
  ],
  "fairnessResolutions": [
    "Supplied the prior CT and a directly sourced six-hour reassessment interval, changed to a neutral management task and replaced modality foils with competing care paths. No mandatory universal CT clock is asserted."
  ],
  "sourceBoundary": "WSES bowel 2022 directly supports six-hour reassessment of equivocal CT and repeat CT for evolving concern; the observed six-hour interval is not a game wait or an instruction to delay urgent care.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1",
  "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "54c8846be391baf02964b9455a9e2d450fcda148472717ecb09f38d53bf0769e",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1\")",
  "before": null
}
```

**Patient and frame:** Caleb Mercer; 55 years; Male. Chief complaint: Lower abdominal pain.

{patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Lower abdominal pain",
    "presentation": "{patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Choose bowel-directed reassessment when suspicion evolves after equivocal CT.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** During observation, localized pain persists and tenderness increases. BP is 122/72 mmHg and pulse 110/min. There is still no rigidity or rebound.

_No separate exhibit._

**Complete task:** Which imaging study should reassess {patientName}'s evolving abdominal findings?

**key shown first for review only.** Runtime choices are randomized.

1. **Repeat contrast-enhanced abdominopelvic CT** — KEY

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.ct`.

   Post-answer rationale: The evolving examination after an equivocal study raises concern for initially subtle bowel or mesenteric injury. Repeat CT reassesses that concern while circulation remains stable.

   Credible error: Key

   Reasonable counterfactual: Evolving suspicion in a stable patient without an operative indication.

   Claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Timing profile: `timing.test.ct`.

2. **Repeat focused abdominal ultrasonography**

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.fast`.

   Post-answer rationale: FAST surveys fluid; it will not adequately characterize the suspected bowel/mesenteric process in this stable patient.

   Credible error: Substitute a hemorrhage-oriented fluid survey for bowel reassessment.

   Reasonable counterfactual: Recurrent collapse warrants rapid bedside free-fluid assessment during resuscitation while control is organized.

   Claims: `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Timing profile: `timing.test.ultrasound`.

3. **Obtain upright chest and abdominal radiographs**

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.radiograph`.

   Post-answer rationale: Plain films may show free air, but a negative film cannot resolve these evolving findings after equivocal CT.

   Credible error: Substitute a limited free-air screen for bowel/mesenteric reassessment.

   Reasonable counterfactual: A separate focused radiographic question requires plain films rather than full trauma reassessment.

   Claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `timing.test.radiography`.

**Key:** `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.ct`

**Explanation:** The evolving examination after an equivocal study raises concern for initially subtle bowel or mesenteric injury. Repeat CT reassesses that concern while circulation remains stable.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.bowel-direct-sign`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
  "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "60f4efc3609a8e538e614570ec8517a35387cb7f51b86e5885b6c454abcd2c27",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "exactDraftSha256": "54c8846be391baf02964b9455a9e2d450fcda148472717ecb09f38d53bf0769e",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Caleb Mercer; 55 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt."
  }
]
```

**Objective:** Choose bowel-directed reassessment when suspicion evolves after equivocal CT.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** The outside record documents IV-contrast CT six hours earlier: small interloop fluid and focal mesenteric stranding, with no solid-organ injury, wall defect or extraluminal air. During serial assessment, lower abdominal pain persists and tenderness increases. The abdomen remains soft without involuntary guarding or rebound. BP is 122/72 mmHg without support; pulse has increased from 92 to 110/min.

_No separate exhibit._

**Complete task:** At this hospital reassessment, which next management plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Repeat contrast-enhanced abdominal and pelvic CT** — KEY

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct`.

   Post-answer rationale: The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.

   Credible error: Key

   Reasonable counterfactual: Persistent/evolving suspicion after an equivocal study without a current direct operative finding.

   Claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment`, `claim.trauma-initial-abdomen.stable-ct`. Timing profile: `timing.test.ct`.

2. **Continue inpatient serial abdominal examinations**

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe`.

   Post-answer rationale: Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.

   Credible error: Carry the original observation plan forward despite clinically meaningful evolution.

   Reasonable counterfactual: Tenderness and pain improve with a reassuring serial course and no direct injury sign.

   Claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Timing profile: `no_test`.

3. **Proceed to operative abdominal exploration**

   ID: `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore`.

   Post-answer rationale: The patient remains stable without peritoneal findings or a direct wall-injury sign in the available record. The increasing suspicion warrants reassessment, but does not yet establish the direct injury evidence that would favor immediate operative control.

   Credible error: Treat evolving concern as a demonstrated perforation rather than an indication to obtain a more informative reassessment.

   Reasonable counterfactual: Peritoneal findings, instability or a newly demonstrated direct bowel-injury sign develops.

   Claims: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct`

**Explanation:** The interval course increases concern after an equivocal study while current physiology and examination still permit noninvasive characterization. Repeat CT is supported at this reassessment.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment`, `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Removed the imaging-study lead-in and the weak ultrasound/plain-film set. Three real management paths now require interpreting change over time. The prior equivocal scan and elapsed course are in this node itself.",
  "sameStageAndCategory": "All choices are the next management strategy during inpatient reassessment: repeat characterization, continued serial care or exploration.",
  "twoConsequentialSteps": {
    "interpret": "Distinguish increased clinical suspicion over a six-hour interval from both an improving observation course and a direct operative indication.",
    "apply": "Add repeat contrast CT while the patient remains stable and has no direct operative sign."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Continued examination is credible because the original study lacked a wall defect and circulation is maintained.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
    "decidingObservation": "Increasing tenderness after an equivocal CT over a documented six-hour course, with no current peritoneal signs",
    "consequenceOfClosestError": "Serial examinations were appropriate initially, but the documented interval increase in tenderness after an equivocal scan supports adding repeat imaging rather than leaving the plan unchanged.",
    "counterfactualChange": "Replace worsening tenderness with clear improvement and an otherwise reassuring course; continued serial assessment becomes reasonable.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
    "counterfactualResolution": "Tenderness and pain improve with a reassuring serial course and no direct injury sign."
  },
  "deletionTest": {
    "actualResolution": "Without the interval change, the original observation plan remains supported. With direct peritoneal or wall-injury evidence, exploration replaces repeat characterization.",
    "sentenceAndExhibitJobs": "The old CT findings establish what remains unresolved; the elapsed course repairs chronology; current examination and support distinguish reassessment from immediate control.",
    "repairLog": "Supplied the prior CT and a directly sourced six-hour reassessment interval, changed to a neutral management task and replaced modality foils with competing care paths. No mandatory universal CT clock is asserted."
  },
  "wholeVisibleSequence": "The preceding PASS is preserved exactly. The new node is self-contained and its explanation does not rehearse treatment of the future wall-discontinuity record, which is parked.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All choices are the next management strategy during inpatient reassessment: repeat characterization, continued serial care or exploration.",
    "cueDisposition": "Removed the imaging-study lead-in and the weak ultrasound/plain-film set. Three real management paths now require interpreting change over time. The prior equivocal scan and elapsed course are in this node itself."
  }
}
```

Visible-sequence constraint: The preceding PASS is preserved exactly. The new node is self-contained and its explanation does not rehearse treatment of the future wall-discontinuity record, which is parked.

### belt-bowel-wall-defect — parked

Independent review: `question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [
    {
      "phrase": "Repeat CT now shows",
      "why": "Alongside 'Obtain another IV-contrast abdominal CT', the completed decisive study makes the testing distractor transparently repetitive. No remaining acquisition or diagnostic uncertainty is supplied."
    }
  ],
  "fairness": [
    "Exploration is the single best answer for a wall discontinuity, adjacent extraluminal gas and new guarding after trauma. No confident clinical inaccuracy identified.",
    "The new findings justify changing the previous observation plan and make the node independently interpretable. Chronology is coherent.",
    "The preceding explanation rehearses the concern for occult bowel injury; this node then supplies several direct confirmatory findings against two forms of delay. Recognition is important but not a difficult two-step decision."
  ],
  "suggestions": [
    "Retain the direct injury findings as a safety item only with explicit foundational acceptance, or test a distinct operative decision after diagnosis.",
    "Replace the redundant scan distractor with a credible alternative at the actual decision stage; do not withhold perforation evidence to make continued observation seem reasonable."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "parked",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Retained the direct CT injury, new guarding and alternative explanations of gas."
  ],
  "cueResolutions": [
    "Removed the transparently redundant second CT and used a neutral care-plan task."
  ],
  "fairnessResolutions": [
    "The replacement drainage foil is still implausible in this immediate defect context. Moving scoring to repair extent would duplicate the separate supported jejunal reconstruction item rather than improve this recognition node."
  ],
  "sourceBoundary": "Existing mapped claims support the retained safety decision. No new source claim was invented to make the failed candidate appear difficult; unresolved quality problems are explicit in parkReason.",
  "parkReason": "One revision attempt still yields a single obvious operative-recognition answer, with no fair close competitor under the stated direct wall defect, gas and guarding. No safety findings were removed to make uncertainty. Excluded from runtime."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1",
  "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "57c44ff232c4f3b84e2855ecd36ab665081e518167604405e2e05d49313c646a",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1\")",
  "before": null
}
```

**Patient and frame:** Caleb Mercer; 55 years; Male. Chief complaint: Lower abdominal pain.

{patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Lower abdominal pain",
    "presentation": "{patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** Repeat CT now shows a short jejunal wall discontinuity and adjacent extraluminal gas. Localized guarding has developed. No thoracic injury or recent abdominal procedure explains the gas.

_No separate exhibit._

**Complete task:** Which abdominal management plan should {patientName} receive after these new findings?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to operative bowel exploration** — KEY

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.explore`.

   Post-answer rationale: The new wall discontinuity is direct evidence of injury, and the changed examination reinforces exploration. The former indirect-scan observation pathway no longer applies.

   Credible error: Key

   Reasonable counterfactual: A direct traumatic bowel-wall injury finding is present.

   Claims: `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `no_test`.

2. **Continue inpatient serial abdominal examinations**

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.observe`.

   Post-answer rationale: Serial assessment was appropriate with indirect findings; continuing it now postpones control of demonstrated bowel injury.

   Credible error: Continue a formerly reasonable plan after its evidence changes.

   Reasonable counterfactual: Assessment stays equivocal and examination improves without a direct injury sign.

   Claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `no_test`.

3. **Obtain another IV-contrast abdominal CT**

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.ct`.

   Post-answer rationale: Another scan adds delay after an adequate study demonstrates a direct operative finding.

   Credible error: Seek further confirmation after uncertainty has resolved.

   Reasonable counterfactual: Current imaging is technically inadequate or equivocal while stable clinical findings permit further imaging.

   Claims: `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`, `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `timing.test.ct`.

**Key:** `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.explore`

**Explanation:** The new wall discontinuity is direct evidence of injury, and the changed examination reinforces exploration. The former indirect-scan observation pathway no longer applies.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — parked v2 attempt; never scored

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2",
  "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "4842c86abcff0a322060b50dbeb6364a6f0ffe7687d88194b91b8b5a3c821ea1",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1",
    "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration",
    "exactDraftSha256": "57c44ff232c4f3b84e2855ecd36ab665081e518167604405e2e05d49313c646a",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Caleb Mercer; 55 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 55,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 55-year-old man assessed after a restrained motor-vehicle collision. A transverse lower abdominal bruise lies beneath the lap belt."
  }
]
```

**Objective:** Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** Repeat CT now shows a short jejunal wall discontinuity and adjacent extraluminal gas. Localized guarding has developed. No thoracic injury or recent abdominal procedure explains the gas.

_No separate exhibit._

**Complete task:** At this recorded reassessment, which abdominal plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to operative bowel exploration** — KEY

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.explore`.

   Post-answer rationale: The new wall discontinuity is direct evidence of injury, and the changed examination reinforces exploration. The former indirect-scan observation pathway no longer applies.

   Credible error: Key

   Reasonable counterfactual: A direct traumatic bowel-wall injury finding is present.

   Claims: `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `no_test`.

2. **Continue inpatient serial abdominal examinations**

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.observe`.

   Post-answer rationale: Serial assessment was appropriate with indirect findings; continuing it now postpones control of demonstrated bowel injury.

   Credible error: Continue a formerly reasonable plan after its evidence changes.

   Reasonable counterfactual: Assessment stays equivocal and examination improves without a direct injury sign.

   Claims: `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.bowel-direct-sign`. Timing profile: `no_test`.

3. **Proceed to image-guided peritoneal drainage**

   ID: `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.r2.drain`.

   Post-answer rationale: A percutaneous catheter cannot repair a demonstrated traumatic bowel-wall defect.

   Credible error: Treat leakage as an isolated drainable collection.

   Reasonable counterfactual: A later localized collection without an unrepaired bowel defect is the remaining source-control problem.

   Claims: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.biloma-drainage`. Timing profile: `timing.test.advanced_diagnostic`.

**Key:** `choice.topic.trauma-initial-abdomen.belt-bowel-wall-defect.explore`

**Explanation:** The new wall discontinuity is direct evidence of injury, and the changed examination reinforces exploration. The former indirect-scan observation pathway no longer applies.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.bowel-direct-sign`, `claim.trauma-initial-abdomen.equivocal-bowel-observe`, `claim.trauma-initial-abdomen.biloma-drainage`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "PARKED_FAILED_DIFFICULTY_OR_COMPETITION_GATE",
  "statisticsException": false,
  "coverTheKey": "All stated danger signs retained. This failed revision is catalogued for accountability, never offered as a scored draft.",
  "sameStageAndCategory": "Compared the revised labels at the recorded management stage; residual competitor weakness is a reason for parking, not an asserted pass.",
  "twoConsequentialSteps": {
    "interpret": "The raw findings are retained in full.",
    "apply": "The application still follows one familiar recognition rule rather than two consequential supported steps."
  },
  "residentDifficulty": {
    "prediction": "easy",
    "basis": "One revision attempt still yields a single obvious operative-recognition answer, with no fair close competitor under the stated direct wall defect, gas and guarding. No safety findings were removed to make uncertainty. Excluded from runtime.",
    "measured": false
  },
  "singleBest": {
    "decidingObservation": "Original urgent/direct findings remain decisive.",
    "counterfactualChange": "Removing the urgent/direct observation could make another route reasonable, but removing it from this case would manufacture difficulty."
  },
  "deletionTest": {
    "actualResolution": "Necessary danger signs were not deleted. The failed option/task repair did not meet the full quality gate.",
    "repairLog": "The replacement drainage foil is still implausible in this immediate defect context. Moving scoring to repair extent would duplicate the separate supported jejunal reconstruction item rather than improve this recognition node."
  },
  "wholeVisibleSequence": "Excluded from active chart-review sequences and all prior-feedback exports.",
  "finiteProfiles": "The archived attempt has the same neutral existing-clinic chart-review frame as its case.",
  "postRepairReview": {
    "independent": false,
    "clinicalApproval": false,
    "authorDisposition": "parked_after_one_revision_attempt"
  }
}
```

Visible-sequence constraint: Excluded from active chart-review sequences and all prior-feedback exports.

**Park reason:** One revision attempt still yields a single obvious operative-recognition answer, with no fair close competitor under the stated direct wall defect, gas and guarding. No safety findings were removed to make uncertainty. Excluded from runtime.

### spleen-arterial-intervention — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Angiography with possible embolization is the defensible best plan: the changing contrast focus indicates ongoing vascular bleeding, while sustained circulation supports an endovascular rather than operative route.",
    "The useful conflict is stability versus a vascular injury needing intervention. Observation and laparotomy represent plausible under- and over-treatment errors. Hemoglobin change is corroborating context, not an exact intervention threshold.",
    "The first-node task is self-contained, and the imaging observations do not merely name the diagnosis. No confident clinical inaccuracy or nonmedical key cue identified."
  ],
  "suggestions": [
    "In future wording, make the observation option explicitly a serial-examination/hemoglobin plan: embolization is itself commonly part of nonoperative splenic management, so 'nonoperative' should not be taught as synonymous with no procedure. The current plan-level contrast remains understandable."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "5627fb6a66d43b6a3a94fc1ffbaf0ecf3cd4b1b085cb87bc2245cb8e5a8c16a7",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `c62d754f96ac9980c06fab282ded45506918d1e2424fd12542bbabff15f2b6c5`. Frozen clinical payload SHA-256: `5627fb6a66d43b6a3a94fc1ffbaf0ecf3cd4b1b085cb87bc2245cb8e5a8c16a7`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
  "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.splenic-arterial-embolization",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "a9fc9b3dd7eff1856a53efd4e558acfb5f2d0cbe9226e32923a0d3b2dcd68877",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1\")",
  "before": null
}
```

**Patient and frame:** Owen Blake; 36 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.spleen-stability-and-rescue.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 36,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity."
  }
]
```

**Objective:** Choose an organ-preserving hemostatic route from active arterial findings and sustained stability.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Circulation | After initial blood: BP 118/70 mmHg; pulse 98/min; sustained on reassessment without further support |
| CT | Splenic laceration; contrast outside a segmental artery enlarges on venous images; hemoperitoneum; no other visceral injury |
| Hemoglobin | 11.0 to 9.4 g/dL during reassessment |

**Complete task:** Which management plan should address {patientName}'s splenic injury now?

**key shown first for review only.** Runtime choices are randomized.

1. **Splenic angiography with possible embolization** — KEY

   ID: `choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.embolize`.

   Post-answer rationale: Sustained stability permits an endovascular approach. An enlarging arterial-phase focus with falling hemoglobin supports treating the vascular injury while preserving splenic tissue.

   Credible error: Key

   Reasonable counterfactual: Stable adult with a demonstrated vascular focus in a capable trauma center.

   Claims: `claim.trauma-initial-abdomen.splenic-embolization`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Timing profile: `timing.test.advanced_diagnostic`.

2. **Monitored nonoperative care with serial assessment**

   ID: `choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.observe`.

   Post-answer rationale: Observation preserves the spleen but the active focus and falling hemoglobin support an angiographic adjunct in this record.

   Credible error: Equate stable circulation with absence of a hemostatic indication.

   Reasonable counterfactual: No vascular focus or high-risk feature is present and the clinical/hemoglobin trajectory remains stable.

   Claims: `claim.trauma-initial-abdomen.splenic-observation`, `claim.trauma-initial-abdomen.splenic-embolization`. Timing profile: `no_test`.

3. **Laparotomy with operative splenic hemorrhage control**

   ID: `choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.operate`.

   Post-answer rationale: Sustained stability permits a spleen-preserving arterial approach rather than immediate operative control.

   Credible error: Treat extravasation as an automatic splenectomy indication.

   Reasonable counterfactual: Instability persists/recurs despite resuscitation or another injury requires laparotomy.

   Claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.splenic-embolization`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.embolize`

**Explanation:** Sustained stability permits an endovascular approach. An enlarging arterial-phase focus with falling hemoglobin supports treating the vascular injury while preserving splenic tissue.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.splenic-embolization`, `claim.trauma-initial-abdomen.splenic-observation`, `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "The task avoids blush or a preserve-spleen goal. Observation also preserves the organ. All plans are concrete; the CT/trajectory rather than a cautious label favors intervention.",
  "sameStageAndCategory": "Hemostatic strategy for an established isolated splenic injury.",
  "twoConsequentialSteps": {
    "interpret": "Interpret the phase-dependent expanding focus while recognizing sustained stabilization.",
    "apply": "Choose an angiographic adjunct rather than observation or immediate laparotomy."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Equate stable circulation with absence of a hemostatic indication.",
    "measured": false,
    "remainingConcern": "The guideline strength difference is recorded; a universal every-blush mandate is not keyed. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "active splenic vascular focus with falling hemoglobin and sustained circulation",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.observe",
    "consequenceOfClosestError": "Observation preserves the spleen but the active focus and falling hemoglobin support an angiographic adjunct in this record.",
    "counterfactualChange": "Remove the focus and substitute a stable low-risk isolated injury course; monitored observation becomes reasonable.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.observe",
    "counterfactualResolution": "No vascular focus or high-risk feature is present and the clinical/hemoglobin trajectory remains stable."
  },
  "deletionTest": {
    "deciderAblation": "Removing active splenic vascular focus with falling hemoglobin and sustained circulation removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration.",
    "actualResolution": "Remove the active vascular focus/falling hemoglobin and low-risk observation becomes reasonable. Replace sustained response with continuing collapse and operative control supersedes an organ-preserving angiographic route.",
    "sentenceAndExhibitJobs": "The phase-dependent focus supplies active vascular injury, while the serial physiology determines the intervention route. No grade or demographic weight is a hidden trigger."
  },
  "wholeVisibleSequence": "First node; its key feedback does not announce the later failure findings.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Hemostatic strategy for an established isolated splenic injury. The guideline strength difference is recorded; a universal every-blush mandate is not keyed.",
    "cueDisposition": "The task avoids blush or a preserve-spleen goal. Observation also preserves the organ. All plans are concrete; the CT/trajectory rather than a cautious label favors intervention.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: First node; its key feedback does not announce the later failure findings.

### spleen-failed-nonoperative — parked

Independent review: `question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [
    "'New intraperitoneal fluid' is imprecise in a case whose earlier CT already showed hemoperitoneum. Specify an observed increase rather than implying that fluid was previously absent."
  ],
  "cues": [],
  "fairness": [
    "Operative hemorrhage control is the defensible best answer for persistent profound shock during transfusion with increasing abdominal distension after embolization. No confident clinical inaccuracy in the management key identified.",
    "The current update is sufficient to solve the node independently, and the treatment sequence is otherwise coherent.",
    "The preceding explanation states that sustained stability permits an endovascular approach. The new update gives the opposite extreme, leaving repeat angiography and CT as weak alternatives. This repeats a familiar unstable-abdominal-bleeding rule rather than creating two substantial inferences."
  ],
  "suggestions": [
    "Clarify the change in known hemoperitoneum.",
    "Accept explicitly as foundational rescue recognition or develop a distinct, source-supported failure-assessment decision. Preserve all current shock information if this emergency-rescue objective is retained."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "parked",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Corrected new fluid to increased fluid, consistent with the earlier documented hemoperitoneum."
  ],
  "cueResolutions": [
    "Preserved all danger signs and used a neutral hospital-record task."
  ],
  "fairnessResolutions": [
    "Current ongoing collapse still fairly favors operative rescue, but does not add an independent consequential inference beyond the initial crash-rescue node."
  ],
  "sourceBoundary": "Existing mapped claims support the retained safety decision. No new source claim was invented to make the failed candidate appear difficult; unresolved quality problems are explicit in parkReason.",
  "parkReason": "One chronology/task revision resolves the actual clarity error. Profound persistent shock still makes this foundational recognition; it shares the initial crash operative-rescue meaning and cannot be counted as another difficult objective. No accepted basic exception exists. Excluded from runtime."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1",
  "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "0d84868f30f3a49f2e7c191bcbbf132ccad1b81176e3119b35ae432c810857f0",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1\")",
  "before": null
}
```

**Patient and frame:** Owen Blake; 36 years; Male. Chief complaint: Pain after collision.

{patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v1",
    "prototypeDemographics": {
      "ageYears": 36,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Pain after collision",
    "presentation": "{patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Recognize operative rescue when recurrent abdominal bleeding outstrips resuscitation after embolization.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** After splenic embolization, abdominal distension increases and bedside ultrasound shows new intraperitoneal fluid. BP falls to 74/40 mmHg with pulse 146/min and remains low during blood administration.

_No separate exhibit._

**Complete task:** Which hemorrhage-control plan should {patientName} receive now?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to operative abdominal hemorrhage control** — KEY

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.operate`.

   Post-answer rationale: Sustained collapse during resuscitation accompanies recurrent abdominal bleeding. Operative rescue takes priority.

   Credible error: Key

   Reasonable counterfactual: Persistent instability with recurrent abdominal bleeding during splenic care.

   Claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

2. **Proceed to repeat splenic catheter angiography**

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.angiography`.

   Post-answer rationale: Repeat embolization can treat a stable localizable recurrence; collapse continuing during blood administration makes operative rescue the priority.

   Credible error: Persist with the earlier route after physiologic eligibility changes.

   Reasonable counterfactual: Sustained stability permits localization of an isolated recurrent splenic arterial focus.

   Claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.splenic-embolization`. Timing profile: `timing.test.advanced_diagnostic`.

3. **Proceed to repeat IV-contrast abdominal CT**

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.ct`.

   Post-answer rationale: The bleeding compartment and failure of resuscitation are apparent. Transport for another scan postpones control.

   Credible error: Require another anatomic scan before acting on failed resuscitation.

   Reasonable counterfactual: Perfusion stabilizes and a suspected complication still needs characterization.

   Claims: `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.splenic-failure`. Timing profile: `timing.test.ct`.

**Key:** `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.operate`

**Explanation:** Sustained collapse during resuscitation accompanies recurrent abdominal bleeding. Operative rescue takes priority.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.splenic-embolization`, `claim.trauma-initial-abdomen.stable-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — parked v2 attempt; never scored

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2",
  "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "3c8dd6736793b4edd8166cd7eaee556e7c742b8eba421c0a8d84acd217b248dc",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1",
    "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
    "exactDraftSha256": "0d84868f30f3a49f2e7c191bcbbf132ccad1b81176e3119b35ae432c810857f0",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Owen Blake; 36 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.spleen-stability-and-rescue.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 36,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 36-year-old man brought to a trauma center after a lateral-impact collision. Left upper abdominal tenderness is present without rigidity."
  }
]
```

**Objective:** Recognize operative rescue when recurrent abdominal bleeding outstrips resuscitation after embolization.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** After splenic embolization, abdominal distension increases and bedside ultrasound shows increased intraperitoneal fluid compared with the earlier study. BP falls to 74/40 mmHg with pulse 146/min and remains low during blood administration.

_No separate exhibit._

**Complete task:** At this recorded deterioration, which hemorrhage-control plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Proceed to operative abdominal hemorrhage control** — KEY

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.operate`.

   Post-answer rationale: Sustained collapse during resuscitation accompanies recurrent abdominal bleeding. Operative rescue takes priority.

   Credible error: Key

   Reasonable counterfactual: Persistent instability with recurrent abdominal bleeding during splenic care.

   Claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

2. **Proceed to repeat splenic catheter angiography**

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.angiography`.

   Post-answer rationale: Repeat embolization can treat a stable localizable recurrence; collapse continuing during blood administration makes operative rescue the priority.

   Credible error: Persist with the earlier route after physiologic eligibility changes.

   Reasonable counterfactual: Sustained stability permits localization of an isolated recurrent splenic arterial focus.

   Claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.splenic-embolization`. Timing profile: `timing.test.advanced_diagnostic`.

3. **Proceed to repeat IV-contrast abdominal CT**

   ID: `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.ct`.

   Post-answer rationale: The bleeding compartment and failure of resuscitation are apparent. Transport for another scan postpones control.

   Credible error: Require another anatomic scan before acting on failed resuscitation.

   Reasonable counterfactual: Perfusion stabilizes and a suspected complication still needs characterization.

   Claims: `claim.trauma-initial-abdomen.stable-ct`, `claim.trauma-initial-abdomen.splenic-failure`. Timing profile: `timing.test.ct`.

**Key:** `choice.topic.trauma-initial-abdomen.spleen-failed-nonoperative.operate`

**Explanation:** Sustained collapse during resuscitation accompanies recurrent abdominal bleeding. Operative rescue takes priority.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.splenic-failure`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.splenic-embolization`, `claim.trauma-initial-abdomen.stable-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "PARKED_FAILED_DIFFICULTY_OR_COMPETITION_GATE",
  "statisticsException": false,
  "coverTheKey": "All stated danger signs retained. This failed revision is catalogued for accountability, never offered as a scored draft.",
  "sameStageAndCategory": "Compared the revised labels at the recorded management stage; residual competitor weakness is a reason for parking, not an asserted pass.",
  "twoConsequentialSteps": {
    "interpret": "The raw findings are retained in full.",
    "apply": "The application still follows one familiar recognition rule rather than two consequential supported steps."
  },
  "residentDifficulty": {
    "prediction": "easy",
    "basis": "One chronology/task revision resolves the actual clarity error. Profound persistent shock still makes this foundational recognition; it shares the initial crash operative-rescue meaning and cannot be counted as another difficult objective. No accepted basic exception exists. Excluded from runtime.",
    "measured": false
  },
  "singleBest": {
    "decidingObservation": "Original urgent/direct findings remain decisive.",
    "counterfactualChange": "Removing the urgent/direct observation could make another route reasonable, but removing it from this case would manufacture difficulty."
  },
  "deletionTest": {
    "actualResolution": "Necessary danger signs were not deleted. The failed option/task repair did not meet the full quality gate.",
    "repairLog": "Current ongoing collapse still fairly favors operative rescue, but does not add an independent consequential inference beyond the initial crash-rescue node."
  },
  "wholeVisibleSequence": "Excluded from active chart-review sequences and all prior-feedback exports.",
  "finiteProfiles": "The archived attempt has the same neutral existing-clinic chart-review frame as its case.",
  "postRepairReview": {
    "independent": false,
    "clinicalApproval": false,
    "authorDisposition": "parked_after_one_revision_attempt"
  }
}
```

Visible-sequence constraint: Excluded from active chart-review sequences and all prior-feedback exports.

**Park reason:** One chronology/task revision resolves the actual clarity error. Profound persistent shock still makes this foundational recognition; it shares the initial crash operative-rescue meaning and cannot be counted as another difficult objective. No accepted basic exception exists. Excluded from runtime.

### liver-grade-versus-physiology — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Monitored nonoperative care is the best supplied plan. The learner must resist treating anatomic grade as an operative indication, then distinguish observation from embolization in the absence of an active vascular target or deteriorating course.",
    "The high-grade injury supplies a credible competing concern; the negative vascular and peritoneal findings are decision-critical. 'Empiric embolization' accurately distinguishes that proposed plan, although it makes the vascular distractor less attractive.",
    "The first-node record is self-contained. No confident clinical inaccuracy identified. Observation must retain appropriate trauma monitoring and rescue capability; the text does not authorize outpatient care."
  ],
  "suggestions": [
    "Preserve the monitored setting and the grade-versus-physiology distinction. Do not turn the explanation into a claim that grade never affects monitoring or escalation planning."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "84ae07a763540d625f00f3f9d46d8627764f91043a068ef2a360ae320e96cbe3",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `daeee851a00f49e1d1ac62bb74306b6e7a6289cd85835c38f48aee803203815d`. Frozen clinical payload SHA-256: `84ae07a763540d625f00f3f9d46d8627764f91043a068ef2a360ae320e96cbe3`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
  "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "157e87e958d587f992aa6cebf6875a460131e2514cb76ff4d72bec9b8748b95b",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1\")",
  "before": null
}
```

**Patient and frame:** Maya Grant; 42 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma."
  }
]
```

**Objective:** Choose observation for a stable isolated high-grade hepatic injury without an operative indication.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | AAST grade IV liver laceration; no arterial extravasation or additional visceral injury |
| Serial record | BP 124/76 mmHg; pulse 88/min; no blood/vasopressor requirement; hemoglobin unchanged |
| Examination | Right upper quadrant tenderness without guarding or rebound |

**Complete task:** Which management plan should {patientName} receive for this liver injury?

**key shown first for review only.** Runtime choices are randomized.

1. **Monitored nonoperative hepatic care** — KEY

   ID: `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe`.

   Post-answer rationale: Grade is substantial but physiology, serial examination and absence of a vascular focus support monitored nonoperative care. Grade alone does not require laparotomy.

   Credible error: Key

   Reasonable counterfactual: Stable isolated injury without peritonitis or another operative indication.

   Claims: `claim.trauma-initial-abdomen.liver-nonoperative`. Timing profile: `no_test`.

2. **Hepatic angiography with empiric embolization**

   ID: `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography`.

   Post-answer rationale: There is no arterial target or continued blood requirement. Anatomic grade alone does not establish a need for empiric embolization.

   Credible error: Treat high grade as proof of active arterial hemorrhage.

   Reasonable counterfactual: Active arterial extravasation appears while circulation remains sustained.

   Claims: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`. Timing profile: `timing.test.advanced_diagnostic`.

3. **Laparotomy with operative hepatic hemorrhage control**

   ID: `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.laparotomy`.

   Post-answer rationale: Routine laparotomy adds intervention when this stable isolated injury has no current operative indication.

   Credible error: Use grade in place of physiology and associated-injury assessment.

   Reasonable counterfactual: Hemorrhage produces ongoing instability or another injury requires surgery.

   Claims: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe`

**Explanation:** Grade is substantial but physiology, serial examination and absence of a vascular focus support monitored nonoperative care. Grade alone does not require laparotomy.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.liver-nonoperative`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.hepatic-devascularized-complication`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "Known grade is an appropriate datum for management, not a diagnosis cue. Three plans are parallel; no availability permission makes observation the key.",
  "sameStageAndCategory": "Current care strategy for an already characterized hepatic injury.",
  "twoConsequentialSteps": {
    "interpret": "Read the grade alongside sustained circulation, serial examination and vascular findings.",
    "apply": "Choose monitoring rather than intervene on grade alone."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Treat high grade as proof of active arterial hemorrhage.",
    "measured": false,
    "remainingConcern": "Known grade is appropriate management data; difficulty depends on resisting anatomy-only escalation. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "sustained stability without an arterial focus or another operative injury",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
    "consequenceOfClosestError": "There is no arterial target or continued blood requirement. Anatomic grade alone does not establish a need for empiric embolization.",
    "counterfactualChange": "Replace absent extravasation with active hepatic arterial extravasation while circulation remains stable; angiography becomes supported.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
    "counterfactualResolution": "Active arterial extravasation appears while circulation remains sustained."
  },
  "deletionTest": {
    "deciderAblation": "Removing sustained stability without an arterial focus or another operative injury removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed injury as an unnecessary key-only task-word echo.",
    "actualResolution": "Delete the serial/vascular observations and grade IV alone cannot choose among monitoring, arterial intervention and surgery. A current arterial focus changes the key to angiography despite the same grade.",
    "sentenceAndExhibitJobs": "Grade supplies the tempting anatomic severity, while the negative vascular finding and actual sustained course govern whether intervention is indicated."
  },
  "wholeVisibleSequence": "First node; no delayed vascular or biliary findings are visible.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Current care strategy for an already characterized hepatic injury. Known grade is appropriate management data; difficulty depends on resisting anatomy-only escalation.",
    "cueDisposition": "Known grade is an appropriate datum for management, not a diagnosis cue. Three plans are parallel; no availability permission makes observation the key.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: First node; no delayed vascular or biliary findings are visible.

### liver-delayed-arterial-bleeding — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Selective hepatic arterial embolization is the best answer. Papillary bleeding and a communicating arterial contrast sac locate the bleeding pathway; maintained circulation then supports endovascular control rather than laparotomy.",
    "ERCP is a credible wrong-target response to a biliary presentation, but a biliary stent does not treat the described arterial source. This requires interpretation plus treatment selection.",
    "The update and exhibit identify the prior hepatic injury sufficiently for standalone use. Progression from nonoperative liver care is coherent; preceding feedback does not reveal this complication's management.",
    "The arterial anatomy is necessary evidence, not an unfair wording cue merely because the correct procedure targets that vessel. No confident clinical inaccuracy identified."
  ],
  "suggestions": [
    "Preserve the papillary finding and vascular-phase relationship, and keep the diagnostic label out of the pre-answer display."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "e94b3dec45aba922a6b5314a8c780f780805c2685de6a6789f0e265e6ed8e4b5",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `04bbb33a9d060c0f4c54220ca54ab83f0414bb2a4cd8166cdab3c5df06f07902`. Frozen clinical payload SHA-256: `e94b3dec45aba922a6b5314a8c780f780805c2685de6a6789f0e265e6ed8e4b5`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
  "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "c959adf12ffe5dd11daa9705b8a6a6adb35c79f86bd2d9a29ec9f60704030c79",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1\")",
  "before": null
}
```

**Patient and frame:** Maya Grant; 42 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma."
  }
]
```

**Objective:** Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** During admission, melena develops and hemoglobin falls. BP is 116/70 mmHg without support. Upper endoscopy shows blood emerging at the major papilla and no mucosal bleeding lesion.

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | A rounded contrast-filled sac within the prior liver injury communicates with a hepatic arterial branch and follows arterial blood-pool enhancement |

**Complete task:** Which procedure should control {patientName}'s current bleeding?

**key shown first for review only.** Runtime choices are randomized.

1. **Hepatic angiography with selective embolization** — KEY

   ID: `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize`.

   Post-answer rationale: Papillary blood after liver trauma plus an arterial-connected contrast sac identifies a hepatic arterial bleeding pathway. Angiographic embolization addresses that source.

   Credible error: Key

   Reasonable counterfactual: Post-traumatic hepatic arterial lesion without severe circulatory compromise.

   Claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Timing profile: `timing.test.advanced_diagnostic`.

2. **Laparotomy with hepatic hemorrhage control**

   ID: `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate`.

   Post-answer rationale: The patient has a stable, localizable arterial target. An endovascular approach can address it before an operative rescue is needed.

   Credible error: Escalate a delayed arterial complication directly to surgery despite sustained stability.

   Reasonable counterfactual: Ongoing hemorrhage causes instability despite resuscitation or minimally invasive control fails.

   Claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`. Timing profile: `no_test`.

3. **ERCP with transpapillary biliary stenting**

   ID: `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent`.

   Post-answer rationale: A biliary stent can address persistent bile leakage but does not control the demonstrated hepatic arterial source.

   Credible error: Confuse the route by which blood enters the bowel with the bleeding source to treat.

   Reasonable counterfactual: Persistent biliary leakage remains after appropriate collection/source assessment, without an untreated arterial bleeding lesion.

   Claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.bile-leak-adjunct`. Timing profile: `timing.test.therapeutic_ercp`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize`

**Explanation:** Papillary blood after liver trauma plus an arterial-connected contrast sac identifies a hepatic arterial bleeding pathway. Angiographic embolization addresses that source.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.liver-pseudoaneurysm`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.liver-arterial-bleeding`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "No hemobilia/pseudoaneurysm label or full named triad is provided. Each option is a procedural treatment. The endoscopy is an acquired localized observation, not a generic negative workup.",
  "sameStageAndCategory": "A procedural hemostasis decision after localization, with no repeat diagnostic task.",
  "twoConsequentialSteps": {
    "interpret": "Integrate papillary blood with a phase-matched arterial sac rather than assume mucosal or duct-leak pathology.",
    "apply": "Direct hemostasis to the artery while the patient remains stable."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Escalate a delayed arterial complication directly to surgery despite sustained stability.",
    "measured": false,
    "remainingConcern": "The short hepatic-arterial phrase is necessary anatomy; both operation and embolization remain liver-directed plans. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "papillary blood and an arterial-connected contrast sac with sustained circulation",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
    "consequenceOfClosestError": "The patient has a stable, localizable arterial target. An endovascular approach can address it before an operative rescue is needed.",
    "counterfactualChange": "Replace sustained stability with collapse during resuscitation; operative hemorrhage control becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
    "counterfactualResolution": "Ongoing hemorrhage causes instability despite resuscitation or minimally invasive control fails."
  },
  "deletionTest": {
    "deciderAblation": "Removing papillary blood and an arterial-connected contrast sac with sustained circulation removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration.",
    "actualResolution": "Delete papillary blood or the contained arterial sac and the proposed mechanism is less secure. Replace sustained circulation with collapse and the immediate hemostatic route changes to surgery.",
    "sentenceAndExhibitJobs": "The endoscopic localization separates blood entry from source; the arterial sac identifies that source; current physiology chooses the supported route."
  },
  "wholeVisibleSequence": "Prior observation feedback does not disclose this complication. The CT and endoscopy findings are newly acquired.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; A procedural hemostasis decision after localization, with no repeat diagnostic task. The short hepatic-arterial phrase is necessary anatomy; both operation and embolization remain liver-directed plans.",
    "cueDisposition": "The shared hepatic-arterial phrase is necessary vessel anatomy, not an injury label or eligibility conclusion. Both endovascular and operative hemostasis address liver bleeding; current sustained physiology plus a contained arterial sac and papillary blood favor embolization. Earlier embolization wording refers to an absent arterial target, not this new complication.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: Prior observation feedback does not disclose this complication. The CT and endoscopy findings are newly acquired.

### liver-infected-bile-collection — revised

Independent review: `question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [
    "Current circulatory status and abdominal examination are absent. Earlier vascular hemostasis does not establish the patient's current condition after fever and a new infected collection."
  ],
  "cues": [
    {
      "phrase": "an accessible rim-enhancing collection",
      "why": "'Accessible' is an author-supplied feasibility conclusion favoring the percutaneous option, rather than a concrete anatomic description. Combined with a localized infected collection and no diffuse fluid, it largely supplies the drainage rationale."
    }
  ],
  "fairness": [
    "Percutaneous catheter drainage is the likely best initial procedure for the described localized infected collection. The case does not establish that drainage is clinically wrong; ERCP may be complementary for a persisting leak rather than a substitute for draining the infected cavity.",
    "The diagnosis is effectively supplied by bile-stained fluid with bacterial growth. The remaining initial-drainage rule has little competing reasoning in this option set.",
    "The complication follows vascular control coherently and is understandable independently, apart from the missing current physiologic/examination context. A positive culture implies an interval after aspiration, which could be made clearer."
  ],
  "suggestions": [
    "Supply a concise current examination and support trajectory so drainage versus operative source control can be fairly ranked.",
    "Use a concrete drainage-window observation if accessibility determines the choice. For a harder item, test a real remaining source-control versus persistent-leak decision with the needed duct/collection findings, rather than simply naming an infected drainable cavity."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Current BP/support trajectory and focal-versus-diffuse examination are supplied. Culture belongs to the earlier drained sample rather than an instantaneous new aspiration."
  ],
  "cueResolutions": [
    "Accessible is replaced with a concrete CT path and catheter injection observations.",
    "Removed the irrelevant prior image-guided route label; current access is assessed from raw geometry rather than repeating the keyed procedure name."
  ],
  "fairnessResolutions": [
    "Added current circulation/examination, clarified that culture is from an earlier aspiration and replaced the generic infected-accessible-cavity rule with interpretation of a failed drainage path. No unsupported catheter exchange technique or output threshold is prescribed."
  ],
  "sourceBoundary": "WSES liver 2020 and EAST liver 2012 support drainage of symptomatic/infected bile collections. The catheter geometry is fictional and the drainage priority is an application of that supported principle.",
  "authorDifficultyDisposition": "Retain as a fair moderate two-step candidate after resolving the reported clarity/fairness defects; do not inflate to hard or remove safety observations. New exact version still requires independent review."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1",
  "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "d03d3304319d9862d87bc1e877b6e12124ab67d998d6c0e3665f611332332c4b",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1\")",
  "before": null
}
```

**Patient and frame:** Maya Grant; 42 years; Female. Chief complaint: Right upper abdominal pain.

{patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.liver-complication-chain.v1",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Right upper abdominal pain",
    "presentation": "{patientName} is a 42-year-old woman assessed after blunt abdominal trauma.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Prioritize drainage of a localized infected traumatic bile collection.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** After vascular hemostasis, fever and localized right upper abdominal pain develop. CT shows an accessible rim-enhancing collection beside the liver, without diffuse peritoneal fluid. Aspiration yields bile-stained fluid with bacterial growth.

_No separate exhibit._

**Complete task:** Which procedure should provide initial source control for {patientName} now?

**key shown first for review only.** Runtime choices are randomized.

1. **Image-guided percutaneous catheter drainage** — KEY

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.drain`.

   Post-answer rationale: This localized infected bile collection needs drainage. A persistent duct leak may require an additional later intervention.

   Credible error: Key

   Reasonable counterfactual: Accessible infected/symptomatic traumatic bile collection without diffuse peritonitis.

   Claims: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`. Timing profile: `timing.test.advanced_diagnostic`.

2. **ERCP with transpapillary biliary stent placement**

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.stent`.

   Post-answer rationale: Duct decompression may help a leak, but it does not evacuate this undrained infected collection.

   Credible error: Treat bile leakage while leaving its infected collection undrained.

   Reasonable counterfactual: The collection is drained and a persistent communicating bile leak remains.

   Claims: `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.biloma-drainage`. Timing profile: `timing.test.therapeutic_ercp`.

3. **Laparoscopic peritoneal washout and drainage**

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.washout`.

   Post-answer rationale: The collection is localized and accessible, without diffuse bile peritonitis or failed percutaneous source control.

   Credible error: Escalate a localized drainable complication to generalized washout.

   Reasonable counterfactual: Diffuse bile peritonitis or failed minimally invasive source control requires surgery.

   Claims: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.drain`

**Explanation:** This localized infected bile collection needs drainage. A persistent duct leak may require an additional later intervention.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
  "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "031acad161255dae2c5f300063f3273cd3d8442d718b2869e6fcb3e6b290b946",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1",
    "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage",
    "exactDraftSha256": "d03d3304319d9862d87bc1e877b6e12124ab67d998d6c0e3665f611332332c4b",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Maya Grant; 42 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 42,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 42-year-old woman assessed after blunt abdominal trauma."
  }
]
```

**Objective:** Prioritize drainage of a localized infected traumatic bile collection.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** The outside record shows that a catheter initially drained a post-traumatic bile-containing collection; culture from that earlier sample later grew bacteria. Fever and pain improved. On subsequent assessments, drain output falls and fever with focal right upper abdominal tenderness returns. BP remains 118/72 mmHg without vasopressor or new blood support; there is no diffuse guarding or rebound.

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | Fluid has reaccumulated deep to the abdominal wall. The catheter curl lies in abdominal-wall tissue rather than inside the fluid. The cavity abuts the lateral wall along a path without intervening bowel or pleura; there is no diffuse intraperitoneal fluid. |
| Catheter injection record | Injected contrast fills the tract and returns at the skin; the deep fluid cavity does not opacify. |

**Complete task:** At this recorded recurrence, which initial source-control procedure should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Image-guided placement of a replacement collection drain** — KEY

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain`.

   Post-answer rationale: The catheter and injection records show that the present tube no longer communicates with the recurrent collection. Re-establishing direct drainage addresses current source control; a persistent duct leak can be treated separately if it remains.

   Credible error: Key

   Reasonable counterfactual: A recurrent symptomatic/infected collection lacks effective catheter drainage and a percutaneous path is demonstrated.

   Claims: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection`. Timing profile: `timing.test.advanced_diagnostic`.

2. **ERCP with transpapillary biliary stent placement**

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.stent`.

   Post-answer rationale: Duct decompression can be an adjunct for an ongoing leak, but it does not evacuate the recurrent collection while the existing catheter lies outside it.

   Credible error: Attribute recurrent bile-related symptoms to duct pressure before checking whether the collection is actually drained.

   Reasonable counterfactual: The collection is effectively drained and persistent communicating bile leakage remains the unresolved problem.

   Claims: `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.biloma-drainage`. Timing profile: `timing.test.therapeutic_ercp`.

3. **Laparoscopic peritoneal washout and drainage**

   ID: `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.washout`.

   Post-answer rationale: The present record shows a localized recurrent collection with a percutaneous path and no current diffuse peritonitis or circulatory deterioration. Operative washout is not the initial targeted correction.

   Credible error: Escalate recurrent fever to generalized operative source control despite the demonstrated drainage problem.

   Reasonable counterfactual: Diffuse bile peritonitis, deterioration or failure of appropriate minimally invasive control requires surgery.

   Claims: `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.biloma-drainage`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain`

**Explanation:** The catheter and injection records show that the present tube no longer communicates with the recurrent collection. Re-establishing direct drainage addresses current source control; a persistent duct leak can be treated separately if it remains.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.biloma-drainage`, `claim.trauma-initial-abdomen.bile-leak-adjunct`, `claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Removed accessible as an eligibility conclusion. Actual catheter location, contrast distribution and a concrete path replace the feasibility assertion. Options name procedures; none announces that the catheter is malpositioned.",
  "sameStageAndCategory": "All options are initial procedural responses to the current recurrent source-control problem; antibiotic care and monitoring are shared background.",
  "twoConsequentialSteps": {
    "interpret": "Integrate falling output, recurrent symptoms, the catheter curl outside the fluid and injection failing to enter the cavity; low output is not proof that the leak or collection has resolved.",
    "apply": "Re-establish direct collection drainage before choosing duct decompression or operative washout."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "ERCP is credible because earlier feedback discussed biliary stenting, but the newly demonstrated uncontrolled compartment changes the immediate priority.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.stent",
    "decidingObservation": "The current catheter does not communicate with the recurrent localized collection",
    "consequenceOfClosestError": "Duct decompression can be an adjunct for an ongoing leak, but it does not evacuate the recurrent collection while the existing catheter lies outside it.",
    "counterfactualChange": "If the catheter instead remains within a collapsed adequately drained cavity and a documented communicating bile leak persists, ERCP becomes a reasonable next adjunct.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.stent",
    "counterfactualResolution": "The collection is effectively drained and persistent communicating bile leakage remains the unresolved problem."
  },
  "deletionTest": {
    "actualResolution": "Removing the catheter-position and injection records leaves recurrent symptoms without proof of failed collection drainage; an ERCP-versus-drain strategy would be underdetermined. Replacing them with effective drainage changes the priority.",
    "sentenceAndExhibitJobs": "Current support and examination repair the missing acuity boundary. Earlier sample/culture chronology is explicit. Catheter/cavity geometry establishes the actual control failure, and the window observation distinguishes percutaneous treatment from an unsupported feasibility promise.",
    "repairLog": "Added current circulation/examination, clarified that culture is from an earlier aspiration and replaced the generic infected-accessible-cavity rule with interpretation of a failed drainage path. No unsupported catheter exchange technique or output threshold is prescribed."
  },
  "wholeVisibleSequence": "The two prior PASS items are unchanged. Their ERCP feedback is a deliberate credible anchor here; it does not provide the new drainage-location inference or the correct initial action.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All options are initial procedural responses to the current recurrent source-control problem; antibiotic care and monitoring are shared background.",
    "cueDisposition": "Removed accessible as an eligibility conclusion. Actual catheter location, contrast distribution and a concrete path replace the feasibility assertion. Options name procedures; none announces that the catheter is malpositioned."
  }
}
```

Visible-sequence constraint: The two prior PASS items are unchanged. Their ERCP feedback is a deliberate credible anchor here; it does not provide the new drainage-location inference or the correct initial action.

### pelvis-packing-after-angio — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Preperitoneal packing is the defensible next choice after maintained mechanical stabilization and completed arterial treatment with ongoing shock. The learner must infer a residual pelvic bleeding compartment and select its control method.",
    "A negative completion angiogram does not prove that every possible arterial source is excluded. The explanation appropriately says bleeding 'can come from' venous or bony sources rather than claiming certainty.",
    "Repeat arterial treatment is a plausible competing response to continuing hemorrhage, but no new arterial target is supplied; intraperitoneal exploration does not target the documented compartment. The findings support ranking the plans without inventing a universal packing-before-angiography rule.",
    "The first-node exhibit supplies the treatment chronology and is self-contained. No confident clinical inaccuracy identified; exact trauma-protocol acceptance still requires clinician review."
  ],
  "suggestions": [
    "Preserve the completed arterial treatment and mechanical stabilization facts. Do not generalize this selected rescue scenario into a universal initial pelvic-hemorrhage sequence."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "097c55596b69c21f626a768e032c20f43ce5b5c412885fcb3401af0f56b2eafe",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `ab77f02ea3af72af3a28bfed7f81695a13125089c7ed8f3dafb8b8075a23ff34`. Frozen clinical payload SHA-256: `097c55596b69c21f626a768e032c20f43ce5b5c412885fcb3401af0f56b2eafe`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
  "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "1acb847878c69feb53bcb3317caf7ba234ace2dd4de142ae68768f394fa9dde4",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1\")",
  "before": null
}
```

**Patient and frame:** Dylan Shaw; 48 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 48,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury."
  }
]
```

**Objective:** Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Earlier CT | During initial stabilization: large pelvic retroperitoneal hematoma; no intraperitoneal injury |
| Treatment | Binder and temporary stabilization maintained; internal iliac arterial focus embolized |
| Completion | Selective pelvic arterial runs show no further extravasation |
| Current state | BP 82/48 mmHg during blood administration; repeat FAST without intraperitoneal fluid; no external or thoracic source identified |

**Complete task:** Which procedure should next address {patientName}'s continuing pelvic hemorrhage?

**key shown first for review only.** Runtime choices are randomized.

1. **Preperitoneal pelvic packing** — KEY

   ID: `choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing`.

   Post-answer rationale: Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.

   Credible error: Key

   Reasonable counterfactual: Persistent bleeding after arterial treatment, with stabilization and no residual arterial target.

   Claims: `claim.trauma-initial-abdomen.pelvic-packing-after-angio`. Timing profile: `no_test`.

2. **Repeat pelvic arterial embolization**

   ID: `choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize`.

   Post-answer rationale: The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated.

   Credible error: Assume every persistent pelvic hemorrhage is arterial.

   Reasonable counterfactual: A new/residual arterial focus is shown after other compartments are addressed.

   Claims: `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.pelvic-packing-after-angio`. Timing profile: `timing.test.advanced_diagnostic`.

3. **Intraperitoneal abdominal exploration**

   ID: `choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy`.

   Post-answer rationale: The known collection is retroperitoneal and the completed assessment shows no intraperitoneal operative source.

   Credible error: Choose the wrong compartment despite completed source assessment.

   Reasonable counterfactual: An associated intraperitoneal hemorrhage or bowel injury needs operative control.

   Claims: `claim.trauma-initial-abdomen.pelvic-fast-limitation`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing`

**Explanation:** Persistent bleeding despite stabilization and completed arterial treatment can come from venous or bony sources. Packing addresses the residual compartment.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.pelvic-packing-after-angio`, `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.pelvic-fast-limitation`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "The context never says venous bleeding or IR unavailable. Stabilization is shared background care. The completed treatment record, not permission, resolves three immediate control procedures.",
  "sameStageAndCategory": "Next hemorrhage-control procedure after stabilization and an arterial procedure have occurred.",
  "twoConsequentialSteps": {
    "interpret": "Interpret the arterial completion survey and continuing shock as possible nonarterial pelvic bleeding.",
    "apply": "Control the residual retroperitoneal compartment."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Assume every persistent pelvic hemorrhage is arterial.",
    "measured": false,
    "remainingConcern": "Only this post-treatment sequence is scored; initial packing-versus-angio policy is unkeyed. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "persistent shock after completed arterial treatment without a residual target",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
    "consequenceOfClosestError": "The completion survey shows no residual target while shock continues. Assuming another artery leaves nonarterial bleeding untreated.",
    "counterfactualChange": "Replace the negative survey with persistent arterial extravasation after packing; repeat embolization becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
    "counterfactualResolution": "A new/residual arterial focus is shown after other compartments are addressed."
  },
  "deletionTest": {
    "deciderAblation": "Removing persistent shock after completed arterial treatment without a residual target removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed an inconsistent leading verb so procedural wording cannot assemble a convergence key. Author repair: Retained the real arterial competitor; parallel procedure nouns avoid a verb-based key pattern. Author repair: Retained the distinct competing operative compartment as a procedure noun.",
    "actualResolution": "Delete the arterial completion record and repeat embolization remains an unresolved possibility. Delete current source assessment and an associated intraperitoneal source could change control.",
    "sentenceAndExhibitJobs": "The known retroperitoneal compartment, completed arterial survey and persistent resuscitation need must be interpreted together. Negative FAST is explicitly not proof of absent pelvic bleeding."
  },
  "wholeVisibleSequence": "First node. Prior embolization is history; the future focus is not visible.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Next hemorrhage-control procedure after stabilization and an arterial procedure have occurred. Only this post-treatment sequence is scored; initial packing-versus-angio policy is unkeyed.",
    "cueDisposition": "Necessary completed source assessment separates retroperitoneal pelvic bleeding from an abdominal operative source; negative FAST alone is explicitly insufficient. It narrows one wrong-compartment plan, but the closest arterial-versus-nonarterial control decision remains and is resolved by the completed arterial survey and continuing shock.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: First node. Prior embolization is history; the future focus is not visible.

### pelvis-recurrent-arterial-focus — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Pelvic angiography with embolization is the best supplied procedure. Expansion of an arterial-connected pool identifies an active arterial component, while maintained circulation during support allows targeted control.",
    "The meaningful competing error is to repeat the previously effective packing despite new evidence of a different bleeding component. The current update changes the correct action rather than merely repeating the prior task.",
    "This follows packing coherently and carries enough current treatment, imaging and circulation information to stand alone. Earlier feedback about venous/bony bleeding does not settle the new arterial decision.",
    "No confident clinical inaccuracy identified. 'BP remains' supports a sustained observation, but this must not be taught as stability determined by a single pressure irrespective of support trajectory."
  ],
  "suggestions": [
    "If further clinical detail is added, specify the support trend rather than inventing an exact blood-pressure eligibility cutoff. Keep the current arterial imaging discriminator."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "4e9637501c13c73de4255b2b55969bd8b571fae928ac97904a358b21b2c6e6b7",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `6c79ea71c090b4f6b739ace7a823dd11d0c66df568839ce1f9241fbb1fa8b6db`. Frozen clinical payload SHA-256: `4e9637501c13c73de4255b2b55969bd8b571fae928ac97904a358b21b2c6e6b7`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
  "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "45d48b3cacba3a0488cf0b70747902f7c109e0262ad18dfb6fa0ba29ae8fcad6",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1\")",
  "before": null
}
```

**Patient and frame:** Dylan Shaw; 48 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 48,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 48-year-old man treated after pelvic crush injury."
  }
]
```

**Objective:** Use a newly demonstrated arterial target after packing to choose repeat targeted control.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** After packing, circulation initially improves. Hemoglobin later falls and blood requirements resume. BP remains 112/66 mmHg during support. New multiphase CT is obtained.

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | A focal pool communicates with a pelvic arterial branch and expands on venous images; packing remains positioned; no new intraperitoneal abnormality |

**Complete task:** Which procedure should address {patientName}'s current pelvic bleeding?

**key shown first for review only.** Runtime choices are randomized.

1. **Pelvic angiography with embolization** — KEY

   ID: `choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize`.

   Post-answer rationale: An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.

   Credible error: Key

   Reasonable counterfactual: Arterial target with sustained circulation after other sources are addressed.

   Claims: `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Timing profile: `timing.test.advanced_diagnostic`.

2. **Repeat preperitoneal pelvic packing**

   ID: `choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack`.

   Post-answer rationale: Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.

   Credible error: Continue the prior strategy after a specific source appears.

   Reasonable counterfactual: Ongoing pelvic bleeding has no arterial target after adequate assessment, or packing has failed mechanically.

   Claims: `claim.trauma-initial-abdomen.pelvic-packing-after-angio`, `claim.trauma-initial-abdomen.pelvic-arterial-embolization`. Timing profile: `no_test`.

3. **Proceed to intraperitoneal abdominal exploration**

   ID: `choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy`.

   Post-answer rationale: The current source is a pelvic artery with no new intraperitoneal injury. A different compartment is not the targeted response.

   Credible error: Choose abdominal exploration despite stable localized extraperitoneal vascular bleeding.

   Reasonable counterfactual: New intraperitoneal hemorrhage or bowel injury requires operative treatment.

   Claims: `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.unstable-positive-fast`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize`

**Explanation:** An expanding arterial-connected focus identifies recurrent or residual arterial bleeding after packing. Sustained circulation permits targeted angiographic control.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.pelvic-arterial-embolization`, `claim.trauma-initial-abdomen.pelvic-packing-after-angio`, `claim.trauma-initial-abdomen.unstable-positive-fast`, `claim.trauma-initial-abdomen.contrast-phase-interpretation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "Raw phase-dependent expansion supplies the arterial inference. Labels are parallel procedures. Prior care gives legitimate scaffold, but the new target and response determine action.",
  "sameStageAndCategory": "Repeat hemorrhage-control procedure after a newly acquired target.",
  "twoConsequentialSteps": {
    "interpret": "Distinguish an expanding arterial-connected focus from pre-existing hematoma.",
    "apply": "Change intervention based on the new target and sustained response."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Continue the prior strategy after a specific source appears.",
    "measured": false,
    "remainingConcern": "Previous arterial treatment gives scaffold, but it does not prove the present source is arterial. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "new expanding arterial-connected pelvic contrast focus after packing",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
    "consequenceOfClosestError": "Repacking can treat nonarterial bleeding, but the new study localizes an arterial target not controlled by packing.",
    "counterfactualChange": "Remove the focus and substitute nonarterial bleeding after a negative arterial survey; repacking becomes reasonable.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
    "counterfactualResolution": "Ongoing pelvic bleeding has no arterial target after adequate assessment, or packing has failed mechanically."
  },
  "deletionTest": {
    "deciderAblation": "Removing new expanding arterial-connected pelvic contrast focus after packing removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed selective as an unnecessary repeated phrase from the old completion record.",
    "actualResolution": "Delete the new CT focus and continued/repeat packing could remain the plausible strategy. Delete the current sustained response and transport/endovascular readiness is not established.",
    "sentenceAndExhibitJobs": "Expansion across phases distinguishes a new active focus from residual hematoma; current response permits a targeted route."
  },
  "wholeVisibleSequence": "Distinct source-control decision after a newly acquired study. Prior arterial treatment provides some scaffold; independent review must assess remaining difficulty.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Repeat hemorrhage-control procedure after a newly acquired target. Previous arterial treatment gives scaffold, but it does not prove the present source is arterial.",
    "cueDisposition": "Prior negative intraperitoneal findings retain chronology, and the current scan again localizes the new target. They do not choose packing versus angiography; phase-dependent expansion and current stability resolve that remaining competition. A new intraperitoneal finding would change the pathway.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: Distinct source-control decision after a newly acquired study. Prior arterial treatment provides some scaffold; independent review must assess remaining difficulty.

### bladder-acquisition — revised

Independent review: `question.topic.trauma-initial-abdomen.bladder-acquisition.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [
    {
      "phrase": "no retrograde instillation",
      "why": "This named omission directly previews the distinguishing acquisition in 'Retrograde CT cystography with distension'. The urethrography option also uses 'Retrograde', so this is not a unique-word match; the shortcut comes from the whole acquisition description plus the separately reassuring urethral record."
    }
  ],
  "fairness": [
    "Retrograde CT cystography is the best listed study for pelvic fracture with gross hematuria after an ordinary scan that did not adequately distend the bladder. No confident clinical inaccuracy identified.",
    "The underlying construct has two useful steps: identify the bladder-injury concern and recognize that excreted contrast does not provide an adequate cystogram. The wording currently announces the missing corrective technique.",
    "This first node is self-contained. Upper-tract and urethral observations are clinically relevant, but together with the named omission they make the item more elimination-driven than its intended protocol interpretation. Absence of meatal blood and easy catheter passage should not be described as definitive exclusion of all urethral injury."
  ],
  "suggestions": [
    "Retain the IV-only acquisition and actual bladder filling/distension observations; remove the explicit announcement of the unperformed corrective technique.",
    "Re-solve the three protocols after that change, retaining enough urethral context for a single best answer. Keep the explanation about acquisition adequacy after the response."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "No clarity issue was reported."
  ],
  "cueResolutions": [
    "The named omitted retrograde technique is gone; the bladder filling and performed IV protocol are retained as raw acquisition data."
  ],
  "fairnessResolutions": [
    "Removed the announced omitted technique and replaced it with performed-protocol and filling observations. Re-solved the same three targets and retained a limited, nonabsolute urethral interpretation.",
    "Catheter passage is described as an observation, never a definitive exclusion of urethral injury."
  ],
  "sourceBoundary": "WSES urotrauma and EAST bladder guidance support cystography rather than passive IV-excretory filling for this bladder question. Atraumatic catheter passage is not treated as proof excluding urethral injury.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v1",
  "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "aebd3d56130d8884733f1833d3c5141b52d7897231d5d263903f2942eddb769b",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.bladder-acquisition.v1\")",
  "before": null
}
```

**Patient and frame:** Ethan Cole; 37 years; Male. Chief complaint: Blood in urine.

{patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
    "prototypeDemographics": {
      "ageYears": 37,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Blood in urine",
    "presentation": "{patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| State | Pelvic fracture; stable after hemorrhage control; gross hematuria through atraumatically inserted catheter |
| Acquisition | IV-contrast trauma CT: upper tracts opacify without leak; small volume of excreted contrast in bladder; no retrograde instillation |
| Urethral record | No meatal blood; catheter passed without resistance |

**Complete task:** Which imaging protocol should evaluate {patientName}'s ongoing gross hematuria?

**key shown first for review only.** Runtime choices are randomized.

1. **Retrograde CT cystography with distension** — KEY

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.cystogram`.

   Post-answer rationale: The ordinary scan did not distend the bladder retrogradely. Gross hematuria after pelvic trauma needs adequate cystographic assessment.

   Credible error: Key

   Reasonable counterfactual: Suspected bladder injury after hemorrhage control; catheter access established without urethral injury evidence.

   Claims: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.passive-ct-insufficient`. Timing profile: `timing.test.ct`.

2. **Delayed excretory-phase abdominal and pelvic CT**

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.excretory`.

   Post-answer rationale: Excretory imaging assesses upper-tract leakage; passive filling does not adequately exclude bladder rupture.

   Credible error: Mistake passive partial filling for a cystogram.

   Reasonable counterfactual: The unresolved question is upper-tract extravasation or ureteral continuity.

   Claims: `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.passive-ct-insufficient`. Timing profile: `timing.test.ct`.

3. **Retrograde urethrography with contrast radiography**

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.urethrogram`.

   Post-answer rationale: A urethrogram evaluates suspected urethral injury. Access here is already atraumatic and the unresolved organ is the bladder.

   Credible error: Use a related study without matching its anatomic target.

   Reasonable counterfactual: Meatal blood or other urethral findings warrant assessment before catheter insertion.

   Claims: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.urethral-assessment`. Timing profile: `timing.test.radiography`.

**Key:** `choice.topic.trauma-initial-abdomen.bladder-acquisition.cystogram`

**Explanation:** The ordinary scan did not distend the bladder retrogradely. Gross hematuria after pelvic trauma needs adequate cystographic assessment.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.passive-ct-insufficient`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.urethral-assessment`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
  "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "365c3bc67dbead1a7774e51d267057b447da8defd82c9f437bdf2dd24a07854d",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.bladder-acquisition.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v1",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "exactDraftSha256": "aebd3d56130d8884733f1833d3c5141b52d7897231d5d263903f2942eddb769b",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Ethan Cole; 37 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 37,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete."
  }
]
```

**Objective:** Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Clinical record | Pelvic fracture; circulation stable after hemorrhage control; gross hematuria continues through the existing catheter. |
| Acquired imaging and administration log | All acquired series belong to an IV-contrast abdominal/pelvic CT protocol. Excreted contrast opacifies the upper tracts without a leak; bladder walls remain apposed around a thin layer of contrast next to the catheter. |
| Catheter record | No meatal blood was seen before insertion; the catheter passed without resistance and drains urine. |

**Complete task:** At this hospital decision point, which imaging protocol should be recommended for {patientName}'s ongoing gross hematuria?

**key shown first for review only.** Runtime choices are randomized.

1. **Retrograde CT cystography with bladder distension** — KEY

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram`.

   Post-answer rationale: Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.

   Credible error: Key

   Reasonable counterfactual: Bladder injury is suspected and the acquired ordinary CT does not distend the bladder adequately.

   Claims: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.passive-ct-insufficient`. Timing profile: `timing.test.ct`.

2. **Delayed excretory-phase abdominal and pelvic CT**

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory`.

   Post-answer rationale: More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target.

   Credible error: Repeat upper-tract acquisition instead of recognizing the bladder study adequacy problem.

   Reasonable counterfactual: The unresolved problem is upper-tract urine leakage or ureteral continuity after adequate bladder assessment.

   Claims: `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.passive-ct-insufficient`. Timing profile: `timing.test.ct`.

3. **Retrograde urethrography with contrast radiography**

   ID: `choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram`.

   Post-answer rationale: A urethrogram investigates suspected urethral injury. The current gross-hematuria/pelvic-injury question still needs bladder evaluation through established access. Easy catheter passage and absent initial meatal blood do not prove that every urethral injury is excluded.

   Credible error: Substitute a neighboring lower-tract target for the unresolved bladder assessment.

   Reasonable counterfactual: Clinical findings raise a urethral-injury question, particularly before unsafe catheterization is attempted.

   Claims: `claim.trauma-initial-abdomen.urethral-assessment`, `claim.trauma-initial-abdomen.bladder-cystography`. Timing profile: `timing.test.radiography`.

**Key:** `choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram`

**Explanation:** Gross hematuria after pelvic trauma raises a bladder-injury concern. The acquired images show a minimally filled bladder, so excreted contrast has not provided an adequate cystographic evaluation.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.bladder-cystography`, `claim.trauma-initial-abdomen.passive-ct-insufficient`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.urethral-assessment`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Removed no retrograde instillation. The record reports the actual IV protocol and observed bladder-wall apposition rather than naming the missing corrective action. Three named contrast protocols retain comparable scope.",
  "sameStageAndCategory": "One investigation choice for the unresolved bladder-injury question after initial hemorrhage control.",
  "twoConsequentialSteps": {
    "interpret": "Recognize gross hematuria with pelvic trauma as a bladder concern, and interpret minimally filled apposed walls as an inadequate cystographic assessment.",
    "apply": "Select a protocol that adequately distends and evaluates the bladder rather than add upper-tract excretion or assess a different lower-tract target."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Delayed excretory CT is tempting because contrast already reaches the bladder, but that does not establish adequate distension.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
    "decidingObservation": "The complete acquired CT record shows a minimally filled bladder despite upper-tract opacification",
    "consequenceOfClosestError": "More renal excretion does not substitute for a distended cystographic assessment of the bladder; the already opacified upper tracts address a different target.",
    "counterfactualChange": "If adequate cystography is negative and the remaining concern is a suspected renal or ureteral leak, delayed excretory imaging becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
    "counterfactualResolution": "The unresolved problem is upper-tract urine leakage or ureteral continuity after adequate bladder assessment."
  },
  "deletionTest": {
    "actualResolution": "Without the acquisition/filling observations, one cannot know whether the previous imaging already supplied an adequate cystogram. The corrective study must not be inferred from an absent exported series.",
    "sentenceAndExhibitJobs": "The IV-only protocol and actual wall apposition establish acquisition adequacy. Gross hematuria and fracture establish the target. The catheter record gives actual access information while the explanation explicitly avoids ruling out all urethral injury.",
    "repairLog": "Removed the announced omitted technique and replaced it with performed-protocol and filling observations. Re-solved the same three targets and retained a limited, nonabsolute urethral interpretation."
  },
  "wholeVisibleSequence": "This first urinary node is independent. Feedback discusses adequacy rather than the current result or the later revised repair exception.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "One investigation choice for the unresolved bladder-injury question after initial hemorrhage control.",
    "cueDisposition": "Removed no retrograde instillation. The record reports the actual IV protocol and observed bladder-wall apposition rather than naming the missing corrective action. Three named contrast protocols retain comparable scope."
  }
}
```

Visible-sequence constraint: This first urinary node is independent. Feedback discusses adequacy rather than the current result or the later revised repair exception.

### bladder-intraperitoneal-repair — revised

Independent review: `question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [
    "'Percutaneous drainage with urinary diversion' does not name the diversion or its target. It is less specific than the other two plans and cannot be evaluated as a concrete procedure."
  ],
  "cues": [],
  "fairness": [
    "Primary bladder repair with catheter drainage is the defensible best treatment for this traumatic dome rupture with intraperitoneal contrast distribution. No confident clinical inaccuracy identified.",
    "The imaging pattern is a classic recognition-to-treatment association. Continuous catheter drainage is a real extraperitoneal-injury error, but the unspecified third choice adds little resident-level discrimination. Two successive recalled associations do not establish two consequential steps.",
    "The cystogram follows the prior investigation coherently and supplies the anatomy needed independently. Prior feedback discusses adequate imaging and does not teach this repair answer."
  ],
  "suggestions": [
    "Name the actual competing diversion procedure, or replace it with a specific credible treatment error.",
    "Accept as foundational intraperitoneal-versus-extraperitoneal management only explicitly, or construct a source-supported case where anatomy and a separate treatment modifier both change the repair decision. Do not obscure the contrast distribution."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "The unspecified diversion plan is replaced with explicit suprapubic catheter drainage and cystographic reassessment."
  ],
  "cueResolutions": [
    "Exact options and visible data manually attacked as recorded in the revised author gate.",
    "Every label names the same bladder target; target wording in the task no longer uniquely overlaps the repair option."
  ],
  "fairnessResolutions": [
    "Replaced the foundational intraperitoneal recognition task with a supported extraperitoneal repair exception, named every treatment and versioned the changed meaning instead of transferring its history.",
    "A distinct, explicitly versioned extraperitoneal repair-exception construct replaces the classic intraperitoneal association. The bone finding, compartment and current physiology are all visible."
  ],
  "sourceBoundary": "EAST bladder 2019 and WSES urotrauma 2019 support repair of complex extraperitoneal injuries; an intravesical bone fragment is a named exception to uncomplicated catheter care.",
  "authorDifficultyDisposition": "Retain as a fair moderate two-step candidate after resolving the reported clarity/fairness defects; do not inflate to hard or remove safety observations. New exact version still requires independent review."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1",
  "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "71b8e1894a11bed1a417ebd0d9178fd438c0c843b3c97aff1b2ae23264a08716",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1\")",
  "before": null
}
```

**Patient and frame:** Ethan Cole; 37 years; Male. Chief complaint: Blood in urine.

{patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
    "prototypeDemographics": {
      "ageYears": 37,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Blood in urine",
    "presentation": "{patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** Retrograde CT cystography shows contrast exiting a dome defect and outlining bowel loops above the pelvis. The bladder neck and ureters are intact.

_No separate exhibit._

**Complete task:** Which treatment should {patientName} receive for the bladder injury shown on this cystogram?

**key shown first for review only.** Runtime choices are randomized.

1. **Primary repair with urethral catheter drainage** — KEY

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.repair`.

   Post-answer rationale: The distribution establishes intraperitoneal rupture, which generally requires repair with urinary drainage.

   Credible error: Key

   Reasonable counterfactual: Traumatic intraperitoneal rupture in a patient suitable for repair.

   Claims: `claim.trauma-initial-abdomen.intraperitoneal-bladder`, `claim.trauma-initial-abdomen.bladder-compartment-imaging`. Timing profile: `no_test`.

2. **Continuous urethral catheter drainage**

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.catheter`.

   Post-answer rationale: Catheter care can treat an uncomplicated extraperitoneal leak, but this defect opens into the peritoneal cavity.

   Credible error: Apply extraperitoneal treatment to the wrong compartment.

   Reasonable counterfactual: The leak is confined to uncomplicated extraperitoneal tissues without another repair indication.

   Claims: `claim.trauma-initial-abdomen.extraperitoneal-bladder`, `claim.trauma-initial-abdomen.intraperitoneal-bladder`, `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.bladder-compartment-imaging`. Timing profile: `no_test`.

3. **Percutaneous drainage with urinary diversion**

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.drain`.

   Post-answer rationale: Temporizing drainage/diversion does not repair this acute intraperitoneal defect in a stable patient.

   Credible error: Drain leaked urine without closing a repairable intraperitoneal source.

   Reasonable counterfactual: Severe instability requires temporizing drainage/diversion during damage control.

   Claims: `claim.trauma-initial-abdomen.intraperitoneal-bladder`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.repair`

**Explanation:** The distribution establishes intraperitoneal rupture, which generally requires repair with urinary drainage.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.intraperitoneal-bladder`, `claim.trauma-initial-abdomen.extraperitoneal-bladder`, `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.bladder-compartment-imaging`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
  "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
  "previousConceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "35dc423653e10c3e4aca0bf8290e2c12411d90dfdc3c90c5e78beb980ecfbca6",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1",
    "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
    "exactDraftSha256": "71b8e1894a11bed1a417ebd0d9178fd438c0c843b3c97aff1b2ae23264a08716",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Ethan Cole; 37 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 37,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 37-year-old man reassessed by the trauma service after blunt pelvic trauma. Urgent hemorrhage control is complete."
  }
]
```

**Objective:** Choose repair rather than a routine catheter pathway for an extraperitoneal bladder injury with an intravesical bone fragment.

**Historical hospital phase/acuity:** `trauma_inpatient` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** At the outside hospital, hemorrhage control is complete and the catheter drains urine. BP remains 120/74 mmHg without new blood or vasopressor support; the abdomen has focal suprapubic tenderness without diffuse guarding. Retrograde CT cystography and cystoscopic inspection are obtained.

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Cystogram | Leaked contrast remains in tissue between the bladder and pubic symphysis and tracks beside the bladder. It does not outline bowel loops above the pelvis. |
| Inspection | A pointed fragment continuous with the fractured pubic bone projects through the anterior bladder wall into the lumen. The bladder neck and ureteral orifices are intact. |

**Complete task:** At this documented treatment decision, which bladder plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Primary bladder repair with urethral catheter drainage** — KEY

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.repair`.

   Post-answer rationale: The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.

   Credible error: Key

   Reasonable counterfactual: A complex extraperitoneal injury contains an intravesical bone fragment in a patient suitable for repair.

   Claims: `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.extraperitoneal-bladder`. Timing profile: `no_test`.

2. **Bladder drainage by urethral catheter with cystographic reassessment**

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral`.

   Post-answer rationale: This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.

   Credible error: Apply the usual compartment-based catheter rule without interpreting the additional anatomic injury.

   Reasonable counterfactual: The extraperitoneal leak has no intravesical bone, bladder-neck/adjacent-organ injury or other repair indication.

   Claims: `claim.trauma-initial-abdomen.extraperitoneal-bladder`, `claim.trauma-initial-abdomen.complex-bladder`. Timing profile: `no_test`.

3. **Bladder drainage by suprapubic catheter with cystographic reassessment**

   ID: `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.suprapubic`.

   Post-answer rationale: Changing the drainage route does not address the bony lesion through the bladder wall. A suprapubic catheter can provide drainage in selected nonoperative injuries, but it is not a substitute for repair of this complexity.

   Credible error: Treat a change in catheter route as correction of the wall injury.

   Reasonable counterfactual: A selected uncomplicated extraperitoneal injury can receive suprapubic urinary drainage when that route is appropriate.

   Claims: `claim.trauma-initial-abdomen.extraperitoneal-bladder`, `claim.trauma-initial-abdomen.complex-bladder`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.repair`

**Explanation:** The distribution is extraperitoneal, but bone protruding through the bladder wall makes this more than an uncomplicated leak. Repair addresses the injury rather than relying on catheter drainage to heal around the persistent bony lesion.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.complex-bladder`, `claim.trauma-initial-abdomen.extraperitoneal-bladder`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "The pre-answer record contains neither intraperitoneal nor complex-extraperitoneal labels. The key no longer follows a dome-leak association; the usual catheter pathway becomes a credible competing plan before the bony modifier is interpreted. All three plans explicitly name the bladder, so the target noun does not identify the key.",
  "sameStageAndCategory": "All three plans are definitive bladder treatment strategies with named drainage routes; the previously vague diversion option is replaced with a specific suprapubic-catheter plan.",
  "twoConsequentialSteps": {
    "interpret": "Read the contrast compartment as extraperitoneal, then recognize that bone traversing the wall is a clinically important complexity rather than simple clot or a harmless nearby fracture.",
    "apply": "Choose repair rather than apply the usual catheter-care pathway to every extraperitoneal injury."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Urethral catheter care is credible because the leak is extraperitoneal, the bladder neck is intact and the catheter drains; the intravesical bony lesion changes that otherwise reasonable plan.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral",
    "decidingObservation": "The extraperitoneal leak has a bony projection through the wall into the lumen",
    "consequenceOfClosestError": "This is a supported pathway for an uncomplicated extraperitoneal rupture. The projected bone fragment is the important exception; preserved catheter flow does not remove it.",
    "counterfactualChange": "Remove the bony projection and any other repair indication while keeping the uncomplicated extraperitoneal distribution; urethral catheter care becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.r2.urethral",
    "counterfactualResolution": "The extraperitoneal leak has no intravesical bone, bladder-neck/adjacent-organ injury or other repair indication."
  },
  "deletionTest": {
    "actualResolution": "Without the bony inspection finding, the catheter pathway becomes appropriate. Without the cystographic distribution, the ordinary compartment-based management comparison cannot be established; a simple intraperitoneal-versus-extraperitoneal association is no longer the whole scored task.",
    "sentenceAndExhibitJobs": "Contrast distribution establishes the baseline pathway; inspection establishes its exception. Current support/examination and preserved drainage make conservative care a real temptation, while specifying the exact suprapubic competitor resolves the vague third option.",
    "repairLog": "Replaced the foundational intraperitoneal recognition task with a supported extraperitoneal repair exception, named every treatment and versioned the changed meaning instead of transferring its history."
  },
  "wholeVisibleSequence": "The first urinary node concerns acquisition adequacy and is revised without teaching this bone-fragment exception. This result and current physiology are fully stated here.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All three plans are definitive bladder treatment strategies with named drainage routes; the previously vague diversion option is replaced with a specific suprapubic-catheter plan.",
    "cueDisposition": "The pre-answer record contains neither intraperitoneal nor complex-extraperitoneal labels. The key no longer follows a dome-leak association; the usual catheter pathway becomes a credible competing plan before the bony modifier is interpreted."
  }
}
```

Visible-sequence constraint: The first urinary node concerns acquisition adequacy and is revised without teaching this bone-fragment exception. This result and current physiology are fully stated here.

Material meaning change; prior FSRS history is not transferred:

```json
{
  "previousConceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
  "reason": "The original meaning was traumatic intraperitoneal rupture repair. This version instead tests a specific exception to catheter management of an extraperitoneal injury; keep the old concept/history separate.",
  "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history."
}
```

### renal-no-hematuria-protocol — revised

Independent review: `question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [
    "'IV-contrast CT with delayed urographic images' and 'IV-contrast CT with vascular-phase images' are not explicitly distinct complete protocols. A multiphase trauma CT can contain both, and the first option does not specify its preceding phases."
  ],
  "cues": [],
  "fairness": [
    "A contrast CT protocol including delayed urinary-tract assessment is the likely intended best answer given deceleration and flank findings despite absent hematuria. The clinical direction is sound; the option boundary is underdefined.",
    "Two useful steps are available: infer renal/upper-tract injury risk without hematuria, then choose an acquisition that assesses urinary continuity as well as parenchymal/vascular injury. Overlapping protocol labels prevent clean measurement of the second step.",
    "The first-node case is self-contained. The negative FAST does not rule out retroperitoneal injury, and the explanation does not incorrectly claim that it does. No confident clinical inaccuracy identified beyond the wording ambiguity."
  ],
  "suggestions": [
    "Define comparable protocol options by their actual acquired series so the inclusion or absence of delayed excretory assessment is unambiguous. Do not invent phase timing or a decision threshold.",
    "Keep the mechanism and flank findings; avoid turning 'no hematuria' into an exclusion of renal injury."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Both CT alternatives are complete named acquisition sets. The first includes excretory acquisition; the second lists arterial/venous acquisition without an implicit multiphase catch-all."
  ],
  "cueResolutions": [
    "Exact options and visible data manually attacked as recorded in the revised author gate."
  ],
  "fairnessResolutions": [
    "Made arterial/venous/excretory inclusion explicit for the complete CT option and arterial/venous acquisition explicit for the competing protocol. No phase timing or clinical threshold was invented."
  ],
  "sourceBoundary": "WSES urotrauma supports contrast CT with delayed urinary acquisition for high-energy deceleration despite absent hematuria. Explicit phase sets define the options without inventing acquisition seconds.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1",
  "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "95678c9467ed75f0a0b6a91ee35360954534568849d6db13cf2620ff4d098ad5",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1\")",
  "before": null
}
```

**Patient and frame:** Iris Bennett; 31 years; Female. Chief complaint: Flank pain.

{patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.renal-stage-and-observe.v1",
    "prototypeDemographics": {
      "ageYears": 31,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Flank pain",
    "presentation": "{patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Mechanism | Abrupt high-speed deceleration in a rollover collision |
| Examination | Flank tenderness and ecchymosis; no guarding |
| Current record | BP 122/76 mmHg; pulse 94/min; no blood in urine; FAST without intraperitoneal fluid |

**Complete task:** Which initial imaging protocol should evaluate {patientName}'s abdominal and upper urinary tract injuries?

**key shown first for review only.** Runtime choices are randomized.

1. **IV-contrast CT with delayed urographic images** — KEY

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.delayed`.

   Post-answer rationale: High-energy deceleration and flank findings can accompany renal/upper-tract injury without hematuria. Contrast plus delayed images assesses perfusion and urinary continuity.

   Credible error: Key

   Reasonable counterfactual: Stable high-energy deceleration with concern for upper-tract injury.

   Claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.renal-excretory-phase`. Timing profile: `timing.test.ct`.

2. **IV-contrast CT with vascular-phase images**

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.vascular`.

   Post-answer rationale: Vascular phases assess perfusion and bleeding but may not show collecting-system/ureteral leakage without delayed imaging.

   Credible error: Assume clear urine removes the need to assess urinary continuity.

   Reasonable counterfactual: Targeted vascular reassessment follows an adequate prior urinary-continuity assessment.

   Claims: `claim.trauma-initial-abdomen.renal-excretory-phase`. Timing profile: `timing.test.ct`.

3. **Renal ultrasonography with Doppler assessment**

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.ultrasound`.

   Post-answer rationale: Ultrasound does not adequately stage suspected high-energy renal/upper-tract injury in this adult.

   Credible error: Let clear urine and negative FAST substitute for upper-tract staging.

   Reasonable counterfactual: Selected follow-up after adequate staging needs ultrasound rather than initial high-energy trauma characterization.

   Claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.stable-ct`. Timing profile: `timing.test.ultrasound`.

**Key:** `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.delayed`

**Explanation:** High-energy deceleration and flank findings can accompany renal/upper-tract injury without hematuria. Contrast plus delayed images assesses perfusion and urinary continuity.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.stable-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
  "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "5ed17baadd811db63f40c3e6a764d9849be61669a37c8c9237da1247c076f0c1",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1",
    "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct",
    "exactDraftSha256": "95678c9467ed75f0a0b6a91ee35360954534568849d6db13cf2620ff4d098ad5",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Iris Bennett; 31 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.renal-stage-and-observe.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 31,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision."
  }
]
```

**Objective:** Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.

**Historical hospital phase/acuity:** `trauma_resuscitation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Mechanism | Abrupt high-speed deceleration in a rollover collision |
| Examination | Flank tenderness and ecchymosis; no guarding |
| Current record | BP 122/76 mmHg; pulse 94/min; no blood in urine; FAST without intraperitoneal fluid |

**Complete task:** At the recorded initial assessment, which imaging acquisition plan should be recommended for {patientName}'s abdominal and upper urinary tract injuries?

**key shown first for review only.** Runtime choices are randomized.

1. **IV-contrast CT with arterial, venous and excretory acquisitions** — KEY

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.complete`.

   Post-answer rationale: Deceleration and flank findings justify upper-tract assessment despite clear urine. The named complete protocol evaluates vascular/parenchymal injury and urinary continuity.

   Credible error: Key

   Reasonable counterfactual: Initial stable high-energy trauma staging needs both vascular and excretory assessment.

   Claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.renal-excretory-phase`. Timing profile: `timing.test.ct`.

2. **IV-contrast CT with arterial and venous acquisitions**

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular`.

   Post-answer rationale: This explicitly defined protocol lacks an excretory acquisition. It can evaluate perfusion/bleeding while leaving collecting-system or ureteral leakage unresolved.

   Credible error: Mistake a vascular/parenchymal trauma study for a complete urinary-continuity assessment.

   Reasonable counterfactual: The current question is a targeted vascular reassessment after urinary continuity has already been documented.

   Claims: `claim.trauma-initial-abdomen.renal-excretory-phase`. Timing profile: `timing.test.ct`.

3. **Renal ultrasonography with Doppler perfusion assessment**

   ID: `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.ultrasound`.

   Post-answer rationale: Ultrasound does not provide complete staging of this suspected high-energy renal/upper-tract injury in a stable adult.

   Credible error: Allow clear urine and a negative FAST to substitute for retroperitoneal and collecting-system staging.

   Reasonable counterfactual: A selected follow-up question after adequate injury staging can be answered with ultrasound.

   Claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.stable-ct`. Timing profile: `timing.test.ultrasound`.

**Key:** `choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.complete`

**Explanation:** Deceleration and flank findings justify upper-tract assessment despite clear urine. The named complete protocol evaluates vascular/parenchymal injury and urinary continuity.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.renal-deceleration-ct`, `claim.trauma-initial-abdomen.renal-excretory-phase`, `claim.trauma-initial-abdomen.stable-ct`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Kept the mechanism and actual negative observations. Both CT labels now state their complete acquired series with parallel grammar, and neither uses alone or an explanatory qualifier to advertise the error.",
  "sameStageAndCategory": "All choices are explicitly defined initial imaging acquisition plans.",
  "twoConsequentialSteps": {
    "interpret": "Infer upper-tract injury risk from high-energy deceleration and flank findings despite absent hematuria/negative FAST.",
    "apply": "Select an acquisition set that evaluates urinary continuity as well as vascular/parenchymal injury."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "A standard arterial/venous trauma CT is credible but does not answer the urinary-continuity question.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular",
    "decidingObservation": "High-energy deceleration raises a collecting-system/ureteral question despite absent hematuria",
    "consequenceOfClosestError": "This explicitly defined protocol lacks an excretory acquisition. It can evaluate perfusion/bleeding while leaving collecting-system or ureteral leakage unresolved.",
    "counterfactualChange": "If urinary continuity has already been adequately assessed and the remaining question is vascular perfusion, the arterial/venous acquisition set can be appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular",
    "counterfactualResolution": "The current question is a targeted vascular reassessment after urinary continuity has already been documented."
  },
  "deletionTest": {
    "actualResolution": "Removing the urinary-tract injury concern leaves a narrower vascular study reasonable; adding an excretory acquisition to the second option would make the choices overlap again, which is why exact series are listed.",
    "sentenceAndExhibitJobs": "Mechanism/flank observations supply risk; clear urine and FAST are purposeful competing reassurance, not exclusions; complete acquisition labels resolve the prior overlap.",
    "repairLog": "Made arterial/venous/excretory inclusion explicit for the complete CT option and arterial/venous acquisition explicit for the competing protocol. No phase timing or clinical threshold was invented."
  },
  "wholeVisibleSequence": "The following PASS leak-management question remains byte-exact in its clinical payload. This feedback discusses scan scope and does not teach whether the later calyceal leak needs intervention.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All choices are explicitly defined initial imaging acquisition plans.",
    "cueDisposition": "Kept the mechanism and actual negative observations. Both CT labels now state their complete acquired series with parallel grammar, and neither uses alone or an explanatory qualifier to advertise the error."
  }
}
```

Visible-sequence constraint: The following PASS leak-management question remains byte-exact in its clinical payload. This feedback discusses scan scope and does not teach whether the later calyceal leak needs intervention.

### renal-isolated-urine-leak — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Monitored nonoperative care is the best supplied plan. The learner must interpret the calyceal leak alongside downstream opacification, then distinguish an uncomplicated leak from an injury or complication needing stenting or exploration.",
    "Stenting is a credible overtreatment response to any visible urine leak. Preserved continuity, stable circulation and absence of an enlarging or infected collection give reasons to rank it below observation here.",
    "The update carries the staging findings and clinical state required independently. It coherently follows the initial CT protocol question. Prior feedback teaches what the scan evaluates, not whether this leak requires intervention.",
    "No confident clinical inaccuracy or nonmedical cue identified. The explanation appropriately limits the claim to isolated extravasation, not every urinary leak."
  ],
  "suggestions": [
    "Retain the distinction between observing an uncomplicated leak and intervening for an evolving symptomatic or complicated one; do not generalize to all collecting-system injuries."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "cd4ff45c99e59c9b6fa8450d531c9e319d597611bee63e566d09b1c64b521ce2",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `997f8d33543193d4fc8d483455fb34d5766fb78fabaf3793df38e3f4aae32744`. Frozen clinical payload SHA-256: `cd4ff45c99e59c9b6fa8450d531c9e319d597611bee63e566d09b1c64b521ce2`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
  "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "4ab0d8ec61a75df820149dc6c5ccb7f14a54a56219578c8064121c0168d0f3cb",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1\")",
  "before": null
}
```

**Patient and frame:** Iris Bennett; 31 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.renal-stage-and-observe.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 31,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 31-year-old woman evaluated in the trauma bay after a rollover collision."
  }
]
```

**Objective:** Choose initial observation for stable fully staged renal injury with limited collecting-system leakage.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** The completed CT shows a perfused laceration entering a calyx with a small nearby urine leak. Delayed images opacify the pelvis and ureter through to the bladder. There is no arterial extravasation. Circulation and serial hemoglobin remain stable, without fever or an enlarging collection.

_No separate exhibit._

**Complete task:** Which initial renal management plan should {patientName} receive now?

**key shown first for review only.** Runtime choices are randomized.

1. **Monitored nonoperative renal care** — KEY

   ID: `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.observe`.

   Post-answer rationale: Staging confirms preserved urinary continuity without a hemorrhagic or symptomatic leak complication. Isolated urine extravasation does not itself require intervention.

   Credible error: Key

   Reasonable counterfactual: Stable injury without proximal avulsion, infection, obstruction or symptomatic nonresolving collection.

   Claims: `claim.trauma-initial-abdomen.renal-urine-observe`. Timing profile: `no_test`.

2. **Retrograde ureteral stent placement**

   ID: `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent`.

   Post-answer rationale: A stent may treat a persistent or symptomatic leak, but this limited leak and preserved drainage do not establish that complication.

   Credible error: Treat any urinary extravasation as an automatic stent indication.

   Reasonable counterfactual: A persistent symptomatic urinoma or impaired drainage develops during observation.

   Claims: `claim.trauma-initial-abdomen.renal-urinoma-intervention`, `claim.trauma-initial-abdomen.renal-urine-observe`. Timing profile: `no_test`.

3. **Operative renal exploration and repair**

   ID: `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.operate`.

   Post-answer rationale: There is no demonstrated uncontrolled hemorrhage or avulsed collecting-system outlet requiring operative repair.

   Credible error: Treat collecting-system involvement as an automatic indication for exploration.

   Reasonable counterfactual: An operative indication emerges, such as uncontrolled hemorrhage or a major outlet disruption needing reconstruction.

   Claims: `claim.trauma-initial-abdomen.renal-urine-observe`, `claim.trauma-initial-abdomen.renal-preservation`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.observe`

**Explanation:** Staging confirms preserved urinary continuity without a hemorrhagic or symptomatic leak complication. Isolated urine extravasation does not itself require intervention.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.renal-urine-observe`, `claim.trauma-initial-abdomen.renal-urinoma-intervention`, `claim.trauma-initial-abdomen.renal-preservation`, `claim.trauma-initial-abdomen.renal-excretory-phase`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "Raw staging findings replace an observation-eligibility declaration. The necessary continuity and symptom data resolve the close stenting competitor; no finding is repeated in another field.",
  "sameStageAndCategory": "Initial renal care strategy after complete staging.",
  "twoConsequentialSteps": {
    "interpret": "Separate a limited calyceal leak with preserved continuity from avulsion, obstruction or a complicated urinoma.",
    "apply": "Choose monitored care rather than automatic stenting or exploration."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Treat any urinary extravasation as an automatic stent indication.",
    "measured": false,
    "remainingConcern": "The guideline is adequate but singly sourced for this exact leak boundary. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "preserved urinary continuity and limited leakage without clinical progression",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent",
    "consequenceOfClosestError": "A stent may treat a persistent or symptomatic leak, but this limited leak and preserved drainage do not establish that complication.",
    "counterfactualChange": "Replace this uncomplicated course with a persistent symptomatic urinoma requiring collecting-system drainage; ureteral stenting becomes reasonable.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.renal-isolated-urine-leak.stent",
    "counterfactualResolution": "A persistent symptomatic urinoma or impaired drainage develops during observation."
  },
  "deletionTest": {
    "deciderAblation": "Removing preserved urinary continuity and limited leakage without clinical progression removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Removed injury as an unnecessary key-only echo from previous feedback.",
    "actualResolution": "Delete delayed continuity imaging and a proximal disruption is unresolved. Delete the uncomplicated stable course and a persistent symptomatic leak could justify a stent; a urine-leak label alone cannot determine that.",
    "sentenceAndExhibitJobs": "Calyceal origin, opacified ureter and lack of progressive symptoms separate a limited leak from avulsion/obstruction or a symptomatic urinoma."
  },
  "wholeVisibleSequence": "The earlier explanation concerns protocol adequacy, not treatment of this newly demonstrated leak.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Initial renal care strategy after complete staging. The guideline is adequate but singly sourced for this exact leak boundary.",
    "cueDisposition": "Raw staging findings replace an observation-eligibility declaration. The necessary continuity and symptom data resolve the close stenting competitor; no finding is repeated in another field.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: The earlier explanation concerns protocol adequacy, not treatment of this newly demonstrated leak.

### pancreas-distal-duct-operation — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Distal pancreatectomy is the defensible standard best answer for an adult with complete distal main-duct transection and physiology allowing definitive surgery. Anatomic location and duct status must be interpreted before selecting resection rather than drainage or reconstruction.",
    "The perfused distal tissue creates a plausible preservation temptation; its perfusion does not restore duct continuity. Roux-en-Y reconstruction can be used in selected circumstances, so the key is a preferred plan in this stated setting, not a claim that reconstruction is never possible.",
    "This standalone operative case contains the relevant anatomy and physiology. No confident clinical inaccuracy or nonmedical wording cue identified. The precise ranking against pancreatic-preserving reconstruction warrants the usual clinician sign-off."
  ],
  "suggestions": [
    "Improve feedback by explaining the closest competitor, pancreaticojejunostomy, rather than discussing only a duct-intact contusion. Preserve uncertainty about selected reconstructive exceptions and do not invent a contraindication."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "62785c4f94362586464ce66bcbda967f7bb7241b4f169d41ea2dedb1955db020",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `7bfbfb61fbe36486e3218c70ce06fdbd75f77519066eb58233a0604b068330d9`. Frozen clinical payload SHA-256: `62785c4f94362586464ce66bcbda967f7bb7241b4f169d41ea2dedb1955db020`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
  "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "16a3c584ee503fda6640ea430aee93169cc0a3955637338efbb22af968ffad37",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1\")",
  "before": null
}
```

**Patient and frame:** Miles Warren; 40 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 40-year-old man undergoing laparotomy after blunt abdominal compression. Associated bleeding has been controlled.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.pancreatic-duct-location.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 40,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 40-year-old man undergoing laparotomy after blunt abdominal compression. Associated bleeding has been controlled."
  }
]
```

**Objective:** Use duct disruption and injury location to select an operative pancreatic strategy.

**Historical hospital phase/acuity:** `trauma_operating_room` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Operative findings | Body completely transected left of superior mesenteric vessels; main duct visibly divided; tissue toward the splenic hilum remains perfused; head and ampulla intact |
| Physiology | After associated injury control: temperature 36.7 C; pH 7.36; no ongoing vasopressor requirement |

**Complete task:** Which pancreatic procedure should be selected for {patientName} at this operation?

**key shown first for review only.** Runtime choices are randomized.

1. **Distal pancreatectomy** — KEY

   ID: `choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.distal`.

   Post-answer rationale: Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.

   Credible error: Key

   Reasonable counterfactual: Operative distal complete parenchymal/main-duct transection in a stabilized adult.

   Claims: `claim.trauma-initial-abdomen.distal-pancreatic-duct`. Timing profile: `no_test`.

2. **External peripancreatic drainage**

   ID: `choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain`.

   Post-answer rationale: Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.

   Credible error: Read distal perfusion as proof of intact duct drainage.

   Reasonable counterfactual: The injury is minor and main-duct continuity is adequately established.

   Claims: `claim.trauma-initial-abdomen.minor-pancreas`, `claim.trauma-initial-abdomen.distal-pancreatic-duct`. Timing profile: `no_test`.

3. **Roux-en-Y pancreaticojejunostomy**

   ID: `choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.reconstruct`.

   Post-answer rationale: Reconstructive preservation may be considered in selected proximal injuries; it is not the routine preferred approach for this distal complete transection.

   Credible error: Choose complex preservation without applying the proximal/distal boundary.

   Reasonable counterfactual: A selected proximal injury and patient context favor specialist reconstruction rather than a large distal resection.

   Claims: `claim.trauma-initial-abdomen.distal-pancreatic-duct`, `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.distal`

**Explanation:** Transection left of the mesenteric vessels involving the main duct is a distal duct-disrupting injury. Guidelines support distal resection rather than treating it as a duct-intact contusion.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.distal-pancreatic-duct`, `claim.trauma-initial-abdomen.minor-pancreas`, `claim.trauma-initial-abdomen.pancreatic-duct-evaluate`, `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "No AAST grade or resection instruction is supplied. All choices are pancreatic operations. Location and duct findings determine the plan; the longer reconstruction label is a distractor.",
  "sameStageAndCategory": "One pancreatic procedure during an operation after other sources are controlled.",
  "twoConsequentialSteps": {
    "interpret": "Localize injury relative to mesenteric vessels and separate distal perfusion from main-duct continuity.",
    "apply": "Choose the supported distal resection strategy."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Read distal perfusion as proof of intact duct drainage.",
    "measured": false,
    "remainingConcern": "Specialist reconstruction evidence is limited; it is a selected existence boundary, not a preferred proximal-operation rule. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "complete main-duct transection left of the superior mesenteric vessels",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain",
    "consequenceOfClosestError": "Drainage can treat selected minor duct-intact injuries but leaves the disrupted distal duct source untreated in this complete transection.",
    "counterfactualChange": "Replace transection with a superficial injury and demonstrated intact duct; nonresectional drainage becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.drain",
    "counterfactualResolution": "The injury is minor and main-duct continuity is adequately established."
  },
  "deletionTest": {
    "deciderAblation": "Removing complete main-duct transection left of the superior mesenteric vessels removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Replaced distal gland with the actual splenic-hilum orientation so the learner localizes the injury rather than matching distal.",
    "actualResolution": "Delete duct continuity observations and a minor duct-intact injury could receive drainage. Delete the relation to mesenteric vessels and distal resection cannot be ranked against selected reconstructive strategies.",
    "sentenceAndExhibitJobs": "Vessel relation localizes the injury; visible duct division establishes its duct-disrupting nature; current physiology permits the stated operative decision."
  },
  "wholeVisibleSequence": "Single node. A preceding MRCP-versus-ERCP item is withheld because those tests cannot be universally ranked.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; One pancreatic procedure during an operation after other sources are controlled. Specialist reconstruction evidence is limited; it is a selected existence boundary, not a preferred proximal-operation rule.",
    "cueDisposition": "Pancreatectomy, drainage and pancreaticojejunostomy are all named operative strategies; the linter does not recognize every operation suffix. No distal label remains in the pre-answer anatomy: the learner localizes relative to mesenteric vessels and interprets divided duct continuity.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: Single node. A preceding MRCP-versus-ERCP item is withheld because those tests cannot be universally ranked.

### duodenum-contained-wall-injury — revised

Independent review: `question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Gastric decompression with inpatient observation is the defensible best initial plan for a stable obstructing intramural process without perforation or another operative injury. No confident clinical inaccuracy identified.",
    "The classic wall collection and obstructive pattern lead directly to a familiar initial-care rule. Immediate operative evacuation is a wrong-stage treatment, and bypass/exclusion is disproportionate without a destructive injury or failed course. They do not create difficult competing decisions here.",
    "The first node is self-contained; the text-based CT exhibit gives adequate anatomic observations without falsely promising an image."
  ],
  "suggestions": [
    "Accept as foundational only explicitly, or move the scored objective to a source-supported reassessment decision where symptom course and repeat anatomic findings both affect escalation.",
    "Keep initial uncomplicated care separate from the later perforation scenario; do not imply that every obstructing wall hematoma needs surgery."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "No clarity issue was reported."
  ],
  "cueResolutions": [
    "The task no longer supplies the conclusion of persistent duodenal obstruction; the learner interprets clamp trials and repeat anatomy."
  ],
  "fairnessResolutions": [
    "Moved scoring to a supported reassessment boundary and explicitly versioned the changed objective. The 14-day guideline boundary is directly sourced; sixteen days is a constructed patient course, not a mandatory universal operative deadline.",
    "The current record is no longer untreated uncomplicated obstruction: prolonged failed conservative care competes with misleading radiographic shrinkage. The exact intervention route remains a clinician-reviewed selected plan, not a universal claim."
  ],
  "sourceBoundary": "WSES duodenopancreatic 2019 supports considering intervention for unresolved obstruction within fourteen days and describes evacuation. Evidence is conditional/low-certainty, not a mandatory day-14 rule or a ranking against every percutaneous alternative.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1",
  "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "2286c61ae50615743435a715dd6a75be813319995b1de2056c929beb17c06f67",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1\")",
  "before": null
}
```

**Patient and frame:** Ava Parker; 34 years; Female. Chief complaint: Vomiting after impact.

{patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
    "prototypeDemographics": {
      "ageYears": 34,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Vomiting after impact",
    "presentation": "{patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Distinguish contained obstructing duodenal wall injury from perforation requiring repair.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| CT | Hyperattenuating collection within D2/D3 wall; narrowed lumen and proximal distension; no extraluminal gas/enteric contrast or other visceral injury |
| State | Vomiting after blunt epigastric compression; BP 120/72 mmHg; pulse 90/min; tenderness without guarding |

**Complete task:** Which initial treatment plan should {patientName} receive for the duodenal findings?

**key shown first for review only.** Runtime choices are randomized.

1. **Gastric decompression with inpatient observation** — KEY

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.decompress`.

   Post-answer rationale: The wall process compresses the lumen without a perforation or another operative injury. Initial decompression and monitored nonoperative care are supported.

   Credible error: Key

   Reasonable counterfactual: Stable duodenal wall hematoma without perforation or another operative indication.

   Claims: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-mural-imaging`. Timing profile: `no_test`.

2. **Operative evacuation of the wall collection**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.evacuate`.

   Post-answer rationale: Mural obstruction does not itself require initial evacuation when the current assessment permits observation.

   Credible error: Treat obstruction as an automatic indication to open the hematoma.

   Reasonable counterfactual: Persistent/worsening obstruction after conservative care warrants reassessment and a supported intervention.

   Claims: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`. Timing profile: `no_test`.

3. **Gastrojejunostomy with duodenal exclusion**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.bypass`.

   Post-answer rationale: Complex diversion is not initial treatment for a contained wall injury without demonstrated destructive disruption.

   Credible error: Choose bypass before establishing failure or destructive anatomy.

   Reasonable counterfactual: A destructive or nonrepairable duodenal injury needs a specialist reconstruction plan.

   Claims: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-complex`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.decompress`

**Explanation:** The wall process compresses the lumen without a perforation or another operative injury. Initial decompression and monitored nonoperative care are supported.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.duodenal-mural-imaging`, `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
  "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.duodenal-hematoma-persistent-obstruction.v2",
  "previousConceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "06a0071588041bc641b521ba572559deffc43f1741a6ec83aaf6617629bae0bc",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1",
    "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
    "exactDraftSha256": "2286c61ae50615743435a715dd6a75be813319995b1de2056c929beb17c06f67",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Ava Parker; 34 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 34,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision."
  }
]
```

**Objective:** Use clinical course and repeat anatomy to choose escalation for persistent obstruction from a duodenal wall hematoma.

**Historical hospital phase/acuity:** `trauma_observation` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** The outside hospital treated the duodenal wall injury with nasogastric decompression, bowel rest and nutritional support. Sixteen days later, clamp trials still reproduce bilious vomiting and gastric drainage has not declined. Pain and circulation have improved: BP 120/72 mmHg without support, with no guarding or rebound.

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Repeat CT | The D2/D3 intramural collection is smaller, but marked luminal narrowing and upstream distension remain. There is no extraluminal gas, contrast leak or destructive loss of the duodenal wall. |

**Complete task:** At this recorded reassessment, which management plan should be recommended for {patientName}?

**key shown first for review only.** Runtime choices are randomized.

1. **Operative evacuation of the wall hematoma** — KEY

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.evacuate`.

   Post-answer rationale: The smaller image has not translated into restored passage after a prolonged nonoperative course. Escalation to decompression of the persisting wall lesion is supported rather than simply extending the unchanged plan or bypassing an otherwise preserved duodenum.

   Credible error: Key

   Reasonable counterfactual: A persistently obstructing duodenal hematoma has failed an adequate nonoperative course; intervention is selected for this case.

   Claims: `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`, `claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution`, `claim.trauma-initial-abdomen.duodenal-hematoma`. Timing profile: `no_test`.

2. **Continued decompression with serial reassessment**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.observe`.

   Post-answer rationale: Continued conservative care is appropriate during a resolving course, but the record shows ongoing functional obstruction despite prolonged treatment. A smaller collection alone does not establish successful passage.

   Credible error: Equate radiographic shrinkage or improved pain with resolution of obstruction.

   Reasonable counterfactual: An earlier or clinically resolving course shows falling drainage and successful reintroduction of intake without perforation.

   Claims: `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution`. Timing profile: `no_test`.

3. **Duodenal bypass with gastrojejunostomy**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.bypass`.

   Post-answer rationale: The wall is preserved and the obstructing intramural lesion can be addressed directly. No destructive defect or irreconstructible segment is shown to justify bypass.

   Credible error: Treat persistent obstruction as proof that the duodenum must be bypassed.

   Reasonable counterfactual: Destructive or nonrepairable duodenal anatomy requires a specialist reconstructive strategy.

   Claims: `claim.trauma-initial-abdomen.duodenal-complex`, `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.evacuate`

**Explanation:** The smaller image has not translated into restored passage after a prolonged nonoperative course. Escalation to decompression of the persisting wall lesion is supported rather than simply extending the unchanged plan or bypassing an otherwise preserved duodenum.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation`, `claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution`, `claim.trauma-initial-abdomen.duodenal-hematoma`, `claim.trauma-initial-abdomen.duodenal-complex`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "The lead-in asks a neutral plan after actual care rather than recognizing an untreated hematoma. Reduced size and improved pain create a credible reason to continue; clamp-trial failure and the persistent anatomic obstruction must be integrated.",
  "sameStageAndCategory": "All choices are management strategies for persistent obstruction after a completed conservative course.",
  "twoConsequentialSteps": {
    "interpret": "Separate radiographic shrinkage and improved pain from persistent failure of luminal passage.",
    "apply": "Escalate the obstructing wall lesion without automatically performing a bypass for destructive injury."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Continued observation is credible because the image is smaller and physiology is improved, but function has not recovered over the documented prolonged course.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.observe",
    "decidingObservation": "Persistent functional obstruction after sixteen days despite a smaller wall collection and adequate conservative care",
    "consequenceOfClosestError": "Continued conservative care is appropriate during a resolving course, but the record shows ongoing functional obstruction despite prolonged treatment. A smaller collection alone does not establish successful passage.",
    "counterfactualChange": "If this were an earlier resolving course with declining drainage and successful clamp/intake trials, continued decompression and reassessment would be supported.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.observe",
    "counterfactualResolution": "An earlier or clinically resolving course shows falling drainage and successful reintroduction of intake without perforation."
  },
  "deletionTest": {
    "actualResolution": "Without the actual treatment duration and failed passage, the smaller contained wall lesion supports continued conservative care. Without preserved wall anatomy, direct evacuation versus bypass cannot be ranked.",
    "sentenceAndExhibitJobs": "The clinical course supplies treatment response; current examination keeps perforation/instability from silently driving the choice; repeat CT distinguishes a persistent mural obstruction from destructive injury.",
    "repairLog": "Moved scoring to a supported reassessment boundary and explicitly versioned the changed objective. The 14-day guideline boundary is directly sourced; sixteen days is a constructed patient course, not a mandatory universal operative deadline."
  },
  "wholeVisibleSequence": "The next node explicitly states findings discovered during exploration. It does not imply that every uncomplicated wall hematoma perforates or requires surgery.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All choices are management strategies for persistent obstruction after a completed conservative course.",
    "cueDisposition": "The lead-in asks a neutral plan after actual care rather than recognizing an untreated hematoma. Reduced size and improved pain create a credible reason to continue; clamp-trial failure and the persistent anatomic obstruction must be integrated."
  }
}
```

Visible-sequence constraint: The next node explicitly states findings discovered during exploration. It does not imply that every uncomplicated wall hematoma perforates or requires surgery.

Material meaning change; prior FSRS history is not transferred:

```json
{
  "previousConceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
  "reason": "The old meaning tested initial conservative care. This version tests failure of a completed nonoperative course; retain the old initial-care concept/history separately.",
  "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history."
}
```

### duodenum-repair-scope — revised

Independent review: `question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [
    "'A small part of the circumference' is vague when the extent and technical repairability of the defect are central to choosing primary repair versus resection.",
    "The new fever and deterioration are followed by operative anatomy but no current physiologic state, contamination description or closure-feasibility observations. Earlier stability cannot be silently carried into this operation."
  ],
  "cues": [],
  "fairness": [
    "Primary transverse repair is likely best for the intended limited viable defect, and routine pyloric exclusion is not established by the supplied facts. I do not identify a confident clinical error in the intended key.",
    "The full ranking against resection requires adequate description of whether closure preserves the lumen without tension; well-perfused edges and a vaguely small defect are incomplete substitutes for that assessment.",
    "This could test two consequential steps: interpret the local injury and surrounding structures, then choose the appropriate repair extent. Current omissions must not supply its difficulty.",
    "The interval deterioration and discovered perforation can follow the prior wall injury, and the new operative findings are understandable independently. Do not imply that perforation is the expected routine course of uncomplicated intramural hematoma. Prior feedback does not give the repair answer."
  ],
  "suggestions": [
    "Provide concrete defect geometry and tissue/approximation observations, plus a concise current physiologic and contamination assessment. Use source-supported facts rather than inventing a cutoff.",
    "Re-rank primary repair, resection and adjunctive diversion with those findings present, and explain why the nearest alternative is less appropriate in this exact delayed presentation."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "Defect length and circumferential extent are observed; edge perfusion, approximation, lumen caliber, current support and contamination are explicit."
  ],
  "cueResolutions": [
    "Exact options and visible data manually attacked as recorded in the revised author gate."
  ],
  "fairnessResolutions": [
    "Supplied concrete patient geometry, tissue response, lumen/traction observations and a current systemic/contamination assessment. Measurements are fictional findings, not invented treatment cutoffs."
  ],
  "sourceBoundary": "WSES duodenopancreatic 2019 supports tension-free viable direct repair when feasible and physiology allows it. The 3-cm/quarter-circumference findings are fictional geometry rather than treatment thresholds.",
  "authorDifficultyDisposition": "Fair moderate retained because the raw-evidence inference and clinical application are distinct and the reported clarity/fairness problems are addressed. No hard rating or basic exception is claimed."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.duodenum-repair-scope.v1",
  "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "45b73b482b12361c785ea8be54b273fdab7e64bf6c3c8fec0c082c9ea0507da7",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1\")",
  "before": null
}
```

**Patient and frame:** Ava Parker; 34 years; Female. Chief complaint: Vomiting after impact.

{patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
    "prototypeDemographics": {
      "ageYears": 34,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Vomiting after impact",
    "presentation": "{patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.

**Historical hospital phase/acuity:** `trauma_operating_room` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** After interval improvement, new fever and worsening tenderness lead to repeat imaging and exploration. A localized D2 lateral-wall perforation is found beside the prior wall injury. After debridement, the defect involves a small part of the circumference with well-perfused edges. The ampulla, distal bile duct and pancreatic head are intact.

_No separate exhibit._

**Complete task:** Which repair should be selected for {patientName}'s duodenal injury at this operation?

**key shown first for review only.** Runtime choices are randomized.

1. **Primary transverse duodenal repair** — KEY

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.primary`.

   Post-answer rationale: Localized viable anatomy permits primary repair rather than routine resection or diversion. Intact neighboring ductal and pancreatic structures exclude a destructive complex injury.

   Credible error: Key

   Reasonable counterfactual: A well-exposed injury can be repaired without tension or luminal compromise after debridement.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`. Timing profile: `no_test`.

2. **Duodenal resection with duodenoduodenostomy**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.resection`.

   Post-answer rationale: Resection may be needed when direct repair cannot be achieved; this localized viable defect does not establish that need.

   Credible error: Treat delayed recognition as a mandate for resection despite current anatomy.

   Reasonable counterfactual: A segment cannot be directly repaired but safely permits resection/anastomosis.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`. Timing profile: `no_test`.

3. **Duodenal repair with pyloric exclusion**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.exclusion`.

   Post-answer rationale: Pyloric exclusion is not routinely required for an otherwise repairable localized laceration.

   Credible error: Add diversion just because the injury involves D2.

   Reasonable counterfactual: A selected severe/complex injury leads the team to consider ancillary diversion; no automatic rule applies.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`, `claim.trauma-initial-abdomen.duodenal-complex`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.primary`

**Explanation:** Localized viable anatomy permits primary repair rather than routine resection or diversion. Intact neighboring ductal and pancreatic structures exclude a destructive complex injury.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`, `claim.trauma-initial-abdomen.duodenal-complex`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
  "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "252c6c6bef212d83977aa858394f5ec9d8f692ce90d885352ef79dba11c81219",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.duodenum-repair-scope.v1",
    "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair",
    "exactDraftSha256": "45b73b482b12361c785ea8be54b273fdab7e64bf6c3c8fec0c082c9ea0507da7",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Ava Parker; 34 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 34,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 34-year-old woman evaluated after blunt epigastric compression during a collision."
  }
]
```

**Objective:** Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.

**Historical hospital phase/acuity:** `trauma_operating_room` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** At the outside hospital exploration for persistent obstruction, a separate lateral D2 tear is identified beside the contused wall. After debridement, the defect is 3 cm long and spans about one quarter of the circumference. Edges bleed on contact. Temporary edge approximation needs no traction and leaves the lumen similar in caliber to the adjacent uninjured duodenum. The ampulla, distal bile duct and pancreatic head are intact.

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Current physiology | BP 118/72 mmHg, temperature 36.9 C and arterial pH 7.37 after hemorrhage control; no ongoing blood or vasopressor requirement. |
| Contamination | Localized bile staining beside D2; no diffuse enteric soilage or uncontrolled bleeding. |

**Complete task:** At this documented operation, which repair should be recommended for {patientName}'s duodenal defect?

**key shown first for review only.** Runtime choices are randomized.

1. **Primary transverse duodenal repair** — KEY

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.primary`.

   Post-answer rationale: The current geometry, perfused edges and tolerated approximation support direct repair despite delayed discovery. Preserved neighboring structures and recovered physiology do not establish a need for larger resection or routine exclusion.

   Credible error: Key

   Reasonable counterfactual: A well-exposed viable defect can be repaired without tension or luminal compromise in the current operative state.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`. Timing profile: `no_test`.

2. **Duodenal resection with duodenoduodenostomy**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.resection`.

   Post-answer rationale: Resection is appropriate if direct repair cannot preserve viable tissue and lumen. The present approximation observations show that a larger resection is not needed for that purpose.

   Credible error: Let delayed discovery or D2 location override observed repair feasibility.

   Reasonable counterfactual: A segment cannot be directly repaired but permits safe resection and anastomosis.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`. Timing profile: `no_test`.

3. **Duodenal repair with pyloric exclusion**

   ID: `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.exclusion`.

   Post-answer rationale: Routine exclusion is not established for a viable defect that can be directly repaired. The record does not show destructive ampullary/head injury, failed local repair or current physiologic collapse.

   Credible error: Add diversion solely because this is a delayed D2 injury.

   Reasonable counterfactual: A selected severe complex injury leads the specialist team to consider an ancillary diversion, without a universal rule.

   Claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`, `claim.trauma-initial-abdomen.duodenal-complex`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.primary`

**Explanation:** The current geometry, perfused edges and tolerated approximation support direct repair despite delayed discovery. Preserved neighboring structures and recovered physiology do not establish a need for larger resection or routine exclusion.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.duodenal-primary-repair`, `claim.trauma-initial-abdomen.duodenal-complex`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Concrete geometry and actual approximation replace vaguely small. No sentence calls the defect repairable or names the primary/transverse key; the local functional observations are necessary fairness data.",
  "sameStageAndCategory": "All choices are duodenal repair strategies after the decision to explore has already occurred.",
  "twoConsequentialSteps": {
    "interpret": "Assess present tissue/geometry and lumen preservation rather than infer irreparability from delay or D2 location.",
    "apply": "Choose the least extensive adequate repair in a recovered patient with localized contamination and intact adjacent structures."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Resection is credible because the defect is delayed and lies in D2; the observed viable, tension-free approximation resolves it.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.resection",
    "decidingObservation": "Viable limited tissue with approximation preserving lumen and no current physiologic or destructive-anatomy barrier",
    "consequenceOfClosestError": "Resection is appropriate if direct repair cannot preserve viable tissue and lumen. The present approximation observations show that a larger resection is not needed for that purpose.",
    "counterfactualChange": "If approximation instead constricts the lumen or requires tension while a viable segmental anastomosis is achievable, duodenoduodenostomy becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.duodenum-repair-scope.r2.resection",
    "counterfactualResolution": "A segment cannot be directly repaired but permits safe resection and anastomosis."
  },
  "deletionTest": {
    "actualResolution": "Without approximation/lumen observations, the ranking against resection is incomplete. Removing the current physiology/contamination reintroduces an unresolved damage-control question rather than legitimate difficulty.",
    "sentenceAndExhibitJobs": "Measured geometry and perfusion address defect extent. Approximation records technical feasibility. Current support and contamination prevent carrying old stability into a new operation.",
    "repairLog": "Supplied concrete patient geometry, tissue response, lumen/traction observations and a current systemic/contamination assessment. Measurements are fictional findings, not invented treatment cutoffs."
  },
  "wholeVisibleSequence": "The preceding revised node concerns persistent obstruction. This update identifies a separate tear at exploration; it does not claim perforation is the routine course or disclose the repair answer in preceding feedback.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All choices are duodenal repair strategies after the decision to explore has already occurred.",
    "cueDisposition": "Concrete geometry and actual approximation replace vaguely small. No sentence calls the defect repairable or names the primary/transverse key; the local functional observations are necessary fairness data."
  }
}
```

Visible-sequence constraint: The preceding revised node concerns persistent obstruction. This update identifies a separate tear at exploration; it does not claim perforation is the routine course or disclose the repair answer in preceding feedback.

### renal-contained-hematoma — pass-preserved

Independent review: `question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1` / PASS. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "moderate",
  "twoStep": true,
  "clarityIssues": [],
  "cues": [],
  "fairness": [
    "Leaving the renal compartment undisturbed is the defensible best answer. The learner must separate the active mesenteric hemorrhage from a contained nonexpanding lateral hematoma, then resist opening the renal compartment simply because the patient is unstable.",
    "Instability supplies a real competing consideration. The hematoma behavior and separate bleeding source are necessary discriminators, not decorative negatives. The options have parallel surgical scope and grammar.",
    "The standalone operative context is adequate. No confident clinical inaccuracy or nonmedical wording shortcut identified. This conclusion is limited to the described blunt, contained renal hematoma; it is not a rule for every retroperitoneal hematoma."
  ],
  "suggestions": [
    "Preserve the blunt mechanism, stable hematoma behavior and identified separate hemorrhage source. Avoid exporting the explanation to expanding, pulsatile or otherwise differently situated hematomas."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "PASS",
  "status": "pass-preserved",
  "revisionAttempts": 0,
  "clinicalPayloadSha256": "ad8250289a19bed56c89ecfde040e68f773811367532e7bc7ec1d6e2ea2f3829",
  "settingOnlyException": "Owner-authorized neutral clinic wrapper; all reviewed clinical data, options, key, evidence, explanations and patient facts remain exact.",
  "suggestionsDisposition": "No optional clinical/feedback wording change applied to an exact PASS item.",
  "clarityResolutions": [
    "PASS clinical wording and patient facts preserved exactly; neutral clinic frame separately versioned."
  ],
  "cueResolutions": [
    "Optional suggestions not applied because PASS is frozen."
  ],
  "fairnessResolutions": [
    "Independent PASS clinical payload preserved by hash; no new quality or clinical approval inferred for the neutral clinic frame."
  ]
}
```

Clinical before and after are structurally identical. Original full draft SHA-256: `1fc4e112ac4a75bd6cd4c7d6f336c93b47aa69049604cf8bef80b6bb9e074fad`. Frozen clinical payload SHA-256: `ad8250289a19bed56c89ecfde040e68f773811367532e7bc7ec1d6e2ea2f3829`. Original presentation, complaint, demographics and profile remain exact in `reviewedSnapshot` and `outsideRecordProfiles`. The only presentational change is the owner-authorized neutral clinic frame shown below.

#### Preserved clinical item in the current clinic frame

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
  "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "24ac3318754198034171fb1eed6d393290b6461b5b90ecce6632b432595ecbc8",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1\")",
  "before": null
}
```

**Patient and frame:** Noah Reed; 52 years; Male. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 52-year-old man undergoing laparotomy after blunt abdominal injury.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.contained-renal-compartment.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 52,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 52-year-old man undergoing laparotomy after blunt abdominal injury."
  }
]
```

**Objective:** Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.

**Historical hospital phase/acuity:** `trauma_operating_room` / `obvious_emergency`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Operative record | Emergency laparotomy for abdominal bleeding; active mesenteric bleeding identified; BP remains low during blood resuscitation |
| Renal compartment | Lateral perirenal hematoma stays the same size during exposure; no pulsation, free rupture or progressive expansion |

**Complete task:** What renal surgical action should be taken for {patientName} during this exploration?

**key shown first for review only.** Runtime choices are randomized.

1. **Leave Gerota fascia and kidney undisturbed** — KEY

   ID: `choice.topic.trauma-initial-abdomen.renal-contained-hematoma.leave`.

   Post-answer rationale: This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.

   Credible error: Key

   Reasonable counterfactual: Nonexpanding zone-II hematoma encountered during exploration of an unstable adult.

   Claims: `claim.trauma-initial-abdomen.contained-zone-two`. Timing profile: `no_test`.

2. **Open Gerota fascia and repair the kidney**

   ID: `choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair`.

   Post-answer rationale: An unchanged contained hematoma with a separate active source does not establish a need for renal exploration. Expansion or demonstrable renal hemorrhage would change that assessment.

   Credible error: Assign systemic instability to every hematoma encountered.

   Reasonable counterfactual: The hematoma expands and renal bleeding requires control, with preservation attempted when feasible.

   Claims: `claim.trauma-initial-abdomen.contained-zone-two`, `claim.trauma-initial-abdomen.renal-preservation`. Timing profile: `no_test`.

3. **Open Gerota fascia and remove the kidney**

   ID: `choice.topic.trauma-initial-abdomen.renal-contained-hematoma.nephrectomy`.

   Post-answer rationale: Automatic nephrectomy is not supported by an unchanged hematoma with a separate active source; even required intervention may permit preservation.

   Credible error: Use shock as a mandate for renal removal without localizing hemorrhage.

   Reasonable counterfactual: Renal hemorrhage requires intervention and preservation cannot control it.

   Claims: `claim.trauma-initial-abdomen.contained-zone-two`, `claim.trauma-initial-abdomen.renal-preservation`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.renal-contained-hematoma.leave`

**Explanation:** This renal hematoma remains contained and nonexpanding while a separate injury accounts for active bleeding. Instability alone does not require opening a stable zone-II hematoma.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.contained-zone-two`, `claim.trauma-initial-abdomen.renal-preservation`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
  "coverTheKey": "The task avoids the stable-hematoma label. Direct repeated observations show containment. All choices are renal surgical actions; the rule remains limited to zone II.",
  "sameStageAndCategory": "Renal-compartment action during the same hemorrhage-control operation.",
  "twoConsequentialSteps": {
    "interpret": "Separate patient instability from an unchanged renal compartment and identify the active mesenteric source.",
    "apply": "Leave the contained zone-II hematoma undisturbed rather than explore every retroperitoneal finding during control."
  },
  "residentDifficulty": {
    "prediction": "hard",
    "basis": "Assign systemic instability to every hematoma encountered.",
    "measured": false,
    "remainingConcern": "EAST recommendation is conditional and low-quality; do not generalize to other zones or penetrating central vascular injuries. Independent editorial and clinical review remain required."
  },
  "singleBest": {
    "decidingObservation": "unchanged nonexpanding perirenal hematoma with another active bleeding source",
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair",
    "consequenceOfClosestError": "Opening a contained hematoma can release tamponade. Exploration becomes appropriate if it expands or is an uncontrolled renal source.",
    "counterfactualChange": "Replace the unchanged hematoma with progressive expansion and renal hemorrhage; exploration and kidney-preserving repair become appropriate when feasible.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.renal-contained-hematoma.repair",
    "counterfactualResolution": "The hematoma expands and renal bleeding requires control, with preservation attempted when feasible."
  },
  "deletionTest": {
    "deciderAblation": "Removing unchanged nonexpanding perirenal hematoma with another active bleeding source removes the stated boundary preferring the key. Do not supply an unseen finding.",
    "contextJobs": [
      "Name and consistent age/sex fix identity.",
      "Mechanism and anatomy establish the clinical question.",
      "Current response, acquisition or tissue findings resolve the competing plan."
    ],
    "repairLog": "Omitted pre-answer diagnosis/eligibility conclusions and procedure-availability permissions; retained necessary acquisition, anatomy and current response. No invented clinical cutoff or wait duration. Author repair: Named the same compartment across the operative choices rather than echoing perirenal hematoma only in the key. Kept hematoma-size and independent bleeding-source observations; removed an unsupported explanatory tamponade mechanism from the foil rationale.",
    "actualResolution": "Delete serial size observations and an expanding renal hematoma remains possible. Delete the separate active source and the attribution of shock requires reassessment. These are observations, not a label saying stable.",
    "sentenceAndExhibitJobs": "Repeated compartment observations establish containment; the active mesenteric source separates systemic instability from an operative renal indication."
  },
  "wholeVisibleSequence": "Single node. No earlier explanation supplies this renal preservation decision.",
  "finiteProfiles": "One exact constructed adult profile; no demographic recombination.",
  "statisticsException": false,
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "exactLabelReview": "Re-solved the exact current options with the deciding observation and counterfactual; Renal-compartment action during the same hemorrhage-control operation. EAST recommendation is conditional and low-quality; do not generalize to other zones or penetrating central vascular injuries.",
    "cueDisposition": "The task avoids the stable-hematoma label. Direct repeated observations show containment. All choices are renal surgical actions; the rule remains limited to zone II.",
    "independent": false,
    "clinicalApproval": false
  }
}
```

Visible-sequence constraint: Single node. No earlier explanation supplies this renal preservation decision.

### jejunum-primary-repair — revised

Independent review: `question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1` / REVISE. Exact review SHA-256: `39df185c9f8a8debebba72a6aaaa8f8236b86eaa43cef84b1eb32bde20b8c1ba`.

Review issues and suggestions:

```json
{
  "difficulty": "easy",
  "twoStep": false,
  "clarityIssues": [],
  "cues": [
    {
      "phrase": "Segmental jejunal resection with anastomosis / Segmental jejunal resection with enterostomy",
      "why": "Both distractors share resection while the key is the only limited repair. Against the repeated limited-defect and intact-tissue descriptions, this creates a conspicuous least-extensive-treatment shortcut. This is weaker than a unique-word giveaway, but reinforces the poor distractor competition."
    }
  ],
  "fairness": [
    "Primary suture repair is the defensible best treatment for the small antimesenteric defect with perfused edges and intact mesentery in a resuscitated patient. No confident clinical inaccuracy identified.",
    "The anatomy and physiology all favor the same uncomplicated repair rule. Segmental resection is unnecessary in the stated defect, and enterostomy is still less competitive. Multiple reassuring facts do not create two consequential inferences.",
    "The standalone case is clear and complete. The approximate circumference is an observed constructed injury description, not presented as a universal treatment threshold."
  ],
  "suggestions": [
    "Accept as foundational bowel-repair recognition explicitly, or develop a source-supported repair-versus-resection decision with a real tension between defect extent, tissue viability and reconstruction feasibility.",
    "Use plausible alternatives for the actual operative stage; do not make a stoma a disposable extreme or add unsupported physiologic thresholds to force complexity."
  ]
}
```

Recorded response (one attempt for every returned item; zero for frozen PASS):

```json
{
  "reviewedQuestionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1",
  "reviewFile": "docs/research/question-topic-trauma-initial-abdomen-review-20261111.json",
  "reviewVerdict": "REVISE",
  "status": "revised",
  "revisionAttempts": 1,
  "clarityResolutions": [
    "No clarity issue was reported."
  ],
  "cueResolutions": [
    "Both foils no longer repeat resection against a uniquely limited key; enterostomy is removed. The new record gives actual conflicting size and perfusion evidence.",
    "Final label-parity check places the same jejunal site in all three options, eliminating an anatomical-word/resection convergence cue."
  ],
  "fairnessResolutions": [
    "Replaced the all-favorable repair rule with a size-versus-perfusion conflict and a realistic staged-reconstruction alternative. Explicit new meaning retains the old direct-repair identity and history."
  ],
  "sourceBoundary": "WSES bowel 2022 supports resection for mesenteric devascularization and individualized small-bowel reconstruction. No exact support or edema cutoff is claimed.",
  "authorDifficultyDisposition": "Retain as a fair moderate two-step candidate after resolving the reported clarity/fairness defects; do not inflate to hard or remove safety observations. New exact version still requires independent review."
}
```

#### Before — exact independently reviewed v1

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1",
  "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v1",
  "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v1",
  "conceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
  "previousConceptId": null,
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "exactDraftSha256": "3d2cb0b64294edb6a668454529e257ffb435922cd98ebb4ae9a13cb65ec7c8d6",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1\")",
  "before": null
}
```

**Patient and frame:** Elena Brooks; 28 years; Female. Chief complaint: Abdominal wound.

{patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury.

Exact finite profile(s):

```json
[
  {
    "id": "profile.topic.trauma-initial-abdomen.limited-jejunum-defect.v1",
    "prototypeDemographics": {
      "ageYears": 28,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Abdominal wound",
    "presentation": "{patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury.",
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
]
```

**Objective:** Use tissue viability and defect extent to choose repair rather than resection or diversion.

**Historical hospital phase/acuity:** `trauma_operating_room` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed trauma record; fictional observations

| Field | Recorded observation |
|---|---|
| Bowel examination | One antimesenteric jejunal defect involving about one fifth of the circumference; perfused edges after debridement; adjacent bowel and mesentery intact |
| Physiology | Bleeding controlled; BP 124/72 mmHg without vasopressor; temperature 36.8 C; no ongoing blood requirement |

**Complete task:** Which bowel procedure should be selected for {patientName}'s jejunal injury?

**key shown first for review only.** Runtime choices are randomized.

1. **Primary jejunal suture repair** — KEY

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.repair`.

   Post-answer rationale: The limited defect and viable bowel/mesentery support primary repair rather than resection of usable bowel or diversion.

   Credible error: Key

   Reasonable counterfactual: Viable nondestructive small-bowel defect that can close without narrowing.

   Claims: `claim.trauma-initial-abdomen.small-bowel-repair`. Timing profile: `no_test`.

2. **Segmental jejunal resection with anastomosis**

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.resect`.

   Post-answer rationale: Resection treats destructive or devascularized tissue, but neither is demonstrated in this limited perfused defect.

   Credible error: Treat every full-thickness injury as requiring resection.

   Reasonable counterfactual: The segment is devascularized or has destructive loss beyond safe repair.

   Claims: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`. Timing profile: `no_test`.

3. **Segmental jejunal resection with enterostomy**

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.stoma`.

   Post-answer rationale: Current viability and restored physiology do not justify resection and diversion for this limited defect.

   Credible error: Import a diversion heuristic into favorable limited small-bowel injury.

   Reasonable counterfactual: A destructive segment needs resection and physiology/perfusion makes an anastomosis unsafe.

   Claims: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.repair`

**Explanation:** The limited defect and viable bowel/mesentery support primary repair rather than resection of usable bowel or diversion.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.bowel-resection-risk`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

#### After — revised v2 clinic candidate

```json
{
  "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
  "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
  "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
  "conceptId": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
  "previousConceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  "exactDraftSha256": "7b4da759880a18c5d4ad5c3c8474b5e4059de4e203f76db7c5bd0ecbe2140ef8",
  "reviewStatus": "needs_clinician_review",
  "clinicalApproval": null,
  "sourceFile": "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
  "exportLocator": "QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.find(q => q.id === \"question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2\")",
  "before": {
    "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1",
    "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v1",
    "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v1",
    "conceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
    "exactDraftSha256": "3d2cb0b64294edb6a668454529e257ffb435922cd98ebb4ae9a13cb65ec7c8d6",
    "snapshotLocator": "reviewedSnapshot.nodes",
    "reviewVerdict": "REVISE"
  }
}
```

**Patient and frame:** Elena Brooks; 28 years; Female. Chief complaint: Trauma follow-up.

{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury.

Exact finite profile(s):

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "profile.topic.trauma-initial-abdomen.limited-jejunum-defect.clinic-review.v2",
    "prototypeDemographics": {
      "ageYears": 28,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Trauma follow-up",
    "presentation": "{patientName} attends clinic for trauma follow-up. As the clinic founder, you review the outside-hospital records below. Each question's 'now' refers to the recorded hospital decision point. Outside-hospital record: {patientName} is a 28-year-old woman undergoing laparotomy after a penetrating abdominal wound. A complete bowel examination identifies one jejunal injury."
  }
]
```

**Objective:** Choose the extent and reconstruction timing for a small wall defect with segmental mesenteric devascularization.

**Historical hospital phase/acuity:** `trauma_operating_room` / `urgent_stable`. Current clinic acuity is a separate case field.

**Current recorded update:** _None._

Constructed outside-hospital record; fictional observations

| Field | Recorded observation |
|---|---|
| Bowel examination | The antimesenteric opening involves about one fifth of the circumference. Across the adjacent segment, mesentery is torn away from the bowel. That segment remains grey and noncontractile after nearby bowel becomes pink with warming; its cut margins do not bleed. Bowel beyond both ends is pink with visible mesenteric pulsation. |
| Current physiology | Bleeding is controlled; BP 124/72 mmHg, temperature 36.8 C and pH 7.36. There is no further blood or vasopressor requirement, marked bowel edema or diffuse soilage. |

**Complete task:** At the documented laparotomy, which bowel plan should be recommended for {patientName}'s jejunal injury?

**key shown first for review only.** Runtime choices are randomized.

1. **Jejunal resection with immediate anastomosis** — KEY

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.resect`.

   Post-answer rationale: The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.

   Credible error: Key

   Reasonable counterfactual: A nonviable segment requires resection and the remaining bowel/physiology permit anastomosis.

   Claims: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.small-bowel-anastomosis-selection`. Timing profile: `no_test`.

2. **Jejunal repair with direct suture closure**

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair`.

   Post-answer rationale: Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.

   Credible error: Use defect circumference as the only repair criterion and overlook the blood supply.

   Reasonable counterfactual: The small defect has viable bowel edges and intact mesenteric perfusion.

   Claims: `claim.trauma-initial-abdomen.small-bowel-repair`. Timing profile: `no_test`.

3. **Jejunal resection with deferred reconstruction**

   ID: `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.defer`.

   Post-answer rationale: Staged reconstruction can be appropriate when physiology, perfusion or ongoing control tasks remain unresolved. The current healthy margins and restored course support completing continuity rather than defaulting to discontinuity.

   Credible error: Treat the earlier traumatic hemorrhage as a continuing indication to defer despite current recovery.

   Reasonable counterfactual: Ongoing resuscitation, uncertain remaining bowel viability or other unfinished damage-control tasks makes reconstruction inappropriate now.

   Claims: `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`, `claim.trauma-initial-abdomen.small-bowel-anastomosis-selection`. Timing profile: `no_test`.

**Key:** `choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.resect`

**Explanation:** The small wall opening understates the injury: the separated mesentery and nonrecovering segment require resection. Healthy adjacent bowel and restored physiology support reconstruction rather than leaving a staged discontinuity in this record.

All clinical interpretation/management claims: `claim.trauma-initial-abdomen.small-bowel-repair`, `claim.trauma-initial-abdomen.small-bowel-anastomosis-selection`, `claim.trauma-initial-abdomen.damage-control`, `claim.trauma-initial-abdomen.keep-open`. Exact option/author-gate mappings are in `clinicalStatementMappings` in the JSON packet.

Manual author gate (author self-check only):

```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "independent": false,
  "clinicalApproval": false,
  "authorVerdict": "REVISED_DRAFT_REQUIRES_INDEPENDENT_REVIEW",
  "statisticsException": false,
  "coverTheKey": "Removed the disposable enterostomy extreme and the least-extensive-repair key. A small defect now conflicts with lost mesenteric supply; the two resection plans differ on a consequential current reconstruction boundary rather than decorative wording. All three labels now name the jejunal site; the key cannot be selected by combining a site word from one foil with a resection word from another.",
  "sameStageAndCategory": "All three are bowel operative plans at the same laparotomy, comparing repair, resection/reconstruction and staged discontinuity.",
  "twoConsequentialSteps": {
    "interpret": "A small antimesenteric opening does not establish a viable segment when the mesentery is detached and the bowel fails to recover beside responding bowel.",
    "apply": "Resect that segment and use current viable margins/physiologic recovery to choose reconstruction rather than automatic delay."
  },
  "residentDifficulty": {
    "prediction": "moderate",
    "basis": "Direct repair is a credible under-treatment error if the learner uses defect size and ignores the separate blood-supply finding.",
    "measured": false,
    "remainingConcern": "Fair moderate author prediction; independent review of the new exact version is still required."
  },
  "singleBest": {
    "closestChoiceId": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair",
    "decidingObservation": "Nonrecovering bowel after mesenteric separation despite a limited wall defect, with viable neighboring bowel and restored physiology",
    "consequenceOfClosestError": "Suture closure would address the visible opening but leave the segment whose perfusion has not recovered after mesenteric separation.",
    "counterfactualChange": "If the mesentery is intact and the limited defect has viable responding edges, direct suture closure becomes appropriate.",
    "counterfactualChoiceId": "choice.topic.trauma-initial-abdomen.jejunum-primary-repair.r2.repair",
    "counterfactualResolution": "The small defect has viable bowel edges and intact mesenteric perfusion."
  },
  "deletionTest": {
    "actualResolution": "Delete the mesenteric/segment-response findings and the small defect favors direct repair. Delete restored physiology and healthy neighboring bowel and the immediate-versus-staged reconstruction choice becomes unresolved.",
    "sentenceAndExhibitJobs": "Circumference creates the close repair temptation; mesenteric separation and response establish the actual segment injury; current margins/physiology determine whether the resection can be reconstructed.",
    "repairLog": "Replaced the all-favorable repair rule with a size-versus-perfusion conflict and a realistic staged-reconstruction alternative. Explicit new meaning retains the old direct-repair identity and history. Label-parity check also removed the site/resection convergence pattern."
  },
  "wholeVisibleSequence": "Single clinic record-review node. No prior feedback supplies either the resection or reconstruction decision.",
  "finiteProfiles": "One exact clinic chart-review profile. Hospital physiology is historical record data; current clinic acuity is separate.",
  "postRepairReview": {
    "checkedOn": "2026-11-11",
    "clinicalApproval": false,
    "independent": false,
    "exactLabelReview": "All three are bowel operative plans at the same laparotomy, comparing repair, resection/reconstruction and staged discontinuity.",
    "cueDisposition": "Removed the disposable enterostomy extreme and the least-extensive-repair key. A small defect now conflicts with lost mesenteric supply; the two resection plans differ on a consequential current reconstruction boundary rather than decorative wording."
  }
}
```

Visible-sequence constraint: Single clinic record-review node. No prior feedback supplies either the resection or reconstruction decision.

Material meaning change; prior FSRS history is not transferred:

```json
{
  "previousConceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
  "reason": "The old meaning was direct repair of a nondestructive viable defect. The new conflict is a small hole with a devascularized segment and recovered systemic physiology; do not move old direct-repair history to this meaning.",
  "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history."
}
```

## Identity, history and frozen-version preservation

Nine PASS tasks, options, keys, feedback, exhibits, evidence and original patient records are unchanged. Exact clinical-payload hashes are above and regression-tested. PASS author gates also remain exact. Neutral clinic framing has separate v2 case/profile/presentation identities and remains unapproved.

Six revised active items retain their original concept IDs because the clinical meaning is unchanged. Three changed objectives use explicit new meanings; old definitions and histories remain retained. No FSRS, saved encounter or live definition was edited. All 22 independently reviewed originals are retained in `reviewedSnapshot` with their original hashes.

```json
[
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.unstable-abdominal-operative-rescue",
    "displayName": "Abdominal hemorrhage requiring operative rescue",
    "learningObjective": "Use current resuscitation response and evidence of abdominal hemorrhage to select urgent operative control rather than transport or repeat endovascular care.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-operative-route.v2",
      "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation",
      "claim.trauma-initial-abdomen.splenic-failure",
      "claim.trauma-initial-abdomen.splenic-embolization"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-operative-route.v1",
      "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation",
      "claim.trauma-initial-abdomen.splenic-failure",
      "claim.trauma-initial-abdomen.splenic-embolization"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.damage-control-abbreviated-laparotomy",
    "displayName": "Choose damage control rather than definitive reconstruction during worsening operative physiology.",
    "learningObjective": "Choose damage control rather than definitive reconstruction during worsening operative physiology.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.bowel-resection-risk"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.bowel-resection-risk",
      "claim.trauma-initial-abdomen.fascial-closure",
      "claim.trauma-initial-abdomen.liver-nonoperative",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.hepatic-devascularized-complication"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.post-damage-control-fascial-closure",
    "displayName": "Recognize when the original indication for an open abdomen has resolved.",
    "learningObjective": "Recognize when the original indication for an open abdomen has resolved.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.temporary-negative-pressure",
      "claim.trauma-initial-abdomen.fascial-closure",
      "claim.trauma-initial-abdomen.planned-hernia-fallback"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.crash-fascial-closure.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.fascial-closure",
      "claim.trauma-initial-abdomen.keep-open",
      "claim.trauma-initial-abdomen.planned-hernia-fallback",
      "claim.trauma-initial-abdomen.temporary-negative-pressure"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.equivocal-bowel-inpatient-observation",
    "displayName": "Choose monitored assessment after nonspecific bowel/mesenteric CT findings.",
    "learningObjective": "Choose monitored assessment after nonspecific bowel/mesenteric CT findings.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.stable-ct"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.stable-ct"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "displayName": "Choose bowel-directed reassessment when suspicion evolves after equivocal CT.",
    "learningObjective": "Choose bowel-directed reassessment when suspicion evolves after equivocal CT.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
      "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.unstable-positive-fast"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
      "claim.trauma-initial-abdomen.stable-ct",
      "claim.trauma-initial-abdomen.bowel-direct-sign"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.bowel-wall-defect-exploration",
    "displayName": "Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.",
    "learningObjective": "Act on a direct bowel-injury finding rather than continue the equivocal-scan pathway.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.biloma-drainage"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.bowel-direct-sign",
      "claim.trauma-initial-abdomen.equivocal-bowel-observe",
      "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.splenic-arterial-embolization",
    "displayName": "Choose an organ-preserving hemostatic route from active arterial findings and sustained stability.",
    "learningObjective": "Choose an organ-preserving hemostatic route from active arterial findings and sustained stability.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.splenic-embolization",
      "claim.trauma-initial-abdomen.splenic-observation",
      "claim.trauma-initial-abdomen.splenic-failure",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.splenic-embolization",
      "claim.trauma-initial-abdomen.splenic-observation",
      "claim.trauma-initial-abdomen.splenic-failure",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.stable-high-grade-liver-observation",
    "displayName": "Choose observation for a stable isolated high-grade hepatic injury without an operative indication.",
    "learningObjective": "Choose observation for a stable isolated high-grade hepatic injury without an operative indication.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.liver-nonoperative",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.hepatic-devascularized-complication"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.liver-nonoperative",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.hepatic-devascularized-complication"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.posttraumatic-hepatic-pseudoaneurysm",
    "displayName": "Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis.",
    "learningObjective": "Link delayed GI bleeding to traumatic hepatic vascular anatomy and select targeted hemostasis.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.liver-arterial-bleeding",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.traumatic-infected-biloma-drainage",
    "displayName": "Prioritize drainage of a localized infected traumatic bile collection.",
    "learningObjective": "Prioritize drainage of a localized infected traumatic bile collection.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.biloma-drainage",
      "claim.trauma-initial-abdomen.bile-leak-adjunct",
      "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.biloma-drainage",
      "claim.trauma-initial-abdomen.bile-leak-adjunct"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.persistent-pelvic-bleeding-packing",
    "displayName": "Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.",
    "learningObjective": "Recognize persistent nonarterial pelvic bleeding after completed arterial treatment.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-fast-limitation",
      "claim.trauma-initial-abdomen.unstable-positive-fast"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-fast-limitation",
      "claim.trauma-initial-abdomen.unstable-positive-fast"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.pelvic-arterial-rescue-embolization",
    "displayName": "Use a newly demonstrated arterial target after packing to choose repeat targeted control.",
    "learningObjective": "Use a newly demonstrated arterial target after packing to choose repeat targeted control.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.unstable-positive-fast",
      "claim.trauma-initial-abdomen.contrast-phase-interpretation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.traumatic-bladder-retrograde-cystography",
    "displayName": "Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.",
    "learningObjective": "Choose adequate bladder imaging after gross hematuria despite ordinary trauma CT.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-acquisition.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.bladder-cystography",
      "claim.trauma-initial-abdomen.passive-ct-insufficient",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.urethral-assessment"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-acquisition.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.bladder-cystography",
      "claim.trauma-initial-abdomen.passive-ct-insufficient",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.urethral-assessment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
    "displayName": "Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak.",
    "learningObjective": "Interpret cystographic distribution and select repair for an intraperitoneal traumatic leak.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.intraperitoneal-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder",
      "claim.trauma-initial-abdomen.complex-bladder",
      "claim.trauma-initial-abdomen.bladder-compartment-imaging"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.intraperitoneal-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder",
      "claim.trauma-initial-abdomen.complex-bladder",
      "claim.trauma-initial-abdomen.bladder-compartment-imaging"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.renal-deceleration-urographic-ct",
    "displayName": "Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.",
    "learningObjective": "Recognize upper-tract imaging needs despite absent hematuria after high-energy deceleration.",
    "conceptType": "workup",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.renal-deceleration-ct",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.stable-ct"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.renal-deceleration-ct",
      "claim.trauma-initial-abdomen.renal-excretory-phase",
      "claim.trauma-initial-abdomen.stable-ct"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.stable-renal-urinary-extravasation-observation",
    "displayName": "Choose initial observation for stable fully staged renal injury with limited collecting-system leakage.",
    "learningObjective": "Choose initial observation for stable fully staged renal injury with limited collecting-system leakage.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.renal-urine-observe",
      "claim.trauma-initial-abdomen.renal-urinoma-intervention",
      "claim.trauma-initial-abdomen.renal-preservation",
      "claim.trauma-initial-abdomen.renal-excretory-phase"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.renal-urine-observe",
      "claim.trauma-initial-abdomen.renal-urinoma-intervention",
      "claim.trauma-initial-abdomen.renal-preservation",
      "claim.trauma-initial-abdomen.renal-excretory-phase"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.distal-pancreatic-duct-transection-resection",
    "displayName": "Use duct disruption and injury location to select an operative pancreatic strategy.",
    "learningObjective": "Use duct disruption and injury location to select an operative pancreatic strategy.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.distal-pancreatic-duct",
      "claim.trauma-initial-abdomen.minor-pancreas",
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.distal-pancreatic-duct",
      "claim.trauma-initial-abdomen.minor-pancreas",
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
    "displayName": "Distinguish contained obstructing duodenal wall injury from perforation requiring repair.",
    "learningObjective": "Distinguish contained obstructing duodenal wall injury from perforation requiring repair.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.duodenal-hematoma",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.duodenal-mural-imaging",
      "claim.trauma-initial-abdomen.duodenal-hematoma-evacuation"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.duodenal-hematoma",
      "claim.trauma-initial-abdomen.duodenal-complex",
      "claim.trauma-initial-abdomen.duodenal-mural-imaging",
      "claim.trauma-initial-abdomen.duodenal-hematoma-evacuation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.repairable-duodenal-laceration-primary-repair",
    "displayName": "Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.",
    "learningObjective": "Choose adequate primary repair rather than routine diversion for a localized viable duodenal laceration.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.duodenal-primary-repair",
      "claim.trauma-initial-abdomen.duodenal-complex"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.duodenal-primary-repair",
      "claim.trauma-initial-abdomen.duodenal-complex"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.contained-zone-two-hematoma-preservation",
    "displayName": "Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.",
    "learningObjective": "Avoid renal exploration based on systemic instability when a contained hematoma is not the active source.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.contained-zone-two",
      "claim.trauma-initial-abdomen.renal-preservation"
    ],
    "active": true,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.contained-zone-two",
      "claim.trauma-initial-abdomen.renal-preservation"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
    "displayName": "Use tissue viability and defect extent to choose repair rather than resection or diversion.",
    "learningObjective": "Use tissue viability and defect extent to choose repair rather than resection or diversion.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": null,
    "meaningDecision": "new_meaning; no assigned registered/live/retained identity exists for this topic",
    "historyMigration": "None. Preserve all existing definitions, frozen encounters and FSRS histories.",
    "questionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.bowel-resection-risk"
    ],
    "active": false,
    "retainedReviewedQuestionVariantIds": [
      "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v1"
    ],
    "runtimeStageReason": "Existing clinic examination stage; independent of resident difficulty and historical hospital acuity.",
    "retainedReviewedEvidenceClaimIds": [
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.bowel-resection-risk"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.complicated-extraperitoneal-bladder-repair.v2",
    "displayName": "Complicated extraperitoneal bladder repair",
    "learningObjective": "Choose repair rather than a routine catheter pathway for an extraperitoneal bladder injury with an intravesical bone fragment.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": "concept.topic.trauma-initial-abdomen.intraperitoneal-bladder-repair",
    "meaningDecision": "The original meaning was traumatic intraperitoneal rupture repair. This version instead tests a specific exception to catheter management of an extraperitoneal injury; keep the old concept/history separate.",
    "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2"
    ],
    "retainedReviewedQuestionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.complex-bladder",
      "claim.trauma-initial-abdomen.extraperitoneal-bladder"
    ],
    "active": true,
    "runtimeStageReason": "Existing clinic examination stage; clinical complexity is separate."
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.duodenal-hematoma-persistent-obstruction.v2",
    "displayName": "Persistent obstruction after duodenal hematoma care",
    "learningObjective": "Use clinical course and repeat anatomy to choose escalation for persistent obstruction from a duodenal wall hematoma.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": "concept.topic.trauma-initial-abdomen.duodenal-wall-hematoma-observation",
    "meaningDecision": "The old meaning tested initial conservative care. This version tests failure of a completed nonoperative course; retain the old initial-care concept/history separately.",
    "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2"
    ],
    "retainedReviewedQuestionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.duodenal-hematoma-evacuation",
      "claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution",
      "claim.trauma-initial-abdomen.duodenal-hematoma",
      "claim.trauma-initial-abdomen.duodenal-complex"
    ],
    "active": true,
    "runtimeStageReason": "Existing clinic examination stage; clinical complexity is separate."
  },
  {
    "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.topic.trauma-initial-abdomen.mesenteric-devascularization-reconstruction.v2",
    "displayName": "Mesenteric devascularization and bowel reconstruction",
    "learningObjective": "Choose the extent and reconstruction timing for a small wall defect with segmental mesenteric devascularization.",
    "conceptType": "management",
    "earliestFacilityStage": 0,
    "previousConceptId": "concept.topic.trauma-initial-abdomen.nondestructive-small-bowel-primary-repair",
    "meaningDecision": "The old meaning was direct repair of a nondestructive viable defect. The new conflict is a small hole with a devascularized segment and recovered systemic physiology; do not move old direct-repair history to this meaning.",
    "historyMigration": "None. Retain the old concept and all old versions; do not transfer FSRS history.",
    "questionVariantIds": [
      "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2"
    ],
    "retainedReviewedQuestionVariantIds": [],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.small-bowel-repair",
      "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection",
      "claim.trauma-initial-abdomen.damage-control",
      "claim.trauma-initial-abdomen.keep-open"
    ],
    "active": true,
    "runtimeStageReason": "Existing clinic examination stage; clinical complexity is separate."
  }
]
```

## Atomic evidence, sources, rights and disagreements

Exact source ledger: `docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json`. Fifteen source records and fifty-five atomic claims. The original fifty-one claim statements and dates are retained; four original claims were added for the revised decisions. Rechecking a publication is not independent corroboration. Fictional observations are not empirical thresholds, probabilities or demographic selection weights.

```json
{
  "checkedOn": "2026-11-11",
  "reviewRound": 2,
  "sourceClassesPermitted": true,
  "sourceTextStored": false,
  "claimsAdded": [
    "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
    "claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution",
    "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection",
    "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
  ],
  "targetedChecks": [
    {
      "sourceId": "source.trauma-initial-abdomen.wses-bowel-2022",
      "sections": [
        "Repeat CT recommendations for equivocal/evolving findings",
        "Primary repair contraindications and small-bowel reconstruction",
        "Rights and permissions"
      ],
      "intendedUse": "Exact six-hour recommendation; mesenteric blood-supply and reconstruction boundaries",
      "rights": "Article-level CC BY 4.0 checked; independent original claims only."
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-open-abdomen-2018",
      "sections": [
        "Definitive closure and continuing open-abdomen indications",
        "Rights and permissions"
      ],
      "intendedUse": "Remaining bowel reassessment versus recovered systemic physiology",
      "rights": "Article-level CC BY 4.0 checked; independent original claims only."
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-uro-2019",
      "sections": [
        "Bladder diagnosis and management"
      ],
      "intendedUse": "Cystography acquisition and complicated extraperitoneal repair cross-check",
      "rights": "Previously recorded CC BY 4.0 retained; no new copied material."
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-bladder-2019",
      "sections": [
        "Complex extraperitoneal injury definition and recommendations"
      ],
      "intendedUse": "Intravesical bone fragment repair exception",
      "rights": "Targeted factual verification of society guidance; no protected expression reproduced."
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "sections": [
        "Nonoperative failure/obstruction",
        "Duodenal repair options",
        "Rights and permissions"
      ],
      "intendedUse": "Conditional fourteen-day boundary, evacuation and viable repair geometry",
      "rights": "Article-level CC BY 4.0 checked; independent original claims only."
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-liver-2020",
      "sections": [
        "Complications: biloma and biliary fistula"
      ],
      "intendedUse": "Drainage principle and ERCP adjunct, applied to a constructed catheter course",
      "rights": "Previously recorded CC BY 4.0 retained; no source text stored."
    }
  ],
  "independenceLimitation": "Repeat retrieval of the same publications is targeted verification, not an independent second publication or clinical sign-off."
}
```

| Atomic claim ID | Independently written statement | Supporting source IDs | Certainty / limitation |
|---|---|---|---|
| `claim.trauma-initial-abdomen.unstable-positive-fast` | Persistent circulatory deterioration after resuscitation together with intraperitoneal fluid on FAST supports urgent trauma laparotomy rather than transport for CT. | `source.trauma-initial-abdomen.wses-bowel-2022`<br>`source.trauma-initial-abdomen.wses-pancreas-duodenum-2019`<br>`source.trauma-initial-abdomen.east-liver-2012` | high: A transient pressure rise does not establish sustained stabilization; this claim does not choose among hybrid-suite interventions in a sustained responder. |
| `claim.trauma-initial-abdomen.stable-ct` | In a sustained stable or stabilized adult without an immediate operative indication, IV-contrast CT characterizes abdominal injury beyond what FAST can exclude. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012`<br>`source.trauma-initial-abdomen.east-spleen-2012` | high: Negative FAST is not a general exclusion of visceral or retroperitoneal injury; no sensitivity number is taught. |
| `claim.trauma-initial-abdomen.damage-control` | Continuing hypotension, worsening acidosis, hypothermia and coagulopathic bleeding favor an abbreviated operation with hemorrhage/contamination control and temporary abdominal closure. | `source.trauma-initial-abdomen.wses-open-abdomen-2018`<br>`source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | moderate: Physiology and unfinished surgical tasks govern the decision; no universal numerical trigger or exact resuscitation prescription is taught. |
| `claim.trauma-initial-abdomen.keep-open` | An open abdomen may remain necessary while resuscitation, contamination control, deferred reconstruction or reassessment of questionable bowel viability is unfinished. | `source.trauma-initial-abdomen.wses-open-abdomen-2018` | moderate: One adequate guideline publication; does not imply that edema or a trauma diagnosis mandates an open abdomen. |
| `claim.trauma-initial-abdomen.fascial-closure` | After resuscitation and source control are complete, bowel viability is settled and further exploration or pressure-related concern is absent, early primary fascial closure is favored. | `source.trauma-initial-abdomen.wses-open-abdomen-2018` | moderate: One adequate guideline publication; do not force closure under tension or imply an exact pressure cutoff. |
| `claim.trauma-initial-abdomen.equivocal-bowel-observe` | A high-risk blunt mechanism with nonspecific bowel or mesenteric CT abnormalities warrants inpatient observation with serial assessment rather than reassurance from absence of free air. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: One guideline; limited to stable, clinically evaluable patients without a direct operative sign. This is not a blanket rule after a completely normal high-quality CT. |
| `claim.trauma-initial-abdomen.evolving-bowel-repeat-ct` | Evolving suspicion after an equivocal initial bowel CT can justify repeat CT while the patient remains stable and has not developed an operative indication. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: One guideline; repeat imaging must not delay operation for peritonitis or instability. The question does not teach a fixed interval. |
| `claim.trauma-initial-abdomen.bowel-direct-sign` | A traumatic bowel-wall defect or convincing extraluminal enteric contrast is a direct indication for prompt surgical exploration. | `source.trauma-initial-abdomen.wses-bowel-2022` | high: One guideline; isolated free fluid or mesenteric stranding does not carry the same implication. |
| `claim.trauma-initial-abdomen.small-bowel-repair` | A viable nondestructive small-bowel laceration can undergo primary repair; loss of more than half the circumference or mesenteric devascularization argues against that repair. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: One guideline; the greater-than-50% boundary is directly stated in its primary-repair section. No universal suture technique or mandatory stoma rule is taught. |
| `claim.trauma-initial-abdomen.bowel-resection-risk` | The choice of anastomosis versus diversion after traumatic bowel resection must account for physiology, perfusion, contamination and ongoing support needs. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: One guideline; small bowel and colon are not interchangeable. Colon/rectal procedure ranking is withheld pending accessible verification of newer guidance. |
| `claim.trauma-initial-abdomen.splenic-embolization` | For a stable adult with splenic arterial extravasation, angiography with possible embolization is a supported spleen-preserving intervention when the trauma center can deliver it. | `source.trauma-initial-abdomen.wses-spleen-2022`<br>`source.trauma-initial-abdomen.east-spleen-2012` | moderate: WSES 2022 conditionally favors embolization; EAST 2012 says blush alone is not an absolute trigger. Use the combined trajectory and bleeding findings; do not teach mandatory embolization of every blush. |
| `claim.trauma-initial-abdomen.splenic-observation` | An isolated splenic injury can be observed in a stable patient without peritonitis when monitoring and rapid operative rescue are present. | `source.trauma-initial-abdomen.wses-spleen-2022`<br>`source.trauma-initial-abdomen.east-spleen-2012` | moderate: High-grade injuries or vascular findings may require an angiographic adjunct; observation is not equivalent to discharge. |
| `claim.trauma-initial-abdomen.splenic-failure` | New sustained instability with evidence of recurrent abdominal bleeding during splenic nonoperative care warrants urgent operative rescue. | `source.trauma-initial-abdomen.east-spleen-2012`<br>`source.trauma-initial-abdomen.wses-bowel-2022` | high: Repeat embolization can be reasonable in a stable patient with a localizable arterial recurrence; the authored case has continuing deterioration despite blood. |
| `claim.trauma-initial-abdomen.liver-nonoperative` | High anatomic grade by itself does not require laparotomy for a stable isolated liver injury without peritonitis or another operative injury. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: Applies to monitored trauma-center care with urgent operative rescue, not unmonitored outpatient care. |
| `claim.trauma-initial-abdomen.liver-arterial-bleeding` | Angiography with embolization is an option for stable hepatic arterial extravasation; unstable nonresponders need operative hemorrhage control. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: Do not infer that every transient responder is eligible for transport or that all liver bleeding is arterial. |
| `claim.trauma-initial-abdomen.liver-pseudoaneurysm` | Post-traumatic hepatic arterial pseudoaneurysm is treated with angiography/embolization; hemobilia after liver trauma can indicate this complication. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: WSES supplies the specific pseudoaneurysm recommendation; EAST independently supports angiographic management of hepatic complications but not every exact pseudoaneurysm criterion. |
| `claim.trauma-initial-abdomen.biloma-drainage` | A symptomatic or infected traumatic biloma requires drainage, usually percutaneously when accessible. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: WSES gives the specific biloma recommendation. Shared infection treatment is background care; this claim does not prescribe an antibiotic regimen. |
| `claim.trauma-initial-abdomen.bile-leak-adjunct` | Persistent traumatic biliary leakage may require endoscopic stenting in addition to drainage; diffuse bile peritonitis or failed minimally invasive control may require surgery. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: The presence of a collection alone does not prove a major duct disruption or mandate resection. |
| `claim.trauma-initial-abdomen.penetrating-observation` | Selected stable adults with abdominal stab wounds and a reliable examination can undergo CT-supported observation with serial examinations in an experienced trauma service. | `source.trauma-initial-abdomen.wses-bowel-2022`<br>`source.trauma-initial-abdomen.east-penetrating-2010` | moderate: No peritonitis, evisceration, impalement or another operative indication; peritoneal breach is not itself proof of bowel perforation. No discharge interval is taught. |
| `claim.trauma-initial-abdomen.penetrating-operation` | Instability or diffuse peritoneal findings after penetrating abdominal injury supports urgent laparotomy. | `source.trauma-initial-abdomen.wses-bowel-2022`<br>`source.trauma-initial-abdomen.east-penetrating-2010` | high: Do not defer a clinical operative indication to a reassuring earlier CT. |
| `claim.trauma-initial-abdomen.unreliable-exam` | A stable patient with penetrating abdominal trauma and an unreliable examination requires further injury assessment rather than reliance on serial symptom reports. | `source.trauma-initial-abdomen.wses-bowel-2022`<br>`source.trauma-initial-abdomen.east-penetrating-2010` | moderate: Further assessment may include imaging or exploration; these sources do not establish a universal single preferred test for every unreliable patient. |
| `claim.trauma-initial-abdomen.pelvic-packing-after-angio` | Persistent pelvic hemorrhage after angiography despite pelvic stabilization is an indication to consider preperitoneal packing for bleeding not controlled by an arterial procedure. | `source.trauma-initial-abdomen.wses-pelvis-2017` | moderate: One older guideline publication; does not rank initial packing against immediate angiography in every center or select orthopedic fixation. |
| `claim.trauma-initial-abdomen.pelvic-arterial-embolization` | Persistent pelvic bleeding with an arterial CT focus after stabilization or packing supports angiography and possible selective embolization, including repeat angiography. | `source.trauma-initial-abdomen.wses-pelvis-2017` | moderate: One older guideline; arterial and nonarterial bleeding may coexist. An isolated fracture pattern does not identify the bleeding source. |
| `claim.trauma-initial-abdomen.pelvic-fast-limitation` | Absence of intraperitoneal fluid on FAST does not exclude pelvic retroperitoneal hemorrhage. | `source.trauma-initial-abdomen.wses-pelvis-2017`<br>`source.trauma-initial-abdomen.wses-liver-2020` | high: It also does not prove the pelvis is the only source; associated thoracic, abdominal and external sources must be assessed. |
| `claim.trauma-initial-abdomen.bladder-cystography` | Gross hematuria after blunt pelvic trauma warrants retrograde cystography, using conventional radiography or a CT cystogram. | `source.trauma-initial-abdomen.wses-uro-2019`<br>`source.trauma-initial-abdomen.east-bladder-2019` | high: Cystography follows urgent hemorrhage control. If urethral injury is suspected, urethral assessment precedes catheter placement. |
| `claim.trauma-initial-abdomen.passive-ct-insufficient` | Renally excreted contrast reaching a partially filled bladder on ordinary trauma CT does not substitute for retrograde bladder distension during cystography. | `source.trauma-initial-abdomen.wses-uro-2019` | high: One guideline publication; distinguishes an unperformed adequate acquisition from a missing exported image series. |
| `claim.trauma-initial-abdomen.intraperitoneal-bladder` | Traumatic intraperitoneal bladder rupture generally requires operative repair with postoperative urinary drainage. | `source.trauma-initial-abdomen.wses-uro-2019`<br>`source.trauma-initial-abdomen.east-bladder-2019` | moderate: Stable isolated injury may be repaired laparoscopically. This does not apply automatically to every iatrogenic or extraperitoneal leak. |
| `claim.trauma-initial-abdomen.extraperitoneal-bladder` | Uncomplicated traumatic extraperitoneal bladder rupture can be treated with catheter drainage rather than routine repair. | `source.trauma-initial-abdomen.east-bladder-2019`<br>`source.trauma-initial-abdomen.wses-uro-2019` | moderate: Complex injuries, adjacent organ injury and planned relevant pelvic surgery may alter management. WSES wording around fracture-associated complexity is broader than EAST; no fracture-alone repair rule is taught. |
| `claim.trauma-initial-abdomen.complex-bladder` | Bladder-neck involvement, intravesical bone injury or associated rectal/vaginal injury can make an extraperitoneal bladder rupture a repair problem rather than simple catheter care. | `source.trauma-initial-abdomen.east-bladder-2019`<br>`source.trauma-initial-abdomen.wses-uro-2019` | moderate: Do not equate a pelvic fracture by itself with every listed complex feature; the precise boundary remains for clinician review. |
| `claim.trauma-initial-abdomen.renal-deceleration-ct` | High-energy deceleration can warrant IV-contrast CT with a delayed urographic phase for renal/upper-tract injury even without hematuria. | `source.trauma-initial-abdomen.wses-uro-2019` | moderate: One guideline publication; absence of hematuria does not exclude pedicle or collecting-system injury. Applies to a stable patient. |
| `claim.trauma-initial-abdomen.renal-excretory-phase` | Delayed excretory imaging evaluates urinary extravasation and ureteral continuity beyond the arterial and venous trauma CT phases. | `source.trauma-initial-abdomen.wses-uro-2019` | high: One guideline publication; does not require an invented acquisition delay or presume a missing series was never acquired. |
| `claim.trauma-initial-abdomen.renal-urine-observe` | In a stable fully staged renal injury, isolated urinary extravasation without another operative indication is compatible with initial nonoperative monitoring. | `source.trauma-initial-abdomen.wses-uro-2019` | moderate: One adequate guideline; excludes suspected renal-pelvis/proximal-ureter avulsion, infection, obstructed drainage or persistent symptomatic collection. |
| `claim.trauma-initial-abdomen.renal-urinoma-intervention` | A nonresolving or symptomatic post-traumatic urinoma may require ureteral stenting or percutaneous drainage. | `source.trauma-initial-abdomen.wses-uro-2019` | moderate: One guideline; does not rank stenting versus drainage for every collection or prescribe a size threshold. |
| `claim.trauma-initial-abdomen.contained-zone-two` | During exploration of an unstable adult trauma patient, a stable nonexpanding zone-II renal hematoma need not be opened; instability may come from another injury. | `source.trauma-initial-abdomen.east-renal-2023` | low: Conditional EAST 2023 recommendation from limited observational data. Stable describes the hematoma, not the patient. Do not generalize to an expanding/pulsatile hematoma or central vascular injury. |
| `claim.trauma-initial-abdomen.renal-preservation` | When an expanding renal hematoma requires intervention, kidney-preserving techniques are conditionally favored over automatic nephrectomy when feasible. | `source.trauma-initial-abdomen.east-renal-2023` | low: Conditional low-quality evidence; life-saving nephrectomy remains possible when repair cannot control hemorrhage. |
| `claim.trauma-initial-abdomen.distal-pancreatic-duct` | A distal pancreatic transection with main-duct disruption is a resectional injury; distal pancreatectomy is supported in a stable adult requiring operative treatment. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019`<br>`source.trauma-initial-abdomen.east-pancreas-2017` | low: Both guidelines are conditional/low-quality here. Proximal injuries and endoscopically bridgeable selected injuries need a different discussion; the draft is an intraoperative distal complete transection. |
| `claim.trauma-initial-abdomen.minor-pancreas` | A minor pancreatic injury with an intact main duct generally permits nonresectional management; intraoperative drainage may be used. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019`<br>`source.trauma-initial-abdomen.east-pancreas-2017` | moderate: Duct status must be adequately assessed, not inferred from a normal early enzyme value. |
| `claim.trauma-initial-abdomen.pancreatic-duct-evaluate` | If duct integrity remains uncertain after CT, further duct assessment with MRCP or ERCP can change pancreatic injury management. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019`<br>`source.trauma-initial-abdomen.east-pancreas-2017` | moderate: Neither option is ranked universally; the draft does not claim a normal MRCP invariably excludes duct injury or rank the two tests. |
| `claim.trauma-initial-abdomen.duodenal-hematoma` | A stable patient with a duodenal wall hematoma and no perforation or other operative injury can initially receive decompression and nonoperative observation. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | moderate: One adequate guideline; obstruction that persists or worsens requires reassessment. No fixed observation duration is taught. |
| `claim.trauma-initial-abdomen.duodenal-primary-repair` | After complete exposure and removal of nonviable margins, a repairable duodenal laceration is generally treated with primary repair rather than routine complex diversion. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | moderate: One guideline; excludes destructive ampullary/pancreatic injury and a repair that would be under tension or narrow the lumen. |
| `claim.trauma-initial-abdomen.duodenal-complex` | Destructive duodenopancreatic injury may need complex reconstruction; shock favors damage control with reconstruction staged by experienced teams. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | low: One guideline; do not teach routine pancreaticoduodenectomy or pyloric exclusion for an otherwise repairable duodenal tear. |
| `claim.trauma-initial-abdomen.renal-evidence-limit` | EAST 2023 could not recommend embolization versus observation for every stable adult with ongoing renal bleeding, or a single optimal repeat-imaging schedule for high-grade injury. | `source.trauma-initial-abdomen.east-renal-2023` | moderate: Evidence insufficiency is preserved; this is a withheld teaching boundary, not proof that either approach is inappropriate. |
| `claim.trauma-initial-abdomen.duodenal-mural-imaging` | A duodenal intramural hematoma can appear as a hyperattenuating wall collection that narrows the lumen; extraluminal gas or contrast and wall discontinuity instead raise concern for perforation. | `source.trauma-initial-abdomen.juanpere-duodenum-imaging-2018` | moderate: Imaging-pattern support from a radiology review, not a validated prediction rule. No copied image or diagnostic performance estimate. |
| `claim.trauma-initial-abdomen.bladder-compartment-imaging` | Cystographic contrast outlining bowel loops or spreading through paracolic gutters indicates intraperitoneal leakage rather than a confined perivesical extraperitoneal leak. | `source.trauma-initial-abdomen.mahat-bladder-imaging-2019` | moderate: One adequately licensed review supports this anatomic interpretation; management recommendations have separate guideline support. No source image reused. |
| `claim.trauma-initial-abdomen.planned-hernia-fallback` | Skin-only closure with a planned ventral hernia is an option for complicated or protracted open abdomen when fascial closure is not viable. | `source.trauma-initial-abdomen.wses-open-abdomen-2018` | low: Single guideline, Grade 2C; not a substitute for achievable primary fascial closure. |
| `claim.trauma-initial-abdomen.temporary-negative-pressure` | Negative-pressure temporary abdominal closure is a supported technique when an open abdomen remains indicated. | `source.trauma-initial-abdomen.wses-open-abdomen-2018` | moderate: Single guideline; no device, suction pressure or claim of universal superiority is taught. |
| `claim.trauma-initial-abdomen.hepatic-devascularized-complication` | A devascularized hepatic segment causing a clinically important complication may require surgical management after stabilization. | `source.trauma-initial-abdomen.wses-liver-2020` | moderate: Single guideline; not an instruction to resect a high-grade liver injury based on grade alone. |
| `claim.trauma-initial-abdomen.urethral-assessment` | When traumatic urethral injury is suspected, retrograde urethrography or appropriate urethroscopy evaluates the urethra; urethral assessment precedes bladder catheterization when feasible. | `source.trauma-initial-abdomen.wses-uro-2019` | moderate: Single guideline; modality varies with sex and specific injury. The mapped patient already has documented atraumatic catheter access. |
| `claim.trauma-initial-abdomen.duodenal-hematoma-evacuation` | Persistent obstructing duodenal hematoma after nonoperative care can require decompression, including operative evacuation in selected cases. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | low: One guideline describes operative or percutaneous alternatives; no universal preferred route or exact waiting interval is keyed. |
| `claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction` | Pancreaticojejunostomy is a described specialist reconstructive option in selected severe pancreatic injuries; limited evidence does not make it routine for isolated distal duct transection. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019`<br>`source.trauma-initial-abdomen.east-pancreas-2017` | low: WSES describes selected reconstructions; EAST includes very limited severe-injury reports. This is an existence/selection boundary, not a rule favoring Roux-en-Y reconstruction for every proximal injury. |
| `claim.trauma-initial-abdomen.contrast-phase-interpretation` | Multiphase trauma CT can distinguish an enlarging pool of extravasated arterial contrast from a contained vascular sac that follows blood-pool enhancement. | `source.trauma-initial-abdomen.wses-liver-2020` | moderate: One guideline supports active-versus-contained vascular interpretation. The constructed report is text, not a simulated scan or a performance claim. |
| `claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment` | After an equivocal initial CT in suspected blunt bowel injury, WSES supports CT reassessment after a six-hour interval; an evolving suspicious course also supports repeat imaging. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: This is a guideline reassessment recommendation for selected equivocal or evolving presentations, not a mandatory universal scan clock, a gameplay wait estimate, or a reason to delay operation for peritonitis. One guideline publication directly supports the six-hour value. |
| `claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution` | Persistent duodenal obstruction despite nonoperative treatment for a wall hematoma warrants consideration of intervention when passage has not returned within fourteen days. | `source.trauma-initial-abdomen.wses-pancreas-duodenum-2019` | low: The guideline recommendation is conditional and low-certainty. Fourteen days is not an automatic operative deadline. Operative evacuation and selected percutaneous approaches are described; this claim does not rank operative evacuation above every unoffered drainage approach. One adequate guideline directly supports this boundary. |
| `claim.trauma-initial-abdomen.small-bowel-anastomosis-selection` | After necessary small-bowel resection, viable bowel and restored physiology can support immediate anastomosis; unresolved perfusion, resuscitation or control tasks can favor staged reconstruction. | `source.trauma-initial-abdomen.wses-bowel-2022` | moderate: Choice remains patient- and operation-specific. No exact blood, pressor, pH or contamination threshold is asserted. WSES is the direct publication; this is not independent cohort replication. |
| `claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection` | A recurrent symptomatic or infected traumatic bile collection that is not communicating with its catheter still requires effective collection drainage; duct decompression does not itself evacuate that separate cavity. | `source.trauma-initial-abdomen.wses-liver-2020`<br>`source.trauma-initial-abdomen.east-liver-2012` | moderate: The guideline-backed principle is drainage of a symptomatic/infected collection with ERCP as a possible adjunct. Applying it to the constructed tube-position and injection observations is an explicit clinical inference, not a published comparison of catheter-exchange techniques or a universal intervention ranking. |

Complete provenance and rights records (medical authority assessed separately):

### source.trauma-initial-abdomen.wses-bowel-2022

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-bowel-2022",
  "title": "WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment",
  "authors": [
    "Luke Smyth",
    "Cino Bendinelli",
    "Nicholas Lee",
    "et al."
  ],
  "publicationYear": 2022,
  "completeCitation": "Smyth L, Bendinelli C, Lee N, et al. WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment. World J Emerg Surg. 2022;17:13. doi:10.1186/s13017-022-00418-y.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-022-00418-y",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-022-00418-y",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Blunt injury recommendations 1-9",
    "Penetrating injury observation and recommendations",
    "Surgical options / primary repair",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.unstable-positive-fast",
    "claim.trauma-initial-abdomen.equivocal-bowel-observe",
    "claim.trauma-initial-abdomen.evolving-bowel-repeat-ct",
    "claim.trauma-initial-abdomen.bowel-direct-sign",
    "claim.trauma-initial-abdomen.small-bowel-repair",
    "claim.trauma-initial-abdomen.bowel-resection-risk",
    "claim.trauma-initial-abdomen.splenic-failure",
    "claim.trauma-initial-abdomen.penetrating-observation",
    "claim.trauma-initial-abdomen.penetrating-operation",
    "claim.trauma-initial-abdomen.unreliable-exam",
    "claim.trauma-initial-abdomen.equivocal-bowel-six-hour-reassessment",
    "claim.trauma-initial-abdomen.small-bowel-anastomosis-selection"
  ]
}
```

### source.trauma-initial-abdomen.wses-spleen-2022

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-spleen-2022",
  "title": "Follow-up strategies for patients with splenic trauma managed non-operatively: the 2022 World Society of Emergency Surgery consensus document",
  "authors": [
    "Mauro Podda",
    "Belinda De Simone",
    "Marco Ceresoli",
    "et al."
  ],
  "publicationYear": 2022,
  "completeCitation": "Podda M, De Simone B, Ceresoli M, et al. Follow-up strategies for patients with splenic trauma managed non-operatively: the 2022 World Society of Emergency Surgery consensus document. World J Emerg Surg. 2022;17:52. doi:10.1186/s13017-022-00457-5.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-022-00457-5",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-022-00457-5",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Research questions 5-6: embolization and imaging",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.splenic-embolization",
    "claim.trauma-initial-abdomen.splenic-observation"
  ]
}
```

### source.trauma-initial-abdomen.wses-liver-2020

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-liver-2020",
  "title": "Liver trauma: WSES 2020 guidelines",
  "authors": [
    "Federico Coccolini",
    "Raul Coimbra",
    "Carlos Ordonez",
    "et al."
  ],
  "publicationYear": 2020,
  "completeCitation": "Coccolini F, Coimbra R, Ordonez C, et al. Liver trauma: WSES 2020 guidelines. World J Emerg Surg. 2020;15:24. doi:10.1186/s13017-020-00302-7.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-020-00302-7",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00302-7",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Diagnosis",
    "Non-operative and operative management",
    "Complications",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.stable-ct",
    "claim.trauma-initial-abdomen.liver-nonoperative",
    "claim.trauma-initial-abdomen.liver-arterial-bleeding",
    "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
    "claim.trauma-initial-abdomen.biloma-drainage",
    "claim.trauma-initial-abdomen.bile-leak-adjunct",
    "claim.trauma-initial-abdomen.pelvic-fast-limitation",
    "claim.trauma-initial-abdomen.hepatic-devascularized-complication",
    "claim.trauma-initial-abdomen.contrast-phase-interpretation",
    "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
  ]
}
```

### source.trauma-initial-abdomen.wses-pelvis-2017

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-pelvis-2017",
  "title": "Pelvic trauma: WSES classification and guidelines",
  "authors": [
    "Federico Coccolini",
    "Philip F. Stahel",
    "Giulia Montori",
    "et al."
  ],
  "publicationYear": 2017,
  "completeCitation": "Coccolini F, Stahel PF, Montori G, et al. Pelvic trauma: WSES classification and guidelines. World J Emerg Surg. 2017;12:5. doi:10.1186/s13017-017-0117-6.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-017-0117-6",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-017-0117-6",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Diagnostic workup",
    "Preperitoneal pelvic packing",
    "Angiography/angioembolization",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
    "claim.trauma-initial-abdomen.pelvic-arterial-embolization",
    "claim.trauma-initial-abdomen.pelvic-fast-limitation"
  ]
}
```

### source.trauma-initial-abdomen.wses-uro-2019

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-uro-2019",
  "title": "Kidney and uro-trauma: WSES-AAST guidelines",
  "authors": [
    "Federico Coccolini",
    "Ernest E. Moore",
    "Yoram Kluger",
    "et al."
  ],
  "publicationYear": 2019,
  "completeCitation": "Coccolini F, Moore EE, Kluger Y, et al. Kidney and uro-trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:54. doi:10.1186/s13017-019-0274-x.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-019-0274-x",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-019-0274-x",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Diagnostic procedures: kidney, ureter and bladder",
    "Renal non-operative management",
    "Bladder management",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.bladder-cystography",
    "claim.trauma-initial-abdomen.passive-ct-insufficient",
    "claim.trauma-initial-abdomen.intraperitoneal-bladder",
    "claim.trauma-initial-abdomen.extraperitoneal-bladder",
    "claim.trauma-initial-abdomen.complex-bladder",
    "claim.trauma-initial-abdomen.renal-deceleration-ct",
    "claim.trauma-initial-abdomen.renal-excretory-phase",
    "claim.trauma-initial-abdomen.renal-urine-observe",
    "claim.trauma-initial-abdomen.renal-urinoma-intervention",
    "claim.trauma-initial-abdomen.urethral-assessment"
  ]
}
```

### source.trauma-initial-abdomen.wses-pancreas-duodenum-2019

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
  "title": "Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines",
  "authors": [
    "Federico Coccolini",
    "Leslie Kobayashi",
    "Yoram Kluger",
    "et al."
  ],
  "publicationYear": 2019,
  "completeCitation": "Coccolini F, Kobayashi L, Kluger Y, et al. Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:56. doi:10.1186/s13017-019-0278-6.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-019-0278-6",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-019-0278-6",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Diagnosis / duct evaluation",
    "Duodenal non-operative management",
    "Operative management: duodenum and pancreas",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.unstable-positive-fast",
    "claim.trauma-initial-abdomen.damage-control",
    "claim.trauma-initial-abdomen.distal-pancreatic-duct",
    "claim.trauma-initial-abdomen.minor-pancreas",
    "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
    "claim.trauma-initial-abdomen.duodenal-hematoma",
    "claim.trauma-initial-abdomen.duodenal-primary-repair",
    "claim.trauma-initial-abdomen.duodenal-complex",
    "claim.trauma-initial-abdomen.duodenal-hematoma-evacuation",
    "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction",
    "claim.trauma-initial-abdomen.duodenal-fourteen-day-nonresolution"
  ]
}
```

### source.trauma-initial-abdomen.wses-open-abdomen-2018

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.wses-open-abdomen-2018",
  "title": "The open abdomen in trauma and non-trauma patients: WSES guidelines",
  "authors": [
    "Federico Coccolini",
    "Derek Roberts",
    "Luca Ansaloni",
    "et al."
  ],
  "publicationYear": 2018,
  "completeCitation": "Coccolini F, Roberts D, Ansaloni L, et al. The open abdomen in trauma and non-trauma patients: WSES guidelines. World J Emerg Surg. 2018;13:7. doi:10.1186/s13017-018-0167-4.",
  "organizationOrJournal": "World Journal of Emergency Surgery / World Society of Emergency Surgery",
  "doi": "10.1186/s13017-018-0167-4",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-018-0167-4",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Trauma indications",
    "Re-exploration before definitive closure",
    "Definitive closure",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.damage-control",
    "claim.trauma-initial-abdomen.keep-open",
    "claim.trauma-initial-abdomen.fascial-closure",
    "claim.trauma-initial-abdomen.planned-hernia-fallback",
    "claim.trauma-initial-abdomen.temporary-negative-pressure"
  ]
}
```

### source.trauma-initial-abdomen.east-renal-2023

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-renal-2023",
  "title": "Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma",
  "authors": [
    "Hiba Abdel Aziz",
    "Nikolay Bugaev",
    "Gerard Baltazar",
    "Zachary Brown",
    "Krista Haines",
    "Sameer Gupta",
    "Lawrence Yeung",
    "Joseph Posluszny",
    "John Como",
    "Jennifer Freeman",
    "George Kasotakis"
  ],
  "publicationYear": 2023,
  "completeCitation": "Aziz HA, Bugaev N, Baltazar G, et al. Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma. BMC Surg. 2023;23:22. doi:10.1186/s12893-023-01914-x.",
  "organizationOrJournal": "BMC Surgery / Eastern Association for the Surgery of Trauma",
  "doi": "10.1186/s12893-023-01914-x",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s12893-023-01914-x",
  "accessedOn": "2026-11-11",
  "sourceClass": "peer_reviewed_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://link.springer.com/termsandconditions",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0 rights statement inspected. Credit authors/publication and license; all claims, vignettes and teaching prose below are independently synthesized. No figures, tables, algorithms, passages, third-party assets or source text retained.",
  "authorityAssessment": "Peer-reviewed multidisciplinary society guideline/consensus; recommendation strength and evidence quality remain claim-specific. Open licensing establishes reuse rights, not clinical certainty.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "PICO 1-4 recommendations and limitations",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.contained-zone-two",
    "claim.trauma-initial-abdomen.renal-preservation",
    "claim.trauma-initial-abdomen.renal-evidence-limit"
  ]
}
```

### source.trauma-initial-abdomen.east-spleen-2012

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-spleen-2012",
  "title": "Splenic Injury, Blunt, Selective Nonoperative Management of",
  "authors": [
    "Nicole A. Stassen",
    "Indermeet Bhullar",
    "Julius D. Cheng",
    "et al."
  ],
  "publicationYear": 2012,
  "completeCitation": "Stassen NA, Bhullar I, Cheng JD, et al. Selective nonoperative management of blunt splenic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S294-S300.",
  "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/splenic-injury-blunt-selective-nonoperative-management-of",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
  "licenseUrl": null,
  "termsUrl": "https://www.east.org/terms-of-use",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
  "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Level 1-3 recommendations; unanswered questions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.stable-ct",
    "claim.trauma-initial-abdomen.splenic-embolization",
    "claim.trauma-initial-abdomen.splenic-observation",
    "claim.trauma-initial-abdomen.splenic-failure"
  ]
}
```

### source.trauma-initial-abdomen.east-liver-2012

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-liver-2012",
  "title": "Hepatic Injury, Blunt, Selective Nonoperative Management of",
  "authors": [
    "Nicole A. Stassen",
    "Indermeet Bhullar",
    "Julius D. Cheng",
    "et al."
  ],
  "publicationYear": 2012,
  "completeCitation": "Stassen NA, Bhullar I, Cheng JD, et al. Nonoperative management of blunt hepatic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S288-S293.",
  "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/hepatic-injury-blunt-selective-nonoperative-management-of",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
  "licenseUrl": null,
  "termsUrl": "https://www.east.org/terms-of-use",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
  "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Level 1-3 recommendations"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.unstable-positive-fast",
    "claim.trauma-initial-abdomen.stable-ct",
    "claim.trauma-initial-abdomen.liver-nonoperative",
    "claim.trauma-initial-abdomen.liver-arterial-bleeding",
    "claim.trauma-initial-abdomen.liver-pseudoaneurysm",
    "claim.trauma-initial-abdomen.biloma-drainage",
    "claim.trauma-initial-abdomen.bile-leak-adjunct",
    "claim.trauma-initial-abdomen.recurrent-biloma-undrained-collection"
  ]
}
```

### source.trauma-initial-abdomen.east-penetrating-2010

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-penetrating-2010",
  "title": "Penetrating Abdominal Trauma, Selective Non-Operative Management of",
  "authors": [
    "John J. Como",
    "Faran Bokhari",
    "William C. Chiu",
    "Therese M. Duane",
    "Michele R. Holevar",
    "Margaret A. Tandoh",
    "Rao R. Ivatury",
    "Thomas M. Scalea"
  ],
  "publicationYear": 2010,
  "completeCitation": "Como JJ, Bokhari F, Chiu WC, et al. Practice management guidelines for selective nonoperative management of penetrating abdominal trauma. J Trauma. 2010;68(3):721-733.",
  "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/penetrating-abdominal-trauma%2C-selective-non-operative-management-of",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
  "licenseUrl": null,
  "termsUrl": "https://www.east.org/terms-of-use",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
  "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Recommendations a-i; indications for laparotomy"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.penetrating-observation",
    "claim.trauma-initial-abdomen.penetrating-operation",
    "claim.trauma-initial-abdomen.unreliable-exam"
  ]
}
```

### source.trauma-initial-abdomen.east-bladder-2019

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-bladder-2019",
  "title": "Blunt Force Bladder Injuries Management of",
  "authors": [
    "Lawrence L. Yeung",
    "Amy A. McDonald",
    "John J. Como",
    "Bryce Robinson",
    "Jennifer Knight",
    "Michael A. Person",
    "Jane K. Lee",
    "Philipp Dahm"
  ],
  "publicationYear": 2019,
  "completeCitation": "Yeung LL, McDonald AA, Como JJ, et al. Management of blunt force bladder injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2019;86(2):326-336.",
  "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/blunt-force-bladder-injuries-management-of",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
  "licenseUrl": null,
  "termsUrl": "https://www.east.org/terms-of-use",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
  "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "PICO 1-3; diagnostic evaluation and intraperitoneal versus extraperitoneal repair"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.bladder-cystography",
    "claim.trauma-initial-abdomen.intraperitoneal-bladder",
    "claim.trauma-initial-abdomen.extraperitoneal-bladder",
    "claim.trauma-initial-abdomen.complex-bladder"
  ]
}
```

### source.trauma-initial-abdomen.east-pancreas-2017

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.east-pancreas-2017",
  "title": "Pancreatic Injuries",
  "authors": [
    "Vanessa P. Ho",
    "Nimitt J. Patel",
    "Faran Bokhari",
    "et al."
  ],
  "publicationYear": 2017,
  "completeCitation": "Ho VP, Patel NJ, Bokhari F, et al. Management of adult pancreatic injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2017;82(1):185-199.",
  "organizationOrJournal": "Eastern Association for the Surgery of Trauma / Journal of Trauma and Acute Care Surgery",
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/pancreatic-injuries",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; professional-society targeted factual verification only",
  "licenseUrl": null,
  "termsUrl": "https://www.east.org/terms-of-use",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Public official society guideline and EAST terms inspected. Targeted factual verification and bibliographic citation only; no source expression reproduced, corpus collection, full-text storage or derivative tables. No AI-specific prohibition found in inspected public terms.",
  "authorityAssessment": "Independent trauma-society guideline cross-check; publication age and conditional/low-quality recommendations limit inference. Public access is not an open license.",
  "usageRole": "both",
  "accessMethod": "Targeted public HTML guideline/rights-section retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "PICO 1-4; summary recommendations 1-4"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.distal-pancreatic-duct",
    "claim.trauma-initial-abdomen.minor-pancreas",
    "claim.trauma-initial-abdomen.pancreatic-duct-evaluate",
    "claim.trauma-initial-abdomen.pancreatic-specialist-reconstruction"
  ]
}
```

### source.trauma-initial-abdomen.juanpere-duodenum-imaging-2018

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.juanpere-duodenum-imaging-2018",
  "title": "Imaging of non-neoplastic duodenal diseases. A pictorial review with emphasis on MDCT",
  "completeCitation": "Juanpere S, Valls L, Serra I, et al. Imaging of non-neoplastic duodenal diseases. A pictorial review with emphasis on MDCT. Insights Imaging. 2018;9:121-135. doi:10.1007/s13244-018-0593-6.",
  "organizationOrJournal": "Insights into Imaging",
  "authors": [
    "Sergi Juanpere",
    "Laia Valls",
    "Isabel Serra",
    "Margarita Osorio",
    "Arantxa Gelabert",
    "Albert Maroto",
    "Salvador Pedraza"
  ],
  "publicationYear": 2018,
  "doi": "10.1007/s13244-018-0593-6",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1007/s13244-018-0593-6",
  "accessedOn": "2026-11-11",
  "sourceClass": "narrative_review",
  "licenseLabel": "Creative Commons Attribution 4.0 International",
  "reuseStatus": "cc_by_4_0",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "termsUrl": "https://creativecommons.org/licenses/by/4.0/",
  "reuseNotes": "Article license inspected. Independently synthesized anatomic/imaging facts only; credit original authors and license. No figures, images, tables, algorithms, excerpts or source passages copied.",
  "authorityAssessment": "Radiology pictorial review used narrowly to verify the independent text description of mural hemorrhage; it does not establish the management ranking.",
  "usageRole": "evidence",
  "accessMethod": "Targeted public HTML/rights retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Duodenal trauma",
    "Vascular pathologies: intramural hematoma",
    "Rights and permissions"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.duodenal-mural-imaging"
  ]
}
```

### source.trauma-initial-abdomen.mahat-bladder-imaging-2019

```json
{
  "contentVersion": "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.trauma-initial-abdomen.mahat-bladder-imaging-2019",
  "title": "A contemporary review of adult bladder trauma",
  "completeCitation": "Mahat Y, Leong JY, Chung PH. A contemporary review of adult bladder trauma. J Inj Violence Res. 2019;11(2):101-106. doi:10.5249/jivr.v11i2.1069.",
  "organizationOrJournal": "Journal of Injury and Violence Research",
  "authors": [
    "Yashmi Mahat",
    "Joon Yau Leong",
    "Paul H. Chung"
  ],
  "publicationYear": 2019,
  "doi": "10.5249/jivr.v11i2.1069",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6646823/",
  "accessedOn": "2026-11-11",
  "sourceClass": "narrative_review",
  "licenseLabel": "Creative Commons Attribution 3.0",
  "reuseStatus": "cc_by_3_0",
  "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
  "termsUrl": "https://creativecommons.org/licenses/by/3.0/",
  "reuseNotes": "Article license inspected. Independently synthesized anatomic/imaging facts only; credit original authors and license. No figures, images, tables, algorithms, excerpts or source passages copied.",
  "authorityAssessment": "Narrative trauma review verifies cystographic compartment anatomy. Management is supported separately by WSES and EAST; no review-derived outcome percentages are used.",
  "usageRole": "evidence",
  "accessMethod": "Targeted public HTML/rights retrieval through web tool on 2026-11-11; no saved source text.",
  "verificationSections": [
    "Cystography: intraperitoneal contrast distribution",
    "Copyright/license information"
  ],
  "evidenceClaimIds": [
    "claim.trauma-initial-abdomen.bladder-compartment-imaging"
  ]
}
```

Exact source→claim / claim→current-and-retained-question mappings, statement-field/option mappings and last-checked dates are in the ledger and `clinicalStatementMappings` in the packet. Metadata and original synthesis only; no article text, excerpts, tables, figures, algorithms or question-bank material are retained. No clinical content is retrieved during gameplay.

Disagreements/boundaries that must not be averaged into a universal rule:

```json
[
  {
    "id": "boundary.trauma-initial-abdomen.spleen-blush",
    "claimIds": [
      "claim.trauma-initial-abdomen.splenic-embolization"
    ],
    "detail": "WSES 2022 conditionally favors embolization for a stable adult blush; EAST 2012 cautions that blush alone is not an absolute indication. The scored patient has an enlarging extravasation focus plus a falling hemoglobin; no mandatory every-blush rule is taught."
  },
  {
    "id": "boundary.trauma-initial-abdomen.bladder-complexity",
    "claimIds": [
      "claim.trauma-initial-abdomen.extraperitoneal-bladder",
      "claim.trauma-initial-abdomen.complex-bladder"
    ],
    "detail": "WSES fracture-associated complexity wording is broader than EAST simple/complex framing. Do not teach repair for every fracture-associated extraperitoneal leak. The current v2 repair question uses an intravesical bone fragment, a concrete complexity feature supported by both guidelines; the original intraperitoneal question is retained only in reviewedSnapshot."
  },
  {
    "id": "boundary.trauma-initial-abdomen.renal-bleeding",
    "claimIds": [
      "claim.trauma-initial-abdomen.renal-evidence-limit"
    ],
    "detail": "EAST 2023 explicitly leaves stable renal bleeding embolization/observation and routine imaging schedules unresolved. These rules remain withheld."
  }
]
```

Source-access exclusions and limitations:

```json
{
  "excludedOrUnscoredSources": [
    {
      "title": "Management of Colon and Rectal Injuries From Blunt and Penetrating Trauma: Evidence-Based Recommendations From the World Society of Emergency Surgery",
      "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/42776522/",
      "finding": "A newer 2026 publication was found in search. Only bibliographic/abstract discovery was used; no accessible rights-verified full guidance was used as clinical evidence. Colon/rectal repair-versus-diversion and adjunct rules remain unscored.",
      "exclusionId": "exclusion.jejunum-primary-repair.1",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    },
    {
      "title": "International Association of Pancreatology Revised Guidelines on Acute Pancreatitis 2025",
      "officialUrl": "https://www.sciencedirect.com/science/article/abs/pii/S1424390325000857",
      "finding": "Paywalled/abstract route encountered in search. Not used for a key or corroboration; original WSES/EAST full public guidance used with its dates and limitations.",
      "exclusionId": "exclusion.jejunum-primary-repair.2",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    },
    {
      "title": "Proprietary trauma/board-review sources",
      "officialUrl": null,
      "finding": "ATLS manuals, textbooks, UpToDate, AccessSurgery, SCORE, paid question banks and recalled exam items were not opened or used.",
      "exclusionId": "exclusion.jejunum-primary-repair.3",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    },
    {
      "title": "The management of an extraperitoneal bladder injury associated with a pelvic fracture",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6565401/",
      "finding": "Access alone did not establish an explicit reusable license in the inspected record. Not used as evidence; cystographic anatomy instead verified against the licensed Mahat review.",
      "exclusionId": "exclusion.jejunum-primary-repair.4",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    },
    {
      "title": "The diagnostic challenge of non-traumatic bladder rupture: a pictorial essay",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10313837/",
      "finding": "CC BY 4.0 verified, but the non-traumatic case series was not needed for the final trauma claim and was not counted as corroboration.",
      "exclusionId": "exclusion.jejunum-primary-repair.5",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    },
    {
      "title": "EAU guideline and radiology textbook/PDF search results",
      "officialUrl": null,
      "finding": "Incidental search results were not opened as source corpora or used for keys. EAU AI/reuse terms were not established; proprietary radiology textbook results were excluded.",
      "exclusionId": "exclusion.jejunum-primary-repair.6",
      "bibliographicStatus": "Excluded/discovery-only record; not a supporting ClinicalSource. Incomplete inaccessible bibliographic fields are not invented."
    }
  ],
  "limitations": [
    "Rankings are qualitative editorial estimates, not an exam blueprint or measured difficulty.",
    "Eight CC BY 4.0 guideline publications, five targeted official society-guideline pages, one CC BY 4.0 radiology review and one CC BY 3.0 trauma review were used. The two reviews support imaging/anatomic interpretation; management has separate guideline support.",
    "WSES/EAST publications may share underlying studies; two guidelines are not two independent patient cohorts.",
    "Several recommendations have one adequate guideline publication; those limitations are recorded per claim.",
    "No new clinical record is approved by this research, author check or software testing.",
    "Round 2 adds four original claims from the same existing permitted publications; repeat verification is not new independent corroboration. Parked drafts are retained for audit and never exported as active runtime questions."
  ]
}
```

## Timing, order, source-link and integration data

18 active exact timing entries; 15 nonexecuted test-order tuples; 15 safe clinical links. Every current testing option, including distractors, maps by case/node/variant/choice ID and exact label to an existing placeholder timing profile. Later cystographic reassessment within a bladder treatment plan is follow-up, not an immediate test-order choice. No fixed wait duration is authored; six hours and sixteen days are historical clinical-course observations with separately recorded guideline support.

All reviewed timing/order tuples are preserved separately in `reviewedSnapshot`. New case IDs keep the clinic framing separate from historical trauma episodes. All service requests and result gates are null. No registry is installed or gameplay service executed.

```json
{
  "timingProposals": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
            "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.observe",
            "choiceLabel": "Continue inpatient serial abdominal examinations",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.explore",
            "choiceLabel": "Proceed to operative abdominal exploration",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.embolize",
            "choiceLabel": "Splenic angiography with possible embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.observe",
            "choiceLabel": "Monitored nonoperative care with serial assessment",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.operate",
            "choiceLabel": "Laparotomy with operative splenic hemorrhage control",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.observe",
            "choiceLabel": "Monitored nonoperative hepatic care",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
            "choiceLabel": "Hepatic angiography with empiric embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.laparotomy",
            "choiceLabel": "Laparotomy with operative hepatic hemorrhage control",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
            "choiceLabel": "Hepatic angiography with selective embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.operate",
            "choiceLabel": "Laparotomy with hepatic hemorrhage control",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent",
            "choiceLabel": "ERCP with transpapillary biliary stenting",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.therapeutic_ercp"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain",
            "choiceLabel": "Image-guided placement of a replacement collection drain",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.stent",
            "choiceLabel": "ERCP with transpapillary biliary stent placement",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.therapeutic_ercp"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.washout",
            "choiceLabel": "Laparoscopic peritoneal washout and drainage",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.packing",
            "choiceLabel": "Preperitoneal pelvic packing",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
            "choiceLabel": "Repeat pelvic arterial embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
            "choiceLabel": "Intraperitoneal abdominal exploration",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
            "choiceLabel": "Pelvic angiography with embolization",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.advanced_diagnostic"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.repack",
            "choiceLabel": "Repeat preperitoneal pelvic packing",
            "timing": {
              "kind": "no_test"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy",
            "choiceLabel": "Proceed to intraperitoneal abdominal exploration",
            "timing": {
              "kind": "no_test"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
            "choiceLabel": "Retrograde CT cystography with bladder distension",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
            "choiceLabel": "Delayed excretory-phase abdominal and pelvic CT",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
            "choiceLabel": "Retrograde urethrography with contrast radiography",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.radiography"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.complete",
            "choiceLabel": "IV-contrast CT with arterial, venous and excretory acquisitions",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular",
            "choiceLabel": "IV-contrast CT with arterial and venous acquisitions",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.ultrasound",
            "choiceLabel": "Renal ultrasonography with Doppler perfusion assessment",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pancreatic-duct-location.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.contained-renal-compartment.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.limited-jejunum-defect.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
      "classification": {
        "kind": "no_test"
      }
    }
  ],
  "testOrderProposals": [
    {
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct",
      "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
      "timingProfileId": "timing.test.ct",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.spleen-stability-and-rescue.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.spleen-arterial-intervention.embolize",
      "choiceLabel": "Splenic angiography with possible embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
      "choiceLabel": "Hepatic angiography with empiric embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
      "choiceLabel": "Hepatic angiography with selective embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.stent",
      "choiceLabel": "ERCP with transpapillary biliary stenting",
      "timingProfileId": "timing.test.therapeutic_ercp",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain",
      "choiceLabel": "Image-guided placement of a replacement collection drain",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.stent",
      "choiceLabel": "ERCP with transpapillary biliary stent placement",
      "timingProfileId": "timing.test.therapeutic_ercp",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.embolize",
      "choiceLabel": "Repeat pelvic arterial embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.embolize",
      "choiceLabel": "Pelvic angiography with embolization",
      "timingProfileId": "timing.test.advanced_diagnostic",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram",
      "choiceLabel": "Retrograde CT cystography with bladder distension",
      "timingProfileId": "timing.test.ct",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.excretory",
      "choiceLabel": "Delayed excretory-phase abdominal and pelvic CT",
      "timingProfileId": "timing.test.ct",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.urethrogram",
      "choiceLabel": "Retrograde urethrography with contrast radiography",
      "timingProfileId": "timing.test.radiography",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.complete",
      "choiceLabel": "IV-contrast CT with arterial, venous and excretory acquisitions",
      "timingProfileId": "timing.test.ct",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular",
      "choiceLabel": "IV-contrast CT with arterial and venous acquisitions",
      "timingProfileId": "timing.test.ct",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    },
    {
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "nodeId": "node.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.ultrasound",
      "choiceLabel": "Renal ultrasonography with Doppler perfusion assessment",
      "timingProfileId": "timing.test.ultrasound",
      "disposition": {
        "kind": "not_executed",
        "reason": "future_planned"
      }
    }
  ],
  "sourceLinkProposals": [
    {
      "sourceId": "source.trauma-initial-abdomen.wses-bowel-2022",
      "href": "https://link.springer.com/article/10.1186/s13017-022-00418-y",
      "label": "Smyth L, Bendinelli C, Lee N, et al. WSES guidelines on blunt and penetrating bowel injury: diagnosis, investigations, and treatment. World J Emerg Surg. 2022;17:13. doi:10.1186/s13017-022-00418-y.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-spleen-2022",
      "href": "https://link.springer.com/article/10.1186/s13017-022-00457-5",
      "label": "Podda M, De Simone B, Ceresoli M, et al. Follow-up strategies for patients with splenic trauma managed non-operatively: the 2022 World Society of Emergency Surgery consensus document. World J Emerg Surg. 2022;17:52. doi:10.1186/s13017-022-00457-5.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-liver-2020",
      "href": "https://link.springer.com/article/10.1186/s13017-020-00302-7",
      "label": "Coccolini F, Coimbra R, Ordonez C, et al. Liver trauma: WSES 2020 guidelines. World J Emerg Surg. 2020;15:24. doi:10.1186/s13017-020-00302-7.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-pelvis-2017",
      "href": "https://link.springer.com/article/10.1186/s13017-017-0117-6",
      "label": "Coccolini F, Stahel PF, Montori G, et al. Pelvic trauma: WSES classification and guidelines. World J Emerg Surg. 2017;12:5. doi:10.1186/s13017-017-0117-6.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-uro-2019",
      "href": "https://link.springer.com/article/10.1186/s13017-019-0274-x",
      "label": "Coccolini F, Moore EE, Kluger Y, et al. Kidney and uro-trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:54. doi:10.1186/s13017-019-0274-x.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-pancreas-duodenum-2019",
      "href": "https://link.springer.com/article/10.1186/s13017-019-0278-6",
      "label": "Coccolini F, Kobayashi L, Kluger Y, et al. Duodeno-pancreatic and extrahepatic biliary tree trauma: WSES-AAST guidelines. World J Emerg Surg. 2019;14:56. doi:10.1186/s13017-019-0278-6.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.wses-open-abdomen-2018",
      "href": "https://link.springer.com/article/10.1186/s13017-018-0167-4",
      "label": "Coccolini F, Roberts D, Ansaloni L, et al. The open abdomen in trauma and non-trauma patients: WSES guidelines. World J Emerg Surg. 2018;13:7. doi:10.1186/s13017-018-0167-4.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-renal-2023",
      "href": "https://link.springer.com/article/10.1186/s12893-023-01914-x",
      "label": "Aziz HA, Bugaev N, Baltazar G, et al. Management of adult renal trauma: a practice management guideline from the eastern association for the surgery of trauma. BMC Surg. 2023;23:22. doi:10.1186/s12893-023-01914-x.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-spleen-2012",
      "href": "https://www.east.org/education-resources/practice-management-guidelines/details/splenic-injury-blunt-selective-nonoperative-management-of",
      "label": "Stassen NA, Bhullar I, Cheng JD, et al. Selective nonoperative management of blunt splenic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S294-S300.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-liver-2012",
      "href": "https://www.east.org/education-resources/practice-management-guidelines/details/hepatic-injury-blunt-selective-nonoperative-management-of",
      "label": "Stassen NA, Bhullar I, Cheng JD, et al. Nonoperative management of blunt hepatic injury: an Eastern Association for the Surgery of Trauma practice management guideline. J Trauma Acute Care Surg. 2012;73(5 Suppl 4):S288-S293.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-penetrating-2010",
      "href": "https://www.east.org/education-resources/practice-management-guidelines/details/penetrating-abdominal-trauma%2C-selective-non-operative-management-of",
      "label": "Como JJ, Bokhari F, Chiu WC, et al. Practice management guidelines for selective nonoperative management of penetrating abdominal trauma. J Trauma. 2010;68(3):721-733.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-bladder-2019",
      "href": "https://www.east.org/education-resources/practice-management-guidelines/details/blunt-force-bladder-injuries-management-of",
      "label": "Yeung LL, McDonald AA, Como JJ, et al. Management of blunt force bladder injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2019;86(2):326-336.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.east-pancreas-2017",
      "href": "https://www.east.org/education-resources/practice-management-guidelines/details/pancreatic-injuries",
      "label": "Ho VP, Patel NJ, Bokhari F, et al. Management of adult pancreatic injuries: a practice management guideline from the Eastern Association for the Surgery of Trauma. J Trauma Acute Care Surg. 2017;82(1):185-199.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.juanpere-duodenum-imaging-2018",
      "href": "https://link.springer.com/article/10.1007/s13244-018-0593-6",
      "label": "Juanpere S, Valls L, Serra I, et al. Imaging of non-neoplastic duodenal diseases. A pictorial review with emphasis on MDCT. Insights Imaging. 2018;9:121-135. doi:10.1007/s13244-018-0593-6.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    },
    {
      "sourceId": "source.trauma-initial-abdomen.mahat-bladder-imaging-2019",
      "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6646823/",
      "label": "Mahat Y, Leong JY, Chung PH. A contemporary review of adult bladder trauma. J Inj Violence Res. 2019;11(2):101-106. doi:10.5249/jivr.v11i2.1069.",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "referrerPolicy": "no-referrer"
    }
  ]
}
```

Integration responsibilities:

```json
[
  {
    "owner": "manager",
    "kind": "acceptance_and_manifest",
    "requirement": "Eleven valid SyntheticClinicalCase records use existing clinic, capability.examination, stage 0 and reward.clinic_basic. Explicit import validates eighteen active nodes. Install accepted versions/manifest through the existing pipeline; no new setting, trauma facility, capability or adapter is required."
  },
  {
    "owner": "manager",
    "kind": "composition",
    "requirement": "Six multipart clinic chart-review cases. Exported sequences exclude parked nodes; later updates contain their own decision facts. Preserve chronology, hide future observations and review possible prior feedback. No selector or FSRS change."
  },
  {
    "owner": "manager",
    "kind": "timing_orders",
    "requirement": "Install accepted exact new-case timing/order tuples; retain reviewed tuples separately. All testing choices use existing placeholder profiles. Chart review executes no hospital test; service requests and result gates remain null."
  },
  {
    "owner": "manager",
    "kind": "source_registry",
    "requirement": "Keep the local truthful CC BY 3.0 source type when installing citations. No shared source-schema edit is required to admit these clinic case structures."
  },
  {
    "owner": "manager",
    "kind": "cross_topic",
    "requirement": "Pelvic stabilization remains background owned by trauma-head-spine-extremities. Transfusion biology, ICU physiology, asplenia prevention and pediatric-specific rules remain outside scored scope."
  }
]
```

## Owner approvals needed

All exact active questions, current clinic frames and claims require Melissa Rowland’s clinical review. No clinical approval is requested or inferred from a test result. Specific unresolved clinical choices and withheld teaching points follow; each remains unkeyed where a fair supported ranking is unavailable.

### approval.trauma-initial-abdomen.round2-exact-clinic-drafts

```json
{
  "id": "approval.trauma-initial-abdomen.round2-exact-clinic-drafts",
  "affectedVariantIds": [
    "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
    "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
    "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
    "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
    "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
    "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
    "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
    "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
    "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
    "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
    "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
    "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
    "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
    "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
    "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
    "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
    "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
    "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2"
  ],
  "competingActions": [
    "Accept the eighteen exact clinic versions after clinical and independent editorial review",
    "Withhold any version with an unacceptable source boundary or clinical content"
  ],
  "evidenceBoundary": "Nine clinical payloads retain editorial PASS only. Nine revised payloads and eleven neutral clinic frames need review. Automated validation is not clinical approval.",
  "preciseQuestion": "Melissa Rowland: are these eighteen clinical keys/rationales, fifty-five mapped claims, three changed meanings and eleven clinic frames clinically acceptable?",
  "status": "needs_clinician_review"
}
```

### hold.trauma-initial-abdomen.selected-stab-observation-versus-laparoscopy

```json
{
  "id": "hold.trauma-initial-abdomen.selected-stab-observation-versus-laparoscopy",
  "affectedItemOrConcept": "Selected nonoperative management after a stable evaluable abdominal stab wound",
  "competingActions": [
    "CT-supported serial abdominal examinations",
    "Diagnostic abdominal laparoscopy"
  ],
  "evidenceBoundary": "Public WSES/EAST guidance supports selected observation but also permits diagnostic laparoscopy. The attempted peritoneal-breach-only contrast did not establish that laparoscopy was an incorrect plan. No scored question or key retained.",
  "preciseQuestion": "What patient-specific unresolved injury or accepted care goal should distinguish observation from diagnostic laparoscopy without implying one is universally wrong?"
}
```

### hold.trauma-initial-abdomen.initial-pelvic-packing-versus-angio

```json
{
  "id": "hold.trauma-initial-abdomen.initial-pelvic-packing-versus-angio",
  "affectedItemOrConcept": "hold.trauma-initial-abdomen.initial-pelvic-packing-versus-angio",
  "competingActions": [
    "Initial preperitoneal packing",
    "Immediate pelvic angiography/embolization"
  ],
  "evidenceBoundary": "No universal initial ranking is derived from a single older guideline. The scored pair instead starts after completed treatment and uses newly established source evidence.",
  "preciseQuestion": "Which institution/protocol and patient-specific constraint should govern an initial-route question? REBOA superiority or routine-use rules remain withheld."
}
```

### hold.trauma-initial-abdomen.stable-renal-bleeding-embolization

```json
{
  "id": "hold.trauma-initial-abdomen.stable-renal-bleeding-embolization",
  "affectedItemOrConcept": "hold.trauma-initial-abdomen.stable-renal-bleeding-embolization",
  "competingActions": [
    "Renal angioembolization",
    "Continued observation"
  ],
  "evidenceBoundary": "EAST 2023 made no recommendation for a universal embolization-versus-observation choice in stable adults with ongoing renal bleeding.",
  "preciseQuestion": "Which additional clinical discriminator, if any, should justify a keyed renal embolization question beyond the guideline evidence limit?"
}
```

### hold.trauma-initial-abdomen.pancreatic-mrcp-versus-ercp

```json
{
  "id": "hold.trauma-initial-abdomen.pancreatic-mrcp-versus-ercp",
  "affectedItemOrConcept": "hold.trauma-initial-abdomen.pancreatic-mrcp-versus-ercp",
  "competingActions": [
    "MRCP for duct assessment",
    "ERCP for duct assessment/intervention"
  ],
  "evidenceBoundary": "Both are supported in selected stable duct-uncertainty contexts. No universally decisive test ranking or normal-MRCP rule was authored.",
  "preciseQuestion": "Which therapeutic need or acquisition finding should distinguish these tests for an exact future item?"
}
```

### approval.trauma-initial-abdomen.conditional-reassessment-boundaries

```json
{
  "id": "approval.trauma-initial-abdomen.conditional-reassessment-boundaries",
  "affectedVariantIds": [
    "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
    "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2"
  ],
  "competingActions": [
    "Intervention versus continued decompression for prolonged functional duodenal obstruction",
    "Collection drainage versus ERCP adjunct for a documented failed drain path"
  ],
  "evidenceBoundary": "Conditional low-certainty duodenal escalation guidance; constructed application of bile-collection drainage principles. Selected decisions, not universal deadlines or technique rankings.",
  "preciseQuestion": "Confirm the supplied course and anatomy make each key fair among its stated options, with no missing discriminator.",
  "status": "needs_clinician_review"
}
```

Five unkeyed planning/source holds remain outside scored totals:

```json
[
  {
    "id": "hold.trauma-initial-abdomen.selected-stab-observation-versus-laparoscopy",
    "kind": "clinical_ranking",
    "status": "held_for_owner",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "proposedConstruct": "Selected nonoperative management after a stable evaluable abdominal stab wound",
    "competingActions": [
      "CT-supported serial abdominal examinations",
      "Diagnostic abdominal laparoscopy"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.penetrating-observation",
      "claim.trauma-initial-abdomen.unreliable-exam"
    ],
    "reason": "Public WSES/EAST guidance supports selected observation but also permits diagnostic laparoscopy. The attempted peritoneal-breach-only contrast did not establish that laparoscopy was an incorrect plan. No scored question or key retained.",
    "ownerQuestion": "What patient-specific unresolved injury or accepted care goal should distinguish observation from diagnostic laparoscopy without implying one is universally wrong?",
    "nextAction": "Melissa resolves the clinical discriminator, then manager commissions a new exact version."
  },
  {
    "id": "hold.trauma-initial-abdomen.initial-pelvic-packing-versus-angio",
    "kind": "institution_dependent_strategy",
    "status": "held_for_owner",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "competingActions": [
      "Initial preperitoneal packing",
      "Immediate pelvic angiography/embolization"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.pelvic-packing-after-angio",
      "claim.trauma-initial-abdomen.pelvic-arterial-embolization"
    ],
    "reason": "No universal initial ranking is derived from a single older guideline. The scored pair instead starts after completed treatment and uses newly established source evidence.",
    "ownerQuestion": "Which institution/protocol and patient-specific constraint should govern an initial-route question? REBOA superiority or routine-use rules remain withheld.",
    "nextAction": "Obtain clinician-approved local strategy and current independent source before drafting an initial ranking."
  },
  {
    "id": "hold.trauma-initial-abdomen.stable-renal-bleeding-embolization",
    "kind": "evidence_insufficient",
    "status": "withheld_teaching_point",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "competingActions": [
      "Renal angioembolization",
      "Continued observation"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.renal-evidence-limit"
    ],
    "reason": "EAST 2023 made no recommendation for a universal embolization-versus-observation choice in stable adults with ongoing renal bleeding.",
    "ownerQuestion": "Which additional clinical discriminator, if any, should justify a keyed renal embolization question beyond the guideline evidence limit?",
    "nextAction": "Retain insufficiency rather than import the splenic blush rule into the kidney."
  },
  {
    "id": "hold.trauma-initial-abdomen.pancreatic-mrcp-versus-ercp",
    "kind": "clinical_ranking",
    "status": "withheld_teaching_point",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "competingActions": [
      "MRCP for duct assessment",
      "ERCP for duct assessment/intervention"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.pancreatic-duct-evaluate"
    ],
    "reason": "Both are supported in selected stable duct-uncertainty contexts. No universally decisive test ranking or normal-MRCP rule was authored.",
    "ownerQuestion": "Which therapeutic need or acquisition finding should distinguish these tests for an exact future item?",
    "nextAction": "Source and review a patient-specific test-ranking boundary before drafting."
  },
  {
    "id": "hold.trauma-initial-abdomen.colon-rectal-repair-diversion",
    "kind": "current_source_access",
    "status": "withheld_teaching_point",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "competingActions": [
      "Primary repair/anastomosis",
      "Diversion and staged reconstruction"
    ],
    "evidenceClaimIds": [
      "claim.trauma-initial-abdomen.bowel-resection-risk"
    ],
    "reason": "New 2026 WSES colon/rectal guidance was discovered, but full accessible rights-verified recommendations were not used. Rectal examination/proctoscopy, diversion, washout and drainage rules are not filled from old recall.",
    "ownerQuestion": null,
    "nextAction": "Manager assigns targeted permitted-source access and an exact current-guidance review; no clinical key until support is adequate."
  }
]
```

The four quality parks are a separate editorial disposition, not five additional scored questions or a clinical retirement. No foundational exception has been accepted for them.

## Advisory lint and manual dispositions

Pure authored-text advisory check: 25 visible contexts, 32 findings; every finding has a written disposition. These are lexical warnings, not clinical judgments or a statistical gate. Future and parked feedback are excluded. Frozen PASS content is preserved even when a heuristic warns.

```json
{
  "linterVersion": "question-cue-lint.2026-11-04.v8",
  "kind": "offline_authored_text_only",
  "contexts": 25,
  "findingCount": 32,
  "contextRows": [
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 1
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-equivocal-observation.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 5
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 5
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-arterial-intervention.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-grade-versus-physiology.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 1
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 2
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 2
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 2
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 2
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 3
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 4
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 1
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-intraperitoneal-repair.v2",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 1
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-isolated-urine-leak.v1",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.pancreas-distal-duct-operation.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 3
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-repair-scope.v2",
      "reviewContext": "all_possible_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-contained-hematoma.v1",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    },
    {
      "questionVariantId": "question.topic.trauma-initial-abdomen.jejunum-primary-repair.v2",
      "reviewContext": "no_prior_feedback",
      "findingCount": 0
    }
  ],
  "findings": [
    {
      "id": "5f67bfada9620c89",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.crash-staged-control.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.crash-staged-control.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.1.value",
          "text": "abdominal",
          "start": 55,
          "end": 64
        },
        {
          "field": "answerChoices.label",
          "text": "abdominal",
          "start": 28,
          "end": 37,
          "choiceId": "choice.topic.trauma-initial-abdomen.crash-fascial-closure.r2.temporary"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.crash-fascial-closure.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "The shared abdominal site names the same wall decision in all three plans. It does not reveal whether unresolved local tissue findings outweigh recovered physiology and tolerated approximation.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3275a6d382475174",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.belt-equivocal-observation.exhibit.0.value",
          "text": "pelvic",
          "start": 34,
          "end": 40
        },
        {
          "field": "answerChoices.label",
          "text": "pelvic",
          "start": 39,
          "end": 45,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "48a2f08c5f35ad9b",
      "rule": "key-test-name-in-context",
      "severity": "advisory",
      "message": "A named test/alias in the context identifies the keyed test.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "CT",
          "start": 41,
          "end": 43
        },
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "ce66ff013d8c53b9",
      "rule": "key-test-name-in-context",
      "severity": "advisory",
      "message": "A named test/alias in the context identifies the keyed test.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.belt-equivocal-observation.exhibit.0.label",
          "text": "CT",
          "start": 0,
          "end": 2
        },
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "0091d8cdaf73ea3b",
      "rule": "unique-key-abbreviation",
      "severity": "advisory",
      "message": "An abbreviation occurs only in the key; check naming/style parity.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "205445b24d58459b",
      "rule": "unique-key-test-name",
      "severity": "advisory",
      "message": "Only the key matches the small named-test lexicon; check semantic and naming parity.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3275a6d382475174",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.belt-equivocal-observation.exhibit.0.value",
          "text": "pelvic",
          "start": 34,
          "end": 40
        },
        {
          "field": "answerChoices.label",
          "text": "pelvic",
          "start": 39,
          "end": 45,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "48a2f08c5f35ad9b",
      "rule": "key-test-name-in-context",
      "severity": "advisory",
      "message": "A named test/alias in the context identifies the keyed test.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "CT",
          "start": 41,
          "end": 43
        },
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "ce66ff013d8c53b9",
      "rule": "key-test-name-in-context",
      "severity": "advisory",
      "message": "A named test/alias in the context identifies the keyed test.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.belt-equivocal-observation.exhibit.0.label",
          "text": "CT",
          "start": 0,
          "end": 2
        },
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "0091d8cdaf73ea3b",
      "rule": "unique-key-abbreviation",
      "severity": "advisory",
      "message": "An abbreviation occurs only in the key; check naming/style parity.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "205445b24d58459b",
      "rule": "unique-key-test-name",
      "severity": "advisory",
      "message": "Only the key matches the small named-test lexicon; check semantic and naming parity.",
      "caseId": "case.topic.trauma-initial-abdomen.belt-bowel-evolution.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.belt-bowel-evolution.clinic-review.v2",
      "evidence": [
        {
          "field": "answerChoices.label",
          "text": "CT",
          "start": 46,
          "end": 48,
          "choiceId": "choice.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.r2.ct"
        }
      ],
      "metrics": {
        "aliasGroup": "CT"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.belt-evolving-repeat-imaging.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "CT and pelvic terminology identify the actual prior acquired study and the target of reassessment. The neutral task also offers continued observation and exploration; worsening course after an equivocal scan earns repeat CT. Removing the study chronology would recreate the review fairness defect. An acronym is not an indication.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "81b4a8f093ed002f",
      "rule": "case-detail-key-rationale-overlap",
      "severity": "advisory",
      "message": "A case-detail phrase repeats only the explicit keyed reason. Review for pre-answer teaching; raw decision-critical evidence may justify the overlap. Synonymous paraphrases still require human review.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "a hepatic arterial",
          "start": 78,
          "end": 96
        },
        {
          "field": "authoring.answerChoices.rationale",
          "text": "a hepatic arterial",
          "start": 86,
          "end": 104,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
          "postAnswerMetadata": true
        }
      ],
      "metrics": {
        "explicitRationalesCompared": 3
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS clinical content. Prior hemostasis and possible biliary-management feedback are historical context; the current phase-dependent arterial finding still determines the keyed route. Original independent PASS is retained, with no wording edit to chase advisory lint.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "81b4a8f093ed002f",
      "rule": "case-detail-key-rationale-overlap",
      "severity": "advisory",
      "message": "A case-detail phrase repeats only the explicit keyed reason. Review for pre-answer teaching; raw decision-critical evidence may justify the overlap. Synonymous paraphrases still require human review.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "a hepatic arterial",
          "start": 78,
          "end": 96
        },
        {
          "field": "authoring.answerChoices.rationale",
          "text": "a hepatic arterial",
          "start": 86,
          "end": 104,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize",
          "postAnswerMetadata": true
        }
      ],
      "metrics": {
        "explicitRationalesCompared": 3
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS clinical content. Prior hemostasis and possible biliary-management feedback are historical context; the current phase-dependent arterial finding still determines the keyed route. Original independent PASS is retained, with no wording edit to chase advisory lint.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "af788bd179d53427",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "feedback.liver-grade-versus-physiology.choice.topic.trauma-initial-abdomen.liver-grade-versus-physiology.angiography",
          "text": "embolization",
          "start": 119,
          "end": 131
        },
        {
          "field": "answerChoices.label",
          "text": "embolization",
          "start": 35,
          "end": 47,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.embolize"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-delayed-arterial-bleeding.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS clinical content. Prior hemostasis and possible biliary-management feedback are historical context; the current phase-dependent arterial finding still determines the keyed route. Original independent PASS is retained, with no wording edit to chase advisory lint.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "5be31e2782265ad3",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "collection",
          "start": 92,
          "end": 102
        },
        {
          "field": "answerChoices.label",
          "text": "collection",
          "start": 40,
          "end": 50,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Drain and collection name the actual device/output and cavity being reassessed. Their presence does not establish that the device is ineffective: its position and injection result supply that inference. With a communicating catheter and controlled cavity the ERCP adjunct could become the next action.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "6bb58da1571ef1dc",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "drain",
          "start": 210,
          "end": 215
        },
        {
          "field": "answerChoices.label",
          "text": "drain",
          "start": 51,
          "end": 56,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Drain and collection name the actual device/output and cavity being reassessed. Their presence does not establish that the device is ineffective: its position and injection result supply that inference. With a communicating catheter and controlled cavity the ERCP adjunct could become the next action.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "5be31e2782265ad3",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "collection",
          "start": 92,
          "end": 102
        },
        {
          "field": "answerChoices.label",
          "text": "collection",
          "start": 40,
          "end": 50,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Drain and collection name the actual device/output and cavity being reassessed. Their presence does not establish that the device is ineffective: its position and injection result supply that inference. With a communicating catheter and controlled cavity the ERCP adjunct could become the next action.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "6bb58da1571ef1dc",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.liver-complication-chain.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.liver-complication-chain.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "drain",
          "start": 210,
          "end": 215
        },
        {
          "field": "answerChoices.label",
          "text": "drain",
          "start": 51,
          "end": 56,
          "choiceId": "choice.topic.trauma-initial-abdomen.liver-infected-bile-collection.r2.drain"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.liver-infected-bile-collection.v2",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Drain and collection name the actual device/output and cavity being reassessed. Their presence does not establish that the device is ineffective: its position and injection result supply that inference. With a communicating catheter and controlled cavity the ERCP adjunct could become the next action.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "e303bead89a8fc26",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.3.value",
          "text": "without intraperitoneal fluid",
          "start": 55,
          "end": 84
        },
        {
          "field": "exhibit.3.value",
          "text": "intraperitoneal",
          "start": 63,
          "end": 78
        },
        {
          "field": "answerChoices.label",
          "text": "Intraperitoneal",
          "start": 0,
          "end": 15,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Negative intraperitoneal findings are necessary compartment/safety information, not a substitute for interpreting the completed negative angiogram and ongoing pelvic hemorrhage. Preserve exact reviewed wording.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "e58ee83652487e9a",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "no intraperitoneal injury",
          "start": 69,
          "end": 94
        },
        {
          "field": "exhibit.0.value",
          "text": "intraperitoneal",
          "start": 72,
          "end": 87
        },
        {
          "field": "answerChoices.label",
          "text": "Intraperitoneal",
          "start": 0,
          "end": 15,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-packing-after-angio.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Negative intraperitoneal findings are necessary compartment/safety information, not a substitute for interpreting the completed negative angiogram and ongoing pelvic hemorrhage. Preserve exact reviewed wording.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3a4dca203ed0a163",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.0.value",
          "text": "no intraperitoneal injury",
          "start": 69,
          "end": 94
        },
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.0.value",
          "text": "intraperitoneal",
          "start": 72,
          "end": 87
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3eebc377a0d87978",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "no new intraperitoneal abnormality",
          "start": 114,
          "end": 148
        },
        {
          "field": "exhibit.0.value",
          "text": "intraperitoneal",
          "start": 121,
          "end": 136
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "aae428d31bc13563",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.3.value",
          "text": "without intraperitoneal fluid",
          "start": 55,
          "end": 84
        },
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.3.value",
          "text": "intraperitoneal",
          "start": 63,
          "end": 78
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3a4dca203ed0a163",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.0.value",
          "text": "no intraperitoneal injury",
          "start": 69,
          "end": 94
        },
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.0.value",
          "text": "intraperitoneal",
          "start": 72,
          "end": 87
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "3eebc377a0d87978",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "no new intraperitoneal abnormality",
          "start": 114,
          "end": 148
        },
        {
          "field": "exhibit.0.value",
          "text": "intraperitoneal",
          "start": 121,
          "end": 136
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "aae428d31bc13563",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.3.value",
          "text": "without intraperitoneal fluid",
          "start": 55,
          "end": 84
        },
        {
          "field": "prior.pelvis-packing-after-angio.exhibit.3.value",
          "text": "intraperitoneal",
          "start": 63,
          "end": 78
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "effec00149917d01",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.pelvic-mixed-hemorrhage.clinic-review.v2",
      "evidence": [
        {
          "field": "feedback.pelvis-packing-after-angio.choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
          "text": "no intraperitoneal operative source",
          "start": 75,
          "end": 110
        },
        {
          "field": "feedback.pelvis-packing-after-angio.choice.topic.trauma-initial-abdomen.pelvis-packing-after-angio.laparotomy",
          "text": "intraperitoneal",
          "start": 78,
          "end": 93
        },
        {
          "field": "answerChoices.label",
          "text": "intraperitoneal",
          "start": 11,
          "end": 26,
          "choiceId": "choice.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.laparotomy"
        }
      ],
      "metrics": {
        "term": "intraperitoneal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.pelvis-recurrent-arterial-focus.v1",
      "reviewContext": "all_possible_prior_feedback",
      "manualDisposition": {
        "decision": "pass_preserved_exact",
        "reason": "Frozen PASS. Earlier/current negative intraperitoneal observations preserve source localization. They do not choose repeat packing versus embolization; the new expanding arterial-phase focus and current response resolve that competition.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "8e44c39b1a4d09fc",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.bladder-protocol-and-repair.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.bladder-protocol-and-repair.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.1.value",
          "text": "bladder",
          "start": 136,
          "end": 143
        },
        {
          "field": "answerChoices.label",
          "text": "bladder",
          "start": 31,
          "end": 38,
          "choiceId": "choice.topic.trauma-initial-abdomen.bladder-acquisition.r2.cystogram"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.bladder-acquisition.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Bladder names the actual target in the acquisition observations. All options address specific parts of the urinary tract; the learner must distinguish upper-tract excretion from an adequate bladder study. Removing filling observations would erase the required acquisition-quality inference.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "d21ab377fbddf4c3",
      "rule": "near-duplicate-options",
      "severity": "advisory",
      "message": "Labels overlap substantially; small differences can be meaningful and need review.",
      "caseId": "case.topic.trauma-initial-abdomen.renal-stage-and-observe.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.renal-stage-and-observe.clinic-review.v2",
      "evidence": [
        {
          "field": "answerChoices.label",
          "text": "IV-contrast CT with arterial, venous and excretory acquisitions",
          "start": 0,
          "end": 63,
          "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.complete"
        },
        {
          "field": "answerChoices.label",
          "text": "IV-contrast CT with arterial and venous acquisitions",
          "start": 0,
          "end": 52,
          "choiceId": "choice.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.r2.vascular"
        }
      ],
      "metrics": {
        "jaccard": 0.875,
        "differingTerms": [
          "excretory"
        ]
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.renal-no-hematuria-protocol.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "The near-duplicate CT labels now intentionally differ by a clinically consequential excretory acquisition. They are explicitly complete, mutually different protocol sets. This exact phase distinction is the tested decision, not two names for an overlapping scan.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "2aae97030acc19f7",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2",
      "evidence": [
        {
          "field": "currentUpdate",
          "text": "wall",
          "start": 42,
          "end": 46
        },
        {
          "field": "answerChoices.label",
          "text": "wall",
          "start": 28,
          "end": 32,
          "choiceId": "choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.evacuate"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Wall is necessary lesion localization, not an instruction to operate. Absence of leak/destructive wall loss preserves the nonperforating course and the safety boundary against bypass. Prolonged failed passage despite a smaller collection, not a matched word, separates intervention from continued decompression.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "8518295a6aa6da37",
      "rule": "key-only-word-overlap",
      "severity": "advisory",
      "message": "A substantive word appears in the context and key only; clinical relevance may justify it.",
      "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "wall",
          "start": 185,
          "end": 189
        },
        {
          "field": "answerChoices.label",
          "text": "wall",
          "start": 28,
          "end": 32,
          "choiceId": "choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.evacuate"
        }
      ],
      "metrics": {},
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Wall is necessary lesion localization, not an instruction to operate. Absence of leak/destructive wall loss preserves the nonperforating course and the safety boundary against bypass. Prolonged failed passage despite a smaller collection, not a matched word, separates intervention from continued decompression.",
        "independent": false,
        "clinicalApproval": false
      }
    },
    {
      "id": "2a456606e1973e4e",
      "rule": "negative-aligned-to-distractor",
      "severity": "advisory",
      "message": "A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
      "caseId": "case.topic.trauma-initial-abdomen.duodenal-injury-course.v2",
      "profileId": "profile.topic.trauma-initial-abdomen.duodenal-injury-course.clinic-review.v2",
      "evidence": [
        {
          "field": "exhibit.0.value",
          "text": "no extraluminal gas, contrast leak or destructive loss of the duodenal wall",
          "start": 114,
          "end": 189
        },
        {
          "field": "exhibit.0.value",
          "text": "duodenal",
          "start": 176,
          "end": 184
        },
        {
          "field": "answerChoices.label",
          "text": "Duodenal",
          "start": 0,
          "end": 8,
          "choiceId": "choice.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.r2.bypass"
        }
      ],
      "metrics": {
        "term": "duodenal"
      },
      "questionVariantId": "question.topic.trauma-initial-abdomen.duodenum-contained-wall-injury.v2",
      "reviewContext": "no_prior_feedback",
      "manualDisposition": {
        "decision": "retain_fair_moderate_for_independent_review",
        "reason": "Wall is necessary lesion localization, not an instruction to operate. Absence of leak/destructive wall loss preserves the nonperforating course and the safety boundary against bypass. Prolonged failed passage despite a smaller collection, not a matched word, separates intervention from continued decompression.",
        "independent": false,
        "clinicalApproval": false
      }
    }
  ],
  "manualDispositionPending": false,
  "summary": {
    "key-only-word-overlap": 11,
    "key-test-name-in-context": 4,
    "unique-key-abbreviation": 2,
    "unique-key-test-name": 2,
    "case-detail-key-rationale-overlap": 2,
    "negative-aligned-to-distractor": 10,
    "near-duplicate-options": 1
  },
  "scope": "25 displayed-text contexts: 18 current finite profiles plus 7 later-node all-possible-prior-feedback paths. Separate exhibit text fields; no serialized JSON field names, future observations, parked feedback, source metadata or performance/save inputs.",
  "repairEvidence": "Final label-parity review removed a site/resection convergence cue and a bladder-target-only label match; prior image-guided wording was removed from the bile-drain history. These were within the single v2 revision attempt, before handoff. Counts are advisory, not quality scores or a clinical gate."
}
```

## Validation

Commands ran from `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`. Focused tests validate structure and preservation; they do not approve the medicine.

```json
{
  "state": "round2_focused_pass_not_clinical_approval",
  "workingDirectory": "C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content",
  "commands": [
    {
      "command": "npm.cmd test -- --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts",
      "exitCode": 0,
      "testsPassed": 50,
      "testsFailed": 0,
      "testFilesPassed": 1,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n\n Test Files  1 passed (1)\n      Tests  50 passed (50)\n   Start at  12:55:39\n   Duration  4.68s (transform 2.62s, setup 0ms, import 4.47s, tests 68ms, environment 0ms)\n\n",
      "wallTimeSeconds": 5.4618993
    },
    {
      "command": "npm.cmd run typecheck",
      "exitCode": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 typecheck\n> tsc --noEmit -p tsconfig.json\n\n",
      "wallTimeSeconds": 2.9072787
    }
  ],
  "priorRun": {
    "testsPassed": 50,
    "testsFailed": 0,
    "exitCode": 0,
    "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n\n Test Files  1 passed (1)\n      Tests  50 passed (50)\n   Start at  12:44:44\n   Duration  4.61s (transform 2.60s, setup 0ms, import 4.43s, tests 62ms, environment 0ms)\n\n",
    "reasonForClosingRepeat": "Final label-parity and prior-route wording repairs changed three revised clinical items after the first passing run. Closing commands above validate those exact clinical payloads."
  },
  "inputDrift": {
    "checkedFiles": 443,
    "changedFiles": [],
    "namedAssignmentChecks": 8,
    "namedAssignmentDrift": [],
    "method": "SHA-256 of current bytes compared with the existing captured program input records; no file writes."
  },
  "advisory": {
    "linterVersion": "question-cue-lint.2026-11-04.v8",
    "contexts": 25,
    "findings": 32,
    "undisposed": 0,
    "codeEntryPoint": "tools/question-quality/lint.mjs: lintQuestion (pure authored-text call through node_repl)",
    "clinicalApproval": false
  },
  "scope": "Only the assigned focused test file, clinical-content typecheck, pure authored-text advisory lint, JSON parsing and input/freeze/artifact checks. No broader tests, browser, installation, default admission, deployment or clinical approval.",
  "artifactMetadataAfterClosingRun": "Only progress, report and validation metadata completed after this closing run. No task, update, exhibit, option, key, explanation, clinical claim, concept definition, timing tuple, exact-version locator or tested clinical hash changed.",
  "jsonParse": {
    "exitCode": 0,
    "code": "for (const file of [packetPath, ledgerPath]) JSON.parse(await fs.readFile(file, \"utf8\"));",
    "output": "PASS: both owned JSON files parse; schemaVersion=1 for each.",
    "results": [
      {
        "path": "docs/research/question-topic-trauma-initial-abdomen-20261111.json",
        "schemaVersion": 1
      },
      {
        "path": "docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json",
        "schemaVersion": 1
      }
    ]
  },
  "commandsBeforeLocatorCorrection": [
    {
      "command": "npm.cmd test -- --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts",
      "exitCode": 0,
      "testsPassed": 50,
      "testsFailed": 0,
      "testFilesPassed": 1,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 test\n> vitest run --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts\n\n\n RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content\n\n\n Test Files  1 passed (1)\n      Tests  50 passed (50)\n   Start at  12:52:33\n   Duration  4.87s (transform 2.80s, setup 0ms, import 4.69s, tests 69ms, environment 0ms)\n\n",
      "wallTimeSeconds": 6.1208444
    },
    {
      "command": "npm.cmd run typecheck",
      "exitCode": 0,
      "output": "\n> @gamify-surgery/clinical-content@0.0.1 typecheck\n> tsc --noEmit -p tsconfig.json\n\n",
      "wallTimeSeconds": 3.5786566
    }
  ],
  "artifactQualityCheck": {
    "exitCode": 0,
    "output": "PASS: 22 reviewed candidates reconciled; 18 active, 4 parked\nPASS: Every reviewed exact variant has one status and response\nPASS: Markdown contains every current full task, exact identity and draft hash\nPASS: Markdown contains every reviewed before identity/task/hash\nPASS: All five unkeyed holds retained in both packets\nPASS: Every case has an existing clinic frame and active nodes\nPASS: No current care-setting adapter dependency remains\nPASS: PASS clinical payload preserved: belt-equivocal-observation\nPASS: PASS clinical payload preserved: spleen-arterial-intervention\nPASS: PASS clinical payload preserved: liver-grade-versus-physiology\nPASS: PASS clinical payload preserved: liver-delayed-arterial-bleeding\nPASS: PASS clinical payload preserved: pelvis-packing-after-angio\nPASS: PASS clinical payload preserved: pelvis-recurrent-arterial-focus\nPASS: PASS clinical payload preserved: renal-isolated-urine-leak\nPASS: PASS clinical payload preserved: pancreas-distal-duct-operation\nPASS: PASS clinical payload preserved: renal-contained-hematoma\nPASS: 15 full source records and 55 atomic claims, with reciprocal current/history mappings\nPASS: All 32 authored-text advisories have a manual disposition\nPASS: All fifteen external clinical links have safe opening metadata\nPASS: All current export locators point to exact current IDs\nPASS: All 443 captured inputs and eight named assignment inputs unchanged\nPASS: Both owned JSON files parse after final writes\n",
    "checks": [
      "22 reviewed candidates reconciled; 18 active, 4 parked",
      "Every reviewed exact variant has one status and response",
      "Markdown contains every current full task, exact identity and draft hash",
      "Markdown contains every reviewed before identity/task/hash",
      "All five unkeyed holds retained in both packets",
      "Every case has an existing clinic frame and active nodes",
      "No current care-setting adapter dependency remains",
      "PASS clinical payload preserved: belt-equivocal-observation",
      "PASS clinical payload preserved: spleen-arterial-intervention",
      "PASS clinical payload preserved: liver-grade-versus-physiology",
      "PASS clinical payload preserved: liver-delayed-arterial-bleeding",
      "PASS clinical payload preserved: pelvis-packing-after-angio",
      "PASS clinical payload preserved: pelvis-recurrent-arterial-focus",
      "PASS clinical payload preserved: renal-isolated-urine-leak",
      "PASS clinical payload preserved: pancreas-distal-duct-operation",
      "PASS clinical payload preserved: renal-contained-hematoma",
      "15 full source records and 55 atomic claims, with reciprocal current/history mappings",
      "All 32 authored-text advisories have a manual disposition",
      "All fifteen external clinical links have safe opening metadata",
      "All current export locators point to exact current IDs",
      "All 443 captured inputs and eight named assignment inputs unchanged",
      "Both owned JSON files parse after final writes"
    ],
    "clinicalApproval": false
  }
}
```

## Final bounded handoff

```json
{
  "topic": "trauma-initial-abdomen",
  "filesChanged": [
    "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.ts",
    "packages/clinical-content/src/question-topic-trauma-initial-abdomen-20261111.test.ts",
    "docs/research/question-topic-trauma-initial-abdomen-20261111.json",
    "docs/research/question-topic-trauma-initial-abdomen-20261111.md",
    "docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json"
  ],
  "inventory": "Original complete program assignment: zero variants/concepts/cases/nodes. Review batch: 22 exact variants / 22 case-node contexts. Default 145-row manifest / 1151 cases / 1462 nodes / 610 concepts; captured input drift recorded in validation.",
  "counts": {
    "audited": 22,
    "keptPassPreserved": 9,
    "rewrittenActive": 9,
    "parkedAfterOneAttempt": 4,
    "retiredAndReplacedProposed": 0,
    "newActiveToDefault": 18
  },
  "countBasis": "22 reviewed candidate variants / 22 case-node rows, separate from the original zero-row program assignment. 9 exact clinical PASS payloads retained, 9 revised active questions, 4 parked attempts. 18 active new-to-default questions across 11 clinic cases and 18 unique active meanings; 24 meaning records retain original history, including 3 newly versioned changes. No retirement or installation performed.",
  "heldUnkeyed": {
    "count": 5,
    "exactIds": [
      "hold.trauma-initial-abdomen.selected-stab-observation-versus-laparoscopy",
      "hold.trauma-initial-abdomen.initial-pelvic-packing-versus-angio",
      "hold.trauma-initial-abdomen.stable-renal-bleeding-embolization",
      "hold.trauma-initial-abdomen.pancreatic-mrcp-versus-ercp",
      "hold.trauma-initial-abdomen.colon-rectal-repair-diversion"
    ],
    "qualityParks": [
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.crash-operative-route.v2",
        "reason": "One neutral-task revision attempt preserves recurrent shock and positive FAST. It still has one consequential recognition step; no supported competing localization evidence can be added without changing or obscuring the emergency. No accepted foundational exception exists. Excluded from runtime supply."
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.crash-abbreviated-operation.v2",
        "reason": "One same-stage revision removes the original option cues but retains an easy damage-control recognition rule with a weak third competitor. Adding unsupported anastomotic cutoffs would not repair it. Excluded pending an accepted foundational purpose or a different supported construct."
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.belt-bowel-wall-defect.v2",
        "reason": "One revision attempt still yields a single obvious operative-recognition answer, with no fair close competitor under the stated direct wall defect, gas and guarding. No safety findings were removed to make uncertainty. Excluded from runtime."
      },
      {
        "questionVariantId": "question.topic.trauma-initial-abdomen.spleen-failed-nonoperative.v2",
        "reason": "One chronology/task revision resolves the actual clarity error. Profound persistent shock still makes this foundational recognition; it shares the initial crash operative-rescue meaning and cannot be counted as another difficult objective. No accepted basic exception exists. Excluded from runtime."
      }
    ]
  },
  "research": "18 active meanings with practical raw-evidence/management decisions; 55 original atomic claims / 15 permitted source records. Conditional duodenal escalation and constructed catheter-drainage inference remain explicitly limited. Central retroperitoneal, global survey, follow-up and colon/rectal evidence gaps remain documented.",
  "packet": {
    "markdown": "docs/research/question-topic-trauma-initial-abdomen-20261111.md",
    "json": "docs/research/question-topic-trauma-initial-abdomen-20261111.json",
    "sources": "docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json"
  },
  "identityPreservation": "Nine PASS clinical payloads, their gates and all reviewed originals retained exactly. Six revised active meanings retain IDs; three changed meanings get separate v2 IDs. No FSRS/save/history migration or clinical approval.",
  "ownerApprovalsNeeded": "Melissa Rowland clinical review of all 18 exact clinical candidates, 55 claims and 11 neutral clinic frames, including conditional duodenal escalation and recurrent undrained bile-collection reasoning; four clinical-ranking holds remain unkeyed, plus one source-access hold. Independent editorial review remains required for the nine revised versions and neutral frame changes.",
  "integration": "Normal existing clinic cases use examination, stage 0 and clinic_basic reward; no new setting, capability or adapter. Manager installs accepted concept/case/source/choice-timing identities and reviews six multipart sequences through the existing acceptance pipeline. Shared files untouched.",
  "validation": "From packages/clinical-content: npm.cmd test -- --pool=threads src/question-topic-trauma-initial-abdomen-20261111.test.ts: exit 0, 1 file / 50 passed / 0 failed. npm.cmd run typecheck: exit 0. Both JSON files parse. Exact outputs, 443-input no-drift check and report checks are recorded in validation.",
  "openWork": "Manager inspects actual diff and validation, obtains independent/clinical review, resolves retained unkeyed decisions and accepts/installs exact versions. No further worker changes or release actions authorized.",
  "localOnly": "No commit, push, deploy, install or agents; manager owns backup checkpoint coordination."
}
```

Short summary: nine PASS clinical payloads preserved exactly; nine fair moderate two-step revisions retained; four recognition/weak-competitor attempts parked. All eleven current cases use the existing clinic chart-review setting. Eighteen questions remain candidates for manager, independent editorial and named clinical review.

<!-- END PRE-SALVAGE ROUND2 ARCHIVE -->
