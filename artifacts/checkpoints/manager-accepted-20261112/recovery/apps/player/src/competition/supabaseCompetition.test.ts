import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { createSupabaseCompetitionTransport, parseCompetitionBoard } from "./supabaseCompetition";
import { CompetitionAccessError, CompetitionValidationError } from "./types";

function fixture() {
  const setHeader = vi.fn().mockResolvedValue({ data: { hidden: false, rows: [] }, error: null });
  const rpc = vi.fn(() => ({ setHeader }));
  const getSession = vi.fn().mockResolvedValue({ data: { session: { user: { id: "account-a" }, access_token: "fixture-token" } }, error: null });
  const client = { auth: { getSession }, rpc } as unknown as SupabaseClient;
  return { setHeader, rpc, getSession, transport: createSupabaseCompetitionTransport(client, "account-a") };
}
describe("competition RPC boundary", () => {
  it("pins account authorization, sends only aggregate data and verifies the acknowledgement", async () => {
    const f = fixture(), sample = { campaignId: "clinic", clinicName: "Name", facilityLevel: 2, averageDailyRevenueCents: 12345, daysCounted: 3, completedDay: 7 };
    f.setHeader.mockResolvedValueOnce({ data: { campaign_id: "clinic", completed_day: 7 }, error: null });
    await f.transport.submit(sample);
    expect(f.rpc).toHaveBeenCalledWith("submit_clinic_competition", { p_campaign_id: "clinic", p_clinic_name: "Name", p_facility_level: 2,
      p_average_daily_revenue_cents: 12345, p_days_counted: 3, p_completed_day: 7 });
    expect(f.setHeader).toHaveBeenCalledWith("Authorization", "Bearer fixture-token");
    await expect(f.transport.submit(sample)).rejects.toThrow("acknowledgement");
  });
  it("refuses a different account and classifies denied, invalid and offline failures", async () => {
    const f = fixture();
    f.getSession.mockResolvedValueOnce({ data: { session: { user: { id: "other" } } } });
    await expect(f.transport.leaderboard()).rejects.toBeInstanceOf(CompetitionAccessError); expect(f.rpc).not.toHaveBeenCalled();
    f.setHeader.mockResolvedValueOnce({ error: { code: "42501" } });
    await expect(f.transport.leaderboard()).rejects.toBeInstanceOf(CompetitionAccessError);
    f.setHeader.mockResolvedValueOnce({ error: { code: "22023" } });
    await expect(f.transport.setHidden(true)).rejects.toBeInstanceOf(CompetitionValidationError);
    f.setHeader.mockResolvedValueOnce({ error: { code: "P0001" } });
    await expect(f.transport.leaderboard()).rejects.toThrow("unavailable");
  });
  it("parses only bounded public fields, including an unranked hidden self", () => {
    const row = { rank: null, clinic_name: "My clinic", facility_level: 2, average_daily_revenue_cents: 123, days_counted: 1, is_self: true };
    expect(parseCompetitionBoard({ hidden: true, rows: [row] }).rows[0]).toMatchObject({ rank: null, clinicName: "My clinic", isSelf: true });
    expect(() => parseCompetitionBoard({ hidden: false, rows: [{ ...row, is_self: false }] })).toThrow();
    expect(() => parseCompetitionBoard({ hidden: false, rows: [{ ...row, rank: 1, clinic_name: "Bad\nName" }] })).toThrow();
    expect(() => parseCompetitionBoard({ rows: [] })).toThrow();
  });
});
