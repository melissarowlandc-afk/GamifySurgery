export class CasualToolError extends Error {}
const fail = message => { throw new CasualToolError(message); };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The caller resolves emails through the existing service-role member roster. */
export async function setCasualMode(client, members, { email, enabled }) {
  const member = members.find(row => row.email.toLowerCase() === email);
  if (!member) fail("No game membership exists for this email. Invite and finish account setup first.");
  const { data, error } = await client.rpc("beta1_admin_set_casual", { p_user_id: member.user_id, p_casual: enabled });
  if (error) fail("Casual mode could not be changed. Check migration 20261028000100 and the account's membership status with the manager; no provider details are printed.");
  if (data?.user_id !== member.user_id || data.casual !== enabled) {
    fail("Casual mode could not be confirmed. Use list to check the account before retrying.");
  }
  return `Casual mode ${enabled ? "on" : "off"} for ${email}. Reload the game on open devices to refresh account access.`;
}

/** One server aggregate includes zero-usage members and marks current mode. */
export async function compileUsageReport(client) {
  const { data, error } = await client.rpc("beta1_admin_usage_report");
  if (error) fail("The usage report could not be read. Check migration 20261028000100 with the manager; no provider details are printed.");
  if (!Array.isArray(data) || data.some(row => !row || !UUID.test(row.user_id ?? "") ||
      typeof row.email !== "string" || /[\x00-\x1f\x7f]/.test(row.email) || !/^[^\s@|]+@[^\s@|]+\.[^\s@|]+$/.test(row.email) ||
      typeof row.casual !== "boolean" || typeof row.playtime_seconds !== "number" ||
      !Number.isFinite(row.playtime_seconds) || row.playtime_seconds < 0 ||
      !Number.isSafeInteger(row.question_count) || row.question_count < 0)) {
    fail("The usage report response was unexpected. No account totals were printed; check the reviewed migration with the manager.");
  }
  return ["Usage totals for the retained 90 UTC days (current account mode).",
    "Email | Total play time (seconds) | Questions | Casual",
    ...data.map(row => `${row.email} | ${row.playtime_seconds} | ${row.question_count} | ${row.casual ? "yes" : "no"}`),
    ...(!data.length ? ["No game members to report."] : [])].join("\n");
}
