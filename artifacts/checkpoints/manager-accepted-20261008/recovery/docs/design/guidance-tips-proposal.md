# Guidance tips for Alerts & Events

Research proposal for the Claude Code GamifySurgery manager, October 7, 2026. This is a read-only mechanics survey and copy catalog, not an implemented alert system or a gameplay acceptance report. Only this proposal file was edited. No Git, installs, web, gameplay commands, owner saves or runtime tests were used. Other repository files were read, not edited.

Read first: `docs/handoffs/ALERTS_EVENTS_DISCOVERY.md`, then `docs/design/alerts-events-revamp.html`. The approved visual direction supplies the two sections, chronological feed, concrete action buttons and self-resolving live cards (`docs/design/alerts-events-revamp.html:138`, `docs/design/alerts-events-revamp.html:140`, `docs/design/alerts-events-revamp.html:198`). The owner's later October 7 instruction narrows the mockup's admission policy: ordinary trash, water and next-goal suggestions do not automatically become cards. **No sounds**, including the mockup's optional sound.

The copy below teaches game operations only. It does not select diagnoses, orders, medications or services for financial benefit. Existing clinical-content review restrictions remain in force. Numbers described as current mechanics come from code; new tip timings are explicitly proposed editorial settings. References describe the shared working-tree snapshot, not a published build. GS-038 is concurrently integrating upgrades; its approved contract and current code were read, but its final integrated acceptance is outside this research lane (`docs/execplans/gs038-all-room-upgrades.md:3`, `docs/execplans/gs038-all-room-upgrades.md:319`).

## 1. Mechanics inventory

### Corrections to the owner's illustrative examples

| Example | Verified behavior | Accurate teaching direction |
| --- | --- | --- |
| EVS picks up one piece of trash per hour | No hourly litter limit. Baseline litter work is **2 facility minutes per item, plus walking**, assigned oldest reachable litter first. Room cleaning is **5 work minutes**, restores **10 cleanliness points**, targets rooms below **85**, and has a clinic-wide **30-minute cooldown after room-clean completion**. That cooldown does not throttle litter collection. EVS training increases room-clean restoration by 10% of baseline per training purchase; it does not increase the number of litter items picked up or directly shorten cleaning. An upgraded EVS closet shortens both new litter and room-clean work. | “The mop is doing the minimum. Train EVS to restore more cleanliness per room clean.” `packages/game-domain/src/reducer.ts:6832`, `packages/game-domain/src/reducer.ts:6841`, `packages/game-domain/src/reducer.ts:6886`, `packages/game-domain/src/reducer.ts:6898`, `packages/game-domain/src/reducer.ts:6752`, `packages/balance-config/src/prototype-balance.ts:987`, `packages/balance-config/src/prototype-balance.ts:1000` |
| Upgrade the slow X-ray room to improve speed | X-ray upgrades add **6% service revenue per purchase**, up to 24%; they add neither speed nor technician positions. Imaging-technician training reduces supported acquisition work by **10% of baseline per purchase**. Reading Room upgrades reduce the separate local interpretation phase. | “The scanner has developed a leisurely personality. Train your imaging technician to shorten scan time.” `packages/balance-config/src/room-upgrades.ts:73`, `packages/balance-config/src/employee-training.ts:43`, `packages/game-domain/src/employee-training-effects.ts:41`, `packages/game-domain/src/room-upgrade-reading.ts:25` |
| Higher salaries improve efficiency and satisfaction | Salary changes recalculate morale from the role's salary baseline. Morale affects facility pressure, completion satisfaction and insolvency departures. No morale-to-work-speed multiplier exists in the reviewed domain consumers; training supplies the work modifiers. | “Payroll is not a motivational poster. Raise low salaries to improve morale and patient satisfaction.” `packages/game-domain/src/staff.ts:675`, `packages/game-domain/src/reducer.ts:10032`, `packages/game-domain/src/facility-experience.ts:318`, `packages/game-domain/src/reducer.ts:2807`, `packages/game-domain/src/departure-risk-alerts.ts:61` |
| More Waiting Rooms improve hallway waiting | A Waiting Room has **4 authored chairs**, at most **5 rooms**; door thresholds and occupied/reserved endpoints can reduce usable seating. Patients fill reachable chairs before standing/public overflow, including hallways. Adding a room adds chairs and +2 routine workload slots. Upgrading it adds satisfaction, not chairs. There is no separate fixed hallway-standing satisfaction penalty; sidewalk waiting has a separate 150% decay multiplier. | “The hallway has become an unpaid Waiting Room. Build another Waiting Room for actual seats.” `packages/balance-config/src/approved-room-layouts.ts:123`, `packages/balance-config/src/prototype-balance.ts:145`, `packages/game-domain/src/reducer.ts:1119`, `packages/game-domain/src/reducer.ts:1234`, `packages/balance-config/src/prototype-balance.ts:932`, `packages/balance-config/src/room-upgrades.ts:69` |
| Receptionist refill delay is one hour | The balance file still contains `receptionistWaterRefillDelayMinutes: 60`, but the live assignment function does not read it. Refilling can be assigned once empty, with reachable operational coverage and no Front Desk patient priority, then takes **2 work minutes plus walking**. New check-ins/returns preempt refilling. | Suppress water notices under usable receptionist coverage; do not promise an exact automatic refill deadline. `packages/balance-config/src/prototype-balance.ts:983`, `packages/game-domain/src/reducer.ts:6567`, `packages/game-domain/src/reducer.ts:6622`, `packages/game-domain/src/reducer.ts:6632` |

### Systems and player levers

