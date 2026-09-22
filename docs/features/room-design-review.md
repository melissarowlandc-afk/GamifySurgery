# GS-015 room design review

## Owner direction

The owner wants every room rebuilt from a fresh visual foundation, rather than
incrementally repairing the current room layouts. The first review target is
the Front Desk, governed by the connected-building composition in the Overall
Vibe references. The desired visual language is warm cream and deep green,
with colorful plants, upholstery, and wall art; furniture should have richer
detail, coherent shadows, and consistent person-relative proportions.

The reference sources are the owner workspace directories
[Objects or Furniture](../../Photos%20for%20Codex%202/Objects%20or%20Furniture),
[Overall Vibe](../../Photos%20for%20Codex%202/Overall%20Vibe), and
[Rooms](../../Photos%20for%20Codex%202/Rooms). Existing Front Desk and
Examination images are useful comparison evidence, but their geometry,
palette, and furniture positions are not design requirements.

## Current decision state

- The connected-building treatment, rather than a standalone room cutaway,
  governs the first Front Desk concept.
- Previous door, wall, and furniture-location rules are revisable. No legacy
  footprint, coordinate, aperture, or fixture layout is locked by this task.
- Every non-sidewalk-facing wall segment should be eligible for a door. The
  sidewalk-facing Front Desk entrance remains the provisional public-entry
  exception and is not part of customizable door placement.
- A door hides overlapping wall art and optional furniture for as long as that
  door is present. It restores the complete optional item, including its
  shadow, when the door is removed; no asset is deleted.
- The Front Desk desk, receptionist chair, and visitor chair are permanent
  solid/non-walkthrough furniture. The gameplay water cooler is also permanent,
  but its small A5 corner footprint is nonblocking so characters may walk past
  it. Persistence and collision are separate fixture properties.
- All game chairs face a cardinal direction (north, south, east, or west),
  never a diagonal. Concept art should simplify texture and decoration to the
  established character-art style while retaining the approved atmosphere.
- Most game systems remain in place. Before runtime integration, each proposed
  spatial contract change must state its affected entrances, walkable space,
  furniture interaction or seating anchors, actor floor contact, occlusion,
  and save/pathfinding consequence for owner and PM review.
- Keep original assets and implementation history. Do not delete or replace
  them while concept review is underway.

## Proposed reusable visual foundation

Develop rooms as separately composable assets and metadata, rather than baked
room screenshots:

| Layer | Required metadata or responsibility |
| --- | --- |
| Floors | repeat or placement bounds, material palette, and world/room-fixed pattern phase |
| Walls | wall segment bounds, material and edge/corner variants, plus entrance cutouts |
| Doors | side, aperture bounds, open-floor continuity, and destination relationship |
| Fixtures | semantic ID, source/provenance, display bounds, floor-contact anchor, orientation, and room-local placement |
| Shadows | owning fixture or actor, contact anchor, opacity/layer, and bounds independent from collision |
| People and foreground structure | shared character scale, floor baseline, seating/interaction anchors, and explicit depth/occlusion order |

This is a design proposal, not an approval of the existing shell or a runtime
contract. The exact values come after owner review of the first composition.

### Reusable room design contract

- **Shared shell and door language:** rooms use the same orthogonal cutaway
  grammar: tall unshared north boundaries, low shared/front boundaries,
  straight east/west caps, joined corners, and open passage frames. Door
  openings expose the adjoining room's surface; they do not paint a substitute
  neighbor floor into the current room.
- **Room-specific floor:** each room declares its own material, texture scale,
  color variation, pattern phase, and logical dimensions. The Front Desk's
  5 × 4 gameplay grid and 10 × 8 visual finish are one room's values, not a
  universal size rule.
- **Ground contact and elevated art:** every floor fixture has a room-local
  footprint/contact rectangle used for placement. Its sprite may extend above
  that footprint onto a wall or behind another object, using source-image base
  anchors and explicit draw order rather than stretching art to fill a tile.
- **Persistence and collision:** fixture visibility/permanence is independent
  from walkability. A permanent fixture may be nonblocking (the Front Desk
  water cooler), while a solid desk or chair is both permanent and blocking.
  Optional decor may be nonblocking and door-hidden.
- **Wall-attached visibility:** art supported by a wall segment hides when that
  segment becomes a low shared boundary or when a door occupies its attachment
  area. Floor fixtures remain unless their own declared visibility rule says
  otherwise.
- **Chair orientation:** every chair and its seated character anchor faces only
  north, south, east, or west. Diagonal chair art and seating poses are excluded.

## Staged review

1. **Front Desk concept:** [concept 01](../../Photos%20for%20Codex%202/Codex%20Rooms%202/GS-015/front-desk-concept-01.png)
   is generated and parent-inspected, pending owner feedback. It
   is not a production asset, routing proof, or runtime integration.
2. **Front Desk spatial contract:** document the proposed connected-building
   entrance, staff/public zones, furnishings, person scale, and layers with
   concrete consequences before code changes.
3. **Isolated preview kit:** produce owner-reviewable floor/wall/door/fixture
   layers at normal game scale, including an occupied-room view and clear
   entrance/access/occlusion evidence.
4. **Narrow integration:** integrate an accepted batch only after confirming
   ownership of shared renderer files and validating its declared spatial
   contract.
5. **Room batches:** apply the approved foundation to remaining rooms in small
   owner-reviewed groups.

## Open review questions

Concept 01 demonstrates palette and furnishing richness. Its angled camera and
high side walls need revision toward the connected-building game view. Extra
rugs, plants and lights are proposals. Character scale, door access and occupied
occlusion are not yet validated. Exact prompt and review are saved beside the
image in `front-desk-concept-01-prompt.md`.

- Which connected-building edges and exterior context should remain visible at
  the Front Desk?
- Where are the staff and visitor zones, entrances, seating anchors, and
  interaction surfaces in the new composition?
- Which shared architectural motifs repeat across all rooms, and which are
  unique to a room type?
- What person-to-counter, person-to-chair, and person-to-door scale should the
  owner approve from the first normal-scale preview?
- Which prior game-facing spatial interfaces must change, and what are their
  exact routing, save, or character-layering consequences?

## Implementation boundary and current evidence

Terra's read-only review identified a hybrid renderer: reusable bitmap
environment surfaces plus authored room-fixture atlas frames, with procedural
fixture fallback. Main future integration surfaces are
`apps/player/src/facility/FacilityScene.ts`,
`apps/player/src/facility/canonicalRoomShell.ts`, and
`apps/player/src/art/bitmapAssetManifest.ts`; all currently have concurrent
dirty changes and are outside this documentation milestone.

The existing renderer separates logical room state from presentation, and its
door projection, actor floor contact, fixture anchors, and occluder layers are
the interfaces to explicitly reassess before integration. No runtime, server,
asset, or test change was made for this documentation milestone.

## Door and navigation feasibility

The domain already stores doors per wall segment: `DoorState.side` and
zero-based `offset` in `packages/game-domain/src/types.ts`. Its placement
authority, `validateDoorPlacement` in `packages/game-domain/src/doors.ts`,
accepts a clinical-room segment only when it connects an adjacent traversable
space and rejects duplicate physical segments. It currently permits exactly
one exterior entrance: south from the protected Front Desk, at the grid edge.
That matches the provisional sidewalk exception but will need a deliberate
domain change if the public side or grid relationship changes.

