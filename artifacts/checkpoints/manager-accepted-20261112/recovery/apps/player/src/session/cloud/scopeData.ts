import type { CloudScope } from "./transport";

/** Structural Pick types do not remove runtime services, proxies or callbacks. */
export function cloudScopeData(scope: Pick<CloudScope, "backendId" | "accountId">, campaignId: string): CloudScope {
  return { backendId: scope.backendId, accountId: scope.accountId, campaignId };
}
