# ADR 0038: Semantic Clinical Release Points and Level 0-5 Progression

Status: Accepted

Date: 2026-08-05

## Context

The project had a complete Level 0-1 progression but only scattered later-level
room and staff ideas. Clinical intake also needed a stable way to express that
one Tested Concept may have a clinic iteration, a later procedural iteration,
and a future hospital iteration without duplicating its FSRS identity or
forcing hospital content into the ambulatory level ladder.

## Decision

Adopt the stable clinical release points and complete Level 0-5 room/staff
unlock table in
`docs/features/facility-levels-and-clinical-release-points.md`.

Each exact approved presentation/question iteration has one release point. A
Tested Concept may have multiple iterations at different release points while
remaining one campaign-specific FSRS card. Facility stage, required capability,
clinical setting, educational difficulty, and approval status remain separate.
Hospital OR, Hospital Floor, ED/Trauma, and ICU remain semantic deferred release
points with no numeric facility level.

Entering Levels 0-3 activates the corresponding content pool. The two Level 4
specialty pools additionally require their relevant operational clinical room.
Every iteration may impose stricter room, service, staff, or setting gates.

The accepted progression is:

- Level 0 Starter Clinic;
- Level 1 Basic Clinic;
- Level 2 Expanded Outpatient / Endoscopy;
- Level 3 Ambulatory Surgery Center;
- Level 4 Specialty Expansion; and
- Level 5 Optimized ASC / Prestige.

The Founder may personally cover the physician role for endoscopy or ambulatory
surgery but can perform only one task in one place at a time. Hired
Endoscopists and Surgeons add capacity. The Imaging Technician operates X-ray,
ultrasound, CT, and MRI. Imaging acquisition and interpretation are separate
timed phases; external interpretation remains available, while an on-staff
Radiologist shortens interpretation. The Level 3 Pharmacy hires a Pharmacist.

## Consequences

- Clinical authors can classify content before later-level balance values are
  finalized.
- Multiple presentations of one learning objective do not fragment mastery.
- Hospital content remains visible in the queue without receiving a fictitious
  ambulatory level.
- The current two-level balance schema will require a versioned extension
  before Level 2 implementation.
- Imaging results will eventually require persisted acquisition and
  interpretation task state rather than one undifferentiated timer.
- Exact later-level costs, footprints, staffing caps, timings, advancement
  gates, and prestige rules remain deferred.
