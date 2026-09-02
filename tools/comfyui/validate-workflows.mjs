import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workflowDirectory = resolve('tools/comfyui/workflows');
const starterPath = resolve(workflowDirectory, 'GamifySurgery - Pixel Art Sprite Starter v2.json');
const qwenPath = resolve(workflowDirectory, 'GamifySurgery - Incremental Asset Edit Qwen v1.json');

const knownNodeTypes = new Set([
  'CheckpointLoaderSimple', 'LoraLoader', 'CLIPTextEncode', 'EmptyLatentImage',
  'KSampler', 'VAEDecode', 'LoadBackgroundRemovalModel', 'RemoveBackground',
  'ThresholdMask', 'MaskToImage', 'JoinImageWithAlpha', 'ImageScale', 'SaveImage',
  'LoadImage', 'LoadImageMask', 'UNETLoader',
  'LoraLoaderModelOnly', 'ModelSamplingAuraFlow', 'CFGNorm', 'CLIPLoader',
  'VAELoader', 'TextEncodeQwenImageEditPlus',
  'FluxKontextMultiReferenceLatentMethod', 'FluxKontextImageScale',
  'VAEEncode', 'ImageCompositeMasked',
]);

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const readWorkflow = (path) => JSON.parse(readFileSync(path, 'utf8'));
const nodeByType = (graph, type) => graph.nodes.filter((node) => node.type === type);
const onlyNode = (graph, type) => {
  const nodes = nodeByType(graph, type);
  assert(nodes.length === 1, `${graph.__name}: expected exactly one ${type}, found ${nodes.length}`);
  return nodes[0];
};
const input = (node, name) => node.inputs?.find((entry) => entry.name === name);
const output = (node, slot) => node.outputs?.[slot];
const linkById = (graph, id) => graph.links.find((link) => link[0] === id);
const sourceFor = (graph, targetNode, inputName) => {
  const target = input(targetNode, inputName);
  assert(target?.link != null, `${graph.__name}: ${targetNode.type}.${inputName} is not linked`);
  const link = linkById(graph, target.link);
  assert(link, `${graph.__name}: missing link ${target.link}`);
  return graph.nodes.find((node) => node.id === link[1]);
};
const nodeWithTitle = (graph, title) => {
  const node = graph.nodes.find((entry) => entry.title === title);
  assert(node, `${graph.__name}: missing node titled ${title}`);
  return node;
};
const isDirectLink = (graph, source, sourceSlot, target, targetInput) => {
  const targetEntry = input(target, targetInput);
  const link = targetEntry?.link == null ? undefined : linkById(graph, targetEntry.link);
  return link?.[1] === source.id && link?.[2] === sourceSlot;
};

function validateGraph(graph, name) {
  graph.__name = name;
  assert(Array.isArray(graph.nodes) && Array.isArray(graph.links), `${name}: missing nodes or links`);
  const ids = graph.nodes.map((node) => node.id);
  assert(new Set(ids).size === ids.length, `${name}: duplicate node IDs`);
  const linkIds = graph.links.map((link) => link[0]);
  assert(new Set(linkIds).size === linkIds.length, `${name}: duplicate link IDs`);
  assert(graph.last_node_id >= Math.max(...ids), `${name}: last_node_id is too small`);
  assert(graph.last_link_id >= Math.max(...linkIds), `${name}: last_link_id is too small`);

  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const node of graph.nodes) {
    assert(knownNodeTypes.has(node.type), `${name}: unregistered or unexpected node type ${node.type}`);
  }
  for (const link of graph.links) {
    assert(Array.isArray(link) && link.length === 6, `${name}: malformed link ${JSON.stringify(link)}`);
    const [id, sourceId, sourceSlot, targetId, targetSlot, type] = link;
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);
    assert(source && target, `${name}: link ${id} has a missing endpoint`);
    const sourceOutput = output(source, sourceSlot);
    const targetInput = target.inputs?.[targetSlot];
    assert(sourceOutput && targetInput, `${name}: link ${id} has an invalid slot`);
    assert(sourceOutput.links?.includes(id), `${name}: source output for link ${id} does not list it`);
    assert(targetInput.link === id, `${name}: target input for link ${id} does not reference it`);
    assert(sourceOutput.type === type, `${name}: source type mismatch on link ${id}`);
    assert(targetInput.type === type, `${name}: target type mismatch on link ${id}`);
  }
}

