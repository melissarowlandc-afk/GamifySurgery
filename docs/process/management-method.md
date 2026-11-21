# GamifySurgery management method (draft 2026-11-17)

Status: ADOPTED 2026-11-17. Sources: the No Hitter manager and DCC manager replies, plus this project's failures. Owner decisions: D-2026-11-17-01/02/03 (docs/qa/DECISIONS.md).
Then the rules move into AGENTS.md ("Manager and Codex worker delegation") and the
standing dispatch footer.

## Why this exists

On 2026-11-17 the owner said: "It seems like now sometimes there are regressions to
the game where issues that were previously fixed come back, or new bugs are
introduced. Please check the DCC manager and No Hitter manager threads and come up
with a better management method to try to coherently work on things. At this point,
no 'quick patches' that are lazy and can damage the game, you need to actually run
the game and make a diagnosis and then fix that."

Failures seen on 2026-11-15 to 2026-11-17, and how they slipped through:

| Failure | Gap |
| --- | --- |
| Save compaction would have deleted competition revenue and visitor names | Only a code review caught it; no real-save round-trip test. |
| Phone furniture drawn 3-4.7x too large (beds already wrong in the live game) | No phone-vs-desktop rendering check of a real clinic. |
| Release 40 could not open the owner's over-cap desktop journal at first | The fix was tested on the cloud-snapshot path only, not the real device-journal path. |
| Phone loading -> "saving is offline" -> loading loop (two devices) | Multi-device divergence was never run in a real browser. |
| Persistent "known failures" and "passes on recheck" | 5-6 writers in one shared tree; 27 domain and 11-12 clinical tests always red, which masks new failures. |
| Main <-> release hunk ports | Two diverged trees; a port can drop or stale-copy a fix. |

## Rules

### 1. Lanes and writers
- **Exactly one code writer at a time** (owner, D-2026-11-17-03). Every other worker is report-only: diagnosis, test-writing on new test files only, review, design.
- Every other lane is report-only: diagnosis, design, review, simulation. A report-only lane hands the build lane an input to implement. It never patches the code itself.
- Workers never use Git. Only the manager checkpoints, commits and pushes.
- **Never rebuild a screen, flow or file from an older source.** Always start from the base the manager names: the current integration tree with its exact commit or hash. Ports between trees use content diffs against verified preimages; whole-file copies only when the preimage matches.

### 2. Bug workflow: reproduce, then fix, then prove
1. **Intake.** The owner's evidence goes into the lane's private input: the problem report, a save copy, screenshots and the owner's verbatim words. The original is never modified.
2. **Reproduce in the real game under real conditions.** That means the production build (QA-proof variant when instrumentation is needed), Chrome at the phone viewport and desktop, visible and hidden, with real timers, and a real save shape (an owner-save copy or a matching synthetic one). A harness-only pass doesn't count. If the harness disagrees with the real game, fix the harness first.
3. **Category review before patching.** If the bug shows a whole category is broken (e.g. "one texture drawn at the wrong size"), find the common cause and every affected consumer, and fix it at the layer that owns it.
4. **Regression test first.** Encode the owner's symptom as a test that fails before the fix. A fix without its standing regression test isn't done.
5. **Fix, then re-run** the reproduction in the real game plus the regression test. The manager personally re-runs browser reproductions; workers can't run browsers in the sandbox.
6. **No quick patches.** Urgency doesn't skip steps 2-5. In a data-loss emergency, the safe interim action is telling the owner what to avoid, not shipping an unproven fix.

### 2b. Tests first, written blind (from DCC)
- For every behavior-changing piece of work, the brief carries an **acceptance list** naming every case it must handle: unusual and malformed inputs, and the real owner scenarios. The brief, the draft, the review, the tests and the proof run each go through the whole list.
- A **test-writer worker that has not seen the implementation** writes the acceptance and regression tests first, from the contract and the owner's symptom. The coder must make them pass.
- **The coder never changes those tests.**
  - The manager or the test writer corrects a test only when it is confirmed wrong against the contract, and lists the correction at sign-off.
  - Any change that alters what a test checks, or makes it easier to pass, goes to the owner first.
