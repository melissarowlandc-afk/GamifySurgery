export type AuthPasswordFlow = "invite" | "reset";

const PASSWORD_FLOW_KEY = "gamify-surgery.auth.password-flow.v1";

/** Read only flow/error markers, before Supabase consumes the URL fragment. */
export function readAuthCallback(): {
  flow: AuthPasswordFlow | null;
  hasError: boolean;
} {
  if (typeof window === "undefined") return { flow: null, hasError: false };
  const fragment = new URLSearchParams((window.location?.hash ?? "").replace(/^#/, ""));
  const query = new URLSearchParams(window.location?.search ?? "");
  const type = fragment.get("type") ?? query.get("type");
  return {
    flow: type === "invite" ? "invite" : type === "recovery" ? "reset" : null,
    hasError: fragment.has("error") || fragment.has("error_code") ||
      query.has("error") || query.has("error_code"),
  };
}

/** A successfully handled link must not leave an expired error on reload. */
export function clearAuthCallback(): void {
  try {
    const url = new URL(window.location.href);
    const fragment = new URLSearchParams(url.hash.replace(/^#/, ""));
    if (["access_token", "refresh_token", "error", "error_code"].some(key => fragment.has(key)) ||
      ["invite", "recovery"].includes(fragment.get("type") ?? "")) url.hash = "";
    for (const key of ["error", "error_code", "error_description"]) url.searchParams.delete(key);
    if (["invite", "recovery"].includes(url.searchParams.get("type") ?? "")) url.searchParams.delete("type");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Browser history restrictions do not invalidate a completed auth action.
  }
}

// No token, email or password is kept here. A reload must still show the
// unfinished password form after the provider has consumed its callback URL.
export function loadAuthPasswordFlow(accountId: string): AuthPasswordFlow | null {
  try {
    const flow = window.localStorage.getItem(`${PASSWORD_FLOW_KEY}.${accountId}`);
    return flow === "invite" || flow === "reset" ? flow : null;
  } catch {
    return null;
  }
}

export function saveAuthPasswordFlow(accountId: string, flow: AuthPasswordFlow | null): void {
  try {
    const key = `${PASSWORD_FLOW_KEY}.${accountId}`;
    if (flow) window.localStorage.setItem(key, flow);
    else window.localStorage.removeItem(key);
  } catch {
    // Auth still works when browser storage is blocked; keep this tab open.
  }
}
