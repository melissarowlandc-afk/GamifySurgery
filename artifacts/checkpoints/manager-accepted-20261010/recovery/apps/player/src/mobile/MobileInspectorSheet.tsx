import { useEffect, useState } from "react";
import type {
  DescribeCharacterRequest, FacilityViewModel, PraiseEmployeeRequest, SeatFounderAtFrontDeskRequest,
} from "../facility/types";
import type { OwnedRoomBuildView } from "../ui/types";
import { MobileSheet } from "./MobileSheet";
import { refreshMobileSelection, type MobileInspectorSelection } from "./map/selection";
import "./map/mobileMap.css";

export interface MobileInspectorSheetProps {
  selection: MobileInspectorSelection;
  facility: FacilityViewModel;
  ownedRooms?: OwnedRoomBuildView[];
  onDescribeCharacter?: DescribeCharacterRequest;
  onPraiseEmployee?: PraiseEmployeeRequest;
  onSeatFounderAtFrontDesk?: SeatFounderAtFrontDeskRequest;
  onOpenRoom: (id: string) => void;
  onOpenPatient?: (id: string) => void;
  onClose: () => void;
}

/** Phone inspection uses the same live descriptions and guarded session commands. */
export function MobileInspectorSheet(props: MobileInspectorSheetProps) {
  const [failure, setFailure] = useState<string | null>(null);
  useEffect(() => setFailure(null), [props.selection]);
  const selection = refreshMobileSelection(props.selection, props.facility, props.onDescribeCharacter, Boolean(props.onPraiseEmployee)) as MobileInspectorSelection | null;
  const title = !selection ? "Map selection" : selection.kind === "character"
    ? selection.name : selection.kind === "room" ? selection.room.buildLabel ?? selection.room.displayName : "Door";
  let content;
  if (!selection) content = <p>This target has left the map.</p>;
  else if (selection.kind === "character") content = <>
    <p>{selection.role}</p><p>{selection.activity}</p>
    {selection.patient ? <p>Patient: {selection.patient.name} · {selection.patient.status}</p> : null}
    <div className="mobile-inspector-actions">
      {selection.patient && props.onOpenPatient ? <button type="button" onClick={() => props.onOpenPatient?.(selection.patient!.id)}>Open patient chart</button> : null}
      {selection.praise ? <button type="button" disabled={!selection.praise.eligible} onClick={() => {
        props.onPraiseEmployee?.(selection.praise!.employeeId); props.onClose();
      }}>Praise Employee</button> : null}
      {selection.character.kind === "founder" && props.onSeatFounderAtFrontDesk ? <button type="button" onClick={() => {
        if (props.onSeatFounderAtFrontDesk?.()) props.onClose(); else setFailure("Front Desk unavailable.");
      }}>Return to Front Desk</button> : null}
    </div>
  </>;
  else if (selection.kind === "room") {
    const room = props.ownedRooms?.find((candidate) => candidate.id === selection.room.instanceId);
    content = <>
      <p>{selection.status}</p>
      {selection.room.cleanliness !== undefined ? <p>Cleanliness: {Math.round(selection.room.cleanliness)}%</p> : null}
      <p>Level {room?.upgradeLevel ?? selection.upgrade.level} of {room?.maxUpgradeLevel ?? selection.upgrade.maximum}</p>
      {room?.benefitSummary ? <p>{room.benefitSummary}</p> : null}
      {room?.nextUpgradeCostLabel ? <p>Next upgrade: {room.nextUpgradeCostLabel}{room.canUpgrade ? " · Available" : " · Unavailable"}</p> : null}
      <div className="mobile-inspector-actions">
        <button type="button" onClick={() => props.onOpenRoom(selection.room.instanceId)}>Room actions</button>
      </div>
    </>;
  } else if (selection.kind === "door") content = <>
    <p>{selection.room.displayName} · {selection.door.side} door</p>
    {selection.door.exterior ? <p>Permanent public entrance</p> : null}
    <div className="mobile-inspector-actions"><button type="button" onClick={() => props.onOpenRoom(selection.room.instanceId)}>Room actions</button></div>
  </>;
  return <MobileSheet title={title} kind="bottom" onClose={props.onClose}>
    <div className="mobile-inspector-details" data-testid="mobile-map-inspector">{content}{failure ? <p role="status">{failure}</p> : null}</div>
  </MobileSheet>;
}
