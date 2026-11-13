import { afterEach, expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import { RuntimeCatalogueRequired } from "../mobile/performance/runtimeCatalogue";
import { appendLocalCampaign, createFreshProfile, loadPrototypeProfile, savePrototypeProfileResult, PROTOTYPE_PROFILE_KEY, LEGACY_PROTOTYPE_SAVE_KEY } from "./prototypeStorage";

vi.mock("@gamify-surgery/game-domain", async () => {
  const actual = await vi.importActual<typeof domain>("@gamify-surgery/game-domain");
  return { ...actual, deserializeGameState: vi.fn(actual.deserializeGameState) };
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it.each(["profile", "legacy"])("preserves %s bytes and propagates missing catalogue data instead of skipping the clinic", kind => {
  const values = new Map<string, string>();
  vi.stubGlobal("window", { localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } });
  const state = domain.createInitialGameState(), created = appendLocalCampaign(createFreshProfile(), state.founder, "Public reload", 0);
  expect(savePrototypeProfileResult(created.profile).ok).toBe(true);
  if (kind === "legacy") { values.delete(PROTOTYPE_PROFILE_KEY); values.set(LEGACY_PROTOTYPE_SAVE_KEY, domain.serializeGameState(created.campaign.state)); }
  const before = [...values];
  vi.mocked(domain.deserializeGameState).mockImplementationOnce(() => { throw new RuntimeCatalogueRequired(0); });
  expect(() => loadPrototypeProfile()).toThrow(RuntimeCatalogueRequired);
  expect([...values]).toEqual(before);
});
