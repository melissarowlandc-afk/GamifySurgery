import { expect, test, type Page } from "@playwright/test";
import type { GameState } from "@gamify-surgery/game-domain";
import { readDurableLocalState } from "./ui-density-helpers";
import {
  ROOM_A, ROOM_B, OCCUPANT, activeWorkFixture, animationFrames, beginBlueprint,
  finishMoveFeedback, finishRoomCommits, furniture, leaveBuild, openRemodelClinic,
  placeMove, recordMoveFeedback, recordRoomCommits, reenterBuild, reloadRemodelClinic, roomAt,
  roomMenu, stageMove, world, type Layout, type Point,
} from "./remodel-loading-helpers";

test.setTimeout(180_000);
test.beforeEach(({}, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name), "The owner regressions run on the desktop and native phone projects.");
});
const layoutFor = (project: string): Layout => project === "phone-chrome" ? "phone" : "desktop";
const refusal = /in progress|in use|busy|occupied|reserved|active.*(?:work|visit|test|procedure|service|care)|cannot move|can't move|(?:finish|complete|stop).*(?:work|visit|test|procedure|service)|(?:visit|test|procedure|service).*(?:underway|running|using)/i;
const clockAndMoney = (state: GameState) => ({ tick: state.facilityTick, cash: state.cash, cents: state.cashCents });
const pair = (state: GameState) => [ROOM_A, ROOM_B].map(id => { const room = roomAt(state, id); return { id, x: room.x, y: room.y }; });

async function expectPositions(page: Page, expected: ReturnType<typeof pair>) {
  await expect.poll(async () => pair(await readDurableLocalState(page)), { timeout: 20_000 }).toEqual(expected);
}

function expectCarriedContents(before: GameState, after: GameState, roomId: string, target: Point) {
  const room = roomAt(before, roomId);
  const dx = target.x - room.x, dy = target.y - room.y;
  expect(after.doors.filter(door => door.roomId === roomId)).toEqual(before.doors.filter(door => door.roomId === roomId));
  for (const employee of before.employees.filter(candidate => candidate.homeRoomInstanceId === roomId)) {
    expect(after.employees.find(candidate => candidate.id === employee.id)).toMatchObject({
      id: employee.id, homeRoomInstanceId: roomId, appearance: employee.appearance,
      location: { x: employee.location.x + dx, y: employee.location.y + dy },
    });
  }
  for (const patient of Object.values(before.encounters).filter(candidate => candidate.assignedRoomInstanceId === roomId && candidate.patientLocation)) {
    expect(after.encounters[patient.id]).toMatchObject({ id: patient.id, assignedRoomInstanceId: roomId,
      patientLocation: { x: patient.patientLocation!.x + dx, y: patient.patientLocation!.y + dy } });
  }
}

