import { createCanvas } from '@napi-rs/canvas';

const EPSILON = 1e-7;
const point = (x, y) => ({ x, y });
const add = (a, b) => point(a.x + b.x, a.y + b.y);
const sub = (a, b) => point(a.x - b.x, a.y - b.y);
const mul = (a, value) => point(a.x * value, a.y * value);
const dot = (a, b) => a.x * b.x + a.y * b.y;
const length = value => Math.hypot(value.x, value.y);
const unit = value => {
  const magnitude = length(value);
  if (magnitude < EPSILON) throw new Error('rig anchors must not coincide');
  return mul(value, 1 / magnitude);
};
const normal = direction => point(-direction.y, direction.x);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const smoothstep = value => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
const lerpPoint = (a, b, amount) => add(a, mul(sub(b, a), amount));
const blendUnit = (a, b, amount) => {
  const blended = lerpPoint(a, b, smoothstep(amount));
  return length(blended) < EPSILON ? (amount < 0.5 ? a : b) : unit(blended);
};
const vertexKey = value => `${value.x},${value.y}`;

function assertPoint(value, label) {
  if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y)) throw new Error(`${label} must be a finite {x,y} point`);
}

function assertBounds(bounds, imageData) {
  for (const key of ['x', 'y', 'width', 'height']) if (!Number.isInteger(bounds?.[key])) throw new Error(`bounds.${key} must be an integer`);
  if (bounds.width <= 0 || bounds.height <= 0 || bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > imageData.width || bounds.y + bounds.height > imageData.height) {
    throw new Error('bounds must be a non-empty rectangle inside the source image');
  }
}

function alphaAt(imageData, x, y) {
  return imageData.data[(y * imageData.width + x) * 4 + 3];
}

export function inspectAlpha(imageData, bounds, alphaThreshold = 0) {
  assertBounds(bounds, imageData);
  const occupied = new Set();
  for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) if (alphaAt(imageData, x, y) > alphaThreshold) occupied.add(`${x},${y}`);
  }
  if (occupied.size === 0) throw new Error('part bounds contain no opaque pixels');
  const remaining = new Set(occupied), components = [];
  while (remaining.size) {
    const seed = remaining.values().next().value, queue = [seed];
    remaining.delete(seed);
    let count = 0, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    while (queue.length) {
      const current = queue.pop(), [x, y] = current.split(',').map(Number);
      count += 1; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      for (const [nx, ny] of [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]) {
        const key = `${nx},${ny}`;
        if (remaining.delete(key)) queue.push(key);
      }
    }
    components.push({ pixelCount: count, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } });
  }
  components.sort((a, b) => b.pixelCount - a.pixelCount);
  return { opaquePixelCount: occupied.size, componentCount: components.length, components };
}

export function keyConnectedBackground(imageData, { color, tolerance = 0, magentaDominanceThreshold = null } = {}) {
  if (!Array.isArray(color) || color.length !== 3 || color.some(value => !Number.isInteger(value) || value < 0 || value > 255)) throw new Error('background color must contain three byte values');
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new Error('background tolerance must be non-negative');
  const output = { width: imageData.width, height: imageData.height, data: new Uint8ClampedArray(imageData.data) };
  const matches = (x, y) => {
    const index = (y * imageData.width + x) * 4;
    return imageData.data[index + 3] > 0 && color.every((channel, offset) => Math.abs(imageData.data[index + offset] - channel) <= tolerance);
  };
  const queued = new Set(), queue = [];
  const enqueue = (x, y) => {
    const key = `${x},${y}`;
    if (x >= 0 && y >= 0 && x < imageData.width && y < imageData.height && !queued.has(key) && matches(x, y)) { queued.add(key); queue.push([x, y]); }
  };
  for (let x = 0; x < imageData.width; x += 1) { enqueue(x, 0); enqueue(x, imageData.height - 1); }
  for (let y = 0; y < imageData.height; y += 1) { enqueue(0, y); enqueue(imageData.width - 1, y); }
  while (queue.length) {
    const [x, y] = queue.pop(), index = (y * imageData.width + x) * 4;
    output.data[index] = 0; output.data[index + 1] = 0; output.data[index + 2] = 0; output.data[index + 3] = 0;
    enqueue(x - 1, y); enqueue(x + 1, y); enqueue(x, y - 1); enqueue(x, y + 1);
  }
  let defringedPixelCount = 0;
  if (magentaDominanceThreshold !== null) {
    if (!Number.isFinite(magentaDominanceThreshold) || magentaDominanceThreshold < 0) throw new Error('magentaDominanceThreshold must be non-negative or null');
    for (let index = 0; index < output.data.length; index += 4) {
      const red = output.data[index], green = output.data[index + 1], blue = output.data[index + 2];
      if (output.data[index + 3] && Math.min(red, blue) - green > magentaDominanceThreshold) {
        output.data[index] = 0; output.data[index + 1] = 0; output.data[index + 2] = 0; output.data[index + 3] = 0; defringedPixelCount += 1;
      }
    }
  }
  return { imageData: output, removedPixelCount: queued.size, defringedPixelCount, method: magentaDominanceThreshold === null ? 'edge-connected-color-flood' : 'edge-connected-color-flood-plus-declared-no-pink-defringe' };
}

