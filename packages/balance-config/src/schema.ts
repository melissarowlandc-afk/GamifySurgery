import { z } from "zod";

const stableIdSchema = z
  .string()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "Use a stable lowercase identifier.");

export const serviceRouteDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    durationTicks: z.number().int().positive(),
    requiredCapabilityId: stableIdSchema.nullable(),
    requiredCapabilityIds: z.array(stableIdSchema).default([]),
    preference: z.number().int().nonnegative(),
  })
  .strict();

export const serviceDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    routes: z.array(serviceRouteDefinitionSchema).min(1),
  })
  .strict()
  .superRefine((service, context) => {
    const routeIds = new Set<string>();
    service.routes.forEach((route, index) => {
      if (routeIds.has(route.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate service route ID: ${route.id}`,
          path: ["routes", index, "id"],
        });
      }
      routeIds.add(route.id);
    });
  });

export const roomDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    unlockFacilityLevel: z.number().int().min(0).max(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    constructionCost: z.number().int().nonnegative(),
    upkeepPerExpenseInterval: z.number().int().nonnegative(),
    satisfactionOnBuild: z.number().int().min(0).max(20),
    workloadLimitContribution: z.number().int().nonnegative(),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    capabilityIds: z.array(stableIdSchema),
  })
  .strict();

export const staffRoleDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    unlockFacilityLevel: z.number().int().min(1).max(1),
    hiringCost: z.number().int().nonnegative(),
    salaryPerExpenseInterval: z.number().int().nonnegative(),
    workloadLimitContribution: z.number().int().nonnegative(),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    capabilityIds: z.array(stableIdSchema),
  })
  .strict();

export const patientRewardTierSchema = z
  .object({
    id: stableIdSchema,
    completionRevenue: z.number().int().nonnegative(),
  })
  .strict();

export const facilityStageDefinitionSchema = z
  .object({
    level: z.number().int().min(0).max(1),
    displayName: z.string().min(1).max(160),
    minimumClinicalXp: z.number().int().nonnegative(),
    minimumCompletedEncounters: z.number().int().nonnegative(),
    satisfactionMustBeGreaterThan: z.number().int().min(0).max(99),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    requiredStaffRoleIds: z.array(stableIdSchema),
    nextFacilityLevel: z.number().int().min(1).max(1).nullable(),
  })
  .strict();

export const initialRoomSchema = z
  .object({
    id: stableIdSchema,
    roomDefinitionId: stableIdSchema,
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
  })
  .strict();

export const prototypeBalanceReleaseSchema = z
  .object({
    id: stableIdSchema,
    schemaVersion: z.literal(1),
    publicationStatus: z.literal("prototype_unpublished"),
    facility: z
      .object({
        gridWidth: z.number().int().positive(),
        gridHeight: z.number().int().positive(),
        startingCash: z.number().int().nonnegative(),
        startingSatisfaction: z.number().int().min(0).max(100),
        maximumPlayableLevel: z.literal(1),
        initialRooms: z.array(initialRoomSchema).min(1),
        roomDefinitions: z.array(roomDefinitionSchema).min(1),
        staffRoleDefinitions: z.array(staffRoleDefinitionSchema).min(1),
        stageDefinitions: z.array(facilityStageDefinitionSchema).length(2),
        tutorialRequiredRoomDefinitionId: stableIdSchema,
        tutorialMinimumOperatingBuffer: z.number().int().nonnegative(),
      })
      .strict(),
    workload: z
      .object({
        baseRoutineLimit: z.number().int().positive(),
        criticalReservedSlots: z.number().int().nonnegative(),
      })
      .strict(),
    patientPatience: z
      .object({
        routineDurationTicks: z.number().int().positive(),
        warningAtRemainingTicks: z.array(z.number().int().nonnegative()).min(1),
        leftBeforeSeenSatisfactionPenalty: z.number().int().nonnegative().max(20),
      })
      .strict(),
    arrivals: z
      .object({
        levelZeroRecoveryIntervalTicks: z.number().int().positive(),
        levelOneRoutineIntervalTicks: z.number().int().positive(),
      })
      .strict(),
    economy: z
      .object({
        expenseIntervalTicks: z.number().int().positive(),
      })
      .strict(),
    development: z
      .object({
        fastForwardTickCount: z.number().int().positive(),
      })
      .strict(),
    learning: z
      .object({
        parameterSetId: stableIdSchema,
        requestedRetention: z.number().gt(0).lte(1),
        maximumIntervalDays: z.number().int().positive(),
        minimumAgainDelayMinutes: z.number().int().positive(),
        enableFuzz: z.literal(false),
      })
      .strict(),
    clinicalSettlement: z
      .object({
        patientRewardTiers: z.array(patientRewardTierSchema).min(1),
        maximumQualityRevenueBonus: z.number().int().nonnegative(),
        maximumIncorrectFinancialConsequence: z.number().int().nonnegative(),
        clinicalXpPerCorrectFirstAnswer: z.number().int().nonnegative(),
        maximumCorrectSatisfactionBonus: z.number().int().nonnegative(),
        maximumIncorrectSatisfactionConsequence: z.number().int().nonnegative(),
        patientSatisfactionDeltaMinimum: z.number().int().min(-100).max(0),
        patientSatisfactionDeltaMaximum: z.number().int().min(0).max(100),
      })
      .strict(),
    services: z.array(serviceDefinitionSchema).min(1),
  })
  .strict()
  .superRefine((release, context) => {
    const roomDefinitions = new Map(
      release.facility.roomDefinitions.map((room) => [room.id, room]),
    );
    const staffRoles = new Map(
      release.facility.staffRoleDefinitions.map((role) => [role.id, role]),
    );
    if (!roomDefinitions.has(release.facility.tutorialRequiredRoomDefinitionId)) {
      context.addIssue({
        code: "custom",
        message: "The tutorial-required room definition does not exist.",
        path: ["facility", "tutorialRequiredRoomDefinitionId"],
      });
    }

    const roomDefinitionIds = new Set<string>();
    release.facility.roomDefinitions.forEach((room, index) => {
      if (roomDefinitionIds.has(room.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate room definition ID: ${room.id}`,
          path: ["facility", "roomDefinitions", index, "id"],
        });
      }
      roomDefinitionIds.add(room.id);
    });

    const initialRoomIds = new Set<string>();
    release.facility.initialRooms.forEach((room, index) => {
      if (initialRoomIds.has(room.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate initial room ID: ${room.id}`,
          path: ["facility", "initialRooms", index, "id"],
        });
      }
      initialRoomIds.add(room.id);

      const definition = roomDefinitions.get(room.roomDefinitionId);
      if (!definition) {
        context.addIssue({
          code: "custom",
          message: `Unknown initial room definition: ${room.roomDefinitionId}`,
          path: ["facility", "initialRooms", index, "roomDefinitionId"],
        });
      } else if (
        room.x + definition.width > release.facility.gridWidth ||
        room.y + definition.height > release.facility.gridHeight
      ) {
        context.addIssue({
          code: "custom",
          message: `Initial room ${room.id} is outside the facility grid.`,
          path: ["facility", "initialRooms", index],
        });
      }
    });
    for (
      let leftIndex = 0;
      leftIndex < release.facility.initialRooms.length;
      leftIndex += 1
    ) {
      const left = release.facility.initialRooms[leftIndex]!;
      const leftDefinition = roomDefinitions.get(left.roomDefinitionId);
      if (!leftDefinition) {
        continue;
      }
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < release.facility.initialRooms.length;
        rightIndex += 1
      ) {
        const right = release.facility.initialRooms[rightIndex]!;
        const rightDefinition = roomDefinitions.get(right.roomDefinitionId);
        if (
          rightDefinition &&
          left.x < right.x + rightDefinition.width &&
          left.x + leftDefinition.width > right.x &&
          left.y < right.y + rightDefinition.height &&
          left.y + leftDefinition.height > right.y
        ) {
          context.addIssue({
            code: "custom",
            message: `Initial rooms ${left.id} and ${right.id} overlap.`,
            path: ["facility", "initialRooms", rightIndex],
          });
        }
      }
    }

    release.facility.roomDefinitions.forEach((room, roomIndex) => {
      room.requiredRoomDefinitionIds.forEach((requiredId) => {
        if (!roomDefinitions.has(requiredId)) {
          context.addIssue({
            code: "custom",
            message: `Room ${room.id} requires missing room definition ${requiredId}.`,
            path: ["facility", "roomDefinitions", roomIndex, "requiredRoomDefinitionIds"],
          });
        }
      });
    });

    const staffRoleIds = new Set<string>();
    release.facility.staffRoleDefinitions.forEach((role, roleIndex) => {
      if (staffRoleIds.has(role.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate staff role ID: ${role.id}`,
          path: ["facility", "staffRoleDefinitions", roleIndex, "id"],
        });
      }
      staffRoleIds.add(role.id);
      role.requiredRoomDefinitionIds.forEach((requiredId) => {
        if (!roomDefinitions.has(requiredId)) {
          context.addIssue({
            code: "custom",
            message: `Staff role ${role.id} requires missing room definition ${requiredId}.`,
            path: [
              "facility",
              "staffRoleDefinitions",
              roleIndex,
              "requiredRoomDefinitionIds",
            ],
          });
        }
      });
    });

    const stagesByLevel = new Map(
      release.facility.stageDefinitions.map((stage) => [stage.level, stage]),
    );
    if (!stagesByLevel.has(0) || !stagesByLevel.has(1)) {
      context.addIssue({
        code: "custom",
        message: "Prototype progression must define both Level 0 and Level 1.",
        path: ["facility", "stageDefinitions"],
      });
    }
    release.facility.stageDefinitions.forEach((stage, stageIndex) => {
      stage.requiredRoomDefinitionIds.forEach((requiredId) => {
        if (!roomDefinitions.has(requiredId)) {
          context.addIssue({
            code: "custom",
            message: `Stage ${stage.level} requires missing room definition ${requiredId}.`,
            path: [
              "facility",
              "stageDefinitions",
              stageIndex,
              "requiredRoomDefinitionIds",
            ],
          });
        }
      });
      stage.requiredStaffRoleIds.forEach((requiredId) => {
        if (!staffRoles.has(requiredId)) {
          context.addIssue({
            code: "custom",
            message: `Stage ${stage.level} requires missing staff role ${requiredId}.`,
            path: [
              "facility",
              "stageDefinitions",
              stageIndex,
              "requiredStaffRoleIds",
            ],
          });
        }
      });
    });

    const warningThresholds = release.patientPatience.warningAtRemainingTicks;
    const uniqueWarnings = new Set(warningThresholds);
    if (uniqueWarnings.size !== warningThresholds.length) {
      context.addIssue({
        code: "custom",
        message: "Patience warning thresholds must be unique.",
        path: ["patientPatience", "warningAtRemainingTicks"],
      });
    }
    if (
      warningThresholds.some(
        (threshold) => threshold >= release.patientPatience.routineDurationTicks,
      )
    ) {
      context.addIssue({
        code: "custom",
        message: "Patience warnings must occur after a patient arrives.",
        path: ["patientPatience", "warningAtRemainingTicks"],
      });
    }
    if (!warningThresholds.includes(0)) {
      context.addIssue({
        code: "custom",
        message:
          "A zero-remaining-tick warning is required so the final warning is visible before departure.",
        path: ["patientPatience", "warningAtRemainingTicks"],
      });
    }

    if (
      release.clinicalSettlement.patientSatisfactionDeltaMinimum >
      release.clinicalSettlement.patientSatisfactionDeltaMaximum
    ) {
      context.addIssue({
        code: "custom",
        message: "The patient satisfaction delta bounds are inverted.",
        path: ["clinicalSettlement"],
      });
    }

    const serviceIds = new Set<string>();
    release.services.forEach((service, index) => {
      if (serviceIds.has(service.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate service definition ID: ${service.id}`,
          path: ["services", index, "id"],
        });
      }
      serviceIds.add(service.id);
    });

    const rewardTierIds = new Set<string>();
    release.clinicalSettlement.patientRewardTiers.forEach((tier, index) => {
      if (rewardTierIds.has(tier.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate patient reward tier ID: ${tier.id}`,
          path: ["clinicalSettlement", "patientRewardTiers", index, "id"],
        });
      }
      rewardTierIds.add(tier.id);
    });

    const tutorialRoom = roomDefinitions.get(
      release.facility.tutorialRequiredRoomDefinitionId,
    );
    if (tutorialRoom) {
      const minimumCompletionRevenue = Math.min(
        ...release.clinicalSettlement.patientRewardTiers.map(
          (tier) => tier.completionRevenue,
        ),
      );
      const worstCaseTutorialCash =
        release.facility.startingCash +
        minimumCompletionRevenue -
        release.clinicalSettlement.maximumIncorrectFinancialConsequence;
      const cashAfterConstruction =
        worstCaseTutorialCash - tutorialRoom.constructionCost;
      if (cashAfterConstruction < release.facility.tutorialMinimumOperatingBuffer) {
        context.addIssue({
          code: "custom",
          message:
            "Worst-case tutorial funding does not cover the required room and operating buffer.",
          path: ["facility", "tutorialMinimumOperatingBuffer"],
        });
      }
    }
  });

export type ServiceRouteDefinition = z.infer<typeof serviceRouteDefinitionSchema>;
export type ServiceDefinition = z.infer<typeof serviceDefinitionSchema>;
export type RoomDefinition = z.infer<typeof roomDefinitionSchema>;
export type StaffRoleDefinition = z.infer<typeof staffRoleDefinitionSchema>;
export type PatientRewardTier = z.infer<typeof patientRewardTierSchema>;
export type FacilityStageDefinition = z.infer<
  typeof facilityStageDefinitionSchema
>;
export type InitialRoom = z.infer<typeof initialRoomSchema>;
export type PrototypeBalanceRelease = z.infer<
  typeof prototypeBalanceReleaseSchema
>;

export function validatePrototypeBalanceRelease(
  candidate: unknown,
): PrototypeBalanceRelease {
  return prototypeBalanceReleaseSchema.parse(candidate);
}
