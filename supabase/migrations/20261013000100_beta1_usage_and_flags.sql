-- Reviewed application schema for the OWNER to run in the separate game project.
-- No cloud saves, clinical prose, credentials, or historical answer imports.
-- See docs/setup/BETA1_SUPABASE_SETUP.md. PostgreSQL 15+ / Supabase Auth required.
begin;

create schema if not exists gamify_private;
revoke all on schema gamify_private from public, anon, authenticated;
grant usage on schema gamify_private to authenticated;
alter default privileges in schema gamify_private revoke execute on functions from public;

-- Populated/revoked only by the owner in SQL Editor, never from user_metadata.
create table gamify_private.player_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  admitted_at timestamptz not null default now(),
  revoked_at timestamptz,
  deletion_requested_at timestamptz,
  accepted_notice_version text,
  accepted_notice_at timestamptz,
  check ((accepted_notice_version is null) = (accepted_notice_at is null))
);
create table gamify_private.usage_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table gamify_private.player_memberships enable row level security;
alter table gamify_private.usage_owners enable row level security;
revoke all on gamify_private.player_memberships, gamify_private.usage_owners from public, anon, authenticated;

create table public.player_usage_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  metric_version text not null check (metric_version = 'first-scored-patient-and-employee.v1'),
  playtime_seconds numeric(12,3) not null default 0 check (playtime_seconds between 0 and 86400),
  question_count bigint not null default 0 check (question_count between 0 and 10000),
  primary key (user_id, usage_date, metric_version)
);
create index player_usage_days_retention_idx on public.player_usage_days(usage_date);
alter table public.player_usage_days enable row level security;
revoke all on public.player_usage_days from public, anon, authenticated;
grant select on public.player_usage_days to authenticated;

-- Immutable, short-lived count/time deduplication receipts. No clinical fields.
create table gamify_private.usage_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  receipt_id uuid not null,
  occurred_at timestamptz not null,
  kind text not null check (kind in ('playtime', 'question')),
  payload jsonb not null,
  received_at timestamptz not null default now(),
  primary key (user_id, receipt_id)
);
create index usage_receipts_retention_idx on gamify_private.usage_receipts(occurred_at);
create index usage_receipts_question_rate_idx on gamify_private.usage_receipts(user_id, occurred_at) where kind = 'question';
create table gamify_private.usage_ingest_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  calls integer not null check (calls between 1 and 20)
);
alter table gamify_private.usage_receipts enable row level security;
alter table gamify_private.usage_ingest_limits enable row level security;
revoke all on gamify_private.usage_receipts, gamify_private.usage_ingest_limits from public, anon, authenticated;

create function gamify_private.is_usage_owner()
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and coalesce(auth.jwt()->>'aal' = 'aal2', false)
    and exists (select 1 from gamify_private.usage_owners o join auth.users u on u.id = o.user_id
      where o.user_id = auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null
        and (u.banned_until is null or u.banned_until <= now()));
$$;

create function gamify_private.can_record_usage()
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
    where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
      and m.accepted_notice_version = 'beta1.usage.v1' and m.accepted_notice_at is not null
      and u.invited_at is not null and u.email_confirmed_at is not null and u.deleted_at is null
      and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())
  );
$$;

-- Every privileged writer locks this membership row. Deletion/revocation and
-- flag/usage writes therefore serialize; stale JWTs cannot resurrect deleted data.
create function gamify_private.require_usage_player(p_notice boolean default true)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := auth.uid();
  v_member gamify_private.player_memberships%rowtype;
