# Executive Office art provenance - retained occupied seats

Owner review 2026-10-11: "The executive's chair needs to stay even if there is a N2 door. Just allow characters to path by it." Both desk seats now remain for every door. Footprint remains 3x2, one corporate appearance at upgrades 1-5. Manager browser/approval receipt pending; no runtime integration.

**Zero new generation calls. Ten prepared sprites byte-identical to v3.** Eight originals from the prior ten built-in imagegen calls and two exact-source chair foregrounds. Originals, exact prompts and real receipts remain under `originals/v2/` and `prompts/v2/`. The full 4x3 archive and v3 art/evidence are untouched. Machine receipts: `provenance-v4.json`, `art-provenance.json`.

| Object | Untouched original | Exact prompt | Prepared sprite | Original SHA-256 | Prepared SHA-256 |
| --- | --- | --- | --- | --- | --- |
| base-desk | [PNG](originals/v2/base-desk-01.png) | [prompt](prompts/v2/base-desk-01.prompt.txt) | [PNG](processed/v4/base-desk.png) | `5c3e57344505ce1cfd7a70c822568af3ea0462320c2a91048cab8e11643517f3` | `99ca432392611af0c927ecd689caf62bd1c23a0771f17a533e853c1c1a187ce9` |
| base-executiveChair | [PNG](originals/v2/base-executiveChair-01.png) | [prompt](prompts/v2/base-executiveChair-01.prompt.txt) | [PNG](processed/v4/base-executiveChair.png) | `f0f94924c812bf5b749bcb49795e1c5610aa591e1b2e90f6d57230d5c2c0db5c` | `c4f2d42a26abcb7ef1137ff20a404b4587118e7159e43c66afae985dcdf85f00` |
| base-visitorChair | [PNG](originals/v2/base-visitorChair-01.png) | [prompt](prompts/v2/base-visitorChair-01.prompt.txt) | [PNG](processed/v4/base-visitorChair.png) | `eea107c444297c960973c37007ac39faaf28767ca7a86c2e6aa7b3d8321054e7` | `97e628c74a3089f19396522e63758a244291dfb954139b0ae4bb9576bdee3463` |
| base-shelf | [PNG](originals/v2/base-shelf-01.png) | [prompt](prompts/v2/base-shelf-01.prompt.txt) | [PNG](processed/v4/base-shelf.png) | `99d4e3e526ddb9f8f7b5155e680b893e022132759a6373b35fd85330058ce2c7` | `fc1e8acf30d032563cc6b0acac6ff98884940e02377dac5b2d44e885ef88b44b` |
| base-rug | [PNG](originals/v2/base-rug-01.png) | [prompt](prompts/v2/base-rug-01.prompt.txt) | [PNG](processed/v4/base-rug.png) | `ca03a2a200f5a02e84671320cf50f5a8248a1c66f2b058a6d97ac26d61a04a64` | `f13a57d32da58e0e432c5051f66677e596ccabcf19fe99f1ef2037ed91eb77d2` |
| base-decor | [PNG](originals/v2/base-decor-01.png) | [prompt](prompts/v2/base-decor-01.prompt.txt) | [PNG](processed/v4/base-decor.png) | `a87cc6697362799a60d19e6ff530e10e5911b0175e46b9219324ddbee0e4dc08` | `f3da5d2c98a0cbfd1823b5866993b7ee6171ec570516a5da12feaea1e11018d1` |
| base-art | [PNG](originals/v2/base-art-01.png) | [prompt](prompts/v2/base-art-01.prompt.txt) | [PNG](processed/v4/base-art.png) | `3f4a3ae2c8f0ae0d192ceed0a8131a86cdfb6f750248e0c4c94c3e765a993e7d` | `c62104c7353b6850a3d3059d3a9b19655a44c565384c473382257e420d211202` |
| base-accent | [PNG](originals/v2/base-accent-01.png) | [prompt](prompts/v2/base-accent-01.prompt.txt) | [PNG](processed/v4/base-accent.png) | `a2291cdd3680cb9f7c2a8ce4b401719f5ec759b40db77919e8b198168177f2ed` | `bc72443d0f2e48a371f484376305e739c92b1e7aabba81423b9f6cb85dd4226e` |

No repainting, stretching, recolouring, upscale or replacement character. Existing alpha threshold 8, uniform downsampling and nearest-neighbour drawing remain. Chair foregrounds select the original armrest/rear pixels with the identical transforms. Both sitters retain 45 px cushion rise, source scale and seat-contact calibration. Executive stays at its prior anchor; visitor moves 0.14 tile toward the desk.

N2/S2 full entry/exit routes pass around solid occupied chair footprints and measured opaque bases at the existing 0.18T radius. All ten one-tile doors remain legal; prior wall-item visibility is preserved. The passing approved adult is sorted by floor depth with chairs, seated actors, foregrounds and desk. Four standing directions are unchanged game stills. Native source-over overlap is checked in both directions.

The revised layout and unchanged neutral geometry sources are frozen in `../stand-in/v4/`. `../layout-reconciliation-v4.json` records seat retention, the visitor move and portal approaches. Prior 3x2 code/docs are preserved under `../history/3x2-seat-hiding-20261011/`; complete former 4x3 reference under `../history/4x3-20261010/`. Meeting table and both meeting placements remain dropped.

No clinical content, readable KPI text/numbers/logo, painted people, stool or footrest. Browser checks remain with the manager.
