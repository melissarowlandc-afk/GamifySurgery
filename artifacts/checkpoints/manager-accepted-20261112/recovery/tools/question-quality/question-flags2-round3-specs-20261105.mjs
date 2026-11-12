import fs from 'node:fs';
export const intake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags2-round3-before-20261105.json','utf8'));
export const original=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json','utf8'));
export const version='clinical.question-flags2-round3.2026-11-05.v1';
export const reviewPath='docs/research/question-flags2-review2-20261105.json';
export const sourceFor=id=>{
 const revision=intake.definitions.find(r=>r.auditId===id);
 const clinicalCase=intake.source.cases.find(c=>c.id===revision.caseId);
 return {revision,clinicalCase,node:clinicalCase.decisionNodes.find(n=>n.id===revision.nodeId)};
};
const test=id=>({kind:'test',timingProfileId:'timing.test.'+id});
const no={kind:'no_test'};
export const specs=[
 {
  id:'G03',title:'Separate a prior benign breast diagnosis from the current palpable finding',
  complaint:'Breast lump',
  presentation:'{patientName}, a {ageYears}-year-old woman, returns because an area in the left breast remains palpable. A previously biopsied nodule in that breast has also been followed on imaging.',
  update:'On repeat examination, the current skin marker overlies a discrete hard focus with an irregular edge and little mobility. The mobile nodule at the earlier biopsy site can be felt separately.',
  task:'Which next step is best for the assessment of {patientName}\'s current breast finding?',
  exhibit:{kind:'table',caption:'Breast examination and investigation record',columnHeaders:['Record','Reported observations'],
   rowHeaders:['Earlier nodule','Current mammography','Current targeted ultrasonography'],cells:[
    ['Core pathology: fibroadenoma without atypia; imaging and pathology concordant','The previously biopsied nodule is unchanged on serial studies'],
    ['The current skin marker is included on the diagnostic views','No corresponding mass, architectural distortion or suspicious calcifications'],
    ['Images document sweeps through the entire current marked area','No corresponding solid or cystic lesion; the earlier biopsied nodule is separately visible and unchanged'],
   ]},
  options:[
   ['Breast-team tissue sampling','The persistent hard, irregular, poorly mobile clinical focus remains concerning despite completed site-correct imaging. The earlier concordant fibroadenoma is a separate finding, so its benign diagnosis does not settle this target. Tissue assessment is indicated; the breast team selects the sampling method when no imaging target exists.'],
   ['Contrast-enhanced breast MRI','Additional imaging is a plausible response to discordance between examination and conventional studies. Here it would not replace the tissue assessment required for this persistent concerning clinical target. This does not make MRI inappropriate for every other breast indication.'],
   ['Breast examination with interval ultrasonography','Surveillance is credible for the unchanged, concordant, core-proven fibroadenoma in the record. It does not account for the separate hard, irregular clinical focus. Negative site-correct imaging does not make that examination finding concordantly benign.'],
  ],timing:[test('biopsy'),test('breast_mri'),test('ultrasound')],
  construct:{id:'concept.palpable-breast.completed-imaging-clinical-target.v1',name:'Persistent clinical breast target after completed imaging',
   objective:'Distinguish the target covered by a concordant benign diagnosis from a separate persistent concerning clinical finding, then choose tissue evaluation despite site-correct imaging without a correlate.',
   reason:'The old v1 and round-two objective selected a missing targeted acquisition. The new scored decision is management of a concerning clinical target after acquisition is complete; it must not inherit imaging-acquisition FSRS history.'},
  facts:[
   ['clinical-target','A persistent clinically concerning breast target requires tissue assessment despite mammography and targeted ultrasonography without a correlate.',['claim.gs028c.palpable.biopsy']],
   ['benign-scope','Observation of a stable, asymptomatic, concordant core-proven fibroadenoma applies to that lesion; a separate discordant clinical target is outside that observation claim.',['claim.bread-butter.fibroadenoma.concordant-observation','claim.gs028c.palpable.biopsy']],
   ['sampling-scope','When a concerning palpable breast target has no imaging correlate, the tissue-diagnosis requirement does not mandate one biopsy device or imaging-guided technique.',['claim.gs028c.palpable.biopsy']],
  ],
  claims:['claim.gs028c.palpable.biopsy','claim.bread-butter.fibroadenoma.concordant-observation'],
  limitation:'Single ACR guideline for the clinical-target decision plus recorded ASBrS/SBI guidance for the separate concordant fibroadenoma. No MRI contraindication, surveillance interval, biopsy-device ranking or empirical false-negative rate is taught.',
  steps:['Determine that the benign core/imaging concordance belongs to a different palpable nodule and does not explain the current examination.','Interpret the persistent clinical finding against complete site-correct imaging and choose tissue evaluation rather than extending benign surveillance or substituting further imaging.'],
  closest:'Carry the earlier fibroadenoma diagnosis across to the new focus and choose interval examination/ultrasonography; alternatively order problem-solving MRI to avoid acting on examination-image discordance.',
  deciding:'The current focus is reproducibly hard, irregular and poorly mobile; the earlier benign nodule is separately palpable, and current-site mammography and ultrasonography already show no correlate.',
  counterfactual:'If the only palpable finding were the unchanged mobile nodule with concordant core-proven fibroadenoma and no separate concerning focus, examination/imaging surveillance would be defensible. If current-site imaging were incomplete, the missing-acquisition decision would instead remain open.',
  attack:'With patient findings covered, all three are real breast-assessment pathways; none advertises a completed-test error or asks for a missing export. Both imaging choices remain clinically meaningful alternatives, not work documented as omitted. No task word uniquely names tissue or sampling. The key is shorter than surveillance, and no option adds a cautionary explanation. Medical interpretation is required to separate the old benign target and current clinical target.',
  category:'Three specific next assessment pathways for the same current breast finding; no definitive cancer treatment competes with an information-gathering step.',
  deletion:'Removed clock-label mismatch, log-completeness coaching, already-completed spot-compression/retrieval foils, breast-density decoration and a repeated downstream biopsy question. Kept site-correct coverage because hiding it would make another targeted acquisition defensible; kept the old nodule because it explains the closest surveillance error.',
  whatChanged:'Direct flagged v1 lineage, now a separately versioned management objective. Both studies are completed at the actual clinical site, with their negative findings specified. A separate concordant benign nodule creates a real interpretation trap. Tissue assessment, MRI and interval examination/ultrasonography replace gap-filling options. The retained draft encounter is one node; the old result gate/follow-up remain intact only in historical/live sources.',
  ownerResolution:'Resolved in this proposed version: ultrasound is no longer the key or an announced missing study; actual findings define the negative studies. The player interprets clinical/imaging discordance instead. This changes the objective and is not an accepted replacement yet.',
  responses:{
   cues:[
    'Removed both clock labels and the unacquired-site construction. Current-site studies are complete; the remaining decision depends on the clinical significance of a different finding, not matching two locations to the sole new acquisition.',
    'Removed archive retrieval and its completeness assurance as an answer discriminator. Acquisition coverage is retained only to establish that the current target truly has no imaging correlate.',
    'Removed spot-compression as a repeated-test foil. MRI and interval examination/ultrasonography now address plausible remaining approaches; neither is excluded merely by a completed-work sentence.',
   ],
   fairness:[
    'Re-aimed to the directly supported tissue-assessment boundary after site-correct imaging. The question does not prescribe a biopsy technique or claim imaging ends assessment. Its new concept separates this from the original ultrasound-acquisition card.',
    'Added a consequential prior-result attribution error: the old concordant fibroadenoma does not cover a separate reproducible clinical focus. Interpreting both target concordance and examination/imaging discordance now changes the next plan; difficulty remains an independent qualitative judgment.',
    'Retained the clinically important concordance decision, removed conspicuous wrong-site bookkeeping, and kept the exhibit an openly textual clinical record. No diagnostic picture is promised or image-reading difficulty claimed.',
    'Closed the functional owner cue by completing the ultrasound and removing it as the keyed next action. The direct flagged v1 root is versioned; B2B36 is not treated as a repair or acceptance.',
    'No new key-level hold: the management requirement and benign-lesion scope come directly from recorded ACR and ASBrS/SBI claims. They remain needs_clinician_review and have not been reaccessed or clinically approved.',
   ],
   suggestions:[
    'Kept explicit site-correct acquisition in the record. Removed the absent-site comparison instead of deleting the information needed to distinguish true negative imaging from a missing acquisition.',
    'Replaced retrieval/completed spot-compression with problem-solving MRI and interval examination/ultrasonography. With observations hidden, each is a plausible breast-assessment pathway; the clinical target interpretation is the discriminator.',
    'Removed retrieval entirely, so no hidden archive completeness premise is required and no new imaging-protocol claim is manufactured.',
    'Did not relabel wrong-site recognition as hard or add MRI as a routine required test. The scored task changes to a management application supported by the existing tissue-diagnosis claim; the old follow-up is not rehearsed as another scored node in this draft.',
   ],
  },
 },
 {
  id:'G05',title:'Decide whether an operative criterion applies after the calcium disorder is clarified',
  complaint:'Calcium workup review',
  presentation:'{patientName}, a {ageYears}-year-old {sexNoun}, returns during an endocrine-surgery workup for calcium repeatedly above the laboratory reference range with intact PTH within range. The referral and baseline skeletal assessment were requested at the first visit.',
  update:'Calcium has remained in the same mildly elevated band in earlier adult records. There are no kidney stones or fragility fractures. The completed lumbar-spine, hip and distal one-third-radius density measurements are within age-appropriate reference ranges.',
  task:'Which management should be recommended now for {patientName}\'s calcium disorder?',
  exhibit:{kind:'table',caption:'Endocrine workup record',columnHeaders:['Investigation','Reported observations'],rowHeaders:['Paired serum and urine testing','Clinical genetics report','Earlier localization study'],cells:[
   ['Complete concurrent serum and 24-hour urine collection: calcium-to-creatinine clearance ratio below 0.01','Renal function and 25-hydroxyvitamin D within reference ranges; no thiazide use'],
   ['CASR variant classified as pathogenic','The same variant was documented in relatives with longstanding hypercalcemia'],
   ['Sestamibi study obtained before the genetic report returned','Focal retained activity behind the lower left thyroid pole'],
  ]},
  options:[
   ['Biochemical surveillance','The biochemical/longitudinal pattern and pathogenic CASR result support confirmed uncomplicated familial hypocalciuric hypercalcemia. Observation with follow-up calcium measurements is appropriate for that state. Age under 50 supports parathyroidectomy in confirmed primary hyperparathyroidism, not in every cause of high calcium. The localization focus does not establish a coexisting operative disease, and the normal DXA is not the reason to avoid surgery.'],
   ['Elective parathyroidectomy','Young age and a focal localization study make this a credible plan if the disorder is assumed to be primary hyperparathyroidism. Those findings do not override the recorded inherited disorder. Parathyroid surgery usually does not correct uncomplicated FHH; a new progressive pattern or a separately established coexisting disorder would require reassessment.'],
   ['Cinacalcet therapy','Persistent hypercalcemia can tempt a medication choice when surgery is not selected. The described stable, asymptomatic inherited disorder is usually observed with calcium follow-up rather than treated simply to normalize the laboratory number.'],
  ],timing:[test('basic_labs'),no,no],
  construct:{id:'concept.phpt.inherited-calcium-before-localization.v2',name:'Inherited calcium disorder versus an apparent operative indication',
   objective:'Interpret a pathogenic calcium-sensing result in its biochemical context, then avoid applying a PHPT-specific age/localization pathway to uncomplicated FHH.',
   reason:'The round-two v1 concept selected genetic clarification before localization. The new version makes that result available and scores management despite a competing age-based operative criterion and localization focus; the diagnostic-test FSRS card must remain distinct.'},
  facts:[
   ['calcium-confirmation','In the recorded low-clearance, longstanding hypercalcemia phenotype, a pathogenic FHH-associated CASR finding supports confirmation; the low clearance ratio by itself would not.',['claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria','claim.fhh.low-cccr-supports-but-does-not-confirm','claim.fhh.genetic-and-family-confirmation']],
   ['calcium-management','Confirmed uncomplicated FHH with stable mild hypercalcemia is generally observed rather than treated with parathyroid surgery, which usually does not correct the inherited disorder.',['claim.fhh.reassurance-observation-avoid-parathyroid-surgery']],
   ['age-scope','The under-50 parathyroidectomy criterion applies after PHPT is established; normal baseline DXA is not a requirement for referral or the determinant of the inherited-disease management decision.',['claim.asymptomatic-phpt.age-under-50-surgery','claim.asymptomatic-phpt.three-site-dxa','claim.fhh.reassurance-observation-avoid-parathyroid-surgery']],
   ['localization-scope','A localization image does not itself establish the biochemical diagnosis; it does not replace the genetic/biochemical distinction between PHPT and FHH.',['claim.primary-hyperparathyroidism.biochemical-pattern','claim.fhh.genetic-and-family-confirmation']],
  ],
  claims:['claim.fhh.lifelong-mild-hypercalcemia-relative-hypocalciuria','claim.fhh.paired-urine-serum-calcium-creatinine-evaluation','claim.fhh.low-cccr-supports-but-does-not-confirm','claim.fhh.genetic-and-family-confirmation','claim.fhh.reassurance-observation-avoid-parathyroid-surgery','claim.asymptomatic-phpt.age-under-50-surgery','claim.asymptomatic-phpt.three-site-dxa','claim.primary-hyperparathyroidism.biochemical-pattern'],
  limitation:'PARAT/Fifth Workshop support the confirmed uncomplicated FHH management boundary; NIDDK supports biochemical diagnosis before localization. Duplicate Fifth Workshop source records are one publication. No negative gene result, uncertain variant, progressive disease, coexisting PHPT, cinacalcet indication/dose or localization test-performance rule is taught.',
  steps:['Interpret the low-clearance biochemical pattern plus a pathogenic CASR result as the confirmed inherited disorder, rather than treating a low ratio or family history as sufficient by itself.','Apply that diagnosis to management despite age below 50 and a focal localization study; the PHPT-specific operative criterion does not make this inherited disorder operative.'],
  closest:'Recommend parathyroidectomy because the patient is younger than 50 and an apparent localization focus exists, or select medication simply because calcium remains above range after deciding against an operation.',
  deciding:'A pathogenic CASR result is supplied in a stable, mildly elevated, low-clearance phenotype. Unlike a VUS or negative panel, this is the recorded confirmation setting; age/localization cannot be applied before deciding which disorder is present.',
  counterfactual:'If the biochemical assessment instead established PHPT after inherited mimics were addressed, the same under-50 age would support surgical assessment even with normal bone density. A VUS or negative gene result would leave uncertainty and would not support the confirmed-FHH observation key.',
  attack:'Family history cannot match a sole genetic-test option because no option is a gene test. All are named management choices of comparable length. With results hidden, no option is uniquely comprehensive or least invasive in wording; the clinical distinction is whether the young patient has operative PHPT or the confirmed inherited disorder. The gene result is an actual laboratory classification, not an authored eligibility sentence or diagnosis in the task.',
  category:'Three named management actions after diagnostic results are available; no investigation is offered as a generic cautious alternative to definitive treatment.',
  deletion:'Removed hip hardware, incomplete-acquisition bookkeeping, maternal narrative pointing to a sole gene assay and PTH-related-peptide testing. Kept normal completed bone assessment to resolve the original owner logic, the young age and localization focus to make surgery a real near-miss, and the low-clearance/genetic/trajectory evidence to distinguish inherited disease from an operative mimic.',
  whatChanged:'Replaced the family-to-gene-test task with management after a pathogenic result. Named choices are surveillance, parathyroidectomy and cinacalcet. Young age plus a prior localization focus create a consequential operative near-miss. Referral already happened; routine DXA is completed unscored context, not a permission gate or held hardware/radius key. New management concept version; old diagnostic and operative cards remain intact.',
  ownerResolution:'Resolved in this proposed version: referral is already placed and DXA is baseline information, not a prerequisite for an age-based operation. The reason surgery is not keyed is the subsequently established inherited disorder, not normal bone density. This new objective requires independent review and manager composition acceptance.',
  responses:{
   cues:[
    'Removed the sole gene-test option. A pathogenic result is now available and every option is management, so a family observation cannot match the answer label. Its classification must be interpreted against the biochemical context.',
    'Kept the meaningful longitudinal calcium observation, but it no longer points to a uniquely genetic option. It helps establish the uncomplicated stable phenotype on which the observation policy rests.',
   ],
   fairness:[
    'Moved beyond presumptive genetic clarification: a recorded pathogenic result plus the phenotype supports the confirmed-disorder management claim. The low ratio is not treated as confirmation and localization is not used as diagnosis.',
    'No negative or uncertain gene result is used. The record specifies pathogenic classification in the reported familial phenotype; the packet explicitly states that replacing it with a VUS/negative result would invalidate the confirmation-dependent key.',
    'Removed the peptide-assay foil and test matching. The closest error now applies a real age-based surgical criterion to the wrong calcium disorder, reinforced by a plausible localization record; medication is the other named management competitor.',
    'Kept the practical endocrine-surgery decision and interpretable collection conditions. Deleted hip-prosthesis bookkeeping and moved completed routine bone assessment to unscored context. No genetics, imaging or drug protocol is invented.',
    'Preserved parallel referral chronology. The new view contains no DXA wait gate or staging key; the later management decision depends on the clarified disease, not the density result. Original paired/live sources remain byte-for-byte intact.',
    'Key hold remains none: the recorded pathogenic-confirmation, uncomplicated-FHH observation and PHPT age-criterion claims directly support the decision. The held hardware/radial acquisition application is not part of the new scored view; duplicate publication IDs are counted once.',
   ],
   suggestions:[
    'Retained the interpretable urinary/longitudinal evidence and a documented familial variant; removed gene testing from the options rather than hiding meaningful data to pass lint.',
    'Removed the weak peptide assay. All three choices now name management after completed assessment, so neither an imaginary collection defect nor repeated testing is introduced as a foil.',
    'Made the decisive result a pathogenic classification, not an inherited-pattern label. Changing it to a VUS/negative result changes the defensible plan; young age and a localization focus tempt a real operative error rather than add decorative laboratory data.',
    'Explicitly excluded negative/nonconfirmatory-result inference, retained the already placed referral and made baseline imaging unscored. The retained view is reviewed as one standalone proposed encounter; a partial mixed acceptance must not silently reintroduce the parked acquisition question.',
   ],
  },
 },
];

