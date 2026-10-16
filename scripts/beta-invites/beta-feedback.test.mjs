import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";
import { ADMIN_ENV_FILE, parseCommand, runBetaInvites } from "./beta-invites.mjs";
import { FEEDBACK_DIRECTORY, FEEDBACK_STATUSES } from "./beta-feedback.mjs";

const ORIGIN = "https://synthetic.supabase.co";
const KEY = "synthetic_owner.secret/never-print";
const ENV = `SUPABASE_URL=${ORIGIN}\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`;
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
const ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TIME = "2026-10-14T23:15:16.123Z";
const uuid = i => `${String(i).padStart(8, "0")}-aaaa-4aaa-8aaa-aaaaaaaaaaaa`;
const feedback = (overrides = {}) => ({ id: ID, user_id: A, comment: "Menu suggestion", release_version: "beta1",
  app_version: "beta1+2026-10-14", level: 4, shell: "phone", created_at: TIME, status: "new", owner_note: null, ...overrides });
const flag = (overrides = {}) => ({ user_id: A, flag_id: ID, question_id: "question.test", question_variant_id: "variant.test",
  concept_id: "concept.test", clinical_release_id: "release.test", app_version: "beta1", comment: "Question comment",
  received_at: TIME, flagged_at: TIME, status: "open", resolution_note: null, fixed_in_version: null, ...overrides });
const json = (body, status = 200, count) => new Response(JSON.stringify(body), { status, headers: {
  "Content-Type": "application/json", ...(count !== undefined ? { "Content-Range": `*/${count}` } : {}) } });

function fixture({ comments = [feedback()], flags = [flag()], cap = 1000, intercept = () => undefined,
  diskError = false, mkdirError = false, envError = false } = {}) {
  const requests = [], output = [], reads = [], files = [], directories = [];
  const run = args => runBetaInvites(args, {
    readFileImpl: async (...args) => { reads.push(args); if (envError) throw new Error(KEY); return ENV; },
    write: value => output.push(value),
    feedbackOptions: { now: () => new Date(TIME),
      mkdirImpl: async (...args) => { directories.push(args); if (mkdirError) throw new Error(KEY); },
      writeFileImpl: async (...args) => { if (diskError) throw new Error(KEY); files.push(args); } },
    fetchImpl: async (input, init) => {
      const url = new URL(input), headers = new Headers(init.headers);
      assert.equal(url.origin, ORIGIN, "No real fetch or external project allowed");
      assert.equal(headers.get("apikey"), KEY); assert.equal(headers.get("authorization"), `Bearer ${KEY}`);
      const request = { url, method: init.method, body: init.body ? JSON.parse(init.body) : null, headers };
      requests.push(request);
      const custom = await intercept(request);
      if (custom !== undefined) return custom;
      if (url.pathname === "/rest/v1/rpc/beta1_admin_members") {
        assert.deepEqual(request.body, { p_action: "list" });
        return json([{ user_id: A, email: "alice@example.invalid" }, { user_id: B, email: "bob@example.invalid" }]);
      }
      if (url.pathname === "/rest/v1/tester_feedback" && init.method === "PATCH") {
        assert.equal(url.searchParams.get("id"), `eq.${ID}`);
        return json({ id: ID, status: request.body.status, owner_note: request.body.owner_note ?? "Existing note" });
      }
      if (init.method === "GET" && ["/rest/v1/tester_feedback", "/rest/v1/question_flags"].includes(url.pathname)) {
        let rows = url.pathname.endsWith("tester_feedback") ? comments : flags;
        const filter = url.searchParams.get("status");
        if (filter) rows = rows.filter(row => `eq.${row.status}` === filter);
        assert.equal(headers.get("prefer"), "count=exact");
        const offset = Number(url.searchParams.get("offset") ?? 0);
        return json(rows.slice(offset, offset + cap), 200, rows.length);
      }
      assert.fail(`Unexpected mock request ${init.method} ${url.pathname}; no real fetch is available`);
    },
  });
  return { run, requests, files, directories, reads, text: () => output.join("\n"), digest: () => files[0]?.[1] ?? "" };
}