test("'B-008' leaving and re-entering Build Mode still moves an occupied idle room, carries its contents for $0, and Undo restores it", async ({ page }, info) => {
  const layout = layoutFor(info.project.name);
  await openRemodelClinic(page, layout);
  // This lifecycle is the owner's trigger, not a move immediately after build.
  await reenterBuild(page, layout);
  const before = await readDurableLocalState(page);
  expect(before.facilityLevel).toBeGreaterThanOrEqual(2);
  expect(before.serviceOperations).toEqual([]);
  expect(before.environment.founderActivity).toBeNull();
  const room = roomAt(before, ROOM_A);
  const occupants = before.employees.filter(employee => employee.homeRoomInstanceId === ROOM_A);
  expect(occupants.length).toBeGreaterThan(0);
  for (const employee of occupants) {
    expect(employee.location.x).toBeGreaterThanOrEqual(room.x);
    expect(employee.location.x).toBeLessThan(room.x + 2);
    expect(employee.location.y).toBeGreaterThanOrEqual(room.y);
    expect(employee.location.y).toBeLessThan(room.y + 2);
    expect(employee.facilityTask ?? null).toBeNull();
  }
  const patient = before.encounters[OCCUPANT]!;
  expect(patient.lifecycle).toBe("waiting_unopened");
  expect(patient.pendingResult).toBeNull();
  expect(patient.assignedRoomInstanceId).toBe(ROOM_A);
  expect(patient.patientLocation).not.toBeNull();
  const doors = before.doors.filter(door => door.roomId === ROOM_A);
  expect(doors.length).toBeGreaterThan(0);
  await expect.poll(async () => (await furniture(page, ROOM_A)).length).toBeGreaterThan(0);
  const contents = await furniture(page, ROOM_A);
  const menu = await roomMenu(page, layout, ROOM_A);
  await expect(menu.getByText(refusal)).toHaveCount(0);
  await expect(menu.getByRole("button", { name: "Move", exact: true })).toBeEnabled();
  await recordMoveFeedback(page, refusal);
  await menu.getByRole("button", { name: "Move", exact: true }).click();
  const destination = { x: 25, y: 24 }; // Free 2x2 site, south door still on the existing corridor.
  await placeMove(page, layout, destination, false, ROOM_A);
  await expectPositions(page, [{ id: ROOM_A, ...destination }, pair(before)[1]!]);
  const moved = await readDurableLocalState(page);
  expect(roomAt(moved, ROOM_A)).toEqual({ ...room, ...destination });
  expect(moved.rooms.map(candidate => candidate.id).sort()).toEqual(before.rooms.map(candidate => candidate.id).sort());
  expect(clockAndMoney(moved)).toEqual(clockAndMoney(before));
  expect(moved.doors.filter(door => door.roomId === ROOM_A)).toEqual(doors);
  const dx = destination.x - room.x, dy = destination.y - room.y;
  for (const employee of occupants) {
    const carried = moved.employees.find(candidate => candidate.id === employee.id)!;
    expect(carried).toMatchObject({ id: employee.id, homeRoomInstanceId: ROOM_A,
      staffRoleDefinitionId: employee.staffRoleDefinitionId, appearance: employee.appearance,
      location: { x: employee.location.x + dx, y: employee.location.y + dy } });
  }
  expect(moved.encounters[OCCUPANT]).toMatchObject({ id: patient.id, assignedRoomInstanceId: ROOM_A,
    patientLocation: { x: patient.patientLocation!.x + dx, y: patient.patientLocation!.y + dy } });
  await expect.poll(() => furniture(page, ROOM_A)).toEqual(contents);
  expect(await finishMoveFeedback(page), "A valid idle-room move needs no refusal, confirmation, or timed remodel").toEqual([]);
  await expect(page.getByRole("alert", { name: "Action feedback", exact: true }).filter({ hasText: refusal })).toHaveCount(0);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);

  // One ordinary Undo, with no clock advance or cost/payment interaction.
  await page.getByRole("button", { name: /^Undo(?:$|:| \()/ }).click();
  await expectPositions(page, pair(before));
  const restored = await readDurableLocalState(page);
  expect(restored.rooms).toEqual(before.rooms);
  expect(restored.doors).toEqual(before.doors);
  expect(restored.employees).toEqual(before.employees);
  expect(restored.encounters).toEqual(before.encounters);
  expect(clockAndMoney(restored)).toEqual(clockAndMoney(before));
  await expect.poll(() => furniture(page, ROOM_A)).toEqual(contents);
});

for (const kind of ["visit", "test", "procedure"] as const) {
  test(`'B-008' a room with a real active ${kind} refuses a move with a visible explanation`, async ({ page }, info) => {
    const layout = layoutFor(info.project.name);
    const fixture = activeWorkFixture(kind);
    await openRemodelClinic(page, layout, fixture.state);
    await reenterBuild(page, layout);
    const before = await readDurableLocalState(page);
    const work = before.serviceOperations.find(operation => operation.id === fixture.workId)!;
    expect(work.reservedRoomInstanceIds).toContain(fixture.roomId);
    expect(work.phaseEndsAtFacilityTick).toBeGreaterThan(before.facilityTick);
    const menu = await roomMenu(page, layout, fixture.roomId);
    const move = menu.getByRole("button", { name: "Move", exact: true });
    if (await move.isVisible() && await move.isEnabled()) await move.click();
    // Absence/disablement alone is silent. Require rendered refusal copy in the
    // selected room or the ordinary action-feedback surface, never a title.
    const explanation = page.locator(".room-action-menu p, .room-action-menu small, .mobile-build-room p, .mobile-build-controls [role=status], .build-placement-status, [role=alert][aria-label='Action feedback']").filter({ hasText: refusal });
    await expect(explanation.first()).toBeVisible();
    await animationFrames(page, 12);
    const refused = await readDurableLocalState(page);
    // A refusal may append its explanation to the event log. All simulation
    // state, including the real reservation, actors, rooms and money, stays put.
    expect({ ...world(refused), events: before.events }).toEqual(world(before));
    // An invalid preview may remain visible to explain the refusal. Its
    // confirmation must be disabled; visible copy and no world change remain
    // mandatory. Requiring the explaining preview to disappear was a harness
    // assumption, not the owner's requirement that active work cannot move.
    const confirm = page.locator('[data-phone-build-confirm="placement"]');
    if (await confirm.isVisible()) await expect(confirm).toBeDisabled();
  });
}

/** The first overlapping move must be retained as an invalid draft; the
 * second move completes a valid permutation of the existing footprints. */
