# Task-scoped recovery hunks: room capacity and occupied sales

Generated from the preserved pre-milestone snapshot against the accepted live source. Hunks are retained only when they match room-capacity/sale vocabulary and do not contain known unrelated concurrent-feature vocabulary. Shared-file integration remains manual.

```diff
diff --git a/.local-dev/room-capacity-sales/before/game-domain-src/persistence.ts b/packages/game-domain/src/persistence.ts
index ae51b8e..f611bcd 100644
--- a/.local-dev/room-capacity-sales/before/game-domain-src/persistence.ts
+++ b/packages/game-domain/src/persistence.ts
@@ -36,13 +37,15 @@ import {
   getOperationalGlp1AutomationAssignments,
   getRoomDefinition,
   getStaffRoleDefinition,
   isRoomOperationalForFacilityWork,
 } from "./selectors";
 import { getEmployeeHomeLocation } from "./staff";
+import { reconcileEmployeeRoomSeats } from "./room-capacity";
 import { getDefaultDoorOffset } from "./doors";
+import { findDeterministicFacilityPath, getRoomCareStations, getRoomNavigationAnchor } from "./spatial";
 import type {
   AnswerRecord,
   AlertHumorState,
   ConceptLearningHistory,
   DomainContext,
   DoorState,
@@ -787,12 +939,47 @@ function normalizeServiceOperations(
       pathIndex: path.length > 0 ? Math.max(0, Math.min(path.length - 1, raw.pathIndex)) : 0,
       lastMovedAtFacilityTick: raw.lastMovedAtFacilityTick,
       cancellationReason: typeof raw.cancellationReason === "string" ? raw.cancellationReason : null,
       ...(visitorTravel ? { visitorTravel } : {}),
       resourceQueueVersion: raw.resourceQueueVersion === 1 ? 1 : undefined,
       phaseFlowVersion,
+      ...(isRecord(raw.saleTransfer) &&
+        raw.saleTransfer.version === "room-sale-transfer.v1" &&
+        typeof raw.saleTransfer.interruptedAtFacilityTick === "number" &&
+        Number.isSafeInteger(raw.saleTransfer.interruptedAtFacilityTick) &&
+        typeof raw.saleTransfer.remainingPhaseMinutes === "number" &&
+        Number.isSafeInteger(raw.saleTransfer.remainingPhaseMinutes) &&
+        raw.saleTransfer.remainingPhaseMinutes > 0
+        ? { saleTransfer: {
+            version: "room-sale-transfer.v1" as const,
+            interruptedAtFacilityTick: raw.saleTransfer.interruptedAtFacilityTick,
+            remainingPhaseMinutes: raw.saleTransfer.remainingPhaseMinutes,
+          } }
+        : {}),
       ...(rawFrozenPhases.length > 0 && frozenOperationPhases.length === rawFrozenPhases.length ? { frozenOperationPhases } : {}),
       testChoiceOrder,
     } satisfies ServiceOperationState];
   });
 }
 
@@ -1840,12 +2028,36 @@ function normalizeEncounter(
       : (persistedFeedAttentionStartedAtTick ??
         idleWaitingSinceTick ??
         arrivedAtTick);
   const rawContinuation = isRecord(candidate.testOnlyContinuation)
     ? candidate.testOnlyContinuation
     : null;
+  const rawContinuationOffsite = rawContinuation && isRecord(rawContinuation.saleInterruptedOffsite)
+    ? rawContinuation.saleInterruptedOffsite
+    : null;
+  const continuationOffsite = rawContinuationOffsite?.version === "sale-interrupted-continuation.v1" &&
+    (rawContinuationOffsite.readyAtFacilityTick === null ||
+      typeof rawContinuationOffsite.readyAtFacilityTick === "number" &&
+      Number.isSafeInteger(rawContinuationOffsite.readyAtFacilityTick)) &&
+    (rawContinuationOffsite.offscreenEndpoint === null ||
+      isRecord(rawContinuationOffsite.offscreenEndpoint) &&
+      typeof rawContinuationOffsite.offscreenEndpoint.x === "number" &&
+      typeof rawContinuationOffsite.offscreenEndpoint.y === "number") &&
+    Array.isArray(rawContinuationOffsite.returnPath)
+      ? {
+          version: "sale-interrupted-continuation.v1" as const,
+          readyAtFacilityTick: rawContinuationOffsite.readyAtFacilityTick as number | null,
+          offscreenEndpoint: rawContinuationOffsite.offscreenEndpoint === null
+            ? null
+            : { x: rawContinuationOffsite.offscreenEndpoint.x as number, y: rawContinuationOffsite.offscreenEndpoint.y as number },
+          returnPath: rawContinuationOffsite.returnPath.flatMap((point) =>
+            isRecord(point) && typeof point.x === "number" && typeof point.y === "number"
+              ? [{ x: point.x, y: point.y }]
+              : []),
+        }
+      : undefined;
   const testOnlyContinuation =
     rawContinuation?.version === "test-only-continuation.v1" &&
     typeof rawContinuation.originatingNodeIndex === "number" &&
     Number.isSafeInteger(rawContinuation.originatingNodeIndex) &&
     rawContinuation.originatingNodeIndex >= 0 &&
     typeof rawContinuation.serviceId === "string" &&
@@ -1875,12 +2087,13 @@ function normalizeEncounter(
           incomeLineId: rawContinuation.incomeLineId,
           externalRemainder: rawContinuation.externalRemainder,
           status: rawContinuation.status as NonNullable<EncounterState["testOnlyContinuation"]>["status"],
           serviceOperationId: rawContinuation.serviceOperationId,
           scheduledAtFacilityTick: rawContinuation.scheduledAtFacilityTick,
           completedAtFacilityTick: rawContinuation.completedAtFacilityTick,
+          ...(continuationOffsite ? { saleInterruptedOffsite: continuationOffsite } : {}),
         }
       : undefined;
   const rawTerminalTestOrder = isRecord(candidate.terminalTestOrder)
     ? candidate.terminalTestOrder
     : null;
   const terminalTestOrder =
@@ -2543,13 +2868,88 @@ function migrateVersionTwo(
           : next.facilityTick +
             context.balanceRelease.environment.idleActionMinimumMinutes,
       facilityTask,
     };
     return [employee];
   });
-  normalizeGlp1NursePractitionerHomes(next, context);
+  const rawDepartingEmployees = Array.isArray(parsed.departingEmployees)
+    ? parsed.departingEmployees
+    : [];
+  next.departingEmployees = rawDepartingEmployees.flatMap((candidate, index) => {
+    if (!isRecord(candidate) || typeof candidate.id !== "string" ||
+      typeof candidate.staffRoleDefinitionId !== "string" ||
+      !isGridPoint(candidate.location) || !Array.isArray(candidate.path)) return [];
+    const path = candidate.path.filter(isGridPoint).map((point) => ({ ...point }));
+    if (path.length === 0) return [];
+    const pathIndex = typeof candidate.pathIndex === "number" && Number.isSafeInteger(candidate.pathIndex)
+      ? Math.max(0, Math.min(path.length - 1, candidate.pathIndex))
+      : 0;
+    const role = getStaffRoleDefinition(candidate.staffRoleDefinitionId, context);
+    const normalizedAppearance = isPixelAppearance(candidate.appearance)
+      ? normalizePixelAppearance(candidate.appearance, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId))
+      : createPixelAppearance(campaignSeed, "staff", candidate.id, roleStyleForStaffDefinition(candidate.staffRoleDefinitionId));
+    return [{
+      id: candidate.id,
+      staffRoleDefinitionId: candidate.staffRoleDefinitionId,
+      displayName: typeof candidate.displayName === "string" ? candidate.displayName : `Departing employee ${index + 1}`,
+      appearance: normalizedAppearance,
+      hiredAtFacilityTick: typeof candidate.hiredAtFacilityTick === "number" && Number.isSafeInteger(candidate.hiredAtFacilityTick)
+        ? candidate.hiredAtFacilityTick : 0,
+      salaryPerExpenseInterval: 0,
+      morale: typeof candidate.morale === "number" ? candidate.morale : role?.baseMorale ?? 50,
+      trainingLevel: candidate.trainingLevel === 2 || candidate.trainingLevel === 3 || candidate.trainingLevel === 4 || candidate.trainingLevel === 5
+        ? candidate.trainingLevel : 1,
+      homeRoomInstanceId: null,
+      location: { ...path[pathIndex]! },
+      path,
+      pathIndex,
+      lastMovedAtFacilityTick: typeof candidate.lastMovedAtFacilityTick === "number" && Number.isSafeInteger(candidate.lastMovedAtFacilityTick)
+        ? candidate.lastMovedAtFacilityTick : next.facilityTick,
+      lastPraisedAtFacilityTick: null,
+      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
+      facilityTask: null,
+      dismissedAtFacilityTick: typeof candidate.dismissedAtFacilityTick === "number" && Number.isSafeInteger(candidate.dismissedAtFacilityTick)
+        ? candidate.dismissedAtFacilityTick : next.facilityTick,
+    }];
+  });
+  // Reserve the deterministic keeper for every saved identity before trying
+  // to repair any collision. This prevents an early repair from taking the
+  // still belonging to a later employee that was already unique, and retains
+  // the earliest saved member of each duplicate group.
+  const employeesByStableOrder = [...next.employees].sort((left, right) =>
+    left.hiredAtFacilityTick - right.hiredAtFacilityTick || left.id.localeCompare(right.id),
+  );
+  const occupiedStillIds = new Set<string>();
+  const retainedStillIds = new Set<string>();
+  for (const employee of employeesByStableOrder) {
+    const stillId = employee.appearance.stillId;
+    if (stillId && !retainedStillIds.has(stillId)) {
+      retainedStillIds.add(stillId);
+      occupiedStillIds.add(stillId);
+    }
+  }
+  const seenStillIds = new Set<string>();
+  for (const employee of employeesByStableOrder) {
+    const stillId = employee.appearance.stillId;
+    if (stillId && !seenStillIds.has(stillId)) {
+      seenStillIds.add(stillId);
+      continue;
+    }
+    const repaired = selectStaffStillId(
+      campaignSeed,
+      employee.id,
+      employee.staffRoleDefinitionId,
+      undefined,
+      occupiedStillIds,
+    );
+    if (repaired) {
+      employee.appearance = { ...employee.appearance, stillId: repaired };
+      occupiedStillIds.add(repaired);
+    }
+  }
+  reconcileEmployeeRoomSeats(next);
   const activeIdentifiedImagingResults = Object.values(next.encounters)
     .flatMap((encounter) => {
       const pending = encounter.pendingResult;
       const resourceActive = Boolean(
         pending &&
           pending.deliveredAtTick === null &&
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/game-domain-src/reducer.ts b/packages/game-domain/src/reducer.ts
index 8eb9e43..6cbf330 100644
--- a/.local-dev/room-capacity-sales/before/game-domain-src/reducer.ts
+++ b/packages/game-domain/src/reducer.ts
@@ -133,12 +164,43 @@ const MAX_TRANSIENT_OPERATION_RECEIPTS = 96;
 const MAX_TRANSIENT_TICK_OPERATION_RECEIPTS = 4;
 const MAX_TRANSIENT_EVENTS = 500;
 function clonePlain<T>(value: T): T {
   return JSON.parse(JSON.stringify(value)) as T;
 }
 
+function advanceDepartingEmployees(state: GameState, context: DomainContext): void {
+  const departures = state.departingEmployees ?? [];
+  for (const employee of departures) {
+    const alreadyOffMap = employee.location.x < 0 ||
+      employee.location.x >= context.balanceRelease.facility.gridWidth;
+    if (!alreadyOffMap && employee.path.length <= 1) {
+      const replanned = findRouteFromDisplacedLocationOffscreen(state, context, employee.location);
+      if (replanned.length > 0) {
+        employee.path = replanned;
+        employee.pathIndex = 0;
+        employee.lastMovedAtFacilityTick = state.facilityTick;
+      }
+    }
+    if (employee.pathIndex < employee.path.length - 1) {
+      const elapsed = Math.max(1, state.facilityTick - employee.lastMovedAtFacilityTick);
+      employee.pathIndex = Math.min(
+        employee.path.length - 1,
+        employee.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick,
+      );
+      employee.location = { ...employee.path[employee.pathIndex]! };
+      employee.lastMovedAtFacilityTick = state.facilityTick;
+    }
+  }
+  state.departingEmployees = departures.filter((employee) => {
+    const finishedPath = employee.pathIndex >= employee.path.length - 1;
+    const offMap = employee.location.x < 0 ||
+      employee.location.x >= context.balanceRelease.facility.gridWidth;
+    return !(finishedPath && offMap);
+  });
+}
+
 function findCase(context: DomainContext, caseId: string): SyntheticClinicalCase | null {
   return (
     context.clinicalRelease.cases.find((clinicalCase) => clinicalCase.id === caseId) ??
     null
   );
 }
@@ -577,13 +641,16 @@ function pathFromLocationToRoom(
   if (!destination) {
     return [];
   }
   if (start.y >= context.balanceRelease.facility.gridHeight) {
     return pathFromOutsideToRoom(state, context, start, roomId);
   }
-  return facilityPath(state, context, start, destination);
+  const ordinary = facilityPath(state, context, start, destination);
+  return ordinary.length > 0
+    ? ordinary
+    : findRouteFromDisplacedLocationToPoint(state, context, start, destination);
 }
 
 function pathFromLocationToFacilityPoint(
   state: GameState,
   context: DomainContext,
   start: GridPoint,
@@ -627,16 +694,16 @@ function pathFromLocationToExit(
   if (!entrance) {
     return [];
   }
   if (start.y >= context.balanceRelease.facility.gridHeight) {
     return straightSidewalkPath(start, entrance.outside);
   }
-  return joinPaths(
-    facilityPath(state, context, start, entrance.inside),
-    [entrance.outside],
-  );
+  const internal = facilityPath(state, context, start, entrance.inside);
+  return internal.length > 0
+    ? joinPaths(internal, [entrance.outside])
+    : findRouteFromDisplacedLocationToPublicEntrance(state, context, start);
 }
 
 function pathFromLocationToOffscreen(
   state: GameState,
   context: DomainContext,
   start: GridPoint,
@@ -4189,12 +4334,64 @@ function completeTestOnlyContinuationAtFrontDesk(
       target: { kind: "encounter", id: encounter.id },
     });
   }
   return true;
 }
 
+function interruptedContinuationExternalDuration(
+  context: DomainContext,
+  continuation: NonNullable<EncounterState["testOnlyContinuation"]>,
+): number {
+  const service = context.balanceRelease.services.find((candidate) =>
+    candidate.id === continuation.serviceId);
+  const external = service?.routes.find((route) =>
+    route.id !== continuation.routeId &&
+    route.requiredCapabilityId === null &&
+    route.requiredCapabilityIds.length === 0 &&
+    route.resourceRequirements.length === 0 &&
+    route.providerRequirement === null);
+  return external?.durationTicks ?? 0;
+}
+
+function advanceSaleInterruptedContinuation(
+  state: GameState,
+  encounter: EncounterState,
+  context: DomainContext,
+): void {
+  const continuation = encounter.testOnlyContinuation;
+  const travel = continuation?.saleInterruptedOffsite;
+  if (!continuation || !travel || encounter.patientMovement !== null) return;
+  if (travel.readyAtFacilityTick === null) {
+    if (!encounter.patientLocation) return;
+    const endpoint = getEncounterArrivalStart(state, context, encounter.id);
+    const entrance = getPublicEntrance(state, context);
+    if (!endpoint || !entrance) return;
+    const outbound = pathFromLocationToOffscreen(state, context, encounter.patientLocation, encounter.id);
+    const returnPath = pathFromOutsideToRoom(state, context, endpoint, entrance.room.id);
+    if (outbound.length === 0 || returnPath.length === 0) return;
+    travel.offscreenEndpoint = { ...endpoint };
+    travel.returnPath = returnPath.map((point) => ({ ...point }));
+    travel.readyAtFacilityTick = state.facilityTick + movementDuration(outbound, context) +
+      interruptedContinuationExternalDuration(context, continuation);
+    startPatientMovement(state, context, encounter, "departing_for_offsite_testing", outbound, null);
+    return;
+  }
+  if (encounter.patientLocation === null && state.facilityTick >= travel.readyAtFacilityTick &&
+      travel.returnPath.length > 0) {
+    const entrance = getPublicEntrance(state, context);
+    startPatientMovement(
+      state,
+      context,
+      encounter,
+      "returning_from_offsite_testing",
+      travel.returnPath,
+      entrance?.room.id ?? null,
+    );
+  }
+}
+
 function ensureLegacyOffsiteTravel(
   state: GameState,
   encounter: EncounterState,
   context: DomainContext,
 ): void {
   const pending = encounter.pendingResult;
@@ -5610,12 +5807,32 @@ function advanceFounderActivity(
   context: DomainContext,
 ): void {
   const activity = state.environment.founderActivity;
   if (!activity) {
     return;
   }
+  if (activity.kind === "return_to_front_desk" && activity.path.length <= 1) {
+    const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk");
+    const replanned = frontDesk
+      ? findRouteFromDisplacedLocationToRoom(
+          state,
+          context,
+          state.environment.founderLocation,
+          frontDesk.id,
+        )
+      : [];
+    if (replanned.length > 1) {
+      activity.path = replanned;
+      activity.pathIndex = 0;
+      activity.lastMovedAtFacilityTick = state.facilityTick;
+    } else {
+      // A temporarily disconnected layout can become routable before Build
+      // Mode ends. Keep the founder in place so a later tick can retry.
+      return;
+    }
+  }
   if (activity.pathIndex < activity.path.length - 1) {
     const elapsedTicks = Math.max(
       1,
       state.facilityTick - activity.lastMovedAtFacilityTick,
     );
     activity.pathIndex = Math.min(
@@ -5999,12 +6216,17 @@ function completePatientMovement(
       state.alertHumor.lastPatientArrivalTick = state.facilityTick;
       // Reaching the Front Desk completes the return trip and makes the
       // existing chart eligible for its next decision. The patient then moves
       // to the same deterministic waiting hierarchy used after first check-in.
       encounter.idleWaitingSinceTick = null;
       encounter.lastSatisfactionDecayAtTick = state.facilityTick;
+      if (encounter.testOnlyContinuation?.saleInterruptedOffsite) {
+        encounter.testOnlyContinuation.status = "returning_to_front_desk";
+        delete encounter.testOnlyContinuation.saleInterruptedOffsite;
+        completeTestOnlyContinuationAtFrontDesk(state, encounter);
+      }
       const destination = chooseWaitingDestination(
         state,
         context,
         encounter,
       );
       encounter.waitingDestination = destination.reservation;
@@ -6704,15 +7035,17 @@ function reduceAdvanceTick(
         },
       });
     }
   }
 
   applyOperatingExpenses(next, context);
+  maybeEmitEmployeeDepartureRiskWarnings(next, context);
   prioritizeReceptionistPatients(next, context);
   maybeAssignReceptionistWaterRefill(next, context);
     advanceEmployeeMovement(next, context);
+    advanceDepartingEmployees(next, context);
   advanceFounderActivity(next, context);
   const founderServiceTarget =
     next.environment.founderActivity?.kind === "perform_service"
       ? next.environment.founderActivity.targetId
       : null;
   advanceServiceOperations(
@@ -6950,32 +7283,28 @@ function reduceSellRoom(
   }
   const definition = getRoomDefinition(room.roomDefinitionId, context);
   if (!definition) {
     return rejectCommand(state, command, "The room definition does not exist.");
   }
   const facility = context.balanceRelease.facility;
+  const soldFootprint = getRotatedFootprint(definition, room.orientation);
+  const wasInsideSoldRoom = (point: GridPoint | null | undefined): boolean => Boolean(
+    point &&
+    point.x >= room.x && point.x < room.x + soldFootprint.width &&
+    point.y >= room.y && point.y < room.y + soldFootprint.height,
+  );
   if (facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)) {
     return rejectCommand(state, command, "The Front Desk cannot be sold.");
   }
-  if (
-    state.employees.some(
-      (employee) => employee.homeRoomInstanceId === room.id,
-    )
-  ) {
-    return rejectCommand(
-      state,
-      command,
-      "Reassign employees before selling their home room.",
-    );
+  const salePreview = getRoomSalePreview(state, room.id, context);
+  if (!salePreview) {
+    return rejectCommand(state, command, "A sale preview could not be created for this room.");
   }
-  if (roomHasActiveCharacterOrRoute(state, room, context)) {
-    return rejectCommand(
-      state,
-      command,
-      "Wait for every character and reserved route to clear this room before selling it.",
-    );
+  if (salePreview.dismissedEmployees.length > 0 &&
+      command.saleConfirmationToken !== salePreview.confirmationToken) {
+    return rejectCommand(state, command, "Review and confirm the named employee dismissals before selling this room.");
   }
 
   const remainingRooms = state.rooms.filter(
     (candidate) => candidate.id !== room.id,
   );
   const remainingDefinitionIds = new Set(
@@ -6994,42 +7323,218 @@ function reduceSellRoom(
         state,
         command,
         `${remainingDefinition?.displayName ?? "Another room"} still depends on this room type.`,
       );
     }
   }
-  for (const employee of state.employees) {
-    const role = getStaffRoleDefinition(employee.staffRoleDefinitionId, context);
-    const missing = role?.requiredRoomDefinitionIds.find(
-      (requiredId) => !remainingDefinitionIds.has(requiredId),
-    );
-    if (missing) {
-      return rejectCommand(
-        state,
-        command,
-        `${employee.displayName} still requires this room type.`,
-      );
-    }
-    if (
-      role?.requiredAnyRoomDefinitionIds.length &&
-      !role.requiredAnyRoomDefinitionIds.some((requiredId) => remainingDefinitionIds.has(requiredId))
-    ) {
-      return rejectCommand(state, command, `${employee.displayName} still requires an imaging room.`);
-    }
-  }
   const upgradeInvestment = definition.upgradeCosts
     .slice(0, Math.max(0, room.upgradeLevel - 1))
     .reduce((total, cost) => total + cost, 0);
   const refund = Math.floor(
     ((definition.constructionCost + upgradeInvestment) *
       facility.roomResalePercent) /
       100,
   );
   const next = clonePlain(state);
+  reconcileEmployeeRoomSeats(next);
+  const dismissedIds = new Set(salePreview.dismissedEmployees.map((employee) => employee.id));
+  const interruptedOperationIds = interruptServiceOperationsForRoomSale(
+    next,
+    room.id,
+    room.roomDefinitionId,
+    context,
+  );
+  interruptServiceOperationsForEmployeeDismissal(next, dismissedIds);
+  const dismissed = next.employees.filter((employee) => dismissedIds.has(employee.id));
+  next.departingEmployees ??= [];
+  for (const employee of dismissed) {
+    const retailLocation = next.retailOperations.find(
+      (operation) =>
+        operation.actorKind === "employee" &&
+        operation.actorId === employee.id &&
+        !["completed", "cancelled", "abandoned"].includes(operation.status),
+    )?.location;
+    cancelRetailTripsForActor(next, "employee", employee.id, "Employment ended when the room was sold.");
+    const location = retailLocation ?? employee.path[employee.pathIndex] ?? employee.location;
+    const path = [{ ...location }];
+    next.departingEmployees.push({
+      ...employee,
+      salaryPerExpenseInterval: 0,
+      homeRoomInstanceId: null,
+      facilityTask: null,
+      location: { ...path[0]! },
+      path,
+      pathIndex: 0,
+      lastMovedAtFacilityTick: next.facilityTick,
+      dismissedAtFacilityTick: next.facilityTick,
+    });
+  }
+  next.employees = next.employees.filter((employee) => !dismissedIds.has(employee.id));
   next.rooms = remainingRooms;
   next.doors = next.doors.filter((door) => door.roomId !== room.id);
+  cancelRetailOperationsForRoom(
+    next,
+    room.id,
+    "The outlet room was sold before the trip finished.",
+    context,
+  );
+  if (wasInsideSoldRoom(next.environment.founderLocation)) {
+    next.environment.founderActivity = {
+      kind: "return_to_front_desk",
+      targetId: "room.instance.founder_desk",
+      path: [{ ...next.environment.founderLocation }],
+      pathIndex: 0,
+      lastMovedAtFacilityTick: next.facilityTick,
+      workMinutesRemaining: 0,
+    };
+  }
+  reconcileEmployeeRoomSeats(next);
+  for (const operationId of interruptedOperationIds) {
+    const operation = next.serviceOperations.find((candidate) => candidate.id === operationId);
+    if (!operation || operation.cancelledAtFacilityTick === null ||
+        operation.actorKind !== "encounter" || !operation.testChoiceOrder) continue;
+    const encounter = next.encounters[operation.actorId];
+    if (!encounter) continue;
+    if (operation.testChoiceOrder.purpose === "terminal" &&
+        encounter.terminalTestOrder?.serviceOperationId === operation.id) {
+      encounter.terminalTestOrder.status = "external_arranged";
+      encounter.terminalTestOrder.serviceOperationId = null;
+    } else if (operation.testChoiceOrder.purpose === "continuation" &&
+        encounter.testOnlyContinuation?.serviceOperationId === operation.id) {
+      encounter.testOnlyContinuation.status = "external_arranged";
+      encounter.testOnlyContinuation.saleInterruptedOffsite = {
+        version: "sale-interrupted-continuation.v1",
+        readyAtFacilityTick: null,
+        offscreenEndpoint: null,
+        returnPath: [],
+      };
+      encounter.patientMovement = null;
+    } else if (operation.testChoiceOrder.purpose === "staged_result_component" &&
+        encounter.stagedResultOrder?.components.some((component) =>
+          component.serviceOperationId === operation.id)) {
+      const order = encounter.stagedResultOrder;
+      cancelServiceOperationsById(
+        next,
+        new Set(order.components.flatMap((component) =>
+          component.serviceOperationId && component.serviceOperationId !== operation.id
+            ? [component.serviceOperationId]
+            : [])),
+        "The staged local testing sequence moved off site after its room was sold.",
+        context,
+      );
+      for (const component of order.components) {
+        if (component.status !== "completed") component.status = "cancelled";
+      }
+      const pending = clonePlain(order.remainder);
+      pending.scheduledAtTick = next.facilityTick;
+      pending.durationTicks = pending.serviceDurationTicks;
+      pending.dueTick = next.facilityTick + pending.serviceDurationTicks;
+      pending.deliveredAtTick = null;
+      delete pending.patientRemainsOnsite;
+      pending.patientTravel = null;
+      pending.offsiteTravel = null;
+      pending.offsiteReturnStartedAtTick = null;
+      delete pending.externalProcessingOnly;
+      let phaseStart = next.facilityTick;
+      pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
+        const startsAtTick = phaseStart;
+        const endsAtTick = startsAtTick + phase.durationTicks;
+        phaseStart = endsAtTick;
+        return { ...phase, startsAtTick, endsAtTick };
+      });
+      order.status = "remainder_pending";
+      encounter.pendingResult = pending;
+      const step = encounter.steps[order.originatingNodeIndex];
+      if (step) step.result = clonePlain(pending);
+      encounter.lifecycle = "active_pending_result";
+      encounter.patientMovement = null;
+    } else if (operation.testChoiceOrder.purpose === "result_gate" &&
+        encounter.pendingResult?.localServiceOperation?.serviceOperationId === operation.id) {
+      const pending = encounter.pendingResult;
+      const externalDuration = pending.localServiceOperation!.externalDurationTicks;
+      delete pending.localServiceOperation;
+      delete pending.onsiteReturn;
+      delete pending.serviceIncomeEligible;
+      delete pending.serviceIncomeLineId;
+      delete pending.serviceIncomeFee;
+      pending.patientTravel = null;
+      pending.offsiteTravel = null;
+      pending.offsiteReturnStartedAtTick = null;
+      pending.resourceReservations = [];
+      pending.timingPhases = [];
+      pending.imagingTechnicianId = null;
+      pending.phlebotomistId = null;
+      pending.providerReservation = null;
+      delete pending.resourceQueue;
+      pending.scheduledAtTick = next.facilityTick;
+      pending.durationTicks = externalDuration;
+      pending.serviceDurationTicks = externalDuration;
+      pending.dueTick = next.facilityTick + externalDuration;
+      delete pending.patientRemainsOnsite;
+      delete pending.externalProcessingOnly;
+      encounter.patientMovement = null;
+    }
+  }
+  for (const encounter of Object.values(next.encounters)) {
+    const pending = encounter.pendingResult;
+    if (pending?.deliveredAtTick === null && pending.patientTravel?.destinationRoomInstanceId === room.id) {
+      for (const employee of next.employees) {
+        if (employee.facilityTask?.targetId === pending.operationId) employee.facilityTask = null;
+      }
+      const compatibleRoomRemains = next.rooms.some(
+        (candidate) => candidate.roomDefinitionId === room.roomDefinitionId,
+      );
+      if (compatibleRoomRemains) {
+        pending.resourceQueue = {
+          version: "onsite-resource-queue.v1",
+          status: "waiting_for_resources",
+          serviceId: pending.resultTypeId,
+          routeId: pending.routeId,
+          allowedRouteIds: [pending.routeId],
+          queuedAtTick: next.facilityTick,
+        };
+        pending.patientTravel = null;
+        pending.resourceReservations = [];
+        pending.timingPhases = [];
+        pending.imagingTechnicianId = null;
+        pending.phlebotomistId = null;
+        pending.providerReservation = null;
+        encounter.patientMovement = null;
+      } else if (encounter.patientLocation) {
+        pending.patientTravel = null;
+        pending.resourceReservations = [];
+        pending.timingPhases = [];
+        pending.imagingTechnicianId = null;
+        pending.phlebotomistId = null;
+        pending.providerReservation = null;
+        delete pending.resourceQueue;
+        delete pending.serviceIncomeEligible;
+        delete pending.serviceIncomeLineId;
+        delete pending.serviceIncomeFee;
+        // Defer route selection until the next unpaused simulation tick. This
+        // lets Build Mode replace the sold footprint before off-site travel is
+        // planned and safely retries if the temporary layout has no exit.
+        pending.offsiteTravel = null;
+        encounter.patientMovement = null;
+      }
+    }
+    if (encounter.assignedRoomInstanceId === room.id) encounter.assignedRoomInstanceId = null;
+    if (encounter.queuedCareRoomInstanceId === room.id) encounter.queuedCareRoomInstanceId = null;
+    if (encounter.waitingDestination?.roomInstanceId === room.id) encounter.waitingDestination = null;
+    if (encounter.patientMovement?.destinationRoomInstanceId === room.id &&
+        encounter.patientMovement.kind !== "departing_for_offsite_testing") {
+      encounter.patientMovement = null;
+    }
+    if (wasInsideSoldRoom(encounter.patientLocation) &&
+        !next.serviceOperations.some((operation) =>
+          operation.actorKind === "encounter" && operation.actorId === encounter.id &&
+          operation.status !== "completed" && operation.status !== "cancelled")) {
+      encounter.patientMovement = null;
+      encounter.waitingDestination = null;
+    }
+  }
   adjustCash(next, refund);
   appendEvent(next, {
     id: `event.room-sold.${room.id}.${command.operationId}`,
     type: "room_sold",
     facilityTick: next.facilityTick,
     encounterId: null,
@@ -7477,17 +7982,20 @@ function reduceHireStaff(
   if (state.employees.some((employee) => employee.id === command.employeeId)) {
     return rejectCommand(state, command, "That employee ID already exists.");
   }
   const employeesInRole = state.employees.filter(
     (employee) => employee.staffRoleDefinitionId === definition.id,
   );
-  if (employeesInRole.length >= definition.maximumEmployees) {
+  const roomCapacity = getRoomStaffCapacity(state, definition.id).capacity;
+  if (employeesInRole.length >= roomCapacity) {
     return rejectCommand(
       state,
       command,
-      `${definition.displayName} staffing is at its ${definition.maximumEmployees}/${definition.maximumEmployees} prototype maximum.`,
+      roomCapacity === 0
+        ? `Build a compatible room before hiring this role.`
+        : `${definition.displayName} staffing is at its ${roomCapacity}/${roomCapacity} built-room maximum.`,
     );
   }
   const placedRoomTypes = new Set(
     state.rooms.map((room) => room.roomDefinitionId),
   );
   const missingRoom = definition.requiredRoomDefinitionIds.find(
@@ -7513,13 +8021,29 @@ function reduceHireStaff(
     return rejectCommand(state, command, `Build one of these rooms before hiring this role: ${names}.`);
   }
   if (state.cash < definition.hiringCost) {
     return rejectCommand(state, command, "There is not enough cash for this hire.");
   }
 
+  const occupiedStillIds = new Set([
+    ...state.employees.map((employee) => employee.appearance.stillId),
+    ...(state.departingEmployees ?? []).map((employee) => employee.appearance.stillId),
+  ].filter((stillId): stillId is string => typeof stillId === "string"));
+  const selectedStillId = selectStaffStillId(
+    state.campaignSeed,
+    command.employeeId,
+    definition.id,
+    undefined,
+    occupiedStillIds,
+  );
+  if (!selectedStillId) {
+    return rejectCommand(state, command, `No unused ${definition.displayName} character design is available yet.`);
+  }
+
   const next = clonePlain(state);
+  reconcileEmployeeRoomSeats(next);
   const generatedName = createStaffDisplayName(
     next.campaignSeed,
     command.employeeId,
   );
   const requestedName = command.displayName?.trim();
   const baseName = requestedName || generatedName;
@@ -8303,12 +8827,13 @@ export function createInitialGameState(
         side: "south",
         offset: 2,
         exterior: true,
       },
     ],
     employees: [],
+    departingEmployees: [],
     encounters: {},
     learningHistories: Object.fromEntries(
       context.clinicalRelease.concepts.map((concept) => [
         concept.id,
         {
           conceptId: concept.id,
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/game-domain-src/staff.ts b/packages/game-domain/src/staff.ts
index cf00284..0eca1dc 100644
--- a/.local-dev/room-capacity-sales/before/game-domain-src/staff.ts
+++ b/packages/game-domain/src/staff.ts
@@ -8,12 +8,14 @@ import {
   findDeterministicFacilityPath,
   getRoomNavigableTiles,
   getRotatedFootprint,
   getRoomNavigationAnchor,
 } from "./spatial";
 import type { DomainContext, EmployeeState, GameState, GridPoint } from "./types";
+import { getAvailableEmployeeHomeRoom, reconcileImagingIdleSeats } from "./room-capacity";
+import { findRouteFromDisplacedLocationToRoom } from "./displaced-routing";
 
 function samePoint(left: GridPoint, right: GridPoint): boolean {
   return left.x === right.x && left.y === right.y;
 }
 
 /**
@@ -63,12 +66,40 @@ export function advanceEmployeeMovement(
       employee.lastMovedAtFacilityTick = state.facilityTick;
       continue;
     }
     if (employee.facilityTask) {
       continue;
     }
+    const standsInBuiltRoom = state.rooms.some((room) => {
+      const roomDefinition = getRoomDefinition(room.roomDefinitionId, context);
+      return Boolean(roomDefinition && getRoomNavigableTiles(room, roomDefinition, state.doors).some(
+        (point) => samePoint(point, employee.location),
+      ));
+    });
+    const standsInAssignedImagingRoom = employee.staffRoleDefinitionId !== "staff.imaging_technician" ||
+      !employee.homeRoomInstanceId || (() => {
+        const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId);
+        const definition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
+        return Boolean(home && definition && getRoomNavigableTiles(home, definition, state.doors).some(
+          (point) => samePoint(point, employee.location),
+        ));
+      })();
+    if ((!standsInBuiltRoom || !standsInAssignedImagingRoom) && employee.homeRoomInstanceId) {
+      const displacedPath = findRouteFromDisplacedLocationToRoom(
+        state,
+        context,
+        employee.location,
+        employee.homeRoomInstanceId,
+      );
+      if (displacedPath.length > 1) {
+        employee.path = displacedPath;
+        employee.pathIndex = 0;
+        employee.lastMovedAtFacilityTick = state.facilityTick;
+        continue;
+      }
+    }
     // Reception and GLP-1 NPs are posts, not idle-wander roles. The water-
     // cooler task is the intentional exception above; once it is complete,
     // route back to the assigned station and remain there for arriving work.
     const fixedStation = employee.staffRoleDefinitionId === "staff.receptionist"
       ? (() => {
           const room = employee.homeRoomInstanceId
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/game-domain-src/types.ts b/packages/game-domain/src/types.ts
index 222ca20..1667c1d 100644
--- a/.local-dev/room-capacity-sales/before/game-domain-src/types.ts
+++ b/packages/game-domain/src/types.ts
@@ -539,12 +540,39 @@ export interface ServiceOperationState {
     arrivedAtFacilityTick: number | null;
   };
   /** New encounter operations wait indefinitely for installed onsite resources. */
   resourceQueueVersion?: 1;
   /** New periop-first operations reserve and release one phase at a time. */
   phaseFlowVersion?: 1;
+  /** Current phase was interrupted by a room sale and must restart in compatible capacity. */
+  saleTransfer?: {
+    version: "room-sale-transfer.v1";
+    interruptedAtFacilityTick: number;
+    remainingPhaseMinutes: number;
+  };
   /** Frozen staged-order work template; ordinary and older operations continue using their catalog template. */
   frozenOperationPhases?: Array<{
     id: string;
     roomDefinitionId: string | null;
     durationMinutes: number;
     staffRoleDefinitionIds: string[];
@@ -719,12 +769,19 @@ export interface EncounterState {
     incomeLineId: string | null;
     externalRemainder: string;
     status: "feedback_pending" | "waiting_for_service" | "returning_to_front_desk" | "completed" | "external_arranged";
     serviceOperationId: string | null;
     scheduledAtFacilityTick: number;
     completedAtFacilityTick: number | null;
+    /** Persisted only when a room sale forces the local component off site. */
+    saleInterruptedOffsite?: {
+      version: "sale-interrupted-continuation.v1";
+      readyAtFacilityTick: number | null;
+      offscreenEndpoint: GridPoint | null;
+      returnPath: GridPoint[];
+    };
   };
   /** Frozen supported local pieces that must finish before an authored external result gate begins. */
   stagedResultOrder?: {
     version: "staged-result-order.v1";
     originatingNodeIndex: number;
     caseId: string;
@@ -825,12 +882,17 @@ export interface EmployeeState {
   lastPraisedAtFacilityTick: number | null;
   nextIdleActionAtFacilityTick: number;
   /** Persisted operational work that temporarily supersedes room idling. */
   facilityTask?: EmployeeFacilityTaskState | null;
 }
 
+/** A dismissed employee retained only while their visible exit walk completes. */
+export interface DepartingEmployeeState extends EmployeeState {
+  dismissedAtFacilityTick: number;
+}
+
 export interface LitterState {
   id: string;
   roomId: string;
   location: GridPoint;
   spawnedAtFacilityTick: number;
 }
@@ -1138,12 +1206,14 @@ export type GameCommand =
       y: number;
       orientation?: RoomOrientation;
     })
   | (CommandBase & {
       type: "SELL_ROOM";
       roomId: string;
+      /** Required when the current sale preview names employee dismissals. */
+      saleConfirmationToken?: string;
     })
   | (CommandBase & {
       type: "UPGRADE_ROOM";
       roomId: string;
     })
   | (CommandBase & {
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/player-src/session/usePrototypeSession.ts b/apps/player/src/session/usePrototypeSession.ts
index 3d1f47d..c58ce51 100644
--- a/.local-dev/room-capacity-sales/before/player-src/session/usePrototypeSession.ts
+++ b/apps/player/src/session/usePrototypeSession.ts
@@ -121,13 +121,13 @@ export interface PrototypeSession {
   ) => boolean;
   enterBuildMode: () => void;
   exitBuildMode: () => void;
   enterManagementMode: () => void;
   exitManagementMode: () => void;
   selectRoom: (roomInstanceId: string) => void;
-  sellSelectedRoom: () => void;
+  sellSelectedRoom: (roomId: string, saleConfirmationToken?: string) => void;
   upgradeSelectedRoom: () => void;
   beginMoveSelectedRoom: () => void;
   placeDoor: (
     roomId: string,
     side: CardinalDirection,
     offset: number,
@@ -1121,22 +1136,23 @@ export function usePrototypeSession(
     setSelectedRoomInstanceId(roomInstanceId);
     setSelectedRoomDefinitionId(null);
     setMovingRoomInstanceId(null);
     setAnnouncement("Room selected. Upgrade or sell it from Build Mode.");
   }, []);
 
-  const sellSelectedRoom = useCallback(() => {
-    if (!selectedRoomInstanceId) {
+  const sellSelectedRoom = useCallback((roomId: string, saleConfirmationToken?: string) => {
+    if (!roomId) {
       setAnnouncement("Select a room to sell.");
       return;
     }
     const status = executeBuildCommand({
       type: "SELL_ROOM",
-      roomId: selectedRoomInstanceId,
+      roomId,
+      saleConfirmationToken,
     });
-    if (status === "applied") {
+    if (status === "applied" && selectedRoomInstanceId === roomId) {
       setSelectedRoomInstanceId(null);
     }
   }, [executeBuildCommand, selectedRoomInstanceId]);
 
   const upgradeSelectedRoom = useCallback(() => {
     if (!selectedRoomInstanceId) {
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/player-src/session/viewModels.ts b/apps/player/src/session/viewModels.ts
index 7529ca6..d650fbf 100644
--- a/.local-dev/room-capacity-sales/before/player-src/session/viewModels.ts
+++ b/apps/player/src/session/viewModels.ts
@@ -1809,34 +1875,38 @@ export function createPrototypePlayerView(
         instanceId: door.id,
         roomInstanceId: door.roomId,
         side: door.side,
         offset: door.offset,
         exterior: door.exterior,
       })),
-      staff: state.employees.map((employee) => {
+      staff: [
+        ...state.employees,
+        ...(state.departingEmployees ?? []),
+      ].map((employee) => {
         const role = getStaffRoleDefinition(
           employee.staffRoleDefinitionId,
         );
-        const taskAtEndpoint = employee.facilityTask &&
+        const departing = (state.departingEmployees ?? []).some((candidate) => candidate.id === employee.id);
+        const taskAtEndpoint = !departing && employee.facilityTask &&
           (employee.facilityTask.kind === "perform_imaging" || employee.facilityTask.kind === "perform_service") &&
           employee.pathIndex >= employee.path.length - 1 && samePoint(employee.location, employee.path.at(-1));
         const serviceRoom = taskAtEndpoint && employee.facilityTask?.targetId
           ? getServiceTargetRoom(state, employee.facilityTask.targetId, employee.id)
           : undefined;
         const serviceSupportRole = serviceRoom
           ? clinicianSupportRoleForRoom(serviceRoom.roomDefinitionId)
           : undefined;
         const homeRoom = employee.homeRoomInstanceId
           ? state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId)
           : undefined;
         const homeDefinition = homeRoom ? getRoomDefinition(homeRoom.roomDefinitionId) : null;
-        const atFrontDeskSeat = employee.staffRoleDefinitionId === "staff.receptionist" &&
+        const atFrontDeskSeat = !departing && employee.staffRoleDefinitionId === "staff.receptionist" &&
           homeRoom?.roomDefinitionId === "room.front_desk" && homeDefinition && !employee.facilityTask &&
           employee.pathIndex >= employee.path.length - 1 &&
           samePoint(employee.location, getRoomNavigationAnchor(homeRoom, homeDefinition, "staff"));
-        const glp1SupportRole = getGlp1NursePractitionerSupportRole(state, employee);
+        const glp1SupportRole = departing ? undefined : getGlp1NursePractitionerSupportRole(state, employee);
         const supportRole = serviceSupportRole === "ct-operator" && employee.staffRoleDefinitionId !== "staff.imaging_technician"
           ? undefined
           : serviceSupportRole ?? glp1SupportRole ?? (atFrontDeskSeat ? "front-desk-staff" : undefined);
         return {
           instanceId: employee.id,
           staffRoleDefinitionId: employee.staffRoleDefinitionId,
@@ -1945,13 +2015,16 @@ export function createPrototypePlayerView(
               : undefined;
         return {
           id: definition.id,
           displayName: definition.displayName,
           footprintLabel: `${definition.width} × ${definition.height} tiles`,
           costLabel: `$${definition.constructionCost.toLocaleString()}`,
-          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / hr · ${ownedCount} built`,
+          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / hr`,
+          builtCountLabel: definition.maximumInstances === null
+            ? `${ownedCount} built · no limit`
+            : `${ownedCount} / ${definition.maximumInstances} built`,
           owned,
           selected: selectedRoomDefinitionId === definition.id,
           enabled:
             !atMaximum &&
             requirementsMet &&
             affordable,
@@ -1964,24 +2037,29 @@ export function createPrototypePlayerView(
       )
       .map((role) => {
         const hiredCount = state.employees.filter(
           (employee) => employee.staffRoleDefinitionId === role.id,
         ).length;
         const hired = hiredCount > 0;
-        const atMaximum = hiredCount >= role.maximumEmployees;
+        const roomCapacity = getRoomStaffCapacity(state, role.id);
+        const atMaximum = hiredCount >= roomCapacity.capacity;
         const requirementsMet = role.requiredRoomDefinitionIds.every(
           (requiredId) => placedRoomDefinitionIds.has(requiredId),
         ) && (role.requiredAnyRoomDefinitionIds.length === 0 ||
           role.requiredAnyRoomDefinitionIds.some((requiredId) =>
             placedRoomDefinitionIds.has(requiredId),
           ));
         const affordable = state.cash >= role.hiringCost;
         const lacksGlp1StaffingSlot =
           role.id === "staff.glp1_np" && !hasGlp1StaffingSlot;
-        const blockedReason = atMaximum
-          ? `Maximum ${role.maximumEmployees} hired.`
+        const blockedReason = roomCapacity.capacity === 0
+          ? role.id === "staff.imaging_technician"
+            ? "Build an Ultrasound, X-ray, or CT Room to add imaging technician capacity."
+            : "Build a compatible room to add hiring capacity."
+          : atMaximum
+            ? `Maximum ${roomCapacity.capacity} hired for the rooms you have built.`
           : !requirementsMet
             ? `Requires ${role.requiredRoomDefinitionIds
                 .filter(
                   (requiredId) =>
                     !placedRoomDefinitionIds.has(requiredId),
                 )
@@ -1997,13 +2075,13 @@ export function createPrototypePlayerView(
               ? `Need $${(
                   role.hiringCost - state.cash
                 ).toLocaleString()} more.`
               : undefined;
         return {
           id: role.id,
-          displayName: `${role.displayName} ${hiredCount}/${role.maximumEmployees}`,
+          displayName: `${role.displayName} ${hiredCount}/${roomCapacity.capacity}`,
           costLabel: `$${role.hiringCost.toLocaleString()} hire`,
           salaryLabel: `$${role.salaryPerExpenseInterval.toLocaleString()} salary / hr`,
           hired,
           enabled:
             !atMaximum &&
             requirementsMet &&
@@ -2022,17 +2100,22 @@ export function createPrototypePlayerView(
           (requiredId) => placedRoomDefinitionIds.has(requiredId),
         ) && (role.requiredAnyRoomDefinitionIds.length === 0 ||
           role.requiredAnyRoomDefinitionIds.some((requiredId) =>
             placedRoomDefinitionIds.has(requiredId),
           ));
         const affordable = state.cash >= role.hiringCost;
-        const atMaximum = employees.length >= role.maximumEmployees;
+        const roomCapacity = getRoomStaffCapacity(state, role.id);
+        const atMaximum = employees.length >= roomCapacity.capacity;
         const lacksGlp1StaffingSlot =
           role.id === "staff.glp1_np" && !hasGlp1StaffingSlot;
-        const blockedReason = atMaximum
-          ? `Maximum ${role.maximumEmployees} hired.`
+        const blockedReason = roomCapacity.capacity === 0
+          ? role.id === "staff.imaging_technician"
+            ? "Build an Ultrasound, X-ray, or CT Room to add imaging technician capacity."
+            : "Build a compatible room to add hiring capacity."
+          : atMaximum
+            ? `Maximum ${roomCapacity.capacity} hired for the rooms you have built.`
           : !requirementsMet
             ? `Requires ${role.requiredRoomDefinitionIds
                 .filter(
                   (requiredId) =>
                     !placedRoomDefinitionIds.has(requiredId),
                 )
@@ -2050,13 +2133,13 @@ export function createPrototypePlayerView(
                 ).toLocaleString()} more.`
               : undefined;
         return {
           id: role.id,
           displayName: role.displayName,
           currentCount: employees.length,
-          maximumCount: role.maximumEmployees,
+          maximumCount: roomCapacity.capacity,
           hiringCostLabel: `$${role.hiringCost.toLocaleString()}`,
           employees: employees.map((employee) => ({
             id: employee.id,
             displayName: employee.displayName,
             roleDisplayName: role.displayName,
             salaryLabel: `$${employee.salaryPerExpenseInterval.toLocaleString()}/hr`,
@@ -2067,16 +2150,21 @@ export function createPrototypePlayerView(
               employee.salaryPerExpenseInterval >
               role.minimumSalaryPerExpenseInterval,
             canIncreaseSalary:
               employee.salaryPerExpenseInterval <
               role.maximumSalaryPerExpenseInterval,
           })),
-          staffingGuidance:
-            role.id === "staff.glp1_np"
-              ? "Up to two NPs can staff each GLP-1 Telehealth Suite. Each staffed NP earns $50 per facility hour."
-              : undefined,
+          staffingGuidance: role.id === "staff.periop_nurse"
+            ? "Each Peri-op/Recovery Room has two peri-op nurse positions."
+            : role.id === "staff.glp1_np"
+              ? "Each GLP-1 Telehealth Suite has two NP positions. Each staffed NP earns $50 per facility hour."
+              : role.id === "staff.imaging_technician"
+                ? "Each Ultrasound, X-ray, or CT Room adds one shared imaging technician position."
+                : roomCapacity.builtRoomCount > 0
+                  ? `Each compatible room adds capacity; ${roomCapacity.capacity} position${roomCapacity.capacity === 1 ? "" : "s"} available.`
+                  : undefined,
           canHire:
             !atMaximum &&
             requirementsMet &&
             !lacksGlp1StaffingSlot &&
             affordable,
           blockedReason,
@@ -2149,12 +2237,13 @@ export function createPrototypePlayerView(
           resaleValue === null
             ? undefined
             : `$${resaleValue.toLocaleString()} refund`,
         canUpgrade:
           upgradeCost !== null && state.cash >= upgradeCost,
         canSell: !protectedRoom,
+        salePreview: getRoomSalePreview(state, room.id, PROTOTYPE_DOMAIN_CONTEXT) ?? undefined,
         blockedReason: !definition.buildable
           ? "Legacy space is retained for this saved campaign and cannot be upgraded."
           : protectedRoom
           ? "The Front Desk is the clinic's permanent entrance and cannot be sold."
           : upgradeCost !== null && state.cash < upgradeCost
             ? `Need $${(
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/player-src/ui/BuildPanel.tsx b/apps/player/src/ui/BuildPanel.tsx
index 02ed506..63a2323 100644
--- a/.local-dev/room-capacity-sales/before/player-src/ui/BuildPanel.tsx
+++ b/apps/player/src/ui/BuildPanel.tsx
@@ -7,12 +7,18 @@ import type {
 } from "./types";
 import { PixelIcon } from "./PixelIcon";
 import type { PixelIconName } from "../art/iconArt";
 import { getApprovedPlacementOrientations } from "../facility/roomVisualLayout";
 
 type BuildDoorTool = "place" | "remove" | null;
+type RoomSalePreviewView = NonNullable<SelectedRoomBuildView["salePreview"]>;
+type RoomSaleDialogState = {
+  preview: RoomSalePreviewView;
+  roomDisplayName: string;
+  resaleValueLabel?: string;
+};
 
 interface BuildPanelProps {
   buildMode: boolean;
   showInactiveTrigger?: boolean;
   cashLabel: string;
   roomOptions: RoomBuildOptionView[];
@@ -21,13 +27,13 @@ interface BuildPanelProps {
   onEnterBuildMode: () => void;
   onExitBuildMode: () => void;
   onSelectRoom: (roomDefinitionId: string) => void;
   onCancelPlacement: () => void;
   onRotatePlacement: () => void;
   onUpgradeSelectedRoom: () => void;
-  onSellSelectedRoom: () => void;
+  onSellSelectedRoom: (roomId: string, saleConfirmationToken?: string) => void;
   buildDoorTool: BuildDoorTool;
   onBuildDoorToolChange: (tool: BuildDoorTool) => void;
   onUndoBuildAction: () => void;
   undoCount: number;
   exitBlockedReason: string | null;
   exitBlockedIssues: string[];
@@ -128,12 +134,13 @@ export function BuildPanel({
   onUpgradeRequestHandled,
   endoscopySetupRequirements,
   onEndoscopySetupAction,
 }: BuildPanelProps) {
   const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
   const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
+  const [saleDialog, setSaleDialog] = useState<RoomSaleDialogState | null>(null);
 
   useEffect(() => {
     if (
       upgradeRequestRoomId &&
       selectedRoom?.id === upgradeRequestRoomId
     ) {
@@ -144,12 +151,19 @@ export function BuildPanel({
   useEffect(() => {
     if (exitBlockedIssues.length === 0 && !exitBlockedReason) {
       setInvalidDialogOpen(false);
     }
   }, [exitBlockedIssues, exitBlockedReason]);
 
+  useEffect(() => {
+    if (saleDialog && (!selectedRoom || selectedRoom.id !== saleDialog.preview.roomId ||
+      selectedRoom.salePreview?.confirmationToken !== saleDialog.preview.confirmationToken)) {
+      setSaleDialog(null);
+    }
+  }, [saleDialog, selectedRoom]);
+
   const exitIssues = useMemo(
     () =>
       exitBlockedIssues.length > 0
         ? exitBlockedIssues
         : exitBlockedReason
           ? [exitBlockedReason]
@@ -391,14 +405,22 @@ export function BuildPanel({
                     </small>
                   ) : null}
                 </button>
                 <button
                   className="button button-danger"
                   type="button"
-                  onClick={onSellSelectedRoom}
-                  disabled={!selectedRoom.canSell}
+                  onClick={() => {
+                    if (selectedRoom.salePreview) {
+                      setSaleDialog({
+                        preview: selectedRoom.salePreview,
+                        roomDisplayName: selectedRoom.displayName,
+                        resaleValueLabel: selectedRoom.resaleValueLabel,
+                      });
+                    }
+                  }}
+                  disabled={!selectedRoom.canSell || !selectedRoom.salePreview}
                 >
                   Sell
                   {selectedRoom.resaleValueLabel
                     ? ` - ${selectedRoom.resaleValueLabel}`
                     : ""}
                 </button>
@@ -435,12 +457,13 @@ export function BuildPanel({
                     <span>
                       <strong>{room.displayName}</strong>
                       <small>
                         {room.footprintLabel} - {room.costLabel}
                       </small>
                       <small>{room.upkeepLabel}</small>
+                      <small>{room.builtCountLabel}</small>
                       {room.blockedReason ? (
                         <small className="blocked-reason">
                           {room.blockedReason}
                         </small>
                       ) : null}
                       {room.id === "room.endoscopy" ? <small>Full setup guidance appears when selected.</small> : null}
@@ -501,12 +524,58 @@ export function BuildPanel({
               </button>
             </div>
           </section>
         </div>
       ) : null}
 
+      {saleDialog && typeof document !== "undefined"
+        ? createPortal(
+        <div className="dialog-backdrop" role="presentation">
+          <section
+            className="confirm-dialog room-sale-dialog"
+            role="dialog"
+            aria-modal="true"
+            aria-labelledby="room-sale-title"
+          >
+            <span className="eyebrow">Confirm room sale</span>
+            <h2 id="room-sale-title">Sell {saleDialog.roomDisplayName}?</h2>
+            {saleDialog.resaleValueLabel ? <p>Resale value: <strong>{saleDialog.resaleValueLabel}</strong></p> : null}
+            {saleDialog.preview.dismissedEmployees.length > 0 ? (
+              <>
+                <p>Selling this room will result in firing:</p>
+                <ul>
+                  {saleDialog.preview.dismissedEmployees.map((employee) => (
+                    <li key={employee.id}>{employee.displayName}</li>
+                  ))}
+                </ul>
+              </>
+            ) : (
+              <p>No employees will be dismissed.</p>
+            )}
+            <p>Interrupted tests will wait for another compatible room. If none remains, patients will leave for off-site testing and you will not earn the fee for unfinished testing.</p>
+            <div className="dialog-actions">
+              <button className="button button-secondary" type="button" onClick={() => setSaleDialog(null)}>
+                Cancel
+              </button>
+              <button
+                className="button button-danger"
+                type="button"
+                onClick={() => {
+                  onSellSelectedRoom(saleDialog.preview.roomId, saleDialog.preview.confirmationToken);
+                  setSaleDialog(null);
+                }}
+              >
+                Confirm Sale
+              </button>
+            </div>
+          </section>
+        </div>,
+            document.body,
+          )
+        : null}
+
       {invalidDialogOpen && typeof document !== "undefined"
         ? createPortal(
             <div
               className="dialog-backdrop invalid-layout-backdrop"
               role="presentation"
             >
```

```diff
diff --git a/.local-dev/room-capacity-sales/before/player-src/ui/types.ts b/apps/player/src/ui/types.ts
index be394f8..2268a44 100644
--- a/.local-dev/room-capacity-sales/before/player-src/ui/types.ts
+++ b/apps/player/src/ui/types.ts
@@ -280,12 +280,14 @@ export interface AdvertisingView {
 export interface RoomBuildOptionView {
   id: string;
   displayName: string;
   footprintLabel: string;
   costLabel: string;
   upkeepLabel: string;
+  /** Kept separate from upkeep so construction capacity stays readable. */
+  builtCountLabel: string;
   owned: boolean;
   selected: boolean;
   enabled: boolean;
   blockedReason?: string;
 }
 
@@ -298,12 +300,22 @@ export interface SelectedRoomBuildView {
   upgradeCostLabel?: string;
   upgradeImprovements: string[];
   resaleValueLabel?: string;
   canUpgrade: boolean;
   canSell: boolean;
   blockedReason?: string;
+  salePreview?: {
+    roomId: string;
+    roomDefinitionId: string;
+    dismissedEmployees: Array<{
+      id: string;
+      displayName: string;
+      staffRoleDefinitionId: string;
+    }>;
+    confirmationToken: string;
+  };
 }
 
 export interface StaffHireOptionView {
   id: string;
   displayName: string;
   costLabel: string;
```

