import type { ServiceIncomeView } from "./types";

/** Both Manage shells render the same accepted-domain projection. */
export function LevelFiveSupportFacts({ support, mobile = false }: { support: ServiceIncomeView["levelFiveSupport"]; mobile?: boolean }) {
  if (!support) return null;
  return <section aria-label="Level 5 room effects">
    <p>{support.gymBreakCount} gym breaks · {support.gardenRestCount} garden rests</p>
    <div className={mobile ? "mobile-manage-stack" : "service-facts"}>{support.rooms.map(room =>
      <div key={room.id} className={mobile ? "mobile-manage-card" : "service-fact"}>
        <strong>{room.displayName} · Tier {room.upgradeLevel}</strong>
        <p>Current benefit: {room.currentBenefitLabel}</p><p>{room.policyLabel}</p><small>Per upgrade: {room.upgradeLabel}</small>
      </div>)}</div>
  </section>;
}
