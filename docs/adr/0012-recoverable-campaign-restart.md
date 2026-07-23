# ADR 0012: Recoverable Campaign Restart

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: YELLOW

## Context

The player must be able to start over at any time when dissatisfied with prior
choices. A restart must return to the beginning without risking one-tap
campaign loss, corrupting immutable learning or finance evidence, rerolling the
campaign merely for favorable randomness, or resetting the player account.

## Decision

- Provide Start Over at any point through at least two deliberate interactions.
- Pause facility operations before showing the confirmation.
- Use consequence-specific wording rather than a generic confirmation.
- Position the final destructive-looking action separately so a rapid
  double-tap cannot trigger both steps.
- Save and archive the current campaign as recoverable and read-only.
- Create a new campaign ID with fresh facility, progression, and
  campaign-specific FSRS state.
- Preserve the prior campaign's root seed, core-concept set, balance release,
  FSRS integration version, and random-generator version for the retry.
- Under subsequently accepted ADR 0015, use the prior campaign's current
  adopted clinical release as the retry's initial clinical release. The retry
  then has its own future clinical-adoption history.
- Create the archive and retry in one trusted transaction. On failure, leave the
  original campaign active and unchanged.
- Keep the player account, display profile, authentication, and account-level
  preferences unchanged.
- Restore an archived campaign only by resuming its original state and learning
  schedule; never merge it with the retry.
- Use the separate New Campaign action when the player wants a new seed and the
  currently published releases.
- Keep permanent deletion as a separate, more strongly warned action governed
  by the later retention and account-deletion policy.

## Benefits

- Accidental restart is recoverable.
- Immutable review and money evidence is preserved rather than rewritten.
- The player can retry decisions against the same campaign baseline.
- Start Over cannot be used merely to reroll favorable initial randomness.
- Restart behavior remains distinct from creating a genuinely new campaign.

## Risks and limitations

- The campaign list needs an archived section and restore controls.
- Archived campaigns consume a small amount of storage.
- Players may accumulate several archived attempts.
- Different choices can change later random eligibility, so the same seed does
  not guarantee an identical event sequence.
- Retention, permanent deletion, and backup expiry still need approval.

## Alternatives considered

1. Archive the prior campaign but use a new seed and current releases.
2. Permanently erase or overwrite the campaign during Start Over.

## Cost and maintenance

Storage cost should be negligible for the pilot. Maintenance is low to moderate
and includes campaign-list behavior, atomic lifecycle tests, restore tests,
privacy retention, and clear confirmation wording.

## Cost of changing later

Manageable before the pilot. After players create retries, a change would
require lifecycle migrations, campaign-list redesign, revised privacy wording,
and possible seed and version compatibility work.