Furniture collision is not inferred from rendered fixture bounds. It is explicit
per-room `navigation.blockedTiles` metadata in
`packages/balance-config/src/prototype-balance.ts`, rotated with the room by
`packages/game-domain/src/spatial.ts`. A live door deliberately reopens its
inside blocked tile, so current behavior can place a door through a solid
fixture cell. The feasibility gap is therefore a shared spatial-presentation
contract: permanent Front Desk furniture needs blocked tiles; optional items
need door-overlap bounds and whole-group visibility metadata; every proposed
door segment needs a navigable inside tile and reachable outside neighbor.

`findDeterministicFacilityPath` and its cardinal-only tile graph in
`packages/game-domain/src/spatial.ts` already support the requested cardinal
movement. Waiting and care destinations are separate configured anchors, so a
Front Desk footprint change also requires deliberate review of its primary,
staff, and waiting anchors. Existing rendering hides selected north-wall art
for a conflicting door through `isFiveRoomNorthWallFixtureVisible` and
`isExaminationNorthWallFixtureVisible`; it does not yet generalize overlap
hiding to all sides or floor furniture.

The next safe proof is an isolated door-toggle/spatial preview: show each
eligible segment, its optional-item hide/restoration group, permanent solid
cells, cardinal chair orientation, and a path to every segment. Do not make a
runtime change until that contract is owner-reviewed.

## Paired D5 layout and art proof

The review fragment is [front-desk-layout.html](../../tools/room-design/front-desk-layout/front-desk-layout.html).
It retains the owner-reaffirmed 5 × 4 footprint, fixed D3 sidewalk entry, and
13 independently toggled north/west/east segments. Desk C2–C3 and receptionist
B2 facing South stay solid. The default visitor is D5 facing North; D4 and D2
remain comparisons. D2 reports its north-facing front C2 as the solid desk,
while D4 and D5 report clear C4/C5 fronts.

The same state/model drives the schematic and a candidate modular art view.
The art shell draws each north/west/east opening as a missing wall section over
the continuous floor. It frames the parent-reviewed transparent furniture atlas
[front-desk-furniture-atlas-01.png](../../Photos%20for%20Codex%202/Codex%20Rooms%202/GS-015/front-desk-furniture-atlas-01.png)
non-destructively, using its threshold-32 alpha bounds and floor-contact
anchors. The original atlas is unchanged. The canvas is an isolated candidate
composition, not a flattened production room or a runtime sprite integration.

For D5, ED is a preview-only exception: with ED absent, its candidate approach
is blocked; selecting ED makes only D5 traversable. The owner can compare a
visible walk-through chair (default) with a hidden presentation. In both cases
seat use is explicitly unvalidated while ED is selected. This is not an
approved game rule.

Optional gallery, corner ficus, east lamp, and west bench groups each include
their shadow in the same visibility group. A group hides for any overlapping
door and returns only after all of its selected door conflicts are removed.
The proof is schematic and isolated: it does not modify the game renderer,
domain doors, saves, routing, sprites, or the owner's session.

The accompanying validator
`tools/room-design/front-desk-layout/validate-front-desk-layout.mjs` checks all
8,192 masks for D5/D4/D2 and both D5 ED presentation modes (49,152 states),
permanent-solid route exclusion, active versus candidate ED routing, seat
approaches, front-clearance distinction, whole-group hide/restoration, every
art aperture and decor group, atlas loading, keyboard/click/select behavior,
five-column geometry, and narrow overflow.

## Footprint-aware room presentation

The current isolated preview makes the room-art view primary. Its 13 direct
wall targets use the same state as the compact keyboard controls; the optional
floor-footprint view exposes routes and occupied tiles. The fixed D3 sidewalk
entry has a simple exterior approach. This remains a review tool, not a game
screen or runtime integration.

The desk has explicit C2–C3 floor metadata and a separate source contact line.
The replacement counter is drawn uniformly from crop-local plinth anchors
`x=41…929`, `y=766`, so its base spans C2–C3 while its art rises into B/C. The
receptionist is drawn first with its floor contact at B2's south boundary, then
occluded by the desk. Browser checks enforce the source aspect ratio within 2%
and the C2/C3 contact coordinates.

Nonblocking pieces include door-hidden northwest cabinet (N1/WA), board/clock
(N2–N3), botanical print (N4), and C1 ficus (WC). The northeast water cooler
is a permanent nonblocking gameplay fixture and does not hide for N5 or EA.
The cooler's source aspect and A5 floor contact are checked. Parent-owned originals remain unchanged;
technical WebP previews are embedded only in the review fragment.

## Northwest/Northeast anchor revision and parity limits

The cabinet now uses an A1 sub-tile floor rectangle (about 50 × 22 preview
pixels) with its source plinth, rather than its transparent image edge, as the
floor contact. It conflicts with N1 and WA. The cooler mirrors that treatment
at A5's northeast edge (about 33 × 22 pixels), stays permanent for N5 and EA,
and keeps its body above N5. The ficus is grounded on C1 and conflicts with WC.
The footprint overlay shows the two small north-edge contact rectangles.

The preview follows the runtime's 5 × 4 logical projection, bottom-contact
fixture placement, and contact-Y depth ordering, but is not pixel-identical to
the game. Runtime tiles are 24px before the Level 0 camera's 1.1 zoom;
the review canvas uses 88px tiles (3.67×) so door apertures and anchors remain
inspectable. Runtime uses Phaser-authored atlas frames, world camera/pan, and
character sprites; this fragment uses browser-canvas WebP previews, a fixed
orthogonal review view, and no character. Its north face is scaled to 70px
(0.80 review tiles), while the runtime's canonical wall envelope is derived
from the v5 shell. These are the remaining parity gaps for a future shared
renderer integration; no claim of exact runtime appearance is made.

## Cutaway shell and finish revision

The isolated target now uses one coherent orthographic cutaway shell. The rear
wall rises 80 preview pixels above the floor, the west/east wall faces project
28 pixels outward with continuous cream faces, green lower panels and joined
corner return caps, and the sidewalk-facing front wall remains a 27-pixel low
cutaway. The fixed D3 entrance stays open between short piers. North and side
door toggles draw dark apertures, wood jambs, thresholds, narrow leaves and
handles on their respective wall planes; transparent click targets follow the
actual 13 wall regions.

The floor finish is a subtle 10 × 8 grid of small cream tiles with restrained
cloudy variation and fine grout. It is independent of the unchanged 5 × 4
gameplay grid, which appears only when the footprint/route overlay is enabled.
Accepted furniture source assets, floor contacts, draw order, positions and
door-conflict masks are unchanged. The validator now asserts the shell
dimensions and target regions in addition to the retained 49,152 routing and
visibility states. This is still an isolated visual target: runtime Phaser
projection, characters, camera sampling and occupied interaction remain to be
integrated and reviewed separately.

## Orthogonal wall and north-adjacency revision

The current isolated target supersedes the projected east/west wall faces.
Both side boundaries are now straight, top-only floor-edge caps with no inward
face or perspective; their ends overlap the north boundary and low south/front
cap so the corners remain closed. A selected east/west door is a flush gap with
an outlined wood frame. North doors likewise contain only jambs, header and
threshold. There are no door leaves, handles or animations, and the frame
interior remains a light, continuous floor passage.

Five independent review switches model whether a room is immediately north of
N1 through N5. A selected segment changes from the 80px rear wall to the same
29px low-wall language used at the front and reveals only a 54px adjoining
floor strip; it does not invent another room or furniture. Board/clock art hides
when N2 or N3 is low, and the botanical print hides when N4 is low. The cabinet
remains for adjacency and hides for its actual door conflicts. The permanent
nonblocking cooler remains for adjacency and all door states. Adjacency is
independent from all 13 door states.

