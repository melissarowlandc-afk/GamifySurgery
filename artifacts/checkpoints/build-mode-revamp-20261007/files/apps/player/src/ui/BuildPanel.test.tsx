import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BuildPanel, roomIconName, type BuildTab } from "./BuildPanel";
import { RoomActionMenu } from "./RoomActionMenu";
import { PIXEL_ICONS } from "../art/iconArt";
import type {
  LockedRoomBuildView,
  OwnedRoomBuildView,
  RoomBuildOptionView,
  SelectedRoomBuildView,
} from "./types";

const noop = () => undefined;

const roomOptions: RoomBuildOptionView[] = [
  {
    id: "room.hallway",
    displayName: "Hallway",
    footprintLabel: "1 × 1 tiles",
    costLabel: "$35",
    upkeepLabel: "$0 upkeep / hr",
    builtCountLabel: "0 built · no limit",
    owned: false,
    selected: false,
    enabled: true,
  },
  {
    id: "room.examination",
    displayName: "Examination Room",
    category: "patient",
    purpose: "Where the founder sees each patient.",
    footprintLabel: "3 × 2 tiles",
    costLabel: "$130",
    upkeepLabel: "$12 upkeep / hr",
    builtCountLabel: "1 / 20 built",
    owned: true,
    selected: false,
    enabled: true,
  },
  {
    id: "room.ultrasound",
    displayName: "Ultrasound Room",
    category: "diagnostics",
    footprintLabel: "3 × 3 tiles",
    costLabel: "$950",
    upkeepLabel: "$16 upkeep / hr",
    builtCountLabel: "0 / 1 built",
    owned: false,
    selected: false,
    enabled: true,
  },
];

const ownedRooms: OwnedRoomBuildView[] = [
  {
    id: "room.instance.wait.1",
    roomDefinitionId: "room.waiting",
    displayName: "Waiting Room A",
    category: "patient",
    upgradeLevel: 2,
    maxUpgradeLevel: 5,
    upgradeable: true,
    nextUpgradeCostLabel: "$170",
    canUpgrade: true,
    benefitSummary: "+1 patient satisfaction per completed visit",
    accessProblem: false,
  },
  {
    id: "room.instance.wait.2",
    roomDefinitionId: "room.waiting",
    displayName: "Waiting Room B",
    category: "patient",
    upgradeLevel: 1,
    maxUpgradeLevel: 5,
    upgradeable: true,
    nextUpgradeCostLabel: "$110",
    canUpgrade: false,
    accessProblem: true,
  },
  {
    id: "room.instance.xray",
    roomDefinitionId: "room.xray",
    displayName: "X-ray Room",
    category: "diagnostics",
    upgradeLevel: 5,
    maxUpgradeLevel: 5,
    upgradeable: true,
    canUpgrade: false,
    accessProblem: false,
  },
  {
    id: "room.instance.front_desk",
    roomDefinitionId: "room.front_desk",
    displayName: "Front Desk",
    category: "patient",
    upgradeLevel: 1,
    maxUpgradeLevel: 1,
    upgradeable: false,
    canUpgrade: false,
    accessProblem: false,
  },
];

const lockedRoomOptions: LockedRoomBuildView[] = [
  {
    id: "room.pharmacy",
    displayName: "Pharmacy",
    category: "services",
    purpose: "Pharmacy sales to patients.",
    costLabel: "$1,200",
    unlockLabel: "Unlocks at Facility Level 3",
  },
];

