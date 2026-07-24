import type {
  RoomBuildOptionView,
  StaffHireOptionView,
} from "./types";

interface BuildPanelProps {
  roomOptions: RoomBuildOptionView[];
  staffOptions: StaffHireOptionView[];
  onSelectRoom: (roomDefinitionId: string) => void;
  onCancelPlacement: () => void;
  onHireStaff: (staffRoleDefinitionId: string) => void;
}

export function BuildPanel({
  roomOptions,
  staffOptions,
  onSelectRoom,
  onCancelPlacement,
  onHireStaff,
}: BuildPanelProps) {
  return (
    <section className="panel build-panel">
      <div className="panel-heading">
        <span>Clinic development</span>
        <small>Rooms &amp; staff</small>
      </div>

      <div className="build-section">
        <h2>Construction</h2>
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
                <strong>
                  {room.owned ? "✓ " : ""}
                  {room.displayName}
                </strong>
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
              <span>
                {room.owned
                  ? "Built"
                  : room.selected
                    ? "Cancel"
                    : "Place"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {staffOptions.length > 0 ? (
        <div className="build-section">
          <h2>Employees</h2>
          <div className="build-option-list">
            {staffOptions.map((staff) => (
              <button
                className="build-card staff-card"
                type="button"
                key={staff.id}
                disabled={!staff.enabled}
                onClick={() => onHireStaff(staff.id)}
                title={staff.blockedReason}
              >
                <span className="pixel-staff-icon" aria-hidden="true" />
                <span>
                  <strong>
                    {staff.hired ? "✓ " : ""}
                    {staff.displayName}
                  </strong>
                  <small>
                    {staff.costLabel} · {staff.salaryLabel}
                  </small>
                  {staff.blockedReason ? (
                    <small className="blocked-reason">
                      {staff.blockedReason}
                    </small>
                  ) : null}
                </span>
                <span>{staff.hired ? "Hired" : "Hire"}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
