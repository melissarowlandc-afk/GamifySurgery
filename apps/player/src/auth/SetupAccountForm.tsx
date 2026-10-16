import { useRef, useState, type FormEvent } from "react";
import { ClinicalContentNotice } from "../ui/ClinicalContentNotice";
import { hostedAuthConfiguration } from "./prototypeAuth";
import { saveAuthPasswordFlow } from "./authPasswordFlow";
import { getSupabaseAuthClient, isInvitedVerifiedUser } from "./supabaseAuth";
import { claimPersonalSetupLink, INVALID_SETUP_LINK, USED_SETUP_LINK, type PersonalSetupLink } from "./setupLink";

export function SetupAccountForm({ link, onComplete, onReturn }: {
  link: PersonalSetupLink; onComplete: () => void; onReturn: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [reset, setReset] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(link.invalid ? INVALID_SETUP_LINK : null);
  const [blocked, setBlocked] = useState(link.invalid);
  const claimed = useRef(false);
  const submitting = useRef(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || blocked) return;
    if (password.length < 8 || password.length > 128) { setMessage("Use a password or passphrase of 8–128 characters."); return; }
    if (password !== confirmation) { setMessage("The passwords do not match."); return; }
    const configuration = hostedAuthConfiguration();
    if (!configuration) { setMessage("Account setup is unavailable. Contact the person who invited you."); return; }
    submitting.current = true;
    setPending(true); setMessage(null);
    try {
      if (!claimed.current) {
        const result = await claimPersonalSetupLink(configuration, link, password);
        if (result !== "ok") {
          if (result === "used_link" || result === "invalid_link") {
            setBlocked(true); setPassword(""); setConfirmation("");
            setMessage(result === "used_link" ? USED_SETUP_LINK : INVALID_SETUP_LINK);
          } else if (result === "invalid_password") setMessage("Use a password or passphrase of 8–128 characters.");
          else setMessage("Setup could not be confirmed. Try signing in with the password you chose, or ask the person who invited you for a new link.");
          return;
        }
        claimed.current = true;
      }
      // This is the first client construction/session action on this pathway.
      const client = getSupabaseAuthClient(configuration);
      if (!client) { setMessage("Your password was saved. Return to sign in to continue."); return; }
      const { data, error } = await client.auth.signInWithPassword({ email: link.email, password });
      if (error || !data.session || !isInvitedVerifiedUser(data.session.user)) {
        setMessage("Your password was saved, but sign-in could not be completed. Try again, or return to sign in.");
        return;
      }
      saveAuthPasswordFlow(data.session.user.id, null);
      setPassword(""); setConfirmation(""); onComplete();
    } catch {
      setMessage("Your password was saved, but sign-in could not be completed. Try again, or return to sign in.");
    } finally { submitting.current = false; setPending(false); }
  };
  return <main className="opening-screen auth-gate-screen">
    <section className="founder-creator auth-gate-card">
      <span className="opening-wordmark">Stitchin&apos; Time</span>
      <ClinicalContentNotice />
      <h1>Set up your account</h1>
      <form className="auth-form" onSubmit={submit}>
        <p>Choose your own password. Opening this page does not use your personal link.</p>
        <label>Email<input type="email" autoComplete="email" value={link.email} readOnly /></label>
        <label>Password<input type="password" autoComplete="new-password" minLength={8} maxLength={128} required
          disabled={pending || blocked} value={password} onChange={event => setPassword(event.target.value)} /></label>
        <label>Confirm password<input type="password" autoComplete="new-password" minLength={8} maxLength={128} required
          disabled={pending || blocked} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>
        <small>Use 8–128 characters. Spaces, paste and password managers are welcome.</small>
        {message ? <p className="auth-message" role="alert">{message}</p> : null}
        <button className="opening-choice opening-choice-primary" type="submit" disabled={pending || blocked}>
          {pending ? "Working…" : claimed.current ? "Sign in" : reset ? "Set new password" : "Create account"}
        </button>
        <div className="auth-mode-links">
          {!claimed.current && !blocked ? <button className="text-button" type="button" disabled={pending}
            onClick={() => setReset(value => !value)}>{reset ? "I'm setting up a new account" : "I'm resetting my password"}</button> : null}
          <button className="text-button" type="button" disabled={pending} onClick={onReturn}>Return to sign in</button>
        </div>
        <small>Email is used only for invitations, verification, sign-in, recovery, security notices and duplicate-account control. It is not used for advertising or marketing.</small>
        <small>Beta 1 campaigns stay in this browser on this device. Signing in on another device, browser profile or site address starts a separate campaign list. Cloud saves come in Beta 2.</small>
      </form>
    </section>
  </main>;
}
