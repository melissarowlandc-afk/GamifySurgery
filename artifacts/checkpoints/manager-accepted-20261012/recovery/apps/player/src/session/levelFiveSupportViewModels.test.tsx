import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { advanceEmployeeMovement, advanceLevelThreeSupport, advancePatientAmenityTrips, getAverageEffectiveStaffMorale,
  deserializeGameState, serializeGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { describeRoomUpgradeBenefit } from "./buildModePresentation";
import { phoneFixture, noop } from "../mobile/screenTestUtils";
import { MobileBuildRoom } from "../mobile/build/MobileBuildRoom";
import { MobileStaffOverview, MobileEmployees } from "../mobile/manage/MobileEmployees";
import { StaffPanel } from "../ui/StaffPanel";
import { RoomActionMenu } from "../ui/RoomActionMenu";
import { LevelFiveSupportFacts } from "../ui/LevelFiveSupportFacts";

const original = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
const context = createLevelFiveStateQaContext();
afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = original; });
function fixture() { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; return createLevelFiveStateQaState("support", context); }

describe("M3 shared support presentation on desktop and phone", () => {
  it("renders the same room benefits, upgrade scope and occupied support counts in both Manage presentations", () => {
    const state = fixture(), view = createPrototypePlayerView(state, null, false, null), support = view.serviceIncome.levelFiveSupport;
    expect(support).toMatchObject({ gymBreakCount: 2, gardenRestCount: 2 });
    expect(view.serviceIncome.levelThreeSupport!.staffOnBreakCount).toBe(2);
    for (const mobile of [false, true]) {
      const markup = renderToStaticMarkup(<LevelFiveSupportFacts support={support} mobile={mobile} />);
      for (const label of ["Founder", "Indoor Garden", "Staff Gym", "once per visit", "240-minute", "Per upgrade"]) expect(markup).toContain(label);
    }
    expect(renderToStaticMarkup(<LevelFiveSupportFacts support={undefined} />)).toBe("");
  });
  it.each([
    ["room.founder_office", 2, "Ownership"], ["room.indoor_garden", 2, "Adult visitors"], ["room.staff_gym", 5, "Completed"],
  ])("shows the real base, four increments and current upgrade purchases for %s on both room sheets", (id, base, note) => {
    const state = fixture(), room = state.rooms.find(room => room.roomDefinitionId === id)!;
    for (const tier of [1, 2, 3, 4, 5] as const) {
      room.upgradeLevel = tier;
      const benefit = describeRoomUpgradeBenefit({ roomDefinitionId: id, upgradeLevel: tier, maxUpgradeLevel: 5, upkeepPerLevel: 0 })!;
      expect(benefit.currentLabel).toBe(`+${Number(base) + 2 * (tier - 1)} points`); expect(benefit.note).toContain(String(note));
      expect(benefit.nextLabel).toBe(tier === 5 ? undefined : `+${Number(base) + 2 * tier} points`);
      const view = createPrototypePlayerView(state, null, false, null, true, room.id);
      const phone = renderToStaticMarkup(<MobileBuildRoom props={phoneFixture(view)} room={view.selectedRoomBuild!} onMove={noop} onDoors={noop} />);
      expect(phone).toContain(benefit.currentLabel); expect(phone).toContain(String(note));
      const desktop = renderToStaticMarkup(<RoomActionMenu anchor={null} containerRef={{ current: null }} onEndoscopySetupAction={noop} room={view.selectedRoomBuild!} onUpgrade={noop} onSell={noop} onMove={noop} onDoors={noop} onClose={noop} />);
      expect(desktop).toContain(benefit.currentLabel); expect(desktop).toContain(String(note));
      expect(view.selectedRoomBuild!.canUpgrade).toBe(tier < 5);
    }
  });
  it("projects the same effective staff morale and average to Manage, the map and both shells", () => {
    const state = fixture(); state.rooms.find(room => room.roomDefinitionId === "room.founder_office")!.upgradeLevel = 5;
    const view = createPrototypePlayerView(state, null, false, null);
    for (const employee of state.employees) {
      expect(view.facility.staff.find(staff => staff.instanceId === employee.id)!.morale).toBe(employee.morale + 10);
      expect(view.staffRoles.flatMap(role => role.employees).find(staff => staff.id === employee.id)!.moralePercent).toBe(employee.morale + 10);
    }
    const overview = renderToStaticMarkup(<MobileStaffOverview staffRoles={view.staffRoles} staffTraining={view.staffTraining} />);
    expect(overview).toContain(`${getAverageEffectiveStaffMorale(state)}%`);
    const desktop = renderToStaticMarkup(<StaffPanel roles={view.staffRoles} onHire={noop} onDecreaseSalary={noop} onIncreaseSalary={noop} onFire={noop} />);
    const phone = renderToStaticMarkup(<MobileEmployees {...phoneFixture(view)} highlightedRoleId="staff.app" highlightedEmployeeId="employee.level5.support.app" />);
    expect(desktop).toContain("85%"); expect(phone).toContain("85%");
  });
  it("binds seated garden visitors and seated/standing gym contacts using the approved routes and activity labels", () => {
    const state = fixture();
    expect(describeFacilityCharacter(state, { kind: "patient", id: "encounter.level5.support.0" })!.activity).toBe("Walking to the Indoor Garden");
    let observedGardenSeats = false;
    for (let i = 0; i < 30; i++) {
      state.facilityTick++; advancePatientAmenityTrips(state, context);
      if (state.patientAmenityTrips!.length === 2 && state.patientAmenityTrips!.every(trip => trip.status === "using_amenity")) {
        const view = createPrototypePlayerView(state, null, false, null);
        expect(view.facility.patients!.every(patient => patient.supportRole === "garden-visitor-seat" && patient.seated)).toBe(true);
        expect(view.facility.patients!.map(patient => patient.supportId)).toEqual(["leftSeat", "rightSeat"]);
        expect(describeFacilityCharacter(state, { kind: "patient", id: "encounter.level5.support.0" })!.activity).toContain("satisfaction on completion");
        observedGardenSeats = true; break;
      }
    }
    expect(observedGardenSeats).toBe(true);
    const staffState = fixture(); staffState.encounters = {}; staffState.patientAmenityTrips = [];
    for (let i = 0; i < 80 && staffState.employees.some(employee => employee.pathIndex < employee.path.length - 1); i++) {
      staffState.facilityTick++; advanceLevelThreeSupport(staffState, context); advanceEmployeeMovement(staffState, context);
    }
    const view = createPrototypePlayerView(staffState, null, false, null);
    expect(view.facility.staff.map(employee => employee.supportRole)).toEqual(["gym-rest-contact", "gym-stretch-contact"]);
    expect(view.facility.staff.map(employee => employee.supportId)).toEqual(["benchSeat", "stretchSpot"]);
    expect(describeFacilityCharacter(staffState, { kind: "staff", id: staffState.employees[0]!.id })!.activity).toContain("Gym break");
  });
  it("resumes support QA with the same campaign/work/quotes through both shell URLs", () => {
    fixture(); const profile = prepareLevelFiveQaProfile(createFreshProfile(), "support");
    const state = profile.campaigns[0]!.state; state.cash = 500; state.cashCents = 50000; state.paused = false;
    const resumed = prepareLevelFiveQaProfile(profile, "support"); expect(resumed.campaigns).toHaveLength(1); expect(resumed.campaigns[0]!.state).toBe(state);
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(loaded.patientAmenityTrips).toEqual(state.patientAmenityTrips);
    expect(loaded.employees.map(employee => employee.facilityTask)).toEqual(state.employees.map(employee => employee.facilityTask));
    expect(loaded.cashCents).toBe(50000); expect(loaded.paused).toBe(false);
    expect(createPrototypePlayerView(loaded, null, false, null).facility).toEqual(createPrototypePlayerView(state, null, false, null).facility);
  });
  it("truthfully holds blocked garden actors in both map projections without a moving or seated pose", () => {
    const state = fixture();
    while (state.patientAmenityTrips!.some(trip => trip.status === "walking_to_amenity")) { state.facilityTick++; advancePatientAmenityTrips(state, context); }
    const room = state.rooms.find(room => room.roomDefinitionId === "room.indoor_garden")!;
    state.doors = state.doors.filter(door => door.roomId !== room.id); state.facilityTick++; advancePatientAmenityTrips(state, context);
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.patients!.every(patient => patient.moving === false && patient.path!.length === 1)).toBe(true);
    expect(describeFacilityCharacter(state, { kind: "patient", id: "encounter.level5.support.0" })!.activity).toContain("exit to reopen");
    expect(view.serviceIncome.levelFiveSupport!.gardenRestCount).toBe(0);
  });
});
