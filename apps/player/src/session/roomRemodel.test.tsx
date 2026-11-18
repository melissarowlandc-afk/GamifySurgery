import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, getRoomDefinition, getRoomNavigableTiles, type PlacedRoom } from "@gamify-surgery/game-domain";
import { phoneTestDom, cleanupPhoneTests } from "../ui/testDomHarness";
import { testElementProps } from "../mobile/testDom";
import { appendLocalCampaign, createFreshProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { RemodelControls } from "../ui/RemodelControls";
import { remodelBlueprintPreview } from "./remodelBlueprint";
import { useRemodelBlueprint } from "./useRemodelBlueprint";

afterEach(cleanupPhoneTests);
async function mount(extraRooms = true) {
  const env = phoneTestDom(); Object.assign(env.browser, { setInterval, clearInterval });
  const values = new Map<string, string>();
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  const state = createInitialGameState(); state.encounters = {}; state.openChartEncounterId = null;
  if (extraRooms) state.rooms.push(...[15, 25].map((x, i): PlacedRoom => ({ id: `remodel.${i}`, roomDefinitionId: "room.waiting", x, y: 20,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 })));
  if (!extraRooms) {
    state.facilityLevel = 2;
    const room: PlacedRoom = { id: "staffed.closet", roomDefinitionId: "room.evs_closet", x: 34, y: 26,
      orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room); state.doors.push({ id: "door.staffed.closet", roomId: room.id, side: "south", offset: 1, exterior: false });
    state.employees.push({ id: "staff.remodel", staffRoleDefinitionId: "staff.evs_worker", displayName: "Synthetic", appearance: state.founder.appearance,
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1, homeRoomInstanceId: room.id,
      location: getRoomNavigableTiles(room, getRoomDefinition(room.roomDefinitionId)!, state.doors)[0]!, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 1000 });
  }
  const made = appendLocalCampaign({ ...createFreshProfile(), tutorialsEnabled: false }, state.founder, "Remodel fixture", 0, "remodel.fixture", false);
  state.campaignId = made.campaign.campaignId; made.campaign.state = state;
  let session!: PrototypeSession;
  function Host() { session = usePrototypeSession({ profile: made.profile, notice: "Fixture" }); return <RemodelControls blueprint={session.remodelBlueprint} />; }
  await env.render(<Host />);
  const call = async (fn: (value: PrototypeSession) => unknown) => { await act(async () => { await fn(session); }); };
  return { ...env, call, get session() { return session; } };
}

describe("paused remodel blueprint session shared by desktop and phone", () => {
  it("moves a staffed room after leaving and reentering Build Mode and refuses the stale callback after leaving", async () => {
    const env = await mount(false);
    await env.call(s => s.enterBuildMode()); await env.call(s => s.exitBuildMode());
    expect(env.session.buildMode).toBe(false);
    await env.call(s => s.enterBuildMode());
    const before = env.session.state, employee = before.employees.find(row => row.id === "staff.remodel")!, room = before.rooms.find(row => row.id === employee.homeRoomInstanceId)!;
    await env.call(s => s.selectRoom(room.id)); await env.call(s => s.beginMoveSelectedRoom());
    await env.call(s => s.placeRoom(10, 10));
    expect(env.session.state.rooms.find(row => row.id === room.id)).toMatchObject({ x: 10, y: 10 });
    expect(env.session.state.employees.find(row => row.id === employee.id)).toMatchObject({ homeRoomInstanceId: room.id,
      location: { x: employee.location.x + 10 - room.x, y: employee.location.y + 10 - room.y } });
    await env.call(s => s.undoBuildAction()); await env.call(s => s.exitBuildMode());
    expect(env.session.buildMode).toBe(false);
    const unchanged = env.session.state;
    await env.call(s => s.beginMoveSelectedRoom()); await env.call(s => s.placeRoom(12, 12));
    expect(env.session.state).toBe(unchanged); expect(env.session.announcement).toContain("Enter Build Mode");
  });

  it("stages an initially invalid swap without any game mutations, then applies one atomic undoable command", async () => {
    const env = await mount(); await env.call(s => s.enterBuildMode());
    const before = env.session.state;
    await env.call(s => s.remodelBlueprint.begin());
    await env.call(s => s.remodelBlueprint.editRoom("remodel.0"));
    expect(env.session.movingRoomInstanceId).toBe("remodel.0");
    // Phone preview may stage an overlap: Apply still validates the final plan.
    expect(env.session.mobileBuildActions.previewPlacement(25, 20).valid).toBe(true);
    await env.call(s => s.placeRoom(25, 20));
    expect(env.session.state).toBe(before); expect(env.session.buildUndoCount).toBe(0);
    expect(env.session.remodelBlueprint.invalidRoomIds).toContain("remodel.0");
    expect(env.session.remodelGhosts).toEqual([expect.objectContaining({ roomId: "remodel.0", x: 25, valid: false })]);
    expect(env.find(node => node.tagName === "BUTTON" && node.textContent === "Apply remodel").attributes.disabled).toBeDefined();
    await env.call(s => s.remodelBlueprint.editRoom("remodel.1")); await env.call(s => s.placeRoom(15, 20));
    expect(env.session.remodelBlueprint.valid).toBe(true);
    expect(env.session.state).toBe(before);
    await env.call(s => s.remodelBlueprint.apply());
    expect(env.session.state.rooms.find(row => row.id === "remodel.0")!.x).toBe(25);
    expect(env.session.state.rooms.find(row => row.id === "remodel.1")!.x).toBe(15);
    expect(Object.values(env.session.state.operationReceipts).filter(row => row.commandType === "APPLY_REMODEL_PLAN")).toHaveLength(1);
    expect(env.session.buildUndoCount).toBe(1); expect(env.session.buildUndoLabel).toBe("Remodel rooms");
    expect(env.session.state.paused).toBe(true); expect(env.session.remodelBlueprint.active).toBe(false);
    await env.call(s => s.undoBuildAction()); expect(env.session.state.rooms).toEqual(before.rooms);
  });

  it("undoes staged steps and cancels without commanding, spending, advancing time or losing the room selection", async () => {
    const env = await mount(); await env.call(s => s.enterBuildMode());
    const before = env.session.state;
    await env.call(s => s.remodelBlueprint.begin()); await env.call(s => s.remodelBlueprint.editRoom("remodel.0"));
    await env.call(s => s.placeRoom(35, 20));
    await env.call(s => s.remodelBlueprint.editRoom("remodel.0")); await env.call(s => s.placeRoom(40, 20));
    await env.call(s => s.remodelBlueprint.undo());
    expect(env.session.remodelBlueprint.steps).toEqual([{ roomId: "remodel.0", x: 35, y: 20, orientation: 0 }]);
    await env.call(s => s.exitBuildMode()); expect(env.session.buildMode).toBe(true);
    expect(env.session.announcement).toContain("Apply or cancel");
    await env.call(s => s.remodelBlueprint.cancel()); expect(env.session.remodelGhosts).toEqual([]);
    expect(env.session.state).toBe(before); expect(env.session.buildUndoCount).toBe(0);
  });

  it("rejects an old selected room after a rebase without dereferencing a missing definition", async () => {
    const env = await mount(); await env.call(s => s.enterBuildMode());
    await env.call(s => s.remodelBlueprint.begin());
    await env.call(s => s.remodelBlueprint.editRoom("no.longer.exists"));
    expect(env.session.announcement).toBe("That room is no longer available.");
    expect(env.session.remodelBlueprint.steps).toEqual([]);
    const before = structuredClone(env.session.state);
    expect(remodelBlueprintPreview(env.session.state, [{ roomId: "gone", x: 0, y: 0, orientation: 0 }])).toMatchObject({ valid: false, invalidRoomIds: ["gone"], ghosts: [] });
    expect(env.session.state).toEqual(before);
  });

  it("exposes accessible edit, staged Undo, cancel and Apply controls with invalid rooms named before commit", async () => {
    const env = await mount(); await env.call(s => s.enterBuildMode());
    const begin = env.find(node => node.tagName === "BUTTON" && node.textContent === "Blueprint remodel");
    await env.clickElement(begin);
    expect(env.session.remodelBlueprint.rooms.filter(room => room.id.startsWith("remodel.")).map(room => room.name)).toEqual(["Waiting Room A", "Waiting Room B"]);
    const select = env.find(node => node.attributes["aria-label"] === "Room to remodel");
    await act(async () => (testElementProps(select).onChange as (e: unknown) => void)({ currentTarget: { value: "remodel.0" } }));
    expect(env.session.movingRoomInstanceId).toBe("remodel.0");
    await env.call(s => s.placeRoom(25, 20));
    expect(env.element.textContent).toContain("Needs attention"); expect(env.element.textContent).toContain("overlaps");
    await env.clickElement(env.find(node => node.textContent === "Undo staged step" && node.tagName === "BUTTON"));
    expect(env.session.remodelBlueprint.steps).toEqual([]);
    await env.clickElement(env.find(node => node.textContent === "Cancel blueprint" && node.tagName === "BUTTON"));
    expect(env.session.remodelBlueprint.active).toBe(false);
  });
});

it("admits one immutable Apply while a hosted command is pending and keeps the draft after a rejected/stale commit", async () => {
  const env = phoneTestDom(), state = createInitialGameState();
  state.rooms.push({ id: "draft", roomDefinitionId: "room.waiting", x: 15, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  let settle!: (status: string) => void;
  const commit = vi.fn(() => new Promise<string>(resolve => { settle = resolve; }));
  let draft!: ReturnType<typeof useRemodelBlueprint>;
  function Host() {
    draft = useRemodelBlueprint({ state, buildMode: true, getState: () => state, edit: () => {}, clearPlacement: () => {}, commit, announce: () => {} });
    return <RemodelControls blueprint={draft.view} />;
  }
  await env.render(<Host />); await env.click("Blueprint remodel");
  await act(async () => { draft.stage({ roomId: "draft", x: 25, y: 10, orientation: 0 }); });
  let pending!: boolean | Promise<boolean>;
  await act(async () => { pending = draft.view.apply(); expect(draft.view.apply()).toBe(false); });
  expect(commit).toHaveBeenCalledTimes(1);
  expect(commit).toHaveBeenCalledWith([{ roomId: "draft", x: 25, y: 10, orientation: 0 }]);
  expect(draft.view.busy).toBe(true);
  await act(async () => { settle("rejected"); expect(await pending).toBe(false); });
  expect(draft.view.busy).toBe(false); expect(draft.view.active).toBe(true); expect(draft.view.steps).toHaveLength(1);
});
