import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BuildPanel } from "./BuildPanel";
import type {
  RoomBuildOptionView,
  SelectedRoomBuildView,
} from "./types";

const noop = () => undefined;

const roomOptions: RoomBuildOptionView[] = [
  {
    id: "room.hallway",
    displayName: "Hallway",
    footprintLabel: "1 × 1 tiles",
    costLabel: "$30",
    upkeepLabel: "$0 upkeep / hr · 0 built",
    owned: false,
    selected: false,
    enabled: true,
  },
  {
    id: "room.examination",
    displayName: "Examination Room",
    footprintLabel: "3 × 2 tiles",
    costLabel: "$130",
    upkeepLabel: "$12 upkeep / hr · 1 built",
    owned: true,
    selected: false,
    enabled: true,
  },
];

const selectedRoom: SelectedRoomBuildView = {
  id: "room.exam.1",
  displayName: "Examination Room",
  upgradeLevel: 1,
  nextUpgradeLevel: 2,
  upgradeCostLabel: "$90",
  upgradeImprovements: [
    "Room finish and fixed fixtures advance to Level 2.",
    "Room service time 5% faster.",
  ],
  resaleValueLabel: "$32 refund",
  canUpgrade: true,
  canSell: true,
  canMove: true,
  canRotate: true,
  doors: [
    {
      id: "door.exam",
      label: "South wall door",
      removable: true,
    },
  ],
  doorSlots: [
    {
      id: "west.0",
      side: "west",
      offset: 0,
      label: "West wall · top",
      enabled: true,
    },
  ],
};

describe("Build Mode toolbar", () => {
  it("exposes named tools and keeps Done clickable for invalid layouts", () => {
    const markup = renderToStaticMarkup(
      <BuildPanel
        buildMode
        cashLabel="$500"
        roomOptions={roomOptions}
        selectedRoom={selectedRoom}
        placementOrientation={0}
        onEnterBuildMode={noop}
        onExitBuildMode={noop}
        onSelectRoom={noop}
        onCancelPlacement={noop}
        onRotatePlacement={noop}
        onUpgradeSelectedRoom={noop}
        onSellSelectedRoom={noop}
        onRotateSelectedRoom={noop}
        onBeginMoveSelectedRoom={noop}
        onPlaceDoorForSelectedRoom={noop}
        onRemoveDoor={noop}
        onUndoBuildAction={noop}
        undoCount={4}
        exitBlockedReason="Examination Room needs a reachable door."
        exitBlockedIssues={[
          "Examination Room needs a reachable door.",
          "X-ray Room requires a patient-facing door.",
        ]}
        upgradeRequestRoomId={null}
        onUpgradeRequestHandled={noop}
      />,
    );

    expect(markup).toContain('aria-label="Build Mode tools"');
    expect(markup).toContain("Rotate");
    expect(markup).toContain("Build Hallway · $30");
    expect(markup).toContain("Place Door · $0");
    expect(markup).toContain("Remove Door");
    expect(markup).toContain("Undo (4)");
    expect(markup).toContain("Done / Save and Return");
    expect(markup).not.toMatch(
      /aria-label="Exit Build Mode"[^>]*disabled/,
    );
    expect(markup).not.toContain("West 1/3");
  });

  it("uses plain-language wall positions instead of fractional slots", () => {
    const markup = renderToStaticMarkup(
      <BuildPanel
        buildMode
        cashLabel="$500"
        roomOptions={roomOptions}
        selectedRoom={selectedRoom}
        placementOrientation={0}
        onEnterBuildMode={noop}
        onExitBuildMode={noop}
        onSelectRoom={noop}
        onCancelPlacement={noop}
        onRotatePlacement={noop}
        onUpgradeSelectedRoom={noop}
        onSellSelectedRoom={noop}
        onRotateSelectedRoom={noop}
        onBeginMoveSelectedRoom={noop}
        onPlaceDoorForSelectedRoom={noop}
        onRemoveDoor={noop}
        onUndoBuildAction={noop}
        undoCount={0}
        exitBlockedReason={null}
        exitBlockedIssues={[]}
        upgradeRequestRoomId={null}
        onUpgradeRequestHandled={noop}
      />,
    );

    expect(markup).toContain("Upgrade · $90");
    expect(markup).not.toContain("West 1/3");
  });
});
