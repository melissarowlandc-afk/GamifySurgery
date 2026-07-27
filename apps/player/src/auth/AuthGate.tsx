import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  createLocalPrototypeSession,
  hostedAuthConfiguration,
  loadPrototypeAccessSession,
  localPrototypeBypassEnabled,
  savePrototypeAccessSession,
} from "./prototypeAuth";
import {
  getSupabaseAuthClient,
  loadHostedSession,
  subscribeToHostedAuth,
} from "./supabaseAuth";
import "../ui/OpeningSequence.css";

interface AuthGateProps {
  children: ReactNode;
}

type AuthScreen = "sign_in" | "register" | "recovery" | "reset";

const GENERIC_AUTH_ERROR =
  "That request could not be completed. Check the details and try again.";

export function AuthGate({ children }: AuthGateProps) {
  const hostedConfiguration = useMemo(
    () => hostedAuthConfiguration(),
    [],
  );
  const authClient = useMemo(
    () => getSupabaseAuthClient(hostedConfiguration),
    [hostedConfiguration],
  );
  const bypassEnabled = localPrototypeBypassEnabled();
  const [localSession, setLocalSession] = useState(
    loadPrototypeAccessSession,
  );
  const [hostedSession, setHostedSession] =
    useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(
    authClient !== null,
  );
  const [screen, setScreen] = useState<AuthScreen>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authClient) {
      setCheckingSession(false);
      return;
    }
    let active = true;
    void loadHostedSession(authClient).then((session) => {
      if (!active) {
        return;
      }
      setHostedSession(session);
      setCheckingSession(false);
    });
    const unsubscribe = subscribeToHostedAuth(
      authClient,
      (event, session) => {
        if (!active) {
          return;
        }
        if (event === "PASSWORD_RECOVERY") {
          setScreen("reset");
        }
        setHostedSession(session);
        setCheckingSession(false);
      },
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [authClient]);

  if (
    (hostedSession &&
      hostedSession.user.email_confirmed_at !== undefined) ||
    (!authClient && localSession)
  ) {
    return (
      <>
        {children}
        {authClient && hostedSession ? (
          <button
            className="auth-signout-button"
            type="button"
            onClick={() => void authClient.auth.signOut()}
          >
            Sign out
          </button>
        ) : null}
      </>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authClient) {
      return;
    }
    setPending(true);
    setMessage(null);
    try {
      if (screen === "register") {
        if (password.length < 15) {
          setMessage("Use a password or passphrase of at least 15 characters.");
          return;
        }
        const { data, error } = await authClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
          },
        });
        if (error) {
          setMessage(GENERIC_AUTH_ERROR);
          return;
        }
        if (data.session?.user.email_confirmed_at) {
          setHostedSession(data.session);
        } else {
          setMessage(
            "Check your email to verify the invited account, then return here to sign in.",
          );
          setScreen("sign_in");
          setPassword("");
        }
        return;
      }
      if (screen === "recovery") {
        const { error } = await authClient.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
          },
        );
        setMessage(
          error
            ? GENERIC_AUTH_ERROR
            : "If that invited account exists, a recovery email is on its way.",
        );
        return;
      }
      if (screen === "reset") {
        if (password.length < 15) {
          setMessage("Use a password or passphrase of at least 15 characters.");
          return;
        }
        const { error } = await authClient.auth.updateUser({
          password,
        });
        setMessage(
          error
            ? GENERIC_AUTH_ERROR
            : "Password updated. Your clinic is ready.",
        );
        return;
      }
      const { data, error } =
        await authClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
      if (
        error ||
        !data.session ||
        !data.session.user.email_confirmed_at
      ) {
        setMessage(GENERIC_AUTH_ERROR);
        return;
      }
      setHostedSession(data.session);
    } finally {
      setPending(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="opening-screen auth-gate-screen">
        <section className="founder-creator auth-gate-card" role="status">
          <span className="opening-wordmark">Gamify Surgery</span>
          <h1>Checking account…</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="opening-screen auth-gate-screen">
      <section className="founder-creator auth-gate-card">
        <span className="opening-wordmark">Gamify Surgery</span>
        <h1>
          {screen === "register"
            ? "Create Invited Account"
            : screen === "recovery"
              ? "Recover Password"
              : screen === "reset"
                ? "Choose New Password"
                : authClient
                  ? "Sign In"
                  : "Local Prototype"}
        </h1>
        {authClient ? (
          <form className="auth-form" onSubmit={submit}>
            {screen !== "reset" ? (
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            ) : null}
            {screen !== "recovery" ? (
              <label>
                Password
                <input
                  type="password"
                  autoComplete={
                    screen === "sign_in"
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={screen === "sign_in" ? undefined : 15}
                  maxLength={128}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            ) : null}
            {message ? <p className="auth-message">{message}</p> : null}
            <button
              className="opening-choice opening-choice-primary"
              type="submit"
              disabled={pending}
            >
              {pending
                ? "Working…"
                : screen === "register"
                  ? "Create account"
                  : screen === "recovery"
                    ? "Send recovery email"
                    : screen === "reset"
                      ? "Update password"
                      : "Sign in"}
            </button>
            <div className="auth-mode-links">
              {screen !== "sign_in" ? (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setScreen("sign_in");
                    setMessage(null);
                  }}
                >
                  Return to sign in
                </button>
              ) : (
                <>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setScreen("register");
                      setMessage(null);
                    }}
                  >
                    Create invited account
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setScreen("recovery");
                      setMessage(null);
                    }}
                  >
                    Forgot password?
                  </button>
                </>
              )}
            </div>
            {screen === "register" ? (
              <small>
                Email is used only for pilot access, verification, sign-in,
                recovery, security notices, and duplicate-account control—not
                advertising or marketing.
              </small>
            ) : null}
          </form>
        ) : (
          <>
            <p>
              This build has no hosted account service configured. Continue
              with the explicit browser-local testing profile.
            </p>
            {bypassEnabled ? (
              <button
                className="opening-choice opening-choice-primary"
                type="button"
                onClick={() => {
                  const next = createLocalPrototypeSession();
                  savePrototypeAccessSession(next);
                  setLocalSession(next);
                }}
              >
                Enter Local Prototype
              </button>
            ) : (
              <p role="alert">
                Local bypass is disabled and Supabase credentials are missing.
              </p>
            )}
            <small>
              No email or password is stored by the local prototype. Clinics
              remain in this browser.
            </small>
          </>
        )}
      </section>
    </main>
  );
}
