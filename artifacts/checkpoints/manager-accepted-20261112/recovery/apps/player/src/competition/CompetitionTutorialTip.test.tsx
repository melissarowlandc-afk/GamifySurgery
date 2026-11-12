import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { ManagementPanel } from "../ui/ManagementPanel";
import { MobileManage } from "../mobile/manage/MobileManage";
import { createManageFixture } from "../mobile/manage/testFixtures";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { COMPETITION_TIP_JOKE, COMPETITION_TIP_KEY } from "./CompetitionTutorialTip";
import { CompetitionClientContext } from "./useCompetition";

const access = vi.hoisted(() => ({ casual: false as boolean | null }));
vi.mock("../playtime/UsageProvider", () => ({ useCasualMode: () => access.casual, useUsageTracking: () => null }));
afterEach(() => { access.casual = false; return cleanupPhoneTests(); });

function Manage({ shell, campaignId, enabled = true }: { shell: "desktop" | "phone"; campaignId: string; enabled?: boolean }) {
  const p = createManageFixture(), competitionTutorial = { campaignId, enabled };
  return shell === "phone" ? <MobileManage {...p} competitionTutorial={competitionTutorial} /> : <ManagementPanel managementMode roles={p.staffRoles}
    competitionTutorial={competitionTutorial} serviceIncome={p.serviceIncome} onEnterManagementMode={p.onEnterManagementMode} onExitManagementMode={p.onExitManagementMode}
    onHire={p.onHireStaff} onDecreaseSalary={p.onDecreaseEmployeeSalary} onIncreaseSalary={p.onIncreaseEmployeeSalary} onFire={p.onFireEmployee}
    onAppointmentsEnabledChange={p.onServiceAppointmentsEnabledChange} onStartLaboratoryProcessing={p.onStartLaboratoryProcessing} />;
}
describe.each(["desktop", "phone"] as const)("%s competition tutorial", shell => {
  for (const casual of [false, true]) it(`introduces the board with the default joke and ${casual ? "casual" : "ranked"} wording`, async () => {
    access.casual = casual;
    const env = phoneTestDom(), stored = new Map<string, string>(), campaignId = `tip.${shell}.${casual}`;
    Object.assign(env.browser.localStorage, { getItem: (key: string) => stored.get(key) ?? null,
      setItem: vi.fn((key: string, value: string) => { stored.set(key, value); }) });
    const render = (account = "account-tip", id = campaignId) => env.render(<AuthAccountContext.Provider value={account}><CompetitionClientContext.Provider value={null}><Manage shell={shell} campaignId={id} /></CompetitionClientContext.Provider></AuthAccountContext.Provider>);
    await render();
    expect(env.element.textContent).toContain(COMPETITION_TIP_JOKE);
    expect(env.element.textContent).toContain("Clinic Competition in Management");
    expect(env.element.textContent.includes("Casual clinics aren't ranked")).toBe(casual);
    await env.click("View Clinic Competition");
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
    expect(allElements(env.element, node => node.attributes.role === "tab" && node.attributes["aria-selected"] === "true")[0]!.textContent).toBe("Clinic Competition");
    expect(env.element.textContent).toContain("available when signed in");
    expect([...stored.keys()]).toHaveLength(1); expect([...stored.keys()][0]).toContain(COMPETITION_TIP_KEY);
    expect([...stored.values()]).toEqual(["dismissed"]);
    await env.render(null); await render();
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
    await render("account-tip", `${campaignId}.other`); expect(env.element.textContent).toContain(COMPETITION_TIP_JOKE);
    await render("other-account", campaignId); expect(env.element.textContent).toContain(COMPETITION_TIP_JOKE);
  });
  it("persists explicit dismissal across layouts and tolerates blocked storage", async () => {
    const env = phoneTestDom(), campaignId = `tip.dismiss.${shell}`;
    Object.assign(env.browser.localStorage, { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } });
    const render = (layout: "desktop" | "phone") => env.render(<CompetitionClientContext.Provider value={null}><Manage shell={layout} campaignId={campaignId} /></CompetitionClientContext.Provider>);
    await render(shell); await env.click("Dismiss competition tip");
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
    await env.render(null); await render(shell === "phone" ? "desktop" : "phone");
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
  });
  it("stays absent when guidance is off or the server mode is still unknown", async () => {
    const env = phoneTestDom();
    await env.render(<Manage shell={shell} campaignId={`tip.disabled.${shell}`} enabled={false} />);
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
    access.casual = null;
    await env.render(<Manage shell={shell} campaignId={`tip.pending.${shell}`} />);
    expect(env.element.textContent).not.toContain(COMPETITION_TIP_JOKE);
    access.casual = true;
    await env.render(<Manage shell={shell} campaignId={`tip.pending.${shell}`} />);
    expect(env.element.textContent).toContain("Casual clinics aren't ranked");
  });
});
