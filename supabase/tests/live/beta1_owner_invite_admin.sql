-- LIVE GAME PROJECT variant of ../beta1_owner_invite_admin.sql; postgres, ENTIRE file.
-- Owner decision 2026-10-17: synthetic BEGIN ... ROLLBACK only. NOT executed.
-- Original expected values and all permission/own-RLS checks are preserved.
-- Owner-wide totals and fixture edits are scoped; collision guards fail closed.
-- The REAL retention routine still visits expired rows globally, under rollback.
-- Run in a quiet window; on any error issue ROLLBACK; never COMMIT.
begin;
set local plpgsql.check_asserts = on;
do $fixture_guard$ begin
  assert not exists(select 1 from auth.users where id in ('44444444-4444-4444-8444-444444444444','55555555-5555-4555-8555-555555555555','66666666-6666-4666-8666-666666666666','77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','99999999-9999-4999-8999-999999999999')
    or lower(email) in ('invite-pending@example.invalid','invite-owner@example.invalid','invite-deleted@example.invalid','not-invited@example.invalid','invite-banned@example.invalid','invite-anonymous@example.invalid')), 'Synthetic fixture collision: stop without changing identities';
end $fixture_guard$;
insert into auth.users(id, email, invited_at, email_confirmed_at, aud, role, is_anonymous) values
  ('44444444-4444-4444-8444-444444444444', 'invite-pending@example.invalid', now(), null, 'authenticated', 'authenticated', false),
  ('55555555-5555-4555-8555-555555555555', 'invite-owner@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('66666666-6666-4666-8666-666666666666', 'invite-deleted@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('77777777-7777-4777-8777-777777777777', 'not-invited@example.invalid', null, now(), 'authenticated', 'authenticated', false),
  ('88888888-8888-4888-8888-888888888888', 'invite-banned@example.invalid', now(), now(), 'authenticated', 'authenticated', false),
  ('99999999-9999-4999-8999-999999999999', 'invite-anonymous@example.invalid', now(), now(), 'authenticated', 'authenticated', true);
update auth.users set banned_until = now() + interval '1 day'
  where id = '88888888-8888-4888-8888-888888888888';
insert into gamify_private.player_memberships(user_id, deletion_requested_at) values
  ('66666666-6666-4666-8666-666666666666', now());

do $$ begin
  assert not has_function_privilege('anon', 'public.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Anonymous wrapper denied';
  assert not has_function_privilege('authenticated', 'public.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Player wrapper denied';
  assert not has_function_privilege('anon', 'gamify_private.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Anonymous body denied';
  assert not has_function_privilege('authenticated', 'gamify_private.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Player body denied';
  assert has_function_privilege('service_role', 'public.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Service wrapper allowed';
  assert has_function_privilege('service_role', 'gamify_private.beta1_admin_members(text,uuid,boolean)', 'execute'), 'Service body allowed';
  assert (select relrowsecurity from pg_class where oid = 'gamify_private.player_memberships'::regclass), 'Membership RLS retained';
  assert (select relrowsecurity from pg_class where oid = 'gamify_private.usage_owners'::regclass), 'Owner RLS retained';
  assert not (select prosecdef from pg_proc where oid = 'public.beta1_admin_members(text,uuid,boolean)'::regprocedure), 'Wrapper is invoker';
  assert (select prosecdef from pg_proc where oid = 'gamify_private.beta1_admin_members(text,uuid,boolean)'::regprocedure), 'Body is private definer';
end $$;

do $$ begin perform set_config('request.jwt.claims', '{"role":"service_role"}', true); end $$;
set local role anon;
do $$ begin
  begin perform public.beta1_admin_members('list'); raise exception 'Anonymous wrapper unexpectedly allowed';
    exception when insufficient_privilege then null; end;
end $$;
reset role;
-- Even a spoofed service_role claim cannot overcome authenticated EXECUTE ACLs.
set local role authenticated;
do $$ begin
  begin perform public.beta1_admin_members('admit', '44444444-4444-4444-8444-444444444444', true);
    raise exception 'Player self-admission unexpectedly allowed'; exception when insufficient_privilege then null; end;
  begin perform gamify_private.beta1_admin_members('list'); raise exception 'Player private body unexpectedly allowed';
    exception when insufficient_privilege then null; end;
end $$;
reset role;

-- EXECUTE alone is insufficient when the verified JWT is not service_role.
do $$ begin perform set_config('request.jwt.claims', '{"role":"authenticated"}', true); end $$;
set local role service_role;
do $$ begin
  begin perform public.beta1_admin_members('list'); raise exception 'Non-service claim unexpectedly allowed';
    exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin perform set_config('request.jwt.claims', '{"role":"service_role"}', true); end $$;
set local role service_role;
do $$ declare v_roster jsonb; v_id uuid; begin
  perform public.beta1_admin_members('admit', '44444444-4444-4444-8444-444444444444');
  perform public.beta1_admin_members('admit', '44444444-4444-4444-8444-444444444444');
  perform public.beta1_admin_members('admit', '55555555-5555-4555-8555-555555555555', true);
  v_roster := public.beta1_admin_members('list');
  assert (select count(*) from jsonb_array_elements(v_roster) r where r->>'user_id' = '44444444-4444-4444-8444-444444444444') = 1, 'Retry idempotent';
  assert (select r->>'confirmed_at' is null from jsonb_array_elements(v_roster) r where r->>'user_id' = '44444444-4444-4444-8444-444444444444'), 'Pending confirmation visible';
  assert (select (r->>'is_owner')::boolean and r->>'confirmed_at' is not null from jsonb_array_elements(v_roster) r where r->>'user_id' = '55555555-5555-4555-8555-555555555555'), 'Confirmed owner visible';
  foreach v_id in array array['66666666-6666-4666-8666-666666666666'::uuid, '77777777-7777-4777-8777-777777777777'::uuid,
    '88888888-8888-4888-8888-888888888888'::uuid, '99999999-9999-4999-8999-999999999999'::uuid] loop
    begin perform public.beta1_admin_members('admit', v_id, true); raise exception 'Ineligible admission unexpectedly allowed';
      exception when insufficient_privilege then null; end;
  end loop;
  begin perform public.beta1_admin_members('revoke', '77777777-7777-4777-8777-777777777777'); raise exception 'Missing membership unexpectedly created';
    exception when insufficient_privilege then null; end;
  begin perform public.beta1_admin_members('list', null, true); raise exception 'Invalid request unexpectedly allowed';
    exception when invalid_parameter_value then null; end;
end $$;
reset role;

update gamify_private.player_memberships set accepted_notice_version = 'beta1.usage.v1', accepted_notice_at = now()
  where user_id = '55555555-5555-4555-8555-555555555555';
set local role service_role;
do $$ begin perform public.beta1_admin_members('admit', '55555555-5555-4555-8555-555555555555'); end $$;
reset role;
do $$ begin
  assert (select accepted_notice_at is not null from gamify_private.player_memberships where user_id = '55555555-5555-4555-8555-555555555555'), 'Readmission does not change consent';
end $$;
set local role service_role;
do $$ begin perform public.beta1_admin_members('revoke', '55555555-5555-4555-8555-555555555555'); end $$;
do $$ begin perform public.beta1_admin_members('revoke', '55555555-5555-4555-8555-555555555555'); end $$;
do $$ begin
  begin perform public.beta1_admin_members('admit', '55555555-5555-4555-8555-555555555555', true); raise exception 'Revoked owner unexpectedly readmitted';
    exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert (select revoked_at is not null and accepted_notice_at is null from gamify_private.player_memberships where user_id = '55555555-5555-4555-8555-555555555555'), 'Revocation tombstone and consent stop';
  assert not exists (select 1 from gamify_private.usage_owners where user_id = '55555555-5555-4555-8555-555555555555'), 'Owner access removed';
  assert (select deletion_requested_at is not null from gamify_private.player_memberships where user_id = '66666666-6666-4666-8666-666666666666'), 'Deletion marker retained';
  assert not exists (select 1 from gamify_private.player_memberships where user_id in ('77777777-7777-4777-8777-777777777777','88888888-8888-4888-8888-888888888888','99999999-9999-4999-8999-999999999999')), 'Rejected accounts remain unadmitted';
end $$;
do $$ begin perform set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated","aal":"aal2"}', true); end $$;
set local role authenticated;
do $$ begin
  assert not gamify_private.is_usage_owner(), 'Stale AAL2 JWT loses owner permission';
  assert public.get_usage_access()->>'admitted' = 'false', 'Stale player JWT loses admission';
end $$;
reset role;

select 'PASS: Beta 1 owner-only invite/roster/RLS/revocation/deletion-marker checks; rollback follows' as result;
rollback;