| Lever/system | What it really changes; current numbers | Implementation/state evidence |
| --- | --- | --- |
| Hire/fire, salaries, payroll buffer | Hire pays the one-time role cost and automatically assigns an available compatible home position. Recurring salary is **per facility hour**, accrued in cents and posted every **15 minutes**. All roles start at morale 75; salary steps are $2/hour and 5 morale points per step relative to default, clamped 0–100. Salary adjustment **resets to the salary-derived value**, rather than adding 5 to the current morale. Shortfall removes 3 morale points per posting; employees quit at <=10. Firing/selling a home can remove capacity and interrupt work. | `packages/game-domain/src/reducer.ts:9823`, `packages/game-domain/src/reducer.ts:6185`, `packages/game-domain/src/reducer.ts:6233`, `packages/game-domain/src/reducer.ts:9998`, `packages/game-domain/src/staff.ts:686`, `packages/game-domain/src/room-capacity.ts:199`, `packages/balance-config/src/prototype-balance.ts:1026`, `packages/balance-config/src/prototype-balance.ts:1056` |
| Morale and praise | Any employee <=45 produces a 2-point facility condition penalty. Average staff morale >=80 adds 2 completion satisfaction points; average <=45 removes 3. Praise restores 5 morale after Founder travel and 2 work minutes; same employee cooldown 600 minutes. Coffee/breaks provide other capped recovery. Low morale alone does not mean a resignation is imminent. | `packages/game-domain/src/facility-experience.ts:318`, `packages/game-domain/src/reducer.ts:2807`, `packages/game-domain/src/reducer.ts:7105`, `packages/game-domain/src/reducer.ts:10618`, `packages/balance-config/src/prototype-balance.ts:944`, `packages/balance-config/src/prototype-balance.ts:985` |
| Employee training | Levels 1–5; four paid improvements. Baseline seated session **60 minutes**, **2 global places**, plus travel; queued employees keep working, then become unavailable while travelling/training/returning. Training requires an operational reachable room and enough cash; no second request for the same employee. The completed level, not an answer to a discussion, supplies the role benefit. Most benefits average across all employed members of that role, including temporarily absent members. Ordinary trained work rounds up to at least 1 minute; Reading and marked room-support work have their own fractional contracts. | `packages/balance-config/src/employee-training.ts:1`, `packages/game-domain/src/employee-training.ts:105`, `packages/game-domain/src/employee-training.ts:135`, `packages/game-domain/src/employee-training.ts:196`, `packages/game-domain/src/employee-training-effects.ts:7`, `packages/game-domain/src/employee-training-effects.ts:17` |
| Room upgrades | Four purchases, room Levels 1–5. Effects are specific to the room: additive baseline revenue/time percentages or satisfaction/morale points. They do not add seats, beds, staff posts, routine workload or arbitrary generic speed. New revenue/work freezes its contract; existing accepted work need not benefit from a later purchase. Independent employee and room duration factors multiply. Ordinary current room artwork stays fixed. | `packages/balance-config/src/room-upgrades.ts:65`, `packages/balance-config/src/room-upgrades.ts:119`, `packages/game-domain/src/room-upgrade-support.ts:16`, `packages/game-domain/src/room-upgrade-reading.ts:29`, `docs/execplans/gs038-all-room-upgrades.md:12`, `docs/execplans/gs038-all-room-upgrades.md:175` |
| Build, move, rotate, doors, hallways | Room presence alone is insufficient: own entrance, connected paths, room dependencies and protected-care access matter. Moving/rotating can invalidate doors or routes. Staff home rooms and patient/service reservations are separate. Build preview/access validation, then actual doors/path corrections are the remedy. Hallway tiles cost $35, no upkeep, no upgrade. | `packages/game-domain/src/doors.ts:194`, `packages/game-domain/src/doors.ts:328`, `packages/game-domain/src/spatial.ts:624`, `packages/game-domain/src/selectors.ts:323`, `packages/game-domain/src/reducer.ts:9472`, `packages/game-domain/src/reducer.ts:9555`, `packages/balance-config/src/prototype-balance.ts:66` |
| Staff assignment and positions | Home assignments/seats reconcile automatically; there is **no player-facing arbitrary reassignment command** in the current command/UI paths. Correct access, compatible room capacity and hiring are supported fixes. Positions per room: reception 1; each imaging room 1 technician; Peri-op 2 nurses; Endoscopy 1 nurse + 1 endoscopist; phlebotomy/EVS/lab/pharmacy/workshop 1 matching employee; suite 2 NPs; surgeon office 2 surgeons; Reading 4 radiologists. Upgrades do not unlock extra posts. | `packages/game-domain/src/room-capacity.ts:6`, `packages/game-domain/src/room-capacity.ts:81`, `packages/game-domain/src/reading-stations.ts:6`, `packages/game-domain/src/types.ts:1593`, `apps/player/src/ui/StaffPanel.tsx:288`, `apps/player/src/ui/StaffPanel.tsx:311` |
| Founder check-in, receptionist and task opportunity cost | Founder at the Front Desk staff anchor with no activity can check patients in; a receptionist at that post can do so while Founder is elsewhere. Unstaffed check-in >60 minutes applies a one-time -2 patient satisfaction consequence. Receptionist also handles empty water; patient intake/returns have priority. Receptionist adds 1 routine workload slot. Manual cleaning/refill/praise require reachable Founder travel, take 2 work minutes and may conflict with service reservations. | `packages/game-domain/src/reducer.ts:297`, `packages/game-domain/src/reducer.ts:1744`, `packages/game-domain/src/reducer.ts:1761`, `packages/game-domain/src/reducer.ts:6567`, `packages/game-domain/src/reducer.ts:10269`, `packages/balance-config/src/prototype-balance.ts:622` |
| Waiting seats, hallway overflow, examination space and workload | Waiting destinations persist a kind and room, so actual standing/hallway overflow is measurable. Waiting Room chairs precede Front Desk/other legal chairs, then standing/public overflow. Examination rooms add 2 routine workload slots each, but physical consultation reservations remain distinct. Base routine workload limit 2; critical reserved allowance 1. Waiting adds 2; Minor Procedure/Endoscopy/Peri-op/OR/Lab each add 1; operational Training capability adds 1. Current upgrades add 0 workload. | `packages/game-domain/src/types.ts:954`, `packages/game-domain/src/reducer.ts:1010`, `packages/game-domain/src/reducer.ts:1078`, `packages/game-domain/src/selectors.ts:1194`, `packages/balance-config/src/prototype-balance.ts:98`, `packages/balance-config/src/prototype-balance.ts:905`, `packages/balance-config/src/prototype-balance.ts:1004` |
| Bathrooms and amenities | Bathroom availability removes the configured 2-point missing-bathroom facility pressure; its base amenity contribution is 2. Waiting Room base contribution 2; Minor Procedure 1. Completion amenity bonus sums distinct room types, capped 3; adding copies does not stack that bonus. Bathroom trips are physical and cannot use an already claimed bathroom; rules differ during care/discharge. Bathroom upgrades reduce soil loss, not trip duration or toilet capacity. | `packages/game-domain/src/facility-experience.ts:275`, `packages/game-domain/src/reducer.ts:2797`, `packages/game-domain/src/patient-amenities.ts:112`, `packages/balance-config/src/prototype-balance.ts:122`, `packages/balance-config/src/prototype-balance.ts:144`, `packages/balance-config/src/prototype-balance.ts:221`, `packages/balance-config/src/room-upgrades.ts:70` |
| Water | Cooler drains 25 percentage points every 60 minutes. Empty water creates 2 facility-pressure points. A completed refill returns it to 100 and adds 1 satisfaction point to eligible waiting patients. Manual Founder/refill and receptionist tasks are actual state; no need for “low water” warnings, which are already hidden. | `packages/balance-config/src/prototype-balance.ts:978`, `packages/game-domain/src/reducer.ts:6546`, `packages/game-domain/src/reducer.ts:6757`, `packages/game-domain/src/reducer.ts:7081`, `packages/game-domain/src/types.ts:1262` |
| Litter, measured cleanliness, EVS | Spawn interval 45–90 minutes, maximum 3 litter items. Each item contributes 2 facility-pressure points, capped 6; average dirty cleanliness <=45 adds 4. Completion cleanliness >=80 adds 2 points; <=45 removes 4. Each completed encounter soils non-hallway rooms by 1 point, modified only for Bathrooms by their upgrade. Litter cleanup restores 12 to its room; manual Founder cleanup additionally gives eligible waiting patients +1. EVS litter cleanup does not apply that separate Founder satisfaction award. EVS auto room-clean rates are in the correction table above. | `packages/balance-config/src/prototype-balance.ts:938`, `packages/balance-config/src/prototype-balance.ts:973`, `packages/game-domain/src/facility-experience.ts:197`, `packages/game-domain/src/reducer.ts:2773`, `packages/game-domain/src/reducer.ts:6769`, `packages/game-domain/src/reducer.ts:7030`, `packages/game-domain/src/reducer.ts:6809` |
| Coffee and breaks | Operational Coffee Kiosk adds 2 morale per employee **once per operating day**, not per drink purchased. Upgrades add 1 per purchase to that daily award, using the best operational kiosk without stacking copies. Staff Break Room automatically seats eligible idle employees: 30 work minutes, +5 morale, 240-minute cooldown per employee; upgrades add 2 morale per purchase. Seven authored break seats; Founder can occupy one. Patient/service demand interrupts/preempts breaks. | `packages/game-domain/src/reducer.ts:7009`, `packages/game-domain/src/room-upgrade-support.ts:69`, `packages/game-domain/src/level-three-support.ts:17`, `packages/game-domain/src/level-three-support.ts:256`, `packages/game-domain/src/level-three-support.ts:395`, `packages/balance-config/src/prototype-balance.ts:1005` |
| Equipment maintenance and repair | Only OR, Lab and Pharmacy currently accrue maintenance uses. After 8 completed uses, equipment becomes due; 600-minute grace before out-of-service, respecting active reservations. An available assigned Repair Person from an operational Workshop automatically repairs, taking the room out of service while working. Base repair 30 work minutes; completion resets uses/status. Training and Workshop upgrades shorten new repair work, not all room upkeep or cleaning. | `packages/game-domain/src/level-three-support.ts:11`, `packages/game-domain/src/level-three-support.ts:69`, `packages/game-domain/src/level-three-support.ts:294`, `packages/game-domain/src/level-three-support.ts:348`, `packages/game-domain/src/level-three-support.ts:277`, `packages/balance-config/src/prototype-balance.ts:1010` |
| Imaging acquisition and interpretation | Technician/equipment acquire the study; radiologist/Reading Room interpret supported studies. Current interpretation baseline is 30 external / 5 local facility minutes. Acquisition comes from the actual route, not one universal X-ray duration; fee-catalog scheduled baselines include Ultrasound 45, X-ray 60, CT 60. Reading has 4 stations per room, one active job per radiologist and employee-scoped queues. Training reduces the corresponding staff phase; Reading upgrades reduce only marked new local interpretation. Level-5 Reading raw time is 3 before employee effects; maximum employee + room reductions yield 1.8 before observation at whole ticks. Do not promise that an entire test takes 5 or 1.8 minutes. | `packages/balance-config/src/diagnostic-timing.ts:16`, `packages/balance-config/src/diagnostic-timing.ts:90`, `packages/balance-config/src/service-income-catalog.ts:41`, `packages/game-domain/src/diagnostic-timing.ts:212`, `packages/game-domain/src/room-upgrade-reading.ts:25` |
| Phlebotomy, laboratory and pathology | Collected-lab game baseline: 15 onsite collection; processing 60 external / 15 onsite. Full external collected-lab total 120. Pathology processing 60 external / 30 onsite, acquisition separate. Local lab needs matching room/technician. Paid manually queued lab processing is a **separate 60-minute/$80 service**, with bounded work-queue admission. Diagnostic/pathology processing is nonbillable; Lab upgrade revenue must not be advertised as a diagnostic-speed effect. Phlebotomist/lab-technician training affects their own work phase. | `packages/balance-config/src/diagnostic-timing.ts:24`, `packages/balance-config/src/service-income-catalog.ts:49`, `packages/game-domain/src/service-operations.ts:465`, `packages/game-domain/src/service-operations.ts:497`, `packages/game-domain/src/types.ts:268`, `packages/balance-config/src/employee-training.ts:47`, `packages/balance-config/src/employee-training.ts:50` |
| Endoscopy, Peri-op beds, OR, autonomous providers | New periop-first operations use 30-minute preparation and 60-minute recovery; routine endoscopy's remaining procedure is 45. Recovery has 8 authored bed stations and 2 nurse posts per room, maximum 3 rooms; doors can reduce usable stations. Required nurse/room/provider resources determine what can start; both real nurses and bed reservations matter. Founder is a provider fallback; hired endoscopist/surgeon can reduce reliance on Founder. Scheduled endoscopy capacity is min(operational endoscopy rooms, nurses, endoscopists + Founder), with recovery room/nurse required. OR installed capacity also takes OR rooms, Recovery rooms, OR/Peri-op nurses, surgeons + Founder into account. These are game timings, not clinical claims. | `packages/game-domain/src/service-operations.ts:86`, `packages/game-domain/src/service-operations.ts:406`, `packages/game-domain/src/service-operations.ts:439`, `packages/game-domain/src/types.ts:741`, `packages/balance-config/src/approved-room-layouts.ts:191`, `packages/game-domain/src/room-capacity.ts:6`, `packages/balance-config/src/service-income-catalog.ts:46`, `packages/balance-config/src/service-income-catalog.ts:50` |
| Service appointments and manual work queues | “Scheduled appointments” On/Off is separate from ordinary encounters and advertising. Off stops new scheduled service visitors; existing work continues. Supported staffed suites determine capacity and future cadence: base cadence divided by installed capacity, rounded up. Paid work-queue admission uses its existing `canStart` guard. Do not suggest enabling every service to remedy every cash problem or ordering unnecessary tests. | `apps/player/src/ui/ServiceIncomePanel.tsx:128`, `packages/game-domain/src/reducer.ts:11082`, `packages/game-domain/src/service-operations.ts:2199`, `packages/game-domain/src/service-operations.ts:544`, `packages/game-domain/src/service-operations.ts:465` |
| Emergency consultation and telehealth automation | Manual emergency consultation pays $50, cooldown 60 minutes, no modeled daily use cap; eligible only without operational suite automation and after cooldown. Operational automation pays baseline $50 per NP per 60 minutes, 2 NPs per suite, maximum 10 operational slots clinic-wide. NP training adds $5 per completed training tier to the category-average baseline; suite upgrades add their own revenue multiplier to newly frozen intervals. A staffed suite can make the manual panel disappear. | `packages/game-domain/src/selectors.ts:115`, `packages/game-domain/src/selectors.ts:162`, `packages/game-domain/src/reducer.ts:6913`, `packages/game-domain/src/reducer.ts:10192`, `packages/balance-config/src/prototype-balance.ts:997`, `packages/balance-config/src/prototype-balance.ts:1060`, `packages/balance-config/src/employee-training.ts:89` |
| Retail and pharmacy procurement | Coffee: $5 gross/$1 stock, 2-minute purchase; bottled drinks $3/$1; snacks $4/$2. Vending drink/snack has the same respective gross/stock values and 1-minute purchase. Prescription pickup $25 gross/$15 stock, 2-minute purchase and pharmacist coverage. Supply baskets also exist. Stock cost must be affordable before dispensing; Founder consumption spends stock cost and earns no sales revenue. Pharmacist training cuts procurement cost by 5% per tier, up to 20%; pharmacy/vending upgrades raise gross sales, not supplier discounts. No player stock-restocking or price-setting lever was found. | `packages/balance-config/src/service-income-catalog.ts:52`, `packages/balance-config/src/service-income-catalog.ts:76`, `packages/balance-config/src/service-income-catalog.ts:83`, `packages/game-domain/src/retail-operations.ts:308`, `packages/game-domain/src/retail-operations.ts:414`, `packages/balance-config/src/employee-training.ts:53` |
| Quality reviews | Completed ambulatory-operation receipts enqueue a quality review. An idle surgeon with an operational office performs one review at a time; base work 30 minutes. Surgeon training and Office upgrades reduce new work duration. Completion records the QI ledger; this path does not itself award patient satisfaction, cash, employee training levels or Clinical XP. | `packages/game-domain/src/level-three-support.ts:314`, `packages/game-domain/src/level-three-support.ts:374`, `packages/game-domain/src/level-three-support.ts:282`, `packages/balance-config/src/prototype-balance.ts:1013`, `packages/balance-config/src/employee-training.ts:51`, `packages/balance-config/src/room-upgrades.ts:87` |
| Advertising and ordinary arrivals | Four tiers: Off/Local listings/Neighborhood ads/Aggressive outreach cost **$0/4/8/14 per hour** and use **100/92/84/75%** of the ordinary arrival interval. Base routine wait is **60 ±15 minutes**; first ordinary arrival range is **35–75**. Changing tier scales the remaining wait while preserving its sampled variation; it does not reroll or instantly create a patient. Workload, review/content/capability and active-case gates still apply. This is separate from scheduled service appointments. | `packages/balance-config/src/prototype-balance.ts:1016`, `packages/balance-config/src/prototype-balance.ts:1028`, `packages/game-domain/src/reducer.ts:10896`, `packages/game-domain/src/reducer.ts:10912`, `packages/game-domain/src/routine-patient-availability.ts:50` |
| Clinical XP, goals and advancement | Standard first decisions award 10 XP correct / 2 incorrect; first tutorial correct-decision award is 20. Progression config has XP 10/150/300/500 and satisfaction >90, but **two completed tutorials plus functional Examination Room bypass Level-0 XP/satisfaction requirements**. Level 1 requires Ultrasound, Minor Procedure, imaging technician; Level 2 requires first completed endoscopy; Level 3 has current clinic goals including first operation and operational pharmacist, with **no next level**. Completed counts are 0 in the current stage config. Use selector output, not a fabricated Level-4 unlock. | `packages/balance-config/src/prototype-balance.ts:851`, `packages/balance-config/src/prototype-balance.ts:1112`, `packages/game-domain/src/selectors.ts:1428`, `packages/game-domain/src/selectors.ts:1492`, `packages/game-domain/src/selectors.ts:1506`, `packages/game-domain/src/selectors.ts:1520`, `packages/game-domain/src/selectors.ts:1608` |
| Team discussions and spaced learning | Existing discussion first opportunity 30 minutes, subsequent interval 180, gated by actual employee, content, capability, availability and active-concept exclusions. Answers award 10/2 Clinical XP and update the concept learning history; they do not train the employee, pay cash or change patient satisfaction. Discussion lifecycle/age/open state exists. Ordinary encounter eligibility also respects concept review availability; advertising cannot bypass a review-only/content/active-case block. | `packages/game-domain/src/employee-discussions.ts:11`, `packages/game-domain/src/reducer.ts:2923`, `packages/game-domain/src/reducer.ts:3056`, `packages/game-domain/src/reducer.ts:3376`, `packages/game-domain/src/types.ts:1291`, `packages/game-domain/src/routine-patient-availability.ts:50` |
| Satisfaction, chart attendance, waiting and departures | Starting patient score 100, idle grace 20 minutes, 1 point lost per 5-minute interval, sidewalk multiplier 150%. Correct care +3 / incorrect -8. Facility conditions are capped at 15 pressure points, assessed once at check-in for ordinary patients; tutorial patients are exempt. Clinic display also uses live conditions and a rolling 10-result history. Opening/attending an eligible chart protects it under existing rules; accepted testing/travel is not ordinary unanswered-chart risk. Warning occurs at patient's own walkout cutoff +10, once per encounter; no general wait/result spam. | `packages/balance-config/src/prototype-balance.ts:927`, `packages/game-domain/src/reducer.ts:2473`, `packages/game-domain/src/selectors.ts:1354`, `packages/game-domain/src/departure-risk-alerts.ts:11`, `packages/game-domain/src/reducer.ts:1786` |
| Pause, speed, save and recovery | Current facility day is 8 AM–6 PM = 600 facility minutes; at 1x one minute is one real second while running. Speeds 1/2/4; pause prevents tick progression. Save & Close invokes existing save-and-pause flow; save failure needs actual latest write status, not a historical notice. These controls help manage attention but are not grounds for repeated tips merely because the player chooses to pause. | `packages/balance-config/src/prototype-balance.ts:909`, `packages/game-domain/src/reducer.ts:8351`, `apps/player/src/session/usePrototypeSession.ts:424`, `apps/player/src/session/usePrototypeSession.ts:1604` |
| Selling and expansion limits | Construction/investment, resale and staff-dismissal preview exist. Selling a room can interrupt accepted services, displace patients and dismiss/rehome employees; “sell rooms” is not a default quick-money button. Instance caps constrain expansion; show an alternative when the matching cap is reached. No loans, bankruptcy countdown, patient race-based weighting or general hospital-era staffing mechanic is proposed here. | `packages/game-domain/src/selectors.ts:1292`, `packages/game-domain/src/room-capacity.ts:176`, `packages/game-domain/src/reducer.ts:9123`, `packages/game-domain/src/service-operations.ts:1526`, `packages/balance-config/src/prototype-balance.ts:99` |

### Current room upgrade ladders and unlocks

All four prices below purchase room Levels 2/3/4/5; facility level is the room's **build unlock**, not an upgrade tier requirement. Benefits are per purchase: +6% reaches +24%; -10% of baseline reaches -40%; +2 points reaches +8; +1 reaches +4. Current costs/effects are from `packages/balance-config/src/room-upgrades.ts:65`; unlocks, construction, caps and recurring upkeep are from the cited `prototype-balance.ts` definitions. Buying an upgrade uses the live next-cost selector (`packages/game-domain/src/selectors.ts:1271`).