The preceding connected projected-shell proof is preserved as
`tools/room-design/front-desk-layout/front-desk-layout-v5.html`. The current
validator covers all 32 north-adjacency masks, low/tall visibility rules,
independence from door state, plane-aligned hit regions, 13 light open-frame
passages and closed front-corner pixels, in addition to the prior 49,152
routing states. This remains an isolated visual/spatial target rather than an
exact Phaser runtime implementation.

### Shared-wall cap refinement

The next owner refinement removes the beige adjoining-floor preview above every
low north segment. A low boundary now ends at the top of its green cap, leaving
open background beyond it. The west/east caps are 14px thick and extend from
the actual visible top of N1/N5: y=21 for a tall endpoint and y=81 for a low
endpoint. They continue through the south/front cap with closed corners.

Door notation is reduced to passage edges. A low north opening has only two
brown side jambs and remains open above; a tall north opening retains its
header. East/west openings break the complete wall thickness and use one brown
stripe at each end of the gap, without an overhead or enclosing frame. The
previous orthogonal version is preserved as `front-desk-layout-v6.html`.
Tests sample both side-wall endpoint heights, absence of context above low
segments, low north header air, jamb pixels and side passage interiors.

### Doorway floor ownership refinement

The prior shared-wall target is preserved as
`tools/room-design/front-desk-layout/front-desk-layout-v7.html`. In the current
isolated target, space beyond a north opening is transparent rather than
painted with a stand-in yellow floor. Lowering any N1–N5 segment also clears
the neighbor-owned area above that low boundary. This clearing occurs before
fixtures are drawn, so the accepted cabinet and cooler overhangs remain intact.

East/west openings split the 14px wall thickness at its midpoint. The inner
7px continues the room's existing textured floor pixels; the outer 7px is
transparent for a future neighboring room to supply. The west/east treatment
is mirrored, and the brown jamb stripes remain at the two passage ends.
Furniture, anchors, controls, routing and visibility rules are unchanged.

Validation asserts alpha ownership for each north opening, every pixel column
in both halves of all eight east/west openings, and exact floor-pixel copying
on the room-owned half. It retains the 49,152 routing states, all 32 adjacency
masks and all 13 door interactions. This is an isolated renderer target; the
runtime renderer and adjacent-room composition remain outside this proof.

### Permanent water-cooler refinement

The preceding doorway-ownership target is preserved as
`tools/room-design/front-desk-layout/front-desk-layout-v8.html`. The water
cooler is now explicitly permanent and nonblocking in the isolated model. It
keeps the accepted A5 corner footprint, source aspect, base anchor and visual
size, and it remains visible with N5, EA, or both open and under every north
adjacency state. Other wall art and optional decor retain their existing
hide/restore rules.

Read-only runtime evidence confirms why persistence matters: the live Front
Desk presentation identifies the cooler at A5, records B5 as its approach, and
draws the interactive cooler as a separately sorted scene object. The current
pointer interaction requests a refill when the selected grid point equals the
cooler's logical location. This preview does not exercise that runtime action,
actor approach path, or access with N5/EA open; those remain explicit checks
for later integration rather than claims of this routing proof.

### Front Desk upkeep-state candidate

The accepted pre-upkeep proof is preserved byte-for-byte as `front-desk-layout-v9.html` (SHA-256 `27963036E3B43CA92D1E6F820FACE592D71659C201CFD6662746D4F7DB61562A`). The revised isolated proof adds inspectable Full/Empty cooler states and Clean/Scattered litter floor states without changing the shell, established furniture placement, or door behavior. The parent-reviewed upkeep PNG remains unchanged; a quality-82 technical WebP display atlas uses equal registered crops for both cooler states and separate aspect-preserved litter crops. Owner review of the new upkeep art remains pending.

The cooler keeps the accepted A5 floor footprint and one shared base registration in both visual states. It remains permanent and nonblocking in this proof under every door and north-adjacency state. B5 is the proposed reachable refill service tile. Two nonblocking, direct-pickup litter clusters use clear D1 and B4 floor tiles and never hide because of a doorway. The overlay exposes all three service points and their tile routes. Current runtime behavior still blocks the whole A5 cooler tile and uses B5 for refill; the preview's visually nonblocking cooler is a deliberate integration mismatch to resolve later. Litter pickup and state transitions are not wired to runtime.

Focused validation retains the 49,152 existing door/chair/routing states, 32 north-adjacency masks and 13 aperture checks, then adds full/empty aspect and ground-contact equality, cooler persistence, clean/litter visibility, litter aspect/nonblocking metadata, readable service markers, reachable B5/D1/B4 approaches, keyboard controls and desktop/320px layout. Source and delivered fragment match SHA-256 `0F5C0DE12254CAFBA6B89E022E9EB00FD38019FCAF67C341C5994F275B09728B` (989,539 bytes).

## Examination Room 3 × 2 interactive proof

The owner explicitly kept the Examination Room at 3 × 2 tiles. The isolated
review fragment is
[examination-layout.html](../../tools/room-design/examination-layout/examination-layout.html).
It applies the accepted Front Desk shell, cap, door, corner, transparency and
north-adjacency language unchanged. Only the room floor differs: a subtle pale
blue-gray/sage 12 × 8 linoleum finish independent of the 3 × 2 gameplay grid.
All ten perimeter segments are selectable, and S2 starts open. N1–N3 each have
an independent adjoining-room switch.

The permanent solid examination table uses a narrow 0.72 × 1.05-tile floor
footprint centered over A2/B2, while its uniformly scaled source art rises
north of that contact rectangle. A 20-subcell-per-tile clearance proof expands
the true table rectangle by a provisional 0.18-tile actor radius and 0.03-tile
margin. It routes around that shape rather than blocking all of A2 and B2. The
proposed staff approach is west of the table and the patient foot approach is
south; both remain distinct and reachable, as do all ten door approaches.
Proxy circles and routes are review marks, not approved character sprites or
proof of occupied character fit.

Only the table is permanent. The northwest sink, southwest stool and north
diagnostic panel are provisional optional, nonblocking fixtures. Sink art hides
for N1/WA, stool art for WB/S1, and the diagnostic panel for an N2 door or low
N2 shared wall. These visibility proposals do not establish new gameplay for
the sink or stool.

The source 1254 × 1254 RGBA atlas remains unchanged. A Pillow inspection at
alpha ≥ 32 measured table `(200,60,264,545)`, sink `(763,157,322,426)`, stool
`(201,799,264,357)`, and diagnostic panel `(780,792,296,338)` crops. The
crop-local base references are table `(44,213,545)`, sink `(40,282,426)`,
stool `(124,140,357)`, and diagnostic panel `(99,120,338)`. The isolated
fragment embeds one Pillow lossless WebP (`method=6`) and preserves these
measured aspect ratios/base references; it does not regenerate, resize, or
semantically edit those pixels. Full hashes and method are recorded in
`tools/room-design/examination-layout/atlas-provenance.md`.

Read-only domain evidence keeps the live room at 3 × 2 with whole-tile
navigation anchors and blocked tiles. The older horizontal 4 × 2 values in
`examinationRoomPresentation.ts` are explicitly a display-only authoring grid,
so they do not dictate this new geometry. Runtime sub-tile routing, interaction
anchors, occupied character fit and integration remain unimplemented.

### Examination Room horizontal seating revision

The preceding Examination proof is preserved byte-for-byte as `tools/room-design/examination-layout/examination-layout-v1.html` (SHA-256 `AE097E57DABC9DC4AC27DC7D264D7A0BBDD41DA9306836439F471CD61CBA8944`). The current isolated target keeps the owner-approved 3 × 2 room and rotates the treatment bed direction: the supplied low bed runs east-west with its head east and foot west. Its solid floor footprint is 1.35 × 0.30 tile, centered at room y=1.0; uniformly scaled art rises above that narrow contact area.

