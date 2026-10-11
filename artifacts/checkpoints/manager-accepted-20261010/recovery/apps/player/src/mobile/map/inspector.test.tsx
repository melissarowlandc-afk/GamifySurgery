import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { MobileInspectorSheet, type MobileInspectorSheetProps } from "../MobileInspectorSheet";
import { TestDocument, TestElement, findTestElement, testElementProps } from "../testDom";
import { describeMobileCharacter, describeMobileRoom, type MobileInspectorSelection } from "./selection";

const initial = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
const facility = { ...initial, staff: [{ instanceId: "employee", displayName: "Avery", roleDisplayName: "Nurse", homeRoomInstanceId: initial.rooms[0]!.instanceId }] };
const description = () => ({ name: "Avery · Nurse", activity: "Waiting for patients" });
function fixture(selection: MobileInspectorSelection): MobileInspectorSheetProps {
  return { selection, facility, onDescribeCharacter: description, onPraiseEmployee: vi.fn(), onOpenRoom: vi.fn(), onClose: vi.fn() };
}
afterEach(() => vi.unstubAllGlobals());
describe("phone map inspector", () => {
  it("renders canonical character role/activity and praise in a bottom sheet", () => {
    const props = fixture(describeMobileCharacter({ kind: "staff", id: "employee" }, facility, description, true)!);
    const markup = renderToStaticMarkup(<MobileInspectorSheet {...props} />);
    expect(markup).toContain('class="mobile-sheet is-bottom"');
    for (const text of ["Avery · Nurse", "Waiting for patients", "Praise Employee", "Close Avery"]) expect(markup).toContain(text);
    expect(markup).not.toContain("title=");
  });
  it("renders room access/upgrade information and the existing action routes", () => {
    const room = { ...initial.rooms[0]!, accessProblem: true, cleanliness: 80, upgradeLevel: 2 as const, upgradeMaxLevel: 5 };
    const props = { ...fixture(describeMobileRoom(room, { x: 33, y: 30 })), facility: { ...facility, rooms: [room] },
      ownedRooms: [{ id: room.instanceId, roomDefinitionId: room.definitionId, displayName: room.displayName,
        category: "diagnostics" as const, upgradeLevel: 2, maxUpgradeLevel: 5, upgradeable: true, canUpgrade: true,
        nextUpgradeCostLabel: "$200", benefitSummary: "Existing benefit", accessProblem: true }] };
    const markup = renderToStaticMarkup(<MobileInspectorSheet {...props} />);
    for (const text of ["No access yet", "Cleanliness: 80%", "Level 2 of 5", "Next upgrade: $200", "Existing benefit", "Room actions"]) expect(markup).toContain(text);
    expect(markup).not.toContain("Walk here");
  });
  it("renders a patient's canonical activity and chart action, permanent doors and vanished targets", () => {
    const patient = { instanceId: "patient", displayName: "Rowan", status: "waiting" as const, appearance: facility.founder.appearance };
    const view = { ...facility, patients: [patient] };
    const selection = describeMobileCharacter({ kind: "patient", id: "patient" }, view, () => ({ name: "Rowan · Patient", activity: "Waiting for clinician" }))!;
    expect(renderToStaticMarkup(<MobileInspectorSheet {...fixture(selection)} facility={view} onDescribeCharacter={() => ({ name: "Rowan · Patient", activity: "Waiting for clinician" })} onOpenPatient={vi.fn()} />)).toContain("Open patient chart");
    const door = initial.doors![0]!;
    expect(renderToStaticMarkup(<MobileInspectorSheet {...fixture({ kind: "door", door, room: initial.rooms[0]! })} />)).toContain("Permanent public entrance");
    expect(renderToStaticMarkup(<MobileInspectorSheet {...fixture(selection)} facility={{ ...view, patients: [] }} onDescribeCharacter={() => null} />)).toContain("This target has left the map.");
  });
  it("executes praise and room actions through the provided callbacks without a redundant walk button", async () => {
    const doc = new TestDocument(); const element = doc.createElement("div"); doc.body.appendChild(element);
    const browser = Object.assign(new EventTarget(), { document: doc, HTMLElement: TestElement, HTMLIFrameElement: class extends TestElement {} });
    doc.defaultView = browser; vi.stubGlobal("window", browser); vi.stubGlobal("document", doc);
    vi.stubGlobal("HTMLElement", TestElement); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const { createRoot } = await import("react-dom/client"); const root = createRoot(element as unknown as HTMLElement);
    const click = async (label: string) => {
      const button = findTestElement(element, (node) => node.tagName === "BUTTON" && node.textContent === label)!;
      expect(button).toBeDefined(); await act(async () => { (testElementProps(button).onClick as () => void)(); });
    };
    let props = fixture(describeMobileCharacter({ kind: "staff", id: "employee" }, facility, description, true)!);
    await act(async () => root.render(<MobileInspectorSheet {...props} />)); await click("Praise Employee");
    expect(props.onPraiseEmployee).toHaveBeenCalledExactlyOnceWith("employee"); expect(props.onClose).toHaveBeenCalledOnce();
    const destination = { x: 33, y: 30 }; props = fixture(describeMobileRoom(initial.rooms[0]!, destination));
    await act(async () => root.render(<MobileInspectorSheet {...props} />));
    expect(element.textContent).not.toContain("Walk here"); await click("Room actions");
    expect(props.onOpenRoom).toHaveBeenCalledExactlyOnceWith(initial.rooms[0]!.instanceId);
    await act(async () => root.unmount());
  });
});
