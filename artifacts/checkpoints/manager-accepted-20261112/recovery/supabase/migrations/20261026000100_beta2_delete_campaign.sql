-- Beta 2: owner-confirmed replacement of one account campaign.
-- Additive RPC only. Apply after 20261018000100_beta2_cloud_saves.sql.
begin;

create function gamify_private.beta2_cloud_delete_campaign(
  p_protocol integer, p_campaign_id text, p_expected_revision text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  id uuid := gamify_private.beta2_require_cloud(p_protocol);
  c public.beta2_campaigns%rowtype;
  w gamify_private.beta2_campaign_writers%rowtype;
  expected_revision bigint;
  snapshot_cost bigint;
  operation_cost bigint;
  auxiliary_cost bigint;
  total_cost bigint;
  removed_rates bigint;
begin
  -- beta2_require_cloud holds membership -> account -> global quota locks,
  -- enforcing the same admission, notice, protocol and write gates as writes.
  if p_campaign_id is null or octet_length(p_campaign_id) not between 1 and 256
    or p_campaign_id ~ '[[:cntrl:]]' then
    raise exception 'Invalid cloud campaign ID' using errcode = '22023';
  end if;
  expected_revision := gamify_private.beta2_uint(p_expected_revision);
  if expected_revision < 1 then
    raise exception 'Invalid cloud campaign revision' using errcode = '22023';
  end if;
  perform gamify_private.beta2_rate(id, 'mutation');
  select * into c from public.beta2_campaigns
    where owner_id = id and campaign_id = p_campaign_id for update;
  if not found then
    -- Only the caller's namespace is inspected. An absent own campaign has
    -- the same response whether this is a lost-ack retry or an unknown ID.
    return jsonb_build_object('campaignId', p_campaign_id, 'deleted', true);
  end if;
  if c.current_revision <> expected_revision then
    raise exception 'Cloud revision conflict' using errcode = '40001';
  end if;
  select * into w from gamify_private.beta2_campaign_writers
    where owner_id = id and campaign_id = p_campaign_id for update;
  -- No client writer token is supplied by this RPC. Refuse ANY live lease;
  -- the player must close that session, or explicitly continue and close here.
  -- Read the clock after all blocking locks, never transaction start time.
  if found and w.token_sha256 is not null and w.expires_at > clock_timestamp() then
    raise exception 'Cloud campaign open on another device' using errcode = '55000';
  end if;

  select coalesce(sum(gamify_private.beta2_storage_cost(octet_length(s.content))), 0)
    into snapshot_cost from public.beta2_campaign_snapshots s
    where owner_id = id and campaign_id = p_campaign_id;
  select coalesce(sum(gamify_private.beta2_operation_cost(o)), 0)
    into operation_cost from gamify_private.beta2_campaign_operations o
    where owner_id = id and campaign_id = p_campaign_id;
  -- Import reserves 4096 for the campaign/writer and separately bills every
  -- surviving operation. The account's fixed 8192-byte allowance is retained.
  auxiliary_cost := operation_cost + 4096;
  total_cost := snapshot_cost + c.evidence_bytes + auxiliary_cost;

  -- These existing FKs cascade atomically to ALL snapshots, evidence headers,
  -- evidence pages, writers and operations, scoped by (owner_id,campaign_id).
  delete from public.beta2_campaigns where owner_id = id and campaign_id = p_campaign_id;
  delete from gamify_private.beta2_cloud_rates
    where owner_id = id and campaign_id = p_campaign_id;
  get diagnostics removed_rates = row_count;
  update gamify_private.beta2_cloud_accounts
    set snapshot_bytes = snapshot_bytes - snapshot_cost,
      evidence_bytes = evidence_bytes - c.evidence_bytes,
      auxiliary_bytes = auxiliary_bytes - auxiliary_cost
    where user_id = id;
  -- Release logical quota. As with pruning/account deletion, dead tuples do
  -- not count as reclaimed physical space until verified owner maintenance.
  update gamify_private.beta2_cloud_quota
    set accounted_bytes = accounted_bytes - total_cost,
      dead_bytes_estimate = dead_bytes_estimate + total_cost + removed_rates * 1024
    where singleton;
  return jsonb_build_object('campaignId', p_campaign_id, 'deleted', true);
end;
$$;

create function public.beta2_cloud_delete_campaign(
  p_protocol integer, p_campaign_id text, p_expected_revision text
) returns jsonb
language sql security invoker set search_path = '' as $$
  select gamify_private.beta2_cloud_delete_campaign(p_protocol, p_campaign_id, p_expected_revision);
$$;

revoke all on function gamify_private.beta2_cloud_delete_campaign(integer,text,text) from public, anon, authenticated, service_role;
revoke all on function public.beta2_cloud_delete_campaign(integer,text,text) from public, anon, authenticated, service_role;
grant execute on function gamify_private.beta2_cloud_delete_campaign(integer,text,text),
  public.beta2_cloud_delete_campaign(integer,text,text) to authenticated;

notify pgrst, 'reload schema';
commit;
