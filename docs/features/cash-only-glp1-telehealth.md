# Cash-Only GLP-1 Telehealth Side Business

Status: Accepted feature direction; implementation split between the early
emergency action and a future Level 2 automated suite

Last updated: 2026-07-27

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

- During the Level 0-1 pilot, the action is available only when clinic cash is
  below the centrally configured low-cash threshold (currently $200).
- It may be used at most once per facility hour.
- It provides a fixed $25 immediate cash payment.
- It provides no Learning XP, FSRS review, concept mastery, ordinary
  patient-care reward, patient episode, or progression credit.
- Manual uses are counted separately for each facility day.
- There is no daily usage cap and no diminishing payout. Daily counts exist
  only to select escalating sarcastic copy.
- After the fifth manual consultation in one day, messages become
  increasingly pointed. An accepted example is:
  “Your commitment to comprehensive metabolic care has been noted.”

Payment, cash threshold, cooldown, message threshold, and flavor-text pool are
stable balance/configuration values. The runtime must not bury these numbers or
messages in unrelated gameplay code.

The first tuning should restore a struggling clinic without making deliberate
cash depletion or repetitive clicking attractive. The low-cash gate and
facility-hour cooldown provide those bounds in the current pilot.

## Player interface

The manual action appears above the Waiting patient tabs on the upper-left side
of ordinary play until its future room is constructed. It is not a patient
chart and does not enter Waiting, Active, or Resolved.

The control shows:

- The immediate payment
- A persisted cooldown bar that advances with simulation time, freezes on
  pause, and shows when the next facility-hour use is ready
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
- Every eligible consultation pays the same configured amount
- There is no daily cap or diminishing-return branch
- The action cannot become a superior sustained-income strategy in simulated
  play
- Sarcastic messaging starts at the configured use count

## Deferred details

- Remaining sarcastic message text
- Complete Level 2 room and GLP-1 NP rules
- Upgrade track and events
