/// <reference types="node" />
import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {afterAll,describe,expect,it} from "vitest";
import {GS028_20261007_LEVEL3_CASES as cases,GS028_20261007_LEVEL3_TESTED_CONCEPTS as concepts,GS028_20261007_LEVEL3_TIMING_ENTRIES as timings,type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {PROTOTYPE_DOMAIN_CONTEXT,createInitialGameState,createPatientDisplayName,deserializeGameState,deterministicInteger,RANDOM_STREAMS,gameReducer,getAnswerChoiceServicePreview,getCurrentCapabilities,getCurrentQuestion,selectRoutineClinicalCase,serializeGameState,type ConceptReviewEvidence,type GameState} from "../src";
import {EXACT_TEST_CHOICE_ORDER_RECORDS} from "../src/test-choice-orders";
const REAL_MS=1_800_000_000_000;
const paired=cases.filter(c=>c.decisionNodes.length===2);
const exact=EXACT_TEST_CHOICE_ORDER_RECORDS.filter(c=>c.caseId.startsWith("case.gs028g."));
const coverage=new Map<string,Set<string>>();const frozenProfiles=new Set<string>();
const choicePreviewEvidence=new Map<string,unknown>();const eligibilityEvidence:unknown[]=[];
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
function prepared(seed: string, stage: 0 | 1 | 2 | 3 = 3): GameState {
  const state = createInitialGameState(undefined, { campaignId: `campaign.gs028g.${seed}`, campaignSeed: seed, createdAtRealMs: REAL_MS });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028g.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028g.examination", roomId: "room.gs028g.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function admit(state: GameState, clinicalCase: SyntheticClinicalCase, encounterId: string): GameState {
  const profiles = clinicalCase.approvedInstantiationProfiles;
  const selected = profiles?.[deterministicInteger(state.campaignSeed, RANDOM_STREAMS.clinicalPresentation, `${encounterId}|${clinicalCase.id}|approved-profile.v1`, profiles.length)];
  const name = createPatientDisplayName(state.campaignSeed, encounterId, selected?.prototypeDemographics?.sexLabel ?? clinicalCase.prototypeDemographics?.sexLabel);
  const command = { type: "ADMIT_PATIENT" as const, operationId: `${encounterId}.admit`, encounterId, caseId: clinicalCase.id, patientDisplayName: name, arrivalClass: "routine" as const };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  const frozen = next.encounters[encounterId]!.frozenCase;
  expect(frozen.selectedInstantiationProfileId).toBe(selected?.id);
  if (selected) expect(frozen.prototypeDemographics).toEqual(selected.prototypeDemographics);
  expect(frozen.presentation).toContain(name);
  expect(frozen.presentation).not.toMatch(/\{patient(?:Name|Age|Sex)\}/);
  if (selected) frozenProfiles.add(selected.id);
  return next;
}

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: id, advancedAtRealMs: REAL_MS });
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let count = 0; count < 1_500; count++) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before its task`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${count}`, encounterId })
      : tick(next, `${prefix}.tick.${count}`);
  }
  throw new Error(`${encounterId} never became answer-ready`);
}

