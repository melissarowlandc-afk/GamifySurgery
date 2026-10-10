#!/usr/bin/env node
// Research model only: reads production source; never changes game configuration.
// Node 22.13+ built-in type stripping; no installs, browser, campaign or Git access.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const sourceFiles = [
  'packages/balance-config/src/prototype-balance.ts',
  'packages/balance-config/src/service-income-catalog.ts',
  'packages/balance-config/src/employee-training.ts',
  'packages/balance-config/src/room-upgrades.ts',
  'packages/balance-config/src/diagnostic-timing.ts',
  'packages/balance-config/src/approved-room-layouts.ts',
  'packages/balance-config/src/approved-level4-room-layouts.ts',
  'packages/balance-config/src/mri-services.ts',
  'packages/balance-config/src/periop-nurse-attention.ts',
  'packages/game-domain/src/reducer.ts',
  'packages/game-domain/src/selectors.ts',
  'packages/game-domain/src/service-operations.ts',
  'packages/game-domain/src/retail-operations.ts',
  'packages/game-domain/src/radiologist-read-income.ts',
  'packages/game-domain/src/room-capacity.ts',
  'packages/game-domain/src/randomness.ts',
  'packages/game-domain/src/employee-training-effects.ts',
  'packages/game-domain/src/level-three-support.ts',
];
const fingerprints = Object.fromEntries(sourceFiles.map(file => [file, hash(file)]));
const strip = file => stripTypeScriptTypes(read(file), { mode: 'strip' });
function data(file, names, bindings = {}) {
  const js = strip(file).replace(/^import [\s\S]*?from ["'][^"']+["'];\r?\n/gm, '')
    .replace(/\bexport (?=const|function)/g, '');
  return new Function(...Object.keys(bindings), `${js}\nreturn {${names.join(',')}};`)(...Object.values(bindings));
}
// These three inspected functions have balanced literal/template braces. Load the
// actual pure helper bodies, without loading clinical content or the game reducer.
function pure(file, name, bindings = {}) {
  const js = strip(file), start = js.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing source helper ${name}`);
  const open = js.indexOf('{', start);
  let depth = 1, end = open + 1;
  for (; depth && end < js.length; end++) {
    if (js[end] === '{') depth++;
    if (js[end] === '}') depth--;
  }
  assert.equal(depth, 0);
  return new Function(...Object.keys(bindings), `${js.slice(start, end)}\nreturn ${name};`)(...Object.values(bindings));
}
const diagnostic = data('packages/balance-config/src/diagnostic-timing.ts', ['DIAGNOSTIC_READING_WORKSTATIONS']);
const levelFourNavigation = data('packages/balance-config/src/approved-level4-room-layouts.ts', ['APPROVED_LEVEL4_ROOM_NAVIGATION_CONTRACTS']);
const mri = data('packages/balance-config/src/mri-services.ts', ['MRI_SERVICE_CONTRACTS', 'mriOnsiteRoute']);
const navigation = data('packages/balance-config/src/approved-room-layouts.ts', ['getApprovedRoomNavigation'], { ...diagnostic, ...levelFourNavigation });
// Identity validation is deliberate: this is a read-only numerical extraction,
// not a release/schema test. Production navigation is loaded, rather than stubbed.
const { PROTOTYPE_BALANCE_RELEASE: balance } = data('packages/balance-config/src/prototype-balance.ts',
  ['PROTOTYPE_BALANCE_RELEASE'], { ...navigation, ...mri, validatePrototypeBalanceRelease: value => value });
const { SERVICE_INCOME_CATALOG: catalog, RADIOLOGIST_READ_INCOME: readIncome } =
  data('packages/balance-config/src/service-income-catalog.ts', ['SERVICE_INCOME_CATALOG', 'RADIOLOGIST_READ_INCOME'], mri);
const upgrades = data('packages/balance-config/src/room-upgrades.ts', ['ROOM_UPGRADE_CATALOG', 'getRoomUpgradeRevenueMultiplier', 'getRoomUpgradeDurationMultiplier']);
const training = data('packages/balance-config/src/employee-training.ts', ['EMPLOYEE_TRAINING_ROLES', 'EMPLOYEE_TRAINING_CAPACITY', 'EMPLOYEE_TRAINING_SESSION_MINUTES']);
const random = data('packages/game-domain/src/randomness.ts', ['deterministicInteger', 'RANDOM_STREAMS']);
const nextRoutine = pure('packages/game-domain/src/reducer.ts', 'getNextRoutineArrivalTick', random);
const scaledCadence = pure('packages/game-domain/src/service-operations.ts', 'getCapacityScaledArrivalCadenceMinutes');
const periopIds = new Set(['income.endoscopy', 'income.advanced_endoscopy', 'income.ambulatory_operation', 'income.ambulatory_operation_extended']);
const newPeriopPhases = pure('packages/game-domain/src/service-operations.ts', 'getNewPeriopServiceOperationPhases', {
  PERIOP_PHASE_FLOW_LINE_IDS: periopIds, getServiceIncomeLine: id => catalog.find(line => line.id === id),
  cloneOperationPhase: phase => structuredClone(phase),
});
const rooms = balance.facility.roomDefinitions.filter(room => room.buildable !== false && room.unlockFacilityLevel <= 3);
// This dated model covers L1-L3. M8's real reducer simulation covers L4 APPs.
const roles = balance.facility.staffRoleDefinitions.filter(role => role.unlockFacilityLevel <= 3);
const line = id => { const found = catalog.find(value => value.id === `income.${id}`); assert(found, id); return found; };
const room = id => { const found = rooms.find(value => value.id === `room.${id}`); assert(found, id); return found; };
const role = id => { const found = roles.find(value => value.id === `staff.${id}`); assert(found, id); return found; };
const scaled = id => periopIds.has(id);
const spacing = Number(read('packages/game-domain/src/service-operations.ts').match(/GLOBAL_ARRIVAL_SPACING_MINUTES = (\d+)/)[1]);
const attention = data('packages/balance-config/src/periop-nurse-attention.ts', ['PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES', 'PERIOP_POST_OP_NURSE_ATTENTION_MINUTES']);

// Every buildable type is explicit. Columns: A upkeep, A per-upgrade upkeep,
// B upkeep, B per-upgrade upkeep. Construction and GS-038 prices/effects stay fixed.
const tuning = {
  front_desk: [2, 0, 1, 0], hallway: [0, 0, 0, 0], examination: [4, 0, 2, 0],
  bathroom: [1, 0, 1, 0], waiting: [2, 0, 1, 0], xray: [6, 2, 4, 1],
  minor_procedure: [8, 1, 4, 1], ultrasound: [12, 2, 8, 1], ct: [12, 2, 8, 1],
  phlebotomy: [5, 1, 2, 1], evs_closet: [2, 0, 1, 0], endoscopy: [20, 3, 12, 2],
  periop_recovery: [6, 0, 3, 0], training: [2, 0, 1, 0], coffee_kiosk: [1, 0, 1, 0],
  glp1_telehealth_suite: [4, 2, 2, 1], ambulatory_or: [18, 4, 12, 2],
  laboratory: [10, 2, 4, 1], pharmacy: [6, 2, 2, 1], maintenance_workshop: [2, 0, 1, 0],
  staff_break: [2, 0, 1, 0], surgeon_office: [2, 0, 1, 0], vending: [1, 0, 1, 0], reading: [12, 0, 6, 0],
};
const salaryB = {
  receptionist: [10, 6, 22], imaging_technician: [18, 12, 34], periop_nurse: [20, 14, 40],
  endoscopy_nurse: [24, 16, 46], endoscopist: [40, 28, 76], phlebotomist: [18, 12, 34],
  evs_worker: [12, 8, 26], glp1_np: [30, 22, 54], laboratory_technician: [20, 12, 42],
  surgeon: [50, 32, 104], or_nurse: [26, 16, 52], pharmacist: [24, 16, 50],
  repair_person: [16, 10, 34], radiologist: [18, 12, 34],
};
const feeA = { xray: 120, ct: 200, collection: 60, laboratory_processing: 110, ambulatory_operation: 2200, ambulatory_operation_extended: 3200, pharmacy_pickup: 120 };
const feeB = { ambulatory_operation: 1300, ambulatory_operation_extended: 1900, pharmacy_pickup: 70 };
const modes = ['current', 'light', 'strong'];
const upkeep = (id, mode, level = 1) => mode === 'current'
  ? room(id).upkeepPerExpenseInterval + (level - 1) * room(id).upkeepPerUpgradeLevel
  : tuning[id][mode === 'light' ? 0 : 2] + (level - 1) * tuning[id][mode === 'light' ? 1 : 3];
const salary = (id, mode) => mode === 'strong' ? salaryB[id][0] : role(id).salaryPerExpenseInterval;
const fee = (id, mode, scheduled = false) => (mode === 'light' ? feeA[id] : mode === 'strong' ? feeB[id] : undefined)
  ?? (scheduled ? line(id).scheduledVisitorFee ?? line(id).fee : line(id).fee);
const names = ids => Object.fromEntries(ids.map(id => [id, 1]));
const clinic1 = { level: 1, rooms: { ...names(['front_desk', 'examination', 'bathroom', 'waiting', 'minor_procedure', 'ultrasound']), hallway: 20 }, staff: { receptionist: 1, imaging_technician: 1 } };
const clinic2 = { level: 2, rooms: { ...clinic1.rooms, ...names(['xray', 'ct', 'phlebotomy', 'evs_closet', 'endoscopy', 'periop_recovery', 'training', 'coffee_kiosk', 'glp1_telehealth_suite']) },
  staff: { ...clinic1.staff, imaging_technician: 3, periop_nurse: 1, endoscopy_nurse: 1, endoscopist: 1, phlebotomist: 1, evs_worker: 1, glp1_np: 1 } };
const clinic3 = { level: 3, rooms: { ...clinic2.rooms, ...names(['ambulatory_or', 'laboratory', 'pharmacy', 'maintenance_workshop', 'staff_break', 'surgeon_office', 'vending', 'reading']) },
  staff: { ...clinic2.staff, laboratory_technician: 1, surgeon: 1, or_nurse: 1, pharmacist: 1, repair_person: 1, radiologist: 2 } };
const clinics = [clinic1, clinic2, clinic3];
const assumptions = {
  measuredDays: 4, warmupDays: 1, seeds: 20, initialOperatingReserve: 1000, advertisingLevel: 0,
  routineCompletionShare: 0.8, oneQuestionAccuracy: 0.8, routineReceiptDelayMinutes: 45,
  explicitHourly: { minor_procedure_simple: 0.2, laboratory_processing: 0.5, pharmacy_pickup: 0.5, otc_supply: 0.5 },
  coffeeHourly: 2, vendingHourly: 1, founderFoodHourly: 0.2,
  readingAvailableMinutesPerHour: 45, arrivalWalkMinutes: 8, betweenPhaseWalkMinutes: 2,
  slowDemandFactor: 0.5,
};
const operatingMinutes = (balance.clock.dayEndHour - balance.clock.dayStartHour) * 60;
const warmup = operatingMinutes * assumptions.warmupDays;
const totalMinutes = operatingMinutes * (assumptions.measuredDays + assumptions.warmupDays);
const measuredHours = operatingMinutes * assumptions.measuredDays / 60;
function cost(clinic, mode, upgradeLevel = 1) {
  const roomCosts = Object.entries(clinic.rooms).reduce((sum, [id, count]) => sum + count * upkeep(id, mode, room(id).maximumUpgradeLevel === 1 ? 1 : upgradeLevel), 0);
  const payroll = Object.entries(clinic.staff).reduce((sum, [id, count]) => sum + count * salary(id, mode), 0);
  return { roomCosts, payroll, advertising: balance.advertising.levels[assumptions.advertisingLevel].hourlyCost,
    total: roomCosts + payroll + balance.advertising.levels[assumptions.advertisingLevel].hourlyCost };
}
const actualOperatingCost = pure('packages/game-domain/src/selectors.ts', 'getOperatingExpensePerFacilityHour', {
  PROTOTYPE_DOMAIN_CONTEXT: null, getRoomDefinition: (id, context) => context.balanceRelease.facility.roomDefinitions.find(r => r.id === id),
});
for (const clinic of clinics) for (const mode of modes) for (const upgradeLevel of [1, 5]) {
  const modeledBalance = structuredClone(balance);
  for (const r of modeledBalance.facility.roomDefinitions) if (tuning[r.id.slice(5)] && mode !== 'current') {
    r.upkeepPerExpenseInterval = upkeep(r.id.slice(5), mode);
    r.upkeepPerUpgradeLevel = tuning[r.id.slice(5)][mode === 'light' ? 1 : 3];
  }
  const fakeState = {
    rooms: Object.entries(clinic.rooms).flatMap(([id, count]) => Array.from({ length: count }, () => ({ roomDefinitionId: `room.${id}`, upgradeLevel: room(id).maximumUpgradeLevel === 1 ? 1 : upgradeLevel }))),
    employees: Object.entries(clinic.staff).flatMap(([id, count]) => Array.from({ length: count }, () => ({ salaryPerExpenseInterval: salary(id, mode) }))),
    advertisingLevel: assumptions.advertisingLevel,
  };
  assert.equal(-actualOperatingCost(fakeState, { balanceRelease: modeledBalance }), cost(clinic, mode, upgradeLevel).total);
}
function simulate(clinic, mode, demand = 'baseline', idle = null, upgradeLevel = 1, seed = 0) {
  const factor = demand === 'slow' ? assumptions.slowDemandFactor : 1;
  const expenses = cost(clinic, mode, upgradeLevel);
  const pools = Object.fromEntries([...Object.entries(clinic.rooms).map(([id, count]) => [`room.${id}`, Array(count).fill(0)]),
    ...Object.entries(clinic.staff).map(([id, count]) => [`staff.${id}`, Array(count).fill(0)]), ['founder', [0]]]);
  pools.bed = Array(clinic.rooms.periop_recovery ? room('periop_recovery').navigation.careStations.length : 0).fill(0);
  const ctx = { balanceRelease: structuredClone(balance) };
  ctx.balanceRelease.arrivals.routineBaseIntervalMinutes /= factor;
  ctx.balanceRelease.arrivals.routineVariationMinutes /= factor;
  ctx.balanceRelease.arrivals.firstArrivalMinimumMinutes /= factor;
  ctx.balanceRelease.arrivals.firstArrivalMaximumMinutes /= factor;
  const state = { facilityTick: 0, campaignSeed: `economy-audit-${seed}`, routineArrivalSequence: 0, advertisingLevel: assumptions.advertisingLevel };
  let routineDue = nextRoutine(state, ctx, true), answered = 0;
  const scheduled = catalog.filter(value => value.minimumFacilityLevel <= clinic.level && value.operation?.visitorMode === 'scheduled' &&
    value.operation.phases.every(phase => clinic.rooms[phase.roomDefinitionId?.slice(5)] && phase.staffRoleDefinitionIds.every(id => clinic.staff[id.slice(6)])) &&
    !value.operation.phases.some(phase => phase.roomDefinitionId === `room.${idle}`));
  const appointments = scheduled.map(value => ({ value, due: scaledCadence(value.operation.arrivalCadenceMinutes / factor, 1), last: -1 }));
  let lastGeneral = -Infinity, cashCents = assumptions.initialOperatingReserve * 100, accrual = 0, firstShortfallTick = null;
  let pendingCash = 0, measuredGross = 0, measuredStock = 0, measuredPostedCost = 0, lowestCash = cashCents;
  let bookCashCents = cashCents, minimumBookCash = cashCents, minimumStartupBookCash = cashCents;
  const byRoom = {}, jobs = [], counts = {}, postedKeys = new Set();
  const addReceipt = (key, roomId, gross, stock, tick, count = 1) => {
    assert(!postedKeys.has(key), `Duplicate receipt ${key}`); postedKeys.add(key);
    pendingCash += Math.round((gross - stock) * 100);
    if (tick > warmup) {
      measuredGross += gross; measuredStock += stock;
      const bucket = byRoom[roomId] ??= { gross: 0, stock: 0, count: 0 };
      bucket.gross += gross; bucket.stock += stock; bucket.count += count;
    }
  };
  const effectiveFee = (id, scheduledVisitor = false) => {
    const value = line(id), target = value.operation?.phases.find(phase => phase.roomDefinitionId && upgrades.ROOM_UPGRADE_CATALOG.some(u => u.roomDefinitionId === phase.roomDefinitionId && u.effectKind === 'revenue_percent'))?.roomDefinitionId
      ?? value.retail?.outlets[0].roomDefinitionId;
    return Math.round(fee(id, mode, scheduledVisitor) * upgrades.getRoomUpgradeRevenueMultiplier(target, upgradeLevel) * 100) / 100;
  };
  const addJob = (id, tick, scheduledVisitor = false) => {
    const value = line(id), phases = newPeriopPhases(value.id) ?? structuredClone(value.operation.phases);
    jobs.push({ key: `job.${id}.${tick}.${jobs.length}`, id, scheduledVisitor, ready: tick + (scheduledVisitor ? assumptions.arrivalWalkMinutes : 0),
      phase: 0, phases, end: null, done: false, bed: null });
  };
  const explicitDue = Object.fromEntries(Object.keys(assumptions.explicitHourly).map(id => [id, 60 / (assumptions.explicitHourly[id] * factor)]));
  const revenueRoom = id => line(id).operation?.phases.find(phase => phase.roomDefinitionId !== 'room.periop_recovery')?.roomDefinitionId.slice(5) ?? line(id).retail.outlets[0].roomDefinitionId.slice(5);
  for (let tick = 1; tick <= totalMinutes; tick++) {
    state.facilityTick = tick;
    // Match production ordering: the quarterly posting happens before tick income.
    accrual += expenses.total * 100;
    if (tick % balance.economy.postingIntervalMinutes === 0) {
      const cents = Math.floor(accrual / 60); accrual %= 60;
      if (cashCents < cents && firstShortfallTick === null) firstShortfallTick = tick;
      cashCents = Math.max(0, cashCents - cents);
      bookCashCents -= cents;
      minimumBookCash = Math.min(minimumBookCash, bookCashCents);
      if (tick <= warmup) minimumStartupBookCash = Math.min(minimumStartupBookCash, bookCashCents);
      if (tick > warmup) measuredPostedCost += cents / 100;
      lowestCash = Math.min(lowestCash, cashCents);
    }
    if (tick >= routineDue) {
      const seq = state.routineArrivalSequence++;
      if (seq % 5 !== 4 && idle !== 'all') {
        const correct = answered++ % 5 !== 4, settlement = balance.clinicalSettlement;
        const gross = settlement.levelOneBasePayment + settlement.levelOnePerQuestionPayment + (correct ? settlement.levelOnePerCorrectPayment : 0);
        jobs.push({ key: `teaching.${seq}`, teaching: true, ready: tick + assumptions.routineReceiptDelayMinutes, gross, done: false });
      }
      routineDue = nextRoutine(state, ctx);
    }
    // Runtime scheduled admission rules: round-robin oldest arrival, one admission
    // per minute, 30-minute spacing for general lines, separate scaled procedure lanes.
    for (const ap of [...appointments].sort((a, b) => a.last - b.last || catalog.indexOf(a.value) - catalog.indexOf(b.value))) {
      if (ap.due > tick || idle === 'all' || (!scaled(ap.value.id) && tick - lastGeneral < spacing)) continue;
      const relevant = jobs.filter(job => !job.done && job.scheduledVisitor && (ap.value.id.includes('endoscopy') ? job.id?.includes('endoscopy') : job.id === ap.value.id.slice(7)));
      const waiting = relevant.filter(job => job.phase === 0 && job.end === null);
      const generalWaiting = jobs.filter(job => !job.done && job.scheduledVisitor && !scaled(`income.${job.id}`) && job.phase === 0 && job.end === null);
      if (relevant.length >= 2 || waiting.length >= 1 || (!scaled(ap.value.id) && generalWaiting.length >= 2)) continue;
      addJob(ap.value.id.slice(7), tick, true); ap.last = tick;
      ap.due = tick + scaledCadence(ap.value.operation.arrivalCadenceMinutes / factor, 1);
      if (!scaled(ap.value.id)) lastGeneral = tick;
      break;
    }
    for (const [id, hourly] of Object.entries(assumptions.explicitHourly)) {
      if (tick < explicitDue[id]) continue;
      explicitDue[id] += 60 / (hourly * factor);
      if (!clinic.rooms[revenueRoom(id)] || idle === revenueRoom(id) || idle === 'all') continue;
      if (line(id).retail) {
        const key = `retail.${id}.${tick}`, outlet = revenueRoom(id);
        addReceipt(key, outlet, effectiveFee(id), line(id).retail.stockCost, tick);
      } else addJob(id, tick);
    }
    for (const job of jobs) {
      if (job.done || job.ready > tick) continue;
      if (job.teaching) { addReceipt(job.key, 'examination', job.gross, 0, tick); job.done = true; continue; }
      if (job.end !== null) {
        if (job.end > tick) continue;
        job.phase++; job.end = null;
        if (job.phase === job.phases.length) {
          const r = revenueRoom(job.id); addReceipt(job.key, r, effectiveFee(job.id, job.scheduledVisitor), 0, tick);
          job.done = true; counts[job.id] = (counts[job.id] ?? 0) + 1;
          if (job.bed !== null) pools.bed[job.bed] = tick;
          continue;
        }
        job.ready = tick + assumptions.betweenPhaseWalkMinutes;
        continue;
      }
      const phase = job.phases[job.phase], periop = phase.roomDefinitionId === 'room.periop_recovery';
      if (periop && job.bed === null && !pools.bed.some(time => time <= tick)) continue;
      const resourceIds = [...(periop ? [] : [phase.roomDefinitionId]), ...phase.staffRoleDefinitionIds];
      if (phase.providerRoleDefinitionIds?.length) resourceIds.push(phase.providerRoleDefinitionIds.find(id => pools[id]?.length) ?? 'founder');
      else if (phase.founderEligible) resourceIds.push('founder');
      if (resourceIds.some(id => !pools[id]?.some(time => time <= tick))) continue;
      if (periop && job.bed === null) { job.bed = pools.bed.findIndex(time => time <= tick); pools.bed[job.bed] = Infinity; }
      for (const id of resourceIds) {
        const minutes = periop && id === 'staff.periop_nurse' ? (job.phase === 0 ? attention.PERIOP_PRE_OP_NURSE_ATTENTION_MINUTES : attention.PERIOP_POST_OP_NURSE_ATTENTION_MINUTES) : phase.durationMinutes;
        pools[id][pools[id].findIndex(time => time <= tick)] = tick + minutes;
      }
      job.end = tick + phase.durationMinutes;
    }
    if (clinic.rooms.glp1_telehealth_suite && idle !== 'glp1_telehealth_suite' && idle !== 'all' && tick % balance.environment.glp1AutomationIntervalMinutes === 0) {
      const count = Math.min(clinic.staff.glp1_np, clinic.rooms.glp1_telehealth_suite * 2, balance.environment.glp1AutomationMaximumCapacity);
      const gross = Math.round(balance.environment.glp1AutomationPayment * upgrades.getRoomUpgradeRevenueMultiplier('room.glp1_telehealth_suite', upgradeLevel) * 100) / 100;
      addReceipt(`glp1.${tick}`, 'glp1_telehealth_suite', gross * count, 0, tick, count);
    }
    if (clinic.rooms.reading && idle !== 'reading' && idle !== 'all') {
      // Conservative availability budget: 45 reading minutes per hour per reader,
      // including local reads; outside work fills the balance. No acquisition fee split.
      const duration = readIncome.outsideDurationMinutes * upgrades.getRoomUpgradeDurationMultiplier('room.reading', upgradeLevel, 'reading_duration_reduction_percent');
      const prior = Math.floor((tick - 1) / 60 * assumptions.readingAvailableMinutesPerHour / duration);
      const now = Math.floor(tick / 60 * assumptions.readingAvailableMinutesPerHour / duration);
      if (now > prior) addReceipt(`reading.${tick}`, 'reading', (now - prior) * clinic.staff.radiologist * readIncome.outsideFee, 0, tick, (now - prior) * clinic.staff.radiologist);
    }
    // Retail demand is a stated mix, not invented automatic prescription income.
    for (const [r, ids, hourly] of [['coffee_kiosk', ['coffee', 'kiosk_drink', 'kiosk_snack'], assumptions.coffeeHourly], ['vending', ['vending_drink', 'vending_snack'], assumptions.vendingHourly]]) {
      if (!clinic.rooms[r] || idle === r || idle === 'all') continue;
      if (Math.floor(tick * hourly * factor / 60) > Math.floor((tick - 1) * hourly * factor / 60)) {
        const purchase = Math.floor(tick * hourly * factor / 60) - 1, id = ids[purchase % ids.length];
        addReceipt(`${r}.${tick}`, r, effectiveFee(id), line(id).retail.stockCost, tick);
      }
    }
    if (clinic.rooms.coffee_kiosk && idle !== 'all' && Math.floor(tick * assumptions.founderFoodHourly / 60) > Math.floor((tick - 1) * assumptions.founderFoodHourly / 60)) {
      addReceipt(`founder.${tick}`, 'coffee_kiosk', 0, line('coffee').retail.stockCost, tick, 0);
    }
    cashCents += pendingCash; bookCashCents += pendingCash; pendingCash = 0;
  }
  assert.equal(accrual, 0);
  assert.equal(measuredPostedCost, expenses.total * measuredHours);
  for (const [id, bucket] of Object.entries(byRoom)) byRoom[id] = Object.fromEntries(Object.entries(bucket).map(([key, value]) => [key, value / measuredHours]));
  return { level: clinic.level, mode, demand, idle, upgradeLevel, seed, hourlyGross: measuredGross / measuredHours, hourlyStock: measuredStock / measuredHours,
    hourlyCosts: expenses.total, hourlyNet: (measuredGross - measuredStock - measuredPostedCost) / measuredHours,
    costs: expenses, byRoom, measuredNet: measuredGross - measuredStock - measuredPostedCost,
    startupReserveRequired: (assumptions.initialOperatingReserve * 100 - minimumStartupBookCash) / 100,
    fiveDayReserveRequired: (assumptions.initialOperatingReserve * 100 - minimumBookCash) / 100,
    endingCash: cashCents / 100, lowestCash: lowestCash / 100, firstShortfallHour: firstShortfallTick === null ? null : firstShortfallTick / 60 };
}
function aggregate(clinic, mode, demand = 'baseline', idle = null, upgradeLevel = 1) {
  const runs = Array.from({ length: assumptions.seeds }, (_, seed) => simulate(clinic, mode, demand, idle, upgradeLevel, seed));
  const avg = key => runs.reduce((sum, run) => sum + run[key], 0) / runs.length;
  const byRoom = {};
  for (const id of Object.keys(clinic.rooms)) byRoom[id] = Object.fromEntries(['gross', 'stock', 'count'].map(key => [key, runs.reduce((sum, run) => sum + (run.byRoom[id]?.[key] ?? 0), 0) / runs.length]));
  return { level: clinic.level, mode, demand, idle, upgradeLevel, hourlyGross: avg('hourlyGross'), hourlyStock: avg('hourlyStock'), hourlyCosts: avg('hourlyCosts'), hourlyNet: avg('hourlyNet'),
    measuredNet: avg('measuredNet'), costs: runs[0].costs, byRoom,
    netRange: [Math.min(...runs.map(run => run.hourlyNet)), Math.max(...runs.map(run => run.hourlyNet))],
    minimumReserveObserved: Math.min(...runs.map(run => run.lowestCash)), shortfallSeeds: runs.filter(run => run.firstShortfallHour !== null).length,
    startupReserveRequired: Math.max(...runs.map(run => run.startupReserveRequired)), fiveDayReserveRequired: Math.max(...runs.map(run => run.fiveDayReserveRequired)),
    firstShortfallHour: runs.some(run => run.firstShortfallHour !== null) ? Math.min(...runs.filter(run => run.firstShortfallHour !== null).map(run => run.firstShortfallHour)) : null };
}

assert.equal(rooms.length, 24);
assert.deepEqual(Object.keys(tuning).sort(), rooms.map(r => r.id.slice(5)).sort());
assert.deepEqual(Object.keys(salaryB).sort(), roles.map(r => r.id.slice(6)).sort());
assert.equal(scaledCadence(120, 2), 60);
assert.deepEqual(newPeriopPhases('income.endoscopy').map(p => p.durationMinutes), [30, 45, 60]);
assert.equal(balance.economy.postingIntervalMinutes, 15);
assert.equal(operatingMinutes, 600);
assert.equal(readIncome.inHouseFee, readIncome.outsideFee); // permits one combined read bucket without double counting
for (const values of Object.values(tuning)) for (const value of values) assert(Number.isInteger(value) && value >= 0);
for (const [id, [base, min, max]] of Object.entries(salaryB)) {
  assert(min <= base && base <= max);
  assert.equal(min - base, role(id).minimumSalaryPerExpenseInterval - role(id).salaryPerExpenseInterval);
  assert.equal(max - base, role(id).maximumSalaryPerExpenseInterval - role(id).salaryPerExpenseInterval);
}

const snapshots = modes.flatMap(mode => clinics.flatMap(clinic => ['baseline', 'slow'].map(demand => aggregate(clinic, mode, demand))));
const faults = modes.flatMap(mode => [aggregate(clinic1, mode, 'baseline', 'ultrasound'), aggregate(clinic2, mode, 'baseline', 'endoscopy'), aggregate(clinic3, mode, 'baseline', 'endoscopy'), aggregate(clinic3, mode, 'slow', 'endoscopy'),
  aggregate(clinic3, mode, 'baseline', 'ambulatory_or'), aggregate(clinic3, mode, 'baseline', 'all')]);
const upgraded = modes.flatMap(mode => clinics.map(clinic => aggregate(clinic, mode, 'baseline', null, 5)));
const baselineFor = (mode, level = 3) => snapshots.find(r => r.mode === mode && r.level === level && r.demand === 'baseline');
const directRoles = { front_desk: ['receptionist'], ultrasound: ['imaging_technician'], xray: ['imaging_technician'], ct: ['imaging_technician'], phlebotomy: ['phlebotomist'],
  evs_closet: ['evs_worker'], endoscopy: ['endoscopy_nurse', 'endoscopist'], periop_recovery: ['periop_nurse'], glp1_telehealth_suite: ['glp1_np'], ambulatory_or: ['or_nurse', 'surgeon'],
  laboratory: ['laboratory_technician'], pharmacy: ['pharmacist'], maintenance_workshop: ['repair_person'], reading: ['radiologist'] };
const roomEconomics = rooms.map(r => {
  const id = r.id.slice(5), parent = baselineFor('current'), income = parent.byRoom[id], staff = directRoles[id] ?? [];
  const net = mode => { const b = baselineFor(mode).byRoom[id]; return b.gross - b.stock - upkeep(id, mode) - staff.reduce((sum, roleId) => sum + salary(roleId, mode), 0); };
  // Reading's per-room row uses one reader, so divide its modeled two-reader gross.
  if (id === 'reading') {
    return { id, displayName: r.displayName, level: r.unlockFacilityLevel, build: r.constructionCost, upkeep: r.upkeepPerExpenseInterval, deltaUpkeep: r.upkeepPerUpgradeLevel,
      staff, gross: income.gross / 2, stock: 0, throughput: income.count / 2, net: Object.fromEntries(modes.map(mode => [mode, baselineFor(mode).byRoom[id].gross / 2 - upkeep(id, mode) - salary('radiologist', mode)])),
      revenueUpgradeIncrementNet: Object.fromEntries(modes.map(mode => [mode, (baselineFor(mode).byRoom[id].gross / 2) / 9 - (mode === 'current' ? r.upkeepPerUpgradeLevel : tuning[id][mode === 'light' ? 1 : 3])])) };
  }
  return { id, displayName: r.displayName, level: r.unlockFacilityLevel, build: r.constructionCost, upkeep: r.upkeepPerExpenseInterval, deltaUpkeep: r.upkeepPerUpgradeLevel,
    staff, gross: income.gross, stock: income.stock, throughput: income.count, net: Object.fromEntries(modes.map(mode => [mode, net(mode)])),
    revenueUpgradeIncrementNet: Object.fromEntries(modes.map(mode => [mode, baselineFor(mode).byRoom[id].gross * 0.06 - (mode === 'current' ? r.upkeepPerUpgradeLevel : tuning[id][mode === 'light' ? 1 : 3])])) };
});
const revenueIds = roomEconomics.filter(r => r.gross > 0).map(r => r.id);
if (process.argv.includes('--diagnostics')) console.table(roomEconomics.map(r => ({ room: r.id, rate: +r.throughput.toFixed(3), gross: +r.gross.toFixed(2), current: +r.net.current.toFixed(2), light: +r.net.light.toFixed(2), strong: +r.net.strong.toFixed(2) })));
for (const mode of ['light', 'strong']) for (const id of revenueIds) {
  const economy = roomEconomics.find(r => r.id === id);
  assert(economy.net[mode] > 0, `${mode}/${id} does not cover its own room and staff: $${economy.net[mode].toFixed(2)}/h at ${economy.throughput.toFixed(3)} jobs/h`);
  if (upgrades.ROOM_UPGRADE_CATALOG.find(u => u.roomDefinitionId === `room.${id}`)?.effectKind === 'revenue_percent')
    assert(economy.revenueUpgradeIncrementNet[mode] >= 0, `${mode}/${id} upgrade loses operating margin`);
}
for (const mode of ['light', 'strong']) {
  const s = baselineFor(mode), periCost = upkeep('periop_recovery', mode) + salary('periop_nurse', mode);
  const endoCount = s.byRoom.endoscopy.count, orCount = s.byRoom.ambulatory_or.count, allocation = orCount / (endoCount + orCount);
  assert(s.byRoom.ambulatory_or.gross - upkeep('ambulatory_or', mode) - salary('or_nurse', mode) - salary('surgeon', mode) - upkeep('surgeon_office', mode) - allocation * periCost > 0);
  const fullOrBundle = upkeep('ambulatory_or', mode) + salary('or_nurse', mode) + salary('surgeon', mode) + upkeep('surgeon_office', mode) + periCost;
  assert(s.byRoom.ambulatory_or.gross >= fullOrBundle * 1.10, `${mode} OR does not cover a dedicated recovery team with a 10% margin`);
}
for (const file of sourceFiles) assert.equal(hash(file), fingerprints[file], `Source changed during audit: ${file}; rerun against the manager's current snapshot`);
const output = { scope: 'Fixed-roster numerical scenario model; not full domain or browser execution', assumptions, fingerprints, clinics, tuning, salaryB, feeA, feeB,
  sourceFacts: { rooms, roles, training, upgrades: upgrades.ROOM_UPGRADE_CATALOG, readIncome }, snapshots, faults, upgraded, roomEconomics,
  validation: ['24 buildable types covered', 'Actual domain expense selector agrees at all modeled tiers; posting conserves every cent', 'Source-derived arrivals and current periop phases verified', 'No double receipts',
    'Every proposed revenue room has positive baseline net with one required team', 'Proposed revenue upgrades do not reduce baseline operating margin', 'OR covers its office and either allocated or dedicated recovery, with at least 10% standalone margin', `${sourceFiles.length} production source hashes unchanged during run`] };
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(here, 'results-20261008.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}
console.log(`PASS: ${output.validation.length} numerical/source invariants; ${assumptions.seeds} seeds x ${measuredHours} measured hours + ${warmup / 60} warmup hours per scenario.`);
console.table(snapshots.map(s => ({ level: s.level, option: s.mode, demand: s.demand, income: +s.hourlyGross.toFixed(2), stock: +s.hourlyStock.toFixed(2), costs: s.hourlyCosts, net: +s.hourlyNet.toFixed(2), fourDayNet: +s.measuredNet.toFixed(2), shortfalls: s.shortfallSeeds })));
console.table(faults.map(s => ({ level: s.level, option: s.mode, demand: s.demand, idle: s.idle, net: +s.hourlyNet.toFixed(2), shortfalls: s.shortfallSeeds })));
console.log(process.argv.includes('--write') ? 'Wrote tools/economy-audit/results-20261008.json (UTF-8 without BOM).' : 'Read-only run; pass --write to refresh the local research results artifact.');