begin
  if v_id is null or not exists (select 1 from auth.users u where u.id = v_id
    and u.invited_at is not null and u.email_confirmed_at is not null and u.deleted_at is null
    and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())) then
    raise exception 'Player access denied' using errcode = '42501';
  end if;
  select * into v_member from gamify_private.player_memberships where user_id = v_id for update;
  if not found or v_member.revoked_at is not null or v_member.deletion_requested_at is not null then
    raise exception 'Player access denied' using errcode = '42501';
  end if;
  if p_notice and (v_member.accepted_notice_version is distinct from 'beta1.usage.v1' or v_member.accepted_notice_at is null) then
    raise exception 'Usage notice acceptance required' using errcode = '42501';
  end if;
  return v_id;
end;
$$;

create policy usage_player_read on public.player_usage_days for select to authenticated
  using (user_id = (select auth.uid()) and (select gamify_private.can_record_usage())
    and usage_date between (now() at time zone 'UTC')::date - 89 and (now() at time zone 'UTC')::date);
create policy usage_owner_read on public.player_usage_days for select to authenticated
  using ((select gamify_private.is_usage_owner())
    and usage_date between (now() at time zone 'UTC')::date - 89 and (now() at time zone 'UTC')::date);
-- No direct INSERT/UPDATE/DELETE grant or player policy on trusted totals.

create function gamify_private.valid_flag_choices(p_order text[], p_answer text)
returns boolean language sql immutable security invoker set search_path = '' as $$
  select coalesce(array_ndims(p_order) = 1 and cardinality(p_order) between 2 and 12
    and not exists (select 1 from unnest(p_order) id where id is null or char_length(id) not between 1 and 160)
    and (select count(distinct id) from unnest(p_order) id) = cardinality(p_order)
    and (p_answer is null or p_answer = any(p_order)), false);
$$;

create table public.question_flags (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  flag_id uuid not null,
  question_id text not null check (char_length(question_id) between 1 and 160),
  question_variant_id text not null check (char_length(question_variant_id) between 1 and 160),
  question_variant_version text not null check (char_length(question_variant_version) between 1 and 80),
  concept_id text not null check (char_length(concept_id) between 1 and 160),
  concept_version text not null check (char_length(concept_version) between 1 and 80),
  clinical_release_id text not null check (char_length(clinical_release_id) between 1 and 160),
  content_version text not null check (char_length(content_version) between 1 and 80),
  app_version text not null check (char_length(app_version) between 1 and 80),
  displayed_choice_order text[] not null,
  chosen_answer_id text,
  comment text not null default '' check (char_length(comment) <= 500),
  flagged_at timestamptz not null,
  received_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'fixed_in_version', 'needs_owner', 'no_change')),
  fixed_in_version text check (char_length(fixed_in_version) between 1 and 80),
  resolution_note text check (char_length(resolution_note) <= 500),
  resolved_at timestamptz,
  primary key (user_id, flag_id),
  check (gamify_private.valid_flag_choices(displayed_choice_order, chosen_answer_id)),
  check ((status = 'fixed_in_version') = (fixed_in_version is not null))
);
create index question_flags_received_idx on public.question_flags(received_at);
create index question_flags_review_idx on public.question_flags(status, received_at);
alter table public.question_flags enable row level security;
revoke all on public.question_flags from public, anon, authenticated;
grant select, insert on public.question_flags to authenticated;
grant update(status, fixed_in_version, resolution_note, resolved_at) on public.question_flags to authenticated;

create function gamify_private.guard_question_flag_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := gamify_private.require_usage_player(true);
begin
  if new.user_id is distinct from v_id or new.status <> 'open' or new.fixed_in_version is not null
    or new.resolution_note is not null or new.resolved_at is not null then
    raise exception 'Flag access denied' using errcode = '42501';
  end if;
  if new.flagged_at <= now() - interval '7 days' or new.flagged_at > now() + interval '1 minute' then
    raise exception 'Invalid flag timestamp' using errcode = '22023';
  end if;
  if (select count(*) from public.question_flags where user_id = v_id and received_at > now() - interval '1 hour') >= 50 then
    raise exception 'Flag rate limit reached' using errcode = 'P0001';
  end if;
  new.received_at := now();
  return new;