The patient seat attachment is on the elevated west bed foot and faces west. Its dashed floor projection and a separate west-side approach marker distinguish the seat surface from walkable floor. The founder's permanent rolling stool sits immediately west of the foot, faces east, remains visible in every door/adjacency state, and is nonblocking in this proposal. Visible contact-to-seat rise is about 30.4 canvas pixels for both bed and stool. These cardinal directions and anchors are the accepted design direction; actual character sprites, occupied fit, sitting animation, and runtime interaction are still unverified.

South openings now retain this room's linoleum continuously through the whole wall thickness to the wall base; the neighboring room begins beyond that seam. North transparency and half-owned east/west seams are unchanged. Sink and diagnostic panel remain optional nonblocking proposals. Validation covers all 1,024 door masks, eight north-adjacency masks, every aperture, rotated solid-bed clearance, permanent stool visibility, opposed seat facings and attachment/floor anchors, exact south-floor extent, crop/base/aspect metadata, and desktop/320 controls. No runtime files changed.

Current Examination source/delivery SHA-256: `00CC6D46AE34E2F0046E10B4F95DEAF05442B6D95050370E07C52E1A064790C8`.

### Examination Room furniture scale correction

The preceding horizontal-seat target is preserved byte-for-byte as `tools/room-design/examination-layout/examination-layout-v2.html` (SHA-256 `00CC6D46AE34E2F0046E10B4F95DEAF05442B6D95050370E07C52E1A064790C8`). Scale evidence showed its 1.35-tile bed and 0.30-tile stool were undersized: Front Desk chairs draw about 0.86 tile wide and 0.95 tile high in the accepted preview, while the authored character presentation contract uses a roughly 1.35 × 2.03-tile frame envelope at scale 1. That frame envelope includes transparent padding and does not establish visible body size or occupied fit.

The revised Examination target keeps every approved shell, wall, opening and floor pixel unchanged. It increases the east-west bed to 2.05 tiles long with a 0.42-tile solid floor footprint centered at room y=1.0, and the permanent nonblocking stool to 0.50 tile wide. The unchanged source sprites retain their exact aspect ratios. Contact-to-seat rise is about 46.2px for the bed and 50.7px for the stool at preview scale; the slight 4.5px difference is intentional rather than described as exact equality.

The enlarged bed plus the existing provisional 0.18-tile actor radius and 0.03-tile margin still permits all ten door approaches in every one of the 1,024 door masks. EA is reached through the north corridor, EB through the south corridor, and a narrow west connector joins those corridors. The overlay shows the tight founder/patient leg and approach area directly. No character image was added because the canonical poses are runtime atlas assets; actual seated-pose fit remains required.

Current enlarged Examination source/delivery SHA-256: `AD8ED24C735A7F45CF55E3D8991B61B75E6D7B68008075FF51A2AB2993E5128C`.

### Examination compact bed and west-side rotation proof

The enlarged target is preserved as `examination-layout-v3.html` at the preceding hash. The room-local bed is now 1.55 × 0.70 tiles and the permanent 0.50-tile stool is centered at `(0.78,1.0)`, at the eastern edge of column 1. Side-door approaches use clear points inside unchanged apertures.

The selector compares the original 3 × 2 room with a 90° counterclockwise west-side view rendered as 2 × 3. Room-local points transform by `(x,y) -> (y,3-x)`; physical door state is preserved while controls show world-facing IDs. World-north adjacency has three flags in the original view and two in west view. Correct east/head-north bed and west-wall sink art are used without rotating bitmaps. Shared fixture footprints and floor anchors generate both views. Occupied character fit and sitting animation remain unverified.

Current compact/rotatable Examination source and delivery SHA-256: AE0A01F16FC9273A842587EA4DBFA891E397FAEC7C93300D9D58D3091822D3D8.
At preview scale, source-derived cushion rise is about 42.5px for the east bed, 43.0px for the north bed, and 50.7px for the stool. The stool remains visibly higher by about 8px; these measurements are review evidence, not occupied character-fit proof.

### Examination west-view sink and south-door correction (September 17, 2026)

- The accepted pre-correction Examination proof is preserved as `examination-layout-v4.html` (SHA-256 `AE0A01F16FC9273A842587EA4DBFA891E397FAEC7C93300D9D58D3091822D3D8`).
- The 90° counterclockwise view now derives its south segments from the room-local geometry: local `WA` maps to world `S1`, and local `WB` maps to world `S2`. This fixes the earlier reversed pair without changing the original-view `N1`/`WA` sink rule.
- The west-view sink uses the same correct-view source and SW floor base at a uniform 30% larger display scale (`0.52` tile wide, source aspect preserved). It hides for world `S1` and `WC`, while world `S2` leaves it visible.
- The seating direction contract remains original patient west / founder or employee east, and west-side view patient south / founder or employee north. These are design anchors; occupied character fitting and sitting animation remain unverified.
- The reviewed source and delivered fragment match SHA-256 `462AB425AC17C63338AA46E8D5F85731316675F531C6A1A81FADBB5A80CFCF3C`.

## Hallway foundation proof (2026-09-17)

The corrected isolated [hallway layout proof](../../tools/room-design/hallway-layout/hallway-layout.html) is a candidate pending parent and owner review. Straight, corner, T, and cross presets derive only the exterior boundary of a union of fully walkable 1×1 cells; the shared edges between hallway cells remain open and use one continuous small limestone-tile phase. The palette follows the Overall Vibe hallway mockups: warm light gray/beige floor, cream walls, sage wainscot and dark green caps.

Walls sit outside the walkable union. Tall or independently backed low north segments, 14px east/west caps and the 29px south cutaway use the accepted room-shell language. Openings expose real neighboring-floor patches: north openings and backed segments show the adjoining floor, east/west openings divide the wall thickness at its midpoint, and south openings continue hallway floor to the wall base before the neighboring floor begins. Reentrant corners paint the union floor after rear/side structure so a wall cannot cover an adjoining walkable hallway cell. There are no furniture or occupied-character claims, and no runtime corridor, door, collision or routing contract changed.

The source and delivered fragment match SHA-256 `A4CC0A3108F340979BF1615A66CD0F29650A6E921A1AD2BFE6815933A25FAF9C` (11,024 bytes).

## Combined furnished clinic proof (2026-09-17)

The isolated combined candidate places the accepted furnished Front Desk, Examination room and hallway language on one 48px world-tile scale. Its side-by-side, stacked and mixed-corner presets cover direct east/west room sharing, north/south room sharing, room-to-hall sharing and a rotated west-view Examination room. A canonical unit-edge graph owns every wall and door state once. Hall-to-hall cell edges have no wall.

East/west neighbors share one centered cap and their floors meet at its centerline. For north/south neighbors, only the southern area's low north wall is drawn into the northern floor; the northern area's south wall is suppressed. Door apertures repaint the owning floors instead of clearing to the canvas background. The Front Desk keeps its fixed textured south entrance. Exact tile-normalized fixture anchors come from the individual proofs; water cooler, exam table and stool remain visible, while optional wall/corner fixtures follow their established door and backing conflicts. This is a local presentation candidate pending owner review, not runtime integration or occupied-character validation.

The self-contained source and delivered fragment match SHA-256 `84BBA188008954BADC5C4A3F1F4AFD6D4054A058FBF9436381963E01A2B1B1F8` (223,269 bytes).

