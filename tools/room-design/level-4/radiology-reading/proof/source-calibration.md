# Radiology Reading Room source calibration

The selected island source is `reading-island-02.png`, SHA-256
`D54860AA5579D078DCA018726E07D9E4803795E99F9318405A0E002B2ACFA230`.
Its alpha-haze-free component uses native seed `(760,500)`, threshold alpha
160, a one-pixel connected edge ring, crop `(253,10,1054,996)`, and source
anchor `(760,1004)`. The native 260 px worktop-to-foot rise is rendered at
`80/260 = 0.3076923076923077`, giving the established 80 px seated desk rise.
The world anchor is `(2.00,3.32)` tiles.

The island's visible NW feet occupy approximately `(0.705,2.310)` through
`(1.097,2.395)` tiles. The continuous SE lower base occupies native
`x=1150..1300, y=790..850`, approximately `x=3.000..3.385,
y=2.771..2.925` tiles. Its active collider also covers the opaque bridge pixels
around native `x=1221..1224, y=840`; it is not represented as two separated
feet. Desktop, monitor, and divider projections remain separate from movement
blockers.

The chair atlas source is `reading-chairs-01.png`, SHA-256
`327FAA6145AA27B1C9BC0821D256600BA0F8273D9AF6E1747866BEFD7151B015`.
TL/TR/BL/BR supply S/N/E/W views. Each connected component is packed with the
same alpha rule. Per-facing scales are 45 px divided by the native floor-to-seat
rise: S `45/167`, N `45/186`, E/W `45/190`. The active collider widths cover
the measured caster bands rather than the smaller pre-art study rectangles.

The four seated poses come from the current generated character registry. The
registry SHA-256 is
`C9CBD1F60A69F8ED03269BE30FEDA4D0394521F8D0740D8CC68991295980D180`.
Their current helper widths at 120 px/tile are rounded before scaling:
NW 121 px, NE 113 px, SE 116 px, SW 116 px. Each pose retains its identity
scale and authored seat-contact anchor; no standing or seated source was
resized globally.

Depth layers follow the selected floor order. Chairs are behind the island.
The NW reader draws before the NW desk foreground, the SE divider draws in
front of the north-eastern reader's west shoe, the SW reader draws south of the
NW foreground, and the SE chair back remains in front of its north-facing
reader. All four readers remain legible without flattening the furniture depth.
