import { InspectionControls } from "../ui/InspectionControls";
import { FinishedGamePage } from "../ui/FinishedGamePage";
import type { FacilityInspectionView } from "../ui/types";

/** Dedicated phone screen, also reached from Goals; all arithmetic/actions are shared. */
export function MobileInspection({ view, onBook, onCancel, onViewFinish, onDetailBackChange }: {
  view: FacilityInspectionView; onBook?: () => void; onCancel?: () => void; onViewFinish?: () => void;
  onDetailBackChange?: (handler: (() => void) | null) => void;
}) {
  return <div className="mobile-inspection-screen"><InspectionControls view={view} compact onBook={onBook} onCancel={onCancel} onViewFinish={onViewFinish} onDetailBackChange={onDetailBackChange} /></div>;
}

export function MobileFinishedGamePage({ inspection, onKeepPlaying, onStartNewCampaign }: {
  inspection: FacilityInspectionView; onKeepPlaying: () => void; onStartNewCampaign: () => void;
}) {
  return inspection.finish ? <FinishedGamePage view={inspection.finish} compact bestLabel={inspection.bestLabel}
    latestLabel={inspection.latestLabel} onKeepPlaying={onKeepPlaying} onStartNewCampaign={onStartNewCampaign} /> : null;
}