export function createFullSurfaceGrid(imageData, bounds, { cellSize = 4, alphaThreshold = 0, trimTransparentCells = true, extraX = [], extraY = [] } = {}) {
  assertBounds(bounds, imageData);
  if (!Number.isInteger(cellSize) || cellSize < 1) throw new Error('cellSize must be a positive integer');
  const xs = [bounds.x], ys = [bounds.y];
  while (xs.at(-1) < bounds.x + bounds.width) xs.push(Math.min(xs.at(-1) + cellSize, bounds.x + bounds.width));
  while (ys.at(-1) < bounds.y + bounds.height) ys.push(Math.min(ys.at(-1) + cellSize, bounds.y + bounds.height));
  for (const value of extraX) if (value > bounds.x && value < bounds.x + bounds.width) xs.push(value);
  for (const value of extraY) if (value > bounds.y && value < bounds.y + bounds.height) ys.push(value);
  xs.sort((a, b) => a - b); ys.sort((a, b) => a - b);
  for (let index = xs.length - 1; index > 0; index -= 1) if (Math.abs(xs[index] - xs[index - 1]) < EPSILON) xs.splice(index, 1);
  for (let index = ys.length - 1; index > 0; index -= 1) if (Math.abs(ys[index] - ys[index - 1]) < EPSILON) ys.splice(index, 1);
  const vertices = [];
  for (const y of ys) for (const x of xs) vertices.push(point(x, y));
  const width = xs.length, triangles = [];
  let activeCellCount = 0, transparentCellCount = 0;
  for (let row = 0; row < ys.length - 1; row += 1) {
    for (let column = 0; column < xs.length - 1; column += 1) {
      let alphaAffected = false;
      for (let y = ys[row]; y < ys[row + 1] && !alphaAffected; y += 1) for (let x = xs[column]; x < xs[column + 1]; x += 1) if (alphaAt(imageData, x, y) > alphaThreshold) { alphaAffected = true; break; }
      if (!alphaAffected && trimTransparentCells) { transparentCellCount += 1; continue; }
      activeCellCount += 1;
      const topLeft = row * width + column, topRight = topLeft + 1, bottomLeft = topLeft + width, bottomRight = bottomLeft + 1;
      triangles.push([topLeft, topRight, bottomRight], [topLeft, bottomRight, bottomLeft]);
    }
  }
  const alpha = inspectAlpha(imageData, bounds, alphaThreshold);
  return {
    bounds: { ...bounds }, cellSize, vertices, triangles,
    diagnostics: { ...alpha, vertexCount: vertices.length, triangleCount: triangles.length, activeCellCount, transparentCellCount, coversEveryOpaquePixel: true, connectedSurface: isConnectedSurface(vertices, triangles) },
  };
}

export function isConnectedSurface(vertices, triangles) {
  if (!triangles.length) return false;
  const adjacency = Array.from({ length: vertices.length }, () => new Set());
  for (const triangle of triangles) for (let index = 0; index < 3; index += 1) {
    const a = triangle[index], b = triangle[(index + 1) % 3];
    adjacency[a].add(b); adjacency[b].add(a);
  }
  const used = new Set(triangles.flat()), visited = new Set(), queue = [triangles[0][0]];
  while (queue.length) {
    const current = queue.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    for (const next of adjacency[current]) if (!visited.has(next)) queue.push(next);
  }
  return [...used].every(index => visited.has(index));
}

const signedArea2 = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

