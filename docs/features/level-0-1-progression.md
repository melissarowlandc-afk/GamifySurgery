# Level 0-2 Prototype Progression

Status: Current local implementation; filename retained for stable links
Last updated: 2026-08-25

## Level 0 — Getting Started

The campaign begins with one founder-operated Front Desk, one exterior door,
and no other rooms or employees. The first Examination Room is the only new
clinical room required during Level 0.

Two protected introductory patients teach charts, sequential decisions,
facility time, money, Learning XP, patient satisfaction, results,
chart resolution, goals, and construction. Following withdrawal of the earlier
prototype questions, the protected sequence uses the approved pulmonary-
optimization case followed by the approved asymptomatic simple-cyst case.
Treating exactly two patients is not an independent advancement requirement.

The first tutorial patient always has one immediate scored decision, no timed
service or return visit, and awards 20 Learning XP when correct. The completed
chart then teaches the settlement summary, disease-information flip, and
explicit resolution through acknowledgement-only tutorial bubbles. The second
tutorial patient has a centrally configured 60-facility-minute off-site
ultrasound result and a second decision so the player sees departure, elapsed
facility time, return check-in, and sequential chart review. Both patients are
protected from walkout.

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

The Level 1 gate advances the player to Level 2 when the player has:

- built a Minor-Procedure Room;
- built a functioning X-ray Room, which implicitly requires a directly
  connected Imaging Control Room and both valid doors;
- hired an Imaging Technician;
- maintained effective patient satisfaction above 90%; and
- reached the centrally configured Level 1 Learning XP target.

Level 2 Phlebotomy Station, Level 3 in-house Laboratory, and Level 4 APP must
not be reintroduced into the Level 1 gate.

## Level 2 — Expanded Outpatient / Endoscopy

Level 2 unlocks Ultrasound Room, CT Suite, Phlebotomy Station,
Environmental-Services Closet, Endoscopy Room, Peri-op/Recovery Room,
Training Room, Coffee Kiosk, GLP-1 Telehealth Suite, Peri-op Nurse, Endoscopy
Nurse, Endoscopist, Phlebotomist, EVS Worker, and GLP-1 NP.

The completed Level 3 preview requires 300 current-level Learning XP,
effective satisfaction above 90%, functioning Endoscopy and Peri-op/Recovery
rooms, and the Peri-op Nurse, Endoscopy Nurse, and Endoscopist. Founder
coverage can provide the physician role during Level 2 but is limited to one
place/task; dedicated staff is required for completion. Ultrasound, CT,
phlebotomy, EVS, Training, Coffee, and GLP-1 automation remain optional.

Level 3 is locked: completing these requirements does not perform another
level-up or unlock Level 3 content.

## Current clinic-loop rules

- A patient's chart does not enter Waiting until the character physically
  reaches the Front Desk and checks in.
- All patients arrive from a stable left or right off-screen sidewalk origin,
  enter through the public door, and use one common centrally configured
  character walking speed. Employees use the same movement speed and enter
  through the same public route when hired.
- Outside Build Mode, clicking a reachable room, hallway, or sidewalk point
  sends the founder there along a persisted legal route. Clicking fixture art
  chooses the nearest reachable floor tile, while dragging continues to pan the
  camera without issuing a movement command. Explicit facility interactions
  retain priority and cannot be interrupted by an ordinary walk command.
- Campaign-stable ambient pedestrians occasionally cross the exterior sidewalk
  from one off-screen edge to the other. They never enter, check in, create a
  chart, consume capacity, or alter any gameplay resource, and their persisted
  route uses the same pause, speed, and smooth rendering contract.
- After check-in, patients use a free authored Waiting Room chair first, then
  the available Front Desk waiting position, and finally a distinct sidewalk
  queue position. The simulation never invents a standing location or an
  invisible chair inside the Waiting Room. Characters do not share a
  destination tile or acquire a presentation-only fallback location. A
  stationary patient on a chair uses the canonical seated presentation;
  room-idle movement returns to and continues reserving that chair.
- Opening the only active chart sends that patient toward an available
  Examination Room without hiding or delaying the readable current decision.
  If no Examination Room exists, the patient remains where they are.
