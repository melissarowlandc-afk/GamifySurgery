import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceEmployeeTraining,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getDiagnosticOrderPlans,
  getFacilityAccessValidation,
  getRadiologistReadingStation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  serializeGameState,
  startServiceOperation,
  type GameCommand,
  type GameState,
  type RoomUpgradeLevel,
} from "@gamify-surgery/game-domain";

export const roomUpgradeScenarioIds = {
  waiting: "room.upgrades.waiting.a",
  waitingCopy: "room.upgrades.waiting.b",
  examination: "room.upgrades.examination",
  reading: "room.upgrades.reading",
  training: "room.upgrades.training",
  revenue: "room.upgrades.ultrasound",
  trainingEmployee: "employee.upgrades.reception",
  readingPatient: "patient.upgrades.reading",
  admittedPatient: "patient.upgrades.admitted",
} as const;

function apply(state: GameState, command: GameCommand): GameState {
  const next = gameReducer(state, command);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") {
    throw new Error(`${command.operationId}: ${receipt?.message ?? "missing receipt"}`);
  }
  return next;
}

function connectedFacility(
  initial: GameState,
  readingLevel: RoomUpgradeLevel,
  readerLevel: RoomUpgradeLevel,
): GameState {
  let state = structuredClone(initial);
  const front = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
  const entrance = state.doors.find((door) => door.roomId === front.id && door.exterior)!;
  Object.assign(state, {
    facilityLevel: 3, cash: 30_000, cashCents: 3_000_000, paused: true, simulationSpeed: 4,
    encounters: {}, employees: [], departingEmployees: [], employeeDiscussions: {},
    openChartEncounterId: null, attendedEncounterId: null, openEmployeeDiscussionId: null,
    serviceOperations: [], serviceAppointmentsEnabled: false, serviceIncomeReceipts: [],
    retailOperations: [], retailExternalActors: [], advertisingLevel: 0,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    nextExternalRetailOpportunityTick: Number.MAX_SAFE_INTEGER,
    nextEmployeeDiscussionTick: Number.MAX_SAFE_INTEGER,
  });
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  Object.assign(state.environment, {
    founderActivity: null, pendingFounderConsult: null, ambientPedestrians: [], litterItems: [],
    nextAmbientPedestrianTick: Number.MAX_SAFE_INTEGER,
    nextLitterSpawnTick: Number.MAX_SAFE_INTEGER,
    nextWaterCoolerDrainTick: Number.MAX_SAFE_INTEGER,
    waterCoolerFillPercent: 100,
  });
  state.alertHumor.nextAmbientAlertTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [front];
  state.doors = [entrance, {
    id: "door.upgrades.front", roomId: front.id, side: "west", offset: 0, exterior: false,
  }];
  for (let y = 15; y <= 30; y++) {
    state.rooms.push({
      id: `room.upgrades.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
    });
  }
  for (const [id, definition, x, y, side] of [
    [roomUpgradeScenarioIds.waiting, "room.waiting", 28, 24, "east"],
    [roomUpgradeScenarioIds.waitingCopy, "room.waiting", 28, 15, "east"],
    [roomUpgradeScenarioIds.examination, "room.examination", 33, 25, "west"],
    [roomUpgradeScenarioIds.reading, "room.reading", 28, 19, "east"],
    [roomUpgradeScenarioIds.training, "room.training", 33, 21, "west"],
    [roomUpgradeScenarioIds.revenue, "room.ultrasound", 33, 17, "west"],
  ] as const) {
    state.rooms.push({
      id, roomDefinitionId: definition, x, y, orientation: 0, doorSide: null,
      upgradeLevel: id === roomUpgradeScenarioIds.reading ? readingLevel : 1, cleanliness: 100,
    });
    state.doors.push({ id: `door.${id}`, roomId: id, side, offset: 1, exterior: false });
  }
  const access = getFacilityAccessValidation(state);
  if (!access.valid) throw new Error(`Upgrade fixture access: ${access.issues.join("; ")}`);
  for (const [id, role] of [
    ...[1, 2, 3, 4].map((number) => [`employee.upgrades.reader.${number}`, "staff.radiologist"] as const),
    ["employee.upgrades.imaging", "staff.imaging_technician"],
    [roomUpgradeScenarioIds.trainingEmployee, "staff.receptionist"],
  ] as const) {
    state = apply(state, {
      type: "HIRE_STAFF", operationId: `fixture.hire.${id}`, employeeId: id,
      staffRoleDefinitionId: role,
      displayName: id === roomUpgradeScenarioIds.trainingEmployee ? "Upgrade Training Employee" : id,
    });
    const employee = state.employees.find((entry) => entry.id === id)!;
    if (role === "staff.radiologist") employee.trainingLevel = readerLevel;
    const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!;
    const station = getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT);
    employee.location = station?.location ?? getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  return state;
}

function admit(state: GameState, id: string): GameState {
  const next = apply(state, {
    type: "ADMIT_PATIENT", operationId: `fixture.admit.${id}`, encounterId: id,
    caseId: "case.breast-cyst.under-30-asymptomatic-simple",
    patientDisplayName: id === roomUpgradeScenarioIds.admittedPatient
      ? "Upgrade Admitted Patient" : "Upgrade Reading Patient",
    arrivalClass: "routine",
  });
  const encounter = next.encounters[id]!;
  const exam = next.rooms.find((room) => room.id === roomUpgradeScenarioIds.examination)!;
  // Synthetic physical arrangement; admission and frozen work use real commands.
  encounter.patientLocation = getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "primary");
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.currentNodeIndex = 0;
  encounter.steps.forEach((step, index) => { step.status = index === 0 ? "action_required" : "locked"; });
  return next;
}

/** Pure fresh-campaign fixture shared by browser and marked chart acceptance. */
export function createRoomUpgradeScenario(
  initial = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: "campaign.upgrades.synthetic", campaignSeed: "upgrades.synthetic", createdAtRealMs: 0,
  }),
  options: { readingLevel?: RoomUpgradeLevel; readerLevel?: RoomUpgradeLevel } = {},
): GameState {
  const ids = roomUpgradeScenarioIds;
  let state = admit(connectedFacility(initial, options.readingLevel ?? 1, options.readerLevel ?? 1), ids.readingPatient);
  const node = state.encounters[ids.readingPatient]!.frozenCase.decisionNodes[0]!;
  state = apply(state, {
    type: "SUBMIT_ANSWER", operationId: "fixture.reading.answer", encounterId: ids.readingPatient,
    decisionNodeId: node.id, answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id,
  });
  if (state.encounters[ids.readingPatient]!.steps[0]!.status === "feedback_pending") {
    state = apply(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "fixture.reading.ack",
      encounterId: ids.readingPatient, decisionNodeId: node.id,
    });
  }
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.paused = false;
  for (let index = 0; index < 220 && !state.serviceOperations.some((operation) =>
    operation.diagnosticPhaseWork?.kind === "interpretation" && operation.status === "in_service"); index++) {
    state = apply(state, { type: "ADVANCE_TICK", operationId: `fixture.tick.${index}` });
  }
  if (!state.serviceOperations.some((operation) =>
    operation.diagnosticPhaseWork?.kind === "interpretation" && operation.status === "in_service")) {
    throw new Error(`Reading never started: ${JSON.stringify(getDiagnosticOrderPlans(state).map((plan) => plan.phases))}`);
  }
  state.paused = true;
  if (!startServiceOperation(state, "income.ultrasound", "visitor", PROTOTYPE_DOMAIN_CONTEXT)) {
    throw new Error("Representative paid service did not accept.");
  }
  state = apply(state, {
    type: "TRAIN_EMPLOYEE", operationId: "fixture.training.pay", employeeId: ids.trainingEmployee,
  });
  advanceEmployeeTraining(state, PROTOTYPE_DOMAIN_CONTEXT);
  if (!state.employees.find((employee) => employee.id === ids.trainingEmployee)?.training?.roomUpgradeWork?.boundRoomInstanceId) {
    throw new Error("Training did not bind a real place.");
  }
  state = admit(state, ids.admittedPatient);
  const restored = deserializeGameState(serializeGameState(state));
  if (!getFacilityAccessValidation(restored).valid) throw new Error("Reloaded fixture geometry is invalid.");
  return restored;
}

export function getRoomUpgradeFrozenQuantities(state: GameState) {
  const ids = roomUpgradeScenarioIds;
  const read = state.serviceOperations.find((operation) =>
    operation.diagnosticPhaseWork?.kind === "interpretation" && operation.actorId === ids.readingPatient)!;
  const fee = state.serviceOperations.find((operation) =>
    operation.actorKind === "visitor" && operation.incomeLineId === "income.ultrasound")!;
  const training = state.employees.find((employee) => employee.id === ids.trainingEmployee)!.training!;
  return structuredClone({
    facilityTick: state.facilityTick,
    admittedIds: Object.keys(state.encounters).sort(),
    fee: { id: fee.id, amount: fee.quoteFee, quote: fee.roomUpgradeRevenue },
    reading: {
      id: read.id, duration: read.diagnosticPhaseWork!.durationMinutes,
      startedAt: read.phaseStartedAtFacilityTick, endsAt: read.phaseEndsAtFacilityTick,
      work: read.diagnosticPhaseWork!.readingUpgradeWork,
    },
    training: {
      employeeId: ids.trainingEmployee, duration: training.roomUpgradeWork!.durationMinutes,
      remaining: training.remainingMinutes, work: training.roomUpgradeWork,
    },
  });
}
