import type {
  RoomBuildOptionView,
  SelectedRoomBuildView,
} from "./types";

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
}: BuildPanelProps) {
  if (!buildMode) {
    return (
      <button
        className="button button-primary build-mode-trigger"
        type="button"
        onClick={onEnterBuildMode}
      >
        Build Mode
      </button>
    );
  }

  const selectedPlacement = roomOptions.find((room) => room.selected);

  return (
    <section className="panel build-panel build-mode-panel">
      <div className="panel-heading">
        <span>Build Mode</span>
        <small>Facility paused</small>
      </div>

      <div className="build-cash-banner">
        <span>Available money</span>
        <strong>{cashLabel}</strong>
      </div>

      <button
        className="button button-primary button-wide"
        type="button"
        onClick={onExitBuildMode}
      >
        Exit Build Mode
      </button>

      {selectedPlacement ? (
        <div className="build-tool-controls">
          <strong>Placing {selectedPlacement.displayName}</strong>
          <span>Orientation: {placementOrientation}°</span>
          <div>
            <button
              className="button button-secondary"
              type="button"
              onClick={onRotatePlacement}
            >
              Rotate 90°
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancelPlacement}
            >
              Cancel tool
            </button>
          </div>
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
              onClick={onUpgradeSelectedRoom}
              disabled={!selectedRoom.canUpgrade}
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
        </div>
      ) : null}

      <div className="build-section">
        <h2>Rooms &amp; hallways</h2>
        <div className="build-option-list">
          {roomOptions.map((room) => (
            <button
              className={`build-card${room.selected ? " is-selected" : ""}`}
              type="button"
              key={room.id}
              disabled={!room.enabled && !room.selected}
              onClick={() =>
                room.selected ? onCancelPlacement() : onSelectRoom(room.id)
              }
              title={room.blockedReason}
            >
              <span className="pixel-room-icon" aria-hidden="true" />
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
  );
}