function renderBuildPanel({
  options = roomOptions,
  buildDoorTool = null,
  buildMode = true,
  showInactiveTrigger = true,
  initialTab = "new",
  undoLabel = null,
  movingRoomName = null,
}: {
  options?: RoomBuildOptionView[];
  buildDoorTool?: "place" | "remove" | null;
  buildMode?: boolean;
  showInactiveTrigger?: boolean;
  initialTab?: BuildTab;
  undoLabel?: string | null;
  movingRoomName?: string | null;
} = {}) {
  return renderToStaticMarkup(
    <BuildPanel
      buildMode={buildMode}
      showInactiveTrigger={showInactiveTrigger}
      cashLabel="$500"
      roomOptions={options}
      ownedRooms={ownedRooms}
      lockedRoomOptions={lockedRoomOptions}
      placementOrientation={0}
      movingRoomName={movingRoomName}
      onEnterBuildMode={noop}
      onExitBuildMode={noop}
      onSelectRoom={noop}
      onCancelPlacement={noop}
      onRotatePlacement={noop}
      onUpgradeRoom={noop}
      onOpenRoom={noop}
      buildDoorTool={buildDoorTool}
      onBuildDoorToolChange={noop}
      onUndoBuildAction={noop}
      undoCount={4}
      undoLabel={undoLabel}
      exitBlockedReason="Examination Room needs a reachable door."
      exitBlockedIssues={[
        "Examination Room needs a reachable door.",
        "X-ray Room requires a patient-facing door.",
      ]}
      onEndoscopySetupAction={noop}
      initialTab={initialTab}
    />,
  );
}

