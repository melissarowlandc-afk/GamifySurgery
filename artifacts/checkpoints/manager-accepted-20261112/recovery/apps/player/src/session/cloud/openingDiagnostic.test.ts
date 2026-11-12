import { describe, expect, it } from "vitest";
import { CloudCacheError } from "./codecCache";
import { CloudCodecError } from "./codecJson";
import { cloudOpeningDiagnostic } from "./openingDiagnostic";
import { CloudSyncError } from "./transport";

describe("opening failure classifications", () => {
  it.each([
    [new DOMException("private checkpoint bytes", "DataCloneError"), "codec", "worker_data_clone"],
    [new CloudCodecError("worker_data_clone", "private checkpoint bytes"), "codec", "worker_data_clone"],
    [new TypeError("private checkpoint bytes"), "unexpected", "type_error"],
    [new ReferenceError("private checkpoint bytes"), "unexpected", "reference_error"],
    [new Error("private checkpoint bytes"), "unexpected", "unexpected_error"],
    [{ name: "private checkpoint bytes", payload: "private checkpoint bytes" }, "unexpected", "unexpected_error"],
    ["private checkpoint bytes", "unexpected", "unexpected_error"],
    [new CloudSyncError("network"), "sync", "network"],
    [new CloudCacheError("conflict"), "cache", "conflict"],
    [new CloudCodecError("private checkpoint bytes", "private checkpoint bytes"), "codec", "invalid_error_code"],
  ])("classifies opening errors without copying error content (%#)", (error, kind, code) => {
    const result = cloudOpeningDiagnostic("copies", error);
    expect(result).toEqual({ stage: "copies", kind, code });
    expect(JSON.stringify(result)).not.toContain("private checkpoint bytes");
  });
});
