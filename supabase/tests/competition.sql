-- Rollback-only: run on a DISPOSABLE Supabase database after all migrations.
-- This script prepares synthetic accounts only and ends with one PASS row.
begin;
set local plpgsql.check_asserts = on;
insert into auth.users(id,email,invited_at,email_confirmed_at,aud,role,raw_app_meta_data) values
 ('c0000000-0000-4000-8000-000000000001','competition-a@example.invalid',now(),now(),'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000002','competition-b@example.invalid',now(),now(),'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000003','competition-c@example.invalid',now(),now(),'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000004','competition-revoked@example.invalid',now(),now(),'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000005','competition-banned@example.invalid',now(),now(),'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000006','competition-unconfirmed@example.invalid',now(),null,'authenticated','authenticated','{}'),
 ('c0000000-0000-4000-8000-000000000007','competition-setup@example.invalid',null,now(),'authenticated','authenticated','{"gamify_setup_admitted":true}');
insert into gamify_private.player_memberships(user_id) select id from auth.users where email like 'competition-%@example.invalid';
update gamify_private.player_memberships set revoked_at=now() where user_id='c0000000-0000-4000-8000-000000000004';
update auth.users set banned_until=now()+interval '1 day' where id='c0000000-0000-4000-8000-000000000005';

do $$ declare v_name text; begin
  foreach v_name in array array['competition_clinics','competition_settings','competition_submit_limits'] loop
    assert (select relrowsecurity from pg_class where oid = ('gamify_private.'||v_name)::regclass), 'RLS on every table';
    assert not has_table_privilege('anon','gamify_private.'||v_name,'select,insert,update,delete'), 'No anonymous tables';
    assert not has_table_privilege('authenticated','gamify_private.'||v_name,'select,insert,update,delete'), 'No direct player tables';
  end loop;
  foreach v_name in array array['get_clinic_competition()','set_clinic_competition_hidden(boolean)',
    'submit_clinic_competition(text,text,integer,bigint,integer,integer)'] loop
    assert not has_function_privilege('anon','public.'||v_name,'execute'), 'No anon RPC';
    assert not has_function_privilege('service_role','public.'||v_name,'execute'), 'No service-role player RPC';
    assert has_function_privilege('authenticated','public.'||v_name,'execute'), 'Explicit player grant';
    assert not (select prosecdef from pg_proc where oid = ('public.'||v_name)::regprocedure), 'Public invoker';
    assert (select prosecdef from pg_proc where oid = ('gamify_private.'||v_name)::regprocedure), 'Private definer';
  end loop;
end $$;
set local role anon;
do $$ begin
  begin perform public.get_clinic_competition(); raise exception 'Anonymous read allowed'; exception when insufficient_privilege then null; end;
  begin perform public.set_clinic_competition_hidden(true); raise exception 'Anonymous hide allowed'; exception when insufficient_privilege then null; end;
  begin perform public.submit_clinic_competition('x','X',0,0,1,1); raise exception 'Anonymous submit allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}',true); end $$;
