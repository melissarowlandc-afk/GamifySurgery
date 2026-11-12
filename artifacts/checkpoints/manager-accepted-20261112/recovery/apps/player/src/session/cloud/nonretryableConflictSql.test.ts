import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";

const root = new URL("../../../../../supabase/", import.meta.url);
const read = (name: string) => readFileSync(new URL(name, root), "utf8");
const migration = read("migrations/20261110000100_nonretryable_cloud_conflicts.sql");
const rollback = read("tests/nonretryable_cloud_conflicts_rollback.sql");
const targets = ["beta2_cloud_lease", "beta2_legacy_cloud_write", "beta2_cloud_delete_campaign",
  "beta2_snapshot_write", "beta2_backup_restore", "beta2_cloud_lease_v2"].sort();

it("covers every current deterministic transaction-rollback SQLSTATE, including the renamed legacy writer", () => {
  const definitions = new Map<string, string>();
  for (const name of readdirSync(new URL("migrations/", root)).filter(name => name.endsWith(".sql") && name < "20261110000100").sort()) {
    const text = read(`migrations/${name}`);
    const declarations = /create(?: or replace)? function\s+([\w.]+)\([\s\S]*?\$\$[\s\S]*?\$\$;|alter function\s+([\w.]+)\([^;]*?\) rename to (\w+);/gi;
    for (const found of text.matchAll(declarations)) {
      if (found[1]) definitions.set(found[1], found[0]);
      else { const original = definitions.get(found[2]!); expect(original).toBeDefined(); definitions.delete(found[2]!); definitions.set(`gamify_private.${found[3]}`, original!); }
    }
  }
  const retryable = [...definitions].filter(([, text]) => /errcode\s*=\s*'(?:40\w{3})'/i.test(text));
  expect(retryable.map(([name]) => name.replace("gamify_private.", "")).sort()).toEqual(targets);
  for (const [name, definition] of retryable) {
    expect(definition.match(/errcode = '40001'/g)).toHaveLength(1);
    expect(migration).toContain(`'${name}(`);
    expect(rollback).toContain(`'${name}(`);
  }
});

it("recreates installed definitions with only the conflict code changed and preserves OID/ACL/security attributes", () => {
  expect(migration).toContain("pg_get_functiondef(function_id)");
  expect(migration).toContain("replace(definition,'errcode = ''40001''','errcode = ''PT409''')");
  expect(rollback).toContain("replace(definition,'errcode = ''PT409''','errcode = ''40001''')");
  for (const guard of ["p.oid = function_id", "p.proowner = before_owner", "p.proacl is not distinct from before_acl",
    "p.proconfig is not distinct from before_config", "p.prosecdef = before_definer", "p.prosrc = replace(before_source"]) expect(migration).toContain(guard);
  const executable = migration.replace(/--[^\n]*/g, "");
  expect(executable).not.toMatch(/\b(?:drop|grant|revoke|alter\s+table|update|delete|insert)\b/i);
  expect(executable).toMatch(/begin;[\s\S]*commit;\s*$/);
  expect(migration).toContain("Already applied"); expect(migration).toContain("set local lock_timeout = '2s'");
});

it("keeps the rollback-only database suite fail-fast and guarded away from live databases", () => {
  const tests = read("tests/nonretryable_cloud_conflicts.sql");
  expect(tests).toContain("\\set ON_ERROR_STOP on");
  expect(tests).toContain("snapshot_test_support.disposable_marker");
  expect(tests).toContain("^gamify_snapshot_test(_[a-z0-9_]+)?$");
  expect(tests).toMatch(/raise notice 'PASS:[\s\S]*rollback;\s*$/);
  expect(tests.match(/when sqlstate 'PT409'/g)?.length).toBeGreaterThanOrEqual(5);
});