export function inspectDeformedMesh(mesh, deformedVertices) {
  if (deformedVertices.length !== mesh.vertices.length) throw new Error('deformed vertex count must match mesh');
  let minimumAbsoluteArea2 = Infinity, foldedTriangleCount = 0, degenerateTriangleCount = 0; const unsafeSamples = [];
  for (const indices of mesh.triangles) {
    const sourceArea = signedArea2(...indices.map(index => mesh.vertices[index]));
    const targetArea = signedArea2(...indices.map(index => deformedVertices[index]));
    minimumAbsoluteArea2 = Math.min(minimumAbsoluteArea2, Math.abs(targetArea));
    if (Math.abs(targetArea) < EPSILON) { degenerateTriangleCount += 1; if (unsafeSamples.length < 8) unsafeSamples.push({ kind: 'degenerate', indices, source: indices.map(index => mesh.vertices[index]), target: indices.map(index => deformedVertices[index]) }); }
    else if (sourceArea * targetArea < 0) { foldedTriangleCount += 1; if (unsafeSamples.length < 8) unsafeSamples.push({ kind: 'folded', indices, source: indices.map(index => mesh.vertices[index]), target: indices.map(index => deformedVertices[index]) }); }
  }
  return { triangleCount: mesh.triangles.length, minimumAbsoluteArea2, foldedTriangleCount, degenerateTriangleCount, unsafeSamples };
}

function prepareRig(rig, label) {
  const names = ['proximal', 'joint', 'terminal', 'end'];
  const anchors = names.map(name => {
    assertPoint(rig?.[name], `${label}.${name}`);
    return rig[name];
  });
  const directions = [], lengths = [], cumulative = [0];
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const delta = sub(anchors[index + 1], anchors[index]);
    lengths.push(length(delta)); directions.push(unit(delta)); cumulative.push(cumulative.at(-1) + lengths.at(-1));
  }
  return { anchors, directions, lengths, cumulative };
}

function projectToRig(value, rig) {
  let best = null;
  for (let index = 0; index < rig.directions.length; index += 1) {
    const delta = sub(value, rig.anchors[index]), raw = dot(delta, rig.directions[index]);
    const along = clamp(raw, 0, rig.lengths[index]), center = add(rig.anchors[index], mul(rig.directions[index], along));
    const distance = length(sub(value, center));
    if (!best || distance < best.distance) best = { segment: index, ratio: along / rig.lengths[index], sourceS: rig.cumulative[index] + along, distance };
  }
  if (best.segment === 0 && dot(sub(value, rig.anchors[0]), rig.directions[0]) < 0) {
    best.ratio = dot(sub(value, rig.anchors[0]), rig.directions[0]) / rig.lengths[0];
    best.sourceS = best.ratio * rig.lengths[0];
  }
  const last = rig.directions.length - 1, afterEnd = dot(sub(value, rig.anchors.at(-1)), rig.directions[last]);
  if (afterEnd > 0) {
    best = { segment: last, ratio: 1 + afterEnd / rig.lengths[last], sourceS: rig.cumulative.at(-1) + afterEnd, distance: Math.abs(dot(sub(value, rig.anchors.at(-1)), normal(rig.directions[last]))) };
  }
  const sourceCenter = lerpPoint(rig.anchors[best.segment], rig.anchors[best.segment + 1], best.ratio);
  best.offset = dot(sub(value, sourceCenter), normal(rig.directions[best.segment]));
  return best;
}

function targetCenter(projected, source, target, jointBlendPixels) {
  const localS = projected.sourceS;
  for (let hinge = 1; hinge < source.anchors.length - 1; hinge += 1) {
    const blend = jointBlendPixels[hinge - 1], hingeS = source.cumulative[hinge];
    if (blend > 0 && localS >= hingeS - blend && localS <= hingeS + blend) {
      const beforeDistance = blend * target.lengths[hinge - 1] / source.lengths[hinge - 1], afterDistance = blend * target.lengths[hinge] / source.lengths[hinge];
      const start = sub(target.anchors[hinge], mul(target.directions[hinge - 1], beforeDistance));
      const end = add(target.anchors[hinge], mul(target.directions[hinge], afterDistance));
      const t = (localS - (hingeS - blend)) / (2 * blend), inverse = 1 - t;
      return add(add(mul(start, inverse * inverse), mul(target.anchors[hinge], 2 * inverse * t)), mul(end, t * t));
    }
  }
  return lerpPoint(target.anchors[projected.segment], target.anchors[projected.segment + 1], projected.ratio);
}

function smoothedDirection(projected, source, target, jointBlendPixels) {
  const segment = projected.segment, localS = projected.sourceS;
  let direction = target.directions[segment];
  for (let hinge = 1; hinge < source.anchors.length - 1; hinge += 1) {
    const blend = jointBlendPixels[hinge - 1], hingeS = source.cumulative[hinge];
    if (blend > 0 && localS >= hingeS - blend && localS <= hingeS + blend) {
      direction = blendUnit(target.directions[hinge - 1], target.directions[hinge], (localS - (hingeS - blend)) / (2 * blend));
    }
  }
  return direction;
}