function validateStarter(graph) {
  const checkpoint = onlyNode(graph, 'CheckpointLoaderSimple');
  const lora = onlyNode(graph, 'LoraLoader');
  const sampler = onlyNode(graph, 'KSampler');
  const threshold = onlyNode(graph, 'ThresholdMask');
  const alphaJoin = onlyNode(graph, 'JoinImageWithAlpha');
  const scale = onlyNode(graph, 'ImageScale');
  const maskToImage = onlyNode(graph, 'MaskToImage');
  const saves = nodeByType(graph, 'SaveImage');

  assert(nodeByType(graph, 'InvertMask').length === 0, 'starter: foreground alpha must not be inverted');
  assert(checkpoint.widgets_values?.[0] === 'sd_xl_base_1.0.safetensors', 'starter: wrong checkpoint');
  assert(lora.widgets_values?.[0] === 'pixel-art-xl.safetensors', 'starter: wrong LoRA');
  assert(sampler.widgets_values?.[0] === 8675309 && sampler.widgets_values?.[1] === 'fixed', 'starter: seed is not fixed');
  assert(scale.widgets_values?.join('|') === 'nearest-exact|128|128|disabled', 'starter: expected 128px nearest-exact finish');
  assert(isDirectLink(graph, threshold, 0, alphaJoin, 'alpha'), 'starter: thresholded foreground must feed alpha directly');
  assert(isDirectLink(graph, threshold, 0, maskToImage, 'mask'), 'starter: thresholded foreground must feed mask QA');
  assert(saves.length === 2, 'starter: expected transparent result and mask QA outputs');
  assert(saves.some((node) => node.widgets_values?.[0] === 'GamifySurgery/pixel_art_sprite_starter_v2/result'), 'starter: missing result prefix');
  assert(saves.some((node) => node.widgets_values?.[0] === 'GamifySurgery/pixel_art_sprite_starter_v2/foreground_mask_qa'), 'starter: missing mask QA prefix');
}

