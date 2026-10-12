# Staff Gym — preserved approved design and corner correction

The single full-room concept remains unchanged at `concept/staff-gym-concept.png`. The room keeps its straight-wall elevated-front game perspective, speckled rubber floor, teal pads, honeywood storage, adjoining rear cardio/weights/hydration, mirror/poster, continuous perimeter fixtures and one clear aisle. One fixed look at upgrades 1–5.

Owner (2026-10-11): “Some of the shelves on the side walls look like they are in the same spot as and overlapping the equipment in the back wall. Otherwise this is approved.”

**Correction complete; native validators PASS. Approval of every other room element is retained. Fresh browser validation is assigned to the manager.** This revision changes only the side-wall shelving geometry and its door ownership. There is no new design question or request to reapprove the rest of the room.

The rear side pieces `west1` and `east1` are removed. Rear equipment `north1` and `north4` now own the northwest and northeast corners. Remaining side shelves start at floor y=1 (one tile south), and their unchanged generated sprites use the same uniform display factor 0.7462686567164178, placing the first visible shelf edge at or below the rear equipment's y=0.75 floor edge. Native alpha tests find zero rear silhouette overlap.

The `west4` / `east4` floor and footprint ends move from y=4 to y=3.72; they exactly abut the unchanged front trays’ footprints, which start at y=3.72. `front1` / `front4` own the southwest and southeast corners. Front trays retain their camera-side depth and source-over faces. Side and front fixtures share touching edges, never floor area. Rear equipment, the whole front row, mirror/poster, cooler, weights, treadmill/bike, towels/hooks, bench, mat/ball/roller, rubber floor and all other approved elements remain unchanged.

There are twenty-five fixture records, twenty reused sprite slots and one bench foreground. All twenty-one prepared PNGs, all twelve original built-in outputs and their prompts/real receipts are byte-identical. Nineteen non-side records, both approved scrubs stills and their contacts/approaches, supports and navigation/aisle are identical to the reviewed version. No new image-generation calls, animation rig, home/hiring slot, runtime/balance/game/save or clinical-content edit.

Seated `gs026-employee-001/sit-south.png` keeps floor [1.2, 2.7], cushion [1.2, 2.4196596372377623], approach [1.2, 3.05], existing scale 0.6865478271728273, bench → real staff → exact-source rail/legs order and 542 opaque foreground-overlap pixels with zero head occlusion. Standing `gs026-employee-004/stand-south.png` remains at [2.7, 2.7] on the walkable mat, with the ball behind and roller in front. The aisle target remains [2, 3.35]. Necessary stations, staff contacts, foreground and aisle never hide for a door or backing selection.

All sixteen one-tile doors remain legal (N1–N4, S1–S4, WA–WD, EA–ED), with four independent north backing sections. The revised side sections retain only their intersecting doorway owners. No north side module remains to duplicate `north1`/`north4`; front corner trays and shortened side sections clear their actually owned S/W/E doorway.

| Piece | Role | Class | Hides for |
| --- | --- | --- | --- |
| `north1` | Treadmill · rear bay 1 | optional | N1, WA |
| `mirror1` | Wall mirror · section 1 | optional | N1 / its north backing |
| `north2` | Exercise bike and adjoining weights · rear bay 2 | optional | N2 |
| `mirror2` | Wall mirror · section 2 | optional | N2 / its north backing |
| `north3` | Dumbbell rack · rear bay 3 | optional | N3 |
| `mirror3` | Wall mirror · section 3 | optional | N3 / its north backing |
| `north4` | Water cooler, towel cubby and weights · rear bay 4 | optional | N4, EA |
| `mirror4` | Mirror edge and abstract motivational poster | optional | N4 / its north backing |
| `west2` | Towel, bottle and block cubbies · west section 2 | optional | WB |
| `west3` | Towel, bottle and block cubbies · west section 3 | optional | WC |
| `west4` | Towel, bottle and block cubbies · west section 4 | optional | S1, WD |
| `east2` | Rolled-mat and accessory rack · east section 2 | optional | EB |
| `east3` | Rolled-mat and accessory rack · east section 3 | optional | EC |
| `east4` | Rolled-mat and accessory rack · east section 4 | optional | S4, ED |
| `front1` | Folded towel tray · front section 1 | optional | S1, WD |
| `front2` | Bottle tray · front section 2 | optional | S2 |
| `front3` | Dumbbell and yoga-block tray · front section 3 | optional | S3 |
| `front4` | Rolled-mat tray · front section 4 | optional | S4, ED |
| `benchSeat` | Padded rest bench · adult seated south | necessary | None |
| `stretchMat` | Stretch mat · standing staff station | necessary | None |
| `exerciseBall` | Exercise ball · stretch station equipment | necessary | None |
| `foamRoller` | Foam roller · front of stretch station | necessary | None |
| `rubberFloor` | Rubber gym floor and connected aisle · walkable | necessary | None |
| `towelHooks` | Wall towel hooks · above dumbbell bay | optional | N3 / its north backing |
| `benchSeat-front` | Exact-source camera-side rail and legs | necessary | None |
| Both staff contacts and approaches | Seated bench and standing stretch contact; connected aisle | necessary | None |

No new art or pixel editing: the two side modules are reused with uniform display scaling, revised floor ownership and correct depth. Every prepared PNG and non-side placement remains identical. Twelve historical built-in calls, zero new calls.
