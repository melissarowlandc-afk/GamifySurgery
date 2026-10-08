import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createServer } from 'vite';
const scriptDirectory=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(scriptDirectory,'../../../..');
const output=scriptDirectory;
const receiptPath=path.join(output,'coverage-audit.json');
const notePath=path.join(output,'coverage-audit.md');
// Reuse the pinned batch4 profile-aware distribution/allocation math. This
// report adds employee coverage sources and describes its four-slot allocation.
const bandOrder = ['under-18', '18-29', '30-44', '45-64', '65+'];
const sexes = ['Female', 'Male'];
const keys = bandOrder.flatMap(band => sexes.map(sex => `${sex}|${band}`));
const primaryPaths = [
  'packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/schema.ts',
  'packages/game-domain/src/clinical-selection.ts',
  'packages/game-domain/src/patientDemographics.ts',
  'packages/game-domain/src/characterStillCatalog.ts',
  'packages/game-domain/src/patientAppearanceCatalog.ts',
  'packages/game-domain/src/appearance.ts',
  'packages/game-domain/src/reducer.ts',
  'packages/game-domain/src/selectors.ts',
  'packages/game-domain/src/employee-discussions.ts',
  'packages/balance-config/src/prototype-balance.ts',
  'tools/character-mapping/patient-women-20-v3/README.md',
  'tools/character-mapping/patient-demographics20-v4/demographic-audit.mjs',
  'tools/character-mapping/future-roster20-v5/analysis/coverage-audit.mjs',
  'apps/player/src/art/characterStillRegistry.generated.json',
  'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json',
  'packages/game-domain/src/room-capacity.ts',
  'packages/game-domain/src/reading-stations.ts',
  'packages/balance-config/src/service-income-catalog.ts',
  'packages/balance-config/src/room-upgrades.ts',
  'docs/features/facility-levels-and-clinical-release-points.md',
  'docs/features/diagnostic-timing-future-design.md',
  'docs/execplans/unique-employee-character-coverage.md',
  'tools/character-mapping/gs026-employee-expansion-v1/assets/gs026-employee-018-cardinals-v1-exact-prompt.txt',
  'tools/character-mapping/employee20-statics-v1/assets/gs022-new-employee-020-cardinals-v1-exact-prompt.txt',
];
const hashText = body => createHash('sha256').update(body).digest('hex');
const rel = file => path.relative(repo, file).replaceAll('\\', '/');
const digest = async file => hashText(await readFile(path.join(repo, file)));
const round = number => Number(number.toFixed(12));
const empty = () => Object.fromEntries(keys.map(key => [key, 0]));
const sum = values => values.reduce((total, value) => total + value, 0);
const bandFor = age => age < 18 ? 'under-18' : age < 30 ? '18-29' : age < 45 ? '30-44' : age < 65 ? '45-64' : '65+';
const visualBands = {young_adult: '18-29', adult: '30-44', middle_aged: '45-64', older_adult: '65+'};
const caseConcepts = clinicalCase => [...new Set(clinicalCase.decisionNodes.map(node => node.primaryConceptId))].sort();
const profilesFor = clinicalCase => clinicalCase.approvedInstantiationProfiles?.length
  ? clinicalCase.approvedInstantiationProfiles.map(profile => ({id: profile.id, demographics: profile.prototypeDemographics ?? clinicalCase.prototypeDemographics}))
  : [{id: null, demographics: clinicalCase.prototypeDemographics}];

// This mirrors the display-only completion rules, not a disease/demographic
// selection weight. Actual completePatientDemographics outputs are checked
// against the distribution below for every authored case/profile.
function ageDistribution(clinicalCase, demographics) {
  const age = demographics?.ageYears;
  if (Number.isInteger(age) && age >= 0 && age <= 120) return [{age, probability: 1, rule: 'explicit'}];
  const fixed = {
    'case.fhh.evaluation-to-confirmed-management': 27,
    'case.pancreatic-tail-adenocarcinoma.clinic-counseling': 70,
    'case.choledochal-cyst.type-iva.2a': 52,
  };
  if (fixed[clinicalCase.id] !== undefined) return [{age: fixed[clinicalCase.id], probability: 1, rule: 'case-specific display constraint'}];
  const young = clinicalCase.id === 'case.fhh.suggestive-results-confirmation';
  const start = young ? 18 : 30, count = young ? 12 : 35;
  return Array.from({length: count}, (_, index) => ({age: start + index, probability: 1 / count, rule: young ? 'case-specific editorial 18-29 completion' : 'editorial 30-64 completion'}));
}

function sexDistribution(clinicalCase, demographics) {
  const sex = demographics?.sexLabel;
  if (sexes.includes(sex)) return [{sex, probability: 1, rule: 'explicit'}];
  if (clinicalCase.id === 'case.anal-hsil.hpv.3d') return [{sex: 'Female', probability: 1, rule: 'case-specific display constraint'}];
  return sexes.map(sex => ({sex, probability: 0.5, rule: 'editorial two-sex completion'}));
}

