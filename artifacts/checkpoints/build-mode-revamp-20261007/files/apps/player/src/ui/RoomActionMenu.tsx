import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import type {
  EndoscopySetupRequirementView,
  SelectedRoomBuildView,
} from "./types";

type RoomSalePreviewView = NonNullable<SelectedRoomBuildView["salePreview"]>;

export interface RoomMenuAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Same 7x7 star the map draws under Build Mode labels.
const STAR_CELLS: ReadonlyArray<readonly [number, number]> = [
  "...#...",
  "..###..",
  "#######",
  ".#####.",
  "..###..",
  ".##.##.",
  ".#...#.",
].flatMap((row, y) =>
  [...row].flatMap((cell, x) => (cell === "#" ? [[x, y] as const] : [])),
);

/** Ink pixel stars: filled up to the room level, empty up to its maximum. */
export function RoomLevelStars({
  level,
  maxLevel,
  newStarIndex,
  className,
}: {
  level: number;
  maxLevel: number;
  newStarIndex?: number;
  className?: string;
}) {
  if (maxLevel <= 1) {
    return null;
  }
  return (
    <span
      className={`room-level-stars${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={`Level ${level} of ${maxLevel}`}
    >
      {Array.from({ length: maxLevel }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 7 7"
          shapeRendering="crispEdges"
          aria-hidden="true"
          className={`room-level-star${index < level ? " is-filled" : ""}${
            index === newStarIndex ? " is-new" : ""
          }`}
        >
          {STAR_CELLS.map(([x, y]) => (
            <rect key={`${x}.${y}`} x={x} y={y} width={1} height={1} />
          ))}
        </svg>
      ))}
    </span>
  );
}

/** Shared by the placement strip and the room menu (one copy of the checklist). */
export function EndoscopySetupChecklist({
  requirements,
  onAction,
}: {
  requirements: EndoscopySetupRequirementView[];
  onAction: (action: NonNullable<EndoscopySetupRequirementView["action"]>) => void;
}) {
  return (
    <section
      className="endoscopy-setup-guide"
      aria-label="Endoscopy setup requirements"
    >
      <strong>Endoscopy setup requirements</strong>
      {requirements.map((requirement) => (
        <div key={requirement.id}>
          <span>
            {requirement.met ? "Ready" : "Missing"}: {requirement.label} ·{" "}
            {requirement.detail}
          </span>
          {requirement.action ? (
            <button
              className="text-button"
              type="button"
              onClick={() => onAction(requirement.action!)}
            >
              {requirement.action.label}
            </button>
          ) : null}
        </div>
      ))}
    </section>
  );
}

interface RoomActionMenuProps {
  room: SelectedRoomBuildView;
  /** Selected room rectangle in canvas pixels, reported by the map scene. */
  anchor: RoomMenuAnchor | null;
  /** The positioned map host that contains both the canvas and this menu. */
  containerRef: RefObject<HTMLElement | null>;
  onUpgrade: () => void;
  onMove: () => void;
  onDoors: () => void;
  onSell: (roomId: string, saleConfirmationToken?: string) => void;
  onClose: () => void;
  endoscopySetupRequirements?: EndoscopySetupRequirementView[];
  onEndoscopySetupAction: (
    action: NonNullable<EndoscopySetupRequirementView["action"]>,
  ) => void;
}

const MENU_GAP = 10;
const EDGE = 8;
const DOCK_BELOW_WIDTH = 520;

/**
 * Build Mode room menu, opened by clicking a room on the map. It owns the
 * one-click upgrade (Undo refunds it) and the Move / Doors / Sell actions.
 */
export function RoomActionMenu({
  room,
  anchor,
  containerRef,
  onUpgrade,
  onMove,
  onDoors,
  onSell,
  onClose,
  endoscopySetupRequirements,
  onEndoscopySetupAction,
}: RoomActionMenuProps) {
  const menuRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    docked: boolean;
    // A short map scrolls the menu instead of clipping Move / Sell.
    maxHeight: number;
  } | null>(null);
  const [saleDialog, setSaleDialog] = useState<RoomSalePreviewView | null>(
    null,
  );
  const [newStar, setNewStar] = useState<{ roomId: string; index: number } | null>(
    null,
  );
  const [spentFloat, setSpentFloat] = useState<{ key: number; label: string } | null>(
    null,
  );
  const previousLevel = useRef<{ roomId: string; level: number } | null>(null);

  const maxLevel = room.maxUpgradeLevel ?? 1;
  const upgradeable = (room.upgradeable ?? maxLevel > 1) && maxLevel > 1;
  const atMaximum = upgradeable && room.nextUpgradeLevel === undefined;

  // Pop the star that a successful upgrade just filled.
  useEffect(() => {
    const previous = previousLevel.current;
    previousLevel.current = { roomId: room.id, level: room.upgradeLevel };
    if (previous?.roomId === room.id && room.upgradeLevel > previous.level) {
      setNewStar({ roomId: room.id, index: room.upgradeLevel - 1 });
      const timer = window.setTimeout(() => setNewStar(null), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [room.id, room.upgradeLevel]);

  useEffect(() => {
    if (!spentFloat) {
      return;
    }
    const timer = window.setTimeout(() => setSpentFloat(null), 1_000);
    return () => window.clearTimeout(timer);
  }, [spentFloat]);

  useEffect(() => {
    if (
      saleDialog &&
      (saleDialog.roomId !== room.id ||
        room.salePreview?.confirmationToken !== saleDialog.confirmationToken)
    ) {
      setSaleDialog(null);
    }
  }, [room.id, room.salePreview?.confirmationToken, saleDialog]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      if (saleDialog) {
        setSaleDialog(null);
      } else {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, saleDialog]);

  // Sit beside the room, flip to the other side near the map edge, and dock
  // to the bottom of a narrow map instead of covering the room.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) {
      return;
    }
    const containerBox = container.getBoundingClientRect();
    const canvas = container.querySelector(
      '[data-testid="facility-canvas"] canvas',
    );
    const canvasBox = canvas?.getBoundingClientRect() ?? containerBox;
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    if (!anchor || containerBox.width < DOCK_BELOW_WIDTH) {
      setPosition({ left: EDGE, top: EDGE, docked: true, maxHeight: containerBox.height - EDGE * 2 });
      return;
    }
    const offsetX = canvasBox.left - containerBox.left;
    const offsetY = canvasBox.top - containerBox.top;
    const roomLeft = anchor.x + offsetX;
    const roomRight = roomLeft + anchor.width;
    const roomTop = anchor.y + offsetY;
    let left = roomRight + MENU_GAP;
    if (left + width > containerBox.width - EDGE) {
      left = roomLeft - MENU_GAP - width;
    }
    if (left < EDGE) {
      left = Math.min(
        Math.max(EDGE, roomLeft),
        containerBox.width - width - EDGE,
      );
    }
    const top = Math.min(
      Math.max(EDGE, roomTop),
      Math.max(EDGE, containerBox.height - height - EDGE),
    );
    setPosition({
      left: Math.max(EDGE, left),
      top,
      docked: false,
      maxHeight: containerBox.height - EDGE * 2,
    });
  }, [anchor, containerRef, room.id, room.upgradeLevel, room.blockedReason]);

  const upgrade = () => {
    if (!room.canUpgrade) {
      return;
    }
    if (room.upgradeCostLabel) {
      setSpentFloat({ key: Date.now(), label: `−${room.upgradeCostLabel}` });
    }
    onUpgrade();
  };

  const shortfall =
    !room.canUpgrade && room.blockedReason?.startsWith("Need ")
      ? room.blockedReason
      : null;

  return (
    <>
      <section
        ref={menuRef}
        className={`room-action-menu${position?.docked ? " is-docked" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="room-action-menu-title"
        data-room-instance-id={room.id}
        style={
          position && !position.docked
            ? { left: position.left, top: position.top, maxHeight: position.maxHeight }
            : position?.docked
              ? { maxHeight: position.maxHeight }
              : { visibility: "hidden" }
        }
      >
        <button
          className="room-action-menu-close"
          type="button"
          onClick={onClose}
          aria-label="Close room menu"
        >
          ✕
        </button>
        <h2 id="room-action-menu-title">{room.displayName}</h2>
        {upgradeable ? (
          <p className="room-action-menu-level">
            <RoomLevelStars
              level={room.upgradeLevel}
              maxLevel={maxLevel}
              {...(newStar?.roomId === room.id
                ? { newStarIndex: newStar.index }
                : {})}
            />
            <span>
              Level {room.upgradeLevel} of {maxLevel}
              {atMaximum ? <b className="room-max-tag">MAX</b> : null}
            </span>
          </p>
        ) : (
          <p className="room-action-menu-note">
            {room.roomDefinitionId === "room.front_desk"
              ? "The Front Desk is your permanent entrance. It has no upgrades."
              : room.blockedReason ?? "This room has no upgrades."}
          </p>
        )}

        {upgradeable && room.benefit ? (
          <div className="room-upgrade-benefit">
            <span className="room-upgrade-benefit-key">
              {atMaximum ? "Fully upgraded" : "Each upgrade"}
            </span>
            <strong>{room.benefit.perUpgradeLabel}</strong>
            <span className="room-upgrade-benefit-delta">
              {room.benefit.totalCaption ?? "Now"} <b>{room.benefit.currentLabel}</b>
              {room.benefit.nextLabel ? (
                <>
                  {" "}→ <b>{room.benefit.nextLabel}</b>
                </>
              ) : null}
            </span>
            {room.benefit.note ? <small>{room.benefit.note}</small> : null}
            {room.benefit.upkeepLabel ? (
              <small>{room.benefit.upkeepLabel}</small>
            ) : null}
          </div>
        ) : null}

        {upgradeable && !atMaximum && room.upgradeCostLabel ? (
          <div className="room-action-menu-buy">
            <button
              className="button button-primary room-action-menu-upgrade"
              type="button"
              onClick={upgrade}
              disabled={!room.canUpgrade}
            >
              Upgrade to ★{room.nextUpgradeLevel} · {room.upgradeCostLabel}
            </button>
            {spentFloat ? (
              <span key={spentFloat.key} className="room-action-menu-spent" aria-hidden="true">
                {spentFloat.label}
              </span>
            ) : null}
            {shortfall ? (
              <span className="room-action-menu-shortfall">{shortfall}</span>
            ) : null}
          </div>
        ) : null}

        {room.accessProblem ? (
          <p className="room-action-menu-problem" role="status">
            No access yet. Add a door that connects this room to a hallway or
            a reachable room.
          </p>
        ) : null}

        {room.roomDefinitionId === "room.endoscopy" && endoscopySetupRequirements ? (
          <EndoscopySetupChecklist
            requirements={endoscopySetupRequirements}
            onAction={onEndoscopySetupAction}
          />
        ) : null}

        <div className="room-action-menu-footer">
          {room.canMove !== false ? (
            <button className="text-button" type="button" onClick={onMove}>
              Move
            </button>
          ) : null}
          <button
            className="text-button"
            type="button"
            onClick={onDoors}
            data-build-tool="room-doors"
            aria-label={`Edit doors for ${room.displayName}`}
          >
            Doors
          </button>
          {room.canSell && room.salePreview ? (
            <button
              className="text-button room-action-menu-sell"
              type="button"
              onClick={() => setSaleDialog(room.salePreview!)}
            >
              Sell{room.resaleValueLabel ? ` · ${room.resaleValueLabel}` : ""}
            </button>
          ) : null}
        </div>
      </section>

      {saleDialog && typeof document !== "undefined"
        ? createPortal(
            <div className="dialog-backdrop" role="presentation">
              <section
                className="confirm-dialog room-sale-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="room-sale-title"
              >
                <span className="eyebrow">Confirm room sale</span>
                <h2 id="room-sale-title">Sell {room.displayName}?</h2>
                {room.resaleValueLabel ? (
                  <p>
                    Resale value: <strong>{room.resaleValueLabel}</strong>
                  </p>
                ) : null}
                {saleDialog.dismissedEmployees.length > 0 ? (
                  <>
                    <p>Selling this room will result in firing:</p>
                    <ul>
                      {saleDialog.dismissedEmployees.map((employee) => (
                        <li key={employee.id}>{employee.displayName}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No employees will be dismissed.</p>
                )}
                <p>
                  Interrupted tests will wait for another compatible room. If
                  none remains, patients will leave for off-site testing and
                  you will not earn the fee for unfinished testing.
                </p>
                <div className="dialog-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => setSaleDialog(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() => {
                      onSell(saleDialog.roomId, saleDialog.confirmationToken);
                      setSaleDialog(null);
                    }}
                  >
                    Confirm Sale
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
