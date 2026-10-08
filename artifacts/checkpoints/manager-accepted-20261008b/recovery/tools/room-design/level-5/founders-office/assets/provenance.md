# Founder Office art provenance

2026-10-08. Proposed base-room candidate; owner approval null; runtime integration disabled.

Five built-in imagegen calls produced four selected sprites. Exact prompts, untouched originals and tool receipts are preserved locally. No API runner, new dependency, external reference artwork or clinical content was used. Source rights and detailed native transforms are recorded in `art-provenance.json`.

| Piece | Selected original | Exact prompt | Original SHA-256 | Processed SHA-256 |
| --- | --- | --- | --- | --- |
| founder-desk | `assets/originals/founder-desk-02.png` | `assets/prompts/founder-desk-02.prompt.txt` | `ccf635307f9348e010d5a1227ea8136a796bbdbae38bca0862f87074b4cc84a4` | `68bc45eb77842516b88aa423c0c8d8df1f6b5331656a3dbbe4f5ad4a7bcdf68c` |
| office-bookcase | `assets/originals/office-bookcase-01.png` | `assets/prompts/office-bookcase-01.prompt.txt` | `bc1ed5f10762cac41e171ee091e842c39ae05e056afb3786086745de4ac349e0` | `f615bfa2df0a4f230db99ea033858b3144806099a4e5167db32666cf93e9247c` |
| office-plant | `assets/originals/office-plant-01.png` | `assets/prompts/office-plant-01.prompt.txt` | `f0ea237e650ee0ecee5a542531fc49ad0bbf590be222879986c94087c07d5523` | `2bf394b221bba77df7b52b629e9d030d1e260d5030c3f8dbd1f8c38a2f0db8f0` |
| office-print | `assets/originals/office-print-01.png` | `assets/prompts/office-print-01.prompt.txt` | `ae3ab345b73859e37dcb501dbb16312fa7b7e63aa7a30939d91172422faa2830` | `56dc8f33c34ea1f82b2bfd7f3cf98d285d22c6d133221c0dbd30ad7c1ef59ebb` |

The desk v1 original/prompt are retained as rejected review evidence (too low and wide in the first assembly). Built-in imagegen edited it into the selected v2 desk. Actual leading worktop rise is 79.841076 px at 120 px/tile. Its final floor registration moved north by 0.20 tile, documented in `../layout-reconciliation.json`; initial stand-in files are preserved.

Native processing removes alpha below 8, crops transparent margins, uniformly downsamples into padded frames, and registers actual floor/top alpha anchors. It makes no semantic painting, stretching or upscaling.

Reused south chair: approved Level 4 Reading chair, with its recorded y>=296 foreground cutoff copied exactly. Reused west armchair: exact `[8,748,315,369]` crop from the approved Waiting atlas and approved Pediatric Waiting armrest mask. Sources, approval paths, output hashes and derivation rules are in `reused/contract.json`. Real founder.01 south and patient.adult.007 west still hashes match the runtime registry/source files; no character art was generated or edited.

All new art is text-free and contains no logos, people, footrests, wounds, blood or clinical body detail. The delivered room has two adult stills and no pediatric occupant or rolling stool. The full backless-stool and same-room-parent rules remain applicable to later rooms where those objects/occupants exist.