function caseDistribution(clinicalCase) {
  const byCell = empty(), byAgeSex = {}, profileRows = [];
  const profiles = profilesFor(clinicalCase);
  for (const profile of profiles) {
    const ageRows = ageDistribution(clinicalCase, profile.demographics);
    const sexRows = sexDistribution(clinicalCase, profile.demographics);
    for (const ageRow of ageRows) for (const sexRow of sexRows) {
      const probability = ageRow.probability * sexRow.probability / profiles.length;
      const cell = `${sexRow.sex}|${bandFor(ageRow.age)}`;
      byCell[cell] += probability;
      const ageSex = `${sexRow.sex}|${ageRow.age}`;
      byAgeSex[ageSex] = (byAgeSex[ageSex] ?? 0) + probability;
    }
    profileRows.push({
      profileId: profile.id,
      authoredAge: profile.demographics?.ageYears ?? null,
      authoredSex: profile.demographics?.sexLabel ?? null,
      ageRules: [...new Set(ageRows.map(row => row.rule))],
      sexRules: [...new Set(sexRows.map(row => row.rule))],
      profileProbability: 1 / profiles.length,
    });
  }
  assert(Math.abs(sum(Object.values(byCell)) - 1) < 1e-10, `demographic distribution not normalized: ${clinicalCase.id}`);
  return {byCell, byAgeSex, profileRows};
}

function expectedRows(cases, caseWeights, distributions, rosterCounts) {
  const byCell = empty(), ageSex = {};
  for (const clinicalCase of cases) {
    const weight = caseWeights.get(clinicalCase.id) ?? 0;
    const distribution = distributions.get(clinicalCase.id);
    for (const key of keys) byCell[key] += weight * distribution.byCell[key];
    for (const [key, probability] of Object.entries(distribution.byAgeSex)) ageSex[key] = (ageSex[key] ?? 0) + weight * probability;
  }
  assert(Math.abs(sum(Object.values(byCell)) - 1) < 1e-10, 'encounter shares not normalized');
  return {
    cells: keys.map(key => ({
      sex: key.split('|')[0], ageBand: key.split('|')[1],
      encounterShare: round(byCell[key]),
      stills: rosterCounts[key],
      sharePerStill: rosterCounts[key] ? round(byCell[key] / rosterCounts[key]) : null,
    })),
    ageHistogram: Object.entries(ageSex).map(([key, encounterShare]) => ({sex: key.split('|')[0], ageYears: Number(key.split('|')[1]), encounterShare: round(encounterShare)})).sort((left, right) => left.sex.localeCompare(right.sex) || left.ageYears - right.ageYears),
  };
}

function conceptWeights(cases) {
  const byConcept = new Map();
  for (const clinicalCase of cases) for (const conceptId of caseConcepts(clinicalCase)) {
    if (!byConcept.has(conceptId)) byConcept.set(conceptId, []);
    byConcept.get(conceptId).push(clinicalCase.id);
  }
  const weights = new Map(cases.map(clinicalCase => [clinicalCase.id, 0]));
  for (const ids of byConcept.values()) for (const id of ids) weights.set(id, weights.get(id) + 1 / byConcept.size / ids.length);
  assert(Math.abs(sum([...weights.values()]) - 1) < 1e-10, 'concept-first case weights not normalized');
  return {weights, byConcept};
}

function allocationFor(cells, slots = 20) {
  const counts = Object.fromEntries(cells.map(row => [`${row.sex}|${row.ageBand}`, row.stills]));
  const shares = Object.fromEntries(cells.map(row => [`${row.sex}|${row.ageBand}`, row.encounterShare]));
  const allocated = empty(), steps = [];
  const eligible = keys.filter(key => !key.endsWith('|under-18') && counts[key] > 0);
  // Existing occupancy/LRU rules affect short-run repetition. This planning
  // proxy minimizes the largest demand-per-design cell; it is not a forecast
  // of actual repeated encounters or a new runtime probability.
  for (let index = 0; index < slots; index += 1) {
    const key = [...eligible].sort((left, right) => shares[right] / (counts[right] + allocated[right]) - shares[left] / (counts[left] + allocated[left]) || keys.indexOf(left) - keys.indexOf(right))[0];
    allocated[key] += 1;
    steps.push(key);
  }
  return {
    method: `Allocate each of ${slots} additions to the currently largest encounter-share/eligible-still cell (discrete load leveling). This is an editorial art-planning proxy; runtime occupancy/LRU selection is unchanged.`,
    slots,
    allocation: keys.filter(key => allocated[key] > 0).map(key => ({sex: key.split('|')[0], ageBand: key.split('|')[1], additions: allocated[key], beforeStills: counts[key], afterStills: counts[key] + allocated[key], beforeSharePerStill: round(shares[key] / counts[key]), afterSharePerStill: round(shares[key] / (counts[key] + allocated[key]))})),
    steps,
  };
}