function jointFanMap(value, projected, source, target, jointBlendPixels, normalizationScale) {
  const localS = projected.sourceS;
  for (let hinge = 1; hinge < source.anchors.length - 1; hinge += 1) {
    const blend = jointBlendPixels[hinge - 1], hingeS = source.cumulative[hinge];
    if (blend > 0 && localS >= hingeS - blend && localS <= hingeS + blend) {
      const amount = (localS - (hingeS - blend)) / (2 * blend);
      const sourceDirection = blendUnit(source.directions[hinge - 1], source.directions[hinge], amount);
      const targetDirection = blendUnit(target.directions[hinge - 1], target.directions[hinge], amount);
      const relative = sub(value, source.anchors[hinge]), along = dot(relative, sourceDirection), across = dot(relative, normal(sourceDirection));
      const segment = along < 0 ? hinge - 1 : hinge, longitudinalScale = target.lengths[segment] / source.lengths[segment];
      return add(target.anchors[hinge], add(mul(targetDirection, along * longitudinalScale), mul(normal(targetDirection), across * normalizationScale)));
    }
  }
  return null;
}

function similarity(value, sourceStart, sourceEnd, targetStart, targetEnd, scaleOverride) {
  const sourceDelta = sub(sourceEnd, sourceStart), targetDelta = sub(targetEnd, targetStart);
  const scale = scaleOverride ?? length(targetDelta) / length(sourceDelta), sourceDirection = unit(sourceDelta), targetDirection = unit(targetDelta);
  const local = sub(value, sourceStart), along = dot(local, sourceDirection), across = dot(local, normal(sourceDirection));
  return add(targetStart, add(mul(targetDirection, along * scale), mul(normal(targetDirection), across * scale)));
}

export function skinVertices(vertices, sourceRigValue, targetRigValue, { jointBlendPixels = [6, 3], terminalTransition = { before: 2, after: 2 }, normalizationScale = 1 } = {}) {
  const source = prepareRig(sourceRigValue, 'sourceRig'), target = prepareRig(targetRigValue, 'targetRig');
  if (!Array.isArray(jointBlendPixels) || jointBlendPixels.length !== 2 || jointBlendPixels.some(value => !Number.isFinite(value) || value < 0)) throw new Error('jointBlendPixels must contain two non-negative values');
  if (![terminalTransition?.before, terminalTransition?.after].every(value => Number.isFinite(value) && value >= 0)) throw new Error('terminalTransition must contain non-negative before/after values');
  if (!Number.isFinite(normalizationScale) || normalizationScale <= 0) throw new Error('normalizationScale must be positive');
  const terminalS = source.cumulative[2], transitionStart = terminalS - terminalTransition.before, transitionEnd = terminalS + terminalTransition.after;
  return vertices.map(value => {
    const projected = projectToRig(value, source), direction = smoothedDirection(projected, source, target, jointBlendPixels);
    const articulated = jointFanMap(value, projected, source, target, jointBlendPixels, normalizationScale) ?? add(targetCenter(projected, source, target, jointBlendPixels), mul(normal(direction), projected.offset * normalizationScale));
    const rigid = similarity(value, source.anchors[2], source.anchors[3], target.anchors[2], target.anchors[3], normalizationScale);
    const terminalWeight = transitionEnd === transitionStart ? Number(projected.sourceS >= terminalS) : smoothstep((projected.sourceS - transitionStart) / (transitionEnd - transitionStart));
    return { ...lerpPoint(articulated, rigid, terminalWeight), terminalWeight };
  });
}

function barycentric(value, a, b, c) {
  const denominator = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(denominator) < EPSILON) return null;
  const u = ((b.y - c.y) * (value.x - c.x) + (c.x - b.x) * (value.y - c.y)) / denominator;
  const v = ((c.y - a.y) * (value.x - c.x) + (a.x - c.x) * (value.y - c.y)) / denominator;
  return [u, v, 1 - u - v];
}

function compositePixel(destination, destinationIndex, source, sourceIndex) {
  const sourceAlpha = source[sourceIndex + 3] / 255;
  if (sourceAlpha <= 0) return;
  const destinationAlpha = destination[destinationIndex + 3] / 255, outputAlpha = sourceAlpha + destinationAlpha * (1 - sourceAlpha);
  for (let channel = 0; channel < 3; channel += 1) destination[destinationIndex + channel] = Math.round((source[sourceIndex + channel] * sourceAlpha + destination[destinationIndex + channel] * destinationAlpha * (1 - sourceAlpha)) / outputAlpha);
  destination[destinationIndex + 3] = Math.round(outputAlpha * 255);
}

