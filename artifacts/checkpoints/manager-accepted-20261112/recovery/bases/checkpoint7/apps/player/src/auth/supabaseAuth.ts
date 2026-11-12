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
  return Boolean(user.email && user.email_confirmed_at && user.invited_at && !user.is_anonymous);
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