| Room | Facility unlock; build / hourly base upkeep / cap | Benefit per upgrade; four prices | Code |
| --- | --- | --- | --- |
| Examination | 0; $160 / $6 / 20 | +2 examination satisfaction; $90/140/210/300 | `packages/balance-config/src/prototype-balance.ts:88`, `packages/balance-config/src/room-upgrades.ts:68` |
| Waiting | 1; $350 / $7 / 5 | +2 waiting satisfaction; $110/170/250/360 | `packages/balance-config/src/prototype-balance.ts:135`, `packages/balance-config/src/room-upgrades.ts:69` |
| Bathroom | 1; $225 / $4 / 10 | 10% slower cleanliness loss; $70/110/170/250 | `packages/balance-config/src/prototype-balance.ts:113`, `packages/balance-config/src/room-upgrades.ts:70` |
| Minor Procedure | 1; $800 / $15 / 5 | +6% procedure revenue; $220/330/480/680 | `packages/balance-config/src/prototype-balance.ts:212`, `packages/balance-config/src/room-upgrades.ts:71` |
| Ultrasound | 1; $950 / $16 / 1 | +6% service revenue; $240/360/525/715 | `packages/balance-config/src/prototype-balance.ts:234`, `packages/balance-config/src/room-upgrades.ts:72` |
| X-ray | 2; $750 / $14 / 1 | +6% service revenue; $190/280/400/560 | `packages/balance-config/src/prototype-balance.ts:157`, `packages/balance-config/src/room-upgrades.ts:73` |
| CT | 2; $1,600 / $26 / 1 | +6% CT/CTA revenue; $400/600/880/1200 | `packages/balance-config/src/prototype-balance.ts:256`, `packages/balance-config/src/room-upgrades.ts:74` |
| Phlebotomy | 2; $550 / $9 / 3 | +6% collection revenue; $140/210/305/415 | `packages/balance-config/src/prototype-balance.ts:278`, `packages/balance-config/src/room-upgrades.ts:75` |
| EVS Closet | 2; $475 / $6 / 10 | Cleaning work 10% less time; $120/180/260/360 | `packages/balance-config/src/prototype-balance.ts:300`, `packages/balance-config/src/room-upgrades.ts:76` |
| Endoscopy | 2; $1,450 / $24 / 5 | +6% endoscopy revenue; $365/545/800/1090 | `packages/balance-config/src/prototype-balance.ts:322`, `packages/balance-config/src/room-upgrades.ts:77` |
| Peri-op/Recovery | 2; $900 / $16 / 3 | +2 recovery satisfaction; $225/340/495/675 | `packages/balance-config/src/prototype-balance.ts:344`, `packages/balance-config/src/room-upgrades.ts:78` |
| Training | 2; $650 / $8 / 1 | Training sessions 10% less time; $165/245/360/490 | `packages/balance-config/src/prototype-balance.ts:366`, `packages/balance-config/src/room-upgrades.ts:79` |
| Coffee | 2; $500 / $5 / 10 | +1 daily staff morale; $125/190/275/375 | `packages/balance-config/src/prototype-balance.ts:388`, `packages/balance-config/src/room-upgrades.ts:80` |
| Telehealth suite | 2; $1,200 / $12 / 5 | +6% telehealth revenue; $300/450/660/900 | `packages/balance-config/src/prototype-balance.ts:410`, `packages/balance-config/src/room-upgrades.ts:81` |
| Ambulatory OR | 3; $2,400 / $36 / 2 | +6% operation revenue; $600/900/1320/1800 | `packages/balance-config/src/prototype-balance.ts:432`, `packages/balance-config/src/room-upgrades.ts:82` |
| Laboratory | 3; $1,800 / $24 / 2 | +6% paid processing revenue; $450/675/990/1350 | `packages/balance-config/src/prototype-balance.ts:454`, `packages/balance-config/src/room-upgrades.ts:83` |
| Pharmacy | 3; $1,200 / $16 / 2 | +6% sales revenue; $300/450/660/900 | `packages/balance-config/src/prototype-balance.ts:476`, `packages/balance-config/src/room-upgrades.ts:84` |
| Workshop | 3; $800 / $10 / 1 | Repairs 10% less time; $200/300/440/600 | `packages/balance-config/src/prototype-balance.ts:498`, `packages/balance-config/src/room-upgrades.ts:85` |
| Staff Break | 3; $900 / $10 / 2 | +2 morale per break; $225/340/495/675 | `packages/balance-config/src/prototype-balance.ts:520`, `packages/balance-config/src/room-upgrades.ts:86` |
| Surgeon's Office | 3; $700 / $8 / 1 | QI reviews 10% less time; $175/265/385/525 | `packages/balance-config/src/prototype-balance.ts:542`, `packages/balance-config/src/room-upgrades.ts:87` |
| Vending | 3; $450 / $4 / 5 | +6% sales revenue; $115/170/250/340 | `packages/balance-config/src/prototype-balance.ts:564`, `packages/balance-config/src/room-upgrades.ts:88` |
| Reading | 3; $1,800 / $24 / 4 | Reading work 10% less time; $450/675/990/1350 | `packages/balance-config/src/prototype-balance.ts:586`, `packages/balance-config/src/room-upgrades.ts:89` |

Existing hourly upkeep increases per purchased upgrade remain: $1 Examination/Waiting/Bathroom/Phlebotomy/EVS/Training/Coffee/Workshop/Break/Office/Vending; $2 Minor Procedure/Ultrasound/X-ray/Recovery/Telehealth/Pharmacy; $3 CT/Endoscopy/Lab; $4 OR; **$0 Reading**. These are the definitions' `upkeepPerUpgradeLevel` fields, applied at `packages/game-domain/src/selectors.ts:1255` and `packages/game-domain/src/reducer.ts:6193`. Front Desk has no purchases; Hallway has none; Imaging Control is retired/nonbuildable. MRI, Pediatric Waiting/Examination, Wound/Ostomy, Founder's/Executive Office, Gift Shop, Garden and Gym upgrades are **inert future metadata**, not eligible suggestions (`packages/balance-config/src/room-upgrades.ts:90`, `packages/balance-config/src/room-upgrades.ts:106`).

### Staff training benefits, prices and hiring context

Training price ladders are fixed **P/2P/3P/4P**, independent of salary. Most roles gain 10% baseline improvement per purchase, up to 40%; pharmacist gains 5%, up to 20%. Endoscopy/OR team work combines nurse/provider role averages according to the actual provider; Peri-op training shortens preparation, **not recovery** (`packages/game-domain/src/employee-training-effects.ts:35`).

| Role | Hire unlock; hire / default hourly pay | Allowed hourly pay; employee cap | Training P; actual benefit | Code |
| --- | --- | --- | --- | --- |
| Receptionist | 1; $180 / $18 | $14–30; 1 | $75; reduces waiting satisfaction loss | `packages/balance-config/src/prototype-balance.ts:610`, `packages/balance-config/src/employee-training.ts:42` |
| Imaging technician | 1; $300 / $26 | $20–42; 3 | $75; reduces acquisition work time | `packages/balance-config/src/prototype-balance.ts:627`, `packages/balance-config/src/employee-training.ts:43` |
| Peri-op nurse | 2; $450 / $34 | $28–54; 2 | $125; reduces preparation time | `packages/balance-config/src/prototype-balance.ts:647`, `packages/balance-config/src/employee-training.ts:44` |
| Endoscopy nurse | 2; $500 / $36 | $28–58; 2 | $125; reduces endoscopy team time | `packages/balance-config/src/prototype-balance.ts:664`, `packages/balance-config/src/employee-training.ts:45` |
| Endoscopist | 2; $900 / $60 | $48–96; 2 | $225; reduces endoscopy team time | `packages/balance-config/src/prototype-balance.ts:681`, `packages/balance-config/src/employee-training.ts:46` |
| Phlebotomist | 2; $350 / $28 | $22–44; 2 | $100; reduces blood-collection time | `packages/balance-config/src/prototype-balance.ts:698`, `packages/balance-config/src/employee-training.ts:47` |
| EVS | 2; $280 / $24 | $20–38; 2 | $75; increases room-cleanliness restoration | `packages/balance-config/src/prototype-balance.ts:715`, `packages/balance-config/src/employee-training.ts:48` |
| Telehealth NP | 2; $600 / $40 | $32–64; 10 | $150; increases automated consultation payment | `packages/balance-config/src/prototype-balance.ts:732`, `packages/balance-config/src/employee-training.ts:49` |
| Lab technician | 3; $500 / $36 | $28–58; 2 | $125; reduces lab work time | `packages/balance-config/src/prototype-balance.ts:749`, `packages/balance-config/src/employee-training.ts:50` |
| Surgeon | 3; $1,400 / $90 | $72–144; 2 | $350; reduces OR team/QI work time | `packages/balance-config/src/prototype-balance.ts:766`, `packages/balance-config/src/employee-training.ts:51` |
| OR nurse | 3; $650 / $44 | $34–70; 2 | $175; reduces OR team time | `packages/balance-config/src/prototype-balance.ts:783`, `packages/balance-config/src/employee-training.ts:52` |
| Pharmacist | 3; $600 / $42 | $34–68; 2 | $150; reduces supply cost, not dispensing time | `packages/balance-config/src/prototype-balance.ts:800`, `packages/balance-config/src/employee-training.ts:53` |
| Repair Person | 3; $400 / $30 | $24–48; 2 | $100; reduces repair work time | `packages/balance-config/src/prototype-balance.ts:817`, `packages/balance-config/src/employee-training.ts:54` |
| Radiologist | 3; $300 / $26 | $20–42; 4 | $75; reduces interpretation work time | `packages/balance-config/src/prototype-balance.ts:834`, `packages/balance-config/src/employee-training.ts:55` |

## 2. Delivery policy and existing-state vocabulary

### Proposed occasional-tip cadence

These are **new editorial pacing rules**, not facts about current runtime cadence. Current operating-day length is 600 minutes (`packages/game-domain/src/alert-cadence.ts:14`); existing humor is spaced 120 minutes and experience complaints have their own daily policies (`packages/balance-config/src/prototype-alerts.ts:1308`, `packages/game-domain/src/alert-cadence.ts:19`).

- At most **one tip per 180 facility minutes**, maximum **3 tips in any rolling 600 minutes**, across the whole clinic. First tip after the two introductory encounters are completed and 120 further running facility minutes have elapsed. Preserve the existing required Examination Room tutorial guidance until then.
- Each ordinary trigger must remain eligible for **60 running facility minutes** before selection, except an explicit older saved age check that is stricter. No clock advances while paused; no resume/reload catch-up burst. A just-placed unstaffed room gets time to be staffed before a tip.
- Individual IDs have the cooldown specified below, mostly 600 or 1200. It is **per ID clinic-wide**, not a fresh budget for every employee/room. Variants and new targets share the same ID clock.
- Topic families also share **600 minutes**: staff welfare, training, access/setup, seating/amenities, cleaning, upgrades, marketing, finance, progression, learning, services. Prevent “build EVS,” “train EVS,” and “upgrade EVS” from firing in succession: one cause/target participates in one selected family until addressed; suppressed variants do not consume an emission budget.
- Choose the concrete blocker/remedy first, then a useful established-system improvement, then a long-unmet goal. Use longest eligible age as a deterministic tie-break. Never produce a separate complaint plus tip for the same cause. Show only one remedy for the current bottleneck.
- Hold tips while a dire card is first appearing or the player is in a care-answer interaction. After live cards resolve, apply a proposed 60-minute quiet period; unresolved cards do not accumulate tip emissions. Humor keeps its existing 120-minute limit but yields to a tip due on the same tick; no simultaneous joke/tip burst. This is a scheduling arbitration change, not added ambient frequency.
- Record the **emission timestamp**, not current tick on every render. Persist tip cooldown/continuous-eligibility metadata across reloads, using a namespaced extension of the existing alert cadence maps or an equivalent small versioned scheduler record. This is delivery bookkeeping; the catalog's gameplay predicates below need no new morale, efficiency, congestion or demand metric (`packages/game-domain/src/types.ts:1351`).
- Suppress when the fix is present, paid/queued/underway, or done recently. Existing durable fields such as `lastPraisedAtFacilityTick`, training request/session, `lastLitterCleanupAtTick`, `lastEvsRoomCleanupAtTick`, `lastBreakAtFacilityTick` and current room tiers suffice for many cases. For salary/hiring/upgrade/move/door/ad changes use the retained matching event/receipt plus observation of the changed current state; wait a fresh 600 minutes before suggesting another optional step. **Missing bounded history is unknown, not proof of “never” or “a long time.”** New IDs/old campaigns begin their eligibility grace now.
- Optional spending tips require the actual next quote to be affordable **and leave the existing $200 low-cash buffer**; suppress if the projected next operating posting is underfunded. Necessary first-room/setup tips require their actual quoted cost; do not withhold the first required Examination Room simply because it cannot leave $200. Do not emit an unaffordable “buy this” row; money guidance gets priority.
- Every catalog entry is an ordinary **Around the clinic** row styled `Tip`, with readable body/time and an optional explicit button. No exclamation mark, map pin, required click, acknowledgment, dismiss task or sound. The row can remain historical, but its action expires/revalidates when the predicate stops being true; live complaints do not remain in present tense after resolution.

### Predicate definitions (all derived from current state)

The shorthand below is part of the catalog contract, not hypothetical state fields.

| Shorthand | Definition and code source |
| --- | --- |
| `W` | Unresolved checked-in patients in `waiting_unopened` or `active_action_required`, with idle waiting present and no care/testing/departure movement. Use `patientLocation`, `waitingDestination`, `idleWaitingSinceTick` and `patientSatisfaction`; do not mistake an offsite/active service patient for hallway overflow. `packages/game-domain/src/types.ts:908`, `packages/game-domain/src/types.ts:928`, `packages/game-domain/src/types.ts:954`, `packages/game-domain/src/departure-risk-alerts.ts:15` |
| `R(roomId)` / `A(employeeId)` | Existing `isRoomOperationalForFacilityWork` / `isEmployeeAssignedToOperationalRoom`; for a new clinical phase use `isRoomAvailableForNewFacilityWork`. Assignment, geometry, maintenance, training absence and active reservations must be distinguished. Installed coverage is not zero just because a valid employee is busy or temporarily away. `packages/game-domain/src/selectors.ts:305`, `packages/game-domain/src/selectors.ts:323`, `packages/game-domain/src/selectors.ts:332`, `packages/game-domain/src/employee-training.ts:30` |
| `Q(kind, roomType)` | Accepted supported diagnostic plan from `getDiagnosticOrderPlans`, phase kind/requirement matching the named activity, status `queued`/`pending`, with dependencies actually completed. Use real `forecast.queueMinutes > 0` only for efficiency/backlog tips, not as proof of a missing room or clinical emergency. External frozen phases can justify a **future-orders** local-capability tip, never a claim that building changes the accepted order. `packages/game-domain/src/diagnostic-timing.ts:197`, `packages/game-domain/src/types.ts:190`, `packages/game-domain/src/types.ts:229` |
| `S(roomType, role)` | Service operation in `waiting_for_resources` or `waiting_for_next_phase`, current demanded frozen phase (next phase for the latter status) names that room/staff/provider; actual location distinguishes present people from transit. `resourceWaitReason` is explanatory, not an invented deficit score. Reuse frozen phases, reservations and installed resource checks. `packages/game-domain/src/types.ts:679`, `packages/game-domain/src/types.ts:730`, `packages/game-domain/src/level-three-support.ts:134`, `packages/game-domain/src/service-operations.ts:361` |
| `Train(e)` | `getEmployeeTrainingQuote(...).canTrain`, current `trainingLevel < 5`, `training == null`. A current request suppresses tips through return. Prefer Level 1 for first teaching; Levels 2–4 can qualify again after the recent-fix grace and individual cooldown when actual role demand persists. `packages/game-domain/src/employee-training.ts:105`, `packages/game-domain/src/types.ts:1122` |
| `Upgrade(r)` | Current purchase-enabled room catalog entry, live `getNextRoomUpgradeCost` non-null, room tier below maximum, `R(r)`, and affordability/buffer gate. Initial teaching tips normally select Level 1; later-tier advice waits the same cooldown after a real purchase. Never use future/retired catalog entries. `packages/balance-config/src/room-upgrades.ts:106`, `packages/game-domain/src/selectors.ts:1271`, `packages/game-domain/src/types.ts:1054` |
| `Hire(role)` | Role's actual unlock reached, employed role count below its `maximumEmployees`, no existing coverage that merely needs access or a temporary return, `getAvailableEmployeeHomeRoom` non-null, exact role hire price affordable. Revalidate ordinary reducer guards on click; new rooms are a separate placement step. `packages/game-domain/src/room-capacity.ts:199`, `packages/game-domain/src/reducer.ts:9823`, `packages/game-domain/src/selectors.ts:204` |
| `Money` | Existing `cashCents`, operating accrual, next posting, `projectedNextOperatingPostingCents`, `upcomingOperatingPostingIsUnderfunded`, and `getEmergencyGlp1Status`. Do not invent payroll at 4 PM, bankruptcy or a negative-cash countdown. `packages/game-domain/src/types.ts:1465`, `packages/game-domain/src/departure-risk-alerts.ts:34`, `packages/game-domain/src/selectors.ts:115` |
| `AutoWater` | At least one receptionist has an operational Front Desk assignment and a reachable cooler route, or an actual employee refill task exists. Evaluate durable installed coverage even while checking in, walking, on a break or temporarily training; do not use only current idleness as a coverage test. Actual rules/path target are in `packages/game-domain/src/reducer.ts:6567`; patient preemption in `packages/game-domain/src/reducer.ts:6632`. If the cooler cannot be reached, select the access remedy instead. |
| `AutoTrash` | At least one EVS employee has an operational closet assignment and a legal route to the relevant litter, or it is already targeted by a collect task. Evaluate capable installed coverage, not only the idle-worker subset; ignore short current-duty/training absences. Legal EVS target routing is in `packages/game-domain/src/reducer.ts:6813`, `packages/game-domain/src/reducer.ts:6858`. An inaccessible target is access guidance, not “click trash again.” |
| `FounderFree` | No active reserved Founder service; no manual interaction already underway; destination is reachable by the same care-aware routing as the existing command. Avoid sending Founder away from an unresolved answer-ready patient/discussion. `packages/game-domain/src/reducer.ts:10269`, `packages/game-domain/src/reducer.ts:10338`, `packages/game-domain/src/types.ts:1223` |