- A service plan becomes mechanically active after its feedback is
  acknowledged. Patients physically reach the service or leave the facility,
  complete the configured service interval, and check back in before a later
  decision becomes available.
- The duration shown for an off-site service includes the complete outbound
  walk, time away, and return walk. The patient reaches the Front Desk exactly
  when that duration ends; the existing chart receives one result-ready state
  only after that return check-in. The returning patient then follows the same
  Waiting Room hierarchy and, when the result-ready chart is opened, proceeds
  to the reserved Examination Room before the encounter's visible departure.
- Basic laboratory send-outs take 60 facility minutes. X-ray takes 120 minutes
  when outsourced and 60 minutes when a functioning onsite X-ray room and
  available Imaging Technician can serve the patient. Each onsite room and
  technician pair serves only one patient at a time.
- Genuine idle waiting changes individual patient satisfaction. Ordinary
  walking and active care do not. Tutorial patients are protected; ordinary
  patients may trigger their persisted walkout threshold and physically leave.
- The historical satisfaction baseline is the rolling average of the ten most
  recently ended encounters, including walkouts. The HUD applies a separate
  live modifier for applicable unresolved facility dissatisfaction conditions
  and removes each contribution when that condition is fixed; it never
  rewrites the ended-encounter history. Before the first encounter ends, the
  HUD may apply current pressure to a neutral provisional baseline, but that
  provisional display cannot satisfy the level gate.
- Advertising is a persistent, player-selected hourly expense whose centrally
  configured tiers modestly shorten future routine-arrival intervals. Changing
  it rescales the existing scheduled arrival rather than rerolling one.
- Cash is clamped at zero. Unpaid operating costs reduce staff morale, and an
  employee who reaches the configured quitting threshold leaves; zero cash
  does not otherwise create a game-over state.
- Once a Receptionist is hired, a continuously empty water cooler becomes an
  automatic staff task after 60 facility minutes. The Receptionist walks to the
  cooler using the normal persisted route, refills it, and then resumes normal
  room activity. The founder may still refill it manually before staff begins
  the task.

## Tunable values

XP targets, construction and hiring costs, arrival timing, patient payments,
upkeep, salaries, and satisfaction effects remain centralized in the prototype
balance release. The prototype uses the general names Examination Room,
Bathroom, and Waiting Room; a later size-tier system may introduce small
variants without changing these gates.

`100%` is the clean, capable-clinic starting baseline. At Front Desk check-in,
an ordinary patient begins below that baseline when applicable unresolved
conditions such as accumulated trash, poor cleanliness, an empty water cooler,
or a missing patient amenity or service are already affecting the visit.
Satisfaction then changes through genuine idle waiting, care quality, room
cleanliness and upgrades, amenities, staff morale, and service efficiency. A
persisted threshold controls walkout below 60%. The HUD preserves the rolling
configured window of ended encounters as its historical baseline and layers
only the current live facility modifier over it.

The current playtest defaults are deliberately provisional:

| Variable | Current default |
| --- | ---: |
| Starting cash | $120 |
| Correct / incorrect scored decision | 10 / 2 Learning XP |
| Level 0 XP gate | 10 XP |
| Level 1 XP gate | 150 XP |
| Level 0 payment | $15 + $10 per question + $50 per correct answer |
| Level 1 payment | $20 + $15 per question + $65 per correct answer |
| Hallway / Examination Room | $35 / $160 |
| Bathroom / Waiting Room | $225 / $350 |
| Imaging Control / X-ray / Minor-Procedure Room | $440 / $750 / $800 |
| Receptionist / Imaging Technician hiring cost | $180 / $300 |
| Receptionist empty-water response | 60 facility minutes after both the empty episode and employment have begun |
| Manual GLP-1 action | Available at any cash balance until a reachable suite is staffed; then each staffed suite automates one $25 consultation per 60 facility minutes (maximum five), with no XP/FSRS or patient encounter |
| Advertising | Off; $4/hr for about +9%; $8/hr for about +19%; or $14/hr for about +33% routine arrival frequency |
| Operating day / routine arrival pace | 10 / 5 / 2.5 real minutes at 1x / 2x / 4x; about 1 arrival per 60 game minutes |

These numbers are balance-test inputs, not settled design promises.
