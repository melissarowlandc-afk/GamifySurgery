import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { ADMIN_ENV_FILE, parseCommand, runBetaInvites } from "./beta-invites.mjs";

const BASE = "https://synthetic.supabase.co", KEY = "synthetic-owner-secret-never-print";
const ID = "11111111-1111-4111-8111-111111111111", OTHER = "22222222-2222-4222-8222-222222222222";
const EMAIL = "owner@example.invalid";
const member = (user_id = ID, email = EMAIL) => ({ user_id, email, confirmed_at: "2026-10-17T00:00:00Z", revoked_at: null, deletion_requested_at: null });
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });
function fixture({ roster = [member(), member(OTHER, "tester@example.invalid")], accounts = [{ userId: ID, enabled: true }, { userId: OTHER, enabled: false }],
  writes = false, enrollments = false, defaultEnabled = false, intercept = () => undefined, envError = false } = {}) {
  const requests = [], output = [], reads = [];
  let currentWrites = writes, currentEnrollments = enrollments, currentDefault = defaultEnabled;
  const status = () => ({ quota: { writes_enabled: currentWrites, enrollments_enabled: currentEnrollments, default_account_enabled: currentDefault }, accountSettings: accounts });
  const run = args => runBetaInvites(args, {
    readFileImpl: async (path, encoding) => { reads.push([path, encoding]); assert.equal(path, ADMIN_ENV_FILE); if (envError) throw new Error(KEY); return `SUPABASE_URL=${BASE}\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`; },
    write: text => output.push(text),
    fetchImpl: async (input, init) => {
      const url = new URL(input); assert.equal(url.origin, BASE); assert.equal(init.method, "POST");
      assert.equal(new Headers(init.headers).get("apikey"), KEY); assert.equal(new Headers(init.headers).get("authorization"), `Bearer ${KEY}`);
      const request = { path: url.pathname, body: JSON.parse(init.body) }; requests.push(request);
      const custom = await intercept(request); if (custom !== undefined) return custom;
      if (request.path === "/rest/v1/rpc/beta1_admin_members") { assert.deepEqual(request.body, { p_action: "list" }); return json(roster); }
      assert.equal(request.path, "/rest/v1/rpc/beta2_admin_cloud", "No direct tables, Auth admin or other RPCs allowed");
      if (request.body.p_action === "inspect") return json(status());
      if (request.body.p_action === "account") return json({ userId: request.body.p_user_id, enabled: request.body.p_settings.enabled });
      assert.equal(request.body.p_action, "configure");
      currentWrites = request.body.p_settings.writesEnabled; currentEnrollments = request.body.p_settings.enrollmentsEnabled;
      currentDefault = request.body.p_settings.defaultAccountEnabled;
      return json(status());
    },
  });
  return { run, requests, output, reads, text: () => output.join("\n") };
}

