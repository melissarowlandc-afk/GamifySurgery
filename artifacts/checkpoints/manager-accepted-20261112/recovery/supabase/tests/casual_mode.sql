-- Run the ENTIRE file as postgres on a disposable database after all migrations.
-- Synthetic accounts only. Rollback-only; exactly one final PASS row.
begin;
set local plpgsql.check_asserts = on;

insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
 ('c2800000-0000-4000-8000-000000000001','casual-main@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000002','casual-ranked@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000003','casual-setup@example.invalid',null,now(),'authenticated','authenticated',false,'{"gamify_setup_admitted":true}'),
 ('c2800000-0000-4000-8000-000000000004','casual-revoked@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000005','casual-deleting@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000006','casual-soft-deleted@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000007','casual-hard-deleted@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000008','casual-banned@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000009','casual-no-membership@example.invalid',now(),now(),'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000010','casual-unconfirmed@example.invalid',now(),null,'authenticated','authenticated',false,'{}'),
 ('c2800000-0000-4000-8000-000000000011','casual-anonymous@example.invalid',now(),now(),'authenticated','authenticated',true,'{}'),
 ('c2800000-0000-4000-8000-000000000012','casual-uninvited@example.invalid',null,now(),'authenticated','authenticated',false,'{}');
insert into gamify_private.player_memberships(user_id)
 select u.id from auth.users u where u.id::text like 'c2800000-%' and u.id <> 'c2800000-0000-4000-8000-000000000009';
update gamify_private.player_memberships m set revoked_at=now() where m.user_id='c2800000-0000-4000-8000-000000000004';
update gamify_private.player_memberships m set deletion_requested_at=now(), casual=true where m.user_id='c2800000-0000-4000-8000-000000000005';
update auth.users u set deleted_at=now() where u.id='c2800000-0000-4000-8000-000000000006';
delete from auth.users u where u.id='c2800000-0000-4000-8000-000000000007';
update auth.users u set banned_until=now()+interval '1 day' where u.id='c2800000-0000-4000-8000-000000000008';
update auth.users u set raw_user_meta_data='{"casual":true,"gamify_setup_admitted":true}' where u.id='c2800000-0000-4000-8000-000000000012';

do $catalog$ declare v_signature text; v_schema text; begin
  assert (select a.attnotnull and pg_get_expr(d.adbin,d.adrelid)='false'
    from pg_attribute a join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where a.attrelid='gamify_private.player_memberships'::regclass and a.attname='casual'), 'Default false / not null';
  assert (select relrowsecurity from pg_class where oid='gamify_private.player_memberships'::regclass), 'Membership RLS retained';
  assert not has_column_privilege('authenticated','gamify_private.player_memberships','casual','select,insert,update'), 'No player flag access';
  assert not has_column_privilege('anon','gamify_private.player_memberships','casual','select,insert,update'), 'No anonymous flag access';
  foreach v_signature in array array['beta1_admin_set_casual(uuid,boolean)','beta1_admin_usage_report()'] loop
    foreach v_schema in array array['public','gamify_private'] loop
      assert not has_function_privilege('anon',v_schema||'.'||v_signature,'execute'), 'No anon admin';
      assert not has_function_privilege('authenticated',v_schema||'.'||v_signature,'execute'), 'No player admin';
      assert has_function_privilege('service_role',v_schema||'.'||v_signature,'execute'), 'Service-role grant';
      assert (select p.prosecdef = (v_schema='gamify_private') and coalesce('search_path=""'=any(p.proconfig),false)
        from pg_proc p where p.oid=(v_schema||'.'||v_signature)::regprocedure), 'Private definer / public invoker / fixed path';
    end loop;
  end loop;
end $catalog$;

-- Even postgres EXECUTE with an unprivileged JWT cannot bypass the body check.
do $$ begin
  perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
  begin perform gamify_private.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',true);
    raise exception 'Missing service-role JWT accepted'; exception when insufficient_privilege then null; end;
  begin perform gamify_private.beta1_admin_usage_report();
    raise exception 'Report missing service-role JWT accepted'; exception when insufficient_privilege then null; end;
