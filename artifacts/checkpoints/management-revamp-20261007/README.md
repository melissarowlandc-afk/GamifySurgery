# Management mode revamp and plain employee names: recovery archive (2026-10-07)

The owner approved this work in chat. Claude Code designed it as a clickable
mockup first (private artifact https://claude.ai/artifact/HWY5RZoqjv5CXXKXWKYQZe),
the owner approved every part, and then Claude built it into the game. The
owner then asked for plain employee first names and said "push to GitHub".
Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md` §4.

## What it changes

1. **Management mode has three tabs: Employees, Services and Money.**
   - Employees: one header with a "Clinic paused" tag; a summary line (staff,
     payroll per hour, average morale, Training Room use); collapsible role
     sections whose header keeps the count, average training, morale, payroll
     and Hire; employee cards with a minimum width that flow into columns;
     "Morale 82%" beside its bar; "Salary − $24/hr +"; Fire moved to a quiet
     link with confirmation; dashed "Open position" slots with Hire.
   - Training (GS-037): nothing training-related shows until a Training Room
     is built. Then each card shows level pips (Lv 1-5), the training status,
     and a Train popover with current level, cost, gain and the role-average
     benefit after training. The role header shows the role's average level
     and benefit, as the owner directed.
   - Services: problems that stop income first; services grouped Earning now /
     Needs a room or staff / Higher facility levels, with Build or Hire
     shortcuts; how each service earns; the laboratory queue on its own row;
     the appointments switch explained; in-progress work; Level 3 upkeep.
   - Money (since the clinic opened): Earned, Running costs and Profit; the
     hourly cost split; cash runway; earnings from recent payments; a
     payments table with times.
2. **Plain employee names.** New hires skip first names already in use
   instead of getting "Sam 2". The name list grew from 22 to 56 neutral first
   names. Loading a save renames numbered or repeated employee names to
   unused plain first names. IDs and history are unchanged.

## Contents

- `files/`: complete copies of files that are wholly this work.
  `managementViewModels.ts` also contains Codex's documented GS-037
  integration fix (it now uses the domain's unrounded role-average percent).
- `recovery/patches/`: unified diffs of only Claude's hunks in shared dirty
  files. Each baseline was rebuilt by reversing exactly these edits.
  `recovery/patch-verification.json` records that `git apply` of each patch
  to its baseline reproduces the live file byte for byte (SHA-256 included).
- `manifest.json`: SHA-256 of every archived file.
- `validation/results.json`: test, typecheck and browser QA record.

## Restore

Copy `files/` over the repository root. Then apply each patch:

```
git -c core.autocrlf=false apply recovery/patches/<file>.patch
```

Patches need surrounding code compatible with the shared tree at this
checkpoint, including Codex's uncommitted GS-037 training domain and
view-model work (`employeeTrainingViewModels.ts`, `trainEmployee`,
`getEmployeeRoleTrainingPercent`). If a hunk no longer applies, re-apply it by
hand from the patch text.

Not included: Codex's and other sessions' concurrent uncommitted work in the
same files, the owner's saves, and the temporary QA harness (deleted).
