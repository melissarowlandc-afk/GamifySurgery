# Correct character gait poses

Status: corrected preview complete locally, September 28, 2026; runtime integration outstanding.

## Goal and owner feedback
Owner rejects batch03 anatomical movement: Gray Overshirt South appears reversed;
profile legs do not pass each other. Gray Braid (called gray beard by owner in
context) lacks intermediate poses and North appears reversed. Owner requests a
repeatable method that does not require per-character supervision, and asks for
online walk-cycle examples and explanation. Existing approval applies to earlier
three identities; batch03 production acceptance was insufficient and is reopened.

## Decisions and constraints
Stop expanding roster. No more accepting held contact poses as substitutes for
missing passing/up poses. Eight slots and valid PNGs do not establish correct gait.
Preserve all prior source/review history, current stills, IDs/saves and unrelated
shared routing/clinical/economy work. No commits/push/deploy. Local owner pathway
START_GAME.cmd -> http://127.0.0.1:4173 usual profile remains unchanged.

## Method and ownership
Parent researches primary animation guidance, chooses pose constraints, performs
imagegen and reviews actual movement. Sol seated_correction_pilot first audits
Blue039's owner-approved cycles against gait criteria as potential pose references;
approval alone is insufficient. Worker may create contact-sheet evidence locally,
but no runtime/art replacement until a corrected pose sequence is demonstrated.
Next implementation milestone will be delegated explicitly after method selection.

## Acceptance
- One full two-step cycle; contacts exchange the near/far leg roles.
- Two genuine passing poses and continuous knee/foot trajectories.
- Opposite arm/leg swing; consistent identity, proportions and facing.
- Front/back views express the correct direction of support and swing, not
  merely swapped/reversed photographs of an incorrect cycle.
- Inspect slow motion, contacts/passing frames and native/map size before runtime.
- File reconstruction/preservation and browser playback checks are necessary but
  cannot substitute for visual gait acceptance.

## References consulted
- Raymond Schlitter, Pixelblog50 Human Walk Cycle, May29 2024:
  https://www.slynyrd.com/blog/2024/5/24/pixelblog-50-human-walk-cycle
  Eight-phase reference and simple dummy before costume/detail. Study principles;
  do not ingest its commercial asset pack or copy art into project assets.
- Adobe, What is a walk cycle and how can I create one?:
  https://www.adobe.com/creativecloud/animation/discover/animation-walk-cycle.html
  Leg crossover and alternating contact/passing poses; consulted September28 2026.

## Validation and progress
Initial research confirms missing passing phases are fundamental defects.
Previous phase regrouping reduced frequency without fixing absent pose geometry.
Sol completed the Blue audit and reusable preview tooling. Root inspected corrected
Gray Overshirt N/E/W and Gray Braid E/W contact sheets: exchanged near/far legs,
true passing poses, and front/back shoe cues are materially improved. South required
two four-pose sheets and targeted Gray Overshirt phase2 leg/arm corrections; both
identities now have opposed contacts and intermediate passing poses. Original
failed sources remain recorded; nothing is silently relabeled as owner-approved.

Each source sheet receives a uniform median-height scale to the standing reference;
separate sheets cannot share a raw pixel scale because generation drawing sizes
differ. Within each sheet no per-frame resizing is used. Root caught and rejected
the initial half-cycle height mismatch. Wider strides use 192x320 transparent
canvases, centered at96, with floor287, preserving standing pixel height. Existing
160x320 art stays unchanged; runtime aspect-ratio support is a separate milestone.

Root source-art review and Sol extraction/hash/preview checks are complementary.
Image generation still needs agent anatomy review; a single-call fully unattended
art pipeline has NOT been proven. Reusable pose templates and pinned extraction
reduce variation but are not a skeletal animation system.

Gray Braid North v2 has clean actual transparency on a white composite. The
inline generated-image display was misleading; v1 is superseded, not proven
opaque. Source anatomy matches the guide. Fifteen image-generation calls were
used for this two-identity repair, including rejected attempts and targeted edits.
This is evidence of a better constrained workflow, not low-cost unattended
production. A shared authored skeletal rig would address temporal consistency
more directly if future image generation keeps requiring this level of repair.

Scope decision: finish the corrected 64-frame comparison preview and reusable
tooling. Keep runtime unchanged in this bounded review task. Integrating wider
canvases requires an explicit next implementation milestone for actual texture
aspect ratios, cold-load retention, registry provenance and gameplay regression.
No additional owner permission requirement has been invented; this is separate
engineering work, not a claim that the new art is already installed.

Browser URL policy blocked opening the local HTML preview. No alternate browser,
server or CDP workaround was used. Direct source/normalized image inspection and
file validation proceed; live browser playback is not claimed.

Root inspected all eight normalized direction sheets and the combined map-size
strip. Sol implemented the reusable preview/extraction/validation milestone;
root reviewed actual code, the new scale-calibration test and all image evidence.
Root independently passed six extractor tests, all eight direction preview validators
and the existing runtime validator (five identities/160 frames preserved). No
clinical content, still assets, owner saves or runtime animation code changed.

Combined comparison:
`artifacts/character-movement/gs026-gait-correction-pilot/review.html`
and `map-overview.png`. It has slow/medium/normal playback, pause, stepping,
native/map sizes and links to all eight-frame direction comparisons. Static
inspection is complete; browser playback remains unverified because of the
browser URL policy block. Source anatomy is agent-reviewed, not owner-approved.

Next action: integrate the corrected 192x320 art only with generic selected-texture
aspect-ratio support, cold-load retention checks, preserved prior96 frames and
1054 stills, and runtime playback verification. The existing160x320 renderer
must not squeeze these wider sprites or shrink body height to make them fit.
This valuable checkpoint is local only; no commit, push or deployment.
