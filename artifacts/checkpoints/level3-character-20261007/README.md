# Character and Level 3 recovery checkpoint

Packaged October 7, 2026 from the accepted October 4 implementation. This is a scoped recovery archive on beta. It does not make beta a clean, runnable Level 3 checkout, and it is not a release or deployment. Compatible shared baseline code and earlier art remain prerequisites in other checkpoints or the preserved local worktree.

The payload includes all 32 accepted native character sheets and exact prompts/tool inputs, required generation references, 256 normalized poses and runtime copies, source-bound contact/alpha evidence, the approved seven room proofs and 82 promoted room images, feature-owned modules/tests, and baseline-relative patches for mixed files. Both surgeons have caps on all eight poses. Ten Level 3 staff appearances and six adult patients are active; four radiologists and 12 pediatric appearances remain future-gated. No pediatric clinical content was added. Finite compatible patient pools can eventually repeat.

## Recovery

1. Verify every payload in manifest.json with SHA-256. The manifest excludes itself to avoid a circular hash.
2. Review recovery/SOURCE_HASHES.json. Each patch requires the exact recorded pre-feature dirty-baseline hash for its target. Those mixed baseline files are deliberately not included. Restore compatible dependencies before applying any patch; do not apply patches blindly to Git HEAD.
3. Copy feature-owned files and selected assets from files/ to their recorded original paths. Treat required reference art as provenance dependencies, not additional selectable identities. Review historical candidate labels against documents/completed-feature-handoff.md.
4. Apply the target-specific patches only after baseline verification, then verify each resulting file against acceptedSha256. When a baseline differs, manually integrate only the feature hunks. The FacilityScene patch contains room/support rendering changes and no motion hunks.
5. Run the recorded domain, UI, asset, TypeScript, build and isolated browser validation before considering integration. The accepted October 4 receipt is historical evidence, not an October 7 rerun of gameplay.

Original native-output absolute paths remain immutable provenance metadata. Byte-exact workspace source/reference copies are archived; the external generated-image cache is not. Recovered validation scripts may require compatible GS026 extraction/reference tooling and prior asset manifests. The private playtest hostname is omitted from the copied task plan.

## Validation and limits

Accepted validation: 122 domain tests plus a final 64-test affected rerun, 42 balance tests, 21 UI tests plus a final 11-test rerun, all eight workspace TypeScript checks, player production build, and six integrated browser scenarios. The full player suite passed 576/579; three existing motion expectation/mock tests remain recorded. Fresh strict roster/runtime integration/room promotion checks passed during packaging. The older independent chair-proof validator now stops at its stale pre-Level3 approvedRoomPresentation file-hash pin; that historical proof is preserved without rewriting its approval hash. Accepted integrated browser evidence covers the final Level3 placement. See validation/ and the copied E2E evidence for exact fixture limitations. Automated tests are not clinical approval.

Canonical owner launch remains START_GAME.cmd at http://127.0.0.1:4173 in the same persistent browser profile. Accepted QA used isolated http://127.0.0.1:5173 and fresh contexts. No saves, profiles, launchers or origins are backed up or modified here.

## Exclusions

No owner saves, browser storage, credentials, private clinical inputs, clinical source corpora, build output, dependencies, diagnostic or-timeout-state.json, raw mixed baseline copies, unrelated reading-room/alerts/clinical/motion work, or unreferenced rejected source history is included. The checkpoint preserves only the character/Level 3 delta and necessary proof/provenance context. No merge, release, deployment or Pages publication is authorized by this backup.

Initial inspected HEAD: 30508ae912e56cc1b1c1bafb78cabcde92e6e4be. Packaging HEAD: 128267e413fc2cb761bf737f9450f344ea478416; another authorized beta checkpoint advanced during the shared session.
