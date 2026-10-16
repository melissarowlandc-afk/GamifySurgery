import type { HostedAuthConfiguration } from "./prototypeAuth";

export interface PersonalSetupLink { email: string; code: string; invalid: boolean }
export const USED_SETUP_LINK = "This link has already been used — sign in, or ask the person who invited you for a new link.";
export const INVALID_SETUP_LINK = "The link is invalid or was cancelled.";

/** Run before constructing Supabase or making ANY request. Never persist the code. */
export function takeSetupLink(): PersonalSetupLink | null {
  if (typeof window === "undefined") return null;
  const fragment = new URLSearchParams((window.location.hash ?? "").replace(/^#/, ""));
  if (!fragment.has("setup")) return null;
  const code = fragment.get("setup") ?? "";
  const email = (fragment.get("email") ?? "").trim().toLowerCase();
  let invalid = fragment.getAll("setup").length !== 1 || fragment.getAll("email").length !== 1 ||
    !/^[A-Za-z0-9_-]{43}$/.test(code) || email.length > 254 ||
    !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email);
  try {
    const url = new URL(window.location.href);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
  } catch {
    // If history cannot scrub the URL, fail closed before any request.
    invalid = true;
  }
  return { email, code, invalid };
}

export async function claimPersonalSetupLink(
  configuration: HostedAuthConfiguration,
  link: PersonalSetupLink,
  password: string,
  fetchImpl: typeof fetch = fetch,
): Promise<"ok" | "used_link" | "invalid_link" | "invalid_password" | "unavailable"> {
  if (link.invalid) return "invalid_link";
  try {
    const response = await fetchImpl(`${configuration.supabaseUrl.replace(/\/$/, "")}/functions/v1/claim-setup-link`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: configuration.supabaseAnonKey },
      body: JSON.stringify({ email: link.email, code: link.code, password }),
      signal: AbortSignal.timeout(60_000), credentials: "omit", cache: "no-store", redirect: "error",
    });
    const value: unknown = await response.json();
    if (!value || typeof value !== "object") return "unavailable";
    const body = value as { ok?: unknown; error?: unknown };
    if (response.ok && body.ok === true) return "ok";
    if (response.status === 409 && body.error === "used_link") return "used_link";
    if (response.status === 400 && body.error === "invalid_link") return "invalid_link";
    if (response.status === 400 && body.error === "invalid_password") return "invalid_password";
    return "unavailable";
  } catch { return "unavailable"; }
}
