# GS-024: verified GitHub development checkpoint

Repository: https://github.com/melissarowlandc-afk/GamifySurgery
Branch: `backup/new-computer-2026-09-22`
Verified runnable payload commit: `6a468d7b00dc72d8e7f32d62a48ee050b8a2747a`.
The following documentation-only receipt commit preserves the same runtime tree.

## Remote and clean retrieval
The payload was pushed to the existing PUBLIC repository and independently
confirmed with git ls-remote. A new single-branch shallow clone was retrieved
DIRECTLY from GitHub at `C:/Users/Kyle Kent/Projects/GamifySurgery-github-verify-20260922`.
Its initial git status was clean. Parent independently verified all 4,080
manifested files / 522,038,417 bytes against SHA-256 with zero mismatches.
The manifest excludes its own recursively changing hash; later receipt docs
update their own entries while preserving original captured hashes where changed.

Fresh-clone results on Node24.18.0/npm11.16.0:
- `npm ci --fetch-retries=0 --no-audit --no-fund`: passed,112 packages installed.
- `npm run test --workspaces --if-present -- --maxWorkers=1`:1,577 tests passed
  across206 files (workbench43/player467/balance27/authoring81/content360/research83/domain516).
- `npm run build`: passed runtime/launcher boundaries, all7 workspace typechecks,
  and production build. Existing large-bundle advisory remains.
- Isolated Vite/Chrome startup at `http://127.0.0.1:5173`: game, founder, facility,
  HUD and tutorial rendered; parent visually inspected the fresh-clone screenshot.
  The canonical owner origin4173 and owner browser profile/saves were not used.
- `service-income.spec.ts` desktop Chrome acceptance passed in43.6s, exercising
  a real ultrasound visitor, receipt, earnings popup, exit and income display.

## Explicit browser-test limitation
A broader six-case browser run was stopped after sufficient startup evidence.
`fresh-campaign-examination-room.spec.ts:126` failed after1.8m: its wait for
Olivia Reed's visible patient tab to have an accessible name matching
`/Action required/` timed out after70s. Actual name was
`Olivia Reed portrait Olivia Reed Satisfaction 100%`.
This is a recorded gameplay-flow test failure, not a diagnosed root cause or a
claim that all browser tests pass. Remaining cases were not completed. No
unrelated gameplay fix was made. The isolated test processes were stopped.
Six test-generated screenshot changes exist only in the disposable verify clone.

## Preserved development state and privacy
The checkpoint contains current integrated GS016/017/020/021/023 behavior,
clinical development content with existing review status, runtime assets,
configuration/lockfiles/launchers, tests, plans/feedback/handoffs, room proposals,
GS018 approved704 static poses plus30 clipboards, GS022 approved40 front concepts,
and safe unfinished development/tool records. Backup does not approve unfinished
art or clinical content or integrate it into runtime.

See `GS-024_INVENTORY.json`, `GS-024_AUDIT.md` and
[NEW_COMPUTER_SETUP.md](../NEW_COMPUTER_SETUP.md). Private references, restricted
GS010/013/019 raster material, credentials, browser saves, clinical inputs and
regenerable caches are excluded from this PUBLIC branch. Optional art tools can
require those local inputs and original-machine path adjustment. Owner confirmed
whole-computer Tailscale transfer; scope was narrowed to GitHub only. This task
has not independently verified that transfer and did not continue separate
bundle work after the clarification. Browser campaigns and Codex conversations
or credentials do not migrate through Git.

Original shared source remains beta at c26c96a111103d8665e33c9258ef54071d729f14,
with index SHA256 FE67BF1CCE12834CCDD34D42499C45EE910E0CCBEAF6EE1007B8071DEF2A70B7
unchanged. Current source hashes matched captured source before publication.
Remote beta remains c26c96a; main remains680f9cd. No merge, deployment, force
push, shared-worktree reset/stash, PM-board edit or archival was performed.

Terra handled inventory/snapshot, the narrow test-runner portability fix and
clean-clone validation. Sol audited public art/tool boundaries and restored safe
tooling omissions. Astra reviewed actual diffs/hashes/logs and a rendered image,
and owns the commits/pushes. The only transfer-specific configuration change
sets clinical-research Vitest pool to threads for Windows nested-worker stability;
its83-test suite passed three consecutive runs before remote verification.

Local audit receipts (not required to run the game):
`C:/Users/Kyle Kent/Projects/GS024-transfer-audit/` contains
`github-manifest-verification.json`, `github-verify-npm-ci.log`,
`github-verify-test-postinstall.log`, `github-verify-build.log`,
`github-verify-e2e.log` and `clinical-research-postfix-repeat.log`.
