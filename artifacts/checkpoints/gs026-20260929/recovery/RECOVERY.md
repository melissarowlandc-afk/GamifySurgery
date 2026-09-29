# Shared-file recovery notes

These excerpts preserve only the bounded task changes that live inside shared
files. They are not an automatic patch. The recorded line numbers describe the
September 29, 2026 source snapshot and will drift as the repository changes.
Use `SOURCE_HASHES.json` to identify the exact source versions reviewed here.

## Employee still allocation and persistence

### `packages/game-domain/src/types.ts`

Near `PatientIdentityId` and inside `PixelAppearanceDescriptor`, retain the
presentation-only type and optional cosmetic field:

```ts
/** Persisted cosmetic still identity. Unknown bounded values are retained so
 * newer asset catalogs can round-trip through older domain builds. */
export type CharacterStillId = string;

/** Cosmetic artwork identity, separate from clinical and patient identity. */
stillId?: CharacterStillId;
```

### `packages/game-domain/src/index.ts`

Adjacent to the `appearance` export, expose the catalog:

```ts
export * from "./appearance";
export * from "./characterStillCatalog";
```

### `packages/game-domain/src/appearance.ts`

The file imports the catalog helpers and `CharacterStillId`. The employee
allocator at source lines 408–440 must preserve a valid free current identity,
choose the deterministic preference from the complete role pool, and only hash
within the remaining pool when that preference is occupied:

```ts
export function selectStaffStillId(
  campaignSeed: string,
  employeeId: string,
  staffRoleDefinitionId: string,
  currentStillId?: string,
  occupiedStillIds: ReadonlySet<string | undefined> = new Set(),
): CharacterStillId | undefined {
  if (isCharacterStillId(currentStillId)) {
    const known = characterStillCatalogEntryById(currentStillId);
    if (!known && !occupiedStillIds.has(currentStillId)) return currentStillId;
    if (known?.category === "staff" && known.eligibleStaffRoleDefinitionIds.includes(staffRoleDefinitionId) && !occupiedStillIds.has(currentStillId)) return currentStillId;
  }
  const eligible = staffStillEligibleEntries(staffRoleDefinitionId);
  if (eligible.length === 0) return undefined;
  const preferred = eligible[
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.staffAppearance,
      `${employeeId}:${staffRoleDefinitionId}:staff-still.v1`,
      eligible.length,
    )
  ];
  if (preferred && !occupiedStillIds.has(preferred.stillId)) return preferred.stillId;
  const available = eligible.filter((entry) => !occupiedStillIds.has(entry.stillId));
  return available.length > 0
    ? available[deterministicInteger(campaignSeed, RANDOM_STREAMS.staffAppearance, `${employeeId}:${staffRoleDefinitionId}:staff-still.v1`, available.length)]?.stillId
    : undefined;
}
```

`normalizePixelAppearance` also removes `stillId` before normalizing the legacy
descriptor, validates it with `isCharacterStillId`, and returns it unchanged.
`createPixelAppearance` assigns a role-compatible still through the allocator.
Those surrounding still-integration changes predate the final uniqueness fix
and must be reconciled with the archived catalog rather than copied blindly.

### `packages/game-domain/src/persistence.ts`

During employee deserialization, normalize the appearance and select its role-
compatible still. After every active employee is decoded, repair collisions in
stable hire/id order. The exact final repair block was at lines 2890–2924:

```ts
const employeesByStableOrder = [...next.employees].sort((left, right) =>
  left.hiredAtFacilityTick - right.hiredAtFacilityTick || left.id.localeCompare(right.id),
);
const occupiedStillIds = new Set<string>();
const retainedStillIds = new Set<string>();
for (const employee of employeesByStableOrder) {
  const stillId = employee.appearance.stillId;
  if (stillId && !retainedStillIds.has(stillId)) {
    retainedStillIds.add(stillId);
    occupiedStillIds.add(stillId);
  }
}
const seenStillIds = new Set<string>();
for (const employee of employeesByStableOrder) {
  const stillId = employee.appearance.stillId;
  if (stillId && !seenStillIds.has(stillId)) {
    seenStillIds.add(stillId);
    continue;
  }
  const repaired = selectStaffStillId(
    campaignSeed,
    employee.id,
    employee.staffRoleDefinitionId,
    undefined,
    occupiedStillIds,
  );
  if (repaired) {
    employee.appearance = { ...employee.appearance, stillId: repaired };
    occupiedStillIds.add(repaired);
  }
}
```

This preserves the earliest duplicate keeper, reserves every already-unique
employee before reassignment, and does not lay off an employee if art is
exhausted. Departing actors retain their existing transient reload behavior.

### `packages/game-domain/src/reducer.ts`

Inside `reduceHireStaff`, after room and cash checks but before cloning or
charging state, reserve active and visibly departing identities and reject an
exhausted role pool:

```ts
const occupiedStillIds = new Set([
  ...state.employees.map((employee) => employee.appearance.stillId),
  ...(state.departingEmployees ?? []).map((employee) => employee.appearance.stillId),
].filter((stillId): stillId is string => typeof stillId === "string"));
const selectedStillId = selectStaffStillId(
  state.campaignSeed,
  command.employeeId,
  definition.id,
  undefined,
  occupiedStillIds,
);
if (!selectedStillId) {
  return rejectCommand(state, command, `No unused ${definition.displayName} character design is available yet.`);
}
```

The new employee appearance must then set `stillId: selectedStillId`. Keeping
the guard before state cloning/cash mutation is part of the behavior contract.

## Directional still bounce integration

### `apps/player/src/facility/FacilityScene.ts`

The task-coherent math and tests are archived as full files in
`files/apps/player/src/facility/characterPresentation.*`. The shared scene
integration used these precise pieces:

1. Class state near original lines 480–496:

```ts
private characterStepBounceMilliseconds = 0;
private readonly characterStepBounceStates = new Map<
  string,
  { startedAtMilliseconds: number; lift: number; moving: boolean }
>();
```

2. During the scene update, only while presentation is not paused/build-frozen:

```ts
this.characterStepBounceMilliseconds +=
  this.frameDeltaMilliseconds * this.bridge.viewModel.simulationSpeed;
```

3. Actor-local lift state at original lines 5103–5135:

```ts
private characterStepBounceLift(key: string, pose: CharacterPose, frozen: boolean): number {
  const previous = this.characterStepBounceStates.get(key);
  if (frozen) return previous?.lift ?? 0;
  if (!isCharacterMovingPose(pose)) {
    this.characterStepBounceStates.set(key, {
      startedAtMilliseconds: this.characterStepBounceMilliseconds,
      lift: 0,
      moving: false,
    });
    return 0;
  }
  const startedAtMilliseconds = previous?.moving
    ? previous.startedAtMilliseconds
    : this.characterStepBounceMilliseconds;
  const lift = getCharacterStepBounceLift(
    this.characterStepBounceMilliseconds - startedAtMilliseconds,
    pose,
  );
  this.characterStepBounceStates.set(key, { startedAtMilliseconds, lift, moving: true });
  return lift;
}
```

`drawCharacterPresentation` passes this lift as a presentation-only offset to
the bitmap/procedural body. Ground coordinates, shadows, routes, depths, seats,
and persisted state remain unchanged. Labels and locators subtract the same
display lift. Actor cleanup removes the matching state entry. The destination
integration must retain freeze/resume handling and directional standing-still
selection; it must not enable archived walking frames.

## Minute-boundary performance fixes

### `apps/player/src/session/viewModels.ts`

Immediately before `formatLearningCardStatus`, cache one formatter instead of
constructing one for every reviewed concept on every projection:

```ts
let learningCardDateTimeFormatter: Intl.DateTimeFormat | undefined;

function getLearningCardDateTimeFormatter(): Intl.DateTimeFormat {
  learningCardDateTimeFormatter ??= new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return learningCardDateTimeFormatter;
}
```

Then format the due date with `getLearningCardDateTimeFormatter().format(...)`.

### `packages/game-domain/src/retail-operations.ts`

Inside `scheduleOptionalShopping`, initialize missing opportunity ticks and
discard not-yet-due actors before computing priority. Decorate each due actor
once, preserving the original stable actor order for equal priorities:

```ts
const priorityWindow = Math.floor(state.facilityTick / 30);
const dueActors: Array<{
  actor: { kind: RetailActorKind; id: string };
  key: string;
  priority: number;
  ordinal: number;
}> = [];
for (const [ordinal, actor] of actors.entries()) {
  const key = actorKey(actor.kind, actor.id);
  const due = state.retailNextOpportunityTicks[key];
  if (due === undefined) {
    state.retailNextOpportunityTicks[key] = state.facilityTick + 1 +
      deterministicInteger(state.campaignSeed, "environment", `optional-first.${key}`, 30);
    continue;
  }
  if (due > state.facilityTick) continue;
  dueActors.push({
    actor,
    key,
    priority: deterministicInteger(
      state.campaignSeed,
      "environment",
      `optional-priority.${actor.kind}.${actor.id}.${priorityWindow}`,
      1_000,
    ),
    ordinal,
  });
}
dueActors.sort((left, right) =>
  left.priority - right.priority || left.ordinal - right.ordinal,
);
for (const { actor, key } of dueActors) {
  // Preserve the existing candidate selection and cooldown body here.
}
```

The durable focused tests archived beside this note define hash-call counts,
tie ordering, semantic scheduling behavior, formatter output, bounce amplitude,
and employee identity uniqueness.