Optional actions below are **proposed feed wiring to existing commands**, not claims that current alert clicks already execute them. Today's handler generally navigates/highlights; Build Mode ignores the supplied build target (`apps/player/src/AppShell.tsx:503`, `apps/player/src/AppShell.tsx:602`). A proposed `Place {room}` action preselects the exact build definition, still requiring legal placement/doors. `Hire`, `Train`, `Upgrade`, `+1 ad`, `Refill` and `Send Founder` dispatch the normal guarded command. Buttons show the exact one-time price and any recurring salary/upkeep increase. No auto-answer, silent purchase, destructive sale/fire shortcut or bypass of existing training confirmation is proposed; `Train` can instead open the named existing confirmation popover.

## 3. Tip catalog (40 entries)

All entries inherit global spacing, grace, family suppression, recent-fix rules and ordinary feed placement above. Minimum facility levels do not impose an upper-level cutoff. Dynamic `{name}`, `{room}`, `{role}`, `{benefit}`, `{fix}` and `{goal}` values must be taken from the selected actual employee/room/catalog/requirement; a fix names a real supported action. Each copy variant is at most two sentences.

### T01 — `tip.staff.salary`

- **Trigger:** Employee morale <=45; a legal salary increase would produce a higher salary-derived morale than the current score. Use actual role salary bounds/steps and the formula, not “morale seems low” (`packages/game-domain/src/types.ts:1146`, `packages/game-domain/src/staff.ts:686`, `packages/game-domain/src/facility-experience.ts:318`).
- **Improvement:** Removes low-morale pressure when recovered; can improve completion satisfaction. No work-speed promise.
- **Minimum / cooldown / family:** L1 / 1200 minutes / staff welfare.
- **Suppression:** Recent salary change/praise/break/coffee recovery; salary at maximum; projected posting underfunded; resignation already represented by a finance card; recalculated salary would not help. A tiny raise is not a substitute for funding payroll.
- **Placement / optional action:** Tip feed row; open named employee's salary controls. A direct legal +$2/hour step may be offered with the resulting wage shown, after recomputing the resulting morale and posting cost.
- **A:** “Payroll is not a motivational poster. Raise {name}'s salary to improve morale and patient satisfaction.”
- **B:** “{name}'s morale has joined the lower tax brackets. Increase their salary to improve it.”

### T02 — `tip.staff.praise`

- **Trigger:** Employee morale <80, last praise absent or >=600 minutes ago, and `FounderFree` with reachable employee (`packages/game-domain/src/types.ts:1158`, `packages/game-domain/src/reducer.ts:10629`, `packages/balance-config/src/prototype-balance.ts:944`).
- **Improvement:** +5 morale after the actual praise interaction; no cash cost.
- **Minimum / cooldown / family:** L1 / 1200 / staff welfare.
- **Suppression:** Praise travelling/underway; recent welfare fix; imminent patient/employee departure card; training/break absence or active care would make the interaction unhelpful. Do not suggest praise to someone already at 100.
- **Placement / optional action:** Tip feed row; `Praise {name}` starts the ordinary Founder interaction, or opens its existing confirmation.
- **A:** “{name} has received plenty of tasks and remarkably little appreciation. Praise them for a morale boost.”
- **B:** “Recognition is currently an unfunded department. Praise {name} to improve morale without raising payroll.”

### T03 — `tip.training.build`

- **Trigger:** L2+, at least one employed employee below training Level 5 with relevant current work, and no built Training Room. Use training levels, role catalog and room definitions (`packages/game-domain/src/types.ts:1148`, `packages/balance-config/src/employee-training.ts:41`, `packages/balance-config/src/prototype-balance.ts:366`).
- **Improvement:** Enables paid role-specific training; operational base room also adds the existing one routine workload slot.
- **Minimum / cooldown / family:** L2 / 1200 / training.
- **Suppression:** Training Room already operational or newly placed; built but disconnected selects T07; unaffordable construction; no suitable staff. Do not recommend a second Training Room or extra global places.
- **Placement / optional action:** Tip feed row; `Place Training Room · $650` preselects placement.
- **A:** “The staff are learning by repetition, mostly of the slow parts. Build a Training Room to improve their role skills.”
- **B:** “Experience has been doing all the training unpaid. Build a Training Room for useful, measurable staff improvements.”

### T04 — `tip.training.role`

- **Trigger:** `Train(e)` and actual role activity: receptionist with `W`; phlebotomist with collection `Q`; nurse/provider with relevant `S` or active service; NP with automation slots; pharmacist with retail orders/operations; surgeon with queued QI. All signals are saved state (`packages/game-domain/src/employee-training.ts:105`, `packages/game-domain/src/employee-training-effects.ts:35`, `packages/game-domain/src/types.ts:1483`, `packages/game-domain/src/types.ts:1509`).
- **Improvement:** Exact role metric from the 14-role table: waiting-loss reduction, preparation/team/collection/QI time, NP payment or pharmacist supply cost. `{benefit}` must use the correct role, never generic “efficiency.”
- **Minimum / cooldown / family:** L2, or role unlock if L3 / 1200 / training.
- **Suppression:** Paid request/return underway, recent training, no useful role activity, unavailable room/buffer, sole necessary employee currently holding urgent work. Specialized imaging/EVS/lab/radiologist/repair training tips win over this fallback; one training suggestion per family interval.
- **Placement / optional action:** Tip feed row; open named Train confirmation with exact next price/category-average preview (`apps/player/src/ui/StaffPanel.tsx:338`).
- **A:** “{name} is doing this the long-established way. Train them to {benefit}.”
- **B:** “The job has evolved; {name}'s training has politely declined. Train them to {benefit}.”

### T05 — `tip.telehealth.automation`

- **Trigger:** Built telehealth suite without usable installed NP coverage, or no built suite and `emergencyGlp1.totalUses > 0` shows actual manual-consult use. Determine room access, matching NP home posts and actual automation assignments before choosing a build/hire fix (`apps/player/src/session/alertViewModels.ts:150`, `packages/game-domain/src/selectors.ts:154`, `packages/game-domain/src/selectors.ts:162`, `packages/game-domain/src/reducer.ts:10219`).
- **Improvement:** Automates the existing telehealth consultation line: baseline $50 per NP per 60 minutes, up to 2 NPs per suite. Salary/upkeep still apply; automation does not guarantee net profit. Functional automation disables the manual emergency control. Training-session room upgrades remain covered by T34.
- **Minimum / cooldown / family:** L2 / 1200 / access/setup.
- **Suppression:** Usable installed coverage even if temporarily busy/training; NP/suite already hired/placed recently; current access problem chooses T07; room/role cap or cash buffer failure. With no suite, do not infer manual use from absent bounded history; use the saved total. No repeated manual-consult reminder under automation.
- **Placement / optional action:** Tip feed row; `Hire telehealth NP · $600 + $40/hour` when a legal post exists, otherwise preselect `Place telehealth suite · $1,200` with staffing named in the body. `{fix}` is “Hire a telehealth NP” or “Build a telehealth suite and hire an NP”; permanent access failure uses T07.
- **A:** “Automatic consultations need more than an ambitious label. {fix} to automate telehealth work.”
- **B:** “The consultation button could use a day off. {fix} for automatic telehealth consultations.”

### T06 — `tip.reception.coverage`

- **Trigger:** No hired receptionist and either `W` or a patient awaiting staff for >60 minutes; Front Desk operational and `Hire(receptionist)` possible (`packages/game-domain/src/reducer.ts:336`, `packages/game-domain/src/reducer.ts:1761`, `packages/game-domain/src/room-capacity.ts:7`).
- **Improvement:** Check-in coverage while Founder works elsewhere, +1 routine workload slot, automatic water refill when intake permits. No training-independent check-in speed percentage.
- **Minimum / cooldown / family:** L1 / 1200 / access/setup.
- **Suppression:** Receptionist hired/recently hired, temporarily away, or already refilling; hired but disconnected chooses T07. An admitted card already naming the same coverage remedy absorbs this tip.
- **Placement / optional action:** Tip feed row; `Hire receptionist · $180 + $18/hour` using normal hire guards.
- **A:** “The clipboard currently reports to you. Hire a receptionist to cover check-in and refill water when the desk is quiet.”
- **B:** “One person is an ambitious staffing model. Hire a receptionist so check-in can continue while you work elsewhere.”

### T07 — `tip.access.restore`

- **Trigger:** `getFacilityAccessValidation().unreachableRoomIds`/room-specific issues contains a built room with actual patient/service demand or an employee's nonoperational home (`packages/game-domain/src/selectors.ts:1421`, `packages/game-domain/src/selectors.ts:305`, `packages/game-domain/src/doors.ts:328`, `packages/game-domain/src/types.ts:1151`).
- **Improvement:** Restores actual room/staff usability; correctly distinguishes access, dependencies and maintenance.
- **Minimum / cooldown / family:** L1 / 600 / access/setup.
- **Suppression:** Valid access restored, legal fix underway/recent placement correction, temporary staff travel only, repair already assigned. Maintenance failure chooses T30. A matching admitted setup card suppresses the feed tip.
- **Placement / optional action:** Tip feed row; select/highlight the specific room and relevant door/path issue in Build Mode. No arbitrary reassignment button.
- **A:** “{room} is an expensive room with an access problem. Fix its doors and connections so it can work.”
- **B:** “{room} has adopted a strict no-entry policy. Restore its operational access in Build Mode.”

### T08 — `tip.waiting.build`

- **Trigger:** `W` nonempty and no built Waiting Room at L1+ (`packages/game-domain/src/facility-experience.ts:245`, `packages/game-domain/src/types.ts:954`).
- **Improvement:** Four authored chairs, +2 base routine workload slots; removes missing-waiting-room pressure. Seats must remain reachable.
- **Minimum / cooldown / family:** L1 / 1200 / seating/amenities.
- **Suppression:** Any functioning Waiting Room/recent placement; disconnected built Waiting Room selects T07; no current waiting; unaffordable construction. Coverage/hallway overflow is T09 once rooms exist.
- **Placement / optional action:** Tip feed row; `Place Waiting Room · $350`.
- **A:** “The Front Desk is moonlighting as a lounge. Build a Waiting Room to give patients proper seats.”
- **B:** “Patients have noticed the absence of the room named after their main activity. Build a Waiting Room.”

### T09 — `tip.waiting.overflow`

- **Trigger:** Built operational Waiting Room(s); a member of `W` has a non-chair `waitingDestination`, particularly a hallway/public-area room, and the existing seat/reservation rules find no reachable unclaimed chair. Match actual endpoints, door exclusions and Founder/staff claims (`packages/game-domain/src/types.ts:954`, `packages/game-domain/src/reducer.ts:1010`, `packages/game-domain/src/reducer.ts:1054`, `packages/game-domain/src/reducer.ts:1234`).
- **Improvement:** Another Waiting Room adds real chairs; clearing the clinical queue also frees seats. No fabricated “three patients means overcrowded” threshold or direct hallway penalty.
- **Minimum / cooldown / family:** L1 / 1200 / seating/amenities.
- **Suppression:** Free reachable chair/reseating movement already exists; newly placed room; only an inaccessible chair problem. Suppress the build remedy at the room cap of 5; offer queue-care guidance only if an actionable chart can actually free capacity.
- **Placement / optional action:** Tip feed row; `Place Waiting Room · $350` when below cap. At cap, link to oldest actionable waiting chart with copy naming queue clearance.
- **A:** “The floor has become overflow seating. {fix} to free up proper seats.”
- **B:** “Standing room is not the amenity patients had in mind. {fix} so patients can sit down.”

For T09, `{fix}` is either “Build another Waiting Room” below the cap or “Work through the waiting queue” when a real actionable chart is available; never render the build wording at the cap.

### T10 — `tip.amenities.bathroom`

- **Trigger:** A member of `W` has waited >=30 minutes and no built Bathroom; existing missing-bathroom condition and patient waiting age provide the signals (`packages/game-domain/src/facility-experience.ts:275`, `packages/game-domain/src/types.ts:396`).
- **Improvement:** Removes missing-bathroom pressure, adds the modeled amenity benefit and enables physical bathroom trips.
- **Minimum / cooldown / family:** L1 / 1200 / seating/amenities.
- **Suppression:** Operational bathroom/recent build; a built disconnected bathroom selects T07. A temporarily occupied bathroom is not “no bathroom.” Do not suggest stacking copies for the distinct-type amenity bonus.
- **Placement / optional action:** Tip feed row; `Place Bathroom · $225`.
- **A:** “The clinic has a waiting plan and no restroom plan. Build a Bathroom to improve patient amenities.”
- **B:** “Patients would prefer a bathroom to a character-building exercise. Build one.”

### T11 — `tip.water.manual`

- **Trigger:** Cooler fill <=0, current empty episode >60 minutes, `!AutoWater`, `FounderFree` (`packages/game-domain/src/types.ts:1262`, `packages/game-domain/src/reducer.ts:6567`, `packages/game-domain/src/reducer.ts:10583`).
- **Improvement:** Refill to 100, remove current empty-water pressure, +1 eligible waiting-patient satisfaction on completion.
- **Minimum / cooldown / family:** L1 / 600 / seating/amenities.
- **Suppression:** Any usable receptionist coverage, actual staff/Founder refill, intake preemption under that coverage, temporary training absence, recent refill, no legal route or Founder busy. Access failure selects T07. Suppress old active water complaints too.
- **Placement / optional action:** Tip feed row; `Refill water` dispatches the normal Founder refill, if still available. Never a routine Needs-you card.
- **A:** “The cooler is now a large blue vase. Refill it to restore water and improve waiting-patient satisfaction.”
- **B:** “Hydration has been replaced by décor. Refill the water cooler.”

