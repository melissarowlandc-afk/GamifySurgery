# GS-015 room design handoff

## Status

Open. The owner requested a ground-up visual rebuild of all rooms. The first
owner-review target is a connected-building Front Desk concept based on
[Overall Vibe](../../Photos%20for%20Codex%202/Overall%20Vibe), with supporting
[Objects or Furniture](../../Photos%20for%20Codex%202/Objects%20or%20Furniture)
and [Rooms](../../Photos%20for%20Codex%202/Rooms) references. The chosen
palette is warm cream and deep green, balanced by colorful plants, upholstery,
and wall art. Detailed furniture, coherent shadows, and consistent proportions
are required.

Parent generated and visually inspected [Front Desk concept 01](../../Photos%20for%20Codex%202/Codex%20Rooms%202/GS-015/front-desk-concept-01.png)
with built-in ImageGen. Owner review is pending. Palette and furnishing richness
are established as a proposal; camera angle and side-wall cutaway need revision.
It is not approved production art or evidence of a working spatial contract.
Exact prompt/provenance and review are saved beside the image.

## Decision and integration boundary

Old door, wall, fixture, and coordinate rules are not accepted constraints.
Most systems remain unchanged, but any new spatial contract must first state
the proposed entrances, walkable space, furniture/seating anchors, actor floor
contact, occlusion, and routing/save consequences. Preserve original assets;
do not delete assets or integrate a broad rebuild yet.

Owner rule now recorded: every non-sidewalk-facing room-wall segment is
door-eligible. A door temporarily hides overlapping wall art or optional
furniture as one restorable group including its shadow. The Front Desk desk,
receptionist chair, and visitor chair are permanent solid furniture; the water
cooler is also permanent for gameplay but remains nonblocking in its small A5
corner. Their final arrangement must leave all eligible segments reachable. All chairs
use cardinal N/S/E/W directions, with no diagonal chairs. The existing public
Front Desk sidewalk entrance remains provisionally fixed and excluded from
custom door placement. Concept 01's atmosphere was liked; simplify texture and
decorative density to the character-art style.

The shared `beta` worktree is heavily dirty. In particular,
`FacilityScene.ts`, `canonicalRoomShell.ts`, and `bitmapAssetManifest.ts` have
concurrent changes. Do not alter them until an accepted batch has explicit
shared-file ownership. GS-013 retains the character master and motion work.

## Durable records

- Plan: [room-design.md](../execplans/room-design.md)
- Design brief: [room-design-review.md](../features/room-design-review.md)
- Historical graphics context: [GRAPHICS_THREAD_HANDOFF_2026-09-07.md](GRAPHICS_THREAD_HANDOFF_2026-09-07.md)

## Work completed in this milestone

Terra completed a read-only renderer review and wrote the GS-015 design brief
and this handoff. The renderer is hybrid: reusable bitmap environment surfaces,
authored room-fixture atlas frames, and procedural fallback. Existing display
geometry is distinct from logical room state, but its door, anchor, and
occlusion interfaces need a proposed replacement contract before integration.

Door feasibility evidence: `packages/game-domain/src/doors.ts` validates
per-side/per-offset doors, duplicate physical segments, adjacent traversable
space, and the protected Front Desk south-only exterior entrance.
`packages/game-domain/src/spatial.ts` builds cardinal-only routes from explicit
per-room `navigation.blockedTiles`; a door currently reopens its own blocked
inside tile. Fixture pixels do not create collision automatically. Existing
renderer helpers hide only selected north-wall fixtures; all-side optional
furniture hide/restoration remains new work.

Next action: obtain owner feedback on the completed isolated proof below, then
develop simpler visual components against the accepted layout. No shared
runtime integration has occurred.

## Interactive D5 paired proof completed

The isolated proof is
[front-desk-layout.html](../../tools/room-design/front-desk-layout/front-desk-layout.html),
with an identical delivered fragment at the GS-015 visualization location.
It models the reaffirmed 5 × 4 footprint: C2–C3 desk, B2 receptionist facing
South, D5 visitor facing North by default, and fixed D3 entry/service landing.
D4 and D2 remain comparisons; D2 reports its blocked north-facing front at
C2. All 13 north/west/east segments are toggled independently. Optional
furniture/art groups include shadows and hide/restore as a whole group.

The paired layout and candidate modular art views derive from one state/model.
The art view uses a non-destructive inline preview of the new parent-reviewed
transparent furniture atlas, with threshold-32 alpha frames, floor-contact
anchors, tile seams, and segment-addressed shaded wall pieces. It is not a
production asset integration. D5 has an owner-review ED comparison: ED makes
only D5 traversable; the chair may stay visible (default) or hide. Seat use in
that passage is explicitly unvalidated and no runtime rule is approved.

`node tools/room-design/front-desk-layout/validate-front-desk-layout.mjs`
passed 49,152 mask/chair/mode states plus active/candidate ED, hide/restore,
art aperture/decor, atlas-load, keyboard/click/select, geometry, and 320px
overflow checks. Desktop, 360px, and 320px captures are under
`tools/room-design/front-desk-layout/evidence/`. This is an owner-review
spatial proof only; no runtime/domain/gameplay change is authorized by it.

Parent reviewed the actual proof source and desktop/320px host captures, reran
the validator successfully, and verified matching source/delivery hashes.
No runtime code or production assets, game tests, server session, deployment, commit,
or push was changed. All GS-015 work is local only. This task stays open for
concept review and the next owner decision.

## Footprint-aware revision

Terra preserved the previous paired proof as
`tools/room-design/front-desk-layout/front-desk-layout-v2.html`, then made the
art room the primary view. The C2–C3 desk is a separately anchored replacement
asset with uniform scaling, while its sprite rises above the tile footprint.
The B2 receptionist is drawn behind it. Direct accessible wall targets and
compact controls change the same 13-door model; floor footprints/routes remain
optional. New parent-owned counter and prop originals are untouched; the
fragment embeds technical previews only.

Current optional groups are northwest cabinet N1/WA, board/clock N2–N3,
botanical N4, and ficus WC. They remain nonblocking and hide/restore as whole
groups. The permanent nonblocking northeast cooler stays visible for N5/EA.
The browser validator retains all 49,152 route states and adds direct
wall controls, primary-view, desk footprint/contact/aspect/draw-order, and
cooler anchor checks. Art captures include default, footprints, ED visible and
hidden, N1+WA, all-open, and host-rendered desktop/320px views. No runtime,
domain, game session, deployment, commit, or push changed.

## North-corner anchor revision

Owner moved the cabinet to northwest A1 with N1/WA conflicts and the cooler to
northeast A5 with N5/EA conflicts; ficus moved to C1 with WC conflict. Terra
preserved the preceding preview as v3, then changed the isolated model to use
explicit small floor rectangles and source plinth contacts for cabinet/cooler.
The art remains uniform-scale, top-contained, and right-aligns the cooler's
actual base to A5's east edge. Validator checks those contacts, aspect ratios,
sub-tile containment, and corner alignment alongside its 49,152 existing
states. Current host desktop/320px and N1+WA evidence are refreshed.

Read-only runtime parity evidence: `FacilityScene.ts` uses 24px tiles before
camera zoom (Level 0 starts at 1.1) and authored Phaser frames with contact-Y
depth; `frontDeskV5Architecture.ts` keeps the 5 × 4 logical floor and projects
the north wall outward. This 88px-tile canvas preview matches the logical
footprint/contact intent, but it does not reproduce Phaser sampling, camera,
canonical shell measurements, or characters. No runtime claim or shared code
change is made.

## Cutaway shell revision

Sol replaced the rejected experimental shell with a coherent isolated cutaway:
an 80px rear wall, 28px projected side faces with connected rear-corner caps,
a 27px low front wall and an unobstructed D3 entrance between short piers. All
13 toggles now show dimensional dark/wood portals on the corresponding wall
plane, and their transparent direct-hit regions match those revised planes.
The floor uses a subdued 10 × 8 textured tile finish while the optional overlay
retains the exact 5 × 4 gameplay cells. Accepted furniture assets, anchors,
depth order and hide/restore rules did not move.

