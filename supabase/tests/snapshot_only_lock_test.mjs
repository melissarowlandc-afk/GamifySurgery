// Manager-only real PostgreSQL regression. No installs or remote hosts. Prepare
// a disposable DB with SNAPSHOT_BEFORE_MIGRATION=1; see snapshot_only_offline.md.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const [database, username = 'postgres'] = process.argv.slice(2);
if (!database || !/^gamify_snapshot_test(_[a-z0-9_]+)?$/.test(database)) {
  process.stderr.write('Usage: node supabase/tests/snapshot_only_lock_test.mjs gamify_snapshot_test_suffix [local-user]\n');
  process.exitCode = 1;
} else {
  const executable = process.env.SNAPSHOT_PSQL || 'psql';
  const args = ['--host=127.0.0.1', '--username', username, '--dbname', database, '-X', '-At', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose'];
  const migration = fileURLToPath(new URL('../migrations/20261103000100_snapshot_only_cloud_saves.sql', import.meta.url));
  const suite = fileURLToPath(new URL('./snapshot_only_cloud_saves.sql', import.meta.url));
  function start(extra = []) {
    const child = spawn(executable, [...args, ...extra], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '', stderr = '', resolveReady, resolveDone;
    const ready = new Promise(resolve => { resolveReady = resolve; });
    const done = new Promise(resolve => { resolveDone = resolve; });
    const timer = setTimeout(() => { child.kill(); }, 15_000);
    child.stdout.on('data', bytes => {
      stdout = (stdout + bytes).slice(-32_000);
      if (/snapshot-holder-ready\r?\n/.test(stdout)) resolveReady();
    });
    child.stderr.on('data', bytes => { stderr = (stderr + bytes).slice(-32_000); });
    child.stdin.on('error', error => { stderr += error.message; });
    child.once('error', error => { stderr += error.message; });
    child.once('close', code => { clearTimeout(timer); resolveDone({ code, stdout, stderr }); });
    return { child, ready, done };
  }
  async function run(extra) {
    const task = start(extra); task.child.stdin.end(); return task.done;
  }
  const previousSchema = `do $guard$ begin
    if current_database() !~ '^gamify_snapshot_test(_[a-z0-9_]+)?$'
      or to_regclass('snapshot_test_support.disposable_marker') is null
      or to_regclass('public.beta2_campaigns') is null
      or to_regprocedure('public.beta2_snapshot_write(text,text)') is not null
      or exists(select 1 from pg_attribute where attrelid='public.beta2_campaign_snapshots'::regclass
        and attname='cloud_format_version' and not attisdropped) then
      raise exception 'Expected previous schema in a disposable test DB; never use live'; end if;
  end $guard$;`;
  let holder;
  try {
    const preflight = await run(['-c', previousSchema]);
    assert.equal(preflight.code, 0, preflight.stderr);
    holder = start();
    holder.child.stdin.write("begin; set local idle_in_transaction_session_timeout='15s'; lock table public.beta2_campaigns in row exclusive mode; select 'snapshot-holder-ready';\n");
    // The ready marker is emitted only AFTER the real relation lock is held.
    // No fixed sleep races the DDL against the lock acquisition.
    await Promise.race([holder.ready, holder.done.then(result => { throw new Error(`Holder stopped before lock: ${result.stderr}`); })]);
    const busy = await run(['-f', migration]);
    assert.notEqual(busy.code, 0, 'Migration must not apply while the campaign relation is locked');
    assert.match(busy.stderr, /55P03/, 'NOWAIT must reject promptly, not deadlock or hit a deadline');
    holder.child.stdin.end("select count(*) from public.beta2_campaign_snapshots; rollback; select 'snapshot-holder-done';\n");
    const released = await holder.done;
    assert.equal(released.code, 0, released.stderr); assert.match(released.stdout, /snapshot-holder-done/);
    const unchanged = await run(['-c', previousSchema]);
    assert.equal(unchanged.code, 0, 'Busy apply must leave no partial columns/functions');
    const applied = await run(['-f', migration]); assert.equal(applied.code, 0, applied.stderr);
    const checked = await run(['-f', suite]); assert.equal(checked.code, 0, checked.stderr);
    assert.match(checked.stderr, /PASS snapshot-only R1-R6 checks complete/);
    assert.match(checked.stdout, /ROLLBACK/);
    process.stdout.write('PASS real two-connection NOWAIT/old-reader/atomic rollback, quiet apply and R1-R6 SQL suite (disposable only).\n');
  } catch (error) {
    process.stderr.write(`${error.message}\n`); process.exitCode = 1;
  } finally {
    if (holder && holder.child.exitCode === null && !holder.child.killed) holder.child.kill();
  }
}
