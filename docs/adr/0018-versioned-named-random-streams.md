# ADR 0018: Versioned Named Random Streams

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Campaigns should feel different while remaining educationally fair,
reproducible in tests, and restorable from saves. Randomness may affect
identities, appearances, eligible presentations, arrivals, operational events,
breakdowns, call-offs, unavoidable complications, and cosmetic details. It
must not change clinical truth, prevent essential educational material, or make
progression depend on luck.

One undivided random sequence is fragile: adding an unrelated cosmetic draw can
shift every later arrival, failure, or complication. Browser-provided
`Math.random()` cannot be seeded or restored by the application and therefore
cannot reproduce a campaign.

## Decision

### Randomness contract

- Use a project-owned TypeScript implementation of `xoshiro128**` for the first
  randomness-contract version.
- Treat the complete contract as versioned: generator algorithm, seed
  derivation, byte encoding and endianness, stream registry and meaning,
  state-transition rules, integer-range mapping, probability comparison, and
  weighted-selection behavior.
- Permanently pin the randomness-contract version to every campaign.
- Retain an old contract implementation and its fixtures while any supported
  campaign depends upon it. Never silently change an existing version.
- Prohibit direct use of `Math.random()` or another unseeded source inside game
  domain rules.

`xoshiro128**` is a noncryptographic generator. It is used for game variation,
not authentication, invitations, passphrases, tokens, encryption, or any other
security purpose.

### Root seed and stream derivation

- Create one 128-bit campaign root seed from a cryptographically strong platform
  source during trusted campaign creation, then store it permanently.
- The root seed is campaign reproducibility data, not an authentication secret.
- Derive each named stream's initial state from a canonical SHA-256 input that
  includes a domain separator, randomness-contract version, root seed, and
  stable stream identifier.
- Pin the exact canonical byte encoding, word extraction, endianness, and
  all-zero-state handling in the version-one contract and golden fixtures.

### Independent named streams

The versioned registry must at minimum keep these purposes independent:

- Patient identity
- Patient appearance
- Arrival timing and selection
- Clinical presentation or variant selection
- General operational events
- Breakdowns
- Staff call-offs
- Unavoidable complications
- Purely cosmetic details

A stream represents one stable purpose rather than whichever feature happens
to request a number next. Existing stream meanings cannot be repurposed.
Introducing a new random feature uses a new stable stream or a new approved
contract version rather than consuming an unrelated stream.

### Save and selection behavior

- Store each initialized stream's exact state and draw counter in the versioned
  campaign snapshot.
- Save a generated entity's chosen identity, appearance, presentation, and
  other durable results rather than redrawing them when reopened.
- Record the stream identifier and draw counter with materially important
  generated events when needed for restoration or diagnosis. This is
  operational save provenance, not analytics or research telemetry.
- Sort eligible candidates by stable identifiers before random selection.
  Database order, object insertion order, rendering order, and localized text
  must not affect results.
- Use unbiased integer-range selection and integer probability thresholds.
  Do not use rounding or a biased remainder operation for weighted outcomes.
- The same root seed reproduces results only when the pinned versions, clinical
  adoption history, starting state, eligibility, and player actions also match.
  Different choices may legitimately consume different draws or make different
  events eligible.

### Educational and progression constraints

- Determine clinical correctness without randomness.
- Apply overdue priority, interleaving, clustering limits, confusion rules, and
  core-content guarantees before using randomness to break an eligible tie or
  select an appropriate presentation.
- Keep progression-critical guarantees deterministic and outside random chance.
- Define every probability per documented eligible task, entity, or unit of
  facility time, never per animation frame.
- A random outcome may influence operations, cost, timing, capacity,
  satisfaction, or unavoidable complications only within accepted content and
  balance rules.

### Verification

- Maintain golden output vectors for the generator, seed derivation, stream
  separation, integer mapping, and weighted selection.
- Test save/reload continuation, Start Over with the same seed, New Campaign
  with a new seed, clinical-release adoption, cross-browser execution, and
  multi-seed balance simulations.
- Require every random-domain call to pass a registered stream identifier and a
  stable purpose identifier so tests can detect accidental stream coupling.

## Benefits

- An unrelated draw cannot shift every other subsystem's future results.
- Saves resume the exact random sequence rather than rerolling.
- Bugs and balance problems can be reproduced from a campaign seed and saved
  state.
- Headless simulations can compare balance across many repeatable campaigns.
- The implementation uses JavaScript's deterministic 32-bit integer operations
  without requiring a large cryptographic library for ordinary game variation.

## Risks and limitations

- A determined player controlling the browser can inspect or manipulate the
  generator, consistent with the private-pilot integrity boundary in ADR 0017.
- A seed alone is not a full replay; versions, adopted content, prior state,
  eligibility, and player actions also matter.
- Developers must preserve old contract implementations and avoid inserting
  new draws into an old purpose.
- Named streams reduce cross-system coupling but cannot prevent coupling among
  calls intentionally made within the same stream.
- `xoshiro128**` must never be mistaken for cryptographic randomness.

## Alternatives considered

1. Use a cryptographic counter-based stream with the same named-stream model.
   This adds implementation or dependency burden without providing meaningful
   secrecy when the seed and browser are player-visible.
2. Use one global deterministic stream. This stores less state but makes every
   future outcome sensitive to unrelated draw insertion.
3. Use browser `Math.random()`. Its state cannot be selected, saved, or restored
   by the application, so it cannot meet campaign reproducibility.

## Cost and maintenance

There is no recurring vendor cost. Development and maintenance are moderate:
the project must own a small implementation, canonical seed derivation, stream
registry, state serialization, unbiased selection helpers, lint or review
guards, and cross-browser golden fixtures.

## Cost of changing later

Expensive for existing campaigns. A replacement would require retaining the old
implementation or migrating every stored stream state, revising simulation and
save fixtures, and accepting changed future events. Adding a new contract only
for new campaigns is manageable but creates permanent multi-version testing and
support.

## Technical references

- [Blackman and Vigna PRNG reference](https://prng.di.unimi.it/)
- [MDN: Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
- [MDN: Crypto.getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [MDN: SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
