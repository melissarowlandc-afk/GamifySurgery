# GS-021 — Clinic income, service visitors, and retail

Owner approved the expanded catalog on September 17, 2026, with bladder scans in the Ultrasound Room, GLP-1 telehealth at $50, removal of the upper-left consult box once the room and NP are operational, and no cafeteria.

## Implemented behavior

- The shared catalog covers imaging, specimen collection and processing, bladder scans, minor procedures, endoscopy, later ambulatory operations, consultations, wound/ostomy care, authorized follow-up, telehealth, prescription pickup, supplies, refreshments, vending, and gifts.
- Service-only visitors use real rooms, staff, provider reservations, travel, work phases, and departure. They do not create learning questions, FSRS reviews, or educational XP. Scheduled arrivals have per-line and clinic-wide limits and fair selection when several services are due.
- Educational service charges occur after eligible local work. External reports and old saved results do not generate retrospective fees. Minor procedure mappings use explicit existing action identifiers; answering a question alone does not earn a procedure fee.
- Employees, eligible patients waiting for results, service visitors, companions, and outside shoppers use the same retail system. Existing characters retain their identity and sprite. Work and actionable results take priority over optional shopping.
- Retail uses real travel and outlet queues, frozen prices, procurement costs, cooldowns, budgets, and purchase limits. Prescription and wound/ostomy supply fulfillment requires an authorized order. Founder consumption records only stock expense, with no artificial revenue or earnings popup.
- Durable receipts record gross income, stock cost, and net cash change exactly once. Reload preserves active operations and budgets; it does not replay old earnings popups or generate offline income.
- The Management desk has Employees and Services & income tabs. The latter shows availability and future requirements, service appointment controls, current activity, recent buyers, and gross/stock/net totals.
- GLP-1 remains on its existing consult cadence, now paying $50. The staffed operational suite removes the old left-side card; completed consults show +$50 above the actual NP. Receipt popups use rendered character head positions and expire after 1.5 real seconds.

## Boundaries and compatibility

Maximum playable progression remains Level 2. Later catalog entries have capability-gated operation contracts and representative execution fixtures; this work does not create the missing Level 3–5 room/progression content. Explicit-only services and authorized dispensing await their corresponding approved orders/appointments, rather than generating speculative clinical orders.

Clinical wording, answer keys, evidence claims, and review status were not authored or promoted. Four existing clinical source files received operational capability/route metadata only, with transparent checksum amendments to their editorial receipts.

Use `START_GAME.cmd` and `http://127.0.0.1:4173` in the existing browser profile. The launcher, owner server, and owner save were not operated on. Browser acceptance uses synthetic saves and separate preview ports. No deployment, commit, or push was performed.

## Review and validation

Active plan: `docs/execplans/clinic-income-service-visitors.md`; approved detailed catalog: `docs/execplans/clinic-income-service-catalog.md`.

Astra reviewed task-relative source diffs and independently checked the M1, M2, M3, and M4b source mirrors. Final M3 and M4b mirrors each matched all twelve live files, including the staff movement addendum. Existing unrelated changes in the shared worktree were preserved.

Final unit suites: domain 503/503, player 455/455, clinical content 360/360, and balance 27/27 (1,345 total). All seven workspace typechecks and boundary/launcher checks passed. Astra independently ran focused domain checks, read the full-suite logs, and reviewed the fixture corrections. Older disconnected test rooms now use real accessible layouts; patient-supply snapshots reflect the approved capability gates, while progress and zero-walkout assertions remain.

The combined five-case Chromium run passed (2.4 minutes): manual and automated GLP-1, real ultrasound visitor work/payment/departure, outside retail sale/popup/departure, and autonomous employee/result-waiting-patient purchases with unchanged educational identities/XP and persisted receipts after reload. Astra read the completed log and passed status, and visually inspected the actual shopper +$5 and Management screenshots. A final requirement-label deduplication passed another independent 12/12 focused player tests.

Evidence: `.local-dev/gs-021-domain-final.log`, `gs-021-player-final.log`, `gs-021-clinical-suite.log`, `gs-021-typecheck-final.log`, and `gs-021-m4b-integrated-playwright.log`. Browser result status: `.local-dev/gs-021-m4b-integrated-results/.last-run.json`. Synthetic screenshots are under `artifacts/screenshots/gs-021-*`. Isolated builds succeeded; visual instrumentation was enabled only in an ignored test-build configuration, preserving the production development-only inspection guard.

Final visual review caught and corrected a clipped Management scroll area. The final focused Chromium check passed with the receipt buyer and economics asserted inside the viewport (`.local-dev/gs-021-m4b-final-ui-playwright.log`, 1/1). Astra inspected `gs-021-m4b-management-retail-receipt.png`: Maya Shopper's coffee shows $5 gross/$1 stock/$4 net; founder consumption shows $0 gross and the actual stock expense. All owned previews were stopped; Astra independently verified no listener on port 4192. Implementation acceptance is complete; owner playtest acceptance remains pending.

Implementation workers: Sol `service_mapping_review` owns service/domain/retail implementation and final retail browser escalation; Terra `income_investigation` and `retail_ui_finish` implemented player presentation and portions of testing. Sol `fixture_integration` owns legacy fixture integration after incomplete Terra handbacks. Spark `glp1_panel` failed before editing because its model was unavailable; it contributed no implementation.

Owner accepted completion on September 17, 2026: "Okay we can complete this thread". This supersedes the pending-acceptance notes above; no separate owner playtest results were reported. Task complete and authorized for archival. This checkpoint remains local. Say **"push to GitHub"** for a scoped backup; this does not authorize publication or deployment.

## Backup closeout reopened

GS Manager reopened only the backup closeout under the owner's relayed standing post-acceptance backup instruction. That instruction supersedes the generic push-phrase wording above. Scope: accepted GS-021 reconstruction evidence and required source baselines, seven synthetic screenshots, and narrow acceptance/feedback records. No further implementation, main merge, deployment, private-input publication, peer messages, or PM-board edits.

Remote lookup found no existing `backup/gs-021*` branch. Parent created an isolated local clone at `C:/Users/Kyle Kent/Projects/GamifySurgery-gs021-closeout`, branch `backup/gs-021-income-2026-09-17`, based on beta `c26c96a111103d8665e33c9258ef54071d729f14`. The shared beta/index remains untouched. Sol `backup_audit` prepares the scoped package; Astra owns audit acceptance, commit, push, and remote verification. Backup status is pending until a verified remote commit is recorded below.
