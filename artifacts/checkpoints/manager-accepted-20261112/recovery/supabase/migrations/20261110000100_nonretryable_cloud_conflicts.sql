-- MANAGER/OWNER APPLY ONLY: run this whole file in a fresh SQL-editor tab.
-- Prerequisite: snapshot-only saves (20261103000100); efficient leases optional.
-- Changes only deterministic conflict SQLSTATEs: 40001 -> PT409 (HTTP 409).
-- No table/data/ACL changes. Short catalog locks only; retry the WHOLE file if
-- lock_timeout fires. Deploy the dual-code client first; no live SQL run by worker.
-- Rollback: run supabase/tests/nonretryable_cloud_conflicts_rollback.sql in a
-- fresh tab, WHOLE file; it restores 40001 and can reintroduce the retry storm.
begin;
set local lock_timeout = '2s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '10s';

do $patch$
declare
  signature text; function_id regprocedure; definition text; patched text;
  before_owner oid; before_acl aclitem[]; before_config text[];
  before_definer boolean; before_source text;
begin
  foreach signature in array array[
    'gamify_private.beta2_cloud_lease(integer,text,text,text,text,text)',
    'gamify_private.beta2_legacy_cloud_write(text,text)',
    'gamify_private.beta2_cloud_delete_campaign(integer,text,text)',
    'gamify_private.beta2_snapshot_write(text,text)',
    'gamify_private.beta2_backup_restore(text,text,boolean)',
    'gamify_private.beta2_cloud_lease_v2(integer,text,text,text,text,text)'
  ] loop
    function_id := to_regprocedure(signature);
    if function_id is null then
      -- This opt-in endpoint has not been applied on every project.
      if signature = 'gamify_private.beta2_cloud_lease_v2(integer,text,text,text,text,text)' then continue; end if;
      raise exception 'Missing prerequisite function: %', signature;
    end if;
    select p.proowner,p.proacl,p.proconfig,p.prosecdef,p.prosrc
      into before_owner,before_acl,before_config,before_definer,before_source
      from pg_proc p where p.oid = function_id;
    definition := pg_get_functiondef(function_id);
    -- Guard against silently editing a function whose conflict contract changed.
    -- Reusing the installed definition preserves every other byte of its body,
    -- defaults, security attributes, search_path, OID, owner and existing ACL.
    if (length(definition)-length(replace(definition,'errcode = ''40001''','')))
         / length('errcode = ''40001''') = 1
      and position('errcode = ''PT409''' in definition) = 0 then
      patched := replace(definition,'errcode = ''40001''','errcode = ''PT409''');
      execute patched;
    elsif (length(definition)-length(replace(definition,'errcode = ''PT409''','')))
         / length('errcode = ''PT409''') = 1
      and position('errcode = ''40001''' in definition) = 0 then
      null; -- Already applied: idempotent, no function replacement needed.
    else
      raise exception 'Unexpected conflict contract: %', signature;
    end if;
    if not exists (select 1 from pg_proc p where p.oid = function_id
      and p.proowner = before_owner and p.proacl is not distinct from before_acl
      and p.proconfig is not distinct from before_config and p.prosecdef = before_definer
      and p.prosrc = replace(before_source,'errcode = ''40001''','errcode = ''PT409''')) then
      raise exception 'Function attributes or non-conflict body changed: %', signature;
    end if;
  end loop;
end $patch$;

notify pgrst, 'reload schema';
commit;
