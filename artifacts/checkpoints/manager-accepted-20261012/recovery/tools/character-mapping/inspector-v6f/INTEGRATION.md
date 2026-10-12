# Accepted inspector v6f runtime integration (M7b)

The October 11 manager visual acceptance in the character-gapfill plan and the
Level 5 M7b brief authorize these ten inspection-only identities. The separate
`artifacts/character-statics/inspector-v6f/runtime-approval.json` binds that exact
acceptance statement, eighty source pose hashes and forty authored contacts.
Original art-review pending labels, sources, contacts, galleries and proofs stay
frozen. No new art was generated, edited, mirrored or re-encoded.

Runtime PNGs live at
`apps/player/public/art/characters/inspector-v6f/inspector-v6f.NNN/`.
Registry/provenance rows append to the accepted 326-identity/2,638-asset prefix,
giving 336 identities/2,718 assets. The domain category is `inspector`, with
presentation role `inspection-agent`; the registry staff eligibility is empty.
The 179-patient and 99-staff pools do not change. Standing clipboard cardinals
use the existing hop motion. Seated poses/contacts are registered for fidelity
but inspectors never occupy seats or care contacts.

```powershell
node tools/character-mapping/inspector-v6f/promote-runtime.mjs --check
node tools/character-mapping/inspector-v6f/validate-runtime-integration.mjs
# After the normal player build:
node tools/character-mapping/inspector-v6f/validate-runtime-integration.mjs --dist
```

These checks are read-only. A promotion rerun without flags also validates and
makes no writes once integrated. The historical `validate-roster.mjs` retains
its old whole-runtime baseline, including `approvedRoomPresentation.ts` before
the accepted M2 room integration; direct invocation now stops on that changed
historical control. No historical validator or review evidence was weakened.
Use the scoped checks above for the accepted runtime seam.

Disposable QA uses the existing 5184 entry with `?level5=inspectors` or
`?level5=inspectors-arriving`, plus `&layout=desktop|phone`. Those saves remain
separate from the owner 4173/private-phone/remote origins. No Git, publication,
installation, clinical content or ordinary launch-cap change is included.
