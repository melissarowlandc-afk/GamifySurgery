import {
  useEffect,
  useMemo,
  useRef,
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
  isInvitedVerifiedUser,
  isTransientAuthFailure,
  loadHostedSession,
  subscribeToHostedAuth,
} from "./supabaseAuth";
import { AuthAccountActionsContext, AuthAccountContext } from "./AuthAccountContext";
import { ClinicalContentNotice } from "../ui/ClinicalContentNotice";
import { cloudCheckDeadline } from "../session/cloud/checkDeadline";
import { clearAuthCallback, loadAuthPasswordFlow, readAuthCallback, saveAuthPasswordFlow } from "./authPasswordFlow";
import { takeSetupLink } from "./setupLink";
import { SetupAccountForm } from "./SetupAccountForm";
import "../ui/OpeningSequence.css";

interface AuthGateProps {
  children: ReactNode;
}

type AuthScreen = "sign_in" | "invite" | "reset";
const MIN_PASSWORD_LENGTH = 8;
const SIGN_IN_ERROR = "Sign-in could not be completed. Check your email and password, or contact the owner for an invitation.";
const LINK_ERROR = "This invitation or recovery link is invalid or has expired. Contact the person who invited you for a new link.";
const RECOVERY_HELP = "Contact the person who invited you and ask them to email you a password-reset link. Open that link to choose a new password.";
const SESSION_ERROR = "Your account session could not be verified. Sign in again, or try later if the account service is unavailable.";
const AUTH_RETRY_DELAYS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000];

