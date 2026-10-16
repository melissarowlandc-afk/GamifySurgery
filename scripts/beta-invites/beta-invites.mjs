import { randomBytes, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { createClient } from "@supabase/supabase-js";
import { compileFeedback, setFeedbackStatus, FeedbackToolError, FEEDBACK_STATUSES } from "./beta-feedback.mjs";

export const GAME_URL = "https://melissarowlandc-afk.github.io/GamifySurgery/";
export const ADMIN_ENV_FILE = fileURLToPath(new URL("../../.local-dev/beta-admin.env", import.meta.url));
// Auth bans have a finite duration. The durable membership revocation remains
// effective after this 100-year ban and rejects otherwise unexpired JWTs.
export const REVOKE_BAN_DURATION = "876000h";
const RPC = "beta1_admin_members";
const SETUP_RPC = "beta1_setup_admin";
export const LOCAL_GAME_URL = "http://127.0.0.1:4173/";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HELP = `Beta 1 owner invite tool (no automatic emails)
  node scripts/beta-invites/beta-invites.mjs invite <email> [--owner] [--local]
  node scripts/beta-invites/beta-invites.mjs invite --file <path> [--local]
  node scripts/beta-invites/beta-invites.mjs reset <email> [--local]
  node scripts/beta-invites/beta-invites.mjs cancel <email>
  node scripts/beta-invites/beta-invites.mjs list
  node scripts/beta-invites/beta-invites.mjs revoke <email>
  node scripts/beta-invites/beta-invites.mjs feedback [--all]
  node scripts/beta-invites/beta-invites.mjs feedback-status <id> <status> [note]
  Feedback statuses: new, discussed, planned, done, wont_do (owner decision only).
  Double-click scripts/beta-invites/BETA_INVITES.cmd for prompts.
  Credentials: .local-dev/beta-admin.env (ignored, owner PC only).`;

class OwnerToolError extends Error {}
function fail(message) { throw new OwnerToolError(message); }
function normalizeEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email)) {
    fail("Enter one complete email address, without spaces or line breaks.");
  }
  return email;
}

export function parseCommand(args) {
  if (args.length === 0 || (args.length === 1 && ["--help", "-h"].includes(args[0]))) return { command: "help" };
  const [command, ...rest] = args;
  if (command === "list" && rest.length === 0) return { command };
  if (command === "feedback" && (rest.length === 0 || (rest.length === 1 && rest[0] === "--all"))) {
    return { command, all: rest[0] === "--all" };
  }
  if (command === "feedback-status" && rest.length >= 2 && rest.length <= 3 &&
    UUID.test(rest[0]) && FEEDBACK_STATUSES.includes(rest[1]) && (rest[2] === undefined || rest[2].trim().length <= 1000)) {
    return { command, id: rest[0], status: rest[1], ...(rest[2] !== undefined ? { note: rest[2].trim() } : {}) };
  }
  if (["cancel", "revoke"].includes(command) && rest.length === 1) {
    return { command, email: normalizeEmail(rest[0]) };
  }
  if (["invite", "reset"].includes(command)) {
    const local = rest.includes("--local"), owner = rest.includes("--owner");
    if (rest.filter(arg => arg === "--local").length > 1 || rest.filter(arg => arg === "--owner").length > 1 || (owner && command !== "invite")) {
      fail("Use each option once; --owner is for a single invite only.");
    }
    const positional = rest.filter(arg => !["--local", "--owner"].includes(arg));
    if (command === "invite" && positional.length === 2 && positional[0] === "--file" && positional[1] && !owner) {
      return { command, file: positional[1], local, owner: false };
    }
    if (positional.length === 1 && !positional[0].startsWith("--")) return { command, email: normalizeEmail(positional[0]), local, owner };
  }
  fail("Use invite <email> [--owner] [--local], invite --file <path> [--local], reset <email> [--local], cancel <email>, list, revoke <email>, feedback [--all], or feedback-status <id> <status> [note]. Use --help for details.");
}

/** Parse only the two owner settings; never execute an env file as shell code. */
export function parseAdminEnv(contents) {
  const values = new Map();
  for (const line of contents.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)\s*=\s*(.*)$/.exec(trimmed);
    if (!match || values.has(match[1])) fail("The admin env file must contain each of the two example settings exactly once.");
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values.set(match[1], value);
  }
  const key = values.get("SUPABASE_SERVICE_ROLE_KEY");
  let url;
  try { url = new URL(values.get("SUPABASE_URL")); } catch { fail("Fill in SUPABASE_URL in .local-dev/beta-admin.env with the game project's HTTPS URL."); }
  // Beta 1 uses the hosted project URL. Refuse credentials sent to a typoed
  // host, user-info, custom path or redirect supplied through this local file.
  if (url.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) ||
      url.port || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    fail("SUPABASE_URL must be the game project's https://<project-ref>.supabase.co URL.");
  }
  if (!key || /\s/.test(key)) fail("Fill in SUPABASE_SERVICE_ROLE_KEY privately in .local-dev/beta-admin.env. Do not share it.");
  if (key.startsWith("sb_publishable_")) fail("The owner tool needs the secret/service_role key, not the public game key.");
  return { url: url.origin, key };
}

