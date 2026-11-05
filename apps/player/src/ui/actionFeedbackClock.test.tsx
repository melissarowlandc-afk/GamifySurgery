import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { LocalProfileJournal } from "../session/localProfileJournal";
import { createFreshProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { getCommandFeedback, showCommandProblem } from "../diagnostics/problemDiagnostics";
import { cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { syncHarness } from "../session/cloud/syncTestSupport";
import { CloudGameSession } from "../session/cloud/gameSession";

const clock = vi.hoisted(() => ({ advance: null as (() => void) | null }));
vi.mock("../session/facilityClock", () => ({ startFacilityClock: (_browser: unknown, _ms: unknown, _read: unknown, advance: () => void) => { clock.advance = advance; return () => {}; } }));
afterEach(async () => { await cleanupPhoneTests(); showCommandProblem(null); vi.restoreAllMocks(); clock.advance = null; });
const profile = (state: ReturnType<typeof createInitialGameState>) => ({ ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: state.campaignId,
  campaigns: [{ campaignId: state.campaignId, name: "Feedback clock test", status: "resumable" as const, createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs, state }] });

it("keeps automatic ticks quiet while local preparation is pending but explains a player's attempted command", async () => {
  const env = phoneTestDom(), state = createInitialGameState(); state.paused = false; state.facilityLevel = 3; state.encounters = {};
  vi.stubGlobal("indexedDB", {});
  vi.spyOn(LocalProfileJournal, "create").mockReturnValue(new Promise(() => {}));
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  let current!: PrototypeSession, renders = 0;
  const loaded = { profile: profile(state), notice: "Test" };
  function Game() { if (++renders > 50) throw new Error("Pending preparation caused a feedback render loop"); current = usePrototypeSession(loaded); return null; }
  await env.render(<Game />); expect(clock.advance).not.toBeNull();
  const initial = getCommandFeedback();
  await act(async () => clock.advance!()); expect(getCommandFeedback()).toBe(initial);
  await act(async () => current.hireStaff("staff.receptionist"));
  expect(getCommandFeedback()).toMatchObject({ kind: "rejection", message: "Preparing your device save. Try again in a moment." });
  const id = getCommandFeedback()!.id;
  await act(async () => { clock.advance!(); clock.advance!(); });
  expect(getCommandFeedback()!.id).toBe(id);
});

it("does not reissue a player's gate message for an already queued hosted tick", async () => {
  const env = phoneTestDom(), f = await syncHarness();
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  expect(await f.coordinator.open()).toBe(true); await f.coordinator.startWriter(); f.coordinator.resume();
  const cloud = await CloudGameSession.create(f.coordinator);
  let current!: PrototypeSession, renders = 0;
  const loaded = { profile: profile(cloud.state), notice: "Test" };
  function Game() { if (++renders > 50) throw new Error("Queued hosted tick caused a feedback render loop"); current = usePrototypeSession(loaded, cloud); return null; }
  try {
    await env.render(<AuthAccountContext.Provider value={f.scope.accountId}><Game /></AuthAccountContext.Provider>);
    await act(async () => f.coordinator.pause());
    await act(async () => clock.advance!()); expect(getCommandFeedback()).toBeNull();
    await act(async () => current.hireStaff("staff.receptionist"));
    const id = getCommandFeedback()!.id; expect(getCommandFeedback()?.kind).toBe("rejection");
    await act(async () => clock.advance!()); expect(getCommandFeedback()!.id).toBe(id);
  } finally { await act(async () => env.root.unmount()); cloud.dispose(); }
});
