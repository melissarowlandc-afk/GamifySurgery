import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

// Offline source/runner contracts, NOT a replacement for executing PostgreSQL.
const read = (name: string) => readFileSync(new URL(`../../../../../supabase/${name}`, import.meta.url), "utf8");
const migration = read("migrations/20261103000100_snapshot_only_cloud_saves.sql");
const suite = read("tests/snapshot_only_cloud_saves.sql");
const stub = read("tests/snapshot_only_auth_stub.sql");
const driver = read("tests/snapshot_only_offline.sql");
const write = migration.slice(migration.indexOf("create function gamify_private.beta2_snapshot_write"), migration.indexOf("-- Old clients"));
const load = migration.slice(migration.indexOf("create function gamify_private.beta2_snapshot_load"), migration.indexOf("create function public.beta2_snapshot_load"));

it("R1: the legacy conversion has no column/variable content ambiguity and runs with error conflict behavior", () => {
  expect(write).toContain("#variable_conflict error");
  expect(write).not.toMatch(/\bcontent\s+jsonb/);
  expect(write).toContain("uncompressed_bytes = (v_blob->>'uncompressedBytes')::integer");
  expect(suite).toContain("set local plpgsql.variable_conflict = error;");
  expect(suite).toContain("'legacy.append'");
  expect(suite).toContain("R1: legacy pair converts under default variable_conflict=error");
});

it("R2: migration table locks are campaigns then snapshots, fail immediately if busy, and bound other waits", () => {
  const first = migration.indexOf("lock table public.beta2_campaigns in access exclusive mode nowait;");
  const second = migration.indexOf("lock table public.beta2_campaign_snapshots in access exclusive mode nowait;");
  expect(first).toBeGreaterThan(0); expect(second).toBeGreaterThan(first);
  expect(migration.indexOf("alter table public.beta2_campaigns")).toBeGreaterThan(second);
  expect(migration.indexOf("alter table public.beta2_campaign_snapshots")).toBeGreaterThan(migration.indexOf("alter table public.beta2_campaigns"));
  expect(migration).toContain("set local lock_timeout = '2s'");
  expect(migration).toContain("set local statement_timeout = '15s'");
  expect(migration).toContain("set local idle_in_transaction_session_timeout = '15s'");
  expect(driver).toContain("SNAPSHOT_BEFORE_MIGRATION");
});

it("R3: final effective quota includes retired bytes before the logical reservation", () => {
  const check = write.indexOf("q.accounted_bytes + q.dead_bytes_estimate + snapshot_cost + prior_cost + op_cost +");
  expect(check).toBeGreaterThan(0); expect(check).toBeLessThan(write.indexOf("perform gamify_private.beta2_reserve"));
  expect(write.slice(check, write.indexOf("perform gamify_private.beta2_reserve"))).toContain("end + 50000000 > 400000000");
  const effective = 349_999_999, newlyCharged = 202_000, retired = 1_000_000;
  expect(effective + newlyCharged - retired + 50_000_000).toBeLessThan(400_000_000); // Old check incorrectly admitted it.
  expect(effective + newlyCharged + 50_000_000).toBeGreaterThan(400_000_000);
  expect(suite).toContain("accounted_bytes = 349999999 - dead_bytes_estimate");
  expect(suite).toContain("R3: rollback preserves every ledger/head/evidence/op/writer/rate byte");
});

it("R4: old-client rejection uses the successful protocol-3 envelope and checks exact errors and unchanged bytes", () => {
  expect(suite).toContain("assert public.beta2_cloud_write(legacy_save::text");
  expect(suite).toContain("bad := legacy_save || jsonb_build_object('operationId','obsolete.client','expectedRevision','3'");
  expect(suite.match(/assert v_message = 'Cloud client update required for snapshot saves'/g)).toHaveLength(4);
  expect(suite).toContain("R4: rejected legacy calls preserve snapshots/evidence/ops/writer/all ledgers");
});

it("R5: failed transactions cannot print PASS and the offline bootstrap refuses existing/live schemas", () => {
  expect(suite).toContain("\\set ON_ERROR_STOP on"); expect(driver).toContain("\\set ON_ERROR_STOP on");
  expect(suite).toContain("SNAPSHOT_INJECT_FAILURE");
  const pass = suite.indexOf("raise notice 'PASS"), rollback = suite.lastIndexOf("rollback;");
  expect(pass).toBeGreaterThan(suite.indexOf("R5: deliberate fail-fast runner check"));
  expect(pass).toBeLessThan(rollback); expect(suite.slice(rollback + "rollback;".length).trim()).toBe("");
  expect(suite).toContain("NOT SAFE ON LIVE"); expect(stub).toContain("to_regnamespace('auth') is not null");
  expect(stub).toContain("^gamify_snapshot_test(_[a-z0-9_]+)?$");
  expect(driver).toContain("\\ir snapshot_only_auth_stub.sql");
});

it("R6: native load bounds campaign/revision arguments before acquiring account locks", () => {
  expect(load).toContain("p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256");
  expect(load).toContain("octet_length(p_revision) not between 1 and 19");
  expect(load).toContain("requested_revision := gamify_private.beta2_uint(p_revision)");
  expect(load.indexOf("Invalid cloud campaign ID")).toBeLessThan(load.indexOf("id := gamify_private.beta2_require_cloud"));
  expect(load.indexOf("Invalid cloud revision")).toBeLessThan(load.indexOf("id := gamify_private.beta2_require_cloud"));
  expect(suite).toContain("repeat(chr(233),129)"); expect(suite).toContain("9223372036854775808");
});
