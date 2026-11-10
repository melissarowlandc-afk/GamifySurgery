-- OWNER-REVIEWED ROLLBACK ONLY, NOT A TEST. Run the WHOLE file in a fresh tab.
-- Restores the previous retryable SQLSTATE; may restart the incident. It does
-- not change save bytes/ACLs or undo the separately deployed compatible client.
begin;
set local lock_timeout = '2s';
set local statement_timeout = '10s';
set local idle_in_transaction_session_timeout = '10s';
do $rollback$
declare signature text; function_id regprocedure; definition text;
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
      if signature = 'gamify_private.beta2_cloud_lease_v2(integer,text,text,text,text,text)' then continue; end if;
      raise exception 'Missing prerequisite function: %', signature;
    end if;
    definition := pg_get_functiondef(function_id);
    if (length(definition)-length(replace(definition,'errcode = ''PT409''','')))
         / length('errcode = ''PT409''') = 1
      and position('errcode = ''40001''' in definition) = 0 then
      execute replace(definition,'errcode = ''PT409''','errcode = ''40001''');
    elsif (length(definition)-length(replace(definition,'errcode = ''40001''','')))
         / length('errcode = ''40001''') = 1
      and position('errcode = ''PT409''' in definition) = 0 then
      null;
    else raise exception 'Unexpected conflict contract: %', signature;
    end if;
  end loop;
end $rollback$;
notify pgrst, 'reload schema';
commit;
