import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
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
    client = createClient(
      configuration.supabaseUrl,
      configuration.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  }
  return client;
}

export async function loadHostedSession(
  authClient: SupabaseClient,
): Promise<Session | null> {
  const { data, error } = await authClient.auth.getSession();
  if (error) {
    return null;
  }
  return data.session;
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