- An independent reviewer (Astra, read-only, on a scratch copy) tries to break each piece by forcing every acceptance case.
- **Category bugs stop building in that area.** The owning layer gets a written review: what is fundamentally wrong, everywhere the same failure lives, the options and a recommendation. An independent model reviews it. The owner decides only if it is a big design decision; otherwise the manager decides. The fix is built once, at the cause. A special case for one symptom is a red flag.
- **No reflexive fix-test cycles.** A failure is a finding to investigate, never a gate to rerun until it turns green. A rerun is valid only when the machine was demonstrably loaded, and it runs alone.
- **Close note.** Every claim in a worker's or the manager's close note is matched to the test or evidence that proves it. Anything unproven is said plainly.

### 3. Standing regression set ("the smoke") and ledger
- `docs/qa/REQUEST_TRACKER.md` records every owner request and bug: the verbatim quote, date, status, the build that fixed it, and its regression test id.
- `docs/qa/DECISIONS.md` records owner rulings verbatim, dated; later entries supersede earlier ones. Briefs quote the owner's words, not summaries.
- The standing smoke runs for every release candidate on a quiet machine (no workers running):
  - boot and open on desktop and phone (production build);
  - save load/round-trip on an owner-save copy: local journal and cloud fake transport;
  - two-device divergence (newer account head plus an older local journal);
  - over-cap journal open;
  - reload, background/return and idle-release with no reload loop;
  - phone memory and pan/zoom budgets;
  - phone-vs-desktop texture world-size comparison on an owner-clinic copy;
  - a 10-minute automated 4x play at the phone viewport: no engine timeouts, reload loops or restart storms;
  - every ledger regression test.
- The smoke stays lean. A large test matrix runs only when the change is about that area.

### 4. Green baseline
- The full suites must be green on the integration tree. The 27 known domain failures and the 11-12 clinical failures are resolved or explicitly retired before more feature work, so any red means something broke.

### 5. Releases
- **Freeze.** The build lane produces a candidate with a recorded commit, artifact hashes and the rollback version.
- **Gate.** Focused checks for what changed, plus the full unit suites, rebind/pacing, the standing smoke, and visual phone/desktop screenshots of the changed areas. Run them on a quiet machine. A gate that fails because the machine was loaded is rerun alone, not waved through.
- **Publish.** Owner standing approval for tested updates stays in force. The rollback version is recorded before publishing.
- **Live check.** HTTP 200 and the expected bundle hashes/strings, then the owner-save open on the live site where possible.
- **Post-release.** Pull problem reports about 1 hour after publishing, and again at the next session.
- New owner requests go to the next build. A frozen candidate isn't altered, except to fix a failure its own gate found.

### 6. Dispatch discipline
- Every brief is sent through a single dispatch script that appends a fixed footer of these standing rules. The footer covers: lane ownership, the base to start from, reproduce-first, regression test required, no Git, private-data rules, clinical rules, and the handoff contract.
- **Handoff contract.** A one-page HANDOFF with evidence links. The final message ends with the exact next action, or "DECISION NEEDED:" plus a recommended option.
- Long runs are detached and write a completion file. The manager never polls partial work.

### 7. Tree structure (owner decided: one line of work, D-2026-11-17-02)
The release tree becomes the single main line. Every change is built, tested and released there. Unreleased content (e.g. the question pilot) sits behind an explicit off switch. No more piece-by-piece porting. A one-time setup milestone brings the accepted main-tree work across: manifest-verified, with the full smoke. After that, the old development tree is read-only history.

Earlier analysis:
DCC uses one line of work: one copy of the code, everything committed to one branch by the manager, one change to the core at a time, and reviewers on scratch copies (git archive). No Hitter uses one build lane plus report-only lanes.
The two-tree arrangement (main development tree vs GS-release port tree) forces hunk ports, which is a regression source. Recommended: make the release tree the single integration line, with each milestone built directly in its own worktree branched from it, and unreleased content (e.g. the question pilot) behind explicit flags. The alternative is to keep two trees but port only by manifest with preimage verification plus the full smoke.
