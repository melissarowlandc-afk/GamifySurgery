# Staff Gym proof — corner correction v2

Review URL: <http://127.0.0.1:4191/tools/room-design/level-5/staff-gym/proof/index.html>. Exact path: `/tools/room-design/level-5/staff-gym/proof/index.html`.

The existing phone server serves the same files on port 4192 / tailnet HTTPS 8443: <https://melissadesktop.taile197db.ts.net:8443/tools/room-design/level-5/staff-gym/proof/index.html>. HTTP checks pass with matching bytes for all 33 resources on ports 4191 and 4192. This worker did not verify phone-browser/TLS behavior on 8443. No server, launcher or hosting change.

This proof holds no campaign saves. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile; saves do not transfer to the room-lab origins. No remote gameplay pathway changed.

The new `fixtureFloorFootprintOverlaps` check compares every pair of records declaring a floor footprint, in both Node and the browser geometry module. No pair or classification exception exists. Touching edges are legal; wall art, walkable floor/mat surfaces and the bench foreground declare no independent solid floor volume. A deliberately overlapping necessary/walkable fixture probe is rejected, and the archived candidate’s four original pairs are rejected.

Current corner regression: 11040 door/backing states / 1107920 fixture-pair checks, seventeen floor fixtures, zero overlaps. It also checks separate rear painted silhouettes, exact front floor edges and independently predicted front-over-side RGBA composites (native RGB tolerance 2 / alpha 1).

Full routes: 11040 states, 103680 routes / 81568960 radius-clear samples, plus 103680 occupied routes / 82187600 samples. Spacing remains 0.005 tile, actor radius 0.18 tile, full outside/inside portals included, with the other staff contact occupied and the bench foot band retained. Single/pair/all proofs and 690 monotonic comparisons still cover all 65,536 door combinations × sixteen backing states × five identical upgrade appearances. No furniture pass-through or radius reduction.

Closed-front regression still passes 17,920 visibility states, 2,880 occupied routes and all 480 front-view columns. All 335 shipped-handler control checks, 120 native render states, neutral geometry replay, helper syntax, two rebuilds, provenance and desktop/phone served bytes pass. Current fixture/mat paint covers 58.0% of the floor; equipment alone 46.1%. Visual density remains high; these metrics are not collision area or owner approval.

Run the current regular validator entry points; `validate-corners.cjs` is the new dedicated regression. `reconcile.mjs` and `assets/write-provenance-v1.mjs` delegate to their v2 implementations for compatibility. Construction scripts `bootstrap.mjs`, `configure*.mjs`, `begin-corner-revision-v2.mjs`, `apply-corner-v2.mjs` and `prepare-proof-v2.mjs` are one-time receipts and should not be rerun against the completed candidate. Normal rebuilding uses `build.mjs`. Original versions are retained in history.

The owner explicitly assigned the fresh browser rerun to the manager. Current v2 browser/capture reports are `PENDING_MANAGER` and pin the delivered manifest. This worker did not launch a browser in this correction. Prior v1 attempt/evidence receipts remain archived; no current browser PASS is claimed.

Manager, on the existing port-4191 server:

```text
node tools/room-design/level-5/staff-gym/proof/validate-browser.cjs
node tools/room-design/level-5/staff-gym/proof/capture.cjs
```

Inspect all four corners with doors closed and each owned doorway open, both staff contacts, routes, unchanged front continuity, desktop concept comparison and 320px layout. The browser validator now checks exclusive floor footprints in every state. Record verification of the correction and retain the owner’s approval of all other elements; update the manager-owned global handoff. No unresolved owner design question remains.

Exact executed outputs: `../validation-outputs-v2.json`. Current evidence: `evidence/v2/`; current handoff: `../WORKER_HANDOFF.md`.