end $$;
set local role anon;
do $$ begin
  begin perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',true);
    raise exception 'Anonymous setter accepted'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_admin_usage_report();
    raise exception 'Anonymous report accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  assert public.get_usage_access()->>'casual'='false', 'Player starts standard';
  begin perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',true);
    raise exception 'Player self assignment accepted'; exception when insufficient_privilege then null; end;
  begin perform gamify_private.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000002',true);
    raise exception 'Player private setter accepted'; exception when insufficient_privilege then null; end;
  begin execute 'update gamify_private.player_memberships set casual=true';
    raise exception 'Direct update accepted'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_admin_usage_report();
    raise exception 'Player report accepted'; exception when insufficient_privilege then null; end;
  perform public.submit_clinic_competition('before-casual','Previously ranked',5,999999,1,1);
end $$;
reset role;

-- Marked usage remains in totals. Old and future days must not inflate reports.
insert into public.player_usage_days(user_id,usage_date,metric_version,playtime_seconds,question_count) values
 ('c2800000-0000-4000-8000-000000000001',(now() at time zone 'UTC')::date,'first-scored-patient-and-employee.v1',12.5,2),
 ('c2800000-0000-4000-8000-000000000001',(now() at time zone 'UTC')::date-90,'first-scored-patient-and-employee.v1',999,999),
 ('c2800000-0000-4000-8000-000000000001',(now() at time zone 'UTC')::date+1,'first-scored-patient-and-employee.v1',999,999),
 ('c2800000-0000-4000-8000-000000000002',(now() at time zone 'UTC')::date,'first-scored-patient-and-employee.v1',20,3),
 ('c2800000-0000-4000-8000-000000000004',(now() at time zone 'UTC')::date,'first-scored-patient-and-employee.v1',30,4),
 ('c2800000-0000-4000-8000-000000000005',(now() at time zone 'UTC')::date,'first-scored-patient-and-employee.v1',40,5);

do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ declare v_result jsonb; v_report jsonb; v_row jsonb; v_target uuid; begin
  v_result:=public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',true);
  assert v_result='{"user_id":"c2800000-0000-4000-8000-000000000001","casual":true}'::jsonb, 'Service owner sets mode';
  assert public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',true)=v_result, 'Idempotent setter';
  perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000003',true);
  perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000010',true);
  for v_target in select x::uuid from unnest(array[
    'c2800000-0000-4000-8000-000000000004','c2800000-0000-4000-8000-000000000005',
    'c2800000-0000-4000-8000-000000000006','c2800000-0000-4000-8000-000000000007',
    'c2800000-0000-4000-8000-000000000008','c2800000-0000-4000-8000-000000000009',
    'c2800000-0000-4000-8000-000000000011','c2800000-0000-4000-8000-000000000012']) x loop
    begin perform public.beta1_admin_set_casual(v_target,true); raise exception 'Inadmissible account changed';
      exception when insufficient_privilege then null; end;
    begin perform public.beta1_admin_set_casual(v_target,false); raise exception 'Inadmissible account cleared';
      exception when insufficient_privilege then null; end;
  end loop;
  begin perform public.beta1_admin_set_casual(null,true); raise exception 'Null user accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',null); raise exception 'Null mode accepted'; exception when invalid_parameter_value then null; end;
  select r into v_row from jsonb_array_elements(public.beta1_admin_members('list')) r
    where r->>'user_id'='c2800000-0000-4000-8000-000000000001';
  assert v_row->>'casual'='true', 'Roster marks casual';
  v_report:=public.beta1_admin_usage_report();
  select r into v_row from jsonb_array_elements(v_report) r where r->>'user_id'='c2800000-0000-4000-8000-000000000001';
  assert v_row->>'casual'='true' and (v_row->>'playtime_seconds')::numeric=12.5 and (v_row->>'question_count')::bigint=2, 'Casual usage included / marked / retained window';
  select r into v_row from jsonb_array_elements(v_report) r where r->>'user_id'='c2800000-0000-4000-8000-000000000002';
  assert v_row->>'casual'='false' and (v_row->>'playtime_seconds')::numeric=20 and (v_row->>'question_count')::bigint=3, 'Standard usage marked';
  assert exists(select 1 from jsonb_array_elements(v_report) r where r->>'user_id'='c2800000-0000-4000-8000-000000000004' and (r->>'question_count')::bigint=4), 'Revoked usage retained';
  assert not exists(select 1 from jsonb_array_elements(v_report) r where r->>'user_id' in (
    'c2800000-0000-4000-8000-000000000005','c2800000-0000-4000-8000-000000000006','c2800000-0000-4000-8000-000000000007')), 'No deleted reports';
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.competition_clinics c where c.player_id='c2800000-0000-4000-8000-000000000001'), 'Setting casual removes prior rows';
  assert not exists(select 1 from gamify_private.player_memberships m where m.user_id='c2800000-0000-4000-8000-000000000007'), 'Hard deletion cascades mode';
