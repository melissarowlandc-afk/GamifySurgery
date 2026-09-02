# Build versioned Cortan graphics workflows

## Goal

Create and validate two reproducible, graphics-only ComfyUI workflows for
GamifySurgery, keep canonical copies in this repository, and upload new
versioned copies to Cortan without changing the user's existing `Pixel Art
Sprite Starter.json` workflow:

1. `GamifySurgery - Pixel Art Sprite Starter v2.json`, correcting the inverted
   foreground alpha and making review output deterministic; and
2. `GamifySurgery - Incremental Asset Edit Qwen v1.json`, using Cortan's local
   Qwen Image Edit 2511 stack for reference-guided, mask-bounded asset changes.

## Requirements

- Preserve the existing Cortan workflow byte-for-byte. Never overwrite, rename,
  or delete it.
- Store canonical UI workflow JSON under `tools/comfyui/workflows/` and concise
  operator guidance plus a deterministic structural validator under
  `tools/comfyui/`.
- Base the Qwen graph on the current official ComfyUI Qwen Image Edit 2511
  workflow structure rather than inventing sampler/model wiring from memory.
- Use only model and node classes confirmed by Cortan's live `/models/*` and
  `/object_info` responses.
- Keep every seed fixed in the canonical workflows. A managed run may derive a
  different explicit seed, but review candidates must remain reproducible.
- Corrected SDXL starter:
  - retain `sd_xl_base_1.0.safetensors` and `pixel-art-xl.safetensors` as the
    copied baseline so the alpha fix can be evaluated independently;
  - keep the original 1024-to-128 nearest-exact finish;
  - use BiRefNet's foreground mask directly after thresholding as alpha, with no
    `InvertMask` node or inverse connection;
  - save both the transparent cutout and an explicit foreground-mask QA image;
  - label the workflow as a versioned GamifySurgery copy, not a replacement.
- Qwen incremental editor:
  - use `qwen_image_edit_2511_int8_convrot.safetensors`,
    `qwen_2.5_vl_7b_fp8_scaled.safetensors`, `qwen_image_vae.safetensors`, and
    `Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors`;
  - use the registered Qwen 2511 multi-reference conditioning and the official
    Lightning sampler configuration;
  - expose a current asset plus up to two optional references;
  - apply a separate edit mask after generation so pixels outside the approved
    region come from the source asset rather than the model output;
  - use BiRefNet foreground extraction without inversion, save a transparent
    result, and save the final foreground mask for QA;
  - include notes that room shell, tile, wall, door, and depth geometry stays
    renderer-native and that this graph is for modular raster assets only.
- Do not submit a generation job as part of this milestone. Validation is JSON
  structure, live node/model compatibility, non-overwriting upload, and exact
  read-back comparison.

## Constraints and non-goals

- Graphics pipeline only. Do not change gameplay, room geometry, rendering,
  clinical content, save data, UI, or existing raster assets.
- Do not install, download, update, or remove models or custom nodes.
- Do not use external provider/API nodes or local Codex image generation.
- Do not clear Cortan's queue/history or touch unrelated inputs and outputs.
- Use a unique `GamifySurgery/` output prefix for future executions.
- Preserve all unrelated dirty repository work and the protected diagnostic
  screenshots. Do not stage, commit, push, deploy, or release.
- Treat third-party model licensing/provenance as unresolved until recorded;
  workflow availability is not shipping approval.

## Relevant repository and Cortan state

- Branch `beta` tracks `origin/beta` at `eb57bb0018e449b5ab699cb74abd09180714ba67`
  with extensive unrelated concurrent work in the shared tree.
- There is no existing ComfyUI workflow directory in the repository.
- Cortan is reachable through its full Tailscale MagicDNS hostname over HTTPS
  port 443. The short hostname fails TLS/SNI negotiation.
- Cortan reports ComfyUI 0.34.0, frontend 1.49.6, templates 0.11.48, an RTX
  4070 Ti SUPER with 16 GB VRAM, and an empty queue at inventory time.
- The original saved workflow is 8,915 bytes and uses SDXL Base,
  `pixel-art-xl`, BiRefNet, `ThresholdMask`, `InvertMask`, alpha joining,
  nearest-exact 128x128 scaling, and a randomized seed.
- BiRefNet's live node description says it returns a foreground mask. Native
  pixel sampling of the existing flowerbed output confirms the original inverse
  alpha: background samples are nearly opaque while subject samples are
  transparent.
- The live Qwen node registry exposes `TextEncodeQwenImageEditPlus`,
  `UNETLoader`, `CLIPLoader` with type `qwen_image`, `VAELoader`, and
  `LoraLoaderModelOnly`. The official Qwen 2511 documentation and workflow
  template establish the required model/sampler topology.

## Milestone and ownership

This is one coupled pipeline-authoring milestone for a `terra_worker`. It
requires interpreting an official nested workflow, matching Cortan's quantized
local model names, adding deterministic mask/compositing semantics, and
building structural validation; it is not a mechanical Spark transformation.

Terra owns:

- `tools/comfyui/README.md`;
- `tools/comfyui/validate-workflows.mjs`;
- `tools/comfyui/workflows/GamifySurgery - Pixel Art Sprite Starter v2.json`;
- `tools/comfyui/workflows/GamifySurgery - Incremental Asset Edit Qwen v1.json`;
- implementation evidence and progress updates in this plan.

Sol owns product interpretation, official-source verification, dirty-tree
protection, actual graph/diff review, any correction request, live Cortan model
and node compatibility checks, non-overwriting upload, exact read-back
verification, documentation closure, and final acceptance.

## Acceptance criteria

- The original Cortan `Pixel Art Sprite Starter.json` still exists unchanged.
- Both new workflow files parse and have unique node/link IDs with valid link
  endpoints and registered node types.
- The corrected starter contains no `InvertMask`; its thresholded foreground
  mask feeds alpha directly and also reaches a mask QA output.
- Its seed/control mode is deterministic, its models exist on Cortan, and its
  final image uses `nearest-exact` at 128x128.
- The Qwen workflow uses every installed local Qwen component named above,
  fixed four-step Lightning sampling, the official Qwen edit conditioning
  topology, a current-asset input, optional reference affordances, explicit
  mask-bounded source compositing, direct foreground alpha, result output, and
  foreground-mask QA output.
- No graph depends on unconfirmed external credentials, missing AI-upscaler
  weights, or uninstalled custom nodes.
- Each new remote file is created with overwrite disabled and reads back exactly
  as the canonical repository copy.
- No prompt is queued and no raster output is generated during this milestone.

## Validation

- `node tools/comfyui/validate-workflows.mjs`
- JSON parse and semantic inspection of both canonical workflows.
- Compare every graph node type with Cortan `/object_info`.
- Compare all referenced model files with Cortan `/models/<category>`.
- Confirm remote workflow listing before upload and original file hash/length.
- POST each URL-encoded new workflow path with overwrite disabled.
- GET both uploaded files and compare SHA-256 with the repository copies.
- Re-fetch the original and confirm its pre/post SHA-256 is identical.
- Re-check `/queue` and confirm no running or pending jobs were introduced.
- `git diff --check` and scoped status/diff audit.

## Progress

- [x] Inventory Cortan's runtime, models, nodes, workflow API, and current files.
- [x] Inspect the saved starter and confirm the foreground-alpha defect.
- [x] Review current official Qwen Image Edit 2511 documentation and workflow.
- [x] Delegate and implement the canonical workflow milestone.
- [x] Correct the Qwen source-only baseline, red-channel edit mask, and
  exact-source post-generation composite after Sol graph review.
- [x] Complete Sol graph review, remote upload/read-back verification, and
  graphics handoff.

## Discoveries

- Cortan exposes URL-encoded nested userdata paths such as
  `workflows%2F<name>.json`; unencoded nested paths return 404.
- Manager package-version endpoints return 404, so live node registration is
  the compatibility truth for this milestone.
- The original starter's alpha inversion is not theoretical: the existing
  flowerbed candidate has the corresponding inverted transparency.
- `pixel-art-xl` identifies an SDXL 0.9 training base and the
  `pixelbuildings128` token. This copied baseline remains useful for isolating
  the alpha correction but requires later visual calibration before production.
- Sol graph review found that the inspected red/black Qwen edit mask has opaque
  alpha everywhere, so `LoadImageMask` must use its red channel. The canonical
  Qwen graph is source-only by default: optional reference loaders remain
  disconnected until Sol deliberately wires each enabled reference to both
  Qwen text encoders for a managed multi-reference run.

## Exact next action

At the owner's direction, Sol can open one versioned workflow on Cortan and
manage a controlled visual candidate run. For Qwen, select the current asset,
red-channel white-on-black edit mask, and a prompt that names the exact local
change; connect any enabled reference to the same `image2` or `image3` input on
both conditioning encoders. Review the transparent result and foreground-mask
QA image before accepting any raster. Keep renderer-owned rooms, walls, floors,
doors, depth, collision, and gameplay systems out of this workflow.

## Implementation evidence

- Terra copied the user's saved starter topology into a new v2 UI workflow,
  retaining `sd_xl_base_1.0.safetensors`, `pixel-art-xl.safetensors`, and the
  1024-to-128 nearest-exact finish. The sole alpha semantic correction removes
  `InvertMask`: `ThresholdMask` now feeds `JoinImageWithAlpha.alpha` directly
  and also feeds a dedicated `MaskToImage` QA save.
- Terra adapted the current official Comfy-Org Qwen Image Edit 2511 blueprint
  topology (Qwen text encoders, source normalization, multi-reference latent
  methods, source VAE encoding, ModelSamplingAuraFlow, CFGNorm, and KSampler)
  to Cortan's locally enumerated INT8 model files. The Qwen graph adds the
  Lightning model-only LoRA, a fixed four-step Euler/simple seed, two optional
  reference loaders, an edit-mask-bounded source composite, direct BiRefNet
  foreground alpha, and result/mask QA saves under `GamifySurgery/`.
- `tools/comfyui/validate-workflows.mjs` is an offline deterministic validator.
  It checks parseability, unique IDs, bidirectional links and slot types,
  permitted Cortan node types, exact models, seed controls, direct alpha,
  output prefixes, Qwen mask compositing, and starter/Qwen distinction.
- Validation completed: `node tools/comfyui/validate-workflows.mjs` passed.
  A read-only comparison against Cortan's live `/object_info` found all 26
  workflow node types registered (`MISSING=[]`, `STATUS=PASS`). Scoped
  `git diff --check -- tools/comfyui docs/execplans/build-cortan-graphics-workflows.md`
  passed.
- No remote workflow, model, queue, or output was created or changed by Terra.
- Correction pass: Qwen compositing now uses the exact original `LoadImage`
  current asset as destination, so all non-mask pixels are source pixels by
  graph topology. The normalized source remains exclusively in the two Qwen
  encoders and source VAE latent path. The validator now asserts the red mask
  channel, disconnected baseline references, source-only encoder inputs, an
  empty official negative prompt, and the complete model/source chain.
- Correction validation completed: `node tools/comfyui/validate-workflows.mjs`
  again reported `Validated 2 ComfyUI workflows: graph links, models,
  deterministic seeds, alpha semantics, output QA, and workflow distinction.`
  Scoped `git diff --check` passed and a common mojibake-pattern scan of the
  owned files returned no matches.
- Sol independently inspected both canonical JSON graphs and validator, then
  reran the offline validator successfully. A fresh comparison against Cortan's
  live `/object_info` and relevant `/models/<category>` endpoints found all 26
  used node types and every named checkpoint, LoRA, UNet, text encoder, VAE,
  and background-removal model present.
- Immediately before upload, both versioned remote paths returned 404, the
  queue was empty, and the original 8,915-byte starter hashed to
  `7558BA7927E7F9AEBFB3D73BF4223220B37E7C431FDEA54A7EA3FD99F3736146`.
  Sol created both new files through the ComfyUI userdata endpoint with
  `overwrite=false` and did not submit a prompt.
- Exact post-upload read-back passed: the 6,327-byte starter v2 matched local
  SHA-256 `1D0A1A257014F6221EE3B539B69C916E53FD01A80CB854C4414AB5C9D1493062`,
  and the 11,190-byte Qwen editor matched local SHA-256
  `06C31240C30A4347942C53571E9057A6B55F265016AF52EA6E56C7354DE34A47`.
  Cortan listed exactly those two versioned workflows plus the original; the
  original hash was unchanged and `/queue` still reported no running or
  pending jobs.
