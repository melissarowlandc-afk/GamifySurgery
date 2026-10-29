import { CloudCacheError } from "./codecCache";
import { CloudCodecError } from "./codecJson";
import { CloudSyncError } from "./transport";

export interface CloudOpeningDiagnostic {
  stage: "copies" | "hydrate" | "selection";
  kind: "sync" | "cache" | "codec" | "unexpected";
  code: string;
}

/** Classification only: error messages/stacks may contain save or token data. */
export function cloudOpeningDiagnostic(stage: CloudOpeningDiagnostic["stage"], error: unknown): CloudOpeningDiagnostic {
  if (error instanceof CloudCacheError) return { stage, kind: "cache", code: error.reason };
  if (error instanceof CloudSyncError || error instanceof CloudCodecError) return { stage,
    kind: error instanceof CloudSyncError ? "sync" : "codec",
    code: /^[a-z][a-z0-9_-]{0,63}$/.test(error.code) ? error.code : "invalid_error_code" };
  let name: unknown;
  try { if (typeof error === "object" && error !== null) name = Reflect.get(error, "name"); } catch { /* Hostile/unreadable thrown object. */ }
  if (name === "DataCloneError") return { stage, kind: "codec", code: "worker_data_clone" };
  const codes: Record<string, string> = { TypeError: "type_error", RangeError: "range_error", ReferenceError: "reference_error",
    SyntaxError: "syntax_error", AbortError: "aborted", SecurityError: "security_error", InvalidStateError: "invalid_state" };
  return { stage, kind: "unexpected", code: typeof name === "string" && Object.hasOwn(codes, name) ? codes[name]! : "unexpected_error" };
}
