/**
 * Adapts a read-only real-art movement manifest to preview rows. It deliberately
 * refuses to invent a missing direction, pose, output path, or guide.
 */
export function adaptManifest(manifest, { direction = 'east', mode = 'walk' } = {}) {
  const isUnified = Boolean(manifest.directions && Array.isArray(manifest.characters));
  const source = isUnified ? manifest : (direction === 'east' && mode === 'walk' ? manifest : null);
  if (!source || !Array.isArray(source.phaseIds) || !Array.isArray(source.characters)) {
    throw new Error(`Manifest has no explicit ${direction}/${mode} preview payload`);
  }
  if (isUnified && !(Array.isArray(source.directions) ? source.directions.includes(direction) : Object.hasOwn(source.directions, direction))) throw new Error(`Manifest has no explicit ${direction} direction`);
  const phaseIds = mode === 'walk' ? source.phaseIds : ['static'];
  const characters = source.characters.map((character) => {
    const frames = phaseIds.map((phase) => {
      const output = isUnified ? (mode === 'walk' ? character.directions?.[direction]?.[phase] : character.static?.[mode]) : character.outputs?.[phase];
      if (!output?.clean || !output?.guide) throw new Error(`${character.id} lacks clean or independent guide for ${direction}/${mode}/${phase}`);
      return { phase, clean: output.clean, guide: output.guide, overlay: output.overlay ?? null };
    });
    return {
      id: character.id,
      label: character.label,
      sourcePath: character.sourcePath,
      sourceSha256: character.sourceSha256,
      sourcePreview: typeof character.sourcePreview === 'string' ? character.sourcePreview : null,
      bodyPreview: character.bodyPreview ?? null,
      frames
    };
  });
  return { direction, mode, phaseIds, characters };
}
