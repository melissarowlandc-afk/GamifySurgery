# Beta 1 usage integration

`UsageProvider` lives inside the account gate, above local campaign entry and
shell selection. The unconfigured prototype has no controller, queue, timer or
usage request. It does not claim or upload old campaigns or FSRS reviews.

The shared notice/Account UI uses `useUsageTracking()`:

- `null`: unconfigured prototype, unsigned account or provider not mounted yet.
- `status()` and `subscribe(listener)`: pending/unavailable, queue/storage loss,
  deletion and browser counting ownership. No account/email/token in the status.
- `acceptNotice(USAGE_NOTICE_VERSION)`: call only after the owner-reviewed full
  notice/contact is shown and explicitly accepted. `UsageNotice` now offers
  Accept on first sign-in, with the exact short notice and expandable details;
  Later keeps recording off. Account & privacy also offers acceptance. The
  server rejects collection until acceptance is recorded.
- `requestDeletion()`: freezes this account's recording/retries immediately,
  persists a local stop marker, then asks the server to delete usage/flags and
  block further writes. A failed request remains blocked and can be retried;
  show failure honestly. Owner-only Auth/roster/export cleanup follows within
  the disclosed schedule. Offer separate account-local campaign/flag deletion
  through the manager's release procedure, preserving other accounts and the
  unowned prototype. This button deletes hosted usage/flags and local pending
  usage/flags; it intentionally leaves saved clinics. A browser
  with blocked storage cannot persist its local stop marker across reload;
  confirmed server deletion still blocks stale/replayed requests.

`usePrototypeSession` stages an opaque question receipt in the **same single
localStorage write** as a first accepted scored reducer result. Only a successful
save promotes that receipt to the separate outbox. A crash before promotion or
before clearing the staging field retries the identical ID. Failed game saves
never upload provisional counts. Imported/restored history is a baseline with
zero retrospective counts. Patient and employee discussion first scored answers,
right or wrong, each contribute one, including manually paused submissions.

Time uses a monotonic clock, visible/unpaused loaded campaigns, a five-minute
meaningful-input cutoff, <=5-second observations, <=30-second intervals and UTC
midnight boundaries. Simulation speed, frames, ticks, animation and network/auth
activity never reset idle or multiply time. Finish reports, Build/Management/Help
pauses and entry are excluded. Ordinary pauses preserve a play session; campaign
switch, Save & Close, finish report and page exit end it. No input contents,
coordinates, event trails, clinical identifiers, answers or correctness enter
usage data. Browser Web Locks provide one counting tab per account/origin; if
unavailable, time counting stays off, gameplay and scored counts remain usable.
This is not a cloud campaign writer lock or an anti-cheat guarantee.

Uploads send at most 100 receipts about every 60 seconds, and best-effort on
pause/hide/pagehide. Pagehide uses `fetch(..., { keepalive: true })`; a previously
in-flight request may prevent a second unload request. The queue remains durable
until acknowledgement; no final request is assumed to succeed. Reconnect
backlogs drain one bounded batch per heartbeat. The account-scoped outbox and
atomic staging each have a 512 KiB/seven-day bound (combined <=1 MiB). Expiry,
overflow, crashes and blocked browser storage can under-report estimates.

Server RPCs derive identity from Auth, freshly check invitation/admission,
revocation and deletion, validate the metric/payload, serialize writes with the
membership row and deduplicate immutable receipts. Engineering abuse limits:
100 receipts/64 KiB/request, <=30 seconds/interval, 20 ingest requests/minute,
120 new scored receipts/occurrence-minute, <=86,400 seconds and 10,000 questions
per UTC player day. These are software limits, not clinical or attention claims;
client reports cannot prove actual attention or prevent a modified client from
lying within those bounds. Received detail is compacted after eight days;
daily totals cover today plus 89 preceding UTC dates. Flags expire after 90 days.

The reviewed SQL, transactional synthetic policy checks and console-only
hours:minutes report are under `supabase/`. See the owner setup runbook. SQL has
not been run on a database in this worker lane. Notice/deletion UI and a shared
patient/employee flag composer now exist; live owner/SMTP/RLS/browser acceptance
and final owner review/contact remain manager release gates. No cloud campaign
upload or clinical content changes occur here.

`QuestionFlagProvider` lives above shell selection, inside `UsageProvider`.
It uploads only explicitly submitted new flags after notice acceptance. Its
separate account queue holds at most 50 entries/1 MiB; pending flags expire after
seven days and sent status caches after 90 days. Offline/lost-ack retries keep
the same UUID/payload. A duplicate or rate-limited insert acknowledges only a
matching immutable server row. Sign-out stops the controller; deletion clears
it immediately and late replies cannot recreate local entries. No old local
review exports are automatically uploaded. A comment is capped at 500 UTF-16
code units (also within SQL's 500-character cap).

The runtime schema has no independent question-slot or concept-version fields.
Hosted `question_id` is `question-slot:` plus SHA-256 of
`JSON.stringify([clinicalCaseId, decisionNodeId])`. The pair is stable and
independent of FSRS concept identity; raw joined IDs can exceed SQL's 160 cap,
and node IDs repeat across cases. `question_variant_id` stays authored;
`question_variant_version` is a SHA-256 digest of the captured presentation
variant/profile, frozen presentation/stem, canonical choice snapshots and
explanation. The exact displayed order and selected ID are separate fields.
`concept_version` uses the frozen clinical release as its version namespace;
`content_version` uses the frozen presentation revision when present, otherwise
that release. `app_version` includes the beta version and UTC build date.
No generated names, clinic/campaign, question prose or correctness is uploaded.
Local review/export snapshots retain their existing detailed context, now with
bounded comments and each occurrence's actual choice order. Existing unowned
prototype storage keys and frozen saves are unchanged.

The manager must retain the tested immutable release artifacts and verify slot
and frozen-profile reconstruction before publication. Compute the case/node
hash for candidates in the reported release, then compare the variant revision
digest. The new console-only `supabase/reports/owner_question_flags.sql` omits
player email/UUID and is separate from the two-total usage report. Treat player
comments as untrusted report text. SDK insert/select calls were checked against
[Supabase's insert reference](https://supabase.com/docs/reference/javascript/insert)
and [select reference](https://supabase.com/docs/reference/javascript/select);
no hosted project was accessed.