end $$;

do $$ begin perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin perform public.submit_clinic_competition('normal','Ranked clinic',2,99999999999,1,1); end $$;
reset role;
-- A manually seeded old/hidden row still cannot sneak into ranks or hidden self.
insert into gamify_private.competition_clinics(player_id,campaign_id,clinic_name,facility_level,average_daily_revenue_cents,days_counted,completed_day)
 values('c2800000-0000-4000-8000-000000000001','stale','Stale casual',5,999999,1,1);
do $$ begin perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000001","role":"authenticated","casual":false}',true); end $$;
set local role authenticated;
do $$ declare v_board jsonb; v_result jsonb; begin
  assert public.get_usage_access()->>'admitted'='true' and public.get_usage_access()->>'casual'='true', 'Player reads server mode, ignores JWT mode';
  assert public.get_usage_access()->>'notice_accepted'='false', 'Casual does not require or accept usage consent';
  v_result:=public.submit_clinic_competition('ignored','Ignored casual',5,888888,1,1);
  assert v_result->>'ignored'='true' and v_result->>'campaign_id'='ignored', 'Casual submission acknowledged without ranking';
  perform public.set_clinic_competition_hidden(true);
  v_board:=public.get_clinic_competition();
  assert exists(select 1 from jsonb_array_elements(v_board->'rows') r where r->>'clinic_name'='Ranked clinic'), 'Casual may view board';
  assert not exists(select 1 from jsonb_array_elements(v_board->'rows') r where r->>'clinic_name' in ('Stale casual','Ignored casual') or r->>'is_self'='true'), 'No casual ranked or hidden self';
  assert (select r->>'rank' from jsonb_array_elements(v_board->'rows') r where r->>'clinic_name'='Ranked clinic')='1', 'Casual does not shift ranking';
  begin perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',false);
    raise exception 'Player cleared casual'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.competition_clinics c where c.player_id='c2800000-0000-4000-8000-000000000001' and c.campaign_id='ignored'), 'Ignored submission stored nothing';
  assert not exists(select 1 from gamify_private.competition_submit_limits l where l.player_id='c2800000-0000-4000-8000-000000000001'), 'Ignored submission charged no quota';
  perform set_config('request.jwt.claims','{"role":"service_role"}',true);
end $$;
set local role service_role;
do $$ begin
  assert public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000001',false)->>'casual'='false', 'Owner clears mode';
end $$;
reset role;
do $$ begin
  update auth.users u set raw_user_meta_data='{"casual":true}' where u.id='c2800000-0000-4000-8000-000000000001';
  perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000001","role":"authenticated","casual":true}',true);
end $$;
set local role authenticated;
do $$ begin
  assert public.get_usage_access()->>'casual'='false', 'JWT and editable metadata cannot turn mode on';
  perform public.set_clinic_competition_hidden(false);
  perform public.submit_clinic_competition('normal-again','Standard again',2,9999999,1,1);
  assert exists(select 1 from jsonb_array_elements(public.get_clinic_competition()->'rows') r where r->>'clinic_name'='Standard again' and r->>'is_self'='true'), 'Owner-cleared mode may rank again';
end $$;
reset role;

