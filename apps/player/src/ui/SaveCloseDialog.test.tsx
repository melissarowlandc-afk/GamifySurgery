import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SaveFailureRecovery } from "./SaveCloseDialog";

describe("SaveFailureRecovery", () => {
  it("explains the failed-save category and exposes the first confirmation action", () => {
    const markup = renderToStaticMarkup(
      <SaveFailureRecovery
        result={{
          ok: false,
          failure: {
            category: "quota",
            operation: "write",
            name: "QuotaExceededError",
            message: "full",
            profileCharacters: 123,
          },
        }}
        confirmClear={false}
        onConfirmClear={vi.fn()}
        onRequestClear={vi.fn()}
        onCancelClear={vi.fn()}
      />,
    );

    expect(markup).toContain("Browser storage is full.");
    expect(markup).toContain("Clear local campaigns");
    expect(markup).toContain("other site preferences will stay intact");
    expect(markup).not.toContain("Yes, clear all local campaigns");
  });

  it("renders the explicit destructive confirmation only after requested", () => {
    const markup = renderToStaticMarkup(
      <SaveFailureRecovery
        result={{
          ok: false,
          failure: {
            category: "security",
            operation: "access",
            name: "SecurityError",
            message: "blocked",
          },
        }}
        confirmClear
        onConfirmClear={vi.fn()}
        onRequestClear={vi.fn()}
        onCancelClear={vi.fn()}
      />,
    );

    expect(markup).toContain("This browser blocked local storage access.");
    expect(markup).toContain("Yes, clear all local campaigns");
    expect(markup).toContain("Cancel");
  });
});
