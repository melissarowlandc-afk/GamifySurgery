import { useEffect, useState } from "react";
import { getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import type { PrototypeShellProps } from "../../shellContract";
import type { OwnedRoomBuildView } from "../../ui/types";
import { roomBuildPurpose } from "../../session/buildModePresentation";
import { EndoscopySetupChecklist } from "../../ui/RoomActionMenu";
import { RoomThumbnail } from "./RoomThumbnail";

function QuickUpgrade({ room, props }: { room: OwnedRoomBuildView; props: PrototypeShellProps }) {
  return room.upgradeable && room.upgradeLevel < room.maxUpgradeLevel && props.onUpgradeRoom
    ? <button type="button" className="mobile-build-quick-upgrade" aria-label={`Upgrade ${room.displayName}`}
      disabled={!props.buildMode || !room.canUpgrade} onClick={() => props.onUpgradeRoom?.(room.id)}>
      Upgrade<small>{room.nextUpgradeCostLabel}</small>
    </button> : null;
}

export function MobileBuildCatalog({ props, onChoose, onOpenRoom, onDoors, onSetup, onPreviewRoom }: {
  props: PrototypeShellProps; onChoose: (id: string) => void; onOpenRoom: (id: string) => void; onDoors: () => void;
  onSetup?: (action: NonNullable<NonNullable<PrototypeShellProps["progression"]["endoscopySetupRequirements"]>[number]["action"]>) => void;
  onPreviewRoom?: (definitionId: string) => void;
}) {
  const [tab, setTab] = useState<"new" | "owned">("new");
  useEffect(() => {
    if (props.tutorialStep?.target === "exam-room-option") setTab("new");
    if (props.tutorialStep?.target === "room-selection") setTab("owned");
  }, [props.tutorialStep?.id, props.tutorialStep?.target]);
  const options = new Map(props.roomOptions.map(option => [option.id, option]));
  const hallway = options.get("room.hallway");
  const prestigeDefinitions = new Set(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.unlockFacilityLevel === 5).map(room => room.id));
  const prestigeKeys = tab === "new" ? prestigeDefinitions : new Set((props.ownedRooms ?? []).filter(room => prestigeDefinitions.has(room.roomDefinitionId)).map(room => room.id));
  const cards = tab === "new" ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions
        .filter(definition => definition.buildable && definition.constructionCost > 0 && definition.kind !== "hallway" &&
          (definition.unlockFacilityLevel <= 4 || props.facility.levelFiveRoomArt === true))
        .map(definition => {
          const option = options.get(definition.id);
          const built = props.facility.rooms.filter(room => room.definitionId === definition.id).length;
          const reason = option?.blockedReason ?? (!option ? `Unlocks at Level ${definition.unlockFacilityLevel}.` : null);
          if (props.facility.levelFiveRoomArt && definition.unlockFacilityLevel === 5) return <button
            type="button" className="mobile-prestige-build-tile" key={definition.id} data-build-room-option={definition.id}
            aria-label={`Choose ${definition.displayName}`} title={option?.purpose ?? roomBuildPurpose(definition.id)}
            disabled={!props.buildMode || !option?.enabled} onClick={() => onChoose(definition.id)}>
            <RoomThumbnail definitionId={definition.id} onVisible={onPreviewRoom} />
            <strong>{definition.displayName}</strong><span>{option?.footprintLabel ?? `${definition.width} × ${definition.height}`}</span>
            <b>{option?.costLabel ?? `$${definition.constructionCost.toLocaleString()}`}</b>
            <small>{option?.upkeepLabel ?? `$${definition.upkeepPerExpenseInterval}/hr upkeep`} · {option?.builtCountLabel ?? `${built}/1 built`}</small>
            {reason ? <small className="mobile-build-reason">{reason}</small> : null}
          </button>;
          return <article className="mobile-build-card" key={definition.id}>
            <button type="button" className="mobile-build-choice" aria-label={`Choose ${definition.displayName}`}
              data-phone-anchor={definition.id === "room.examination" ? "exam-option" : undefined} data-build-room-option={definition.id}
              disabled={!props.buildMode || !option?.enabled} onClick={() => onChoose(definition.id)}>
              <RoomThumbnail definitionId={definition.id} onVisible={onPreviewRoom} />
              <strong>{definition.displayName}</strong>
              <span>{option?.costLabel ?? `$${definition.constructionCost.toLocaleString()}`} · {option?.footprintLabel ?? `${definition.width} × ${definition.height}`}</span>
              <small>{option?.builtCountLabel ?? `${built}/${definition.maximumInstances ?? "no limit"} built`}</small>
              {reason ? <small className="mobile-build-reason">{reason}</small> : null}
            </button>
            <details className="mobile-build-card-details"><summary aria-label={`Details about ${definition.displayName}`}>Details</summary>
              <p>{option?.purpose ?? roomBuildPurpose(definition.id)}</p>
              <p>{option?.upkeepLabel ?? `$${definition.upkeepPerExpenseInterval}/hr upkeep`} · Unlock Level {definition.unlockFacilityLevel}</p>
            </details>
          </article>;
        }) : (props.ownedRooms ?? []).map(room => {
          const definition = getRoomDefinition(room.roomDefinitionId);
          const mapRoom = props.facility.rooms.find(candidate => candidate.instanceId === room.id);
          if (props.facility.levelFiveRoomArt && definition?.unlockFacilityLevel === 5) return <article className="mobile-prestige-owned-card" key={room.id}><button
            type="button" className="mobile-prestige-build-tile" data-build-owned-room={room.id}
            aria-label={`Open ${room.displayName}`} disabled={!props.buildMode} onClick={() => onOpenRoom(room.id)}>
            <RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={room.upgradeLevel} onVisible={onPreviewRoom} />
            <strong>{room.displayName}</strong><span>Tier {room.upgradeLevel}/{room.maxUpgradeLevel}</span>
            <small>{room.benefit?.currentLabel ?? "No upgrades"}</small>
            <small>{room.accessProblem ? "No access yet" : "Access ready"} · ${definition.upkeepPerExpenseInterval}/hr upkeep</small>
          </button><QuickUpgrade room={room} props={props} /></article>;
          return <article className="mobile-owned-build-card" key={room.id}>
            <button type="button" className="mobile-build-open" aria-label={`Open ${room.displayName}`}
              data-phone-anchor={room.roomDefinitionId === "room.examination" ? "exam-owned" : "owned-room"} data-build-owned-room={room.id}
              disabled={!props.buildMode} onClick={() => onOpenRoom(room.id)}>
              <RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={room.upgradeLevel} onVisible={onPreviewRoom} />
              <span><strong>{room.displayName}</strong><small>Tier {room.upgradeLevel}/{room.maxUpgradeLevel} · {mapRoom?.width ?? definition?.width} × {mapRoom?.height ?? definition?.height}</small>
                <small>{room.benefit?.currentLabel ?? "No upgrades"} · {room.accessProblem ? "No access yet" : "Access ready"}</small>
                {definition ? <small>${definition.upkeepPerExpenseInterval + (room.upgradeLevel - 1) * definition.upkeepPerUpgradeLevel}/hr upkeep</small> : null}
              </span>
            </button>
            <QuickUpgrade room={room} props={props} />
          </article>;
        });
  return <div className="mobile-build-catalog" data-build-mode-panel="true">
    <p>Available cash <strong>{props.resourceBar.moneyLabel}</strong> · Time paused</p>
    {!props.buildMode ? <button type="button" onClick={props.onEnterBuildMode}>Enter Build Mode</button> : null}
    <div className="mobile-build-tools">
      <button type="button" data-build-tool="hallway" disabled={!props.buildMode || !hallway?.enabled} onClick={() => onChoose("room.hallway")}>Build Hallway · {hallway?.costLabel ?? ""}/tile</button>
      <button type="button" data-phone-anchor="doors" data-build-tool="doors" disabled={!props.buildMode} onClick={onDoors}>Doors · $0</button>
    </div>
    {hallway?.blockedReason ? <p>{hallway.blockedReason}</p> : null}
    <div className="mobile-build-tabs" role="tablist" aria-label="Room catalog">
      <button type="button" role="tab" aria-selected={tab === "new"} onClick={() => setTab("new")}>New Rooms</button>
      <button type="button" role="tab" aria-selected={tab === "owned"} onClick={() => setTab("owned")}>My Rooms</button>
    </div>
    <div className={`mobile-build-cards is-${tab}`} role="tabpanel" aria-label={tab === "new" ? "New Rooms" : "My Rooms"}>
      {props.facility.levelFiveRoomArt ? <>
        <div className="mobile-prestige-build-grid" aria-label="Level 5 room tiles">{cards.filter(card => prestigeKeys.has(String(card.key)))}</div>
        {cards.some(card => !prestigeKeys.has(String(card.key))) ? <details className="mobile-earlier-build-rooms">
          <summary>Earlier rooms · {cards.filter(card => !prestigeKeys.has(String(card.key))).length}</summary>
          <div className={`mobile-build-cards is-${tab}`}>{cards.filter(card => !prestigeKeys.has(String(card.key)))}</div>
        </details> : null}
      </> : cards}
    </div>
    {props.progression.endoscopySetupRequirements ? <EndoscopySetupChecklist requirements={props.progression.endoscopySetupRequirements} onAction={onSetup ?? (() => {})} /> : null}
  </div>;
}
