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
    costLabel: "$35",
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
};

function renderBuildPanel({
  options = roomOptions,
  room = selectedRoom,
  buildDoorTool = null,
}: {
  options?: RoomBuildOptionView[];
  room?: SelectedRoomBuildView | null;
  buildDoorTool?: "place" | "remove" | null;
} = {}) {
  return renderToStaticMarkup(
    <BuildPanel
      buildMode
      cashLabel="$500"
      roomOptions={options}
      selectedRoom={room}
      placementOrientation={0}
      onEnterBuildMode={noop}
      onExitBuildMode={noop}
      onSelectRoom={noop}
      onCancelPlacement={noop}
      onRotatePlacement={noop}
      onUpgradeSelectedRoom={noop}
      onSellSelectedRoom={noop}
      buildDoorTool={buildDoorTool}
      onBuildDoorToolChange={noop}
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
}

describe("Build Mode toolbar", () => {
  it("uses the condensed header and requested construction-tool order", () => {
    const markup = renderBuildPanel();

    expect(markup).toContain("Build Mode");
    expect(markup).toContain("Available Money");
    expect(markup).toContain("$500");
    expect(markup).toContain(">Undo<");
    expect(markup).not.toContain("Undo (");
    expect(markup).toContain("Done / Save");
    expect(markup).toContain(
      'data-tutorial-anchor="build-done"',
    );
    expect(markup).toContain(
      'data-tutorial-anchor="place-door"',
    );
    expect(markup).toContain('data-build-tool="place-door"');
    expect(markup).not.toContain("and Return");

    const rotateIndex = markup.indexOf(">Rotate<");
    const placeDoorIndex = markup.indexOf(">Place Door<");
    const removeDoorIndex = markup.indexOf(">Remove Door<");
    const hallwayIndex = markup.indexOf("Build Hallway - $35");
    expect(rotateIndex).toBeGreaterThan(-1);
    expect(placeDoorIndex).toBeGreaterThan(rotateIndex);
    expect(removeDoorIndex).toBeGreaterThan(placeDoorIndex);
    expect(hallwayIndex).toBeGreaterThan(removeDoorIndex);
  });

  it("only enables Rotate while a non-hallway room is pending placement", () => {
    const idleMarkup = renderBuildPanel();
    expect(idleMarkup).toMatch(/<button[^>]*disabled=""[^>]*>Rotate<\/button>/);

    const placingMarkup = renderBuildPanel({
      options: roomOptions.map((room) => ({
        ...room,
        selected: room.id === "room.examination",
      })),
    });
    expect(placingMarkup).toMatch(/<button[^>]*>Rotate<\/button>/);
    expect(placingMarkup).not.toMatch(
      /<button[^>]*disabled=""[^>]*>Rotate<\/button>/,
    );

    const hallwayMarkup = renderBuildPanel({
      options: roomOptions.map((room) => ({
        ...room,
        selected: room.id === "room.hallway",
      })),
    });
    expect(hallwayMarkup).toMatch(
      /<button[^>]*aria-pressed="true"[^>]*>Build Hallway - \$35<\/button>/,
    );
    expect(hallwayMarkup).toMatch(
      /<button[^>]*disabled=""[^>]*>Rotate<\/button>/,
    );
  });

  it("renders mutually exclusive door-tool state without wall-position controls", () => {
    const markup = renderBuildPanel({ buildDoorTool: "place" });

    expect(markup).toMatch(
      /aria-pressed="true"[^>]*>Place Door<\/button>/,
    );
    expect(markup).toMatch(
      /aria-pressed="false"[^>]*>Remove Door<\/button>/,
    );
    expect(markup).not.toContain("door-slot-grid");
    expect(markup).not.toContain("West wall");
    expect(markup).not.toContain("North wall");
  });

  it("shows compact selected-room upgrade and resale information beside the catalog", () => {
    const markup = renderBuildPanel();

    expect(markup).toContain("build-catalog-layout has-room-inspector");
    expect(markup).toContain("Examination Room");
    expect(markup).toContain("Upgrade Level 1");
    expect(markup).toContain("Upgrade - $90");
    expect(markup).toContain("Fixtures → L2");
    expect(markup).toContain("Service 5% faster");
    expect(markup).toContain("Sell - $32 refund");
  });

  it("keeps a selected catalog card readable without replacing its text", () => {
    const markup = renderBuildPanel({
      options: roomOptions.map((room) => ({
        ...room,
        selected: room.id === "room.examination",
      })),
    });

    expect(markup).toContain("build-card is-selected");
    expect(markup).toContain("Examination Room");
    expect(markup).toContain("3 × 2 tiles - $130");
    expect(markup).not.toContain(">Selected<");
  });
});
