-- Rollback-only checks for a DISPOSABLE Supabase DB after all four migrations.
-- Prepared offline; no SQL execution is claimed by the worker.
begin;
set local plpgsql.check_asserts = on;
insert into auth.users(id, email, invited_at, email_confirmed_at, aud, role) values
  ('11111111-1111-4111-8111-111111111111', 'feedback-a@example.invalid', now(), now(), 'authenticated', 'authenticated'),
  ('22222222-2222-4222-8222-222222222222', 'feedback-b@example.invalid', now(), now(), 'authenticated', 'authenticated'),
  ('33333333-3333-4333-8333-333333333333', 'feedback-owner@example.invalid', now(), now(), 'authenticated', 'authenticated');
insert into gamify_private.player_memberships(user_id) values
  ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222'), ('33333333-3333-4333-8333-333333333333');
insert into gamify_private.usage_owners(user_id) values ('33333333-3333-4333-8333-333333333333');

do $$ begin
  assert (select relrowsecurity from pg_class where oid = 'public.tester_feedback'::regclass), 'Feedback RLS';
  assert not has_table_privilege('anon', 'public.tester_feedback', 'select'), 'No anonymous reads';
  assert not has_table_privilege('anon', 'public.tester_feedback', 'insert'), 'No anonymous writes';
  assert not has_function_privilege('anon', 'public.submit_tester_feedback(uuid,text,text,text,integer,text)', 'execute'), 'No anonymous RPC';
  assert not has_column_privilege('authenticated', 'public.tester_feedback', 'comment', 'update'), 'Original comment immutable';
  assert not has_column_privilege('authenticated', 'public.tester_feedback', 'user_id', 'update'), 'Identity immutable';
  assert not has_table_privilege('authenticated', 'public.tester_feedback', 'delete'), 'No direct deletes';
  assert has_table_privilege('service_role', 'public.tester_feedback', 'select'), 'Local owner tool reads';
  assert has_column_privilege('service_role', 'public.tester_feedback', 'status', 'update'), 'Local owner tool status';
  assert not has_column_privilege('service_role', 'public.tester_feedback', 'comment', 'update'), 'Tool cannot rewrite comments';
  assert not (select prosecdef from pg_proc where oid = 'public.submit_tester_feedback(uuid,text,text,text,integer,text)'::regprocedure), 'Exposed wrapper invoker';
  assert (select prosecdef from pg_proc where oid = 'gamify_private.submit_tester_feedback(uuid,text,text,text,integer,text)'::regprocedure), 'Private validated definer';
end $$;

set local role anon;
do $$ begin
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Comment', 'beta1', 'build1', 0, 'desktop');
    raise exception 'Anonymous RPC unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
select public.submit_tester_feedback('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'B comment', 'beta1', 'build1', 5, 'phone');
reset role;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
do $$ declare v_ack jsonb; v_count integer; begin
  assert public.get_usage_access()->>'notice_accepted' = 'false', 'Feedback independent of usage consent';
  v_ack := public.submit_tester_feedback('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', E' \tHelpful\n ', 'beta1', 'build1', 4, 'desktop');
  assert v_ack->>'id' = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Acknowledgement identity';
  assert (select comment from public.tester_feedback) = 'Helpful', 'Trimmed comment';
  assert (select created_at from public.tester_feedback) = now(), 'Server timestamp';
  assert (select count(*) from public.tester_feedback) = 1, 'Read own only';
  assert (select status = 'new' and owner_note is null from public.tester_feedback), 'Player cannot choose disposition';
  update public.tester_feedback set status = 'done', owner_note = 'Self approval';
  get diagnostics v_count = row_count;
  assert v_count = 0, 'Player disposition update denied by RLS';
  begin perform public.submit_tester_feedback('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Changed', 'beta1', 'build1', 4, 'desktop');
    raise exception 'Changed retry accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_tester_feedback(gen_random_uuid(), E' \t\n ', 'beta1', 'build1', 4, 'desktop');
    raise exception 'Blank comment accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_tester_feedback(gen_random_uuid(), U&'\00A0\2000\3000\FEFF', 'beta1', 'build1', 4, 'desktop');
    raise exception 'Unicode whitespace-only comment accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_tester_feedback(gen_random_uuid(), repeat('é',1001), 'beta1', 'build1', 4, 'desktop');
    raise exception 'Long comment accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Comment', 'beta1', 'build1', -1, 'desktop');
    raise exception 'Bad level accepted'; exception when invalid_parameter_value then null; end;
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Comment', 'beta1', 'build1', 4, 'tablet');
    raise exception 'Bad shell accepted'; exception when invalid_parameter_value then null; end;
  begin insert into public.tester_feedback(user_id,comment,release_version,app_version,level,shell)
    values('22222222-2222-4222-8222-222222222222','Forged','beta1','build1',4,'desktop');
    raise exception 'Forged ownership accepted'; exception when insufficient_privilege then null; end;
  begin insert into public.tester_feedback(comment,release_version,app_version,level,shell,status)
    values('Forged','beta1','build1',4,'desktop','done');
    raise exception 'Forged status accepted'; exception when insufficient_privilege then null; end;
  begin insert into public.tester_feedback(comment,release_version,app_version,level,shell,owner_note)
    values('Forged','beta1','build1',4,'desktop','Forged note');
    raise exception 'Forged owner note accepted'; exception when insufficient_privilege then null; end;