The isolated validator passes all 49,152 mask/chair/mode states plus shell
metadata, revised wall-target bounds, art changes, accessibility interactions,
anchor/aspect checks and 320px rendering. This preview is the room-art target,
not proof of exact runtime appearance; Phaser shell integration, characters,
camera scale and occupied interactions remain outside this milestone. No
runtime, server, session, deployment, commit or push was changed.

## Orthogonal wall and north-adjacency revision

The owner replaced the projected side-wall direction. Sol preserved that
accepted checkpoint as `front-desk-layout-v5.html`, then rebuilt both east/west
boundaries as straight top-only caps with clean north/south joins and no inward
faces. Every selected door is now a see-through wood frame only: no leaf,
handle, opaque panel or animation. All 13 door buttons remain visible outside
the optional footprint panel, and direct canvas hit regions follow the current
tall/low north wall or side cap.

Five always-visible checkboxes independently mark an adjoining room north of
N1–N5. Each lowers only its boundary segment and exposes a short unfurnished
floor strip beyond it. Board/clock art hides when N2 or N3 is low; botanical
art hides when N4 is low. Cabinet remains for adjacency and hides for its actual
door conflicts. The permanent nonblocking cooler remains for every adjacency
and door state. Furniture art, anchors, 5 × 4 gameplay
floor and 10 × 8 finish are unchanged.

Validation now includes all 32 adjacency masks, adjacency/door independence,
dynamic north hit planes, all 13 light frame interiors, joined front-corner
pixels and visible controls at narrow widths, plus the retained 49,152 routing
states. This is still an isolated target; no runtime renderer, server, game
session, deployment, commit or push changed. Source and delivered fragment
SHA-256: `9760E23E6FEBE19F19FF5FA414A973D484F91F5775C5C57026A0DF98CF5A437C`.

### Shared-wall cap refinement

Sol preserved the preceding orthogonal preview as
`front-desk-layout-v6.html`. The current target removes the decorative
adjoining-floor strips so each low north boundary stops at its green cap. Side
caps are now 14px thick and join the visible top of N1/N5 at y=21 when tall or
y=81 when low, then continue to the connected south corners.

Low north door openings use brown side jambs only and have no header. Tall
north openings retain their header. East/west openings are complete wall gaps
with a brown jamb stripe at each passage end and no enclosing frame. Furniture,
adjacency behavior, visibility rules and controls are unchanged. Validation
adds pixel assertions for tall/low side endpoints, low-wall extent, low north
header air and side gap/jamb geometry alongside all prior state checks. This
remains an isolated preview; runtime and session state were not changed.
Source and delivered fragment SHA-256:
`001F26D69E7D0D3234DE0CC01196B110EAB8EC0CD8B93F776CDDA4145B252259`.

### Doorway floor ownership refinement

Sol preserved the preceding shared-wall target as
`front-desk-layout-v7.html`. The current target removes the simulated yellow
neighbor floor from every north aperture and from the exposed area above each
low north boundary. Those neighbor-owned pixels are truly transparent. The
clear occurs before furniture so cabinet/cooler overhang art remains visible.

Each east/west opening now divides the 14px cap at its midpoint: the inner 7px
copies the clean, pre-wall room-floor texture and the outer 7px is transparent
for the adjacent room. West/east ownership is mirrored. Brown jamb stripes,
accepted furniture, anchors, all controls, routing and visibility behavior are
unchanged.

The validator checks all seven alpha columns on both halves of all eight side
openings, copied-pixel parity, transparent north apertures, all 32 adjacency
masks and the retained 49,152 routing states. This remains an isolated preview;
runtime room composition and session state were not changed. Source and
delivered fragment SHA-256:
`EA5B494C50D0BE6823EDB4653A93BAB94B4EA845541D98BF550CDA4CFF5622A7`.

### Permanent water-cooler refinement

Sol preserved the previous delivered target as `front-desk-layout-v8.html`.
The current isolated model removes the cooler from N5/EA visibility conflicts
and records it as permanent but nonblocking. Its A5 footprint, source aspect,
base anchor and rendered dimensions are unchanged. Validator coverage now
requires the cooler to remain visible in every door and adjacency state and
checks an opaque blue cooler pixel with N5 and EA open. A dedicated
`art-door-n5-ea-cooler-permanent.png` capture shows that combined state.

Read-only runtime inspection found the live cooler at logical A5, a recorded
B5 approach, and an exact-location pointer refill action. The isolated proof
does not validate the actual refill callback, staff approach/path, or access
while N5/EA is open; runtime integration must check those separately. No
runtime or session files changed. Source/delivery SHA-256:
`27963036E3B43CA92D1E6F820FACE592D71659C201CFD6662746D4F7DB61562A`.

### Front Desk upkeep-state candidate

Sol preserved the accepted source byte-for-byte as `front-desk-layout-v9.html` at the preceding SHA-256. The new isolated candidate adds Full/Empty water and Clean/Scattered litter controls while leaving the established shell, furniture, anchors and door behavior intact. The parent-reviewed source atlas and exact prompt remain unchanged; technical equal-size cooler crops share a measured base registration, and the litter crops retain source aspect. The quality-82 WebP is a browser display asset, and owner art review remains pending.

Both cooler states retain the accepted A5 footprint and remain permanent, nonblocking and visible under every door/adjacency combination. The proposed refill service point is reachable B5. Two nonblocking direct-pickup litter clusters at reachable D1 and B4 appear only in the litter state and do not participate in door hiding. The overlay makes those service tiles inspectable. Runtime currently blocks whole-tile A5 while using B5 for refill, so the proof's nonblocking cooler remains an explicit future-integration difference; no refill or litter action was connected to gameplay.

Validation passes the existing 49,152 door/chair/mode states, 32 adjacency states, all 13 aperture checks, full/empty registration and persistence, clean/litter visibility and aspect, B5/D1/B4 route checks, service-marker readability, keyboard interaction and desktop/320px rendering. Source and delivered `front-desk-layout.html` match SHA-256 `0F5C0DE12254CAFBA6B89E022E9EB00FD38019FCAF67C341C5994F275B09728B` (989,539 bytes).

## Examination Room 3 × 2 proof

Owner explicitly chose to keep the Examination Room at 3 × 2. Sol created a
new isolated proof under `tools/room-design/examination-layout/` and a separate
delivered `examination-layout.html`; the accepted Front Desk source was not
changed. The room reuses the exact accepted cream/green shell and door language
with all ten perimeter segments, independent N1–N3 adjacency switches,
transparent neighbor ownership, midpoint floor seams on west/east/south, and a
default S2 opening. Its 12 × 8 pale blue-gray/sage linoleum finish is room-specific.

The narrow permanent solid table is centered over A2/B2 with a 0.72 × 1.05-tile
floor footprint. A 20-subcell-per-tile proof expands the true rectangle by a
provisional 0.18-tile actor radius plus 0.03-tile margin, routes around it, and
keeps all ten approaches plus distinct west staff/south patient-foot approaches
reachable. It does not block the complete A2/B2 tiles. Character proxy circles
are clearance marks; occupied character fitting is still required.

Only the table is permanent. Sink, stool and diagnostic panel are optional and
nonblocking: sink hides for N1/WA, stool for WB/S1, and diagnostic art for an
N2 door or low N2 wall. The original 1254px RGBA atlas was measured with Pillow
at alpha ≥ 32 and converted once to a 432,802-byte lossless technical WebP for
the self-contained fragment. No pixel regeneration or semantic editing occurred.

Validator coverage includes all 1,024 door masks, all eight north-adjacency
masks, ten alpha/seam aperture checks including south, narrow-table inflated
clearance, atlas crops/anchors/aspects, direct controls, and desktop/320 layouts.
The live domain remains 3 × 2 and uses whole-tile navigation; the older 4 × 2
horizontal presentation values are display-only. Runtime sub-tile navigation,
interaction anchors, and occupied character fitting remain unimplemented. No
runtime/session/server/deployment files changed. Examination source/delivery
SHA-256: `AE097E57DABC9DC4AC27DC7D264D7A0BBDD41DA9306836439F471CD61CBA8944`.

