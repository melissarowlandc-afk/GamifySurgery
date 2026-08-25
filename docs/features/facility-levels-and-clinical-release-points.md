# Facility Levels and Clinical Release Points

Status: Accepted design; Levels 2-5 remain future implementation

Owner decisions: 2026-08-05

## Purpose

Facility levels determine which rooms and staff may be purchased. Clinical
release points determine when approved content iterations may enter the
campaign's eligible circulation. They are related, but they are not the same
field as educational difficulty, patient acuity, required clinical setting,
room upgrade level, staff training, or FSRS state.

## Accepted release points

| Stable ID | Display label | Activation |
| --- | --- | --- |
| `release.l0.clinic_evaluation` | L0 - Clinic Evaluation | Level 0 has begun |
| `release.l1.minor_procedure` | L1 - Minor Procedure | Level 1 has begun |
| `release.l2.endoscopy` | L2 - Endoscopy | Level 2 has begun |
| `release.l3.ambulatory_or_qi` | L3 - Ambulatory OR / QI | Level 3 has begun |
| `release.l4.pediatrics` | L4 - Pediatrics | Level 4 and an operational Pediatric Examination Room |
| `release.l4.wound_ostomy` | L4 - Wound / Ostomy | Level 4 and an operational Wound/Ostomy Clinic |
| `release.future.hospital_or` | Future - Hospital OR | Deferred; no numeric level |
| `release.future.hospital_floor` | Future - Hospital Floor | Deferred; no numeric level |
| `release.future.ed_trauma` | Future - ED / Trauma | Deferred; no numeric level |
| `release.future.icu` | Future - ICU | Deferred; no numeric level |

Entering Levels 0-3 releases the corresponding content pool. A particular
Patient Presentation Variant or Question Variant may still require a room,
service, or employee before it is eligible. This allows, for example, an
approved clinic counseling or offsite-testing iteration to circulate before a
later onsite or procedural iteration of the same Tested Concept.

Hospital release points deliberately have no invented facility-level number.
They will be assigned within a future hospital progression only when that
expansion is designed.

## Concept and iteration rules

- One Tested Concept remains one stable FSRS card per campaign.
- Each approved clinical presentation/question iteration resolves to exactly
  one release-point ID through its Patient Presentation Variant.
- A concept may have several approved iterations at different release points.
- The concept's earliest facility availability is derived from its approved
  iterations and the campaign's pinned balance/release configuration.
- A later iteration does not create a second FSRS card unless its underlying
  learning objective materially differs and therefore requires a new concept.
- Once a concept has entered circulation, later stages must retain at least one
  eligible approved presentation so due reviews are not stranded.
- Release-point approval is separate from clinical approval and evidence
  readiness. A release point never promotes draft or evidence-incomplete
  content into a playable release.

## Runtime circulation order

- A reviewed concept re-enters routine circulation only when its saved,
  campaign-scoped FSRS card is due. The oldest due concepts take priority.
- When no eligible review is due, the selector chooses uniformly from all
  distinct unseen concepts available at the campaign's current facility level
  and capabilities.
- The selector chooses a concept before choosing among that concept's eligible
  Patient/Question Variants. Having more authored variants therefore does not
  make a concept more likely to be introduced.
- Selection uses its own campaign-seeded deterministic randomness stream and
  the persisted routine-arrival sequence. The admitted encounter is then
  frozen in the campaign save.
- A multidecision encounter is eligible only when each concept it would score
  is unseen or due. An unseen later step does not justify repeating an earlier
  concept ahead of its FSRS schedule.
- A concept already present in an unresolved encounter is not selected for a
  second simultaneous patient.

For owner intake, a concept row may list several release-point IDs separated by
semicolons. During normalized authoring, each exact presentation/question
iteration stores its single approved release point.

## Accepted facility progression

### Level 0 - Starter Clinic

Rooms and buildables:

- Starting Front Desk
- Exterior Entrance
- Examination Room becomes buildable

Hireable staff:

- Founder only

### Level 1 - Basic Clinic

Rooms and buildables:

- Additional Examination Rooms
- Bathroom
- Waiting Room
- Imaging Control Room
- X-ray Room
- Minor-Procedure Room

Hireable staff:

- Receptionist
- Imaging Technician

### Level 2 - Expanded Outpatient / Endoscopy

Rooms and buildables:

- Ultrasound Room
- CT Suite
- Phlebotomy Station
- Environmental-Services Closet
- Endoscopy Room
- Peri-op/Recovery Room
- Training Room
- Coffee Kiosk
- GLP-1 Telehealth Suite

Hireable staff:

- Peri-op Nurse
- Endoscopy Nurse
- Endoscopist
- Phlebotomist
- EVS Worker
- GLP-1 NP

The Peri-op/Recovery Room intentionally precedes the Ambulatory OR. It first
supports endoscopy and recovery, then joins the surgical workflow at Level 3.
The Phlebotomy Station provides onsite collection with send-out testing; it is
not an in-house laboratory.