// Report only metadata, public art paths and independently calculated software
// demand. No question prose, private references or clinical assertions are saved.
async function buildAudit() {
  const before=Object.fromEntries(await Promise.all(primaryPaths.map(async file=>[file,await digest(file)])));
  // Pin candidate runtime module bytes before Vite loads them, then compare
  // every dependency that the audit actually used. Unrelated tests are hashed
  // but are not part of the final report unless loaded by the audit.
  for(const directory of ['packages','apps/player/src']) {
    const candidates=await readdir(path.join(repo,directory),{recursive:true});
    for(const candidate of candidates.filter(file=>/\.[cm]?[jt]sx?$/.test(file)&&!file.split(/[\\/]/).includes('node_modules'))) {
      const file=`${directory}/${candidate.replaceAll('\\','/')}`;
      if(before[file]===undefined) before[file]=await digest(file);
    }
  }
  const sourceLines=new Map(await Promise.all(primaryPaths.map(async file=>[file,(await readFile(path.join(repo,file),'utf8')).split(/\r?\n/)])));
  const line=(file,text,exact=false)=>{
    const at=sourceLines.get(file).findIndex(value=>exact?value===text:value.includes(text));
    assert(at>=0,`missing cited source ${file}: ${text}`);
    return {path:file,line:at+1};
  };
  const vite=await createServer({configFile:false,root:repo,appType:'custom',logLevel:'error',server:{middlewareMode:true,hmr:false,watch:null}});
  try {
    const clinical=await vite.ssrLoadModule('/packages/clinical-content/src/synthetic-content.ts');
    const {PROTOTYPE_BALANCE_RELEASE:balance}=await vite.ssrLoadModule('/packages/balance-config/src/prototype-balance.ts');
    const {CHARACTER_STILL_CATALOG:catalog,staffStillEligibleEntries}=await vite.ssrLoadModule('/packages/game-domain/src/characterStillCatalog.ts');
    const capacities=await vite.ssrLoadModule('/packages/game-domain/src/room-capacity.ts');
    const {SERVICE_INCOME_CATALOG:services}=await vite.ssrLoadModule('/packages/balance-config/src/service-income-catalog.ts');
    const demographic=await vite.ssrLoadModule('/packages/game-domain/src/patientDemographics.ts');
    const selection=await vite.ssrLoadModule('/packages/game-domain/src/clinical-selection.ts');
    const registry=JSON.parse(await readFile(path.join(repo,'apps/player/src/art/characterStillRegistry.generated.json'),'utf8'));
    const provenance=JSON.parse(await readFile(path.join(repo,'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json'),'utf8'));
    const byId=new Map(registry.characters.map(entry=>[entry.id,entry]));
    const byOutput=new Map(provenance.assets.map(asset=>[asset.outputFile,asset]));
    assert.equal(catalog.length,225,'Review changed catalog before allocating this art batch.');
    assert.equal(registry.characters.length,225);
    assert.equal(registry.counts.assets,1830);
    assert.equal(provenance.assets.length,1830);
    assert.equal(byOutput.size,1830);
    const staff=catalog.filter(entry=>entry.category==='staff');
    const adultPatients=catalog.filter(entry=>entry.category==='patient');
    assert.equal(staff.length,61);
    assert.equal(adultPatients.length,116);
    let registryHashChecks=0,staffSourceHashChecks=0,staffSeatAnchorChecks=0;
    const runtimeAssets=[],employeeAssets=[];
    for(const entry of registry.characters) for(const [posture,poses] of [...Object.entries(entry.poses),...(entry.clipboard?[['clipboard',{south:entry.clipboard}]]:[])]) for(const [facing,pose] of Object.entries(poses)) {
      const file=`apps/player/public/${pose.url}`;
      assert(!pose.url.includes('..')&&!path.isAbsolute(pose.url),`unsafe registered URL ${pose.url}`);
      const bytes=await readFile(path.join(repo,file));
      assert.equal(hashText(bytes),pose.sha256,`runtime art drift ${file}`);
      assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
      assert.equal(bytes.readUInt32BE(16),160);
      assert.equal(bytes.readUInt32BE(20),320);
      assert.equal(bytes[25],6,'Registered PNG must have RGBA color type.');
      const recorded=byOutput.get(file);
      assert(recorded,`no source record for ${file}`);
      assert.equal(recorded.identityId,entry.id);
      assert.equal(recorded.outputSha256,pose.sha256);
      runtimeAssets.push({identityId:entry.id,pose:`${posture}-${facing}`,path:file,sha256:pose.sha256});
      registryHashChecks++;
      if(staff.some(employee=>employee.stillId===entry.id)) {
        assert(['stand','sit'].includes(posture));
        assert.equal(await digest(recorded.sourceFile),recorded.sourceSha256,`source art drift ${recorded.sourceFile}`);
        assert.equal(recorded.sourceSha256,pose.sha256);
        staffSourceHashChecks++;
        if(posture==='sit') {
          assert(Number.isFinite(pose.anchors.seatContactY)&&pose.anchors.seatContactY>0&&pose.anchors.seatContactY<320);
          staffSeatAnchorChecks++;
        }
        employeeAssets.push({...runtimeAssets.at(-1),sourcePath:recorded.sourceFile,sourceSha256:recorded.sourceSha256,seatContactY:pose.anchors.seatContactY??null});
      }
    }
    assert.equal(registryHashChecks,1830);
    assert.equal(staffSourceHashChecks,61*8);
    assert.equal(staffSeatAnchorChecks,61*4);
    const employeeIdentities=staff.map(entry=>{
      const registered=byId.get(entry.stillId);
      assert(registered,`missing staff registry identity ${entry.stillId}`);
      for(const posture of ['stand','sit']) assert.deepEqual(Object.keys(registered.poses[posture]).sort(),['east','north','south','west']);
      return {stillId:entry.stillId,sourceCohort:entry.sourceCohort,eligibleRoleIds:[...entry.eligibleStaffRoleDefinitionIds],standingFacings:['south','east','west','north'],seatedFacings:['south','east','west','north']};
    });
    const rooms=balance.facility.roomDefinitions;
    const roomDefinitions=rooms.map(room=>({id:room.id,displayName:room.displayName,level:room.unlockFacilityLevel,maximumInstances:room.maximumInstances,evidence:line('packages/balance-config/src/prototype-balance.ts',`id: "${room.id}"`)}));
    const configuredRoles=balance.facility.staffRoleDefinitions.map(role=>{
      const eligible=staffStillEligibleEntries(role.id);
      const dedicated=eligible.filter(entry=>entry.eligibleStaffRoleDefinitionIds.length===1);
      const staffingRooms=rooms.flatMap(room=>{
        const slots=capacities.getRoomStaffCapacity({rooms:[{id:'audit.single-room',roomDefinitionId:room.id}]},role.id).capacity;
        return slots?[{roomId:room.id,displayName:room.displayName,level:room.unlockFacilityLevel,slotsPerRoom:slots,maximumInstances:room.maximumInstances,finiteMaximumSlots:room.maximumInstances===null?null:slots*room.maximumInstances}]:[];
      });
      assert(staffingRooms.length>0,`configured role has no home slots ${role.id}`);
      const finiteMaximum=staffingRooms.every(room=>room.finiteMaximumSlots!==null)?sum(staffingRooms.map(room=>room.finiteMaximumSlots)):null;
      return {id:role.id,displayName:role.displayName,unlockLevel:role.unlockFacilityLevel,status:'implemented-local',nominalMaximumEmployees:role.maximumEmployees,capacityAuthority:'reduceHireStaff checks getRoomStaffCapacity, not nominal maximumEmployees; unique eligible art can additionally block a hire.',staffingRooms,finiteRoomSlotCeiling:finiteMaximum,eligibleStillIds:eligible.map(entry=>entry.stillId),dedicatedStillIds:dedicated.map(entry=>entry.stillId),sharedStillIds:eligible.filter(entry=>entry.eligibleStaffRoleDefinitionIds.length>1).map(entry=>entry.stillId),standingSeatedCardinalsComplete:true,artGapAtFiniteRoomCeiling:finiteMaximum===null?null:Math.max(0,finiteMaximum-eligible.length),dedicatedArtGapAtFiniteRoomCeiling:finiteMaximum===null?null:Math.max(0,finiteMaximum-dedicated.length),evidence:[line('packages/balance-config/src/prototype-balance.ts',`id: "${role.id}"`),line('packages/game-domain/src/room-capacity.ts',`"${role.id}":`),line('packages/game-domain/src/reducer.ts','const roomCapacity = getRoomStaffCapacity(state, definition.id).capacity;')]};
    });
    const radiologist=configuredRoles.find(role=>role.id==='staff.radiologist');
    assert.equal(radiologist.finiteRoomSlotCeiling,16);
    assert.equal(radiologist.artGapAtFiniteRoomCeiling,12);
    assert(configuredRoles.filter(role=>role.id!=='staff.radiologist').every(role=>role.dedicatedArtGapAtFiniteRoomCeiling===0),'An additional configured non-radiologist art gap requires parent review.');
    const sharedIdentities=employeeIdentities.filter(entry=>entry.eligibleRoleIds.length>1);
    // Dedicated pools make the one shared foundation nurse unnecessary for
    // maximum peri-op/endoscopy staffing, so global uniqueness can be preserved.
    assert.deepEqual(sharedIdentities.map(entry=>entry.stillId),['mixed-20260910-nurse-01']);
    const futureServices=services.filter(service=>service.minimumFacilityLevel>=4).map(service=>({id:service.id,displayName:service.displayName,minimumLevel:service.minimumFacilityLevel,staffRoleIds:[...new Set([...(service.operation?.phases??[]).flatMap(phase=>[...phase.staffRoleDefinitionIds,...(phase.providerRoleDefinitionIds??[])]),...(service.retail?.outlets??[]).flatMap(outlet=>outlet.staffRoleDefinitionId?[outlet.staffRoleDefinitionId]:[])])],roomIds:[...new Set([...(service.operation?.phases??[]).map(phase=>phase.roomDefinitionId),...(service.retail?.outlets??[]).map(outlet=>outlet.roomDefinitionId)].filter(Boolean))],evidence:line('packages/balance-config/src/service-income-catalog.ts',`id: "${service.id}"`)}));
    assert.equal(staffStillEligibleEntries('staff.app').length,0);
    const futureRoles=[
      {id:'staff.app',idStatus:'Existing provider/service seam only; no staffRoleDefinition or staffing slots',displayName:'APP',plannedLevel:4,status:'accepted-roadmap-not-implemented',eligibleStillIds:[],capacity:null,proposedNewVisualReserve:2,evidence:[line('docs/features/facility-levels-and-clinical-release-points.md','- APP'),line('packages/balance-config/src/service-income-catalog.ts','id: "income.app_consult"'),line('packages/balance-config/src/prototype-balance.ts','preferredEmployeeStaffRoleDefinitionId: "staff.app"')]},
      {id:null,idStatus:'No approved stable runtime ID found; do not create one in an art audit',displayName:'Executive',plannedLevel:5,status:'accepted-roadmap-not-implemented',eligibleStillIds:[],capacity:null,proposedNewVisualReserve:2,evidence:[line('docs/features/facility-levels-and-clinical-release-points.md','- Executive',true),line('packages/balance-config/src/room-upgrades.ts','upgrade("room.executive_office"')]},
    ];
    const npIds=configuredRoles.find(role=>role.id==='staff.glp1_np').eligibleStillIds;
    const npReuse={existingNPIds:npIds,visualAssessment:'The reviewed registered gs026-employee-018 and gs022-new-employee-020 wear role-neutral short clinical jackets, sage shirts, olive trousers, closed shoes and blank badges. They can visually support future APP work, subject to an explicit future role eligibility seam.',runtimeEligibility:'Currently every NP identity is restricted to staff.glp1_np, not staff.app. No role reassignment is performed.',capacityConstraint:'All ten NP designs can be used simultaneously by the five configured GLP-1 suites with two slots each. Sharing them with APP does not add independent parallel art capacity and may conflict with global uniqueness.',recommendation:'Create two dedicated APP art identities as a small editorial reserve; this does not assert or change future hiring capacity.',reviewedImagePaths:['apps/player/public/art/characters/gs026-employee-expansion-v1/gs026-employee-018/stand-south.png','apps/player/public/art/characters/gs026-stills-v1/gs022-new-employee-020/stand-south.png']};
    const excludedSpeculativeRoles=[
      {role:'Separate MRI technician',reason:'Owner roadmap explicitly generalizes Imaging Technician across X-ray, ultrasound, CT and MRI; future MRI service uses staff.imaging_technician.',evidence:[line('docs/features/facility-levels-and-clinical-release-points.md','The Imaging Technician is the generalized equipment operator'),line('packages/balance-config/src/service-income-catalog.ts','id: "income.mri"')]},
      {role:'Pediatrician / dedicated pediatric nurse / wound-ostomy nurse',reason:'No such role is configured or approved in the current ASC roadmap. Current planned pediatric/wound/ostomy service rows use staff.app; peri-op nurses are expressly excluded from wound/ostomy.',evidence:[line('packages/balance-config/src/service-income-catalog.ts','id: "income.pediatric_consult"'),line('packages/balance-config/src/service-income-catalog.ts','id: "income.wound_care"'),line('docs/features/facility-levels-and-clinical-release-points.md','Peri-op Nurses do not staff Minor-Procedure Rooms')]},
      {role:'Pharmacy Technician',reason:'Owner roadmap specifies Pharmacist instead.',evidence:[line('docs/features/facility-levels-and-clinical-release-points.md','The Pharmacy uses a Pharmacist, not a Pharmacy Technician.')]},
      {role:'Barista / cashier / gift-shop worker / gym trainer / gardener',reason:'No separate hireable role or staff requirement is evidenced. Coffee, gift and vending outlets omit staffRoleDefinitionId; garden/gym are amenities.',evidence:[line('packages/balance-config/src/service-income-catalog.ts','id: "income.coffee"'),line('packages/balance-config/src/service-income-catalog.ts','id: "income.gift_shop"'),line('docs/features/facility-levels-and-clinical-release-points.md',"- Indoor Garden")]},
      {role:'Anesthesia / sterile-processing / hospital-floor / ED-trauma / ICU staff',reason:'No such staffed ASC role is approved or configured. Hospital release points are deferred without numeric levels; no hospital expansion staffing capacities are designed. Sterile processing has no separate ASC room.',evidence:[line('docs/features/facility-levels-and-clinical-release-points.md','Hospital release points deliberately have no invented facility-level number.'),line('docs/features/facility-levels-and-clinical-release-points.md','Sterile processing and inpatient beds do not require separate ASC rooms.')]},
    ];
    const release=clinical.SYNTHETIC_CLINICAL_RELEASE;
    const patientCases=release.cases.filter(clinicalCase=>clinicalCase.participant?.kind!=='employee_discussion');
    const routinePatients=patientCases.filter(clinicalCase=>clinicalCase.routineEligible);
    const rosterCounts=empty();
    for(const entry of adultPatients) rosterCounts[`${entry.compatibleSexLabel}|${visualBands[entry.ageBand]}`]++;
    const distributions=new Map(release.cases.map(clinicalCase=>[clinicalCase.id,caseDistribution(clinicalCase)]));
    let completionChecks=0,selectorChecks=0;
    for(const clinicalCase of release.cases) for(const profile of profilesFor(clinicalCase)) {
      const ages=new Set(ageDistribution(clinicalCase,profile.demographics).map(row=>row.age));
      const sexes=new Set(sexDistribution(clinicalCase,profile.demographics).map(row=>row.sex));
      for(let index=0;index<8;index++) {
        const result=demographic.completePatientDemographics({caseId:clinicalCase.id,campaignSeed:`future-roster5-audit-${index}`,encounterId:`audit.${clinicalCase.id}.${profile.id}.${index}`,demographics:profile.demographics});
        assert(ages.has(result.ageYears)&&sexes.has(result.sexLabel),`runtime completion changed ${clinicalCase.id}`);
        completionChecks++;
      }
    }
    const scenarios=[];
    for(const stage of [0,1,2,3]) {
      const unlockedRooms=rooms.filter(room=>room.unlockFacilityLevel<=stage);
      const unlockedRoles=balance.facility.staffRoleDefinitions.filter(role=>role.unlockFacilityLevel<=stage);
      const available=new Set([...unlockedRooms.flatMap(room=>room.capabilityIds),...unlockedRoles.flatMap(role=>role.capabilityIds)]);
      if(['room.endoscopy','room.periop_recovery'].every(id=>unlockedRooms.some(room=>room.id===id))&&['staff.endoscopy_nurse','staff.periop_nurse'].every(id=>unlockedRoles.some(role=>role.id===id))) available.add('capability.endoscopy');
      const cases=routinePatients.filter(clinicalCase=>clinicalCase.earliestFacilityStage<=stage&&clinicalCase.requiredCapabilityIds.every(capability=>available.has(capability)));
      const {weights,byConcept}=conceptWeights(cases);
      const shares=expectedRows(cases,weights,distributions,rosterCounts);
      const conceptPools=[...byConcept.entries()].sort(([left],[right])=>left.localeCompare(right)).map(([conceptId,caseIds])=>({conceptId,caseIds:[...caseIds].sort()}));
      for(let index=0;index<32;index++) {
        const selected=selection.selectRoutineClinicalCase({campaignSeed:`future-roster5-selector-${index}`,encounters:{},learningHistories:{},routineArrivalSequence:index},cases,0);
        assert(selected?.kind==='new_concept');
        assert(conceptPools.some(pool=>pool.conceptId===selected.selectedConceptId&&pool.caseIds.includes(selected.clinicalCase.id)));
        selectorChecks++;
      }
      scenarios.push({id:`level-${stage}-all-unlocked-operational`,facilityLevel:stage,gates:'Every unlocked resource is assumed present, reachable and operational; a capability ceiling, not an owner campaign.',capabilityIds:[...available].sort(),counts:inventory(cases),conceptFirst:shares,recommendedFourPatients:allocationFor(shares.cells,4),conceptPools});
    }
    const fullyEquipped=scenarios.find(scenario=>scenario.facilityLevel===3);
    const allPatients=expectedRows(patientCases,conceptWeights(patientCases).weights,distributions,rosterCounts);
    const rawEqualCase=expectedRows(patientCases,new Map(patientCases.map(clinicalCase=>[clinicalCase.id,1/patientCases.length])),distributions,rosterCounts);
    const rawEqualQuestion=expectedRows(patientCases,new Map(patientCases.map(clinicalCase=>[clinicalCase.id,clinicalCase.decisionNodes.length/sum(patientCases.map(row=>row.decisionNodes.length))])),distributions,rosterCounts);
    const dependencies=[...new Set([...vite.moduleGraph.idToModuleMap.values()].map(module=>module.file&&path.resolve(module.file)).filter(file=>file&&file.startsWith(repo+path.sep)&&!file.includes(`${path.sep}node_modules${path.sep}`)&&/\.[cm]?[jt]s$/.test(file)).map(rel))];
    const sourcePaths=[...new Set([...primaryPaths,...dependencies])].sort();
    const sourceHashes=Object.fromEntries(await Promise.all(sourcePaths.map(async file=>[file,await digest(file)])));
    for(const file of sourcePaths) assert.equal(sourceHashes[file],before[file],`concurrent source edit or unpinned dependency during audit: ${file}`);
    const profileMetadata=release.cases.flatMap(clinicalCase=>profilesFor(clinicalCase).map(profile=>({caseId:clinicalCase.id,profileId:profile.id,ageYears:profile.demographics?.ageYears??null,sexLabel:profile.demographics?.sexLabel??null,conceptIds:caseConcepts(clinicalCase),routineEligible:clinicalCase.routineEligible,earliestFacilityStage:clinicalCase.earliestFacilityStage,requiredCapabilityIds:[...clinicalCase.requiredCapabilityIds].sort(),participantKind:clinicalCase.participant?.kind??'patient'}))).sort((left,right)=>left.caseId.localeCompare(right.caseId)||String(left.profileId).localeCompare(String(right.profileId)));
    const recommendation={status:'Parent art-allocation decision; no runtime changes',employees:16,patients:4,employeeDesigns:[{roleId:'staff.radiologist',displayName:'Radiologist',additions:12,basis:'Four configured reading rooms times four seats = 16 unique jobs, minus four existing designs.'},{roleId:'staff.app',displayName:'APP',additions:2,basis:'Accepted Level 4 role with zero eligible current art; two is an editorial visual reserve, not an approved hiring maximum.'},{roleId:null,displayName:'Executive',additions:2,basis:'Accepted Level 5 display role with zero dedicated art; two is an editorial visual reserve, not an approved hiring maximum or stable runtime ID.'}],patientScenario:fullyEquipped.id,patientAllocation:fullyEquipped.recommendedFourPatients};
    return {schemaVersion:'future-roster20-v5-coverage-audit/v1',purpose:'Employee-first next20 still art planning, preserving existing game, clinical review and selection weights.',employeeCoverage:{catalogIdentities:catalog.length,staffIdentities:staff.length,registeredAssets:registry.counts.assets,configuredRoleCount:configuredRoles.length,configuredRoles,roomDefinitions,employeeIdentities,employeeAssets,sharedIdentities,globalUniqueness:'All 13 non-radiologist finite room ceilings are covered by dedicated, disjoint pools. The shared foundation nurse is spare, so simultaneous peri-op/endoscopy staffing does not require reuse. Radiologists lack12 designs at the literal finite ceiling.',futureRoles,futureServices,npReuse,excludedSpeculativeRoles,decisionsAndLimits:[{issue:'Radiology room/role maximum discrepancy',evidence:[line('packages/balance-config/src/prototype-balance.ts','id: "room.reading"'),line('packages/balance-config/src/prototype-balance.ts','id: "staff.radiologist"'),line('packages/game-domain/src/room-capacity.ts','"staff.radiologist": { "room.reading": 4 }'),line('docs/features/diagnostic-timing-future-design.md','All four workstations are functional')],resolution:'Parent selected12 new radiologists to cover the current literal finite16-slot ceiling. Do not alter room capacity or the original four approved identities.'},{issue:'APP/Executive maximum staffing undecided',resolution:'Two new art designs per role prepare independent visual reserves. Full future hire uniqueness cannot be guaranteed until capacities and eligibility are approved.'},{issue:'Historical roadmap unlock drift',resolution:'The newer October 7 diagnostic approval and current balance unlock radiologist/reading room at Level3, superseding old Level4 documentation.'}]},patientDemographics:{release:{id:release.id,publicationStatus:release.publicationStatus,declaredConcepts:release.concepts.length,...inventory(release.cases),employeeDiscussionCases:release.cases.filter(clinicalCase=>clinicalCase.participant?.kind==='employee_discussion').length,patientCases:patientCases.length,routinePatientCases:routinePatients.length},currentAdultRoster:{designs:adultPatients.length,cells:keys.map(key=>({sex:key.split('|')[0],ageBand:key.split('|')[1],stills:rosterCounts[key]})),cohorts:Object.fromEntries([...new Set(adultPatients.map(entry=>entry.sourceCohort))].sort().map(cohort=>[cohort,adultPatients.filter(entry=>entry.sourceCohort===cohort).length]))},futurePediatricStills:catalog.filter(entry=>entry.category==='future-presentation'&&entry.futurePresentationKind==='pediatric').map(entry=>({stillId:entry.stillId,intendedVisualAge:entry.intendedVisualAge,availability:entry.availability})),method:{source:'Profile-aware batch4 method copied into this script and revalidated against current modules.',selection:'Uniform eligible unseen primary concept, then eligible case, then authored instantiation profile; demographic display completion only after explicit profile overrides.',scope:'Routine patient cases only. Employee discussions, tutorial/critical paths and service-only visitors are outside patient demand.',allocation:'Allocate four art slots successively to highest modeled encounter share per current eligible still. This is an editorial load proxy, not a runtime weight or repeat-rate forecast.',limits:['FSRS due dates and active concepts change real campaign mix.','Level0–3 capability ceilings are tested; future Level4–5 content/capacity is not invented.','Race/ethnicity, clothing and body build have no disease-selection role.','No authored under-18 profile requires extra pediatric art; 12 existing future-only children remain reserved.']},scenarios,allReleasePatientComparison:allPatients,rawEqualPatientCaseComparison:rawEqualCase,rawEqualPatientQuestionComparison:rawEqualQuestion,releaseDemographicFingerprintSha256:hashText(JSON.stringify(profileMetadata))},recommendation,validation:{runtimeCompletionChecks:completionChecks,actualSelectorChecks:selectorChecks,registryAssetHashChecks:registryHashChecks,staffSourceHashChecks,staffSeatedContactAnchorChecks:staffSeatAnchorChecks,all61StaffEightCardinals:true,nonRadiologistDedicatedFiniteCeilingsCovered:13,noRuntimeOrClinicalWrites:true,sourceFilesUnchangedDuringAudit:true},sourceHashes,runtimeAssets};
  }finally{await vite.close();}
}

