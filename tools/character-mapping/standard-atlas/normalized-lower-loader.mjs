import { slotRect } from './schema-v1.mjs';

// Source crops and optional nominal trouser rectangles must pass through the
// packer's full similarity transform before they can be sampled from a page.
export function normalizedPackedRect(id, record, sourceRect) {
  const slot = slotRect(id), n = record.normalization;
  const cosine = Math.cos(n.rotationRadians), sine = Math.sin(n.rotationRadians);
  const corners = [
    [sourceRect.x, sourceRect.y],
    [sourceRect.x + sourceRect.width, sourceRect.y],
    [sourceRect.x, sourceRect.y + sourceRect.height],
    [sourceRect.x + sourceRect.width, sourceRect.y + sourceRect.height],
  ].map(([x, y]) => ({
    x: slot.x + n.scale * (x * cosine - y * sine) + n.translation.x,
    y: slot.y + n.scale * (x * sine + y * cosine) + n.translation.y,
  }));
  const xs = corners.map(point => point.x), ys = corners.map(point => point.y);
  return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}

export function loadNormalizedLowerParts(packedPage, records) {
  const lower = {};
  for (const [id, record] of Object.entries(records)) {
    const match = /^lower\.(south|east|west|north)\.(thigh|shin|shoe)\.(left|right)$/.exec(id);
    if (!match) continue;
    const [, view, kind, side] = match;
    lower[view] ??= {}; lower[view][side] ??= {};
    const crop = record.source.crop, nominal = record.source.nominalRenderRect ?? crop;
    lower[view][side][kind] = {
      id, image: packedPage, record,
      rect: normalizedPackedRect(id, record, crop),
      trouserRect: normalizedPackedRect(id, record, nominal),
      landmarks: record.landmarks,
    };
  }
  return lower;
}