### Examination horizontal bed and seating revision

Sol preserved the first accepted Examination preview as `examination-layout-v1.html` (SHA-256 `AE097E57DABC9DC4AC27DC7D264D7A0BBDD41DA9306836439F471CD61CBA8944`) and revised only the isolated Examination proof. The new unchanged source art is a low east-west bed with head east and foot west. The proof uses a 1.35 × 0.30-tile solid footprint centered at room y=1.0; the sprite is uniformly scaled, base-anchored to that footprint, and rises above it.

The patient seat attaches to the elevated west foot and faces west. A separate dashed floor projection and west approach marker keep floor-space reasoning explicit. The permanent, nonblocking rolling stool is immediately west of the foot; its founder seat faces east and remains visible for all ten door and all eight north-adjacency combinations. Bed and stool contact-to-near-seat-edge rise both measure about 30.4px at preview scale. The overlay uses labeled `P ←` and `F →` marks without inventing character art. Occupied character fit, sitting animation, and runtime interaction remain unverified.

The current room floor now continues through every south opening to the exact south wall base, with no transparent midpoint or floor spill beyond the seam. North and east/west ownership are unchanged. Validation passes all 1,024 door masks, eight adjacency masks, ten aperture states, horizontal inflated-bed avoidance, permanent stool invariants, opposed cardinal anchors, technical art provenance, and desktop/320 rendering. Runtime and shared Front Desk files were not changed.

Current Examination source/delivery SHA-256: `00CC6D46AE34E2F0046E10B4F95DEAF05442B6D95050370E07C52E1A064790C8`.

### Examination furniture scale correction

Sol preserved the prior horizontal proof as `examination-layout-v2.html` (SHA-256 `00CC6D46AE34E2F0046E10B4F95DEAF05442B6D95050370E07C52E1A064790C8`). Read-only scale evidence found Front Desk chairs at roughly 0.86 tile wide and 0.95 tile high in the accepted preview. The live authored-character contract uses a roughly 1.35 × 2.03-tile frame envelope at scale 1, with transparent padding and per-pose display differences, so it is reference evidence rather than occupied-body proof.

The isolated Examination bed now measures 2.05 tiles long with a 0.42-tile solid footprint centered at y=1.0. The permanent nonblocking stool is 0.50 tile wide. Both supplied sprites remain unchanged and aspect-preserved; their visible contact-to-seat rises are about 46.2px and 50.7px. The overlay retains west-facing patient and east-facing founder attachments and exposes the tight leg/approach space.

The enlarged inflated bed still leaves all ten approaches reachable under all 1,024 door masks: east-upper and east-lower approaches use the north and south corridors, while the west corridor connects them. Shell, wall, opening, floor, adjacency and visibility behavior are frozen from v2. No character art, runtime, Front Desk, or shared renderer files changed; actual seated-character fit remains unverified.

Current enlarged Examination source/delivery SHA-256: `AD8ED24C735A7F45CF55E3D8991B61B75E6D7B68008075FF51A2AB2993E5128C`.

### Examination compact bed and west-side rotation proof

Sol preserved the prior target as `examination-layout-v3.html` at the preceding hash. The room-local bed is 1.55 × 0.70 tiles; the permanent nonblocking stool is 0.50 tile wide and centered at `(0.78,1.0)`. The selector renders the physical room as original 3 × 2 or 90° counterclockwise 2 × 3 west-side view. Door state stays room-local while controls show world IDs, north adjacency is world-relative, and shared fixture/seat/floor anchors transform between views. Correct-view art avoids bitmap rotation. Runtime integration and occupied seating remain unimplemented.

Current compact/rotatable Examination source and delivery SHA-256: AE0A01F16FC9273A842587EA4DBFA891E397FAEC7C93300D9D58D3091822D3D8.
Source-derived cushion rise is about 42.5px east-bed, 43.0px north-bed, and 50.7px stool at preview scale. The roughly 8px stool variance and occupied-pose fit remain explicit review limits.

### Examination final west-view correction (September 17, 2026)

Preserved the prior proof as `tools/room-design/examination-layout/examination-layout-v4.html` at SHA-256 `AE0A01F16FC9273A842587EA4DBFA891E397FAEC7C93300D9D58D3091822D3D8`. The 90° counterclockwise transform now maps local `WA` to world `S1` and local `WB` to world `S2`; a geometry-derived endpoint test guards that relationship independently of mapping roundtrips. The west-view sink is uniformly enlarged by 30% from `0.40` to `0.52` tile wide, retains its source aspect and SW floor contact, hides for world `S1` or `WC`, and remains visible for world `S2`. Original-view sink behavior for `N1` and `WA` is unchanged.

Owner-approved seated pose contract: in the west-side view, the patient sits facing south at the end of the bed and the founder/employee sits facing north on the wheeled stool. Original-view equivalents remain patient facing west and founder/employee facing east. Direction approval does not imply that character animation or occupied fit is implemented. This remains an isolated design proof; no runtime files were changed.

Source and delivered fragment match SHA-256 `462AB425AC17C63338AA46E8D5F85731316675F531C6A1A81FADBB5A80CFCF3C`.

## Hallway foundation proof — 2026-09-17

The rejected first draft was replaced with a corrected isolated candidate at `tools/room-design/hallway-layout/`. It uses independently derived straight, corner, T and cross cell unions; only exterior edges receive walls or room-connection controls. A shared clipped floor texture keeps internal hallway edges continuous. Rear/side structure is drawn before the union floor so concave and reentrant corners cannot cover a walkable neighboring cell; the south cutaway is then drawn at the actual boundary.

The proof uses the warm light limestone and cream/sage/dark-green palette visible in the Overall Vibe hallway mockups. North segments can independently become backed 29px boundaries. Open north, east/west and south connections display neighboring-room floor ownership rather than the canvas background. Validation independently derives all four boundaries, checks internal floor continuity and every boundary control, then samples tall/low north apertures, east/west midpoint ownership, south wall-base ownership, keyboard focus and desktop/320px layout. Parent and owner visual acceptance remain pending. No runtime halls, navigation, assets, characters or sessions changed.

Source and delivered fragment match SHA-256 `A4CC0A3108F340979BF1615A66CD0F29650A6E921A1AD2BFE6815933A25FAF9C` (11,024 bytes).

## Combined furnished clinic candidate — 2026-09-17

Sol built a new isolated proof under `tools/room-design/combined-layout/`; the individual Front Desk, Examination and hallway proofs remain unchanged. Three presets use one 48px world tile and one canonical unit-edge graph: side-by-side includes direct Front Desk/Examination east-west walls and room/hall walls, stacked demonstrates Examination/hall/Front Desk north-south ownership, and mixed corner combines a west-view Examination room, direct room-room north-south boundary and L hallway.

Each shared wall and door has one state. East/west floors meet at the wall centerline; north/south rendering keeps only the southern area's low north wall and suppresses the northern south wall. Hall cells do not wall each other. Apertures restore the appropriate room floor, and the fixed Front Desk south entrance extends its floor to the wall base. Approved assets were cropped, uniformly downscaled and technically packed into a display WebP without semantic edits; exact anchors are scaled from their source proof tile sizes. Validation covers independently derived unique boundaries, shared ownership, absence of hall-hall walls, representative east/west and north/south floor pixels, permanent and optional fixture behavior, art loading, keyboard focus and desktop/320px layout. Parent and owner acceptance remain pending; no runtime files, gameplay systems, sessions or character art changed.

The self-contained source and delivered fragment match SHA-256 `84BBA188008954BADC5C4A3F1F4AFD6D4054A058FBF9436381963E01A2B1B1F8` (223,269 bytes).

## Waiting Room first candidate — 2026-09-17