function markdown(audit) {
  const employee=audit.employeeCoverage,patient=audit.patientDemographics;
  const pct=value=>`${(value*100).toFixed(2)}%`;
  const cite=evidence=>evidence.map(item=>`\`${item.path}:${item.line}\``).join(', ');
  const roles=employee.configuredRoles.map(role=>`| ${role.displayName} / \`${role.id}\` | ${role.unlockLevel} | ${role.nominalMaximumEmployees} | ${role.finiteRoomSlotCeiling??'undefined'} | ${role.eligibleStillIds.length} (${role.dedicatedStillIds.length} dedicated) | ${role.artGapAtFiniteRoomCeiling??'undefined'} |`).join('\n');
  const cells=patient.scenarios.find(scenario=>scenario.facilityLevel===3).conceptFirst.cells.filter(row=>row.ageBand!=='under-18').map(row=>`| ${row.sex} | ${row.ageBand} | ${pct(row.encounterShare)} | ${row.stills} | ${pct(row.sharePerStill)} |`).join('\n');
  return `# Employee-first character batch5 coverage audit\n\n`+
    `Recommended batch: **12 radiologists, 2 APPs, 2 executives and 4 patients**. The four patient slots are ${audit.recommendation.patientAllocation.allocation.map(row=>`${row.additions} ${row.sex.toLowerCase()} aged ${row.ageBand}`).join('; ')}. This is art preparation, not runtime integration or clinical approval.\n\n`+
    `The current local catalog contains 225 identities, 61 staff designs, 116 adult patients and 1830 registered assets. Every employee has standing and seated S/E/W/N; all 488 employee source/runtime hashes, 244 seated contact anchors and all 1830 registered PNG hashes/dimensions/RGBA types were validated. Exact IDs, eight poses and paths/hashes are in the JSON receipt. The 30 existing founder designs are also complete and preserved; Level 0 introduces no employee art gap.\n\n`+
    `| Role / stable ID | Unlock level | Nominal max | Finite built-room ceiling | Eligible art | Art gap |\n|---|---:|---:|---:|---:|---:|\n${roles}\n\n`+
    `The hiring reducer uses actual built-room slots, rather than nominal \`maximumEmployees\`. All 13 non-radiologist finite ceilings are covered with dedicated, disjoint art pools. The only shared identity, \`mixed-20260910-nurse-01\`, is spare for both peri-op/endoscopy pools; simultaneous assignments do not depend on using it twice. Core sources: ${cite(employee.configuredRoles[0].evidence)}.\n\n`+
    `Radiology is the concrete gap: current \`room.reading\` allows four rooms, and each grants four radiologist seats. That is 16 potential slots versus 4 existing identities, despite the role's nominal maximum 4. Parent selected 12 additional distinct radiologists to cover the literal finite ceiling, preserving the original four. The newer October 7 owner timing decision places this room/role at Level 3; it supersedes the older Level 4 roadmap text. ${cite(employee.decisionsAndLimits[0].evidence)}.\n\n`+
    `APP is an accepted Level 4 role, referenced as \`staff.app\` by planned clinic/pediatric/wound/ostomy services and provider fallbacks, but it has no role definition or capacity yet. Executive is an accepted Level 5 display role with no approved stable runtime ID or capacity. Two new designs each are editorial reserves. They cover those visual jobs without asserting sufficient designs for every undecided future opening. APP: ${cite(employee.futureRoles[0].evidence)}. Executive: ${cite(employee.futureRoles[1].evidence)}.\n\n`+
    `Existing NP art can visually serve APPs: inspected \`gs026-employee-018\` and \`gs022-new-employee-020\` have short clinical jackets, sage shirts, olive trousers and blank badges. All 10 NPs are currently role-locked to GLP-1, and all 10 can be employed concurrently by the configured five suites. Sharing their eligibility later would therefore not add independent parallel identity capacity; the dedicated APP reserve is useful. No reassignment occurred.\n\n`+
    `MRI retains the generalized imaging technician. Current planned pediatric and wound/ostomy rows use APP; no additional specialty job is invented. Pharmacy uses pharmacists. Retail/amenity rows do not evidence barista, gift clerk, trainer or gardener jobs. Hospital OR/floor/ED-trauma/ICU progression remains deferred without numeric levels or staffing design. Exclusions and citations are in the JSON.\n\n`+
    `Current question snapshot: ${patient.release.declaredConcepts} concepts, ${patient.release.cases} cases, ${patient.release.decisionNodes} decision nodes, ${patient.release.profileRows} demographic profile rows; ${patient.release.employeeDiscussionCases} employee discussions excluded, leaving ${patient.release.routinePatientCases} routine patient cases. The profile-aware Level 3 first-unseen model preserves explicit age/sex overrides and current fallback completion; it does not use the obsolete case-only female estimate.\n\n`+
    `| Sex | Age band | Modeled encounter share | Current designs | Share per design |\n|---|---|---:|---:|---:|\n${cells}\n\n`+
    `Four new patients reduce the most pressured current cells. These are visual age briefs, not clinical constraints or runtime weights. Actual FSRS due dates, occupied concepts and occupancy/LRU rotation change encounter/repetition behavior. There are ${patient.release.pediatricAuthoredProfileRows} authored under-18 profiles; the existing ${patient.futurePediatricStills.length} future-only children already reserve pediatric art. No new pediatric designs are required by this current content snapshot.\n\n`+
    `Validation: ${audit.validation.runtimeCompletionChecks} actual demographic completions; ${audit.validation.actualSelectorChecks} actual selector checks across operational Level 0–3 ceilings; ${Object.keys(audit.sourceHashes).length} source hashes unchanged during the audit. No runtime, clinical, save, art or planning files were changed. All report paths are repository-relative; no question prose/private input is copied.\n\n`+
    `Reproduce from repository root:\n\n\`\`\`text\nnode tools/character-mapping/future-roster20-v5/analysis/coverage-audit.mjs --check\n\`\`\`\n\nUse \`--write\` only after reviewing source drift; prior report mismatches fail without being overwritten. Vite runs in middleware mode, with no network listener or player save access.\n`;
}

