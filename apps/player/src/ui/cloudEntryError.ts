import { CloudSyncError } from "../session/cloud/transport";

export function cloudEntryError(error: unknown): string {
  const code = error instanceof CloudSyncError ? error.code : "network";
  return code === "capacity" ? "Your account has reached its campaign or storage limit. Archived campaigns count too. The copy on this device stays." :
    code === "revision" ? "This campaign is already in your account. Choose Resume above. The copy on this device stays." :
    code === "corrupt" ? "This campaign could not be checked. Contact the owner. The copy on this device stays." :
    code === "storage" ? "This browser could not safely keep your progress. Allow site storage or free browser space, then try again." :
    code === "notice" ? "Accept the account save notice in Account & privacy before continuing." :
    code === "disabled" ? "Account saving is unavailable. Try again later. The campaigns on this device stay here." :
    code === "auth" || code === "deleted" || code === "revoked" ? "Account access is unavailable. Sign in as the same account or contact the owner." :
    code === "protocol" || code === "operation-expired" ? "Update the game or contact the owner before trying again. The copies on this device stay here." :
    "Saving to your account is not confirmed. The copy on this device stays. Try again to check the same save without creating another campaign.";
}