Sol built the isolated 4 × 3 Waiting Room proof under `tools/room-design/waiting-layout/`; prior room proofs and runtime remain unchanged. The confirmed furniture arrangement is a two-person south-facing bench in A2/A3, an east-facing B1 chair and west-facing B4 chair. All four seats are permanent and remain drawn through overlapping doorway states. That is a presentation rule only; occupied characters, seat allocation and runtime routing are not implemented. The table, N1 wall-mounted magazine rack and A4 plant are optional.

The shell exposes all 14 door segments plus four independent north-neighbor flags. It retains the accepted 14px east/west caps, 29px low backed north/south boundaries, headerless backed-north openings, half-owned east/west floor seams and current-room floor through south openings. The room has a distinct continuous warm woven carpet with fine grain and no 4 × 3 grid lines.

The owner-reviewed `waiting-furniture-atlas-01.png` and exact prompt are preserved unchanged. `pack-assets.py` alpha-crops and technically packs a quality-88 WebP display atlas without rotation or semantic editing; `atlas.json` and `atlas-provenance.md` record the measurements and method. Source-foot contact rows are distinct from shadow-inclusive image bottoms. Focused validation passes 14 controls, 16 adjacency masks, wall/floor ownership pixels, permanent/optional fixture behavior, aspect/contact metadata, asset load, keyboard focus and desktop/320px rendering.

Source and delivered fragment match SHA-256 `98183D082F87CB2BE9BA606720A289F8BC4E610AF3D2936333736EB2C2EAE122` (283,778 bytes). Rotation, occupied-character fit and runtime integration remain outside this first proof.

### Waiting Room v2 walk-around / west-view candidate

The second isolated candidate keeps the confirmed four-seat arrangement but moves the bench and chairs south within their tiles and models their actual sub-tile footprints. Seats are permanent and remain drawn through doorway overlap; route clearance now goes around them. The optional magazine table is nonpassable whenever shown. With it present, the provisional radius-0.16 model reaches all 14 door approaches and supports three review routes: north of the bench, behind the side chairs, and along the south aisle. The walking actor is depth-sorted from its registered feet against fixture floor contacts.

The 90° west-side view uses the analytic counterclockwise room transform `(x, y) -> (y, 4 - x)`, changing 4 × 3 to 3 × 4. Room-local placements rotate rather than being duplicated: bench S -> E, left chair E -> N, and right chair W -> S. The UI presents world-facing door labels in normal order while mapping each back to the same physical local boundary. The enlarged rack remains tied only to local N1 backing/door conflict, not local WA.

The exported fixture contract carries room-local footprint, ground anchor, seat points/facing, approach point, collision and persistence, then exposes the transformed world footprint, anchor, ground contact, seats, approach, facing and draw order for the active orientation. This is the integration shape to retain when permanent room furniture moves into runtime rendering.

The west furniture PNGs and canonical identity-3 cardinal walking frames are technically cropped and packed for browser display without semantic edits or raster rotation. Actor registration uses the source `(64, 181)` feet point and the authored 1.35 × 2.025 tile frame envelope. That envelope includes transparent padding; it does not validate visible-body clearance, turning, seated-pose fit, seat assignment, or runtime pathfinding.

Focused validation passes original and west views: all 14 controls, analytic endpoint mapping, transformed fixture/seat/approach anchors, interpolated route collision checks with the table shown, blocked table center, permanent-seat behavior, rack N1 rule, ground contacts, depth ordering, shell/floor pixels, keyboard focus, asset loading, and desktop/320px layout. The revised source and delivered fragment match SHA-256 `80BE673C54622848A77A3308E20073E6E386496AAE3582EF93AE72C5FFE38B44` (735,117 bytes). This remains an isolated visual candidate; runtime and occupied sitting are not implemented.

## Bathroom first candidate — 2026-09-17

Sol built a fixed-orientation 2 × 2 Bathroom proof under `tools/room-design/bathroom-layout/`. It uses the shared 120px tile scale, 90px tall north wall, independently backed 29px north segments, 14px side caps, 29px south cutaway, transparent north ownership, midpoint east/west floor seams and current-room floor through south openings. The floor is a distinct small pale cream/sage tile pattern.

The left sink and right toilet are permanent solid fixtures with measured source ground contacts registered to narrower logical bases. Sink use is approached from the south while facing north. The toilet records a separate elevated seat attachment facing south and a separate southern approach. The N1 mirror is centered above the sink, stays within the tall wall, and hides only for N1 doorway/backing conflicts; WA does not hide it.

A provisional radius-0.16 route from the S1 entry reaches all eight aperture-safe doorway approaches and both use points without crossing inflated fixture bases. Endpoint checks independently enforce the aperture/jamb margin. This does not establish visible-body, turning, occupied-use or runtime navigation fit, especially where upper basin/bowl art overhangs the bases.

The new parent-reviewed/owner-pending source PNG and exact prompt remain unchanged. Technical quality-88 WebP crops retain source aspect and measured non-shadow contact metadata. Validation passes eight controls, four north masks, interpolated collision checks, independent aperture margins, fixture permanence/contact/aspect, mirror rules, floor seams, keyboard interaction and desktop/320px rendering. Source and delivered `bathroom-layout.html` match SHA-256 `365E5B855551FBD5AEBC0934A58944BF0A03879BAC5D73B91C3F40FBC53AB998` (116,971 bytes). Runtime and character files were not changed.

## Bathroom approved use behavior — 2026-09-17

Owner approved a later-integration contract recorded in `tools/room-design/bathroom-layout/bathroom-behavior.json`. It applies to any character already assigned a Bathroom visit; it does not expand current founder-only eligibility or assign new roles. Normal cardinal walking proceeds to the toilet attachment. Walking in A1/A2 renders behind both permanent fixtures. On toilet arrival only, use the existing static seated south-facing pose for two **facility game minutes**, rendered in front of the toilet. Then walk normally to the sink attachment; A1/A2 walking remains behind both fixtures. On sink arrival only, use the existing static standing/idle north-facing pose for two facility game minutes, rendered in front of the sink. No washing animation or raster art is authorized.

The two use timers exclude travel. Current `FounderActivityState` has one `visit_bathroom` route/work timer, `advanceFounderActivity` starts its countdown after route completion, the view model does not derive Bathroom seated state, and FacilityScene has no Bathroom pose/layer override. A later owned runtime milestone must add ordered phase/attachment state and narrow relevant-fixture foreground behavior without changing eligibility. Existing proofs and authored character art remain unchanged.

## Minor Procedure Room first candidate — 2026-09-17

Sol built the isolated fixed north-up 3 × 3 proof under `tools/room-design/minor-procedure-layout/`. It reuses the accepted 120px cream/sage shell and supplies all 12 door controls, three independent north-neighbor controls, transparent north ownership, midpoint east/west seams and current-room floor through south openings. Its continuous muted blue-gray speckled floor is room-specific.

The permanent solid table runs north-south. Its patient attachment is at the south foot facing south. The opposed permanent nonblocking stool faces north for the clinician; the grounded light is permanent and nonblocking. The sink, supply cabinet and trolley are optional nonblocking proposals with doorway/backing conflicts `N1/WA`, `N3/EA` and `S1/WC`. Permanence defaults remain pending owner review.

The proof separately exports logical footprints, registered floor contacts, elevated visible-seat attachments and navigation approaches. Corrected table 02 produces 47.07px source-derived seat rise while the stool produces 50.67px; neither sprite is stretched to erase the 3.60px variance. The light is grounded at its floor base and its raised articulated arm is presentation overhang. Actual character-to-seat registration and occlusion remain unverified.

The provisional radius-0.16 route model reaches all 12 doorway approaches plus patient and clinician approaches without crossing the inflated table. Focused validation checks interpolated route segments, aperture/jamb margins, all eight north masks, optional hiding, permanent fixtures, shell/floor pixels, crop contacts/aspects, seat/floor/approach separation, keyboard interaction and desktop/320px rendering. Parent-reviewed source art and exact prompts remain unchanged; the embedded quality-88 WebP is a technical browser derivative. Source and delivered fragment match SHA-256 `DDF96F6F0A47BEA25CF0A16752B8D0A36F00D55C976CBFC5C312209A1FADCC7F` (265,769 bytes). No runtime or character files changed. Owner visual approval remains pending.

