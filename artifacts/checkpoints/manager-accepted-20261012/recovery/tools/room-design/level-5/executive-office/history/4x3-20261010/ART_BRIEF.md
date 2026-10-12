# Executive Office — proposed 4×3 fixed base look

Private owner/development art candidate, 2026-10-10. Owner approval is pending;
runtime integration is false. This is the second room in the accepted facility
Level 5 roadmap, after the approved Founder's Office.

## Footprint and appearance decision

Recommend **4×3**. A desk/visitor bay and a separate small round meeting bay fit
side by side, with two meeting chairs and clear peripheral door approaches.
3×3 would compress those bays or require dropping the meeting area. Neither
the roadmap nor catalog prescribes the footprint, so 4×3 requires owner review.

`packages/balance-config/src/room-upgrades.ts:51–53,96` defaults
`appearanceChanges` to false for `room.executive_office`. GS-038's accepted
table at line 460 defines a future administrative upgrade, not new appearance
tiers. Therefore author **one polished corporate base look**. Upgrade selectors
1–5 intentionally show the identical art; no upgrade effect or cost is applied.
Facility level, upgrade level and appearance level remain separate.

## Frozen layout before painting

`stand-in/v2/layout-prepaint.json`, ten geometry PNGs, manifest and route receipt
are frozen before imagegen. One shared layout at 120 proof pixels/tile, prepared
art at 480 pixels/tile. Fourteen one-tile door sections: N1–N4, S1–S4, WA–WC,
EA–EC. Every section is legal. Four independent north backing controls.
256 declared-geometry states and 1,344 routes pass with a 0.18T actor radius.
Any post-art fit must be recorded in `layout-reconciliation-v2.json`.

| Slot | Canvas | Display tiles | Ground / wall anchor | Door/backing owners |
| --- | --- | --- | --- | --- |
| Dual-monitor desk | 696×600 | 1.45×1.25 | Floor (1.25,1.18) | None |
| Executive chair | 480×768 | 1.00×1.60 | Floor (1.25,1.00), seat (1.25,0.625) | None |
| Visitor chair | 456×576 | 0.95×1.20 | Floor (1.25,2.22), seat (1.25,1.845) | None |
| Filing credenza | 720×384 | 1.50×0.80 | Floor (2.75,0.30) | N3,N4; keeps height with backing |
| Round meeting table | 480×432 | 1.00×0.90 | Floor (2.95,1.68) | None |
| Meeting north chair, facing south | 456×576 | 0.95×1.20 | Floor (2.95,1.00) | None |
| Meeting south chair, facing north | 456×576 | 0.95×1.20 | Floor (2.95,2.22); same visitor-chair art | None |
| Flat rug | 1584×1104 | 3.30×2.30 | Centre (2.00,1.65), walkable | None |
| Abstract KPI whiteboard | 432×240 | 0.90×0.50 | Top centre (1.25,−0.73) | N1,N2 doors/backing |
| Window | 576×264 | 1.20×0.55 | Top centre (3.00,−0.76) | N3,N4 doors/backing |
| Plant | 288×480 | 0.60×1.00 | Floor (0.38,0.35) | N1,WA; keeps height with backing |

Declared footprint details are in the JSON. Measured opaque floor bands must
also clear doors/routes. Door opening hides the relevant wall/edge furniture;
backing hides wall attachments but does not shorten floor-standing furniture.
No pass-through exception. Rugs remain walkable.

## Seating and facing

Executive sits **north facing south**, visitor **south facing north**. The desk
shows its **south visitor-side panel**. Dual monitor backs face the viewer and
screens face the north operator, with a central gap for the executive's face.
Do not paint an operator drawer/knee-hole view. Visitor chair is seen from the
rear, with a compact low back and arms extending north.

Approved unchanged `founder.01/sit-south.png` is an Executive stand-in, without
inventing a new Executive character or runtime role. Approved unchanged
`patient.adult.007/sit-north.png` supplies the visitor. Keep the approved source
scale 0.6865478271728273 and posterior contacts (80,241.13389121338912) /
(80,220), calibrated to a 45-proof-pixel cushion rise. Draw chair, real still,
exact-source foreground armrests/back, then desk in front of executive.
Both heads/shoulders must remain visible. Legs hang; no footrest or leg rest.
Meeting chairs remain empty and face inward, north chair south / south chair
north. No stool is needed; the approved backless-stool rule stays applicable
to future clinical rooms, not a reason to add one here.

## Art and source rules

Built-in `image_gen.imagegen`, one call per object. Ten selected new objects:
desk, executive chair, visitor chair, credenza, meeting table, south-facing
meeting chair, rug, KPI board, window and plant. No painted people. Crisp pixel
edges and dark outline weight matching the approved room art, muted sage/navy,
neutral charcoal, restrained walnut and brushed-metal palette, upper-left
light, elevated-front orthographic camera, straight front edges, shallow top
surfaces. Professional corporate finish; avoid gold, carving, throne styling,
personal awards or founder memorabilia. Transparent background and complete
silhouettes, with padding. KPI marks are abstract, unreadable and text-free.
No logos, labels, numbers, readable text, watermark, clinical content or body
detail. Internal room art is a style reference; no proprietary external corpus.

Keep exact prompts, untouched originals, tool receipts, raw dimensions and
SHA-256 hashes in `assets/`. Native preparation uses alpha cleanup/crop,
uniform downscale and source-point registration, with nearest-neighbour
sampling for crisp edges. No stretching, recolouring or semantic repainting.
Foregrounds select original source pixels with the same uniform transform.

## Proof and acceptance

Mirror the Founder's Office proof, build, geometry, Node controls/native
inspection/reproducibility, HTTP checks, browser error helper, Chrome validator
and captures. Keys 1–5/arrows switch upgrade level while retaining fixed art;
preserve doors/backing/diagnostics. Individual/all occupancy, routes, grid,
floor/seat contacts, opaque bands and bulk actions remain available. 320 px
browser layout must pass. Native renders are separate from browser evidence.
Owner approval stays null until an explicit approval receipt is supplied.
