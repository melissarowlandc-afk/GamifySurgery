import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  ADMIN_ENV_FILE, GAME_URL, LOCAL_GAME_URL, REVOKE_BAN_DURATION,
  parseAdminEnv, parseCommand, parseEmailFile, runBetaInvites,
} from "./beta-invites.mjs";

const URL_BASE = "https://synthetic.supabase.co";
const KEY = "synthetic-owner-secret-never-print";
const ENV = `SUPABASE_URL=${URL_BASE}\nSUPABASE_SERVICE_ROLE_KEY=${KEY}\n`;
const ID = "11111111-1111-4111-8111-111111111111";
const EMAIL = "tester@example.org";
const TIMESTAMP = "2026-10-14T00:00:00Z";
const member = (overrides = {}) => ({ user_id: ID, email: EMAIL, invited_at: TIMESTAMP,
  confirmed_at: null, revoked_at: null, deletion_requested_at: null, banned_until: null, is_owner: false, ...overrides });
const setupCode = (overrides = {}) => ({ id: ID, email: EMAIL, purpose: "invite", created_at: TIMESTAMP,
  used_at: null, cancelled_at: null, failed_attempts: 0, ...overrides });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function fixture({ roster = [], codes = [], intercept = () => undefined, env = ENV, file = `${EMAIL}\nsecond@example.org\n`,
  randomBytesImpl, missingFile = false } = {}) {
  const requests = [], output = [], readCalls = [];
  const run = args => runBetaInvites(args, {
    readFileImpl: async (...args) => {
      readCalls.push(args);
      if (args[0] === ADMIN_ENV_FILE) return env;
      if (missingFile) throw new Error(KEY);
      return file;
    },
    ...(randomBytesImpl ? { randomBytesImpl } : {}),
    write: line => output.push(line),
    fetchImpl: async (input, init) => {
      const url = new URL(input);
      assert.equal(url.origin, URL_BASE, "Only mocked requests are allowed");
      assert.equal(new Headers(init.headers).get("apikey"), KEY);
      assert.equal(new Headers(init.headers).get("authorization"), `Bearer ${KEY}`);
      const body = init.body ? JSON.parse(init.body) : null;
      const request = { url, method: init.method, body };
      requests.push(request);
      const custom = await intercept(request);
      if (custom !== undefined) return custom;
      if (url.pathname === "/rest/v1/rpc/beta1_setup_admin") {
        assert.equal(init.method, "POST");
        if (body.p_action === "issue") return json({ id: ID, issued: true, purpose: body.p_purpose });
        if (body.p_action === "list") return json(codes);
        if (body.p_action === "cancel") return json({ cancelled: true });
      }
      if (url.pathname === "/rest/v1/rpc/beta1_admin_members") {
        if (body.p_action === "list") return json(roster);
        if (body.p_action === "revoke") return json({ user_id: body.p_user_id, revoked: true });
      }
      if (url.pathname === `/auth/v1/admin/users/${ID}`) {
        assert.equal(init.method, "PUT"); assert.deepEqual(body, { ban_duration: REVOKE_BAN_DURATION });
        return json({ id: ID, banned_until: "2199-01-01T00:00:00Z" });
      }
      assert.fail(`Unexpected mock route ${url.pathname}; provider link generation and real fetch are forbidden`);
    },
  });
  return { run, requests, readCalls, output, text: () => output.join("\n") };
}

