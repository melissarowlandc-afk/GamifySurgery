# Ten-patient content audit

## Goal

Extract ten random patient presentations from the most recently implemented
100 concept groups, including every step and answer choice, so the owner can
give feedback before further content work. Preserve existing game wording.
Do not implement new concepts or silently repair the sampled questions.

## Scope and ownership

Terra `audit_sample_20260913` owns the review packet, separate answer key and
reproducible sampling manifest under docs/clinical-workbench/audits/. Temporary
extraction scripts may live under .local-dev/. No production edits, installs,
commits, pushes or browser campaign changes. Shared dirty work is preserved.
Astra verifies selection scope, reviews extracted text and delivers the packet.

## Selection and validation

The four September9–12 batches supply80 dated concepts. Determine the20 most
recent earlier active concepts from recorded admission/approval history; state
any date proxy or tie-break explicitly rather than using file modification time.
Record all100 eligible IDs, seed, selection algorithm and selected case IDs.
Use generated identity/profile and shuffled options through existing runtime
logic where possible. Include real test-wait estimates, return findings and all
subsequent decisions. Keep keys and explanations separately accessible.

Validate ten distinct patients, eligibility, exact text after runtime identity
substitution, complete node sequences, key/letter mapping and test timing.
No broad production regression is needed for a read-only extraction.

## Progress

Repository instructions and current handoff read. Root approved the pool:
80 concepts from September 9–12 exports plus 20 older active concepts ranked
by recorded approval/admission date, with a stable-ID boundary tie-break.
The one seeded draw selected 10 distinct cases from 240 eligible cases,
containing 12 decision nodes. No cases were substituted after selection.
Terra extracted the packet and root reviewed its wording and sampling logic;
root returned the omitted timing labels and exact explanation export for
correction. Terra completed those corrections and generated all artifacts from
the frozen JSON. Root independently verified all 100 IDs are active, ten cases
are distinct and eligible, and all presentations, stems, answer labels, updates,
explanations, shuffled answer letters and authored vitals are preserved. The
extraction Vitest passed (one test). Timing uses the actual selector with a
Level 2 prototype baseline, not the owner's save. Root made one tiny singular
hour formatting correction. No game content has changed. The packet and
separate key are ready; await the owner's numbered audit feedback before
further content implementation.
