# Worker workflow notes

- Built-in image generation: 16 planned calls, 8 standing-cardinal identity
  sheets and 8 final eight-pose sheets. No rejected sources, corrections,
  recoloring, alpha cleanup, mirroring or procedural character drawing.
- Intermediate packager runs correctly reported missing sources until all eight
  identities were generated. All 64 final poses package without gaps.
- Initial placement-validator run failed at its fixed fixture-left assertion:
  actual 56, expected 32. A scaffold substitution of the v6d 56-contact count to
  the v6e 32-contact count also changed the literal fixture coordinate. The
  proof builder always read the correct approved source geometry. Restored the
  assertion to 56 and guarded the historical scaffold; no image, manifest,
  contact, approved source or runtime geometry changed for this correction.
- An initial inline Node catalog-read invocation lost quotation marks in the
  Windows argument boundary and failed with a SyntaxError before execution.
  The file-based baseline/audit scripts then read the catalog successfully.
- One inadvertent read-only `git status --short` ran during intake. No further
  Git commands and no Git mutations. All preservation checks used filesystem
  snapshots and hashes; no commit, push, deployment or publication.
- Manager browser validation is prepared but not run by this worker, matching
  the v6d art lane and its documented worker `spawn EPERM` limitation. Static
  image/link/card checks are distinct from browser and manager acceptance.