## Waiting Room first proof (2026-09-17)

The isolated Waiting Room candidate keeps the original 4 × 3 footprint. The owner-selected layout uses a two-person south-facing bench across A2/A3, an east-facing chair in B1 and a west-facing chair in B4. These four seats are permanent and remain visible when a doorway overlaps their presentation space; this visual pass-through rule does not implement occupied-character routing or automatic seat assignment. The compact magazine table and the N1 magazine rack / A4 plant are optional.

All 14 perimeter segments are independently selectable, with S2 open by default and four independent north-neighbor flags. The proof reuses the accepted cream, sage and dark-green wall language: 14px side caps, 29px backed north and exposed south boundaries, headerless backed-north openings, midpoint-owned east/west floor joins, and current-room carpet through south openings to the wall base. The continuous warm woven carpet uses fine procedural grain without logical-tile outlines.

The unchanged 1226 × 1283 RGBA furniture source and exact prompt remain in the GS-015 art folder. A technical alpha crop/pack produces the embedded 567 × 1984 WebP display atlas at quality 88; sprites keep source aspect ratios. Floor-contact metadata uses measured high-alpha foot rows separately from soft-shadow image bottoms. Validation covers all 14 controls, all 16 north-neighbor masks, representative wall/floor pixels, permanent-seat and optional-fixture behavior, crop aspect/contact math, keyboard focus, image loading and desktop/320px layout.

The source and delivered fragment match SHA-256 `98183D082F87CB2BE9BA606720A289F8BC4E610AF3D2936333736EB2C2EAE122` (283,778 bytes). This remains an isolated visual candidate pending owner review; rotation, occupied fit and runtime integration are not included.

### Waiting Room walk-around and west-view revision

The revised proof moves the bench and both chairs south within their logical tiles and gives every furnishing a sub-tile physical footprint. The bench and chairs remain permanent and visible through overlapping doorways, but the route model walks around their footprints. The optional magazine table is solid whenever shown. A provisional 0.16-tile-radius route reaches all 14 doorway approaches with the table present and supports representative paths north of the bench, behind both side chairs, and through the south aisle. Rendering sorts the current walking frame against each fixture's floor contact, so the patient passes behind furniture on the northern portions of those routes.

The `90° · west-side view` applies the room-local counterclockwise transform `(x, y) -> (y, 4 - x)`, producing a 3 × 4 room without changing physical fixture placement. It maps the bench from south-facing to east-facing, the left chair from east-facing to north-facing, and the right chair from west-facing to south-facing. World-facing door controls remain ordered north, south, west, east and map back to one physical local door state. The larger N1 magazine rack hides only for local N1 doorway/backing; a local WA doorway does not hide it.

The reusable fixture contract records room-local footprint, ground anchor, seats, seated facing, approach and collision/persistence separately from the elevated sprite. Each render also exports their transformed world footprint, anchor, ground contact, seat and approach points plus draw order. This keeps logical placement, collision, seated intent and depth sorting explicit across room rotation. The four seats are permanent; the table is optional and `solid` when shown.

The walkthrough uses the existing identity-3 cardinal walk frames at their authored 1.35 × 2.025 tile frame envelope and source feet anchor. It is a visual route and occlusion proof, not an occupied-seat, body-width, turn-animation, or runtime pathfinding proof. Validation covers all 14 controls in both orientations, analytic endpoint mapping, transformed anchors and facings, interpolated collision-free route segments with the table shown, table-center rejection, fixture ground contacts, actor/furniture depth order, the rack conflict rule, keyboard focus, asset loading, and desktop/320px layout.

The revised self-contained source and delivered fragment match SHA-256 `80BE673C54622848A77A3308E20073E6E386496AAE3582EF93AE72C5FFE38B44` (735,117 bytes). Runtime integration and actual occupied sitting remain unimplemented.

## Bathroom 2 × 2 first proof (2026-09-17)

The isolated Bathroom candidate keeps the existing 2 × 2 footprint and fixed orientation. It uses the accepted cream, sage and dark-green shell at the common 120px tile scale: a 90px tall north wall plus cap, independently backed 29px north segments, 14px east/west caps and a 29px south cutaway. All eight perimeter segments are selectable. North apertures are transparent, side apertures split floor ownership at the cap midpoint, and the current pale cream/sage small-tile floor continues through south openings to the wall base.

The sink on the left and south-facing toilet on the right are permanent solid fixtures. Their logical base footprints are separate from upper sprite overhang. Measured non-shadow source contacts register the sink at `(0.55,0.84)` and toilet at `(1.43,1.08)`; source aspects remain unchanged. The sink's southern approach faces north. The toilet exports a distinct elevated seat point facing south plus a separate southern floor approach. A compact mirror is centered above the sink within N1's tall wall and hides only for an N1 doorway or backed N1 wall, not for WA.

From a provisional S1 entry anchor, a 0.16-tile-radius model reaches all eight door approaches and both fixture-use approaches without crossing inflated base footprints. Validator endpoints independently remain inside each aperture's `[0.10 + radius, 0.90 - radius]` jamb margin. This proves the proposed point-radius routes, not visible-body width, turning, occupied toilet use, or runtime pathfinding; basin and bowl art visibly overhang the narrower registered bases.

The parent-reviewed candidate atlas and exact prompt remain unchanged. A quality-88 technical WebP packs fixed crops without rotation or semantic edits; owner art review remains pending. Focused validation covers all eight controls, four north-adjacency masks, interpolated route segments, independent aperture margins, sink/toilet permanence, contact/aspect registration, mirror hiding, floor ownership, keyboard use and desktop/320px layout. Source and delivered fragment match SHA-256 `365E5B855551FBD5AEBC0934A58944BF0A03879BAC5D73B91C3F40FBC53AB998` (116,971 bytes). No runtime or character files changed.

## Bathroom approved use behavior (2026-09-17)

Owner approved the following later-integration contract for any character **already assigned** a Bathroom visit; it does not expand which roles may visit. A character walks normally to the toilet attachment. While walking through A1 or A2, it renders behind both permanent fixtures. Only after arrival does it use the existing static seated pose facing south for **two facility game minutes**; it renders in front of the toilet. It then walks normally to the sink attachment, again behind both fixtures when traversing A1/A2. Only after arrival does it use the existing static standing/idle pose facing north for **two facility game minutes**; it renders in front of the sink. There is no new washing animation or new character art.

`tools/room-design/bathroom-layout/bathroom-behavior.json` is the executable-neutral source of this ordered contract. It separates use timing from travel: each two-minute countdown begins after that fixture's route arrival, and neither walking leg consumes use time.

Runtime mismatch recorded for a later, separately owned integration milestone: `FounderActivityState` currently represents `visit_bathroom` as a single route plus `workMinutesRemaining` ([types.ts](../../packages/game-domain/src/types.ts)); [reducer.ts](../../packages/game-domain/src/reducer.ts) only decrements work time after final-route arrival, which can support the timing rule but does not represent two phases. [viewModels.ts](../../apps/player/src/session/viewModels.ts) does not mark a Bathroom visitor seated, and [FacilityScene.ts](../../apps/player/src/facility/FacilityScene.ts) only selects an explicit furniture pose for Front Desk. The integration needs phase/attachment data and a fixture-specific depth override while preserving existing normal walking depth. Existing bitmap pose resolution supplies seated/front (south) and idle/back (north) statics in [characterBitmapArt.ts](../../apps/player/src/art/characterBitmapArt.ts). No runtime or art change is authorized by this record.

## Minor Procedure Room first proof (2026-09-17)

