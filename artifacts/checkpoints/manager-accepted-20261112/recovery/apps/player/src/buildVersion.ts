/** Platform-neutral constants: diagnostics and workers must not import JSX/HMR. */
export const APP_VERSION = "0.1.0-beta.1";
declare const __PLAYER_BUILD_DATE__: string;
export const APP_BUILD_DATE = typeof __PLAYER_BUILD_DATE__ === "string" ? __PLAYER_BUILD_DATE__ : "development";
export const APP_BUILD_VERSION = `${APP_VERSION}+${APP_BUILD_DATE}`;
