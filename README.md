# Gamify Surgery

Gamify Surgery is a private, early-stage, grayscale surgery-management learning
game. The current repository contains a playable local browser candidate for
facility Levels 0 and 1.

This build is for gameplay and balance evaluation. Its clinical material is
small, original prototype content that is clearly marked unapproved. It is not
medical advice, is not ready for learners, and must never receive PHI or real
patient information.

## Run it on Windows

You need Node.js `22.12.0` or newer. This project currently records Node.js
`24.18.0` in `.node-version`. Installing a current Node.js LTS release also
installs `npm`, which is the dependency and command runner used below.

1. Open PowerShell.
2. Move into this project folder:

   ```powershell
   cd "C:\Users\Kyle Kent\Projects\GamifySurgery"
   ```

3. Confirm Node.js is available:

   ```powershell
   node --version
   ```

4. Install the exact recorded dependencies:

   ```powershell
   npm install
   ```

5. Start the game:

   ```powershell
   npm run dev
   ```

6. Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in Chrome or another
   modern browser.

Keep PowerShell open while playing. Press `Ctrl+C` there to stop the local
server. Nothing is deployed or published by these commands.

## What is implemented

- A responsive React interface and top-down Phaser facility on desktop and
  phone-width screens
- A founder-operated Level 0 clinic with two protected introductory patients
- Waiting, Active, pending-result, action-required, summary, and Resolved chart
  states
- Single-select questions, concise correction-forward feedback, and one primary
  educational concept per scored decision
- Campaign-scoped FSRS-6 scheduling through a pinned `ts-fsrs` adapter: correct
  answers map to Good and incorrect answers map to Again
- Separate money, XP, satisfaction, facility time, operating expenses, and
  level requirements
- Examination-room placement and the explicit Level 0-to-Level 1 gate
- Level 1 routine arrivals, patience, queue capacity, treatment or referral
  decisions, outsourced or in-house result timing, and bounded consequences
- Level 1 construction options for the bathroom, waiting room, X-ray room,
  imaging control room, and minor-procedure room
- Hiring options for the receptionist and imaging technician, including room
  dependencies, hiring costs, and salaries
- Multiple browser-local campaigns. Each new campaign starts with fresh FSRS
  histories and a new campaign seed, while prior local campaigns can be
  reopened
- Browser-local save/reload, compatible save migration, hidden-tab pause, and a
  two-step recoverable **Start over** flow that preserves the prior campaign's
  seed while creating fresh facility and learning state
- Development-only fast-forward and progression/FSRS inspection controls
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

## Clinical-content warning

The fixture at `packages/clinical-content/src/synthetic-content.ts` contains an
interface tutorial plus a few original draft examples used only to exercise
gameplay. They are conspicuously marked synthetic or clinically unapproved.
They are not a curriculum, have not been clinically approved by Melissa, and
must not be used for teaching or patient care.

## Checks

Run these from the project folder:

| Command | Purpose |
|---|---|
| `npm test` | Run deterministic game-domain and save/FSRS tests |
| `npm run test:e2e` | Run desktop and phone-width browser walkthroughs in installed Chrome |
| `npm run typecheck` | Check every TypeScript workspace |
| `npm run build` | Type-check and create the local production-style player build |
| `npm run test:watch` | Rerun domain tests while code changes |

The built files are placed in `apps/player/dist`. Building them still does not
deploy the game.

## Screenshots

- [Level 1 desktop walkthrough](artifacts/screenshots/level-1-desktop.png)
- [Level 1 desktop facility](artifacts/screenshots/level-1-facility-desktop.png)
- [Level 0 phone-width chart](artifacts/screenshots/level-0-phone.png)

## Deliberately deferred

- Clinically approved content and broad ABSITE coverage
- Full due-prioritized review selection, category interleaving, confused-topic
  contrasts, and repetition avoidance; FSRS cards and due-time inspection are
  implemented, but the complete review queue is not
- The Clinical Content Workbench, textbook ingestion, and live administration
- Supabase account creation, verified-email login, password recovery, cloud
  saves, and cross-device writer-conflict handling
- Hosted staging, outside tester access, monitoring, backups, and deployment
- Levels 2 through 5, inspection week, advanced staffing, maintenance, pharmacy,
  and other later management systems
- Gameplay telemetry, research data collection, public release, native apps,
  billing, and paid infrastructure

## Repository layout

- `apps/player` - responsive React player interface and Phaser facility renderer
- `packages/game-domain` - renderer-independent deterministic rules, FSRS
  adapter, progression, saves, queues, and economy
- `packages/clinical-content` - validated synthetic/unapproved prototype fixture
- `packages/balance-config` - validated centralized prototype tuning values
- `tests/e2e` - desktop and phone-width browser walkthroughs
- `docs/adr` - accepted architecture and game-design decisions
- Root Markdown files - the living canonical project record
