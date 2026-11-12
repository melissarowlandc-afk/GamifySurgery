-- Owner PC tool (service_role) may close question flags; the table's CHECK
-- constraint calls the private flag-choice validator. Schema usage for
-- service_role was granted in 20261014000100. No anon/authenticated change.
begin;
grant execute on function gamify_private.valid_flag_choices(text[], text) to service_role;
commit;
