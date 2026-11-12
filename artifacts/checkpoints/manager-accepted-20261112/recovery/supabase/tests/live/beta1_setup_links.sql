-- LIVE GAME PROJECT variant of ../beta1_setup_links.sql; postgres, ENTIRE file.
-- Owner decision 2026-10-17: synthetic BEGIN ... ROLLBACK only. NOT executed.
-- Original expected values and all permission/own-RLS checks are preserved.
-- Owner-wide totals and fixture edits are scoped; collision guards fail closed.
-- The REAL retention routine still visits expired rows globally, under rollback.
-- Run in a quiet window; on any error issue ROLLBACK; never COMMIT.
begin;
set local plpgsql.check_asserts = on;
do $fixture_guard$ begin
  assert not exists(select 1 from auth.users where id in ('a1111111-1111-4111-8111-111111111111','a2222222-2222-4222-8222-222222222222','a3333333-3333-4333-8333-333333333333','a4444444-4444-4444-8444-444444444444','a5555555-5555-4555-8555-555555555555','a6666666-6666-4666-8666-666666666666','a7777777-7777-4777-8777-777777777777','a8888888-8888-4888-8888-888888888888')
    or lower(email) in ('setup-pending@example.invalid','setup-active@example.invalid','setup-revoked@example.invalid','setup-deleting@example.invalid','setup-stranger@example.invalid','setup-banned@example.invalid','unknown@example.invalid','setup-new@example.invalid','setup-recover@example.invalid','setup-late@example.invalid','setup-never-used@example.invalid','setup-cancel@example.invalid')), 'Synthetic fixture collision: stop without changing identities';
  assert not exists(select 1 from gamify_private.setup_codes where email in ('setup-pending@example.invalid','setup-active@example.invalid','setup-revoked@example.invalid','setup-deleting@example.invalid','setup-stranger@example.invalid','setup-banned@example.invalid','unknown@example.invalid','setup-new@example.invalid','setup-recover@example.invalid','setup-late@example.invalid','setup-never-used@example.invalid','setup-cancel@example.invalid')), 'Synthetic setup-email collision: stop';