describe("Build Mode panel", () => {
  it("moves rooms built to their maximum into a collapsed section", () => {
    const options: RoomBuildOptionView[] = [
      ...roomOptions,
      {
        id: "room.coffee_kiosk",
        displayName: "Coffee Kiosk",
        footprintLabel: "2 × 2 tiles",
        costLabel: "$400",
        upkeepLabel: "$5 upkeep / hr",
        builtCountLabel: "1 / 1 built",
        atMaximum: true,
        owned: true,
        selected: false,
        enabled: false,
        blockedReason: "Maximum 1 built.",
      },
    ];
    const markup = renderBuildPanel({ options });
    const maximum = markup.slice(markup.indexOf('<details class="build-maximum-rooms">'));
    expect(maximum).toContain("Rooms Built at Maximum (1)");
    expect(maximum).toContain("Coffee Kiosk");
    expect(markup).not.toContain('<details class="build-maximum-rooms" open');
    const available = markup.slice(0, markup.indexOf('<details class="build-maximum-rooms">'));
    expect(available).toContain("Examination Room");
    expect(available).not.toContain("Coffee Kiosk");
    expect(renderBuildPanel()).not.toContain("Rooms Built at Maximum");
  });

  it("can omit its inactive trigger when another desk owner is active", () => {
    const visibleMarkup = renderBuildPanel({ buildMode: false });
    const hiddenMarkup = renderBuildPanel({
      buildMode: false,
      showInactiveTrigger: false,
    });

    expect(visibleMarkup).toContain("Enter Build Mode");
    expect(hiddenMarkup).toBe("");
  });

  it("uses explicit, distinct catalog icons for every Level 2 room", () => {
    const levelTwoRoomIds = [
      "room.ultrasound",
      "room.ct",
      "room.phlebotomy",
      "room.evs_closet",
      "room.endoscopy",
      "room.periop_recovery",
      "room.training",
      "room.coffee_kiosk",
      "room.glp1_telehealth_suite",
    ];
    const iconNames = levelTwoRoomIds.map(roomIconName);

    expect(new Set(iconNames).size).toBe(levelTwoRoomIds.length);
    expect(new Set(iconNames.map((iconName) => PIXEL_ICONS[iconName].id)).size).toBe(
      levelTwoRoomIds.length,
    );
    expect(iconNames).not.toContain("examination");
    expect(roomIconName("room.glp1_telehealth_suite")).toBe("glp1Suite");
    for (const iconName of iconNames) {
      expect(PIXEL_ICONS[iconName].cells.length).toBeGreaterThan(0);
    }
  });

  it("shows money, a named Undo, the problem count and Done / Save in the top bar", () => {
    const markup = renderBuildPanel({
      undoLabel: "Upgrade Waiting Room A (+$170 back)",
    });

    expect(markup).toContain("Available Money");
    expect(markup).toContain("$500");
    expect(markup).toContain("Undo: Upgrade Waiting Room A (+$170 back)");
    expect(markup).toContain("2 problems");
    expect(markup).toContain("Done / Save");
    expect(renderBuildPanel()).toContain(">Undo<");
  });

  it("offers one Doors tool and the hallway painter, with Rotate only while placing", () => {
    const idle = renderBuildPanel();
    expect(idle).toContain('data-build-tool="place-door"');
    expect(idle).toContain('data-tutorial-anchor="place-door"');
    expect(idle).toMatch(/aria-pressed="false"[^>]*>Doors<\/button>/);
    expect(idle).not.toContain("Remove Door");
    expect(idle).toContain("Build Hallway - $35");
    expect(idle).not.toContain("Rotate");

    const doors = renderBuildPanel({ buildDoorTool: "place" });
    expect(doors).toMatch(/aria-pressed="true"[^>]*>Doors<\/button>/);
    expect(doors).toContain("Click an empty wall to add a door. Click a door to remove it.");

    const placing = renderBuildPanel({
      options: roomOptions.map((room) =>
        room.id === "room.examination" ? { ...room, selected: true } : room,
      ),
    });
    expect(placing).toContain("Placing <strong>Examination Room</strong>");
    expect(placing).toContain("Cancel");
    expect(placing).toContain(">Esc<");
  });

  it("names the room being moved instead of offering rotation", () => {
    const markup = renderBuildPanel({
      movingRoomName: "Waiting Room B",
      options: roomOptions.map((room) =>
        room.id === "room.examination" ? { ...room, selected: true } : room,
      ),
    });
    expect(markup).toContain("Moving <strong>Waiting Room B</strong>");
    expect(markup).not.toContain("Rotate");
  });

  it("groups New Rooms by purpose and shows next-level rooms as locked", () => {
    const markup = renderBuildPanel();
    const patient = markup.indexOf("Patient areas");
    const diagnostics = markup.indexOf("Diagnostics");
    expect(patient).toBeGreaterThan(-1);
    expect(diagnostics).toBeGreaterThan(patient);
    expect(markup).toContain("Where the founder sees each patient.");
    expect(markup).toContain('data-room-definition-id="room.examination"');
    expect(markup).toContain("Unlocks at Facility Level 3");
    expect(markup).toContain("Pharmacy");
    expect(markup).toContain("build-card is-locked");
    expect(markup).toContain('aria-selected="true"');
  });

  it("groups My Rooms, keeps lettered rooms together and shows stars", () => {
    const markup = renderBuildPanel({ initialTab: "my" });
    expect(markup).toContain("★ 8 / 15 stars");
    expect(markup).toContain("Only affordable upgrades (1)");
    const roomA = markup.indexOf("Waiting Room A");
    const roomB = markup.indexOf("Waiting Room B");
    const xray = markup.indexOf("X-ray Room");
    expect(roomA).toBeGreaterThan(-1);
    expect(roomB).toBeGreaterThan(roomA);
    expect(xray).toBeGreaterThan(roomB);
    expect(markup).toContain("build-owned-row is-sibling is-first-sibling");
    expect(markup).toContain("Upgrade $170");
    expect(markup).toMatch(/disabled=""[^>]*>Upgrade \$110<\/button>/);
    expect(markup).toContain(">MAX<");
    expect(markup).toContain("No upgrades");
    expect(markup).toContain("! No access");
    expect(markup).toContain('aria-label="Level 2 of 5"');
    expect(markup).toContain("▲ 1");
  });

  it("shows the endoscopy setup checklist while placing an endoscopy room", () => {
    const markup = renderToStaticMarkup(
      <BuildPanel
        buildMode
        cashLabel="$500"
        roomOptions={[...roomOptions, { ...roomOptions[1]!, id: "room.endoscopy", displayName: "Endoscopy Room", selected: true }]}
        placementOrientation={0}
        onEnterBuildMode={noop}
        onExitBuildMode={noop}
        onSelectRoom={noop}
        onCancelPlacement={noop}
        onRotatePlacement={noop}
        onUpgradeRoom={noop}
        onOpenRoom={noop}
        buildDoorTool={null}
        onBuildDoorToolChange={noop}
        onUndoBuildAction={noop}
        undoCount={0}
        exitBlockedReason={null}
        exitBlockedIssues={[]}
        onEndoscopySetupAction={noop}
        endoscopySetupRequirements={[{ id: "endoscopy.setup.room.endoscopy", label: "Endoscopy Room", detail: "$1,000 build", met: false }]}
      />,
    );

    expect(markup).toContain("Endoscopy setup requirements");
    expect(markup).toContain("Missing: Endoscopy Room");
  });
});

