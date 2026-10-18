/** Null retains the historical unowned prototype namespace, byte for byte. */
export function accountStorageKey(baseKey: string, accountId: string | null = null): string {
  return accountId === null ? baseKey : `${baseKey}.account.${encodeURIComponent(accountId)}`;
}

/** New cloud cache only. Never aliases or adopts a historical prototype key. */
export function cloudCampaignStorageKey(scope: { backendId: string; accountId: string; campaignId: string }): string {
  const parts = [scope.backendId, scope.accountId, scope.campaignId];
  if (parts.some(part => typeof part !== "string" || !part.trim() || part.length > 512)) {
    throw new Error("A cloud cache requires a backend, account and campaign namespace.");
  }
  return `gamify-surgery.cloud.v1:${parts.map(encodeURIComponent).join(":")}`;
}
