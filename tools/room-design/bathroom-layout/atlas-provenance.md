# Bathroom display atlas

The new parent-reviewed candidate source is `Photos for Codex 2/Codex Rooms 2/GS-015/bathroom-furniture-atlas-01.png` (1254 x 1254 RGBA), generated with the built-in image tool. Its exact prompt is preserved beside it as `bathroom-furniture-atlas-01.prompt.txt`; the source PNG remains unchanged. Owner review is pending.

`pack-assets.py` uses fixed technical crops around the toilet, sink, and mirror and packs them without rotation into `bathroom-assets.webp`. The quality-88 WebP is a lossy browser display encoding, not a replacement source or semantic repaint. Each rendered sprite retains the crop's source aspect ratio.

The sink ground contact uses measured source crop row 521 centered at source x 180. The toilet ground contact uses row 594 centered at source x 164. These contact points register to the bottom center of their separate logical floor footprints. Shadows may extend below the contact row and the basin/bowl may overhang the narrower base footprint. The toilet seat attachment is recorded separately from its southern floor approach. Visible-body clearance and occupied use poses remain unverified.