end $fixture_guard$;
insert into auth.users(id, email, invited_at, email_confirmed_at, aud, role, is_anonymous) values
  ('a1111111-1111-4111-8111-111111111111', 'setup-pending@example.invalid', null, null, 'authenticated', 'authenticated', false),
  ('a2222222-2222-4222-8222-222222222222', 'setup-active@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('a3333333-3333-4333-8333-333333333333', 'setup-revoked@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('a4444444-4444-4444-8444-444444444444', 'setup-deleting@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('a5555555-5555-4555-8555-555555555555', 'setup-stranger@example.invalid', null, now(), 'authenticated', 'authenticated', false),
  ('a6666666-6666-4666-8666-666666666666', 'setup-banned@example.invalid', now(), now(), 'authenticated', 'authenticated', false);
insert into gamify_private.player_memberships(user_id, revoked_at, deletion_requested_at) values
  ('a2222222-2222-4222-8222-222222222222', null, null),
  ('a3333333-3333-4333-8333-333333333333', now(), null),
  ('a4444444-4444-4444-8444-444444444444', null, now()),
  ('a6666666-6666-4666-8666-666666666666', null, null);
update auth.users set banned_until = now() + interval '1 day' where id = 'a6666666-6666-4666-8666-666666666666';

-- User metadata cannot spoof a trusted pending/admitted identity.
update auth.users set raw_user_meta_data = '{"gamify_setup_pending":true,"gamify_setup_admitted":true}'
  where id = 'a5555555-5555-4555-8555-555555555555';

do $$ declare v_signature text; v_schema text; v_privilege text; begin
  foreach v_schema in array array['public', 'gamify_private'] loop
    foreach v_signature in array array['beta1_setup_admin(text,text,text,text,boolean)', 'beta1_lookup_setup_code(text)',
      'beta1_claim_setup_code(text,uuid,boolean)', 'beta1_finish_setup_code(uuid,uuid)'] loop
      assert not has_function_privilege('anon', v_schema || '.' || v_signature, 'execute'), 'Anon RPC denied';
      assert not has_function_privilege('authenticated', v_schema || '.' || v_signature, 'execute'), 'Player RPC denied';
      assert has_function_privilege('service_role', v_schema || '.' || v_signature, 'execute'), 'Service RPC granted';
      assert (select prosecdef from pg_proc where oid = (v_schema || '.' || v_signature)::regprocedure) = (v_schema = 'gamify_private'), 'Private definer/public invoker';
    end loop;
  end loop;
  foreach v_privilege in array array['select', 'insert', 'update', 'delete'] loop
    assert not has_table_privilege('anon', 'gamify_private.setup_codes', v_privilege), 'Anon table denied';
    assert not has_table_privilege('authenticated', 'gamify_private.setup_codes', v_privilege), 'Player table denied';
    assert has_table_privilege('service_role', 'gamify_private.setup_codes', v_privilege), 'Service table granted';
  end loop;
  assert (select relrowsecurity from pg_class where oid = 'gamify_private.setup_codes'::regclass), 'RLS on';
end $$;

-- A spoofed role claim does not defeat EXECUTE ACLs.
do $$ begin perform set_config('request.jwt.claims', '{"role":"service_role"}', true); end $$;
set local role anon;
do $$ begin
  begin perform public.beta1_setup_admin('list'); raise exception 'Anon setup unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
do $$ begin
  begin perform public.beta1_lookup_setup_code('setup-pending@example.invalid'); raise exception 'Player lookup unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_claim_setup_code('setup-pending@example.invalid', null, true); raise exception 'Player claim unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_finish_setup_code(null, 'a1111111-1111-4111-8111-111111111111'); raise exception 'Player admit unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"role":"authenticated"}', true); end $$;
set local role service_role;
do $$ begin
  begin perform public.beta1_setup_admin('list'); raise exception 'Non-service claim unexpectedly allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"role":"service_role"}', true); end $$;
set local role service_role;
do $$ declare v_first uuid; v_id uuid; v_claim jsonb; v_email text; begin
  v_first := (public.beta1_setup_admin('issue', ' Setup-Pending@Example.Invalid ', repeat('a', 64), 'invite', true)->>'id')::uuid;
  v_id := (public.beta1_setup_admin('issue', 'setup-pending@example.invalid', repeat('b', 64), 'invite', true)->>'id')::uuid;
  assert (select cancelled_at is not null from gamify_private.setup_codes where id = v_first), 'Replacement cancels old';
  assert (select count(*) from gamify_private.setup_codes where email = 'setup-pending@example.invalid' and used_at is null and cancelled_at is null) = 1, 'Exactly one active';
  assert public.beta1_claim_setup_code('setup-pending@example.invalid', v_first, true)->>'status' = 'invalid', 'Stale compared row denied';
  for i in 1..9 loop
    assert public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, false)->>'status' = 'invalid', 'Generic wrong-code result';
  end loop;
  assert (select failed_attempts = 9 and cancelled_at is null from gamify_private.setup_codes where id = v_id), 'Nine failures persist';
  perform public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, false);
  assert (select failed_attempts = 10 and cancelled_at is not null from gamify_private.setup_codes where id = v_id), 'Tenth cancels';
  assert public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, true)->>'status' = 'invalid', 'Correct code cannot revive cancelled';
  assert public.beta1_claim_setup_code('unknown@example.invalid', null, false)->>'status' = 'invalid', 'Unknown email same error';
  v_id := (public.beta1_setup_admin('issue', 'setup-pending@example.invalid', repeat('c', 64), 'invite', true)->>'id')::uuid;
  -- There is intentionally NO expiry check, even for years-old pending links.
  update gamify_private.setup_codes set created_at = now() - interval '10 years' where email = 'setup-pending@example.invalid';
  -- Make the newest replacement unambiguously latest after the fixture edit.
  update gamify_private.setup_codes set created_at = now() - interval '9 years' where id = v_id;
  assert public.beta1_lookup_setup_code('setup-pending@example.invalid')->>'id' = v_id::text, 'Lookup selects replacement';
  v_claim := public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, true);
  assert v_claim->>'status' = 'claimed' and v_claim->>'purpose' = 'invite', 'Old valid code claims';
  assert public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, true)->>'status' = 'used', 'Single use';
  assert not (public.beta1_finish_setup_code(v_id, 'a2222222-2222-4222-8222-222222222222')->>'ok')::boolean, 'Cannot bind another email';
  foreach v_email in array array['setup-revoked@example.invalid', 'setup-deleting@example.invalid', 'setup-banned@example.invalid', 'setup-stranger@example.invalid', 'unknown@example.invalid'] loop
    begin perform public.beta1_setup_admin('issue', v_email, repeat('d', 64), 'reset'); raise exception 'Ineligible reset unexpectedly allowed'; exception when insufficient_privilege then null; end;
  end loop;
  begin perform public.beta1_setup_admin('issue', 'setup-active@example.invalid', repeat('e', 64), 'invite'); raise exception 'Confirmed account invite unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_setup_admin('issue', 'setup-stranger@example.invalid', repeat('e', 64), 'invite'); raise exception 'Confirmed stranger invite unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform public.beta1_setup_admin('issue', 'setup-new@example.invalid', 'raw-code-not-a-hash', 'invite'); raise exception 'Plaintext code unexpectedly accepted'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
