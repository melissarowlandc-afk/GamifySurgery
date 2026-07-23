# Open Decisions

Status: No item in this file is approved unless the Decision Log says otherwise.

Last updated: 2026-07-22

## Severity

- GREEN: inexpensive and easy to change later
- YELLOW: meaningful but manageable rework
- RED: foundational; likely major refactoring, migration, redesign, or redeployment

## RED decisions

| ID | Decision | Recommended proposal | Serious alternatives | Required before |
|---|---|---|---|---|
| R-001 | Overall client stack | TypeScript, React for text/UI, Phaser for facility rendering, pure shared simulation | Godot web/native; DOM/canvas without a game framework | Any implementation |
| R-002 | Facility spatial model | Integer tile grid, footprint masks, explicit doors, A* pathfinding | Free placement/navmesh; abstract room graph | Facility or save implementation |
| R-003 | Facility-time behavior when hidden | Automatically pause when the page is not active/visible | Continue by elapsed-time catch-up; server-side simulation | Clock implementation |
| R-004 | Code organization | One monorepo with separate player, admin, shared domain, schema, and test packages | Multiple repositories; one undivided application | Project scaffolding |
| R-005 | Backend and database | Managed PostgreSQL/Supabase with protected logical domains | Firebase; self-hosted PostgreSQL/API | Backend implementation or external account creation |
| R-006 | Save representation | Versioned campaign snapshot plus immutable learning and finance logs | Full event sourcing; unversioned state | Save implementation |
| R-007 | Cross-device conflict policy | One active writer, revision checks, explicit takeover/reload | Last-write-wins; offline merge | Cloud-save implementation |
| R-008 | Clinical/balance publishing | Independent immutable releases, saved version pins, emergency clinical withdrawal | Live data; one combined release | Content system implementation |
| R-009 | FSRS implementation | Pinned TypeScript FSRS library behind a project-owned interface | Separate Rust service; custom implementation | Educational scheduler implementation |
| R-010 | Primary concept mapping | One primary FSRS concept per scored decision | Credit multiple concepts; score an entire encounter as one card | Content schema |
| R-011 | Authentication mechanism | Invite-only verified email plus low-friction secure sign-in and recovery | Issued pseudonymous secret; institutional sign-in | Hosted pilot |
| R-012 | Administrator protection | Separate admin deployment, MFA, allowlisted roles, protected publishing API | Local-only admin throughout pilot | Admin deployment |
| R-013 | Initial deployment target | Local vertical slice followed by private browser pilot | Hosted from the start | Implementation approval checkpoint |
| R-014 | Vertical-slice scope | Founder, two tutorial patients, first room, one concept with variants, one queue/staff behavior, FSRS, saving, versioned data | Smaller technical proof; larger pilot build | Implementation approval checkpoint |

## YELLOW decisions

| ID | Decision | Recommended default | Needed before |
|---|---|---|---|
| Y-001 | Mastery-date timezone | Store UTC and use one declared account timezone prospectively | FSRS/mastery implementation |
| Y-002 | Tutorial funding | Guarantee first room plus operating buffer despite wrong answers | Tutorial balance |
| Y-003 | Phone orientation | Support portrait and landscape; use drawers and pan/zoom rather than force rotation | UI layout implementation |
| Y-004 | Admin scope in vertical slice | Structured import, validation, preview, approval, publish, rollback | Vertical-slice scope approval |
| Y-005 | Clinical question correction | First submission counts; correction and explanation do not create a second review | Content/FSRS implementation |
| Y-006 | Email retention and deletion | Retain while account exists; verified deletion process; define backup expiry | Hosted pilot privacy notice |
| Y-007 | Pilot feedback | Optional manual feedback with no detailed clinical-answer export | Playtest plan approval |

## GREEN decisions

- Exact visible tile size
- Grayscale palette
- Placeholder sprites and animation cadence
- Font selection, provided accessibility remains acceptable
- Sound assets, provided the game remains fully usable without sound
- Exact panel styling
- Tutorial wording after mechanics are approved

