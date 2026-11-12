# Clinic Competition

The shared Management panel shows each admitted player's best submitted clinic.
It works independently of cloud-save enrollment and usage-recording consent.
Prototype sessions allocate no competition transport, queue or retry timer.

After a completed game-day submission is acknowledged, the shared session
checks the player's rank. A first ranked result establishes a silent baseline;
subsequent up/down changes add one Clinic Competition entry to Alerts & Events.
Unchanged, hidden/unranked and casual accounts generate no rank alert. Casual or
pending access causes no rank request. Failed submissions/reads keep the last
known rank for online/focus/minute retries and never block gameplay. Rank and
checked-day fields share the existing account/backend/campaign aggregate cache,
outside game saves. A reload does not duplicate the same day's check or alert.
The rank is the player's best-clinic rank, as returned by the existing board.

The guided Management prompt introduces Clinic Competition. In either shell,
the first guided Management visit includes a short joke, View Clinic Competition
and Got it. View opens the actual board; either button dismisses the tip.
Casual copy explains that casual clinics are unranked. Dismissal is an
account/campaign local preference with session-storage/tab-memory fallback;
it neither changes a game rule nor writes a campaign save. Guidance off hides
the tip. The UI adds no permanent navigation button or rank badge.

Revenue means **gross earned income**, in cents:

- Patient settlement `completionRevenue + qualityRevenueBonus`.
- Service and retail receipt `grossAmount`, including radiology, remote work and
  manual telehealth (its receipt counts once; its usage counter is not income).
- No stock-cost deduction, payroll/upkeep, financial penalty, construction or
  other cash-balance changes. This is not net income or profit.

Operating day length comes from the domain clock. Day 1 is `[0, dayMinutes)`;
income at the next boundary belongs to the next day. The current game day is
excluded. The mean of the latest 1-3 contiguous completed days is rounded to the
nearest cent, including zero-revenue days. Calendar time and simulation speed
do not affect it.

`useCompetitionSubmission` observes campaign mount and completed-day changes,
never each rendered tick. `readRevenueHistory` uses real settlement/receipt
amounts and retired service gross totals. It subtracts current-day receipts
(which the domain retains in full) to obtain a cumulative day-end boundary.
Stored consecutive boundaries recover exact daily income after raw receipts
retire. Three small daily aggregates are retained; no campaign or patient data
is stored in the outbox or sent to the competition RPC.

If all raw service receipts still exist, the latest three days can be rebuilt
immediately. An old clinic with retired receipts and no local boundaries must
establish a baseline and finish one new day. Missing days are never inferred
from incomplete receipts or treated as zero. A gap of multiple unobserved days
also establishes a fresh baseline. Switching to another browser/device can
therefore require one new completed day. These aggregates do not alter saves
or travel with Beta 2 cloud campaigns. The existing server row remains until
replaced by a newer completed-day submission or removed by retention/deletion.

The account/backend/origin-scoped queue retains only the newest submission for
each clinic, deduplicates acknowledged days across reloads, retries on a new
day, online/focus events, a minute timer and tab open, and never gates gameplay.
It is bounded to 32 clinics, seven days of pending submissions and 90 days of
local daily history; unavailable storage falls back to bounded memory. A server
admission rejection or locally persisted deletion request stops all competition
requests and clears pending data. Tokens and account email are never queued.

The server uses the existing membership guard without requiring usage consent
or cloud enrollment, limits changed submissions to 120 per UTC day, validates
all fields, acknowledges identical retries without quota and ignores older-day
replays. Revenue is bounded to 100,000,000,000 cents ($1 billion) per day;
this is an abuse ceiling, not an economic/clinical rule or anti-cheat claim.
Level is 0-5, days counted 1-3 and completed day 1-10,000,000. Clinic names are
trimmed, 1-60 Unicode characters and cannot contain controls.

Best clinic order: revenue descending, level descending, campaign ID in `C`
collation. Public rank order: revenue descending, level descending, player UUID.
The RPC returns no player/campaign IDs or emails. A hidden caller's best row is
included with `rank: null` and `is_self: true`; it does not shift public ranks.
Visibility changes require a server acknowledgement. Failed requests show an
error and can be retried. Refreshes happen on each tab mount and on demand.

Competition snapshots expire after 90 days. Rate counters expire after eight
UTC dates; the minimal hide preference persists until account data deletion so
retention never silently unhides a player. Both existing delete-my-data paths
delete snapshots, settings and rate counters. Auth deletion cascades too.

Apply `20261026000200_competition.sql` after the existing migrations, then run
the rollback-only `supabase/tests/competition.sql` in a disposable Supabase DB.
The manager owns live SQL, existing SQL regression tests and physical browser
acceptance. All new client tests use fake transports; there is no live backend
or gameplay-time content retrieval.
