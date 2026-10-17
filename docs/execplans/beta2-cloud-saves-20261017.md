# Beta 2: cross-device cloud saves - ExecPlan (2026-10-17)

Status: **planning only; proposed implementation and limits await manager review**.
Manager: Claude Code thread "GamifySurgery manager". Planning worker: GPT-6.1
Sol, max. This worker's only output is this document. No code, fixtures, existing
plans, handoff, configuration, database, browser storage or opening pathway was
changed. No Git commands, installations, network calls, agents or external
messages were used. Repository branch/dirty status and hosted state were not
independently verified; the tree is shared with clinical-content/game-domain
workers. Proposed lanes below are future assignments, not dispatched work.

## Goal and authority

The owner's request is: **"I would like the computer and phone saves and
campaigns to cross over."** An invited player should sign into the same account
on desktop or phone, select the same named campaign, and continue from its last
confirmed account save without losing another session's progress.

Read together with these binding records:

- [Accounts/playtime release plan](accounts-playtime-release-20261012.md),
  sections 2 and 5, the 2026-10-13 binding decisions and later Beta 1-first
  override: Beta 1 is live with local campaigns; Beta 2 adds explicit local
  import and safe cloud campaigns; automatic flag triage comes later.
- [ADR 0011](../adr/0011-versioned-hybrid-saves.md),
  [ADR 0017](../adr/0017-browser-authoritative-facility-simulation.md) and
  [ADR 0019](../adr/0019-hybrid-relational-and-jsonb-storage.md): versioned
  operational snapshots, immutable evidence, expected revisions, one fenced
  writer per campaign, explicit takeover, brief connection-loss recovery, no
  automatic merge or last-write-wins, browser-computed facility transitions.
- [ADR 0036](../adr/0036-multiple-resumable-clinics-and-staged-auth-shell.md):
  several resumable campaigns, separate selected campaign, recoverable archive,
  campaign-scoped FSRS, names unique across resumable and archived campaigns.
- [AGENTS.md](../../AGENTS.md), [privacy boundaries](../../SECURITY_AND_PRIVACY.md)
  and the later owner decisions in the accounts plan: preserve owner saves,
  keep clinical material `needs_clinician_review`, invite-only existing Auth,
  count-only owner reporting, no PHI, fingerprints or gameplay research.

The later decisions also retain the existing setup-link/password flow and the
manager's standing authority to publish tested updates. This plan does not
reopen login, introduce SMTP, request per-update approval, authorize a purchase
or execute a release. The manager settles the new design/budget choices below
with the owner before implementation and applies the standing release policy.

## 1. Current save model and measured sizes

### Live persistence

| Area / source | Observed behavior and implication |
| --- | --- |
| `apps/player/src/session/prototypeStorage.ts` | Profile schema **2**, stored under `gamify-surgery.prototype.profile.v1`; the historical single-save key is `gamify-surgery.prototype.save.v1`. A profile contains an array of named campaigns, selected campaign ID, naming counter, tutorial default and per-campaign guidance/dismissal/acknowledgment state. Signed-in profiles may also stage opaque pending question-count receipts. |
| `LocalCampaignRecord` | Stable string campaign ID (for example `campaign.local.<token>`, **not necessarily a UUID**), name, local creation/update milliseconds, `resumable` or `archived`, and complete `GameState`. There is no application campaign-count or serialized-byte ceiling in this local path; browser quota can fail a whole-profile write. |
| `savePrototypeProfileResult` | Serializes every campaign using `serializeGameState`, stores that JSON as a **string inside profile JSON**, then calls synchronous `localStorage.setItem` for the whole profile. Success is a local write result, not a server receipt or independently verified readback. String escaping increases the outer profile size. Failure reports character count, which is not UTF-8 bytes or guaranteed browser quota consumption. |
| `accountStorageKey.ts`, `accountStorage.test.ts` | A signed-in account uses `<base>.account.<encoded account ID>`; `null` retains the historical unowned key. Account A, account B and prototype campaigns stay separate. Sign-in does not claim the unowned profile or historical single save. Auth context remounts account-owned UI; departing writers retain their original account scope. |
| `prototypeAutosave.ts`, `usePrototypeSession.ts` | Meaningful commands save locally; facility ticks are coalesced every 15 facility ticks with idle scheduling. Visibility loss pauses; `pagehide` flushes local state. Client `updatedAtRealMs` is a display/local timestamp, **not a conflict revision**. Existing writes do not coordinate two devices. |
| `App.tsx`, `PrototypeShell.tsx`, `AppShell.tsx`, `mobile/MobileShell.tsx` | Shared session and local account profile feed desktop and phone shells. Campaign creation, selection, restart/archive and restore also write directly from entry/lifecycle paths. These must join the cloud coordinator; changing only the in-game autosave misses them. |
| `localCampaignRepository.ts` | An existing **unused by the live App/session** IndexedDB repository has global database `gamify-surgery.local.v1`, one `profile` key, campaign/revision stores, expected revisions, SHA-256, UTF-8 sizes, post-commit verification and recovery from **two prior local revisions**. It is exported, not an active cloud/account cache. Its global profile namespace and metadata must be adapted; pending usage staging is not part of its stored profile contract. |
| `facilityCameraPreference.ts` | Campaign-keyed camera settings are separate origin-local presentation data. Keep camera, layout and last-selected campaign per device; they should not move the desktop viewport onto the phone. Campaign tutorial progress should travel with its campaign. |

`packages/game-domain/src/persistence.ts:113` currently implements
`serializeGameState` as `JSON.stringify(state)`. `deserializeGameState` accepts
versions 1-9, applies compatibility/normalization and returns schema 9; an
unknown version throws. This is not yet a separate cloud envelope or an
immutable-evidence codec. Some existing readers normalize or bound collections;
do not infer byte-for-byte identity or complete audit retention from a
successful load. Prove intended logical fidelity and record allowed migrations.

The state includes facility/room/employee/task/queue/clock data; founder and
generated identities; frozen clinical encounters and displayed answer order;
campaign seed, randomness contract/state/counters; clinical/balance/scheduler
pins; FSRS cards and reviews; cash/accruals, settlements/income and operation
receipts; event/review intents, retired-history summaries and inspection/Level 5
state. Archives keep their state. Opening another campaign does not transfer
FSRS history, and restart creates a new campaign while archiving the previous
one. Local multiple-campaign support must survive cloud adoption, even where
only a bounded subset is enrolled in cloud storage.

### Read-only fixture measurement on 2026-10-17

Only repository synthetic fixtures were measured; no owner browser saves,
private inputs or live player data were read. The measurement was
`Buffer.byteLength(JSON.stringify(parsedState), "utf8")`, exactly the current
serializer body applied to the stored fixture object, **without loading or
normalizing it through the current deserializer**. Decimal MB = 1,000,000 bytes.

| Fixture / checkpoint | Facility level | Compact serialized state bytes | MB |
| --- | ---: | ---: | ---: |
| `level-four-legacy-pre-m3.json` | 3 | 130,872 | 0.131 |
| Integration `integration-l4` | 4 | 795,214 | 0.795 |
| Integration `integration-build` | 5 | 803,955 | 0.804 |
| Integration `integration-preparing` | 5 | 1,366,094 | 1.366 |
| Integration `integration-running` | 5 | 1,408,713 | 1.409 |
| `level-five-economy-checkpoint-20261012.json` | 5 | 1,429,974 | 1.430 |
| Integration `integration-final` | 5 | 1,602,257 | 1.602 |
| Integration `integration-finish` | 5 | 1,587,292 | 1.587 |
| Integration `integration-repeat-final` | 5 | 1,730,730 | 1.731 |
| Integration `integration-repeat` | 5 | 1,631,468 | 1.631 |
| Integration `integration-lower-repeat` | 5 | **1,807,484** | **1.807** |

Integration rows are the nine states in
`tests/fixtures/level-five-integration-checkpoints-20261012.json`, not nine
campaigns to upload together. Its 12,733,417-byte file is a container, not one
save. The nine-state median is **1,587,292 bytes (1.587 MB)**; advanced fixture
play is commonly about **1.4-1.8 MB**. This is a fixture-based planning baseline,
not a measured player median. The **largest observed snapshot is 1,807,484
bytes; the true application maximum is unbounded by the serializer**. Continuing
after the final inspection can grow histories further. Early-level/fresh,
migrated, pathological and prolonged-play coverage remains B2.1/B2.5 work.

At that largest checkpoint, `learningHistories` alone is 520,406 bytes;
`encounters` 213,843; `reviewIntents` 185,655; `events` 167,016; and
`settlements` 145,493. `JSON.stringify(serializedState)` is **1,978,098 bytes**
before the rest of the profile wrapper, showing the current nested-string
overhead. Two equivalent campaigns need roughly twice that plus metadata.
Browser quotas and PostgreSQL JSONB/TOAST/index storage are different measures.
Do not extrapolate gzip sizes into database capacity.

Fixture SHA-256 receipts (the shared tree can change; remeasure before coding):

| File under `tests/fixtures/` | SHA-256 of file bytes |
| --- | --- |
| `level-four-legacy-pre-m3.json` | `9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3` |
| `level-five-economy-checkpoint-20261012.json` | `813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582` |
| `level-five-integration-checkpoints-20261012.json` | `3baf8e3d564893d432ca8a2e86c0093648b8ae804c94af922deab0047a2f28dd` |

Reproduce from the repository root with existing Node; no files are written:

```powershell
@'
const fs = require('node:fs');
const dir = 'tests/fixtures/';
for (const file of ['level-four-legacy-pre-m3.json',
  'level-five-economy-checkpoint-20261012.json',
  'level-five-integration-checkpoints-20261012.json']) {
  const value = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
  const states = value.schemaVersion ? [[file, value]] : Object.entries(value);
  for (const [name, state] of states) {
    const serialized = JSON.stringify(state);
    console.log(name, Buffer.byteLength(serialized, 'utf8'));
  }
}
'@ | node
```

The older accounts plan recorded slightly different integration sizes before
subsequent fixture updates. The receipts above describe this inspection; the
planning worker did not regenerate or edit those fixtures.

## 2. Goals and non-goals

Goals: account-owned, multiple named campaigns available from desktop and phone;
automatic verified checkpoints; safe handoff with a desktop tab left open;
explicit, retryable import of selected existing local campaigns; faithful
versioned game/learning/evidence recovery; owner-only player access; bounded
storage/requests; honest status, updated consent and complete deletion coverage.

Non-goals: unrestricted offline play; simultaneous writers or merging progress
within one campaign; a server that runs facilities; background/closed-tab
catch-up; anti-cheat, leaderboards or research analytics; sharing campaigns
between accounts; a new auth provider; moving all device preferences; importing
historical local question flags; changing clinical content, clinical approval,
concept IDs, game balance or FSRS meaning; enabling hosted auth on the owner's
prototype; provisioning, purchases or release execution in this planning task.

## 3. Sync choices and recommendation

| Option | Advantages | Offline / two-device consequences | Fit |
| --- | --- | --- | --- |
| **(a) Explicit Upload campaign / Download campaign** | Clear deliberate transfer, lower request volume, useful checked export/import recovery path. | Both devices can diverge between button presses. Upload still needs expected revision, identity/version checks and a conflict screen. Download must preserve unsent local work before replacing it. Manual habits determine freshness; a forgotten upload strands phone progress. | Useful recovery/import tools, insufficient as the main cross-device experience. Does not by itself meet the accepted single-writer design. |
| **(b) Automatic saves, last-write-wins per campaign plus a conflict prompt** | Smooth when only one device plays; smaller change than server simulation. | Long offline branches, skewed client clocks and an idle desktop's autosave can overwrite real phone progress. A prompt shown after replacement is too late. `updated_at` alone cannot prove both writers shared a base. | **Literal last-write-wins is prohibited** by ADR 0011 and the binding owner decision. Preserve the automatic UX, replace overwrite rules with transactional expected revisions and a fenced writer. |
| **(c) Server-authoritative simulation** | Server executes/validates each transition; stronger integrity and a single execution authority. | Requires an online command protocol, server runtime, latency handling and much larger migration/operations work; offline actions still need an explicit product design. | Not justified for this noncompetitive invited beta; reverses ADR 0017 and requires a new owner architecture decision. |

**Recommend automatic account checkpoints with optimistic revision checks,
one fenced writer per campaign, explicit takeover and conflict recovery.** This
provides option (b)'s convenient saving without its last-write-wins rule and
implements the already accepted direction. The browser computes game state;
the latest **server-accepted revision** is authoritative for continuation.
Manual export/import remains a recovery facility, not the ordinary handoff.

### Revision and writer protocol

Use a monotonic server `revision bigint` per campaign and a separate monotonic
`writer_generation`. Every state/lifecycle write names its exact base revision,
writer token/generation and unique operation ID. The server locks the campaign,
checks fresh account admission, consent, lease and revision, then accepts all
snapshot/evidence changes atomically or rejects all. A client cannot choose the
next revision. `updated_at` is generated by the server for human-readable status
and list freshness; never select a winner using client wall clocks, facility
ticks or timestamp comparison. Concurrent compare-and-swap rejects a stale
write even if its timestamp is newer. A fencing generation rejects an old
writer after takeover even when no later snapshot has yet been saved.

Starting engineering defaults, inherited from the prior plan and to be tested:
60-second lease, renewal every 15 seconds, ordinary dirty checkpoint every
60 seconds, and an early coalesced checkpoint after scored answers, important
purchases, pause/mode exit, campaign switch and Save & Close. Do not upload on
each tick, frame or localStorage autosave. Clean/read-only tabs never upload a
snapshot or automatically take a lease. One writer **per campaign** permits
different campaigns on different devices; it does not merge their histories.

Load only campaign summaries on sign-in, then the selected campaign's current
snapshot and required evidence. Verify/hydrate before acquiring a writer against
that revision. Acquisition/takeover must return the accepted revision; if it
changed during the fetch, refetch before enabling commands. Poll small metadata
on focus and at a bounded interval while waiting; Realtime is optional for quick
revocation notices and is never the safety mechanism. Never poll whole saves.

### A phone plays while the desktop tab remains open

If desktop holds a valid lease, phone opens a read-only view:
"This campaign is open somewhere else. Continue here? Only progress saved to
your account can move here." **Continue on this device** atomically advances
the generation, revokes the desktop token and grants the phone a new token.
The phone loads/verifies the latest accepted state before playing. **Not now**
leaves it read-only. Do not silently revoke a live lease merely by opening a tab.

Desktop learns revocation on its next save/renewal or focus check, pauses
commands and ticks, and keeps unsent bytes: "You continued on another device.
Recent changes here have not replaced your account save." It may continue to
compute briefly before detection, but those writes cannot commit; the phone
warning must not promise immediate remote suspension. A hidden desktop already
pauses under the current lifecycle rule. On return it must revalidate before
Resume, not push its cached paused state. A visible but unattended tab can
retain its lease until an explicit takeover; it cannot block a phone indefinitely.

Save & Close pauses, awaits a confirmed checkpoint, then releases the lease
with the same generation. A delayed release from an old generation cannot
release the new phone writer. Lease expiry after a crash allows a new writer
to load the latest account save; expiry never authorizes stale queued work.

### Offline, lost responses and refresh

This remains an online-required campaign. A detected connection loss, failed
save or failed renewal starts a **30-second maximum grace**, also capped by
the conservatively calculated remaining server-confirmed lease validity.
Pause immediately if the lease is uncertain/expired, local durability fails or
the pending-size limit is reached. Stop all state-changing commands as well as
ticks; pause is not only an animation overlay. Viewing status, retry, export,
sign-in and deletion controls remains available. No offline sign-in or fresh
cloud campaign load, hidden-time progression or automatic catch-up.

Keep the last acknowledged account state and one bounded recovery record per
open campaign in account-scoped IndexedDB. That record contains an immutable
in-flight request/operation ID plus at most one coalesced following state and
new evidence tail. Preserve it across refresh; never mutate/reuse an in-flight
ID for different bytes. Proposed total cap: **7 MB** (up to 3 MB in-flight state,
3 MB following state and 1 MB evidence/receipts), separate from the confirmed
cache. Measure actual recovery-envelope bytes; escaping/metadata also count
toward the total. It is a bound, not seven MB promised by every browser.

Retry/query the identical operation after a lost acknowledgment before creating
a new write. A successful receipt acknowledges exactly the covered work, not a
newer coalesced candidate. Rebase the following candidate onto that receipt
without re-running answers or purchases. On reconnect, refresh admission and
server state first. An expired lease can be reacquired only if the base remains
unchanged; a new lease cannot bless a stale branch. Clock jumps, sleep and slow
responses must not extend grace or lease validity. Explicit Resume follows a
successful recovery; no surprise unpause.

If the server revision or generation has advanced, preserve local recovery and
offer **Use account save**, **Keep a recovery copy**, or **Not now** (paused).
Show campaign name/level and last confirmed time, plus "changes waiting here";
put revision details behind diagnostics. Never offer a destructive one-click
"force overwrite". Recovery as a separate campaign requires explicit naming,
quota and verified internal-reference migration; until that exists, retain or
download a checked recovery file. No merge of cash, FSRS, answers or patients.

