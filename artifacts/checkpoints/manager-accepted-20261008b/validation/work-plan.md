# Second recovery archive preparation

Goal: preserve the manager-accepted work after checkpoint 76f0fdb8451f05465a04b5422deec3f5961478ee, including the two first-archive gaps at their current accepted state. The Claude Code GamifySurgery manager owns acceptance, staging, commit, push and remote verification.

Requirements: follow the first archive's structure; exact whole files for new owned targets, exact patches with bundled HEAD/first-archive bases for shared targets; forward/reverse/reapply proof; UTF-8 without BOM for new metadata and scripts; under 400,000,000 bytes total and no file above 50,000,000 bytes. Preserve the first archive and all unrelated/shared live files.

Ownership: only artifacts/checkpoints/manager-accepted-20261008b/** and ignored preparation scratch .local-dev/manager-accepted-20261008b/**. No worker delegation, dependency installation, Git mutations, browser or owner campaign access.

Authoritative scope: docs/execplans/owner-requests-20261008.md Progress and all worker handoffs, the manager's explicit brief, room design approval records, exterior frontage/landscape plans, and existing hash-bound validation receipts. Founder's Office is a design-pending candidate; design approval is separate from runtime promotion and clinical approval.

Exclusions: active room-economy audit and active-worker files; owner saves/browser storage; secrets; private/proprietary sources; installed/build caches; raw large local logs and regenerable comparison/image histories. Record excluded candidates and sizes without reading prohibited payloads.

Milestones and acceptance:

1. Inventory first archive's recoverable accepted states and current scoped files. Capture source hashes and acceptance references; detect concurrent drift and missing ownership evidence.
2. Build recovery payloads and exact shared-file patch contracts. Inventory exclusions and bind approved-room hashes. Enumerate archive and wholly owned, stable docs/records only in STAGE_PATHS.txt.
3. Run hash/size/patch/restore verification, check-ignore and safety audit, and clinical-review invariance checks. Audit diff/index/first-archive invariance and report source drift. Do not claim historical test output was rerun.
4. Hand back archive size, counts, exclusions, validation, manager decisions and exact audit/staging commands. Manager records the verified backup receipt in CURRENT_THREAD_HANDOFF.md after pushing.

Repository state: HEAD is 76f0fdb8451f05465a04b5422deec3f5961478ee; the shared tree contains substantial earlier uncommitted work and accepted October 8 changes. The economy proposal is the known active independent lane. Do not stage mixed live implementation or coordination documents.

Progress: all four worker milestones complete. Frozen selection covers 860 targets: 786 whole files and 74 verified patches (20 first-archive patch-result bases, 10 first-archive whole-file bases, 44 HEAD bases). The two prior recovery gaps are resolved at current accepted state. All 40 approval-record hashes match. Safety, clinical labels, first-archive/index/tracked-diff invariance and all selected live-source hashes pass. A real disk restore reproduces all 860 targets and 112,528,082 selected source bytes exactly. Known prior player test failure is retained as historical evidence, not hidden.

Next action: manager inspect the archive and original-record staging lane, rerun the verifier immediately before staging, and perform the authorized checkpoint commit/push/remote verification. Record the verified branch/commit in the shared current handoff. The worker does not write that shared manager coordination file.
