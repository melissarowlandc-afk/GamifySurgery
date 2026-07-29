import { useEffect, useMemo, useState } from "react";
import type { CardinalDirection } from "@gamify-surgery/game-domain";
import type {
  RoomBuildOptionView,
  SelectedRoomBuildView,
} from "./types";
import { PixelIcon } from "./PixelIcon";
import type { PixelIconName } from "../art/iconArt";

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
  onRotateSelectedRoom: () => void;
  onBeginMoveSelectedRoom: () => void;
  onPlaceDoorForSelectedRoom: (
    side: CardinalDirection,
    offset: number,
  ) => void;
  onRemoveDoor: (doorId: string) => void;
  onUndoBuildAction: () => void;
  undoCount: number;
  exitBlockedReason: string | null;
  exitBlockedIssues: string[];
  upgradeRequestRoomId: string | null;
  onUpgradeRequestHandled: () => void;
}

function roomIconName(roomDefinitionId: string): PixelIconName {
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
    case "room.hallway":
      return "hallway";
    default:
      return "examination";
  }
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
  onRotateSelectedRoom,
  onBeginMoveSelectedRoom,
  onPlaceDoorForSelectedRoom,
  onRemoveDoor,
  onUndoBuildAction,
  undoCount,
  exitBlockedReason,
  exitBlockedIssues,
  upgradeRequestRoomId,
  onUpgradeRequestHandled,
}: BuildPanelProps) {
  const [doorTool, setDoorTool] = useState<
    "place" | "remove" | null
  >(null);
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
  const rotateEnabled =
    Boolean(selectedPlacement && !selectedPlacementIsHallway) ||
    Boolean(selectedRoom?.canRotate);

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

  return (
    <>
      <section className="panel build-panel build-mode-panel">
        <div className="panel-heading">
          <span>Construction tools</span>
          <small>Time paused</small>
        </div>

        <div className="build-cash-banner">
          <span>Available money</span>
          <strong>{cashLabel}</strong>
        </div>

        <nav
          className="build-tool-toolbar"
          aria-label="Build Mode tools"
        >
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              if (selectedPlacement && !selectedPlacementIsHallway) {
                onRotatePlacement();
              } else {
                onRotateSelectedRoom();
              }
            }}
            disabled={!rotateEnabled}
          >
            Rotate
          </button>
          <button
            className={`button button-secondary${
              selectedPlacementIsHallway ? " is-active" : ""
            }`}
            type="button"
            onClick={() =>
              selectedPlacementIsHallway
                ? onCancelPlacement()
                : onSelectRoom("room.hallway")
            }
            disabled={
              !hallwayOption ||
              (!hallwayOption.enabled && !selectedPlacementIsHallway)
            }
            title={hallwayOption?.blockedReason}
          >
            Build Hallway
            {hallwayOption ? ` · ${hallwayOption.costLabel}` : ""}
          </button>
          <button
            className={`button button-secondary${
              doorTool === "place" ? " is-active" : ""
            }`}
            type="button"
            onClick={() =>
              setDoorTool((current) =>
                current === "place" ? null : "place",
              )
            }
            disabled={!selectedRoom}
          >
            Place Door · $0
          </button>
          <button
            className={`button button-secondary${
              doorTool === "remove" ? " is-active" : ""
            }`}
            type="button"
            onClick={() =>
              setDoorTool((current) =>
                current === "remove" ? null : "remove",
              )
            }
            disabled={
              !selectedRoom ||
              !selectedRoom.doors.some((door) => door.removable)
            }
          >
            Remove Door
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onUndoBuildAction}
            disabled={undoCount === 0}
          >
            Undo ({undoCount})
          </button>
          <button
            className="button button-primary build-mode-toggle mode-toggle-button is-active"
            type="button"
            onClick={requestExit}
            aria-label="Exit Build Mode"
          >
            Done / Save and Return
          </button>
        </nav>

        {exitIssues.length > 0 ? (
          <p className="blocked-reason build-exit-reason" role="alert">
            Layout needs attention. Select Done / Save and Return for
            the complete list.
          </p>
        ) : null}

        {selectedPlacement ? (
          <div className="build-tool-controls">
            <strong>Placing {selectedPlacement.displayName}</strong>
            <span className="placement-orientation">
              {selectedPlacementIsHallway
                ? "Hallway footprint"
                : `Orientation: ${placementOrientation}°`}
            </span>
            <p>
              {selectedPlacementIsHallway
                ? "Move over the map to preview the hallway tile."
                : "Place the room footprint first, then use Place Door on a valid wall."}
            </p>
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancelPlacement}
            >
              Cancel tool
            </button>
          </div>
        ) : null}

        {selectedRoom ? (
          <div className="selected-room-inspector">
            <span className="eyebrow">Selected room</span>
            <h2>{selectedRoom.displayName}</h2>
            <p>Upgrade Level {selectedRoom.upgradeLevel}</p>
            {selectedRoom.blockedReason ? (
              <p className="blocked-reason">{selectedRoom.blockedReason}</p>
            ) : null}
            <div className="selected-room-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={onBeginMoveSelectedRoom}
                disabled={!selectedRoom.canMove}
              >
                Move
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setUpgradeDialogOpen(true)}
                disabled={selectedRoom.nextUpgradeLevel === undefined}
              >
                {selectedRoom.upgradeCostLabel
                  ? `Upgrade · ${selectedRoom.upgradeCostLabel}`
                  : "Maximum upgrade"}
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={onSellSelectedRoom}
                disabled={!selectedRoom.canSell}
              >
                Sell
                {selectedRoom.resaleValueLabel
                  ? ` · ${selectedRoom.resaleValueLabel}`
                  : ""}
              </button>
            </div>

            {doorTool ? (
              <div className="door-tool" data-door-tool={doorTool}>
                <h3>
                  {doorTool === "place"
                    ? "Place Door · $0"
                    : "Remove Door"}
                </h3>
                <p>
                  {doorTool === "place"
                    ? "Choose a valid wall position. Imaging rooms need separate patient and control-room doors."
                    : "Choose a removable door to convert its opening back into a wall."}
                </p>
                {doorTool === "place" ? (
                  <div className="door-slot-grid">
                    {selectedRoom.doorSlots.map((slot) => (
                      <button
                        className="button button-secondary"
                        type="button"
                        key={slot.id}
                        disabled={!slot.enabled}
                        title={slot.blockedReason}
                        onClick={() =>
                          onPlaceDoorForSelectedRoom(
                            slot.side,
                            slot.offset,
                          )
                        }
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="door-remove-list">
                    {selectedRoom.doors.some(
                      (door) => door.removable,
                    ) ? (
                      selectedRoom.doors
                        .filter((door) => door.removable)
                        .map((door) => (
                          <button
                            className="button button-danger"
                            type="button"
                            key={door.id}
                            onClick={() => onRemoveDoor(door.id)}
                          >
                            Remove {door.label}
                          </button>
                        ))
                    ) : (
                      <p>No removable doors remain.</p>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="build-selection-hint">
            Select a room on the map to move, upgrade, sell, or edit
            its doors.
          </p>
        )}

        <div className="build-section">
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
                      : onSelectRoom(room.id)
                  }
                  title={room.blockedReason}
                >
                  <PixelIcon
                    name={roomIconName(room.id)}
                    className="pixel-room-icon"
                  />
                  <span>
                    <strong>{room.displayName}</strong>
                    <small>
                      {room.footprintLabel} · {room.costLabel}
                    </small>
                    <small>{room.upkeepLabel}</small>
                    {room.blockedReason ? (
                      <small className="blocked-reason">
                        {room.blockedReason}
                      </small>
                    ) : null}
                  </span>
                  <span>{room.selected ? "Selected" : "Place"}</span>
                </button>
              ))}
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
                Confirm Upgrade · {selectedRoom.upgradeCostLabel}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {invalidDialogOpen ? (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirm-dialog invalid-layout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invalid-layout-title"
          >
            <span className="eyebrow">Layout cannot be saved yet</span>
            <h2 id="invalid-layout-title">Fix these access problems</h2>
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
        </div>
      ) : null}
    </>
  );
}
