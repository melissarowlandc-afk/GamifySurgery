-- LIVE GAME PROJECT variant of ../beta1_usage_and_flags.sql; postgres, ENTIRE file.
-- Owner decision 2026-10-17: synthetic BEGIN ... ROLLBACK only. NOT executed.
-- Original expected values and all permission/own-RLS checks are preserved.
-- Owner-wide totals and fixture edits are scoped; collision guards fail closed.
-- The REAL retention routine still visits expired rows globally, under rollback.
-- Run in a quiet window; on any error issue ROLLBACK; never COMMIT.
begin;
set local timezone = 'America/New_York';
set local plpgsql.check_asserts = on;
do $fixture_guard$ begin
  assert not exists(select 1 from auth.users where id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','cccccccc-cccc-4ccc-8ccc-cccccccccccc','dddddddd-dddd-4ddd-8ddd-dddddddddddd','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','ffffffff-ffff-4fff-8fff-ffffffffffff')
    or lower(email) in ('usage-a@example.invalid','usage-b@example.invalid','usage-owner@example.invalid')), 'Synthetic fixture collision: stop without changing identities';
end $fixture_guard$;
insert into auth.users(id, email, invited_at, email_confirmed_at, aud, role) values
  ('11111111-1111-4111-8111-111111111111', 'usage-a@example.invalid', now(), now(), 'authenticated', 'authenticated'),
  ('22222222-2222-4222-8222-222222222222', 'usage-b@example.invalid', now(), now(), 'authenticated', 'authenticated'),
  ('33333333-3333-4333-8333-333333333333', 'usage-owner@example.invalid', now(), now(), 'authenticated', 'authenticated');
insert into gamify_private.player_memberships(user_id) values
  ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222'), ('33333333-3333-4333-8333-333333333333');
insert into gamify_private.usage_owners(user_id) values ('33333333-3333-4333-8333-333333333333');
insert into public.player_usage_days(user_id, usage_date, metric_version, playtime_seconds, question_count)
  values ('22222222-2222-4222-8222-222222222222', (now() at time zone 'UTC')::date, 'first-scored-patient-and-employee.v1', 72061, 2),
    ('22222222-2222-4222-8222-222222222222', (now() at time zone 'UTC')::date - 1, 'first-scored-patient-and-employee.v1', 18000, 3);

do $$ begin
  assert not has_table_privilege('anon', 'public.player_usage_days', 'select'), 'Anonymous totals denied';
  assert not has_table_privilege('anon', 'public.question_flags', 'insert'), 'Anonymous flag writes denied';
  assert not has_table_privilege('authenticated', 'public.player_usage_days', 'insert'), 'No direct total inserts';
  assert not has_table_privilege('authenticated', 'public.player_usage_days', 'update'), 'No direct total updates';
  assert not has_table_privilege('authenticated', 'public.player_usage_days', 'delete'), 'No direct total deletes';
  assert not has_table_privilege('authenticated', 'gamify_private.owner_usage_report', 'select'), 'Report is console only';
  assert not has_table_privilege('authenticated', 'gamify_private.player_memberships', 'update'), 'No membership self-admission';
  assert not has_function_privilege('anon', 'public.ingest_player_usage(jsonb,text)', 'execute'), 'Anonymous RPC denied';
  assert not has_function_privilege('authenticated', 'gamify_private.purge_beta1_retained_data()', 'execute'), 'Purge is console/Cron only';
end $$;

set local role anon;
do $$ begin
  begin perform public.get_usage_access(); raise exception 'Anonymous RPC unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","aal":"aal1"}', true); end $$;
