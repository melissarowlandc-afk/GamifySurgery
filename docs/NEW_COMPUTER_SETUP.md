# Continue Gamify Surgery on a new Windows computer

Install Git, Node.js **24.18.0** (the repo's `.node-version`; package engine
minimum is 22.12.0) and npm **11.16.0** (the repo's `packageManager`). Then in
PowerShell:

```powershell
git clone --branch backup/new-computer-2026-09-22 --single-branch https://github.com/melissarowlandc-afk/GamifySurgery.git
cd GamifySurgery
node --version
npm --version
npm ci
npm test
npm run build
.\START_GAME.cmd
```

Open the local game at the exact URL `http://127.0.0.1:4173` in the browser
profile you intend to keep using. Let the launcher finish before opening the
page. `localhost` and other ports have separate browser storage. Game saves
in an old browser profile do **not** arrive through Git. Use only an existing
supported game export/import path if you separately choose to transfer a
campaign. The remote Pages site likewise has separate saves; this checkpoint
branch does not publish it.

Read `docs/handoffs/GS-024_NEW_COMPUTER_TRANSFER.md` and the current feature
handoffs/ExecPlans before resuming work. The checkpoint includes unfinished
design and art records for continuation; their existing approval labels still
govern use in the game. A fresh clone includes the game's needed checked-in
assets, but private character references, rejected/source art and local clinical
inputs are deliberately absent from this public repository. If continuing the
optional image/character pipelines, retrieve those from the owner's separate
whole-computer transfer and follow the corresponding handoff. Some optional art
scripts reference paths on the original computer and need local path adjustment;
the game launcher does not require those scripts. Provision any external art
services or credentials separately if that workflow needs them. Never commit
secrets or proprietary clinical sources.

Codex task conversations, settings and account credentials are outside Git.
The repository's handoffs and plans are the durable development record.

For the same bounded-concurrency unit run used to verify this checkpoint, use:

```powershell
npm run test:boundaries
npm run test --workspaces --if-present -- --maxWorkers=1
```

This runs all workspace suites serially per workspace. On a busy Windows host,
the default parallel run can time out the larger simulation tests.
