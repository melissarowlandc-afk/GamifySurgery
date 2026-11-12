/** On-demand counts only, with no source names, patient data or retained history.
 * Nominal RGBA excludes decoder/GPU overhead and is not a process-heap estimate. */
export function facilityMemorySnapshot(objects: readonly any[], textures: Record<string, any> = {}) {
  const visited = new Set<any>(), sources = new Set<any>(), buffers = new Set<ArrayBufferLike>();
  let displayObjects = 0, graphicsCommandNumbers = 0, nominalRgbaBytes = 0, canvasSources = 0,
    readbackBytes = 0, maxTextureSide = 0, renderTextures = 0;
  const walk = (object: any) => {
    if (!object || visited.has(object)) return;
    visited.add(object); displayObjects++;
    if (Array.isArray(object.commandBuffer)) graphicsCommandNumbers += object.commandBuffer.length;
    if (object.type === "RenderTexture") renderTextures++;
    if (Array.isArray(object.list)) object.list.forEach(walk);
  };
  objects.forEach(walk);
  for (const texture of Object.values(textures)) {
    const buffer = texture?.data?.buffer ?? texture?.buffer;
    if (buffer && !buffers.has(buffer)) { buffers.add(buffer); readbackBytes += buffer.byteLength; }
    for (const source of texture?.source ?? []) {
      const image = source.image;
      if (!image || sources.has(image)) continue;
      sources.add(image);
      const width = source.width ?? image.width ?? 0, height = source.height ?? image.height ?? 0;
      if (!Number.isFinite(width) || !Number.isFinite(height)) continue;
      maxTextureSide = Math.max(maxTextureSide, width, height); nominalRgbaBytes += width * height * 4;
      if (typeof image.getContext === "function") canvasSources++;
    }
  }
  return { displayObjects, graphicsCommandNumbers, textures: Object.keys(textures).length,
    nominalRgbaBytes, canvasSources, readbackBytes, maxTextureSide, renderTextures };
}