## 4. Capacity for about 30 players

Use the requested **500 MB project database** as the planning limit. The accounts
plan's manager-verified 2026-10-13 facts also include **5 GB egress/month** and
possible Free-project inactivity pauses. No current provider terms, live usage
or physical storage were checked in this no-network task. Reconfirm limits and
available game-project space before enabling Beta 2; leave the ergonomics
project alone. No purchase is authorized.

Snapshots, evidence, Auth/app data, indexes, TOAST, retained/dead rows and other
Beta 1 tables share the project. A compression estimate is not a free-space
guarantee. Retain **current plus one verified prior cloud snapshot**, with
immutable evidence stored once and complete logical state reconstructed on
load. A full fidelity-preserving snapshot may temporarily duplicate evidence
for a first codec milestone, but that cost must be counted; a snapshot-only
implementation cannot silently drop the accepted immutable-evidence boundary.

For **two cloud campaigns/player, two snapshots/campaign**:

| Raw planning scenario | Per player snapshots | 30-player snapshots | Evidence allowance (1 MB/campaign) + other shared allowance (50 MB) | Planned total before measured variance |
| --- | ---: | ---: | ---: | ---: |
| Observed largest fixture, 1.807484 MB/copy | 7.230 MB | 216.898 MB | 60 + 50 MB | **326.898 MB** |
| Target 2 MB/copy | 8 MB | 240 MB | 60 + 50 MB | **350 MB** |
| Every copy at 3 MB acceptance ceiling | 12 MB | 360 MB | 60 + 50 MB | **470 MB** |

The 470 MB scenario leaves only 30 MB below the provider limit and exceeds the
prior plan's 400 MB working ceiling. **The earlier 25-player allowance cannot
simply be relabeled 30.** Evidence and the 50 MB shared allowance are hypotheses,
not measured maxima; old append-only financial/inspection history may need more.

Recommended starting policy, subject to B2.5 and owner question 1:

- Two enrolled cloud campaigns/account, counting resumable, archived and cloud
  recovery campaigns; additional existing campaigns remain local and intact.
  Archive/restart must disclose that an archive still occupies a cloud slot.
- Target <=2 MB per snapshot, hard candidate ceiling **3,000,000 bytes**;
  **8,000,000 aggregate retained snapshot bytes/account** and up to
  **2,000,000 immutable-evidence bytes/account**, with a 1 MB/campaign starting
  evidence allowance. These bounds include all enrolled campaigns, not per
  device. A 3 MB campaign can use six MB for current/prior; the other campaign
  has only the remaining snapshot budget. Never advertise two unrestricted
  3 MB campaigns under this policy.
- This reserves up to **10 MB/player, 300 MB for 30**, plus 50 MB for shared
  data/overhead = **350 MB**, leaving 50 MB below the **400 MB working ceiling**
  and a further 100 MB below the provider cap. Physical measurements may require
  stricter limits. Quotas must include metadata and all history rather than
  shifting data into an uncounted table.
- Warn on approaching per-account limits; owner operational alert at 300 MB
  actual database size. At 400 MB stop new enrollments/imports and optional
  growth. Every save needs a server-side reservation including new-copy,
  evidence, index and cleanup margin; pause existing play when safe commit
  capacity cannot be assured. Concurrent imports cannot each spend the same
  remaining space. Do not wait for provider read-only failure.

Do not truncate FSRS, accepted reviews, money records, frozen content or
inspection history to fit. Existing valid local saves over a proposed limit
remain local/exportable and clearly ineligible for enrollment, not "corrupt".
For a growing cloud campaign, warn early and preserve confirmed/pending state
if capacity is reached. Lossless normalization, revised limits after evidence,
or an owner-approved paid plan is the next step; silently removing a prior copy
or enabling unlimited local divergence is not a solution. Restart at the cloud
campaign limit must not destroy the archive; offer a new local campaign or an
explicit checked export/removal workflow only if separately implemented.

Measure `pg_database_size`, `pg_total_relation_size`, table/index/TOAST sizes,
dead tuples, cleanup/autovacuum behavior and peak transactional allocation via
the restricted owner route. Run repeated writes for hours with 30 synthetic
accounts and long/repeat-inspection fixtures, not just one insert. Demonstrate
both steady state and temporary third-copy/dead-row pressure. App-level JSON
bytes are a conservative allocation input, not a replacement for physical
measurements. If the evidence allowance or operating reserve fails, the Free
rollout does not pass merely because current fixtures fit.

Egress also matters: 30 players x one 2 MB download/day x 30 days = **1.8 GB**;
four 350 MB weekly exports = **1.4 GB**, total **3.2 GB** before overhead. Three
full downloads/player/day would instead total **6.8 GB with those exports**,
above the inherited 5 GB allowance. Desktop -> phone -> desktop is a realistic
source of extra opens. Measure real compressed transfer and evidence hydration,
cache by immutable hash/revision, download only the selected current campaign,
and return small write receipts. Do not assume compression, provider-pausing
avoidance or unlimited device switching; inadequate measured transfer is also
a capacity/plan gate. Do not create artificial keep-alive traffic.

## 5. Explicit migration and the owner's prototype

"First sign-in" here means the first cloud-capable session after Beta 2 is
enabled; existing Beta 1 players already have account-local campaigns. Do not
wait for a new registration and miss their saves.

1. Fetch account summaries after authentication and cloud-notice acceptance.
   Inspect only this account's local profile and any explicitly offered unowned
   legacy source **at this origin**. Never read another account's namespace.
   Preserve a raw source recovery copy before parsing/migrating; do not use the
   ordinary loader's fresh-profile fallback as permission to overwrite damage.
2. Show account and device-local lists separately, with names, levels, statuses,
   sizes and checkboxes. Offer **Copy selected local campaigns to my account**,
   **Use account campaigns**, and **Later**. Nothing uploads on sign-in alone.
   Copying unowned campaigns needs an explicit claim to the displayed account;
   existing account-local campaigns also require an explicit first enrollment.
3. Validate versions, IDs/references, pins, frozen content, FSRS/history,
   tutorial state, checksums and quota; show per-campaign eligibility. Imported
   local timestamps remain provenance, not cloud revisions or trusted dates.
4. Use a stable import operation/source digest per campaign. Create campaign,
   baseline evidence and initial snapshot in one transaction. Mark historical
   reviews as import baseline, never new answered-question counts. Preserve
   already minted Beta 1 count receipt IDs; finish them only through their
   existing deduplication path, without minting a second set from history.
5. Fetch and verify/hydrate the accepted cloud state, including logical round
   trip and identity/history comparison, before marking this campaign enrolled.
   Keep original local/legacy bytes; a marker is additive, not destructive.
   Partial multi-campaign success is reported individually and is retryable.
6. A proven identical import retry is a no-op; a later changed local branch is
   not. Same ID with different content, same normalized name with different ID,
   an existing newer cloud revision, oversize, unsupported or damaged data
   prompts a choice/rename or stays local. Never replace by name or ID match.
   Recovery copies need verified ID/reference migration and their own slot;
   preserving the original in-game ID is the normal import path.

During enrollment, freeze the selected source revision or pause it while a
checked snapshot is taken. Pending edits arriving during upload must remain
explicit pending work, not disappear behind an "import complete" marker.
Crash after server commit but before local marking must recover from the import
receipt. Do not automatically upload historical local flags, Auth credentials,
pending voluntary comments or unrelated browser keys with a campaign.

**Owner prototype: keep `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent browser profile. Its prototype
mode has no account, makes no cloud-save calls and its campaigns stay local.**
`location.origin` there is `http://127.0.0.1:4173`. Pages cannot read that storage.
Do not configure local Auth, change launcher/host/port/profile, or claim that
enabling Beta 2 migrates the owner's existing local campaign.

For account campaigns, the intended cross-device opening path is the existing
**`https://melissarowlandc-afk.github.io/GamifySurgery/`** on both devices, with
the same invited account. Its `location.origin` is
`https://melissarowlandc-afk.github.io`; the `/GamifySurgery/` deployment path
must remain correct. Other origins/profiles keep separate local caches; only
deliberately authenticated builds using the same backend/account can share
accepted cloud data. The private phone prototype also remains separate.

An eventual owner-requested prototype-to-account copy should use an explicit
checked export at the canonical local origin and file import on Pages. This is
optional and not required for automatic Beta 1 account-local migration; it
must not silently enable an account on the prototype. Keep original local
bytes and stable IDs. Any future durable opening-path change belongs in the
manager's handoff before that task closes. Diagnose persistence with
`location.origin`, build/protocol version and account scope, without tokens or
full saves in support logs.

## 6. Schema, validated RPCs, RLS and privacy

### Logical schema sketch, not an executable migration

Use new additive migrations after the existing Beta 1 sequence. Do not alter
the historical SQL files or assume automatic Data API grants. Schema names are
proposals; the boundaries below are acceptance requirements.

| Record | Key fields and enforced contract |
| --- | --- |
| `public.campaigns` | PK `(owner_id uuid, campaign_id text)`, FK owner to Auth with deletion cascade; normalized unique campaign name per owner, resumable/archived status, immutable seed/version pins, increasing current revision/hash, server-created/updated times, import/restore provenance. Player reads own summaries only; lifecycle mutations through RPC. Store per-campaign tutorial/guidance metadata with campaign authority, not a competing global profile. |
| `public.campaign_snapshots` | PK `(owner_id, campaign_id, revision)`, composite FK to owned campaign; cloud envelope/codec version, game schema/version pins, validated operational `payload jsonb`, SHA-256, authoritative measured bytes, server accepted time and evidence high-water references. Retain current plus one verified prior; rows immutable while retained. Snapshot references exact frozen content/evidence versions. |
| Normalized campaign evidence | Owned composite campaign FK; immutable review/episode/scored-decision identities and frozen versions, current FSRS cards plus append-only reviews, auditable money/settlement records and inspection attempts. Unique evidence/operation IDs, parent revision and ordering. Each fact has one canonical owner; snapshots can cache totals only with reconciliation. Exact tables/field mapping are B2.1 deliverables under ADR 0019. |
| `gamify_private.campaign_writers` | One row per owned campaign: random opaque session token hash, generation, server expiry. Tokens are scoped to the account/campaign/session; no device name, hardware ID, fingerprint or user agent. Only fenced lease RPCs can update it. |
| `gamify_private.campaign_operations` | Owned campaign + operation ID, complete immutable request digest, expected/accepted revision and small result. Same ID/same request returns original receipt; changed reuse rejects. Bound ordinary receipts (proposed seven days), retaining import provenance/evidence dedup for campaign life. An expired unknown operation cannot be blindly replayed or mint new evidence. |
| Private cloud access/quota state | Separate account cloud-enabled capability, accepted cloud-notice version/time, protocol floor, size reservations and bounded rate counters. Reuse the existing membership/revocation/deletion authority and lock order; separate cloud consent from Beta 1 usage consent so rollout does not silently invalidate or expand it. No client-writable admission/role/quota fields. |

Cloud consent does not enable optional usage recording. The cloud guard reuses
the admission/deletion checks without requiring Beta 1 usage consent; only an
eligible count receipt under the player's existing usage acceptance can affect
the two-total report. Declining usage does not authorize counting indirectly
from uploaded learning history.

Use `auth.uid()` for ownership, not a browser-supplied owner ID. Enable RLS
before grants. Player SELECT policies require own `owner_id`, a live admitted
membership and appropriate cloud consent; child access also proves the owned
parent. Anonymous access and cross-player reads/writes are denied, even for a
guessed campaign/revision. Revoke direct INSERT/UPDATE/DELETE from players;
only constrained RPCs may mutate campaigns, snapshots or evidence. Neither a
usage-owner report role nor the question-flag reader gains campaign access.
Owner support/export is a separate restricted operational route, not a global
player-facing RLS exception.

Mirror the existing public **security-invoker wrapper -> private validated
helper** pattern. Private helpers that need definer rights use fixed empty
`search_path`, fully qualified objects and explicit authorization. Revoke
default/PUBLIC/anon EXECUTE, grant only named functions as needed, and keep
`gamify_private` out of exposed API schemas. Explicitly audit grants including
`service_role` and transitive validator execution; the Beta 1 owner-tool grant
fixes show why RLS alone or assumed defaults are insufficient. No owner secret
or database password goes into `VITE_*`, browser cache, a save or this document.

Fresh checks must use the latest setup-link rules: membership plus confirmed,
live, nonanonymous, nonbanned Auth identity admitted through provider invitation
**or the trusted `gamify_setup_admitted` app-metadata marker**. User-editable
metadata never admits a player. Check deletion/revocation at every read/write,
renewal, import and takeover, including with a stale valid-looking JWT.

### Save API and validation contract

Proposed small public RPC surface: get cloud capabilities/list summaries; load
one campaign/revision and required evidence; acquire/renew/release/take over
writer; save; import; archive/restore; query operation outcome. Archive/restore,
rename and restart obey revision/fencing rules too. Unsupported or retired
client protocols are rejected server-side; a frontend-only flag is insufficient.

For a save transaction, lock in a documented consistent order (membership,
account reservation, campaign/writer), then:

1. Require live admission, cloud consent/capability and a compatible protocol.
2. Check the full request digest against an existing operation receipt; identical
   retries return their original result even if the lease subsequently changed,
   but never bypass deletion/revocation. Reject conflicting ID reuse.
3. Validate writer token/generation and conservative server expiry, and compare
   `expected_revision` with current. No partial evidence or usage commit on
   revision/lease conflict. Serial transactions choose a winner, not timestamps.
4. Validate envelope/schema/pins/identity, JSON types, finite supported numeric
   ranges, nested collections/references, payload/evidence sizes, operation
   uniqueness and limits. Verify new evidence appends to the accepted baseline;
   reject removed/edited accepted reviews, money records or inspection evidence.
   Reconcile cash/cards/cached totals to canonical evidence as specified in the
   codec. SQL must perform real structural/basic-invariant checks; a client
   `deserializeGameState` call is not server validation or proof of gameplay.
5. Reserve capacity and atomically append evidence, write snapshot, advance
   revision, record any eligible opaque count receipt through **one existing
   deduplication path**, and store the save receipt. Imported history does not
   count. A Beta 2 scored transition must not be counted twice by both the
   local usage outbox and the cloud RPC; retain already issued Beta 1 IDs.
6. Commit and return only operation ID, accepted revision/hash/bytes/server time
   and relevant evidence high-water marks. Replace local confirmed state only
   for that receipt. Retire excess cloud snapshots only after the replacement
   and required prior are valid/durable; measure transient allocation.

Checksum proposal avoids comparing JS `JSON.stringify` to reordered JSONB:
send bounded UTF-8 payload text plus its request hash, have the server verify
and parse it into JSONB, and store **one** JSONB payload. The server computes a
separate stored hash over its canonical `payload::text` UTF-8 representation.
A load RPC returns that exact canonical text and stored hash; the client hashes
those bytes before parsing/hydration. Request digest covers every material
argument, including evidence and lifecycle metadata; do not confuse it with the
stored snapshot hash. Save receipts acknowledge the request digest as well as
the server hash. Golden vectors must prove Unicode, number precision, key order
and whitespace handling preserve logical state across JS/PostgreSQL. This is a
codec milestone gate, not a claim that the existing repository already supports
this protocol. Do not persist a second full text copy just to get a matching hash.

Proposed engineering limits (not clinical thresholds): <=3 MB decoded candidate
state, <=1 MB new evidence/recovery tail, and a **6 MB transport-body ceiling**
that includes JSON string escaping/metadata; cap collection counts/depth and
text lengths. Also enforce the 3 MB server-canonical snapshot ceiling and the
account aggregate budgets. Measure the real encoded body and reject before
expensive processing where the gateway permits; SQL checks cannot by themselves
stop an oversized request before HTTP parsing. Verify the actual hosted RPC
gateway limit with synthetic maximum-size requests; add a thin bounded ingress
only if direct RPC cannot satisfy the tested size/abuse contract. Never ship a
service secret or weaken authorization to get large saves through.

Initial rate proposals: <=6 newly accepted checkpoints/campaign/minute and <=12
per account/minute; <=30 total cloud mutation/lease calls/account/minute; <=6
full-snapshot loads/account/minute, with small metadata reads separately bounded.
Coalesce urgent bursts without dropping evidence. Use server-time counters and
membership/account locking, not client timers alone. Identical retries consume
request-abuse budget but no second snapshot/evidence allocation. Return retry
delay and preserve/possibly pause pending work; do not disguise throttling as
success. Validate the cadence with two campaigns, renewal, takeover, reconnect
and short bursts so quotas do not create routine false connection-loss pauses.

### Evidence fidelity before implementation acceptance

