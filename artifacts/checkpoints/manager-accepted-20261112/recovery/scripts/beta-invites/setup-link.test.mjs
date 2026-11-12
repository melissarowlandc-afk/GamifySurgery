import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { createHash } from "node:crypto";
// Import the EXACT Dashboard file; no Deno, server, SDK import or env read.
import { constantTimeHashEqual, sha256Code, validateSetupInput, createSetupLinkHandler, SETUP_ORIGINS } from "../../supabase/functions/claim-setup-link/index.ts";

const EMAIL = "tester@example.org", CODE = Buffer.alloc(32, 0xad).toString("base64url"), PASSWORD = "eight888";
const ID = "11111111-1111-4111-8111-111111111111", USER = "22222222-2222-4222-8222-222222222222";
const KEY = "synthetic-service-key-never-print", URL_BASE = "https://synthetic.supabase.co";
const digest = createHash("sha256").update(CODE).digest("hex");
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });

function fixture({ exists = true, purpose = "invite", existingUser = false, cancelled = false, used = false, intercept = () => undefined } = {}) {
  const requests = [], state = { used, cancelled, failures: 0 };
  const account = { id: USER, email: EMAIL, email_confirmed_at: "2026-10-14T00:00:00Z", is_anonymous: false };
  const handler = createSetupLinkHandler({ supabaseUrl: URL_BASE, serviceRoleKey: KEY,
    fetchImpl: async (input, init) => {
      const url = new URL(input), headers = new Headers(init.headers);
      assert.equal(url.origin, URL_BASE); assert.equal(headers.get("apikey"), KEY); assert.equal(headers.get("authorization"), `Bearer ${KEY}`);
      assert.equal(init.redirect, "error");
      const body = init.body ? JSON.parse(init.body) : null;
      const request = { path: url.pathname, method: init.method, body }; requests.push(request);
      const custom = await intercept(request, state); if (custom !== undefined) return custom;
      if (url.pathname.endsWith("/beta1_lookup_setup_code")) return json(exists ? { id: ID, code_hash: digest } : null);
      if (url.pathname.endsWith("/beta1_claim_setup_code")) {
        assert.equal(typeof body.p_email, "string");
        if (body.p_email !== EMAIL) return json({ status: "invalid" });
        if (!body.p_matches) {
          if (exists && !state.used && !state.cancelled && ++state.failures === 10) state.cancelled = true;
          return json({ status: "invalid" });
        }
        if (state.cancelled) return json({ status: "invalid" });
        if (state.used) return json({ status: "used" });
        state.used = true;
        return json({ status: "claimed", id: ID, purpose, user_id: existingUser ? USER : null });
      }
      if (url.pathname.endsWith("/beta1_finish_setup_code")) {
        assert.deepEqual(body, { p_id: ID, p_user_id: USER }); return json({ ok: !state.cancelled });
      }
      if (url.pathname === "/auth/v1/admin/users") {
        assert.equal(init.method, "POST"); assert.deepEqual(body, { email: EMAIL, password: PASSWORD,
          email_confirm: true, app_metadata: { gamify_setup_pending: true } }); return json(account);
      }
      if (url.pathname === `/auth/v1/admin/users/${USER}`) {
        assert.ok(["GET", "PUT"].includes(init.method));
        if (init.method === "PUT") assert.deepEqual(body, { password: PASSWORD, email_confirm: true });
        return json(account);
      }
      assert.fail(`Unexpected mocked route ${url.pathname}`);
    },
  });
  const request = async (overrides = {}, { origin = SETUP_ORIGINS[0], method = "POST", raw, contentType = "application/json" } = {}) => {
    const response = await handler(new Request(`${URL_BASE}/functions/v1/claim-setup-link`, {
      method, headers: { ...(origin ? { Origin: origin } : {}), "Content-Type": contentType },
      ...(["GET", "OPTIONS"].includes(method) ? {} : { body: raw ?? JSON.stringify({ email: EMAIL, code: CODE, password: PASSWORD, ...overrides }) }),
    }));
    const text = await response.text();
    assert.ok(!text.includes(KEY)); assert.ok(!text.includes(PASSWORD)); assert.ok(!text.includes(CODE)); assert.ok(!text.includes(EMAIL));
    return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null };
  };
  return { handler, request, requests, state };
}

