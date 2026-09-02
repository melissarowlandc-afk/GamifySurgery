# Visual art direction

Status: **Controlling visual source of truth for the current prototype**

Recorded: 2026-07-28

This document supersedes older language that described the intended result as
merely simple, large-pixel, strictly black-and-white, or grayscale. Historical
architecture records still explain why the facility uses a logical tile grid;
they do not lower the quality bar for the art rendered on that grid.

## Target

**Stitchin' Time** is the player-facing name of this cohesive, illustrated
hospital-management game. The repository and stable technical identifiers
retain the historical `GamifySurgery` name so saves, launchers, and deployment
paths remain compatible. Its art is crisp, detailed, and Game Boy-inspired; it
is not a wireframe decorated with a pixel font.

The controlling local comparison set is every current image in
`Photos for Codex` except the file explicitly named
`Visual Example (outdated, don't use).png`. That obsolete file is excluded and
must not influence future art work.

Within the controlling set:

- `exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png` is the primary integrated
  clinic target for atmosphere, density, depth, palette, landscaping, room
  readability, and character scale;
- `exec-a921f897-d3b4-4632-9e4f-0ed6791bef2f.png` is the primary close facility
  and corridor target;
- the remaining `exec-*.png` images jointly control room layouts, door-safe
  furniture, portraits, body/head variety, directional sprites, and dedicated
  idle, walking, seated, working, interaction, and star-jump poses; and
- `Play, pause, fast forward.PNG` controls the intentionally simpler HUD time
  controls.

These comparisons are inspiration and acceptance references only. They are
not runtime assets, must not be copied or flattened into the game, and are not
required to build or deploy the repository. All shipped art must be original.

The controlling palette is a low-chroma stone-and-olive neutral range modeled
on the local visual reference: soft ivory paper, weathered light stone,
gray-green, muted moss, deep gray-olive, and charcoal. It must not drift into a
blue/slate wash, and it must not become bright yellow, saturated green, or
sepia. Warm paper surfaces and subdued botanical tones make the clinic
inviting while charcoal provides structure. Skin tones retain the limited
warmth necessary to depict people. Pure black is reserved for the strongest
outlines and contrast. Hard pixel edges, nearest-neighbor rendering, and
pixel-aligned output are required; smoothing and anti-aliasing are not the
solution to coarse art.

The current core swatches are:

- paper highlight `#FAF7E8`;
- neutral ivory `#F0EDDD`;
- weathered paper `#E0DED0`;
- light stone `#CAC8BB`;
- pale gray-sage `#B6B9AA`;
- gray-green `#999E91`;
- muted moss `#7E8476`;
- deep gray-olive `#4C5449`;
- charcoal `#343A32`;
- outline ink `#232720`.

Pixel art does not permit a person to remain a few rectangles or a piece of
medical equipment to remain a generic circle or block.

## Level 1 golden-slice gate

The current milestone is one complete visual golden slice containing every
representation encountered in the playable Level 1 clinic:

- exterior, landscaping strip, sidewalk, and bottom-center entrance;
- Front Desk;
- Waiting Room;
- Examination Room;
- Bathroom;
- X-ray Room;
- Imaging Control Room;
- Minor-Procedure Room;
- founder, receptionist, imaging technician, and current patients;
- patient tabs and chart portraits;
- employee cards and portraits;
- founder creator preview, map sprite, portrait, and star-jump pose;
- relevant HUD, goals, staffing, chart, construction, and event panels.

Later-level rooms must not receive partial artwork until the Level 1 slice is
reviewed and approved. This gate changes presentation only: it does not
authorize new clinical content, mechanics, balance, rooms, or progression.

## Interactive art architecture

The facility remains a real interactive Phaser scene. Rooms, doors, fixtures,
characters, litter, the water cooler, and clickable objects remain separate
functional elements. A flattened clinic screenshot is prohibited.

Small direct-click floor interactions such as visible litter render above
ordinary room fixtures and characters so they cannot be concealed, while
remaining below patient locators, Build Mode overlays, and interface controls.

Repo-native art uses reusable deterministic pixel cells:

- one shared limited palette;
- reusable drawing and matrix primitives;
- fixture sprites for furniture, equipment, and environmental details;
- a shared icon family for HUD and construction UI;
- a canonical layered character generator consumed by both Phaser and React.