function submit(state: GameState, encounterId: string, choiceId: string, id: string, reviewedAtMs = REAL_MS): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const command = { type: "SUBMIT_ANSWER" as const, operationId: id, encounterId, decisionNodeId: question.node.id, answerChoiceId: choiceId, reviewedAtMs };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[id]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function roundTrip(state: GameState, encounterId: string): GameState {
  const encounter = clone(state.encounters[encounterId]);
  const histories = clone(state.learningHistories);
  let next: GameState;
  try {
    next = deserializeGameState(serializeGameState(state));
  } catch (error) {
    const evidenceDirectory = process.env.GS028_LEVEL3_EVIDENCE_DIR;
    if (evidenceDirectory) writeFileSync(resolve(evidenceDirectory, `save-plan-failure-${encounterId.replace(/[^a-z0-9.-]/gi, "_")}.json`), `${JSON.stringify({
      syntheticFixtureOnly: true, encounterId, caseId: encounter?.frozenCase.id, facilityTick: state.facilityTick,
      lifecycle: encounter?.lifecycle, step: encounter?.steps[encounter.currentNodeIndex],
      plan: encounter?.pendingResult?.diagnosticTiming ?? encounter?.terminalTestOrder?.diagnosticTiming,
      relatedOperations: state.serviceOperations.filter((item) => item.actorId === encounterId),
      resources: state.rooms.filter((item) => ["room.ct", "room.reading", "room.training"].includes(item.roomDefinitionId)),
      employees: state.employees.map((item) => ({ id: item.id, role: item.staffRoleDefinitionId, location: item.location, training: item.training })),
      error: error instanceof Error ? error.message : String(error),
    }, null, 2)}\n`);
    throw error;
  }
  // Assert the exact existing central loader rules: overdue cosmetic idle
  // timers are renewed, and an open chart resets only its attention timestamps.
  // No clinical/satisfaction value, frozen order identity, route, phase,
  // ready time, narrative or learning history is ignored.
  if (encounter && encounter.nextIdleActionAtFacilityTick < state.facilityTick) {
    encounter.nextIdleActionAtFacilityTick = state.facilityTick + PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionMinimumMinutes;
  }
  if (encounter && state.openChartEncounterId === encounterId) {
    encounter.idleWaitingSinceTick = null;
    encounter.lastSatisfactionDecayAtTick = state.facilityTick;
    encounter.feedAttentionKind = null;
    encounter.feedAttentionStartedAtTick = null;
  }
  expect(clone(next.encounters[encounterId])).toEqual(encounter);
  expect(next.learningHistories).toEqual(histories);
  return next;
}