B2.1 must map every persisted field to operational state, canonical immutable
evidence, mutable card projection, campaign metadata or device-only preference.
Current retired encounters/service summaries and bounded event/receipt views
are **not a complete historical ledger**. Preserve all available imported data
as an immutable import baseline and mark its historical limitations; never
invent missing individual money/review/inspection events. Capture new evidence
before runtime retirement from cloud adoption onward. If current reducer
outputs cannot provide the required deltas, return that gap to the manager for
a separately owned domain lane rather than fabricate evidence or silently
weaken the ADR. Hydration must recreate the same supported full logical state,
not resolve old questions against today's mutable clinical release. No clinical
meaning, random stream, answer order or FSRS change is authorized by storage work.

### Notice, retention and delete-my-data

Before any enrollment/upload, show a versioned cloud notice explaining that
Supabase now stores the full functional campaign, including synthetic cases,
choices/learning history, facility and financial/inspection state. The owner's
routine usage report remains only total playtime and question counts; that must
not be misworded as "only counts are stored" after cloud saves. No clinical
research/analytics or bulk campaign access for the feedback pipeline. Publish
the verified region, access/support purpose and backup schedule in the notice.
Continue the no-real-patient-information and unapproved-clinical-content notices.

Cloud campaigns/evidence remain for account gameplay until explicitly removed
under the approved lifecycle or account deletion; **do not apply the 90-day
usage/feedback purge to campaigns or FSRS**. Ordinary operation/rate records
are bounded separately; deletion removes them too. Default sign-out preserves
account-scoped local recovery, with an explicit clear-this-device choice and
plain shared-device warning; no unconfirmed work is silently discarded.

The current Account menu says **Delete my usage data** and promises clinics
stay local. Beta 2 must provide a clearly scoped **Delete my data/account**
confirmation covering cloud campaigns and immutable evidence. Use a new
versioned full-deletion RPC with explicit scope/notice confirmation; do not
silently widen the destructive effect of the old usage-only endpoint behind
an old client's wording. For a cloud-enrolled account, the legacy endpoint
must reject with an update-required result and leave data intact until the
player uses the new confirmation. Non-enrolled Beta 1 accounts retain the
existing behavior. Test this mixed-client transition before rollout.

The full-deletion transaction extends the existing implementation pattern:
lock membership, set deletion blocker, invalidate writer generations, stop
queues and remove campaign snapshots, evidence/cards,
operations, reservations and cloud-consent data along with existing usage,
flags and feedback. Auth foreign-key cascades are a second deletion path, not
the entire procedure. Privileged deletion is the explicit exception to evidence
immutability; test both paths and that account B survives.

Once the request is confirmed, no stale/offline client may recreate rows or
restore notice/admission. If the request cannot reach the service, say deletion
is **not confirmed**, stop local uploads and let the player retry. Preserve the
existing owner administration/support completion target of seven days for
remaining Auth/invitation/private export cleanup; update the owner tool/runbook
so it cannot omit new cloud tables. Offer removal of only this account's local
cache/recovery/pending queues at this origin; never erase another account or
unowned prototype. Explain that other offline browser copies cannot be remotely
erased and must be cleared there. A minimal protected deletion ledger must
outlive the backup retention window so restoring a backup cannot resurrect a
deleted account; disclose its limited purpose/retention and remove unnecessary
identity details. No public logs or save payloads in error analytics.

## 7. Client work in both shells

Use one account-scoped coordinator above entry and both shells, not two sync
implementations. Extend the shared session/shell contract with asynchronous
save state and actions; the current synchronous `PrototypeSaveResult` and
"Safe to close" UI cannot imply a network acknowledgment. Prototype mode keeps
its existing local behavior and explicit **Local only** label.

| State | Player-facing behavior on desktop and phone |
| --- | --- |
| Checking account save / loading | Disable state-changing play until admission, version, snapshot and writer status are known; offer retry, no blank fresh replacement. |
| Saved to account | Persistent compact status plus last confirmed time; details identify campaign and separate local recovery from account confirmation. Announce meaningful changes accessibly without every heartbeat. |
| Saving / recent changes waiting | Clear pending status. Save & Close waits for confirmed checkpoint and lease release; local persistence alone says "Saved on this device; account save waiting." |
| Open elsewhere / takeover | Same explicit Continue here / Not now dialog and warning in both shells. Read-only cannot execute purchases, answers, restart, archive or Resume. |
| Offline / unavailable provider | Explain local recovery, pause by grace/lease rule and offer Retry; login expiry offers sign-in as the same account. Do not turn a failed request into a new empty campaign. |
| Newer save / lost writer | Pause and present account-save, recovery-copy and Not now choices. Preserve both branches until a verified choice. |
| Quota, storage blocked/full, throttled | Distinguish account capacity, browser durability and temporary rate failures. Preserve confirmed/pending data, give actionable retry/export/contact-owner state; no misleading cloud checkmark. |
| Unsupported/corrupt save / old client | Preserve bytes, offer update/recovery and owner support; never overwrite with fresh state or automatically restore a prior revision. |
| Revoked/deletion-requested | Immediately stop commands/uploads/renewal, invalidate in-memory ownership and show blocked/deletion state. Delayed callbacks cannot write for another signed-in account. |

Show a compact always-visible status in desktop chrome and the phone header,
with details/retry in Account/Save and campaign cards labeled **Account** or
**This device only**. Reuse dialog wording/state across desktop campaign manager,
phone adapters, opening flow and restart/restore. Keyboard focus, screen-reader
status, touch targets, long names, narrow screens and no reliance on color are
acceptance requirements. Keep protocol tokens/revision machinery out of the
normal player journey; expose redacted technical details only for support.

Use a backend+account+campaign namespace in the new IndexedDB cache, verified
transactions/readback and cross-tab coordination (Web Locks/BroadcastChannel
when available); server fencing remains authoritative when those APIs are
missing. Keep original unowned IndexedDB/database/localStorage data untouched
until explicit checked migration; do not adopt the existing global repository
as-is. Bind in-flight work and callbacks to their originating account. Never
store Auth/service secrets in snapshot or pending payload records. Do not rely
on `pagehide`, `beforeunload`, fetch keepalive or mobile shutdown to deliver a
multi-MB final upload; checkpoint while active and provide Save & Close.

## 8. Validation, rollout and rollback

### Unit and integration coverage

- Codec: all saved fields/pins, frozen encounters and exact randomized choice
  order, FSRS cards/reviews/timezone, money reconciliation, inspection history,
  RNG stream states/counters and retired summaries; old schemas, unsupported
  future schemas, migrations, Unicode and numeric hash vectors. Property/fixture
  round trips compare logical fidelity, not a weakened shallow shape assertion.
- Cache/coordinator: A/B/prototype/backend isolation; metadata + usage staging
  atomicity; verified local writes; quota/security/blocked IndexedDB failures;
  crash before/after local commit and server commit; lost ack with an unchanged
  in-flight ID; one coalesced tail; 7 MB cap; clock jump/sleep; stale callback,
  rapid account/campaign changes; reauth and incompatible protocol. Assert
  commands/ticks are stopped when paused for sync, not just disabled buttons.
- Import/lifecycle: opt-in and decline; existing Beta 1 accounts; legacy source
  preservation; archive/restart/restore; identical retry vs changed source;
  ID/name collision; partial batch; oversize/invalid; import concurrent edits;
  historical count baseline and one count-only receipt path. Hash original
  storage bytes before/after declined or failed imports.
- Real disposable SQL/Data API: A/B/anon grants and RLS; guessed child IDs;
  direct-write and private-helper denial; setup and legacy admission; false
  user metadata; expired/banned/revoked/deleted identities; server clocks;
  size/rate/account and global capacity races; schema checks; evidence mutation
  rejection; identical/conflicting operation reuse; all-or-nothing snapshot,
  evidence and count. Use two actual DB sessions for save/takeover/renewal and
  deletion races, not sequential mocks labeled concurrency.
- Operational: maximum request bodies through the real ingress, physical DB
  growth over repeated saves/cleanup, 30-account/60-campaign load and peak
  reservations, transfer volume, read-only/full/unavailable project behavior,
  private backup and isolated restore, deletion replay and old-client rejection.

### Two-context Playwright and physical phone

Add `tests/e2e/cloud-saves.spec.ts` with independently authenticated browser
contexts (desktop and phone viewport) sharing **only the disposable backend**,
not localStorage or a manually copied latest save. Include a two-tab/same-profile
case separately. Run repeatable transport-fault tests plus real Data API tests;
mocked HTTP success is not hosted/RLS acceptance. Synthetic users only.

1. Desktop imports/plays/saves; phone signs into the same account, sees all
   enrolled campaigns and continues the correct state. Return to desktop after
   phone Save & Close; compare exact saved progress/history/cash/order, with no
   extra FSRS review, purchase or count.
2. Leave desktop visible and then hidden in separate cases. Phone takes over;
   desktop cannot save or release the phone's lease, and cannot Resume without
   a fresh check. Race two takeovers and simultaneous saves; one generation and
   expected revision win. Read-only open never takes over by itself.
3. `context.setOffline(true)`: short outage within grace, outage past expiry,
   refresh offline, desktop offline while phone advances, return without change,
   lost save response after commit, slow/out-of-order response, server unavailable
   while browser reports online. Assert bounded recovery and explicit conflict,
   preserved branches and no catch-up/replayed answers.
4. Account switch/sign-out during an upload, account B isolation, deletion while
   another context holds a lease/pending save, and reconnect of the old context.
   No resurrected cloud rows or cross-account UI/callback contamination.
5. Oversize/unsupported/corrupt saves, blocked local storage, rate/capacity limits,
   server-disabled feature and old client. Status and Save & Close wording must
   match what is actually durable on both shells.

The manager must also verify a physical phone browser's suspend/resume/tab-close,
touch dialogs and keyboard, and a real desktop -> phone -> desktop handoff.
Chromium phone emulation alone does not establish mobile background behavior.

Run browser/DB work only in a manager-approved disposable environment with
synthetic accounts, separate caches and exact recorded URL/origin. For local
QA prefer dedicated `http://127.0.0.1:5184` with its disposable browser profile;
it has separate storage and does not move owner 4173 saves. Do not start an
auth-configured QA server over the owner's canonical port, change a launcher or
use owner storage as a test fixture. The workers' unelevated sandbox may block
browser launch; the manager owns reruns in a capable environment.

### Rollout

1. Manager accepts owner choices, field/evidence contract and capacity gates.
   Schedule future domain work after current clinical/game-domain lanes hand
   back; inspect actual shared changes before assigning overlapping files.
2. Prepare additive SQL, tested client and private recovery/backup runbook;
   rehearse on disposable data. No live secret or real save in Git/artifacts.
   Freeze and identify tested app, protocol, migration and release versions.
3. Apply reviewed additive schema through the authorized owner/manager route,
   with cloud capability **off by default**. Confirm grants/RLS and revocation.
   New notice/opt-in precedes first functional save, not a blanket backfill.
4. Enable for the owner account using a synthetic or deliberately selected
   account-local campaign, then a small consenting tester cohort (proposed 2-3),
   then the remaining invited accounts up to about 30 after handoff/error and
   storage/transfer evidence passes. Do not enroll the owner prototype by default.
5. Give testers one plain opening instruction: use the existing Pages URL on
   both devices and the same account; copy selected local campaigns; wait for
   "Saved to account" or Save & Close before changing devices. Explain takeover,
   brief-offline pause, local-only extras and recovery/support. The owner sends
   any tester messages; this plan/worker sends none.
6. Monitor essential redacted failures, aggregate capacity/transfer and backup
   health, without campaign/answer analytics. The manager reviews actual diffs,
   full logs and SQL/browser evidence before acceptance. A validated checkpoint
   is local-only until an authorized audited GitHub backup; manager owns the
   **"push to GitHub"** reminder/checkpoint and release under existing authority.

### Backup, recovery and rollback

Recommended private **weekly logical export**, two generations expiring within
**14 days**, encrypted and outside the public repository, includes campaigns,
retained snapshots, canonical evidence, version manifests and ownership mapping.
It supplements the one prior cloud revision; neither protects progress since
the last successful export against total project loss. State that recovery
point explicitly. Confirm Auth recovery/identity mapping separately; a gameplay
export does not recreate passwords or Auth configuration. Restore into an
isolated disposable database and reconcile deletion records before access.

Corrupt/incompatible current state pauses writes and preserves bytes. A verified
prior snapshot can seed an explicit recovery campaign after quota/identity
checks; it must not erase later accepted immutable evidence. Same-campaign
recovery requires owner-reviewed evidence reconciliation and a **new higher
revision**, never a revision rewind. Later progress remains preserved for
diagnosis; historical reviews do not become new usage counts.

For a bad release, disable new cloud enrollments and use a server protocol/
capability gate to pause incompatible writes/renewals while preserving data and
local pending records. Keep read/export/recovery available when safe; tell
players account saving is unavailable. Publish a tested compatible client under
the manager's existing release authority. Do not destructively roll migrations
back, overwrite cloud saves from old caches, or claim an old Beta 1 local-only
artifact will seamlessly continue a newer cloud campaign. A backend capability
off state must be distinguishable from prototype/local mode, so it cannot
silently authorize divergent local play. Restore/rollback drills must prove
that deleted accounts are not reintroduced and old tokens cannot resume writes.

## 9. Bounded milestones, ownership and acceptance

Normally one write-capable Sol worker at a time. The manager assigns explicit
files after reviewing the shared tree, does planning/integration/acceptance and
records the durable handoff. Workers preserve concurrent work and do not spawn
agents, commit, push, publish, install or contact anyone without an express new
brief. No milestone below authorizes clinical edits or clinician approval.

| Milestone / future lane | Bounded ownership and deliverables | Validation and acceptance |
| --- | --- | --- |
| **B2.1 Codec and evidence contract** | New `apps/player/src/session/cloud/codec*` and focused tests; field/evidence mapping and measured envelope. Read domain/persistence by default. Manager assigns a separate explicit domain evidence-export lane only if audit finds gaps and current domain workers have handed back. Define baseline import, normalized evidence/card ownership, hash/load contract and cloud-format version. | Run focused player codec tests and workspace typecheck; domain tests only for any approved domain change. Golden JS/SQL vectors and full logical round trips for all measured fixtures/old schemas; complete field ownership, no invented history or lost frozen/FSRS/money/RNG state. Remeasured <=target/ceiling or explicit capacity failure. No server/client rollout. |
| **B2.2 Transactional server** | New uniquely named `supabase/migrations/*_beta2_cloud_saves.sql`, `supabase/tests/beta2_cloud_saves.sql` and test instructions. Account/campaign/snapshot/evidence/operation/lease/notice/quota schema, constrained RPCs, additive deletion extension and protocol gate. | Real disposable SQL and Data API assertions, two-session concurrency/crash tests; A/B/anon isolation, fixed grants/search paths, stale generation/revision denial, atomic evidence/count/save, compatible baseline consent, limits and deletion. All prior Beta 1 SQL tests still pass. Migration is reviewed before any live application. |
| **B2.3 Shared cache/sync coordinator** | New `apps/player/src/session/cloud/*` transport/coordinator/cache tests; explicitly scoped adaptation of `localCampaignRepository.ts`, account namespaces and `usePrototypeSession.ts`. No shell redesign. Bind lifecycle/commands, versioned cache, bounded pending state, idempotency, grace and fencing. | Focused cloud/session/account tests and typecheck; fake IndexedDB and fault-injected transport prove durable boundary, one frozen request/tail, caps, reauth/switch/expiry, no stale commits, no silent local fallback and no duplicate usage/evidence. Prototype fixture behavior and original local keys preserved. |
| **B2.4 Entry/import and both shells** | `App.tsx`, shared shell contract, `AppShell.tsx`, `mobile/MobileShell.tsx`, phone adapters, campaign/opening/save/account UI and focused CSS/tests; cloud migration UI/markers only in owned cloud modules. Versioned cloud notice and safe deletion/sign-out wording. | Full player suite/typecheck plus focused two-context browser runs. Same state and statuses on desktop/phone; opt-in import with raw bytes retained; name/ID/size errors; account callbacks; takeover/recovery; async Save & Close; archive/restart slot behavior; keyboard/touch/accessibility. Manager checks actual phone. |
| **B2.5 Capacity, backup and integrated recovery** | Dedicated synthetic `tests/e2e/cloud-saves.spec.ts`, future read-only capacity/load harness and a private-backup/restore setup runbook; avoid editing current game evidence fixtures to make limits pass. | All unit/SQL suites, physical DB/egress measurements for 30 accounts and 60 campaigns plus long play, transient space/cleanup, ingress bounds, unavailable/read-only service, deletion-aware isolated restore and compatible rollback. Demonstrated <400 MB working budget with reserves; realistic transfer fits allowance. Otherwise manager escalates lossless storage/limits/plan before enablement. |
| **B2.6 Manager acceptance and staged enablement** | Manager owns final reviewed manifest/diffs, owner decisions, handoff, backup checkpoint, authorized SQL application, cloud capability cohort and release. Workers may get separate bounded validation briefs. | Required regression/build commands and live synthetic handoff/deletion smoke tests pass; notice/campaign/backup choices settled; rollout/rollback gates operational; no changed owner prototype pathway. Owner and small tester cohort demonstrate desktop -> phone -> desktop before broad enablement. |

