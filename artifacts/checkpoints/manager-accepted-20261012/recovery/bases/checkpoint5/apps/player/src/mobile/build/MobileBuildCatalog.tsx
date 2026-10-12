import { useEffect, useState } from "react";
import { getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import type { PrototypeShellProps } from "../../shellContract";
import { roomBuildPurpose } from "../../session/buildModePresentation";
import { EndoscopySetupChecklist } from "../../ui/RoomActionMenu";
import { RoomThumbnail } from "./RoomThumbnail";

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
    <div className="mobile-build-cards" role="tabpanel" aria-label={tab === "new" ? "New Rooms" : "My Rooms"}>
      {tab === "new" ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions
        .filter(definition => definition.buildable && definition.constructionCost > 0 && definition.kind !== "hallway")
        .map(definition => {
          const option = options.get(definition.id);
          const built = props.facility.rooms.filter(room => room.definitionId === definition.id).length;
          const reason = option?.blockedReason ?? (!option ? `Unlocks at Level ${definition.unlockFacilityLevel}.` : null);
          return <article className="mobile-build-card" key={definition.id}>
            <RoomThumbnail definitionId={definition.id} onVisible={onPreviewRoom} />
            <div><h3>{definition.displayName}</h3><p>{option?.purpose ?? roomBuildPurpose(definition.id)}</p>
              <p>{option?.footprintLabel ?? `${definition.width} × ${definition.height} tiles`}</p>
              <p><strong>{option?.costLabel ?? `$${definition.constructionCost.toLocaleString()}`}</strong> · {option?.upkeepLabel ?? `$${definition.upkeepPerExpenseInterval}/hr upkeep`}</p>
              <p>{option?.builtCountLabel ?? `${built}/${definition.maximumInstances ?? "no limit"} built`} · Unlock Level {definition.unlockFacilityLevel}</p>
              {reason ? <p className="mobile-build-reason">{reason}</p> : null}
              <button type="button" data-phone-anchor={definition.id === "room.examination" ? "exam-option" : undefined} data-build-room-option={definition.id} disabled={!props.buildMode || !option?.enabled}
                onClick={() => onChoose(definition.id)}>Choose {definition.displayName}</button>
            </div>
          </article>;
        }) : (props.ownedRooms ?? []).map(room => {
          const definition = getRoomDefinition(room.roomDefinitionId);
          const mapRoom = props.facility.rooms.find(candidate => candidate.instanceId === room.id);
          const option = options.get(room.roomDefinitionId);
          const built = props.facility.rooms.filter(candidate => candidate.definitionId === room.roomDefinitionId).length;
          return <article className="mobile-build-card" key={room.id}>
            <RoomThumbnail definitionId={room.roomDefinitionId} onVisible={onPreviewRoom} /><div>
              <h3>{room.displayName}</h3><p>{mapRoom?.width ?? definition?.width} × {mapRoom?.height ?? definition?.height} tiles · Tier {room.upgradeLevel}/{room.maxUpgradeLevel}</p>
              <p>{room.benefit?.currentLabel ?? "No upgrades"} · {room.accessProblem ? "No access yet" : "Access ready"}</p>
              {definition ? <p>${definition.constructionCost.toLocaleString()} construction · {built}/{definition.maximumInstances ?? "no limit"} built · Unlock Level {definition.unlockFacilityLevel}</p> : null}
              <p>{definition ? `$${definition.upkeepPerExpenseInterval + (room.upgradeLevel - 1) * definition.upkeepPerUpgradeLevel}/hr upkeep` : null}</p>
              {option?.blockedReason ? <p className="mobile-build-reason">New room unavailable: {option.blockedReason}</p> : null}
              <button type="button" data-phone-anchor={room.roomDefinitionId === "room.examination" ? "exam-owned" : "owned-room"} data-build-owned-room={room.id} disabled={!props.buildMode} onClick={() => onOpenRoom(room.id)}>Open {room.displayName}</button>
            </div>
          </article>;
        })}
    </div>
    {props.progression.endoscopySetupRequirements ? <EndoscopySetupChecklist requirements={props.progression.endoscopySetupRequirements} onAction={onSetup ?? (() => {})} /> : null}
  </div>;
}
