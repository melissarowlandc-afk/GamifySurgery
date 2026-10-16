# Low-effort character movement study

Researched September29 2026. Owner requests five alternatives to producing an
eight-frame walk in each direction for every character. This is visual-design
research, not a reconstruction of another game's engine. Existing game art is
the only character art used in our mockups; no external sprites are copied.

## Comparable approaches and primary sources

| Reference | What the source supports | Adaptation for our clinic |
| --- | --- | --- |
| [RimWorld](https://rimworldgame.com/) and its official screenshot gallery | A colony-management game with small, simplified pawn-like colonists. The image search returned the official gallery; direct full-size image retrieval failed. | Upper-body pawn silhouettes reduce the expectation of articulated legs. Our rounded base and crop are our design, not a claim about RimWorld's rendering code. |
| [Prison Architect](https://www.paradoxinteractive.com/games/prison-architect/about) | Comparable institutional management setting and compact abstract character presentation in publisher media. | Supports considering abstraction in a room-based management game. No claim that it uses our exact transform/timing. |
| [Wildermyth developer page](https://wildermyth.itch.io/wildermyth) | Hand-painted 2D characters and scenery in a papercraft 3D world. | Full-body cutout glide or gentle whole-sprite rock preserves character design without articulated leg poses. |
| [Wildermyth developer discussion](https://www.reddit.com/r/IndieDev/comments/c9pfc8/some_proofofconcept_elemental_axes/) | The poster identifies the work as their team's game and explains that the papercraft style reduced rigging/animation effort for a small team. | Direct support for choosing a visual style around simpler animation. Our rocking parameters are an original design, not copied movement data. |
| [Crossy Road official site](https://www.crossyroad.com/) and [official launch trailer](https://www.youtube.com/watch?v=a3pTw0jmxlg) | The developer explicitly presents the game as a hopper. | A small shared vertical arc and grounded shadow can signal travel without eight limb poses. Our pixel-art clinic adaptation is much gentler than an arcade hopper. |
| [Stacklands developer page](https://sokpop.itch.io/stacklands) | Village simulation through cards; villagers act through card interactions. | Portrait tokens are a readable, low-animation abstraction. Stacklands uses cards; our circular token is an adaptation, not an exact game mechanic. |

No videos were decoded/frame-analyzed, no game engines inspected, and no external
art was downloaded into project assets. Distinguish source-supported presentation
choices from our implementation estimates and aesthetic judgments below.

## Five selected mockups

| Option | Shared implementation | New movement art per existing identity | Visual tradeoff |
| --- | --- | --- | --- |
| Directional glide | Translate the current standing still and switch facing at turns. | None; reuse four standing directions. | Best preservation of current style, least effort; visible feet slide. |
| Gentle rocking | Small whole-body rotation and bob around a stable ground point, only while moving. | None; reuse four standing directions. | Adds life cheaply; keep subtle to avoid a waddling appearance. |
| Small hops | Shared vertical arc with an unlifted ground shadow; settle at stops. | None; reuse four standing directions. | Playful toy-like motion; can look busy in a crowded clinic. |
| Legless pawn | Present the upper body with a rounded base, keep this abstraction at stops too. | No new walk frames; generic crop may need fit checks for unusual art. | Most convincing way to remove the walking expectation; changes the character silhouette and needs a coherent seating design. |
| Portrait token | Existing front portrait in a badge, move it along the route, add direction chevron. | None; one existing front portrait/standing crop. | Clearest identity at small size, but looks more like a management marker than a person in the room. |

Effort estimates are comparative, not promised hours. All five share movement
code across identities; new characters still need their normal still/portrait art.
None needs32 newly authored walking frames per character. UI transforms/clipping
operate on existing images; source PNGs and approved static/seated art stay intact.

Recommendation: start with directional glide. Gentle rocking is the closest
optional addition if glide feels too static. Hopping is worth comparing for a
playful tone. Pawn/token styles require a broader on-map presentation decision,
especially around sitting, rather than just a new movement toggle.

## Deliverable and validation
Standalone animated comparison at
`artifacts/character-movement/gs026-movement-alternatives/review.html`.
Current runtime, routing, saves, approvals and earlier walking attempts stay
unchanged. Actual artifact/code verification will be recorded in the ExecPlan.
