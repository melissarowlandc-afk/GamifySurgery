import fs from 'node:fs';
import assert from 'node:assert/strict';
export const intake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-before-20261108.json','utf8'));
export const draft={contentVersion:'question-authoring.2026-11-08.stats1-r1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const oldClaim=s=>'claim.gs028se.statistics.'+s;
const method=(statement,basis)=>({statement,basisClaimIds:Array.isArray(basis)?basis:[oldClaim(basis)]});
export const methods={
 'independent-t':method('An independent-samples t procedure compares two population means using separate groups and suitable continuous-data assumptions.','independent-t'),
 'paired-t':method('A paired t procedure tests the mean within-pair difference; its normality assumption concerns the differences, not each separate measurement series.','paired-t'),
 'one-way-anova':method('One-way analysis of variance tests equality of population means across independent groups under the stated normal-residual and variance assumptions.','one-way-anova'),
 'rank-sum':method('Wilcoxon rank-sum compares ranked observations from two separate groups; it is not automatically a test of means or unqualified medians.','rank-sum'),
 'signed-rank':method('Wilcoxon signed-rank uses signed ranks of nonzero within-pair differences and requires symmetry for the usual location interpretation.','signed-rank'),
 'chi-square':method('Pearson chi-square testing assesses association between categorical variables in independent observations when expected counts support the approximation.','chi-square'),
 'fisher-exact':method('Fisher exact testing assesses an independent 2x2 categorical table without relying on the sparse-count chi-square approximation.','fisher-exact'),
 mcnemar:method('McNemar testing analyzes paired binary outcomes rather than independent groups or continuous measurements.','chi-square.mcnemar-boundary'),
 'study-design':method('Study design is classified by treatment assignment, whether sampling selects exposure or outcome, and the timing of measurement.','study-design'),
 confounding:method('An exposure-associated factor that also affects the outcome can confound attribution of an observed exposure-outcome association.','bias-confounding'),
 selection:method('Outcome-related participation or response can bias the estimated outcome in the selected sample.','bias-confounding'),
 recall:method('Outcome-dependent reporting of a previous exposure can create recall bias.','bias-confounding'),
 measurement:method('Systematically different measurement error between comparison groups can bias the observed group difference.','bias-confounding'),
 sensitivity:method('Sensitivity divides true positives by all reference-positive observations.','sensitivity-specificity'),
 specificity:method('Specificity divides true negatives by all reference-negative observations.','sensitivity-specificity'),
 'false-negative':method('The false-negative proportion among reference-positive observations is one minus sensitivity.','sensitivity-specificity'),
 ppv:method('Positive predictive value divides reference-positive positive tests by all positive tests.','predictive-value-prevalence'),
 prevalence:method('For the same nonperfect test with fixed sensitivity, specificity and testing process, higher tested-population prevalence increases positive predictive value.','predictive-value-prevalence'),
 collection:method('A predictive-value estimate must use the tested population at specimen collection rather than a later change in location.',[
  'claim.gs028se.statistics.predictive-value-prevalence','claim.flags2.20261105.g06.application']),
 'risk-ratio':method('Risk ratio divides one group\'s event probability by the comparison group\'s event probability.','risk-ratio-odds-ratio'),
 'odds-ratio':method('Odds ratio compares event-to-nonevent ratios; it does not divide the two event probabilities.',[
  oldClaim('risk-ratio-odds-ratio'),'claim.qq20261028.statistics.odds-scale']),
 'odds-to-risk':method('For a fixed model profile, multiply baseline odds by the conditional odds ratio and convert the resulting odds to probability as odds/(1+odds).',[
  'claim.qq20261102a.odds-to-risk-conversion']),
 arr:method('Absolute risk reduction is comparator event risk minus intervention event risk for the same outcome and follow-up horizon.','arr-nnt'),
 nnt:method('For a beneficial intervention, NNT is the reciprocal of absolute risk reduction expressed as a proportion, with outcome and horizon specified.','arr-nnt'),
 'p-value':method('A p-value describes the probability, under the specified null model, of results at least as extreme as those observed; it is not the posterior probability of a hypothesis.','p-value'),
 'p-decision':method('For a stated significance level, a p-value below that level rejects the specified null; a p-value above it does not establish equivalence.',[
  oldClaim('p-value'),oldClaim('errors-power'),'claim.qq20261102b.specified-interval-decision-rule']),
 'p-limits':method('A small p-value provides evidence against its null model but does not establish a large clinical effect or absence of systematic bias.','p-value'),
 'ci-null':method('The null value is 1 for a ratio and 0 for a difference; a matching two-sided confidence interval containing its null value remains compatible with no difference.','confidence-interval'),
 'target-interval':method('Comparing an effect interval with a separately stated target distinguishes target effects that remain compatible from target effects the interval excludes.',['claim.qq20261102b.specified-interval-decision-rule']),
 'ci-precision':method('At the same confidence level and for the same parameter scale, a narrower interval indicates greater precision.','confidence-interval'),
 'type-i':method('A type I error rejects a true null hypothesis.','errors-power'),
 'type-ii':method('A type II error fails to reject a false null hypothesis under a specified alternative.','errors-power'),
 power:method('Power is the probability of rejecting the null under the specified alternative and equals one minus its type II error probability.','errors-power'),
};
const kv=(items,caption='Constructed study data')=>({kind:'keyValue',caption,items:items.map(([label,value])=>({label,value}))});
const table=(columnHeaders,rowHeaders,cells,caption='Constructed study data')=>({kind:'table',caption,columnHeaders,rowHeaders,cells:cells.map(row=>row.map(String))});
const diagnostic=(cells,caption='Constructed screening data')=>table(['Reference positive','Reference negative'],['Test positive','Test negative'],cells,caption);
export const specs=[];
function add(family,number,skill,exhibit,task,options,explanationLines,ruleIds,application,focus){
 const old=intake.targets.find(t=>t.family===family&&new RegExp('\\.v'+number+'(?:\\.|$)').test(t.node.questionVariantId));assert(old,family+number);
 const base=old.node.questionVariantId.replace(/\.r\d+$/,''),prior=intake.questionIds.filter(id=>id===base||new RegExp('^'+base.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\.r\\d+$').test(id));
 const next=Math.max(0,...prior.map(id=>Number(id.match(/\.r(\d+)$/)?.[1]??0)))+1;
 const variantId=base+'.r'+next;assert(!intake.questionIds.includes(variantId));
 assert([3,4].includes(options.length));assert.equal(new Set(options.map(o=>o[0])).size,options.length);assert(explanationLines.length>=2&&explanationLines.length<=5);
 for(const id of ruleIds)assert(methods[id],id);
 specs.push({id:old.id,family,number,title:skill,skill,variantId,conceptId:old.node.primaryConceptId,
  exhibit,task,options,explanationLines,ruleIds,application,focus,holdStatus:'none',
  meaning:'same',versionReason:old.id==='S54'?'Same target-benefit interval classification objective. Retain the effect interval and stated target; remove the redundant null-test report and downstream study-plan choice. The card is not reassigned to generic p-value recall.':old.id==='S42'?'Same collection-population and positive-result denominator objective. Retain the collection-before-transfer discriminator; remove the clinical backstory and extra calculations.':
   'Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.',
  sourceFor:old.id,educationalIntent:'focused_statistics_practice',
 });
}

// Two separate-group means: distinguish who is paired, not merely who measured.
const independentOptions=()=>[
 ['Independent-samples Student t-test','Separate groups with suitable continuous-data assumptions support a direct two-mean comparison.'],
 ['Paired-samples Student t-test','This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs.'],
 ['Wilcoxon rank-sum test','This targets ranked distributions rather than directly testing the specified population means.'],
];
for(const [n,items,task,focus]of [
 [1,[['Groups','Two dressings; different patients in each group.'],['Outcome','Healing time in days; approximately normal with similar variances.']],'Which test directly compares the two population mean healing times?','Separate people, continuous outcome and suitable normal/variance assumptions.'],
 [2,[['Groups','Two hospitals; different patients in each sample.'],['Outcome','Mean blood loss in mL; observations approximately normal with similar variances.']],'Which test compares the two population mean blood losses?','Patients are not matched by their shared hospital or measurement instrument.'],
 [3,[['Groups','Two surgical approaches; each patient contributes to one group.'],['Outcome','Incision length in cm; approximately normal with similar variances.']],'Which test directly compares the two population mean incision lengths?','One continuous observation per person in separate groups.'],
 [4,[['Groups','Two rehabilitation programs; separate patients. One therapist measures everyone.'],['Outcome','Walking distance in meters; approximately normal with similar variances.']],'Which test directly compares the two population mean walking distances?','A common therapist does not make observations paired.'],
])add('independent-t',n,'Choose an independent two-mean test',kv(items),task,independentOptions(),[
 'Two separate groups + suitable continuous-data assumptions -> independent-samples t-test.',
 'The requested parameter is the difference between population means.',
 'Paired t-testing needs matched people or repeated measurements, not a shared assessor.',
],['independent-t','paired-t','rank-sum'],'The stated separate-group continuous observations and normal/variance assumptions support an independent-samples t comparison of population means.',focus);

const pairedOptions=()=>[
 ['Paired-samples Student t-test','The analysis uses each person\'s or matched pair\'s difference; normality concerns those differences.'],
 ['Independent-samples Student t-test','This discards the stated within-person or matched-pair linkage.'],
 ['Wilcoxon signed-rank test','This is a ranked paired-difference procedure rather than the direct test of a mean change requested here.'],
];
for(const [n,items,task,focus]of [
 [1,[['Measurements','Walking distance in meters, before and after rehabilitation in the same patients.'],['Differences','Approximately normal.']],'Which test directly evaluates the population mean change in walking distance?','The same people supply both measurements; analyze their differences.'],
 [2,[['Measurements','Two scales measure each patient\'s weight in kg.'],['Differences','Approximately normal.']],'Which test directly evaluates the population mean difference between the scales?','Each patient links one reading from each scale.'],
 [3,[['Measurements','Patients are matched one-to-one by age across two dressing groups; healing time is measured in days.'],['Within-pair differences','Approximately normal.']],'Which test directly compares the population mean healing times using these matches?','Explicit one-to-one matches create the pairs even though patients differ.'],
 [4,[['Measurements','The same patients have blood pressure measured before and after an intervention, in mmHg.'],['Distribution','Separate readings are skewed; within-person differences are approximately normal.']],'Which test directly evaluates the population mean blood-pressure change?','Normality of differences, not of each separate series, determines the paired t assumption.'],
])add('paired-t',n,'Choose a paired mean-difference test',kv(items),task,pairedOptions(),[
 'Form one difference per person or matched pair.',
 'Approximately normal differences + a mean-change target -> paired-samples t-test.',
 'Independent t-testing ignores the pairing; normality of separate series is not the paired-t requirement.',
],['paired-t','independent-t','signed-rank'],'The matched or repeated continuous measurements with approximately normal differences support a paired t test of the mean difference.',focus);

const anovaOptions=()=>[
 ['One-way analysis of variance test','This supplies the requested single omnibus comparison of means across separate groups.'],
 ['Independent-samples Student t-test','A single two-sample t-test does not supply the requested omnibus comparison of three or more means.'],
 ['Paired-samples Student t-test','There are multiple separate groups, not a two-measurement pairing.'],
];
for(const [n,groups,outcome,unit]of [[1,'Three dressings','healing time','days'],[2,'Four wards','length of stay','days'],[3,'Three training programs','task-completion time','seconds'],[4,'Four devices','blood loss','mL']])add('one-way-anova',n,'Choose one omnibus mean comparison',kv([
 ['Groups',groups+'; different patients in each group.'],['Outcome',outcome+' in '+unit+'; approximately normal within groups with similar variances.'],
]),'Which single test compares all population means?',anovaOptions(),[
 'Three or more separate groups + suitable mean-model assumptions -> one-way analysis of variance.',
 'It tests whether all population means are equal; it does not identify a particular differing pair.',
 'A two-sample t-test compares two means, not this full omnibus question.',
],['one-way-anova','independent-t','paired-t'],'The stated independent multi-group continuous observations support one-way analysis of variance for the omnibus equality-of-means question.','Count all groups and keep the requested analysis omnibus.');

const rankOptions=()=>[
 ['Wilcoxon rank-sum test','Two separate groups and a distribution/rank target fit rank-sum testing.'],
 ['Wilcoxon signed-rank test','This requires paired differences, which these separate patients do not provide.'],
 ['Independent-samples Student t-test','This directly targets means under its assumptions, rather than the requested comparison of ranked distributions.'],
];
for(const [n,groups,outcome,unit]of [[1,'Two dressings','healing time','days'],[2,'Two recovery programs','walking distance','meters'],[3,'Two wards','length of stay','days'],[4,'Two devices','blood loss','mL']])add('rank-sum',n,'Choose a rank comparison for separate groups',kv([
 ['Groups',groups+'; eight different patients per group.'],['Outcome',outcome+' in '+unit+'; strongly skewed continuous values.'],
]),'Which test compares the two outcome distributions?',rankOptions(),[
 'Small, strongly skewed samples from two separate groups -> Wilcoxon rank-sum testing.',
 'Do not automatically describe the result as a comparison of means or medians.',
 'Signed-rank testing requires within-person or matched-pair differences.',
],['rank-sum','signed-rank','independent-t'],'The requested distribution comparison for two separate groups with small, strongly skewed samples uses Wilcoxon rank-sum rather than a normal mean model or signed ranks of paired differences.','The patient groups are separate; the target is their ranked distributions.');

const signedOptions=()=>[
 ['Wilcoxon signed-rank test','Repeated or matched observations provide signed differences; their stated symmetry supports the location test.'],
 ['Wilcoxon rank-sum test','This treats observations as two separate groups and loses the within-pair differences.'],
 ['Paired-samples Student t-test','This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison.'],
];
for(const [n,description]of [
 [1,'Walking distance in meters, before and after training in the same patients.'],
 [2,'Weights in kg from two scales used on each patient.'],
 [3,'Healing times in days from one-to-one matched dressing pairs.'],
 [4,'Blood loss in mL measured by two methods on each operation.'],
])add('signed-rank',n,'Choose a rank comparison of within-pair change',kv([
 ['Measurements',description],['Within-pair differences','Twelve continuous differences; symmetric and strongly nonnormal.'],
]),'Which test evaluates whether the median within-pair difference is zero?',signedOptions(),[
 'Pair first; rank the magnitudes of nonzero differences and retain their signs.',
 'Symmetric paired differences -> Wilcoxon signed-rank location test.',
 'Rank-sum compares separate groups, so it does not use these within-pair changes.',
],['signed-rank','rank-sum','paired-t'],'The paired continuous differences and stated symmetry support the Wilcoxon signed-rank test for the specified rank-based location question.','Pairing plus symmetry of differences, with a rank-based location target.');

const chiOptions=()=>[
 ['Pearson chi-square test','Independent categorical observations with adequately populated expected cells fit this association test.'],
 ['McNemar chi-square test','This is for paired binary responses, not the independent multi-category table shown.'],
 ['One-way analysis of variance test','Category counts are not continuous observations for comparing population means.'],
];
for(const [n,rows,cols,cells]of [
 [1,['Dressing A','Dressing B'],['Healed','Infected','Bleeding'],[[30,10,10],[20,20,10]]],
 [2,['Hospital A','Hospital B'],['Device A','Device B','Device C'],[[20,20,20],[30,10,20]]],
 [3,['Group A','Group B','Group C'],['Readmitted','Not readmitted'],[[20,30],[10,40],[30,20]]],
 [4,['Ward A','Ward B'],['Open','Laparoscopic','Robotic'],[[20,30,10],[30,10,20]]],
])add('chi-square',n,'Choose an association test for independent categories',table(cols,rows,cells,'Constructed counts; observations are independent.'),
 'Which test assesses association between the row and column categories?',chiOptions(),[
 'Independent categories + adequate expected counts -> Pearson chi-square association test.',
 'Smallest expected cell = '+({1:'50 x 20 / 100 = 10',2:'60 x 30 / 120 = 15',3:'50 x 60 / 150 = 20',4:'60 x 30 / 120 = 15'}[n])+'.',
 'McNemar testing requires linked binary observations, not these separate groups.',
],['chi-square','mcnemar','one-way-anova'],'The independent categorical table has adequate expected cell counts for Pearson chi-square testing of association.','Independent people, nominal categories and adequate expected counts.');

const fisherOptions=()=>[
 ['Fisher exact test','The event cells are sparse in a 2x2 table from separate groups; exact testing avoids the poor large-sample approximation.'],
 ['Pearson chi-square test','Its large-sample approximation is unreliable for these tiny expected event counts.'],
 ['McNemar chi-square test','The groups are separate rather than paired binary observations.'],
];
for(const [n,cells,worked]of [
 [1,[[0,8],[2,6]],'Expected events = 1 per group.'],
 [2,[[1,9],[0,10]],'Expected events = 0.5 per group.'],
 [3,[[0,10],[2,8]],'Expected events = 1 per group.'],
 [4,[[1,11],[0,12]],'Expected events = 0.5 per group.'],
])add('fisher-exact',n,'Choose an exact test for sparse independent counts',table(['Event','No event'],['Group A','Group B'],cells,'Constructed counts from two independently sampled groups.'),
 'Which test compares the event proportions?',fisherOptions(),[
 'Sparse independent 2x2 counts -> Fisher exact test.',worked,
 'Pearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.',
],['fisher-exact','chi-square','mcnemar'],'The constructed independent 2x2 table has very small expected event counts, supporting Fisher exact testing rather than a large-sample chi-square approximation.','Infer sparsity from the counts instead of receiving an eligibility label.');

const designOptions={
 randomized:[['Randomized trial','Investigators assign the intervention by chance.'],['Cohort study','This observational classification would omit the investigator\'s random assignment.'],['Case-control study','Participants were not selected because they already had or lacked the outcome.']],
 cohort:[['Cohort study','Groups are defined by exposure and subsequent outcomes are compared.'],['Case-control study','This would select groups by outcome, not by the earlier exposure.'],['Cross-sectional study','Exposure precedes the subsequently recorded outcome rather than both being assessed at one time.']],
 casecontrol:[['Case-control study','Sampling begins with outcome groups and then compares earlier exposure.'],['Cohort study','This would begin with exposure groups rather than infection status.'],['Cross-sectional study','The study reconstructs earlier exposure after selecting cases and controls.']],
 crosssection:[['Cross-sectional study','Exposure and outcome are assessed at one sampling visit.'],['Cohort study','There is no later outcome observation after an exposure-defined starting point.'],['Case-control study','Sampling is not selected by outcome status.']],
};
for(const [n,type,text,rule,example,closest]of [
 [1,'randomized','Investigators assign patients to two dressings by a random sequence, then record wound infections.','Intervention assigned by chance -> randomized trial.','Here, the investigator determines the dressing allocation.','A cohort study observes exposure rather than assigning it randomly.'],
 [2,'cohort','Investigators group old charts by preoperative smoking status, then compare the recorded postoperative infections.','Sampling by exposure before the outcome -> cohort study.','Historical records do not turn an exposure-defined cohort into a case-control study.','Case-control sampling starts with infection status, not smoking status.'],
 [3,'casecontrol','Investigators select patients with wound infections and patients without infections, then compare previous smoking histories.','Sampling by outcome, then examining prior exposure -> case-control study.','Infection status selects the two groups.','A cohort begins with exposure groups; this study begins with the outcome.'],
 [4,'crosssection','At one clinic survey, investigators measure smoking status and current wound symptoms in every respondent.','Exposure and outcome measured at one sampling time -> cross-sectional study.','The survey does not follow an exposure-defined group for a later outcome.','A cohort requires an exposure-to-outcome sequence, not this one-time snapshot.'],
])add('study-design',n,'Identify one study design',kv([['Study',text]]),'What is the study design?',designOptions[type],[rule,example,closest],['study-design'],rule+' '+example,'The sampling/assignment structure, not the disease label or use of old records.');

add('bias-confounding',1,'Recognize confounding by illness severity',kv([
 ['Comparison','Sicker patients receive dressing A more often. Illness severity also delays healing.'],
]),'What primarily threatens attribution of the healing difference to dressing choice?',[
 ['Confounding bias','Illness severity is linked to the chosen dressing and independently affects the outcome.'],
 ['Recall bias','The problem is not differential memory of an earlier exposure.'],
 ['Observer bias','The stated problem is a patient factor, not how an assessor records healing.'],
],['Confounding: a factor is associated with both exposure and outcome.','Severity affects dressing selection and healing, mixing their effects.','Recall bias concerns reporting prior exposure, not this severity imbalance.'],['confounding','recall','measurement'],
 'In the constructed comparison, illness severity is associated with dressing allocation and healing, creating confounding of the dressing-outcome association.','The same patient factor affects exposure choice and outcome.');
add('bias-confounding',2,'Recognize outcome-dependent recall',kv([
 ['Records','Diaries show equal preoperative skin-cut exposure in cases and controls.'],
 ['Later interviews','Patients with infection report more earlier skin cuts than patients without infection.'],
]),'Which bias primarily affects the interview comparison?',[
 ['Recall bias','Reporting of the earlier exposure differs with the later outcome despite the diary record.'],
 ['Selection bias','The supplied discrepancy concerns exposure reports, not which people entered the study.'],
 ['Confounding bias','A shared underlying patient factor is not the described cause of the diary-interview discrepancy.'],
],['Recall bias: reporting of prior exposure differs by outcome status.','The diary-interview discrepancy depends on whether infection occurred.','Selection bias concerns entry or response, not this altered exposure report.'],['recall','selection','confounding'],
 'The constructed outcome-dependent discrepancy between contemporaneous diaries and later exposure reports illustrates recall bias.','The earlier diary and later interview disagree according to the known outcome.');
add('bias-confounding',3,'Recognize outcome-related survey response',table(['Excellent recovery','Poor recovery'],['All patients','Survey respondents'],[[50,50],[40,10]],
 'Constructed counts; all patients invited.'),'Which bias threatens the survey estimate of recovery?',[
 ['Selection bias','Response differs by recovery outcome, producing an unrepresentative respondent sample.'],
 ['Recall bias','The information identifies who responds, not differing memory accuracy.'],
 ['Observer bias','The information does not describe outcome-assessment differences by observer.'],
],['Selection bias: participation is related to the outcome being estimated.',
 'Response is 40/50 = 80% after excellent recovery and 10/50 = 20% after poor recovery.',
 'Inviting everyone does not correct unequal response.'],['selection','recall','measurement'],
 'The constructed recovery-specific response proportions are 40/50 and 10/50; this unequal participation biases the respondent-based recovery estimate through selection.',
 'Compare the respondents with the invited cohort, not merely the favorable response count.');
add('bias-confounding',4,'Recognize differential measurement error',kv([
 ['Calibration','Device A reads 10 mmHg above the reference; device B matches the reference.'],
 ['Study use','The intervention group uses A; the control group uses B.'],
]),'Which bias primarily affects the between-group blood-pressure comparison?',[
 ['Measurement bias','A systematic device difference is tied to group assignment and distorts the measured comparison.'],
 ['Confounding bias','The stated cause is instrument error, not a patient characteristic affecting exposure and true pressure.'],
 ['Selection bias','The supplied facts concern measurement, not selection into the sample.'],
],['Measurement bias: systematic measurement error differs by group.','A contributes a constructed 10 mmHg measurement offset to one group.','This is an instrument error, rather than confounding by a patient factor.'],['measurement','confounding','selection'],
 'In the constructed calibration example, a 10 mmHg device offset applied to one study group creates differential measurement bias; it is not an empirical device-performance claim.','Calibration error and device allocation together distort the group comparison.');

add('sensitivity-specificity',1,'Calculate sensitivity',diagnostic([[30,10],[20,40]]),'What is the sensitivity?',[
 ['60%','Sensitivity = 30 / (30 + 20) = 60%.'],['40%','This is the false-negative fraction, 20 / 50.'],
 ['75%','This is PPV, 30 / (30 + 10).'],['80%','This is specificity, 40 / (40 + 10).'],
],['Sensitivity = true positives / all reference positives.','30 / (30 + 20) = 30 / 50 = 60%.','75% is PPV: its denominator is positive tests, not reference-positive patients.'],
 ['sensitivity','specificity','false-negative','ppv'],'The constructed table gives sensitivity 30/(30+20)=60%.','Condition on reference positivity, not on the test result.');
add('sensitivity-specificity',2,'Calculate specificity',diagnostic([[90,20],[10,80]]),'What is the specificity?',[
 ['80%','Specificity = 80 / (80 + 20) = 80%.'],['90%','This is sensitivity, 90 / (90 + 10).'],['20%','This is the false-positive fraction, 20 / 100.'],
],['Specificity = true negatives / all reference negatives.','80 / (80 + 20) = 80%.','90% is sensitivity and uses the other reference group.'],['specificity','sensitivity'],
 'The constructed table gives specificity 80/(80+20)=80%.','Condition on reference negativity.');
add('sensitivity-specificity',3,'Calculate sensitivity from the reference-positive subgroup',kv([
 ['Reference-positive patients','20 test positive; 80 test negative.'],
]),'What is the sensitivity?',[
 ['20%','Sensitivity = 20 / (20 + 80) = 20%.'],['25%','20 / 80 is an event-to-nonevent ratio, not a proportion of all reference positives.'],['80%','This is the false-negative fraction in the reference-positive group.'],
],['Sensitivity uses everyone with the reference condition.','20 / (20 + 80) = 20%.','25% divides positives by negatives instead of by their total.'],['sensitivity','false-negative','odds-ratio'],
 'In the constructed reference-positive group, sensitivity is 20/(20+80)=20%; the test-positive/test-negative ratio is not that proportion.','Use the subgroup total, not positives divided by negatives.');
add('sensitivity-specificity',4,'Calculate the false-negative rate',kv([
 ['Reference-positive patients','80 test positive; 20 test negative.'],
]),'What is the false-negative rate among reference-positive patients?',[
 ['20%','False negatives / all reference positives = 20 / 100 = 20%.'],['80%','This is sensitivity, the positive fraction of the same reference-positive group.'],['25%','20 / 80 divides false negatives by true positives rather than their total.'],
],['False-negative rate = false negatives / all reference positives = 1 - sensitivity.','20 / (80 + 20) = 20%.','80% is sensitivity, the complementary fraction.'],['false-negative','sensitivity'],
 'The constructed reference-positive group has a false-negative rate of 20/(80+20)=20%, the complement of its 80% sensitivity.','A negative result in the reference-positive subgroup is the error of interest.');

add('predictive-value-prevalence',1,'Calculate positive predictive value',diagnostic([[40,10],[60,90]]),'What is the positive predictive value?',[
 ['80%','PPV = 40 / (40 + 10) = 80%.'],['40%','This is sensitivity, 40 / (40 + 60).'],['90%','This is specificity, 90 / (90 + 10).'],['20%','This is the reference-negative fraction among positive tests.'],
],['PPV = true positives / all positive tests.','40 / (40 + 10) = 40 / 50 = 80%.','40% is sensitivity: it starts with reference-positive patients instead of positive tests.'],['ppv','sensitivity','specificity'],
 'The constructed table gives PPV 40/(40+10)=80%.','Start with the positive-test row.');
add('predictive-value-prevalence',2,'Use the collection cohort for PPV',table(['Reference positive','Reference negative'],['Clinic','ICU'],[[40,10],[90,10]],
 'Constructed positive-test counts. Specimen collected in clinic before transfer to ICU.'),
 'What is the positive predictive value for this specimen\'s collection cohort?',[
 ['80%','The clinic was the collection cohort: 40 / (40 + 10) = 80%.'],['90%','This uses the later ICU cohort, 90 / (90 + 10).'],['20%','This reverses the reference outcome among the clinic\'s positive tests.'],
],['Use the cohort at collection, not the later ward.','PPV = true positives / positive tests = 40 / (40 + 10) = 80%.','90% comes from the ICU cohort, where this specimen was not collected.'],['collection','ppv'],
 'For the constructed specimen collected in clinic before ICU transfer, the appropriate clinic-cohort PPV is 40/(40+10)=80%.','Collection precedes transfer; select the clinic row and its positive-result denominator.');
add('predictive-value-prevalence',3,'Relate PPV to tested-population prevalence',kv([
 ['Condition prevalence','Clinic A: 10%; clinic B: 20%.'],['Test performance in both clinics','Sensitivity 80%; specificity 90%; same testing process.'],
]),'Which clinic has the higher positive predictive value?',[
 ['Clinic B','Higher prevalence increases PPV for the same stated imperfect test and process.'],['Clinic A','Lower prevalence increases the share of positive tests that are false positives, not PPV.'],['Equal PPV','Equal sensitivity and specificity do not make predictive values independent of prevalence.'],
],['With the same imperfect test, higher prevalence -> higher PPV.','Clinic B has prevalence 20%, compared with 10% in A.','Equal sensitivity and specificity do not imply equal PPV.'],['ppv','prevalence'],
 'For the constructed fixed sensitivity of 80% and specificity of 90%, clinic B\'s 20% prevalence yields a higher PPV than clinic A\'s 10% prevalence.','Predictive value changes with prevalence even when the test characteristics do not.');
add('predictive-value-prevalence',4,'Calculate PPV without substituting sensitivity',diagnostic([[20,20],[60,180]]),'What is the positive predictive value?',[
 ['50%','PPV = 20 / (20 + 20) = 50%.'],['25%','This is sensitivity, 20 / (20 + 60).'],['90%','This is specificity, 180 / (180 + 20).'],
],['PPV = true positives / all positive tests.','20 / (20 + 20) = 20 / 40 = 50%.','25% is sensitivity, which uses the reference-positive column.'],['ppv','sensitivity','specificity'],
 'The constructed table gives PPV 20/(20+20)=50%, distinct from 25% sensitivity and 90% specificity.','The requested measure fixes the denominator as all positive tests.');

add('risk-ratio-odds-ratio',1,'Calculate a risk ratio',table(['Events','Total patients'],['Exposed','Unexposed'],[[20,100],[10,100]]),'What is the exposed-versus-unexposed risk ratio?',[
 ['2.0','(20 / 100) / (10 / 100) = 2.0.'],['0.5','This inverts the requested comparison.'],['2.25','This compares event-to-nonevent odds, not the two risks.'],
],['Risk ratio = exposed event risk / unexposed event risk.','(20 / 100) / (10 / 100) = 2.0.','2.25 is the odds ratio: (20 / 80) / (10 / 90).'],['risk-ratio','odds-ratio'],
 'The constructed exposed and unexposed risks of 20/100 and 10/100 give a risk ratio of 2.0; their odds ratio is 2.25.','Use events divided by total people before forming the ratio.');
add('risk-ratio-odds-ratio',2,'Calculate an odds ratio from case-control sampling',table(['Cases','Controls'],['Exposed','Unexposed'],[[40,20],[10,20]],'Constructed case-control exposure counts.'),'What is the exposure odds ratio for cases versus controls?',[
 ['4.0','(40 x 20) / (10 x 20) = 4.0.'],['0.25','This is the inverse odds ratio.'],['2.0','This treats outcome-selected case/control fractions as cohort risks.'],
],['Odds ratio = (exposed cases x unexposed controls) / (unexposed cases x exposed controls).','(40 x 20) / (10 x 20) = 4.0.','2.0 treats these outcome-selected samples as if they supplied cohort risks.'],['odds-ratio','risk-ratio','study-design'],
 'The constructed case-control exposure table gives an odds ratio of (40*20)/(10*20)=4.0.','Cross-products compare the exposure odds in outcome-selected groups.');
add('risk-ratio-odds-ratio',3,'Convert model odds to event probability',kv([
 ['Reference-group probability','50%.'],['Group A versus reference: odds ratio','0.5 for the same covariate profile.'],
]),'What event probability does the model predict for group A? Round to the nearest whole percent.',[
 ['33%','Reference odds = 0.5 / 0.5 = 1; new odds = 0.5; risk = 0.5 / 1.5, about 33%.'],
 ['25%','This multiplies probability by the odds ratio as though it were a risk ratio.'],
 ['50%','This treats odds of 0.5 as probability 0.5, skipping conversion back to probability.'],
],['Reference odds = 0.50 / (1 - 0.50) = 1; new odds = 1 x 0.5 = 0.5.',
 'Probability = odds / (1 + odds) = 0.5 / 1.5 = 1/3, rounded to 33%.','25% incorrectly multiplies the reference probability by an odds ratio.'],['odds-to-risk','odds-ratio','risk-ratio'],
 'For the constructed fixed model profile, a 50% reference probability and conditional odds ratio 0.5 imply event odds 0.5 and probability 1/3, rounded to 33%.','An odds ratio scales odds, not the reference probability.');
add('risk-ratio-odds-ratio',4,'Interpret relative risk without changing its scale',kv([
 ['Reported measure','Risk ratio for group A versus group B: 0.5.'],
]),'How does group A\'s risk compare with group B\'s?',[
 ['Risk is 50% lower','A risk ratio of 0.5 means half the comparison risk.'],['Odds are 50% lower','This changes the reported measure from a risk ratio to an odds ratio.'],
 ['Risk is 50 percentage points lower','This substitutes an absolute risk difference, which requires the reference risk.'],
],['Risk ratio 0.5 = half the comparison risk = 50% lower risk.','This describes a relative probability, not an absolute percentage-point difference.','A 50-percentage-point reduction cannot be inferred without the reference risk.'],['risk-ratio','odds-ratio','arr'],
 'A constructed risk ratio of 0.5 denotes half the comparison-group event probability, not a 50-percentage-point risk difference or a claim about half the odds.','Keep the reported measure on its risk-ratio scale.');

const nnt=(n,control,treatment,answer,alternatives)=>add('arr-nnt',n,'Calculate NNT for one outcome and horizon',kv([
 ['Outcome','Wound infection within 30 days.'],['Control event rate',control+'%.'],['Treatment event rate',treatment+'%.'],
]),'What is the number needed to treat to prevent one infection during follow-up?',[
 [answer+' patients','NNT = 1 / the absolute risk reduction expressed as a proportion.'],...alternatives,
],['ARR = control risk - treatment risk = '+control+'% - '+treatment+'% = '+(control-treatment)+' percentage points.',
 'NNT = 1 / '+((control-treatment)/100)+' = '+answer+' patients over 30 days.',
 'Use the absolute difference as a proportion, not the relative reduction or a whole-number percent.'],['arr','nnt'],
 'The constructed 30-day infection risks '+control+'% and '+treatment+'% imply ARR '+(control-treatment)+' percentage points and NNT '+answer+' for that outcome and horizon.',
 'Subtract the two risks, convert the absolute difference to a proportion, then take its reciprocal.');
nnt(1,20,10,10,[['5 patients','This takes 1 / control risk rather than 1 / absolute risk reduction.'],['2 patients','This takes the reciprocal of the 50% relative reduction.']]);
add('arr-nnt',2,'Calculate absolute risk reduction',kv([
 ['Outcome','Wound infection within 30 days.'],['Control event rate','15%.'],['Treatment event rate','10%.'],
]),'What is the absolute risk reduction?',[
 ['5 percentage points','15% - 10% = 5 percentage points.'],['33 percentage points','This confuses the relative reduction of about one third with an absolute difference.'],['25 percentage points','This adds the two event rates instead of subtracting them.'],
],['ARR = control event risk - treatment event risk.','15% - 10% = 5 percentage points.','About 33% is the relative reduction, not the absolute percentage-point difference.'],['arr','nnt'],
 'The constructed 30-day infection rates of 15% and 10% have an absolute risk reduction of 5 percentage points.','Subtract risks on the same outcome and time scale.');
nnt(3,12,8,25,[['4 patients','Four is the percentage-point ARR, not its reciprocal as a proportion.'],['3 patients','This takes the reciprocal of the one-third relative reduction.']]);
nnt(4,30,25,20,[['5 patients','Five is the percentage-point ARR, not the number needed to treat.'],['6 patients','This takes the reciprocal of the one-sixth relative reduction.']]);

add('p-value',1,'Interpret a p-value under its null model',kv([
 ['Test','Two-sided comparison of mean recovery times.'],['p-value','0.04.'],
]),'What does the p-value mean?',[
 ['4% probability of results at least this extreme if the null hypothesis were true','This is a probability of data or more extreme data under the specified null model.'],
 ['4% probability that the null hypothesis is true after seeing these results','This reverses a probability conditional on the null into a probability of the null itself.'],
 ['4% probability that repeating the study would produce the same result','This mistakes a null-model tail probability for a replication probability.'],
],['A p-value conditions on the specified null model, not on a hypothesis being true after testing.','p = 0.04 means a 4% probability of results at least this extreme under that null model.','It does not mean a 4% probability that the null hypothesis is true.'],['p-value'],
 'For the constructed null-model test, p=0.04 means probability 0.04 of results at least as extreme under that model, not a posterior probability of either hypothesis.','Keep probability of data given a model distinct from probability of a hypothesis.');
add('p-value',2,'Compare an uncertainty interval with a benefit target',kv([
 ['Outcome','Reduction in mean recovery time, in days.'],['Target benefit','At least 2 days.'],['95% confidence interval for the reduction','1 to 3 days.'],
]),'Where does the target benefit fall relative to the confidence interval?',[
 ['Target lies inside the interval','The interval contains values below and above the stated target.'],
 ['Target lies below the interval','The lower endpoint is below the target.'],
 ['Target lies above the interval','The upper endpoint is above the target.'],
],['Compare the effect interval with the separately stated target.','An interval of 1 to 3 days spans the 2-day target; target benefit remains unresolved.',
 'The lower endpoint is 1 day, so the target does not lie below the whole interval.'],['target-interval','ci-null'],
 'The constructed recovery-time reduction interval from 1 to 3 days spans the stated target of at least 2 days, so target benefit remains unresolved.',
 'The clinically specified study target is compared with the whole uncertainty interval, not with a redundant null-test result.');
add('p-value',3,'Avoid proving no effect from nonsignificance',kv([
 ['Test','Difference in mean recovery time.'],['Prespecified significance level','0.05.'],['p-value','0.20.'],
]),'Which conclusion follows from the difference test?',[
 ['The null hypothesis is not rejected','The p-value exceeds the stated significance level; this does not prove the null.'],
 ['The treatments are demonstrated equivalent','Failure to reject a difference-test null is not an equivalence test.'],
 ['The null hypothesis is disproved','This reverses the significance-level comparison.'],
],['A p-value above the chosen threshold does not reject the null.','0.20 > 0.05 -> do not reject the equal-means null.',
 'Nonsignificance does not demonstrate equivalence.'],['p-value','p-decision'],
 'The constructed p-value 0.20 exceeds its prespecified 0.05 level and therefore does not reject the equal-means null or establish equivalence.','Failure to reject is different from proving equal effects.');
add('p-value',4,'Separate statistical evidence from clinical importance',kv([
 ['Test','Difference in mean recovery time.'],['p-value','0.001.'],
]),'Which inference is supported by the p-value?',[
 ['Strong evidence against the null model','The observed result is highly incompatible with the specified no-difference model.'],
 ['Strong evidence of a large clinical benefit','A p-value does not measure the magnitude or clinical importance of an effect.'],
 ['Strong evidence that systematic bias is absent','The p-value does not establish freedom from systematic error.'],
],['Small p-values provide evidence against the specified null model.','p = 0.001 does not quantify a recovery-time benefit.','A large clinical benefit needs effect-size interpretation, not a p-value alone.'],['p-value','p-limits'],
 'The constructed small p-value supplies evidence against its equal-means null, not an effect-size estimate or a guarantee of unbiased design.','A small p-value concerns the null model rather than clinical effect size.');

const significanceOptions=key=>[
 [key,key==='No statistically significant difference'?'The matching two-sided interval includes the null value.':'The interval excludes the null value in the indicated direction.'],
 ...['No statistically significant difference','Statistically significant lower risk','Statistically significant higher risk'].filter(s=>s!==key).map(s=>[s,'This conflicts with whether the interval contains 1 and with which side of 1 it occupies.']),
];
add('confidence-interval',1,'Interpret a ratio interval containing its null',kv([
 ['Two-sided 95% confidence interval for risk ratio A/B','0.8 to 1.2.'],
]),'At the matching 5% significance level, which conclusion follows?',significanceOptions('No statistically significant difference'),[
 'The null value for a risk ratio is 1.','The interval 0.8 to 1.2 contains 1, so the matching two-sided test does not reject no difference.','An interval containing 1 does not prove the risks are equal.'],['ci-null','p-decision'],
 'The constructed two-sided 95% risk-ratio interval 0.8 to 1.2 contains its null value 1 and does not reject no difference in the matching 5% test.','A ratio uses 1, not 0, as its null value.');
add('confidence-interval',2,'Interpret a ratio interval below its null',kv([
 ['Two-sided 95% confidence interval for risk ratio A/B','0.4 to 0.8.'],
]),'At the matching 5% significance level, which conclusion follows?',significanceOptions('Statistically significant lower risk'),[
 'The null value for a risk ratio is 1.','The entire interval 0.4 to 0.8 is below 1, supporting lower risk in the matching test.','Excluding 0 is not the significance rule for a risk ratio.'],['ci-null','p-decision'],
 'The constructed two-sided 95% risk-ratio interval 0.4 to 0.8 excludes 1 below the null, supporting a statistically significant lower risk in the matching 5% test.','Keep the null value appropriate to the ratio scale.');
add('confidence-interval',3,'Use zero as the null for a difference',kv([
 ['Two-sided 95% confidence interval for mean recovery-time difference, A minus B','-2 to +1 days.'],
]),'At the matching 5% significance level, which conclusion follows?',[
 ['Recovery times do not differ significantly','The reported range spans zero, the no-effect value.'],
 ['Recovery times are significantly shorter with A','The interval includes a difference in the opposite direction as well as 0.'],
 ['Recovery times are significantly longer with A','The interval also includes negative differences and 0.'],
],['The null value for a difference is 0, not 1.','The interval -2 to +1 days includes 0, so the matching test does not reject no difference.','A negative point estimate does not override an interval containing 0.'],['ci-null','p-decision'],
 'The constructed mean-difference interval -2 to +1 days contains 0 and does not reject no difference in its matching two-sided 5% test.','A difference and a ratio have different null values.');
add('confidence-interval',4,'Compare precision at the same confidence level',kv([
 ['Estimate A: 95% interval for the risk ratio','0.9 to 1.1.'],['Estimate B: 95% interval for the same risk ratio','0.5 to 1.5.'],
]),'Which estimate is more precise?',[
 ['Estimate A','At the same confidence level and scale, its narrower interval indicates greater precision.'],['Estimate B','Its wider interval indicates less precision, not more.'],
 ['Equal precision','Both intervals containing the null does not make their widths equal.'],
],['At the same confidence level, a narrower interval is more precise.','A width = 0.2; B width = 1.0 -> A is more precise.','Both intervals containing 1 does not make precision equal.'],['ci-precision','ci-null'],
 'The constructed 95% intervals have widths 0.2 and 1.0 on the same risk-ratio scale; estimate A is more precise.','Compare widths at the same confidence level, not null inclusion.');

const errorOptions=key=>[
 [key,key==='Type 1 error'?'The test rejects a null that is true.':'The test fails to reject a null that is false.'],
 [key==='Type 1 error'?'Type 2 error':'Type 1 error',key==='Type 1 error'?'Type II fails to reject a false null.':'Type I rejects a true null.'],
 ['No testing error','The decision contradicts the specified simulation truth.'],
];
add('errors-power',1,'Recognize a false positive hypothesis test',kv([
 ['Simulation truth','No treatment effect.'],['Test decision','Reject the no-effect null.'],
]),'Which testing error occurred?',errorOptions('Type 1 error'),[
 'Type I (type 1) error = reject a true null hypothesis.','The simulated null is true, but the test rejects it.','Type II error instead misses a specified real effect.'],['type-i','type-ii'],
 'In the constructed simulation, rejecting the true no-effect null is a type I error.','Compare the test decision with the specified simulation truth.');
add('errors-power',2,'Recognize a false negative hypothesis test',kv([
 ['Simulation truth','A treatment effect exists.'],['Test decision','Do not reject the no-effect null.'],
]),'Which testing error occurred?',errorOptions('Type 2 error'),[
 'Type II (type 2) error = fail to reject a false null under a specified alternative.','The simulated effect exists, but the test does not reject the no-effect null.','Type I error instead rejects a null that is true.'],['type-ii','type-i'],
 'In the constructed simulation with a real effect, failure to reject the no-effect null is a type II error.','Compare the test decision with the specified simulation truth.');
add('errors-power',3,'Calculate power from type II error probability',kv([
 ['Specified alternative','Type II error probability: 20%.'],
]),'What is the statistical power under that alternative?',[
 ['80%','Power = 1 - beta = 100% - 20% = 80%.'],['20%','This is beta, the probability of missing the specified effect.'],
 ['90%','This incorrectly halves beta before taking its complement.'],['10%','This incorrectly halves beta and reports that half as power.'],
],['Power = 1 - type II error probability.','100% - 20% = 80%.','20% is the probability of missing the effect, not detecting it.'],['power','type-ii'],
 'For the constructed specified alternative with beta=20%, statistical power is 1-beta=80%.','Power and beta are complementary probabilities under the same alternative.');
add('errors-power',4,'Calculate type II error probability from power',kv([
 ['Specified alternative','Power: 90%.'],
]),'What is the type II error probability under that alternative?',[
 ['10%','Beta = 1 - power = 100% - 90% = 10%.'],['90%','This repeats power instead of its complement.'],
 ['5%','This incorrectly halves the complement as though beta were a two-tail significance allocation.'],['95%','This confuses the quantity with a commonly stated confidence level.'],
],['Type II error probability = 1 - power.','100% - 90% = 10%.','90% is detection probability, not failure-to-detect probability.'],['power','type-ii'],
 'For the constructed specified alternative with power 90%, type II error probability is 1-power=10%.','Beta is not the significance level or a tail-split probability.');

assert.equal(specs.length,64);assert.equal(new Set(specs.map(s=>s.id)).size,64);
specs.sort((a,b)=>a.id.localeCompare(b.id));
