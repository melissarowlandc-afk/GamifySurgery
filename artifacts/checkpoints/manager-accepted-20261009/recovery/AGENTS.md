# Repository instructions

## Clinical-content safety and provenance

Clinical content in this repository is software content, not medical advice. New
AI-assisted diagnoses, phenotypes, evidence claims, concepts, question variants,
explanations, and chart summaries must remain `needs_clinician_review` until a
named clinician explicitly approves a version. Automated tests are not clinical
approval. Draft content may be exposed only through the owner/development
preview or an explicitly unapproved prototype release.

Keep educational tier, patient acuity, facility capability, and facility
progression level as separate fields. Clinical relationships and editorial
simulation weights must also remain separate. Do not use race or ethnicity as a
disease-selection variable. Do not invent exact probabilities, thresholds,
timelines, medication rules, or demographic weights; an exact value requires a
source that directly supports that exact value.

### Source restrictions

Do not:

- upload, read, ingest, scrape, or commit proprietary textbook PDFs;
- use UpToDate, AccessSurgery, commercial question banks, paid review products,
  proprietary SCORE modules, or recalled ABSITE questions as a corpus;
- copy or closely paraphrase source prose;
- copy tables, figures, algorithms, illustrations, question stems, or answer
  explanations;
- store full article text or source excerpts in the repository;
- treat a citation as permission to copy;
- treat public web access as permission for AI ingestion when a site's terms
  prohibit automated or AI use;
- assume PubMed Central availability grants reusable rights;
- rely on inaccessible or paywalled search-result snippets; or
- create placeholder citations.

Permitted work includes reading current government guidance, suitably licensed
open-access articles, and professional-society guidelines; extracting underlying
medical facts; independently synthesizing short original statements; and
storing bibliographic metadata, atomic claim mappings, reuse status, and
external links. Copyrighted society guidance may be used for targeted factual
verification and citation without reproducing protected expression. Follow all
attribution requirements for Creative Commons material.

Every source record must include a stable ID, complete citation, organization or
journal, authors when applicable, publication year, DOI or official URL, access
date, source class, license/reuse status, intended evidence or cross-check use,
and the supported evidence-claim IDs. Record medical authority separately from
license permissiveness.

Every substantive clinical statement must be represented by an atomic,
independently written evidence claim with a stable ID, supporting source IDs,
evidence category, certainty or limitation, last-checked date, and clinical
review status. Prefer a current guideline plus an independent source for
management claims. If only one adequate source exists, record that limitation.
If adequate sources conflict, preserve the disagreement and withhold the
disputed teaching point for clinician review instead of averaging or guessing.

External clinical links must open safely in a new tab. Do not retrieve web
content or call an AI model during gameplay.

### Change discipline

Preserve stable concept IDs when only patient details or question wording
change so FSRS history remains attached to the intended concept. Create a new
concept version when the underlying clinical meaning changes materially. Keep
new clinical data replaceable without rewriting the patient generator, preserve
existing frozen encounters and saves, and do not silently promote draft content
into an approved public release.

### Question-authoring presentation

Runtime answer choices must be randomized. A review artifact may show the key
first only when it explicitly says so. Straightforward single-best-answer
options must use parallel grammar, comparable specificity and length, and the
same semantic category; do not use odd-one-out qualifiers or explanatory
distractor wording that reveals the key.

Owner presentation guidance (September 13, 2026): chief complaints should
usually contain 1–5 words, expressing a symptom, question or visit reason
rather than a full sentence. Present the specific named patient in the clinic;
avoid abstract openings such as "A patient with" and avoid repeating the same
sentence in the complaint and presentation. Each question must state the task
completely, even after presentation and question text are separated for display.
Show an age and sex for every patient, consistent with the clinical story,
generated name and chosen character; preserve clinically constrained profiles.
Show runtime wait estimates for all testing choices, including distractors.
Current durations are placeholders pending the future facility-dependent timing
design in `docs/features/diagnostic-timing-future-design.md`; do not bake fixed
durations into authored question prose.

<!-- BEGIN BOUNDED_THREAD_LIFECYCLE -->
## Bounded thread lifecycle

Prefer one specific bounded task per Codex thread. When that task is completed
and validated, update `docs/handoffs/CURRENT_THREAD_HANDOFF.md`, close the
thread, and start a new thread for the next distinct task. A new thread must
read the handoff and inspect the dirty working tree before editing.

Do not abandon active atomic work or split one unfinished bounded task merely
because a thread is old. The user may explicitly override this lifecycle when
they want a continuous or differently scoped thread.

### Canonical playtest origins

- For local owner playtesting, start the game with `START_GAME.cmd` and use the
  exact URL `http://127.0.0.1:4173` in the intended persistent browser profile.
- `http://localhost:4173`, any other host or port, the GitHub Pages site, an
  incognito/guest window, and another browser profile have separate browser
  storage. Never imply that a campaign automatically follows between them.
- The canonical remote playtest is
  `https://melissarowlandc-afk.github.io/GamifySurgery/`. It has separate saves
  from the local origin until authenticated cloud synchronization exists.
- Whenever a task changes or temporarily substitutes the scheme, host, port,
  path, browser profile, launcher, or remote playtest URL, explicitly tell the
  owner which opening pathway to use and what it means for existing saves.
  Record a durable pathway change in the current handoff before closing the
  task. Include `location.origin` when diagnosing persistence.

### GitHub checkpoint backups

Treat the completion of a substantial validated milestone, a broad integrated
prototype checkpoint, or another materially valuable worktree state as a
GitHub-backup checkpoint. Do not leave such a checkpoint only in the local
working tree without explicitly calling that out to the user. At the checkpoint,
remind the user to say **"push to GitHub"** so the backup can be created.