The isolated candidate keeps the existing fixed north-up 3 × 3 footprint and common 120px room scale. It uses the shared cream/sage shell with a 90px north wall, independently backed 29px north segments, 14px east/west caps and a 29px south cutaway. All 12 perimeter segments are selectable. The floor is a distinct continuous muted blue-gray finely speckled finish without logical-tile outlines.

The permanent solid low procedure table runs north-south. A patient attachment at its south foot faces south. The permanent nonblocking wheeled clinician stool is directly opposed and faces north; the grounded procedure light is also permanent and nonblocking. Optional nonblocking fixtures are the northwest sink (`N1`/`WA`), northeast supply cabinet (`N3`/`EA`) and southwest instrument trolley (`S1`/`WC`). The default visibility and permanence are first-proof proposals pending owner review.

Floor projections, elevated visible-seat attachments and navigation approaches are separate inspectable values. The replacement table source yields a 47.07px floor-contact-to-seat rise, versus 50.67px for the stool, while preserving both source aspects; the remaining 3.60px variance is explicit. The light's logical footprint and floor anchor remain grounded even though its articulated arm rises over the table. Actual occupied character alignment and lamp-arm occlusion remain future validation.

A provisional 0.16-tile-radius model routes from S2 to all 12 aperture-safe doorway approaches plus patient and clinician floor approaches without crossing the inflated table footprint. Validation samples every interpolated route segment and separately enforces each endpoint's aperture/jamb margin. This does not establish visible-body width, turning, occupied sitting, or runtime navigation.

The parent-reviewed, owner-pending source atlas, replacement table and exact prompts remain unchanged. A quality-88 technical WebP packs measured crops without rotation, stretching or semantic edits; contacts and elevated attachments are recorded in `atlas.json` and `atlas-provenance.md`. Focused validation covers 12 controls, eight north-neighbor masks, interpolated clearance, independent aperture margins, permanence/visibility, floor ownership, registered contacts/aspects, seat/floor/approach separation, keyboard use and desktop/320px layout. Source and delivered fragment match SHA-256 `DDF96F6F0A47BEA25CF0A16752B8D0A36F00D55C976CBFC5C312209A1FADCC7F` (265,769 bytes). No runtime or character files changed.

### Minor Procedure B2 navigation and wall-light revision

The preceding first proof is preserved as `minor-procedure-layout-v1.html` at SHA-256 `DDF96F6F0A47BEA25CF0A16752B8D0A36F00D55C976CBFC5C312209A1FADCC7F`. The table keeps its visual footprint and elevated seat attachment, but walking now treats exactly B2 as its one full-tile blocker. All other tile centers are traversable in the provisional point-radius model, including A2 north of the visible table; an actor there would render behind the table art. The patient continues to use the explicit south attachment without routing into B2.

The sink and cabinet bases now sit flush against the north edge. The floor-standing lamp has been removed from both presentation and collision metadata. A new independently selectable N2 wall-mounted light is on by default, has a registered wall mounting point and no floor footprint, and hides for an N2 doorway or backed N2 wall. Its raised head slightly overhangs the room visually; future occupied-character depth remains unverified.

Revised source and delivered fragment match SHA-256 `10F1E893F0BA0FD9B4C8235128F7D5E6B9197F147909C790E115D0E7B8799E1E` (318,994 bytes).

### Minor Procedure approved pose contract

The owner approves the patient using the existing static seated pose facing south at the procedure-table foot and a founder or employee using the existing static seated pose facing north on the opposed stool. `minor-procedure-behavior.json` records the current proof's floor projections, source-derived elevated attachments and separate navigation approaches for both uses.

This approval preserves B2 as the only blocked walking tile. A2 remains traversable and a walking actor there renders behind the table artwork; the patient's elevated seat is an explicit attachment rather than a route into B2. Runtime integration, eligibility, assignment, staffing, duration, gameplay effects and final occupied-sprite registration remain unspecified.

## Ultrasound 3 × 3 isolated proof (2026-09-17)

The Ultrasound proof is a fixed north-up 3 × 3 candidate with the shared tall/low room shell and a pale warm-gray small-tile floor with subtle sage grout. The table is permanent and centered; B2 alone is the provisional navigation blocker. Its patient foot/approach is `(1.5, 2.2)` facing South. The permanent console is nonblocking at `(2.4, 1.95)`, faces South toward its operator, and exports a North-facing operator/approach `(2.4, 2.25)`. The permanent C3 stool is nonblocking at `(2.4, 2.75)` with a North-facing technician seat. The optional north-flush sink and cabinet hide as whole groups for N1/WA/backed-N1 and N3/EA/backed-N3 respectively; no lamp or trolley is present.

The self-contained preview uses the parent-reviewed console and approved table/stool/sink/cabinet art through technical WebP packing. `tools/room-design/ultrasound-layout/atlas-provenance.md` and `atlas.json` retain source boxes, contacts, and aspect data. This is an isolated spatial/art proof: its anchors and radius-0.16 routes do not yet modify the runtime ultrasound service, character fitting, or collision model.

Source and delivered fragments match SHA-256 $sourceHash$ (323,012 bytes). Focused direct and host-frame captures are under 	ools/room-design/ultrasound-layout/evidence/; no runtime, character, asset-source, session, or deployment changes were made.

### Ultrasound revision 02 — horizontal bed and new atlas

Owner replaced the vertical layout: the fresh four-sprite atlas supplies a slate-blue/ivory horizontal bed with head West and foot East, pale-blue/ivory console, light-oak northwest cabinet, and north-facing stool. The sink is removed. The bed's visual footprint is `x=.6, y=1.1, w=1.8, h=.65`, its patient seat/approach is at east foot `x=2.2` facing South, and its elevated lip is deliberately separate from the visual floor blocker B2. Stool and patient share screen/logical x=2.2; the stool faces North. The South-facing console sits below the West head, while operator and approach face North. The cabinet is optional only and hides for N1/WA/backed N1. Source contacts and seat alignment are recorded in `tools/room-design/ultrasound-layout/atlas-provenance.md`. The proof still has no sink, lamp, or trolley.

Revision-02 source and delivered fragments match SHA-256 $hash$ (202,132 bytes); desktop, 320px, overlay, all-open/backed and host-frame captures were regenerated under 	ools/room-design/ultrasound-layout/evidence/.


### Ultrasound revision 03 — north-edge console and N2 wall print

The console remains its approved width and South-facing equipment orientation, but its contact is now at the north edge of C1: footprint `x=.55, y=2.0, w=.5, h=.33`, anchor `(0.8,2.33)`. The operator and console approach remain North-facing at `(0.8,2.84)`. A declared clear lane across `y=2.7`, `x=.2…1.4` passes south/in front of the console and is explicitly a future front-layer sort intent; B2 remains the only navigation blocker.

A parent-reviewed oak-and-blue fern print is wall-mounted inside the N2 tall back wall at 0.4 tile with no floor footprint. It hides as a whole optional group when N2 opens or a north neighbor backs N2; the optional control accurately includes both cabinet and print. The new art preserves all furniture widths and measured patient/technician rises. Revision-02’s fresh sprite proportions are shorter than revision-01’s stool/console silhouettes, which explains some perceived shrink without a sizing regression. This remains an isolated proof, not a runtime rendering or sorting change.

Revision-03 source and delivered fragments match SHA-256 `D8C7FCA2C8BD5414052210F1F96E8D806AFCB0B0825C39B2B4052B1E308B7758` (365,966 bytes). Focused direct and host-frame captures were regenerated under `tools/room-design/ultrasound-layout/evidence/`.