set local role authenticated;
do $$ declare v_board jsonb; v_bad text; begin
  assert public.get_usage_access()->>'notice_accepted' = 'false', 'Usage consent is independent';
  assert public.get_clinic_competition() = '{"hidden":false,"rows":[]}'::jsonb, 'Initial empty state/default visible';
  perform public.submit_clinic_competition('a-low','A lower level',1,30000,3,3);
  perform public.submit_clinic_competition('z-tie','A later ID',2,30000,3,3);
  perform public.submit_clinic_competition('a-best','  A best  ',2,30000,3,3);
  v_board := public.get_clinic_competition();
  assert jsonb_array_length(v_board->'rows')=1, 'Only best clinic per player';
  assert v_board->'rows'->0->>'clinic_name'='A best', 'Trimmed name and deterministic best tie';
  assert v_board->'rows'->0->>'is_self'='true', 'Self identity';
  assert not ((v_board->'rows'->0) ?| array['player_id','campaign_id','email','updated_at']), 'No identifiers leaked';
  foreach v_bad in array array['',repeat('x',61),E'Bad\nName',E'Bad\tName',chr(127),U&'\00A0\3000\FEFF'] loop
    begin perform public.submit_clinic_competition('bad',v_bad,0,0,1,1); raise exception 'Invalid name accepted'; exception when invalid_parameter_value then null; end;
  end loop;
  begin perform public.submit_clinic_competition(null,'Bad',0,0,1,1); raise exception 'Null ID accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition(E'bad\n','Bad',0,0,1,1); raise exception 'Control ID accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition(repeat('x',257),'Bad',0,0,1,1); raise exception 'Long ID accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',6,0,1,1); raise exception 'Level accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,-1,1,1); raise exception 'Negative revenue accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,100000000001,1,1); raise exception 'Absurd revenue accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,null,1,1); raise exception 'Null revenue accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,0,4,4); raise exception 'Four-day count accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,0,3,1); raise exception 'Too many days accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,0,1,0); raise exception 'Day zero accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_clinic_competition('bad','Bad',0,0,1,10000001); raise exception 'Absurd day accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.set_clinic_competition_hidden(null); raise exception 'Null hidden accepted'; exception when invalid_parameter_value then null; end;
  begin execute 'select * from gamify_private.competition_clinics'; raise exception 'Raw table read allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_board jsonb; begin
  perform public.submit_clinic_competition('b','B clinic',2,30000,1,1);
  v_board:=public.get_clinic_competition();
  assert v_board->'rows'->0->>'clinic_name'='A best' and v_board->'rows'->0->>'is_self'='false', 'Deterministic public tie';
  assert v_board->'rows'->1->>'rank'='2' and v_board->'rows'->1->>'is_self'='true', 'Rank and self for second caller';
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000003","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_board jsonb; begin
  perform public.submit_clinic_competition('c','C hidden',5,90000,2,2);
  perform public.set_clinic_competition_hidden(true);
  v_board:=public.get_clinic_competition();
  assert v_board->>'hidden'='true' and jsonb_array_length(v_board->'rows')=3, 'Hidden self included';
  assert v_board->'rows'->2->>'clinic_name'='C hidden' and v_board->'rows'->2->>'is_self'='true'
    and v_board->'rows'->2->'rank'='null'::jsonb, 'Hidden self is unranked';
  assert v_board->'rows'->0->>'rank'='1', 'Hidden clinic does not shift public ranks';
end $$;
reset role;

-- High-income rows belonging to inadmissible accounts must never be visible.
insert into gamify_private.competition_clinics(player_id,campaign_id,clinic_name,facility_level,average_daily_revenue_cents,days_counted,completed_day)
 select id,'inadmissible','Inadmissible',5,100000000000,1,1 from auth.users
 where id in ('c0000000-0000-4000-8000-000000000004','c0000000-0000-4000-8000-000000000005','c0000000-0000-4000-8000-000000000006');
do $$ declare v_subject text; begin
  foreach v_subject in array array['c0000000-0000-4000-8000-000000000004','c0000000-0000-4000-8000-000000000005','c0000000-0000-4000-8000-000000000006'] loop
    perform set_config('request.jwt.claims',jsonb_build_object('sub',v_subject,'role','authenticated')::text,true);
    begin perform public.get_clinic_competition(); raise exception 'Inadmissible read allowed'; exception when insufficient_privilege then null; end;
    begin perform public.submit_clinic_competition('x','X',0,0,1,1); raise exception 'Inadmissible submit allowed'; exception when insufficient_privilege then null; end;
    begin perform public.set_clinic_competition_hidden(true); raise exception 'Inadmissible hide allowed'; exception when insufficient_privilege then null; end;
  end loop;
end $$;

-- New setup-link admission works without provider invited_at or cloud enrollment.
do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000007","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_board jsonb; begin
  perform public.set_clinic_competition_hidden(true);
  perform public.submit_clinic_competition('setup',repeat('x',60),0,0,1,1);
  v_board:=public.get_clinic_competition();
  assert jsonb_array_length(v_board->'rows')=3, 'Only A, B and hidden setup self';
end $$;
reset role;

delete from gamify_private.competition_submit_limits where player_id='c0000000-0000-4000-8000-000000000001';
do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000001","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ declare v_i integer; v_board jsonb; begin
  for v_i in 1..120 loop perform public.submit_clinic_competition('rate','Rate clinic',0,0,1,v_i); end loop;
  perform public.submit_clinic_competition('rate','Rate clinic',0,0,1,120);
  perform public.submit_clinic_competition('rate','Stale retry',0,0,1,119);
  begin perform public.submit_clinic_competition('rate','Rate clinic',0,0,1,121);
    raise exception 'Quota bypass'; exception when sqlstate 'P0001' then assert sqlerrm='Clinic competition rate limit reached','Expected quota'; end;
  perform public.set_clinic_competition_hidden(true);
  v_board:=public.get_clinic_competition();
  assert jsonb_array_length(v_board->'rows')=2 and v_board->'rows'->0->>'clinic_name'='B clinic', 'Other hidden clinics excluded';
  perform public.set_clinic_competition_hidden(false);
