import { z } from "zod";

const stableIdSchema = z
  .string()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "Use a stable lowercase identifier.");

export const roomOrientationSchema = z.union([
  z.literal(0),
  z.literal(90),
  z.literal(180),
  z.literal(270),
]);

export const cardinalDirectionSchema = z.enum([
  "north",
  "east",
  "south",
  "west",
]);

export const serviceRouteDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    durationTicks: z.number().int().positive(),
    satisfactionOnResult: z.number().int().min(-20).max(20).default(0),
    requiredCapabilityId: stableIdSchema.nullable(),
    requiredCapabilityIds: z.array(stableIdSchema).default([]),
    resourceRequirements: z
      .array(
        z
          .object({
            roomDefinitionId: stableIdSchema,
            staffRoleDefinitionId: stableIdSchema.nullable(),
          })
          .strict(),
      )
      .default([]),
    /**
     * An optional clinician-capacity requirement. The named employee role is
     * preferred, while the Founder can be selected only when explicitly
     * allowed by the route. This is operational simulation data, not a
     * statement about clinical supervision requirements.
     */
    providerRequirement: z
      .object({
        preferredEmployeeStaffRoleDefinitionId: stableIdSchema,
        founderEligible: z.boolean(),
      })
      .strict()
      .nullable()
      .default(null),
    timingPhases: z
      .array(
        z
          .object({
            id: stableIdSchema,
            durationTicks: z.number().int().positive(),
            resourceBound: z.boolean(),
          })
          .strict(),
      )
      .default([]),
    preference: z.number().int().nonnegative(),
    patientTravel: z
      .object({
        originRoomDefinitionId: stableIdSchema,
        destinationRoomDefinitionId: stableIdSchema,
        roundTrip: z.literal(true),
      })
      .strict()
      .nullable()
      .default(null),
  })
  .strict()
  .superRefine((route, context) => {
    if (route.timingPhases.length === 0) {
      return;
    }
    const phaseDuration = route.timingPhases.reduce(
      (total, phase) => total + phase.durationTicks,
      0,
    );
    if (phaseDuration !== route.durationTicks) {
      context.addIssue({
        code: "custom",
        message:
          "Nonempty route timing phases must sum exactly to durationTicks.",
        path: ["timingPhases"],
      });
    }
  });

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
    kind: z.enum(["room", "hallway"]),
    unlockFacilityLevel: z.number().int().min(0).max(2),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    defaultDoorSide: cardinalDirectionSchema.nullable(),
    constructionCost: z.number().int().nonnegative(),
    upkeepPerExpenseInterval: z.number().int().nonnegative(),
    satisfactionOnBuild: z.number().int().min(0).max(20),
    workloadLimitContribution: z.number().int().nonnegative(),
    maximumInstances: z.number().int().positive().nullable(),
    maximumUpgradeLevel: z.number().int().min(1).max(5),
    upgradeCosts: z.array(z.number().int().nonnegative()).max(4),
    upkeepPerUpgradeLevel: z.number().int().nonnegative(),
    workloadLimitContributionPerUpgradeLevel: z
      .number()
      .int()
      .nonnegative(),
    serviceDurationReductionPercentPerUpgradeLevel: z
      .number()
      .int()
      .min(0)
      .max(20),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    capabilityIds: z.array(stableIdSchema),
    navigation: z
      .object({
        /**
         * Coordinates are stored in the definition's unrotated local space.
         * The domain rotates them with the room instance.
         */
        blockedTiles: z.array(
          z.object({
            x: z.number().int().nonnegative(),
            y: z.number().int().nonnegative(),
          }),
        ),
        primaryAnchor: z
          .object({
            x: z.number().int().nonnegative(),
            y: z.number().int().nonnegative(),
          })
          .nullable(),
        waitingAnchors: z.array(
          z.object({
            x: z.number().int().nonnegative(),
            y: z.number().int().nonnegative(),
          }),
        ),
        staffAnchor: z
          .object({
            x: z.number().int().nonnegative(),
            y: z.number().int().nonnegative(),
          })
          .nullable(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((room, context) => {
    if (room.upgradeCosts.length !== room.maximumUpgradeLevel - 1) {
      context.addIssue({
        code: "custom",
        message:
          "A room needs exactly one upgrade cost for every level after Level 1.",
        path: ["upgradeCosts"],
      });
    }
    if (room.kind === "hallway" && room.defaultDoorSide !== null) {
      context.addIssue({
        code: "custom",
        message: "Hallway tiles do not have a door side.",
        path: ["defaultDoorSide"],
      });
    }
    const navigation = room.navigation;
    if (navigation) {
      const inBounds = (point: { x: number; y: number }) =>
        point.x < room.width && point.y < room.height;
      const key = (point: { x: number; y: number }) =>
        `${point.x},${point.y}`;
      const blocked = new Set(
        navigation.blockedTiles.map((point) => key(point)),
      );
      const seenBlocked = new Set<string>();
      navigation.blockedTiles.forEach((point, index) => {
        if (!inBounds(point)) {
          context.addIssue({
            code: "custom",
            message: "A blocked navigation tile is outside the room footprint.",
            path: ["navigation", "blockedTiles", index],
          });
        }
        const pointKey = key(point);
        if (seenBlocked.has(pointKey)) {
          context.addIssue({
            code: "custom",
            message: "Blocked navigation tiles must be unique.",
            path: ["navigation", "blockedTiles", index],
          });
        }
        seenBlocked.add(pointKey);
      });
      const validateAnchor = (
        point: { x: number; y: number } | null,
        path: Array<string | number>,
      ) => {
        if (!point) {
          return;
        }
        if (!inBounds(point)) {
          context.addIssue({
            code: "custom",
            message: "A navigation anchor is outside the room footprint.",
            path,
          });
        }
        if (blocked.has(key(point))) {
          context.addIssue({
            code: "custom",
            message: "A navigation anchor cannot occupy a blocked tile.",
            path,
          });
        }
      };
      validateAnchor(navigation.primaryAnchor, [
        "navigation",
        "primaryAnchor",
      ]);
      validateAnchor(navigation.staffAnchor, [
        "navigation",
        "staffAnchor",
      ]);
      const waitingKeys = new Set<string>();
      navigation.waitingAnchors.forEach((point, index) => {
        validateAnchor(point, [
          "navigation",
          "waitingAnchors",
          index,
        ]);
        const pointKey = key(point);
        if (waitingKeys.has(pointKey)) {
          context.addIssue({
            code: "custom",
            message: "Waiting navigation anchors must be unique.",
            path: ["navigation", "waitingAnchors", index],
          });
        }
        waitingKeys.add(pointKey);
      });
    }
  });

export const staffRoleDefinitionSchema = z
  .object({
    id: stableIdSchema,
    displayName: z.string().min(1).max(160),
    unlockFacilityLevel: z.number().int().min(1).max(2),
    hiringCost: z.number().int().nonnegative(),
    salaryPerExpenseInterval: z.number().int().nonnegative(),
    minimumSalaryPerExpenseInterval: z.number().int().nonnegative(),
    maximumSalaryPerExpenseInterval: z.number().int().nonnegative(),
    salaryAdjustmentStep: z.number().int().positive(),
    moralePerSalaryStep: z.number().int().positive(),
    baseMorale: z.number().int().min(0).max(100),
    maximumEmployees: z.number().int().positive(),
    maximumTrainingLevel: z.number().int().min(1).max(5),
    workloadLimitContribution: z.number().int().nonnegative(),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    capabilityIds: z.array(stableIdSchema),
  })
  .strict()
  .superRefine((role, context) => {
    if (
      role.minimumSalaryPerExpenseInterval >
        role.salaryPerExpenseInterval ||
      role.salaryPerExpenseInterval > role.maximumSalaryPerExpenseInterval
    ) {
      context.addIssue({
        code: "custom",
        message:
          "The default salary must be between the role's minimum and maximum salary.",
        path: ["salaryPerExpenseInterval"],
      });
    }
  });

export const patientRewardTierSchema = z
  .object({
    id: stableIdSchema,
    completionRevenue: z.number().int().nonnegative(),
  })
  .strict();

export const facilityStageDefinitionSchema = z
  .object({
    level: z.number().int().min(0).max(2),
    displayName: z.string().min(1).max(160),
    minimumClinicalXp: z.number().int().nonnegative(),
    minimumCompletedEncounters: z.number().int().nonnegative(),
    satisfactionMustBeGreaterThan: z.number().int().min(0).max(99),
    requiredRoomDefinitionIds: z.array(stableIdSchema),
    requiredStaffRoleIds: z.array(stableIdSchema),
    nextFacilityLevel: z.number().int().min(1).max(2).nullable(),
  })
  .strict();

export const initialRoomSchema = z
  .object({
    id: stableIdSchema,
    roomDefinitionId: stableIdSchema,
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    orientation: roomOrientationSchema,
    doorSide: cardinalDirectionSchema.nullable(),
    upgradeLevel: z.number().int().min(1).max(5),
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
        hallwayRoomDefinitionId: stableIdSchema,
        protectedRoomDefinitionIds: z.array(stableIdSchema).min(1),
        roomResalePercent: z.number().int().min(0).max(99),
        staffMovementIntervalTicks: z.number().int().positive(),
        characterTravelTilesPerTick: z.number().int().positive(),
        startingCash: z.number().int().nonnegative(),
        startingSatisfaction: z.number().int().min(0).max(100),
        maximumPlayableLevel: z.literal(2),
        initialRooms: z.array(initialRoomSchema).min(1),
        roomDefinitions: z.array(roomDefinitionSchema).min(1),
        staffRoleDefinitions: z.array(staffRoleDefinitionSchema).min(1),
        stageDefinitions: z.array(facilityStageDefinitionSchema).length(3),
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
    clock: z
      .object({
        facilityHoursPerTick: z.literal(1),
        realMillisecondsPerFacilityHour: z.number().int().positive(),
        simulatedMinutesPerTick: z.literal(1),
        realMillisecondsPerFacilityMinuteAt1x: z
          .number()
          .int()
          .positive(),
        supportedSpeeds: z.tuple([
          z.literal(1),
          z.literal(2),
          z.literal(4),
        ]),
        dayStartHour: z.number().int().min(0).max(23),
        dayEndHour: z.number().int().min(1).max(24),
      })
      .strict()
      .superRefine((clock, context) => {
        if (clock.dayEndHour <= clock.dayStartHour) {
          context.addIssue({
            code: "custom",
            message: "The facility day must end after it starts.",
            path: ["dayEndHour"],
          });
        }
        if (clock.dayEndHour - clock.dayStartHour !== 10) {
          context.addIssue({
            code: "custom",
            message: "The prototype facility day must contain ten operating hours.",
            path: ["dayEndHour"],
          });
        }
      }),
    patientPatience: z
      .object({
        routineDurationTicks: z.number().int().positive(),
        warningAtRemainingTicks: z.array(z.number().int().nonnegative()).min(1),
        satisfactionPenaltyAtWarningTicks: z
          .array(z.number().int().nonnegative())
          .default([]),
        satisfactionPenaltyPerWarning: z
          .number()
          .int()
          .nonnegative()
          .max(20)
          .default(0),
        leftBeforeSeenSatisfactionPenalty: z.number().int().nonnegative().max(20),
      })
      .strict(),
    patientSatisfaction: z
      .object({
        startingValue: z.literal(100),
        idleGraceMinutes: z.number().int().nonnegative(),
        decayIntervalMinutes: z.number().int().positive(),
        decayPerInterval: z.number().int().positive().max(20),
        sidewalkDecayMultiplierPercent: z.number().int().min(100).max(400),
        warningThresholds: z
          .array(z.number().int().min(0).max(99))
          .min(1),
        walkoutThresholdMinimum: z.literal(0),
        walkoutThresholdMaximum: z.literal(59),
        correctCareRecovery: z.number().int().nonnegative().max(20),
        incorrectCarePenalty: z.number().int().nonnegative().max(20),
        cleanRoomThreshold: z.number().int().min(1).max(100),
        dirtyRoomThreshold: z.number().int().min(0).max(99),
        cleanRoomCompletionBonus: z.number().int().nonnegative().max(20),
        dirtyRoomCompletionPenalty: z.number().int().nonnegative().max(20),
        roomUpgradeBonusPerLevel: z.number().int().nonnegative().max(10),
        maximumRoomUpgradeBonus: z.number().int().nonnegative().max(20),
        happyStaffMoraleThreshold: z.number().int().min(0).max(100),
        unhappyStaffMoraleThreshold: z.number().int().min(0).max(100),
        happyStaffCompletionBonus: z.number().int().nonnegative().max(20),
        unhappyStaffCompletionPenalty: z.number().int().nonnegative().max(20),
        maximumAmenityCompletionBonus: z.number().int().nonnegative().max(20),
        roomCleanlinessLossPerEncounter: z.number().int().nonnegative().max(20),
        rollingWindowSize: z.number().int().positive().max(100),
        facilityConditionPenalties: z
          .object({
            maximumTotal: z.number().int().nonnegative().max(50),
            visibleLitterPerItem: z.number().int().nonnegative().max(20),
            visibleLitterMaximum: z.number().int().nonnegative().max(50),
            dirtyCleanliness: z.number().int().nonnegative().max(20),
            emptyWaterCooler: z.number().int().nonnegative().max(20),
            missingWaitingRoom: z.number().int().nonnegative().max(20),
            missingExaminationRoom: z.number().int().nonnegative().max(20),
            missingBathroom: z.number().int().nonnegative().max(20),
            noReceptionist: z.number().int().nonnegative().max(20),
            lowStaffMorale: z.number().int().nonnegative().max(20),
            unavailableOnsiteXray: z.number().int().nonnegative().max(20),
          })
          .strict(),
      })
      .strict(),
    environment: z
      .object({
        litterSpawnMinimumMinutes: z.number().int().positive(),
        litterSpawnMaximumMinutes: z.number().int().positive(),
        maximumLitterItems: z.number().int().positive().max(12),
        litterCleanupRestore: z.number().int().positive().max(100),
        litterCleanupSatisfactionBonus: z.number().int().nonnegative().max(10),
        waterCoolerDrainIntervalMinutes: z.number().int().positive(),
        waterCoolerDrainPerInterval: z.number().int().positive().max(100),
        waterCoolerLowThreshold: z.number().int().min(0).max(99),
        waterCoolerEmptyReminderMinutes: z.number().int().positive(),
        receptionistWaterRefillDelayMinutes: z.number().int().positive(),
        waterRefillSatisfactionBonus: z.number().int().nonnegative().max(10),
        praiseMoraleBonus: z.number().int().positive().max(25),
        praiseCooldownMinutes: z.number().int().positive(),
        founderInteractionMinutes: z.number().int().positive().max(30),
        idleActionMinimumMinutes: z.number().int().positive(),
        idleActionMaximumMinutes: z.number().int().positive(),
        idleActionChancePercent: z.number().int().min(0).max(100),
        sidewalkPedestrianMinimumMinutes: z.number().int().positive(),
        sidewalkPedestrianMaximumMinutes: z.number().int().positive(),
        maximumSidewalkPedestrians: z.number().int().positive().max(4),
        glp1AutomationIntervalMinutes: z.number().int().positive(),
        glp1AutomationPayment: z.number().int().nonnegative(),
        glp1AutomationMaximumCapacity: z.number().int().positive().max(10),
        evsRoomCleanlinessThreshold: z.number().int().min(0).max(100),
        evsRoomCleanupMinutes: z.number().int().positive(),
        evsRoomCleanlinessRestore: z.number().int().positive().max(100),
        evsRoomCleanupCooldownMinutes: z.number().int().positive(),
        trainingRoutineWorkloadContribution: z.number().int().nonnegative().max(10),
        coffeeMoraleBonusPerDay: z.number().int().nonnegative().max(25),
      })
      .strict()
      .superRefine((environment, context) => {
        if (
          environment.litterSpawnMaximumMinutes <
          environment.litterSpawnMinimumMinutes
        ) {
          context.addIssue({
            code: "custom",
            message: "The litter spawn range is inverted.",
            path: ["litterSpawnMaximumMinutes"],
          });
        }
        if (
          environment.idleActionMaximumMinutes <
          environment.idleActionMinimumMinutes
        ) {
          context.addIssue({
            code: "custom",
            message: "The idle-action interval range is inverted.",
            path: ["idleActionMaximumMinutes"],
          });
        }
        if (
          environment.sidewalkPedestrianMaximumMinutes <
          environment.sidewalkPedestrianMinimumMinutes
        ) {
          context.addIssue({
            code: "custom",
            message: "The sidewalk-pedestrian interval range is inverted.",
            path: ["sidewalkPedestrianMaximumMinutes"],
          });
        }
      }),
    arrivals: z
      .object({
        levelZeroRecoveryIntervalTicks: z.number().int().positive(),
        levelOneRoutineIntervalTicks: z.number().int().positive(),
        firstArrivalMinimumMinutes: z.number().int().positive(),
        firstArrivalMaximumMinutes: z.number().int().positive(),
        routineBaseIntervalMinutes: z.number().int().positive(),
        routineVariationMinutes: z.number().int().nonnegative(),
      })
      .strict()
      .superRefine((arrivals, context) => {
        if (
          arrivals.firstArrivalMaximumMinutes <
          arrivals.firstArrivalMinimumMinutes
        ) {
          context.addIssue({
            code: "custom",
            message: "The first-arrival range is inverted.",
            path: ["firstArrivalMaximumMinutes"],
          });
        }
        if (
          arrivals.routineVariationMinutes >=
          arrivals.routineBaseIntervalMinutes
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Arrival variation must be smaller than the base interval.",
            path: ["routineVariationMinutes"],
          });
        }
      }),
    economy: z
      .object({
        expenseIntervalTicks: z.number().int().positive(),
        postingIntervalMinutes: z.literal(15),
      })
      .strict(),
    advertising: z
      .object({
        levels: z
          .array(
            z
              .object({
                level: z.number().int().nonnegative(),
                displayName: z.string().min(1).max(80),
                hourlyCost: z.number().int().nonnegative(),
                arrivalIntervalMultiplierPercent: z
                  .number()
                  .int()
                  .min(50)
                  .max(100),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
    insolvency: z
      .object({
        moraleDecayPerPosting: z.number().int().positive().max(25),
        employeeQuittingThreshold: z.number().int().min(0).max(99),
      })
      .strict(),
    emergencyGlp1: z
      .object({
        lowCashAlertThreshold: z.number().int().positive(),
        dedicatedRoomDefinitionId: stableIdSchema,
        cooldownTicks: z.number().int().positive(),
        cooldownMinutes: z.number().int().positive(),
        payment: z.number().int().positive(),
        sarcasmStartsAtUse: z.number().int().positive(),
        sarcasmLines: z.array(z.string().min(1).max(240)).min(4),
      })
      .strict(),
    development: z
      .object({
        fastForwardTickCount: z.number().int().positive(),
        addMoneyAmount: z.number().int().positive(),
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
        clinicalXpPerIncorrectFirstAnswer: z.number().int().nonnegative(),
        firstTutorialCorrectDecisionXp: z.number().int().nonnegative(),
        levelZeroBasePayment: z.number().int().nonnegative(),
        levelZeroPerQuestionPayment: z.number().int().nonnegative(),
        levelZeroPerCorrectPayment: z.number().int().nonnegative(),
        levelOneBasePayment: z.number().int().nonnegative(),
        levelOnePerQuestionPayment: z.number().int().nonnegative(),
        levelOnePerCorrectPayment: z.number().int().nonnegative(),
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
    const hallwayDefinition = roomDefinitions.get(
      release.facility.hallwayRoomDefinitionId,
    );
    if (!hallwayDefinition || hallwayDefinition.kind !== "hallway") {
      context.addIssue({
        code: "custom",
        message: "The facility hallway definition is missing or is not a hallway.",
        path: ["facility", "hallwayRoomDefinitionId"],
      });
    }
    release.facility.protectedRoomDefinitionIds.forEach(
      (roomDefinitionId, index) => {
        if (!roomDefinitions.has(roomDefinitionId)) {
          context.addIssue({
            code: "custom",
            message: `Protected room definition does not exist: ${roomDefinitionId}`,
            path: ["facility", "protectedRoomDefinitionIds", index],
          });
        }
      },
    );

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
        room.x +
            (room.orientation === 90 || room.orientation === 270
              ? definition.height
              : definition.width) >
          release.facility.gridWidth ||
        room.y +
            (room.orientation === 90 || room.orientation === 270
              ? definition.width
              : definition.height) >
          release.facility.gridHeight
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
        const leftWidth =
          left.orientation === 90 || left.orientation === 270
            ? leftDefinition.height
            : leftDefinition.width;
        const leftHeight =
          left.orientation === 90 || left.orientation === 270
            ? leftDefinition.width
            : leftDefinition.height;
        const rightWidth =
          right.orientation === 90 || right.orientation === 270
            ? (rightDefinition?.height ?? 0)
            : (rightDefinition?.width ?? 0);
        const rightHeight =
          right.orientation === 90 || right.orientation === 270
            ? (rightDefinition?.width ?? 0)
            : (rightDefinition?.height ?? 0);
        if (
          rightDefinition &&
          left.x < right.x + rightWidth &&
          left.x + leftWidth > right.x &&
          left.y < right.y + rightHeight &&
          left.y + leftHeight > right.y
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
    if (
      !stagesByLevel.has(0) ||
      !stagesByLevel.has(1) ||
      !stagesByLevel.has(2)
    ) {
      context.addIssue({
        code: "custom",
        message: "Prototype progression must define Levels 0, 1, and 2.",
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
    const satisfactionPenaltyThresholds =
      release.patientPatience.satisfactionPenaltyAtWarningTicks;
    const uniquePenaltyThresholds = new Set(satisfactionPenaltyThresholds);
    if (uniquePenaltyThresholds.size !== satisfactionPenaltyThresholds.length) {
      context.addIssue({
        code: "custom",
        message: "Patience satisfaction-penalty thresholds must be unique.",
        path: ["patientPatience", "satisfactionPenaltyAtWarningTicks"],
      });
    }
    if (
      satisfactionPenaltyThresholds.some(
        (threshold) => !warningThresholds.includes(threshold),
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Every patience satisfaction-penalty threshold must also be a warning threshold.",
        path: ["patientPatience", "satisfactionPenaltyAtWarningTicks"],
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
      service.routes.forEach((route, routeIndex) => {
        if (
          route.patientTravel &&
          !roomDefinitions.has(route.patientTravel.originRoomDefinitionId)
        ) {
          context.addIssue({
            code: "custom",
            message: `Service route ${route.id} references a missing travel origin room.`,
            path: [
              "services",
              index,
              "routes",
              routeIndex,
              "patientTravel",
              "originRoomDefinitionId",
            ],
          });
        }
        if (
          route.patientTravel &&
          !roomDefinitions.has(
            route.patientTravel.destinationRoomDefinitionId,
          )
        ) {
          context.addIssue({
            code: "custom",
            message: `Service route ${route.id} references a missing travel destination room.`,
            path: [
              "services",
              index,
              "routes",
              routeIndex,
              "patientTravel",
              "destinationRoomDefinitionId",
            ],
          });
        }
      });
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
