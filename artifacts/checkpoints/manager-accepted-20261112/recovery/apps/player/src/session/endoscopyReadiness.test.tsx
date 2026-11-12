import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getEndoscopySetupAccess, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { endoscopyReadyClinic, preparedEndoscopyClinic, stuckRecoveryEndoscopyClinic } from "../../../../packages/game-domain/tests/routine-endoscopy-ready.fixture";
import { createPrototypePlayerView } from "./viewModels";
import { getClinicAlertActionProblem } from "./clinicAlertActions";
import { MobileGoals } from "../mobile/MobileGoals";
import { encodeCloudSnapshot, loadCloudSnapshot } from "./cloud/snapshotCodec";
import { codecTestCampaign } from "./cloud/codecTestSupport";

const goals = (clinic: ReturnType<typeof endoscopyReadyClinic>) => createPrototypePlayerView(clinic.state, null, false, null).progression;

describe("endoscopy setup tells the player what can actually block a first visit", () => {
  it("shows the appointments switch as missing, with its existing Manage location", () => {
    const clinic = endoscopyReadyClinic({ appointments: false }), view = goals(clinic);
    expect(view.endoscopySetupRequirements?.find(row => row.id === "endoscopy.setup.appointments")).toMatchObject({
      met: false, detail: expect.stringContaining("Manage > Services"),
    });
    const markup = renderToStaticMarkup(<MobileGoals view={view} onLevelUp={() => {}} onSetupAction={() => {}} />);
    expect(markup).toContain("Scheduled appointments"); expect(markup).toContain("Missing");
  });
  it("shows the missing public Recovery path and keeps its fix-access action enabled", () => {
    const clinic = endoscopyReadyClinic({ chain: "recovery-through-endoscopy" }), view = goals(clinic);
    expect(view.endoscopySetupRequirements?.find(row => row.id === "endoscopy.setup.room.periop_recovery")).toMatchObject({
      met: false, detail: expect.stringContaining("without crossing another treatment room"),
    });
    expect(view.endoscopySetupRequirements?.find(row => row.id === "endoscopy.setup.provider")?.detail).toBe("Endoscopist hired.");
    expect(getClinicAlertActionProblem(clinic.state, { kind: "restore_access", roomId: "ready.recovery" })).toBeNull();
    const markup = renderToStaticMarkup(<MobileGoals view={view} onLevelUp={() => {}} onSetupAction={() => {}} />);
    expect(markup).toContain("continuous hallway and doors");
  });
  it("accepts founder coverage through the operation's own Periop room", () => {
    const clinic = endoscopyReadyClinic({ chain: "endoscopy-through-recovery", provider: false });
    expect(goals(clinic).endoscopySetupRequirements?.every(row => row.met)).toBe(true);
    expect(getEndoscopySetupAccess(clinic.state, PROTOTYPE_DOMAIN_CONTEXT).founderCanReach).toBe(true);
  });
  it.each(["founder route", "dead-end bed"] as const)("preserves a prepared %s snapshot exactly, then starts after a local reopen", async scenario => {
    const clinic = scenario === "founder route" ? preparedEndoscopyClinic() : stuckRecoveryEndoscopyClinic();
    expect(clinic.state.serviceOperations.some(op => op.phaseIndex === 0 && op.status === "waiting_for_next_phase")).toBe(true);
    const source = serializeGameState(clinic.state), campaign = codecTestCampaign(source);
    const encoded = await encodeCloudSnapshot({ state: clinic.state, campaign, lineage: { branchId: "synthetic.endoscopy", sequence: 1, parents: [] } });
    const loaded = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
    expect(JSON.parse(serializeGameState(loaded.state))).toEqual(JSON.parse(source));
    clinic.restore(loaded.state); clinic.advance(scenario === "founder route" ? 40 : 160);
    expect(clinic.state.serviceOperations.some(op => op.incomeLineId === "income.endoscopy" && op.phaseIndex === 1 && op.phaseStartedAtFacilityTick !== null)).toBe(true);
  });
  it("keeps installed staff Ready while they perform finite training", () => {
    const clinic = endoscopyReadyClinic({ trainingRoom: true }); clinic.advance(110);
    for (const employee of clinic.state.employees) clinic.dispatch({ type: "TRAIN_EMPLOYEE", employeeId: employee.id });
    clinic.advance(2);
    expect(goals(clinic).endoscopySetupRequirements?.every(row => row.met)).toBe(true);
  });
});