describe("cloud cohort owner commands, mocked fetch only", () => {
  it("parses exactly the supported commands and normalizes a single email", () => {
    assert.deepEqual(parseCommand(["cloud", "status"]), { command: "cloud", action: "status" });
    for (const action of ["enable", "disable"]) assert.deepEqual(parseCommand(["cloud", action, " Owner@Example.Invalid "]), { command: "cloud", action, email: EMAIL });
    for (const action of ["writes", "enrollments", "default"]) for (const value of ["on", "off"]) {
      assert.deepEqual(parseCommand(["cloud", action, value]), { command: "cloud", action, enabled: value === "on" });
    }
  });
  for (const args of [["cloud"], ["cloud", "status", EMAIL], ["cloud", "enable"], ["cloud", "enable", "bad address"],
    ["cloud", "disable", EMAIL, "extra"], ["cloud", "writes", "true"], ["cloud", "enrollments", "ON"],
    ["cloud", "default"], ["cloud", "default", "true"], ["cloud", "default", "ON"], ["cloud", "default", "on", "extra"],
    ["cloud", "purge"], ["cloud", "enable", "all"]]) {
    it(`rejects unsupported arguments before reading credentials: ${args.join(" ")}`, async () => {
      const f = fixture(); assert.equal(await f.run(args), 1); assert.equal(f.reads.length, 0); assert.equal(f.requests.length, 0);
    });
  }
  it("reports all three switches and each configured account without dumping provider data", async () => {
    const f = fixture({ writes: true }); assert.equal(await f.run(["cloud", "status"]), 0);
    assert.equal(f.text(), `Cloud writes: on\nCloud enrollments: off\nCloud account default: off\nEmail / account | Cloud enabled\n${EMAIL} | yes\ntester@example.invalid | no`);
    assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "inspect" }, { p_action: "list" }]);
    assert.deepEqual(f.reads, [[ADMIN_ENV_FILE, "utf8"]]); assert.ok(!f.text().includes(KEY));
  });
  for (const defaultEnabled of [false, true]) {
    it(`reports an empty cohort with default ${defaultEnabled} without enabling or enrolling anyone`, async () => {
      const f = fixture({ accounts: [], roster: [], defaultEnabled }); assert.equal(await f.run(["cloud", "status"]), 0);
      assert.match(f.text(), /No cloud accounts configured. Admitted accounts use the default/);
      assert.ok(f.text().includes(`Cloud account default: ${defaultEnabled ? "on" : "off"}`));
      assert.ok(f.requests.every(r => ["inspect", "list"].includes(r.body.p_action)));
    });
  }
  it("reports an explicit disabled override alongside a default-on setting", async () => {
    const f = fixture({ defaultEnabled: true }); assert.equal(await f.run(["cloud", "status"]), 0);
    assert.match(f.text(), /Cloud account default: on/); assert.match(f.text(), /tester@example.invalid \| no/);
  });
  it("shows a UUID when a configured account is absent from the membership roster", async () => {
    const f = fixture({ roster: [] }); assert.equal(await f.run(["cloud", "status"]), 0); assert.match(f.text(), new RegExp(`${ID} \\| yes`));
  });
  for (const action of ["enable", "disable"]) {
    it(`${action} targets only the UUID belonging to the requested email`, async () => {
      const f = fixture(); assert.equal(await f.run(["cloud", action, " Owner@Example.Invalid "]), 0);
      assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "list" }, { p_action: "account", p_user_id: ID, p_settings: { enabled: action === "enable" } }]);
      assert.equal(f.text(), `Cloud saves ${action === "enable" ? "enabled" : "disabled"} for ${EMAIL}.`);
      assert.ok(!f.text().includes(KEY));
    });
  }
  it("refuses an unknown address without creating membership, consent or a cloud account", async () => {
    const f = fixture(); assert.equal(await f.run(["cloud", "enable", "absent@example.invalid"]), 1);
    assert.equal(f.requests.length, 1); assert.match(f.text(), /No invited game membership/);
  });
  for (const roster of [[member(), member(OTHER, EMAIL.toUpperCase())], [member(), member(ID, "other@example.invalid")],
    [{ user_id: "bad", email: EMAIL }], [member(ID, "bad\nemail")]]) {
    it("rejects a malformed or ambiguous roster before any account mutation", async () => {
      const f = fixture({ roster }); assert.equal(await f.run(["cloud", "enable", EMAIL]), 1);
      assert.equal(f.requests.length, 1); assert.match(f.text(), /unexpected or ambiguous/);
    });
  }
  for (const action of ["writes", "enrollments"]) for (const initialOther of [false, true]) for (const defaultEnabled of [false, true]) for (const value of ["on", "off"]) {
    it(`${action} ${value} preserves the opposite switch (${initialOther}) and account default (${defaultEnabled})`, async () => {
      const f = fixture({ writes: action === "enrollments" ? initialOther : value === "off", enrollments: action === "writes" ? initialOther : value === "off", defaultEnabled });
      assert.equal(await f.run(["cloud", action, value]), 0);
      const settings = { writesEnabled: action === "writes" ? value === "on" : initialOther, enrollmentsEnabled: action === "enrollments" ? value === "on" : initialOther, defaultAccountEnabled: defaultEnabled };
      assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "inspect" }, { p_action: "configure", p_settings: settings }]);
      assert.match(f.text(), /Cloud writes: (on|off)\nCloud enrollments: (on|off)/); assert.ok(!f.text().includes(KEY));
    });
  }
  for (const writes of [false, true]) for (const enrollments of [false, true]) for (const value of ["on", "off"]) {
    it(`default ${value} preserves writes (${writes}) and enrollments (${enrollments})`, async () => {
      const f = fixture({ writes, enrollments, defaultEnabled: value === "off" });
      assert.equal(await f.run(["cloud", "default", value]), 0);
      assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "inspect" }, { p_action: "configure", p_settings: {
        writesEnabled: writes, enrollmentsEnabled: enrollments, defaultAccountEnabled: value === "on",
      } }]);
      assert.equal(f.text(), `Cloud writes: ${writes ? "on" : "off"}\nCloud enrollments: ${enrollments ? "on" : "off"}\nCloud account default: ${value}`);
      assert.ok(!f.text().includes(KEY));
    });
  }
  for (const payload of [{}, { quota: { writes_enabled: "false", enrollments_enabled: false, default_account_enabled: false } },
    { quota: { writes_enabled: false } }, { quota: { writes_enabled: false, enrollments_enabled: false } },
    { quota: { writes_enabled: false, enrollments_enabled: false, default_account_enabled: "false" } },
    { quota: { writes_enabled: false, enrollments_enabled: false, default_account_enabled: null } }]) {
    it("does not guess a missing or malformed project setting", async () => {
      const f = fixture({ intercept: r => r.body.p_action === "inspect" ? json(payload) : undefined });
      assert.equal(await f.run(["cloud", "writes", "on"]), 1); assert.equal(f.requests.length, 1); assert.match(f.text(), /settings response was unexpected/);
    });
  }
  for (const accounts of [null, [{ userId: ID }], [{ userId: "bad", enabled: true }], [{ userId: ID, enabled: true }, { userId: ID, enabled: false }]]) {
    it("fails status closed if the account list is missing or malformed", async () => {
      const f = fixture({ accounts }); assert.equal(await f.run(["cloud", "status"]), 1); assert.equal(f.requests.length, 1);
      assert.match(f.text(), /20261027000100_beta2_default_enabled\.sql/); assert.ok(!f.text().includes(EMAIL));
    });
  }
  it("does not report success for a mismatched account acknowledgement", async () => {
    const f = fixture({ intercept: r => r.body.p_action === "account" ? json({ userId: OTHER, enabled: true }) : undefined });
    assert.equal(await f.run(["cloud", "enable", EMAIL]), 1); assert.match(f.text(), /could not be confirmed/); assert.ok(!f.text().includes(`enabled for ${EMAIL}`));
  });
  it("does not report success if configure fails to acknowledge the requested writes setting", async () => {
    const f = fixture({ intercept: r => r.body.p_action === "configure" ? json({ quota: { writes_enabled: false, enrollments_enabled: false, default_account_enabled: false } }) : undefined });
    assert.equal(await f.run(["cloud", "writes", "on"]), 1); assert.match(f.text(), /could not be confirmed/);
  });
  for (const field of ["writes_enabled", "enrollments_enabled", "default_account_enabled"]) {
    it(`does not confirm default on if configure acknowledges a different ${field}`, async () => {
      const f = fixture({ writes: true, enrollments: true, intercept: r => r.body.p_action === "configure" ? json({ quota: {
        writes_enabled: true, enrollments_enabled: true, default_account_enabled: true, [field]: false,
      } }) : undefined });
      assert.equal(await f.run(["cloud", "default", "on"]), 1); assert.match(f.text(), /could not be confirmed/);
      assert.ok(!f.text().includes("Cloud account default: on"));
    });
  }
  for (const mode of ["provider", "transport"]) {
    it(`redacts ${mode} failures without reflecting keys or error bodies`, async () => {
      const f = fixture({ intercept: () => { if (mode === "transport") throw new Error(KEY + " private payload"); return json({ code: "42501", message: KEY + " private payload" }, 403); } });
      assert.equal(await f.run(["cloud", "status"]), 1); assert.ok(!f.text().includes(KEY)); assert.ok(!f.text().includes("private payload"));
      assert.equal(f.output.length, 1);
    });
  }
  it("keeps the existing output redaction even if a roster field contains the key", async () => {
    const f = fixture({ roster: [member(ID, `${KEY}@example.invalid`)] }); assert.equal(await f.run(["cloud", "status"]), 0);
    assert.ok(!f.text().includes(KEY)); assert.match(f.text(), /REDACTED/);
  });
  it("reports private-env read failure without provider output or requests", async () => {
    const f = fixture({ envError: true }); assert.equal(await f.run(["cloud", "status"]), 1); assert.equal(f.requests.length, 0); assert.ok(!f.text().includes(KEY));
  });
  it("only extends the applied admin function with a service-only account-settings result", async () => {
    const original = await readFile(new URL("../../supabase/migrations/20261018000100_beta2_cloud_saves.sql", import.meta.url), "utf8");
    const prepared = await readFile(new URL("./install-cloud-status-rpc.sql", import.meta.url), "utf8");
    const extract = text => text.match(/create (?:or replace )?function gamify_private\.beta2_admin_cloud\([\s\S]*?\n\$\$;/)[0].replace("create or replace function", "create function");
    const addition = "'accountSettings',coalesce((select jsonb_agg(jsonb_build_object('userId',user_id,'enabled',enabled) order by user_id)\n      from gamify_private.beta2_cloud_accounts),'[]'::jsonb),\n    ";
    assert.ok(prepared.includes(addition)); assert.equal(extract(prepared).replace(addition, ""), extract(original));
    assert.match(prepared, /revoke all on function gamify_private\.beta2_admin_cloud\(text,uuid,jsonb\) from public, anon, authenticated/);
    assert.match(prepared, /grant execute on function gamify_private\.beta2_admin_cloud\(text,uuid,jsonb\) to service_role/);
    assert.ok(prepared.trimEnd().endsWith("commit;"));
  });
});
