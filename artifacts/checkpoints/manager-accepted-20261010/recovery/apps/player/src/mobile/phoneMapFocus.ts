import { useEffect, type RefObject } from "react";
import type { FacilityCameraView, FacilityViewModel } from "../facility/types";
import { clampFacilityCamera } from "../facility/facilityCameraBounds";
import { phoneCameraLayout, type MapViewport } from "./map/camera";
import type { PhoneMapFocus } from "./tutorialTargets";

export function phoneMapFocusPoint(model: FacilityViewModel, focus: PhoneMapFocus) {
  if (focus.kind === "water") return model.waterCooler?.location;
  if (focus.kind === "litter") return (focus.id ? model.litterItems?.find(item => item.instanceId === focus.id) : model.litterItems?.[0])?.location;
  if (focus.kind === "patient") return model.patients?.find(patient => patient.instanceId === focus.id)?.location;
  const room = focus.kind === "entrance" ? model.rooms.find(room => room.isFounderRoom) : model.rooms.find(room => room.instanceId === focus.id);
  return room ? { x: room.tileX + room.width / 2, y: room.tileY + room.height / 2 } : undefined;
}

/** Reuse the existing scene's room outline, patient locator and environmental highlights. */
export function phoneLocatedModel(model: FacilityViewModel, focus?: PhoneMapFocus | null): FacilityViewModel {
  if (!focus) return model;
  return { ...model,
    selectedRoomInstanceId: focus.kind === "entrance" ? model.rooms.find(room => room.isFounderRoom)?.instanceId : focus.kind === "room" ? focus.id : model.selectedRoomInstanceId,
    selectedPatientInstanceId: focus.kind === "patient" ? focus.id : model.selectedPatientInstanceId,
    ...(model.waterCooler ? { waterCooler: { ...model.waterCooler, highlighted: focus.kind === "water" || model.waterCooler.highlighted } } : {}),
    ...(model.litterItems ? { litterItems: model.litterItems.map((item, index) => ({ ...item,
      highlighted: item.highlighted || focus.kind === "litter" && (focus.id ? item.instanceId === focus.id : index === 0) })) } : {}),
  };
}

export function usePhoneMapFocus(focus: PhoneMapFocus | null | undefined, model: RefObject<FacilityViewModel>,
  camera: RefObject<FacilityCameraView | null>, viewport: RefObject<MapViewport | null>, change: (camera: FacilityCameraView) => void) {
  useEffect(() => {
    if (!focus || !viewport.current || !camera.current) return;
    const point = phoneMapFocusPoint(model.current, focus);
    if (!point) return;
    const layout = phoneCameraLayout(camera.current, model.current, viewport.current);
    change(clampFacilityCamera({ ...camera.current,
      panX: viewport.current.width / 2 - point.x * layout.tileSize - layout.baseX,
      panY: viewport.current.height / 2 - point.y * layout.tileSize - layout.baseY,
    }, model.current, viewport.current, true));
  }, [focus?.key, change, model, camera, viewport]);
}