set local role authenticated;
do $$ begin
  assert public.get_usage_access()->>'admitted' = 'true', 'Fresh admitted invitation';
  assert public.get_usage_access()->>'notice_accepted' = 'false', 'No implied consent';
  begin perform public.ingest_player_usage(jsonb_build_array(jsonb_build_object('receipt_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'kind','question', 'occurred_at',now())), 'first-scored-patient-and-employee.v1');
    raise exception 'Notice bypass unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform public.accept_usage_notice('wrong-version'); raise exception 'Wrong notice accepted';
    exception when invalid_parameter_value then null; end;
  perform public.accept_usage_notice('beta1.usage.v1');
  assert public.get_usage_access()->>'notice_accepted' = 'true', 'Versioned notice accepted';
end $$;

do $$ declare v_batch jsonb; v_response jsonb; begin
  v_batch := jsonb_build_array(
    jsonb_build_object('receipt_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'kind','question', 'occurred_at',now()),
    jsonb_build_object('receipt_id','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'kind','playtime',
      'session_id','cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'started_at',date_trunc('minute',now()) - interval '1 minute',
      'ended_at',date_trunc('minute',now()) - interval '30 seconds', 'active_ms',30000));
  v_response := public.ingest_player_usage(v_batch, 'first-scored-patient-and-employee.v1');
  assert jsonb_array_length(v_response->'acknowledged_receipt_ids') = 2, 'Small batch acknowledgement';
  perform public.ingest_player_usage(v_batch, 'first-scored-patient-and-employee.v1');
  assert (select sum(question_count) from public.player_usage_days) = 1, 'Retry contributes zero questions';
  assert (select sum(playtime_seconds) from public.player_usage_days) = 30, 'Retry contributes zero time';
  assert (select count(*) from public.player_usage_days where user_id <> auth.uid()) = 0, 'A cannot read B';
  begin perform public.ingest_player_usage(jsonb_build_array(jsonb_set(v_batch->0, '{occurred_at}', to_jsonb(now() - interval '1 hour'))), 'first-scored-patient-and-employee.v1');
    raise exception 'Changed duplicate accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.ingest_player_usage(jsonb_build_array((v_batch->0) || '{"answer":"hidden-choice"}'::jsonb), 'first-scored-patient-and-employee.v1');
    raise exception 'Clinical payload accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.ingest_player_usage(jsonb_build_array(jsonb_set(v_batch->1, '{active_ms}', '30001')), 'first-scored-patient-and-employee.v1');
    raise exception 'Absurd interval accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.ingest_player_usage(v_batch, 'unknown-metric'); raise exception 'Unknown metric accepted';
    exception when invalid_parameter_value then null; end;
  begin perform public.ingest_player_usage(jsonb_build_array(jsonb_set(v_batch->0, '{occurred_at}', to_jsonb(now() - interval '7 days'))), 'first-scored-patient-and-employee.v1');
    raise exception 'Expired replay accepted'; exception when invalid_parameter_value then null; end;
  begin insert into public.player_usage_days(user_id,usage_date,metric_version) values(auth.uid(),current_date,'first-scored-patient-and-employee.v1');
    raise exception 'Direct total inserted'; exception when insufficient_privilege then null; end;
end $$;

insert into public.question_flags(flag_id, question_id, question_variant_id, question_variant_version, concept_id, concept_version,
  clinical_release_id, content_version, app_version, displayed_choice_order, chosen_answer_id, comment, flagged_at, received_at)
values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','question.test','variant.test','1','concept.test','1','release.test','1','app.test',
  array['choice-b','choice-a'], 'choice-b', repeat('é',500), now(), now() - interval '10 days');
do $$ begin
  assert (select displayed_choice_order from public.question_flags limit 1) = array['choice-b','choice-a'], 'Actual choice order retained';
  assert (select char_length(comment) from public.question_flags limit 1) = 500, '500 Unicode characters accepted';
  assert (select received_at from public.question_flags limit 1) = now(), 'Server controls receipt timestamp';
  update public.question_flags set status = 'no_change';
  assert (select status from public.question_flags limit 1) = 'open', 'Player cannot change status';
  begin insert into public.question_flags(user_id,flag_id,question_id,question_variant_id,question_variant_version,concept_id,concept_version,clinical_release_id,content_version,app_version,displayed_choice_order,flagged_at)
    values('22222222-2222-4222-8222-222222222222','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','q','v','1','c','1','r','1','a',array['a','b'],now());
    raise exception 'Forged flag owner accepted'; exception when insufficient_privilege then null; end;
  begin insert into public.question_flags(flag_id,question_id,question_variant_id,question_variant_version,concept_id,concept_version,clinical_release_id,content_version,app_version,displayed_choice_order,comment,flagged_at)
    values('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','q','v','1','c','1','r','1','a',array['a','b'],repeat('x',501),now());
    raise exception 'Long comment accepted'; exception when check_violation then null; end;
  begin insert into public.question_flags(flag_id,question_id,question_variant_id,question_variant_version,concept_id,concept_version,clinical_release_id,content_version,app_version,displayed_choice_order,chosen_answer_id,flagged_at)
    values('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','q','v','1','c','1','r','1','a',array['a','b'],'outside-order',now());
    raise exception 'Unknown chosen answer accepted'; exception when check_violation then null; end;
  begin insert into public.question_flags(flag_id,question_id,question_variant_id,question_variant_version,concept_id,concept_version,clinical_release_id,content_version,app_version,displayed_choice_order,flagged_at)
    values('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','q','v','1','c','1','r','1','a',array['a','a'],now());
    raise exception 'Duplicate choice IDs accepted'; exception when check_violation then null; end;
end $$;
reset role;

-- Rate checks use identical accepted receipts, so request spam cannot inflate totals.
delete from gamify_private.usage_ingest_limits where user_id = '11111111-1111-4111-8111-111111111111';
set local role authenticated;
do $$ declare v_batch jsonb; v_index integer; begin
  v_batch := jsonb_build_array(jsonb_build_object('receipt_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'kind','question', 'occurred_at',now()));
  for v_index in 1..20 loop perform public.ingest_player_usage(v_batch,'first-scored-patient-and-employee.v1'); end loop;
  begin perform public.ingest_player_usage(v_batch,'first-scored-patient-and-employee.v1'); raise exception 'Request rate limit bypassed';
    exception when check_violation then null; end;
  assert (select sum(question_count) from public.player_usage_days) = 1, 'Spam contributes no duplicates';
end $$;
reset role;

-- Owner read-all requires the server-owned allowlist AND actual MFA assurance.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","aal":"aal1"}', true); end $$;
set local role authenticated;
do $$ begin assert (select count(*) from public.player_usage_days) = 0, 'Owner without MFA cannot read all'; end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","aal":"aal2"}', true); end $$;
set local role authenticated;
do $$ begin
  assert (select sum(question_count) from public.player_usage_days where user_id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333')) = 6, 'MFA owner reads A and B';
  update public.question_flags set status = 'fixed_in_version', fixed_in_version = 'release.fixed', resolved_at = now() where flag_id='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  assert (select status from public.question_flags where flag_id='dddddddd-dddd-4ddd-8ddd-dddddddddddd') = 'fixed_in_version', 'Owner alone controls disposition';
end $$;
reset role;

do $$ begin
  assert (select total_play_time from gamify_private.owner_usage_report where player = 'usage-b@example.invalid') = '25:01', 'Report hours do not wrap at 24';
  assert (select total_questions from gamify_private.owner_usage_report where player = 'usage-b@example.invalid') = 5, 'Report aggregates before joining';
  assert (select total_play_time from gamify_private.owner_usage_report where player = 'usage-owner@example.invalid') = '0:00', 'Zero-activity invitee included';
  assert not exists (select 1 from gamify_private.usage_receipts where user_id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333') and payload ?| array['answer','correct','question_id','concept_id','patient']), 'Usage has no clinical detail';
end $$;

-- Fresh revocation rejects the same otherwise valid JWT.
update gamify_private.player_memberships set revoked_at = now() where user_id = '22222222-2222-4222-8222-222222222222';
do $$ begin perform set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","aal":"aal1"}', true); end $$;
set local role authenticated;
do $$ begin
  assert public.get_usage_access()->>'admitted' = 'false', 'Revocation is fresh';
  begin perform public.accept_usage_notice('beta1.usage.v1'); raise exception 'Revoked write allowed';
    exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Compaction preserves retained daily totals and rejects old IDs forever.
insert into gamify_private.usage_receipts(user_id,receipt_id,occurred_at,kind,payload)
  values('11111111-1111-4111-8111-111111111111','ffffffff-ffff-4fff-8fff-ffffffffffff',now()-interval '8 days','question','{}');
insert into public.player_usage_days(user_id,usage_date,metric_version,question_count)
  values('11111111-1111-4111-8111-111111111111',(now() at time zone 'UTC')::date-90,'first-scored-patient-and-employee.v1',123);
update public.question_flags set received_at = now()-interval '90 days' where user_id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333');
do $$ begin perform gamify_private.purge_beta1_retained_data(); end $$;
do $$ begin
  assert not exists(select 1 from gamify_private.usage_receipts where receipt_id='ffffffff-ffff-4fff-8fff-ffffffffffff'), 'Eight-day detail compacted';
  assert not exists(select 1 from public.player_usage_days where user_id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333') and usage_date<(now() at time zone 'UTC')::date-89), 'Expired daily rows removed';
  assert not exists(select 1 from public.question_flags where user_id in ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333')), 'Expired attributable flags removed';
  assert (select sum(question_count) from public.player_usage_days where user_id='11111111-1111-4111-8111-111111111111') = 1, 'Retained totals survive compaction';
end $$;

do $$ begin perform set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","aal":"aal1"}', true); end $$;
set local role authenticated;
do $$ begin perform public.request_usage_data_deletion(); end $$;
do $$ begin perform public.request_usage_data_deletion(); end $$;
do $$ begin
  assert public.get_usage_access()->>'deletion_requested' = 'true', 'Deletion is idempotent and blocks';
  begin perform public.accept_usage_notice('beta1.usage.v1'); raise exception 'Deleted account regained consent';
    exception when insufficient_privilege then null; end;
  begin perform public.ingest_player_usage(jsonb_build_array(jsonb_build_object('receipt_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','kind','question','occurred_at',now())),'first-scored-patient-and-employee.v1');
    raise exception 'Deleted account replayed usage'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from public.player_usage_days where user_id='11111111-1111-4111-8111-111111111111'), 'Usage deleted';
  assert not exists(select 1 from gamify_private.usage_receipts where user_id='11111111-1111-4111-8111-111111111111'), 'Receipts deleted';
  assert (select sum(question_count) from public.player_usage_days where user_id='22222222-2222-4222-8222-222222222222') = 5, 'B data preserved';
  assert not exists(select 1 from gamify_private.owner_usage_report where player='usage-a@example.invalid'), 'Deleted player absent from report';
end $$;

delete from auth.users where id='11111111-1111-4111-8111-111111111111';
set local role authenticated;
do $$ begin
  assert public.get_usage_access()->>'admitted' = 'false', 'Deleted Auth UUID rejected with stale JWT';
  begin perform public.accept_usage_notice('beta1.usage.v1'); raise exception 'Stale JWT accepted';
    exception when insufficient_privilege then null; end;
end $$;
reset role;

select 'PASS: Beta 1 synthetic grants/RLS/notice/dedup/limits/report/retention/deletion checks; rollback follows' as result;
rollback;
