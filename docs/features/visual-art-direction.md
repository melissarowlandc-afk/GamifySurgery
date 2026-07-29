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

The controlling local comparisons are:

- `Photos for Codex/Current prototype.png`, the rejected placeholder baseline;
- `Photos for Codex/Visual Example.png`, the approved reference for
  atmosphere, density, depth, palette, and cohesion.

The visual example is inspiration only. It is not a runtime asset, must not be
copied or flattened into the game, and is not required to build or deploy the
repository. All shipped art must be original.

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
Rooms use:

- visibly thick walls and finished edges;
- a shallow dollhouse cutaway, with roughly the lower 20-25% of a
  full-height rear wall represented as a vertical face, short side returns,
  low front edges, baseboards, recesses, and directional contact shadows;
- rear-wall faces only on exposed northern building-envelope segments. When a
  room or hallway touches immediately north, the southern/front room loses the
  covered portion of its dollhouse rear wall. This never expands, shrinks, or
  reinterprets either room's floor. Every room's saved construction footprint
  remains its exact floor area; the visible rear wall is a bonus cutaway face
  projected outside and immediately north of that footprint. Partial-width
  contacts preserve only the genuinely exposed wall runs;
- explicit doorframes, open wall passages, jambs, and thresholds: a rear-wall
  doorway is an upright opening cut from the wall/floor contact line upward
  into the visible exterior wall face, never a floating mark descending from
  the room's top edge. A north doorway on a shared interior floor boundary
  becomes a grounded opening and threshold instead. Ordinary passages do not
  display decorative door leaves standing ajar;
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
  forming obvious vertical planting columns.

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
gutters read as continuous land, and the sidewalk reaches the lower viewport
edge without an unexplained blank strip.

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

The approved ten interchangeable head choices and ten body choices use this
same system without gender restrictions.

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

The facility stays stable in the upper-middle workspace. Opening a chart must
not resize, move, or re-zoom it. The Clinical Desk occupies the lower-middle
workspace and holds either the current paper chart or paused construction
tools.

Panels use layered paper-like surfaces, limited-palette shadows, strong
hierarchy, tactile pixel controls, and readable clinical typography. Heavy
solid bars are used sparingly. The Prototype Tools and other developer-facing
controls are hidden during ordinary gameplay.

The top HUD is intentionally quieter than the facility. Learning XP, Money,
Patient Satisfaction, and Facility Time use clean, immediately recognizable,
outline-only pixel pictograms with consistent scale and stroke weight: scalpel,
money bag, changing smiley face, and clock from left to right. The symbols have
no individual box, fill texture, or decorative illustration.
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
18. Level 2+ room finishes and room-specific equipment visibly improve over
    their Level 1 presentation without changing footprints;
19. the small player-facing title reads `Stitchin' Time`, while technical
    identifiers remain backward-compatible.
20. characters pass visually behind or in front of floor objects according to
    their baseline Y without changing routes;
21. room furniture uses plausible wall-oriented layouts rather than defaulting
    to the room center;
22. lighter irregular landscaping and a full-height map/sidewalk composition
    leave no unexplained blank strip below the sidewalk.

Automated tests support this gate but cannot establish visual acceptance. The
owner approves the rendered Level 1 screenshot before the art system expands
to later levels.