### North upper-face palette review — 2026-09-17

Owner-approved isolated-proof palette now applies only to each exposed tall north upper face: Front Desk `#efe1bd`, Examination `#d5e2e6`, Waiting `#e9c7b4`, Bathroom `#c6dfd7`, Minor Procedure `#d6c9df`, Ultrasound `#bfd5e8`, and Hallway `#ddd5c8`; `#bec8d6` is reserved for the upcoming X-ray proof. Backed/low north, shared green trim, east/west and south walls, floors, backgrounds and decor remain unchanged. Current proof geometry, doors, fixtures, anchors and routes are unchanged. `tools/room-design/north-wall-palette.json` is the durable palette/source audit.

The owner accepted the revised Ultrasound proof. Its console remains north at C1 with the explicit south/front traversal lane and N2 print behavior; runtime travel, pose, collision and layer integration remain separate work.


### X-ray isolated proof — 2026-09-17

The new north-up 3 × 3 X-ray proof keeps B2 as the only proposed blocker. An upright detector faces South while its standing patient use point faces North at `(1.5,2.25)`; the north-facing tube stand is permanent and nonblocking at C1, and the South-facing console has a North-facing technician approach. The hanging N1 apron is optional wall art and hides only for N1/open or backed N1. The tall north face is cool slate `#bec8d6`; the floor is warm-gray fine speckle. Runtime service, staffing, timing, characters and collision remain unchanged.

X-ray final cleanup removed stale Ultrasound `southPassage` metadata; source and delivered fragment SHA-256: `20666FCF3C982AEA07F525FCD5A37528E46BD4EC8A7CA7A5346669C728F6D2D7`.

### Backed north paint correction — 2026-09-17

Owner approved matching the cream face of a backed/short north segment to that room’s north upper-face palette. The isolated Examination, Hallway, and Combined renderers now do so; their solid green backed-north trim remains green. Front Desk already used its own `#efe1bd` face. This change does not alter south or east/west walls, shells, floors, doors, fixtures, anchors, routes, or runtime rendering.

### CT Suite investigation — 2026-09-17

Runtime defines CT as a fixed north-up `4 × 4` room with a default south door. Its navigation contract blocks `(0,0)`, `(3,0)`, and `(3,1)`, uses primary anchor `(1,1)` and staff anchor `(2,3)`. Its visual door zones remain near north/south 80% and east/west 8/78% offsets. The existing runtime presentation only has a CT gantry, cabinet, rolling cart, radiation marker, and wall window; it has no technician console, interior partition, or seated-patient fixture contract.

For the next isolated proof, keep the scanner in the northwest/central bay and place a short free-standing north–south partition in the east half, with open aisles at both ends. Put the new console in the east nook. This separates technician and scanner visually without contacting any exterior wall or changing any door zone; the isolated proof adds its own partition blocker. The user-selected patient attachment is south at the scanner-bed foot; final operator-facing and precise partition dimensions remain presentation decisions for the CT proof.

### CT Suite isolated proof � 2026-09-17

The new candidate at `tools/room-design/ct-layout/` is fixed north-up `4 � 4`, with all sixteen wall segments and four independent backed-north controls. Its dusty mauve exposed north face is `#dacbd5`; backed north remains solid green. The scanner is permanent, 2 tiles wide and uses a conservative navigation blocker `(.5,1,1.8,1.65)` that is deliberately separate from its two gantry-foot bases and couch-pedestal physical footprints. The patient�s source-derived south seat lip is 55.81px above the scanner floor anchor, with a separate walk approach at `(1.4,3.1)`.

A permanent top-down partition at `x=2.69�2.81`, `y=.75�3.15` has a muted blue observation-window inset. It separates the 1-tile nonblocking East console without contacting a perimeter wall; the open north and south ends retain routes to every door approach. The console faces South; its technician approach at `(3.35,2.7)` faces North. These are isolated proof contracts only and do not change CT runtime furniture, collision, routes, staff, timings, poses, or service eligibility.

`atlas-provenance.md` and `atlas.json` record alpha-bound technical crops from the unchanged parent-approved `ct-furniture-atlas-02.png`. The packed lossless WebP preserves the source alpha and aspect ratios. Focused validation covers all 16 routes, patient/technician paths, partition/scanner collision, source contacts and seat rise, selected-route canvas rendering, backed-north behavior, keyboard/canvas door activation, desktop/320px and host-frame captures.

### CT Suite isolated proof - 2026-09-17

The new candidate under tools/room-design/ct-layout is fixed north-up 4 x 4 with all 16 wall controls and four backed-north controls. Its exposed north face is dusty mauve #dacbd5; backed north remains solid green. The permanent scanner is 2 tiles wide. Its conservative navigation blocker (.5,1,1.8,1.65) is separate from two gantry-foot bases and the couch-pedestal physical footprints. The patient has a source-derived south-facing seat at the scanner foot, 55.81px above its floor anchor, and a separate approach at (1.4,3.1).

The permanent top-down partition at x=2.69..2.81, y=.75..3.15 is a proof-only solid blocker with a muted blue observation window. It separates the East nonblocking console while leaving north and south aisles, all exterior door approaches, and the patient/technician routes reachable. The console faces South; its technician approach at (3.35,2.7) faces North. Runtime CT collision, furniture, staffing, poses, service timing, and eligibility remain pending integration.

Atlas provenance records alpha-bound technical crops of the unchanged parent-approved ct-furniture-atlas-02.png. Focused validation covers 16 doorway routes, patient/technician paths, scanner/partition collision, source contacts and seat rise, selected-route drawing, backed north behavior, physical canvas wall clicking, desktop/320px, host frame, and all-open/backed evidence.

### CT wall decor revision - 2026-09-17

The approved CT proof adds two wall-only decorations from the parent-reviewed `ct-wall-art-01.png`: framed scan at N1 and botanical print at N3. They sit entirely in the tall north face, have no floor footprint or navigation effect, and hide only for their own N doorway or backed-N segment. West/east doors never hide either item. Source crop/technical packing is recorded in `tools/room-design/ct-layout/wall-art.json` and `atlas-provenance.md`.

### CT cat-scan wall gallery revision - 2026-09-17

For static review only, the CT source proof replaces the two previous wall prints with four coordinated framed cat scans, one on each N1 through N4 segment. Each frame is 80px tall at y=48 and may overlap the green wainscot. Every frame hides and restores independently for only its own north door/backed state; side doors have no effect. `ct-cat-scans-01.png` remains unchanged; `cat-wall-art.json` records threshold-32 padded crops and the lightweight technical WebP derivative. The delivered interactive CT fragment intentionally remains at the prior accepted hash until the next interactive proof milestone. Static review capture: `tools/room-design/ct-layout/evidence/ct-cat-gallery-room.png`.


### Phlebotomy Station first proof - 2026-09-17

Owner chose patient seated South and staff seated North. New isolated proof supports 3x2 South and 2x3 East views after 90-degree counterclockwise rotation, with newly drawn cardinal art, rose north paint and fine ivory terrazzo. The patient chair is the only blocker; staff stool is permanent and nonblocking. Optional sink/specimen cabinet hides for N1/WA or backed N1 in default view; rotated conflicts are WC/S1. Ten door segments per view preserve world door state across rotation. Source floor/seat contacts and equal furniture heights are recorded separately. Runtime and occupied-character integration remain pending.