### Minor Procedure B2/wall-light revision

The first proof is preserved as `minor-procedure-layout-v1.html` at its preceding hash. The revised walking contract blocks exactly B2 rather than the table art's narrow floor projection; all eight other tile centers and all 12 doorway approaches remain reachable at the provisional 0.16-tile radius. A2 is intentionally traversable north of the art and would depth-sort behind it. The explicit south patient attachment remains separate from route space.

Sink and cabinet are flush to the north edge. The floor lamp was removed. A new independent, default-on N2 wall-mounted light has no floor footprint, uses a measured source mount point, and hides for N2 doorway/backing or its own off toggle. The wall light and revised routing are isolated-proof contracts only; runtime collision, depth and interaction remain unimplemented.

Revised source and delivered fragment match SHA-256 `10F1E893F0BA0FD9B4C8235128F7D5E6B9197F147909C790E115D0E7B8799E1E` (318,994 bytes).

### Minor Procedure owner-approved pose contract

The owner approves static cardinal seating: patient south-facing at the table foot; founder or employee north-facing on the stool. `tools/room-design/minor-procedure-layout/minor-procedure-behavior.json` preserves the current floor projections, elevated source-registered seat points and distinct navigation approaches. B2 remains the only blocked tile, A2 remains traversable behind the table art, and the patient seat is an attachment rather than a route into B2.

The record intentionally does not define duration, eligibility, assignment, staffing or gameplay effects. Runtime pose selection, coordinate transforms and final occupied-character registration remain pending.

## Ultrasound isolated proof — 2026-09-17

Terra completed `tools/room-design/ultrasound-layout/` and the matching delivered `ultrasound-layout.html` fragment. The candidate is fixed north-up 3 × 3. B2 is the only proposed navigation blocker; patient use at the table foot faces South, the console equipment faces South while the operator approach faces North, and the C3 technician stool faces North. Console/stool remain permanent and nonblocking; optional north-flush sink/cabinet visibility follows their whole door/backing conflict groups. The final proof contains no lamp or trolley.

The proof records source and contact provenance in `atlas-provenance.md` and `atlas.json`. Its focused validator covers the B2-only navigation contract, eight traversable centers, 12 aperture-safe door approaches, service paths, 8 north-adjacency masks, permanent/optional visibility, contacts/aspects, keyboard operation and desktop/320px layout. It is not a runtime service or character-fit integration.

Source and delivered fragments match SHA-256 $sourceHash$ (323,012 bytes). Focused direct and host-frame captures are under 	ools/room-design/ultrasound-layout/evidence/; no runtime, character, asset-source, session, or deployment changes were made.

### Ultrasound revision 02 — horizontal bed and new atlas

Owner approved the horizontal arrangement for the isolated proof: head West/foot East table, patient seated South at east foot, technician seated North at shared x=2.2, South-facing console below the West head, permanent nonblocking console/stool, and only an optional northwest cabinet. Sink, lamp, and trolley are absent. New parent-reviewed atlas provenance, physical contacts, and patient/stool screen-x alignment are recorded alongside the proof. Runtime navigation and characters remain out of scope.

Revision-02 source and delivered fragments match SHA-256 $hash$ (202,132 bytes); desktop, 320px, overlay, all-open/backed and host-frame captures were regenerated under 	ools/room-design/ultrasound-layout/evidence/.


### Ultrasound revision 03 — north-edge console and N2 wall print

The isolated model now anchors the unchanged South-facing console at C1 north edge `(0.8,2.33)` with `top=2.0, h=.33`; the North-facing operator/approach remains `(0.8,2.84)`. It declares the south lane `(0.2,2.7)` to `(1.4,2.7)` clear and `front-of-console` for later character sorting. This is a design handoff only: no runtime layer, navigation, character, or service code changed.

`ultrasound-wall-print-01.png` is packed technically and drawn entirely in N2’s tall back-wall face at 0.4 tile. It is optional decorative art with no floor collision and hides for N2/open or backed-N2. The existing cabinet behavior remains N1/WA/backed-N1. Audit evidence records unchanged widths and 48–50px seat rises; shorter revision-02 sprite silhouettes can make furniture appear smaller but were not stretched or otherwise altered.

Revision-03 source and delivered fragments match SHA-256 `D8C7FCA2C8BD5414052210F1F96E8D806AFCB0B0825C39B2B4052B1E308B7758` (365,966 bytes). Focused validation and desktop/320px host-frame captures were regenerated under `tools/room-design/ultrasound-layout/evidence/`.

### North upper-face palette review — 2026-09-17

Terra applied the approved per-room colors only to exposed tall north upper faces in the eight isolated proofs. The palette and exclusions are recorded in `tools/room-design/north-wall-palette.json`. All backed/low north sections, green trim, east/west and south shell pieces, floor, background and decorative assets retain their former behavior. Active sources were snapshot as `*-prepaint-v1` (and Ultrasound `*-prepaint-v3`) before this narrow presentation change. No runtime renderer, navigation, fixture, character, source-art, session or deployment code changed.

Focused existing geometry validators and a live-canvas color audit pass for Front Desk, Examination, Waiting, Bathroom, Minor Procedure, Ultrasound, Hallway and Combined. Matching inline fragments were copied to the visualization delivery directory.


### X-ray isolated proof — 2026-09-17

Terra added `tools/room-design/xray-layout/` and a matching delivered fragment. The proof uses parent-reviewed X-ray art through technical WebP packing only; exact source crop/contact provenance is in `atlas-provenance.md`. It validates B2-only blockage, eight other centers, all 12 door approaches, standing patient/technician paths and facings, apron hide/restore, overlay, all-open and 320px. This is isolated design proof only; no runtime or character changes occurred.

X-ray final cleanup removed stale Ultrasound `southPassage` metadata; source and delivered fragment SHA-256: `20666FCF3C982AEA07F525FCD5A37528E46BD4EC8A7CA7A5346669C728F6D2D7`.

### Backed north paint correction — 2026-09-17

Owner approved matching the cream face of a backed/short north segment to that room’s north upper-face palette. The isolated Examination, Hallway, and Combined renderers now do so; their solid green backed-north trim remains green. Front Desk already used its own `#efe1bd` face. This change does not alter south or east/west walls, shells, floors, doors, fixtures, anchors, routes, or runtime rendering.

### CT Suite investigation — 2026-09-17

Runtime defines CT as a fixed north-up `4 × 4` room with a default south door. Its navigation contract blocks `(0,0)`, `(3,0)`, and `(3,1)`, uses primary anchor `(1,1)` and staff anchor `(2,3)`. Its visual door zones remain near north/south 80% and east/west 8/78% offsets. The existing runtime presentation only has a CT gantry, cabinet, rolling cart, radiation marker, and wall window; it has no technician console, interior partition, or seated-patient fixture contract.

For the next isolated proof, keep the scanner in the northwest/central bay and place a short free-standing north–south partition in the east half, with open aisles at both ends. Put the new console in the east nook. This separates technician and scanner visually without contacting any exterior wall or changing any door zone; the isolated proof adds its own partition blocker. The user-selected patient attachment is south at the scanner-bed foot; final operator-facing and precise partition dimensions remain presentation decisions for the CT proof.

### CT Suite isolated proof - 2026-09-17

The new candidate under tools/room-design/ct-layout is fixed north-up 4 x 4 with all 16 wall controls and four backed-north controls. Its exposed north face is dusty mauve #dacbd5; backed north remains solid green. The permanent scanner is 2 tiles wide. Its conservative navigation blocker (.5,1,1.8,1.65) is separate from two gantry-foot bases and the couch-pedestal physical footprints. The patient has a source-derived south-facing seat at the scanner foot, 55.81px above its floor anchor, and a separate approach at (1.4,3.1).

The permanent top-down partition at x=2.69..2.81, y=.75..3.15 is a proof-only solid blocker with a muted blue observation window. It separates the East nonblocking console while leaving north and south aisles, all exterior door approaches, and the patient/technician routes reachable. The console faces South; its technician approach at (3.35,2.7) faces North. Runtime CT collision, furniture, staffing, poses, service timing, and eligibility remain pending integration.

