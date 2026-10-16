# Room economy audit — October 8, 2026

**Status: analysis and proposals only; manager review pending.** Sol research worker for the Claude Code GamifySurgery manager. This lane writes this report, `tools/economy-audit/` research artifacts and an appended completion handoff. It changes no game code, production balance, clinical content, campaign, launcher or browser storage. All dollar amounts, demand shares and durations below are game-economy assumptions or existing software values, not clinical or real-world financial claims.

The owner's concern is supported by the current numbers. A staffed endoscopy pathway earns enough when functioning, but several other rooms do not. In the broad Level 3 clinic modeled here, operating costs exceed baseline receipts by **$29.77 per game hour**. With endoscopy idle, that becomes **$374.77/hour**. A $1,000 buffer then lasts about **2.67 game hours** after the clinic has settled into its ordinary flow.

**Recommendation for the manager:** Option A fixes ordinary per-room profitability with a smaller implementation surface, while retaining existing salaries. Option B better matches the owner's goal of making money management secondary to playing: it reduces fixed costs, needs fewer large fee increases, stays profitable at half demand, and withstands one idle endoscopy room at ordinary demand. Both are proposals requiring manager/owner selection; neither has been applied. B changes the salary scale substantially and would need an explicit, save-safe salary-rebasing decision.

## 1. Accounting and demand contract

### What actually gets charged or paid

- **One runtime tick is one facility minute.** The displayed operating day is 08:00–18:00, or ten game hours. Despite legacy names such as `upkeepPerExpenseInterval`, upkeep and salary values are **hourly rates**, accrued each minute and posted every **15 minutes**. There is no automatic exemption for idle, unstaffed, disconnected or out-of-service rooms; employed staff remain on salary. Advertising is included in operating costs. The simulation calls the actual expense selector to cross-check every modeled clinic/option/tier. [S1, S3, S4]
- Ordinary encounter completion pays `20 + 15 × answered questions + 65 × correct answers` at Levels 1–3. Thus one answered question pays **$35 if incorrect or $100 if correct**, with an $87 mean at the assumed 80% accuracy. Level 0 instead pays `15 + 10 × questions + 50 × correct`; its one-question payouts are $25/$75. The old $75 reward-tier metadata is not the current ordinary settlement formula. Diagnostic/procedure income is additional, only when an accepted billable operation actually completes. [S1, S3]
- Scheduled endoscopy pays **$600**, including routine endoscopy; the **$450** catalog base is for corresponding encounter work. Advanced endoscopy pays $600. The payment follows successful completion/discharge, so a room can accrue several hours of expenses before its first receipt. [S2, S5]
- Retail receipts equal **gross sale minus stock cost**. Founder consumption pays **no sale revenue** and costs the clinic stock. A prescription pickup requires an authorized order; it is not generated simply by building a pharmacy. Diagnostic laboratory processing is nonbillable; the separate $80 paid lab work queue requires a player request. [S2, S5, S6]
- New in-house radiologist reads add **$5** to the acquisition fee; accepted old split work preserves its earlier split. Outside reads also earn $5 with a five-minute base timer, preemptible for center work. The Reading row counts all paid reads once; it does not also add the same $5 to imaging-room income. Scheduled acquisition-only visitors do not automatically produce an extra local read in this model. [S7]
- At zero cash, the runtime caps payment, reduces staff morale by three per unpaid posting, and can eventually lose employees. Consequently the simulation's fixed-roster accounting after a first shortfall is a **liability estimate**, not a prediction that the real clinic keeps operating normally. Stock purchases can also fail without stock cash. [S1, S3, S6]

### Ordinary demand used here

These are transparent workload assumptions, not measurements from the owner's save. All rooms are connected and operational, appointment intake is enabled, employees earn base salaries, training and room levels are 1, and no advertising is purchased. Human decision work is assumed prompt enough to avoid capacity blocking. The model intentionally includes missed/deferred teaching arrivals rather than assuming every available encounter is completed.

| Stream | Baseline assumption | Basis and limitation |
|---|---|---|
| Teaching encounters | Actual 60 ± 15 minute arrival generator; complete four of each five opportunities, one question each, four of each five answers correct; simplified 45-minute receipt delay | `getNextRoutineArrivalTick` and settlement code are used directly for timings/payouts; completion share, accuracy and delay are scenario assumptions. Real FSRS eligibility, capabilities, occupied workload slots and player decisions can reduce income further. [S3] |
| Ultrasound / X-ray / CT / collection appointments | Catalog cadence 120 / 180 / 240 / 60 minutes | Shared **30-minute spacing**, oldest-last-arrival priority, finite waiting admissions, and restart-from-actual-admission clocks are modeled. Their nominal rates cannot simply be added. [S2, S5] |
| Endoscopy | Routine every 120 minutes plus advanced every 600 minutes, per functional capacity | One functional team here. Runtime creates new phases of **30-minute peri-op preparation, 45-minute procedure, 60-minute recovery**, rather than blindly executing the older combined catalog phases. Two 15-minute nurse checks overlap the bed phases; eight beds are shared. [S5, S8] |
| OR | One ordinary operation per 600 minutes; no extra extended cases assumed | Current new-operation flow is 30-minute preparation, 120-minute operation, 60-minute recovery. A dedicated surgeon is hired in the snapshots so the founder can play teaching encounters. [S2, S5] |
| Minor procedures | 0.20 paid simple procedures/hour at $100 | Assumed encounter mix: roughly one per four completed teaching encounters. These are encounter-only/explicit operations, not an automatic appointment stream. No extra income from special $150/$200 variants is assumed. [S2, S5] |
| Paid laboratory queue | 0.50 requested $80 jobs/hour | Explicit engagement assumption, not passive room income; 60 minutes/job leaves headroom for other work. Diagnostic processing and its contention are not executed in this small model. [S2, S5] |
| Pharmacy | 0.50 authorized prescription pickups + 0.50 OTC baskets/hour | $25/$15 gross/stock for prescriptions; $12/$6 for OTC. Authorized-order rate is assumed; optional OTC demand is bounded by shopping budgets and per-actor limits. [S2, S6] |
| Kiosk / vending | Two kiosk purchases/hour, equal coffee/drink/snack mix; one vending purchase/hour, equal drink/snack mix; founder consumes two coffees/day | Achievable demand assumption, not an outlet capacity claim. Staff/founder/patients/visitors can shop; food/drink has a two-per-day actor cap and a 120-minute trip cooldown. Outside retail opportunities occur every 120 minutes and only half are accepted by the deterministic draw. Both outlets compete for customers; no new demand per additional copy is assumed. [S6] |
| Telehealth | One untrained NP completes one $50 consultation/hour; room supports two NPs | This automatic stream does not depend on patient arrival frequency. Staff absence/discussion/nonoperational assignment can interrupt it. [S1, S3, S4] |
| Reading | **Nine completed reads/hour/reader**, two readers in Level 3 | Conservative 45 reading minutes/hour out of 60, allowing breaks, walking, discussions and lost partial outside work. The seated theoretical maximum is 12/hour, but it is not the budgeted baseline. Local reads use part of this budget; outside work fills the remainder. [S7, S9] |

