import { useState } from "react";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { accountStorageKey } from "../session/accountStorageKey";
import { setAuxiliaryItem } from "../session/storagePressure";
import { useCasualMode } from "../playtime/UsageProvider";
import "./competition.css";

export const COMPETITION_TIP_KEY = "gamify-surgery.competition-tip.v1";
export const COMPETITION_TIP_JOKE = "Surgeons are famously non-competitive. Here's a leaderboard anyway.";
const dismissedInMemory = new Set<string>();
const dismissalKey = (campaignId: string, accountId: string | null) => accountStorageKey(`${COMPETITION_TIP_KEY}.${encodeURIComponent(campaignId)}`, accountId);
function wasDismissed(key: string): boolean {
  if (dismissedInMemory.has(key)) return true;
  for (const kind of ["localStorage", "sessionStorage"] as const) {
    try { if (window[kind]?.getItem(key) === "dismissed") return true; } catch { /* Try the other store. */ }
  }
  return false;
}
function dismiss(key: string) {
  dismissedInMemory.add(key);
  for (const kind of ["localStorage", "sessionStorage"] as const) {
    try { if (window[kind]) setAuxiliaryItem(window[kind], key, "dismissed"); } catch { /* Tab memory still avoids repeating the tip. */ }
  }
}

/** Local presentation preference; never a campaign save, game command or gate. */
export function CompetitionTutorialTip({ campaignId, enabled, onShowBoard }: {
  campaignId: string; enabled: boolean; onShowBoard: () => void;
}) {
  const accountId = useAuthAccountId();
  const casualMode = useCasualMode();
  const key = dismissalKey(campaignId, accountId);
  return <CompetitionTip key={key} storageKey={key} enabled={enabled && Boolean(campaignId)} casualMode={casualMode} onShowBoard={onShowBoard} />;
}
function CompetitionTip({ storageKey, enabled, casualMode, onShowBoard }: {
  storageKey: string; enabled: boolean; casualMode: boolean | null; onShowBoard: () => void;
}) {
  const [dismissed, setDismissed] = useState(() => typeof window !== "undefined" && wasDismissed(storageKey));
  if (!enabled || dismissed || casualMode === null) return null;
  const acknowledge = () => { dismiss(storageKey); setDismissed(true); };
  return <aside className="competition-tutorial-tip" aria-label="Clinic Competition tip" data-tutorial-anchor="competition-intro" data-phone-anchor="competition-intro">
    <strong>Meet Clinic Competition</strong>
    <p>{COMPETITION_TIP_JOKE}</p>
    <p>Open Clinic Competition in Management to compare clinics by average daily revenue.</p>
    {casualMode ? <p>Casual clinics aren't ranked. You can still cheer from the sidelines.</p> : null}
    <div>
      <button type="button" onClick={() => { onShowBoard(); acknowledge(); }}>View Clinic Competition</button>
      <button type="button" onClick={acknowledge} aria-label="Dismiss competition tip">Got it</button>
    </div>
  </aside>;
}