function memberStatus(member) {
  if (member.deletion_requested_at) return "deletion requested";
  if (member.revoked_at) return "revoked";
  if (member.banned_until && Date.parse(member.banned_until) > Date.now()) return "disabled";
  return member.confirmed_at ? "confirmed" : "invited, awaiting confirmation";
}

/** Batch input is private local text, never a repository roster. Validate ALL before issuing. */
export function parseEmailFile(contents) {
  if (typeof contents !== "string" || contents.length > 1_048_576) fail("The private email file is too large or unreadable.");
  const emails = contents.replace(/^\uFEFF/, "").split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(normalizeEmail);
  if (emails.length === 0 || emails.length > 1000 || new Set(emails).size !== emails.length) {
    fail("Use 1-1000 unique email addresses, one per line, in a private file outside the repository.");
  }
  return emails;
}

/** All requests use the installed SDK with injected fetch; tests never connect. */
export async function runBetaInvites(args, {
  readFileImpl = readFile, fetchImpl = globalThis.fetch, write = console.log,
  feedbackOptions = {}, randomBytesImpl = randomBytes,
} = {}) {
  let secret = "";
  const redact = value => secret ? value.replaceAll(secret, "[REDACTED]").replaceAll(encodeURIComponent(secret), "[REDACTED]") : value;
  const output = value => write(redact(value));
  try {
    const options = parseCommand(args);
    if (options.command === "help") { output(HELP); return 0; }
    let emails;
    if (options.file) {
      let file;
      try { file = await readFileImpl(resolve(options.file), "utf8"); }
      catch { fail("The private email file could not be read. Keep it outside the repository; no links were printed."); }
      emails = parseEmailFile(file);
    } else if (options.email) emails = [options.email];
    let contents;
    try { contents = await readFileImpl(ADMIN_ENV_FILE, "utf8"); }
    catch { fail("Create .local-dev/beta-admin.env from scripts/beta-invites/beta-admin.env.example and fill it in privately."); }
    const config = parseAdminEnv(contents);
    secret = config.key;
    const client = createClient(config.url, secret, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (url, init) => fetchImpl(url, { ...init, signal: init?.signal
        ? AbortSignal.any([init.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000) }) },
    });
    if (options.command === "feedback-status") {
      output(await setFeedbackStatus(client, options));
      return 0;
    }
    async function rpc(action, userId, owner = false) {
      const { data, error } = await client.rpc(RPC, {
        p_action: action, ...(userId ? { p_user_id: userId, p_owner: owner } : {}),
      });
      if (error) fail("Membership administration failed. Check the game project and reviewed migrations with the manager; no provider details are printed.");
      return data;
    }
    async function setupRpc(body) {
      const { data, error } = await client.rpc(SETUP_RPC, body);
      if (error) fail("Setup-link administration failed. Check migration 20261014000300 and the address. Use reset for a confirmed member; revoked, disabled or deletion-requested accounts cannot get links. No links were printed; retry the whole batch after fixing the problem.");
      return data;
    }
    if (options.command === "cancel") {
      const result = await setupRpc({ p_action: "cancel", p_email: options.email });
      if (result?.cancelled !== true) fail("Setup-link cancellation could not be confirmed. Retry with the manager.");
      output(`Cancelled setup links for ${options.email}.`);
      return 0;
    }
    if (["invite", "reset"].includes(options.command)) {
      const lines = [];
      for (const address of emails) {
        const code = Buffer.from(randomBytesImpl(32)).toString("base64url");
        if (!/^[A-Za-z0-9_-]{43}$/.test(code)) fail("A setup code could not be generated; no links were printed.");
        const hash = createHash("sha256").update(code).digest("hex");
        const result = await setupRpc({ p_action: "issue", p_email: address, p_code_hash: hash,
          p_purpose: options.command, p_owner: options.owner });
        if (result?.issued !== true || !UUID.test(result.id ?? "") || result.purpose !== options.command) {
          fail("Setup-link storage could not be confirmed. No links were printed; retry the whole batch with the manager.");
        }
        const link = `${options.local ? LOCAL_GAME_URL : GAME_URL}#setup=${code}&email=${encodeURIComponent(address)}`;
        lines.push(options.file ? `${address}\t${link}` : link);
      }
      // Only links on success. Never an email template, password or provider OTP.
      for (const line of lines) output(line);
      return 0;
    }
    const members = await rpc("list");
    if (!Array.isArray(members) || members.some(row => !row || !UUID.test(row.user_id ?? "") ||
        typeof row.email !== "string" || /[\x00-\x1f\x7f]/.test(row.email))) {
      fail("The membership roster response was unexpected. Check the reviewed admin migration with the manager.");
    }
    const { command, email } = options;
    if (command === "feedback") {
      output(await compileFeedback(client, members, { ...feedbackOptions, all: options.all, redact }));
      return 0;
    }
    if (command === "list") {
      output("Email | Invite/confirmed status | Owner");
      for (const member of members) output(`${member.email} | ${memberStatus(member)} | ${member.is_owner ? "yes" : "no"}`);
      if (!members.length) output("No game members yet.");
      const codes = await setupRpc({ p_action: "list" });
      if (!Array.isArray(codes) || codes.some(row => !row || !UUID.test(row.id ?? "") ||
        typeof row.email !== "string" || /[\x00-\x1f\x7f]/.test(row.email) ||
        !["invite", "reset"].includes(row.purpose) || !Number.isFinite(Date.parse(row.created_at)) ||
        !Number.isInteger(row.failed_attempts) || row.failed_attempts < 0 || row.failed_attempts > 10)) {
        fail("The setup-link roster response was unexpected. No hashes or provider details are printed.");
      }
      output("Email | Purpose | Setup link status | Created (UTC) | Failed attempts");
      for (const code of codes) output(`${code.email} | ${code.purpose} | ${code.cancelled_at ? "cancelled" : code.used_at ? "used" : "pending"} | ${code.created_at} | ${code.failed_attempts}`);
      if (!codes.length) output("No setup links yet.");
      return 0;
    }
    if (command === "revoke") {
      // Retrying revoke must finish a failed Auth ban. Keep the SQL tombstone,
      // remove owner access first, then disable sign-in in Auth.
      const member = members.find(row => row.email.toLowerCase() === email);
      if (!member) {
        const cancelled = await setupRpc({ p_action: "cancel", p_email: email });
        if (cancelled?.cancelled !== true) fail("Setup-link cancellation could not be confirmed. Retry revoke with the manager.");
        output(`Cancelled setup links for ${email}. No game membership exists to revoke.`);
        return 0;
      }
      const revoked = await rpc("revoke", member.user_id);
      if (revoked?.user_id !== member.user_id || revoked.revoked !== true) {
        fail("Membership revocation could not be confirmed. No Auth change was attempted; check the reviewed admin migration.");
      }
      let result;
      try { result = await client.auth.admin.updateUserById(member.user_id, { ban_duration: REVOKE_BAN_DURATION }); }
      catch { fail("Membership access and owner access are revoked, but Auth disabling could not be confirmed. Retry revoke for this email; do not report the account as fully disabled yet."); }
      if (result.error || result.data.user?.id !== member.user_id || !(Date.parse(result.data.user.banned_until) > Date.now())) {
        fail("Membership access and owner access are revoked, but Auth disabling could not be confirmed. Retry revoke for this email; do not report the account as fully disabled yet.");
      }
      output(`Revoked membership and disabled Auth sign-in for ${email}. The revocation marker is retained; existing local saves remain on the device.`);
      return 0;
    }

  } catch (error) {
    // Never print an SDK error, stack, request, config or provider response:
    // those can contain credentials, tokens and other people's account details.
    output(`Beta 1 admin tool: ${error instanceof OwnerToolError || error instanceof FeedbackToolError ? error.message : "The request could not be completed. No provider details are printed. Check connectivity/setup with the manager, then retry the command."}`);
    return 1;
  }
}

