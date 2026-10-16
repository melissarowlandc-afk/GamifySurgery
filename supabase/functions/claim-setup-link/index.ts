// Single-file Dashboard deployment: claim-setup-link, JWT verification OFF.
// No external imports, custom secrets, email/OTP calls, or request logging.
// Exports are also imported by Node tests; importing without Deno starts nothing.
export const SETUP_ORIGINS = [
  "https://melissarowlandc-afk.github.io",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5184",
] as const;
export const MAX_SETUP_FAILURES = 10;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HASH = /^[0-9a-f]{64}$/;
const CODE = /^[A-Za-z0-9_-]{43}$/;
const DUMMY_HASH = "0".repeat(64);

export interface SetupInput { email: string; code: string; password: string }
export function validateSetupInput(value: unknown): SetupInput | "invalid_link" | "invalid_password" {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "invalid_link";
  const input = value as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email) ||
    typeof input.code !== "string" || input.code.length > 256) return "invalid_link";
  if (typeof input.password !== "string" || input.password.length < 8 || input.password.length > 128) return "invalid_password";
  return { email, code: input.code, password: input.password };
}

export async function sha256Code(code: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

/** Fixed 64-iteration digest comparison; no early exit on differing bytes. */
export function constantTimeHashEqual(actual: string, expected: string): boolean {
  let difference = (HASH.test(actual) ? 0 : 1) | (HASH.test(expected) ? 0 : 1);
  for (let index = 0; index < 64; index++) {
    difference |= (actual.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export interface SetupServiceOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchImpl?: typeof fetch;
}

// Read with a hard bound, including requests without a Content-Length header.
async function readInput(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
}

function checkedUser(value: unknown, email: string, expectedId?: string): { id: string } | null {
  if (!value || typeof value !== "object") return null;
  const result = value as Record<string, unknown>;
  const user = (result.user ?? result) as Record<string, unknown>;
  if (typeof user.id !== "string" || !UUID.test(user.id) || (expectedId && user.id !== expectedId) ||
    typeof user.email !== "string" || user.email.toLowerCase() !== email || user.is_anonymous || user.deleted_at ||
    (typeof user.banned_until === "string" && Date.parse(user.banned_until) > Date.now())) return null;
  return { id: user.id };
}

export function createSetupLinkHandler({ supabaseUrl, serviceRoleKey, fetchImpl = fetch }: SetupServiceOptions) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const allowed = origin !== null && SETUP_ORIGINS.some(candidate => candidate === origin);
    const headers: Record<string, string> = {
      "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin",
      ...(allowed ? { "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info" } : {}),
    };
    const reply = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers });
    if (origin !== null && !allowed) return reply(403, { error: "invalid_link" });
    if (request.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers });
    if (request.method !== "POST") return reply(405, { error: "invalid_link" });
    try {
      const input = validateSetupInput(await readInput(request));
      if (typeof input === "string") return reply(400, { error: input });
      if (!supabaseUrl || !serviceRoleKey) return reply(503, { error: "unavailable" });
      const call = async (path: string, method: string, body: object) => {
        const response = await fetchImpl(`${supabaseUrl.replace(/\/$/, "")}${path}`, {
          method, headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" },
          ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
          signal: AbortSignal.timeout(30_000), redirect: "error",
        });
        // Provider errors can contain request data. Never log or reflect them.
        if (!response.ok) throw new Error("Setup service unavailable");
        return await response.json();
      };
      const rpc = (name: string, body: object) => call(`/rest/v1/rpc/${name}`, "POST", body);
      const candidate = await rpc("beta1_lookup_setup_code", { p_email: input.email });
      const digest = await sha256Code(input.code);
      // Always compare a digest, including unknown emails and malformed codes.
      const equal = constantTimeHashEqual(digest, typeof candidate?.code_hash === "string" ? candidate.code_hash : DUMMY_HASH);
      const matches = equal && CODE.test(input.code) && UUID.test(candidate?.id ?? "");
      const claim = await rpc("beta1_claim_setup_code", {
        p_email: input.email, p_id: UUID.test(candidate?.id ?? "") ? candidate.id : null, p_matches: matches,
      });
      if (claim?.status === "used" && matches) return reply(409, { error: "used_link" });
      if (!matches || claim?.status !== "claimed" || claim.id !== candidate.id ||
        !["invite", "reset"].includes(claim.purpose) || (claim.user_id !== null && !UUID.test(claim.user_id ?? "")) ||
        (claim.purpose === "reset" && !claim.user_id)) return reply(400, { error: "invalid_link" });

      let account;
      if (claim.user_id) {
        // Recheck identity/ban before updating a pending invite or active reset.
        const existing = await call(`/auth/v1/admin/users/${claim.user_id}`, "GET", {});
        if (!checkedUser(existing, input.email, claim.user_id)) return reply(400, { error: "invalid_link" });
        account = await call(`/auth/v1/admin/users/${claim.user_id}`, "PUT", { password: input.password, email_confirm: true });
      } else {
        // A failed finalization must remain recoverable by a fresh invite. This
        // trusted marker denotes pending game admission, and admits no client.
        account = await call("/auth/v1/admin/users", "POST", { email: input.email, password: input.password,
          email_confirm: true, app_metadata: { gamify_setup_pending: true } });
      }
      const user = checkedUser(account, input.email, claim.user_id ?? undefined);
      if (!user) return reply(400, { error: "invalid_link" });
      const finished = await rpc("beta1_finish_setup_code", { p_id: claim.id, p_user_id: user.id });
      if (finished?.ok !== true) return reply(400, { error: "invalid_link" });
      return reply(200, { ok: true });
    } catch {
      // No exception/request/header/body logging, including failed Auth calls.
      return reply(503, { error: "unavailable" });
    }
  };
}

// This guard keeps the exact deployed module importable under Node/Vitest.
const runtime = (globalThis as unknown as {
  Deno?: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): unknown };
}).Deno;
if (runtime) {
  runtime.serve(createSetupLinkHandler({
    supabaseUrl: runtime.env.get("SUPABASE_URL") ?? "",
    serviceRoleKey: runtime.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  }));
}