CSS rectangles may still define structural panel boxes, hit areas, shadows, or
layout, but they are not final furniture, medical equipment, people, or room
illustrations. Emoji and unrelated generic character icons are prohibited.

## Rooms and environment

Every completed Level 1 room must be identifiable without its text label.
The Front Desk establishes the reusable base architectural language: one
continuous transparent cutaway shell aligns its authored five-by-four floor to
the logical footprint, while its deep rear wall, inset trim, side returns,
low south wall, entrance jambs, and directional shadows remain one coherent
perspective. Future rooms may vary flooring and furniture but must retain this
continuous shell perspective; they must not rebuild it from independently
stretched wall or floor fragments. Furniture, characters, doors, planters, and
click targets remain separate live elements.

Each room retains three distinct spatial notions: its saved logical footprint
controls building, routes, and collision; a fixture's visual floor-contact
anchor grounds its sprite; and the sprite envelope may extend upward into the
cutaway rear-wall area. The Front Desk cabinet and interactive water cooler
are the reference example: they remain logically A1 and A5 while their larger
art is rear-grounded by contact anchors. This visual grounding must never move
an obstacle tile or change a route.

Room-local tile coordinates are named consistently in graphics discussion and
proofs: lettered rows run north-to-south from A, and numbered columns run
west-to-east from 1. The Front Desk's exact five-by-four footprint therefore
has rows A-D and columns 1-5; other rooms use the corresponding range for their
current orientation. Walls project outward from the floor boundary and never
consume a named floor tile.
Rooms use:

- visibly thick walls and finished edges;
- a coherent shallow dollhouse cutaway whose rear-wall height, outer frame,
  inset trim, side returns, low front edges, and directional shadows follow the
  accepted Front Desk shell proportions. Do not reduce that depth language to
  a generic percentage or half-tile cap;
- full rear-wall faces only on exposed northern building-envelope segments.
  When a room or hallway touches immediately north, the southern space owns one
  very short shared wall on that run: its baseboard plus only a tiny strip of
  that room's matching wallpaper, currently about one-tenth of a tile high.
  A door removes this short wall for the complete door span. The northern
  neighbor does not add a second foreground lip on the same boundary. This
  never expands, shrinks, or reinterprets either room's floor. Every room's
  saved construction footprint remains its exact floor area; the visible rear
  wall is bonus cutaway architecture projected from that boundary. Partial-
  width contacts preserve the correct tall, short, and open runs. Rear-wall
  artwork remains anchored and sized against the complete wall, with covered
  portions cropped away rather than the surviving artwork being squeezed into
  the exposed fragment. Northmost hallway runs use the same rule. Genuine
  exterior northwest and northeast corners descend through short stepped pixel
  shoulders into the low side returns, while neighbor transitions remain clean
  square cuts;
- persisted doorways are complete one-tile wall cutouts. Both the source shell
  and the adjacent room's reciprocal wall/cap omit the same physical segment;
  no threshold, sill, header, leaf, frame strip, or wall material may be
  painted across the walking path. The two existing floor patterns meet
  directly at their shared edge and may change material there without a
  generic bridge. Consecutive doors into one destination form a continuous
  multi-tile opening, while different destinations remain separated by their
  genuine shared destination wall rather than synthetic door trim. Build Mode
  selection/highlight overlays may identify a door, but neither the construction
  grid nor any dark boundary line may cross its persisted opening;
- room floor material fills the complete logical footprint. Baseboards, rims,
  perimeter strips, and foreground lips are wall decoration, never floor
  decoration, so none can survive inside a doorway or inset the usable floor;
- each closed east/west room-to-room or room-to-hallway connection uses exactly
  one accepted-width top-down partition cap centered on the global tile border.
  A persisted door removes that thick line for the entire tile interval.
  Hallway-to-hallway circulation stays open, while exposed east/west exterior
  edges retain the accepted Front Desk cap treatment;
- subtle room-specific flooring or tiles that do not resemble the logical
  placement grid;
- small cast shadows and consistent depth;
- recognizable original furniture and equipment;
- counters, screens, seating, sinks, cabinetry, supplies, and restrained decor
  appropriate to the room. Furniture follows plausible real-world room
  planning: desks, storage, equipment, and seating may sit against usable walls
  rather than being mechanically centered, while required paths and work
  clearances remain readable;
