import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { gameReducer, getEmployeeArrival, getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { getBuildAccessWarning, getRoomAccessWarning, missingHireRoomMessage, presentActionRejection } from "./roomAccessFeedback";
import { previewMobilePlacement } from "../mobile/build/buildSession";
import { createPrototypePlayerView } from "../session/viewModels";

import { restrictedOfficeFixture } from "./roomAccessTestSupport";
import { RoomActionMenu } from "./RoomActionMenu";
import { MobileBuildRoom } from "../mobile/build/MobileBuildRoom";
import { phoneFixture } from "../mobile/screenTestUtils";

function addSafeHallway(f: ReturnType<typeof restrictedOfficeFixture>) {
  for (let x = 14; x <= f.office.x + 1; x++) f.state.rooms.push({ id: `hall.${x}`, roomDefinitionId: "room.hallway", x, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  f.state.doors.push({ id: "front.to.hall", roomId: f.front.id, side: "north", offset: 4, exterior: false },
    { id: "office.to.hall", roomId: f.office.id, side: "north", offset: 1, exterior: false });
}

it.each(["room.ambulatory_or", "room.endoscopy"])("explains the real %s pass-through obstruction without changing a domain rule", careId => {
  const f = restrictedOfficeFixture(careId), before = JSON.stringify(f.state);
  expect(getEmployeeArrival(f.state, "staff.surgeon", "test.hire", PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
  const warning = getRoomAccessWarning(f.state, f.office.id);
  expect(warning).toContain(getRoomDefinition(careId)!.displayName); expect(warning).toContain("hallway or waiting area");
  expect(getBuildAccessWarning(f.state, f.office.id)).toBe(warning);
  expect(JSON.stringify(f.state)).toBe(before);
});
it("does not warn just because an OR is adjacent when a real public alternative is connected", () => {
  const f = restrictedOfficeFixture(); addSafeHallway(f);
  expect(getEmployeeArrival(f.state, "staff.surgeon", "test.hire", PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
  expect(getRoomAccessWarning(f.state, f.office.id)).toBeNull();
});
it("names the required office and a corrective path in the actual hire rejection", () => {
  const f = restrictedOfficeFixture(), command = { type: "HIRE_STAFF" as const, staffRoleDefinitionId: "staff.surgeon", employeeId: "new.surgeon", operationId: "hire.restricted" };
  const next = gameReducer(f.state, command), receipt = next.operationReceipts[command.operationId]!;
  expect(receipt.status).toBe("rejected"); expect(receipt.message).toContain("no connected path");
  const message = presentActionRejection(next, command, receipt.message);
  expect(message).toContain("Surgeon"); expect(message).toContain(getRoomDefinition("room.surgeon_office")!.displayName);
  expect(message).toContain(getRoomDefinition("room.ambulatory_or")!.displayName); expect(message).toContain("hallway or waiting area");
  expect(next.employees).toEqual(f.state.employees); expect(next.cashCents).toBe(f.state.cashCents);
});
it("names missing hire rooms in the collapsed roster precondition instead of saying compatible room", () => {
  const f = restrictedOfficeFixture(); f.state.rooms = f.state.rooms.filter(room => room.id !== f.office.id);
  const expected = missingHireRoomMessage(f.state, "staff.surgeon");
  expect(expected).toContain(getRoomDefinition("room.surgeon_office")!.displayName); expect(expected).toContain("hire a Surgeon");
  const role = createPrototypePlayerView(f.state, null, false, null).staffRoles.find(role => role.id === "staff.surgeon")!;
  expect(role.blockedReason).toBe(expected); expect(role.canHire).toBe(false);
  expect(presentActionRejection(f.state, { type: "HIRE_STAFF", staffRoleDefinitionId: "staff.surgeon" }, "Build a compatible room before hiring this role.")).toBe(expected);
});
it("warns before phone confirmation and in the selected room after placement, leaving reducer validity and input intact", () => {
  const f = restrictedOfficeFixture(); f.state.rooms = f.state.rooms.filter(room => room.id !== f.office.id); f.state.doors = f.state.doors.filter(door => door.roomId !== f.office.id);
  const before = JSON.stringify(f.state);
  const preview = previewMobilePlacement(f.state, "room.surgeon_office", null, f.office.x, f.office.y);
  expect(preview.valid).toBe(true); expect(preview.warning).toContain("Ambulatory OR"); expect(JSON.stringify(f.state)).toBe(before);
  const next = gameReducer(f.state, { type: "PLACE_ROOM", roomId: f.office.id, roomDefinitionId: "room.surgeon_office", x: f.office.x, y: f.office.y, operationId: "build.office" });
  const view = createPrototypePlayerView(next, null, false, null, true, f.office.id);
  expect(view.selectedRoomBuild?.accessWarning).toContain("Ambulatory OR");
});
it("does not invent a pass-through reason for a room with no physical route, and keeps cash/stale-action reasons exact", () => {
  const f = restrictedOfficeFixture(); f.state.doors = [];
  expect(getRoomAccessWarning(f.state, f.office.id)).toBeNull();
  expect(presentActionRejection(f.state, { type: "HIRE_STAFF", staffRoleDefinitionId: "staff.surgeon" }, "There is not enough cash for this hire.")).toBe("There is not enough cash for this hire.");
  expect(presentActionRejection(f.state, { type: "SUBMIT_ANSWER" }, "The question is stale.")).toBe("The question is stale.");
});
it.each(["phone", "desktop"])("keeps the warning in the selected %s room controls until its access is fixed", layout => {
  const f = restrictedOfficeFixture(), view = createPrototypePlayerView(f.state, null, false, null, true, f.office.id), room = view.selectedRoomBuild!;
  const noop = () => {};
  const markup = layout === "phone"
    ? renderToStaticMarkup(createElement(MobileBuildRoom, { props: phoneFixture({ ...view, buildMode: true }), room, onMove: noop, onDoors: noop }))
    : renderToStaticMarkup(createElement(RoomActionMenu, { room, anchor: null, containerRef: { current: null }, onUpgrade: noop, onMove: noop, onDoors: noop, onSell: noop, onClose: noop, onEndoscopySetupAction: noop }));
  expect(markup).toContain('class="room-access-warning" role="status"'); expect(markup).toContain("Ambulatory OR");
  expect(markup).toContain("hallway or waiting area"); if (layout === "phone") expect(markup).not.toContain("Access ready");
});
