export const MAP_CHARACTER_REFERENCE_TILE_SIZE = 52;
export const MAP_CHARACTER_REFERENCE_HEIGHT = 54;

export interface CharacterFrameSize {
  width: number;
  height: number;
}

export interface CharacterPresentationMetrics {
  width: number;
  height: number;
}

export function getCharacterPresentationMetrics(
  frame: CharacterFrameSize,
  tileSize: number,
): CharacterPresentationMetrics {
  const height = Math.max(
    6,
    Math.round(
      (tileSize * MAP_CHARACTER_REFERENCE_HEIGHT) /
        MAP_CHARACTER_REFERENCE_TILE_SIZE,
    ),
  );
  return {
    width: Math.max(4, Math.round((height * frame.width) / frame.height)),
    height,
  };
}
