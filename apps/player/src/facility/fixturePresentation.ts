export function getFixturePresentationSize(
  nativeWidth: number,
  nativeHeight: number,
  maximumWidth: number,
  maximumHeight: number,
): { width: number; height: number } {
  const safeNativeWidth = Math.max(1, nativeWidth);
  const safeNativeHeight = Math.max(1, nativeHeight);
  const scale = Math.max(
    0.01,
    Math.min(
      Math.max(1, maximumWidth) / safeNativeWidth,
      Math.max(1, maximumHeight) / safeNativeHeight,
    ),
  );
  return {
    width: Math.max(1, Math.round(safeNativeWidth * scale)),
    height: Math.max(1, Math.round(safeNativeHeight * scale)),
  };
}
