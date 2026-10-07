import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type {
  EndoscopySetupRequirementView,
  LockedRoomBuildView,
  OwnedRoomBuildView,
  RoomBuildCategoryId,
  RoomBuildOptionView,
} from "./types";
import { PixelIcon } from "./PixelIcon";
import type { PixelIconName } from "../art/iconArt";
import { getApprovedPlacementOrientations } from "../facility/roomVisualLayout";
import {
  ROOM_BUILD_CATEGORIES,
  roomBuildCategory,
  roomBuildSortKey,
} from "../session/buildModePresentation";
import { EndoscopySetupChecklist, RoomLevelStars } from "./RoomActionMenu";

type BuildDoorTool = "place" | "remove" | null;
export type BuildTab = "new" | "my";

interface BuildPanelProps {
  buildMode: boolean;
  showInactiveTrigger?: boolean;
  cashLabel: string;
  roomOptions: RoomBuildOptionView[];
  /** Built rooms for My Rooms, already grouped-sortable and lettered. */
  ownedRooms?: OwnedRoomBuildView[];
  /** Next-level rooms shown greyed out at the end of New Rooms. */
  lockedRoomOptions?: LockedRoomBuildView[];
  /** Room whose map menu is open, highlighted in My Rooms. */
  selectedRoomId?: string | null;
  placementOrientation: number;
  /** Set while an existing room is being moved instead of newly placed. */
  movingRoomName?: string | null;
  onEnterBuildMode: () => void;
  onExitBuildMode: () => void;
  /** Starts placing a new room of this definition. */
  onSelectRoom: (roomDefinitionId: string) => void;
  onCancelPlacement: () => void;
  onRotatePlacement: () => void;
  onUpgradeRoom: (roomId: string) => void;
  /** Selects a built room and opens its menu on the map. */
  onOpenRoom: (roomId: string) => void;
  buildDoorTool: BuildDoorTool;
  onBuildDoorToolChange: (tool: BuildDoorTool) => void;
  onUndoBuildAction: () => void;
  undoCount: number;
  /** What Undo reverses, e.g. "Upgrade Waiting Room A (+$170 back)". */
  undoLabel?: string | null;
  exitBlockedReason: string | null;
  exitBlockedIssues: string[];
  endoscopySetupRequirements?: EndoscopySetupRequirementView[];
  onEndoscopySetupAction: (action: NonNullable<EndoscopySetupRequirementView["action"]>) => void;
  /** Tab shown on first render; Build Mode otherwise opens on New Rooms. */
  initialTab?: BuildTab;
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

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function BuildPanel({
  buildMode,
  showInactiveTrigger = true,
  cashLabel,
  roomOptions,
  ownedRooms = [],
  lockedRoomOptions = [],
  selectedRoomId = null,
  placementOrientation,
  movingRoomName = null,
  onEnterBuildMode,
  onExitBuildMode,
  onSelectRoom,
  onCancelPlacement,
  onRotatePlacement,
  onUpgradeRoom,
  onOpenRoom,
  buildDoorTool,
  onBuildDoorToolChange,
  onUndoBuildAction,
  undoCount,
  undoLabel = null,
  exitBlockedReason,
  exitBlockedIssues,
  endoscopySetupRequirements,
  onEndoscopySetupAction,
  initialTab = "new",
}: BuildPanelProps) {
  const [tab, setTab] = useState<BuildTab>(initialTab);
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [affordableOnly, setAffordableOnly] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Partial<Record<RoomBuildCategoryId, boolean>>
  >({});

  // Each visit to Build Mode starts on New Rooms (the tutorial relies on it).
  useEffect(() => {
    if (buildMode) {
      setTab(initialTab);
    }
  }, [buildMode, initialTab]);

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

  const selectedPlacement = roomOptions.find((room) => room.selected);
  const selectedPlacementIsHallway = selectedPlacement?.id === "room.hallway";
  const rotateEnabled = Boolean(
    selectedPlacement &&
      !movingRoomName &&
      getApprovedPlacementOrientations(selectedPlacement.id).length > 1,
  );

  // R rotates and Esc cancels while placing; Esc also puts the Doors tool down.
  useEffect(() => {
    if (!buildMode || (!selectedPlacement && !buildDoorTool)) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      if (event.key === "Escape") {
        if (selectedPlacement) {
          onCancelPlacement();
        } else {
          onBuildDoorToolChange(null);
        }
        return;
      }
      if ((event.key === "r" || event.key === "R") && rotateEnabled) {
        event.preventDefault();
        onRotatePlacement();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    buildDoorTool,
    buildMode,
    onBuildDoorToolChange,
    onCancelPlacement,
    onRotatePlacement,
    rotateEnabled,
    selectedPlacement,
  ]);

  if (!buildMode) {
    if (!showInactiveTrigger) {
      return null;
    }
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

  const hallwayOption = roomOptions.find((room) => room.id === "room.hallway");

  const requestExit = () => {
    if (exitIssues.length > 0) {
      setInvalidDialogOpen(true);
      return;
    }
    onExitBuildMode();
  };
  const toggleDoorTool = () => {
    if (selectedPlacement) {
      onCancelPlacement();
    }
    onBuildDoorToolChange(buildDoorTool ? null : "place");
  };
  const selectPlacement = (roomDefinitionId: string) => {
    if (buildDoorTool) {
      onBuildDoorToolChange(null);
    }
    onSelectRoom(roomDefinitionId);
  };

  const listedRooms = roomOptions.filter((room) => room.id !== "room.hallway");
  const buildableRooms = listedRooms.filter((room) => !room.atMaximum || room.selected);
  const maximumRooms = listedRooms.filter((room) => room.atMaximum && !room.selected);
  const upgradesReady = ownedRooms.filter((room) => room.canUpgrade).length;
  const upgradeableRooms = ownedRooms.filter((room) => room.upgradeable);
  const starsEarned = upgradeableRooms.reduce(
    (total, room) => total + room.upgradeLevel,
    0,
  );
  const starsPossible = upgradeableRooms.reduce(
    (total, room) => total + room.maxUpgradeLevel,
    0,
  );

  const renderRoomCard = (room: RoomBuildOptionView) => (
    <button
      className={`build-card${room.selected ? " is-selected" : ""}`}
      type="button"
      key={room.id}
      data-room-definition-id={room.id}
      disabled={!room.enabled && !room.selected}
      onClick={() =>
        room.selected ? onCancelPlacement() : selectPlacement(room.id)
      }
      title={room.blockedReason}
      aria-pressed={room.selected}
    >
      <PixelIcon name={roomIconName(room.id)} className="pixel-room-icon" />
      <span>
        <strong>{room.displayName}</strong>
        {room.purpose ? <small className="build-card-purpose">{room.purpose}</small> : null}
        <small>
          {room.footprintLabel} - {room.costLabel}
        </small>
        <small>{room.upkeepLabel}</small>
        <small>{room.builtCountLabel}</small>
        {room.blockedReason ? (
          <small className="blocked-reason">{room.blockedReason}</small>
        ) : null}
      </span>
    </button>
  );

  const renderNewRooms = () => (
    <>
      {ROOM_BUILD_CATEGORIES.map((category) => {
        const rooms = buildableRooms
          .filter(
            (room) => (room.category ?? roomBuildCategory(room.id)) === category.id,
          )
          .sort((left, right) => roomBuildSortKey(left.id) - roomBuildSortKey(right.id));
        return rooms.length > 0 ? (
          <section className="build-group" key={category.id} aria-label={category.label}>
            <h3 className="build-group-heading">{category.label}</h3>
            <div className="build-option-list">{rooms.map(renderRoomCard)}</div>
          </section>
        ) : null;
      })}
      {lockedRoomOptions.length > 0 ? (
        <section className="build-group build-locked-rooms" aria-label="Rooms at the next level">
          <h3 className="build-group-heading">
            {lockedRoomOptions[0]!.unlockLabel}
          </h3>
          <div className="build-option-list">
            {lockedRoomOptions.map((room) => (
              <div className="build-card is-locked" key={room.id} aria-disabled="true">
                <PixelIcon name={roomIconName(room.id)} className="pixel-room-icon" />
                <span>
                  <strong>{room.displayName}</strong>
                  {room.purpose ? <small className="build-card-purpose">{room.purpose}</small> : null}
                  <small>
                    {room.costLabel} · {room.unlockLabel}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {maximumRooms.length > 0 ? (
        // Owner request: rooms already built to their limit move into a
        // section that starts collapsed so they don't crowd the list.
        <details className="build-maximum-rooms">
          <summary>Rooms Built at Maximum ({maximumRooms.length})</summary>
          <div className="build-option-list">{maximumRooms.map(renderRoomCard)}</div>
        </details>
      ) : null}
    </>
  );

  const renderOwnedRow = (room: OwnedRoomBuildView, index: number, rooms: OwnedRoomBuildView[]) => {
    const sameTypeCount = ownedRooms.filter(
      (candidate) => candidate.roomDefinitionId === room.roomDefinitionId,
    ).length;
    const firstOfType =
      index === 0 || rooms[index - 1]!.roomDefinitionId !== room.roomDefinitionId;
    return (
      <div
        className={`build-owned-row${sameTypeCount > 1 ? " is-sibling" : ""}${
          sameTypeCount > 1 && firstOfType ? " is-first-sibling" : ""
        }${room.id === selectedRoomId ? " is-selected" : ""}`}
        key={room.id}
        data-room-instance-id={room.id}
      >
        <button
          className="build-owned-name"
          type="button"
          onClick={() => onOpenRoom(room.id)}
        >
          {room.displayName}
        </button>
        {!room.upgradeable ? (
          <span className="build-owned-status is-muted">No upgrades</span>
        ) : room.nextUpgradeCostLabel ? (
          <button
            className={`button ${room.canUpgrade ? "button-primary" : "button-secondary"} build-owned-upgrade`}
            type="button"
            disabled={!room.canUpgrade}
            onClick={() => onUpgradeRoom(room.id)}
            aria-label={`Upgrade ${room.displayName} for ${room.nextUpgradeCostLabel}`}
          >
            Upgrade {room.nextUpgradeCostLabel}
          </button>
        ) : (
          <span className="build-owned-status">MAX</span>
        )}
        <span className="build-owned-detail">
          <RoomLevelStars level={room.upgradeLevel} maxLevel={room.maxUpgradeLevel} />
          {room.accessProblem ? (
            <span className="build-owned-problem">! No access</span>
          ) : room.benefitSummary && room.upgradeable ? (
            <span>{room.benefitSummary}</span>
          ) : null}
        </span>
      </div>
    );
  };

  const renderMyRooms = () => {
    const shown = affordableOnly
      ? ownedRooms.filter((room) => room.canUpgrade)
      : ownedRooms;
    return (
      <>
        <div className="build-owned-summary">
          <span>
            ★ {starsEarned} / {starsPossible} stars
          </span>
          <label className="build-owned-filter">
            <input
              type="checkbox"
              checked={affordableOnly}
              onChange={(event) => setAffordableOnly(event.target.checked)}
            />
            Only affordable upgrades ({upgradesReady})
          </label>
        </div>
        {shown.length === 0 ? (
          <p className="build-empty-note">
            {affordableOnly
              ? "No upgrades are affordable right now."
              : "Rooms you build will be listed here."}
          </p>
        ) : null}
        {ROOM_BUILD_CATEGORIES.map((category) => {
          const rooms = shown.filter((room) => room.category === category.id);
          if (rooms.length === 0) {
            return null;
          }
          const groupRooms = ownedRooms.filter(
            (room) => room.category === category.id && room.upgradeable,
          );
          const groupReady = groupRooms.filter((room) => room.canUpgrade).length;
          const collapsed = collapsedGroups[category.id] === true;
          return (
            <section className="build-group build-owned-group" key={category.id}>
              <button
                className="build-group-toggle"
                type="button"
                aria-expanded={!collapsed}
                onClick={() =>
                  setCollapsedGroups((current) => ({
                    ...current,
                    [category.id]: !collapsed,
                  }))
                }
              >
                <span>{category.label}</span>
                <span className="build-group-stats">
                  {groupReady > 0 ? (
                    <span className="build-ready-badge" title="Affordable upgrades">
                      ▲ {groupReady}
                    </span>
                  ) : null}
                  {groupRooms.length > 0
                    ? `★ ${groupRooms.reduce((total, room) => total + room.upgradeLevel, 0)}/${groupRooms.reduce((total, room) => total + room.maxUpgradeLevel, 0)}`
                    : null}
                </span>
              </button>
              {collapsed ? null : (
                <div className="build-owned-list">
                  {rooms.map((room, index) => renderOwnedRow(room, index, rooms))}
                </div>
              )}
            </section>
          );
        })}
      </>
    );
  };

  return (
    <>
      <section className="panel build-panel build-mode-panel">
        <header className="build-mode-topbar">
          <strong className="build-mode-title">Build Mode</strong>
          {exitIssues.length > 0 ? (
            <button
              className="build-problem-chip"
              type="button"
              onClick={() => setInvalidDialogOpen(true)}
              title="Rooms marked NO ACCESS on the map need a door"
            >
              {exitIssues.length} {exitIssues.length === 1 ? "problem" : "problems"}
            </button>
          ) : null}
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
              title={undoLabel ? `Undo: ${undoLabel}` : undefined}
            >
              {undoLabel ? `Undo: ${undoLabel}` : "Undo"}
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

        <nav className="build-tool-toolbar" aria-label="Build Mode tools">
          <strong className="build-tool-toolbar-label">Tools</strong>
          <button
            className={`button button-secondary${buildDoorTool ? " is-active" : ""}`}
            data-build-tool="place-door"
            data-tutorial-anchor="place-door"
            type="button"
            onClick={toggleDoorTool}
            aria-pressed={Boolean(buildDoorTool)}
          >
            Doors
          </button>
          <button
            className={`button button-secondary${selectedPlacementIsHallway ? " is-active" : ""}`}
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
          {buildDoorTool ? (
            <span className="build-tool-hint" role="status">
              Click an empty wall to add a door. Click a door to remove it.
              <span className="build-key">Esc</span> to finish.
            </span>
          ) : null}
        </nav>

        {selectedPlacement ? (
          <div className="build-placement-status" role="status">
            <span>
              {movingRoomName ? "Moving" : "Placing"}{" "}
              <strong>{movingRoomName ?? selectedPlacement.displayName}</strong>
              {selectedPlacementIsHallway ? " · click or drag across the map" : ""}
            </span>
            {!selectedPlacementIsHallway && !movingRoomName ? (
              <span className="placement-orientation">
                Orientation {placementOrientation}°
              </span>
            ) : null}
            {rotateEnabled ? (
              <button className="text-button" type="button" onClick={onRotatePlacement}>
                Rotate <span className="build-key">R</span>
              </button>
            ) : null}
            <button className="text-button" type="button" onClick={onCancelPlacement}>
              {selectedPlacementIsHallway ? "Finish" : "Cancel"}{" "}
              <span className="build-key">Esc</span>
            </button>
          </div>
        ) : null}

        {selectedPlacement?.id === "room.endoscopy" && endoscopySetupRequirements ? (
          <EndoscopySetupChecklist
            requirements={endoscopySetupRequirements}
            onAction={onEndoscopySetupAction}
          />
        ) : null}

        <div className="build-tabs" role="tablist" aria-label="Build Mode lists">
          <button
            className="build-tab"
            type="button"
            role="tab"
            id="build-tab-new"
            aria-selected={tab === "new"}
            aria-controls="build-tabpanel-new"
            onClick={() => setTab("new")}
          >
            New Rooms
          </button>
          <button
            className="build-tab"
            type="button"
            role="tab"
            id="build-tab-my"
            aria-selected={tab === "my"}
            aria-controls="build-tabpanel-my"
            onClick={() => setTab("my")}
          >
            My Rooms
            {upgradesReady > 0 ? (
              <span className="build-ready-badge" aria-label={`${upgradesReady} affordable upgrades`}>
                ▲ {upgradesReady}
              </span>
            ) : null}
          </button>
        </div>

        <div
          className="build-section build-room-catalog"
          role="tabpanel"
          id={tab === "new" ? "build-tabpanel-new" : "build-tabpanel-my"}
          aria-labelledby={tab === "new" ? "build-tab-new" : "build-tab-my"}
        >
          {tab === "new" ? renderNewRooms() : renderMyRooms()}
        </div>
      </section>

      {invalidDialogOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="dialog-backdrop invalid-layout-backdrop" role="presentation">
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
                  Rooms marked NO ACCESS on the map need a door. Clinic
                  operations remain paused until every problem is corrected.
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
