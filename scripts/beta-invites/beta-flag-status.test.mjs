import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { resolve } from "node:path";
import { ADMIN_ENV_FILE, parseCommand, runBetaInvites } from "./beta-invites.mjs";
import { FLAG_STATUSES, parseFlagStatusFile, setQuestionFlagStatuses } from "./beta-feedback.mjs";

const ORIGIN = "https://synthetic.supabase.co", KEY = "synthetic_owner.secret/never-print";
const ENV = `SUPABASE_URL=${ORIGIN}\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`;
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", OTHER = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const TIME = "2026-11-16T12:34:56.789Z", FILE = resolve("synthetic-private-flag-updates.json");
const flag = (overrides = {}) => ({ user_id: A, flag_id: ID, status: "open", fixed_in_version: null,
  resolution_note: "Existing note", resolved_at: null, ...overrides });
const response = (data, status = 200, count) => new Response(JSON.stringify(data), { status,
  headers: { "Content-Type": "application/json", ...(count !== undefined ? { "Content-Range": `*/${count}` } : {}) } });

function fixture({ rows = [flag()], file = "[]", fileError = false, cap = 2, intercept = () => undefined } = {}) {
  rows = structuredClone(rows);
  const requests = [], output = [], reads = [];
  const run = args => runBetaInvites(args, {
    readFileImpl: async path => {
      reads.push(path);
      if (path === ADMIN_ENV_FILE) return ENV;
      assert.equal(path, FILE); if (fileError) throw Error(KEY); return file;
    },
    feedbackOptions: { now: () => new Date(TIME) },
    write: text => output.push(text),
    fetchImpl: async (input, init) => {
      const url = new URL(input), headers = new Headers(init.headers);
      assert.equal(url.origin, ORIGIN, "No external project or real fetch allowed");
      assert.equal(url.pathname, "/rest/v1/question_flags");
      assert.equal(headers.get("apikey"), KEY);
      assert.equal(headers.get("authorization"), `Bearer ${KEY}`);
      const request = { url, headers, method: init.method, body: init.body ? JSON.parse(init.body) : null };
      requests.push(request);
      const custom = await intercept(request, requests, rows); if (custom !== undefined) return custom;
      const matches = rows.filter(row => url.searchParams.get("flag_id") === `eq.${row.flag_id}` &&
        (!url.searchParams.has("user_id") || url.searchParams.get("user_id") === `eq.${row.user_id}`));
      if (init.method === "GET") {
        assert.equal(headers.get("prefer"), "count=exact");
        assert.equal(url.searchParams.get("limit"), "2");
        return response(matches.slice(0, cap), 200, matches.length);
      }
      assert.equal(init.method, "PATCH");
      assert.ok(url.searchParams.has("user_id"), "Every write fences the complete identity");
      assert.deepEqual(Object.keys(request.body).sort(), ["fixed_in_version", "resolution_note", "resolved_at", "status"]);
      for (const row of matches) Object.assign(row, request.body);
      return response(matches.length === 1 ? matches[0] : null);
    },
  });
  return { run, requests, reads, rows, text: () => output.join("\n") };
}