After that explicit direction, inspect the scoped diff and repository status,
perform the applicable source, secret, privacy, generated-asset, and clinical-
content safety checks, create an appropriately described checkpoint commit,
push the current branch to GitHub, and verify the remote branch contains the
commit. Never use broad staging until the audit establishes that every included
path belongs in the checkpoint. Never include ignored/private clinical inputs,
credentials, proprietary sources, or unrelated user work.

A GitHub backup push does not authorize a merge, release, deployment, Pages
publication, history rewrite, or deletion. Record the pushed branch and commit
in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. If a safe push is blocked, report
the blocker and leave an exact recovery action rather than implying that a
backup exists.
<!-- END BOUNDED_THREAD_LIFECYCLE -->

<!-- BEGIN CLAUDE_MANAGER_DELEGATION -->
## Manager and Codex worker delegation

Since October 7, 2026, the Claude Code thread "GamifySurgery manager" is the
single manager for GamifySurgery game architecture and development
coordination. The former Codex "GS Manager" thread
(`01a0c6e2-930a-7640-a66f-6e8fb1ae0b53`) is on hold: it does not create
threads, dispatch work, or run automations. There is exactly one manager; no
other thread may dispatch work to Codex workers for this repository.

### Roles

- The manager thread is the owner's one-stop shop for game work and the
  oversight and structure thread. It owns architecture and product decisions,
  planning, task breakdown, worker briefs, integration, review, acceptance,
  GitHub checkpoint reminders, and the final report to the owner.
- Delegate first: the manager hands every bounded implementation,
  investigation, diagnosis, content, or validation milestone to a Codex worker
  and keeps its own edits to coordination documents and tiny integration
  corrections found in review. Narrow specialist work may go to an adjunct
  thread when that clearly fits better; the manager still tracks it.
- Owner approval is required only for big design decisions (new systems,
  major gameplay or visual direction, architecture changes, or reversing a
  prior owner decision). Ordinary implementation within approved direction
  proceeds without asking. All clinical-content review rules above still
  apply.
- Codex workers carry out one bounded milestone each and own an explicit lane
  of files or modules. Workers do not spawn agents, commit, push, deploy,
  publish, install dependencies, or send external messages unless the brief
  expressly authorizes it. They preserve unrelated work, including concurrent
  Claude Code and owner edits.
- Other Claude Code threads remain interactive owner threads; they follow the
  manager's lane assignments when the owner routes work through the manager.

### Model routing

Always set the model and effort explicitly:

- Default worker: GPT-6.1 Sol, `-m gpt-6.1-sol -c model_reasoning_effort=max`.
- Rote, tightly specified work (extraction, small specified edits, checks):
  GPT-6 Luna, `-m gpt-6-luna -c model_reasoning_effort=medium`.
- GPT-6 Astra (`gpt-6-astra`, `high`) only for a bounded review of the hardest
  questions.
- Never use `gpt-6-sol`. Use only the owner's existing subscription and owned
  credits; never API credits or purchases.

### Mechanics

Use the Codex desktop app's own CLI by its full path (older copies reject
`gpt-6.1-sol` on a ChatGPT login). The folder name changes with each Codex app
update; re-point the path and the allow rules in `.claude/settings.local.json`
after an update. Current path:
`/c/Users/rowla/AppData/Local/OpenAI/Codex/bin/9691020b546a15b2/codex.exe`.

- Always add `-c 'windows.sandbox="unelevated"'` to `exec` and `exec resume`.
  The configured elevated sandbox fails setup ("setup refresh had errors")
  while the Codex app holds `node_repl.exe` open, so workers cannot run any
  command. Never pass `--dangerously-bypass-approvals-and-sandbox`.
- New worker: `codex.exe exec -m gpt-6.1-sol -c model_reasoning_effort=max
  -c 'windows.sandbox="unelevated"' -s workspace-write -C <repo>
  -o <scratch>/result.md "<brief>" < /dev/null`, run in the background. The
  session id is printed near the top of stderr.
- Continue a worker that is not open in the Codex app, from the repo directory:
  `codex.exe exec resume <thread-id> -m gpt-6.1-sol -c
  model_reasoning_effort=max -c 'windows.sandbox="unelevated"' -c
  'sandbox_mode="workspace-write"' -o <scratch>/result.md "<message>"`, run in
  the background (`resume` has no `-s` or `-C` flag).
- If resume fails with an "active writer" error, the thread is open in the app:
  record the baseline with `.claude/wait-codex-turn.sh <thread-id> --count`,
  then `codex.exe queue --thread <thread-id> --message "<message>"`. A queued
  message to a thread that is not open is never delivered.
- In the unelevated sandbox, workers cannot spawn browsers (Playwright) or
  Vitest's default child-process pool (`spawn EPERM`); they run tests with
  `--pool=threads` and use `npm.cmd` from PowerShell. The manager reruns
  browser checks and default-config tests in its own environment.
- `.claude/wait-codex-turn.sh <thread-id> [--baseline N]` is read-only; it waits
  for the thread's next finished turn in `~/.codex/sessions` and prints the
  worker's final message.

### Worker briefs and acceptance

Each brief states the milestone, owned files or modules, requirements and
non-goals, acceptance criteria, exact validation commands, the active ExecPlan
or handoff path when present, the clinical-content and source rules above, and
that the working tree is shared. Workers end with a handoff listing files
changed, implementation or findings, exact validation output, and open risks or
decisions.

A queued message, a started process, or a worker's own summary is not proof of
work. The manager accepts a milestone only after inspecting the actual diff and
rerunning or reading the validation output. Normally run one write-capable
worker at a time unless lanes are disjoint and stated in both briefs.
<!-- END CLAUDE_MANAGER_DELEGATION -->