const selectedRoom: SelectedRoomBuildView = {
  id: "room.instance.wait.1",
  roomDefinitionId: "room.waiting",
  displayName: "Waiting Room A",
  upgradeLevel: 2,
  maxUpgradeLevel: 5,
  upgradeable: true,
  canMove: true,
  benefit: {
    perUpgradeLabel: "+1 patient satisfaction per completed visit",
    totalCaption: "Clinic total",
    currentLabel: "+1",
    nextLabel: "+2",
    note: "Shared by all rooms, up to +3 for the clinic.",
    upkeepLabel: "Upkeep +$1/hr",
  },
  nextUpgradeLevel: 3,
  upgradeCostLabel: "$170",
  upgradeImprovements: [],
  resaleValueLabel: "$175 refund",
  canUpgrade: true,
  canSell: true,
  salePreview: {
    roomId: "room.instance.wait.1",
    roomDefinitionId: "room.waiting",
    dismissedEmployees: [],
    confirmationToken: "token",
  },
};

function renderMenu(room: SelectedRoomBuildView) {
  return renderToStaticMarkup(
    <RoomActionMenu
      room={room}
      anchor={{ x: 40, y: 40, width: 120, height: 80 }}
      containerRef={{ current: null }}
      onUpgrade={noop}
      onMove={noop}
      onDoors={noop}
      onSell={noop}
      onClose={noop}
      onEndoscopySetupAction={noop}
    />,
  );
}

describe("Build Mode room menu", () => {
  it("shows stars, the benefit and a one-click upgrade with Move, Doors and Sell", () => {
    const markup = renderMenu(selectedRoom);
    expect(markup).toContain("Waiting Room A");
    expect(markup).toContain('aria-label="Level 2 of 5"');
    expect(markup).toContain("Level 2 of 5");
    expect(markup).toContain("+1 patient satisfaction per completed visit");
    expect(markup).toContain("Clinic total <b>+1</b>");
    expect(markup).toContain("→ <b>+2</b>");
    expect(markup).toContain("Upkeep +$1/hr");
    expect(markup).toContain("Upgrade to ★3 · $170");
    expect(markup).toContain(">Move<");
    expect(markup).toContain('aria-label="Edit doors for Waiting Room A"');
    expect(markup).toContain("Sell · $175 refund");
    expect(markup).not.toContain("Confirm Upgrade");
  });

  it("explains a shortfall and disables the upgrade", () => {
    const markup = renderMenu({
      ...selectedRoom,
      canUpgrade: false,
      blockedReason: "Need $60 more to upgrade.",
    });
    expect(markup).toMatch(/disabled=""[^>]*>Upgrade to ★3/);
    expect(markup).toContain("Need $60 more to upgrade.");
  });

  it("marks a fully upgraded room without an upgrade button", () => {
    const markup = renderMenu({
      ...selectedRoom,
      upgradeLevel: 5,
      nextUpgradeLevel: undefined,
      upgradeCostLabel: undefined,
      benefit: { perUpgradeLabel: "+1 patient satisfaction per completed visit", totalCaption: "Clinic total", currentLabel: "+3" },
    });
    expect(markup).toContain("Fully upgraded");
    expect(markup).toContain(">MAX<");
    expect(markup).not.toContain("Upgrade to");
  });

  it("shows no stars, Move or Sell for the protected Front Desk", () => {
    const markup = renderMenu({
      ...selectedRoom,
      id: "room.instance.front_desk",
      roomDefinitionId: "room.front_desk",
      displayName: "Front Desk",
      upgradeLevel: 1,
      maxUpgradeLevel: 1,
      upgradeable: false,
      canMove: false,
      canSell: false,
      nextUpgradeLevel: undefined,
      upgradeCostLabel: undefined,
    });
    expect(markup).toContain("The Front Desk is your permanent entrance. It has no upgrades.");
    expect(markup).not.toContain("room-level-star");
    expect(markup).not.toContain(">Move<");
    expect(markup).not.toContain("Sell");
  });

  it("tells the player when a room has no access", () => {
    const markup = renderMenu({ ...selectedRoom, accessProblem: true });
    expect(markup).toContain("No access yet.");
  });
});