describe("Deno-free pure setup logic", () => {
  it("normalizes the email and accepts exactly the 8-128 password boundary, including spaces", () => {
    for (const password of ["        ", "p".repeat(128)]) assert.deepEqual(validateSetupInput({ email: " Tester@Example.Org ", code: CODE, password }), { email: EMAIL, code: CODE, password });
    for (const password of ["p".repeat(7), "p".repeat(129), null]) assert.equal(validateSetupInput({ email: EMAIL, code: CODE, password }), "invalid_password");
  });
  it("rejects malformed bodies/emails without identifying accounts", () => {
    for (const input of [null, [], "body", { email: "bad", code: CODE }, { email: EMAIL, code: 1 },
      { email: "injected\n@example.org", code: CODE, password: PASSWORD }]) assert.equal(validateSetupInput(input), "invalid_link");
  });
  it("hashes the full code with SHA-256 and compares all digest positions", async () => {
    assert.equal(await sha256Code(CODE), digest); assert.equal(constantTimeHashEqual(digest, digest), true);
    for (let i = 0; i < 64; i++) {
      const changed = digest.slice(0, i) + (digest[i] === "0" ? "1" : "0") + digest.slice(i + 1);
      assert.equal(constantTimeHashEqual(digest, changed), false);
    }
    for (const bad of ["", digest.slice(1), digest + "0", "z".repeat(64), digest.toUpperCase()]) assert.equal(constantTimeHashEqual(digest, bad), false);
  });
});