- enough density to feel occupied without obscuring paths or interactions;
- native-pixel signature equipment with controls, seams, handles, cushions,
  cabinetry, tubing, supplies, and contact shadows rather than enlarged
  geometric symbols;
- moderately light landscaped exterior grounds that preserve strong room and
  character contrast, plus irregularly spaced shrubs, flower beds, trees, and
  a sidewalk/entrance composition that visually situates the clinic without
  forming obvious vertical planting columns. Exterior planting is a stable,
  deterministic presentation layer across the full permitted site, not a band
  derived from the currently constructed rooms. Its complete sprite envelope
  (including contact shadow) is culled before rendering whenever it intersects
  a room, hallway, protected entrance path, or sidewalk; expanding the clinic
  therefore removes affected plants cleanly while unrelated placements stay
  fixed;

Room footprints, routing, build rules, rotations, upgrades, and explicit-door
behavior remain domain-owned and unchanged. Visual art adapts to those rules.
Room upgrade level must be visually legible: later tiers use cleaner finish
inlays, modernized room-specific equipment, upgraded furnishings, and
restrained additional decor while preserving the original footprint and
routes. Upgrades do not merely add the same generic plant to every room.

The map is the primary visual focus during facility play. Its normal-play grid
is completely hidden. A clear translucent logical grid overlays the textured
floors only while Build/Renovate Mode or an active placement is open, then
disappears again. The exterior entrance remains the bottom-center anchor
against a full-width sidewalk, and the camera must preserve the established
10% minimum, map boundaries, panning, and entrance-oriented zoom behavior.
The illustrated land and sidewalk fill the available map zone: aspect-ratio
gutters read as continuous land, a planted grass setback visibly separates the
facility-grid bottom from the pavement, and the broad slab sidewalk reaches the
lower viewport edge with a top seam and lower curb rather than an unexplained
blank strip. The bottom-center entrance retains one clear walkway through the
setback to the sidewalk.

Characters and floor objects use baseline-Y visual occlusion. A character
whose feet are south/in front of an object's floor contact appears in front of
it; a character whose feet are north/behind that object is partially obscured
by it. Wall art remains behind room occupants. This depth ordering changes
presentation only and never changes collision, routing, hit targets, or
logical task state.

## Canonical people

Every person has one persisted appearance identity. The canonical descriptor
drives, at minimum:

- skin tone;
- hair style and hair color;
- face/head choice;
- body/outfit choice;
- role-specific clothing;
- supported accessories.

The thirty interchangeable head choices and thirty body choices use this same
system without combination restrictions in the founder creator: ten original
human options, ten female-presenting human options, and ten non-human animal,
alien, or robot options in each set. Cat and penguin options are included.
Founder appearance remains cosmetic and creates no clinical or gameplay trait.

Patient identity is generated only after the frozen presentation profile has
resolved. When an authored chart explicitly records `Female` or `Male`, the
patient's generated first-name pool and human head/body presentation family
must agree with that chart value. `Not specified` uses a neutral name and one
coherent human presentation family without inventing a chart value. This is a
visual-consistency rule only: sex/gender never selects a diagnosis, concept,
case, difficulty, reward, or simulation behavior. Patient portraits and map
sprites continue to consume the same persisted descriptor.

At the normal Level 1 camera scale, map characters are presented approximately
50% larger than the original 24x36 render, with a crisp pixel-aligned
nearest-neighbor projection and a restrained contrast keyline. Presentation
size follows map zoom so characters do not become oversized at overview zoom.
Their logical location remains anchored at the feet, and cutaway-wall clamping
uses the wall segment at the character's actual room column.

For one person, hairstyle, face, skin tone, clothing, and distinguishing
features must remain recognizable in:

- creator preview;
- front, side, and back map sprites;
- idle and walking poses;
- portrait or thumbnail;
- happy-ending star jump;
- patient tabs, charts, staff cards, and locator-related representations.

A portrait is a dedicated higher-detail bust rendering rather than an enlarged
map frame, but both renderers must consume the same descriptor and preserve
the same hair, skin, face, clothing, accessory, and role identity. It may not
be randomized or illustrated independently. Appearance identity persists
through save/reload. Old saves are deterministically enriched rather than
rerolled.

A developer-only character QA gallery must compare each current character
across these representations. It is never part of ordinary gameplay.

## Interface composition