describe("owner question flag status, synthetic SDK fetch only", () => {
  for (const status of FLAG_STATUSES) it(`confirms ${status} by a separate GET and preserves an omitted note`, async () => {
    const f = fixture({ rows: [flag({ status: "fixed_in_version", fixed_in_version: "old", resolved_at: "2026-11-01T00:00:00Z" })] });
    assert.equal(await f.run(["flag-status", ID, status, ...(status === "fixed_in_version" ? ["--version", "live.36"] : [])]), 0);
    assert.deepEqual(f.requests.map(r => r.method), ["GET", "PATCH", "GET"]);
    assert.deepEqual(f.requests[1].body, { status, fixed_in_version: status === "fixed_in_version" ? "live.36" : null,
      resolution_note: "Existing note", resolved_at: status === "open" ? null : TIME });
    for (const request of f.requests.slice(1)) assert.equal(request.url.searchParams.get("user_id"), `eq.${A}`);
    assert.match(f.text(), /Confirmed by read-back/); assert.ok(!f.text().includes(KEY));
  });

  it("trims a supplied version/note and can explicitly clear the note", async () => {
    const f = fixture();
    assert.equal(await f.run(["flag-status", ID.toUpperCase(), "fixed_in_version", "--version", " live.36 ", " Fixed and live. "]), 0);
    assert.equal(f.rows[0].resolution_note, "Fixed and live."); assert.equal(f.rows[0].fixed_in_version, "live.36");
    assert.equal(await f.run(["flag-status", ID, "open", ""]), 0);
    assert.equal(f.rows[0].resolution_note, "");
  });

  it("refuses an ambiguous flag, including a provider page cap, without any write", async () => {
    const f = fixture({ rows: [flag(), flag({ user_id: B })], cap: 1 });
    assert.equal(await f.run(["flag-status", ID, "no_change"]), 1);
    assert.match(f.text(), /matches several players.*--user/);
    assert.deepEqual(f.requests.map(r => r.method), ["GET"]);
  });

  it("uses --user on reads and writes and leaves the other matching player untouched", async () => {
    const f = fixture({ rows: [flag(), flag({ user_id: B })] });
    assert.equal(await f.run(["flag-status", ID, "needs_owner", "--user", B, "Needs clinical review"]), 0);
    assert.ok(f.requests.every(r => r.url.searchParams.get("user_id") === `eq.${B}`));
    assert.equal(f.rows[0].status, "open"); assert.equal(f.rows[1].status, "needs_owner");
  });

  it("refuses a missing flag without any write", async () => {
    const f = fixture({ rows: [] });
    assert.equal(await f.run(["flag-status", ID, "open"]), 1);
    assert.match(f.text(), /exactly one player/); assert.equal(f.requests.length, 1);
  });

  it("validates CLI syntax before reading credentials or sending requests", async () => {
    const f = fixture();
    for (const args of [[], [ID], [ID, "done"], ["bad", "open"], [ID, "fixed_in_version"],
      [ID, "fixed_in_version", "--version", " "], [ID, "fixed_in_version", "--version", "x".repeat(81)],
      [ID, "open", "--version", "live"], [ID, "open", "--user", "bad"], [ID, "open", "--user"],
      [ID, "open", "--user", A, "--user", B], [ID, "open", "x".repeat(501)], [ID, "open", "a", "b"],
      ["--file", FILE, "--version", "live"], ["--file", FILE, ID, "open"], [ID, "open", "--unknown"]]) {
      assert.equal(await f.run(["flag-status", ...args]), 1, JSON.stringify(args));
    }
    assert.equal(f.reads.length, 0); assert.equal(f.requests.length, 0);
  });

  it("matches PostgreSQL character limits for Unicode versions and notes", () => {
    assert.equal(parseFlagStatusFile(JSON.stringify([{ flagId: ID, status: "fixed_in_version", version: "🌱".repeat(80), note: "🌱".repeat(500) }]))[0].note.length, 1000);
    assert.throws(() => parseFlagStatusFile(JSON.stringify([{ flagId: ID, status: "fixed_in_version", version: "🌱".repeat(81) }])), /80 characters/);
  });

  it("validates all JSON rows before credentials, lookups or writes", async () => {
    for (const value of ["bad JSON", "{}", "[]", JSON.stringify([{ flagId: ID, status: "open" }, { flagId: OTHER, status: "fixed_in_version" }]),
      JSON.stringify([{ flagId: ID, status: "open", version: "invalid" }]), JSON.stringify([{ flagId: ID, status: "open", note: null }]),
      JSON.stringify([{ flagId: ID, status: "open" }, { flagId: OTHER, status: "needs_owner", note: "invalid\0note" }]),
      JSON.stringify([{ flagId: ID, status: "open" }, { flagId: OTHER, status: "needs_owner", note: "\ud800" }]),
      JSON.stringify([{ flagId: ID, status: "open", user: A }]), JSON.stringify([{ flagId: ID, status: "open" }, { flagId: ID.toUpperCase(), status: "no_change" }])]) {
      const f = fixture({ file: value });
      assert.equal(await f.run(["flag-status", "--file", FILE]), 1);
      assert.deepEqual(f.reads, [FILE]); assert.equal(f.requests.length, 0);
    }
    assert.throws(() => parseFlagStatusFile(" ".repeat(1_048_577)), /too large/);
    assert.throws(() => parseFlagStatusFile(JSON.stringify(Array(1001).fill({ flagId: ID, status: "open" }))), /1-1000/);
  });

  it("preflights every batch identity before the first write, then confirms every row", async () => {
    const entries = [{ flagId: ID, status: "fixed_in_version", version: "live.36", note: "Live fix" }, { flagId: OTHER, status: "no_change" }];
    const f = fixture({ file: JSON.stringify(entries), rows: [flag(), flag({ flag_id: OTHER })] });
    assert.equal(await f.run(["flag-status", "--file", FILE, "--user", A]), 0);
    assert.deepEqual(f.requests.map(r => r.method), ["GET", "GET", "PATCH", "GET", "PATCH", "GET"]);
    assert.equal(f.rows[0].fixed_in_version, "live.36"); assert.equal(f.rows[1].fixed_in_version, null);
    assert.equal((f.text().match(/Confirmed by read-back/g) ?? []).length, 2);
    assert.ok(f.requests.every(r => r.url.searchParams.get("user_id") === `eq.${A}`));
  });

  for (const rows of [[flag()], [flag(), flag({ flag_id: OTHER }), flag({ flag_id: OTHER, user_id: B })]]) {
    it("does not write an earlier valid target when a later target is missing/ambiguous", async () => {
      const f = fixture({ rows, file: JSON.stringify([{ flagId: ID, status: "open" }, { flagId: OTHER, status: "open" }]) });
      assert.equal(await f.run(["flag-status", "--file", FILE]), 1);
      assert.deepEqual(f.requests.map(r => r.method), ["GET", "GET"]);
    });
  }

  it("handles unreadable files without credentials or requests", async () => {
    const f = fixture({ fileError: true });
    assert.equal(await f.run(["flag-status", "--file", FILE]), 1);
    assert.deepEqual(f.reads, [FILE]); assert.equal(f.requests.length, 0); assert.ok(!f.text().includes(KEY));
  });

  for (const field of ["status", "fixed_in_version", "resolution_note", "resolved_at", "user_id", "flag_id"]) {
    it(`withholds success for an incorrect read-back ${field}`, async () => {
      const f = fixture({ intercept: (r, requests, rows) => requests.length === 3 ? response([{ ...rows[0], [field]: null }], 200, 1) : undefined });
      assert.equal(await f.run(["flag-status", ID, "fixed_in_version", "--version", "live.36", "Live"]), 1);
      assert.match(f.text(), /could not be confirmed/); assert.doesNotMatch(f.text(), /Confirmed by read-back\./);
      assert.equal(f.requests.length, 3);
    });
  }

  for (const failAt of [1, 2, 3]) it(`does not claim success when request ${failAt} fails`, async () => {
    const f = fixture({ intercept: (r, requests) => requests.length === failAt ? response({ message: KEY }, 503) : undefined });
    assert.equal(await f.run(["flag-status", ID, "open"]), 1);
    assert.doesNotMatch(f.text(), /Confirmed by read-back\./); assert.ok(!f.text().includes(KEY));
    assert.equal(f.requests.length, failAt);
  });

  it("stops a partially written batch and identifies only the previously confirmed prefix", async () => {
    const f = fixture({ rows: [flag(), flag({ flag_id: OTHER })],
      file: JSON.stringify([{ flagId: ID, status: "no_change" }, { flagId: OTHER, status: "needs_owner" }]),
      intercept: (r, requests) => requests.length === 5 ? response({ message: KEY }, 403) : undefined });
    assert.equal(await f.run(["flag-status", "--file", FILE]), 1);
    assert.match(f.text(), /1 earlier update\(s\) were confirmed by read-back; no later writes/);
    assert.equal(f.rows[0].status, "no_change"); assert.equal(f.rows[1].status, "open");
    assert.equal(f.requests.length, 5); assert.doesNotMatch(f.text(), /Confirmed by read-back\./);
  });

  it("validates direct fake-client calls before touching the client", async () => {
    const client = { from() { assert.fail("Invalid input cannot make a request"); } };
    await assert.rejects(setQuestionFlagStatuses(client, [{ flagId: ID, status: "fixed_in_version" }]), /version/);
    assert.deepEqual(parseCommand(["flag-status", ID, "open", "--user", A]), { command: "flag-status", flagId: ID, status: "open", user: A });
  });
});