### T12 — `tip.evs.coverage`

- **Trigger:** L2+, litter present or an operational non-hallway room cleanliness <85, and no hired EVS worker; select build if no closet, hire if usable closet has a free position (`packages/game-domain/src/reducer.ts:6809`, `packages/game-domain/src/reducer.ts:6851`, `packages/game-domain/src/room-capacity.ts:17`).
- **Improvement:** Automatic reachable litter collection and periodic room cleaning. No promise of exactly one item/hour.
- **Minimum / cooldown / family:** L2 / 1200 / cleaning.
- **Suppression:** EVS employee already assigned/recently hired, including temporarily busy/away; broken closet chooses T07. Founder already cleaning is a short-term suppression, not a demand for another cleaner. Exact selected build/hire cost must be affordable.
- **Placement / optional action:** Tip feed row; `Place EVS Closet · $475` or `Hire EVS · $280 + $24/hour`. Two sequential setup stages, not a fictional combined one-click purchase.
- **A:** “The Founder has somehow become the cleaning rota. {fix} for automatic cleaning.”
- **B:** “Dust is not a staffing strategy. {fix} to handle routine cleaning.”

For T12, `{fix}` is “Build an EVS closet and hire its worker” only when the closet is missing; otherwise it is “Hire an EVS worker.” An existing inaccessible closet chooses T07.

### T13 — `tip.litter.manual`

- **Trigger:** A visible litter item is >60 minutes old, `!AutoTrash` for that target, and `FounderFree` (`packages/game-domain/src/types.ts:1185`, `packages/game-domain/src/reducer.ts:6427`, `packages/game-domain/src/reducer.ts:10551`).
- **Improvement:** Removes litter pressure, restores 12 cleanliness to its room and adds the separate manual-cleanup waiting satisfaction award.
- **Minimum / cooldown / family:** L1 / 600 / cleaning.
- **Suppression:** Any usable EVS coverage; actual employee/Founder collect target; recent cleanup; moved/removed target; inaccessible litter or Founder occupied. Do not complain about each additional item.
- **Placement / optional action:** Tip feed row; `Send Founder` directly starts collection of the live selected item. Never a routine Needs-you card.
- **A:** “The floor has acquired a collection. Send the Founder to remove the trash and improve cleanliness.”
- **B:** “That wrapper has stayed longer than several patients. Send the Founder to clean it up.”

### T14 — `tip.evs.training`

- **Trigger:** Assigned operational EVS employee with `Train(e)`, and operational non-hallway room cleanliness <85 or current `clean_room` task (`packages/game-domain/src/reducer.ts:6841`, `packages/game-domain/src/reducer.ts:6898`, `packages/balance-config/src/employee-training.ts:48`).
- **Improvement:** Raises baseline room-clean restoration from 10 toward 14 points across four purchases/category average; does not alter litter item count or directly shorten job time.
- **Minimum / cooldown / family:** L2 / 1200 / training.
- **Suppression:** Current/recent training, restored cleanliness, insufficient buffer, urgent sole-coverage work. Routine “pick up trash” notices remain suppressed even though this occasional capability tip is eligible.
- **Placement / optional action:** Tip feed row; open named EVS Train confirmation, next baseline price $75.
- **A:** “The mop is doing the contractual minimum. Train EVS to restore more cleanliness per room clean.”
- **B:** “EVS knows where the dirt is; the technique could use work. Train the worker for stronger room-cleaning results.”

### T15 — `tip.evs.room-upgrade`

- **Trigger:** Operational EVS home closet with `Upgrade(r)`; its worker is performing cleaning or there is reachable dirty-room demand below 85 (`packages/game-domain/src/reducer.ts:6886`, `packages/game-domain/src/room-upgrade-support.ts:48`, `packages/balance-config/src/room-upgrades.ts:76`).
- **Improvement:** 10% baseline reduction per purchase for **new** EVS litter/room-clean work, independent of restoration-focused employee training.
- **Minimum / cooldown / family:** L2 / 1200 / upgrades.
- **Suppression:** Recent upgrade, no ongoing/future cleaning need, max tier/buffer failure, employee absent because of a permanent setup problem. Do not suggest buying to instantly shorten the frozen current task.
- **Placement / optional action:** Tip feed row; `Upgrade {room} · {price}` for the actual worker's closet.
- **A:** “EVS has work waiting and equipment that could do more. Upgrade its closet to shorten new cleaning jobs.”
- **B:** “The cleaning equipment has achieved seniority without promotion. Upgrade the EVS closet for faster future cleans.”

### T16 — `tip.examination.capacity`

- **Trigger:** Existing `getWorkloadSnapshot().atRoutineCapacity`, checked-in waiting demand, at least one functioning Examination Room, and examination count below its cap of 20 (`packages/game-domain/src/selectors.ts:1194`, `packages/balance-config/src/prototype-balance.ts:98`, `packages/game-domain/src/types.ts:946`).
- **Improvement:** A new Examination Room adds 2 base routine workload slots. No claim that it creates another Founder or guarantees faster care.
- **Minimum / cooldown / family:** L1 / 1200 / access/setup.
- **Suppression:** Capacity recovered/new room just placed; room access is the actual blocker; cap reached; insufficient cash; current safety card needs attention. Do not advertise an upgrade as added capacity.
- **Placement / optional action:** Tip feed row; `Place Examination Room · $160`.
- **A:** “The clinic has reached its small but enthusiastic patient limit. Build another Examination Room for more routine capacity.”
- **B:** “Demand has outgrown the original examination setup. Add an Examination Room to increase routine capacity.”

### T17 — `tip.comfort.room-upgrade`

- **Trigger:** `Upgrade(r)` on a Waiting/Examination/Recovery room actually occupied/used by an unresolved patient with satisfaction <90. Use actual map location/experience witness and room tier; the current complaint predicate illustrates the room-use test but is restricted to Level-1 rooms (`packages/game-domain/src/facility-alert-conditions.ts:86`, `packages/game-domain/src/room-upgrade-experience.ts:35`, `packages/game-domain/src/types.ts:935`).
- **Improvement:** Exactly the room's +2 points per purchase at its actual waiting/examination/recovery application point, once per relevant witness; no generic care speed or added beds/chairs.
- **Minimum / cooldown / family:** L1 for Waiting/Examination; L2 for Recovery / 1200 / upgrades. This proposed teaching eligibility starts earlier than the current Level-3 complaint producer.
- **Suppression:** Recent upgrade, unrelated/unused room, frozen Recovery work that cannot gain the new bonus, satisfaction already 90+, max tier/buffer failure. Any departure-risk card wins over an optional comfort purchase.
- **Placement / optional action:** Tip feed row; `Upgrade {room} · {price}` with catalog next benefit.
- **A:** “{room} is relying heavily on charm. Upgrade it for {benefit}.”
- **B:** “Patients have reviewed {room}'s entry-level enthusiasm. Upgrade it for {benefit}.”

### T18 — `tip.imaging.coverage`

- **Trigger:** Built Ultrasound/X-ray/CT room with missing required operational technician coverage, or the existing pending outsourced X-ray condition with no operational X-ray room. Match the named room and current `Q`/`S`/pending outsourced study; existing setup helper alone is not proof of a stalled patient (`apps/player/src/session/alertViewModels.ts:126`, `packages/game-domain/src/diagnostic-timing.ts:212`, `packages/game-domain/src/facility-experience.ts:338`).
- **Improvement:** Functional local acquisition. Select build/access/hire from the actual missing resource; frozen external orders retain their routes.
- **Minimum / cooldown / family:** L1 Ultrasound; L2 X-ray/CT / 1200 / access/setup.
- **Suppression:** Functional installed coverage even when busy/training; already hired/placed fix; current access tip/card. One technician per imaging room; do not suggest a second for a full room or another room of a capped type.
- **Placement / optional action:** Tip feed row; `Hire imaging technician · $300 + $26/hour`, or exact room/access selection if that is the missing resource.
- **A:** “Onsite imaging requires more than good intentions. {fix} to make it available.”
- **B:** “The scanner cannot run on architectural confidence. {fix} to enable onsite imaging.”

### T19 — `tip.imaging.training`

- **Trigger:** Technician with `Train(e)` and actual acquisition backlog `Q` with positive queue or an active acquisition task/service (`packages/game-domain/src/employee-training-effects.ts:41`, `packages/game-domain/src/types.ts:201`, `packages/game-domain/src/reducer.ts:6688`).
- **Improvement:** Shortens supported staff-controlled acquisition work by the trained role average, rather than speeding up X-ray through a revenue upgrade.
- **Minimum / cooldown / family:** L2 / 1200 / training.
- **Suppression:** Training underway/recent, queue is actually Reading/offsite/pathology, missing access/staff, buffer failure or urgent sole coverage. Existing accepted timings retain their contract.
- **Placement / optional action:** Tip feed row; named technician's Train confirmation, baseline next price $75.
- **A:** “The scanner has developed a leisurely personality. Train your imaging technician to shorten scan time.”
- **B:** “Buying a faster-looking room will not train its operator. Train the imaging technician to reduce acquisition time.”

### T20 — `tip.reading.build`

- **Trigger:** L3, no built Reading Room, and a live supported diagnostic plan with an unfinished external interpretation phase (`packages/game-domain/src/diagnostic-timing.ts:197`, `packages/game-domain/src/types.ts:193`, `packages/balance-config/src/diagnostic-timing.ts:16`).
- **Improvement:** A Reading Room **plus radiologist** enables the local 5-minute baseline interpretation for eligible new orders, separate from acquisition/transport.
- **Minimum / cooldown / family:** L3 / 1200 / access/setup.
- **Suppression:** Built/operational Reading Room, recent placement, no interpretation demand, unaffordable construction. Building alone is not coverage; current external work does not automatically reroute.
- **Placement / optional action:** Tip feed row; `Place Reading Room · $1,800`, then normal radiologist hire setup later.
- **A:** “Your scans are waiting for someone else's reading desk. Build a Reading Room and hire a radiologist for faster interpretation on new orders.”
- **B:** “A scan and a report are separate accomplishments. Add a staffed Reading Room to bring future interpretation onsite.”

### T21 — `tip.reading.capacity`

- **Trigger:** Operational Reading Room with fewer assigned radiologists than its four posts, `Hire(radiologist)`, and dependency-ready local interpretation `Q` with positive queue (`packages/game-domain/src/room-capacity.ts:22`, `packages/game-domain/src/diagnostic-timing.ts:229`, `packages/game-domain/src/types.ts:201`).
- **Improvement:** Another staffed station supplies real reading concurrency; one job per reader. Adds neither chairs through upgrades nor guaranteed zero queue.
- **Minimum / cooldown / family:** L3 / 1200 / access/setup.
- **Suppression:** Four posts already staffed, transient queue/temporary absence without sustained backlog, recent hire, actual bottleneck is acquisition/pathology/room access, role cap reached or no spare operational post/cash buffer. Existing readers busy with a sustained reading queue is the intended positive trigger, not a suppression. If all posts are full, do not suggest a fifth reader for that room.
- **Placement / optional action:** Tip feed row; `Hire radiologist · $300 + $26/hour`.
- **A:** “The Reading Room has empty desks and a queue. Hire another radiologist to put a spare station to work.”
- **B:** “Unstaffed reading stations are excellent at waiting. Hire a radiologist for more reading capacity.”

### T22 — `tip.reading.training`

- **Trigger:** Assigned radiologist with `Train(e)` and actual active or queued local interpretation (`packages/balance-config/src/employee-training.ts:55`, `packages/game-domain/src/diagnostic-timing.ts:197`, `packages/game-domain/src/employee-training.ts:105`).
- **Improvement:** Role-average interpretation work reduction on newly accepted work, separate from station count and room upgrade multiplier.
- **Minimum / cooldown / family:** L3 / 1200 / training.
- **Suppression:** Current/recent training, pending work is external or another diagnostic phase, unstaffed station setup still missing, sole urgent reader duty, insufficient buffer. Do not promise to shorten the frozen queue immediately.
- **Placement / optional action:** Tip feed row; named radiologist's Train confirmation, baseline next price $75.
- **A:** “The reports are taking the scenic route through the Reading Room. Train a radiologist to shorten future interpretation work.”
- **B:** “Reports seem to enjoy their time at the reading desk. Train your radiologists for faster new reads.”

### T23 — `tip.reading.room-upgrade`

- **Trigger:** Operational staffed Reading Room with `Upgrade(r)` and actual local interpretation activity/backlog assigned to that room (`packages/game-domain/src/room-upgrade-reading.ts:25`, `packages/game-domain/src/types.ts:200`, `packages/balance-config/src/room-upgrades.ts:89`).
- **Improvement:** 10% baseline reduction per room purchase for new local interpretation only; employee and room factors multiply. The whole result ETA still includes dependencies, queues and travel.
- **Minimum / cooldown / family:** L3 / 1200 / upgrades.
- **Suppression:** Recent upgrade, room maxed, work is wholly external/frozen with no prospective local use, bottleneck is a missing reader, low buffer. More stations is T21, not the upgrade effect.
- **Placement / optional action:** Tip feed row; `Upgrade {room} · {price}`.
- **A:** “The Reading Room is giving each report an extended stay. Upgrade it to shorten new onsite reading work.”
- **B:** “The readers have chairs; the room could use better tools. Upgrade the Reading Room for faster future interpretation.”

### T24 — `tip.labs.coverage`

- **Trigger:** Actual collection/processing demand in a supported `Q` or `S`, with missing relevant local Phlebotomy/phlebotomist or Lab/technician resource. External unfinished phases may justify a new-orders capability tip, not retroactive rerouting. Choose the exact missing pair (`packages/game-domain/src/diagnostic-timing.ts:191`, `packages/game-domain/src/diagnostic-timing.ts:278`, `apps/player/src/session/alertViewModels.ts:140`, `packages/game-domain/src/service-operations.ts:465`).
- **Improvement:** Enables the missing local collection or processing step; preserves separate collection, processing and pathology phases and their billing rules.
- **Minimum / cooldown / family:** L2 for Phlebotomy; L3 for Lab / 1200 / access/setup.
- **Suppression:** Installed functional coverage temporarily busy/training; recent build/hire; built inaccessible room chooses T07; no matching demand or cash. Do not recommend a Lab to solve an acquisition/interpretation queue.
- **Placement / optional action:** Tip feed row; exact room preselection or matching staff hire. Current Phlebotomy hire $350 + $28/hour; Lab technician $500 + $36/hour.
- **A:** “{activity} is still relying on someone else's setup. {fix} to make that step available onsite for new work.”
- **B:** “Collection and processing are different jobs, despite sharing a tube. {fix} to improve onsite {activity}.”

### T25 — `tip.labs.training`

