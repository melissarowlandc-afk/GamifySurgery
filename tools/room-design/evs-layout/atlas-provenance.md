# Environmental-Services Closet proof art provenance

The proof uses parent-generated and parent-reviewed source atlases without semantic edits or pixel rotation:

- Current shelves and lateral clutter: `Photos for Codex 2/Codex Rooms 2/GS-015/evs-furniture-atlas-02.png` (1312 x 1199)
- Retained mop bucket/caddy: `Photos for Codex 2/Codex Rooms 2/GS-015/evs-furniture-atlas-01.png` (1536 x 1024)
- Exact prompts: the matching sibling `.prompt.txt` files

`evs.webp` is an alpha-preserving technical crop and WebP pack. RGB is encoded at quality 88 to keep the self-contained proof below 1 MB; source alpha silhouettes and aspect ratios are preserved. `evs.json` records source ownership, zones, global visible-alpha bounds, packed frames and crop-relative ground contacts.

## Registered source geometry

| Fixture | Source visible bounds | Packed crop | Ground contact | Rendered height |
| --- | --- | --- | --- | --- |
| N1 shelf bank | (0, 0)-(654, 648) | 654 x 648 | (328, 641) | 130.92 px |
| N2 shelf bank | (655, 21)-(1282, 650) | 627 x 629 | (325, 620) | 126.87 px |
| B1 lateral clutter | (44, 658)-(611, 1167) | 567 x 509 | (276, 492) | 80.79 px |
| B2 lateral clutter | (703, 675)-(1251, 1154) | 548 x 479 | (272, 475) | 78.67 px |
| Mop bucket/caddy | (1089, 55)-(1518, 968) | 429 x 913 | (245, 899) | 125 px |

The shelf scale uses the solid-alpha furniture bounds rather than faint edge pixels: 589 and 590 source pixels render at 119 pixels each. Their visible tops align near 52 pixels while their bases share room ground y=.35, filling the 240-pixel north wall with only the center seam.

## Spatial contract

- Fixed north-up 2 x 2 room. The preview initially closes every doorway so the full closet is visible; S2 remains selected for the first interaction.
- N1 shelf ground `(.5,.35)`; N2 shelf ground `(1.5,.35)`.
- Each optional shelf is nonblocking and hides only for its own north doorway, its own backed-north state, or the optional-shelves toggle.
- Optional B1 clutter at `(.4,1.87)` hides for WB or S1. Optional B2 clutter at `(1.6,1.87)` hides for EB or S2. Backed north does not affect either group.
- Permanent nonblocking mop bucket/caddy ground `(1.25,1.15)`.
- No window, character pose, clinical timing or solid navigation blocker is introduced.
- Only the north paint changes to muted deep gray-olive. The east, west and south common shell remains unchanged.
- The floor is a continuous dark 24-pixel sage/stone utility pattern anchored at the room origin, without gameplay-cell lines.
