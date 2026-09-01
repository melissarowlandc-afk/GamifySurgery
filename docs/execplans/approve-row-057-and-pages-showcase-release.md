# Approve row 57 and publish the owner-showcase Pages build

## Goal

Implement the owner-approved two-concept hereditary-spherocytosis/accessory-spleen package from `Gamify Surgery Concepts (4).xlsx`, Sheet1 row 57, validate the complete accumulated prototype, create a public-safe source checkpoint, update `main`, and verify the owner playtest at `https://melissarowlandc-afk.github.io/GamifySurgery/` for the owner's work-laptop demonstration.

## Requirements

- Add the approved workup concept for persistent hemolysis after documented total splenectomy.
- Add the approved management concept for confirmed functioning accessory splenic tissue causing persistent symptomatic hemolysis.
- Implement the seven reviewed question variants and a strong two-decision encounter: off-site functional splenic-tissue evaluation followed by hospital-surgery referral when confirmed.
- Preserve one primary concept per scored decision and corrective-forward handling for a wrong intermediate decision.
- Release clinic-discussion variants at `release.l0.clinic_evaluation`; do not simulate hospital surgery.
- Keep every question single-select with three concise shuffled choices and one key.
- Record Melissa Rowland, MD's explicit approval on 2026-08-25 and workbook row-57 provenance.
- Keep source metadata review separate from the clinically approved content version.
- Include all accumulated public-safe game, documentation, test, visual, and approved clinical-content work in a clean checkpoint so Pages reflects the current prototype.
- Push the reviewed checkpoint to `beta`, fast-forward `main` to the same commit, push `main`, monitor the Pages workflow, and verify the deployed URL.

## Approved clinical design

### Concept A: persistent hemolysis evaluation

1. Persistent anemia plus biochemical hemolysis after total splenectomy: reassess the diagnosis and evaluate for accessory splenic tissue (correct), corticosteroids, or observation.
2. Continued hemolysis plus absent Howell-Jolly bodies after total splenectomy: residual functioning splenic tissue (correct), expected complete asplenia, or post-splenectomy iron deficiency.
3. After hereditary spherocytosis remains supported, identify functioning splenic tissue with Tc-99m heat-damaged RBC scintigraphy (correct), Tc-99m sulfur-colloid scintigraphy, or noncontrast abdominal CT.
4. Reverse recognition: persistent anemia with ongoing biochemical hemolysis (correct), stable hemoglobin with expected Howell-Jolly bodies, or transient anemia after documented blood loss.

### Concept B: confirmed-tissue management

1. Confirmed functioning accessory splenic tissue causing persistent symptomatic hereditary-spherocytosis hemolysis: refer to hospital surgery for removal (correct), embolization, or corticosteroids.
2. Incidentally found tissue with stable hemoglobin and no ongoing hemolysis: removal is not indicated solely because tissue exists (correct), immediate removal, or IVIG.
3. Treatment threshold: confirmed functioning tissue causing persistent hemolysis (correct), absent Howell-Jolly bodies alone, or an incidental splenule with resolved anemia.

### Combined encounter

- Decision 1 uses the functional-tissue scintigraphy variant.
- All test choices display the same configured prototype turnaround so timing does not reveal the key.
- The correct heat-damaged RBC study runs off-site through facility time; a wrong choice is scored and corrected forward to the approved study.
- The returned update confirms functioning accessory splenic tissue and independently scores the management concept.
- The operational turnaround is an explicitly labeled centralized game-balance value, not a clinical turnaround-time claim.

## Evidence and provenance

- Current Onkopedia hereditary-spherocytosis guidance: persistent hemolysis after splenectomy requires reconsidering the diagnosis, searching for an accessory spleen, and removal when necessary.
- Iolascon A, et al. *Recommendations regarding splenectomy in hereditary hemolytic anemias.* Haematologica. 2017;102(8):1304-1313. doi:10.3324/haematol.2016.161166. PMID:28550188.
- Zamora EA, Schaefer CA. *Hereditary Spherocytosis.* StatPearls/NCBI Bookshelf, updated 2023-07-04, NBK539797, PMID:30969619, for the limited Howell-Jolly-body clue.
- MacDonald A, Burrell S. *Infrequently Performed Studies in Nuclear Medicine: Part 1.* J Nucl Med Technol. 2008;36(3):132-143. doi:10.2967/jnmt.108.051383. PMID:18703616, for heat-damaged RBC scintigraphy.
- Store independently written atomic claims and metadata only; do not reproduce source prose, tables, figures, or percentages.

