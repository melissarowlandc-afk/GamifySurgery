-- OWNER-only SQL Editor saved query: "Beta 1 usage - last 90 UTC dates".
-- Exactly today (UTC) and the preceding 89 UTC dates, since collection began.
-- Time is completed hours:minutes (no 24-hour wrapping), not a lifetime total.
-- Email values with spreadsheet formula prefixes are CSV-escaped by the view.
select player, total_play_time, total_questions
from gamify_private.owner_usage_report
order by player;
