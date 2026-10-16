# Private Tailscale live-development game

## Goal and requirements
Serve this shared desktop checkout privately to the owner's laptop through one stable Tailscale URL. Reflect source and asset edits promptly with development watching/live reload. Preserve START_GAME.cmd and http://127.0.0.1:4173, all saves, clinical draft notices, and concurrent work. No Funnel, public deployment, broad firewall changes, dependency installation, Git commit or push.

## Repository state
2026-09-29: branch beta; extensive pre-existing dirty source, assets, tests, and handoffs. Baseline status saved under ignored .local-dev/tailscale-dev/baseline-status.txt. START_GAME.cmd invokes scripts/Start-Prototype.ps1, which already starts Vite development mode at canonical loopback 4173. Existing launcher itself has unrelated edits. Base Vite config binds 127.0.0.1 and uses private-module boundary plugin. Normal sandbox runtimes fail before execution (CreateProcessWithLogonW 32); approved direct shell works.

## Constraints and decisions
Use native CLI and filesystem interfaces. Inspect Tailscale Serve state/listeners before changes and preserve unrelated endpoints. New Tailscale origin and laptop browser have independent local saves: no migration/reset/sync. Background helpers hidden. Do not change sleep, login, service or boot settings without scope justification. Parent owns planning/integration/review; one write-capable worker at a time.

## Milestones and ownership
1. Terra tailscale_setup: read-only runtime/Serve/launcher investigation and recommendation (active).
2. Terra tailscale_setup: bounded implementation of separate private dev launcher/config/lifecycle and durable documentation after parent decision.
3. Terra tailscale_setup: activate authorized scoped proxy/backend and validate source/assets/change propagation; parent independently inspect diff and evidence.
4. Parent: document tested limits, exact URL and reboot/restart requirements, update current handoff; request smallest laptop check if remote client unavailable.

## Acceptance and validation
- Backend loopback only; unrelated existing listener/services preserved.
- Private Serve route resolves to live development server; no Funnel enabled.
- HTTP shell and representative game assets/modules succeed through proxy.
- Browser renders game and retains prototype notice; WebSocket/HMR or reload changes observed through proxy using reversible fixture, cleaned afterwards.
- Start/status/restart/stop lifecycle checks; preserve existing local launcher contract checks.
- Inspect actual scoped diff and ensure no gameplay/save/clinical edits.
- Document whether laptop end-to-end was tested; no claim of untested access.

## Progress, discoveries, next action
- Instructions, current handoff, dirty tree and initial launcher/Vite configuration read.
- Terra inspection delegated; official Tailscale Serve and Vite server documentation consulted.
- Next: choose exact port/URL based on existing native state, then delegate implementation.

### Milestone 1 decision
Terra inspected Tailscale 1.102.4: Running/Auto service, desktop online, MagicDNS melissadesktop.taile197db.ts.net. Serve and Funnel config initially empty. Existing owner Vite PID47380 loopback4173; unrelated Vite PID38268 loopback4198. Selected separate hidden Vite on loopback4174 (if free), private HTTPS443 Serve root -> that backend, stable URL https://melissadesktop.taile197db.ts.net/. This preserves the owner launcher lifecycle. No autostart or power changes. Terra now owns new private launcher/stop/config/runbook files and scoped activation/validation. Base launcher and game logic outside scope.

### Activation and parent review
Private HTTPS route activated successfully without consent blocker. Parent independently received HTTP200 with Vite client, source entry and Synthetic Prototype title through https://melissadesktop.taile197db.ts.net/. Native Serve JSON maps exact443 root to http://127.0.0.1:4174 with HTTPS and no AllowFunnel. All listeners remain loopback; owner4173 PID47380 and unrelated4198 PID38268 preserved. Initial code review returned lifecycle ownership/structured route validation and full sensitive-file deny defaults to Terra before acceptance. Reversible browser HMR/assets and lifecycle validation remain underway.

### Validation progress and remaining correction
Browser evidence from Terra: private Chrome render and Vite connection, reversible HTML source reload and changing temporary public asset through proxy; cleanup underway. Parent checks health/main-module200, restricted repo /@fs403 and preserved six launcher/config hashes. Parent launcher contract PASS. Boundary verifier found private config denylist markers under apps/player (scanner treats these as forbidden references); returned to Terra to relocate the config under scripts/vite without weakening security or verifier. Final restart/browser proof must use relocated config. No laptop end-to-end claim yet.

### Desktop acceptance (2026-09-29)
Terra tailscale_setup completed investigation, six-file implementation, scoped activation, hardening corrections, relocated-config boundary fix, reversible reload/assets proof and stop/start lifecycle. Parent reviewed actual files and evidence and independently passed boundary2480 + launcher contract, canonical six-file SHA256 preservation, idempotent Windows PowerShell start, exact private Serve JSON without AllowFunnel, HTTP200 health/main/PNG720496bytes, restricted repository /@fs403, and ephemeral Chrome enter-local-prototype to Clinic Campaigns with zero page errors/failed responses and exact WSS tailnet hostname. Screenshot visually reviewed: .local-dev/tailscale-dev/parent-private-game.png. Terra evidence: .local-dev/tailscale-dev/validation-evidence.json. Temporary HTML diff empty; probe asset removed. Backend left running, private route active. No save/clinical content edits, commit, push, public deployment, firewall, startup or power changes.

## Next action / completion boundary
Desktop implementation and independently possible validation complete. Owner should open https://melissadesktop.taile197db.ts.net/ on the Tailscale-connected laptop and confirm the prototype/campaign screen. Laptop network/ACL/browser end-to-end remains untested; keep this task available for that result. Scripts/runbook remain local only; remind owner to say "push to GitHub" for an audited backup, distinct from deployment. Start after reboot/login with START_PRIVATE_GAME.cmd; stop with STOP_PRIVATE_GAME.cmd; explicit restart is stop then start. Desktop must stay awake; no boot automation installed.