**Slow period:** half the teaching/appointment/procedure/manual-job/prescription/OTC/retail workload. Autonomous telehealth and the outside-read capacity budget remain available at their ordinary rates; founder consumption stays two coffees/day. Halving service appointment demand is a stress scenario, not a claim that the current game randomly changes those catalog timers. No added teaching-case diagnostic fees, critical-case bonuses, emergency button income, room-sale money or development grants are counted.

The actual scheduled simulation produces about **0.50 ultrasound, 0.35 X-ray, 0.25 CT and 0.65 collection completions/hour** in the full clinic, compared with nominal rates of 0.50/0.333/0.25/1.00. Collection loses appointments to the shared spacing/priority rules; the finite four-day window also rounds counts. Endoscopy yields **0.575/hour**, compared with the nominal 0.60. These are modeled completions with the stated short walks, not guaranteed owner-save throughput.

**Advertising:** Off costs $0/hour and uses 100% of the routine interval; Local listings cost $4 and use 92%; Neighborhood ads cost $8 and use 84%; Aggressive outreach costs $14 and uses 75%. At this assumed completion/accuracy mix, the theoretical incremental teaching margin over Off is approximately $2.05/$5.26/$9.20 per hour. The service scheduler, telehealth and outside reads do not consult advertising. If FSRS has no eligible case or capacity/player attention is exhausted, ad costs remain and that incremental teaching income may disappear. [S1, S3, S5]

Workload slots are **concurrent admission limits**, not arrivals/hour or service stations: base 2, examination +2, waiting +2, minor procedures +1, phlebotomy +1, endoscopy +1, recovery +1, laboratory +1, OR +1, receptionist +1, and one operational training room +1. The snapshots have routine limits **8/12/14**, plus one critical reserved slot. GS-038 examination upgrades add no workload. [S1, S4]

## 2. Every currently buildable room, Levels 0–3

The following table uses full-clinic baseline demand so the shared arrival bottleneck is included. Revenue is gross; **net = gross − stock/consumption cost − room upkeep − listed direct staff**. Support rooms carry their own negative cost row; their protected income is described instead of invented as a second payment. An OR surgeon is charged to the OR row, not again to the office. Recovery is charged once in its own row; a bundled allocation follows below. Reading shows **one reader** here, with the two-reader whole-clinic case explained below.

| Room type | Unlock | Build cost | Upkeep/hour | Direct staff and hourly pay | Capacity | Revenue or protected function | Baseline paid throughput / timer | Gross/hour | Stock/hour | Net/hour |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Front Desk | 0 | $0.00 | $6.00 | Receptionist $18.00/h | 1 receptionist slot; public chair/standing anchors | SUPPORT; public entrance/check-in; receptionist +1 workload and protects teaching/visitor satisfaction and water supply | No direct fee; $0 | $0.00 | $0.00 | -$24.00 |
| Hallway | 0 | $35.00 | $0.00 | None | 1 walkable tile; unlimited copies | SUPPORT; connects doors and routes to every fee-paying room | No direct fee; $0 | $0.00 | $0.00 | +$0.00 |
| Examination Room | 0 | $160.00 | $6.00 | Founder $0/h | 1 care anchor; +2 workload; max 20 rooms | Teaching settlement; no fixed exam-room fee; experience upgrades only | 0.804 teaching completions/h; $35/$100 per one-question visit at L1-3 | $69.08 | $0.00 | +$63.08 |
| Bathroom | 1 | $225.00 | $4.00 | None | Max 10; no paid staff needed | SUPPORT; protects satisfaction/cleanliness and amenity access | No direct fee; $0 | $0.00 | $0.00 | -$4.00 |
| Waiting Room | 1 | $350.00 | $7.00 | None | 4 chair anchors; +2 workload; max 5 rooms | SUPPORT; protects waiting satisfaction and arrival handling | No direct fee; $0 | $0.00 | $0.00 | -$7.00 |
| X-ray Room | 2 | $750.00 | $14.00 | Imaging Technician $26.00/h | 1 modality/technician station; max 1 room | Paid acquisition; protects onsite availability; any paid local read booked to Reading | 0.350 acquisitions/h x $90; 60 min acquisition; 180 min cadence | $31.50 | $0.00 | -$8.50 |
| Minor-Procedure Room | 1 | $800.00 | $15.00 | Founder $0/h | 1 procedure station; +1 workload; max 5 rooms | Accepted encounter-only procedure fees; founder performs work | 0.200 simple procedures/h x $100; 45 min; sampling $150 and complex $200 excluded | $20.00 | $0.00 | +$5.00 |
| Ultrasound Room | 1 | $950.00 | $16.00 | Imaging Technician $26.00/h | 1 modality/technician station; max 1 room | Paid acquisition and optional marked procedures; local read separately attributed | 0.500 acquisitions/h x $120; 45 min acquisition; 120 min cadence | $60.00 | $0.00 | +$18.00 |
| CT Suite | 2 | $1600.00 | $26.00 | Imaging Technician $26.00/h | 1 modality/technician station; max 1 room | Paid CT/CTA acquisition; any paid local read booked to Reading | 0.250 acquisitions/h x $180; 60 min acquisition; 240 min cadence | $45.00 | $0.00 | -$7.00 |
| Phlebotomy Station | 2 | $550.00 | $9.00 | Phlebotomist $28.00/h | 1 collector/station; +1 workload; max 3 rooms but 2 collectors globally | Paid collection; enables sendout and lab work; diagnostic lab processing is not another fee | 0.650 collections/h x $50; 15 min work; nominal 60 min cadence, shared spacing binds | $32.50 | $0.00 | -$4.50 |
| Environmental-Services Closet | 2 | $475.00 | $6.00 | EVS Worker $24.00/h | 1 worker slot; max 10 closets, 2 workers globally | SUPPORT; cleaning preserves satisfaction and teaching/retail/service receipts | No direct fee; $0 | $0.00 | $0.00 | -$30.00 |
| Endoscopy Room | 2 | $1450.00 | $24.00 | Endoscopy Nurse $36.00/h + Endoscopist $60.00/h | 1 procedure station + nurse/provider slots; +1 workload; max 5 rooms, 2 nurses globally | Scheduled routine/advanced service fee; recovery is a required shared dependency | 0.575 completed episodes/h x $600; new 30/45/60 min prep/procedure/recovery | $345.00 | $0.00 | +$225.00 |
| Peri-op/Recovery Room | 2 | $900.00 | $16.00 | Peri-op Nurse $34.00/h | 8 bed stations; 2 nurse slots; +1 workload; max 3 rooms | SUPPORT; required for $345/h endoscopy and $90/h OR streams here; no separate recovery bill | No direct fee; 0.675 supported visits/h in the full clinic | $0.00 | $0.00 | -$50.00 |
| Training Room | 2 | $650.00 | $8.00 | None | 2 global training places; max 1 room | SUPPORT; enables staff skill investments and +1 passive routine slot | No direct fee; 60 min session before upgrades; course payment is an expense | $0.00 | $0.00 | -$8.00 |
| Coffee Kiosk | 2 | $500.00 | $5.00 | None | Self-service; max 10; shared finite shopping demand | Retail plus daily staff morale; no cashier hire needed | 2.000 paid purchases/h; gross/stock coffee $5/$1, drink $3/$1, snack $4/$2; founder consumes 0.2 coffees/h | $8.03 | $2.88 | +$0.15 |
| GLP-1 Telehealth Suite | 2 | $1200.00 | $12.00 | GLP-1 NP $40.00/h | 2 NP slots/suite; max 5 suites, 10 NPs globally | Automatic consultation receipt per operational NP | 1.000 consult/h x $50 per NP; 60 min payout interval | $50.00 | $0.00 | -$2.00 |
| Ambulatory OR | 3 | $2400.00 | $36.00 | OR Nurse $44.00/h + Surgeon $90.00/h | 1 OR/nurse station; +1 workload; max 2 ORs | Scheduled operation completion; requires recovery; paid surgeon protects founder availability | 0.100 ordinary operations/h x $900; new 30/120/60 min prep/operation/recovery; $1,300 extended work excluded | $90.00 | $0.00 | -$80.00 |
| In-house Laboratory | 3 | $1800.00 | $24.00 | Laboratory Technician $36.00/h | 1 technician/station; +1 workload; max 2 labs | Player-requested paid work queue; diagnostic processing enables results without a second processing fee | 0.500 paid jobs/h x $80; 60 min processing; no automatic paid-job arrival | $40.00 | $0.00 | -$20.00 |
| Pharmacy | 3 | $1200.00 | $16.00 | Pharmacist $42.00/h | 1 pharmacist slot; max 2 pharmacies | Authorized prescription/wound orders plus optional OTC sales; stock deducted | 0.500 Rx/h x $25 plus 0.500 OTC/h x $12; stocks $15/$6; 2 min sale | $18.50 | $10.50 | -$50.00 |
| Maintenance Workshop | 3 | $800.00 | $10.00 | Repair Person $30.00/h | 1 repair-person slot; max 1 workshop | SUPPORT; prevents OR/lab/pharmacy loss from maintenance outages | No direct fee; baseline repair 30 min | $0.00 | $0.00 | -$40.00 |
| Staff Break Room | 3 | $900.00 | $10.00 | None | 7 break seats; max 2 rooms | SUPPORT; morale recovery retains staff and service availability | No direct fee; baseline break 30 min, +5 morale | $0.00 | $0.00 | -$10.00 |
| Surgeon's Office | 3 | $700.00 | $8.00 | Hosts Surgeon $90/h, charged to OR | 2 surgeon slots; max 1 office | SUPPORT; hosts surgeon and quality review; salary charged to OR row | No direct fee; baseline QI review 30 min | $0.00 | $0.00 | -$8.00 |
| Vending Machine | 3 | $450.00 | $4.00 | None | Max 5; competes with kiosk for shopping demand | Self-service retail; GS-038 increases actual sale gross | 1.000 paid sale/h; drink gross/stock $3/$1, snack $4/$2; 1 min sale | $3.50 | $1.50 | -$2.00 |
| Radiology Reading Room | 3 | $1800.00 | $24.00 | Radiologist $26.00/h | 4 stations; max 4 rooms but 4 readers globally | Direct additive in-house and outside read income; protects center interpretation | 9.000 total reads/h per reader x $5; 5 min base; 12/h seated theoretical maximum | $45.00 | $0.00 | -$5.00 |