export function rasterizeMesh(sourceImageData, mesh, deformedVertices, outputSize) {
  if (deformedVertices.length !== mesh.vertices.length) throw new Error('deformed vertex count must match mesh');
  const canvas = createCanvas(outputSize.width, outputSize.height), context = canvas.getContext('2d'), output = context.createImageData(outputSize.width, outputSize.height);
  for (const indices of mesh.triangles) {
    const sourceTriangle = indices.map(index => mesh.vertices[index]), targetTriangle = indices.map(index => deformedVertices[index]);
    const minX = Math.max(0, Math.floor(Math.min(...targetTriangle.map(value => value.x))));
    const maxX = Math.min(outputSize.width - 1, Math.ceil(Math.max(...targetTriangle.map(value => value.x))));
    const minY = Math.max(0, Math.floor(Math.min(...targetTriangle.map(value => value.y))));
    const maxY = Math.min(outputSize.height - 1, Math.ceil(Math.max(...targetTriangle.map(value => value.y))));
    for (let y = minY; y <= maxY; y += 1) for (let x = minX; x <= maxX; x += 1) {
      const weights = barycentric(point(x + 0.5, y + 0.5), ...targetTriangle);
      if (!weights || weights.some(weight => weight < -EPSILON)) continue;
      const sourceX = clamp(Math.floor(weights.reduce((sum, weight, index) => sum + weight * sourceTriangle[index].x, 0)), 0, sourceImageData.width - 1);
      const sourceY = clamp(Math.floor(weights.reduce((sum, weight, index) => sum + weight * sourceTriangle[index].y, 0)), 0, sourceImageData.height - 1);
      compositePixel(output.data, (y * outputSize.width + x) * 4, sourceImageData.data, (sourceY * sourceImageData.width + sourceX) * 4);
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

export function renderSkinnedPart(sourceImageData, part, targetRig, outputSize) {
  const anchors = Object.values(part.rig);
  const mesh = createFullSurfaceGrid(sourceImageData, part.bounds, { ...part.mesh, extraX: anchors.map(value => value.x), extraY: anchors.map(value => value.y) });
  if (!mesh.diagnostics.connectedSurface) throw new Error('generated part mesh is disconnected');
  if (mesh.diagnostics.componentCount !== 1) throw new Error(`source part has ${mesh.diagnostics.componentCount} disconnected opaque components`);
  const vertices = skinVertices(mesh.vertices, part.rig, targetRig, { ...part.skinning, normalizationScale: part.normalizationScale });
  const deformation = inspectDeformedMesh(mesh, vertices);
  if (deformation.foldedTriangleCount || deformation.degenerateTriangleCount) throw new Error(`unsafe deformation has ${deformation.foldedTriangleCount} folded and ${deformation.degenerateTriangleCount} degenerate triangles: ${JSON.stringify(deformation.unsafeSamples)}`);
  return { canvas: rasterizeMesh(sourceImageData, mesh, vertices, outputSize), mesh, vertices, deformation };
}

export function renderRigidPiece(sourceImageData, piece, targetAnchor, outputSize) {
  assertPoint(piece?.anchor, 'piece.anchor'); assertPoint(targetAnchor, 'targetAnchor');
  const scaleX = piece.calibration?.scaleX ?? piece.normalizationScale ?? 1, scaleY = piece.calibration?.scaleY ?? piece.normalizationScale ?? 1;
  if (![scaleX, scaleY].every(value => Number.isFinite(value) && value > 0)) throw new Error('piece calibration scales must be positive');
  const canvas = createCanvas(outputSize.width, outputSize.height), context = canvas.getContext('2d'), output = context.createImageData(outputSize.width, outputSize.height);
  for (let y = 0; y < outputSize.height; y += 1) for (let x = 0; x < outputSize.width; x += 1) {
    const sourceX = Math.floor(piece.anchor.x + (x + 0.5 - targetAnchor.x) / scaleX);
    const sourceY = Math.floor(piece.anchor.y + (y + 0.5 - targetAnchor.y) / scaleY);
    if (sourceX < piece.bounds.x || sourceY < piece.bounds.y || sourceX >= piece.bounds.x + piece.bounds.width || sourceY >= piece.bounds.y + piece.bounds.height) continue;
    const sourceIndex = (sourceY * sourceImageData.width + sourceX) * 4;
    compositePixel(output.data, (y * outputSize.width + x) * 4, sourceImageData.data, sourceIndex);
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

export const internals = { projectToRig, prepareRig, similarity, vertexKey };
