import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { applyGameEvidenceCommand, PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { scoredPatientFixture } from "../../playtime/usageTestFixtures";
import { createFreshProfile } from "../prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../usePrototypeSession";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { mountOperationalController } from "./operationalControllerTestSupport";

afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });
const flush = async () => { for (let i=0;i<50;i++) await Promise.resolve(); };

it("coalesces the automatic tutorial acknowledgement while earlier command results are still arriving",async()=>{
  const state=scoredPatientFixture();state.facilityLevel=1;state.alertHumor.alertsTutorialAcknowledgedAtTick=null;
  const encounter=state.encounters[TUTORIAL_ENCOUNTER_ID]!,node=encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const f=await operationalSessionFixture({},state),port=f.ports[0]!;port.auto=false;
  try{
    const before=f.session.state.encounters;
    const a=f.session.executeAsync({type:"SUBMIT_ANSWER",encounterId:encounter.id,decisionNodeId:node.id,answerChoiceId:node.answerChoices[0]!.id,reviewedAtMs:1800000000000,operationId:"auto.ack.a"},PROTOTYPE_DOMAIN_CONTEXT);
    const b=f.session.executeAsync({type:"CLOSE_CHART",encounterId:encounter.id,operationId:"auto.ack.b"},PROTOTYPE_DOMAIN_CONTEXT);
    await flush();await mountOperationalController(f.session,f.scope.accountId);
    await act(async()=>{port.next();await a;});
    expect(f.session.state.encounters).not.toBe(before);
    // Commit a render with changed encounters before the pending ACK executes.
    // Its effect must not manufacture another operation for the same request.
    await act(async()=>{port.auto=true;port.next();await b;await f.session.commandsSettled();});
    expect(port.messages.filter(r=>r.kind==="command"&&r.command.type==="ACKNOWLEDGE_ALERTS_TUTORIAL")).toHaveLength(1);
    expect(await f.session.durable()).toBe(true);
  }finally{port.auto=true;f.session.dispose();}
});

it("the actual 4x controller clock skips lagging pulses and keeps every admitted player action in order",async()=>{
  const f=await operationalSessionFixture(),port=f.ports[0]!;
  try{
    const mounted=await mountOperationalController(f.session,f.scope.accountId);
    await mounted.action(s=>s.setSimulationSpeed(4));if(f.session.state.paused)await mounted.action(s=>s.togglePause());
    expect(f.session.state).toMatchObject({paused:false,simulationSpeed:4});
    const before=f.session.state.facilityTick,start=port.messages.length;
    let checkpoint=JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
    port.auto=false;
    await act(async()=>{
      mounted.pulse(4);await flush();expect(port.waiting).toHaveLength(1);
      const a=mounted.current().setSimulationSpeed(2),b=mounted.current().setSimulationSpeed(4);
      for(let i=0;i<20;i++)mounted.pulse(4);
      await flush();expect(port.waiting).toHaveLength(1);
      port.auto=true;port.next();await a;await b;await f.session.commandsSettled();
    });
    const requests=port.messages.slice(start).filter(r=>r.kind==="command");
    expect(requests.map(r=>r.command.type)).toEqual(["ADVANCE_TICK","SET_SIMULATION_SPEED","SET_SIMULATION_SPEED"]);
    expect(f.session.state.facilityTick).toBe(before+1);expect(f.session.state.simulationSpeed).toBe(4);
    for(const request of requests)checkpoint=applyGameEvidenceCommand(checkpoint,request.command,{...PROTOTYPE_DOMAIN_CONTEXT,...request.contextFlags}).checkpoint;
    expect(JSON.stringify(JSON.parse(await f.session.exportRecoveryAsync()).checkpoint)).toBe(JSON.stringify(checkpoint));
    expect(await f.session.durable()).toBe(true);
  }finally{port.auto=true;f.session.dispose();}
});

