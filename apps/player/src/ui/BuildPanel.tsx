import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type {
  RoomBuildOptionView,
  SelectedRoomBuildView,
} from "./types";
import { PixelIcon } from "./PixelIcon";
import type { PixelIconName } from "../art/iconArt";
import { getApprovedPlacementOrientations } from "../facility/roomVisualLayout";

type BuildDoorTool = "place" | "remove" | null;

interface BuildPanelProps {
  buildMode: boolean;
  cashLabel: string;
  roomOptions: RoomBuildOptionView[];
  selectedRoom: SelectedRoomBuildView | null;
  placementOrientation: number;
  onEnterBuildMode: () => void;
  onExitBuildMode: () => void;
  onSelectRoom: (roomDefinitionId: string) => void;
  onCancelPlacement: () => void;
  onRotatePlacement: () => void;
  onUpgradeSelectedRoom: () => void;
  onSellSelectedRoom: () => void;
  buildDoorTool: BuildDoorTool;
  onBuildDoorToolChange: (tool: BuildDoorTool) => void;
  onUndoBuildAction: () => void;
  undoCount: number;
  exitBlockedReason: string | null;
  exitBlockedIssues: string[];
  upgradeRequestRoomId: string | null;
  onUpgradeRequestHandled: () => void;
}

export function roomIconName(roomDefinitionId: string): PixelIconName {
  switch (roomDefinitionId) {
    case "room.front_desk":
      return "frontDesk";
    case "room.waiting":
      return "waiting";
    case "room.examination":
      return "examination";
    case "room.bathroom":
      return "bathroom";
    case "room.xray":
      return "xray";
    case "room.imaging_control":
      return "imagingControl";
    case "room.minor_procedure":
      return "minorProcedure";
    case "room.ultrasound":
      return "ultrasound";
    case "room.ct":
      return "ct";
    case "room.phlebotomy":
      return "phlebotomy";
    case "room.evs_closet":
      return "evsCloset";
    case "room.endoscopy":
      return "endoscopy";
    case "room.periop_recovery":
      return "periopRecovery";
    case "room.training":
      return "training";
    case "room.coffee_kiosk":
      return "coffeeKiosk";
    case "room.glp1_telehealth_suite":
      return "glp1Suite";
    case "room.hallway":
      return "hallway";
    default:
      return "examination";
  }
}

function compactUpgradeImprovement(improvement: string): string {
  const fixtures = improvement.match(
    /fixed fixtures advance to Level (\d+)/i,
  );
  if (fixtures) {
    return `Fixtures → L${fixtures[1]}`;
  }
  const capacity = improvement.match(/workload capacity \+(\d+)/i);
  if (capacity) {
    return `Capacity +${capacity[1]}`;
  }
  const service = improvement.match(/service time (\d+)% faster/i);
  if (service) {
    return `Service ${service[1]}% faster`;
  }
  const satisfaction = improvement.match(/satisfaction \+(\d+)/i);
  if (satisfaction) {
    return `Satisfaction +${satisfaction[1]}`;
  }
  const upkeep = improvement.match(/Hourly upkeep \+\$(\d+)/i);
  if (upkeep) {
    return `Upkeep +$${upkeep[1]}/hr`;
  }
  return improvement;
}

