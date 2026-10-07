# Level 3 integrated E2E validation

- **Origin:** `http://127.0.0.1:5173`
- **Storage:** fresh Playwright contexts, isolated from owner profiles and canonical `4173` storage
- **Final result:** 6/6 scenarios passed in 1.3 minutes with one worker
- **Typecheck:** `tsc --noEmit -p apps/player/tsconfig.json` passed
- **Cleanup:** owned Vite session 1496 stopped after validation

The suite proves the UI Level 2-to-Level 3 gate, all seven approved room cards, all five staff cards, reducer-built reachable rooms and doors, five unique Level 3 staff stills, including a capped surgeon, schema-9 reload, real laboratory queue and receipt timing, the scheduled ambulatory preparation/OR/recovery/receipt/QI path, exact seated break and office support rendering, default-context pharmacy and vending receipts, maintenance due/repair status, and compact management reachability.

The Level 2 qualification layout is seeded, but advancement uses the real UI gate. Level 3 construction and hiring use real reducer commands rather than pointer placement, with UI availability checked separately. The seated support screenshot directly stages accepted tasks to isolate renderer identity and pose; automatic assignment remains covered by domain tests. The clinical service, retail, maintenance, access, persistence, and receipt flows use the current default domain context.

`or-timeout-state.json` is retained as diagnostic evidence from an intermediate fixture bug: freezing idle scheduling at `MAX_SAFE_INTEGER` prevented normal post-retail home return. The final suite restores ordinary idle scheduling and passes.