Room/staff capacity shown is installed software capacity, not clinical staffing guidance. Front Desk receptionist and EVS/repair staff are optional when the founder does their support work manually; the staffed snapshots include them to preserve player attention. At Level 0 the protected Front Desk has no hireable receptionist, so its actual upkeep-only cost is $6/hour; examination supports tutorial/recovery encounters rather than a guaranteed mature routine stream. Minor procedures and teaching use the unpaid founder. A founder can also substitute for the paid endoscopist/surgeon, but that consumes the founder's availability and is not the assumed ordinary play pattern. [S5, S10]

**Coverage exclusion:** Retired `room.imaging_control` is explicitly `buildable: false` and has no current upgrade purchases. MRI and the Level 4–5 room ladders are future metadata, not currently buildable room definitions; none is charged or credited here. The 24 rows above comprise 23 solid room types plus hallway tiles. [S1, S11]

### Shared service bundles and duplication limits

- **Endoscopy alone at Level 2:** $345/hour modeled gross minus $24 room + $36 nurse + $60 endoscopist + $16 recovery room + $34 peri-op nurse = **$175/hour net** for the complete pathway. An idle pathway still burns **$170/hour**. Its $600 scheduled fee needs only 0.283 successful visits/hour to cover the full base bundle; ordinary modeled completion is 0.575. Extra recovery furniture is not an extra fee.
- **OR with dedicated recovery:** $90/hour minus $36 OR + $44 nurse + $90 surgeon + $8 surgeon office + $50 recovery/nurse = **−$138/hour**. If recovery is already shared with endoscopy, allocate its $50 cost by completed visits: OR share `0.10 / (0.575 + 0.10) = 14.81%`, or $7.41/hour. The OR then loses **$95.41/hour** including office and its shared recovery share. This allocation is accounting, not another posting.
- **Two Reading readers:** $90/hour gross − $52 salaries − $24 shared upkeep = **+$14/hour**; one reader is −$5. The fully seated theoretical one-reader result is +$10/hour, but only at 12 completed reads/hour. Additional readers share upkeep and can serve outside work, up to four installed stations/global readers.
- **Two telehealth NPs:** $100 − $80 salaries − $12 upkeep = **+$8/hour**; one NP is −$2. This is a room occupancy incentive, but base single-NP functionality should not require training or hiring the second NP to stop losing money.
- Adding another X-ray/CT/ultrasound is prohibited by their one-instance caps. General collection demand is not scaled with phlebotomy copies. Endoscopy demand scales with `min(rooms, endoscopy nurses, installed endoscopists + founder)` once recovery/nurse availability exists; only two endoscopy nurses can be hired. OR demand additionally scales with the counts of recovery rooms, peri-op nurses and OR nurses. Building five endoscopy rooms or filling all eight recovery beds does not create five automatic teams. [S1, S5, S10]

## 3. Whole-clinic snapshots and idle-room cash risk

These are illustrative staffed clinics, not a claim that every room must be built. Level 3 deliberately represents a broad service clinic because the owner wants room functionality to cover its costs. All room tiers and training are at baseline. Hallways are 20 tiles at every level. Construction/hiring spending is sunk before the operating reserve is measured; door/layout spending, new purchases, training and upgrades are not mixed into hourly operating profit.

