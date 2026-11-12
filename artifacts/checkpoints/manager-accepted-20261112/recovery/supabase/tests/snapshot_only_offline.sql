-- psql driver. FRESH DISPOSABLE LOCAL POSTGRES ONLY, never a live Supabase DB.
-- See snapshot_only_offline.md for prerequisites, commands and race rehearsal.
\set ON_ERROR_STOP on
\ir snapshot_only_auth_stub.sql
set plpgsql.variable_conflict = error;
set plpgsql.check_asserts = on;
\ir ../migrations/20261013000100_beta1_usage_and_flags.sql
-- Deliberately omit 20261013000200: installing/scheduling Cron is not needed
-- for transactional SQL acceptance, and is not simulated by this Auth stub.
\ir ../migrations/20261014000100_beta1_owner_invite_admin.sql
\ir ../migrations/20261014000200_beta1_tester_feedback.sql
\ir ../migrations/20261014000300_beta1_setup_links.sql
\ir ../migrations/20261016000100_beta1_owner_tool_reads.sql
\ir ../migrations/20261017000100_beta1_owner_tool_flag_validation.sql
\ir ../migrations/20261018000100_beta2_cloud_saves.sql
\ir ../migrations/20261018000200_beta2_backup_rpcs.sql
\ir ../migrations/20261018000300_beta2_admin_cloud_status.sql
\ir ../migrations/20261026000100_beta2_delete_campaign.sql
\ir ../migrations/20261026000200_competition.sql
\ir ../migrations/20261027000100_beta2_default_enabled.sql
\ir ../migrations/20261028000100_casual_mode.sql
\if :{?SNAPSHOT_BEFORE_MIGRATION}
-- Stop with only the old schema for the two-connection apply/old-client drill.
\echo Previous schema ready; snapshot migration has NOT been applied.
\else
\ir ../migrations/20261103000100_snapshot_only_cloud_saves.sql
\ir snapshot_only_cloud_saves.sql
\endif