function acknowledge(state: GameState, encounterId: string, id: string): GameState {
  const encounter = state.encounters[encounterId]!;
  const command = { type: "ACKNOWLEDGE_DECISION_FEEDBACK" as const, operationId: id, encounterId, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[id]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function closeAndDepart(state: GameState, encounterId: string, prefix: string): GameState {
  const command = { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" as const, operationId: `${prefix}.terminal`, encounterId };
  let next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  const close = { type: "CLOSE_CHART" as const, operationId: `${prefix}.close`, encounterId };
  next = gameReducer(next, close);
  expect(next.operationReceipts[close.operationId]?.status).toBe("applied");
  expect(gameReducer(next, close)).toBe(next);
  expect(next.encounters[encounterId]?.lifecycle).toBe("resolved");
  for (let count = 0; count < 1_500; count++) {
    const encounter = next.encounters[encounterId];
    if (encounter?.patientLocation === null && encounter.patientMovement === null) return next;
    next = tick(next, `${prefix}.depart.${count}`);
  }
  throw new Error(`${encounterId} did not depart`);
}

function assertPreviews(state: GameState, encounterId: string, mode: string): void {
  const question = getCurrentQuestion(state, encounterId)!;
  const entry = timings.find((item) => item.nodeId === question.node.id)!;
  for (const choice of question.node.answerChoices) {
    const timing = entry.classification.kind === "test_choices" ? entry.classification.choices.find((item) => item.choiceId === choice.id)!.timing : { kind: "no_test" } as const;
    const before = JSON.stringify(state);
    const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id);
    expect(JSON.stringify(state)).toBe(before);
    if (timing.kind === "no_test") {
      if (entry.classification.kind === "no_test") expect(preview, `${question.node.id}/${choice.id}`).toBeNull();
      else expect(preview).toEqual({ kind: "no_test", answerChoiceId: choice.id, durationTicks: null,
        serviceId: null, serviceDisplayName: null, routeId: null, routeDisplayName: null, timingProfileId: null });
      continue;
    }
    const record = exact.find((item) => item.nodeId === question.node.id && item.choiceId === choice.id)!;
    expect(preview).toMatchObject({ kind: "test", timingProfileId: timing.timingProfileId });
    const plan = preview!.diagnosticTiming!;
    expect(plan).toBeDefined();
    expect(plan.execution).toBe(record.disposition.kind === "not_executed" ? "preview_only" : "supported");
    if (preview!.durationTicks !== null) {
      expect(preview!.durationTicks).toBeGreaterThan(0);
      expect(preview!.durationTicks).toBe(Math.max(...plan.phases.map((phase) => phase.forecast.endsAtTick)) - state.facilityTick);
    }
    choicePreviewEvidence.set(`${question.node.id}|${choice.id}|${mode}`, { caseId: entry.caseId, nodeId: question.node.id,
      questionVariantId: question.node.questionVariantId, choiceId: choice.id, choiceLabel: choice.label, mode, preview });
  }
}

function noExtraService(state: GameState, encounterId: string): void {
  expect(state.serviceOperations.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.encounters[encounterId]?.terminalTestOrder).toBeUndefined();
}

function markReviewed(state: GameState, id: string, dueAtMs: number): void {
  const template = Object.values(state.learningHistories)[0]!;
  state.learningHistories[id] = { conceptId: id, card: { ...template.card, dueAtMs, lastReviewAtMs: REAL_MS - 10_000, reps: 1 }, reviews: [{} as ConceptReviewEvidence] };
}
function standalone(id: string): SyntheticClinicalCase {
  const clinicalCase = cases.find((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]!.primaryConceptId === id);
  if (!clinicalCase) throw new Error(`${id} lacks an independent sibling`);
  return clinicalCase;
}
function ordinaryPool(state: GameState): SyntheticClinicalCase[] {
  const capabilities = getCurrentCapabilities(state);
  return PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((item) => item.participant?.kind !== "employee_discussion" && item.routineEligible && item.earliestFacilityStage <= state.facilityLevel && item.requiredCapabilityIds.every((id) => capabilities.has(id)));
}
function complete(c:SyntheticClinicalCase,path:"correct"|0|1|2,index:number){
 const id=`encounter.gs028g.${index}.${path}`;
 let state=ready(admit(prepared(id),c,id),id,id);state=roundTrip(state,id);
 for(let i=0;i<c.decisionNodes.length;i++){
  state=ready(state,id,`${id}.${i}.ready`);const node=c.decisionNodes[i]!;
  expect(getCurrentQuestion(state,id)?.node.id).toBe(node.id);assertPreviews(state,id,"level3");
  const key=path==="correct"?node.answerChoices.find(a=>a.isCorrect)!:node.answerChoices.filter(a=>!a.isCorrect)[path]!;
  const xp=state.clinicalXp;state=submit(state,id,key.id,`${id}.${i}.submit`,REAL_MS+index*100+i);
  expect(state.clinicalXp-xp).toBe(path==="correct"?PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerCorrectFirstAnswer:PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerIncorrectFirstAnswer);
  expect(state.learningHistories[node.primaryConceptId]?.reviews).toEqual([expect.objectContaining({answerChoiceId:key.id,correct:path==="correct",rating:path==="correct"?"Good":"Again"})]);
  expect(state.learningHistories[node.primaryConceptId]?.card.reps).toBe(1);
  expect(state.encounters[id]?.steps[i]?.answer).toMatchObject({answerChoiceId:key.id,correctedForward:path!=="correct"&&i<c.decisionNodes.length-1});
  const seen=coverage.get(node.id)??new Set<string>();seen.add(key.id);coverage.set(node.id,seen);
  noExtraService(state,id);expect(state.encounters[id]?.pendingResult).toBeNull();state=roundTrip(state,id);
  if(i<c.decisionNodes.length-1){
   expect(state.learningHistories[c.decisionNodes[i+1]!.primaryConceptId]?.reviews).toEqual([]);
   expect(getCurrentQuestion(state,id)).toBeNull();
   state=acknowledge(state,id,`${id}.${i}.ack`);state=roundTrip(state,id);
   state=ready(state,id,`${id}.${i}.next`);
   expect(getCurrentQuestion(state,id)?.node.currentUpdate).toBe(c.decisionNodes[i+1]!.currentUpdate);
   expect(state.encounters[id]?.deliveredResultNarratives).toEqual([]);
  }
 }
 expect(state.encounters[id]?.lifecycle).toBe("resolved_summary_available");
 state=closeAndDepart(roundTrip(state,id),id,id);
 for(const n of c.decisionNodes)expect(state.learningHistories[n.primaryConceptId]?.reviews).toHaveLength(1);
 roundTrip(state,id);
}
const count=(items:SyntheticClinicalCase[])=>({cases:items.length,concepts:new Set(items.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size});
const pools=([0,1,2,3] as const).map(stage=>{const all=ordinaryPool(prepared(`pool.${stage}`,stage));return {stage,before:count(all.filter(c=>!c.id.startsWith("case.gs028g."))),after:count(all)};});
describe("GS028 level3 actual gameplay",()=>{
 it.each(cases.flatMap((c,i)=>(["correct",0,1,2] as const).map(path=>[c.id,path,c,i] as const)))("completes %s with answer path %s",(_id,path,c,i)=>complete(c,path,i));
 it.each([0,1,2] as const)("rejects all 62 new cases below their level3 gate at level %s",stage=>{
  for(const c of cases){const state=prepared(c.id,stage);const next=gameReducer(state,{type:"ADMIT_PATIENT",operationId:`reject.${c.id}`,encounterId:c.id,caseId:c.id,patientDisplayName:"Synthetic gate fixture",arrivalClass:"routine"});expect(next.operationReceipts[`reject.${c.id}`]?.status).toBe("rejected");expect(next.encounters[c.id]).toBeUndefined();}
  expect(ordinaryPool(prepared(`gate.${stage}`,stage)).some(c=>c.id.startsWith("case.gs028g."))).toBe(false);
 });
 it("selects all twenty unseen and due objectives at level3 despite future sibling histories",()=>{
  for(const target of concepts){
   for(const kind of ["new_concept","due_review"] as const){const state=prepared(`${kind}.${target.id}`);for(const c of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts)if(c.id!==target.id||kind==="due_review")markReviewed(state,c.id,c.id===target.id?REAL_MS-1:REAL_MS+86_400_000);
    const selected=selectRoutineClinicalCase(state,ordinaryPool(state),REAL_MS);expect(selected).toMatchObject({kind,selectedConceptId:target.id});expect(selected!.clinicalCase.decisionNodes).toHaveLength(1);
    eligibilityEvidence.push({conceptId:target.id,kind,caseId:selected!.clinicalCase.id});
   }
   let unresolved=prepared(`unresolved.${target.id}`);for(const c of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts)if(c.id!==target.id)markReviewed(unresolved,c.id,REAL_MS+86_400_000);
   unresolved=admit(unresolved,standalone(target.id),target.id);expect(selectRoutineClinicalCase(unresolved,ordinaryPool(unresolved),REAL_MS)).toBeNull();
  }
  const future=prepared("all.future");for(const c of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts)markReviewed(future,c.id,REAL_MS+86_400_000);expect(selectRoutineClinicalCase(future,ordinaryPool(future),REAL_MS)).toBeNull();
 });
 it("blocks every unresolved pair sibling without reviewing the unreached second decision",()=>{
  for(const c of paired){const state=admit(prepared(c.id),c,c.id);for(const n of c.decisionNodes){expect(selectRoutineClinicalCase(state,[standalone(n.primaryConceptId)],REAL_MS)).toBeNull();expect(state.learningHistories[n.primaryConceptId]?.reviews).toEqual([]);}}
 });
 it("instantiates all 248 age/sex profiles with coherent names and shuffled choices",()=>{
  for(const c of cases){const orders=new Set<string>();for(const p of c.approvedInstantiationProfiles!){let matched=false;for(let seed=0;seed<64;seed++){
   const id=`profile.${c.id}.${p.id}.${seed}`;const state=prepared(id);const ix=deterministicInteger(state.campaignSeed,RANDOM_STREAMS.clinicalPresentation,`${id}|${c.id}|approved-profile.v1`,c.approvedInstantiationProfiles!.length);
   if(c.approvedInstantiationProfiles![ix]!.id!==p.id)continue;const frozen=admit(state,c,id).encounters[id]!.frozenCase;
   expect(frozen.prototypeDemographics).toEqual(p.prototypeDemographics);expect(frozen.presentation).toContain(`${p.prototypeDemographics!.ageYears}-year-old ${p.prototypeDemographics!.sexLabel==="Female"?"woman":"man"}`);orders.add(frozen.decisionNodes[0]!.answerChoices.map(a=>a.id).join("|"));matched=true;break;
  }expect(matched,p.id).toBe(true);}
  for(let seed=0;seed<8&&orders.size<2;seed++){const id=`shuffle.${c.id}.${seed}`;orders.add(admit(prepared(id),c,id).encounters[id]!.frozenCase.decisionNodes[0]!.answerChoices.map(a=>a.id).join("|"));}expect(orders.size,c.id).toBeGreaterThan(1);
  }expect(frozenProfiles.size).toBe(248);
 });
 it("keeps specialist staging preview-only without a generic biopsy service alias",()=>{
  expect(exact).toHaveLength(4);for(const r of exact)expect(r.disposition).toEqual({kind:"not_executed",reason:"specialist_or_unsupported_service"});
  for(const c of cases.filter(c=>c.decisionNodes.some(n=>n.primaryConceptId.endsWith("clinically-negative-node-staging")))){
   const id=`preview.${c.id}`;let state=ready(admit(prepared(id),c,id),id,id);
   if(c.decisionNodes.length===2){const q=getCurrentQuestion(state,id)!;state=submit(state,id,q.node.answerChoices.find(a=>a.isCorrect)!.id,`${id}.first`);state=ready(acknowledge(state,id,`${id}.ack`),id,id);}
   const q=getCurrentQuestion(state,id)!;const key=q.node.answerChoices.find(a=>a.isCorrect)!;const preview=getAnswerChoiceServicePreview(state,id,key.id)!;
   expect(preview).toMatchObject({kind:"test",timingProfileId:"timing.test.biopsy",diagnosticTiming:{execution:"preview_only"}});state=submit(state,id,key.id,`${id}.staging`);noExtraService(state,id);
  }
 });
 it("loads pre-batch saves with twenty blank histories and preserved existing cards/frozen encounter",()=>{
  const ids=new Set(concepts.map(c=>c.id));const c=PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c=>c.routineEligible&&!c.id.startsWith("case.gs028g.")&&c.earliestFacilityStage<=2)!;
  const id="old-save.gs028g";let state=admit(prepared(id,2),c,id);markReviewed(state,c.decisionNodes[0]!.primaryConceptId,REAL_MS-123456);
  const frozen=clone(state.encounters[id]);const histories=clone(Object.fromEntries(Object.entries(state.learningHistories).filter(([key])=>!ids.has(key))));
  const saved=JSON.parse(serializeGameState(state));for(const key of ids)delete saved.learningHistories[key];state=deserializeGameState(JSON.stringify(saved));
  expect(clone(state.encounters[id])).toEqual(frozen);for(const [key,value] of Object.entries(histories))expect(state.learningHistories[key]).toEqual(value);
  for(const key of ids)expect(state.learningHistories[key]).toMatchObject({conceptId:key,card:{reps:0,lastReviewAtMs:null},reviews:[]});
 });
 it("adds no early supply and exactly 62 cases/20 concepts to the ordinary level3 pool",()=>{
  for(const p of pools.filter(p=>p.stage<3))expect(p.after).toEqual(p.before);const later=pools[3]!;expect(later.after.cases-later.before.cases).toBe(62);expect(later.after.concepts-later.before.concepts).toBe(20);
 });
 it("covers all eighty nodes and all 320 distinct answer submissions",()=>{expect(coverage.size).toBe(80);for(const n of cases.flatMap(c=>c.decisionNodes))expect([...(coverage.get(n.id)??[])].sort()).toEqual(n.answerChoices.map(a=>a.id).sort());expect([...coverage.values()].reduce((s,v)=>s+v.size,0)).toBe(320);});
});
afterAll(()=>{const dir=process.env.GS028_LEVEL3_EVIDENCE_DIR;if(dir)writeFileSync(resolve(dir,"gameplay-evidence.json"),JSON.stringify({actualReducer:true,casePathCount:248,nodeCount:coverage.size,distinctChoiceSubmissions:[...coverage.values()].reduce((s,v)=>s+v.size,0),instantiatedProfileCount:frozenProfiles.size,pools,eligibilityEvidence,exactTestChoiceRecords:exact,previews:[...choicePreviewEvidence.values()]},null,2)+"\n");});