Suggested exact command contract for future briefs (new files above must exist
first; none of these suites/builds/DB/browser commands was run by this planning
worker):

```powershell
# B2.1 / B2.3 focused player tests; use existing installed dependencies.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/accountStorage.test.ts src/session/accountSessionIntegration.test.tsx src/session/localCampaignRepository.test.ts

# B2.4 / integrated regression.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck

# B2.2 / B2.5: ONLY a previously provisioned disposable DB, using private env.
# Manager verifies target and migration order first; never print the env value.
psql --dbname "$env:GAMIFY_BETA2_TEST_DB_URL" --set ON_ERROR_STOP=1 --file supabase/tests/beta2_cloud_saves.sql

# Manager browser validation with the isolated QA server already running.
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/cloud-saves.spec.ts --project=desktop-chrome --project=phone-chrome

# Manager release regression in its authorized environment.
npm.cmd test
npm.cmd run build:pages
```

The new SQL test should follow the existing rollback-only synthetic test style
and print a precise PASS row only after all assertions; actual concurrent
sessions and Data API tests remain additional gates. Run all prior SQL files
from `supabase/tests/README.md` after the complete migration sequence. A local
PostgreSQL/Supabase installation is not assumed available; missing infrastructure
is an explicit manager validation dependency, not permission for a worker to
install or contact a live project. In this sandbox use `--pool=threads` and the
existing approved preload if needed; the manager reruns default-config tests
and browser checks independently. Record exact exit codes/test totals and
redacted logs, distinguish mocked, SQL, hosted and physical-device evidence,
and report unrelated concurrent regression failures rather than weaken tests.

## 10. Owner decisions needed

These are new choices; one writer, explicit takeover, no merges, existing
invite-only Auth and leaving the prototype local are already settled.

1. **How many campaigns should each player keep in the cloud at first?**
   Recommended default: **two**, including archives/recovery copies, within
   the tested account space budget (proposed 8 MB snapshots + 2 MB evidence).
   Keep extra existing campaigns local; do not delete them. Larger campaigns
   may use the available space sooner; explain limits before enrollment/restart.
2. **Are weekly private backups, keeping two copies for up to 14 days, enough?**
   Recommended default: **yes for this invited beta**, plus the prior cloud
   revision and a tested restore. A total-project failure could lose progress
   since the last weekly backup; shorter recovery requires a revised budget.
3. **Should Beta 2 stay on the free plan while tested usage fits?**
   Recommended default: **yes, with capacity warnings and a safe pause if
   limits are reached**; discuss a paid plan before any purchase or expanded
   promise. Do not automatically upgrade or discard history to stay free.
4. **Should signing out keep this account's recovery copy on that device?**
   Recommended default: **keep it**, with an explicit clear-this-device option
   and shared-device warning. Unsent progress must be confirmed/exported before
   intentional removal; signing out never uploads it to a different account.

## Progress, discoveries and next action

- [x] Read repository instructions, the prior Beta 2 design/binding owner
  decisions, current account/local persistence, both shell save boundaries,
  relevant accepted ADRs and existing Supabase grants/RPC/deletion patterns.
- [x] Measure synthetic serialized checkpoints read-only and record byte/hash
  receipts; distinguish sample maximum from an absent true maximum.
- [x] Draft options/recommendation, 30-player capacity correction, opt-in import,
  prototype/origin preservation, schema/security/privacy, UX, validation,
  rollout/rollback and bounded lanes.
- [x] Validate UTF-8/no BOM, LF-only lines, final newline, paired code fences,
  local document links, four owner questions, current fixture hash receipts and
  the 326.898 / 350 / 470 MB scenario calculations with a read-only Node check.
- [ ] Manager reviews this document and resolves the four owner choices; no
  implementation milestone has been accepted, started or delegated here.
- [ ] Manager schedules B2.1 after checking concurrent domain/content ownership,
  then assigns sequential bounded briefs and provisions disposable validation
  through its authorized route.

Key discoveries: the IndexedDB repository is not active/account-scoped; raw
local timestamps are not cloud revisions; local serialization has no maximum;
two 3 MB campaigns for each of 30 players overrun the conservative working
budget once prior copies/history/overhead are included; frequent cross-device
downloads also need an egress test; imports cannot reconstruct already retired
audit events; and existing usage-only deletion/consent must be extended without
claiming existing Beta 1 consent already covers full campaigns.

Next action: manager reviews the proposed budget and evidence contract, obtains
the owner choices, and issues the B2.1 brief. This document is **local only**;
no GitHub backup, implementation, cloud migration, provisioning or publication
was performed. The manager owns its checkpoint reminder and current-thread
handoff; this planning worker intentionally did not edit any other file.

## Owner decisions (2026-10-17)

Owner in chat: "Go with your recommendations." Binding:
1. Two cloud campaigns per player at first (including archives/recovery copies); extra campaigns stay local, never deleted.
2. Weekly private backups keeping two copies for up to 14 days, plus each campaign's prior cloud revision and a tested restore.
3. Stay on the Supabase free plan while measured usage fits; capacity warnings and a safe pause if limits approach; discuss any paid plan before purchase.
4. Signing out keeps that account's local recovery copy on the device, with an explicit "clear this device" option and a shared-device warning.
Manager: B2.1 dispatched 2026-10-17, concurrently with the game-domain Level 5 latent-bug worker (disjoint lanes; B2.1 reads domain only).

## B2.1 handoff (2026-10-17)

Worker: GPT-6.1 Sol. **Baseline codec and offline contract ready for manager
review; live evidence export stopped at the documented domain gap.** This is
not acceptance of cloud gameplay, physical capacity, SQL validation or rollout.
The binding Owner decisions above remain in effect.

New files in the assigned lane:

- `apps/player/src/session/cloud/codec.ts`: cloud/evidence/protocol version 1,
  explicit baseline-only envelope/import preparation, immutable exact-byte
  request receipts, verified hydration and capacity measurements.
- `codecJson.ts`: bounded lossless JSON/Unicode/number checks, exact UTF-8
  SHA-256 and independent logical equality.
- `codecOwnership.ts`: exhaustive GameState, campaign and profile field
  ownership; nested frozen/review/card/money/inspection contract.
- `codecGoldenVectors.json` and `codecGoldenVectors.sql`: four pinned JS/SQL
  vectors and a rollback-only disposable PostgreSQL assertion file.
- `codec.test.ts`, `codec.fixtures.test.ts`, `codecTestSupport.ts`: focused
  tests, complete fixture/migration comparisons and explicitly simulated text
  reordering. The helper is not a PostgreSQL oracle.
- [Short contract/gap note](beta2-b2-1-codec-notes.md).

Only this appended handoff and those new files were written. Domain/session
sources, fixtures, existing local saves, launchers, UI and server configuration
were not edited. No Git commands, installs, network, Supabase access, agents,
external messages, publication or deployment were used. No clinical statements,
approval status, concept IDs, balance or FSRS meaning were authored or changed.
The manager retains the current-thread handoff and GitHub checkpoint reminder;
this work is local only.

### Contract and fidelity result

All original parsed state is retained in an immutable import baseline before
the public deserializer normalizes it; exact source-recovery bytes/hash/size are
returned unchanged for the caller to retain durably. The snapshot caches the
entire supported migrated state. Load verifies both exact stored text hashes
before parsing, checks expected campaign/baseline/revision and compares all
logical fields to the authoritative migrated baseline. No shallow assertions
replace full equality. Hashes do not themselves enforce server immutability.

The complete request digest covers every material argument of the B2.1 import
request. Stored JSONB canonical text requires a separately computed server
hash; JS stringify is never compared byte-for-byte with reordered JSONB.
Revisions stay decimal strings, including values above JS safe integer range.
A later RPC adding writer/lifecycle/usage arguments must extend/version the
complete-request digest and remeasure its actual transport wrapper.

The suite covers all 11 planning checkpoints, existing pre-M9 Level 0-4
synthetic saves across schemas 5-9 and their saved next-120-minute states,
synthetic compatibility inputs for schemas 1-9, fresh levels 0-5, a recorded v1
review-intent migration and the concurrent domain worker's serialized
garden/offsite fixture. Full frozen content/choice order, cards/reviews and
times, money/accrual state, operations, pins, seed/RNG inputs/counters,
inspection state and retired summaries are compared. No fixture was changed.
Version 1's existing domain migration reconstructs card/review projections;
the original intents remain the baseline and the projections are explicitly
marked as reconstructed, not observed evidence. Historical question-count
credit is always zero; no usage receipts are minted.

### Remeasured envelope sizes

Decimal bytes; no compression. These receipts supersede the earlier planning
sizes for this inspection. The integration file is now 12,538,766 bytes with
SHA-256 `0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501`;
the legacy/economy fixture hashes still match the earlier table. Complete
source hashes, migration field names and per-fixture results are in the exact
test output below.

| Fixture | Compact source | Migrated game | JS envelope | Baseline evidence | B2.1 body | Reordered test envelope |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| level-four-legacy-pre-m3.json | 130,872 | 133,840 | 134,401 | 131,353 | 292,907 | 145,846 |
| level-five-economy-checkpoint-20261012.json | 1,429,974 | 1,430,026 | 1,430,586 | 1,430,455 | 3,141,559 | 1,524,512 |
| integration-l4 | 795,214 | 795,266 | 795,838 | 795,706 | 1,761,597 | 855,598 |
| integration-build | 803,955 | 804,007 | 804,579 | 804,447 | 1,782,494 | 865,769 |
| integration-preparing | 1,323,057 | 1,323,109 | 1,323,681 | 1,323,550 | 2,910,759 | 1,412,663 |
| integration-running | 1,397,231 | 1,397,257 | 1,397,829 | 1,397,724 | 3,075,145 | 1,493,023 |
| integration-final | 1,527,601 | 1,527,627 | 1,528,199 | 1,528,094 | 3,356,999 | 1,629,920 |
| integration-finish | 1,513,484 | 1,513,510 | 1,514,082 | 1,513,977 | 3,321,258 | 1,612,683 |
| integration-repeat-final | 1,724,322 | 1,724,322 | 1,724,894 | 1,724,815 | 3,774,644 | 1,833,631 |
| integration-repeat | 1,625,220 | 1,625,220 | 1,625,792 | 1,625,713 | 3,558,810 | 1,728,545 |
| integration-lower-repeat | 1,828,472 | 1,828,398 | 1,828,970 | 1,828,965 | 4,003,116 | 1,945,481 |

All 11 JS envelopes and reordered test envelopes fit the 2,000,000-byte target
and 3,000,000-byte ceiling. All measured B2.1 bodies fit 6,000,000 bytes.
**Capacity failure: eight of 11 immutable baselines exceed the
1,000,000-byte/campaign evidence allowance.** The largest is 1,828,965 bytes
(1,945,462 in reordered test text); two such baselines exceed the
2,000,000-byte/account evidence budget. This temporary full-fidelity layout
counts duplicated evidence and is not eligible for rollout. No history was
truncated to meet a budget. The 8 MB retained-snapshot account budget, actual
canonical SQL bytes, 7 MB recovery record, real ingress wrappers, physical
DB/index/TOAST/transient allocation and egress remain later integration gates;
these client text measurements are not database-capacity proof.

### Domain gap and manager next action

Current public state contains bounded event/receipt views, retired encounter
and service summaries, and latest/best/first inspection projections. It cannot
export all intervening frozen episodes, exact auditable money deltas, immutable
reviews/scored decisions and inspection attempts before retirement. Comparing
snapshots cannot recover missing evidence. No live checkpoint encoder, invented
ledger/history or relational delta exporter was added.

After the Level 5 worker hands back, the manager must explicitly assign a
separate domain evidence-capture/export lane with stable identities, complete
ordered pre-retirement deltas and exact money/card reconciliation. Then assign
the corresponding live codec mode/version and a lossless representation that
passes the evidence budget. Do not enable this baseline-only mode as cloud play.

**SQL gate pending:** no psql command was available, and database/network access
was outside this brief. The JS side verifies four pinned expected SQL-text
vectors; actual PostgreSQL execution is unverified. B2.2 must run
`apps/player/src/session/cloud/codecGoldenVectors.sql` in the manager-approved
disposable database and attach its real PASS output before accepting that gate.

### Final validation: exact output

From repository root, existing dependencies, final exit code **0** for each:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run typecheck
```

The preload is an absolute file URL so npm's workspace cwd change cannot resolve
it under apps/player. The requested focused tests pass **113/113 in 2 files**;
all **seven workspace typechecks pass**. No domain tests were required because
this worker made no domain change; default-pool/browser/DB/hosted/phone checks
were not run or claimed.

Focused test stdout/stderr (exit 0):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/session/cloud


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

B2.1 MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileBytes":194747,"fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedStateBytes":133840,"snapshotBytes":134401,"baselineEvidenceBytes":131353,"transportBytes":292907,"reorderedSnapshotBytes":145846,"reorderedEvidenceBytes":142518,"withinTarget":true,"capacityFailures":[],"migrationFields":["emergencyGlp1","employees","environment","learningHistories","nextExternalRetailOpportunityTick","nextServiceIncomeReceiptSequence"]}
B2.1 MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileBytes":1429975,"fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedStateBytes":1430026,"snapshotBytes":1430586,"baselineEvidenceBytes":1430455,"transportBytes":3141559,"reorderedSnapshotBytes":1524512,"reorderedEvidenceBytes":1524361,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedStateBytes":795266,"snapshotBytes":795838,"baselineEvidenceBytes":795706,"transportBytes":1761597,"reorderedSnapshotBytes":855598,"reorderedEvidenceBytes":855446,"withinTarget":true,"capacityFailures":[],"migrationFields":["encounters","retailOperations"]}
B2.1 MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedStateBytes":804007,"snapshotBytes":804579,"baselineEvidenceBytes":804447,"transportBytes":1782494,"reorderedSnapshotBytes":865769,"reorderedEvidenceBytes":865617,"withinTarget":true,"capacityFailures":[],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedStateBytes":1323109,"snapshotBytes":1323681,"baselineEvidenceBytes":1323550,"transportBytes":2910759,"reorderedSnapshotBytes":1412663,"reorderedEvidenceBytes":1412512,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedStateBytes":1397257,"snapshotBytes":1397829,"baselineEvidenceBytes":1397724,"transportBytes":3075145,"reorderedSnapshotBytes":1493023,"reorderedEvidenceBytes":1492900,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedStateBytes":1527627,"snapshotBytes":1528199,"baselineEvidenceBytes":1528094,"transportBytes":3356999,"reorderedSnapshotBytes":1629920,"reorderedEvidenceBytes":1629797,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedStateBytes":1513510,"snapshotBytes":1514082,"baselineEvidenceBytes":1513977,"transportBytes":3321258,"reorderedSnapshotBytes":1612683,"reorderedEvidenceBytes":1612560,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedStateBytes":1724322,"snapshotBytes":1724894,"baselineEvidenceBytes":1724815,"transportBytes":3774644,"reorderedSnapshotBytes":1833631,"reorderedEvidenceBytes":1833536,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedStateBytes":1625220,"snapshotBytes":1625792,"baselineEvidenceBytes":1625713,"transportBytes":3558810,"reorderedSnapshotBytes":1728545,"reorderedEvidenceBytes":1728450,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedStateBytes":1828398,"snapshotBytes":1828970,"baselineEvidenceBytes":1828965,"transportBytes":4003116,"reorderedSnapshotBytes":1945481,"reorderedEvidenceBytes":1945462,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations","serviceOperations"]}

 Test Files  2 passed (2)
      Tests  113 passed (113)
   Start at  11:25:47
   Duration  26.32s (transform 9.04s, setup 0ms, import 13.01s, tests 24.07s, environment 0ms)
```

Workspace typecheck stdout/stderr (exit 0):

```text

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```


## B2.1b handoff (2026-10-17)

Worker: GPT-6.1 Sol. **Domain evidence export/import and format 2 codec delivered
for manager review.** Existing local save behavior is preserved. Verified
compression and sealed-page measurements address the earlier baseline
duplication/capacity problem; this is not a server, UI or cloud rollout.

### Files and public API

New domain modules:

- `packages/game-domain/src/game-evidence.ts`: public
  `createGameEvidenceCheckpoint`, `applyGameEvidenceCommand`,
  `importGameEvidence`, `exportGameEvidence` and
  `restoreGameEvidenceImportSource`, with separate immutable archive and
  operational snapshot types.
- `game-evidence-json.ts`: portable lossless JSON, complete operational patches,
  logical comparison, safe property writes and immutable value helpers.