## Constraints and non-goals

- Do not use MCV or RDW alone as proof of persistent hemolysis.
- Absence of Howell-Jolly bodies is supportive, not independently diagnostic and not sufficient for surgery.
- Do not recommend immediate reoperation before the diagnosis and functioning tissue are confirmed.
- Do not teach embolization, steroids, or IVIG as the approved hereditary-spherocytosis pathway.
- Do not add hospital gameplay, a hospital OR implementation, new clinical concepts, or unrelated balance changes.
- Do not invent a real-world imaging turnaround; centralized simulation time is editorial gameplay tuning.
- Do not commit ignored workbook imports, private clinical data, local saves/logs, credentials, dependency directories, or generated `dist` output.
- Do not rewrite history, force-push, reset, clean, or discard any accumulated work.

## Relevant repository state

- Current branch is `beta`; verified checkpoint content commit is `244849119596c0f31f21175db5f5e443ff98fac4` (`2448491`, `feat: checkpoint expanded Stitchin Time prototype`).
- The verified content commit is contained in both local `beta` and
  `origin/beta`; the follow-up handoff commit changes documentation only.
- `local main` and `origin/main` remain at `cf7900101563786720bb2520840f0cccecbd7297`.
- The committed checkpoint contains `334` paths with `17,965` insertions and `941` deletions.
- `clinical-data/imports/`, private workbench roots, local development state, dependencies, and generated build output are ignored.
- `.github/workflows/deploy-pages.yml` deploys pushes to `main`, runs `npm test`, and runs `npm run build:pages` with the `/GamifySurgery/` base path.
- Pages and its public source-repository boundary were previously authorized in `DEPLOYMENT_PLAN.md`; this checkpoint pushed the beta backup only and intentionally did not promote main, run the Pages workflow, or publish.

## Milestones

1. Terra implements and validates the bounded row-57 clinical package plus only the required centralized service definitions and tests.
2. Sol reviews the actual clinical and balance diff and reruns focused validation.
3. Terra performs a bounded release-readiness validation pass: complete tests, typecheck/build:pages, targeted browser smoke/e2e checks, and diagnosis of any failures; fixes remain bounded and are returned to Sol for review.
4. Sol audits all staged paths for ignored/private/sensitive material, reviews the staged diff and file sizes, and creates a checkpoint commit on `beta`.
5. Sol pushes `beta`, fast-forwards `main` to the same reviewed commit, pushes `main`, monitors GitHub Actions/Pages, and verifies the live URL serves the new application.

## File or module ownership

### Row-57 Terra milestone

- New approved-data module and focused test under `packages/clinical-content/src/approved-data/`.
- New owner approval record under `docs/clinical-workbench/approvals/`.
- Required integration edits in `packages/clinical-content/src/synthetic-content.ts`, `packages/clinical-content/src/index.ts`, and the exact active-case assertion.
- Minimal centralized service definitions and focused tests under `packages/balance-config/` for the three displayed off-site test choices.
- Update only this plan's Progress, Discoveries, and Exact next action.

### Release-readiness Terra milestone

- No feature expansion. Own only fixes directly required for deterministic tests, typecheck, Pages build, or agreed browser smoke tests.
- Preserve all unrelated accumulated work and report any ambiguous failure rather than redesigning it.

### Sol release ownership

- Source/privacy review, staging, commit, branch update, push, workflow monitoring, live verification, and final acceptance.

## Acceptance criteria