- **Trigger:** Operational Lab technician with `Train(e)` and local lab/pathology `Q` or paid remote processing operation active/queued (`packages/game-domain/src/employee-training-effects.ts:43`, `packages/balance-config/src/employee-training.ts:50`, `packages/game-domain/src/service-operations.ts:465`).
- **Improvement:** Lab role skill shortens supported staff-controlled lab processing, distinct from the Lab's revenue upgrade. Do not multiply a whole collected-lab ETA by this percentage.
- **Minimum / cooldown / family:** L3 / 1200 / training.
- **Suppression:** Current/recent training, no local processing, missing room/staff, buffer failure or sole urgent coverage. Phlebotomist training uses T04 with its own collection metric.
- **Placement / optional action:** Tip feed row; Lab technician Train confirmation, baseline next price $125.
- **A:** “The specimens have settled into a comfortable routine. Train the laboratory technician to shorten new processing work.”
- **B:** “The lab has equipment; staff skills still have room to grow. Train its technician to reduce processing time.”

### T26 — `tip.endoscopy.setup`

- **Trigger:** Built Endoscopy room plus accepted matching `S` or the unmet first-endoscopy requirement; missing operational Endoscopy/Recovery room, Endoscopy nurse or Peri-op nurse. Use the existing setup helper and actual functional-capacity checks (`apps/player/src/session/alertViewModels.ts:97`, `packages/game-domain/src/service-operations.ts:406`, `packages/game-domain/src/selectors.ts:1506`).
- **Improvement:** Completes the actual care/recovery resource chain. Founder can provide the procedure; endoscopist hire is optional independence, not a mandatory startup prerequisite.
- **Minimum / cooldown / family:** L2 / 1200 / access/setup.
- **Suppression:** Resource chain functional though busy; fix paid/placed/hired recently; temporary training absence; any live blocked-care card absorbs the suggestion. Select the first exact blocker, not an entire shopping list.
- **Placement / optional action:** Tip feed row; selected missing room/access or nurse hire with actual quote. A new Recovery Room costs $900; Endoscopy nurse $500 + $36/hour; Peri-op nurse $450 + $34/hour.
- **A:** “Endoscopy is more than the room with the scope. {fix} to complete its working setup.”
- **B:** “The scope cannot cover its own staffing and recovery. {fix} so endoscopy can run.”

### T27 — `tip.endoscopy.provider`

- **Trigger:** Endoscopy operation currently reserves Founder as provider, another endoscopy demand is queued, no hired endoscopist and `Hire(endoscopist)` is available (`packages/game-domain/src/types.ts:715`, `packages/game-domain/src/service-operations.ts:406`, `packages/game-domain/src/selectors.ts:467`).
- **Improvement:** A hired endoscopist can take future procedure-provider reservations, freeing Founder for other work. Does not displace the provider already frozen/reserved on an active case.
- **Minimum / cooldown / family:** L2 / 1200 / access/setup.
- **Suppression:** Endoscopist already employed/temporarily away, recent hire, nurse/room/recovery is the actual missing resource, no spare position or sustainable payroll buffer.
- **Placement / optional action:** Tip feed row; `Hire endoscopist · $900 + $60/hour`.
- **A:** “The Founder is now the clinic's entire endoscopy department. Hire an endoscopist to share future procedure work.”
- **B:** “One provider cannot be in every room, despite the job description. Hire an endoscopist to reduce reliance on the Founder.”

### T28 — `tip.periop.capacity`

- **Trigger:** Actual pending Peri-op preparation/recovery `S` or `Q`, with the relevant nurse/bed capacity already reserved; a legal spare nurse post or buildable additional Recovery Room exists. Read bed reservations, room care stations and employee reservations separately (`packages/game-domain/src/types.ts:741`, `packages/game-domain/src/room-capacity.ts:13`, `packages/game-domain/src/spatial.ts:174`).
- **Improvement:** Another nurse can use an existing spare nurse post; another Recovery Room supplies additional actual bed/room capacity. There are 8 authored bed stations per room, reduced when doors hide fixtures; 2 nurse posts per room. No upgrade-created beds.
- **Minimum / cooldown / family:** L2 / 1200 / access/setup.
- **Suppression:** Another available resource can already serve the queue; ordinary short turnover/travel; training return imminent; recent hire/build; all caps reached. Count usable stations through `getRoomCareStations`, not eight guaranteed beds (`packages/balance-config/src/approved-room-layouts.ts:191`).
- **Placement / optional action:** Tip feed row; `Hire Peri-op nurse · $450 + $34/hour` when nurse-limited, or `Place Recovery Room · $900` when actual room/bed capacity is limiting.
- **A:** “Recovery has acquired a waiting list of its own. {fix} to expand the resource the queue actually needs.”
- **B:** “An empty-looking bed is not necessarily an available care slot. {fix} to improve Peri-op capacity.”

### T29 — `tip.surgery.setup`

- **Trigger:** L3 with a built OR and an accepted matching `S`, or an unmet first-operation goal; the actual OR/Recovery room or OR/Peri-op nurse chain is incomplete (`packages/game-domain/src/service-operations.ts:439`, `packages/game-domain/src/selectors.ts:1520`, `packages/game-domain/src/types.ts:701`).
- **Improvement:** Functional ambulatory surgery resource chain. Hiring a surgeon can later reduce Founder reliance and enable office QI; a surgeon is not falsely required when Founder is a valid provider.
- **Minimum / cooldown / family:** L3 / 1200 / access/setup.
- **Suppression:** Functional chain temporarily occupied; accepted fix/training return; pending surgery setup card; lack of affordable legal remedy. Do not recommend more ORs when recovery/staff is the limiting step.
- **Placement / optional action:** Tip feed row; exact missing-room/access selection or nurse hire, e.g. OR nurse $650 + $44/hour.
- **A:** “The OR is ready for surgery in the architectural sense. {fix} to make the whole care pathway work.”
- **B:** “An operating room cannot operate on optimism alone. {fix} to complete its staffing and recovery setup.”

### T30 — `tip.maintenance.coverage`

- **Trigger:** OR/Lab/Pharmacy maintenance `due` or `out_of_service`, no repair task targeting it, and no usable assigned Repair Person/Workshop chain (`packages/game-domain/src/types.ts:1064`, `packages/game-domain/src/level-three-support.ts:348`).
- **Improvement:** Installs/restores automatic repair coverage; actual repairs reset maintenance uses and restore operational status after work.
- **Minimum / cooldown / family:** L3 / 600 / access/setup.
- **Suppression:** Repair assigned or in progress; existing reachable repair coverage merely busy; recent hire/access fix; admitted blocked-service card. A dirty room is not equipment failure, and EVS does not repair equipment.
- **Placement / optional action:** Tip feed row; `Place Workshop · $800`, `Hire Repair Person · $400 + $30/hour`, or select Workshop access, according to the missing stage.
- **A:** “{room}'s equipment has submitted its notice. Set up a Workshop and Repair Person to restore maintenance coverage.”
- **B:** “A mop cannot repair {room}'s equipment, though it has been considered. Restore Workshop and Repair Person coverage.”

### T31 — `tip.maintenance.training`

- **Trigger:** Assigned Repair Person with `Train(e)` and a maintenance-due/out-of-service room or actual repair task (`packages/balance-config/src/employee-training.ts:54`, `packages/game-domain/src/level-three-support.ts:366`).
- **Improvement:** Reduces future repair work using the role skill; Workshop upgrades are a separate multiplier.
- **Minimum / cooldown / family:** L3 / 1200 / training.
- **Suppression:** Current/recent training, no maintenance need, missing repair chain, low buffer, active repair urgently restoring a blocked patient service. Existing repair duration stays frozen.
- **Placement / optional action:** Tip feed row; named Repair Person's Train confirmation, baseline next price $100.
- **A:** “The repair schedule is showing admirable patience. Train the Repair Person to shorten future repair jobs.”
- **B:** “The equipment would appreciate a shorter reunion with the toolbox. Train your Repair Person for faster new repairs.”

### T32 — `tip.staff.break-room`

- **Trigger:** Employee morale <80, no built Staff Break Room, and last break absent or >=240 minutes ago; no current urgent assigned care demand for the target (`packages/game-domain/src/types.ts:1159`, `packages/game-domain/src/level-three-support.ts:134`, `packages/game-domain/src/level-three-support.ts:395`).
- **Improvement:** Enables automatic eligible breaks; 30 work minutes and +5 morale with the existing per-employee cooldown. Does not guarantee breaks while the employee is needed for care.
- **Minimum / cooldown / family:** L3 / 1200 / staff welfare.
- **Suppression:** Operational/recently built break room, current break or recent salary/praise/coffee recovery, staff already happy, insufficient construction buffer. Built but inaccessible room selects T07.
- **Placement / optional action:** Tip feed row; `Place Staff Break Room · $900`.
- **A:** “The staff currently recharge by standing somewhere else. Build a Staff Break Room for proper morale-restoring breaks.”
- **B:** “Time off the corridor is apparently a workplace benefit. Build a Staff Break Room so idle staff can recover morale.”

### T33 — `tip.staff.coffee`

- **Trigger:** At least one employed staff member below 80 morale and no built Coffee Kiosk (`packages/game-domain/src/types.ts:1147`, `packages/game-domain/src/reducer.ts:7009`, `packages/balance-config/src/prototype-balance.ts:388`).
- **Improvement:** Once-daily +2 baseline staff morale under operational kiosk coverage; optional actual retail sales are separate. No per-cup morale stacking.
- **Minimum / cooldown / family:** L2 / 1200 / staff welfare.
- **Suppression:** Operational/recent kiosk or welfare improvement; existing inaccessible kiosk selects T07; no staff; insufficient buffer. Do not imply buying multiple kiosks multiplies daily morale.
- **Placement / optional action:** Tip feed row; `Place Coffee Kiosk · $500`.
- **A:** “Morale has been asked to run without coffee. Build a Coffee Kiosk for a daily staff morale boost.”
- **B:** “The staff are surviving on determination, an unreliable beverage. Add a Coffee Kiosk for daily morale support.”

### T34 — `tip.room.other-upgrade`

- **Trigger:** `Upgrade(r)` on an established room not covered by a more specific upgrade tip, with real attributed use: active/completed service room witness or reserved room, retail outlet, dirty Bathroom, repair work associated with its Workshop, queued QI with its Office, daily coffee with low staff morale, or an operational Training Room with a future eligible `Train(e)` and current role activity. Use room instance IDs, not global totals (`packages/game-domain/src/types.ts:720`, `packages/game-domain/src/retail-operations.ts:308`, `packages/game-domain/src/types.ts:1063`, `packages/game-domain/src/level-three-support.ts:374`, `packages/game-domain/src/room-upgrade-support.ts:48`, `packages/game-domain/src/employee-training.ts:105`).
- **Improvement:** Exact catalog next benefit: +6% room-attributed gross revenue; Bathroom slower future soil loss; Workshop shorter future repairs; Office shorter future QI; Coffee larger next daily award; Break Room greater future-break morale; Training Room shorter newly accepted sessions, without extra places. No clinical-service choice based on income. Lab revenue refers only to paid processing.
- **Minimum / cooldown / family:** Named room build unlock: L1/L2/L3 / 2400 / upgrades.
- **Suppression:** Recent purchase; new/unused room; unresolved staffing/access bottleneck; wrong-room attribution; capped tier/buffer failure. Specialized upgrade tip has priority. Existing accepted work/daily coffee already awarded retains its contract.
- **Placement / optional action:** Tip feed row; `Upgrade {room} · {price}` with its exact next benefit and upkeep increase. `{benefit}` includes “future repairs/new paid processing/next daily coffee” where needed.
- **A:** “{room} has an upgrade available, pending the budget's consent. Upgrade it for {benefit}.”
- **B:** “There is an improvement button behind all that respectable décor. Upgrade {room} for {benefit}.”

### T35 — `tip.advertising.increase`

- **Trigger:** Advertising level 0, both introductory encounters completed, >75 minutes since `lastPatientArrivalTick`, spare routine workload, and `getRoutinePatientAvailability` reason `available` or `arrival_scheduled`. The proposed 75-minute qualification exceeds both normal first-arrival and unmodified routine-wait upper bounds; retain the global sustained grace. Read the saved due tick for context; “not yet due” alone is not a failure (`packages/game-domain/src/facility-alert-conditions.ts:198`, `packages/game-domain/src/types.ts:1359`, `packages/game-domain/src/types.ts:1522`, `packages/balance-config/src/prototype-balance.ts:1019`, `packages/game-domain/src/selectors.ts:1194`, `packages/game-domain/src/routine-patient-availability.ts:50`).
- **Improvement:** Local listings cost $4/hour and use the 92% arrival-interval multiplier. The remaining scheduled wait scales without rerolling; no instant-patient guarantee (`packages/game-domain/src/reducer.ts:10912`).
- **Minimum / cooldown / family:** L1 / 1200 / marketing.
- **Suppression:** Ads already on/recently changed, at capacity, incoming first arrival still in normal 35–75-minute window, review/content/capability/in-progress block, low-cash buffer or underfunded posting. Retire the old unconditional no-arrival recommendation.
- **Placement / optional action:** Tip feed row; `Start local listings · $4/hour` sets level 1.
- **A:** “The phone has achieved inner peace and you have room for patients. Start local listings to increase arrivals.”
- **B:** “The clinic is accepting patients; apparently the neighborhood has not heard. Turn on local advertising while you have spare capacity.”

### T36 — `tip.advertising.reduce`

- **Trigger:** Advertising >0 and routine workload at/over capacity, or routine availability blocked by reviews/content while ads keep accruing, or an underfunded upcoming posting with advertising cost >0 (`packages/game-domain/src/types.ts:1472`, `packages/game-domain/src/selectors.ts:1194`, `packages/game-domain/src/routine-patient-availability.ts:7`, `packages/game-domain/src/departure-risk-alerts.ts:53`).
- **Improvement:** Reduces future hourly expenditure and arrival pressure. Preserves already accrued expenses and current cases.
- **Minimum / cooldown / family:** L1 / 600 / marketing.
- **Suppression:** Recent ad adjustment; temporary one-tick capacity change; explicit finance card already offers the same step; level 0. Do not blame a review gate on room capacity or imply ads change review eligibility.
- **Placement / optional action:** Tip feed row; `Lower advertising · save ${delta}/hour` selects the next lower actual tier, or existing advertising control if a finance choice needs context.
- **A:** “Advertising is charging for demand the clinic cannot use. Lower it to reduce arrival pressure and operating costs.”
- **B:** “The advertising bill is finding plenty of work. Reduce advertising while you clear the current admission block.”

### T37 — `tip.cash.manual-consult`