describe("personal setup link tool, mocked fetch only", () => {
  for (const command of ["invite", "reset"]) {
    it(`${command} stores only a SHA-256 hash of 32 random bytes and prints exactly the Pages link`, async () => {
      const lengths = [];
      const f = fixture({ randomBytesImpl: size => { lengths.push(size); return Buffer.alloc(size, 0xfe); } });
      assert.equal(await f.run([command, " Tester@Example.Org "]), 0);
      assert.deepEqual(lengths, [32]); assert.deepEqual(f.readCalls, [[ADMIN_ENV_FILE, "utf8"]]);
      assert.equal(f.requests.length, 1);
      const link = new URL(f.text()), code = new URLSearchParams(link.hash.slice(1)).get("setup");
      assert.equal(link.origin + link.pathname, GAME_URL);
      assert.match(code, /^[A-Za-z0-9_-]{43}$/); assert.equal(Buffer.from(code, "base64url").length, 32);
      assert.equal(f.text(), `${GAME_URL}#setup=${code}&email=tester%40example.org`);
      assert.deepEqual(f.requests[0].body, { p_action: "issue", p_email: EMAIL,
        p_code_hash: createHash("sha256").update(code).digest("hex"), p_purpose: command, p_owner: false });
      assert.ok(!JSON.stringify(f.requests).includes(code)); assert.ok(!f.text().includes(KEY));
      assert.equal(f.output.length, 1); assert.ok(!f.text().includes("Outlook"));
    });
    it(`${command} --local uses the canonical owner origin`, async () => {
      const f = fixture(); assert.equal(await f.run([command, EMAIL, "--local"]), 0);
      assert.ok(f.text().startsWith(`${LOCAL_GAME_URL}#setup=`));
    });
  }
  it("uses fresh random codes on reissue, leaving cancellation to the serialized SQL RPC", async () => {
    const f = fixture(); await f.run(["invite", EMAIL]); await f.run(["invite", EMAIL]);
    assert.notEqual(f.output[0], f.output[1]); assert.notEqual(f.requests[0].body.p_code_hash, f.requests[1].body.p_code_hash);
  });
  it("records --owner only on a single invite for admission at claim time", async () => {
    const f = fixture(); assert.equal(await f.run(["invite", EMAIL, "--owner"]), 0);
    assert.equal(f.requests[0].body.p_owner, true); assert.equal(f.requests.length, 1);
    assert.ok(f.text().startsWith(GAME_URL));
  });
  it("validates the whole private file and prints email TAB link lines without a template", async () => {
    const f = fixture({ file: `\uFEFF Tester@Example.Org \r\n\r\nsecond+test@example.org\n` });
    assert.equal(await f.run(["invite", "--file", "synthetic-private-list.txt", "--local"]), 0);
    assert.deepEqual(f.readCalls, [[resolve("synthetic-private-list.txt"), "utf8"], [ADMIN_ENV_FILE, "utf8"]]);
    assert.equal(f.output.length, 2);
    for (const [index, email] of [EMAIL, "second+test@example.org"].entries()) {
      const [actual, link] = f.output[index].split("\t"); assert.equal(actual, email);
      assert.ok(link.startsWith(LOCAL_GAME_URL));
      assert.equal(new URLSearchParams(new URL(link).hash.slice(1)).get("email"), email);
      assert.equal(f.requests[index].body.p_email, email);
    }
  });
  for (const file of ["", `${EMAIL}\nBAD EMAIL\n`, `${EMAIL}\nTESTER@EXAMPLE.ORG\n`]) {
    it("rejects empty, malformed or duplicate batch rows before credentials or requests", async () => {
      const f = fixture({ file }); assert.equal(await f.run(["invite", "--file", "synthetic.txt"]), 1);
      assert.equal(f.requests.length, 0); assert.equal(f.readCalls.length, 1); assert.ok(!f.text().includes("#setup="));
    });
  }
  it("withholds every batch link after a partial database failure; retry replaces unprinted codes", async () => {
    let calls = 0;
    const f = fixture({ intercept: r => r.body?.p_action === "issue" && ++calls === 2 ? json({ message: KEY }, 403) : undefined });
    assert.equal(await f.run(["invite", "--file", "synthetic.txt"]), 1);
    assert.equal(f.requests.length, 2); assert.ok(!f.text().includes("#setup=")); assert.ok(!f.text().includes(KEY));
    assert.match(f.text(), /retry the whole batch/i);
  });
  it("reports unreadable batch input without reflecting paths/errors or reading credentials", async () => {
    const f = fixture({ missingFile: true }); assert.equal(await f.run(["invite", "--file", "synthetic.txt"]), 1);
    assert.equal(f.requests.length, 0); assert.equal(f.readCalls.length, 1); assert.ok(!f.text().includes(KEY));
  });
  for (const response of [{ id: ID, issued: false, purpose: "invite" }, { id: "bad", issued: true, purpose: "invite" },
    { id: ID, issued: true, purpose: "reset" }]) {
    it("withholds a link unless SQL acknowledges its storage and purpose", async () => {
      const f = fixture({ intercept: () => json(response) }); assert.equal(await f.run(["invite", EMAIL]), 1);
      assert.ok(!f.text().includes("#setup="));
    });
  }
  it("cancels by normalized email without requiring an Auth identity", async () => {
    const f = fixture(); assert.equal(await f.run(["cancel", " Tester@Example.Org "]), 0);
    assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "cancel", p_email: EMAIL }]);
    assert.match(f.text(), /Cancelled setup links/);
  });
  it("lists pending/used/cancelled links and member status without hashes or raw codes", async () => {
    const f = fixture({ roster: [member(), member({ email: "owner@example.org", confirmed_at: TIMESTAMP, is_owner: true })],
      codes: [setupCode(), setupCode({ email: "used@example.org", purpose: "reset", used_at: TIMESTAMP }),
        setupCode({ email: "cancelled@example.org", cancelled_at: TIMESTAMP, failed_attempts: 10 })] });
    assert.equal(await f.run(["list"]), 0); assert.equal(f.requests.length, 2);
    assert.match(f.text(), /tester@example.org \| invite \| pending/);
    assert.match(f.text(), /used@example.org \| reset \| used/);
    assert.match(f.text(), /cancelled@example.org \| invite \| cancelled/);
    assert.match(f.text(), /owner@example.org \| confirmed \| yes/);
    assert.ok(!f.text().includes("#setup=")); assert.ok(!f.text().includes("code_hash"));
  });
  it("lists an empty roster and no setup links", async () => {
    const f = fixture(); assert.equal(await f.run(["list"]), 0); assert.match(f.text(), /No game members yet/); assert.match(f.text(), /No setup links yet/);
  });
  it("revokes membership/owner access and setup codes before banning Auth", async () => {
    const f = fixture({ roster: [member({ is_owner: true })] });
    assert.equal(await f.run(["revoke", EMAIL]), 0);
    assert.deepEqual(f.requests.map(r => r.body), [{ p_action: "list" }, { p_action: "revoke", p_user_id: ID, p_owner: false }, { ban_duration: REVOKE_BAN_DURATION }]);
    assert.match(f.text(), /Revoked membership and disabled Auth sign-in/); assert.match(f.text(), /local saves remain/);
  });
  it("revoke cancels a pending setup link before any user has been created", async () => {
    const f = fixture(); assert.equal(await f.run(["revoke", EMAIL]), 0);
    assert.deepEqual(f.requests.at(-1).body, { p_action: "cancel", p_email: EMAIL });
    assert.match(f.text(), /No game membership exists to revoke/);
  });
  it("can retry revocation after deletion/revocation markers exist", async () => {
    const f = fixture({ roster: [member({ revoked_at: TIMESTAMP, deletion_requested_at: TIMESTAMP })] });
    assert.equal(await f.run(["revoke", EMAIL]), 0); assert.equal(f.requests.length, 3);
  });
  it("does not ban Auth when membership revocation fails", async () => {
    const f = fixture({ roster: [member()], intercept: r => r.body?.p_action === "revoke" ? json({ message: KEY }, 403) : undefined });
    assert.equal(await f.run(["revoke", EMAIL]), 1); assert.equal(f.requests.length, 2); assert.ok(!f.text().includes(KEY));
  });
  it("reports partial completion and a retry if the Auth ban fails", async () => {
    const f = fixture({ roster: [member()], intercept: r => r.method === "PUT" ? json({ msg: KEY }, 500) : undefined });
    assert.equal(await f.run(["revoke", EMAIL]), 1); assert.match(f.text(), /Retry revoke/); assert.ok(!f.text().includes(KEY));
  });
  it("does not claim a completed ban without provider acknowledgement", async () => {
    const f = fixture({ roster: [member()], intercept: r => r.method === "PUT" ? json({ id: ID }) : undefined });
    assert.equal(await f.run(["revoke", EMAIL]), 1); assert.match(f.text(), /could not be confirmed/);
  });
  it("hides reflected provider secrets, thrown errors, and stacks", async () => {
    const f = fixture({ intercept: () => { throw new Error(KEY); } });
    assert.equal(await f.run(["invite", EMAIL]), 1); assert.ok(!f.text().includes(KEY)); assert.ok(!f.text().includes("Error:"));
  });
  it("redacts unexpected secrets even in local roster output", async () => {
    const f = fixture({ roster: [member({ email: `${KEY}@example.org` })] });
    assert.equal(await f.run(["list"]), 0); assert.ok(!f.text().includes(KEY)); assert.match(f.text(), /REDACTED/);
  });
  it("does not load credentials for help or malformed commands", async () => {
    const f = fixture(); assert.equal(await f.run(["--help"]), 0); assert.equal(await f.run(["invite", "bad\nemail@example.org"]), 1);
    assert.equal(f.requests.length, 0); assert.equal(f.readCalls.length, 0);
  });
  it("reports missing credentials safely", async () => {
    const output = [];
    assert.equal(await runBetaInvites(["list"], { readFileImpl: async () => { throw new Error(KEY); },
      fetchImpl: () => assert.fail("No request without credentials"), write: line => output.push(line) }), 1);
    assert.match(output.join("\n"), /\.local-dev\/beta-admin.env/); assert.ok(!output.join("\n").includes(KEY));
  });
});

