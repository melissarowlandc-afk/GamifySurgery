export const APP_VERSION = "0.1.0-beta.1";
declare const __PLAYER_BUILD_DATE__: string;
export const APP_BUILD_DATE = typeof __PLAYER_BUILD_DATE__ === "string" ? __PLAYER_BUILD_DATE__ : "development";
export const APP_BUILD_VERSION = `${APP_VERSION}+${APP_BUILD_DATE}`;

export function VersionLabel() {
  return <small className="beta-version">Version {APP_VERSION} · Build {APP_BUILD_DATE}</small>;
}
