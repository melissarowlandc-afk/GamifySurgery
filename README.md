# Gamify Surgery

Gamify Surgery is an early-stage, grayscale surgery-management learning game.
The current repository contains a playable browser candidate for facility
Levels 0 and 1.

This build is for gameplay and balance evaluation. Its clinical material is
small, original prototype content. One striped in-game banner carries the
demonstration-content warning instead of repeating caveats throughout every
chart. The build is not ready for learners and must never receive PHI or real
patient information.

## Start it on Windows

Double-click **`START_GAME.cmd`** in this project folder. The launcher will:

- check that the required Node.js and npm tools are available;
- install or refresh the project dependencies automatically;
- start the local game;
- wait until it is ready; and
- open it in your default browser.

Keep the launcher window open while playing. Press Enter in that window when
finished; it stops only the game server that it started. Campaign saves remain
in the browser. Gameplay instructions are available from the fixed **Help**
button inside the game.

Node.js `22.12.0` or newer remains the one system prerequisite. This project
currently records Node.js `24.18.0` in `.node-version`. If Node.js is missing
or outdated, the launcher explains what is needed instead of making system
changes.

### Manual developer alternative

From PowerShell in this project folder:

```powershell
npm install
npm run dev
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173). Press `Ctrl+C` to
stop the manual server. Neither method deploys or publishes anything.

## What is implemented

- A desktop-first React interface and top-down Phaser facility sized for both
  full and compact desktop browser windows; phone-specific polish is deferred
- A state-driven Level 0 tutorial with collision-aware contextual bubbles,
  direct target beacons, and animated arrows attached to the real controls for
  charting, results, feedback, resolution, goals, construction, and level
  advancement; the coach never performs the action for the player, Prototype
  tools can disable it, and the beginner Help guide remains available
- State-driven Level 1 guidance for the facility clock, first routine arrival,
  service drill, off-site test wait and ETA, returned result, and follow-up
  decision
- A founder-operated Level 0 clinic with two protected introductory patients
- A continuous 8 AM-6 PM facility day lasting about five real minutes, with
  Level 1 routine arrivals paced at roughly one patient per real minute
- Left-edge Waiting and Existing Patient chart tabs, exclamation-point action
  badges, and a collapsed filing-cabinet control for newest-first Resolved
  charts
- A large lower-workspace chart with patient portrait, presentation, and
  sequential decision/result columns; completed charts can flip to an authored
  learning summary before explicit resolution
- Deterministically varied synthetic patient names and pixel appearances, plus
  frozen seeded answer-order randomization so the correct choice is not tied to
  one position
- Single-select questions, concise correction-forward feedback, and one primary
  educational concept per scored decision
- Multi-step encounters with visible test turnaround estimates, off-site
  departure and return, and route-aware in-house X-ray only after the room,
  control room, and imaging technician are operational; hallway travel is
  included in the displayed timing
- Campaign-scoped FSRS-6 scheduling through a pinned `ts-fsrs` adapter: correct
  answers map to Good and incorrect answers map to Again
- Separate money, XP, satisfaction, facility time, operating expenses, and
  level requirements
- A paused **Build Mode** with one consistent Enter/Exit control, a prominent
  pause banner, build-only grid, zoom/pan controls, repeatable rooms and
  functional hallways, domain-validated placement outlines, visible rotating
  doors, upgrades, and sale for a centrally configured 25% refund
- Examination-room construction and the explicit Level 0-to-Level 1 gate
- Level 1 routine arrivals, patience, queue capacity, treatment or referral
  decisions, outsourced or in-house result timing, and bounded consequences
- Level 1 construction options for the bathroom, waiting room, X-ray room,
  imaging control room, and minor-procedure room
- Named receptionist and imaging-technician employees with generated pixel
  appearances, role caps, room dependencies, hiring costs, adjustable salaries,
  morale, visible entry routes, and delayed capability until they reach their
  assigned room
- A right-side message board with persistent actionable alerts, nonurgent
  ticker messages, a recent-event log, duplicate consolidation, and critical
  alert suppression of humor; save, campaign, hidden-tab pause, and accelerated
  testing notices also enter the visible log. The larger future message bank is
  preserved in
  [`docs/features/alert-notification-flavor-system.md`](docs/features/alert-notification-flavor-system.md)
- A bounded emergency cash-only GLP-1 consultation action below $100, limited by
  facility-hour cooldown, configurable daily cap and diminishing payment, with
  no XP or FSRS benefit; the automated suite remains a Level 2 feature
- Multiple browser-local campaigns. Each new campaign starts with fresh FSRS
  histories and a new campaign seed, while prior local campaigns can be
  reopened
- Browser-local save/reload, compatible save migration, hidden-tab pause, and a
  two-step recoverable **Start over** flow that preserves the prior campaign's
  seed while creating fresh facility and learning state
- An open-by-default desktop **Prototype tools** panel with **Add $100**,
  fast-forward, two-step **Restart game**, tutorial, and FSRS inspection
  controls
- A bounded desktop workspace: patient tabs, goals, staffing, building tools,
  and events scroll within their panels instead of extending the document
  indefinitely
- A chart/facility split that keeps the live clinic visible while a large chart
  occupies the lower workspace, plus a synchronized Phaser backing canvas so
  room placement remains accurate after resizing
- An explicit Level 1-complete notice with Level 2 locked for this prototype
- Newest-first Resolved charts while Waiting and Existing Patients retain
  their operational ordering
- A development-only per-concept FSRS card inspector showing card state and due
  time
- Centralized, validated prototype balance settings at
  `packages/balance-config/src/prototype-balance.ts`

## Important local-only limitation

Campaigns currently live only in this browser's local storage on this computer.
They do not synchronize across browsers or devices and may be lost if browser
site data is cleared.

The accepted identity design has **not** changed: the private pilot will use
Supabase verified email and a conventional password, including email
verification and password recovery, with cloud saves shared across devices.
ADR 0022 intentionally places that work after this playable local slice. This
prototype therefore does not show a substitute or temporary login screen.

## Clinical-content boundary

The fixture at `packages/clinical-content/src/synthetic-content.ts` contains an
interface tutorial plus a few original examples used only to exercise gameplay.
The player shows one global striped demonstration-content warning rather than
repeating that wording inside each vignette. The fixture is not a curriculum,
has not been clinically approved by Melissa, and must not be used for teaching
or patient care.

The local `beta` workstream also contains a separate
`packages/clinical-authoring` validation contract. It registers exact source
snapshots, coverage frameworks and their source-defined nodes, many-to-many
Topic Coverage Mappings, controlled vocabularies, draft topic knowledge,
structured facts, Tested Concepts, practice-question takeaways, citations, and
resumable extraction batches without importing drafts into the player.
Available coverage and content summaries are derived from normalized records
rather than stored as editable counters; Question-Variant reporting waits for
that later authoring layer. The tracked official-framework registry stores
metadata and checksums only; it does not copy the ABSITE or SCORE outline
taxonomy or source documents.

The isolated, loopback-only **Clinical Context Workbench** adds an evidence
queue in front of that authoring contract. It records evidence gaps and exact
search strategies, scouts PubMed and Crossref bibliographic metadata, screens
candidates independently per evidence gap, collapses exact DOI/PMID/provider
matches while retaining every immutable search observation, registers operation-specific source rights, captures reviewed
evidence contributions and expert opinions, and derives conservative
**Known / Needed / Blocked / Next actions** briefs. Search results are
candidates, not evidence; only reviewed contributions and opinions may appear
under **Known**, and neither the Workbench nor its metadata scouts clinically
approve or publish game content.

The repository and GitHub Pages site are public. Raw sources, private workbook
exports, owner notes, and extraction outputs must remain in ignored local
directories and be backed up separately to an owner-controlled private,
encrypted location. They must never be committed here. Every registered Source
has an explicit rights review; unresolved rights are default-deny, including
for transfer to an external AI provider.

To start the local Workbench on Windows, double-click
`START_CLINICAL_WORKBENCH.cmd`. Its private state stays under the ignored
`.clinical-workbench/` and `.private-clinical-data/` roots. Literature scouting
is metadata-only and remains disabled until a real contact address is supplied
locally in `.env.local`; no key or contact value belongs in Git. See
[`docs/clinical-workbench/CLINICAL_CONTEXT_WORKBENCH.md`](docs/clinical-workbench/CLINICAL_CONTEXT_WORKBENCH.md)
for the queue and safety model.

## Checks

Run these from the project folder:

| Command | Purpose |
|---|---|
| `npm test` | Run deterministic tests across the game, player, and clinical-authoring packages |
| `npm run test:e2e` | Run the desktop browser walkthroughs and retained width regressions in installed Chrome |
| `npm run typecheck` | Check every TypeScript workspace |
| `npm run build` | Type-check and create the local production-style player build |
| `npm run build:pages` | Type-check and verify a static build using the GitHub Pages repository base path |
| `npm run test:watch` | Rerun domain tests while code changes |
| `npm run clinical:validate:example` | Validate the synthetic clinical-authoring round trip |
| `npm run clinical:validate:frameworks` | Validate the public-safe ABSITE/SCORE source registry |
| `npm run clinical:validate -- <path>` | Validate a private local authoring workspace |
| `npm run clinical:workbook:init` | Create the ignored schema-v2 manual-authoring CSV subset with staged, no-clobber writes |
| `npm run clinical:workbook:compile` | Compile the local CSV interchange to new canonical JSON after full validation |
| `npm run clinical:fingerprint-source -- <path>` | Calculate an owner-local source SHA-256 plus a nonstored byte-length diagnostic without retaining its contents |
| `npm run clinical:context` | Start the loopback-only Clinical Context Workbench |
| `npm run clinical:context:test` | Test the Workbench API, storage, security, and presentation boundary |
| `npm run clinical:research:test` | Test evidence provenance, intake, extraction, scouting, review, and synthesis rules |

The built files are placed in `apps/player/dist`. Building them still does not
deploy the game.

### GitHub Pages playtest

Run `npm run build:pages` to create and verify the static player with the
`/GamifySurgery/` repository base path. The workflow at
`.github/workflows/deploy-pages.yml` deploys every push to `main` and also
supports manual reruns. The public playtest URL is:

<https://melissarowlandc-afk.github.io/GamifySurgery/>

The site and source repository are public, and this prototype has no login
gate. Campaign data remains browser-local: it does not transfer from the local
launcher to Pages or follow a tester to another computer/browser. See
[`DEPLOYMENT_PLAN.md`](DEPLOYMENT_PLAN.md) for the deployment boundary.

## Screenshots

- [Automatic desktop tutorial](artifacts/screenshots/tutorial-desktop.png)
- [Highlighted first chart](artifacts/screenshots/tutorial-callout-desktop.png)
- [Guided chart tour](artifacts/screenshots/tutorial-chart-tour-desktop.png)
- [Guided off-site result](artifacts/screenshots/tutorial-result-wait-desktop.png)
- [Guided Level 0 goals](artifacts/screenshots/tutorial-goals-desktop.png)
- [South-door placement preview](artifacts/screenshots/placement-preview-south.png)
- [Rotated west-door placement preview](artifacts/screenshots/placement-preview-west.png)
- [Level 0 desktop chart](artifacts/screenshots/level-0-desktop-chrome.png)
- [Compact desktop chart](artifacts/screenshots/level-0-compact-desktop-chrome.png)
- [Laptop desktop chart](artifacts/screenshots/level-0-laptop-chrome.png)
- [Level 1 desktop walkthrough](artifacts/screenshots/level-1-desktop.png)

## Deliberately deferred

- Clinically approved content and broad ABSITE coverage
- Full due-prioritized review selection, category interleaving, confused-topic
  contrasts, and repetition avoidance; FSRS cards and due-time inspection are
  implemented, but the complete review queue is not
- Automated full-text acquisition, OCR, unrestricted textbook ingestion, and
  commercial question-bank ingestion
- A hosted multi-user Clinical Content administration and publishing system;
  the local Context Workbench is an evidence-review sidecar only
- Supabase account creation, verified-email login, password recovery, cloud
  saves, and cross-device writer-conflict handling
- Authenticated staging, private-pilot access, monitoring, and cloud backups
- Levels 2 through 5, inspection week, advanced staffing, maintenance, pharmacy,
  and other later management systems
- The automated Level 2 Cash-Only GLP-1 Telehealth Suite and GLP-1 NP staffing
- Alerts and flavor definitions tied to maintenance, inspections, later rooms,
  or other mechanics that do not yet exist
- Phone-specific interface polish and phone deployment; current work targets
  full and compact desktop windows
- Gameplay telemetry, research data collection, public release, native apps,
  billing, and paid infrastructure

## Repository layout

- `apps/player` - responsive React player interface and Phaser facility renderer
- `packages/game-domain` - renderer-independent deterministic rules, FSRS
  adapter, progression, saves, queues, and economy
- `packages/clinical-content` - validated prototype clinical fixture
- `packages/clinical-authoring` - draft knowledge/source contract and validator
- `packages/clinical-research` - evidence-gap, rights, provenance, intake,
  metadata-scouting, review, synthesis, and authoring-handoff contracts
- `apps/clinical-context-workbench` - loopback-only evidence queue and review UI
- `packages/balance-config` - validated centralized prototype tuning values
- `clinical-data` - public-safe metadata plus blank authoring templates
- `tests/e2e` - full and compact desktop browser walkthroughs
- `docs/adr` - accepted architecture and game-design decisions
- Root Markdown files - the living canonical project record
