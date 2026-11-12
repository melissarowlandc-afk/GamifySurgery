# Management chart / splitter assertion — 2026-11-11

**Diagnosis: stale test expectation, not a chart-fill layout bug.** No product
or CSS change is needed. Management yields to the current patient chart, which
is intentionally a floating, content-height sheet rather than the old full-desk
drawer. The map-shade camera policy is a separate concern and remains intact.

Evidence:

- `apps/player/src/ui/chartSheet.css:1–36` documents the owner-approved floating
  chart and defines fixed positioning with a preferred 1,040 px width.
- `ChartPanel.tsx:85–112` explicitly centers/clamps its width to the main play
  area, pins short content to the desk top, and taller content to the desk bottom.
  Tall charts may extend above the desk; short charts need not reach its bottom.
- The placement hook (`ChartPanel.tsx:127–187`) observes the desk and content and
  recomputes after resizing. It uses DOM bounds, not the facility camera/zoom.
- `global.css:5127–5131` fills only the legacy `.chart-drawer`, not `.chart-sheet`.
  `AppShell.tsx:1056–1071` renders the current ChartPanel after Management yields.
- The removed e2e assertions required *all four* chart edges to match the desk
  within 4 px. That contradicts the above contract. Retained
  `.local-dev/tmp/layout-e2e4.log` shows 54.1875 px left difference on desktop and
  56.6875 px top difference on laptop. Current management error-context files
  were no longer present in test-results (overwritten by later map tests).

Changes:

| File | Change |
| --- | --- |
| tests/e2e/management-mode.spec.ts | Replace full-desk edge equality with polled actual geometry: preferred/clamped width, horizontal placement, short/top versus tall/bottom pin, content-height cap and play-area containment. Keep Management removal, hidden mode triggers, close/return and overflow assertions. Also resize with the chart open using the keyboard and verify desk movement and re-anchoring. No sleeps or larger timeouts. |
| apps/player/src/ui/chartPlacement.test.ts | Add four cases for the width cap and growing/shrinking desks with short, intermediate and tall content, including anchor transitions. |
| This report / CURRENT_THREAD_HANDOFF.md | Bounded handoff. |

The new geometric checks retain 1 px position/width and 2 px natural-height
rounding allowances. They do not simply raise the old 4 px tolerance or require
only visibility. A missing, collapsed, wrong-sized, stale-positioned or
out-of-bounds chart fails with measured differences. No production-module import
was added to Playwright. All **404 captured player runtime/CSS hashes unchanged**.

Validation (sandbox, no browser):

```text
CI=true npm.cmd test -- --pool=threads src/ui/chartPlacement.test.ts src/ui/workspaceChartPriority.test.tsx src/ui/workspaceSplitter.test.ts
Test Files  3 passed (3)
     Tests  18 passed (18)
  Duration  7.39s
exit 0

npm.cmd run typecheck --workspace @gamify-surgery/player
exit 0

./node_modules/.bin/tsc.cmd --noEmit -p .local-dev/management-mode-splitter-test-20261111/tsconfig.e2e.json
exit 0
```

Raw logs/originals/scoped diff:
`.local-dev/management-mode-splitter-test-20261111/`. Shared edits preserved;
no clinical/domain/balance/runtime changes, Git, installs, network or agents.
This is a local uncommitted handoff; manager owns review/checkpoint/release.

Manager rerun against the fresh QA server (browser execution remains unverified):

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER='1'
$env:GAMIFY_E2E_BASE_URL='http://127.0.0.1:5184'
npx playwright test tests/e2e/management-mode.spec.ts --project=desktop-chrome --project=laptop-chrome
npx playwright test tests/e2e/splitter-map-shade.spec.ts --project=desktop-chrome --project=laptop-chrome --project=compact-desktop-chrome
```

In the chart-priority case, confirm the chart opens, replaces Management,
re-anchors after the additional keyboard resize, and Close restores the mode
triggers. The dedicated shade spec still owns zoom/origin/bottom-edge assertions.
The QA origin is disposable test storage, not the owner's canonical local saves;
the owner launch pathway is unchanged.