describe("owner arguments, env and wrapper boundaries", () => {
  it("accepts options in either order and restricts --owner/batch/local to documented commands", () => {
    assert.deepEqual(parseCommand(["invite", EMAIL, "--owner", "--local"]), { command: "invite", email: EMAIL, owner: true, local: true });
    assert.deepEqual(parseCommand(["reset", "--local", EMAIL]), { command: "reset", email: EMAIL, owner: false, local: true });
    for (const args of [["reset", EMAIL, "--owner"], ["list", EMAIL], ["invite"], ["invite", EMAIL, "extra"],
      ["invite", "--file", "x", "--owner"], ["invite", EMAIL, "--local", "--local"], ["cancel", EMAIL, "--local"]]) assert.throws(() => parseCommand(args));
  });
  it("accepts CRLF and quotes without evaluating env content", () => {
    assert.deepEqual(parseAdminEnv(`# local\r\nSUPABASE_URL='${URL_BASE}/'\r\nSUPABASE_SERVICE_ROLE_KEY="${KEY}"\r\n`), { url: URL_BASE, key: KEY });
  });
  for (const invalid of ["", `SUPABASE_URL=${URL_BASE}\nSUPABASE_SERVICE_ROLE_KEY=\n`,
    `SUPABASE_URL=http://synthetic.supabase.co\nSUPABASE_SERVICE_ROLE_KEY=${KEY}`,
    `SUPABASE_URL=https://synthetic.supabase.co.unexpected.org\nSUPABASE_SERVICE_ROLE_KEY=${KEY}`,
    `SUPABASE_URL=${URL_BASE}/unexpected\nSUPABASE_SERVICE_ROLE_KEY=${KEY}`,
    `${ENV}SUPABASE_SERVICE_ROLE_KEY=duplicate`, `${ENV}OTHER=ignored`,
    `SUPABASE_URL=${URL_BASE}\nSUPABASE_SERVICE_ROLE_KEY=sb_publishable_synthetic`]) {
    it("rejects unexpected or public env configuration", () => assert.throws(() => parseAdminEnv(invalid)));
  }
  it("bounds private batch input", () => {
    assert.throws(() => parseEmailFile("x".repeat(1_048_577)));
    assert.throws(() => parseEmailFile(Array.from({ length: 1001 }, (_, i) => `tester${i}@example.org`).join("\n")));
  });
  it("keeps the example empty, real file ignored and interactive input outside shell expansion", async () => {
    const example = await readFile(new URL("./beta-admin.env.example", import.meta.url), "utf8");
    const wrapper = await readFile(new URL("./BETA_INVITES.cmd", import.meta.url), "utf8");
    const ignore = await readFile(new URL("../../.gitignore", import.meta.url), "utf8");
    assert.match(example, /^SUPABASE_URL=$/m); assert.match(example, /^SUPABASE_SERVICE_ROLE_KEY=$/m);
    assert.match(ignore, /^\.local-dev\/$/m); assert.match(wrapper, /node "%~dp0beta-invites\.mjs" --interactive/);
    assert.ok(!wrapper.includes("set /p")); assert.ok(!wrapper.includes("%EMAIL%"));
  });
});
