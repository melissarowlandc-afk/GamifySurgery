import { describe, expect, it } from "vitest";
import { clearRecoveredSaveNotices } from "./clinicSaveNotices";

describe("verified autosave recovery notices", () => {
  it("clears a retained failure after recovery while preserving other notices", () => {
    const notices = [{ definitionId: "alert.system.save-failed", message: "Quota exceeded" }, { definitionId: "other", message: "Clinic restored" }];
    expect(clearRecoveredSaveNotices(notices)).toEqual([notices[1]]);
    expect(notices).toHaveLength(2);
    const recovered = clearRecoveredSaveNotices(notices);
    expect(clearRecoveredSaveNotices(recovered)).toBe(recovered);
  });
});
