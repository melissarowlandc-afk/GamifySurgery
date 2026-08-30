# Canonical Character Atlases

These transparent, original character layers are the production art payload for
the persisted `headVariant` and `bodyVariant` fields.  Every sheet is a 5 by 6
atlas in the stable preset order: variants 0–9 human masculine, 10–19 human
feminine, and 20–29 non-human.  A rendering surface must compose a head and a
body with the same saved descriptor; it must never substitute a randomized
portrait or role-specific identity.

## Source and processing

The v1 pack was generated with OpenAI image generation from the approved
project-owned `Photos for Codex` character references, then normalized into
transparent PNGs. The prompt family requested crisp, original, high-detail
management-game characters with natural hair/skin colors, white coats and
clinical clothing, front/side/back, idle/walk/seated/working/interaction
poses, and no copied commercial-game artwork.

`tools/preprocess-character-atlases.mjs` uses connected edge-background
removal rather than a global white key so white coats, eyes, and paper props
remain intact. It is preprocessing only, not a browser dependency.

The live renderer uses the normalized v2 sheets under `v2/`. The original v1
contact sheets intentionally remain as source material because their authored
figures have uneven row heights and different head/body margins. The
normalizer measures their real inter-figure boundaries, trims one figure at a
time, and places it in a common transparent 160 by 240 composition cell. In
that cell, every head ends at the same neck datum and every body meets the
same floor datum. React and Phaser both compose those complete cells at one
origin; they must not independently offset or scale a head relative to its
body.

The live pack includes front/left/back heads and front/left/back idle bodies,
left walk A/B bodies, front seated/working/star-jump bodies, and left
interaction bodies. Every sheet follows the same order, so adding a pose never
changes a campaign save or appearance ID.

## Display-only role outfit pools

Saved `bodyVariant` values are immutable identity inputs. The renderer maps
only the displayed body layer for non-founder roles: patients use casual
human variants, receptionists use front-office/business variants, imaging and
nursing/phlebotomy roles use clinical/scrub variants, endoscopists and NPs use
coat variants, and EVS uses practical workwear. Founder and non-human variants
remain direct. This avoids reclassifying a patient as staff while retaining a
stable, deterministic presentation across reloads.
