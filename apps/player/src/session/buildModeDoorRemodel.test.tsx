import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getFacilityAccessValidation, getRoomCareAnchor, getRoomDefinition, isEmployeeOperational,
  serializeGameState, type GameState,
} from "@gamify-surgery/game-domain";
import {
  acceptedWork, actorRows, doorRemodelFixture, EMPLOYEE, EXAM, NORTH, PATIENT,
  reload, routeProblems, samePoint, SOUTH, travelBound,
} from "../../../../packages/game-domain/tests/build-mode-door-remodel.fixture";
import { cleanupPhoneTests } from "../mobile/screenTestUtils";
import { operationalSessionFixture } from "./cloud/operationalSessionTestSupport";
import { mountOperationalController } from "./cloud/operationalControllerTestSupport";
import { TICK_MS } from "./cloud/tickAdmissionCadenceTestSupport";
import { cloudCampaignStorageKey } from "./accountStorageKey";
import { prepareJournal } from "./cloud/journalCodec";
import { cloudCodec } from "./cloud/codecWorker";

type Controller = Awaited<ReturnType<typeof mountOperationalController>>;
type Engine = Awaited<ReturnType<typeof operationalSessionFixture>>;
afterEach(async () => { await cleanupPhoneTests(); vi.useRealTimers(); vi.restoreAllMocks(); });

async function mounted(input: GameState, work: (controller: Controller, engine: Engine) => Promise<void>) {
  const engine = await operationalSessionFixture({}, input);
  vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(engine.clock.wall);
  try {
    const controller = await mountOperationalController(engine.session, engine.scope.accountId);
    await work(controller, engine);
  } finally {
    await cleanupPhoneTests(); engine.session.dispose(); engine.coordinator.dispose();
  }
}

async function remove(controller: Controller, doorId: string) {
  const before = controller.current().state, work = acceptedWork(before);
  const preview = controller.current().mobileBuildActions.previewDoor({ kind: "remove", doorId });
  await controller.action(session => session.removeDoor(doorId));
  const state = controller.current().state;
  const receipt = Object.values(state.operationReceipts).filter(receipt => receipt.commandType === "REMOVE_DOOR").at(-1)!;
  expect(receipt?.status, `B-015 real Build Mode action must remove the interior door: ${receipt?.message}`).toBe("applied");
  expect(preview.valid, "The phone shares the same editable-intermediate rule").toBe(true);
  expect(state.doors.some(door => door.id === doorId)).toBe(false);
  expect(state.paused).toBe(true);
  expect(state.facilityTick).toBe(before.facilityTick);
  expect(acceptedWork(state)).toBe(work);
  expect(actorRows(state).map(actor => [actor.id, actor.point])).toEqual(actorRows(before).map(actor => [actor.id, actor.point]));
}

async function blockedExit(controller: Controller, roomId = EXAM) {
  const access = getFacilityAccessValidation(controller.current().state);
  expect(access.valid).toBe(false); expect(access.unreachableRoomIds).toContain(roomId);
  await controller.action(session => session.exitBuildMode());
  const session = controller.current();
  expect(session.buildMode).toBe(true); expect(session.state.paused).toBe(true);
  expect(session.buildExitBlockedIssues).toEqual(access.issues);
  const definition = getRoomDefinition(session.state.rooms.find(room => room.id === roomId)!.roomDefinitionId)!;
  expect(session.buildExitBlockedIssues.some(issue => issue.includes(definition.displayName)), "Name the unreachable room in the existing exit-issues mechanism").toBe(true);
  expect(session.buildExitBlockedReason).toBeTruthy();
  expect(session.announcement).toContain(access.reason!);
}

async function finishRoutes(controller: Controller, engine: Engine) {
  if (controller.current().state.paused) await controller.action(session => session.togglePause());
  const initial = controller.current().state, bound = travelBound(initial);
  const room = initial.rooms.find(room => room.id === EXAM)!, target = getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "patient");
  for (let minute = 0; minute < bound; minute++) {
    const before = controller.current().state;
    engine.clock.advance(TICK_MS); vi.setSystemTime(engine.clock.wall);
    await controller.tick(1); // Real facility-clock callback -> engine/client.
    const state = controller.current().state;
    expect(state.facilityTick).toBe(before.facilityTick + 1);
    expect(routeProblems(before, state)).toEqual([]);
    expect(state.employees.find(employee => employee.id === EMPLOYEE)!.homeRoomInstanceId).toBe(EXAM);
    expect(state.encounters[PATIENT]!.frozenCase).toEqual(initial.encounters[PATIENT]!.frozenCase);
    if (samePoint(state.encounters[PATIENT]!.patientLocation, target) && isEmployeeOperational(state, EMPLOYEE)) break;
  }
  const state = controller.current().state;
  expect(state.encounters[PATIENT]!.patientLocation, `Care arrival within ${bound} travel-derived ticks`).toEqual(target);
  expect(state.encounters[PATIENT]!.assignedRoomInstanceId).toBe(EXAM);
  expect(state.encounters[PATIENT]!.queuedCareRoomInstanceId).toBeNull();
  expect(isEmployeeOperational(state, EMPLOYEE), "Staff reach their original legal home/work room").toBe(true);
  expect(state.learningHistories).toEqual(initial.learningHistories);
}