end;
$$;
create trigger question_flags_guard before insert on public.question_flags
  for each row execute function gamify_private.guard_question_flag_insert();
create policy flags_player_read on public.question_flags for select to authenticated
  using (user_id = (select auth.uid()) and (select gamify_private.can_record_usage())
    and received_at > now() - interval '90 days');
create policy flags_player_insert on public.question_flags for insert to authenticated
  with check (user_id = (select auth.uid()) and (select gamify_private.can_record_usage())
    and status = 'open' and fixed_in_version is null and resolution_note is null and resolved_at is null);
create policy flags_owner_read on public.question_flags for select to authenticated
  using ((select gamify_private.is_usage_owner()) and received_at > now() - interval '90 days');
create policy flags_owner_update on public.question_flags for update to authenticated
  using ((select gamify_private.is_usage_owner())) with check ((select gamify_private.is_usage_owner()));

create function gamify_private.get_usage_access()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'admitted', exists (select 1 from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
      where m.user_id = auth.uid() and m.revoked_at is null and m.deletion_requested_at is null
        and u.invited_at is not null and u.email_confirmed_at is not null and u.deleted_at is null
        and not coalesce(u.is_anonymous, false) and (u.banned_until is null or u.banned_until <= now())),
    'notice_accepted', gamify_private.can_record_usage(),
    'deletion_requested', exists (select 1 from gamify_private.player_memberships m where m.user_id = auth.uid() and m.deletion_requested_at is not null)
  );
$$;