-- Auth succeeded but a prior finalization failed: a fresh invite can recover
-- that trusted pending game identity, which cannot enter through client auth.
insert into auth.users(id, email, email_confirmed_at, aud, role, is_anonymous, raw_app_meta_data) values
  ('a7777777-7777-4777-8777-777777777777', 'setup-recover@example.invalid', now(), 'authenticated', 'authenticated', false, '{"gamify_setup_pending":true}');
set local role service_role;
do $$ declare v_id uuid; begin
  v_id := (public.beta1_setup_admin('issue', 'setup-recover@example.invalid', repeat('2', 64), 'invite')->>'id')::uuid;
  assert public.beta1_claim_setup_code('setup-recover@example.invalid', v_id, true)->>'user_id' = 'a7777777-7777-4777-8777-777777777777', 'Recover failed finalization';
  assert (public.beta1_finish_setup_code(v_id, 'a7777777-7777-4777-8777-777777777777')->>'ok')::boolean, 'Recovered admission';
  perform public.beta1_setup_admin('issue', 'setup-late@example.invalid', repeat('3', 64), 'invite');
end $$;
reset role;
insert into auth.users(id, email, email_confirmed_at, aud, role, is_anonymous, raw_app_meta_data) values
  ('a8888888-8888-4888-8888-888888888888', 'setup-late@example.invalid', now(), 'authenticated', 'authenticated', false, '{"gamify_setup_pending":true}');
set local role service_role;
do $$ declare v_id uuid; begin
  v_id := (public.beta1_lookup_setup_code('setup-late@example.invalid')->>'id')::uuid;
  assert public.beta1_claim_setup_code('setup-late@example.invalid', v_id, true)->>'user_id' = 'a8888888-8888-4888-8888-888888888888', 'Bind late pending identity without duplicate create';
  assert (public.beta1_finish_setup_code(v_id, 'a8888888-8888-4888-8888-888888888888')->>'ok')::boolean, 'Late pending admission';
end $$;
reset role;
do $$ begin
  assert not (select raw_app_meta_data ? 'gamify_setup_pending' from auth.users where id = 'a7777777-7777-4777-8777-777777777777'), 'Finalization removes pending marker';
end $$;
do $$ begin
  assert not exists (select 1 from gamify_private.player_memberships where user_id = 'a1111111-1111-4111-8111-111111111111'), 'Issue/claim do not admit';