async function controller() {
  const f = await operationalSessionFixture({}, scoredPatientFixture()), env = phoneTestDom();
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: () => 1, clearInterval() {} });
  const state = f.session.state;
  const profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
    tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
    campaigns: [{ ...f.session.metadata, state }] };
  let current!: PrototypeSession;
  function Game() {
    current = usePrototypeSession({ profile, notice: "Public verified clinic" }, f.session);
    f.session.playerView(current.state, current.state.openChartEncounterId, current.summaryVisible, current.selectedRoomDefinitionId,
      current.buildMode, current.selectedRoomInstanceId, current.placementOrientation, current.facilityCamera, current.questionReviewFlags, false);
    return <p>{current.state.facilityTick}</p>;
  }
  await env.render(<AuthAccountContext.Provider value={f.scope.accountId}><Game /></AuthAccountContext.Provider>);
  return { ...f, env, current: () => current };
}

it("chart feedback acknowledgment, close and reopen await the real prior receipt", async () => {
  const f = await controller();
  try {
    const encounter = f.session.state.encounters[TUTORIAL_ENCOUNTER_ID]!, node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
    const choice = node.answerChoices[0]!.id;
    await act(async () => { await f.current().submitAnswer(choice); });
    const reviews = f.session.state.reviewIntents.length;
    let checkpoint = JSON.parse(await f.session.exportRecoveryAsync()).checkpoint;
    const before = f.ports[0]!.messages.length;
    await act(async () => { await f.current().closeChart(); await f.current().openPatient(encounter.id); });
    const requests = f.ports[0]!.messages.slice(before).filter(r=>r.kind==="command");
    for (const request of requests) checkpoint = applyGameEvidenceCommand(checkpoint, request.command,
      { ...PROTOTYPE_DOMAIN_CONTEXT, ...request.contextFlags }).checkpoint;
    expect(JSON.stringify(JSON.parse(await f.session.exportRecoveryAsync()).checkpoint)).toBe(JSON.stringify(checkpoint));
    expect(f.session.state.reviewIntents).toHaveLength(reviews);
    const commands = f.ports[0]!.messages.slice(before).filter(r=>r.kind==="command").map(r=>r.command.type);
    expect(commands.at(-1)).toBe("OPEN_CHART"); expect(commands).toContain("CLOSE_CHART");
    expect(f.current().state).toBe(f.session.state);
  } finally { f.session.dispose(); }
});

it("queued hires generate distinct IDs from the completed preceding state", async () => {
  const f = await controller();
  try {
    await act(async () => { const a=f.current().hireStaff("staff.receptionist"), b=f.current().hireStaff("staff.receptionist"); await a; await b; });
    const commands=f.ports[0]!.messages.flatMap(r=>r.kind==="command"&&r.command.type==="HIRE_STAFF"?[r.command]:[]);
    expect(commands).toHaveLength(2);
    // If staffing caps reject a request, subsequent input still uses current IDs.
    const ids=f.session.state.employees.map(row=>row.id); expect(new Set(ids).size).toBe(ids.length);
    const applied=commands.filter(command=>f.session.state.operationReceipts[command.operationId]?.status==="applied");
    if(applied.length===2) expect(applied[0]!.employeeId).not.toBe(applied[1]!.employeeId);
  } finally { f.session.dispose(); }
});

it("Save & Close waits for both queued controller actions before confirming the account copy", async () => {
  const f = await controller(), port=f.ports[0]!; port.auto=false;
  try {
    let closing!: Promise<boolean>;
    await act(async () => {
      const first=f.current().setSimulationSpeed(2), second=f.current().setSimulationSpeed(4);
      closing=f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
      await flush(); expect(f.session.canExecute).toBe(false); expect(port.waiting).toHaveLength(1);
      port.auto=true;port.next(); await first;await second;expect(await closing).toBe(true);
    });
    expect(f.session.state.simulationSpeed).toBe(4); expect(f.session.state.paused).toBe(true);
    expect(f.coordinator.view.phase).toBe("closed");
  } finally { port.auto=true; f.session.dispose(); }
});
