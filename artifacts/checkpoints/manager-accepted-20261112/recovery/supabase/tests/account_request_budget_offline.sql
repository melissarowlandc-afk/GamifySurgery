-- Fresh disposable local Postgres ONLY. Uses the existing minimal Auth stub.
\set ON_ERROR_STOP on
\ir snapshot_only_offline.sql
\ir ../migrations/20261104000100_account_request_budget.sql
\ir account_request_budget.sql