Atlas provenance records alpha-bound technical crops of the unchanged parent-approved ct-furniture-atlas-02.png. Focused validation covers 16 doorway routes, patient/technician paths, scanner/partition collision, source contacts and seat rise, selected-route drawing, backed north behavior, physical canvas wall clicking, desktop/320px, host frame, and all-open/backed evidence.

### CT wall decor revision - 2026-09-17

The approved CT proof adds two wall-only decorations from the parent-reviewed `ct-wall-art-01.png`: framed scan at N1 and botanical print at N3. They sit entirely in the tall north face, have no floor footprint or navigation effect, and hide only for their own N doorway or backed-N segment. West/east doors never hide either item. Source crop/technical packing is recorded in `tools/room-design/ct-layout/wall-art.json` and `atlas-provenance.md`.

### CT cat-scan wall gallery revision - 2026-09-17

For static review only, the CT source proof replaces the two previous wall prints with four coordinated framed cat scans, one on each N1 through N4 segment. Each frame is 80px tall at y=48 and may overlap the green wainscot. Every frame hides and restores independently for only its own north door/backed state; side doors have no effect. `ct-cat-scans-01.png` remains unchanged; `cat-wall-art.json` records threshold-32 padded crops and the lightweight technical WebP derivative. The delivered interactive CT fragment intentionally remains at the prior accepted hash until the next interactive proof milestone. Static review capture: `tools/room-design/ct-layout/evidence/ct-cat-gallery-room.png`.

### Phlebotomy Station rotatable isolated proof - 2026-09-17

The completed isolated proof uses the shared shell at 120 pixels per tile: a 3 × 2 South view and its 90-degree-counterclockwise 2 × 3 East view. Both views expose ten dynamically relabeled wall segments, current-view north-neighbor controls, transparent north apertures, half-thickness east/west floor seams and south floor-to-base apertures. The exposed north face is rose `#e2c3ca`; backed north is the shared 29-pixel green treatment; the floor is fine ivory terrazzo.

The permanent patient chair is grounded at `(1.5,.98)` and is the only solid blocker, `x=1.05..1.95, y=.50...98`. The permanent `.52`-tile staff stool is grounded at `(1.5,1.70)` and remains nonblocking. Counterclockwise rotation applies `(x,y)->(y,3-x)`, producing chair B1 and stool B2 positions. The optional `.8`-tile sink cabinet and tubes at `(.43,.30)` hide for world N1, WA or backed N1; these conflicts appear at local WC/S1 in the East view and never at S2.

South and East source crops preserve their own aspect ratios at equal physical heights. The East chair uses source ground `(280,742)` and seat `(508,448)` within its crop, yielding a 42.72-pixel rightward seat shift and 55.10-pixel rise. Patient/staff pose directions are South/North and rotate to East/West. Seat contacts, floor contacts, approaches, footprints and the chair navigation blocker are exported separately; occupied-character fit remains future runtime work.

The radius-`.16` proof routes from the default world S2 entry to all ten door approaches and both use approaches in each orientation without crossing the inflated chair blocker. Focused validation covers all 2,048 door masks, backed/optional restoration, source contacts/aspects, dynamic canvas height, actual canvas-coordinate clicks, keyboard activation and desktop/320-pixel layouts. Host-rendered captures are under `tools/room-design/phlebotomy-layout/evidence/`. Source and delivered fragments match SHA-256 `23A119429F1D4217BA36BAA7221D19EE26EEF06D768B796C555ED914DDE34AF9` at 366,227 bytes. No runtime, character, clinical timing or source-art files changed.

### Phlebotomy floor, furniture and curtained-window revision - 2026-09-17

The owner found the first floor too plain and the first East furniture view too shallow. The revised floor is a continuous 24-pixel ivory terrazzo tile pattern with restrained rose and warm-gray variation. It is anchored once at the room floor origin, continues through east/west half-seams and south floor-base extensions, and does not draw the 120-pixel gameplay-cell grid. Shell dimensions, wall colors, routes, collisions, cardinal poses and logical fixture footprints remain unchanged.

The new parent-reviewed `phlebotomy-furniture-east-02.png` uses a higher camera and broader top surfaces. Its chair and stool render 15 percent taller than revision 01; the South chair stays 143 pixels tall and both sink views increase to 138.84 pixels. Registered East crop contacts are chair ground `(319,793)`/seat `(539,512)`, stool ground `(216,498)`/seat `(217,123)` and sink ground `(242,804)`. The independently measured chair/stool seats land within three rendered pixels. The East sink retains nominal rotated logical ground `(.30,2.57)` but uses an explicit art-only `(+.10,+.31)` view-registration offset, planting its physical base at `(.40,2.88)` near the south wall without changing its footprint or WC/S1 conflict rules. The previous East technical pack remains as `east-01.webp`/`east-01.json`.

Every exposed tall current-view north segment now has one centered 80-pixel curtained window. Each window is wall-only and noncolliding, hides only for its own north doorway or backed-north state, and naturally sits behind the South-view sink. The final `phlebotomy-curtained-window-02.png` uses closed white translucent sheers across all panes; no tree, sky or recognizable exterior scene remains. The earlier outdoor-view technical pack is preserved as `window-01.webp`/`window-01.json`.

### Phlebotomy conditional-approval adjustments - 2026-09-17

Owner conditional approval is fulfilled by restoring the South 3 x 2 sink cabinet to its pre-enlargement 120.73-pixel height and omitting the South N1 window permanently. Hiding the optional sink does not install an N1 window. South N2/N3 and East N1/N2 retain the approved closed-sheer windows and independent door/backed-wall hiding behavior. The East furniture, logical fixture placement, collision, route, pose and doorway contracts are unchanged.

Focused validation passes both orientations, all 20 door routes, all 2,048 door/window masks, all 12 backed-window masks, registered contacts/aspects/heights, explicit South N1 absence with the sink visible and hidden, physical canvas click, keyboard activation, and desktop/320-pixel host rendering. The refreshed source and delivered fragment are both 681,994 bytes and share SHA-256 `E4BFD35417FC777D2491832D53F14E92FF694200D56E3D9BA950AC85AF8E7C14`.

### Environmental-Services Closet isolated proof - 2026-09-17

The fixed north-up 2 x 2 proof uses the common shell with pale muted-sage north walls and a continuous 24-pixel sage/stone utility floor. It exposes all eight legal doorway segments with S2 as the default. Two tall, cluttered cleaning-supply shelf banks stand at north-segment grounds `(.5,.72)` and `(1.5,.72)`; each optional nonblocking bank hides only for its own north doorway, its own backed-north state, or the optional toggle. A permanent nonblocking mop bucket/caddy stands at `(1.55,1.45)`. No windows, character poses, clinical timing, blocked tiles or runtime files are introduced.

The parent-reviewed `evs-furniture-atlas-01.png` is packed without rotation. Measured crop-relative contacts are shelf one `(298,959)`, shelf two `(245,940)`, and bucket `(245,899)`. The shelf heights of 175 and 180.21 pixels preserve a common source-pixel scale across unequal alpha crops. Validation covers eight routes, all 1,024 door/backed-north combinations, own-segment hiding/restoration, optional and side-door behavior, source crop bounds/contacts/aspects, actual canvas-coordinate clicking, keyboard activation and desktop/320-pixel host rendering. The 300,044-byte source and delivered fragment share SHA-256 `794BAB21DE32547DB25C02B834F6E4E39EB1739E50898D8CA81730FEA5737B1F`.

### Environmental-Services Closet full-wall revision - 2026-09-17

The parent-reviewed `evs-furniture-atlas-02.png` replaces the tall narrow shelves with two broad cleaning-supply banks and adds two dense lateral floor groups. Solid-alpha furniture widths render at 119 pixels per shelf, filling N1/N2 with an intentional center seam; visible tops align near y=52 and bases register at grounds `(.5,.35)` and `(1.5,.35)`. B1 clutter at `(.4,1.87)` hides for WB or S1, while B2 clutter at `(1.6,1.87)` hides for EB or S2. The N shelves retain their own north-door/backed-wall rules. The optional toggle hides all four groups. Atlas01 remains preserved and supplies the permanent nonblocking bucket, repositioned to `(1.25,1.15)`.