Terra prepared source art crops and initial scaffold; Sol completed implementation, meaningful validation and host evidence. Parent reviewed source and host desktop/320/East-overlay, independently reran validation PASS (20 doorway routes, 2048 masks, visibility restoration, physical click, keyboard) and accepted for owner visual review. Source SHA256 23A119429F1D4217BA36BAA7221D19EE26EEF06D768B796C555ED914DDE34AF9. Art prompts/provenance: Photos for Codex 2/Codex Rooms 2/GS-015/phlebotomy-art.md. Existing file encoding preserved by append-only update.

### Phlebotomy perspective, floor and sheer windows revision - 2026-09-17

New higher-camera East02 art makes the chair/stool taller and reveals more seat/countertop surface; the sink is enlarged in both orientations, with explicit East visual-base registration toward the southwest wall. Logical routes and door conflicts remain unchanged. A room-anchored 24px ivory/rose terrazzo pattern continues through door thresholds. Every tall closed north segment has a window with closed white sheer fabric obscuring scenery; its outer cream curtains retain sage and rose accents. Each window hides independently for a door or backed segment. Original art and prompts are preserved in GS-015.

Sol implemented the revision. Parent reviewed source, final South/East host renders and independently reran validation PASS: 20 routes, 2048 door/window masks, 12 backed-window masks, contacts/scales, physical click, keyboard and responsive layout. Final source/delivery SHA256 6A0C26600BC48A8EB20F4339AF1FE348C0D39A6DEEB7B5829853D127B384840E, 681874 bytes. Runtime and occupied-character integration remain pending. Append-only documentation update preserves existing bytes.

### Phlebotomy approved after final sink/window correction — 2026-09-17
Owner conditional approval fulfilled: South 3x2 sink restored to 120.73px, N1 window permanently absent even when sink hides. East 2x3 unchanged. Parent independently reran full proof validator (20 routes, 2048 door/window masks, 12 backed masks, desktop/320 interactions) and inspected hosted South view. Source/delivery SHA256 E4BFD35417FC777D2491832D53F14E92FF694200D56E3D9BA950AC85AF8E7C14. Environmental Services closet is next, 2x2 fixed north-up, stocked shelf per north segment hidden for own door/backing.

### Environmental Services closet proof — 2026-09-17
New fixed north-up 2x2 proof: two stocked oak supply shelves, each hides for only its own N door/backed north segment; side doors do not hide them. Permanent nonblocking yellow mop bucket/caddy. Fine 24px sage/stone floor, muted sage north paint, established common shell. No new gameplay timings or runtime integration. Source/delivery SHA256 794BAB21DE32547DB25C02B834F6E4E39EB1739E50898D8CA81730FEA5737B1F. Sol implemented; parent independently reviewed source/default/hiding/320 host renders and reran validator PASS (1024 door/backed combinations, eight route previews, source contacts, click/keyboard). Awaiting owner visual approval. Original built-in ImageGen atlas and exact prompt retained in GS-015.

### EVS packed-closet revision — 2026-09-17
Owner requested shelves back against north and spanning wall, dark full closet, B1/B2 corner clutter. Atlas02 provides wider stocked shelves and dense bags/bins/boxes/cleaning-supply groups. Each shelf has 119px solid visible width, ground y=.35; B1 hides WB/S1, B2 hides EB/S2, north shelves retain own N door/backed rules. Permanent bucket remains. Dark olive north and utility floor, common side/south walls unchanged. Preview initially all closed to show all clutter. Sol implemented; parent reviewed actual desktop/hiding/320 captures and source, reran validator PASS all1024 combinations plus controls. Source SHA256 5F157AB35C11F50ECE424CF4762E3F4FAB5D843069A16AD5EE85F4A761755DDA. Await owner review; no runtime changes.

### EVS approved — 2026-09-18
Owner explicitly approved the dark packed-closet revision (atlas02, full-width north shelves, conditional B1/B2 clutter). Endoscopy Room is next. Runtime integration remains separate from approved design proofs.

### Endoscopy first proof — 2026-09-18
4x3 with 90-degree CCW 3x4 view, dark blue-gray north wall and fine slate floor. Permanent endoscopy tower plus optional supply cabinet/sink; central low procedure bed. Owner requested generic procedure replacement for Endoscopy and future OR: individual patient hides at use, bed shows covered generic humanoid with hair net, head facing away from standing endoscopist; restore individual on disembark. Both bed states and both views have freshly drawn art. Default headN/footS, patientfaceW/staff standsEast facingW; rotated headW/footE, patientfaceS/staff standsNorth facingS. No runtime integration or new timing rules.
Parent caught and corrected rotated foot contact (must be east end, not bed center); blocker extended to cover full bed, preserving north passage. Sol implemented; parent reviewed source, desktop/320 and procedure/overlay captures, independently reran validator PASS 28 doorway +4 use routes with segment sampling, hide mapping, contacts, state replacement and real controls. Final source hash08C6C576B8A49B4BF9901D7CDDC61C37BC02A2B2A1032AC3B5DEFCEB90B452EB. Awaiting owner visual approval.

## 2026-09-21 — Peri-op / Recovery first proof

Owner confirmed an open central nursing station. Parent selected an 8x8
proposal with sixteen perimeter bed bays, two north-side nurse stools facing
south, cardinal inward-facing patient seats, vitals monitors and calming art.
All 32 wall segments remain available for doors. A bay-owned door removes its
bed, monitor and adjacent shared dividers; clear corner doors remove no bed.
Backed north walls remove wall art only. The displayed bed count is a visual
capacity proposal; the current runtime still reserves whole recovery rooms.

Sol implemented the isolated proof. Parent generated and inspected the art,
reviewed the implementation, corrected divider registration and monitor bay
ownership, commissioned low side-screen art to preserve bed visibility, and
inspected the actual hosted desktop and 320px renders. Parent independently
ran `node tools/room-design/recovery-layout/validate.cjs`: PASS, including all
32 individual doors, mixed/all-door cases, source and cushion contacts, bay
and shared-divider drawing ownership, sampled routes, click/keyboard and
narrow layout. Fragment 266631 bytes; SHA256
FD6DEE5280D8CFE0A5E38A2EB81ABD240D2BEA1C0F0CC75E1BB604D378B049C9.

No runtime, save, clinical timing or multi-patient reservation change.
Patient/stool cushion attachments are provisional until character integration.
Await owner review of room size, bed count and overall composition.

## 2026-09-21 — Recovery revision to 6x6 / eight beds

Owner requested smaller room, wider bed spacing, consistent cross-room furniture
proportions, inward-facing monitors, solid bay partitions and distinct bay art.
Sol audited the approved Examination/Front Desk references and implemented the
revision; parent generated and reviewed cardinal beds/monitors, varied paintings,
and a counter derived from the original Front Desk geometry.

Two bays per wall use centers2.25/3.75, 1.55x.70-tile physical bed footprints,
four short solid partitions open to the station, all24 legal perimeter doors.
Door-owned bay removal also clears its monitor and shared partition. Corner
entrances preserve capacity. Furniture retains its actual sprite aspect ratio.
Beds:84px width /186px length at120px per tile; cushion rise about41.5–41.9px,
within1.5px of the approved Exam reference. Exact Exam stool reused at60px width
and50.68px seat rise. Counter base240px and measured facade93.24px, compared
with roughly90px on Front Desk. Both stools moved north to y2.20 so they remain
visible behind the taller counter. Monitor views now point inward from all sides.
Eight distinct paintings assigned; only physically visible wall faces show art.

Parent inspected actual hosted desktop render and independently sampled all24
single-door routes, remaining bed approaches and nurse seats at.02-tile spacing
against radius-.16 inflated bed/counter/partition geometry: no failures.
No runtime throughput, reservation, save, clinical or other-room changes.
