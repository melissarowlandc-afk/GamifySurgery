import { useCallback, useEffect, useRef, useState } from "react";
import { FacilityCanvas, type FacilityCanvasProps } from "../../facility";
import { clampFacilityCamera } from "../../facility/facilityCameraBounds";
import { getInitialFacilityCamera } from "../../facility/defaultCamera";
import type { FacilityCameraView } from "../../facility/types";
import { bindFacilityCameraPreferenceLifecycle } from "../../session/facilityCameraPreference";
import { framePhoneFacility, type MapViewport } from "./camera";
import { createPhoneCameraPreferenceSession, readPhoneCameraPreference } from "./cameraPreference";
import type { MobileMapSelection } from "./selection";
import type { PhoneMapFocus } from "../tutorialTargets";
import { usePhoneMapFocus } from "../phoneMapFocus";
import "./mobileMap.css";

type MobileFacilityMapProps = Omit<FacilityCanvasProps, "mobileInput" | "onCameraChange" | "onMobileSelection"> & {
  onMobileSelection: (selection: MobileMapSelection | null) => void;
  focus?: PhoneMapFocus | null;
};

/** Remount only the presentation camera when switching campaigns, never the session. */
export function MobileFacilityMap(props: MobileFacilityMapProps) {
  return <PhoneMap key={props.viewModel.campaignId ?? "preview"} {...props} />;
}

function PhoneMap({ viewModel, onMobileSelection, focus, ...props }: MobileFacilityMapProps) {
  const campaignId = viewModel.campaignId ?? "preview";
  const host = useRef<HTMLDivElement>(null);
  const model = useRef(viewModel);
  model.current = viewModel;
  const [preferences] = useState(createPhoneCameraPreferenceSession);
  const [camera, setCamera] = useState<FacilityCameraView | null>(() => readPhoneCameraPreference(campaignId));
  const current = useRef(camera);
  current.current = camera;
  const viewport = useRef<MapViewport | null>(null);
  const changeCamera = useCallback((next: FacilityCameraView) => {
    const bounded = viewport.current ? clampFacilityCamera(next, model.current, viewport.current, true) : next;
    current.current = bounded;
    setCamera(bounded);
    preferences.change(campaignId, bounded);
  }, [campaignId, preferences]);

  useEffect(() => bindFacilityCameraPreferenceLifecycle(preferences, window, document), [preferences]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      viewport.current = { width: Math.floor(rect.width), height: Math.floor(rect.height) };
      changeCamera(current.current ?? framePhoneFacility(model.current, viewport.current));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [changeCamera]);

  usePhoneMapFocus(focus, model, current, viewport, changeCamera);
  const shownCamera = camera ?? getInitialFacilityCamera({ facilityLevel: 0, rooms: [] });

  return <div className="mobile-facility-map" ref={host}>
    <FacilityCanvas {...props} viewModel={{ ...viewModel, camera: shownCamera }} mobileInput
      onMobileSelection={onMobileSelection} onCameraChange={changeCamera} />
    <button type="button" className="mobile-map-recenter" aria-label="Recenter facility" onClick={() => {
      if (viewport.current) changeCamera(framePhoneFacility(model.current, viewport.current));
    }}>⌖</button>
  </div>;
}
