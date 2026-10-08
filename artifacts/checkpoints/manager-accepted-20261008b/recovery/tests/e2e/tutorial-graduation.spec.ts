import { expect, test } from "@playwright/test";
import { getProfile, setFastFacilitySpeed, startClinic } from "./helpers";
import {
  buildTutorialExam, expectCampaignGuidance, expectNoMandatoryCoachClicks,
  finishProtectedVisits, protectedVisitIds, reloadTutorialCampaign, tutorialState,
} from "./tutorial-helpers";

for (const scenario of [
  {name: "all wrong", answers: [false, false, false]},
  {name: "mixed", answers: [false, true, false]},
  {name: "all correct", answers: [true, true, true]},
]) {
  test(`a fresh ${scenario.name} first shift graduates through native clinic actions`, async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "Natural full-campaign canvas proof runs at desktop width.");
    testInfo.setTimeout(300_000);
    const clinicName = `Tutorial Graduation ${scenario.name}`;
    await startClinic(page, "Graduation Founder", clinicName);
    expect((await tutorialState(page)).rooms.map((room) => room.roomDefinitionId)).toEqual(["room.front_desk"]);
    await setFastFacilitySpeed(page);
    await expectNoMandatoryCoachClicks(page);
    const filed = await finishProtectedVisits(page, scenario.answers);
    const frozen = protectedVisitIds.map((id) => filed.encounters[id]!.frozenCase);
    const answers = protectedVisitIds.map((id) => filed.encounters[id]!.answers);
    const settlements = filed.settlements.filter((settlement) => protectedVisitIds.includes(settlement.encounterId as typeof protectedVisitIds[number]));
    expect(settlements).toHaveLength(2);
    expect(Object.values(filed.learningHistories).flatMap((history) => history.reviews)).toHaveLength(3);
    if (scenario.name === "all wrong") expect(filed.clinicalXp).toBe(6);

    const examId = await buildTutorialExam(page, scenario.name === "all wrong");
    await expect(page.locator(".tutorial-coach")).toHaveAttribute("data-tutorial-step", "advance-level");
    await expect(page.getByRole("button", {name: "Advance to Level 1"})).toBeEnabled();
    await expectCampaignGuidance(page, "guided");
    const beforeAdvance = await tutorialState(page);
    await page.getByRole("button", {name: "Advance to Level 1"}).click();
    await expect.poll(async () => (await tutorialState(page)).facilityLevel).toBe(1);
    await expect(page.locator(".tutorial-coach")).toHaveCount(0);
    await expectNoMandatoryCoachClicks(page);
    await expectCampaignGuidance(page, "complete");
    expect((await getProfile(page)).tutorialsEnabled).toBe(true);

    await reloadTutorialCampaign(page, clinicName);
    const restored = await tutorialState(page);
    expect(restored.facilityLevel).toBe(1);
    expect(restored.rooms.find((room) => room.id === examId)?.roomDefinitionId).toBe("room.examination");
    expect(restored.doors.some((door) => door.roomId === examId && !door.exterior)).toBe(true);
    expect(protectedVisitIds.map((id) => restored.encounters[id]!.frozenCase)).toEqual(frozen);
    expect(protectedVisitIds.map((id) => restored.encounters[id]!.answers)).toEqual(answers);
    expect(restored.settlements.filter((settlement) => protectedVisitIds.includes(settlement.encounterId as typeof protectedVisitIds[number]))).toEqual(settlements);
    expect(restored.learningHistories).toEqual(beforeAdvance.learningHistories);
    await expect(page.locator(".tutorial-coach")).toHaveCount(0);
  });
}
