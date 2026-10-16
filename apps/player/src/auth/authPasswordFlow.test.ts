import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAuthCallback, readAuthCallback } from "./authPasswordFlow";

afterEach(() => vi.unstubAllGlobals());
describe("password callback URL handling", () => {
  it.each(["invite", "recovery"])("recognizes %s before the provider consumes the fragment", type => {
    vi.stubGlobal("window", { location: new URL(`https://melissarowlandc-afk.github.io/GamifySurgery/#type=${type}&access_token=synthetic`) });
    expect(readAuthCallback()).toEqual({ flow: type === "invite" ? "invite" : "reset", hasError: false });
  });

  it("clears handled auth errors/tokens while preserving the Pages path and phone layout", () => {
    const replaceState = vi.fn();
    vi.stubGlobal("window", {
      location: new URL("https://melissarowlandc-afk.github.io/GamifySurgery/?layout=phone&error_code=otp_expired#type=invite&access_token=synthetic"),
      history: { state: { fixture: true }, replaceState },
    });
    expect(readAuthCallback().hasError).toBe(true);
    clearAuthCallback();
    expect(replaceState).toHaveBeenCalledExactlyOnceWith({ fixture: true }, "", "/GamifySurgery/?layout=phone");
  });

  it("leaves unrelated query parameters and anchors intact", () => {
    const replaceState = vi.fn();
    vi.stubGlobal("window", { location: new URL("http://127.0.0.1:4173/?layout=desktop#help"), history: { state: null, replaceState } });
    clearAuthCallback();
    expect(replaceState).toHaveBeenCalledWith(null, "", "/?layout=desktop#help");
  });
});
