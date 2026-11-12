// Uses the invite tool's existing private client; never reads or prints keys.
const RPC = "beta2_admin_cloud";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class CloudToolError extends Error {}
function fail(message) { throw new CloudToolError(message); }

async function call(client, name, args) {
  const { data, error } = await client.rpc(name, args);
  if (error) fail("Cloud administration failed. Check the reviewed cloud migrations and account admission with the manager. No provider details are printed.");
  return data;
}
function switches(result) {
  const quota = result?.quota;
  if (typeof quota?.writes_enabled !== "boolean" || typeof quota?.enrollments_enabled !== "boolean" || typeof quota?.default_account_enabled !== "boolean") {
    fail("The cloud settings response was unexpected. No setting change was confirmed; ask the manager to check 20261027000100_beta2_default_enabled.sql and the reviewed admin RPC.");
  }
  return { writesEnabled: quota.writes_enabled, enrollmentsEnabled: quota.enrollments_enabled, defaultAccountEnabled: quota.default_account_enabled };
}
async function members(client) {
  const rows = await call(client, "beta1_admin_members", { p_action: "list" });
  if (!Array.isArray(rows) || rows.some(row => !row || !UUID.test(row.user_id ?? "") ||
    typeof row.email !== "string" || !row.email.trim() || /[\x00-\x1f\x7f]/.test(row.email)) ||
    new Set(rows.map(row => row.user_id.toLowerCase())).size !== rows.length ||
    new Set(rows.map(row => row.email.trim().toLowerCase())).size !== rows.length) {
    fail("The membership roster was unexpected or ambiguous. No cloud account change was attempted.");
  }
  return rows;
}
const onOff = value => value ? "on" : "off";

/** All cloud reads/writes use the existing service-role settings RPC. */
export async function runCloudCommand(client, options) {
  if (["enable", "disable"].includes(options.action)) {
    const roster = await members(client), member = roster.find(row => row.email.trim().toLowerCase() === options.email);
    if (!member) fail("No invited game membership matches that email. No cloud account change was attempted.");
    const enabled = options.action === "enable";
    const result = await call(client, RPC, { p_action: "account", p_user_id: member.user_id, p_settings: { enabled } });
    if (result?.userId !== member.user_id || result.enabled !== enabled) {
      fail("Cloud account enablement could not be confirmed. Run cloud status before retrying; no provider details are printed.");
    }
    return `Cloud saves ${enabled ? "enabled" : "disabled"} for ${options.email}.`;
  }
  const inspected = await call(client, RPC, { p_action: "inspect" });
  const settings = switches(inspected);
  if (["writes", "enrollments", "default"].includes(options.action)) {
    const key = { writes: "writesEnabled", enrollments: "enrollmentsEnabled", default: "defaultAccountEnabled" }[options.action];
    // Preserve every inspected setting; owner commands must run sequentially.
    settings[key] = options.enabled;
    const updated = switches(await call(client, RPC, { p_action: "configure", p_settings: settings }));
    if (updated.writesEnabled !== settings.writesEnabled || updated.enrollmentsEnabled !== settings.enrollmentsEnabled || updated.defaultAccountEnabled !== settings.defaultAccountEnabled) {
      fail("The cloud switch change could not be confirmed. Run cloud status before retrying.");
    }
    return `Cloud writes: ${onOff(updated.writesEnabled)}\nCloud enrollments: ${onOff(updated.enrollmentsEnabled)}\nCloud account default: ${onOff(updated.defaultAccountEnabled)}`;
  }
  if (options.action !== "status") fail("Unknown cloud command.");
  const accounts = inspected.accountSettings;
  if (!Array.isArray(accounts) || accounts.some(row => !row || !UUID.test(row.userId ?? "") || typeof row.enabled !== "boolean") ||
    new Set(accounts.map(row => row.userId.toLowerCase())).size !== accounts.length) {
    fail("The cloud account list is unavailable or unexpected. Ask the manager to check 20261027000100_beta2_default_enabled.sql and the reviewed status RPC, then retry cloud status.");
  }
  const roster = await members(client), emails = new Map(roster.map(row => [row.user_id.toLowerCase(), row.email]));
  const lines = [`Cloud writes: ${onOff(settings.writesEnabled)}`, `Cloud enrollments: ${onOff(settings.enrollmentsEnabled)}`, `Cloud account default: ${onOff(settings.defaultAccountEnabled)}`, "Email / account | Cloud enabled"];
  for (const row of accounts) lines.push(`${emails.get(row.userId.toLowerCase()) ?? row.userId} | ${row.enabled ? "yes" : "no"}`);
  if (!accounts.length) lines.push("No cloud accounts configured. Admitted accounts use the default.");
  return lines.join("\n");
}