async function interactiveArgs() {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const command = (await prompt.question("Action: invite, reset, cancel, list, revoke, feedback, or feedback-status [invite]: ")).trim().toLowerCase() || "invite";
    if (command === "list") return [command];
    if (command === "feedback") return [command, ...((await prompt.question("Include all statuses? [y/N]: ")).trim().toLowerCase() === "y" ? ["--all"] : [])];
    if (command === "feedback-status") return [command, (await prompt.question("Feedback ID: ")).trim(),
      (await prompt.question("Owner-decided status (new, discussed, planned, done, wont_do): ")).trim(),
      await prompt.question("Owner note (optional): ")];
    if (!["invite", "reset", "cancel", "revoke"].includes(command)) fail("Choose invite, reset, cancel, list, revoke, feedback, or feedback-status.");
    const email = (await prompt.question("Tester's email: ")).trim();
    const owner = command === "invite" && (await prompt.question("Also add this person to the owner allowlist? [y/N]: ")).trim().toLowerCase() === "y";
    return [command, email, ...(owner ? ["--owner"] : [])];
  } finally { prompt.close(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    process.exitCode = await runBetaInvites(args.length === 1 && args[0] === "--interactive" ? await interactiveArgs() : args);
  } catch {
    console.error("Beta 1 admin tool: prompts could not be completed. Use the command-line commands shown by --help.");
    process.exitCode = 1;
  }
}