- Exactly two new concepts and seven approved question variants are recorded.
- Every question has three shuffled choices and exactly one correct answer.
- At least six standalone cases plus one combined two-decision case are active exactly once at Level 0.
- The combined case waits for the configured off-site result and scores the two concepts independently.
- All three test choices expose equal facility-time previews; only the correct plan is performed after corrective-forward handling.
- Clinical claims have complete source linkage, explicit limitations, current check dates, and the required review states.
- Current saves remain compatible and prior concept IDs remain unchanged.
- Full repository tests and the verified Pages build pass locally.
- The committed checkpoint contains no ignored/private clinical sources, secrets, local logs/saves, dependency trees, or `dist` artifacts.
- `beta`, `main`, and `origin/main` resolve to the reviewed showcase commit.
- GitHub's Pages workflow succeeds and the public URL returns the new app with repository-relative assets.

## Validation

- Focused row-57 clinical-content and balance tests.
- `npm run typecheck`
- `npm test`
- `npm run build:pages`
- Relevant Playwright smoke tests for opening/campaign and current Level 0/1 flow, if locally runnable.
- Bounded checkpoint `git diff --check`.
- Secret/private-path audit of committed filenames and content.
- GitHub Actions workflow status and deployment URL verification.
- HTTP response and deployed HTML/asset fingerprint comparison against the new build.

## Progress

- [x] Owner approved the two-concept split and reviewed variants.
- [x] Owner explicitly authorized updating the GitHub Pages showcase.
- [x] Terra row-57 implementation and focused validation.
- [x] Sol row-57 diff review.
- [x] Terra release-readiness validation and bounded fixes.
- [x] Sol staged-source/privacy review and beta checkpoint commit.
- [x] Push `beta` backup.
- [x] Owner explicitly instructed: "push the current version for GitHub pages deployment."
- [ ] Fast-forward/push `main`.
- [ ] Verify Pages workflow and live application.

## Discoveries

- The public-safe content checkpoint commit `244849119596c0f31f21175db5f5e443ff98fac4`
  was pushed and read-back verified in `origin/beta` history.
- The existing Pages workflow already has the correct repository base path and main-branch trigger.
- The game-domain service registry requires every displayed timed-test choice to reference a defined centralized service.
- All three displayed row-57 functional-study choices use the same 120-minute off-site editorial prototype duration so timing cannot cue the key.
- The game-domain reviewed-concept and active-case allowlists are exact again: the current approved release enumerates 27 concepts and 81 active cases, including every integrated ROW_* case set.
- The supplied official Iolascon author sequence is now complete in source metadata. Its license/reuse metadata records CC BY-NC 4.0 using the existing restricted enum; no clinical claims or question content changed.
- `scripts/run-e2e.mjs` now fingerprints port 4173 against `/gamify-surgery-launcher-health.json` before reuse. An unrelated service (Med Data Cleaner) remains undisturbed; the launcher instead started the project on a free loopback port and passed that URL explicitly to Playwright.
- Full checkpoint validation passed on 2026-08-30: root `npm run typecheck`, `npm test` (137 files, 856 tests), and `npm run build:pages`. `git diff --check` passed.
- The `founder movement` correction and `QA-gallery` stale assertion correction are recorded in the committed checkpoint.
- The title-tagline and HUD/tutorial browser specs were intentionally not run in
  that validation milestone because their tracked screenshot artifacts were
  already dirty at the time; no user artifacts were overwritten.
- Current release audit state before the new checkpoint commit: local `beta`
  and `origin/beta` resolve to `6109028`; local `main` and `origin/main`
  resolve to `cf79001`, and `main` is a strict ancestor of `beta`.
- The current release audit passed root typecheck across seven workspaces, root
  tests (**144 files / 900 tests**), and `build:pages` (**292 modules / 2 asset
  references / 100 public build files**), plus `git diff --check` and candidate
  secret, private-path, clinical-content, PNG, and symlink scans. The explicit
  68-path candidate manifest is retained in the audit handoff context. The
  ignored local owner-review asset workspace and two concurrent diagnostic
  screenshots are excluded from the candidate release.

## Exact next action

Sol re-audits the sanitized manifest, scoped-stages the explicit paths, reviews
the cached diff, commits `beta`, pushes and verifies `beta`, fast-forwards and
pushes `main`, monitors Pages, and verifies the live URL. The owner explicitly
authorized this beta-to-main promotion, Pages workflow, and live verification;
do not mark any of those steps complete until their evidence is recorded.