describe("single-file setup endpoint, mocked Auth and RPC only", () => {
  it("creates/confirms a new invite only on POST, after consuming, then finalizes admission", async () => {
    const f = fixture(); const response = await f.request();
    assert.equal(response.status, 200); assert.deepEqual(response.body, { ok: true });
    assert.deepEqual(f.requests.map(r => r.path), ["/rest/v1/rpc/beta1_lookup_setup_code", "/rest/v1/rpc/beta1_claim_setup_code", "/auth/v1/admin/users", "/rest/v1/rpc/beta1_finish_setup_code"]);
    assert.equal(f.state.used, true);
    assert.ok(!JSON.stringify(f.requests.filter(r => r.path.includes("/rpc/"))).includes(PASSWORD));
    assert.ok(!JSON.stringify(f.requests).includes(CODE));
  });
  for (const purpose of ["invite", "reset"]) {
    it(`updates the bound existing ${purpose} identity without creating or emailing another user`, async () => {
      const f = fixture({ purpose, existingUser: true }); assert.equal((await f.request()).status, 200);
      assert.deepEqual(f.requests.filter(r => r.path.includes("/auth/")).map(r => r.method), ["GET", "PUT"]);
    });
  }
  it("a second/concurrent claim cannot change the password or create another account", async () => {
    const f = fixture(); const results = await Promise.all([f.request(), f.request()]);
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    assert.equal(f.requests.filter(r => r.path === "/auth/v1/admin/users").length, 1);
    const reused = await f.request(); assert.deepEqual(reused.body, { error: "used_link" });
  });
  it("unknown email, wrong code, cancelled code and email/code mismatch have one generic error", async () => {
    const unknown = await fixture({ exists: false }).request();
    const wrong = await fixture().request({ code: "x".repeat(43) });
    const cancelled = await fixture({ cancelled: true }).request();
    const mismatch = await fixture({ exists: false }).request({ email: "other@example.org" });
    for (const result of [unknown, wrong, cancelled, mismatch]) assert.deepEqual({ status: result.status, body: result.body }, { status: 400, body: { error: "invalid_link" } });
  });
  it("counts malformed code attempts too; the tenth failure cancels and a later correct claim fails", async () => {
    const f = fixture();
    for (let i = 0; i < 10; i++) assert.equal((await f.request({ code: i % 2 ? "wrong" : "z".repeat(43) })).status, 400);
    assert.equal(f.state.failures, 10); assert.equal(f.state.cancelled, true);
    assert.deepEqual((await f.request()).body, { error: "invalid_link" });
    assert.ok(f.requests.every(r => !r.path.includes("/auth/")));
  });
  it("accepts the correct code after nine failures", async () => {
    const f = fixture(); for (let i = 0; i < 9; i++) await f.request({ code: "wrong" });
    assert.equal((await f.request()).status, 200); assert.equal(f.state.failures, 9);
  });
  it("does not spend a code for a short/long password", async () => {
    const f = fixture();
    for (const password of ["short", "p".repeat(129)]) assert.deepEqual((await f.request({ password })).body, { error: "invalid_password" });
    assert.equal(f.requests.length, 0); assert.equal(f.state.used, false);
  });
  it("requires a bound member for reset and a matching atomic reservation", async () => {
    const noMember = fixture({ purpose: "reset" }); assert.equal((await noMember.request()).status, 400);
    assert.ok(!noMember.requests.some(r => r.path.includes("/auth/")));
    const stale = fixture({ intercept: r => r.path.endsWith("/beta1_claim_setup_code") ? json({ status: "claimed", id: USER, purpose: "invite", user_id: null }) : undefined });
    assert.equal((await stale.request()).status, 400); assert.equal(stale.requests.length, 2);
  });
  for (const changed of [{ email: "other@example.org" }, { id: ID }, { is_anonymous: true }, { banned_until: "2199-01-01T00:00:00Z" }, { deleted_at: "2026-10-14" }]) {
    it("does not update a mismatched or disabled bound identity", async () => {
      const f = fixture({ existingUser: true, intercept: r => r.method === "GET" ? json({ id: USER, email: EMAIL, ...changed }) : undefined });
      assert.equal((await f.request()).status, 400); assert.ok(!f.requests.some(r => r.method === "PUT"));
    });
  }
  it("cannot finish admission after cancellation/revocation races the Auth operation", async () => {
    const f = fixture({ intercept: (r, state) => { if (r.path === "/auth/v1/admin/users") state.cancelled = true; } });
    assert.deepEqual((await f.request()).body, { error: "invalid_link" });
  });
  it("fails closed after an Auth error and never logs/refects provider/request secrets", async () => {
    const f = fixture({ intercept: r => r.path.includes("/auth/") ? json({ message: `${KEY} ${CODE} ${PASSWORD}` }, 500) : undefined });
    assert.deepEqual((await f.request()).body, { error: "unavailable" });
    assert.equal(f.state.used, true); assert.deepEqual((await f.request()).body, { error: "used_link" });
    assert.ok(!f.requests.some(r => r.path.endsWith("/beta1_finish_setup_code")));
  });
  for (const origin of SETUP_ORIGINS) {
    it(`allows only the exact configured origin ${origin}`, async () => {
      const f = fixture(); const response = await f.request({}, { method: "OPTIONS", origin });
      assert.equal(response.status, 204); assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
      assert.equal(f.requests.length, 0); assert.equal(f.state.used, false);
    });
  }
  for (const origin of ["http://localhost:4173", "https://melissarowlandc-afk.github.io.unexpected.org", "http://127.0.0.1:5185", "null"]) {
    it("rejects another Origin before any RPC/Auth action", async () => {
      const f = fixture(); const response = await f.request({}, { origin });
      assert.equal(response.status, 403); assert.equal(response.headers.get("Access-Control-Allow-Origin"), null); assert.equal(f.requests.length, 0);
    });
  }
  it("GET scanners, non-JSON, invalid/oversized JSON never query or consume", async () => {
    const f = fixture();
    assert.equal((await f.request({}, { method: "GET" })).status, 405);
    for (const options of [{ contentType: "text/plain" }, { raw: "not json" }, { raw: "x".repeat(4097) }]) assert.equal((await f.request({}, options)).status, 400);
    assert.equal(f.requests.length, 0); assert.equal(f.state.used, false);
  });
});