- `game-evidence-capture.ts`: synchronous opt-in read-only observations.
- `packages/game-domain/tests/game-evidence.test.ts`: 21 tests covering all
  measured fixtures, complete source recovery, real scored review/card changes,
  money/card/pin reconciliation, inspection completion/cancellation, actual
  retirement, receipt trimming/retries and unchanged ordinary reducer bytes.

Existing domain edits are exactly one public export in `index.ts` plus four
lines in `reducer.ts`: an import and observations before retirement, event
trimming and operation-receipt trimming. A read-only audit removed those lines
in memory and reproduced the starting file hashes exactly. No other recorded
domain input changed. **`persistence.ts` is unchanged**, SHA-256
`2489168f74e18a94f1acf86eedb9b4fd2480333527528dcd8e27d0f86dba0b50`.

New player modules/tests under `apps/player/src/session/cloud/`:

- `codecEvidence.ts` / `codecEvidence.test.ts`: cloud format **2**, domain
  evidence contract **1**, request protocol **2**, immutable row/header packing,
  verified hydration, prefix/high-water support and acknowledged evidence deltas.
- `codecCompression.ts` / `codecCompression.test.ts`: native browser gzip/
  deflate with immediate lossless verification and bounded streaming decode.
- `codecEvidencePages.ts` / `codecEvidencePages.test.ts`: losslessly evaluated
  immutable sealed-page storage candidate; no applied database schema.

Existing player edits: `codec.ts` exports the shared metadata validator and
marks format 1 import preparation deprecated; `codecOwnership.ts` points to the
new public capture API; `codec.test.ts` retains the original assertions;
`codecGoldenVectors.json/sql` preserve all four original vectors and add a
format 2 reference-layout vector. The [contract note](beta2-b2-1-codec-notes.md)
has a B2.1b amendment. This plan change is append-only. No fixture, clinical
release, balance data, approval, save key, launcher, UI, dependency or server
configuration was changed.

### Evidence and fidelity contract

The archive holds the complete available original import with immutable fact
references, historical limitations, opening finance/learning and version pins,
and a canonical append-only fact dictionary. Exact duplicate facts share a
record. Card pointers are mutable projections of immutable card versions.
Frozen cases/order, identities, scored answers, reviews, income/settlements,
receipts/events and inspection evidence are separate from operational snapshots.

A snapshot holds the complete current operational projection as patches against
the immutable import source, references and a journal cursor. It does not copy
the immutable payloads or replay gameplay. Full original imported logical state
remains recoverable after later commands and retirement; exact source text/hash
is retained separately for device recovery. Missing pre-adoption events remain
unknown. Version 1's preexisting reconstructed review projections stay marked
as such, and historical import question-count credit remains zero.

The opt-in command wrapper observes facts before retirement/trimming and records
actual before/after finance, exact integer-cent deltas and command identities.
It does not fabricate itemized transactions that the runtime never exposed.
Hydration reconciles the finance chain, complete card/review projections and
immutable pins. It preserves all existing game state, clinical review status,
concept IDs, frozen choice order, money, seed/RNG inputs/counters and operational
timing. Existing serializers/deserializers remain untouched; observed/ordinary
command outputs are compared byte-for-byte, including 65 simulated minutes, a
real scored answer and final/cancelled inspections. The ordinary reducer path
does not install a capture scope.

A future cloud coordinator must route all cloud commands through this opt-in
boundary and commit snapshot plus appended facts atomically. Existing local
callers are unchanged. The codec sends only new rows after an acknowledged
high-water mark and an immutable header hash. Prior snapshots share the same
archive and load only their exact prefix. Format 1 remains compatibility-only.

### Verified compression and updated capacity table

All figures are **decimal UTF-8/binary bytes**, measured with Node's native
CompressionStream/DecompressionStream implementations. No dependency was
installed. Both gzip and deflate outputs are immediately decompressed and
checked against SHA-256 of the **uncompressed canonical bytes**. Compressed
byte identity is not assumed portable across browsers. Decoded sizes and hashes
are verified before JSON parsing, with bounded per-value/aggregate decoding and
bounded reference expansion.

The following supersedes B2.1's duplicated baseline layout for new format 2
work. Evidence raw includes header and immutable record payload metadata; the
whole-archive raw JSON differs slightly because of its container. Page costs
include the immutable header once and every sealed page once. Wire body is the
implemented gzip row protocol, including base64 and JSON metadata.

| Fixture | Snapshot raw / gzip | Evidence raw | Gzip rows | Gzip sealed pages | Deflate sealed pages | Gzip row-transport body |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| level-four-legacy-pre-m3.json | 4,813 / 1,384 | 108,067 | 19,683 | 18,604 | 18,580 | 31,179 |
| level-five-economy-checkpoint-20261012.json | 30,082 / 3,517 | 1,637,098 | 676,435 | 164,524 | 164,308 | 1,362,471 |
| integration-l4 | 13,063 / 2,102 | 854,362 | 318,733 | 85,723 | 85,615 | 635,555 |
| integration-build | 12,959 / 2,056 | 863,103 | 318,515 | 86,434 | 86,326 | 635,202 |
| integration-preparing | 17,377 / 2,845 | 1,460,018 | 585,625 | 143,159 | 142,967 | 1,158,292 |
| integration-running | 17,850 / 2,682 | 1,536,926 | 600,377 | 151,152 | 150,948 | 1,184,530 |
| integration-final | 23,153 / 3,036 | 1,688,925 | 672,083 | 167,158 | 166,942 | 1,324,486 |
| integration-finish | 23,151 / 3,038 | 1,609,025 | 649,362 | 157,013 | 156,797 | 1,281,690 |
| integration-repeat-final | 788 / 494 | 1,851,315 | 754,764 | 185,013 | 184,761 | 1,483,045 |
| integration-repeat | 788 / 493 | 1,770,160 | 731,711 | 174,605 | 174,353 | 1,439,612 |
| integration-lower-repeat | 124,923 / 10,680 | 1,998,490 | 804,888 | 195,238 | 194,962 | 1,590,918 |

All 11 initial snapshots satisfy the 2 MB target and 3 MB ceiling; reconstructed
games remain below the 3 MB decoded-game ceiling and actual row-transport bodies
below 6 MB. **Raw evidence still exceeds the 1 MB/campaign allowance in eight
fixtures.** Individual gzip rows fit all 11 imported checkpoints, with a maximum
of **804,888 bytes**. The largest initial sealed gzip-page evidence set is
**195,238 bytes**. Whole-archive gzip reaches **178,656 bytes** at that checkpoint,
but is not mislabeled as the cost of separately stored rows.

Continuation from `integration-lower-repeat` runs **360 additional facility
minutes = six simulated facility hours**, not six wall-clock player hours.
No answers or history were replayed, no accepted row was edited/dropped and the
original import remained fully recoverable:

| Continued-play quantity | Bytes / count |
| --- | ---: |
| Reconstructed full game | 1,856,608 |
| Operational snapshot raw / gzip | 311,075 / 30,255 |
| Complete immutable evidence raw | 2,478,063 |
| Individual gzip rows + header | **1,071,025** |
| Sealed gzip pages + header | **252,915** |
| Immutable facts / sealed pages | 3,511 / 34 |
| New facts / new individual-row gzip bytes | 930 / 266,137 |
| Actual acknowledged row save body | 577,541 |

**Capacity failure preserved:** individual-row gzip exceeds the starting
1 MB/campaign evidence allowance after this continuation; two equivalent
campaigns exceed the 2 MB/account evidence budget. Sealed pages pass the same
payload-byte allowance. Growth seals six successive batches of 60 commands,
retains each previously accepted partial page unchanged and round-trips every
row exactly once. No compression or quota claim relies on deleting history.

### Storage recommendation and remaining gates

Recommend **immutable sealed gzip pages in bytea**, with normalized owned
identity/index metadata and a bounded trusted inflater/validator, rather than
assuming individual gzip-row sizes equal whole-file gzip sizes. Operational
snapshots can also use the agreed bytea/canonical-byte contract if that route is
accepted. The new page utility evaluates the physical candidate; it is not an
applied schema or a different live transport.

A JSONB + server TOAST/lz4 alternative makes direct SQL validation/querying
simpler. Verify actual lz4 availability/settings and physical results; short
rows may not compress and gzip bytes must not be credited for another assumed
TOAST saving. Format 2 bytea loads require the agreed canonical text/base64
contract. A JSONB alternative needs the separate server-canonical text/hash
contract or an explicitly versioned adapter; JSONB text is not the same bytes
as JS canonical text. Core TOAST does not provide a tested client-gzip
inflation/validation RPC by itself.

For perspective only, using the largest observed continued-play gzip snapshot
and page set for all 30 accounts, two campaigns each, current + prior snapshots:

- Payload plus the inherited 50 MB shared allowance =
  `30 * (4 * 30,255 + 2 * 252,915) + 50,000,000` =
  **68,805,500 bytes (68.806 MB)**.
- Budgeting snapshots at their raw 311,075 bytes instead, without assuming
  TOAST savings, gives **102,503,900 bytes (102.504 MB)**.

These are payload/planning calculations, **not measured PostgreSQL capacity or
a rollout PASS**. The 500 MB provider limit, 400 MB working ceiling, 8 MB retained
snapshots/account, 2 MB evidence/account and two campaigns/account remain
unchanged. Actual tuple/FK/index/TOAST/dead-row costs, Auth/other application
data, transient reservations, backups and real ingress/egress remain B2.2/B2.5
gates. All metadata/history must be charged; an uncounted side table is not a
capacity fix. History remains unbounded, so even pages require warnings and a
safe pause at a tested limit. The 6 MB decoded processing bound is separate
from physical compressed-storage accounting.

B2.2 must provide bounded trusted decompression before structural/invariant
validation, hash checking, ownership/RLS and atomic writes. Client hash success
alone is insufficient. It must also complete the actual request contract with
writer generation/token, lifecycle and any eligible usage arguments and hash
every material RPC argument. The five SQL golden vectors have **not** been
executed on PostgreSQL; the manager's disposable SQL run remains required.
No real browser/Safari/phone, hosted ingress, physical database or rollback/
backup acceptance is claimed by these Node codec tests.

### Exact recorded-input changes; no evidence rebind

| Existing recorded input | Before | After |
| --- | --- | --- |
| packages/game-domain/src/index.ts | `3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b` | `1389c04a3c49479ce6d0bdea427a290d791f437b62f9d271856517e0e0d4e879` |
| packages/game-domain/src/reducer.ts | `daf3be68ec8134205113fc7be6136b5a0fdcf7b3d93149a9ffeab83c7599d1f6` | `d4424125c52ba7f9a494f221b7c2933bcdace971ff3d34f22380f77bc3f6f19e` |

These are the **only existing recorded domain inputs changed**. The full suite's
binding assertion stops at `index.ts`; the independent source audit also
identifies `reducer.ts`. The manager must review the additive observations and
exports, include the new modules in the next binding and rebind/rerun the Level
5 evidence through its authorized lane. No test, recorded hash or evidence
artifact was weakened or rebound by this worker.

### Final validation and exact output

Existing dependencies, the approved absolute preload, no Git/install/network:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

- Player focused: **145 passed in 5 files, exit 0**.
- Full game-domain: **4,291 passed / 1 failed, 159 passed files / 1 failed file,
  exit 1**. The sole failure is the permitted Level 5 recorded-input binding
  assertion for the changed `index.ts` SHA-256. All 21 new domain tests pass.
- All **seven workspace typechecks pass, exit 0**.
- Scoped source/JSON/SQL/docs are UTF-8 without BOM and LF-only. The existing
  reducer/index edits were audited against their starting byte hashes.
- No Git, installs, network, Supabase, browser/owner storage, external messages,
  agents, publication or deployment. Local-only checkpoint; manager owns the
  current-thread handoff, acceptance, input rebind, physical-capacity gates and
  the **"push to GitHub"** backup reminder.

Player stdout/stderr (exit 0; includes retained format 1 receipts and new
format 2 row/page/continuation receipts):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/session/cloud


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

