# Level 0-1 Prototype Progression

Status: Current implementation target
Owner instruction: 2026-07-26

## Level 0 — Getting Started

The campaign begins with one founder-operated Front Desk, one exterior door,
and no other rooms or employees. The first Examination Room is the only new
clinical room required during Level 0.

Two protected introductory patients teach charts, sequential decisions,
facility time, money, Learning XP, patient satisfaction, results,
chart resolution, goals, and construction. Treating exactly two patients is
not an independent advancement requirement.

The player may manually advance to Level 1 when all current requirements pass:

- build one Examination Room;
- maintain effective patient satisfaction above 90%; and
- reach the centrally configured Level 0 Learning XP target.

There is no minimum-cash gate.

If incorrect introductory answers leave the campaign below the XP target,
Level 0 admits repeatable recovery patients. Those anti-softlock arrivals are
patience-exempt until opened, so neglecting them cannot permanently push
satisfaction below the strict advancement gate. Ordinary Level 1 patients
retain the configured waiting warnings and departure behavior.

## Level 1 — Functioning Outpatient Surgery Clinic

Level 1 unlocks:

- Bathroom;
- Waiting Room;
- Imaging Control Room;
- X-ray Room;
- Minor-Procedure Room;
- Receptionist; and
- Imaging Technician.

Additional Examination Rooms remain repeatable. Bathroom, Waiting Room, and
Receptionist are useful operational options but are not formal completion
requirements.

The locked Level 2 preview becomes complete when the player has:

- built a Minor-Procedure Room;
- built a functioning X-ray Room, which implicitly requires a directly
  connected Imaging Control Room and both valid doors;
- hired an Imaging Technician;
- maintained effective patient satisfaction above 90%; and
- reached the centrally configured Level 1 Learning XP target.

Level 2 itself remains outside this prototype. The Laboratory and APP are later
systems and must not be reintroduced into the Level 1 gate from superseded
brainstorms.

## Tunable values

XP targets, construction and hiring costs, arrival timing, patient payments,
upkeep, salaries, and satisfaction effects remain centralized in the prototype
balance release. The prototype uses the general names Examination Room,
Bathroom, and Waiting Room; a later size-tier system may introduce small
variants without changing these gates.

Each patient begins at 100% satisfaction. It changes through genuine idle
waiting, care quality, room cleanliness and upgrades, amenities, staff morale,
and service efficiency. A persisted threshold controls walkout below 60%.
The HUD reports only the rolling configured window of completed encounters.

The current playtest defaults are deliberately provisional:

| Variable | Current default |
| --- | ---: |
| Starting cash | $90 |
| Correct / incorrect scored decision | 10 / 2 Learning XP |
| Level 0 XP gate | 10 XP |
| Level 1 XP gate | 150 XP |
| Level 0 payment | $15 + $10 per question + $50 per correct answer |
| Level 1 payment | $20 + $15 per question + $65 per correct answer |
| Hallway / Examination Room | $30 / $130 |
| Bathroom / Waiting Room | $180 / $280 |
| Imaging Control / X-ray / Minor-Procedure Room | $350 / $600 / $650 |
| Receptionist / Imaging Technician hiring cost | $180 / $300 |
| Emergency GLP-1 action | Always visible before its future room; once per game hour |
| Operating day / routine arrival pace | 10 / 5 / 2.5 real minutes at 1x / 2x / 4x; about 1 arrival per 60 game minutes |

These numbers are balance-test inputs, not settled design promises.