| Level | Rooms | Staff at current base rates | Cumulative room build cost | Cumulative hiring cost |
| --- | --- | --- | --- | --- |
| 1 | Front Desk; Examination Room; Bathroom; Waiting Room; Minor-Procedure Room; Ultrasound Room; 20 x Hallway | 1 x Receptionist @ $18.00/h; 1 x Imaging Technician @ $26.00/h | $3185.00 | $480.00 |
| 2 | Front Desk; Examination Room; Bathroom; Waiting Room; Minor-Procedure Room; Ultrasound Room; 20 x Hallway; X-ray Room; CT Suite; Phlebotomy Station; Environmental-Services Closet; Endoscopy Room; Peri-op/Recovery Room; Training Room; Coffee Kiosk; GLP-1 Telehealth Suite | 1 x Receptionist @ $18.00/h; 3 x Imaging Technician @ $26.00/h; 1 x Peri-op Nurse @ $34.00/h; 1 x Endoscopy Nurse @ $36.00/h; 1 x Endoscopist @ $60.00/h; 1 x Phlebotomist @ $28.00/h; 1 x EVS Worker @ $24.00/h; 1 x GLP-1 NP @ $40.00/h | $11260.00 | $4160.00 |
| 3 | Front Desk; Examination Room; Bathroom; Waiting Room; Minor-Procedure Room; Ultrasound Room; 20 x Hallway; X-ray Room; CT Suite; Phlebotomy Station; Environmental-Services Closet; Endoscopy Room; Peri-op/Recovery Room; Training Room; Coffee Kiosk; GLP-1 Telehealth Suite; Ambulatory OR; In-house Laboratory; Pharmacy; Maintenance Workshop; Staff Break Room; Surgeon's Office; Vending Machine; Radiology Reading Room | 1 x Receptionist @ $18.00/h; 3 x Imaging Technician @ $26.00/h; 1 x Peri-op Nurse @ $34.00/h; 1 x Endoscopy Nurse @ $36.00/h; 1 x Endoscopist @ $60.00/h; 1 x Phlebotomist @ $28.00/h; 1 x EVS Worker @ $24.00/h; 1 x GLP-1 NP @ $40.00/h; 1 x Laboratory Technician @ $36.00/h; 1 x Surgeon @ $90.00/h; 1 x OR Nurse @ $44.00/h; 1 x Pharmacist @ $42.00/h; 1 x Repair Person @ $30.00/h; 2 x Radiologist @ $26.00/h | $21310.00 | $8310.00 |

### Current income and costs

These hourly means come from **four measured ten-hour days**, after one warm-up day, averaged across 20 deterministic campaign seeds. Stock includes founder consumption. “Four-day change” charges every expense even where the $1,000 test reserve would have run out.

| Level | Demand | Gross/hour | Stock/hour | Room upkeep/hour | Salaries/hour | Total operating/hour | Net/hour | Four-day change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | baseline | $149.08 | $0.00 | $54.00 | $44.00 | $98.00 | +$51.08 | +$2043.25 |
| 1 | slow | $73.54 | $0.00 | $54.00 | $44.00 | $98.00 | -$24.46 | -$978.50 |
| 2 | baseline | $661.11 | $2.88 | $174.00 | $318.00 | $492.00 | +$166.23 | +$6649.25 |
| 2 | slow | $370.76 | $1.52 | $174.00 | $318.00 | $492.00 | -$122.76 | -$4910.50 |
| 3 | baseline | $903.11 | $14.88 | $306.00 | $612.00 | $918.00 | -$29.77 | -$1190.75 |
| 3 | slow | $536.76 | $7.53 | $306.00 | $612.00 | $918.00 | -$388.76 | -$15550.50 |

If paid lab requests, minor procedures and prescription orders stop while ordinary appointments continue, the current Level 3 net falls another **$134.08/hour** to about **−$163.85/hour**: $69.08 teaching + $20 procedures + $40 lab + $5 prescription contribution disappear. OTC and other ambient retail stay in that sensitivity. Merely owning a lab/pharmacy is not this missing revenue stream.

One imaging technician can cross-cover, and two rather than three would save $26/hour in this clinic if routes and demand allow it. The three scheduled modalities collectively use about **0.975 technician-hours/hour before travel and interruptions**, so one is a fragile staffing choice; two is a plausible alternative for manager playtesting. The per-room audit deliberately tests a dedicated technician rather than assigning fractions of one salary until a loss disappears. [S2, S5, S10]

### Mature-clinic idle-room runway

Hold all salaries/upkeep and other modeled streams constant, and start the outage with **$1,000 available**. Approximate runway is `reserve / negative hourly net`; divide by four for a $250 buffer. Quarter-hour postings and clustered receipts can hit zero sooner. “No steady drain” means positive average cash flow, not immunity to payment timing.

| Outage | Current net/h | $1,000 runway | A net/h | A runway | B net/h | B runway |
| --- | --- | --- | --- | --- | --- | --- |
| L1, ultrasound idle | -$8.92 | 112.12 h | +$16.08 | No steady drain | +$44.08 | No steady drain |
| L2, endoscopy idle | -$178.77 | 5.59 h | -$69.77 | 14.33 h | +$54.23 | No steady drain |
| L3, endoscopy idle | -$374.77 | 2.67 h | +$5.73 | No steady drain | +$146.73 | No steady drain |
| L3 slow, endoscopy idle | -$568.76 | 1.76 h | -$293.76 | 3.40 h | -$78.51 | 12.74 h |
| L3, OR idle | -$119.77 | 8.35 h | +$130.73 | No steady drain | +$361.73 | No steady drain |
| L3, every income stream idle | -$918.00 | 1.09 h | -$752.00 | 1.33 h | -$459.00 | 2.18 h |

At the current Level 3 endoscopy-idle rate, 2.67 game hours is about **2 minutes 40 seconds at 1×**, or **40 seconds at 4×**, while running unpaused. The complete idle endoscopy/recovery team alone consumes $170/hour, so its isolated $1,000 runway is 5.88 hours; the surrounding clinic makes the observed risk worse. Two idle endoscopy rooms/nurses/specialists plus one recovery room/nurse burn `2 × (24 + 36 + 60) + 16 + 34 = $290/hour`, before any other clinic cost. [S1, S3]

### Profit is not immediate liquidity

The headless run starts every funded clinic with no patients/jobs already in progress. The first endoscopy appointment is due after two hours and its new bed flow plus walks finishes around 4.45 hours; the first ordinary OR payment is much later. A profitable mature clinic can therefore miss an early posting.

| Level / demand | Current reserve needed | A reserve needed | B reserve needed |
| --- | --- | --- | --- |
| 1 / baseline | $171.50 | $127.75 | $78.75 |
| 1 / slow | $437.50 | $246.75 | $146.25 |
| 2 / baseline | $1328.00 | $950.00 | $448.25 |
| 2 / slow | $2747.00 | $1904.00 | $883.75 |
| 3 / baseline | $3532.00 | $1761.00 | $699.00 |
| 3 / slow | $5907.00 | $3907.00 | $1440.00 |

“Reserve needed” is the worst cumulative pre-income deficit among the 20 seeds during the initial ten hours, excluding build/hire spending. Current Level 3 requires $3,532 at baseline merely to bridge startup, and still has a negative mature margin. B's slow Level 3 requires $1,440: its positive $101.49/hour average does not prevent a $1,000 cold-start reserve from missing a posting. A practical suggested funded-clinic buffer under B is **$500/$1,000/$2,000** at Levels 1/2/3, allowing some variation beyond this model. This is not a proposed starting-cash grant.

