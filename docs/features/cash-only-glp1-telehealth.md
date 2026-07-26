# Cash-Only GLP-1 Telehealth Side Business

Status: Accepted feature direction; implementation split between the early
emergency action and a future Level 2 automated suite

Last updated: 2026-07-24

## Purpose and tone

This is a deliberately limited comedic side business, not the clinic's main
clinical or financial strategy. It begins as a slightly desperate emergency
cash action that can help a clinic escape a low-money death spiral. At Level 2,
it may become a modest automated business staffed by GLP-1 NPs.

Names:

- Preferred in-game room: **Cash-Only GLP-1 Telehealth Suite**
- Project shorthand: **GLP-1 NP Clicker Room**
- Comedic description: **Cash-Only GLP-1 Telehealth Mill**

The humor satirizes a cash-only telehealth mill. Operating the surgical clinic
must remain more profitable, educationally meaningful, and strategically
rewarding.

## Emergency founder consultation

Before the automated suite is functioning, the founder may personally perform
a rapid cash-pay GLP-1 telehealth consultation.

Accepted rules:

- The threshold is a centralized balance value. The original feature concept
  used below $100; the current Level 0-1 balance-test build temporarily uses
  below $200 so the recovery mechanic appears often enough to evaluate.
- It may be used at most once per facility hour.
- It provides a small immediate cash payment.
- It provides no Learning XP, FSRS review, concept mastery, ordinary
  patient-care reward, patient episode, or progression credit.
- It disappears or becomes disabled when cash is no longer below the
  threshold.
- Manual uses are counted separately for each facility day.
- After the fifth manual consultation in one day, messages become
  increasingly pointed. An accepted example is:
  “Your commitment to comprehensive metabolic care has been noted.”

The low-cash threshold, payment, daily cap, diminishing-return curve, cooldown,
message threshold, and flavor-text pool are stable balance/configuration
values. The runtime must not bury these numbers or messages in unrelated
gameplay code.

The first tuning should restore a struggling clinic without making deliberate
cash depletion or repetitive clicking attractive. The initial implementation
may combine a hard daily cap with sharply reduced later payments, provided the
values remain easy to change after playtesting.

## Player interface

When eligible, the manual action appears above the Waiting patient tabs on the
upper-left side of ordinary play. It is not a patient chart and does not enter
Waiting, Active, or Resolved.

The control shows:

- The immediate payment
- Whether it is ready or has already been used this facility hour
- Today's use count when relevant
- Sarcastic feedback after use

It is unavailable during Build Mode and does not advance facility time by
itself.

## Future Level 2 automated suite

The Level 2 **Cash-Only GLP-1 Telehealth Suite** may employ GLP-1 NPs and
automate a modest version of the side business. Its final room footprint,
staff maximums, salaries, throughput, unlock requirements, upgrades, morale
effects, events, and revenue remain future balance and design work.

The automated suite must:

- Remain bounded and secondary to surgical-clinic operations
- Require real room and staffing investment
- Have visible operating costs and capacity
- Produce no clinical-learning evidence unless a separately approved scored
  educational encounter is deliberately authored
- Avoid real prescribing, patient data, individualized medical advice, or
  runtime AI clinical generation

## Validation and testing

Tests must confirm:

- Eligibility uses cash strictly below the configured threshold
- The once-per-facility-hour cooldown survives save and reload
- Day-use counts reset only at the next facility day
- No XP, FSRS, mastery, patient settlement, or ordinary encounter reward is
  created
- Payments and limits cannot exceed configured bounds
- The action cannot become a superior sustained-income strategy in simulated
  play
- Sarcastic messaging starts at the configured use count

## Deferred details

- Exact payment, hard cap, and diminishing-return curve
- Remaining sarcastic message text
- Complete Level 2 room and GLP-1 NP rules
- Upgrade track and events