describe("B-015 owner ruling: legal access is required when leaving Build Mode", () => {
  it("B-015 fixture control reaches care and staff home through the real clock and worker without remodeling", async () => {
    await mounted(doorRemodelFixture("inbound", true), finishRoutes);
  });

  it.each([false, true])("B-015 permits a staffed room's ONLY door to be removed, blocks exit until repaired, and resumes valid care routes (previously paused=%s)", async paused => {
    const input = doorRemodelFixture("inbound", true); input.paused = paused;
    await mounted(input, async (controller, engine) => {
      // Include the owner's leave/re-enter remodel lifecycle.
      await controller.action(session => session.enterBuildMode());
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
      expect(controller.current().state.paused).toBe(paused);
      await controller.action(session => session.enterBuildMode());
      await remove(controller, SOUTH);
      await blockedExit(controller);
      await controller.action(session => session.placeDoor(EXAM, "north", 0));
      expect(controller.current().buildExitBlockedIssues).toEqual([]);
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
      expect(controller.current().state.paused).toBe(paused);
      expect(engine.ports.flatMap(port => port.messages).some(request => request.kind === "command" && request.command.type === "REMOVE_DOOR")).toBe(true);
      await finishRoutes(controller, engine);
    });
  });

  it("B-015 redirects the used doorway's approaching patient and staff through the remaining legal opening", async () => {
    await mounted(doorRemodelFixture("inbound"), async (controller, engine) => {
      await controller.action(session => session.enterBuildMode());
      await remove(controller, SOUTH);
      expect(controller.current().state.doors.some(door => door.id === NORTH)).toBe(true);
      expect(getFacilityAccessValidation(controller.current().state).valid).toBe(true);
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
      await finishRoutes(controller, engine);
    });
  });

  it("B-015 one real Build Undo restores the removed only door, original routes, assignments and exact prior state", async () => {
    await mounted(doorRemodelFixture("inbound", true), async controller => {
      await controller.action(session => session.enterBuildMode());
      const before = serializeGameState(controller.current().state);
      await remove(controller, SOUTH);
      expect(controller.current().buildUndoCount).toBe(1);
      await blockedExit(controller);
      await controller.action(session => session.undoBuildAction());
      expect(serializeGameState(controller.current().state)).toBe(before);
      expect(controller.current().buildUndoCount).toBe(0);
      expect(controller.current().buildExitBlockedIssues).toEqual([]);
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
    });
  });

  it("B-015 an unfinished doorless remodel survives real journal/codec recovery with the same exit issue and no format extension", async () => {
    let recovered!: GameState;
    const input = doorRemodelFixture("inbound", true), originalKeys = Object.keys(JSON.parse(serializeGameState(input)));
    await mounted(input, async (controller, engine) => {
      await controller.action(session => session.enterBuildMode());
      await remove(controller, SOUTH); await blockedExit(controller);
      expect(await engine.session.durable()).toBe(true);
      const saved = await prepareJournal(engine.cache.journal!, cloudCampaignStorageKey(engine.scope), cloudCodec, { local: true, encode: false });
      expect(saved?.state, "Recover the actual durable append journal, not a hand-authored replacement save").toBeDefined();
      recovered = reload(saved!.state!);
      expect(Object.keys(JSON.parse(serializeGameState(recovered)))).toEqual(originalKeys);
      expect(recovered.doors).toEqual(controller.current().state.doors);
      expect(acceptedWork(recovered)).toBe(acceptedWork(controller.current().state));
    });
    await mounted(recovered, async (controller, engine) => {
      expect(controller.current().state.paused).toBe(true);
      expect(controller.current().state.doors.some(door => door.id === SOUTH)).toBe(false);
      // No new persisted Build Mode flag is required; a paused recovered clinic
      // can reopen the same editor, or an implementation may derive that mode.
      await controller.action(session => session.enterBuildMode());
      await blockedExit(controller);
      await controller.action(session => session.placeDoor(EXAM, "north", 0));
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
      await finishRoutes(controller, engine);
    });
  });

  it("B-015 exterior control keeps the protected Front Desk entrance and records a visible refusal", async () => {
    await mounted(doorRemodelFixture("inbound", true), async controller => {
      await controller.action(session => session.enterBuildMode());
      const before = controller.current().state, entrance = before.doors.find(door => door.exterior)!;
      await controller.action(session => session.removeDoor(entrance.id));
      const after = controller.current().state, receipt = Object.values(after.operationReceipts).filter(row => row.commandType === "REMOVE_DOOR").at(-1)!;
      expect(receipt.status).toBe("rejected");
      expect(receipt.message).toMatch(/exterior|entrance/i);
      expect(controller.current().announcement).toContain(receipt.message!);
      expect(after.doors).toEqual(before.doors);
      expect(acceptedWork(after)).toBe(acceptedWork(before));
      expect(controller.current().buildUndoCount).toBe(0);
    });
  });

  it("B-015 existing-access-issue control still names a separately disconnected room and Undo clears its exit block", async () => {
    await mounted(doorRemodelFixture("empty"), async controller => {
      await controller.action(session => session.enterBuildMode());
      const oldIds = new Set(controller.current().state.rooms.map(room => room.id));
      await controller.action(session => session.beginPlacement("room.waiting"));
      await controller.action(session => session.placeRoom(0, 0));
      const added = controller.current().state.rooms.find(room => !oldIds.has(room.id))!;
      expect(added.roomDefinitionId).toBe("room.waiting");
      await blockedExit(controller, added.id);
      await controller.action(session => session.undoBuildAction());
      expect(controller.current().buildExitBlockedIssues).toEqual([]);
      await controller.action(session => session.exitBuildMode());
      expect(controller.current().buildMode).toBe(false);
    });
  });
});