export function BuildPanel({
  buildMode,
  cashLabel,
  roomOptions,
  selectedRoom,
  placementOrientation,
  onEnterBuildMode,
  onExitBuildMode,
  onSelectRoom,
  onCancelPlacement,
  onRotatePlacement,
  onUpgradeSelectedRoom,
  onSellSelectedRoom,
  buildDoorTool,
  onBuildDoorToolChange,
  onUndoBuildAction,
  undoCount,
  exitBlockedReason,
  exitBlockedIssues,
  upgradeRequestRoomId,
  onUpgradeRequestHandled,
}: BuildPanelProps) {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);

  useEffect(() => {
    if (
      upgradeRequestRoomId &&
      selectedRoom?.id === upgradeRequestRoomId
    ) {
      setUpgradeDialogOpen(true);
    }
  }, [selectedRoom?.id, upgradeRequestRoomId]);

  useEffect(() => {
    if (exitBlockedIssues.length === 0 && !exitBlockedReason) {
      setInvalidDialogOpen(false);
    }
  }, [exitBlockedIssues, exitBlockedReason]);

  const exitIssues = useMemo(
    () =>
      exitBlockedIssues.length > 0
        ? exitBlockedIssues
        : exitBlockedReason
          ? [exitBlockedReason]
          : [],
    [exitBlockedIssues, exitBlockedReason],
  );

  if (!buildMode) {
    return (
      <button
        className="button button-primary build-mode-trigger build-mode-toggle mode-toggle-button"
        data-tutorial-anchor="enter-build-mode"
        type="button"
        onClick={onEnterBuildMode}
        aria-label="Enter Build Mode"
      >
        Enter Build Mode
        <small>Pauses the clinic while you remodel</small>
      </button>
    );
  }

  const selectedPlacement = roomOptions.find((room) => room.selected);
  const selectedPlacementIsHallway =
    selectedPlacement?.id === "room.hallway";
  const hallwayOption = roomOptions.find(
    (room) => room.id === "room.hallway",
  );
  const rotateEnabled = Boolean(
    selectedPlacement &&
      getApprovedPlacementOrientations(selectedPlacement.id).length > 1,
  );

  const closeUpgradeDialog = () => {
    setUpgradeDialogOpen(false);
    onUpgradeRequestHandled();
  };
  const requestExit = () => {
    if (exitIssues.length > 0) {
      setInvalidDialogOpen(true);
      return;
    }
    onExitBuildMode();
  };
  const selectDoorTool = (tool: Exclude<BuildDoorTool, null>) => {
    if (selectedPlacement) {
      onCancelPlacement();
    }
    onBuildDoorToolChange(buildDoorTool === tool ? null : tool);
  };
  const selectPlacement = (roomDefinitionId: string) => {
    if (buildDoorTool) {
      onBuildDoorToolChange(null);
    }
    onSelectRoom(roomDefinitionId);
  };

  return (
    <>
      <section className="panel build-panel build-mode-panel">
        <header className="build-mode-topbar">
          <strong className="build-mode-title">Build Mode</strong>
          <span className="build-mode-money">
            <span>Available Money</span>
            <strong>{cashLabel}</strong>
          </span>
          <div className="build-mode-topbar-actions">
            <button
              className="text-button build-undo-button"
              type="button"
              onClick={onUndoBuildAction}
              disabled={undoCount === 0}
            >
              Undo
            </button>
            <button
              className="button button-primary build-done-button"
              data-tutorial-anchor="build-done"
              type="button"
              onClick={requestExit}
              aria-label="Done / Save"
            >
              Done / Save
            </button>
          </div>
        </header>

        <nav
          className="build-tool-toolbar"
          aria-label="Build Mode tools"
        >
          <strong className="build-tool-toolbar-label">
            Construction Tools
          </strong>
          <button
            className="button button-secondary"
            type="button"
            onClick={onRotatePlacement}
            disabled={!rotateEnabled}
          >
            Rotate
          </button>
          <button
            className={`button button-secondary${
              buildDoorTool === "place" ? " is-active" : ""
            }`}
            data-build-tool="place-door"
            data-tutorial-anchor="place-door"
            type="button"
            onClick={() => selectDoorTool("place")}
            aria-pressed={buildDoorTool === "place"}
          >
            Place Door
          </button>
          <button
            className={`button button-secondary${
              buildDoorTool === "remove" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => selectDoorTool("remove")}
            aria-pressed={buildDoorTool === "remove"}
          >
            Remove Door
          </button>
          <button
            className={`button button-secondary${
              selectedPlacementIsHallway ? " is-active" : ""
            }`}
            type="button"
            onClick={() => {
              if (buildDoorTool) {
                onBuildDoorToolChange(null);
              }
              if (selectedPlacementIsHallway) {
                onCancelPlacement();
              } else {
                onSelectRoom("room.hallway");
              }
            }}
            disabled={
              !hallwayOption ||
              (!hallwayOption.enabled && !selectedPlacementIsHallway)
            }
            title={hallwayOption?.blockedReason}
            aria-pressed={selectedPlacementIsHallway}
          >
            Build Hallway
            {hallwayOption ? ` - ${hallwayOption.costLabel}` : ""}
          </button>
        </nav>

        {exitIssues.length > 0 ? (
          <p className="blocked-reason build-exit-reason" role="alert">
            Layout needs attention. Select Done / Save for the complete
            list.
          </p>
        ) : null}

        {selectedPlacement ? (
          <div className="build-placement-status" role="status">
            <span>
              Placing <strong>{selectedPlacement.displayName}</strong>
            </span>
            <span className="placement-orientation">
              {selectedPlacementIsHallway
                ? "Hallway footprint"
                : `Orientation ${placementOrientation}°`}
            </span>
            <button
              className="text-button"
              type="button"
              onClick={onCancelPlacement}
            >
              Cancel
            </button>
          </div>
        ) : null}

        <div
          className={`build-catalog-layout${
            selectedRoom ? " has-room-inspector" : ""
          }`}
        >
          {selectedRoom ? (
            <aside className="selected-room-inspector">
              <span className="eyebrow">Selected Room</span>
              <h2>{selectedRoom.displayName}</h2>
              <p className="selected-room-level">
                Upgrade Level {selectedRoom.upgradeLevel}
              </p>
              {selectedRoom.blockedReason ? (
                <p className="blocked-reason">
                  {selectedRoom.blockedReason}
                </p>
              ) : null}
              <div className="selected-room-primary-actions">
                <button
                  className="button button-secondary selected-room-upgrade"
                  type="button"
                  onClick={() => setUpgradeDialogOpen(true)}
                  disabled={selectedRoom.nextUpgradeLevel === undefined}
                >
                  <strong>
                    {selectedRoom.upgradeCostLabel
                      ? `Upgrade - ${selectedRoom.upgradeCostLabel}`
                      : "Maximum Upgrade"}
                  </strong>
                  {selectedRoom.upgradeImprovements.length > 0 ? (
                    <small>
                      {selectedRoom.upgradeImprovements
                        .map(compactUpgradeImprovement)
                        .join(" · ")}
                    </small>
                  ) : null}
                </button>
                <button
                  className="button button-danger"
                  type="button"
                  onClick={onSellSelectedRoom}
                  disabled={!selectedRoom.canSell}
                >
                  Sell
                  {selectedRoom.resaleValueLabel
                    ? ` - ${selectedRoom.resaleValueLabel}`
                    : ""}
                </button>
              </div>
            </aside>
          ) : null}

          <div className="build-section build-room-catalog">
            <h2>Rooms</h2>
            <div className="build-option-list">
              {roomOptions
                .filter((room) => room.id !== "room.hallway")
                .map((room) => (
                  <button
                    className={`build-card${
                      room.selected ? " is-selected" : ""
                    }`}
                    type="button"
                    key={room.id}
                    data-room-definition-id={room.id}
                    disabled={!room.enabled && !room.selected}
                    onClick={() =>
                      room.selected
                        ? onCancelPlacement()
                        : selectPlacement(room.id)
                    }
                    title={room.blockedReason}
                    aria-pressed={room.selected}
                  >
                    <PixelIcon
                      name={roomIconName(room.id)}
                      className="pixel-room-icon"
                    />
                    <span>
                      <strong>{room.displayName}</strong>
                      <small>
                        {room.footprintLabel} - {room.costLabel}
                      </small>
                      <small>{room.upkeepLabel}</small>
                      {room.blockedReason ? (
                        <small className="blocked-reason">
                          {room.blockedReason}
                        </small>
                      ) : null}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {upgradeDialogOpen && selectedRoom ? (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog room-upgrade-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-upgrade-title"
          >
            <span className="eyebrow">Confirm room upgrade</span>
            <h2 id="room-upgrade-title">{selectedRoom.displayName}</h2>
            <p className="upgrade-level-change">
              Level {selectedRoom.upgradeLevel} → Level{" "}
              {selectedRoom.nextUpgradeLevel}
            </p>
            <p>
              Exact cost: <strong>{selectedRoom.upgradeCostLabel}</strong>
            </p>
            <h3>Improvements</h3>
            <ul>
              {selectedRoom.upgradeImprovements.map((improvement) => (
                <li key={improvement}>{improvement}</li>
              ))}
            </ul>
            {!selectedRoom.canUpgrade ? (
              <p className="blocked-reason">
                This upgrade is not currently affordable.
              </p>
            ) : null}
            <div className="dialog-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={closeUpgradeDialog}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={!selectedRoom.canUpgrade}
                onClick={() => {
                  onUpgradeSelectedRoom();
                  closeUpgradeDialog();
                }}
              >
                Confirm Upgrade - {selectedRoom.upgradeCostLabel}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {invalidDialogOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="dialog-backdrop invalid-layout-backdrop"
              role="presentation"
            >
              <section
                className="confirm-dialog invalid-layout-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="invalid-layout-title"
              >
                <span className="eyebrow">
                  Layout cannot be saved yet
                </span>
                <h2 id="invalid-layout-title">
                  Fix these access problems
                </h2>
                <ul>
                  {exitIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
                <p>
                  Clinic operations remain paused until every problem is
                  corrected.
                </p>
                <div className="dialog-actions">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => setInvalidDialogOpen(false)}
                  >
                    Continue Renovating
                  </button>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
