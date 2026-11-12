# Content-robust late campaign pacing

## Goal and ownership

Measure release32's654-meaning pool and the accepted batch3 pool with the same
current domain/balance, then correct the mechanism that moves first finish from
22690 to37801. Both contexts must finish within8% of22690 (20875–24505), with
zero walkouts and positive cash. Keep accepted prices and lateProgression earned
goal protection. Preserve existing saves and frozen encounters. Add a reproducible
guard flagging a future default pool that moves first finish more than10%.

Owned files are domain, balance and simulation code/tests, this plan, research
handoff and the appended current-thread handoff. Clinical content, manifest and
topic files are concurrent lanes. GS-release is read-only. No Git, agents,
commit/push/deploy/install, network or evidence rebind.

## Milestones and acceptance

1. Freeze public inputs. Compare both clinical contexts using identical balance,
   driver, seed and answer policy. Record answers/accuracy/XP per hour, goal
   crossing times, patient-score/condition attribution, completion waits, case
   lengths and selection/novelty effects. Identify the actual limiting goal.
2. Trial a minimal domain/balance correction to the measured dependency. Require
   both contexts within20875–24505 first finish before choosing production.
   Preserve earned unlocks and the lateProgression policy. Test the changed goal
   semantics and legacy/frozen-save behaviour through normal reducer commands.
3. Add a CHECK-only pacing guard usable without private files. Validate focused
   domain threaded tests, domain typecheck, full native arm measurements and the
   guard. Report exact totals and changed Level5-bound inputs without rebind.
4. Handoff docs/research/content-robust-pacing-20261111.md with before/after arms,
   source evidence, design, validation, risks and manager integration notes.

## Intake and progress

The prior binding task measured identical before/after batch3 CHECK results:
47628commands /9449993cents /744completions /0walkouts, unlock34743 at5332XP,
firstfinish37801, final44518. Release32 current goal values are550/790/2300,
firstfinish22690. Existing Level5 eligibility requires XP, displayed satisfaction
above90 and morale85 simultaneously. Displayed satisfaction is rounded last-ten
ended-patient score minus reversible current facility penalties. Both per-answer
care changes and per-patient completion/check-in effects enter that score.

## Diagnosis and selected correction

Identical-runtime baseline arms reproduce22690 vs37801 first finish. The first
2300XP occurs16659 vs16837 (178minutes apart). Waiting after XP until the old
displayed-satisfaction gate is2973 vs17906minutes, accounting for14933 of15111
extra minutes. First180 Level5 hours have232 vs233 answers (10.8444 vs10.9XP/h),
and mean completed episode length74.98 vs60.24minutes. Accuracy remains80%.
At2300XP both have96 recent patient satisfaction, but the HUD is90 vs88 after
current penalties6 vs8. Dirty rooms4 and unavailable onsite Xray2 dominate;
patient visits already recorded these conditions on check-in. The current overlay
and last-ten completion order create a rare simultaneous threshold window.

Private historical-only trials prove the early goal boundary but expose that the
unlock witness must freeze the new goal percentage. Their snapshot reader
correctly rejected a witness below91 when it still stored the HUD percentage.
The selected implementation freezes the displayed goal percentage in the same
existing field, retaining legacy record validation and shape. No schema change.

Private established-volume trials with330 completed encounters finish22690 in
both pools,0walkouts.330 is the release32 completed-encounter total at its existing
unlock, calibrated through the existing cumulative counter. Patient ratings are
evaluated once for late progression. Level5 requires330 completed encounters to
establish that goal; the three existing requirement IDs remain. Guidance gives
the outstanding encounter count. Existing unlocks retain volume credit, and
lateProgression policy/XP goals remain intact. The current HUD still reports live
condition pressure, while progression labels explicitly say recent patient
satisfaction. This is an editorial volume requirement, separate from clinical
relationships.

## Implementation and validation progress

Production correction installed in selectors/reducer, the330 balance field,
goal guidance and the witness-field comment. QA history fixtures now represent
an established clinic. The initial focused run found stale Level4 boundary
expectations and synthetic fixtures with zero history; fixed those fixtures and
equivalent goal assertions while retaining whole-state persistence guards.
Focused final6domain files189/189 pass (23.34s), domain typecheck exit0, focused
balance2files6/6 pass (0.357s). All cost/reward checks remain exact.

Added tools/qa/content-pacing-check.mjs. It runs the original native journey to
the first finished inspection and rejects more than10% drift from22690, any
walkout or nonpositive closing cash. Its3 Node tests pass with test isolation
disabled for the Windows sandbox. Production final654/813 arm measurements and
the actual current-default CLI guard are running. No clinical or evidence edit.

## Completed validation and handoff

Final production arms both finish22690. Release32 has24361commands,
5481255closing cents,379completions and0walkouts. Batch3 has24321commands,
5386575closing cents,380completions and0walkouts. Both unlock19632, at2854XP
and2802XP respectively. Their minimum cash is1452073/1505654. These totals
end at first finish and use the original cash-reconciled native command loop.

The closing rewrite-lane repair changes109 wording leaves across the accepted
bank, with identities, labels, correctness, demographics, timing and capability
data equal. The clinical hash movesabafea108... tod496267f... with the same
1250cases/1514nodes/813registered/646scored meanings. The actual current-default
guard also passes at22690/5386575cents/380completions/0walkouts and records the
repaired hash. Both snapshots and the precise wording diff are retained.

All final validation passes. Focused domain6files190tests,20.64s. Additional
guidance/launch3files27tests,10.20s. Domain typecheck exit0,3.15s. Balance2files
6tests,357ms. Guard3unit tests,16.72ms. A newly qualified locked legacy campaign
earns its unlock on the next normal command with its preserved2000-XP goal.
Existing unlocked records keep their original witness at fewer than330 visits.
Whole-state persistence and frozen-case assertions pass.

Scope audit finds five changed bound runtime inputs, selectors.ts,reducer.ts,
guidance-progression.ts,level-five-types.ts and balance level-five-progression.ts.
Prototype price/reward/XP bytes and the original native driver match intake.
All7 captured Level5 JSON hashes match intake. The lateProgression source and
saved shape match their original contract. The only balance value change is
the330-encounter qualification. The existing three goal IDs and percentage
presentation expose the revised goal through domain labels/guidance.

Research handoff docs/research/content-robust-pacing-20261111.md contains exact
before/after tables, source evidence, field/save semantics, commands, cumulative
counter scope and risks. Private receipts are in the task directory. This
bounded milestone is complete for manager review/port and subsequent binding.
All writes were in the main workspace. No release-tree write, Git, commit/push,
deploy, agent, install, network operation or evidence rebind was performed.
