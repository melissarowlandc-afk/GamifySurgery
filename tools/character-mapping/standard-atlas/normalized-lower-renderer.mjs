import { drawStandardLowerLeg, quad } from '../layered-pilot/gray-overshirt-v2/lower-render-v2.mjs';

// A bent leg's four target corners do not generally form a parallelogram.
// Two affine triangles preserve all four corners of the source rectangle.
export function triangulatedQuad(context, image, source, target) {
  const width = source.width, height = source.height;
  if (width <= 0 || height <= 0) return;
  const [topLeft, topRight, bottomRight, bottomLeft] = target;
  const cornerResidual = Math.hypot(bottomRight.x - (topRight.x + bottomLeft.x - topLeft.x), bottomRight.y - (topRight.y + bottomLeft.y - topLeft.y));
  if (cornerResidual < .5) return quad(context, image, source, target);
  const diagonalLength = Math.hypot(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  const overlap = { x: -(bottomRight.y - topLeft.y) / diagonalLength, y: (bottomRight.x - topLeft.x) / diagonalLength };
  const shift = (point, sign) => ({ x: point.x + overlap.x * sign, y: point.y + overlap.y * sign });
  const triangles = [
    {
      target: [topLeft, topRight, bottomRight],
      clipTarget: [shift(topLeft, 1), topRight, shift(bottomRight, 1)],
      a: (topRight.x - topLeft.x) / width,
      b: (topRight.y - topLeft.y) / width,
      c: (bottomRight.x - topRight.x) / height,
      d: (bottomRight.y - topRight.y) / height,
    },
    {
      target: [topLeft, bottomRight, bottomLeft],
      clipTarget: [shift(topLeft, -1), shift(bottomRight, -1), bottomLeft],
      a: (bottomRight.x - bottomLeft.x) / width,
      b: (bottomRight.y - bottomLeft.y) / width,
      c: (bottomLeft.x - topLeft.x) / height,
      d: (bottomLeft.y - topLeft.y) / height,
    },
  ];
  context.save();
  context.beginPath(); context.moveTo(topLeft.x, topLeft.y);
  for (const point of [topRight, bottomRight, bottomLeft]) context.lineTo(point.x, point.y);
  context.closePath(); context.clip();
  for (const triangle of triangles) {
    const { a, b, c, d } = triangle;
    const e = topLeft.x - a * source.x - c * source.y;
    const f = topLeft.y - b * source.x - d * source.y;
    context.save();
    context.beginPath();
    context.moveTo(triangle.clipTarget[0].x, triangle.clipTarget[0].y);
    for (const point of triangle.clipTarget.slice(1)) context.lineTo(point.x, point.y);
    context.closePath();
    context.clip();
    context.setTransform(a, b, c, d, e, f);
    context.drawImage(image, 0, 0);
    context.restore();
  }
  context.restore();
}

export function drawNormalizedLowerLeg(context, loaded, view, side, joints, options = {}) {
  return drawStandardLowerLeg(context, loaded, view, side, joints, { ...options, warpQuad: triangulatedQuad });
}