## 4. Problems to address

1. **Base revenue does not cover dedicated staffing:** X-ray −$8.50/hour; CT −$7; full-clinic collection −$4.50; one telehealth NP −$2; paid lab at half a job/hour −$20; OR −$80 before office/recovery; pharmacy −$50 after stock; vending −$2; one baseline Reading reader −$5. The kiosk's +$0.15 is almost no buffer. The lab, pharmacy, Reading and telehealth losses should not require higher accuracy in teaching encounters to be repaired.
2. **OR and pharmacy are structurally sparse/high-cost.** The OR earns $900 every ten hours against a $170/hour dedicated team, before support. The pharmacy's $10 prescription contribution needs **5.8 prescriptions/hour** just to cover $58/hour if nothing else sells, while the baseline assumed rate is 0.5. A $25 gross sale is not $25 available for salary. Even zero room upkeep alone cannot make these salaries viable at that demand.
3. **Support payroll matters more than room upkeep.** Current full-clinic support upkeep is $75/hour; receptionist + EVS + repair salaries add $72; shared recovery nurse adds $34. The $181 total is reasonable only if supported service income is sufficiently reliable. Training, a break room and an office must not acquire fictitious fees to make their individual rows positive.
4. **Idle-room cost continues unchanged.** A technical failure, unavailable nurse, absent provider, inaccessible route, maintenance outage, disabled appointments or queued discussion/training can remove income while all room/staff expenses continue. Endoscopy is the clinic's largest single ordinary payer; losing it exposes losses from unrelated staffed rooms. The fixed bugs explain an outage mechanism, but do not fix these other margins.
5. **Duplicate rooms are not independent demand generators.** Shared arrivals, global hiring caps, recovery gates, founder availability and finite shopping budgets prevent multiplying every catalog fee by every physical station's theoretical capacity. A spare clinic/support room may have a useful role and still need an explicit operating-budget choice.
6. **Some GS-038 purchases reduce cash margin at ordinary demand.** Current first minor upgrade adds $1.20/hour income but $2 upkeep; X-ray adds $1.89 but $2; CT adds $2.70 but $3; vending adds $0.21 but $1. Experience/support upgrades add upkeep without a direct receipt. At current prices, fully upgrading the Level 1 clinic reduces modeled net from $51.08 to $42.28/hour before any indirect experience gains.
7. **The existing emergency payout is too small for mature fixed costs and is blocked by operational automation.** It pays $50 on a 60-minute cooldown; `getEmergencyGlp1Status` blocks the manual consultation whenever a staffed telehealth slot is operational, irrespective of cash distress. Current Level 3 all-idle costs $918/hour. A $50/hour rescue is not a sufficient endoscopy-outage recovery mechanism. [S1, S4]

## 5. Exact proposals

Both options preserve construction costs, hiring costs, unlock levels, physical capacities, clinical selection/settlement rewards, service durations/cadences, stock prices, training prices, GS-038 purchase prices and all upgrade effects. They change the **operating scale** only. Existing frozen work/fee quotes must retain their accepted values in any later implementation. No clinical teaching claim, service gameplay or procedure timing changes are proposed.

### A — targeted tuning, existing salary contracts

Reduce support/fixed room upkeep, adjust seven service fees, and remove or lower upgrade upkeep where it overwhelms the accepted benefit. Salaries and their bounds stay exactly current. This is “light-touch” in implementation scope, **not** in the size of every fee adjustment: the ordinary OR fee rises from $900 to $2,200 and prescription fees rise substantially because present demand cannot support their current wages. A fixes every modeled baseline revenue-room deficit, but Level 2/3 slow periods still need reserves or a separate optional safety net.

### B — stronger reduction in fixed operating obligations

Lower room upkeep and default salary scale, with only three fee changes. This retains profitable gameplay while reducing dependence on perfect demand or doing teaching encounters primarily to pay support payroll. Both staffed broad-clinic baseline and slow-period means are positive. Ordinary single-endoscopy outages also have positive mature cash flow, although a slow-period endoscopy outage still loses $78.51/hour.

**Exact base and upgrade upkeep, dollars per game hour:** `Δ/tier` is charged per purchased room level above Level 1. The last two columns are per-room **net at the same baseline demand**, including that room's listed staff and stock, with one reader; recovery/office remain separate support rows.

| Room | Current base/h | Current increment/tier/h | A base/h | A increment/tier/h | B base/h | B increment/tier/h | A net/h | B net/h |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Front Desk | $6.00 | $0.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$20.00 | -$11.00 |
| Hallway | $0.00 | $0.00 | $0.00 | $0.00 | $0.00 | $0.00 | +$0.00 | +$0.00 |
| Examination Room | $6.00 | $1.00 | $4.00 | $0.00 | $2.00 | $0.00 | +$65.08 | +$67.08 |
| Bathroom | $4.00 | $1.00 | $1.00 | $0.00 | $1.00 | $0.00 | -$1.00 | -$1.00 |
| Waiting Room | $7.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$2.00 | -$1.00 |
| X-ray Room | $14.00 | $2.00 | $6.00 | $2.00 | $4.00 | $1.00 | +$10.00 | +$9.50 |
| Minor-Procedure Room | $15.00 | $2.00 | $8.00 | $1.00 | $4.00 | $1.00 | +$12.00 | +$16.00 |
| Ultrasound Room | $16.00 | $2.00 | $12.00 | $2.00 | $8.00 | $1.00 | +$22.00 | +$34.00 |
| CT Suite | $26.00 | $3.00 | $12.00 | $2.00 | $8.00 | $1.00 | +$12.00 | +$19.00 |
| Phlebotomy Station | $9.00 | $1.00 | $5.00 | $1.00 | $2.00 | $1.00 | +$6.00 | +$12.50 |
| Environmental-Services Closet | $6.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$26.00 | -$13.00 |
| Endoscopy Room | $24.00 | $3.00 | $20.00 | $3.00 | $12.00 | $2.00 | +$229.00 | +$269.00 |
| Peri-op/Recovery Room | $16.00 | $2.00 | $6.00 | $0.00 | $3.00 | $0.00 | -$40.00 | -$23.00 |
| Training Room | $8.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$2.00 | -$1.00 |
| Coffee Kiosk | $5.00 | $1.00 | $1.00 | $0.00 | $1.00 | $0.00 | +$4.15 | +$4.15 |
| GLP-1 Telehealth Suite | $12.00 | $2.00 | $4.00 | $2.00 | $2.00 | $1.00 | +$6.00 | +$18.00 |
| Ambulatory OR | $36.00 | $4.00 | $18.00 | $4.00 | $12.00 | $2.00 | +$68.00 | +$42.00 |
| In-house Laboratory | $24.00 | $3.00 | $10.00 | $2.00 | $4.00 | $1.00 | +$9.00 | +$16.00 |
| Pharmacy | $16.00 | $2.00 | $6.00 | $2.00 | $2.00 | $1.00 | +$7.50 | +$4.50 |
| Maintenance Workshop | $10.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$32.00 | -$17.00 |
| Staff Break Room | $10.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$2.00 | -$1.00 |
| Surgeon's Office | $8.00 | $1.00 | $2.00 | $0.00 | $1.00 | $0.00 | -$2.00 | -$1.00 |
| Vending Machine | $4.00 | $1.00 | $1.00 | $0.00 | $1.00 | $0.00 | +$1.00 | +$1.00 |
| Radiology Reading Room | $24.00 | $0.00 | $12.00 | $0.00 | $6.00 | $0.00 | +$7.00 | +$21.00 |