function validateQwen(graph) {
  const unet = onlyNode(graph, 'UNETLoader');
  const clip = onlyNode(graph, 'CLIPLoader');
  const vae = onlyNode(graph, 'VAELoader');
  const lora = onlyNode(graph, 'LoraLoaderModelOnly');
  const sampler = onlyNode(graph, 'KSampler');
  const source = onlyNode(graph, 'FluxKontextImageScale');
  const composite = onlyNode(graph, 'ImageCompositeMasked');
  const editMask = onlyNode(graph, 'LoadImageMask');
  const threshold = onlyNode(graph, 'ThresholdMask');
  const alphaJoin = onlyNode(graph, 'JoinImageWithAlpha');
  const maskToImage = onlyNode(graph, 'MaskToImage');
  const qwenEncoders = nodeByType(graph, 'TextEncodeQwenImageEditPlus');
  const referenceMethods = nodeByType(graph, 'FluxKontextMultiReferenceLatentMethod');
  const saves = nodeByType(graph, 'SaveImage');
  const currentAsset = nodeWithTitle(graph, 'Current asset (required)');
  const references = graph.nodes.filter((node) => node.title?.includes('managed multi-reference only'));
  const negative = nodeWithTitle(graph, 'Qwen negative conditioning (source-only baseline)');
  const positive = nodeWithTitle(graph, 'Qwen positive conditioning (source-only baseline)');

  assert(unet.widgets_values?.[0] === 'qwen_image_edit_2511_int8_convrot.safetensors', 'qwen: wrong UNet');
  assert(clip.widgets_values?.[0] === 'qwen_2.5_vl_7b_fp8_scaled.safetensors' && clip.widgets_values?.[1] === 'qwen_image', 'qwen: wrong CLIP setup');
  assert(vae.widgets_values?.[0] === 'qwen_image_vae.safetensors', 'qwen: wrong VAE');
  assert(lora.widgets_values?.[0] === 'Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors', 'qwen: wrong Lightning LoRA');
  assert(sampler.widgets_values?.join('|') === '424242|fixed|4|1|euler|simple|1', 'qwen: expected fixed four-step Lightning sampler');
  assert(qwenEncoders.length === 2 && referenceMethods.length === 2, 'qwen: missing official multi-reference conditioning topology');
  assert(nodeByType(graph, 'LoadImage').length === 3, 'qwen: expected current asset plus two reference affordances');
  assert(references.length === 2, 'qwen: expected two optional managed reference loaders');
  assert(references.every((node) => node.outputs?.every((entry) => !entry.links?.length)), 'qwen: baseline optional references must be disconnected');
  assert(!graph.links.some((link) => references.some((node) => link[1] === node.id)), 'qwen: baseline optional references must not have outgoing links');
  assert(sourceFor(graph, composite, 'destination') === currentAsset, 'qwen: composite destination must be the original current asset');
  assert(sourceFor(graph, composite, 'source').type === 'VAEDecode', 'qwen: composite source must be generated output');
  assert(isDirectLink(graph, editMask, 0, composite, 'mask'), 'qwen: edit mask must bound post-generation composite');
  assert(editMask.widgets_values?.[1] === 'red', 'qwen: edit mask must use the red channel');
  assert(sourceFor(graph, negative, 'image1') === source && sourceFor(graph, positive, 'image1') === source, 'qwen: both conditioning encoders must use normalized source image1');
  assert(!input(negative, 'image2') && !input(negative, 'image3') && !input(positive, 'image2') && !input(positive, 'image3'), 'qwen: baseline conditioning must be source-only');
  assert(negative.widgets_values?.[0] === '', 'qwen: official baseline negative prompt must be empty');
  assert(sourceFor(graph, onlyNode(graph, 'VAEEncode'), 'pixels') === source, 'qwen: source normalization must feed source latent');
  assert(sourceFor(graph, lora, 'model') === unet, 'qwen: Lightning LoRA must follow Qwen UNet');
  assert(sourceFor(graph, onlyNode(graph, 'ModelSamplingAuraFlow'), 'model') === lora, 'qwen: official sampling shift must follow Lightning LoRA');
  assert(sourceFor(graph, onlyNode(graph, 'CFGNorm'), 'model').type === 'ModelSamplingAuraFlow', 'qwen: CFGNorm must follow official sampling shift');
  assert(nodeByType(graph, 'InvertMask').length === 0, 'qwen: foreground alpha must not be inverted');
  assert(isDirectLink(graph, threshold, 0, alphaJoin, 'alpha'), 'qwen: thresholded foreground must feed alpha directly');
  assert(isDirectLink(graph, threshold, 0, maskToImage, 'mask'), 'qwen: thresholded foreground must feed mask QA');
  assert(saves.length === 2, 'qwen: expected transparent result and mask QA outputs');
  assert(saves.some((node) => node.widgets_values?.[0] === 'GamifySurgery/qwen_incremental_asset_edit_v1/result'), 'qwen: missing result prefix');
  assert(saves.some((node) => node.widgets_values?.[0] === 'GamifySurgery/qwen_incremental_asset_edit_v1/foreground_mask_qa'), 'qwen: missing mask QA prefix');
}

const starter = readWorkflow(starterPath);
const qwen = readWorkflow(qwenPath);
validateGraph(starter, 'starter');
validateGraph(qwen, 'qwen');
validateStarter(starter);
validateQwen(qwen);
assert(starter.nodes.some((node) => node.type === 'CheckpointLoaderSimple'), 'workflows: starter identity missing');
assert(qwen.nodes.some((node) => node.type === 'TextEncodeQwenImageEditPlus'), 'workflows: qwen identity missing');
console.log('Validated 2 ComfyUI workflows: graph links, models, deterministic seeds, alpha semantics, output QA, and workflow distinction.');
