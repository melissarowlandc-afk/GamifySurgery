import {
  createFacilityCameraPreferenceSession, FACILITY_CAMERA_PREFERENCE_KEY,
  facilityCameraPreferenceKey, readFacilityCameraPreference,
} from "../../session/facilityCameraPreference";

export const PHONE_CAMERA_PREFERENCE_KEY = "gamify-surgery.prototype.phone-facility-camera.v1";
type CameraStorage = Pick<Storage, "getItem" | "setItem">;
function browserStorage(): CameraStorage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
}
export const phoneCameraPreferenceKey = (campaignId: string) =>
  facilityCameraPreferenceKey(campaignId).replace(FACILITY_CAMERA_PREFERENCE_KEY, PHONE_CAMERA_PREFERENCE_KEY);

/** Reuse the existing validation/schema/debounce, with a strictly separate store. */
function phoneStorage(storage: CameraStorage | null): CameraStorage | null {
  if (!storage) return null;
  const key = (desktopKey: string) => desktopKey.replace(FACILITY_CAMERA_PREFERENCE_KEY, PHONE_CAMERA_PREFERENCE_KEY);
  return { getItem: (desktopKey) => storage.getItem(key(desktopKey)),
    setItem: (desktopKey, value) => storage.setItem(key(desktopKey), value) };
}
export const readPhoneCameraPreference = (campaignId: string, storage: CameraStorage | null = browserStorage()) =>
  readFacilityCameraPreference(campaignId, phoneStorage(storage));
export const createPhoneCameraPreferenceSession = (storage: CameraStorage | null = browserStorage()) =>
  createFacilityCameraPreferenceSession(phoneStorage(storage));
