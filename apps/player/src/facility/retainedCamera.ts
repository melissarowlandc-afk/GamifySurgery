/** No render target: retained world display coordinates are mapped to the
 * existing viewport by Phaser's origin-(0,0), unrotated camera. */
export interface CameraPlane { originX: number; originY: number; tileSize: number }
export interface CameraPoint { x: number; y: number }
export interface CameraRect extends CameraPoint { width: number; height: number }
export const CAMERA_ZOOM_SETTLE_MS = 150;

export function retainedCameraTransform(drawn: CameraPlane, projected: CameraPlane) {
  const zoom = projected.tileSize / drawn.tileSize;
  return { zoom, scrollX: drawn.originX - projected.originX / zoom,
    scrollY: drawn.originY - projected.originY / zoom };
}
export function projectCameraPoint(point: CameraPoint, drawn: CameraPlane, projected: CameraPlane): CameraPoint {
  const scale = projected.tileSize / drawn.tileSize;
  return { x: projected.originX + (point.x - drawn.originX) * scale,
    y: projected.originY + (point.y - drawn.originY) * scale };
}
export function unprojectCameraPoint(point: CameraPoint, drawn: CameraPlane, projected: CameraPlane): CameraPoint {
  return projectCameraPoint(point, projected, drawn);
}
export function projectCameraRect(rect: CameraRect, drawn: CameraPlane, projected: CameraPlane): CameraRect {
  const point = projectCameraPoint(rect, drawn, projected), scale = projected.tileSize / drawn.tileSize;
  return { ...point, width: rect.width * scale, height: rect.height * scale };
}
