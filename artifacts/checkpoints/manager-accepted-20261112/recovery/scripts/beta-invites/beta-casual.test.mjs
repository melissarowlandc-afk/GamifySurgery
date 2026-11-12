import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { parseCommand, runBetaInvites } from "./beta-invites.mjs";

const ID = "c2800000-0000-4000-8000-000000000001";
const EMAIL = "casual@example.invalid", KEY = "synthetic-secret-never-print";
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const member = { user_id: ID, email: EMAIL, casual: false, is_owner: false, confirmed_at: "2026-10-28T00:00:00Z" };
const row = { user_id: ID, email: EMAIL, casual: true, playtime_seconds: 90.5, question_count: 7 };
function fixture({ roster = [member], report = [row], intercept = () => undefined } = {}) {
  const requests = [], output = [];
  return { requests, output, text: () => output.join("\n"), run: args => runBetaInvites(args, {
    readFileImpl: async () => `SUPABASE_URL=https://synthetic.supabase.co\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`,
    write: line => output.push(line),
    fetchImpl: async (input, init) => {
      const url = new URL(input); assert.equal(url.origin, "https://synthetic.supabase.co");
      assert.equal(new Headers(init.headers).get("Authorization"), `Bearer ${KEY}`);
      const request = { path: url.pathname, method: init.method, body: init.body ? JSON.parse(init.body) : null };
      requests.push(request);
      const custom = await intercept(request); if (custom !== undefined) return custom;
      assert.equal(init.method, "POST", "Only service-role RPCs, no table/Auth writes");
      if (request.path === "/rest/v1/rpc/beta1_admin_members") return json(roster);
      if (request.path === "/rest/v1/rpc/beta1_setup_admin") return json([]);
      if (request.path === "/rest/v1/rpc/beta1_admin_set_casual") return json({ user_id: ID, casual: request.body.p_casual });
      if (request.path === "/rest/v1/rpc/beta1_admin_usage_report") return json(report);
      assert.fail(`Unexpected mocked route ${request.path}`);
    },
  }) };
}

describe("owner casual controls and report (mocked fetch only)", () => {
  for (const enabled of [true, false]) it(`sets casual ${enabled ? "on" : "off"} for the resolved membership only`, async () => {
    const f = fixture(); assert.equal(await f.run(["casual", enabled ? "on" : "off", " Casual@Example.Invalid "]), 0);
    assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "list" }, { p_user_id: ID, p_casual: enabled }]);
    assert.match(f.text(), new RegExp(`Casual mode ${enabled ? "on" : "off"} for ${EMAIL}`));
    assert.match(f.text(), /Reload the game/); assert.ok(!f.text().includes(KEY));
  });
  for (const args of [["casual"], ["casual", "true", EMAIL], ["casual", "on"], ["casual", "on", "bad"],
    ["casual", "off", EMAIL, "extra"], ["report", EMAIL]]) it(`rejects invalid arguments before any request: ${args.join(" ")}`, async () => {
    const f = fixture(); assert.equal(await f.run(args), 1); assert.equal(f.requests.length, 0);
  });
  it("parses exact on/off commands and the report", () => {
    assert.deepEqual(parseCommand(["casual", "on", EMAIL]), { command: "casual", enabled: true, email: EMAIL });
    assert.deepEqual(parseCommand(["report"]), { command: "report" });
  });
  it("does not auto-admit a missing member", async () => {
    const f = fixture({ roster: [] }); assert.equal(await f.run(["casual", "on", EMAIL]), 1);
    assert.equal(f.requests.length, 1); assert.match(f.text(), /No game membership/);
  });
  it("shows casual yes/no with membership status in list", async () => {
    const f = fixture({ roster: [member, { ...member, email: "other@example.invalid", casual: true }] });
    assert.equal(await f.run(["list"]), 0);
    assert.match(f.text(), /Email \| Invite\/confirmed status \| Owner \| Casual/);
    assert.ok(f.text().includes(`${EMAIL} | confirmed | no | no`));
    assert.ok(f.text().includes("other@example.invalid | confirmed | no | yes"));
  });
  it("fails explicitly on an old roster missing mode", async () => {
    const f = fixture({ roster: [{ ...member, casual: undefined }] });
    assert.equal(await f.run(["list"]), 1); assert.match(f.text(), /missing casual mode/);
    assert.equal(f.requests.length, 1);
  });
  for (const response of [{ user_id: ID, casual: false }, { user_id: "wrong", casual: true }, { user_id: ID, casual: "true" }, null]) {
    it("requires an exact account/mode acknowledgement", async () => {
      const f = fixture({ intercept: r => r.path.endsWith("beta1_admin_set_casual") ? json(response) : undefined });
      assert.equal(await f.run(["casual", "on", EMAIL]), 1); assert.match(f.text(), /could not be confirmed/);
      assert.ok(!f.text().includes("Casual mode on for"));
    });
  }
  it("prints retained totals for casual, standard and zero-usage members", async () => {
    const f = fixture({ report: [row, { ...row, email: "standard@example.invalid", casual: false, playtime_seconds: 0, question_count: 0 }] });
    assert.equal(await f.run(["report"]), 0); assert.equal(f.requests.length, 1);
    assert.equal(f.requests[0].path, "/rest/v1/rpc/beta1_admin_usage_report");
    assert.ok(f.text().includes(`${EMAIL} | 90.5 | 7 | yes`));
    assert.ok(f.text().includes("standard@example.invalid | 0 | 0 | no"));
    assert.match(f.text(), /90 UTC days/); assert.match(f.text(), /current account mode/);
    assert.ok(!f.text().includes(ID)); assert.ok(!f.text().includes(KEY));
  });
  it("shows an empty report clearly", async () => {
    const f = fixture({ report: [] }); assert.equal(await f.run(["report"]), 0); assert.match(f.text(), /No game members to report/);
  });
  for (const bad of [null, {}, [null], [{ ...row, casual: undefined }], [{ ...row, casual: "true" }],
    [{ ...row, playtime_seconds: "90" }], [{ ...row, playtime_seconds: -1 }], [{ ...row, question_count: 1.5 }],
    [{ ...row, email: "injected\n@example.invalid" }], [{ ...row, email: "injected\x00@example.invalid" }],
    [{ ...row, email: "injected\x7f@example.invalid" }], [{ ...row, email: "injected|@example.invalid" }], [{ ...row, user_id: "wrong" }]]) {
    it("withholds all totals when any report row is malformed", async () => {
      const f = fixture({ report: bad }); assert.equal(await f.run(["report"]), 1);
      assert.match(f.text(), /response was unexpected/); assert.ok(!f.text().includes(" | 90.5 | "));
    });
  }
  for (const command of [["casual", "on", EMAIL], ["report"]]) {
    it(`sanitizes provider errors and thrown failures for ${command[0]}`, async () => {
      for (const thrown of [false, true]) {
        const f = fixture({ intercept: r => {
          if (r.path.endsWith("beta1_admin_members")) return undefined;
          if (thrown) throw new Error(KEY);
          return json({ message: `${KEY} private provider detail` }, 403);
        } });
        assert.equal(await f.run(command), 1); assert.ok(!f.text().includes(KEY)); assert.ok(!f.text().includes("private provider detail"));
      }
    });
  }
});
