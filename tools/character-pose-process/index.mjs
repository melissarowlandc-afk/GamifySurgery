import { createHash } from 'node:crypto';
import {
  closeSync, existsSync, fsyncSync, openSync, readFileSync, renameSync,
  unlinkSync, writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';

export const CANVAS = Object.freeze({ width: 448, height: 1024 });
export const ROUNDING = 'floor(value+0.5)';
export const SCHEMA_SHA256 = '3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a';
export const ALLOWED_CLASSES = Object.freeze([
  'EmptyImage', 'SolidMask', 'LayersFromBoundingBoxes', 'AddLayer',
  'ImageCompositor', 'MaskToImage', 'SaveImage',
]);
const OUTPUT_ROOT = 'synthetic/pose-process-proof-v1/';
const SHA_RE = /^[a-f0-9]{64}$/;
const ID_RE = /^[a-z][a-z0-9-]{0,63}$/;
const PRIVATE_RE = /(^|[\\/:])(resident|private)([\\/:]|$)|^[a-z]:[\\/]|^file:/i;
const SOCKET_TYPES = new Set(['IMAGE', 'MASK', 'LAYERS', 'LATENT', 'CONDITIONING', 'MODEL', 'CLIP', 'VAE']);

export const roundPlacement = value => Math.floor(value + 0.5);
export const sha256 = value => createHash('sha256').update(value).digest('hex');

function plain(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function exactKeys(object, allowed, label) {
  if (!plain(object)) throw new Error(`${label} must be an object`);
  const extra = Object.keys(object).filter(key => !allowed.includes(key));
  if (extra.length) throw new Error(`${label} has unknown field(s): ${extra.join(', ')}`);
}

function finite(value, label) {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
}

function integer(value, label, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${label} must be an integer in ${min}..${max}`);
  return value;
}

function nonempty(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a nonempty string`);
  return value;
}

function id(value, label) {
  if (typeof value !== 'string' || !ID_RE.test(value)) throw new Error(`${label} must match ${ID_RE}`);
  return value;
}

function point(value, label) {
  exactKeys(value, ['x', 'y'], label);
  finite(value.x, `${label}.x`); finite(value.y, `${label}.y`);
  return value;
}

function rejectPrivate(value, trail = 'recipe') {
  if (typeof value === 'string' && PRIVATE_RE.test(value)) throw new Error(`private/resident reference prohibited at ${trail}`);
  if (Array.isArray(value)) value.forEach((entry, index) => rejectPrivate(entry, `${trail}[${index}]`));
  else if (plain(value)) for (const [key, entry] of Object.entries(value)) {
    if (/resident|private|image(path|ref)|file(path|ref)/i.test(key)) throw new Error(`private/resident field prohibited at ${trail}.${key}`);
    rejectPrivate(entry, `${trail}.${key}`);
  }
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (plain(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
  if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('canonical JSON cannot contain non-finite numbers');
  return value;
}

export function canonicalJson(value) { return JSON.stringify(canonicalize(value)); }
export function numericDefinitionHash(definition) { return sha256(canonicalJson(definition)); }

function validatePrimitive(primitive, dimensions, label) {
  exactKeys(primitive, ['id', 'shape', 'x', 'y', 'width', 'height', 'color', 'transparency'], label);
  id(primitive.id, `${label}.id`);
  if (primitive.shape !== 'rectangle') throw new Error(`${label}.shape must be rectangle`);
  integer(primitive.x, `${label}.x`, 0, dimensions.width - 1);
  integer(primitive.y, `${label}.y`, 0, dimensions.height - 1);
  integer(primitive.width, `${label}.width`, 1, dimensions.width);
  integer(primitive.height, `${label}.height`, 1, dimensions.height);
  if (primitive.x + primitive.width > dimensions.width || primitive.y + primitive.height > dimensions.height) throw new Error(`${label} exceeds source dimensions`);
  integer(primitive.color, `${label}.color`, 0, 16777215);
  finite(primitive.transparency, `${label}.transparency`);
  if (primitive.transparency < 0 || primitive.transparency > 1) throw new Error(`${label}.transparency must be 0..1`);
}

function rotatePointAround(pointValue, center, degrees) {
  const radians = degrees * Math.PI / 180;
  const dx = pointValue.x - center.x;
  const dy = pointValue.y - center.y;
  return {
    x: center.x + Math.cos(radians) * dx - Math.sin(radians) * dy,
    y: center.y + Math.sin(radians) * dx + Math.cos(radians) * dy,
  };
}

export function deriveTransform(piece, target) {
  const restLength = Math.hypot(piece.restVector.x, piece.restVector.y);
  const targetVector = { x: target.distal.x - target.proximal.x, y: target.distal.y - target.proximal.y };
  const targetLength = Math.hypot(targetVector.x, targetVector.y);
  if (restLength <= 0 || targetLength <= 0) throw new Error(`piece ${piece.id} vectors must be nonzero`);
  if (Math.abs(restLength - targetLength) > 1e-6) throw new Error(`piece ${piece.id} target changes segment length; M1 does not rescale`);
  const rotationDegrees = (Math.atan2(targetVector.y, targetVector.x) - Math.atan2(piece.restVector.y, piece.restVector.x)) * 180 / Math.PI;
  const center = { x: piece.crop.width / 2, y: piece.crop.height / 2 };
  const rotatedPivot = rotatePointAround(piece.pivot, center, rotationDegrees);
  return {
    pivotTarget: { ...target.proximal }, rotationDegrees,
    placement: { x: target.proximal.x - rotatedPivot.x, y: target.proximal.y - rotatedPivot.y },
  };
}

function closeNumber(actual, expected, label) {
  if (Math.abs(actual - expected) > 1e-6) throw new Error(`${label} is inconsistent: ${actual} != ${expected}`);
}

export function validateRecipe(recipe, { schemaFileSha256 } = {}) {
  exactKeys(recipe, ['schemaVersion', 'mode', 'schemaEvidence', 'canvas', 'coordinateSystem', 'rounding', 'output', 'pieces', 'targets', 'assertionModel'], 'recipe');
  if (recipe.schemaVersion !== 1 || recipe.mode !== 'procedural-only') throw new Error('recipe must be schemaVersion 1 procedural-only');
  rejectPrivate(recipe);
  exactKeys(recipe.schemaEvidence, ['sha256', 'kind'], 'recipe.schemaEvidence');
  if (recipe.schemaEvidence.kind !== 'captured-object-info-bytes-sha256' || recipe.schemaEvidence.sha256 !== SCHEMA_SHA256) throw new Error('unexpected captured schema evidence');
  if (schemaFileSha256 && recipe.schemaEvidence.sha256 !== schemaFileSha256) throw new Error('captured schema byte hash mismatch');
  exactKeys(recipe.canvas, ['width', 'height'], 'recipe.canvas');
  if (recipe.canvas.width !== CANVAS.width || recipe.canvas.height !== CANVAS.height) throw new Error('fixed 448x1024 canvas required');
  exactKeys(recipe.coordinateSystem, ['origin', 'xAxis', 'yAxis', 'coordinates', 'bounds'], 'recipe.coordinateSystem');
  if (recipe.coordinateSystem.origin !== 'top-left-canvas-edge' || recipe.coordinateSystem.xAxis !== 'right' || recipe.coordinateSystem.yAxis !== 'down' || recipe.coordinateSystem.coordinates !== 'continuous-pixels' || recipe.coordinateSystem.bounds !== 'max-exclusive') throw new Error('unsupported coordinate system');
  if (recipe.rounding !== ROUNDING) throw new Error(`rounding must be ${ROUNDING}`);
  exactKeys(recipe.output, ['compositePrefix', 'transparencyPrefix'], 'recipe.output');
  for (const [key, value] of Object.entries(recipe.output)) if (typeof value !== 'string' || !value.startsWith(OUTPUT_ROOT) || !/^synthetic\/pose-process-proof-v1\/[a-z0-9][a-z0-9_-]*$/.test(value)) throw new Error(`unsafe ${key}`);
  if (recipe.output.compositePrefix === recipe.output.transparencyPrefix) throw new Error('output prefixes must be distinct');
  if (!Array.isArray(recipe.pieces) || recipe.pieces.length < 1) throw new Error('pieces must be nonempty');
  if (!Array.isArray(recipe.targets) || recipe.targets.length < 1) throw new Error('targets must be nonempty');
  const pieceIds = new Set();
  for (const [index, piece] of recipe.pieces.entries()) {
    const label = `recipe.pieces[${index}]`;
    exactKeys(piece, ['id', 'source', 'sourceHash', 'sourceHashKind', 'crop', 'pivot', 'restVector', 'sourceOffset', 'overlap', 'anatomy', 'layerOrder'], label);
    id(piece.id, `${label}.id`); if (pieceIds.has(piece.id)) throw new Error(`duplicate piece id ${piece.id}`); pieceIds.add(piece.id);
    exactKeys(piece.source, ['kind', 'dimensions', 'primitives'], `${label}.source`);
    if (piece.source.kind !== 'synthetic-numeric-definition') throw new Error(`${label}.source.kind must be synthetic-numeric-definition`);
    exactKeys(piece.source.dimensions, ['width', 'height'], `${label}.source.dimensions`);
    integer(piece.source.dimensions.width, `${label}.source.dimensions.width`, 1, 16384);
    integer(piece.source.dimensions.height, `${label}.source.dimensions.height`, 1, 16384);
    if (!Array.isArray(piece.source.primitives) || piece.source.primitives.length < 1) throw new Error(`${label}.source.primitives must be nonempty`);
    const primitiveIds = new Set();
    piece.source.primitives.forEach((primitive, primitiveIndex) => {
      validatePrimitive(primitive, piece.source.dimensions, `${label}.source.primitives[${primitiveIndex}]`);
      if (primitiveIds.has(primitive.id)) throw new Error(`${label} has duplicate primitive ${primitive.id}`); primitiveIds.add(primitive.id);
    });
    if (piece.sourceHashKind !== 'canonical-numeric-definition-sha256' || !SHA_RE.test(piece.sourceHash) || piece.sourceHash !== numericDefinitionHash(piece.source)) throw new Error(`${label} numeric source hash mismatch`);
    exactKeys(piece.crop, ['x', 'y', 'width', 'height'], `${label}.crop`);
    integer(piece.crop.x, `${label}.crop.x`, 0); integer(piece.crop.y, `${label}.crop.y`, 0);
    integer(piece.crop.width, `${label}.crop.width`, 1); integer(piece.crop.height, `${label}.crop.height`, 1);
    if (piece.crop.x !== 0 || piece.crop.y !== 0 || piece.crop.width !== piece.source.dimensions.width || piece.crop.height !== piece.source.dimensions.height) throw new Error(`${label}.crop must be the full procedural source in M1`);
    point(piece.pivot, `${label}.pivot`); point(piece.restVector, `${label}.restVector`); point(piece.sourceOffset, `${label}.sourceOffset`);
    if (piece.sourceOffset.x !== 0 || piece.sourceOffset.y !== 0) throw new Error(`${label}.sourceOffset must be exactly zero in procedural M1`);
    if (piece.pivot.x < 0 || piece.pivot.x > piece.crop.width || piece.pivot.y < 0 || piece.pivot.y > piece.crop.height) throw new Error(`${label}.pivot outside crop`);
    exactKeys(piece.overlap, ['proximalPixels', 'distalPixels'], `${label}.overlap`);
    integer(piece.overlap.proximalPixels, `${label}.overlap.proximalPixels`, 0, Math.max(piece.crop.width, piece.crop.height));
    integer(piece.overlap.distalPixels, `${label}.overlap.distalPixels`, 0, Math.max(piece.crop.width, piece.crop.height));
    exactKeys(piece.anatomy, ['side', 'part', 'lineage'], `${label}.anatomy`);
    if (!['none', 'left', 'right'].includes(piece.anatomy.side)) throw new Error(`${label}.anatomy.side invalid`);
    nonempty(piece.anatomy.part, `${label}.anatomy.part`); if (piece.anatomy.lineage !== 'synthetic-fixture') throw new Error(`${label}.anatomy.lineage invalid`);
    integer(piece.layerOrder, `${label}.layerOrder`, -500, 500);
  }
  const targetIds = new Set();
  for (const [index, target] of recipe.targets.entries()) {
    const label = `recipe.targets[${index}]`;
    exactKeys(target, ['id', 'pieceId', 'phaseRecord', 'probeCase', 'proximal', 'distal', 'directTransform'], label);
    id(target.id, `${label}.id`); if (targetIds.has(target.id)) throw new Error(`duplicate target id ${target.id}`); targetIds.add(target.id);
    if (!pieceIds.has(target.pieceId)) throw new Error(`${label}.pieceId is unknown`);
    point(target.proximal, `${label}.proximal`); point(target.distal, `${label}.distal`);
    exactKeys(target.phaseRecord, ['view', 'phaseId', 'phaseIndex', 'normalizedCycle', 'outputKey'], `${label}.phaseRecord`);
    if (target.phaseRecord.view !== 'synthetic') throw new Error(`${label}.phaseRecord.view must be synthetic in M1`);
    integer(target.phaseRecord.phaseIndex, `${label}.phaseRecord.phaseIndex`, 1, 8);
    finite(target.phaseRecord.normalizedCycle, `${label}.phaseRecord.normalizedCycle`);
    if (target.phaseRecord.normalizedCycle < 0 || target.phaseRecord.normalizedCycle >= 1) throw new Error(`${label}.phaseRecord.normalizedCycle must be [0,1)`);
    if (!['control', 'positive-rotation', 'negative-rotation', 'signed-clipping', 'noncentral-pivot', 'alpha-opaque', 'alpha-transparent'].includes(target.probeCase)) throw new Error(`${label}.probeCase invalid`);
    const expectedPhaseId = String(target.phaseRecord.phaseIndex).padStart(2, '0');
    if (target.phaseRecord.phaseId !== expectedPhaseId) throw new Error(`${label}.phaseRecord.phaseId/index mismatch`);
    closeNumber(target.phaseRecord.normalizedCycle, (target.phaseRecord.phaseIndex - 1) / 8, `${label}.phaseRecord.normalizedCycle`);
    if (target.phaseRecord.outputKey !== `synthetic:${target.probeCase}`) throw new Error(`${label}.phaseRecord.outputKey/probeCase mismatch`);
    exactKeys(target.directTransform, ['pivotTarget', 'rotationDegrees', 'placement'], `${label}.directTransform`);
    point(target.directTransform.pivotTarget, `${label}.directTransform.pivotTarget`); point(target.directTransform.placement, `${label}.directTransform.placement`);
    finite(target.directTransform.rotationDegrees, `${label}.directTransform.rotationDegrees`);
    const piece = recipe.pieces.find(candidate => candidate.id === target.pieceId); const derived = deriveTransform(piece, target);
    closeNumber(target.directTransform.pivotTarget.x, derived.pivotTarget.x, `${label}.directTransform.pivotTarget.x`);
    closeNumber(target.directTransform.pivotTarget.y, derived.pivotTarget.y, `${label}.directTransform.pivotTarget.y`);
    closeNumber(target.directTransform.rotationDegrees, derived.rotationDegrees, `${label}.directTransform.rotationDegrees`);
    closeNumber(target.directTransform.placement.x, derived.placement.x, `${label}.directTransform.placement.x`);
    closeNumber(target.directTransform.placement.y, derived.placement.y, `${label}.directTransform.placement.y`);
  }
  if (new Set(recipe.targets.map(target => target.probeCase)).size < 7) throw new Error('all seven procedural probe cases are required');
  exactKeys(recipe.assertionModel, ['measuredFacts', 'hypotheses', 'requiredM2Observations'], 'recipe.assertionModel');
  for (const key of ['measuredFacts', 'hypotheses', 'requiredM2Observations']) if (!Array.isArray(recipe.assertionModel[key]) || recipe.assertionModel[key].some(value => typeof value !== 'string' || !value)) throw new Error(`assertionModel.${key} must be nonempty strings`);
  return true;
}

function nextId(state) { return String(state.next++); }
function addNode(state, classType, inputs) { const nodeId = nextId(state); state.graph[nodeId] = { class_type: classType, inputs }; return nodeId; }

function transparentLayers(state, width, height, name) {
  const image = addNode(state, 'EmptyImage', { width: 1, height: 1, batch_size: 1, color: 0 });
  const mask = addNode(state, 'SolidMask', { value: 1, width: 1, height: 1 });
  return addNode(state, 'LayersFromBoundingBoxes', {
    image: [image, 0], bboxes: JSON.stringify([{ bbox: [0, 0, 1, 1], metadata: { name, z_index: -1000 } }]),
    mask: [mask, 0], crop_to_content: false, canvas_width: width, canvas_height: height,
  });
}

function buildProceduralPiece(state, piece) {
  let layers = transparentLayers(state, piece.crop.width, piece.crop.height, `${piece.id}-transparent-base`);
  for (const [index, primitive] of piece.source.primitives.entries()) {
    const image = addNode(state, 'EmptyImage', { width: primitive.width, height: primitive.height, batch_size: 1, color: primitive.color });
    const mask = addNode(state, 'SolidMask', { value: primitive.transparency, width: primitive.width, height: primitive.height });
    layers = addNode(state, 'AddLayer', {
      image: [image, 0], layers: [layers, 0], mask: [mask, 0], name: `${piece.id}-${primitive.id}`,
      x: primitive.x, y: primitive.y, opacity: 1, blend_mode: 'normal', rotation: 0,
      width: 0, height: 0, z_index: index, flip_h: false, flip_v: false,
    });
  }
  return addNode(state, 'ImageCompositor', { layers: [layers, 0], compositor: {} });
}

function schemaMap(captured) { return captured?.schemas ?? captured; }

export function emitProceduralGraph(recipe, capturedSchema, options = {}) {
  validateRecipe(recipe, options);
  const schemas = schemaMap(capturedSchema);
  for (const classType of ALLOWED_CLASSES) if (!schemas?.[classType]) throw new Error(`captured schema lacks ${classType}`);
  const state = { graph: {}, next: 1 }; let documentLayers = transparentLayers(state, CANVAS.width, CANVAS.height, 'fixed-transparent-document');
  const transforms = [];
  for (const target of recipe.targets) {
    const piece = recipe.pieces.find(candidate => candidate.id === target.pieceId); const sourceComposite = buildProceduralPiece(state, piece); const derived = deriveTransform(piece, target);
    const quantized = { x: roundPlacement(derived.placement.x), y: roundPlacement(derived.placement.y) };
    documentLayers = addNode(state, 'AddLayer', {
      image: [sourceComposite, 0], layers: [documentLayers, 0], mask: [sourceComposite, 1], name: target.id,
      x: quantized.x, y: quantized.y, opacity: 1, blend_mode: 'normal', rotation: derived.rotationDegrees,
      width: 0, height: 0, z_index: piece.layerOrder, flip_h: false, flip_v: false,
    });
    transforms.push({ targetId: target.id, pieceId: piece.id, probeCase: target.probeCase, sourceHash: piece.sourceHash, sourceHashKind: piece.sourceHashKind, proximal: target.proximal, distal: target.distal, pivot: piece.pivot, restVector: piece.restVector, sourceOffset: piece.sourceOffset, overlap: piece.overlap, anatomy: piece.anatomy, floatTransform: derived, quantizedPlacement: quantized, layerOrder: piece.layerOrder });
  }
  const compositor = addNode(state, 'ImageCompositor', { layers: [documentLayers, 0], compositor: {} });
  const maskImage = addNode(state, 'MaskToImage', { mask: [compositor, 1] });
  const saveComposite = addNode(state, 'SaveImage', { images: [compositor, 0], filename_prefix: recipe.output.compositePrefix });
  const saveTransparency = addNode(state, 'SaveImage', { images: [maskImage, 0], filename_prefix: recipe.output.transparencyPrefix });
  validateGraph(state.graph, capturedSchema);
  return { schemaVersion: 1, state: 'unexecuted-proposal', mode: 'procedural-only', schemaEvidence: recipe.schemaEvidence, canvas: CANVAS, coordinateSystem: recipe.coordinateSystem, rounding: ROUNDING, graph: state.graph,
    outputs: [{ nodeId: saveComposite, socket: 0, role: 'composite-image', filenamePrefix: recipe.output.compositePrefix }, { nodeId: saveTransparency, socket: 0, role: 'transparency-mask-as-image', filenamePrefix: recipe.output.transparencyPrefix }],
    compositorOutputs: { nodeId: compositor, imageSocket: 0, transparencyMaskSocket: 1, maskConvention: '1=transparent' }, transforms, assertionModel: recipe.assertionModel };
}

function schemaInput(schema, key) { return schema.input?.required?.[key] ?? schema.input?.optional?.[key]; }
function validateLiteral(value, declaration, label) {
  const [type, constraints = {}] = declaration;
  if (SOCKET_TYPES.has(type)) throw new Error(`${label} requires a graph socket reference of type ${type}`);
  if (type === 'INT') integer(value, label, constraints.min ?? Number.MIN_SAFE_INTEGER, constraints.max ?? Number.MAX_SAFE_INTEGER);
  else if (type === 'FLOAT') { finite(value, label); if ((constraints.min !== undefined && value < constraints.min) || (constraints.max !== undefined && value > constraints.max)) throw new Error(`${label} outside schema range`); }
  else if (type === 'BOOLEAN' && typeof value !== 'boolean') throw new Error(`${label} must be boolean`);
  else if (type === 'STRING' && typeof value !== 'string') throw new Error(`${label} must be string`);
  else if (type === 'COMBO') { if (!(constraints.options ?? []).includes(value)) throw new Error(`${label} is not a schema option`); }
  else if (type === 'COMPOSITOR' && !plain(value)) throw new Error(`${label} must be an object`);
  else if (type === 'BOUNDING_BOX,ARRAY,STRING' && typeof value !== 'string') throw new Error(`${label} must be serialized bounding boxes`);
}

export function validateGraph(graph, capturedSchema) {
  if (!plain(graph) || !Object.keys(graph).length) throw new Error('graph must be nonempty');
  rejectPrivate(graph, 'graph');
  const schemas = schemaMap(capturedSchema); const ids = new Set(Object.keys(graph));
  const documentBases = [];
  for (const [nodeId, node] of Object.entries(graph)) {
    if (!/^\d+$/.test(nodeId)) throw new Error(`invalid graph node id ${nodeId}`);
    exactKeys(node, ['class_type', 'inputs'], `graph.${nodeId}`);
    if (!ALLOWED_CLASSES.includes(node.class_type)) throw new Error(`class ${node.class_type} is not whitelisted`);
    const schema = schemas[node.class_type]; if (!schema) throw new Error(`missing schema for ${node.class_type}`);
    exactKeys(node.inputs, [...Object.keys(schema.input?.required ?? {}), ...Object.keys(schema.input?.optional ?? {})], `graph.${nodeId}.inputs`);
    for (const key of Object.keys(schema.input?.required ?? {})) if (!(key in node.inputs)) throw new Error(`graph.${nodeId} missing required input ${key}`);
    for (const [key, value] of Object.entries(node.inputs)) {
      const declaration = schemaInput(schema, key);
      if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'string' && Number.isInteger(value[1])) {
        if (!ids.has(value[0])) throw new Error(`graph.${nodeId}.${key} references unknown node ${value[0]}`);
        const sourceSchema = schemas[graph[value[0]].class_type]; const outputType = sourceSchema.output?.[value[1]];
        if (!outputType) throw new Error(`graph.${nodeId}.${key} references invalid socket`);
        if (declaration[0] !== outputType) throw new Error(`graph.${nodeId}.${key} socket type ${outputType} does not match ${declaration[0]}`);
      } else validateLiteral(value, declaration, `graph.${nodeId}.${key}`);
    }
    if (node.class_type === 'EmptyImage' && node.inputs.batch_size !== 1) throw new Error(`graph.${nodeId} procedural EmptyImage batch_size must be 1`);
    if (node.class_type === 'LayersFromBoundingBoxes') {
      let boxes; try { boxes = JSON.parse(node.inputs.bboxes); } catch { throw new Error(`graph.${nodeId}.bboxes must be valid JSON`); }
      if (!Array.isArray(boxes) || boxes.length !== 1 || !plain(boxes[0])) throw new Error(`graph.${nodeId}.bboxes must contain exactly one object`);
      exactKeys(boxes[0], ['bbox', 'metadata'], `graph.${nodeId}.bboxes[0]`); exactKeys(boxes[0].metadata, ['name', 'z_index'], `graph.${nodeId}.bboxes[0].metadata`);
      if (canonicalJson(boxes[0].bbox) !== '[0,0,1,1]' || typeof boxes[0].metadata.name !== 'string' || !boxes[0].metadata.name || boxes[0].metadata.z_index !== -1000) throw new Error(`graph.${nodeId}.bboxes base definition is unsupported`);
      if (node.inputs.crop_to_content !== false || node.inputs.canvas_width < 1 || node.inputs.canvas_height < 1) throw new Error(`graph.${nodeId} must declare a fixed noncropping canvas`);
      if (boxes[0].metadata.name === 'fixed-transparent-document') { documentBases.push(nodeId); if (node.inputs.canvas_width !== CANVAS.width || node.inputs.canvas_height !== CANVAS.height) throw new Error(`graph.${nodeId} document canvas must be 448x1024`); }
      else if (!/^[a-z][a-z0-9-]{0,63}-transparent-base$/.test(boxes[0].metadata.name)) throw new Error(`graph.${nodeId} has unsupported local canvas identity`);
    }
    if (node.class_type === 'AddLayer' && (node.inputs.opacity !== 1 || node.inputs.blend_mode !== 'normal' || node.inputs.width !== 0 || node.inputs.height !== 0 || node.inputs.flip_h !== false || node.inputs.flip_v !== false)) throw new Error(`graph.${nodeId} AddLayer uses unsupported procedural transform fields`);
    if (node.class_type === 'ImageCompositor' && canonicalJson(node.inputs.compositor) !== '{}') throw new Error(`graph.${nodeId}.compositor must be empty in procedural M1`);
    if (node.class_type === 'SaveImage' && (!node.inputs.filename_prefix.startsWith(OUTPUT_ROOT) || !/^synthetic\/pose-process-proof-v1\/[a-z0-9][a-z0-9_-]*$/.test(node.inputs.filename_prefix))) throw new Error(`unsafe SaveImage prefix at node ${nodeId}`);
  }
  if (documentBases.length !== 1) throw new Error('graph must contain exactly one fixed-transparent-document canvas');
  if (Object.values(graph).filter(node => node.class_type === 'SaveImage').length !== 2 || Object.values(graph).filter(node => node.class_type === 'MaskToImage').length !== 1) throw new Error('procedural M1 graph requires exactly two SaveImage nodes and one MaskToImage node');
  const visiting = new Set(), visited = new Set();
  function visit(nodeId) {
    if (visiting.has(nodeId)) throw new Error(`graph dependency cycle at node ${nodeId}`);
    if (visited.has(nodeId)) return;
    visiting.add(nodeId);
    for (const value of Object.values(graph[nodeId].inputs)) if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'string' && Number.isInteger(value[1])) visit(value[0]);
    visiting.delete(nodeId); visited.add(nodeId);
  }
  for (const [nodeId, node] of Object.entries(graph)) if (node.class_type === 'SaveImage') visit(nodeId);
  if (visited.size !== ids.size) throw new Error('graph contains nodes outside declared SaveImage dependency trees');
  return true;
}

const EVENT_TYPES = ['preparation', 'submission', 'execution', 'download', 'review', 'correction', 'proposal'];
const EVENT_STATUSES = ['prepared', 'submitted', 'running', 'succeeded', 'failed', 'rejected', 'reviewed', 'unexecuted'];
const REVIEW_STATES = ['unreviewed', 'candidate', 'accepted', 'held', 'rejected', 'not-produced'];

export function summarizeEvents(events) {
  const measured = { queue: 0, execution: 0, download: 0 }, measuredCounts = { queue: 0, execution: 0, download: 0 };
  let operatorPreparationMs = 0, operatorReviewMs = 0, corrections = 0, reusedPieceUses = 0; const distinctPieces = new Set(), statuses = {};
  for (const event of events) {
    statuses[event.status] = (statuses[event.status] ?? 0) + 1;
    for (const key of Object.keys(measured)) if (event.actualDurationsMs[key] !== null) { measured[key] += event.actualDurationsMs[key]; measuredCounts[key]++; }
    for (const interval of event.operatorIntervals) { const elapsed = Date.parse(interval.endedAt) - Date.parse(interval.startedAt); if (interval.type === 'preparation') operatorPreparationMs += elapsed; else operatorReviewMs += elapsed; }
    if (event.correction) corrections++;
    if (event.type === 'execution' && event.status === 'succeeded') for (const use of event.pieceUse) { distinctPieces.add(`${use.sourceHashKind}:${use.sourceHash}:${use.pieceId}`); if (use.reusedFromEventId) reusedPieceUses += use.useCount; }
  }
  return { eventCount: events.length, statuses, measuredDurationTotalsMs: measured, measuredDurationCounts: measuredCounts, operatorPreparationMs, operatorReviewMs, corrections, distinctPieces: distinctPieces.size, reusedPieceUses };
}

function ledgerHash(ledger) { const copy = { ...ledger }; delete copy.stateSha256; return sha256(canonicalJson(copy)); }
export function emptyLedger() { const ledger = { schemaVersion: 1, revision: 0, events: [], summary: summarizeEvents([]) }; return { ...ledger, stateSha256: ledgerHash(ledger) }; }

function iso(value, label) { nonempty(value, label); const milliseconds = Date.parse(value); if (!Number.isFinite(milliseconds)) throw new Error(`${label} is not an ISO timestamp`); return milliseconds; }
function duration(value, label) { if (value !== null) integer(value, label, 0); }

function validateEvent(event, existing) {
  exactKeys(event, ['id', 'type', 'status', 'jobId', 'occurredAt', 'actualDurationsMs', 'operatorIntervals', 'correction', 'outputs', 'pieceUse', 'notes'], 'event');
  id(event.id, 'event.id'); if (existing.some(candidate => candidate.id === event.id)) throw new Error(`duplicate event id ${event.id}`);
  if (!EVENT_TYPES.includes(event.type)) throw new Error('event.type invalid'); if (!EVENT_STATUSES.includes(event.status)) throw new Error('event.status invalid');
  if (event.jobId !== null) nonempty(event.jobId, 'event.jobId');
  if ((['submission', 'execution', 'download'].includes(event.type) || ['submitted', 'running', 'succeeded', 'failed'].includes(event.status)) && event.jobId === null) throw new Error('job event/status requires an actual jobId');
  const occurred = iso(event.occurredAt, 'event.occurredAt');
  if (existing.length && occurred < Date.parse(existing.at(-1).occurredAt)) throw new Error('event occurs before the current durable ledger tail');
  exactKeys(event.actualDurationsMs, ['queue', 'execution', 'download'], 'event.actualDurationsMs'); for (const key of ['queue', 'execution', 'download']) duration(event.actualDurationsMs[key], `event.actualDurationsMs.${key}`);
  if (event.jobId === null && Object.values(event.actualDurationsMs).some(value => value !== null)) throw new Error('measured job durations require an actual jobId');
  if (event.jobId !== null) for (const key of ['queue', 'execution', 'download']) if (event.actualDurationsMs[key] !== null && existing.some(candidate => candidate.jobId === event.jobId && candidate.actualDurationsMs[key] !== null)) throw new Error(`duplicate ${key} timing record for job ${event.jobId}`);
  if (!Array.isArray(event.operatorIntervals)) throw new Error('event.operatorIntervals must be an array');
  for (const [index, interval] of event.operatorIntervals.entries()) { const label = `event.operatorIntervals[${index}]`; exactKeys(interval, ['actor', 'type', 'source', 'startedAt', 'endedAt'], label); nonempty(interval.actor, `${label}.actor`); if (!['preparation', 'review'].includes(interval.type)) throw new Error(`${label}.type invalid`); nonempty(interval.source, `${label}.source`); const start = iso(interval.startedAt, `${label}.startedAt`), end = iso(interval.endedAt, `${label}.endedAt`); if (end < start) throw new Error(`${label} ends before it starts`); }
  if (event.correction !== null) { exactKeys(event.correction, ['parentEventId', 'reason'], 'event.correction'); id(event.correction.parentEventId, 'event.correction.parentEventId'); nonempty(event.correction.reason, 'event.correction.reason'); const parent = existing.find(candidate => candidate.id === event.correction.parentEventId); if (!parent) throw new Error('correction parent does not exist in durable ledger'); if (occurred < Date.parse(parent.occurredAt)) throw new Error('correction occurs before its parent'); if (event.type !== 'correction') throw new Error('only correction events may name a correction parent'); }
  else if (event.type === 'correction') throw new Error('correction event requires parent and reason');
  if (!Array.isArray(event.outputs)) throw new Error('event.outputs must be an array');
  for (const [index, output] of event.outputs.entries()) { const label = `event.outputs[${index}]`; exactKeys(output, ['label', 'nodeId', 'sha256', 'reviewState'], label); nonempty(output.label, `${label}.label`); if (output.nodeId !== null) nonempty(output.nodeId, `${label}.nodeId`); if (output.sha256 !== null && !SHA_RE.test(output.sha256)) throw new Error(`${label}.sha256 invalid`); if (!REVIEW_STATES.includes(output.reviewState)) throw new Error(`${label}.reviewState invalid`); if (output.reviewState !== 'not-produced' && output.sha256 === null && ['succeeded', 'reviewed'].includes(event.status)) throw new Error(`${label} lacks a hash for completed event`); }
  if (!Array.isArray(event.pieceUse)) throw new Error('event.pieceUse must be an array');
  for (const [index, use] of event.pieceUse.entries()) { const label = `event.pieceUse[${index}]`; exactKeys(use, ['pieceId', 'sourceHash', 'sourceHashKind', 'useCount', 'reusedFromEventId'], label); id(use.pieceId, `${label}.pieceId`); if (!SHA_RE.test(use.sourceHash)) throw new Error(`${label}.sourceHash invalid`); nonempty(use.sourceHashKind, `${label}.sourceHashKind`); integer(use.useCount, `${label}.useCount`, 1); if (use.reusedFromEventId !== null) { const prior = existing.find(candidate => candidate.id === use.reusedFromEventId); if (!prior) throw new Error(`${label}.reusedFromEventId missing`); if (!prior.pieceUse.some(candidate => candidate.pieceId === use.pieceId && candidate.sourceHash === use.sourceHash && candidate.sourceHashKind === use.sourceHashKind)) throw new Error(`${label} has no matching prior piece-use evidence`); } }
  if (event.status === 'succeeded' && (!event.outputs.length || event.outputs.some(output => output.sha256 === null))) throw new Error('succeeded event requires hashed outputs');
  if (typeof event.notes !== 'string') throw new Error('event.notes must be a string');
}

export function validateLedger(ledger) {
  exactKeys(ledger, ['schemaVersion', 'revision', 'events', 'summary', 'stateSha256'], 'ledger');
  if (ledger.schemaVersion !== 1) throw new Error('ledger.schemaVersion must be 1'); integer(ledger.revision, 'ledger.revision', 0);
  if (!Array.isArray(ledger.events) || ledger.revision !== ledger.events.length) throw new Error('ledger revision must equal event count');
  const checked = []; for (const event of ledger.events) { validateEvent(event, checked); checked.push(event); }
  const expectedSummary = summarizeEvents(ledger.events); if (canonicalJson(ledger.summary) !== canonicalJson(expectedSummary)) throw new Error('ledger summary mismatch');
  if (!SHA_RE.test(ledger.stateSha256) || ledger.stateSha256 !== ledgerHash(ledger)) throw new Error('ledger state hash mismatch'); return true;
}

export function appendLedger(ledger, event) {
  validateLedger(ledger); validateEvent(event, ledger.events); const next = { schemaVersion: 1, revision: ledger.revision + 1, events: [...ledger.events, event] }; next.summary = summarizeEvents(next.events); next.stateSha256 = ledgerHash(next); return next;
}

export function appendLedgerFile(path, event, { expectedRevision, expectedSha256 }) {
  integer(expectedRevision, 'expectedRevision', 0); if (!SHA_RE.test(expectedSha256)) throw new Error('expectedSha256 invalid');
  const absolute = resolve(path), lockPath = `${absolute}.lock`; const lock = openSync(lockPath, 'wx'); let tempPath;
  try {
    const ledger = JSON.parse(readFileSync(absolute, 'utf8')); validateLedger(ledger);
    if (ledger.revision !== expectedRevision || ledger.stateSha256 !== expectedSha256) throw new Error(`stale ledger expectation: current revision ${ledger.revision} sha256 ${ledger.stateSha256}`);
    const next = appendLedger(ledger, event); tempPath = `${absolute}.tmp-${process.pid}-${Date.now()}`; const fd = openSync(tempPath, 'wx');
    try { writeFileSync(fd, `${JSON.stringify(next, null, 2)}\n`); fsyncSync(fd); } finally { closeSync(fd); }
    renameSync(tempPath, absolute); tempPath = undefined; return next;
  } finally { closeSync(lock); if (tempPath && existsSync(tempPath)) unlinkSync(tempPath); if (existsSync(lockPath)) unlinkSync(lockPath); }
}

export function writeExclusiveJson(path, value) { const fd = openSync(resolve(path), 'wx'); try { writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`); fsyncSync(fd); } finally { closeSync(fd); } }
export function loadJson(path) { return JSON.parse(readFileSync(resolve(path), 'utf8')); }
export function hashFile(path) { return sha256(readFileSync(resolve(path))); }
