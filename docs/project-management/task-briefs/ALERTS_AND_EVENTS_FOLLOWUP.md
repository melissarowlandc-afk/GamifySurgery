# Alerts and events — follow-up task starter

Completion note (2026-09-29): the owner supplied new requirements and subsequently
authorized all proposed enhancements. Cleanup, risk-only warnings, durable daily
cadence, contextual guidance, expanded humor and new-message/readability behavior
are complete locally. Read `docs/execplans/alerts-usefulness-and-humor.md` and the
current direction in `docs/features/alert-notification-flavor-system.md` before
using the older inherited rules below; generic60-minute patient wait notices and
routine player-action receipts are now suppressed. No push/deployment occurred.

Owner request: start a new task to work on Alerts & Events again. This brief is
prepared; native task creation was unavailable, so no new task was launched.

First read AGENTS.md, docs/handoffs/CURRENT_THREAD_HANDOFF.md,
docs/handoffs/GS-017_PLAYTHROUGH_BATCH.md and the alert sections of
docs/execplans/playthrough-usability-patient-flow.md. Inspect the current dirty
working tree before edits; newer local work may be ahead of the website.

Start by summarizing the inherited behavior briefly and asking what the owner
wants to change first. Do not redesign or implement speculative changes before
the owner gives the new requirements. This task owns Alerts & Events only.

Inherited owner-accepted baseline (verify current code; new owner instructions
may change these rules):
- Plain chronological feed, not expandable groups.
- Suppress check-in/result-return and employee hiring/praise feed notices while
  retaining underlying records and actionable chart state.
- Low positive cash below configured $200 threshold: gray marker, chronological
  position, once per rolling operating day.
- Patient waiting notice after more than60 facility minutes of actual idle
  waiting, excluding travel/testing; once per continuous wait.
- Water empty/trash after more than60 facility minutes; daily global limits
  persist across changed targets, recovery/recurrence and reload.
- Inner peace after60 minutes without actual arrival once tutorial admissions
  unlock, at most once per operating day.
- Complaint types at most daily, spaced60 facility minutes apart; upgrade
  complaints only facility level3+, at most every two operating days.
- Ambient humor spaced at least120 facility minutes. Operating-day rolling
  cooldown currently600 facility minutes. These are gameplay settings, not
  medical timing facts.
- Clinic-wide complaints use clinic-wide copy; specific patient waiting alerts
  and review quotations retain their own wording. Preserve legacy filtering and
  migration semantics; do not restart cooldowns on every load.
- Keep operational room/staff guidance in Alerts & Events, based on stable
  assignments and accessible facilities, with correct build/hiring targets.
  Goals remain progression-focused. Staff travel alone must not imply vacancy.
- Service-income floating amounts remain outside feed chatter.

Relevant implementation starting points: packages/game-domain/src/alert-cadence.ts,
apps/player/src/session/alertViewModels.ts and their tests. Locate current feed
rendering/catalog/state migration by search rather than assuming old paths.
Preserve unrelated clinical/content/graphics/pathing work and owner saves.
Delegate substantial implementation per AGENTS.md; validate changed timing,
reload persistence, feed rendering and action targets as appropriate.

Local owner playtest: START_GAME.cmd -> http://127.0.0.1:4173.
Remote: https://melissarowlandc-afk.github.io/GamifySurgery/.
These origins and different browser profiles/devices have separate saves.
No push/deployment is requested by this new task request.