const audit=await buildAudit();
if(process.argv.includes('--write')) {
  await mkdir(output,{recursive:true});
  await writeFile(receiptPath,JSON.stringify(audit,null,2)+'\n');
  await writeFile(notePath,markdown(audit));
}
if(process.argv.includes('--check')) {
  assert(isDeepStrictEqual(JSON.parse(await readFile(receiptPath,'utf8')),audit),'Coverage receipt changed; review content/role/roster drift before refreshing.');
  assert.equal(await readFile(notePath,'utf8'),markdown(audit));
}
process.stdout.write(JSON.stringify({status:'PASS',employeeRecommendation:audit.recommendation.employeeDesigns,patientRecommendation:audit.recommendation.patientAllocation.allocation,validation:audit.validation,sourceHashCount:Object.keys(audit.sourceHashes).length,receipt:rel(receiptPath)},null,2)+'\n');

function inventory(cases) {
  const rawStructured = {}, missingCaseIds = [], rawProfileRows = [];
  for (const clinicalCase of cases) {
    const profiles = profilesFor(clinicalCase);
    if (!profiles.some(profile => profile.demographics)) missingCaseIds.push(clinicalCase.id);
    for (const profile of profiles) {
      const demographics = profile.demographics;
      const key = demographics ? `${demographics.sexLabel}|${bandFor(demographics.ageYears)}` : 'missing structured age/sex';
      rawStructured[key] = (rawStructured[key] ?? 0) + 1 / profiles.length;
      rawProfileRows.push({caseId: clinicalCase.id, profileId: profile.id, ageYears: demographics?.ageYears ?? null, sexLabel: demographics?.sexLabel ?? null, caseEquivalentWeight: 1 / profiles.length});
    }
  }
  return {
    cases: cases.length,
    decisionNodes: sum(cases.map(clinicalCase => clinicalCase.decisionNodes.length)),
    distinctPrimaryConcepts: new Set(cases.flatMap(caseConcepts)).size,
    profileRows: rawProfileRows.length,
    pediatricAuthoredProfileRows: rawProfileRows.filter(row => row.ageYears !== null && row.ageYears < 18).length,
    rawStructuredCaseEquivalents: Object.fromEntries(Object.entries(rawStructured).sort().map(([key, value]) => [key, round(value)])),
    missingStructuredCaseIds: missingCaseIds,
  };
}


