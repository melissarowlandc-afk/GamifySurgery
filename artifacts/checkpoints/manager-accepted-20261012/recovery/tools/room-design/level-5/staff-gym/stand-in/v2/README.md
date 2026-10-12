# Owner-revised geometry and neutral replay

`layout-owner-revision.json` freezes the owner-requested corner correction before the final rebuild. The original concept freeze stays at `../v1/layout-concept.json`. `replay.mjs` writes twenty neutral registered frames, three actual native engineering views and the occupied single-door route receipt using current fixed geometry. The replay does not replace served painted exports; `proof/build.mjs --stand-in` invokes it. Neutral rectangles are engineering guides, distinct from the unchanged generated final art and owner approval.
