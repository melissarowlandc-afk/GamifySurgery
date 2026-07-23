# Gamify Surgery Project Brief

Status: Living project record; implementation is not authorized.

Last updated: 2026-07-22

## Authority and source hierarchy

The authoritative source for this initial record is:

1. Melissa's original comprehensive project specification in this working conversation.
2. Melissa's latest five answers, which supersede earlier answers wherever they conflict.
3. These project documents after Melissa reviews and approves them.

No external prior conversation, absent note, or unstated design should be treated as authoritative. Missing details remain open rather than being invented.

## Product

Gamify Surgery is a single-player educational surgery-management game. The player begins at the front desk of a tiny fictional clinic and develops it into an optimized ambulatory surgery center while answering ABSITE-style clinical questions.

The experience combines:

- A visibly expanding top-down facility
- Automated staff work and operational queues
- Rooms, construction, salaries, morale, training, upgrades, cleanliness, maintenance, and finances
- Clinical decisions tied to spaced repetition
- Deterministic, seeded campaign variation
- Large-pixel grayscale graphics and a text-forward interface
- Full browser gameplay on desktop and phone
- Private administration of clinical content and game balance
- Persistent accounts and cloud saves

This is an educational game, not clinical decision support. It must never contain real patient information.

## Intended audience and pilot

Primary eventual audience: adult general surgery residents studying ABSITE-type material.

Provisional pilot:

1. Melissa and other invited adult surgery residents.
2. No participants under 18.
3. No human-subjects research or research data collection.

The tester count, recruitment process, and pilot duration remain open. A three-to-four-week duration is a recommendation, not an accepted requirement.

## Product goals

- Make clinically accurate retrieval practice part of an engaging management loop.
- Preserve long-term scheduling within each campaign through concept-level FSRS cards.
- Make operational decisions meaningful without random staff clinical incompetence.
- Keep all important balance values configurable, validated, and versioned.
- Allow safe content review, clinical approval, publishing, and rollback.
- Support reproducible testing through seeded randomness and headless simulation.
- Deliver a small, complete vertical slice before expanding the full game.

## Non-goals for the initial pilot

- Clinical decision support
- Real patient records or PHI
- Human-subjects research
- Gameplay analytics or detailed telemetry
- Advertising, marketing use, or sale of data
- Public release
- App-store or native-application distribution
- Full offline-first play
- All five facility stages
- A feature-complete administration product

## Accepted product constraints

- One browser-based application provides full gameplay on desktop and phone.
- The same account and cloud save are available across devices.
- Internet access is required during the initial pilot.
- The game remains fully usable with sound disabled.
- A new campaign starts a new FSRS schedule and new mastery progress.
- Reopening an existing campaign preserves that campaign's FSRS state.
- Facility, construction, money, XP, satisfaction, staff, patients, accomplishments, inspection results, and seed are campaign-specific.
- Each campaign remains pinned to its clinical concept set, clinical release, and balance release.
- Pilot accounts use verified email, while gameplay and learning records use a hidden internal account ID.
- The player is told that email is used for account verification and helping prevent duplicate pilot accounts, not for marketing.
- No implementation begins until the architecture, data/versioning plan, vertical-slice scope, and initial deployment target receive explicit approval.

## Current phase

The project is in architecture and design reconciliation. This repository contains documentation only. All foundational technical selections not explicitly marked Accepted remain proposals.
