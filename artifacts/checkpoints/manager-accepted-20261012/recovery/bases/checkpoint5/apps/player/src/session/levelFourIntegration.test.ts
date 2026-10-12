import { describe, expect, it } from "vitest";
import {
  deserializeGameState, getFacilityProgressionStatus, getRollingIncomeSummary, serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";
import {
  createLevelFourIntegrationState, M9_ROOMS, m9Apply, m9Minute, m9SellRoom, m9Until,
} from "../../../../tests/fixtures/level-four-integration";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../../tests/fixtures/pediatric-charts";
import { m9PumpChart } from "../../../../tests/fixtures/level-four-integration";
import { createPrototypePlayerView } from "./viewModels";
import { clinicHeadlineCandidates } from "../ui/ClinicHeadline";

const viewOf = (state: GameState) => createPrototypePlayerView(state, state.openChartEncounterId, false, null);

describe("Level 4 M9 real-engine player integration", () => {
  it("projects all specialty services from real care supports, retaining Money/HUD equality and reload identities", () => {
    let state = createLevelFourIntegrationState("level-four-m9-player");
    const seen = new Set<string>();
    for (let minute = 0; minute < 360; minute++) {
      state = m9Minute(state);
      const view = viewOf(state);
      for (const op of state.serviceOperations.filter(op => op.status === "in_service" && op.clinicVisit)) {
        const visitor = view.facility.serviceVisitors?.find(actor => actor.instanceId === op.id);
        if (op.incomeLineId === "income.mri") {
          expect(visitor).toMatchObject({ supportRole: "mri-patient", supportId: "patient-seated", supportRoomInstanceId: M9_ROOMS.mri });
          expect(view.facility.staff.find(actor => actor.instanceId === op.reservedEmployeeIds[0]))
            .toMatchObject({ supportRole: "mri-operator", supportRoomInstanceId: M9_ROOMS.mri });
        } else if (op.incomeLineId === "income.pediatric_consult") {
          expect(visitor).toMatchObject({ supportRole: "pediatric-examination-patient", supportId: "table:patient" });
          const family = Object.values(state.pediatricFamilies ?? {}).find(family => family.child.id === op.id)!;
          expect(view.facility.retailExternalActors?.find(actor => actor.instanceId === family.parentActorId))
            .toMatchObject({ supportRole: "pediatric-parent-seat", supportRoomInstanceId: family.reservation!.roomInstanceId });
        } else if (["income.wound_care", "income.ostomy_support"].includes(op.incomeLineId)) {
          expect(visitor).toMatchObject({ supportRole: "wound-ostomy-patient", supportId: "recliner:patient", supportRoomInstanceId: M9_ROOMS.wound });
          const providerId = op.providerReservation?.kind === "employee" ? op.providerReservation.employeeId : null;
          expect(view.facility.staff.find(actor => actor.instanceId === providerId))
            .toMatchObject({ supportRole: "wound-ostomy-clinician", supportId: "stool:clinician" });
        }
        seen.add(op.incomeLineId);
      }
      if (minute % 60 === 0) {
        const finance = view.serviceIncome.finances!;
        expect(view.resourceBar.moneyHourlyDeltaLabel).toBe(finance.hourlyNetLabel);
        expect(view.resourceBar.moneyHourlyBreakdown?.incomeLabel).toBe(finance.hourlyIncomeLabel);
        expect(finance.hourlyIncomeSources.reduce((sum, source) => sum + source.amount, 0))
          .toBe(getRollingIncomeSummary(state).incomePerHour);
        const restored = deserializeGameState(serializeGameState(state));
        expect(viewOf(restored)).toEqual(view);
      }
    }
    for (const line of ["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support", "income.mri"])
      expect(seen.has(line), line).toBe(true);
    expect(state.clinicalXp).toBe(0);
  }, 30_000);

  it("keeps a real pediatric scored chart and its parent presentation intact during waiting, exam and departure reloads", () => {
    let state = createPediatricChartsQaState();
    state = m9Apply(state, { type: "SET_PAUSED", paused: false }, "m9.player.pediatric.play");
    const seen = new Set<string>();
    for (let minute = 0; minute < 180; minute++) {
      state = m9Minute(state); state = m9PumpChart(state);
      const family = Object.values(state.pediatricFamilies ?? {})[0]!;
      seen.add(family.phase);
      const view = viewOf(state);
      if (view.chart) {
        expect(view.chart).toMatchObject({ patientName: "Noah Bennett", ageLabel: "5 years", sexLabel: "Male" });
        expect(view.chart.presentation).toContain("Daniel Bennett");
      }
      if (minute % 30 === 0) expect(viewOf(deserializeGameState(serializeGameState(state)))).toEqual(view);
    }
    for (const phase of ["waiting", "in_care", "departing", "departed"]) expect(seen.has(phase), phase).toBe(true);
    expect(state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!.resolutionReason).toBe("completed");
    expect(state.clinicalXp).toBeGreaterThan(0);
  }, 30_000);

  it("shows one durable completion milestone from both real service witnesses after room sale and repeated reloads", () => {
    let state = createLevelFourIntegrationState("level-four-m9-player-complete");
    state.clinicalXp = 750;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state = m9Until(state, value => getFacilityProgressionStatus(value).terminalComplete);
    state = m9Apply(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: false }, "m9.player.complete.demand-off");
    state = m9SellRoom(state, M9_ROOMS.wound, "m9.player.complete.sale");
    for (let reload = 0; reload < 3; reload++) {
      state = deserializeGameState(serializeGameState(state));
      state = m9Minute(state);
      const view = viewOf(state);
      expect(view.progression).toMatchObject({ prototypeComplete: true, canLevelUp: false, nextLevelLabel: null });
      const rows = view.messages.filter(row => row.id === "event.facility-level-4-complete");
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ rowKind: "milestone", priority: "informational", showAttentionMarker: false });
      expect(clinicHeadlineCandidates(view.messages, view.needsYou!)).not.toContainEqual(expect.objectContaining({ id: rows[0]!.id }));
      expect(view.progression.goals.filter(goal => goal.id.startsWith("progression.witness.")).every(goal => goal.complete)).toBe(true);
      expect(view.messages.some(row => row.title?.includes("Level current complete was resolved"))).toBe(false);
    }
  }, 30_000);
});