The preview initially has every doorway closed so the complete requested closet is visible, with S2 selected for the first interaction. Only the north paint changes to muted deep gray-olive; east, west and south retain the common shell. The floor becomes a darker continuous 24-pixel utility-stone pattern. All fixtures remain nonblocking, all eight routes remain reachable, and no runtime navigation, timing, staffing or pose code changes. Validation passes all 1,024 door/backed-north combinations, four independent hide rules, optional restoration, source contacts/aspects, real canvas clicking, keyboard activation, and fresh desktop/320-pixel host rendering. The 491,497-byte source and delivered fragment share SHA-256 `5F157AB35C11F50ECE424CF4762E3F4FAB5D843069A16AD5EE85F4A761755DDA`.

Owner explicitly approved the Environmental-Services Closet full-wall revision on 2026-09-18. This approves the isolated presentation proof at the hash above; runtime integration remains a separate milestone.

### Endoscopy Room rotatable isolated proof - 2026-09-18

The accepted isolated Endoscopy proof uses the common 120-pixel shell as a dark `4 x 3` South view and a fresh-art `3 x 4` view rotated 90 degrees counterclockwise. It exposes all 14 doorway controls in both views, with four default and three rotated backed-north controls. The north upper paint is dark blue-gray `#536168`; the continuous 24-pixel utility-slate floor is `#778087` with restrained warm speckles. East, west, south, trim and doorway construction retain the approved common shell.

The procedure table is grounded by its South foot contact at `(1.5,1.95)`. Its full-bed solid footprint/blocker is `(.95,.35,1,1.6)`; after rotation, the foot contact is `(1.95,2.5)` and the blocker is `(.35,2.05,1.6,1)`. The rotated art registers to the right/east wheel rather than the image center, leaving patient approach `(2.3,2.5)` beyond the foot. Staff uses `(2.3,1.5)` facing West by default and `(1.5,1.7)` facing South after rotation. The permanent nonblocking tower uses `(2.9,.85)`. Optional cabinet and sink fixtures preserve world conflicts N1/WA/backed N1 and N4/EA/backed N4 through the rotated wall mapping.

The `During procedure` control replaces the empty bed art with a matching occupied state. The individual selected patient disappears at attachment; the occupied bed shows a generic fully covered humanoid with hairnet and only the head uncovered, facing West/default or South/rotated, away from the endoscopist. Disembark restores the empty bed and individual patient. `handoff-contract.json` records this as the owner behavior for future Endoscopy and OR runtime work without adding OR art, timing, or clinical rules. Source-derived ground and virtual procedure-attachment contacts are separate.

Validation passes 28 doorway routes and four use routes with radius `.16`, including samples along every simplified segment against the inflated full-bed blocker. It also covers all controls, 4/3 backing counts, counterclockwise door remapping, cabinet/sink hiding and restoration, empty/occupied replacement, source contacts/aspects, real canvas-coordinate clicking, keyboard activation, and desktop/320-pixel host rendering. Parent review accepted both cardinal views, procedure states, and the East overlay. The 364,663-byte source and delivered fragments share SHA-256 `08C6C576B8A49B4BF9901D7CDDC61C37BC02A2B2A1032AC3B5DEFCEB90B452EB`. Runtime rendering, pathfinding, staffing, timing, and OR implementation remain pending.

Focused validation passes both orientations, all 20 door routes, all 2,048 door/window masks, all 12 backed-window masks, source contacts/aspects/scales, the planted East sink registration, floor metadata, real canvas-coordinate clicks, keyboard controls and desktop/320-pixel layouts. Final host evidence includes default South, East overlay, independent N2-door/N3-backed window hiding and 320-pixel captures. Source and delivered fragments match SHA-256 `6A0C26600BC48A8EB20F4339AF1FE348C0D39A6DEEB7B5829853D127B384840E` at 681,874 bytes. No runtime, character, service, timing, clinical, deployment or session files changed.

### Peri-op / Recovery 8 x 8 isolated proof - 2026-09-21

The owner marked the latest dark occupied-bed Endoscopy design done and approved before work moved to Peri-op/Recovery. That approval closes the isolated Endoscopy art direction; runtime integration remains separate.

The Recovery proof expands the presentation to a fixed square `8 x 8` room with sixteen perimeter bays: N3-N6, S3-S6, WC-WF and EC-EF. Each bed points its head toward the wall and foot toward the center. The center remains open around a two-position nursing counter and two South-facing nurse stools. A continuous aisle separates the 1.5-tile bed footprints from the central solid counter. Patients are designed to sit at bed feet like Examination; the pack records separate provisional cushion contacts, physical foot registrations and route approaches.

All 32 common wall segments remain selectable. Opening a bay-owned segment hides exactly its bed and monitor and clears shared dividers touching that bay, so visible capacity is `16 - open bay-owned doors`. Corner-zone doors remain legal and remove no bed. Backing any north segment hides only its calming wall art; north beds remain. This count is proof metadata only: current runtime still reserves an entire room instance for one active recovery operation, and no capacity, reservation, save, staffing, timing, pathfinding or clinical code changed.

The proof uses cardinal bed art, an open counter/stool/monitor/divider/art atlas and a low cutaway side-divider revision. Validation covers each of 32 doors individually, bay/monitor ownership, shared-divider hiding and restoration, corner/pair/mixed/all-door states, eight backed-north wall-art states, all active bed and stool approaches, sampled route edges against radius `.16` inflated blockers, physical registrations and provisional elevated seat contacts, a real canvas-coordinate click, keyboard activation, widget-state restoration, desktop layout and actual hosted 320-pixel rendering. Parent visual review accepted the final bed, monitor, divider, station and stool placement for the first owner proof.

The final source and delivered fragments are both 266,631 bytes and share SHA-256 `FD6DEE5280D8CFE0A5E38A2EB81ABD240D2BEA1C0F0CC75E1BB604D378B049C9`. Hosted validation also exercised a real bay-door interaction inside the visualization wrapper and confirmed no horizontal overflow at 320 pixels.

### Peri-op / Recovery 6 x 6 eight-bay revision - 2026-09-21

The owner revised the isolated proof to a `6 x 6` room with eight more widely spaced bays centered at `2.25` and `3.75` on every wall. Beds use the approved Examination physical scale, `1.55 x .70` tiles or `186 x 84` pixels at the common 120-pixel tile. Their source cushion contacts rise 41.47-41.85 pixels from their registered floor projections, within 1.5 pixels of the approved Examination references. The two nurse stools reuse the exact approved Examination crop at 60 pixels wide and 50.68 pixels base-to-seat rise. The two-monitor blue station uses the Front Desk base scale, 240 pixels across, with a measured 93.24-pixel facade.

All 24 wall segments remain legal. `N3`, `N4`, `S3`, `S4`, `WC`, `WD`, `EC` and `ED` own bays; opening one hides exactly its bed and inward-facing cardinal monitor. Four solid partitions run wall-to-foot and disappear when either adjacent bay opens. Their radius-`.16` collision participates in the route model. Eight unique framed scenes remain assigned without inventing side-wall billboards. Four draw on the tall north wall at N1, N3, N4 and N6. N1/N6 are the former WD/ED partition pieces and now hide only for their physical north door or backed state; no partition-mounted art remains. The remaining view-occluded assignments stay in the contract.

Validation covers all 24 single doors, mixed and all-door states, unrelated furniture restoration, partition ownership, six independent north-backing states, all active bed and stool approaches, route samples every `.02` tile against inflated beds/counter/partitions, exact physical scales and source contacts, real wall-target clicking, keyboard activation, widget-state restore/save and hosted desktop/320-pixel rendering. Parent visual review accepted the final composition. Runtime capacity, reservations, saves, staffing, timing, pathfinding and clinical behavior remain unchanged.

