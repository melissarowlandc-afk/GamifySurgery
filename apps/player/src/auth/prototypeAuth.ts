export const PROTOTYPE_ACCESS_STORAGE_KEY =
  "gamify-surgery.prototype.access.v1";

export interface PrototypeAccessSession {
  mode: "local_prototype";
  issuedAtRealMs: number;
  expiresAtRealMs: number;
}

const LOCAL_ACCESS_DURATION_MS = 30 * 24 * 60 * 60 * 1_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createLocalPrototypeSession(
  now = Date.now(),
): PrototypeAccessSession {
  return {
    mode: "local_prototype",
    issuedAtRealMs: now,
    expiresAtRealMs: now + LOCAL_ACCESS_DURATION_MS,
  };
}

export function parsePrototypeAccessSession(
  serialized: string | null,
  now = Date.now(),
): PrototypeAccessSession | null {
  if (serialized === null) {
    return null;
  }
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      !isRecord(value) ||
      value.mode !== "local_prototype" ||
      typeof value.issuedAtRealMs !== "number" ||
      typeof value.expiresAtRealMs !== "number" ||
      !Number.isSafeInteger(value.issuedAtRealMs) ||
      !Number.isSafeInteger(value.expiresAtRealMs) ||
      value.issuedAtRealMs < 0 ||
      value.expiresAtRealMs <= now
    ) {
      return null;
    }
    return {
      mode: "local_prototype",
      issuedAtRealMs: value.issuedAtRealMs,
      expiresAtRealMs: value.expiresAtRealMs,
    };
  } catch {
    return null;
  }
}

export function loadPrototypeAccessSession(
  now = Date.now(),
): PrototypeAccessSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parsePrototypeAccessSession(
      window.localStorage.getItem(PROTOTYPE_ACCESS_STORAGE_KEY),
      now,
    );
  } catch {
    return null;
  }
}

export function savePrototypeAccessSession(
  session: PrototypeAccessSession,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(
      PROTOTYPE_ACCESS_STORAGE_KEY,
      JSON.stringify(session),
    );
    return true;
  } catch {
    return false;
  }
}

export interface HostedAuthConfiguration {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function localPrototypeBypassEnabled(): boolean {
  const explicit = import.meta.env.VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS;
  if (explicit === "true") {
    return true;
  }
  if (explicit === "false") {
    return false;
  }
  // A static/local build without owner-controlled Supabase credentials is the
  // approved prototype path. Once hosted credentials exist, bypass must be
  // explicitly enabled.
  return hostedAuthConfiguration() === null;
}

export function hostedAuthConfiguration():
  | HostedAuthConfiguration
  | null {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 0
    ? { supabaseUrl, supabaseAnonKey }
    : null;
}
