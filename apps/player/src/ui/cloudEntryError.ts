import { CloudSyncError } from "../session/cloud/transport";

export function cloudEntryError(error: unknown): string {
  const code = error instanceof CloudSyncError ? error.code : "network";
  return code === "capacity" ? "The two-campaign limit or account storage limit was reached. Archives count too; this campaign remains on this device." :
    code === "revision" ? "This campaign ID is already in your account with a different source. Use the account campaign; the local copy is retained." :
    code === "corrupt" ? "The name, ID or campaign data could not be verified. Try a unique name or contact the owner. Original bytes are retained." :
    code === "storage" ? "This browser could not keep a verified recovery copy. Allow site storage or free browser space, then retry." :
    code === "notice" ? "Accept the cloud save notice before copying a campaign." :
    code === "disabled" ? "Cloud enrollment is unavailable. Retry later; your campaigns remain on this device." :
    code === "auth" || code === "deleted" || code === "revoked" ? "Account access is unavailable. Sign in as the same account or contact the owner." :
    code === "protocol" || code === "operation-expired" ? "Update the game or contact the owner before retrying this copy. The original and recovery bytes are retained." :
    "The copy is not confirmed. Keep this device's original; retry to check the same import without creating a duplicate.";
}