async function stageSwap(page: Page, layout: Layout) {
  const before = await readDurableLocalState(page);
  const a = roomAt(before, ROOM_A), b = roomAt(before, ROOM_B);
  await beginBlueprint(page, layout);
  const blueprint = page.getByRole("region", { name: "Blueprint remodel", exact: true });
  const apply = blueprint.getByRole("button", { name: "Apply remodel", exact: true });
  await stageMove(page, layout, ROOM_A, b);
  await expect(blueprint.getByRole("listitem")).toHaveCount(1);
  await expect(blueprint.getByRole("status")).toBeVisible();
  await expect(apply).toBeDisabled();
  await animationFrames(page, 12);
  expect(world(await readDurableLocalState(page))).toEqual(world(before));
  await stageMove(page, layout, ROOM_B, a);
  await expect(blueprint.getByRole("listitem")).toHaveCount(2);
  await expect(apply).toBeEnabled();
  await animationFrames(page, 12);
  const staged = await readDurableLocalState(page);
  expect(world(staged)).toEqual(world(before));
  return { before, staged, blueprint, apply, expected: [{ id: ROOM_A, x: b.x, y: b.y }, { id: ROOM_B, x: a.x, y: a.y }] };
}

async function expectOneCommit(page: Page, staged: GameState, expected: ReturnType<typeof pair>) {
  await expectPositions(page, expected);
  const committed = await readDurableLocalState(page);
  const newReceipts = Object.entries(committed.operationReceipts).filter(([id]) => !(id in staged.operationReceipts));
  expect(newReceipts, "One Apply is one applied operation, including under rapid double input").toHaveLength(1);
  expect(newReceipts[0]![1].status).toBe("applied");
  expect(clockAndMoney(committed)).toEqual(clockAndMoney(staged));
  expect(committed.rooms.map(room => room.id).sort()).toEqual(staged.rooms.map(room => room.id).sort());
  await animationFrames(page, 2);
  const observed = await finishRoomCommits(page);
  expect(observed).toContainEqual(pair(staged));
  expect(observed).toContainEqual(expected);
  for (const positions of observed) {
    expect([JSON.stringify(pair(staged)), JSON.stringify(expected)], "No observer may see only half the swap committed").toContain(JSON.stringify(positions));
  }
  return committed;
}

test("'B-008' Blueprint remodel accepts an initially invalid swap, applies both rooms atomically, and preserves identities on reload", async ({ page }, info) => {
  const layout = layoutFor(info.project.name);
  await openRemodelClinic(page, layout);
  await reenterBuild(page, layout);
  const { before, staged, apply, expected } = await stageSwap(page, layout);
  await expect.poll(async () => (await furniture(page, ROOM_A)).length).toBeGreaterThan(0);
  await expect.poll(async () => (await furniture(page, ROOM_B)).length).toBeGreaterThan(0);
  const furnitureBefore = await Promise.all([furniture(page, ROOM_A), furniture(page, ROOM_B)]);
  await recordRoomCommits(page);
  await apply.click();
  const committed = await expectOneCommit(page, staged, expected);
  expect(roomAt(committed, ROOM_A)).toEqual({ ...roomAt(before, ROOM_A), x: expected[0]!.x, y: expected[0]!.y });
  expect(roomAt(committed, ROOM_B)).toEqual({ ...roomAt(before, ROOM_B), x: expected[1]!.x, y: expected[1]!.y });
  expectCarriedContents(before, committed, ROOM_A, expected[0]!);
  expectCarriedContents(before, committed, ROOM_B, expected[1]!);
  await expect.poll(() => Promise.all([furniture(page, ROOM_A), furniture(page, ROOM_B)])).toEqual(furnitureBefore);
  await leaveBuild(page, layout);
  const restored = await reloadRemodelClinic(page);
  expect(pair(restored)).toEqual(expected);
  expect(restored.rooms).toEqual(committed.rooms);
  expect(restored.doors).toEqual(committed.doors);
  expect(restored.employees).toEqual(committed.employees);
  expect(restored.encounters).toEqual(committed.encounters);
  expect(clockAndMoney(restored)).toEqual(clockAndMoney(before));
});

test("'B-008' Cancel blueprint discards both staged moves without changing the clinic or its reload", async ({ page }, info) => {
  const layout = layoutFor(info.project.name);
  await openRemodelClinic(page, layout);
  await reenterBuild(page, layout);
  const { before, blueprint } = await stageSwap(page, layout);
  await blueprint.getByRole("button", { name: "Cancel blueprint", exact: true }).click();
  await expect(blueprint).toHaveCount(0);
  expect(world(await readDurableLocalState(page))).toEqual(world(before));
  await leaveBuild(page, layout);
  expect(world(await reloadRemodelClinic(page))).toEqual(world(before));
});

test("'B-008' rapid double Apply remodel commits a two-room swap exactly once", async ({ page }, info) => {
  const layout = layoutFor(info.project.name);
  await openRemodelClinic(page, layout);
  await reenterBuild(page, layout);
  const { staged, apply, expected } = await stageSwap(page, layout);
  await recordRoomCommits(page);
  // Dispatch twice in the same task to exercise the actual UI handler's latch;
  // do not bypass the handler with a command/fixture hook.
  await apply.evaluate(button => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
  await expectOneCommit(page, staged, expected);
  await animationFrames(page, 30);
  const settled = await readDurableLocalState(page);
  expect(Object.keys(settled.operationReceipts).filter(id => !(id in staged.operationReceipts))).toHaveLength(1);
  expect(pair(settled)).toEqual(expected);
});
