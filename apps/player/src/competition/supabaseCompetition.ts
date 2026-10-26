import type { SupabaseClient } from "@supabase/supabase-js";
import { CompetitionAccessError, CompetitionValidationError, MAX_DAILY_REVENUE_CENTS, validClinicName,
  type CompetitionBoard, type CompetitionRow, type CompetitionTransport } from "./types";

export function parseCompetitionBoard(data: unknown): CompetitionBoard {
  const board = data as { hidden?: unknown; rows?: unknown } | null;
  if (typeof board?.hidden !== "boolean" || !Array.isArray(board.rows)) throw new Error("Competition response unavailable");
  const rows = board.rows.map((value: unknown): CompetitionRow => {
    const r = value as Record<string, unknown> | null;
    if (!r || !validClinicName(r.clinic_name) || typeof r.is_self !== "boolean" ||
      !(Number.isSafeInteger(r.rank) && Number(r.rank) > 0 || r.rank === null && r.is_self) ||
      !Number.isInteger(r.facility_level) || Number(r.facility_level) < 0 || Number(r.facility_level) > 5 ||
      !Number.isSafeInteger(r.average_daily_revenue_cents) || Number(r.average_daily_revenue_cents) < 0 || Number(r.average_daily_revenue_cents) > MAX_DAILY_REVENUE_CENTS ||
      !Number.isInteger(r.days_counted) || Number(r.days_counted) < 1 || Number(r.days_counted) > 3) throw new Error("Competition response unavailable");
    return { rank: r.rank as number | null, clinicName: r.clinic_name, facilityLevel: r.facility_level as number,
      averageDailyRevenueCents: r.average_daily_revenue_cents as number, daysCounted: r.days_counted as number, isSelf: r.is_self };
  });
  return { hidden: board.hidden, rows };
}

/** Pin every request to the originating account, as with usage tracking. */
export function createSupabaseCompetitionTransport(client: SupabaseClient, accountId: string): CompetitionTransport {
  async function rpc(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    const { data: auth, error: authError } = await client.auth.getSession();
    if (authError || !auth.session) throw new Error("Competition sign-in unavailable");
    if (auth.session.user.id !== accountId) throw new CompetitionAccessError("Competition account changed");
    const { data, error } = await client.rpc(name, args).setHeader("Authorization", `Bearer ${auth.session.access_token}`);
    if (error?.code === "42501") throw new CompetitionAccessError("Competition access stopped");
    if (error?.code === "22023") throw new CompetitionValidationError("Invalid competition submission");
    if (error) throw new Error("Competition service unavailable");
    return data;
  }
  return {
    async submit(value) {
      const data = await rpc("submit_clinic_competition", { p_campaign_id: value.campaignId, p_clinic_name: value.clinicName,
        p_facility_level: value.facilityLevel, p_average_daily_revenue_cents: value.averageDailyRevenueCents,
        p_days_counted: value.daysCounted, p_completed_day: value.completedDay }) as { campaign_id?: unknown; completed_day?: unknown } | null;
      if (data?.campaign_id !== value.campaignId || data.completed_day !== value.completedDay) throw new Error("Competition acknowledgement unavailable");
    },
    async leaderboard() { return parseCompetitionBoard(await rpc("get_clinic_competition")); },
    async setHidden(hidden) { await rpc("set_clinic_competition_hidden", { p_hidden: hidden }); },
  };
}
