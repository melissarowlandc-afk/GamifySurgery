-- OWNER/MANAGER REVIEW before applying after the three existing migrations.
-- Voluntary comments only: no campaign contents or new usage measurements.
-- Authenticated owners still require is_usage_owner (allowlist + AAL2).
begin;

create table public.tester_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  comment text not null check (char_length(comment) between 1 and 1000
    and comment = btrim(comment, U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')),
  release_version text not null check (char_length(release_version) between 1 and 80),
  app_version text not null check (char_length(app_version) between 1 and 80),
  level integer not null check (level between 0 and 5),
  shell text not null check (shell in ('desktop', 'phone')),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'discussed', 'planned', 'done', 'wont_do')),
  owner_note text check (char_length(owner_note) <= 1000)
);
create index tester_feedback_player_time_idx on public.tester_feedback(user_id, created_at);
create index tester_feedback_review_idx on public.tester_feedback(status, created_at);
create index tester_feedback_retention_idx on public.tester_feedback(created_at);
alter table public.tester_feedback enable row level security;
revoke all on public.tester_feedback from public, anon, authenticated, service_role;
grant select, insert on public.tester_feedback to authenticated;
grant update(status, owner_note) on public.tester_feedback to authenticated, service_role;
grant select on public.tester_feedback to service_role;

create function gamify_private.guard_tester_feedback_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_id uuid := gamify_private.require_usage_player(false);
begin
  -- Explicit submission is voluntary, even when usage recording is off.
  -- The shared membership lock serializes the quota, revocation and deletion.
  if new.user_id is distinct from v_id or new.status is distinct from 'new'
    or new.owner_note is not null then
    raise exception 'Feedback access denied' using errcode = '42501';
  end if;
  new.comment := btrim(new.comment, U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
  if (select count(*) from public.tester_feedback
    where user_id = v_id and created_at > now() - interval '1 day') >= 20 then
    raise exception 'Feedback rate limit reached' using errcode = 'P0001';
  end if;
  new.created_at := now();
  return new;
end;
$$;
create trigger tester_feedback_guard before insert on public.tester_feedback
  for each row execute function gamify_private.guard_tester_feedback_insert();

create policy feedback_player_read on public.tester_feedback for select to authenticated
  using (user_id = (select auth.uid())
    and (select (gamify_private.get_usage_access()->>'admitted')::boolean)
    and created_at > now() - interval '90 days');
create policy feedback_player_insert on public.tester_feedback for insert to authenticated
  with check (user_id = (select auth.uid())
    and (select (gamify_private.get_usage_access()->>'admitted')::boolean)
    and status = 'new' and owner_note is null);
create policy feedback_owner_read on public.tester_feedback for select to authenticated
  using ((select gamify_private.is_usage_owner()) and created_at > now() - interval '90 days');
create policy feedback_owner_update on public.tester_feedback for update to authenticated
  using ((select gamify_private.is_usage_owner())) with check ((select gamify_private.is_usage_owner()));

-- Immutable submission identity makes a retry after a lost acknowledgement safe,
-- including after the player has reached the daily quota. No player/status args.
create function gamify_private.submit_tester_feedback(
  p_id uuid, p_comment text, p_release_version text, p_app_version text, p_level integer, p_shell text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := gamify_private.require_usage_player(false);
  v_comment text := btrim(p_comment, U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
  v_existing public.tester_feedback%rowtype;
  v_created_at timestamptz;
begin
  if p_id is null or v_comment is null or char_length(v_comment) not between 1 and 1000
    or p_release_version is null or char_length(p_release_version) not between 1 and 80
    or p_app_version is null or char_length(p_app_version) not between 1 and 80
    or p_level is null or p_level not between 0 and 5
    or p_shell is null or p_shell not in ('desktop', 'phone') then
    raise exception 'Invalid feedback' using errcode = '22023';
  end if;
  select * into v_existing from public.tester_feedback where id = p_id;
  if found then
    if v_existing.user_id is distinct from v_id or v_existing.comment is distinct from v_comment
      or v_existing.release_version is distinct from p_release_version or v_existing.app_version is distinct from p_app_version
      or v_existing.level is distinct from p_level or v_existing.shell is distinct from p_shell then
      raise exception 'Feedback identity conflict' using errcode = '22023';
    end if;
    return jsonb_build_object('id', v_existing.id, 'created_at', v_existing.created_at);
  end if;
  insert into public.tester_feedback(id, user_id, comment, release_version, app_version, level, shell)
    values (p_id, v_id, v_comment, p_release_version, p_app_version, p_level, p_shell)
    returning created_at into v_created_at;
  return jsonb_build_object('id', p_id, 'created_at', v_created_at);
end;
$$;
create function public.submit_tester_feedback(
  p_id uuid, p_comment text, p_release_version text, p_app_version text, p_level integer, p_shell text
) returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.submit_tester_feedback(p_id, p_comment, p_release_version, p_app_version, p_level, p_shell); $$;
revoke all on function gamify_private.guard_tester_feedback_insert(),
  gamify_private.submit_tester_feedback(uuid, text, text, text, integer, text),
  public.submit_tester_feedback(uuid, text, text, text, integer, text) from public, anon, authenticated;
grant execute on function gamify_private.submit_tester_feedback(uuid, text, text, text, integer, text),
  public.submit_tester_feedback(uuid, text, text, text, integer, text) to authenticated;

-- Mirror question_flags: same deletion transaction, Auth cascade and 90-day
-- retention. Existing public deletion wrapper and Cron job keep their targets.
create or replace function gamify_private.request_usage_data_deletion()
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid();
begin
  if v_id is null or not exists (select 1 from auth.users where id = v_id and email_confirmed_at is not null and deleted_at is null
    and not coalesce(is_anonymous, false)) then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at, now()),
    accepted_notice_version = null, accepted_notice_at = null where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from public.tester_feedback where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
end;
$$;
create or replace function gamify_private.purge_beta1_retained_data()
returns void language plpgsql security invoker set search_path = '' as $$
begin
  delete from gamify_private.usage_receipts where occurred_at <= now() - interval '8 days';
  delete from public.player_usage_days where usage_date < (now() at time zone 'UTC')::date - 89;
  delete from public.question_flags where received_at <= now() - interval '90 days';
  delete from public.tester_feedback where created_at <= now() - interval '90 days';
  delete from gamify_private.usage_ingest_limits where window_start < now() - interval '8 days';
end;
$$;

notify pgrst, 'reload schema';
commit;
