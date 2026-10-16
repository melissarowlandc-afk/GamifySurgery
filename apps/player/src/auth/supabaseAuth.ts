import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import {
  hostedAuthConfiguration,
  type HostedAuthConfiguration,
} from "./prototypeAuth";

let client: SupabaseClient | null = null;

export function getSupabaseAuthClient(
  configuration: HostedAuthConfiguration | null =
    hostedAuthConfiguration(),
): SupabaseClient | null {
  if (!configuration) {
    return null;
  }
  if (client === null) {
    try {
      client = createClient(
        configuration.supabaseUrl,
        configuration.supabaseAnonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Admin email invitations must also open in another browser/device.
            flowType: "implicit",
          },
        },
      );
    } catch {
      // The gate reports a configuration error without exposing the values.
      return null;
    }
  }
  return client;
}

export async function loadHostedSession(
  authClient: SupabaseClient,
): Promise<Session | null> {
  const { data, error } = await authClient.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

/** These are provider-owned fields, never user-editable user_metadata. */
export function isInvitedVerifiedUser(user: User): boolean {
  const identity = user as User & { deleted_at?: string | null; banned_until?: string | null };
  return Boolean(user.email && user.email_confirmed_at &&
    (user.invited_at || user.app_metadata?.gamify_setup_admitted === true) && !user.is_anonymous &&
    !identity.deleted_at && !(identity.banned_until && Date.parse(identity.banned_until) > Date.now()));
}

/** Availability failures are not evidence that a remembered account is invalid. */
export function isTransientAuthFailure(error: unknown): boolean {
  const details = error as { code?: string; status?: number; name?: string } | null;
  if (!error) return false;
  if (["bad_jwt", "invalid_token", "session_not_found", "user_not_found", "user_banned", "banned", "revoked",
    "not_invited", "email_not_confirmed", "refresh_token_not_found", "refresh_token_already_used", "otp_expired"].includes(details?.code ?? "") ||
    details?.name === "AuthSessionMissingError") return false;
  if (typeof details?.status === "number" && details.status >= 400 && details.status < 500) {
    return details.status === 408 || details.status === 429;
  }
  // Supabase wraps fetch failures as AuthRetryableFetchError (often status 0).
  // Fetch can also reject with TypeError, AbortError or an underlying transport
  // error. Unknown transport exceptions keep the session pending, never admitted.
  return true;
}

export function subscribeToHostedAuth(
  authClient: SupabaseClient,
  onChange: (
    event: AuthChangeEvent,
    session: Session | null,
  ) => void,
): () => void {
  const {
    data: { subscription },
  } = authClient.auth.onAuthStateChange(onChange);
  return () => subscription.unsubscribe();
}