end $$;
-- Direct inserts use the same validation/quota and cannot spoof created_at.
insert into public.tester_feedback(id,comment,release_version,app_version,level,shell,created_at)
  values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', repeat('é',1000), 'beta1', 'build1', 4, 'desktop', now() - interval '10 days');
do $$ declare i integer; begin
  assert (select created_at from public.tester_feedback where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc') = now(), 'Direct insert timestamp normalized';
  for i in 1..18 loop
    perform public.submit_tester_feedback(gen_random_uuid(), 'Quota comment', 'beta1', 'build1', 4, 'desktop');
  end loop;
  assert (select count(*) from public.tester_feedback) = 20, 'Twenty new comments allowed';
  perform public.submit_tester_feedback('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Helpful', 'beta1', 'build1', 4, 'desktop');
  assert (select count(*) from public.tester_feedback) = 20, 'Retry at quota is idempotent';
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Twenty-first', 'beta1', 'build1', 4, 'desktop');
    raise exception 'Quota bypass accepted'; exception when sqlstate 'P0001' then assert sqlerrm = 'Feedback rate limit reached', 'Expected quota rejection'; end;
  begin insert into public.tester_feedback(comment,release_version,app_version,level,shell)
    values('Direct quota bypass','beta1','build1',4,'desktop');
    raise exception 'Direct quota bypass accepted'; exception when sqlstate 'P0001' then assert sqlerrm = 'Feedback rate limit reached', 'Expected direct quota rejection'; end;
end $$;
reset role;

select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
do $$ begin assert (select count(*) from public.tester_feedback) = 0, 'Owner without AAL2 cannot read all'; end $$;
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","aal":"aal2"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.tester_feedback) = 21, 'AAL2 owner reads all';
  update public.tester_feedback set status='planned', owner_note='Owner decided to plan'
    where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  assert (select status='planned' and owner_note='Owner decided to plan' from public.tester_feedback where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 'Owner disposition allowed';
  begin update public.tester_feedback set status='unknown' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    raise exception 'Invalid status accepted'; exception when check_violation then null; end;
end $$;
reset role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;
do $$ begin
  assert (select count(*) from public.tester_feedback) = 21, 'Owner tool reads all';
  update public.tester_feedback set status='discussed', owner_note='Owner discussed' where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
end $$;
reset role;

-- Match flags' strict 90-day boundary; the existing Cron target now purges both.
update public.tester_feedback set created_at=now()-interval '90 days' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
update public.tester_feedback set created_at=now()-interval '89 days' where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
select gamify_private.purge_beta1_retained_data();
do $$ begin
  assert not exists(select 1 from public.tester_feedback where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), 'Ninety-day feedback purged';
  assert exists(select 1 from public.tester_feedback where id='cccccccc-cccc-4ccc-8ccc-cccccccccccc'), 'Eighty-nine-day feedback retained';
end $$;

select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
select public.request_usage_data_deletion();
do $$ begin
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Stale replay', 'beta1', 'build1', 0, 'desktop');
    raise exception 'Deleted player wrote feedback'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists(select 1 from public.tester_feedback where user_id='11111111-1111-4111-8111-111111111111'), 'Player deletion removes feedback';
  assert exists(select 1 from public.tester_feedback where user_id='22222222-2222-4222-8222-222222222222'), 'Other account preserved';
  assert (select deletion_requested_at is not null from gamify_private.player_memberships where user_id='11111111-1111-4111-8111-111111111111'), 'Deletion marker retained';
end $$;

update gamify_private.player_memberships set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222';
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.tester_feedback) = 0, 'Revoked token cannot read comments';
  begin perform public.submit_tester_feedback(gen_random_uuid(), 'Revoked', 'beta1', 'build1', 5, 'phone');
    raise exception 'Revoked player wrote feedback'; exception when insufficient_privilege then null; end;
end $$;
reset role;
delete from auth.users where id='22222222-2222-4222-8222-222222222222';
do $$ begin assert not exists(select 1 from public.tester_feedback where user_id='22222222-2222-4222-8222-222222222222'), 'Auth cascade removes feedback'; end $$;

select 'PASS: Beta 1 feedback grants/RLS/validation/idempotency/quota/owner/retention/deletion checks; rollback follows' as result;
rollback;
