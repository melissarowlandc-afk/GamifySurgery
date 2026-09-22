# Cross-room consistency audit checkpoint

This audit inventories the 16 owner-confirmed isolated room proofs before any runtime replacement. It compares like-for-like physical anchors where evidence exists and keeps unknown values explicit. The comparison reference is 120 pixels per tile: Front Desk draws natively at 88 pixels per tile and needs joint room-and-character normalization; the other listed proofs draw at 120. It does not certify occupied-character fit.

## Readiness summary

| Room | Canonical proof | Scale / pose evidence | Paths and ownership | Occupied-fit readiness |
| --- | --- | --- | --- | --- |
| Front Desk | 5×4 source/delivery match | Desk footprint known; chairs only approximate 0.86×0.95 tile envelopes | Proof routes and ED/D5 pass-through exception recorded | **Blocked:** no measured cushion contacts or GS-018 comparison |
| Examination | 3×2 + 2×3 match | Baseline bed 186×84 px, 42.48–42.95 px cushion rise; stool 60/50.68 px | Solid table, passable stool, rotated S1 sink ownership | **Reference-ready; occupied fit unverified** |
| Hallway | topology proof matches | No furniture scale | Shared-wall ownership and seams recorded | **Topology-ready:** congestion/turning untested |
| Waiting | 4×3 + 3×4 match | Runtime walk-frame envelope recorded; seat rises absent | Solid table, permanent pass-behind seats, rotated depth proof | **Blocked:** no seat-contact normalization or GS-018 seating |
| Bathroom | 2×2 match | Source ground contacts; toilet attachment not body-verified | Sink/toilet passable, transit behind/use in front | **Blocked:** body and turn clearance unverified |
| Minor Procedure | 3×3 match | Table 47.07 px and stool 50.67 px seat rises | B2 solid only; north-flush optional fixtures | **Near reference; occupied fit unverified** |
| Ultrasound | 3×3 match | Bed 216 px/50.1 px rise; stool 62.4 px/48.4 px | B2 solid; front-of-console lane is preview-only | **Near reference; occupied fit unverified** |
| X-ray | 3×3 match | Standing use points; console facade requires physical contact measurement | B2 block and N1 apron ownership recorded | **Blocked:** GS-018 standing alignment absent |
| CT | 4×4 source/delivery match, four cat scans | Scanner seat rise about 55.81 px; console facade requires measurement | Solid scanner/partition; four N-owned cat scans | **Blocked:** occupied scanner fit |
| Phlebotomy | 3×2 + 2×3 match | East chair/stool rises 57.26/55.26 px; South stool visually lower than East | Solid chair; rotated sink/window ownership proven | **Review outlier:** compare both seat contacts with character |
| EVS | 2×2 match | Shelves/clutter/bucket measurements recorded | All props passable; four owned hide groups | No seated fit; service pose unspecified |
| Endoscopy | 4×3 + 3×4 match, approved dark occupied art integrated | Bed display heights and distinct floor contacts recorded | Full-bed blocker and replacement behavior recorded | **Pending:** recapture same-scale comparison of revised generic head |
| Recovery | 6×6 match | Exam-scale beds; exact Exam stools; 93.24 px desk facade | Eight door-owned bays and partition clearing proven | **Reference-ready; eight-bay runtime capacity unsupported** |
| Training | 3×3 match | Exact Exam stools; bench 85.94 px worktop rise | Solid bench, passable stools, owned decor | **Reference-ready; reach/attachment unverified** |
| Coffee | 2×2 match | 82.5 px counter facade, a purposeful kiosk-type difference | Solid island and continuous perimeter loop | **Blocked:** standing service fit absent |
| Telehealth | 3×2 + 2×3 match | Chair rises approximately 47.74/48.51 px; desk base 120 px | Solid desk, passable seats; depth/plant ownership proven | **Near reference; north seat inferred and desk facade unknown** |

## Cross-room conclusions

- Recovery and Training deliberately reuse the exact Examination stool crop and physical scale. Minor Procedure and Ultrasound stool/seat rises are within roughly 2.3 px of that baseline. Telehealth chair rises are about 2.2–2.9 px lower, but its north cushion reference is inferred behind the backrest.
- Recovery beds deliberately match Examination. Ultrasound, CT, Phlebotomy, and Endoscopy use different fixture types or camera views; their dimensions should be checked with characters rather than forced to one image box.
- Coffee’s 82.5 px facade and Training’s 85.94 px worktop are below the approximate 90 px Front Desk reference after normalizing Front Desk from its native 88-pixel tile. Recovery’s 93.24 px station is within the accepted comparison band. Telehealth does not yet record a comparable facade rise. X-ray and CT standing-console facades look roughly 40–55 px in normalized captures but need measured physical top/base contacts before correction.
- Phlebotomy’s South stool appears lower than its rotated East view. Its South and East source contacts need a normalized human-height comparison before changing art scale.
- Proof path tests establish logical clearance for a radius-0.16 actor. They do not establish visible body clearance, turn animation clearance, multi-actor congestion, or runtime path integration.
- Current source and delivery match for all 16 proofs. CT delivery now contains the latest four N1–N4 cat scans and matches its unchanged source exactly.
- The approved `endoscopy-occupied-beds-dark-01.png` now supplies both occupied frames while the original empty frames remain. The earlier comparison identified a small generic head in the obsolete occupied art; that result does not measure the new enlarged dark revision. A refreshed same-scale character comparison is pending.
- No approved Operating Room proof exists. A future behavior note is not room design evidence.

Machine-readable details and evidence paths are in [inventory.json](inventory.json). Run `node tools/room-design/consistency-audit/validate.cjs` to check inventory coverage, hashes, delivery divergence, and required evidence fields.