-- Stale access after revocation/deletion/disabled Auth cannot leak casual mode.
do $$ declare v_target text; begin
  update gamify_private.player_memberships m set casual=true where m.user_id::text like 'c2800000-%';
  foreach v_target in array array[
    'c2800000-0000-4000-8000-000000000004','c2800000-0000-4000-8000-000000000005',
    'c2800000-0000-4000-8000-000000000006','c2800000-0000-4000-8000-000000000007',
    'c2800000-0000-4000-8000-000000000008','c2800000-0000-4000-8000-000000000009',
    'c2800000-0000-4000-8000-000000000010','c2800000-0000-4000-8000-000000000011',
    'c2800000-0000-4000-8000-000000000012'] loop
    perform set_config('request.jwt.claims',jsonb_build_object('sub',v_target,'role','authenticated')::text,true);
    assert public.get_usage_access()->>'admitted'='false' and public.get_usage_access()->>'casual'='false', 'Inadmissible access denied';
    begin perform public.submit_clinic_competition('blocked','Blocked',0,0,1,1);
      raise exception 'Inadmissible submission accepted'; exception when insufficient_privilege then null; end;
    begin perform public.get_clinic_competition();
      raise exception 'Inadmissible board accepted'; exception when insufficient_privilege then null; end;
  end loop;
  perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000003","role":"authenticated"}',true);
  assert public.get_usage_access()->>'casual'='true', 'Setup-admitted account reads mode';
  update auth.users u set email_confirmed_at=now() where u.id='c2800000-0000-4000-8000-000000000010';
  perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000010","role":"authenticated"}',true);
  assert public.get_usage_access()->>'casual'='true', 'Preassigned invitee gets mode after confirmation';
end $$;

-- Exercise the actual player deletion path, not just a seeded tombstone.
do $$ begin perform set_config('request.jwt.claims','{"sub":"c2800000-0000-4000-8000-000000000003","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin
  perform public.request_usage_data_deletion();
  assert public.get_usage_access()->>'deletion_requested'='true'
    and public.get_usage_access()->>'admitted'='false' and public.get_usage_access()->>'casual'='false', 'Deletion blocks casual access';
  begin perform public.submit_clinic_competition('after-delete','Deleted',0,0,1,1);
    raise exception 'Deleted casual submission accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"role":"service_role"}',true); end $$;
set local role service_role;
do $$ begin
  begin perform public.beta1_admin_set_casual('c2800000-0000-4000-8000-000000000003',false);
    raise exception 'Deleted membership changed'; exception when insufficient_privilege then null; end;
  assert not exists(select 1 from jsonb_array_elements(public.beta1_admin_usage_report()) r
    where r->>'user_id'='c2800000-0000-4000-8000-000000000003'), 'Actual deletion omitted from report';
end $$;
reset role;

-- Invite-time assignment is invisible to players until atomic finalization.
-- Keep the five-argument API; the six-argument API has no default ambiguity.
do $$ declare v_schema text; begin
  assert not has_column_privilege('authenticated','gamify_private.setup_codes','casual','select,insert,update'), 'No player setup marker access';
  assert (select a.attnotnull and pg_get_expr(d.adbin,d.adrelid)='false'
    from pg_attribute a join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where a.attrelid='gamify_private.setup_codes'::regclass and a.attname='casual'), 'Setup marker defaults false';
  foreach v_schema in array array['public','gamify_private'] loop
    assert not has_function_privilege('anon',v_schema||'.beta1_setup_admin(text,text,text,text,boolean,boolean)','execute'), 'No anonymous casual issue';
    assert not has_function_privilege('authenticated',v_schema||'.beta1_setup_admin(text,text,text,text,boolean,boolean)','execute'), 'No player casual issue';
    assert has_function_privilege('service_role',v_schema||'.beta1_setup_admin(text,text,text,text,boolean,boolean)','execute'), 'Owner casual issue grant';
    assert has_function_privilege('service_role',v_schema||'.beta1_setup_admin(text,text,text,text,boolean)','execute'), 'Legacy issue grant retained';
    assert (select p.pronargdefaults=0 and p.prosecdef=(v_schema='gamify_private')
      and coalesce('search_path=""'=any(p.proconfig),false) from pg_proc p
      where p.oid=(v_schema||'.beta1_setup_admin(text,text,text,text,boolean,boolean)')::regprocedure), 'Required six args / private definer / fixed path';
  end loop;
  perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
  begin perform public.beta1_setup_admin('issue','denied-casual@example.invalid',repeat('8',64),'invite',false,true);
    raise exception 'Nonservice casual issue accepted'; exception when insufficient_privilege then null; end;