B2.1 MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileBytes":194747,"fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedStateBytes":133840,"snapshotBytes":134401,"baselineEvidenceBytes":131353,"transportBytes":292907,"reorderedSnapshotBytes":145846,"reorderedEvidenceBytes":142518,"withinTarget":true,"capacityFailures":[],"migrationFields":["emergencyGlp1","employees","environment","learningHistories","nextExternalRetailOpportunityTick","nextServiceIncomeReceiptSequence"]}
B2.1b MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedGameBytes":133840,"snapshotRawBytes":4813,"snapshotStoredBytes":1384,"evidenceRawBytes":108067,"evidenceStoredBytes":19683,"evidenceArchiveRawBytes":107950,"rawJsonBodyBytes":124163,"transportBodyBytes":31179,"immutableRecords":13,"newEvidenceUploadRows":13,"newEvidenceUploadBytes":19683,"deflateSnapshotBytes":1372,"deflateEvidenceRowsBytes":19515,"deflateTransportBodyBytes":30979,"aggregateEvidenceGzipBytes":18366,"aggregateEvidenceDeflateBytes":18354,"gzipPagesEvidenceBytes":18604,"deflatePagesEvidenceBytes":18580,"immutablePages":1,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileBytes":1429975,"fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedStateBytes":1430026,"snapshotBytes":1430586,"baselineEvidenceBytes":1430455,"transportBytes":3141559,"reorderedSnapshotBytes":1524512,"reorderedEvidenceBytes":1524361,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedStateBytes":795266,"snapshotBytes":795838,"baselineEvidenceBytes":795706,"transportBytes":1761597,"reorderedSnapshotBytes":855598,"reorderedEvidenceBytes":855446,"withinTarget":true,"capacityFailures":[],"migrationFields":["encounters","retailOperations"]}
B2.1 MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedStateBytes":804007,"snapshotBytes":804579,"baselineEvidenceBytes":804447,"transportBytes":1782494,"reorderedSnapshotBytes":865769,"reorderedEvidenceBytes":865617,"withinTarget":true,"capacityFailures":[],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedStateBytes":1323109,"snapshotBytes":1323681,"baselineEvidenceBytes":1323550,"transportBytes":2910759,"reorderedSnapshotBytes":1412663,"reorderedEvidenceBytes":1412512,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1b MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedGameBytes":1430026,"snapshotRawBytes":30082,"snapshotStoredBytes":3517,"evidenceRawBytes":1637098,"evidenceStoredBytes":676435,"evidenceArchiveRawBytes":1639303,"rawJsonBodyBytes":1863965,"transportBodyBytes":1362471,"immutableRecords":2336,"newEvidenceUploadRows":2336,"newEvidenceUploadBytes":676435,"deflateSnapshotBytes":3505,"deflateEvidenceRowsBytes":648391,"deflateTransportBodyBytes":1332056,"aggregateEvidenceGzipBytes":156098,"aggregateEvidenceDeflateBytes":156086,"gzipPagesEvidenceBytes":164524,"deflatePagesEvidenceBytes":164308,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedStateBytes":1397257,"snapshotBytes":1397829,"baselineEvidenceBytes":1397724,"transportBytes":3075145,"reorderedSnapshotBytes":1493023,"reorderedEvidenceBytes":1492900,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedStateBytes":1527627,"snapshotBytes":1528199,"baselineEvidenceBytes":1528094,"transportBytes":3356999,"reorderedSnapshotBytes":1629920,"reorderedEvidenceBytes":1629797,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1b MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedGameBytes":795266,"snapshotRawBytes":13063,"snapshotStoredBytes":2102,"evidenceRawBytes":854362,"evidenceStoredBytes":318733,"evidenceArchiveRawBytes":855299,"rawJsonBodyBytes":974112,"transportBodyBytes":635555,"immutableRecords":1067,"newEvidenceUploadRows":1067,"newEvidenceUploadBytes":318733,"deflateSnapshotBytes":2090,"deflateEvidenceRowsBytes":305917,"deflateTransportBodyBytes":621643,"aggregateEvidenceGzipBytes":80456,"aggregateEvidenceDeflateBytes":80444,"gzipPagesEvidenceBytes":85723,"deflatePagesEvidenceBytes":85615,"immutablePages":8,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedStateBytes":1513510,"snapshotBytes":1514082,"baselineEvidenceBytes":1513977,"transportBytes":3321258,"reorderedSnapshotBytes":1612683,"reorderedEvidenceBytes":1612560,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedStateBytes":1724322,"snapshotBytes":1724894,"baselineEvidenceBytes":1724815,"transportBytes":3774644,"reorderedSnapshotBytes":1833631,"reorderedEvidenceBytes":1833536,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1b MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedGameBytes":804007,"snapshotRawBytes":12959,"snapshotStoredBytes":2056,"evidenceRawBytes":863103,"evidenceStoredBytes":318515,"evidenceArchiveRawBytes":864040,"rawJsonBodyBytes":984446,"transportBodyBytes":635202,"immutableRecords":1067,"newEvidenceUploadRows":1067,"newEvidenceUploadBytes":318515,"deflateSnapshotBytes":2044,"deflateEvidenceRowsBytes":305699,"deflateTransportBodyBytes":621290,"aggregateEvidenceGzipBytes":81128,"aggregateEvidenceDeflateBytes":81116,"gzipPagesEvidenceBytes":86434,"deflatePagesEvidenceBytes":86326,"immutablePages":8,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedStateBytes":1625220,"snapshotBytes":1625792,"baselineEvidenceBytes":1625713,"transportBytes":3558810,"reorderedSnapshotBytes":1728545,"reorderedEvidenceBytes":1728450,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedStateBytes":1828398,"snapshotBytes":1828970,"baselineEvidenceBytes":1828965,"transportBytes":4003116,"reorderedSnapshotBytes":1945481,"reorderedEvidenceBytes":1945462,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations","serviceOperations"]}
B2.1b MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedGameBytes":1323109,"snapshotRawBytes":17377,"snapshotStoredBytes":2845,"evidenceRawBytes":1460018,"evidenceStoredBytes":585625,"evidenceArchiveRawBytes":1461803,"rawJsonBodyBytes":1650790,"transportBodyBytes":1158292,"immutableRecords":1916,"newEvidenceUploadRows":1916,"newEvidenceUploadBytes":585625,"deflateSnapshotBytes":2833,"deflateEvidenceRowsBytes":562621,"deflateTransportBodyBytes":1133332,"aggregateEvidenceGzipBytes":134184,"aggregateEvidenceDeflateBytes":134172,"gzipPagesEvidenceBytes":143159,"deflatePagesEvidenceBytes":142967,"immutablePages":15,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedGameBytes":1397257,"snapshotRawBytes":17850,"snapshotStoredBytes":2682,"evidenceRawBytes":1536926,"evidenceStoredBytes":600377,"evidenceArchiveRawBytes":1538746,"rawJsonBodyBytes":1736874,"transportBodyBytes":1184530,"immutableRecords":1951,"newEvidenceUploadRows":1951,"newEvidenceUploadBytes":600377,"deflateSnapshotBytes":2670,"deflateEvidenceRowsBytes":576953,"deflateTransportBodyBytes":1159111,"aggregateEvidenceGzipBytes":141020,"aggregateEvidenceDeflateBytes":141008,"gzipPagesEvidenceBytes":151152,"deflatePagesEvidenceBytes":150948,"immutablePages":16,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedGameBytes":1527627,"snapshotRawBytes":23153,"snapshotStoredBytes":3036,"evidenceRawBytes":1688925,"evidenceStoredBytes":672083,"evidenceArchiveRawBytes":1690970,"rawJsonBodyBytes":1910545,"transportBodyBytes":1324486,"immutableRecords":2176,"newEvidenceUploadRows":2176,"newEvidenceUploadBytes":672083,"deflateSnapshotBytes":3024,"deflateEvidenceRowsBytes":645959,"deflateTransportBodyBytes":1296146,"aggregateEvidenceGzipBytes":156802,"aggregateEvidenceDeflateBytes":156790,"gzipPagesEvidenceBytes":167158,"deflatePagesEvidenceBytes":166942,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedGameBytes":1513510,"snapshotRawBytes":23151,"snapshotStoredBytes":3038,"evidenceRawBytes":1609025,"evidenceStoredBytes":649362,"evidenceArchiveRawBytes":1611006,"rawJsonBodyBytes":1821994,"transportBodyBytes":1281690,"immutableRecords":2112,"newEvidenceUploadRows":2112,"newEvidenceUploadBytes":649362,"deflateSnapshotBytes":3026,"deflateEvidenceRowsBytes":624006,"deflateTransportBodyBytes":1254182,"aggregateEvidenceGzipBytes":146355,"aggregateEvidenceDeflateBytes":146343,"gzipPagesEvidenceBytes":157013,"deflatePagesEvidenceBytes":156797,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedGameBytes":1724322,"snapshotRawBytes":788,"snapshotStoredBytes":494,"evidenceRawBytes":1851315,"evidenceStoredBytes":754764,"evidenceArchiveRawBytes":1853624,"rawJsonBodyBytes":2062103,"transportBodyBytes":1483045,"immutableRecords":2440,"newEvidenceUploadRows":2440,"newEvidenceUploadBytes":754764,"deflateSnapshotBytes":482,"deflateEvidenceRowsBytes":725472,"deflateTransportBodyBytes":1451271,"aggregateEvidenceGzipBytes":173762,"aggregateEvidenceDeflateBytes":173750,"gzipPagesEvidenceBytes":185013,"deflatePagesEvidenceBytes":184761,"immutablePages":20,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedGameBytes":1625220,"snapshotRawBytes":788,"snapshotStoredBytes":493,"evidenceRawBytes":1770160,"evidenceStoredBytes":731711,"evidenceArchiveRawBytes":1772404,"rawJsonBodyBytes":1972157,"transportBodyBytes":1439612,"immutableRecords":2375,"newEvidenceUploadRows":2375,"newEvidenceUploadBytes":731711,"deflateSnapshotBytes":481,"deflateEvidenceRowsBytes":703199,"deflateTransportBodyBytes":1408683,"aggregateEvidenceGzipBytes":160240,"aggregateEvidenceDeflateBytes":160228,"gzipPagesEvidenceBytes":174605,"deflatePagesEvidenceBytes":174353,"immutablePages":20,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedGameBytes":1828398,"snapshotRawBytes":124923,"snapshotStoredBytes":10680,"evidenceRawBytes":1998490,"evidenceStoredBytes":804888,"evidenceArchiveRawBytes":2000940,"rawJsonBodyBytes":2366004,"transportBodyBytes":1590918,"immutableRecords":2581,"newEvidenceUploadRows":2581,"newEvidenceUploadBytes":804888,"deflateSnapshotBytes":10668,"deflateEvidenceRowsBytes":773904,"deflateTransportBodyBytes":1557304,"aggregateEvidenceGzipBytes":178656,"aggregateEvidenceDeflateBytes":178644,"gzipPagesEvidenceBytes":195238,"deflatePagesEvidenceBytes":194962,"immutablePages":22,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b GROWTH {"fixture":"integration-lower-repeat","additionalFacilityMinutes":360,"initialEvidenceBytes":804888,"decodedGameBytes":1856608,"snapshotRawBytes":311075,"snapshotStoredBytes":30255,"evidenceRawBytes":2478063,"evidenceStoredBytes":1071025,"evidenceArchiveRawBytes":2481443,"rawJsonBodyBytes":893820,"transportBodyBytes":577541,"immutableRecords":3511,"newEvidenceUploadRows":930,"newEvidenceUploadBytes":266137,"gzipPagesEvidenceBytes":252915,"immutablePages":34,"sealedUploadBatches":6,"compressedCapacityFailures":["evidence-allowance"],"rawCapacityFailures":["evidence-allowance"]}

 Test Files  5 passed (5)
      Tests  145 passed (145)
   Start at  12:09:47
   Duration  99.18s (transform 4.18s, setup 0ms, import 5.89s, tests 110.75s, environment 0ms)
```

Full game-domain stdout/stderr (exit 1, permitted binding failure only):

```text

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 272285ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 27ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/game-domain/src/index.ts: expected '1389c04a3c49479ce6d0bdea427a290d791f4…' to be '3045ff30cb0cf9701d6220ac506135db811a2…' // Object.is equality

