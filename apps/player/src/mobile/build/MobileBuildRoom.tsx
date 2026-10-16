import { useEffect, useRef, useState } from "react";
import { getRoomDefinition } from "@gamify-surgery/game-domain";
import type { PrototypeShellProps } from "../../shellContract";
import type { SelectedRoomBuildView } from "../../ui/types";
import { describeRoomUpgradeBenefit } from "../../session/buildModePresentation";
import { RoomThumbnail } from "./RoomThumbnail";

export function MobileBuildRoom({ props, room, onMove, onDoors }: {
  props: PrototypeShellProps; room: SelectedRoomBuildView; onMove: () => void; onDoors: () => void;
}) {
  const [sale, setSale] = useState<SelectedRoomBuildView["salePreview"] | null>(null);
  const saleLatch = useRef(false);
  const definition = getRoomDefinition(room.roomDefinitionId);
  const mapRoom = props.facility.rooms.find(candidate => candidate.instanceId === room.id);
  useEffect(() => { setSale(null); saleLatch.current = false; }, [room.id]);
  return <div className="mobile-build-room">
    <div className="mobile-build-room-heading"><RoomThumbnail definitionId={room.roomDefinitionId} upgradeLevel={room.upgradeLevel} /><div>
      <p>Tier {room.upgradeLevel}/{room.maxUpgradeLevel ?? 1}</p>
      <p role="status">{room.accessProblem ? "No access yet. Add a door to a reachable room or hallway." : "Access ready"}</p>
      {mapRoom?.cleanliness !== undefined ? <p>Cleanliness {mapRoom.cleanliness}%</p> : null}
    </div></div>
    {room.benefit ? <div className="mobile-build-benefit"><strong>{room.benefit.perUpgradeLabel}</strong>
      <p>{room.benefit.totalCaption ?? "Now"}: {room.benefit.currentLabel}{room.benefit.nextLabel ? ` → Next: ${room.benefit.nextLabel}` : " · MAX"}</p>
      {room.benefit.upkeepLabel ? <p>{room.benefit.upkeepLabel}</p> : null}{room.benefit.note ? <p>{room.benefit.note}</p> : null}
    </div> : null}
    {room.upgradeable && definition ? <details className="mobile-build-tiers"><summary>Upgrade tiers and prices</summary>
      <ol>{Array.from({ length: room.maxUpgradeLevel ?? 1 }, (_, index) => {
        const tier = index + 1;
        const benefit = describeRoomUpgradeBenefit({ roomDefinitionId: room.roomDefinitionId, upgradeLevel: tier,
          maxUpgradeLevel: room.maxUpgradeLevel ?? 1, upkeepPerLevel: definition.upkeepPerUpgradeLevel });
        return <li key={tier}>Tier {tier} · {tier === 1 ? "Included" : `$${definition.upgradeCosts[index - 1]?.toLocaleString()}`} · {benefit?.currentLabel}{tier === room.upgradeLevel ? " · Current" : ""}</li>;
      })}</ol>
    </details> : null}
    <div className="mobile-build-room-actions">
      {room.upgradeable && room.nextUpgradeLevel ? <button type="button" disabled={!room.canUpgrade} onClick={props.onUpgradeSelectedRoom}>Upgrade to ★{room.nextUpgradeLevel} · {room.upgradeCostLabel}</button> : null}
      {room.canMove !== false ? <button type="button" onClick={onMove}>Move</button> : null}
      <button type="button" data-build-tool="room-doors" onClick={onDoors}>Doors</button>
      {room.canSell && room.salePreview ? <button type="button" onClick={() => { saleLatch.current = false; setSale(room.salePreview); }}>Sell · {room.resaleValueLabel}</button> : null}
    </div>
    {room.blockedReason ? <p className="mobile-build-reason">{room.blockedReason}</p> : null}
    {sale ? <div className="dialog-backdrop mobile-build-sale" role="presentation"><section role="dialog" aria-modal="true" aria-label="Confirm room sale">
      <h3>Sell {room.displayName}?</h3><p>Refund: {room.resaleValueLabel}</p>
      {sale.dismissedEmployees.length ? <><p>Selling this room will result in firing:</p><ul>{sale.dismissedEmployees.map(employee => <li key={employee.id}>{employee.displayName}</li>)}</ul></> : <p>No employees will be dismissed.</p>}
      <p>Interrupted tests will wait for another compatible room. If none remains, patients will leave for off-site testing and you will not earn the fee for unfinished testing.</p>
      <div className="dialog-actions"><button type="button" onClick={() => setSale(null)}>Cancel</button>
        <button type="button" onClick={() => {
          if (saleLatch.current) return;
          saleLatch.current = true; props.onSellSelectedRoom(sale.roomId, sale.confirmationToken); setSale(null);
        }}>Confirm Sale</button></div>
    </section></div> : null}
  </div>;
}