end $$;
set local role authenticated;
do $$ begin
  begin perform public.beta1_setup_admin('issue','denied-casual@example.invalid',repeat('8',64),'invite',false,true);
    raise exception 'Player casual issue accepted'; exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ declare v_casual_code uuid; v_normal_code uuid; v_reset_code uuid; v_cancelled_code uuid; v_row jsonb; begin
  perform set_config('request.jwt.claims','{"role":"service_role"}',true);
  v_casual_code:=(public.beta1_setup_admin('issue','casual-first-signin@example.invalid',repeat('1',64),'invite',false,true)->>'id')::uuid;
  -- Existing callers omitting the new argument remain standard by default.
  v_normal_code:=(public.beta1_setup_admin('issue','normal-first-signin@example.invalid',repeat('2',64),'invite')->>'id')::uuid;
  select r into v_row from jsonb_array_elements(public.beta1_setup_admin('list')) r where r->>'id'=v_casual_code::text;
  assert v_row->>'casual'='true' and v_row->'used_at'='null'::jsonb, 'Pending list marks casual before membership';
  assert not (v_row ? 'code_hash'), 'Roster never exposes code hashes';
  assert public.beta1_claim_setup_code('casual-first-signin@example.invalid',v_casual_code,true)->>'status'='claimed', 'Casual setup code claims';
  assert public.beta1_claim_setup_code('normal-first-signin@example.invalid',v_normal_code,true)->>'status'='claimed', 'Normal setup code claims';
  assert not exists(select 1 from gamify_private.player_memberships m where m.user_id in (
    'c2810000-0000-4000-8000-000000000001','c2810000-0000-4000-8000-000000000002')), 'Issue/claim alone do not admit';
  -- Simulate successful Auth account creation/confirmation, as in setup tests.
  insert into auth.users(id,email,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
    ('c2810000-0000-4000-8000-000000000001','casual-first-signin@example.invalid',now(),'authenticated','authenticated',false,'{"gamify_setup_pending":true}'),
    ('c2810000-0000-4000-8000-000000000002','normal-first-signin@example.invalid',now(),'authenticated','authenticated',false,'{"gamify_setup_pending":true}');
  assert public.beta1_finish_setup_code(v_casual_code,'c2810000-0000-4000-8000-000000000001')->>'ok'='true', 'Casual finalization succeeds';
  assert public.beta1_finish_setup_code(v_normal_code,'c2810000-0000-4000-8000-000000000002')->>'ok'='true', 'Normal finalization succeeds';
  perform set_config('request.jwt.claims','{"sub":"c2810000-0000-4000-8000-000000000001","role":"authenticated"}',true);
  assert public.get_usage_access()->>'admitted'='true' and public.get_usage_access()->>'casual'='true', 'FIRST casual account access is already casual';
  perform set_config('request.jwt.claims','{"sub":"c2810000-0000-4000-8000-000000000002","role":"authenticated"}',true);
  assert public.get_usage_access()->>'admitted'='true' and public.get_usage_access()->>'casual'='false', 'FIRST normal account access stays standard';
  perform set_config('request.jwt.claims','{"role":"service_role"}',true);
  perform public.beta1_admin_set_casual('c2810000-0000-4000-8000-000000000001',false);
  assert public.beta1_finish_setup_code(v_casual_code,'c2810000-0000-4000-8000-000000000001')->>'ok'='true', 'Casual invite finish is idempotent';
  assert not (select m.casual from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000001'), 'Casual invite retry cannot undo later owner clearing';
  perform public.beta1_admin_set_casual('c2810000-0000-4000-8000-000000000001',true);
  v_reset_code:=(public.beta1_setup_admin('issue','casual-first-signin@example.invalid',repeat('3',64),'reset')->>'id')::uuid;
  perform public.beta1_claim_setup_code('casual-first-signin@example.invalid',v_reset_code,true);
  assert public.beta1_finish_setup_code(v_reset_code,'c2810000-0000-4000-8000-000000000001')->>'ok'='true', 'Reset succeeds';
  assert (select m.casual from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000001'), 'Reset does not clear casual';
  -- Reset retries also preserve a later owner mode change.
  perform public.beta1_admin_set_casual('c2810000-0000-4000-8000-000000000001',false);
  perform public.beta1_finish_setup_code(v_reset_code,'c2810000-0000-4000-8000-000000000001');
  assert not (select m.casual from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000001'), 'Finish retry preserves later owner assignment';
  -- The original normal invite remains usable for an idempotent finish retry.
  perform public.beta1_admin_set_casual('c2810000-0000-4000-8000-000000000002',true);
  assert public.beta1_finish_setup_code(v_normal_code,'c2810000-0000-4000-8000-000000000002')->>'ok'='true', 'Invite finish is idempotent';
  assert (select m.casual from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000002'), 'Normal retry never resets owner assignment';
  begin perform public.beta1_setup_admin('issue','casual-first-signin@example.invalid',repeat('4',64),'reset',false,true);
    raise exception 'Reset with casual marker accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.beta1_setup_admin('issue','casual-null@example.invalid',repeat('4',64),'invite',false,null);
    raise exception 'Null casual marker accepted'; exception when invalid_parameter_value then null; end;
  v_cancelled_code:=(public.beta1_setup_admin('issue','casual-cancelled-signin@example.invalid',repeat('5',64),'invite',false,true)->>'id')::uuid;
  perform public.beta1_claim_setup_code('casual-cancelled-signin@example.invalid',v_cancelled_code,true);
  insert into auth.users(id,email,email_confirmed_at,aud,role,is_anonymous,raw_app_meta_data) values
    ('c2810000-0000-4000-8000-000000000003','casual-cancelled-signin@example.invalid',now(),'authenticated','authenticated',false,'{"gamify_setup_pending":true}');
  perform public.beta1_setup_admin('cancel','casual-cancelled-signin@example.invalid');
  assert public.beta1_finish_setup_code(v_cancelled_code,'c2810000-0000-4000-8000-000000000003')->>'ok'='false', 'Cancelled casual code cannot finalize';
  assert not exists(select 1 from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000003'), 'Cancelled code creates no casual membership';
end $$;

-- Keep PASS in the transaction so continuing after an error cannot print a
-- false success after ROLLBACK. This is the only result row; rollback follows.
do $$ declare v_code_id uuid; begin
  perform set_config('request.jwt.claims','{"role":"service_role"}',true);
  insert into auth.users(id,email,invited_at,aud,role,is_anonymous) values
    ('c2810000-0000-4000-8000-000000000004','casual-existing-pending@example.invalid',now(),'authenticated','authenticated',false);
  insert into gamify_private.player_memberships(user_id) values('c2810000-0000-4000-8000-000000000004');
  v_code_id:=(public.beta1_setup_admin('issue','casual-existing-pending@example.invalid',repeat('6',64),'invite',false,true)->>'id')::uuid;
  perform public.beta1_claim_setup_code('casual-existing-pending@example.invalid',v_code_id,true);
  update auth.users u set email_confirmed_at=now() where u.id='c2810000-0000-4000-8000-000000000004';
  assert public.beta1_finish_setup_code(v_code_id,'c2810000-0000-4000-8000-000000000004')->>'ok'='true', 'Existing pending invite finalizes';
  assert (select m.casual from gamify_private.player_memberships m where m.user_id='c2810000-0000-4000-8000-000000000004'), 'Casual invite also promotes an existing pending membership';
end $$;

select 'PASS: casual mode authorization, invite-time assignment, read-only access, competition exclusion, reports and revoked/deleted handling; rollback follows' as result;
rollback;
