# Combined proof display atlas

`combined-assets.webp` is a technical preview atlas assembled from the accepted Front Desk and Examination WebP assets already stored in their individual proof directories. Source pixels were cropped to the exact fixture rectangles used by those proofs, uniformly downscaled where a crop exceeded the proof's useful display resolution, packed without rotation, and encoded as WebP quality 78. No sprite was repainted, stretched, semantically edited, or generated for this proof.

The fragment embeds this display atlas so the delivered interactive HTML is self-contained. The original preview assets and their higher-fidelity source/provenance remain authoritative in `front-desk-layout/` and `examination-layout/`.
