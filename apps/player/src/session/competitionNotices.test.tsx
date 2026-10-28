import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { createFreshProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import type { CompetitionRankChange } from "../competition/competitionClient";
import { scoredPatientFixture } from "../playtime/usageTestFixtures";

const observe = vi.hoisted(() => vi.fn());
vi.mock("../competition/useCompetition", () => ({ useCompetitionSubmission: observe }));
afterEach(async () => { await cleanupPhoneTests(); observe.mockReset(); });

describe("competition Alerts & Events integration", () => {
  it("adds the hook result to the shared feed without a game command or save, ignoring another campaign", async () => {
    const env = phoneTestDom(), profile = createFreshProfile();
    const state = scoredPatientFixture();
    profile.activeCampaignId = state.campaignId;
    profile.campaigns = [{ campaignId: state.campaignId, name: "Synthetic competition clinic", createdAtRealMs: Date.now(), updatedAtRealMs: Date.now(), status: "resumable", state }];
    let session!: PrototypeSession;
    function Game() { session = usePrototypeSession({ profile, notice: "Synthetic restore" }); return <p>{session.systemNotices.map(n => `${n.title}: ${n.message}`).join("\n")}</p>; }
    await env.render(<Game />);
    const callback = observe.mock.calls.at(-1)![2] as (change: CompetitionRankChange) => void;
    const before = JSON.stringify(session.state), writes = env.browser.localStorage.setItem.mock.calls.length;
    const change = { campaignId: session.state.campaignId, completedDay: 2, message: "You moved up to #2 in Clinic Competition!" };
    await act(async () => callback(change));
    expect(env.element.textContent).toContain(`Clinic Competition: ${change.message}`);
    expect(session.systemNotices.at(-1)).toMatchObject({ definitionId: "alert.system.competition-rank", title: "Clinic Competition", message: change.message, persistent: false });
    expect(JSON.stringify(session.state)).toBe(before);
    expect(env.browser.localStorage.setItem.mock.calls.length).toBe(writes);
    await act(async () => callback({ ...change, campaignId: "other-campaign", message: "Must not appear" }));
    expect(env.element.textContent).not.toContain("Must not appear");
  });
});
