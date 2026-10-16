-- Owner PC tool (service_role) reads usage and question flags for the owner
-- report and feedback digest. The project's Data API does not auto-grant new
-- tables, so grant explicitly. No anon/authenticated change.
begin;
grant select on public.player_usage_days to service_role;
grant select on public.question_flags to service_role;
grant update(status, fixed_in_version, resolution_note, resolved_at) on public.question_flags to service_role;
commit;
