-- OWNER runs after the core schema. Enable Cron/pg_cron in the game project's
-- Database > Extensions first. Do not expose gamify_private in Data API settings.
-- Fail closed if Cron is missing; a working purge is a pre-collection gate.
begin;
do $$
begin
  if not exists (select 1 from pg_extension where extname = 'pg_cron') then
    raise exception 'Enable pg_cron in the game project before running the retention migration';
  end if;
end;
$$;
select cron.schedule('gamify-beta1-retention', '17 3 * * *',
  'select gamify_private.purge_beta1_retained_data();');
commit;