function requestError(error: unknown): string {
  const details = error as { code?: string; status?: number } | null;
  if (details?.status === 429 || details?.code === "over_email_send_rate_limit" || details?.code === "over_request_rate_limit") {
    return "Too many requests. Wait a few minutes before trying again.";
  }
  if (details?.code === "weak_password") {
    return `Choose a less common password or passphrase of at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "That request could not be completed. Try again, or contact the owner if it continues.";
}

export function AuthGate({ children }: AuthGateProps) {
  // Capture/scrub before mounting hosted-auth code so no request can start
  // while the setup token is still present in the URL.
  const [setupLink, setSetupLink] = useState(takeSetupLink);
  return <HostedAuthGate setupLink={setupLink} clearSetupLink={() => setSetupLink(null)}>{children}</HostedAuthGate>;
}

function HostedAuthGate({ children, setupLink, clearSetupLink }: AuthGateProps & { setupLink: ReturnType<typeof takeSetupLink>; clearSetupLink: () => void }) {
  // Supabase clears the callback fragment during initialization.
  const callback = useMemo(readAuthCallback, []);
  const callbackFlowRef = useRef(callback.hasError ? null : callback.flow);
  const signOutGuard = useRef<(() => Promise<void>) | null>(null);
  const hostedConfiguration = useMemo(hostedAuthConfiguration, []);
  const authClient = useMemo(() => getSupabaseAuthClient(hostedConfiguration), [hostedConfiguration]);
  const bypassEnabled = localPrototypeBypassEnabled();
  const [localSession, setLocalSession] = useState(loadPrototypeAccessSession);
  const [candidateSession, setCandidateSession] = useState<Session | null>(null);
  const [hostedSession, setHostedSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(authClient !== null);
  const [sessionCheckUnavailable, setSessionCheckUnavailable] = useState(false);
  const [screen, setScreen] = useState<AuthScreen>(callback.hasError ? "sign_in" : callback.flow ?? "sign_in");
  const [linkErrorBlocking, setLinkErrorBlocking] = useState(callback.hasError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(callback.hasError ? LINK_ERROR : null);
  const [shellOwnsSignOut, setShellOwnsSignOut] = useState(false);

  useEffect(() => {
    if (!authClient) return;
    let active = true;
    let authEventReceived = false;
    // Subscribe before loading so a late getSession result cannot replace a
    // newer sign-out, invitation, recovery or another account's auth event.
    const unsubscribe = subscribeToHostedAuth(authClient, (event, session) => {
      if (!active) return;
      authEventReceived = true;
      if (event === "PASSWORD_RECOVERY" && session) {
        saveAuthPasswordFlow(session.user.id, "reset");
        setScreen("reset");
        setPassword("");
        setMessage(null);
      }
      setCandidateSession(session ? { ...session } : null);
      setCheckingSession(session !== null);
      if (!session) {
        setHostedSession(null);
        setScreen("sign_in");
        setPassword("");
        if (callbackFlowRef.current) {
          setMessage(LINK_ERROR);
          callbackFlowRef.current = null;
        }
      }
      // Never await/call another auth API inside this provider callback.
    });
    void cloudCheckDeadline(loadHostedSession(authClient)).then((session) => {
      if (!active || authEventReceived) return;
      setCandidateSession(session);
      if (!session) {
        setCheckingSession(false);
        if (callback.flow) setMessage(LINK_ERROR);
      }
    }).catch(() => {
      if (!active || authEventReceived) return;
      setCheckingSession(false);
      setMessage(callback.flow ? LINK_ERROR : SESSION_ERROR);
    });
    return () => { active = false; unsubscribe(); };
  }, [authClient, callback.flow]);

  useEffect(() => {
    if (!authClient || !candidateSession) return;
    setSessionCheckUnavailable(false);
    let active = true;
    let finished = false;
    let inFlight = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const flow = callbackFlowRef.current ?? loadAuthPasswordFlow(candidateSession.user.id);
    callbackFlowRef.current = null;
    if (flow) {
      saveAuthPasswordFlow(candidateSession.user.id, flow);
      setScreen(flow);
    }
    // getSession is only a browser cache. Check the user with the Auth server
    // before admission, including restored sessions, expiration and bans.
    const rejectSession = () => {
      finished = true;
      setHostedSession(null);
      setCandidateSession(null);
      setCheckingSession(false);
      setMessage(SESSION_ERROR);
      // Clear rejected credentials from the browser as well as the gate.
      void authClient.auth.signOut({ scope: "local" }).catch(() => {});
    };
    const retry = () => {
      if (!active || finished) return;
      setSessionCheckUnavailable(true);
      setCheckingSession(true);
      timer = setTimeout(() => { timer = undefined; void verify(); },
        AUTH_RETRY_DELAYS[Math.min(attempts++, AUTH_RETRY_DELAYS.length - 1)]);
    };
    const verify = async () => {
      if (!active || finished || inFlight) return;
      inFlight = true;
      try {
        const { data, error } = await cloudCheckDeadline(authClient.auth.getUser(candidateSession.access_token));
        if (!active) return;
        if (error && isTransientAuthFailure(error)) { retry(); return; }
        if (error || !data.user || !isInvitedVerifiedUser(data.user) || data.user.id !== candidateSession.user.id) {
          rejectSession();
        } else {
          finished = true;
          setSessionCheckUnavailable(false);
          setHostedSession({ ...candidateSession, user: data.user });
          setCheckingSession(false);
        }
      } catch (error) {
        if (!active) return;
        if (isTransientAuthFailure(error)) retry(); else rejectSession();
      } finally { inFlight = false; }
    };
    const online = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      void verify();
    };
    window.addEventListener("online", online);
    void verify();
    return () => {
      active = false;
      if (timer !== undefined) clearTimeout(timer);
      window.removeEventListener("online", online);
    };
  }, [authClient, candidateSession]);

  const signOut = async () => {
    if (!authClient || pending) return;
    setPending(true);
    setMessage(null);
    try {
      await signOutGuard.current?.();
      const { error } = await authClient.auth.signOut({ scope: "local" });
      if (error) { setMessage(requestError(error)); return false; }
      if (hostedSession) saveAuthPasswordFlow(hostedSession.user.id, null);
      setHostedSession(null);
      setCandidateSession(null);
      setCheckingSession(false);
      setScreen("sign_in");
      setPassword("");
      return true;
    } catch (error) {
      setMessage(requestError(error));
      return false;
    } finally { setPending(false); }
  };

  const passwordScreen = screen === "invite" || screen === "reset";
  const admittedSession = hostedSession && hostedSession.user.id === candidateSession?.user.id ? hostedSession : null;
  const setupLinkMatchesSession = Boolean(setupLink && admittedSession?.user.email?.trim().toLowerCase() === setupLink.email);
  // Password callbacks take precedence over an authenticated session. A
  // remembered local access flag is honored only when bypass is still enabled.
  if ((!passwordScreen && !linkErrorBlocking && admittedSession && (!setupLink || setupLinkMatchesSession)) || (!authClient && !hostedConfiguration && bypassEnabled && localSession && !setupLink)) {
    return (
      <AuthAccountContext.Provider key={admittedSession?.user.id ?? "local_prototype"} value={admittedSession?.user.id ?? null}>
        <AuthAccountActionsContext.Provider value={authClient && admittedSession ? {
          email: admittedSession.user.email ?? "", signOut, signOutGuard, pending, message, setShellOwnsSignOut,
        } : null}>
        {children}
        {authClient && admittedSession && !shellOwnsSignOut ? (
          <>
            <button className="auth-signout-button" type="button" disabled={pending} onClick={() => void signOut()}>
              {pending ? "Signing out…" : "Sign out"}
            </button>
            {message ? <p className="auth-message" role="alert">{message}</p> : null}
          </>
        ) : null}
        </AuthAccountActionsContext.Provider>
      </AuthAccountContext.Provider>
    );
  }

  // A setup fragment is already scrubbed before HostedAuthGate mounts. Let a
  // restored session finish server verification before deciding whether to
  // admit it or show the setup form. A different account remains untouched.
  if (setupLink && !checkingSession && !setupLinkMatchesSession) {
    return <SetupAccountForm link={setupLink} onComplete={clearSetupLink} onReturn={clearSetupLink} />;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authClient || pending) return;
    setPending(true);
    setMessage(null);
    try {
      if (passwordScreen) {
        if (!admittedSession) { setMessage(LINK_ERROR); return; }
        if (password.length < MIN_PASSWORD_LENGTH) {
          setMessage(`Use a password or passphrase of at least ${MIN_PASSWORD_LENGTH} characters.`);
          return;
        }
        const { error } = await authClient.auth.updateUser({ password });
        if (error) { setMessage(requestError(error)); return; }
        saveAuthPasswordFlow(admittedSession.user.id, null);
        clearAuthCallback();
        setScreen("sign_in");
        setLinkErrorBlocking(false);
        setPassword("");
        return;
      }
      const { data, error } = await authClient.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.session || !isInvitedVerifiedUser(data.session.user)) {
        setMessage(error?.status === 429 ? requestError(error) : SIGN_IN_ERROR);
        return;
      }
      setCandidateSession(data.session);
      clearAuthCallback();
      setCheckingSession(true);
      setLinkErrorBlocking(false);
      setPassword("");
    } catch (error) {
      setMessage(screen === "sign_in" ? SIGN_IN_ERROR : requestError(error));
    } finally { setPending(false); }
  };

  if (checkingSession && !linkErrorBlocking) {
    return (
      <main className="opening-screen auth-gate-screen">
        <section className="founder-creator auth-gate-card" role="status">
          <span className="opening-wordmark">Stitchin&apos; Time</span><h1>Checking your sign-in…</h1>
          {sessionCheckUnavailable ? <>
            <p role="alert">Your sign-in could not be verified. Check your connection. This app will retry automatically.</p>
            <button type="button" className="button button-secondary" onClick={() => window.location.reload()}>Reload app</button>
          </> : null}
          <ClinicalContentNotice />
        </section>
      </main>
    );
  }

  return (
    <main className="opening-screen auth-gate-screen">
      <section className="founder-creator auth-gate-card">
        <span className="opening-wordmark">Stitchin&apos; Time</span>
        <ClinicalContentNotice />
        <h1>{screen === "invite" ? "Set Your Password" : screen === "reset" ? "Choose New Password" : authClient ? "Sign In" : "Local Prototype"}</h1>
        {authClient ? (
          <form className="auth-form" onSubmit={submit}>
            <p>Access is by owner invitation. Open your invitation email to set your first password.</p>
            {!passwordScreen ? (
              <label>Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            ) : null}
            <label>Password<input type="password" autoComplete={screen === "sign_in" ? "current-password" : "new-password"}
              minLength={passwordScreen ? MIN_PASSWORD_LENGTH : undefined} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {passwordScreen ? <small>Use at least {MIN_PASSWORD_LENGTH} characters. Spaces, paste and password managers are welcome.</small> : null}
            {message ? <p className="auth-message" role="alert">{message}</p> : null}
            <button className="opening-choice opening-choice-primary" type="submit" disabled={pending || (passwordScreen && !admittedSession)}>
              {pending ? "Working…" : screen === "invite" ? "Set password" : screen === "reset" ? "Update password" : "Sign in"}
            </button>
            <div className="auth-mode-links">
              {screen !== "sign_in" ? (
                <button className="text-button" type="button" disabled={pending} onClick={() => {
                  if (passwordScreen && admittedSession) { void signOut(); return; }
                  setScreen("sign_in"); setMessage(null); setPassword("");
                }}>Return to sign in</button>
              ) : (
                <button className="text-button" type="button" disabled={pending} onClick={() => { setMessage(RECOVERY_HELP); setPassword(""); }}>Forgot password?</button>
              )}
            </div>
            <small>Email is used only for invitations, verification, sign-in, recovery, security notices and duplicate-account control. It is not used for advertising or marketing.</small>
            <small>Beta 1 campaigns stay in this browser on this device. Signing in on another device, browser profile or site address starts a separate campaign list. Cloud saves come in Beta 2.</small>
          </form>
        ) : (
          <>
            <p>This build has no hosted account service configured. Continue with the explicit browser-local testing profile.</p>
            {bypassEnabled && !hostedConfiguration ? (
              <button className="opening-choice opening-choice-primary" type="button" onClick={() => {
                const next = createLocalPrototypeSession(); savePrototypeAccessSession(next); setLocalSession(next);
              }}>Enter Local Prototype</button>
            ) : <p role="alert">Local bypass is disabled and Supabase configuration is missing or invalid. Contact the owner.</p>}
            <small>No email or password is stored by the local prototype. Clinics remain in this browser.</small>
          </>
        )}
      </section>
    </main>
  );
}