### Level 3 - Ambulatory Surgery Center

Rooms and buildables:

- In-house Laboratory
- Ambulatory OR
- Pharmacy
- Maintenance Workshop
- Staff Break Room
- Surgeon's Office
- Vending Machine

Hireable staff:

- Laboratory Technician
- Surgeon
- OR Nurse
- Pharmacist
- Repair Person

Level 3 is the Ambulatory OR and QI clinical release point. The in-house
Laboratory performs testing onsite, unlike the Level 2 Phlebotomy Station.

### Level 4 - Specialty Expansion

Rooms and buildables:

- MRI Room
- Radiology Reading Room
- Pediatric Waiting Room
- Pediatric Examination Room
- Wound/Ostomy Clinic
- Call Room

Hireable staff:

- Radiologist
- APP

The APP becomes a clinic-automation reward as volume and specialty services
expand. APP-handled encounters remain operational automation and do not create
FSRS recall evidence.

### Level 5 - Optimized ASC / Prestige

Rooms and buildables:

- Founder's Office
- Executive Office
- Gift Shop
- Indoor Garden
- Staff Gym

Hireable staff:

- Executive

Level 5 introduces no new clinical setting. It focuses on efficiency, staff
morale, prestige, satisfaction, revenue, inspection, and end-game goals.

## Accepted operational rules

### Founder and physician coverage

The Founder may personally provide the physician role for endoscopy or an
ambulatory operation. The Founder can occupy only one place and perform only
one task at a time. Travel, preparation, procedure, and recovery workflow
therefore create a material bottleneck until an Endoscopist or Surgeon is
hired. The Founder does not substitute for nursing, imaging, laboratory,
pharmacy, or environmental-services staff.

An employed Endoscopist or Surgeon adds parallel physician capacity and allows
the Founder to perform other work. Exact task queues and automation boundaries
remain implementation-time operational definitions.

### Imaging acquisition and interpretation

- The Imaging Technician is the generalized equipment operator for X-ray,
  ultrasound, CT, and MRI once each corresponding room is available.
- Imaging acquisition and image interpretation are separate timed phases.
- A completed acquisition does not make the clinical result actionable until
  interpretation is complete.
- Without an available staff Radiologist, an external interpretation route
  remains available with a configurable delay.
- An available staff Radiologist uses the Radiology Reading Room and shortens
  the interpretation phase.
- Exact acquisition times, external-read times, radiologist read times,
  concurrency, prioritization, and costs remain centralized balance values.
- Existing Level 0-1 X-ray totals remain the prototype defaults until the
  phased timing model is implemented and deliberately rebalanced.

The accepted imaging-room access rule remains: X-ray, ultrasound, CT, and MRI
each require a patient-facing entrance and a separate internal door on a shared
wall with an Imaging Control Room. The Radiology Reading Room is not an imaging
acquisition room.

### Other staffing and room rules

### Approved surgery-action wording rule

For clinically approved surgery-action content, an ASC-eligible operation uses
referral wording until its required ambulatory capability is operational and
scheduling wording afterward. A hospital-only operation always uses the
correct-specialist hospital-referral wording. This presentation wording does
not alter the stable tested-concept identity or its FSRS history.

- Peri-op Nurses do not staff Minor-Procedure Rooms or the Wound/Ostomy Clinic.
- OR Nurses staff the Ambulatory OR.
- The Pharmacy uses a Pharmacist, not a Pharmacy Technician.
- X-ray, ultrasound, CT, MRI, and laboratory testing always retain an
  appropriate offsite route when the corresponding onsite service is absent or
  unavailable. Onsite construction primarily improves turnaround, capacity,
  satisfaction, and revenue.
- Small/large Examination Rooms, Waiting Rooms, Bathrooms, Peri-op/Recovery
  Rooms, Ambulatory ORs, Staff Break Rooms, and comparable variants are
  upgrades or capacity variants rather than separate facility-level unlocks.
- Sterile processing and inpatient beds do not require separate ASC rooms.
- Complications outside ASC capability result in hospital transfer rather than
  silently expanding the current facility's scope.
- The founder-run manual GLP-1 consultation remains available until the GLP-1
  Telehealth Suite is built and staffed. The staffed suite permits the GLP-1 NP
  to automate the bounded side business under its later balance rules.

## Deliberately deferred implementation details

- Level 2-5 advancement requirements
- Exact room footprints and adjacency beyond already accepted imaging rules
- Construction, upkeep, salary, capacity, service-time, and upgrade values
- Maximum staff counts and exact automation throughput
- Exact imaging acquisition and interpretation timings
- Inspection, prestige, and final victory thresholds
- Detailed Hospital OR, Hospital Floor, ED/Trauma, and ICU progression

These may be designed when their level enters implementation. They do not block
clinical concepts from being assigned the accepted semantic release points.
