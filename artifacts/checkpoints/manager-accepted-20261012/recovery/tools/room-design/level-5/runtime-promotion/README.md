# Approved Level 5 runtime promotion

Run `node tools/room-design/level-5/runtime-promotion/promote.mjs all --check`
for a read-only verification. A room slug may replace `all`. Every hash in each
approval receipt is checked, including historical sprites and approved proof
files. Only the active Founder v2 / Executive v4 / Gift v3 / Garden v2 / Gym v1
sprites are copied to `apps/player/public/art/rooms/level5-v1/`.

Promotion without `--check` copies bytes and writes runtime data; it never
rebuilds a proof or processes an image. Native alpha anchors, source crops,
uniform scale, contacts, necessary/optional door masks, corrected Gym corners,
continuous rows and foreground layers come from the accepted proof exports.
All five Founder appearances are preserved. Other rooms have one fixed look.

Occupied routes are generated using each proof's pure geometry, including
single doors, pairs and all-door circulation, with the accepted 0.18-tile actor
radius. Each logical knot has one matching world knot, offset by half a tile;
preserve their shared indices and do not deduplicate synchronization nodes.
Standing approaches and static seating transitions are distinct. Coarse domain
walking anchors do not replace these fine knots for M3-M5 actor movement.

M2 adds no passive room bonus, support task, Executive hire or retail stream.
The five accepted effect ladders remain future and purchases are unavailable.
Founder tier previews use synthetic QA appearance metadata, without charges or
effects. Save schema and the ordinary cap of 4 remain unchanged.