end $$;
reset role;
do $$ begin
  assert (select completed_day=120 and clinic_name='Rate clinic' from gamify_private.competition_clinics
    where player_id='c0000000-0000-4000-8000-000000000001' and campaign_id='rate'), 'Stale retry cannot overwrite';
end $$;
-- UTC day reset permits a new changed submission.
update gamify_private.competition_submit_limits set window_date=window_date-1 where player_id='c0000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$ begin perform public.submit_clinic_competition('rate','Rate clinic',0,0,1,121); end $$;
reset role;

-- Retention boundaries plus preservation of feedback, setup-code and cloud purge.
update gamify_private.competition_clinics set updated_at=now()-interval '90 days' where campaign_id='a-low';
update gamify_private.competition_clinics set updated_at=now()-interval '89 days' where campaign_id='z-tie';
update gamify_private.competition_submit_limits set window_date=(now() at time zone 'UTC')::date-8 where player_id='c0000000-0000-4000-8000-000000000003';
do $$ begin
  perform gamify_private.purge_beta1_retained_data();
  assert not exists(select 1 from gamify_private.competition_clinics where campaign_id='a-low'), '90-day row purged';
  assert exists(select 1 from gamify_private.competition_clinics where campaign_id='z-tie'), '89-day row retained';
  assert not exists(select 1 from gamify_private.competition_submit_limits where player_id='c0000000-0000-4000-8000-000000000003'), 'Old limits purged';
  assert (select hidden from gamify_private.competition_settings where player_id='c0000000-0000-4000-8000-000000000003'), 'Hiding does not expire';
end $$;

-- Legacy delete-my-data removes rows, settings and rate counters and blocks replay.
set local role authenticated;
do $$ begin
  perform public.set_clinic_competition_hidden(true);
  perform public.request_usage_data_deletion();
  begin perform public.submit_clinic_competition('stale','Stale',0,0,1,1); raise exception 'Deleted player resubmitted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.competition_clinics where player_id='c0000000-0000-4000-8000-000000000001'), 'Legacy deletion rows';
  assert not exists(select 1 from gamify_private.competition_settings where player_id='c0000000-0000-4000-8000-000000000001'), 'Legacy deletion settings';
  assert not exists(select 1 from gamify_private.competition_submit_limits where player_id='c0000000-0000-4000-8000-000000000001'), 'Legacy deletion limits';
end $$;

-- Full Beta 2 delete path removes competition even without Beta 2 enrollment.
do $$ begin perform set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000002","role":"authenticated"}',true); end $$;
set local role authenticated;
do $$ begin perform public.set_clinic_competition_hidden(true); perform public.beta2_delete_my_data('all-account-data.v1','beta2.cloud.v1'); end $$;
reset role;
do $$ begin
  assert not exists(select 1 from gamify_private.competition_clinics where player_id='c0000000-0000-4000-8000-000000000002'), 'Full deletion rows';
  assert not exists(select 1 from gamify_private.competition_settings where player_id='c0000000-0000-4000-8000-000000000002'), 'Full deletion settings';
  assert not exists(select 1 from gamify_private.competition_submit_limits where player_id='c0000000-0000-4000-8000-000000000002'), 'Full deletion limits';
  assert exists(select 1 from gamify_private.competition_clinics where player_id='c0000000-0000-4000-8000-000000000003'), 'Other account untouched';
end $$;
delete from auth.users where id='c0000000-0000-4000-8000-000000000003';
do $$ begin
  assert not exists(select 1 from gamify_private.competition_clinics where player_id='c0000000-0000-4000-8000-000000000003'), 'Auth cascade rows';
  assert not exists(select 1 from gamify_private.competition_settings where player_id='c0000000-0000-4000-8000-000000000003'), 'Auth cascade settings';
end $$;
-- Keep PASS inside the transaction: an earlier assertion aborts it, so even a
-- runner that continues after errors cannot print a false success after ROLLBACK.
select 'PASS: Clinic Competition grants/RLS/admission/validation/ranking/hiding/quota/retention/deletion; rollback follows' as result;
rollback;