end $$;
-- Simulate ONLY the result of the separate successful Auth admin HTTP call.
update auth.users set email_confirmed_at = now() where id = 'a1111111-1111-4111-8111-111111111111';
set local role service_role;
do $$ declare v_id uuid; v_rows jsonb; begin
  v_id := (public.beta1_lookup_setup_code('setup-pending@example.invalid')->>'id')::uuid;
  assert (public.beta1_finish_setup_code(v_id, 'a1111111-1111-4111-8111-111111111111')->>'ok')::boolean, 'Finalize admits setup user';
  v_rows := public.beta1_setup_admin('list');
  assert not exists (select 1 from jsonb_array_elements(v_rows) r where r ? 'code_hash'), 'Tool list omits hashes';
end $$;
reset role;
do $$ begin
  assert (select raw_app_meta_data @> '{"gamify_setup_admitted":true}'::jsonb and invited_at is null from auth.users where id = 'a1111111-1111-4111-8111-111111111111'), 'Server marker, no invented provider invite';
  assert exists (select 1 from gamify_private.usage_owners where user_id = 'a1111111-1111-4111-8111-111111111111'), 'Explicit owner grant at finalize';
end $$;
do $$ begin perform set_config('request.jwt.claims', '{"role":"authenticated","sub":"a1111111-1111-4111-8111-111111111111","aal":"aal1"}', true); end $$;
set local role authenticated;
do $$ begin
  assert (public.get_usage_access()->>'admitted')::boolean, 'Setup user admitted without provider OTP';
  assert not gamify_private.can_record_usage(), 'Notice still required';
  assert not gamify_private.is_usage_owner(), 'Owner still needs AAL2';
  perform public.accept_usage_notice('beta1.usage.v1');
  assert gamify_private.can_record_usage(), 'Setup guard accepts after notice';
end $$;
reset role;

do $$ begin perform set_config('request.jwt.claims', '{"role":"service_role"}', true); end $$;
set local role service_role;
do $$ declare v_id uuid; begin
  v_id := (public.beta1_setup_admin('issue', 'setup-pending@example.invalid', repeat('f', 64), 'reset')->>'id')::uuid;
  assert public.beta1_claim_setup_code('setup-pending@example.invalid', v_id, true)->>'status' = 'claimed', 'Active setup member resets';
  perform public.beta1_admin_members('revoke', 'a1111111-1111-4111-8111-111111111111');
  assert (select cancelled_at is not null from gamify_private.setup_codes where id = v_id), 'Revoke cancels in-flight code';
  assert not (public.beta1_finish_setup_code(v_id, 'a1111111-1111-4111-8111-111111111111')->>'ok')::boolean, 'Revoke prevents finalization';
  perform public.beta1_setup_admin('issue', 'setup-never-used@example.invalid', repeat('0', 64), 'invite');
  perform public.beta1_setup_admin('issue', 'setup-cancel@example.invalid', repeat('1', 64), 'invite');
  perform public.beta1_setup_admin('cancel', 'setup-cancel@example.invalid');
  perform public.beta1_setup_admin('cancel', 'setup-cancel@example.invalid');
end $$;
reset role;
update gamify_private.setup_codes set created_at = now() - interval '10 years' where email = 'setup-never-used@example.invalid';
update gamify_private.setup_codes set cancelled_at = now() - interval '91 days' where email = 'setup-cancel@example.invalid';
do $$ begin perform gamify_private.purge_beta1_retained_data(); end $$;
do $$ begin
  assert exists (select 1 from gamify_private.setup_codes where email = 'setup-never-used@example.invalid'), 'Purge never expires pending';
  assert not exists (select 1 from gamify_private.setup_codes where email = 'setup-cancel@example.invalid'), 'Terminal records purged';
end $$;
delete from auth.users where id = 'a1111111-1111-4111-8111-111111111111';
do $$ begin
  assert not exists (select 1 from gamify_private.setup_codes where email = 'setup-pending@example.invalid'), 'Auth deletion cascades bound setup records';
end $$;

select 'PASS: Beta 1 setup grants/hash-only/attempts/nonexpiry/single-use/admission/revoke/retention checks; rollback follows' as result;
rollback;