- **Trigger:** Cash below the existing $200 threshold, no operational telehealth automation, and `getEmergencyGlp1Status().eligible` true (`packages/balance-config/src/prototype-balance.ts:1060`, `packages/game-domain/src/selectors.ts:115`).
- **Improvement:** Current manual emergency consultation pays $50 with the 60-minute cooldown. It is a temporary money tool, not promised funding for all projected expenses.
- **Minimum / cooldown / family:** L0 after introductory gate / 600 / finance.
- **Suppression:** Cash recovered, consultation used/recent cooldown, operational suite coverage or current automated slot temporarily on an ordinary task, hidden manual control, or an admitted finance card already provides the action. Do not send the player to an absent panel.
- **Placement / optional action:** Tip feed row; `Emergency consult · +$50`, using the normal eligible command. If automation temporarily disables the action, omit this tip instead of faking eligibility.
- **A:** “The budget is entering its minimalist phase. Use the emergency consultation for $50 while you rebuild your cash buffer.”
- **B:** “Cash reserves have become a philosophical concept. An available emergency consultation adds $50.”

### T38 — `tip.progression.next-step`

- **Trigger:** `getFacilityProgressionStatus` has an unmet current requirement or a real eligible next level, unchanged for the proposed sustained interval. Select the exact unmet selector requirement; at L3 `nextFacilityLevel` is null, so use current clinic goal wording (`packages/game-domain/src/selectors.ts:1428`, `packages/game-domain/src/selectors.ts:1604`, `packages/game-domain/src/types.ts:1830`).
- **Improvement:** Makes an actual room/staff/XP/satisfaction/first-service requirement discoverable or surfaces the existing Advance action when eligible. No new unlock/cash/XP mechanic.
- **Minimum / cooldown / family:** L0 after introductory gate / 1200 / progression; one tip per unchanged goal per interval.
- **Suppression:** Recently advanced/met requirement, active setup/money/patient problem has a more concrete tip/card, selected purchase is unaffordable, tutorial already explains it. XP branch may point to an available patient/discussion, never a fake reward for simply waiting.
- **Placement / optional action:** Tip feed row; exact preselected room/hire/actionable chart or Goals link. `Advance` only when eligible and next level non-null; never at current Level3 cap.
- **A:** “The goal will not complete itself. {fix} to complete {goal}.”
- **B:** “Goals has been patiently maintaining this to-do list. {fix} to finish {goal}.”

### T39 — `tip.learning.team-discussion`

- **Trigger:** Existing discussion `waiting_unopened`/`active_action_required`, created at least 600 facility minutes ago, not already open, participant still exists and normal discussion blocked reason is null (`packages/game-domain/src/types.ts:1297`, `packages/game-domain/src/selectors.ts:61`, `packages/game-domain/src/employee-discussions.ts:72`).
- **Improvement:** Concept practice and the existing 10/2 first-answer Clinical XP; this is distinct from paid employee training and has no patient/cash effect.
- **Minimum / cooldown / family:** L1 plus existing content/role eligibility / 1200 / learning.
- **Suppression:** Discussion open/travelling/feedback/resolved/cancelled, a recent answered discussion, unavailable participant, Founder occupied or patient/finance urgency. Silence the answer receipts rather than posting them as “handled.”
- **Placement / optional action:** Tip feed row; `Open team discussion` opens this exact discussion, not its employee-management card.
- **A:** “{name} has been waiting to discuss something other than payroll. Open the team discussion for concept practice and Clinical XP.”
- **B:** “The staff have a learning question and an impressive amount of patience. Open {name}'s discussion to practice and earn Clinical XP.”

### T40 — `tip.services.appointments`

- **Trigger:** `serviceAppointmentsEnabled === false`, at least one current-level supported scheduled line has positive installed functional capacity, and its relevant service resources have no current accepted queue. Use frozen service definitions and existing endoscopy/OR/general installed checks, not “room built” alone (`packages/game-domain/src/types.ts:1499`, `packages/game-domain/src/service-operations.ts:361`, `packages/game-domain/src/service-operations.ts:406`, `packages/game-domain/src/service-operations.ts:439`).
- **Improvement:** On permits new scheduled service visitors; ordinary patient arrivals and existing service operations remain separate.
- **Minimum / cooldown / family:** L1, or selected service's higher minimum / 2400 / services. One teaching emission per newly established supported service setup, not a daily “turn it back on” nag.
- **Suppression:** Appointments on, current queue/resources overloaded, recent explicit Off selection, intentionally left Off after seeing this tip, missing staff/access, or dire care/money problem. Observe the existing toggle/current setup for this delivery suppression; do not invent a last-toggle state field. Unknown historical intent is not neglect.
- **Placement / optional action:** Tip feed row; `Turn on Scheduled appointments` calls `SET_SERVICE_APPOINTMENTS_ENABLED` with true, retaining the player's choice when ignored (`apps/player/src/ui/ServiceIncomePanel.tsx:128`, `packages/game-domain/src/reducer.ts:11082`).
- **A:** “Your staffed suites are open; their appointment book is not. Turn on Scheduled appointments when you want service visitors.”
- **B:** “The rooms are ready for work and the diary is practicing silence. Enable Scheduled appointments to admit scheduled service visitors.”

## 4. Admission to “Needs you”

### Precise admission test

Having a button does not make a tip a card. A candidate must satisfy **all** of the following:

1. Its source predicate is true **now**, using the actual patient/employee/room or latest storage result, not an old alert's authored `action_required` priority.
2. It represents either an existing departure-risk predicate, an underfunded next operating posting with employed staff, a failed latest campaign write, or an accepted physically present patient's next required phase **hard blocked by a missing/unreachable installed resource**. “Hard blocked” excludes busy but installed staff/rooms, travel, training, breaks, room turnover, incomplete dependencies, scheduled phase timers and frozen external work. Optional purchases, expected queues and unmet future goals fail this test.
3. A specific valid next step is available: open that actionable chart; fund the identified posting using an actually eligible control; restore the identified room access; hire/build the actual missing resource when legal and affordable; or retry through the existing save flow. Navigation may be the next step when it selects the precise fix. No absent panel, unaffordable purchase, invented reassignment control or “click here” with no remedy.
4. The remedy is not already installed, reserved, paid, queued or underway. A single root problem gets a single card; the same patient/risk or payroll shortfall must not occupy several slots.

This definition uses existing game facts and proposes presentation policy. It adds no clinical acuity threshold, new “considering leaving” state, efficiency score, bankruptcy deadline or disease-specific advice. A genuine condition whose fix is unavailable remains visible in the relevant chart/management/storage status and may receive a non-card feed explanation with no false button; it does not consume a fake actionable card.

**Patient departure:** use `patientDepartureRiskIsActive` verbatim: unresolved waiting/action-required lifecycle, not patience-exempt, checked in, idle waiting present, chart not open, no active movement, satisfaction <= that patient's actual walkout threshold +10. The actual threshold is patient-specific; do not invent a time-until-departure countdown. One warning per encounter remains the notification contract; the saved warning tick supports a live card after raw history eviction (`packages/game-domain/src/departure-risk-alerts.ts:11`, `packages/balance-config/src/prototype-alerts.ts:1316`, `packages/game-domain/src/reducer.ts:1786`, `apps/player/src/session/alertViewModels.ts:738`).

**Payroll/employee departure:** use `upcomingOperatingPostingIsUnderfunded` and the real next posting. The forecast is the floored cents value from accumulated sixtieth-cents plus hourly expense until `nextFinancialPostingTick`; underfunded means projected charge >0 and `cashCents` below it. Admit one finance card when underfunded and `employees.length > 0`. Highlight actual resignation risk only for employees satisfying `employeeDepartureRiskIsActive`: morale <=10+3=13 under that same shortfall. Show computed missing cash and the actual posting tick, not “payroll at 4 PM.” Group all affected staff into the finance card, with named employees in its body. A $50 manual consultation may reduce the gap; never promise that it funds an arbitrary deficit (`packages/game-domain/src/departure-risk-alerts.ts:34`, `packages/game-domain/src/departure-risk-alerts.ts:53`, `packages/game-domain/src/departure-risk-alerts.ts:61`, `packages/balance-config/src/prototype-balance.ts:1026`, `packages/balance-config/src/prototype-balance.ts:1056`, `packages/game-domain/src/selectors.ts:115`). If there is no valid cash action, show the shortfall in finance status/feed rather than linking to a hidden consultation panel. Reducing advertising changes future accrual; it does not erase accrued expense.

**Accepted-work hard block:** require the current accepted frozen phase, completed dependencies, actual in-clinic location and missing/unreachable compatible capacity. Diagnostic phase requirements and dependency status are in `Q`; service resource status, phase index, location and ready tick are already saved in `S`. Do not infer a blocked patient from “room built but not staffed” alone. A queued study with available resources or an outsourced study following its accepted route is not dire. Resolve when the relevant installed resource is restored or the case advances/cancels; do not wait for a complaint cooldown (`packages/game-domain/src/types.ts:190`, `packages/game-domain/src/types.ts:229`, `packages/game-domain/src/types.ts:679`, `packages/game-domain/src/types.ts:710`, `packages/game-domain/src/types.ts:725`, `packages/game-domain/src/types.ts:749`, `packages/game-domain/src/service-operations.ts:361`).

**Save failure:** latest write result is failed, not merely a retained `alert.system.save-failed` notice. Offer the existing Save & Close/save-and-pause flow with its pause behavior made explicit; keep the campaign open if the retry fails. The current `saveAndPause` callback is real, not a nonexistent retry API. Any verified later write success clears the card, including autosave. Current code updates the latest result on every write but clears the stored notice only when explicit `saved` is published; that mismatch needs repair in the revamp (`apps/player/src/session/usePrototypeSession.ts:395`, `apps/player/src/session/usePrototypeSession.ts:424`, `apps/player/src/session/usePrototypeSession.ts:1604`). This is session storage state, not a new `GameState` field.

### Capacity, priority and lifecycle

- Render **0–3 cards**, never three fillers. Sort eligible cards: latest unresolved save failure; patient departure risk (smallest actual satisfaction margin first, then oldest idle wait); payroll risk (actual resignation risk first); accepted-work hard blocks (oldest existing phase-ready/queue time). This is a proposed tie-break policy, not an additional urgency threshold.
- Group same-cause payroll warnings; merge a hard block with a risk card for the same patient. Put the real missing-resource fix on the combined card. Multiple genuinely distinct patients may use separate slots. A compact `+N other actionable problems` count may disclose eligible overflow; never render a fourth card or an unrelated joke to fill space.
- Stable identity is cause + affected entity/root resource. Timestamp is first eligible onset, not the current render tick. Re-evaluate every projection and remove on recovery, work advancement, cancellation or loss of actionable remedy. A historical raw event never holds a card open.
- Preserve once-per-encounter patient emission and existing per-employee 600-minute warning cooldown (`packages/game-domain/src/departure-risk-alerts.ts:81`). Reappearance of a still-live saved warning can restore its card without a new sound, duplicate feed row or replayed emphasis.
- Tips are never promoted simply because they are old or their optional button exists. Only the independent live admission test can create a card. Water/litter age and average cleanliness alone never pass it.
- On resolution, either remove the card silently or retain one compact past-tense handled record for that **previously admitted** problem. Do not turn routine player-action receipts into a new “handled” stream. Resolved rows have no action or warning mark; body/time must make history clear. No sounds.

### Exact routing of current alert families

The discovery distinguishes domain events, 15 condition keys and synthetic/session rows. The table below covers those current families, including every condition key. Source-level details override older discovery prose: notably, the current crowding producer is **Level 1 only**, not >=1 (`packages/game-domain/src/facility-alert-conditions.ts:225`).