The facility stays stable in the upper-middle workspace. On desktop, a narrow
paper-and-ink divider with an original up/down grip gives the player an
explicit, accessible allocation between the facility and Clinical Desk. It
changes the host height so the map reveals more or less of the same world;
it never stretches, squashes, or re-zooms the art. Opening a chart must not
silently change that chosen allocation. The Clinical Desk occupies the
lower-middle workspace and holds either the current paper chart or paused
construction tools, so its Build Mode control naturally follows the divider.
Phone layouts retain their fixed stacked composition without a divider.

Panels use layered paper-like surfaces, limited-palette shadows, strong
hierarchy, tactile pixel controls, and readable clinical typography. Heavy
solid bars are used sparingly. The Prototype Tools and other developer-facing
controls are hidden during ordinary gameplay.

The top HUD is intentionally quieter than the facility. Learning XP, Money,
Patient Satisfaction, and Facility Time use clean, immediately recognizable,
smooth outline pictograms with consistent scale and stroke weight: scalpel,
money bag, changing smiley face, and clock from left to right. Unlike the
environmental art, these small SVG symbols are not pixelated. They have no
individual box, fill texture, or decorative illustration.

The title strip, HUD cells, facility heading, desk edge, and lower status bar
use compact chrome so the facility and Clinical Desk retain the available
vertical space. The demonstration-content notice is centered in the lower bar,
not assigned a dedicated row. In Build Mode, the Facility Time cell carries the
short status label and stopped-time message; the map overlay remains for an
ordinary manual pause only.

Patient folders, goals, staffing, alerts, promotions, and construction menus
use tighter desktop chrome to reserve the map and desk as the dominant surfaces.
This density is limited to navigation and operations UI: charts, clinical
choices, explanations, dialogs, and primary care actions retain their existing
reading scale. At compact and phone widths, status and footer text takes a new
line when needed instead of colliding with controls or being truncated.
Pause, play, and speed controls follow the same restrained treatment. They do
not receive the texture, shading, or miniature illustrative detail used in
rooms, equipment, characters, and portraits.

Patient folders remain on the left. Goals, staffing, action-required alerts,
and the compact event feed retain the approved information architecture.
Neither the reference's permanent bottom toolbar nor its large permanent
right-action rail is copied.

The chart remains a semantic, accessible web interface styled as a physical
chart. It keeps readable text, vertical scrolling, the canonical portrait,
demographics, vitals, presentation, one active scored decision, feedback,
rewards, and disease-information flip behavior. Art must not change the
approved single-select multiple-choice or one-primary-concept scoring rules.

## Responsive behavior

Desktop is the primary visual composition, but phone width uses the same live
art and state. The desktop interface is reorganized rather than uniformly
shrunk. The Phaser bitmap must occupy a real resolved facility viewport at
every supported width.

At narrow widths:

- HUD segments wrap into readable groups;
- the facility remains a visible primary gameplay surface;
- patient navigation may condense;
- a chart may become a full-screen sheet;
- clinical text and touch targets retain readable minimum sizes.

Nearest-neighbor rendering and pixel alignment remain required at both desktop
and phone widths.

## Visual acceptance

The Level 1 slice is ready for owner review only when:

1. every listed room is recognizable without its label;
2. furnishings and medical equipment are illustrated assets, not geometric
   placeholders;
3. people have recognizable hair, face/skin, clothing, and role detail;
4. every portrait visibly matches its map sprite;
5. walls, floors, doorframes, fixtures, shading, and environment create visual
   depth;
6. the result is substantially closer to the approved reference in density,
   cohesion, and atmosphere—not merely palette or font;
7. debug presentation is hidden during ordinary play;
8. existing gameplay and saves continue to function;
9. actual desktop, phone, and character-QA renders have been inspected.
10. the screen uses the low-chroma stone/ivory/gray-olive range without a
    dominant blue cast, saturated green, or bright yellow cast;
11. rear-wall cutaways add volume without obscuring routes, characters, or
    interactions;
12. the live clinic has no placement grid, while Build/Renovate Mode clearly
    overlays one over the same room textures;
13. portraits use more native detail than map sprites while visibly preserving
    the canonical identity;
14. HUD and time-control icons remain minimal visual-rest elements;
15. character heads remain proportionate to their bodies and fully contained
    below the cutaway wall line while inside a room;