create function gamify_private.accept_usage_notice(p_version text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid := gamify_private.require_usage_player(false);
begin
  if p_version is distinct from 'beta1.usage.v1' then
    raise exception 'Unsupported usage notice' using errcode = '22023';
  end if;
  update gamify_private.player_memberships set accepted_notice_version = p_version,
    accepted_notice_at = coalesce(accepted_notice_at, now()) where user_id = v_id;
end;
$$;

create function gamify_private.ingest_player_usage(p_receipts jsonb, p_metric_version text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := gamify_private.require_usage_player(true);
  v_now timestamptz := now();
  v_receipt jsonb; v_previous jsonb; v_receipt_id uuid; v_session_id uuid;
  v_start timestamptz; v_end timestamptz; v_date date; v_active bigint;
  v_questions integer; v_calls integer; v_keys integer;
  v_ack jsonb := '[]'::jsonb;
begin
  if p_metric_version is distinct from 'first-scored-patient-and-employee.v1'
    or p_receipts is null or jsonb_typeof(p_receipts) <> 'array'
    or jsonb_array_length(p_receipts) not between 1 and 100 or octet_length(p_receipts::text) > 65536 then
    raise exception 'Invalid usage batch' using errcode = '22023';
  end if;
  insert into gamify_private.usage_ingest_limits(user_id, window_start, calls)
    values (v_id, date_trunc('minute', v_now), 1)
    on conflict (user_id) do update set
      calls = case when usage_ingest_limits.window_start = excluded.window_start then usage_ingest_limits.calls + 1 else 1 end,
      window_start = excluded.window_start
    returning calls into v_calls;
  -- The table CHECK rejects >20 requests/minute; transaction rollback is intentional.

  for v_receipt in select value from jsonb_array_elements(p_receipts) loop
    if jsonb_typeof(v_receipt) <> 'object' then
      raise exception 'Invalid usage receipt' using errcode = '22023';
    end if;
    select count(*) into v_keys from jsonb_object_keys(v_receipt);
    if jsonb_typeof(v_receipt->'receipt_id') <> 'string' or jsonb_typeof(v_receipt->'kind') <> 'string' then
      raise exception 'Invalid usage receipt' using errcode = '22023';
    end if;
    v_receipt_id := (v_receipt->>'receipt_id')::uuid;
    v_active := 0; v_questions := 0;
    if v_receipt->>'kind' = 'question' then
      if v_keys <> 3 or not (v_receipt ?& array['receipt_id', 'kind', 'occurred_at'])
        or jsonb_typeof(v_receipt->'occurred_at') <> 'string' then
        raise exception 'Invalid question count receipt' using errcode = '22023';
      end if;
      v_start := (v_receipt->>'occurred_at')::timestamptz; v_end := v_start; v_questions := 1;
    elsif v_receipt->>'kind' = 'playtime' then
      if v_keys <> 6 or not (v_receipt ?& array['receipt_id','kind','session_id','started_at','ended_at','active_ms'])
        or jsonb_typeof(v_receipt->'session_id') <> 'string' or jsonb_typeof(v_receipt->'started_at') <> 'string'
        or jsonb_typeof(v_receipt->'ended_at') <> 'string' or jsonb_typeof(v_receipt->'active_ms') <> 'number'
        or (v_receipt->>'active_ms') !~ '^[0-9]+$' then
        raise exception 'Invalid playtime receipt' using errcode = '22023';
      end if;
      v_session_id := (v_receipt->>'session_id')::uuid;
      v_start := (v_receipt->>'started_at')::timestamptz; v_end := (v_receipt->>'ended_at')::timestamptz;
      v_active := (v_receipt->>'active_ms')::bigint;
      if v_active not between 1 and 30000 or v_end <= v_start or v_end - v_start > interval '30 seconds'
        or v_active > extract(epoch from v_end - v_start) * 1000
        or (v_start at time zone 'UTC')::date <> ((v_end - interval '1 microsecond') at time zone 'UTC')::date then
        raise exception 'Invalid playtime duration' using errcode = '22023';
      end if;
    else
      raise exception 'Invalid usage kind' using errcode = '22023';
    end if;
    if not isfinite(v_start) or not isfinite(v_end) or v_start <= v_now - interval '7 days' or v_end > v_now + interval '1 minute' then
      raise exception 'Expired or future usage receipt' using errcode = '22023';
    end if;
    select payload into v_previous from gamify_private.usage_receipts where user_id = v_id and receipt_id = v_receipt_id;
    if found then
      if v_previous <> v_receipt then raise exception 'Usage receipt conflict' using errcode = '22023'; end if;
    else
      if v_questions = 1 and (select count(*) from gamify_private.usage_receipts where user_id = v_id and kind = 'question'
        and occurred_at >= date_trunc('minute', v_start) and occurred_at < date_trunc('minute', v_start) + interval '1 minute') >= 120 then
        raise exception 'Question rate limit reached' using errcode = 'P0001';
      end if;
      insert into gamify_private.usage_receipts(user_id, receipt_id, occurred_at, kind, payload)
        values (v_id, v_receipt_id, v_start, v_receipt->>'kind', v_receipt);
      v_date := (v_start at time zone 'UTC')::date;
      insert into public.player_usage_days(user_id, usage_date, metric_version, playtime_seconds, question_count)
        values (v_id, v_date, p_metric_version, v_active::numeric / 1000, v_questions)
        on conflict (user_id, usage_date, metric_version) do update set
          playtime_seconds = player_usage_days.playtime_seconds + excluded.playtime_seconds,
          question_count = player_usage_days.question_count + excluded.question_count;
    end if;
    v_ack := v_ack || jsonb_build_array(v_receipt_id::text);
  end loop;
  return jsonb_build_object('acknowledged_receipt_ids', v_ack);
end;
$$;

create function gamify_private.request_usage_data_deletion()
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid := auth.uid();
begin
  -- A revoked invitee can still delete. A missing/deleted Auth identity cannot write.
  if v_id is null or not exists (select 1 from auth.users where id = v_id and email_confirmed_at is not null and deleted_at is null
    and not coalesce(is_anonymous, false)) then raise exception 'Player access denied' using errcode = '42501'; end if;
  perform 1 from gamify_private.player_memberships where user_id = v_id for update;
  if not found then raise exception 'Player access denied' using errcode = '42501'; end if;
  update gamify_private.player_memberships set deletion_requested_at = coalesce(deletion_requested_at, now()),
    accepted_notice_version = null, accepted_notice_at = null where user_id = v_id;
  delete from public.player_usage_days where user_id = v_id;
  delete from public.question_flags where user_id = v_id;
  delete from gamify_private.usage_receipts where user_id = v_id;
  delete from gamify_private.usage_ingest_limits where user_id = v_id;
  -- Keep the membership tombstone until owner administration removes Auth/roster.
end;
$$;

-- Exposed RPCs are invokers; privileged bodies remain in an UNEXPOSED schema.
create function public.get_usage_access() returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.get_usage_access(); $$;
create function public.accept_usage_notice(p_version text) returns void language sql security invoker set search_path = ''
  as $$ select gamify_private.accept_usage_notice(p_version); $$;
create function public.ingest_player_usage(p_receipts jsonb, p_metric_version text) returns jsonb language sql security invoker set search_path = ''
  as $$ select gamify_private.ingest_player_usage(p_receipts, p_metric_version); $$;
create function public.request_usage_data_deletion() returns void language sql security invoker set search_path = ''
  as $$ select gamify_private.request_usage_data_deletion(); $$;

revoke all on all functions in schema gamify_private from public, anon, authenticated;
revoke all on function public.get_usage_access(), public.accept_usage_notice(text),
  public.ingest_player_usage(jsonb, text), public.request_usage_data_deletion() from public, anon, authenticated;
grant execute on function public.get_usage_access(), public.accept_usage_notice(text),
  public.ingest_player_usage(jsonb, text), public.request_usage_data_deletion() to authenticated;
grant execute on function gamify_private.get_usage_access(), gamify_private.accept_usage_notice(text),
  gamify_private.ingest_player_usage(jsonb, text), gamify_private.request_usage_data_deletion(),
  gamify_private.can_record_usage(), gamify_private.is_usage_owner(), gamify_private.valid_flag_choices(text[], text) to authenticated;

-- Console-only report. Aggregate before joining; zero-activity invitees survive.
create view gamify_private.owner_usage_report with (security_invoker = true) as
with totals as (
  select user_id, sum(playtime_seconds) seconds, sum(question_count) questions
  from public.player_usage_days
  where usage_date between (now() at time zone 'UTC')::date - 89 and (now() at time zone 'UTC')::date
  group by user_id
)
select case when u.email ~ '^[=+@\-]' or u.email ~ '^[[:cntrl:]]' then '''' || u.email else u.email end as player,
  floor(coalesce(t.seconds, 0) / 3600)::bigint::text || ':' ||
    lpad((floor(coalesce(t.seconds, 0) / 60)::bigint % 60)::text, 2, '0') as total_play_time,
  coalesce(t.questions, 0)::bigint as total_questions
from gamify_private.player_memberships m join auth.users u on u.id = m.user_id
left join totals t on t.user_id = m.user_id
where m.deletion_requested_at is null and u.deleted_at is null
order by u.email;
revoke all on gamify_private.owner_usage_report from public, anon, authenticated;

create function gamify_private.purge_beta1_retained_data()
returns void language plpgsql security invoker set search_path = '' as $$
begin
  -- Eight days exceeds the seven-day ingest window: compacted IDs cannot replay.
  delete from gamify_private.usage_receipts where occurred_at <= now() - interval '8 days';
  delete from public.player_usage_days where usage_date < (now() at time zone 'UTC')::date - 89;
  delete from public.question_flags where received_at <= now() - interval '90 days';
  delete from gamify_private.usage_ingest_limits where window_start < now() - interval '8 days';
end;
$$;
revoke all on function gamify_private.purge_beta1_retained_data() from public, anon, authenticated;

notify pgrst, 'reload schema';
commit;