export const parked=[
 {id:'G01',title:'Changed blood counts before further ITP treatment',
  reason:'The existing diagnostic claim covers HIV/HCV evaluation in compatible isolated thrombocytopenia. It does not establish the new multilineage marrow-versus-flow-versus-sequencing ranking. The separate splenectomy calendar claim has an unresolved bibliographic identity. Neither can support the round-two key.',
  alternative:'Considered re-aiming to initial HIV/HCV evaluation. That duplicates the unchanged diagnostic siblings and does not adjudicate the owner\'s recollected marrow sequence or support a harder marrow decision. A negative viral result cannot supply the missing marrow indication.',
  ownerResolution:'Open: the bank\'s eight isolated-ITP siblings contain viral evaluation followed by elective-surgery deferral, not a universal viral-negative-then-marrow rule. No identified earlier encounter has been recovered and no marrow ranking is verified. Preserve the live version and park this reassessment draft; do not claim the sequencing concern is closed.',
  responseThemes:{cues:[],fairness:[
   'Accepted the reviewer\'s scope distinction. Parking is a source-safety disposition, not a clinical correction, independent PASS or sign-off; no author rationale is used as missing clinical evidence.',
   'Preserved the successful cue attack only as history. The concrete competing investigations are not rewritten or admitted while their comparative evidence is unresolved.',
   'The plausible marrow ranking is precisely the unverified deciding fact. No new executable version repeats it; it is parked rather than labelled supported from the isolated-ITP claim.',
   'The moderate two-step construction is not counted as a source resolution. It remains historical; uncertainty about the key is not desirable difficulty.',
   'The clinically relevant reassessment objective is retained in the backlog. No unsupported urgent-bleeding rule or timetable is added to make it executable.',
   'The owner concern stays open. Existing isolated-ITP siblings do not contain a marrow key, and their negative viral result is not promoted to a marrow indication. The unlocated recollection is not invented.',
   'Removed this key from round-three candidates. The old ASH source identity and new marrow-ranking hold both remain unresolved in the historical record; neither is converted into evidence.',
  ],suggestions:[
   'Cannot verify that exact ranking from the permitted offline ledger. Parked pending a direct marrow-workup source and hematology review; no held key can be accepted.',
   'Kept the raw initial/current findings in the before snapshot and original draft, without overwriting it with an atypical-ITP diagnosis label. There is no round-three learner-facing after for this parked item.',
   'Recorded the chronology repair for any future sourced version: viral results belong to completed initial assessment, with new multilineage changes on return. Did not create a new held executable item merely to improve chronology.',
   'Kept exact-encounter reconciliation as an open action, with the original live fallback. No calendar threshold or surgery-after-preparation foil is restored.',
  ]}},
 {id:'G02',title:'MH-specific perioperative plan and testing sequence',
  reason:'The ledger directly supports advance trigger-free planning in an MH-prepared facility for credibly documented susceptibility. It does not verify the named drug regimen, negative-panel/prior-exposure interpretation, exact capabilities, contracture-testing sequence or prophylactic dantrolene comparison that selects the round-two key.',
  alternative:'Considered testing only trigger-free planning versus routine anesthesia. That returns to the owner-rejected easy contrast and cannot provide specific close, defensible competing plans without verified agent/preparation facts. Treating a worksheet as proof of readiness would manufacture the missing evidence.',
  ownerResolution:'The earlier draft resolved specificity and difficulty editorially, but its key remains unsupported. Park it and keep the exact current live version. A specific, close replacement needs permitted agent/testing/preparation evidence; no general trigger-free claim is stretched into that protocol.',
  responseThemes:{cues:[],fairness:[
   'Retained the previously successful parallel-plan construction as history; no word-level repair can verify the testing/prophylaxis comparison, so no new candidate is emitted.',
   'The proposed recommendation cannot be grounded by the general trigger-free claim. Parked rather than treating a listed protocol as demonstrated readiness or asserting that all surgery can precede testing.',
   'Moderate difficulty is acknowledged but is not source verification. The negative-panel and sequencing distinction remains in the parked historical draft only.',
   'Kept the high-value perioperative objective in the backlog. Specific agents require their own adequate verification; specificity does not license unsupported drug advice.',
   'The owner\'s editorial note was met in round two, but not safely enough for acceptance. The current live tuple remains the fallback and no held draft is offered for shipping.',
   'All listed deciding extensions remain unverified. Removed the entire comparative key from the candidate source view instead of trimming a supposedly incidental detail.',
  ],suggestions:[
   'The existing ledger cannot resolve the complete keyed comparison. Parked pending permitted MH-specific verification and clinical review; no new source access is authorized in this milestone.',
   'Preserved the parallel plans in the historical before snapshot. No safety-critical preparation detail is deleted merely to force a supported key, and no clearance sentence replaces it.',
   'A worksheet is not converted to capability proof. Future verification must establish the actual decision-critical facility facts, without invented preparation times, doses or crisis steps.',
   'Did not add gratuitous difficulty. The historical structure can be reconsidered once its deciding facts are directly supported, but is not a round-three candidate now.',
  ]}},
 {id:'G04-R',title:'Pregnancy-assessment replacement',
  reason:'The ledger supports pregnancy testing, the limited meaning of an early negative home test, and prompt specialist-capable assessment for symptomatic pregnancy. It does not verify the falling-hCG interpretation or exact transvaginal-versus-appendiceal-imaging-versus-aspiration priority used in round two.',
  alternative:'Considered re-aiming to immediate specialist assessment using the recorded disposition claim. Without a verified trajectory/diagnostic discriminator this is the same easy safety-recognition item the reviewer identified; using delayed care as the competitor would violate the brief. No supported PGY-2/3 replacement has been established.',
  ownerResolution:'Open. Keep the original pregnancy-testing live item until a consequential harder replacement is supported, independently passed and manager-accepted. Retirement/merge remains agreed in principle only; no replacement or deletion is performed.',
  responseThemes:{cues:[
   'No new candidate retains the unfinished-pelvic-visualization-to-ultrasound gap. The historical observations are preserved for review; hiding them would not resolve the unsupported priority.',
   'Aspiration is not carried into a new candidate as a token invasive foil. The ledger cannot establish the needed appropriate context and ranking, so the whole replacement is parked.',
  ],fairness:[
   'Did not promote the plausible pathway to a supported universal priority or imply appendicitis is excluded. The exact modality comparison is parked with no round-three after.',
   'Accepted that the serial trend was decorative in the offered set. A source-supported urgent-assessment question would remain easy; no two-step or moderate label is assigned to a nonexistent replacement.',
   'No termination preference, nonviability diagnosis or earlier adequate scan is invented to rescue aspiration. Missing discriminating evidence leads to parking, not additional assumed patient facts.',
   'The high-value acute abdominal objective remains queued. No circulation summary is substituted for raw safety data in a new candidate, and no stability finding is treated as excluding deterioration.',
   'The owner difficulty note is not closed. The original live question remains pending a harder accepted replacement; retirement/selection is not changed.',
   'Removed the held hCG/modality-priority key from the candidate set. The supported hCG-testing/disposition claims are explicitly narrower and do not verify this comparison.',
  ],suggestions:[
   'No supported concrete trajectory-based comparison exists in the ledger. Parked rather than inventing hCG thresholds or an obviously unsafe delay competitor.',
   'Did not relabel a likely easy first-pelvic-test item as resident-level application or grant it an unapproved basic role. The replacement remains open.',
   'No new candidate keeps an obsolete home-test sentence or invents repeat intervals, discriminatory values or treatment rules. Historical before content remains exact.',
   'Did not add an unsupported aspiration context or automatic priority over appendiceal assessment. These need direct permitted evidence before another replacement is authored.',
  ]}},
 {id:'G05-staging',title:'DXA hardware/radial acquisition matrix',
  reason:'The recorded three-site baseline claim supports lumbar spine, hip and distal one-third radius in confirmed PHPT. It does not directly verify the hardware-side and radial-region comparative protocol used as the round-two key.',
  alternative:'Applied the reviewer\'s unscored-context suggestion in the separately versioned G05 candidate. Baseline DXA has already occurred and referral preceded it; no hardware choice, acquisition gate or technical-radius matrix is scored. This does not create a new accepted basic item.',
  ownerResolution:'Referral/DXA logic is resolved in proposed G05, while this technical scored replacement is parked. It is not a mandatory study for confirmed FHH and is not a permission step before surgery. Original paired encounters and frozen saves remain untouched.',
  responseThemes:{cues:[
   'Removed the entire hardware-side matrix from the candidate encounter; no left-native conclusion or side-based answer shortcut remains in G05\'s unscored baseline context.',
   'No duplicate no-implant assurance or pelvic radiograph remains in the new candidate. The old before snapshot remains exact and is not presented as newly accepted.',
  ],fairness:[
   'Parked the unverified comparative acquisition key. The narrower recorded three-site fact is reused only to describe completed baseline context, not to assert a hardware protocol.',
   'Accepted that a balanced matrix still tested elementary hardware avoidance plus site recall. No hard/basic exception is claimed; the technical item has no new executable version.',
   'Did not claim a verified ABSITE technical-scope mandate. The candidate G05 instead tests a practical management consequence, with this staging task unscored and parked.',
   'Removed the redundant existing-radiograph apparatus from the candidate; no new pelvic radiograph is required or recommended.',
   'Referral remains already placed and baseline assessment completed before G05. No DXA result gate or inference that inherited calcium disease mandates DXA is introduced.',
   'The hardware/ROI hold is not disguised as a supported three-site claim. No scored version with that key is present in the new candidate source view.',
  ],suggestions:[
   'Rather than delete necessary hardware information and leave an unfair choice, removed the unsupported scored choice entirely. The historical draft is preserved as the before record.',
   'No permitted offline direct protocol verification exists. Parked; future acceptance would need that evidence, not another statement of the general three-site rule.',
   'Used completed baseline assessment as unscored G05 context. No foundational-purpose approval is invented and the acquisition task is not labelled hard.',
   'The new G05 management decision depends on supported genetic/biochemical interpretation, not another acquisition-matrix component. Referral is independent; old/live paired versions are unmodified.',
  ]}},
 {id:'G07',title:'PTLD tissue method and specimen allocation',
  reason:'The recorded PTLD claims require tissue pathology rather than EBV DNA/imaging to establish and classify disease. They do not choose excision over core or verify fresh/fixed allocation, whole-specimen formalin handling or a cause for failed flow viability.',
  alternative:'Considered re-aiming to tissue assessment versus blood EBV/imaging. That repeats the easy evidence-gap recognition already rejected and does not satisfy the owner\'s request for close specific actions. Ranking targets, biopsy methods or processing would again require an unsupported deciding fact.',
  ownerResolution:'Specificity was improved editorially but the exact method/processing key is not supportable from the ledger. Parked; keep current live PTLD version until a directly sourced specific comparison is accepted. No claim that EBV establishes PTLD or that a generic core is wrong is added.',
  responseThemes:{cues:[
   'The largest-specimen-plus-more-testing shortcut is not polished into a new held key. The whole method/allocation comparison is removed from candidates and remains historical only.',
   'No new candidate translates failed viability into a fresh-sample guarantee or an invented fixation cause. The observed failure is preserved in the before snapshot, not assigned an unsupported mechanism.',
   'No new matrix uses ambiguous formalin labels or majority components. Parking removes the comparison rather than making its wording more elaborate without evidence.',
  ],fairness:[
   'The plausible excision preference cannot be ranked against an adequately planned core by the recorded tissue-required claim. Neither technique is certified as the sole defensible method.',
   'Accepted the nonexclusive processing-label problem. A whole-versus-portions protocol would itself need verification; no new executable label asserts one.',
   'No claim about why cells were nonviable or whether fresh tissue guarantees viability is added. That mechanism is not established by the prior flow result.',
   'Acknowledged the potentially moderate two-step construction, but its evidence gap is not counted as challenge. No new candidate inherits that rating.',
   'Kept the high-value tissue-diagnosis objective in the backlog. This textual lab record is not represented as an image or credited with image interpretation.',
   'The owner\'s specific-choice direction is editorially addressed but not clinically/source-safe enough for acceptance. Preserve the live fallback rather than ship an ambiguous held plan.',
   'The held method and processing comparisons are removed from the new source view. No general PTLD or selected-neck-core source is stretched into a lymphoma specimen protocol.',
  ],suggestions:[
   'Explicit all-formalin versus divided-allocation wording was considered but cannot establish the unverified protocol or comparative key. Parked instead of inventing a precise laboratory order.',
   'No permitted direct ranking exists in the offline ledger. Future work needs PTLD/hematopathology evidence before any biopsy-method acceptance.',
   'The actual target, cell-block limitation, flow failure and anatomy remain exact in the historical before record. No architecture label is inserted into a new stem to announce excision.',
   'No fabricated risk, failed-flow mechanism or laboratory trade-off is introduced. A genuinely discriminating supported comparison remains required before reauthoring.',
  ]}},
];