Expected: "3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b"
Received: "1389c04a3c49479ce6d0bdea427a290d791f437b62f9d271856517e0e0d4e879"

 ❯ tests/level-five-integration.test.ts:47:71
     45|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     46|       }
     47|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     48|     }
     49|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 159 passed (160)
      Tests  1 failed | 4291 passed (4292)
   Start at  12:03:52
   Duration  977.00s (transform 4.15s, setup 0ms, import 67.31s, tests 898.68s, environment 8ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

Workspace typecheck stdout/stderr (exit 0):

```text

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```


## Owner decision (2026-10-17): test database

Owner chose **"Test on the live project"** (over a local PostgreSQL install or pausing the ergonomics project). Manager rules: the B2.2 schema is additive and unused until the client is enabled; SQL validation uses rollback-only synthetic tests in the established Beta 1 style (simulated roles/JWT claims inside a transaction, PASS row at the end), run in the live project's SQL editor by the manager or owner; no synthetic data persists. Two-session concurrency is proven by (a) lock/generation logic tested in rollback-only scripts and (b) the B2.6 owner desktop -> phone -> desktop trial. The migration is reviewed before it is applied. B2.1b accepted 2026-10-17 (reducer.ts change = three read-only no-op observer hooks); the Level 5 evidence rebind is deferred to the next publish.

## B2.2 handoff (2026-10-17)

Worker: GPT-6.1 Sol, transactional SQL lane. **Implementation prepared and
source-reviewed; no SQL was executed and no database PASS is claimed.** The
binding live-game-project test decision immediately above governs the manager's
validation. This handoff does not enable cloud play or accept B2.2/B2.5/B2.6.

Files changed, only in the assigned lane:

- `supabase/migrations/20261018000100_beta2_cloud_saves.sql`: new additive,
  transactional migration; eleven tables, RLS on each, nine public INVOKER
  wrappers, private validated DEFINER RPCs, explicit EXECUTE ACLs, no direct
  player/service table grants and no anon access. Both project flags and account
  capabilities default off. Pure SQL/PLpgSQL, no new extension dependency.
- `supabase/tests/beta2_cloud_saves.sql`: one `BEGIN ... ROLLBACK` synthetic
  suite, actual roles/claims, one final PASS row only after all assertions.
- `supabase/tests/README.md`: exact SQL Editor procedure, expected output,
  pending acceptance gates and historical Beta 1 instructions retained.
- This append-only handoff. No other plan text or source lane was changed.

No Git commands, installs, network, database/browser access, agents, external
messages, commits, push, deployment or publication were used. The concurrent
B2.3 session lane was read for its codec contract only and was not edited.
No clinical material, approval, FSRS meaning, frozen content, game balance,
launcher, browser origin or owner save was changed. Work is local only; the
manager owns acceptance, the current-thread handoff and the GitHub checkpoint
reminder under the existing rules.

### Storage and transaction result

`public.beta2_campaigns` owns summaries, monotonic bigint revision/generation,
stable string IDs, normalized unique names, journal head and import provenance.
Owned composite FKs cover compressed snapshots, immutable headers and immutable
sealed evidence pages. Private tables own account capability/quota, versioned
consent, writer hashes/expiry, immutable operation receipts, bounded rate buckets,
the project reservation and the protected deletion ledger. These objects are
separate from Beta 1 usage/report roles; an AAL2 count-report owner gains no
other player's campaign access. `gamify_private` must remain unexposed.

The selected B2.1b storage route is **sealed gzip bytea pages plus a gzip bytea
operational snapshot/header**. The decoder is a private, bounded PLpgSQL RFC
1951/1952 implementation: stored/fixed/dynamic blocks, checked distances,
CRC-32/ISIZE, no concatenated members, and a hard actual-output bound independent
of the client-declared size. Protocol 3 accepts single-member browser gzip with
FLG=0; optional gzip headers and deflate transport are rejected. Parsed JSON is
walked before JSONB key collapse, checks duplicate keys, size/depth/nodes and
safe numbers, and must match the codec's sorted UTF-16-key canonical bytes.
Hashes cover **uncompressed canonical UTF-8**; accepted compressed bytes are
stored once and returned in base64. Compressed byte identity is not assumed
portable between clients. The SQL test embeds independently generated Node
zlib fixed/dynamic vectors as well as standard CRC and malformed-size cases.

Server validation reconstructs the complete evidence prefix and current
projection, checks stable IDs/kinds/ownership, backwards-only fact references,
duplicate facts, patch parents/paths, immutable pins and the archive manifest.
Its 79-key game-field allowlist matches `CLOUD_GAME_FIELD_OWNERSHIP` exactly;
profile/outbox/Auth keys cannot ride along as extra top-level game fields.
It reconciles the finance journal and card/review projection back to the opening
baseline, rejects a journal rewind/branch and limits reconstructed game text to
3 MB. This is structural/basic-invariant validation of browser-computed state,
not a server game engine, anti-cheat proof or clinician approval. Original local
file SHA/byte provenance is a client declaration: exact original recovery bytes
remain on the device, so SQL cannot independently prove their pre-migration
file hash. It does prove the received canonical storage bytes and invariants.

Lock order is membership -> account -> global quota -> campaign -> writer.
This reuses Beta 1 revocation/deletion authority without requiring usage consent.
Fresh Auth admission accepts provider invitations or the trusted setup marker,
never user metadata. Revision and generation/token are checked under locks.
Lease acquisition/explicit takeover advances generation, renew/release require
the exact generation/token, and expiry uses wall time after locks. Saves recheck
expiry after validation and immediately before snapshot acceptance. No state is
merged and no client chooses the next revision. The global lock serializes
cross-account reservations; purge skips locked memberships/accounts to avoid
waiting behind a writer while retaining that global lock.

Snapshot, newly sealed pages, eligible already-issued question receipts through
the existing Beta 1 deduplication path, quota reservation, pointer advancement
and receipt are one transaction. Imports cannot submit usage receipts. Current
and one server-validated prior snapshot remain; older snapshot bytes are pruned
only within successful replacement transactions. Prior loads return only their
own complete sealed-page prefix. No accepted evidence/header can be edited,
extended in place, dropped or purged while its campaign exists.

### RPC/transport contract for B2.3/B2.4 integration

**The new server adapter is protocol 3**, cloud envelope format 2 / evidence
contract 1. B2.1b's protocol 2 individual-row request is not directly accepted:
it lacks fencing/lifecycle/usage arguments and uses a different physical
transport. The codec files were not changed to disguise that distinction.
The manager must hand this contract to B2.3/B2.4 before transport integration.

All player calls go through the corresponding `public` functions:

| Function | Arguments / result |
| --- | --- |
| `beta2_cloud_access` | `p_protocol = 3`; capability, gates, notice and quota. Does not imply notice acceptance or enrollment. |
| `beta2_accept_cloud_notice` | `p_protocol = 3`, `p_version = 'beta2.cloud.v1'`; separate from `beta1.usage.v1`. Publish the reviewed notice before using this. |
| `beta2_cloud_list` | `p_protocol = 3`; small own summaries, decimal-string revision/generation, active lease/expiry, quota and server time. Opening a list never takes a lease. |
| `beta2_cloud_load` | `p_protocol`, `p_campaign_id`, nullable `p_revision`; packed snapshot/header/pages for current or retained prior. Decode/verify/hydrate before playing. |
| `beta2_cloud_lease` | `p_protocol`, `p_campaign_id`, `p_action` (`acquire`, `takeover`, `renew`, `release`), decimal-string `p_expected_revision`, decimal-string `p_writer_generation`, `p_writer_token` (64 lowercase random hex characters). Client mints/retains the unpredictable token; only its SHA-256 is stored. Returns accepted revision/generation, server time and expiry/release receipt; never echoes the token. |
| `beta2_cloud_write` | Exactly `p_request_text`, `p_request_sha256`; details below. Returns a small immutable receipt. |
| `beta2_cloud_operation` | `p_protocol`, `p_operation_id`; own `accepted` receipt or explicit `unknown`. Unknown is not permission to replay expired work. |
| `beta2_delete_my_data` | `p_scope = 'all-account-data.v1'`, `p_notice_version = 'beta2.cloud.v1'`; only after the new full-data confirmation. Does not require an unexpired writer, enabled capability or live membership admission. |

The write text contains exactly these fields:

```text
protocolVersion: 3
action: "import" | "save"
operationId: nonempty string, <=256 UTF-8 bytes
issuedAt: immutable ISO timestamp with timezone, within 7 days / +1 minute
expectedRevision: decimal bigint string ("0" for import)
writerGeneration: decimal bigint string ("0" for import)
writerToken: 64 lowercase random hex characters
campaignId: stable string, <=256 UTF-8 bytes
snapshot: CloudCompressedText from the format 2 envelope, encoding "gzip"
evidence: import {header, fromRecord:0, toRecord, pages}
          save   {headerSha256, fromRecord, toRecord, pages}
usageReceipts: [] for import; optional already-issued opaque question receipts
```

`pages` use the existing `CloudEvidencePage` shape (`firstRecord`, `recordCount`,
`content`). Pack only new canonical record texts, starting exactly at the last
accepted high-water. Even an accepted partial page is permanently sealed.
`snapshot` includes all campaign metadata, so rename/archive/restore use the
same fenced write. Restart creates another baseline/campaign and retains its
archive/slot; there is no destructive campaign-removal shortcut.

SHA-256 is over the **exact full `p_request_text` UTF-8**, including every token,
generation, lifecycle field, timestamp, evidence and usage argument. Freeze both
RPC arguments for retries; do not regenerate issuedAt, recompress bytes or reuse
an in-flight ID for a changed request. The same ID/hash returns its original
receipt even after takeover, subject to current admission/notice/capability.
The read-only outcome RPC remains usable when writes are disabled. Ordinary
receipts remain for eight days (longer than the immutable seven-day request
window); import receipts/provenance remain for the campaign's life.

An import creates revision 1/generation 1 and a 60-second lease for its token.
Refetch/verify before enabling commands and use the returned/current revision
when acquiring. Identical acquire/takeover retries preserve their original
expiry; they do not extend lease time. A changed takeover generation is a
conflict, requiring a fresh check and explicit decision. Save receipts contain
`operationId`, `requestSha256`, decimal `revision` / `writerGeneration`, snapshot
SHA/decoded/stored bytes, evidence high-water and server `acceptedAt`.

Expected SQLSTATE categories: `42501` access/notice/unavailable owned campaign;
`22023` invalid/unsupported bytes/protocol/identity; `40001` stale revision;
`55000` fenced/expired writer or server write gate; `54000` capacity; `P0001`
throttle with a JSON `DETAIL.retryAfterSeconds`. Conflict recovery must preserve
pending bytes and refetch; do not reinterpret these as a fresh empty campaign.

### Quotas, deletion and existing-object changes

Two cloud campaigns per account include archives. Snapshot ceiling is 3 MB;
snapshot plus account/campaign/rate/lease/receipt allowances share the 8 MB
account budget. Immutable header/page payload and per-page row/index allowances
share 1 MB/campaign and 2 MB/account. Binary allocations reserve payload + 12.5%
and 2 KiB/row; receipt composite size plus 1 KiB is charged separately. Fixed
account/rate/notice overhead is 8 KiB, campaign/writer overhead 4 KiB, and active
deletion-ledger rows reserve 1 KiB globally. Thus compression is not credited
while moving metadata into an uncounted table. Byte allowances are conservative
engineering reservations, not measured physical costs or a guarantee that the
measured fixture plus all future receipt/history overhead fits.

Processing bound is 6 MB including snapshot/header/all required decoded pages;
new decoded save evidence is capped at 1 MB. The 6 MB request check includes the
actual two-argument JSON wrapper/escaping; it cannot stop HTTP parsing before
PostgREST receives the body. Server rate windows permit 30 successful mutation/
lease calls including identical retries, 12 account / 6 campaign new checkpoints,
6 full loads and 120 metadata reads per 60-second server window. Failed RPCs
roll back their rate increments; ingress abuse limits remain a hosted gate.

Account warnings start at 80%; owner inspection warns at 300 MB actual database
size. Every new save reserves transient third-copy/evidence/index headroom and
cleanup margin against the 400 MB working ceiling. Deleted tuple estimates are
retained in the global reservation. The service-only `beta2_admin_cloud` supports
`inspect`, `configure`, `account`, `purge`, `acknowledge_cleanup`; the last requires
`{"vacuumVerified":true}` after the owner actually verifies cleanup outside a
transaction. It is an explicit operational attestation, not automatic proof of
space reclamation. Routine owner inspection returns aggregate counts/sizes,
not campaign contents. No player can enable capability or change limits.

Exactly two **existing Beta 1 objects** are replaced, with their signatures,
public wrapper/grants and existing Cron target preserved:

1. `gamify_private.request_usage_data_deletion()`: cloud-enrolled accounts get
   update-required `55000`, without deletion. Non-enrolled Beta 1 accounts retain
   the existing usage/flag/feedback deletion behavior and membership blocker.
2. `gamify_private.purge_beta1_retained_data()`: every existing Beta 1 retention
   statement remains; a new private cloud-purge call is added. Active campaigns,
   archived campaigns, current/prior snapshots, immutable evidence and live
   import receipts never inherit the 90-day usage retention rule.

The new full-data endpoint blocks membership, fences writers, removes cloud
account/consent/campaign/snapshot/page/operation/rate/quota state plus existing
usage/flags/feedback, and retains a minimal SHA-256-of-Auth-UUID ledger for 30
days, beyond the owner's 14-day backup retention. Auth cascades also record this
ledger and reconcile reservations. No email or payload enters it. Current
deletion records must be reconciled when restoring a backup; the ledger alone
inside an older backup cannot prove later deletions. Auth/invitation/private
export cleanup remains the owner's seven-day task. Setup-code cleanup stays out
of this transaction to avoid reversing the existing email -> membership lock
order; setup finalization cannot override the protected membership tombstone.

### Manual two-session lock/generation procedure (two SQL Editor tabs)

Use the **live game project**, role **postgres**, after reviewed migration
application; do not use real tester UUIDs or persist synthetic seeds. Complete
queries keep transaction/backend affinity even if the editor pools connections.

1. In tab A, run this whole query. While it sleeps, start tab B:

   ```sql
   begin;
   set local statement_timeout = '30s';
   select singleton from gamify_private.beta2_cloud_quota where singleton for update;
   select pg_sleep(20);
   rollback;
   ```

2. In tab B, run this whole query during A's sleep:

   ```sql
   begin;
   set local lock_timeout = '3s';
   do $lock_probe$
   begin
     begin
       perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
       raise exception 'Expected lock contention was absent; repeat while tab A sleeps';
     exception when lock_not_available then
       raise notice 'Expected shared quota lock contention observed; rollback follows';
     end;
   end;
   $lock_probe$;
   rollback;
   ```

   Expect the notice after about three seconds and successful rollback. A missing
   contention error means the runs did not overlap; repeat. No quota value or
   tester data is modified. On any unexpected error, issue `ROLLBACK;` in that
   connection before continuing.

3. After A finishes, tab B runs the **complete** `beta2_cloud_saves.sql` from the
   README. Its generation checks prove takeover from 1 -> 2 without a new save,
   denial of the displaced token's save/renew/release and stale takeover,
   expiry/reacquisition to 3, immutable receipt retry, monotonic revision and
   prior-prefix retention. Capture its real final PASS row, not this recipe.

Uncommitted synthetic campaigns are invisible to the other editor session.
This procedure proves the shared reservation lock and the rollback suite proves
generation outcomes; it does **not** claim a concurrently committed shared-
campaign save/takeover race. Under the binding owner decision, actual same-
campaign device contention is the B2.6 desktop -> phone -> desktop trial. No
temporary committed synthetic campaign is required or authorized by this recipe.

### Validation and next action

Offline source checks verify UTF-8 without BOM, LF-only lines, final newlines,
balanced SQL lexical delimiters, eleven RLS-enabled/revoked tables, nine paired
wrapper/body signatures and matching explicit grants, exactly the two intended
Beta 1 replacements, rollback termination and a single final test result SELECT.
Independent fixed/dynamic gzip fixture bytes were generated using existing Node
zlib; no SQL interpreter/parser, PostgreSQL, psql, Supabase CLI or database was
used. These are source checks and prepared assertions, not a database execution.

Recorded offline checks (existing Node, inline scripts; each final exit **0**):

```text
STATIC CHECKS OK: 11 tables; 9 paired RPCs/grants; 2 Beta 1 replacements; balanced SQL delimiters; rollback-only single PASS SELECT; documentation fences; assignment declarations. SQL NOT EXECUTED.
FIELD CONTRACT OK: 79 server allowlist keys exactly match codec top-level ownership properties.
GZIP FIXTURES OK: 2 independently decoded Node vectors (fixed and dynamic), exact lengths/SHA-256. SQL NOT EXECUTED.
```

Manager next action: inspect the actual files, review the custom decoder and
byte/lock contract, apply the additive migration through the approved route,
run the full new rollback suite and five golden SQL vectors, and record actual
output. The historical Beta 1 usage/feedback suites include global assertions
that assume an otherwise empty disposable DB; manager live regression copies
must filter those assertions to the synthetic UUIDs while retaining their
expected values and permission checks. Historical test files remain unchanged.
All four Beta 1 regressions remain acceptance gates. Then prove real Data API grants, browser gzip
and byte contracts, ingress maximum, decoder latency comfortably below lease
expiry, 30-account physical/metadata/dead-row capacity, retention Cron, and
deletion-aware backup restore before enabling capability. Do not claim rollout
readiness from static review. The B2.3 handoff appended below reports reading
this migration and implementing the protocol 3 adapter. Manager review should
compare its actual arguments/receipts with this final SQL contract. This worker
did not send external messages or modify the B2.3 lane.

## B2.3 handoff (2026-10-17)

Worker: GPT-6.1 Sol, shared cache/coordinator lane. **Delivered for manager
review; cloud mode remains OFF by default.** This is client/offline protocol
validation, not hosted SQL, browser/phone, capacity or rollout acceptance.
The full plan, binding owner decisions, B2.1/B2.1b handoffs and the concurrent
B2.2 migration/handoff were read. No agents were spawned.

### Changed files and boundaries

New under `apps/player/src/session/cloud/`:

- `transport.ts`: account-bound transport contract, capability default OFF,
  immutable operations/receipts, lease/cadence/grace/recovery constants and
  redacted failure categories.
- `cache.ts`: schema-versioned `gamify-surgery.cloud-cache.v1` IndexedDB cache,
  backend/account/campaign namespace, transaction compare-and-swap, SHA-256/
  UTF-8 verification and readback, Web Locks when available, bounded recovery,
  explicit failure results and a fault-injectable memory cache.
- `coordinator.ts`: read-only verified open; explicit acquisition/takeover and
  Resume; 60 s lease, 15 s renewal; about 60 s ordinary dirty checkpoints and
  early coalescing with a 10 s automatic minimum cadence; fenced release;
  account/campaign lifetime guards; pending/retry/conflict/re-auth/expiry;
  shared asynchronous Save & Close and checked recovery-copy adoption.
- `gameSession.ts`: every cloud command goes through
  `applyGameEvidenceCommand`; current state/evidence and opaque question
  receipts are staged together. Synchronous command sequences coalesce, while
  the evidence wrapper observes each command. No gameplay replay on recovery.
- `supabaseTransport.ts`: thin named B2.2 RPC adapter and the sealed-page
  protocol-3 packing boundary described below.
- `fakeTransport.ts`: account-isolated deterministic server simulator with
  before/after-call failures, delayed replies, operation lookup, fencing and
  atomic fake save/evidence/count outcomes. It is not a SQL/RLS oracle.
- `index.ts`: public integration exports.
- `syncTestSupport.ts`, `cache.test.ts`, `coordinator.test.ts`,
  `gameSession.test.tsx`, `supabaseTransport.test.ts`: synthetic helpers and
  **74 new tests in four files**.

Existing source edits are limited to `accountStorageKey.ts` (new three-part
cloud namespace helper; original function/keys retained) and
`usePrototypeSession.ts` (optional, captured account/campaign cloud binding,
command and lifecycle guards, async cloud status/close fields, metadata
staging, focus/pagehide/unmount protection). No shell/App/UI redesign.

`localCampaignRepository.ts` is deliberately byte-unchanged: its global legacy
database cannot safely become an account/backend cache. The new repository
opens a separate database and never adopts/migrates that global data or the
historical prototype localStorage keys. No original local bytes were migrated,
claimed or deleted. Camera preferences remain device-local. Current callers
pass no cloud session and retain their local path; the full regression passes.

### Durability, recovery and wire contract

Each campaign cache entry atomically contains the last verified confirmation
and at most one recovery record: one immutable in-flight operation plus at
most one coalesced following candidate/evidence/count tail. The actual UTF-8
recovery envelope, including escaping, namespace, metadata and any wire
representation, must fit **7,000,000 bytes**. The 3 MB decoded snapshot/game,
1 MB new evidence/tail, 100-count-receipt and 6 MB actual RPC-wrapper checks
reject/pause instead of truncating history or growing an unbounded queue.
Browser quota/security/blocked/transaction/readback failure stops commands and
uploads and retains the attempted bytes in memory for checked recovery.

No request is sent before its immutable ID, exact bytes/hash and candidate
are committed/read back. Lost replies query the original operation first.
An accepted receipt advances only its covered snapshot/evidence/counts; a
newer following candidate is rebased without replaying commands. Prefixes are
compared by immutable IDs/uncompressed hashes, not assumed gzip-byte identity.
A missing operation may be rebound to a new lease/ID only after fresh admission
and an unchanged server revision/generation; an expired unknown operation
stops. An expired or taken-over branch cannot acquire permission by timestamp.

Detected connection/save/renewal failure gets at most 30 s grace, capped by the
conservative remaining server-confirmed lease. Independent wall/monotonic
deadlines, clock-discontinuity checks and elapsed-response subtraction prevent
sleep, clock changes or a late renewal from extending authority. Revocation,
expiry, storage/capacity failure and conflict block actual commands/ticks.
Focus/recovery requires fresh checks and explicit Resume; it cannot push a
cached paused state or silently start local play. Sign-out/switch/disposal
invalidate later callbacks and keep their original scoped recovery.

The actual B2.2 migration appeared during implementation and is used directly:

- `beta2_cloud_access(p_protocol)` / `beta2_cloud_list(p_protocol)`;
- `beta2_cloud_load(p_protocol, p_campaign_id, p_revision)`;
- `beta2_cloud_lease(p_protocol, p_campaign_id, p_action,
  p_expected_revision, p_writer_generation, p_writer_token)`;
- `beta2_cloud_write(p_request_text, p_request_sha256)`;
- `beta2_cloud_operation(p_protocol, p_operation_id)`.

The in-memory format-2 row candidate is an internal codec representation.
The real adapter seals only NEW canonical rows into existing
`CloudEvidencePage` objects and freezes the **protocol 3** full request:
`protocolVersion`, `action:"save"`, `operationId`, `issuedAt`,
`expectedRevision`, `writerGeneration`, `writerToken`, `campaignId`,
`snapshot`, `evidence:{headerSha256,fromRecord,toRecord,pages}` and
`usageReceipts`. Both exact RPC arguments persist in the frozen record;
retries never regenerate timestamps, tokens, compressed pages or hashes.
The duplicate local codec/wire representations are charged to the recovery
cap; they are not duplicate uploads. Loaded sealed pages are converted locally
to canonical rows for the existing format-2 verifier, with aggregate decode
bounds; accepted server pages are never repacked for upload.

Writer capabilities are random 64-character hex tokens, scoped to this
campaign/session. Auth/service credentials never enter the cache/payload.
RPCs check their captured account before and after each callback. The server
receipt's request digest covers every material wire field. B2.2 receipts omit
campaign/count-ID lists: the adapter reconstructs those only from the matching
durable request, while the coordinator checks its digest, operation, revision,
snapshot hash/bytes and evidence high-water. Unknown operations older than the
immutable seven-day request window are blocked, not reminted blindly.

New cloud answer counts use ONLY the cloud save's existing Beta 1 ingestion
path. They never enter the local usage outbox. Already-issued Beta 1 staged
IDs retain their old deduplication path; historical/imported history creates
no receipts. The real scored-answer test proves one durable opaque receipt,
zero retrospective/replayed count and one accepted upload contribution.

### B2.4 integration and remaining decisions

1. Keep the flag OFF until the manager accepts the remaining server/browser/
   notice/capacity gates. Supply a stable backend ID and the authenticated
   account ID; construct the Supabase adapter with an account-ID reader that
   returns null on session expiry. Call `open()` for a verified read-only view;
   opening never acquires/takes over. Call `startWriter(true)` only for the
   explicit takeover choice, then explicit `resume()` when the player continues.
2. Construct `CloudGameSession.create(coordinator, switchCallback)` from the
   verified state, build the matching loaded profile with its campaign tutorial
   metadata, and pass it as `usePrototypeSession(loadedProfile, cloudSession)`.
   Keep this one owner above entry and both shells, keyed/remounted on account
   or campaign change. `cloudSyncView` is shared by both layouts.
3. Use `saveCloudAndClose()` and await true for confirmed save + fenced release.
   The old synchronous `saveAndPause()` returns confirmation-required in cloud
   mode, never a false "safe to close" success. Duplicate close calls share one
   promise; Resume/new commands are blocked through release. Campaign switch
   invokes its supplied navigation callback only after successful close.
4. On conflict, preserve/download a checked recovery via `exportRecovery()` or
   `useAccountSave(keepRecoveryCopy)`. Adopting the account state must create a
   fresh coordinator/session/keyed mount from that verified state; do not keep
   the old in-memory game projection. Failed copy/export leaves recovery intact.
5. **Resolve before enabling: current build Undo is whole-state replacement,
   outside the domain evidence-command API.** Cloud mode safely refuses it
   instead of rewinding accepted finance/learning evidence. A separately owned
   domain command and its UI integration are needed to retain Undo for cloud
   campaigns. Ordinary local Undo is unchanged. No game-domain file was edited.
6. Entry/import opt-in, notice/deletion/clear-device UI, creation/restart/archive
   routing and shell status/choices remain the explicitly separate B2.4 lane.
   This save adapter does not enroll/import campaigns automatically. Manager
   validation of real Data API calls, SQL/gzip/capacity, browser lifecycle and
   physical-phone handoff remains required; these offline fakes cannot prove it.

### Validation and exact results

Existing installed dependencies and the already-approved narrow Windows
`net use` EPERM preload; no installation, network, Git or default-pool bypass:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

All final command exits **0**:

```text
Focused session: Test Files 93 passed (93)
                 Tests      964 passed (964)
                 Duration   100.88s
Full player:     Test Files 254 passed (254)
                 Tests      2385 passed (2385)
                 Duration   108.02s
Typecheck:       all seven workspaces passed
```

Coverage includes backend/A/B/prototype namespace preservation, IndexedDB CAS
and verification/abort boundaries, bounded frozen request/following state,
lost acknowledgments before/after server commit, refresh, old/new generation,
simultaneous takeovers, delayed release/renewal, focus during upload, sleep and
clock jumps, grace/expiry, re-auth/account switch/deletion, protocol/capability/
notice/capacity/throttle failures, actual blocked commands/ticks through the
shared React hook (including StrictMode), real scored-answer count staging and
the exact named protocol-3 RPC boundary. No test was skipped/weakened.

Raw logs, initial owned-file baselines and the final source manifest are under
ignored `.local-dev/beta2-b23/`: `session-tests-verified.log`, `player-full.log`,
`typecheck.log`, `baseline.json`, `owned-files.json`, `final-manifest.json`.
Scoped source/tests/docs are UTF-8 without BOM, LF-only, with final newlines;
credential-pattern scan passes. No clinical content, approval, concept IDs,
balance, FSRS semantics, fixtures, original saves, launcher or opening path
changed. B2.2 owns `supabase/**`; this worker only read those files.

**LOCAL ONLY:** no Git, installs, network, SQL execution, browser/owner storage,
agents, external messages, push, deployment or publication. The canonical owner
path stays `START_GAME.cmd` -> `http://127.0.0.1:4173` in its persistent profile;
remote remains `https://melissarowlandc-afk.github.io/GamifySurgery/`. No current
player save crosses origins/devices merely from this disabled implementation.
The manager owns acceptance, the current-thread handoff, the audited GitHub
checkpoint/reminder (**"push to GitHub"**) and release/enablement.

## Manager review of B2.2 (2026-10-17): simplify server validation

Not accepted as written. The migration implements gzip inflation (Huffman/CRC32), canonical JSON, patch replay and game-field validation in PL/pgSQL. Bit-level PL/pgSQL loops over 250 KB-1.8 MB payloads would take seconds per save and exceed Supabase's request statement timeout for the authenticated role (about 8 s by default), and the plan treats integrity as tamper-tolerant, not anti-cheat. **Manager decision:** the server stores compressed snapshot/evidence payloads OPAQUELY and validates only envelope metadata: declared and actual compressed byte lengths; pgcrypto sha256 of the compressed bytes against the declared hash; the declared uncompressed size within limits; revision/base-revision, writer generation/token and lease fencing; idempotent operation IDs; campaign count, quota, rate limits; atomicity; retention and deletion. Content validation is client-side: the codec verifies hashes and decodes on load, and on failure the client falls back to the prior verified revision and reports it. Build Undo must keep working unchanged for players: an Undo is checkpointed as a new revision; undone build receipts are marked reverted in evidence (append-only), never erased.

## B2.2 revision 1 (2026-10-17): opaque transactional server

**Status: revised offline for manager review; SQL has NOT run.** This section
supersedes the B2.2 handoff's server decompression, canonicalization, content,
finance/journal, patch/replay and domain-validation claims, and its old wire
examples/test output. The binding manager review immediately above governs.
The owner decision to validate on the live game project with rollback-only
synthetic SQL remains binding. No database, network, Git, install, deployment,
agent or player-source operation was used. This lane remains `supabase/**`
and this plan only; B2.3/player edits and all historical Beta 1 files survive.

Changed files:

- `supabase/migrations/20261018000100_beta2_cloud_saves.sql`
- `supabase/tests/beta2_cloud_saves.sql`
- `supabase/tests/README.md`
- New `supabase/tests/live/beta1_usage_and_flags.sql`,
  `beta1_owner_invite_admin.sql`, `beta1_tester_feedback.sql`, and
  `beta1_setup_links.sql`.

The migration is an unapplied, reviewed-file replacement, not an upgrade script
for an installed rejected draft. If that draft has been applied, the manager
must produce a forward migration that removes its obsolete helpers/types.
Do not rerun this CREATE-only migration against an existing Beta 2 schema.

### Server boundary and retained guarantees

Removed all 20 content/decompression helpers and the two custom composite types:
no inflater, Huffman/bit/CRC logic, canonical JSON, recursive JSON traversal,
UTF-16 ordering, evidence-reference resolver, patch replay, checkpoint/game-field
validator, finance/learning interpretation or tutorial interpretation remains.
No payload is converted to text or parsed by SQL. Stored snapshots, headers and
sealed pages are opaque `bytea`; uncompressed SHA-256 and byte counts remain
client declarations, bounded and returned unchanged for codec verification.

The 34 functions have fixed empty `search_path`. The only digest operations
are fully qualified native `extensions.digest(...,'sha256')`: one helper for
exact UTF-8 request/token/deletion identities and one for compressed payloads.
There are no per-byte PL/pgSQL loops. Each new payload is base64-decoded and
hashed natively; write loops visit at most 512 new page envelopes, twice (one
validation pass and one storage pass). Previously accepted evidence contributes
only indexed metadata counts and declared sizes; it is never fetched/decoded
by a save. A load returns its selected snapshot and sealed prefix unchanged.

Envelope checks are protocol 3 / cloud format 2 / evidence contract 1, exact key
sets/types, gzip encoding declaration, compressed actual versus declared length
and hash, declared uncompressed bounds, campaign summary/identity, immutable
operation ID/request digest and issue window, expected base revision, current
writer generation/token and server lease. Blob validity does not establish
that it is actually gzip or meaningful game data. The client codec must verify
bounded decompression, uncompressed length/hash, identities, manifests and all
content before hydration/confirmation. Tamper tolerance is not anti-cheat.

Preserved: two cloud campaigns/account including archives; account and project
reservations/warnings; all five rate buckets; membership -> account -> global
quota -> campaign -> writer lock order; monotonic bigint revisions/generations
serialized as decimal strings; wall-clock 60-second leases checked after locks
and again before acceptance; takeover fencing even without a new revision;
immutable retries; atomic page/snapshot/operation/optional Beta 1 usage receipts;
current plus immediately prior accepted snapshot; prior loads containing exactly
that revision's accepted evidence prefix; deletion/revocation and retention.
Snapshot/evidence limits and conservative row/index allowances remain as in the
original handoff. Operation accounting is deterministic from bounded identity
and receipt sizes so insertion/TOAST representation cannot change its purge cost.
Warnings cover 80% of account/campaign allowances and 300 MB measured or
accounted project usage; writes reserve below the 400 MB working ceiling.

The prior snapshot is available for **client verification**, not SQL-certified
content. On current-load failure the client must verify the prior revision and
report recovery. Recovery must preserve the actual server head/base revision
and append-only evidence high-water; it cannot decrement revisions or rewrite
sealed pages. Build Undo remains a normal higher-revision checkpoint whose
new evidence records mark undone build receipts reverted. There is no SQL
journal-sequence or game-value monotonicity rule to block it. Codec/Undo/recovery
acceptance remains in the player lane and the manager's integration review.

All 11 new tables have RLS and explicit raw-table revokes for PUBLIC/anon,
authenticated and service_role. Nine public wrappers are INVOKER; their private
RPC bodies are constrained DEFINER functions. Authenticated receives explicit
EXECUTE on the eight player wrappers/bodies and own-access RLS helper; only
service_role receives the aggregate/configuration owner tool. Internal helpers
are ungranted. Neither owner tools nor usage-report MFA confer payload reads.

**Only existing Beta 1 function replacements (both unavoidable and additive):**

1. `gamify_private.request_usage_data_deletion()`: lock/check cloud enrollment
   and reject old usage-only confirmation with SQLSTATE `55000`; otherwise
   preserve every original Beta 1 deletion/blocking statement and clean an unused
   cloud capability row. Its wrapper and prior EXECUTE grants survive.
2. `gamify_private.purge_beta1_retained_data()`: preserve all six original
   DELETE statements and add the private cloud metadata purge. Wrapper, Cron
   target, grants and pending setup-code nonexpiry survive.

No other historical migration/object definition changes. Schema USAGE grants
for authenticated/service_role are explicit. The new full-scope delete removes
cloud plus usage/flags/feedback, leaves the membership blocker and a hash-only
30-day restore ledger (including Auth cascade), and remains available after
revocation. Save receipts/rate rows expire after eight days; imports remain
idempotent for campaign life; expired writer tokens clear without generation
reset. Functional campaign/evidence/snapshot data does not expire at 90 days.
Deleted rows are not credited as reclaimed PostgreSQL space; explicit owner
VACUUM verification is still required before clearing the conservative dead
estimate. The owner's Auth/invitation/private-export cleanup remains seven days.

### Exact B2.3/B2.4 adapter changes required (no player files edited)

Inspected the current `supabaseTransport.ts`, `transport.ts`,
`codecCompression.ts`, `codecEvidencePages.ts` and codec metadata contract.
Keep `CLOUD_SYNC_PROTOCOL = 3`, all nine RPC names/signatures, lease arguments,
receipt keys, decimal revision strings and `evidence.pages` sealing/order.
The pre-enable wire envelope now requires these additions:

1. In `SupabaseCloudTransport.prepare`, put these three fields at the root:
   `cloudFormatVersion: 2`, `evidenceContractVersion: 1`, and
   `campaign: { campaignId: request.campaign.campaignId,
   name: request.campaign.name, status: request.campaign.status }`.
   This is exactly the three-key summary, not the full tutorial/timestamp object.
   The historical `codec.ts` `CLOUD_FORMAT_VERSION` is 1; use the format-2
   evidence constant or literal 2 here, not that deprecated format-1 constant.
2. Add `compressedSha256` to the outgoing snapshot and every page's content;
   the import adapter must also add it to the immutable header. Compute native
   Web Crypto SHA-256 over the exact bytes decoded from `dataBase64`, producing
   64 lowercase hex characters. Preserve `encoding`, `dataBase64`,
   `compressedBytes`, `uncompressedBytes`, `uncompressedSha256` unchanged.
   A transport-local extended wire type/helper is sufficient; changing the
   codec's stored canonical/uncompressed identity is unnecessary.
3. Freeze the new full JSON text and its request hash once, BEFORE durable cache
   commit/send, as the existing coordinator already requires. Apply the 6 MB
   encoded RPC argument-body check after these fields are present. Identical
   retries must reuse those exact bytes and IDs. Do not mutate existing frozen
   requests; resolve their outcome first. Since this is a pre-enable revision
   of protocol 3, old bodies missing the additions fail `22023`; no deployed
   client should be enabled until the adapter is updated. Rebase/rebuild a
   confirmed-unaccepted old operation with a fresh ID and current head rather
   than silently changing an ambiguous in-flight request.
4. `load` returns the same packed fields plus `compressedSha256`. Validate
   its shape and compressed length/hash before decoding, then retain all codec
   uncompressed/content checks. This can use an async transport helper without
   changing `CloudCompressedText`'s uncompressed logical identity. Selective
   response `list.baselineId` is removed (the inspected adapter never read it);
   `CloudConfirmed.baselineId` still comes from the verified snapshot envelope.
   No baseline/manifest/journal fields need new write arguments.
5. Expose/parse list's existing `priorRevision: string | null` in the client
   head/summary and use the already supported `load(campaignId, revision)` /
   `p_revision` path for reported prior recovery when current verification
   fails. Preserve real server base/high-water fencing during subsequent work.
   Receipts still return `snapshotSha256`/`snapshotBytes` as the declared
   uncompressed identity/size; they confirm byte storage, not decoded content.
   Keep Undo's append-only reverted receipts and ordinary new-revision behavior.

### Rollback tests, filtered Beta 1 regression and manual contention

The rewritten Beta 2 suite has exactly one final PASS result row. It covers
A/B/anon, actual RLS and ACLs, trusted versus user metadata, consent separation,
wrong compressed hashes/lengths and envelope versions, size/page/prefix/body
limits, stale base/generation/token, takeover/expiry/release/retry fencing,
atomic late usage failure, prior prefix retention, bigint revisions, quotas and
warnings, all rate buckets, retention, mixed-client/full deletion, fresh Auth
revocation/bans, Auth cascade and deletion-ledger expiry/accounting. Opaque
non-gzip fixtures deliberately prove that SQL does not interpret content.

One accepted checkpoint uses 1.5 MB of native set-generated MD5 blocks (little
repetition), yielding an approximately 2 MB request. Generation and caller-side
request hashing occur outside the timed RPC. The RPC must finish in less than
one second without contention; otherwise the test raises before PASS. The test
prints NOTICE `B2.2 2 MB cloud write elapsed_ms=<measured value>`. No actual
value or live latency result is available in this worker environment.

Expected final row (recipe only, not observed):

```text
PASS: Beta 2 synthetic isolation/fencing/leases/opaque-integrity/atomicity/quotas/limits/retention/deletion/grants/search_path checks; rollback follows
```

README now gives the complete SQL Editor sequence, expected output and exact
live Beta 1 variant files/PASS strings. Run each entire file as postgres in a
separate query; never select fragments or replace ROLLBACK. On any error issue
ROLLBACK immediately in that connection. No Beta 1 assertion is skipped:
39 usage / 20 invite / 35 feedback / 40 setup original assertions survive, with
additional fixture collision guards. Owner-wide usage totals, flag edits/read,
retention/global receipt assertions and feedback owner/service totals are
synthetic-filtered with unchanged expected values. Own-account RLS counts remain
unfiltered to catch leaks. Setup emails now use example.invalid, with guards
for pending-code-only fixture emails too. Actual retention routines still
visit expired live rows under rollback; document/capture their temporary locks
and run in a quiet window. Original historical test files are unchanged.

Short two-editor-tab procedure, still wholly rollback-only, after the reviewed
migration is applied (postgres, same live game project):

1. Tab A runs the entire query below; start B while A sleeps:

   ```sql
   begin;
   set local statement_timeout = '30s';
   select singleton from gamify_private.beta2_cloud_quota where singleton for update;
   select pg_sleep(20);
   rollback;
   ```

2. Tab B runs the entire query during that sleep:

   ```sql
   begin;
   set local lock_timeout = '3s';
   do $probe$ begin
     begin
       perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
       raise exception 'No overlapping lock observed: repeat while A sleeps';
     exception when lock_not_available then
       raise notice 'Expected quota lock contention observed; rollback follows';
     end;
   end $probe$;
   rollback;
   ```

   Expect the notice after about three seconds. On unexpected error run
   ROLLBACK in that connection. Neither query changes any quota value/user row.
3. After A finishes, run the entire revised Beta 2 suite in B and capture its
   actual timing notice and final PASS. Its generation assertions prove takeover
   1 -> 2 without a save, stale-token rejection, expiry/reacquisition to 3,
   original receipt retries and monotonic revisions. Invisible uncommitted
   synthetic campaigns cannot be shared between tabs; this procedure proves
   shared-lock contention plus deterministic generation outcomes, not a committed
   same-campaign race. The binding owner decision assigns the actual device
   race to B2.6 desktop -> phone -> desktop. No committed synthetic seed is used.

### Validation and handback

Local source-only check (Node built-ins, PowerShell, exit 0):

```text
PASS source-only: 7 files UTF-8/no-BOM/LF; SQL quotes/dollar blocks/parentheses balanced.
PASS source-only: 11 RLS-scoped tables; 34 fixed-path functions; 9 invoker wrappers; 2 existing replacements.
PASS source-only: zero content/decompression helpers; 2 fully qualified pgcrypto calls; only bounded new-page envelope loops in writes.
PASS source-only: rollback suites have one final SELECT/PASS; representative 2 MB write has a <1 s live assertion.
PASS source-only: all 6 historical purge DELETE statements and 39/20/35/40 Beta 1 assertions retained.
NOT RUN: PostgreSQL, Supabase/Data API, RPC timings, SQL assertions.
```

The source review checked PostgreSQL 15/17 row/composite expressions, native
bytea digest/base64 handling, bigint string arithmetic, function volatility and
empty paths, SQL role versus JWT claim enforcement, RLS/ACLs, statement rollback,
lock ordering, wall-clock expiry, deterministic receipt accounting and retention
boundaries. Deliberate `22023` errors preserve their constant messages (including
operation expiry for the adapter); native JSON/cast errors are sanitized.
Lexical/source checks are not a PostgreSQL parse or database PASS.
This appended handoff is UTF-8 without BOM/LF as well. No SQL/browser/player
regression result is claimed and no clinical content or owner save was touched.

**Next action:** manager reviews the actual changed files and required adapter
follow-up, applies only the reviewed migration, runs revised Beta 2 + all four
live-filtered Beta 1 suites and the two-tab probe, captures real timing/Data API
and capacity results, and reviews client verification/prior fallback/Undo before
B2.4 enablement/B2.6. Server flags and client default remain off. The manager owns
acceptance, current-thread handoff, audited GitHub checkpoint/reminder and rollout.
This checkpoint remains local only; no Git command was used by this worker.
