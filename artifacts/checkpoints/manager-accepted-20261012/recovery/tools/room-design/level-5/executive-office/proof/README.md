# Executive Office proof - v4

Existing server:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>.

Private 3x2 Canvas proof; fixed corporate appearance at upgrades 1-5; ten door buttons and three north backing buttons. N2/S2 retain both occupied seats and fronts. Executive unchanged; visitor fixed anchor moves 0.14T north for south clearance. Prior item hides remain.

Enable passing adult, scrub route progress, step and reverse. Approved .007 standing stills face by segment; floor depth sorts against furniture and sitters. Closing a portal stops this example walker and retains both seats. W toggles, Escape resets. No campaign storage.

Validators:

- `validate.cjs`: unchanged sources/art, frames/alpha/contacts, five fixed upgrades, occupied seats, all single/pair/all-door states and every backing combination; full portal samples at 0.005T with existing 0.18T radius.
- `validate-walking.mjs`: shipped renderer, 510 depth samples and 20 chair/walker source-over composites in both directions; source alpha >=250, RGB tolerance 2/alpha 1 for rounding.
- `validate-controls.mjs`: shipped handlers, slider/step/reverse, retained seats and reset; browser CSS/accessibility remain separate.
- `inspect-native.mjs`: 100 rendered states, identical fixed appearance and both walkthrough directions.
- `reproduce.mjs`: two native rebuilds, 17 byte-identical files.
- `check-http.ps1`: 25 resources on port 4191.
- `validate-browser.cjs`, `capture.cjs`: manager Chrome checks for 2,280 states/20,400 routes, served hashes, overlap, controls/keyboard and 320px; 100 room captures plus five desktop/five narrow pages.
- `audit-lane.cjs`: history/art/shared hashes and assigned-plan-section preservation.

Current receipts/images: `evidence/v4/`. Worker browser launch blocked by spawn EPERM; explicit PENDING_MANAGER receipts. Native captures are engineering inspection, not browser/owner approval. Exact outputs: [../WORKER_HANDOFF.md](../WORKER_HANDOFF.md).
