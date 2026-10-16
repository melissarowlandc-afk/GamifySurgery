# Private Tailscale development playtest

Use `START_PRIVATE_GAME.cmd` on the desktop to start a second Vite development
server on `127.0.0.1:4174` and proxy it privately through Tailscale Serve.
Open this stable URL from a device signed in to this tailnet:

`https://melissadesktop.taile197db.ts.net/`

The server watches the shared checkout. TypeScript/source edits and public asset
edits are served from the desktop without a build, GitHub push, pull, or public
deployment. The private config accepts only this MagicDNS host, uses WSS on 443
for Vite HMR, and limits Vite's `/@fs` development access to the player and its
runtime workspace dependencies. Private clinical workspaces remain denied.
Its development-only Vite settings are in
`scripts/vite/private-tailscale.config.ts`.

`START_GAME.cmd` and `http://127.0.0.1:4173` remain the canonical local owner
playtest pathway and are not managed by these scripts. The private endpoint has
its own process and port, so stopping it does not stop the canonical launcher or
other local development servers.

Run `STOP_PRIVATE_GAME.cmd` to remove only this private Serve route and stop
only the Vite process recorded by the private launcher. The script refuses to
change a non-exclusive or unrelated Serve configuration; inspect with
`tailscale serve status` if that happens. It never uses `tailscale serve reset`.
For an explicit restart, run `STOP_PRIVATE_GAME.cmd`, then
`START_PRIVATE_GAME.cmd`. The start command alone reuses a healthy private
server. It reports the exact private URL when the backend health check and
private Serve route are both ready. Check the route with `tailscale serve
status`; private backend logs are under `.local-dev/tailscale-dev/`.

Tailscale Serve is restricted to tailnet members under the tailnet ACL. These
scripts do not configure Tailscale Funnel, open firewall ports, change system
startup, or change sleep/login settings. After a desktop reboot, run
`START_PRIVATE_GAME.cmd` again once Tailscale is connected. If Tailscale asks
for HTTPS/Serve consent, complete that Tailscale prompt and rerun the start
script; do not enable Funnel.

The Tailscale URL and laptop browser are a separate browser origin from
`http://127.0.0.1:4173`. Their local game saves do not synchronize. Do not use
this setup to reset or migrate a campaign. Clinical game content remains draft
and subject to clinician review.

The desktop must remain powered on, awake, logged in, connected to Tailscale,
and have the private server running for the laptop URL to work. The launcher
window can close after it reports readiness. If the Vite backend stops, rerun
`START_PRIVATE_GAME.cmd`; the Tailscale Windows service normally remains
available, but the project development server is intentionally manual.

Reference: [Tailscale Serve command](https://tailscale.com/docs/reference/tailscale-cli/serve)
describes the persistent tailnet proxy configuration; [Vite server
options](https://vite.dev/config/server-options) describes the development
server and HMR settings used by this manual backend.

## Validation and handoff (September 29, 2026)

Desktop-side setup is active and tested. Private HTTPS page, launcher health,
source modules, and a real founder PNG returned 200. Disposable Chrome entered
Clinic Campaigns with no page errors or failed requests; it used the exact
`wss://melissadesktop.taile197db.ts.net/` live-update socket. A reversible HTML
edit triggered a reload, and a temporary public asset reflected changed bytes;
both fixtures were removed/restored. Restricted repository filesystem access
returned 403. Stop/start preserved canonical 4173 and unrelated 4198 listeners.
Boundary and launcher contract checks passed. No owner browser storage was used.

The laptop has not yet been tested directly. With Tailscale connected there,
open the private URL and confirm the prototype/campaign screen appears. This
is the only remaining end-to-end check. Desktop edits remain local and unpushed.