| Current alert / source | Needs-you admission | Feed or suppression |
| --- | --- | --- |
| `patience_warning` with `alert.patient.departure-risk`, including its active fallback | **Yes**, while the exact live predicate and valid chart/fix action hold. | At most one onset/history row per encounter; past warning loses action on recovery. All other patience-warning definitions stay hidden. `packages/game-domain/src/departure-risk-alerts.ts:11`, `packages/balance-config/src/prototype-alerts.ts:1399` |
| `staff_departure_risk` / `alert.staff.departure-risk` | **Yes**, merged into one finance/payroll card while the exact live predicate holds and a concrete funding remedy exists. | Preserve named risk and the real posting deadline; replace employee-management-only cash link with finance action. `packages/game-domain/src/departure-risk-alerts.ts:61`, `apps/player/src/AppShell.tsx:519` |
| `low_cash` / `alert.finance.low-cash`; `no_cash` / `alert.finance.no-cash` | **Conditional**: only the underfunded next posting with employed staff and a valid finance remedy; same card as staff risk. $199 or $0 by itself is not admission. | Otherwise occasional finance feed/T37/T36, subject to eligibility. A forecast shortfall can also occur above $200; projecting it is a new presentation candidate based on existing Money, not another current alert producer. `packages/game-domain/src/facility-alert-conditions.ts:170`, `packages/game-domain/src/departure-risk-alerts.ts:53` |
| `alert.system.save-failed` | **Yes**, if the latest actual write still failed and the existing retry flow is available. | Drop stale error after any verified recovery; keep ordinary save-success notices hidden. `apps/player/src/session/usePrototypeSession.ts:424` |
| `alert.facility.endoscopy-inoperable` | **Conditional**: accepted present patient's current Endoscopy/Peri-op phase is hard blocked by the stated missing resource, with a valid remedy. | Otherwise T26/T28/T07, spaced feed only. An idle newly built room is setup guidance. `apps/player/src/session/alertViewModels.ts:97` |
| `alert.facility.imaging-inoperable`; `unavailable_onsite_xray` -> `alert.staff.imaging-technician-needed` / `alert.facility.onsite-imaging-requested` | **Conditional** only for an accepted present local phase hard blocked by its real missing resource. Pending outsourced X-ray alone never qualifies. | T18/T07 for future capability or access. Temporarily busy/away staff and an already frozen external route suppress inappropriate build/hire instructions. `apps/player/src/session/alertViewModels.ts:126`, `packages/game-domain/src/facility-experience.ts:338` |
| `alert.facility.phlebotomy-inoperable` | **Conditional**: accepted present collection phase hard blocked, with its valid actual resource fix. | Otherwise T24/T07, retaining unlocked guidance at Level 3 instead of losing it. `apps/player/src/session/alertViewModels.ts:137` |
| `missing_examination_room` / `alert.facility.private-exam-needed` | **Conditional** only when an already accepted present encounter's required next action is structurally blocked and the exact legal fix is available. | Otherwise ordinary required tutorial/first-room guidance or T16. Missing room, unmet progression or privacy complaint alone is not dire. `packages/game-domain/src/facility-experience.ts:260`, `packages/game-domain/src/facility-experience.ts:621` |
| `alert.facility.evs-inoperable`; `alert.facility.glp1-inoperable` | **No** for their current setup predicates. | T12/T07 or T05/T07 for telehealth. Cash/maintenance/patient risk must qualify independently. Their present Level-2-only upper cutoff should go. `apps/player/src/session/alertViewModels.ts:145` |
| `visible_litter` -> `alert.environment.trash-visible` / `alert.patient.cleanliness-complaint` | **No**. | T13 only without `AutoTrash`, target reservation or current cleanup. **Disappear as live notices with usable EVS coverage**, even when EVS is temporarily busy/training. Route inaccessible litter to access guidance. `packages/game-domain/src/facility-experience.ts:430`, `packages/game-domain/src/reducer.ts:6813` |
| `dirty_cleanliness` / `alert.facility.cleanliness-low` | **No** from the existing cleanliness predicate alone. | Replace duplicate complaint with one precise T12/T14/T15 coverage/restoration/work-time tip, as applicable. Under EVS coverage do not ask Founder to click routine trash; training/closet guidance can still teach a distinct unaddressed lever. `packages/game-domain/src/facility-experience.ts:452` |
| `empty_water_cooler` / `alert.environment.water-empty` | **No**. | T11 only without `AutoWater`/current refill. **Disappear as live notices with usable receptionist coverage**, including intake-preempted refill. Permanent route failure selects T07; not a manual-refill nag. `packages/game-domain/src/reducer.ts:6567`, `packages/game-domain/src/reducer.ts:6632` |
| `missing_waiting_room` / `alert.facility.waiting-room-needed`; `waiting_room_crowded` / `alert.facility.waiting-room-crowded` | **No** from missing seats or old patient-count predicate. | T08/T09 based on real reachable chairs/overflow. No card for three waiting patients. `packages/game-domain/src/facility-experience.ts:474`, `packages/game-domain/src/facility-alert-conditions.ts:225` |
| `missing_bathroom` / `alert.facility.bathroom-needed` | **No**. | T10 when genuinely missing/unavailable; do not multiply notices per patient. `packages/game-domain/src/facility-experience.ts:494` |
| `no_receptionist` / `alert.staff.receptionist-recommended` | **No** from its current generic coverage predicate. | T06/T07; not a reinstated routine check-in alert. `packages/game-domain/src/facility-experience.ts:504` |
| `low_staff_morale` / `alert.staff.morale-low` | **No**. Actual insolvency resignation predicate uses its separate rule. | Keep raw complaint hidden; new occasional T01/T02/T32/T33 uses current cause/available fix. This implements the October 7 guidance request without reviving continuous morale warnings. `packages/game-domain/src/facility-experience.ts:318`, `packages/balance-config/src/prototype-alerts.ts:1371` |
| `advertising_recommended` / `alert.advertising.recommended` | **No**. | Replace with qualified T35, or T36 for the opposite problem. Drop false recommendations under running ads/capacity/content gates. `packages/game-domain/src/facility-alert-conditions.ts:198` |
| `room_upgrade_requested` / `alert.patient.room-upgrade-requested` | **No**. | T17 or another actual GS-038 benefit, exact room named. Optional upgrades are not emergency work. `packages/game-domain/src/facility-alert-conditions.ts:76` |
| `progression_eligible` / `alert.progress.level-complete`, synthetic level-complete fallback; `alert.progress.next-step` | **No**. | One ordinary milestone or spaced T38 with real Advance/next requirement; no permanent warning mark and no Level-4 promise at current cap. `apps/player/src/session/alertViewModels.ts:1360`, `apps/player/src/session/alertViewModels.ts:1386` |
| `staff_quit` / `alert.staff.quit-insolvency` | **No**: already happened; existing event has no modeled live action. | One past-tense consequence feed row; a remaining coverage deficit can separately meet hard-block admission. Do not leave `!` on the historical quit. `packages/game-domain/src/reducer.ts:6251`, `apps/player/src/session/alertViewModels.ts:270` |
| `facility_level_advanced` | **No**. | Milestone feed row; clear old action marker. Goals can be an optional ordinary link. `packages/game-domain/src/reducer.ts:10176` |
| `success_message`: first ordinary patient resolved, satisfaction crossing >90 | **No**. | Retain rare celebration feed with existing once-campaign/600-minute limits. No urgent patient-chart action after completion. `packages/game-domain/src/reducer.ts:2626`, `packages/game-domain/src/reducer.ts:2736` |
| `ambient_message`, current 37-line pool | **No**. | Ordinary humor feed under existing 120-minute scheduler, with tips yielding/spacing arbitration and corrected playable-level eligibility. No card/action. `packages/balance-config/src/prototype-alerts.ts:1225`, `packages/balance-config/src/prototype-alerts.ts:1308` |
| `employee_discussion_decision` | **No**. | **Disappear**: receipt of the player's just-completed answer. T39 teaches discussion availability, not its answer result. `packages/game-domain/src/reducer.ts:3380`, `packages/balance-config/src/prototype-alerts.ts:1335` |
| Already hidden domain receipts: operating expense, clinical decision, encounter settled, emergency consultation, development cash, room placed/sold/upgraded/moved/rotated, door placed/removed, litter appeared/collected, water low/refilled, staff hired/fired/salary changed/praised, day rollover, left before seen; additionally patient arrived/results ready | **No**. | Stay hidden. Existing policy is at `packages/balance-config/src/prototype-alerts.ts:1335`; additional arrival/result filtering at `apps/player/src/session/alertViewModels.ts:1424`. Use their retained events as recent-action witnesses, not feed output. |
| Hidden definition receipts: patient arrived/result-ready/decision-required/left/complete/leaving/waiting/patience/check-in-unattended; staff morale-low/hired/fired/praised; patient payment/expense/consultation completed; receptionist/waiting/X-ray/technician/upgrade/trash/water successes | **No**. | Stay hidden under `packages/balance-config/src/prototype-alerts.ts:1360`. The newly qualified departure-risk warning remains the explicit exception; do not re-enable generic patient waiting or result spam. |
| `alert.system.saved`, `hidden-pause`, `campaign-created`, `campaign-restored`, `campaign-restarted`, `testing-mode` | **No**. | Stay hidden in this board; existing quiet UI statuses retain their job. `packages/balance-config/src/prototype-alerts.ts:1385` |
| Dormant definitions `alert.learning.review-scheduled`, `alert.facility.room-unreachable`, `alert.staff.unreachable`, `alert.progress.objective` | **No current producer to route**. | Do not claim implementation from catalog existence. T07/T38 derive real current state. See inventory/provenance at `docs/handoffs/ALERTS_EVENTS_DISCOVERY.md:108`. |

Reading, OR, Lab and equipment-maintenance hard blocks have useful **existing state**, but no corresponding current board alert family is established by discovery. Applying the hard-block rule to them would be a new state-derived projection within the revamp, not re-enabling a supposed existing warning. Ordinary backlog, due maintenance with usable equipment and repair already underway stay feed/status only.

## 5. Retire, reword and correct current presentation

| Existing item | Proposed treatment and accurate copy/action |
| --- | --- |
| Water/trash routine notices despite automation | Retire their active rows/buttons/attention signals whenever `AutoWater`/`AutoTrash` holds, rather than merely reducing frequency. Do not create “water handled”/“trash handled” receipts each time. Preserve only genuinely historical context without a current action. T11/T13 cover manual gaps; T07 covers permanent path failure. |
| EVS “one item per hour” / train to pick up faster | Do not use. Actual litter baseline is 2 work minutes plus travel, no hourly cap. Train EVS for room-clean restoration (T14); upgrade the closet for shorter new cleaning work (T15). Do not confuse the 30-minute **room-clean** cooldown with litter. |
| “Upgrade slow X-ray” / general “improve care efficiency” | Replace with the actual improvement tag. Technician training shortens acquisition; Reading training/upgrades shorten new local interpretation; X-ray/CT/Ultrasound upgrades increase service revenue. Comfort upgrades improve satisfaction. No purchase adds generic work speed/capacity. `packages/balance-config/src/room-upgrades.ts:65` |
| `alert.patient.room-upgrade-requested` loses room name | Name the actual room from a `{ kind: "room", id }` target and its live benefit/next price. Use T17's two copy variants. Fix placeholder propagation instead of showing “The room.” `packages/game-domain/src/facility-alert-conditions.ts:152`, `apps/player/src/session/alertViewModels.ts:365`, `packages/balance-config/src/prototype-alerts.ts:686` |
| “Raise salaries to improve efficiency” | Reword to morale/patient satisfaction (T01). Salary recalculates the morale baseline; do not imply an additive +5 to current morale or a speed boost. Insolvency warning must name the actual cash gap rather than suggesting a wage increase into an underfunded posting. |
| Dirty-cleanliness “clean visible trash or improve maintenance” -> room upgrade | Retire that misleading destination. Litter may help its own room, but Repair Person maintenance is equipment service, not general cleaning. Offer real EVS coverage/restoration/closet work-time guidance as the limiting factor. `packages/game-domain/src/facility-experience.ts:452`, `apps/player/src/AppShell.tsx:511` |
| Crowding from >=3 waiting patients | Retire this proxy and its persistent fallback. Use actual standing/hallway destination and reachable chair claims (T09). The source currently checks `facilityLevel === 1`; higher-level guidance should follow actual unlock/current state, not the erroneous >=1 discovery shorthand. `packages/game-domain/src/facility-alert-conditions.ts:225`, `apps/player/src/session/alertViewModels.ts:1314` |
| Offsite X-ray -> unconditional “Build X-ray” | Distinguish missing room, inaccessible room, missing technician, temporary busy/away and frozen external route. Recommend only the real future-capability fix; never promise rerouting or accelerating an already accepted external order. `packages/game-domain/src/facility-experience.ts:529` |
| “Hire or restore their room assignment” | Remove the unsupported manual-reassignment implication. Current home assignment reconciles automatically. Say “Hire {role}” when missing, or “Fix {room}'s access/available position” when that is the actual problem; do not hire another employee into a full post. `packages/game-domain/src/room-capacity.ts:81`, `packages/game-domain/src/room-capacity.ts:199` |
| Setup rows stamped `now + 0.041` every update | Retire perpetual rebasing. Emit a tip once when scheduled; keep its true emission time. A hard-block card owns a stable live identity and original onset, not a synthetic new feed event every tick. `apps/player/src/session/alertViewModels.ts:1341` |
| Setup guidance vanishes at Level 3; Level-3 humor absent | Remove obsolete upper-level cutoffs while retaining actual room/role minimum levels and appropriate context. Include current Reading/Lab/OR/Pharmacy/support systems, not future hospital rooms. Ambient correction remains a separate catalog/scheduler integration detail. `apps/player/src/session/alertViewModels.ts:137`, `packages/balance-config/src/prototype-alerts.ts:1234` |
| Unconditional inner-peace/advertising recommendation | Replace with T35/T36 eligibility. Low ads, spare workload and usable admission eligibility matter; advertising cannot overcome review/content/capability gates. Preserve patient-folder context rather than inventing new arrival warnings. `packages/game-domain/src/facility-alert-conditions.ts:198`, `apps/player/src/session/patientAvailabilityViewModel.ts:42` |
| Cash notice -> hidden emergency-consult panel | Revalidate actual manual eligibility and installed automation. Use real finance choices; show exact projected shortfall. A row must not link to a component that returns null. $50 is not a guarantee of payroll coverage. `apps/player/src/AppShell.tsx:614`, `apps/player/src/ui/EmergencyGlp1Panel.tsx:12` |
| Mockup cash/receptionist amounts | Treat mockup amounts as illustrative, not balances. Current receptionist costs **$180 hire + $18/hour**, not an invented $400/day. Next posting is every 15 facility minutes, not a fixed afternoon payroll appointment. Use live balance/quote text, never static design examples. `packages/balance-config/src/prototype-balance.ts:613`, `packages/balance-config/src/prototype-balance.ts:1026` |
| Next-step/level-complete permanently marked urgent | Move to T38 or rare milestone feed with real current requirement/Advance. A goal is not dire solely because it has an action. At Level 3 use current goals; no next level exists in the present prototype. `packages/game-domain/src/selectors.ts:1604` |
| Historical quit/departure/empty-water copy looks current | Remove resolved actions and markers; label handled/history with occurrence time and past tense where retained. Quit is a consequence, not a live actionable warning. A new staffing deficit must earn its own admission. `apps/player/src/session/alertViewModels.ts:688` |
| Team answer “decision recorded/corrective teaching” | Add `employee_discussion_decision` to receipt suppression. Keep feedback inside the discussion; T39 is a rare reminder of available learning. Do not put answered discussions into “handled.” `packages/game-domain/src/reducer.ts:3380` |
| Save-failed remains after successful autosave | Clear on the latest verified success, not only explicit `saved` publication. Keep storage failure wording literal and useful; no joke that obscures whether the campaign is safe to close. `apps/player/src/session/usePrototypeSession.ts:395`, `apps/player/src/session/usePrototypeSession.ts:429` |
| Build action opens an untargeted palette; guidance disappears in Build Mode | Implement the approved exact-room preselection and readable feed/tray pathway when the revamp is executed. Placement/door validity remains the real command guard. The current handler ignores `targetId`; this proposal does not claim it already works. `apps/player/src/AppShell.tsx:602`, `apps/player/src/AppShell.tsx:970`, `docs/design/alerts-events-revamp.html:231` |
| Optional sound in the design | Omit entirely per October 7 owner instruction. Preserve reduced-motion support and no required notification-click chores. Existing board itself has no audio hook (`docs/handoffs/ALERTS_EVENTS_DISCOVERY.md:50`). |

## 6. Manager handoff and scope of verification

This proposal supplies catalog predicates and source-linked mechanics, not new gameplay. Implementation should reuse existing guarded commands, keep tip-delivery metadata separate from gameplay facts, preserve saves/frozen work and validate current GS-038 integration before shipping its benefit copy. Clinical teaching/questions remain in their existing review workflow; no new clinical statements or clinical-content approval are proposed here.

Acceptance checks for this document: 40 unique tip IDs; each entry has trigger/source, improvement, minimum level, individual cooldown, inherited global spacing, suppression, feed placement, optional action and two short copy variants; all 15 condition keys and seven currently visible domain families have explicit routing; code citations must exist and be within line bounds. These checks measure document coverage only. No runtime tests, live gameplay, Git inspection, owner-save access, web or installs are part of this worker lane. Manager acceptance, implementation and checkpoint decisions remain with the Claude Code manager.

Read-only document validation: **PASS — 40/40 unique entries with all required fields; 80/80 variants at most two sentences (maximum 23 template words); 15/15 source-derived condition keys and 7/7 visible event families routed; 535 full-path citations exist and are within line bounds (399 unique); 7 well-formed tables; UTF-8 clean.** Numeric comparison: **PASS — 22/22 room unlock/build/upkeep/cap/upgrade-price rows and 14/14 staff unlock/hire/pay/range/cap/training-price rows match the current balance source.** These are structural and source-comparison checks, not runtime behavior tests or final acceptance of concurrent GS-038 work.
