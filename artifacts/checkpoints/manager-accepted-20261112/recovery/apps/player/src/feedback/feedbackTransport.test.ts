import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { APP_BUILD_VERSION, APP_VERSION } from "../appVersion";
import { createTesterFeedback, createTesterFeedbackTransport } from "./feedbackTransport";

function fixture(account = "account-a") {
  const getSession = vi.fn(async () => ({ data: { session: { user: { id: account }, access_token: "synthetic-token-a" } }, error: null }));
  const header = vi.fn(async () => ({ data: { id: submission.id, created_at: "2026-10-14T00:00:00Z" }, error: null }));
  const rpc = vi.fn(() => ({ setHeader: header }));
  const submission = createTesterFeedback("  A useful comment\n", 3, "phone");
  const client = { auth: { getSession }, rpc } as unknown as SupabaseClient;
  return { submission, getSession, header, rpc, transport: createTesterFeedbackTransport(client, "account-a") };
}

describe("voluntary feedback transport", () => {
  it("captures bounded, trimmed version/level/shell context without save or answer data", () => {
    const payload = createTesterFeedback(" \n Helpful comment \t ", 0, "desktop");
    expect(payload).toEqual({ id: expect.any(String), comment: "Helpful comment", release_version: APP_VERSION,
      app_version: APP_BUILD_VERSION, level: 0, shell: "desktop" });
    expect(createTesterFeedback("é".repeat(1000), 5, "phone").comment).toHaveLength(1000);
    for (const comment of ["", " \t\n", "x".repeat(1001)]) expect(() => createTesterFeedback(comment, 1, "phone")).toThrow();
    for (const level of [-1, 6, 1.5, Number.NaN]) expect(() => createTesterFeedback("Comment", level, "phone")).toThrow();
  });

  it("pins the verified account token and requires the server acknowledgement", async () => {
    const f = fixture();
    await f.transport.send(f.submission);
    expect(f.rpc).toHaveBeenCalledExactlyOnceWith("submit_tester_feedback", { p_id: f.submission.id,
      p_comment: "A useful comment", p_release_version: APP_VERSION, p_app_version: APP_BUILD_VERSION, p_level: 3, p_shell: "phone" });
    expect(f.header).toHaveBeenCalledExactlyOnceWith("Authorization", "Bearer synthetic-token-a");
  });

  it("rejects a switched or absent account before making a feedback request", async () => {
    const f = fixture("account-b");
    await expect(f.transport.send(f.submission)).rejects.toThrow("Feedback account unavailable");
    expect(f.rpc).not.toHaveBeenCalled();
    f.getSession.mockResolvedValueOnce({ data: { session: null }, error: null } as never);
    await expect(f.transport.send(f.submission)).rejects.toThrow(); expect(f.rpc).not.toHaveBeenCalled();
  });

  it.each([{ data: null, error: { message: "private provider response" } },
    { data: { id: "other", created_at: "2026-10-14T00:00:00Z" }, error: null },
    { data: { created_at: "invalid" }, error: null }])("does not claim an unacknowledged send (%j)", async response => {
      const f = fixture(); f.header.mockResolvedValueOnce(response as never);
      await expect(f.transport.send(f.submission)).rejects.toThrow("Feedback acknowledgement unavailable");
    });
});
