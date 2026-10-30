import { APP_VERSION, APP_BUILD_DATE } from "./buildVersion";
export { APP_VERSION, APP_BUILD_DATE, APP_BUILD_VERSION } from "./buildVersion";

export function VersionLabel() {
  return <small className="beta-version">Version {APP_VERSION} · Build {APP_BUILD_DATE}</small>;
}
