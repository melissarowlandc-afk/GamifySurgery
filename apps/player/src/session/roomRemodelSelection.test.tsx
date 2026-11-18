import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { gameReducer, type GameState } from "@gamify-surgery/game-domain";
import { createAppAppointmentsQaState } from "../../../../tests/fixtures/app-appointments";
import { createMriAppointmentsQaState } from "../../../../tests/fixtures/mri-appointments";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../ui/testDomHarness";
import { ActionFeedbackLayer } from "../ui/ActionFeedbackLayer";
import { showCommandProblem } from "../diagnostics/problemDiagnostics";
import { createFreshProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";

afterEach(async () => { await cleanupPhoneTests(); showCommandProblem(null); });

// Public synthetic appointments, advanced through the ordinary reducer until a
// real reservation is in service. No hand-authored operation or blocker mock.
const fixtures = new Map<string, { state: GameState; roomId: string; workId: string }>();
function activeWork(kind: "visit" | "test") {
  const cached = fixtures.get(kind);
  if (cached) return structuredClone(cached);
  let state = kind === "visit" ? createAppAppointmentsQaState() : createMriAppointmentsQaState();
  state.openChartEncounterId = null; state.attendedEncounterId = null;
  state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: `c1.${kind}.play` });
  const income = kind === "visit" ? "income.app_consult" : "income.mri";
  const definition = kind === "visit" ? "room.examination" : "room.mri";
  for (let tick = 0; tick < 1_200; tick++) {
    const work = state.serviceOperations.find(operation => operation.status === "in_service" && operation.incomeLineId === income &&
      operation.phaseEndsAtFacilityTick !== null && operation.phaseEndsAtFacilityTick > state.facilityTick &&
      operation.reservedRoomInstanceIds.some(id => state.rooms.some(room => room.id === id && room.roomDefinitionId === definition)));
    if (work) {
      const roomId = work.reservedRoomInstanceIds.find(id => state.rooms.some(room => room.id === id && room.roomDefinitionId === definition))!;
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `c1.${kind}.pause` });
      const fixture = { state, roomId, workId: work.id }; fixtures.set(kind, fixture);
      return structuredClone(fixture);
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `c1.${kind}.tick.${tick}`, advancedAtRealMs: 1_800_000_000_000 + tick * 1_000 });
  }
  throw new Error(`Synthetic ${kind} never reached in_service.`);
}

for (const kind of ["visit", "test"] as const) {
  for (const entry of ["Move", "Blueprint"] as const) {
    it.each(["desktop", "phone"] as const)(`C1 D1: visibly refuses ${entry} selection for an in-service ${kind} on %s before entering the tool`, async layout => {
      const { state, roomId, workId } = activeWork(kind), env = phoneTestDom();
      Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
      const profile = { ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: state.campaignId,
        campaigns: [{ campaignId: state.campaignId, name: "Synthetic C1 active work", status: "resumable" as const,
          createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs, state }] };
      let session!: PrototypeSession;
      function Host() {
        session = usePrototypeSession({ profile, notice: "Synthetic C1 fixture" });
        return <><button onClick={() => entry === "Move" ? session.beginMoveSelectedRoom() : session.remodelBlueprint.editRoom(roomId)}>{entry}</button>
          <ActionFeedbackLayer shell={layout} /></>;
      }
      await env.render(<Host />);
      await act(async () => session.enterBuildMode());
      await act(async () => session.selectRoom(roomId));
      if (entry === "Blueprint") await act(async () => session.remodelBlueprint.begin());
      const before = session.state;
      expect(before.serviceOperations.find(row => row.id === workId)).toMatchObject({ status: "in_service", reservedRoomInstanceIds: expect.arrayContaining([roomId]) });
      await env.click(entry);
      const feedback = allElements(env.doc.body, node => node.attributes.role === "alert" && node.attributes["aria-label"] === "Action feedback");
      expect(feedback.map(node => node.textContent).join(" ")).toMatch(/in use|active.*work|(?:finish|complete).*(?:work|visit|test)/i);
      expect(session.movingRoomInstanceId).toBeNull();
      expect(session.selectedRoomDefinitionId).toBeNull();
      expect(session.remodelBlueprint.steps).toEqual([]);
      expect(session.state).toBe(before);
    });
  }
}