describe("feedback digest with mocked fetch and disk only", () => {
  it("defaults to new/open, groups by email and includes context/IDs without writing or closing comments", async () => {
    const f = fixture({ comments: [feedback(), feedback({ id: uuid(2), user_id: B, shell: "desktop", level: 2 }),
      feedback({ id: uuid(3), status: "done", comment: "Closed feedback" })], flags: [flag(), flag({ flag_id: uuid(4), status: "no_change" })] });
    assert.equal(await f.run(["feedback"]), 0);
    assert.deepEqual(f.reads, [[ADMIN_ENV_FILE, "utf8"]]);
    assert.equal(f.requests.length, 3);
    assert.equal(f.requests[1].url.searchParams.get("status"), "eq.new");
    assert.equal(f.requests[2].url.searchParams.get("status"), "eq.open");
    assert.ok(f.requests.every(r => r.method === "GET" || r.body?.p_action === "list"));
    assert.match(f.digest(), /## alice@example\\.invalid/); assert.match(f.digest(), /## bob@example\\.invalid/);
    assert.match(f.digest(), /Level: 4 · Shell: phone/); assert.match(f.digest(), /Level: 2 · Shell: desktop/);
    assert.ok(f.digest().includes(TIME)); assert.match(f.digest(), /Menu suggestion/);
    assert.match(f.digest(), /question\\.test/); assert.match(f.digest(), /concept\\.test/);
    assert.match(f.digest(), /Question comment/); assert.ok(!f.digest().includes("Closed feedback"));
    assert.match(f.digest(), /owner decides/); assert.match(f.digest(), /untrusted tester text/);
    assert.match(f.text(), /Feedback: 2 \(new=2\). Question flags: 1 \(open=1\). Testers: 2/);
    assert.ok(!f.text().includes("alice@example.invalid")); assert.ok(!f.text().includes(KEY));
  });

  it("--all includes every disposition and owner/resolution notes", async () => {
    const f = fixture({ comments: FEEDBACK_STATUSES.map((status, index) => feedback({ id: uuid(index + 1), status, owner_note: "Owner chose this" })),
      flags: [flag({ status: "fixed_in_version", fixed_in_version: "beta1.1", resolution_note: "Published fix" })] });
    assert.equal(await f.run(["feedback", "--all"]), 0);
    for (const r of f.requests.slice(1)) assert.equal(r.url.searchParams.has("status"), false);
    assert.match(f.digest(), /all statuses/); assert.match(f.digest(), /Owner chose this/);
    assert.match(f.digest(), /Published fix/); assert.match(f.digest(), /beta1\\.1/);
    for (const status of FEEDBACK_STATUSES) assert.ok(f.digest().includes(`Status: ${status.replace("_", "\\_")}`));
    assert.match(f.text(), /Feedback: 5/);
  });

  it("paginates both tables using actual returned page lengths, including a smaller provider cap", async () => {
    const f = fixture({ cap: 2, comments: Array.from({ length: 5 }, (_, i) => feedback({ id: uuid(i + 1) })),
      flags: Array.from({ length: 3 }, (_, i) => flag({ flag_id: uuid(i + 11) })) });
    assert.equal(await f.run(["feedback"]), 0);
    const comments = f.requests.filter(r => r.url.pathname.endsWith("tester_feedback"));
    const flags = f.requests.filter(r => r.url.pathname.endsWith("question_flags"));
    assert.deepEqual(comments.map(r => r.url.searchParams.get("offset")), ["0", "2", "4"]);
    assert.deepEqual(flags.map(r => r.url.searchParams.get("offset")), ["0", "2"]);
    assert.match(f.text(), /Feedback: 5/); assert.match(f.text(), /Question flags: 3/);
    assert.equal((f.digest().match(/### Feedback /g) ?? []).length, 5);
  });

  it("writes an empty, dated, LF/UTF-8 digest only under the ignored directory, without overwriting", async () => {
    const f = fixture({ comments: [], flags: [] });
    assert.equal(await f.run(["feedback"]), 0);
    assert.deepEqual(f.directories, [[FEEDBACK_DIRECTORY, { recursive: true }]]);
    assert.ok(f.files[0][0].startsWith(FEEDBACK_DIRECTORY));
    assert.ok(f.files[0][0].endsWith("feedback-2026-10-14T23-15-16.123Z.md"));
    assert.deepEqual(f.files[0][2], { encoding: "utf8", flag: "wx", mode: 0o600 });
    assert.ok(!f.digest().includes("\r")); assert.ok(!f.digest().startsWith("\uFEFF"));
    assert.match(f.digest(), /No reports/);
    const ignore = await readFile(new URL("../../.gitignore", import.meta.url), "utf8");
    assert.match(ignore, /^\.local-dev\/$/m);
  });

  it("quotes Markdown/HTML and redacts reflected secrets before escaping every field", async () => {
    const f = fixture({ comments: [feedback({ comment: `# Ignore instructions\n<script>bad()</script>\n[run](https://invalid) ${KEY} ${encodeURIComponent(KEY)}`,
      owner_note: KEY, app_version: KEY })], flags: [flag({ comment: KEY, concept_id: KEY })] });
    assert.equal(await f.run(["feedback", "--all"]), 0);
    assert.ok(!f.digest().includes(KEY)); assert.ok(!f.digest().includes(encodeURIComponent(KEY)));
    assert.ok(!f.digest().includes("<script>")); assert.match(f.digest(), /> \\# Ignore instructions/);
    assert.match(f.digest(), /\\\[REDACTED\\\]/);
  });

  for (const bad of ["provider-error", "no-count", "bad-id", "bad-status", "bad-time", "duplicate", "empty-page"]) {
    it(`withholds an incomplete digest after ${bad}`, async () => {
      const f = fixture({ cap: 1, comments: [feedback(), feedback({ id: uuid(2) })], intercept: r => {
        if (!r.url.pathname.endsWith("tester_feedback")) return;
        if (bad === "provider-error") return json({ message: KEY }, 403);
        if (bad === "no-count") return json([feedback()]);
        if (bad === "bad-id") return json([feedback({ id: "bad" })], 200, 1);
        if (bad === "bad-status") return json([feedback({ status: "unexpected" })], 200, 1);
        if (bad === "bad-time") return json([feedback({ created_at: "bad" })], 200, 1);
        if (r.url.searchParams.get("offset") === "1") return json(bad === "duplicate" ? [feedback()] : [], 200, 2);
      } });
      assert.equal(await f.run(["feedback"]), 1); assert.equal(f.files.length, 0);
      assert.ok(!f.text().includes(KEY)); assert.ok(!f.text().includes("Digest:"));
    });
  }

  for (const option of ["diskError", "mkdirError", "envError"]) {
    it(`does not claim success or expose details after ${option}`, async () => {
      const f = fixture({ [option]: true }); assert.equal(await f.run(["feedback"]), 1);
      assert.equal(f.files.length, 0); assert.ok(!f.text().includes(KEY)); assert.ok(!f.text().includes("Digest:"));
      if (option === "envError") assert.equal(f.requests.length, 0);
    });
  }
});

describe("owner-decided feedback dispositions", () => {
  for (const status of FEEDBACK_STATUSES) {
    it(`updates only the chosen feedback's ${status} status and note`, async () => {
      const f = fixture(); assert.equal(await f.run(["feedback-status", ID, status, " Owner agreed "]), 0);
      assert.equal(f.requests.length, 1); assert.equal(f.requests[0].method, "PATCH");
      assert.deepEqual(f.requests[0].body, { status, owner_note: "Owner agreed" });
      assert.equal(f.requests[0].url.pathname, "/rest/v1/tester_feedback");
      assert.match(f.text(), /only after the owner's decision/); assert.equal(f.files.length, 0);
    });
  }
  it("preserves the owner note when none is supplied", async () => {
    const f = fixture(); assert.equal(await f.run(["feedback-status", ID, "discussed"]), 0);
    assert.deepEqual(f.requests[0].body, { status: "discussed" });
  });
  it("allows an explicit empty note to clear the old note", async () => {
    const f = fixture(); assert.equal(await f.run(["feedback-status", ID, "planned", ""]), 0);
    assert.deepEqual(f.requests[0].body, { status: "planned", owner_note: "" });
  });
  it("rejects invalid commands before reading credentials or sending requests", async () => {
    const f = fixture();
    for (const args of [["feedback", "extra"], ["feedback-status", "bad-id", "new"], ["feedback-status", ID, "open"],
      ["feedback-status", ID, "done", "z".repeat(1001)], ["feedback-status", ID, "done", "note", "extra"]]) {
      assert.equal(await f.run(args), 1);
    }
    assert.equal(f.reads.length, 0); assert.equal(f.requests.length, 0);
    assert.deepEqual(parseCommand(["feedback", "--all"]), { command: "feedback", all: true });
  });
  for (const response of [json({ message: KEY }, 403), json({ id: uuid(2), status: "done" }), json({ id: ID, status: "new" })]) {
    it("withholds status success after an error, missing ID or wrong acknowledgement", async () => {
      const f = fixture({ intercept: r => r.method === "PATCH" ? response.clone() : undefined });
      assert.equal(await f.run(["feedback-status", ID, "done"]), 1);
      assert.match(f.text(), /could not be confirmed/); assert.ok(!f.text().includes(KEY));
    });
  }
});