The owner marked this Recovery room done after moving the two partition artworks to N1/N6. This approval applies to the isolated presentation proof; runtime integration remains separate.

### Training Room 3 x 3 hands-on lab proof - 2026-09-21

The isolated Training proof uses the common 120-pixel shell as a compact `3 x 3` hands-on lab with terracotta `#c88f76` north paint and a continuous fine 24-pixel warm-tan floor. All twelve perimeter segments remain legal door positions, and all three north segments support the backed-wall state.

A permanent solid two-person practice bench occupies `(.65,.85,1.70,.60)` with registered training-arm and suture-pad work positions. Its 204-pixel physical foot span produces an 85.94-pixel measured ground-to-front-worktop rise. Two permanent nonblocking stools at `(1.05,1.70)` and `(1.95,1.70)` face North and reuse the exact approved Examination crop at 60 pixels wide and 50.68 pixels seat rise. Optional decor clears only for its physical conflicts: the combined cabinet/anatomy model for N1, WA or backed N1; the whiteboard for N2 or backed N2; and the graduation-cap skeleton for N3, EA or backed N3.

Focused validation covers every single door, mixed fixture conflicts, all three backed-north states, unrelated restoration, permanent bench/stools, source contacts and uniform aspect, all twelve door routes and four use routes sampled every `.02` tile against the radius-`.16` inflated bench, real canvas-target clicking, keyboard activation, widget-state restore/save, and hosted desktop/320-pixel rendering. This is a presentation proof only; no runtime, balance, save, timing, training-progression, or clinical-content behavior changed.

### GLP-1 Telehealth Suite rotatable isolated proof - 2026-09-21

The Telehealth proof uses the common shell as a `3 x 2` South view and a fresh-art `2 x 3` West view rotated 90 degrees counterclockwise. Both expose ten legal doors. The permanent solid two-person desk has South ground `(1.5,1.5)` and footprint `(1,.5,1,1)`; its West registration is `(1,2)` with rotated footprint `(.5,1,1,1)`. Two permanent nonblocking chairs face East/West in South view and North/South in West view. Their approaches and every doorway remain reachable around the radius-`.16` inflated desk.

World plants at `(.25,.33)` and `(2.75,.33)` rotate to `(.33,2.75)` and `(.33,.25)`. South hide owners N1/WA and N3/EA become West local WC/S1 and WA/N1. Backing hides a plant or obscured-view window only when its physical owner is on the current view's north wall. The proof restores rotated world backing through widget state. Desk, chairs, and divider remain permanent for every door state.

Focused validation waits for all three embedded images to load and render before reading contacts. It covers both orientations, all twenty single-door cases, all-door and mixed states, exact desk floor contacts and footprints, rotated plant positions and hide ownership, current-north backing, permanent furniture, every door and seat route sampled every `.02` tile, real canvas-coordinate clicking, keyboard activation, widget restore/save/set-globals, and hosted South/West desktop plus West 320-pixel rendering. The north-facing chair seat is an inferred occluded source attachment reference and is not claimed as a directly visible cushion measurement. No runtime, clinical, balance, save, service, or timing files changed.

### Cross-room consistency inventory and Telehealth depth fix - 2026-09-21

The approved Telehealth proof now sorts every movable visual by floor-ground depth. In South view both north plants render behind the two chairs, which remain behind the desk. In West view the order is rubber plant, south-facing chair, desk, north-facing chair, then the foreground snake plant. This removes the incorrect rear-plant overlap while preserving the valid foreground plant. Focused, widget-state, hosted South/West desktop and West 320-pixel checks pass. The refreshed source and delivered artifact are both 635,148 bytes with SHA-256 `583BFC3E8813177F1492C0D211EA517BE82EC00ABC5FC269C673D0375EDE3496`.

`tools/room-design/consistency-audit/inventory.json` inventories all sixteen owner-confirmed isolated proofs with canonical paths and hashes, dimensions, source assets, known physical spans and contacts, poses, blockers/pass-through rules, depth exceptions, door/backing ownership, rotations, evidence links and explicit unknowns. `README.md` gives the concise readiness table. Validation confirms fifteen source/delivery matches. CT is the exception: current source contains the latest four N1-N4 cat scans while delivery still contains the obsolete two-print scan/botanical revision; it was recorded but not synced. Endoscopy source and delivery match each other but neither uses the owner-approved `endoscopy-occupied-beds-dark-01.png`. The prior comparison found its generic covered head too small. No room has verified GS-018 occupied-character fit, and no approved Operating Room proof exists. These findings gate the next same-scale occupied comparison rather than authorizing arbitrary room resizing or runtime replacement.

### Coffee Kiosk 2 x 2 isolated proof - 2026-09-21

The Coffee Kiosk proof uses the shared 120-pixel shell as a compact `2 x 2` room with muted latte-rose north paint and a continuous 18-pixel terracotta-and-cream floor texture. All eight perimeter segments are legal door locations; N1 and N2 independently support backed-north presentation.

A permanent central coffee island occupies `(.50,.60,1.00,.80)` and never hides for a doorway or backed wall. Its measured physical foot span is 720 source pixels (`x=280..1000`), uniformly rendered to 120 pixels; the registered floor contact is `(1,1.4)`, and the source front countertop edge yields an 82.5-pixel rendered facade rise. The route model keeps a radius-`.16` walking loop around all four sides and reaches the north-facing service point `(1,1.62)`.

Two square wall-only prints occupy the tall north wall: `DEJA BREW` at N1 and `JAVA GOOD DAY` at N2. Each hides only for its own north doorway or own backed-north segment. They have no pathing, gameplay, or clinical effect.

Focused validation covers eight individual and all-open door states, both backed-north states, permanent island restoration, print ownership, full-perimeter and route-segment sampling at `.02`, source contacts/aspect, canvas clicking, keyboard activation, widget-state restore/save and hosted desktop/320-pixel rendering. This remains a candidate isolated presentation proof: no runtime, save, timing, staffing, training, clinical, deployment, or session code changed.

### Approved Endoscopy dark occupied art and CT delivery sync - 2026-09-21

The unchanged CT proof source with four independently owned N1-N4 cat-scan prints was copied verbatim to the delivered `ct-layout.html`; both files are 893,885 bytes with SHA-256 `5625BF5B988E4B4DEB795BB1CAE11570DE63926F87DDA7566B46274A1550CDC1`. The obsolete two-print/botanical delivery is no longer active. No CT source or runtime file changed.

Endoscopy now packs the owner-approved `endoscopy-occupied-beds-dark-01.png` into both `During procedure` frames. Its larger generic covered patient has a west-facing head in the South 4 x 3 view and south-facing head in the rotated East 3 x 4 view. The empty frames remain `endoscopy-bed-south-01.png` and `endoscopy-bed-east-02.png`; logical foot contacts, full-bed blocker, routes, staff/approach positions, room props, and individual-patient replacement behavior are unchanged. The occupied South crop solid bounds are `(73,51)..(532,974)`, ground `(302.5,974)`, rendered height 205 px. The occupied East bounds are `(593,328)..(1527,825)`, east foot contact `(1450,825)`, rendered height 110 px. `atlas-provenance.md` identifies source prompts and registration. The prior side-by-side head-size finding applies to obsolete occupied art; the new revision awaits a fresh GS-018 character-fit comparison.

`node tools/room-design/endoscopy-layout/validate.cjs` passed both orientations, empty/occupied replacement, 28 door and four use routes, controls, hiding, source contacts, click/keyboard and desktop/320 checks. The hosted desktop/320 captures were refreshed and the South/East occupied images inspected. `node tools/room-design/consistency-audit/validate.cjs` passed all sixteen canonical source/delivery hashes, the four-scan CT revision, and the dark Endoscopy occupied frames. Endoscopy source and delivery are both 355,490 bytes with SHA-256 `12EEFD3E19BFB8A2E38EAE22DC1A8F65ED4F0586CC704009980811A1AB2F3551`. These are isolated presentation proofs; runtime and universal occupied fit remain separate.