Recovery is explicitly support-only: A costs $6 + $34 nurse = $40/hour; B costs $3 + $20 nurse = $23. At Level 2, complete endoscopy bundles net **$189/hour in A** and **$246/hour in B**. In Level 3, the OR also covers its office and its proportional shared recovery share: **+$60.07/hour A** and **+$37.59/hour B**, after those allocations. With a fully dedicated recovery room/nurse rather than shared recovery, ordinary OR receipts still cover the entire pathway: **$220 receipts − $194 costs = +$26/hour A**, and **$130 − $112 = +$18/hour B**. Both exceed a 10% margin on all those fixed costs; the headless checks enforce this case. Support-room rent alone falls from $75 to **$21 A / $11 B**; staffed support including receptionist, EVS, repair and recovery nurse falls from $181 to **$127 A / $69 B**. These support costs are paid once in the whole-clinic snapshots.

**Exact fee changes, dollars per completed service; unlisted fees remain current:**

| Income line | Current | A | B |
| --- | --- | --- | --- |
| income.xray | $90.00 | $120.00 | $90.00 |
| income.ct | $180.00 | $200.00 | $180.00 |
| income.collection | $50.00 | $60.00 | $50.00 |
| income.laboratory_processing | $80.00 | $110.00 | $80.00 |
| income.ambulatory_operation | $900.00 | $2200.00 | $1300.00 |
| income.ambulatory_operation_extended | $1300.00 | $3200.00 | $1900.00 |
| income.pharmacy_pickup | $25.00 | $120.00 | $70.00 |

Scheduled endoscopy stays $600 and the encounter base stays $450. Telehealth automation and its catalog base both stay $50, so GS-037's current +$5 per training step and its labels remain consistent. Outside/in-house read fees both stay $5. Retail discretionary products and budgets stay unchanged. The prescription price is applied to authorized purchases, whose ledger exemption avoids treating the new price as ordinary discretionary shopping. [S2, S6]

**Exact salary proposals, dollars/hour:** A has no salary changes. B minimum/maximum values shift by the same amount as each role's base, retaining the current $2 adjustment steps, five morale points per step and the same permitted premium/discount offsets.

| Role | Current / A hourly base | Current / A bounds | B hourly base | B bounds | Training prices for Levels 2 / 3 / 4 / 5, unchanged |
| --- | --- | --- | --- | --- | --- |
| Receptionist | $18.00 | $14.00-$30.00 | $10.00 | $6.00-$22.00 | $75.00 / $150.00 / $225.00 / $300.00 |
| Imaging Technician | $26.00 | $20.00-$42.00 | $18.00 | $12.00-$34.00 | $75.00 / $150.00 / $225.00 / $300.00 |
| Peri-op Nurse | $34.00 | $28.00-$54.00 | $20.00 | $14.00-$40.00 | $125.00 / $250.00 / $375.00 / $500.00 |
| Endoscopy Nurse | $36.00 | $28.00-$58.00 | $24.00 | $16.00-$46.00 | $125.00 / $250.00 / $375.00 / $500.00 |
| Endoscopist | $60.00 | $48.00-$96.00 | $40.00 | $28.00-$76.00 | $225.00 / $450.00 / $675.00 / $900.00 |
| Phlebotomist | $28.00 | $22.00-$44.00 | $18.00 | $12.00-$34.00 | $100.00 / $200.00 / $300.00 / $400.00 |
| EVS Worker | $24.00 | $20.00-$38.00 | $12.00 | $8.00-$26.00 | $75.00 / $150.00 / $225.00 / $300.00 |
| GLP-1 NP | $40.00 | $32.00-$64.00 | $30.00 | $22.00-$54.00 | $150.00 / $300.00 / $450.00 / $600.00 |
| Laboratory Technician | $36.00 | $28.00-$58.00 | $20.00 | $12.00-$42.00 | $125.00 / $250.00 / $375.00 / $500.00 |
| Surgeon | $90.00 | $72.00-$144.00 | $50.00 | $32.00-$104.00 | $350.00 / $700.00 / $1050.00 / $1400.00 |
| OR Nurse | $44.00 | $34.00-$70.00 | $26.00 | $16.00-$52.00 | $175.00 / $350.00 / $525.00 / $700.00 |
| Pharmacist | $42.00 | $34.00-$68.00 | $24.00 | $16.00-$50.00 | $150.00 / $300.00 / $450.00 / $600.00 |
| Repair Person | $30.00 | $24.00-$48.00 | $16.00 | $10.00-$34.00 | $100.00 / $200.00 / $300.00 / $400.00 |
| Radiologist | $26.00 | $20.00-$42.00 | $18.00 | $12.00-$34.00 | $75.00 / $150.00 / $225.00 / $300.00 |

B's snapshots assume those base contracts are actually paid. **Changing defaults alone will not reduce existing saved employee salaries.** A later owner-approved rebasing could set `new salary = new base + (saved salary − old base)`, shift bounds by the same amount, preserve employee identities, training, morale premium and home assignments, and charge no repeat hiring/training. Save salary premiums remain within the corresponding shifted bounds. The manager must decide and document this compatibility policy before implementation; do not silently rewrite the owner's negotiated pay. A avoids that migration issue.

### Resulting whole-clinic income and costs

Same rooms, headcount, demand and receipt assumptions as the current snapshots; no optional safety-net receipts are included.

Option A:

| Level | Demand | Gross/hour | Stock/hour | Room upkeep/hour | Salaries/hour | Total operating/hour | Net/hour | Four-day change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | baseline | $149.08 | $0.00 | $29.00 | $44.00 | $73.00 | +$76.08 | +$3043.25 |
| 1 | slow | $73.54 | $0.00 | $29.00 | $44.00 | $73.00 | +$0.54 | +$21.50 |
| 2 | baseline | $683.11 | $2.88 | $87.00 | $318.00 | $405.00 | +$275.23 | +$11009.25 |
| 2 | slow | $383.51 | $1.52 | $87.00 | $318.00 | $405.00 | -$23.01 | -$920.50 |
| 3 | baseline | $1117.61 | $14.88 | $140.00 | $612.00 | $752.00 | +$350.73 | +$14029.25 |
| 3 | slow | $645.76 | $7.53 | $140.00 | $612.00 | $752.00 | -$113.76 | -$4550.50 |

Option B:

| Level | Demand | Gross/hour | Stock/hour | Room upkeep/hour | Salaries/hour | Total operating/hour | Net/hour | Four-day change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | baseline | $149.08 | $0.00 | $17.00 | $28.00 | $45.00 | +$104.08 | +$4163.25 |
| 1 | slow | $73.54 | $0.00 | $17.00 | $28.00 | $45.00 | +$28.54 | +$1141.50 |
| 2 | baseline | $661.11 | $2.88 | $51.00 | $208.00 | $259.00 | +$399.23 | +$15969.25 |
| 2 | slow | $370.76 | $1.52 | $51.00 | $208.00 | $259.00 | +$110.24 | +$4409.50 |
| 3 | baseline | $965.61 | $14.88 | $79.00 | $380.00 | $459.00 | +$491.73 | +$19669.25 |
| 3 | slow | $568.01 | $7.53 | $79.00 | $380.00 | $459.00 | +$101.49 | +$4059.50 |

A's near-zero Level 1 slow margin is not robust: the 20-seed range is **−$0.38 to +$3.00/hour**. B's Level 3 slow range is **+$100.58 to +$103.95/hour**. These narrow ranges reflect arrival/answer phase variation only; they do not quantify clinical-case mix, long paths, player attention, low accuracy, real staff absence, or bug risk.

Construction and hiring remain substantial decisions: $3,665 / $15,420 / $29,620 cumulatively for these funded clinic layouts before reserves, doors, upgrades or training. A's large fee changes buy profitability while preserving wage scale; B halves Level 3's hourly obligations from $918 to $459 and keeps the price changes smaller. Optional extra staff, unused copies, higher salaries and outages can still create losses. Teaching accuracy and encounter completion remain rewarded without making them the only dependable source of operating cash.

## 6. GS-037/GS-038 value and optional safety nets

### Retain the current approved benefits

GS-038 has 22 current purchase ladders, four purchases from room Level 1 to 5. Revenue rooms receive **+6/12/18/24%** against their accepted base fee: minor procedures, ultrasound, X-ray, CT, collection, endoscopy, telehealth, OR, paid lab, pharmacy and vending. Cleaning/training/repair/QI/Reading work takes **10/20/30/40% less time**; bathroom upgrades slow cleanliness loss by that amount. Waiting/examination/recovery add **2/4/6/8 satisfaction points** at their actual use; kiosk daily morale adds 1/2/3/4 and break-room morale adds 2/4/6/8. Front Desk/Hallway have no purchases. Effects belong to the used room and freeze on accepted work; unused copies do not stack. [S11, S12]

Training has two global places, a base 60-minute session, four role-priced purchases and no permanent extra salary requirement. Its current room-upgrade effect shortens sessions; its base passive contribution is +1 routine slot. GS-037 generally supplies 10%/step relevant work/payment/restoration benefits; pharmacy supply-cost training is 5%/step. Time modifiers combine multiplicatively with room modifiers. Training-room fees are **expenses**, not room income. [S1, S9, S13]

The proposals keep upgrade prices and these benefits, remove ongoing uplift for nonbillable support effects, and make every modeled first revenue upgrade's incremental operating margin nonnegative. A/B first-purchase incremental net examples:

| Room | A extra net/hour | B extra net/hour | First purchase cost retained |
|---|---:|---:|---:|
| Minor procedures | $0.20 | $0.20 | $220 |
| Ultrasound | $1.60 | $2.60 | $240 |
| X-ray | $0.52 | $0.89 | $190 |
| CT | $1.00 | $1.70 | $400 |
| Collection | $1.34 | $0.95 | $140 |
| Endoscopy | $17.70 | $18.70 | $365 |
| Telehealth, one NP | $1.00 | $2.00 | $300 |
| OR | $9.20 | $5.80 | $600 |
| Paid lab | $1.30 | $1.40 | $450 |
| Pharmacy | $1.96 | $1.46 | $300 |
| Vending | $0.21 | $0.21 | $115 |
| Reading, one reader | $5.00 at the 45-minute budget | $5.00 | $450 |

Low-volume upgrades still have long financial payback: for example $220 / $0.20 = 1,100 game hours for A/B's first minor-procedure purchase at this case mix. This audit preserves the recently approved price ladders; a separate upgrade-price review could target a desired payback horizon. Positive incremental cash does not mean every upgrade is an attractive short-term financial investment. Support upgrades retain their experience/time benefits and capital choice without an extra hourly rent penalty.

Availability is another reason to prefer B for the stated owner goal. The telehealth row assumes a mature operational slot earns every hourly payout. If breaks/discussions/walking/reset intervals reduce completed payouts to 85% of that rate, a single NP/suite nets **-$9.50 current / -$1.50 A / +$10.50 B per hour**. That sensitivity is not added to the snapshot matrix. The lightweight option's positive uninterrupted margin does not guarantee coverage through ordinary staff interruptions. With no player-requested lab jobs or no authorized prescription orders, neither option can make those empty paid streams cover dedicated staff; the manager should distinguish baseline manual engagement from passive earnings in any UI forecast.

Fully upgrading every eligible room to Level 5, without training employees, produces the following modeled net/hour; cash purchase costs are excluded, and indirect morale/satisfaction effects are not monetized:

| Clinic | Current all-room Level 5 net/h | A all-room Level 5 net/h | B all-room Level 5 net/h |
| --- | --- | --- | --- |
| 1 | +$42.28 | +$83.28 | +$115.28 |
| 2 | +$214.39 | +$368.67 | +$507.39 |
| 3 | +$62.87 | +$554.85 | +$695.37 |

### Optional safeguards, not included in either proposal's results

1. **Reserve/runway display before expansion:** show the new all-in hourly burn and projected reserve after room, hiring and upgrade spending. Keep this advisory; do not block an owner choice. B's suggested funded-clinic reserves are $500/$1,000/$2,000. An automated earnings forecast should label manual lab/prescription assumptions explicitly.
2. **Idle-room rent relief:** after 60 minutes of technical/nonoperational outage, charge 20% base upkeep until service returns; apply to affected revenue rooms and frozen-save-safe clocks. This is a modest buffer, not a complete fix: current endoscopy rent relief saves only **$19.20/hour**, against a $374.77/hour broad-clinic outage deficit; unchanged salary obligations dominate. Do not treat ordinary temporary recovery/queue work as an outage or charge retrospective fees.
3. **Emergency scaling:** while cash is below two hours of operating costs, optionally allow the emergency consultation even with operational automation, retaining the 60-minute cooldown. One concrete editorial payout is `min(500, max(50, 5 × ceil(hourly operating costs / 10)))`, i.e. half an hour's costs rounded up to $5. That yields $50/$250/$460 for the current snapshots and $50/$130/$230 for B. Keep automation income separate. This can bridge a technical outage without making the automatic room an emergency-button lockout; it still does not fully fund an indefinitely idle clinic. Manager/owner direction is needed before adding this behavior.
4. **Earlier underfunding visibility:** warn when the next 15-minute posting is unfunded and identify the largest currently idle staffed service. Allow pausing while diagnosing. This protects player attention without creating a new clinical or paid-service pathway.

## 7. Validation, reproducibility and limits

Run from the repository root with the existing **Node v24.19.0** environment:

```powershell
node --disable-warning=ExperimentalWarning tools/economy-audit/run.mjs --write
node --check tools/economy-audit/run.mjs
```

Both completed with exit code 0. The numerical run reports:

```text
PASS: 8 numerical/source invariants; 20 seeds x 40 measured hours + 10 warmup hours per scenario.
```

An independent artifact check also compared all 24 current-room rows, 24 proposal rows and 18 clinic snapshot rows to the JSON result, resolved 19 local source/result links, and verified UTF-8 without BOM for the report, script, README and JSON. All passed. The 16 production source hashes still matched the final validated input after report construction.

The script evaluates source balance/catalog/navigation/training/upgrade tables using Node's built-in type stripping. It loads the actual pure routine-arrival, capacity-scaled cadence, new peri-op phase and operating-expense-selector functions. It runs **45 scenario groups × 20 seeds = 900 simulations**, each five ten-hour days, including 18 baseline/slow clinic cases, 18 idle cases and nine fully upgraded cases. It checks all 24 buildable room types, salary bounds/preserved premium offsets, once-only receipts, cent-conserving postings, positive baseline net for each proposed revenue room, nonnegative incremental revenue-upgrade margin, and OR coverage including either allocated shared support or a fully dedicated recovery team with at least a 10% margin. Sixteen production-source SHA-256 hashes must match before/after the run. Results, assumptions, room/source tables and hashes are in [the JSON artifact](../../tools/economy-audit/results-20261008.json).

This is a **headless numerical scenario simulation**, not a replay of the complete domain reducer, a browser test, clinical validation or an owner-save audit. It models finite appointment admission and shared resources, nurse checks/beds, short fixed walks, delayed service receipts and real expense posting order. It uses fixed-roster liabilities after a cash shortfall. It assumes achievable retail/explicit-work volumes, instant accounting for low-volume retail, 45 available reading minutes/hour, and prompt founder decisions. It does not execute spatial pathfinding, the actual clinical case/FSRS distribution, shopping actor ledgers, repair scheduling, individual break/discussion/training departures, provider interruptions, staff quitting or post-insolvency fulfillment failures. Those can lower achievable receipts. The four-day means are rounded; unrounded values and 20-seed ranges remain in JSON.

Useful manager acceptance after choosing an option: inspect the real implementation diff, rerun its normal balance/domain checks, and playtest a funded Level 1–3 clinic with short and long paths, one/two telehealth NPs/readers, shared imaging staff, optional support staff, lab queue ignored/used, a disabled endoscopy room, and the owner's existing salary/upgrade contracts. Compare actual gross, stock, operating postings and cash runway to these explicit assumptions. This worker ran no game/browser acceptance and changed no game balance.

### Local code sources

- **S1:** [prototype-balance.ts](../../packages/balance-config/src/prototype-balance.ts), room definitions approximately lines 45–606; staff 609–852; workload/clock 905–917; arrivals/economy/advertising 1015–1053; automation/training/support 1000–1013; settlement 1094 onward.
- **S2:** [service-income-catalog.ts](../../packages/balance-config/src/service-income-catalog.ts), `RADIOLOGIST_READ_INCOME`, `SERVICE_INCOME_CATALOG`, scheduled/explicit/work-queue contracts, fees, stock costs and durations.
- **S3:** [reducer.ts](../../packages/game-domain/src/reducer.ts), `settleEncounter` (~2654), `getNextRoutineArrivalTick` (~6023), `maybeAdmitAutomaticPatient`, `applyOperatingExpenses` (~6186), `advanceGlp1Automation` (~6895), emergency command (~10195).
- **S4:** [selectors.ts](../../packages/game-domain/src/selectors.ts), `getEmergencyGlp1Status` (~119), `getOperationalGlp1AutomationAssignments` (~166), `getWorkloadSnapshot` (~1215), `getOperatingExpensePerFacilityHour` (~2056).
- **S5:** [service-operations.ts](../../packages/game-domain/src/service-operations.ts), `getNewPeriopServiceOperationPhases` (~92); 30-minute global spacing; functional capacity helpers (~409/446); `getCapacityScaledArrivalCadenceMinutes` (~548); `canAdmitScheduledVisitor` (~567); `credit` (~1798); `createOperation` (~2101); `startServiceOperation` (~2123); `scheduleArrivals` (~2294).
- **S6:** [retail-operations.ts](../../packages/game-domain/src/retail-operations.ts), actor cooldowns/budgets (~37/225), authorized-order rules, `fulfill` (~426), external opportunities (~492), `scheduleOptionalShopping` (~507).
- **S7:** [radiologist-read-income.ts](../../packages/game-domain/src/radiologist-read-income.ts), additive read receipts, station availability, priority/cancellation and continuous outside-read work.
- **S8:** [periop-nurse-attention.ts](../../packages/balance-config/src/periop-nurse-attention.ts), current two 15-minute software attention timers; [approved-room-layouts.ts](../../packages/balance-config/src/approved-room-layouts.ts), actual recovery care stations/waiting anchors.
- **S9:** [employee-training-effects.ts](../../packages/game-domain/src/employee-training-effects.ts), category averages, money/timing multipliers; [level-three-support.ts](../../packages/game-domain/src/level-three-support.ts), breaks, seven seats, maintenance and QI; [employee-training.ts](../../packages/game-domain/src/employee-training.ts), actual global places and training work.
- **S10:** [room-capacity.ts](../../packages/game-domain/src/room-capacity.ts), `STAFF_SLOTS`; [diagnostic-timing.ts](../../packages/balance-config/src/diagnostic-timing.ts), Reading workstations.
- **S11:** [room-upgrades.ts](../../packages/balance-config/src/room-upgrades.ts), current/future/retired ladders and exact effects/prices.
- **S12:** [domain room-upgrades.ts](../../packages/game-domain/src/room-upgrades.ts), accepted actual-room revenue quotes; [GS-038 ExecPlan](../execplans/gs038-all-room-upgrades.md), accepted scope and frozen-work/read-clock rules.
- **S13:** [employee-training.ts](../../packages/balance-config/src/employee-training.ts), role training prices/effects, two places and 60-minute base session.

No Git, dependency installation, agents, external messaging, proprietary-source access, clinical authoring, commits, pushes or deployment occurred. This research checkpoint is local only; the manager retains review, owner option selection, integration and any later scoped **“push to GitHub”** backup reminder. Owner pathway remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent browser profile; existing saves and origins were not accessed or changed.

## Owner decisions (2026-10-08, recorded by the manager)
1. Adopt option B.
2. Rebase existing saved employees: new salary = new base + (saved salary - old base); bounds shift by the same amount; no repeat hiring/training charges.
3. Safety nets: no larger emergency consult after NPs are hired (fix cash risk another way). Adopt idle-room upkeep relief (20% upkeep after 60 minutes of technical/nonoperational outage). Spending warning deferred: the owner reports that the displayed hourly figure (HUD next to money and Management finances) seems to count costs but not average income, so it shows large negative per-hour values while cash does not fall that fast. Fix that calculation and display first; revisit the warning afterwards.
