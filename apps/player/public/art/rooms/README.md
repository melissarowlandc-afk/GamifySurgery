# Level 1 room artwork

`level-1-v1` contains original transparent PNG source atlases for the current
Level 1 clinic fixture packs.  They are intentionally not room screenshots:
the renderer selects measured fixture rectangles from each atlas and places
them using the existing semantic fixture IDs, room-local layout metadata,
explicit doors, depth sorting, and interaction targets.

The source files are versioned by room pack.  Their non-uniform source
rectangles, floor anchors, and fallback behavior are registered in
`src/art/bitmapAssetManifest.ts`.  A missing or failed bitmap load always
falls back to the existing procedural fixture art.

## Level 2 room artwork

`level-2-v1` contains three original transparent fixture atlases for the
currently playable Expanded Outpatient / Endoscopy slice.  The source art was
generated for Stitchin' Time from the approved project visual references and
then processed with an edge-connected near-white background pass, preserving
interior light surfaces while making the atlas corners fully transparent.

- `imaging-collection-fixtures-v1.png`: ultrasound console, CT scanner,
  phlebotomy chair, collection equipment, cabinets, and imaging wall details.
- `endoscopy-recovery-training-fixtures-v1.png`: endoscopy tower and stretcher,
  recovery recliner, monitoring/IV equipment, and training furniture.
- `operations-telehealth-fixtures-v1.png`: EVS equipment, coffee-kiosk
  fixtures, and the GLP-1 telehealth desk/ring-light/chair package.

These assets are resolved through room-definition-specific override metadata.
That is deliberate: a recovery recliner can stand in for the semantic
`procedureTable` only in Peri-op/Recovery, while Minor Procedure continues to
use its established Level 1 table.  The bitmaps do not carry collision,
navigation, door, or interaction meaning; those remain in the domain and
renderer layout metadata.