16. every rear-wall doorway is visibly grounded at the floor-contact line and
    ordinary room passages do not show an ajar decorative leaf;
17. a front/southern room does not retain a dollhouse rear wall wherever
    another room or hallway touches immediately north, while its logical floor
    remains exactly its saved build footprint;
18. partial wall coverage crops fixed wall artwork without rescaling or
    recentering it, northmost hallways receive the same shallow rear wall, and
    true exterior north corners step naturally into exposed side walls;
19. Level 2+ room finishes and room-specific equipment visibly improve over
    their Level 1 presentation without changing footprints;
20. the small player-facing title reads `Stitchin' Time`, while technical
    identifiers remain backward-compatible.
21. characters pass visually behind or in front of floor objects according to
    their baseline Y without changing routes;
22. room furniture uses plausible wall-oriented layouts rather than defaulting
    to the room center;
23. lighter irregular landscaping and a full-height map/sidewalk composition
    leave no unexplained blank strip below the sidewalk.
24. exterior turf, the planted entrance setback, sidewalk slabs, curb, and
    compact entrance flower beds are world art derived from the facility
    origin and tile scale. They pan and zoom with rooms rather than remaining
    fixed to the browser viewport; a northern camera pan may naturally move
    the sidewalk out of frame.
25. landscaping candidates are deterministic full-site placements, with the
    complete visual envelope (not only the sprite origin) culled against room,
    hallway, entrance-path, and sidewalk space. Tree-frame background holes
    are renderer-cleaned only when they are opaque near-neutral white, leaving
    the accepted tree silhouettes and flower-petal pixels intact.
26. floor material reaches every logical room edge, while baseboards and other
    perimeter strips remain wall-owned decoration rather than floor-owned rims.
27. every backed north segment has one very short baseboard-and-wallpaper strip
    owned by the southern space, every exposed north segment keeps the complete
    tall wall, and a door removes either presentation for its full span.
28. every closed room/room or room/hallway side connection has one thick
    top-down cap centered exactly on the tile border; a persisted door removes
    it completely, and hallway/hallway circulation remains open.
29. ordinary play and Build Mode show only floor texture touching floor texture
    through persisted doorways, with no dark grid line, rim, threshold, or wall
    pixel crossing the opening.

Automated tests support this gate but cannot establish visual acceptance. The
owner approves the rendered Level 1 screenshot before the art system expands
to later levels.

## Shared surgery-center wall construction

The measured Front Desk v4 shell is the single source of truth for all current
surgery-center room and hallway cutaway geometry: side-wall thickness,
north-wall envelope, outer border, bevel, baseboard, foreground lip, corner
treatment, and shadow offsets are normalized to the logical tile scale. The
same exposed north-wall envelope applies regardless of room depth, footprint,
orientation, room type, or upgrade tier; room-specific floor and plaster
materials remain independent. North doors, wall-mounted decor, Build Mode wall
targets, and camera bounds use that same projection.

Each constructed shared boundary has one presentation owner. A southern room
or hallway owns the backed north run as a very short baseboard-plus-wallpaper
strip, and the northern neighbor suppresses its south/front lip on that run. A
west room or hallway owns one vertical partition cap centered on an east/west
tile border; the east neighbor does not paint a duplicate. Persisted door runs
are subtracted from the complete owned component and from Build Mode grid lines.
Hallway-to-hallway internal boundaries remain open. Floor materials fill their
complete logical rectangles beneath this wall system, so adjacent floor
textures meet directly in every opening without a floor-owned rim or baseboard.

## Canonical actor integrity and patient-roster seam

Live characters use one clean, full-character v3 frame per pose and direction.
This avoids layering separately cropped contact-sheet heads and bodies, which
can otherwise expose a neighbouring source figure or incompatible neck/skin
edge. The creator presents the 30 accepted paired founder identities; legacy
mixed head/body save descriptors remain untouched and receive a deterministic
presentation-only coherent identity projection.

The current ordinary-patient visual catalog honestly contains 20 authored
human identity entries (ten in each existing presentation family). It has a
stable ID seam and a future target of approximately 150 genuinely distinct,
hand-authored human patient identities across age bands, gender presentation,
hairstyles, faces, skin tones, and ordinary clothing. Reserved future IDs must
not be populated by duplicate combinations or non-human founder art merely to
claim that target has been reached.
