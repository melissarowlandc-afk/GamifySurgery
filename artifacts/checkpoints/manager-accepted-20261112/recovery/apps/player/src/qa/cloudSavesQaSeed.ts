import { createInitialGameState } from "@gamify-surgery/game-domain";
import { accountStorageKey } from "../session/accountStorageKey";
import { appendLocalCampaign, createFreshProfile, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult } from "../session/prototypeStorage";

/** Explicit, disposable QA setup only. A normal cloud sign-in never seeds local data. */
export function createQaDeviceCampaign(accountId: string): void {
  const existing = window.localStorage.getItem(accountStorageKey(PROTOTYPE_PROFILE_KEY, accountId));
  const profile = existing === null ? createFreshProfile() : loadPrototypeProfile(accountId).profile;
  const count = profile.campaigns.length + 1;
  const created = appendLocalCampaign(profile, createInitialGameState().founder, `Synthetic clinic ${count}`, Date.now(), `cloud-qa-${count}`, false);
  created.campaign.state.paused = true;
  if (!savePrototypeProfileResult(created.profile, accountId).ok) throw new Error("Disposable QA local storage failed");
}

export function seedQaDeviceCampaigns(accountId: string, requested: string | null): void {
  const count = Math.min(3, Math.max(0, Math.floor(Number(requested) || 0)));
  // Discovery is read-only, including absent, empty and incompatible profiles.
  // Never call the local-session loader to discover whether a profile exists.
  if (!count || window.localStorage.getItem(accountStorageKey(PROTOTYPE_PROFILE_KEY, accountId)) !== null) return;
  for (let index = 0; index < count; index++) createQaDeviceCampaign(accountId);
}
