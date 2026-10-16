> OWNER APPROVED IMPLEMENTATION 2026-09-17: "Bladder scans could happen in the US room." "GLP-1 telehealth is $50, otherwise I reviewed the rest of the full catalog and it looks good. We can implement this". Owner excludes cafeteria and requests hiding the upper-left GLP-1 consult box once the room and GLP-1 NP are operational; each completed automated consult shows +$50 above that NP. This approval supersedes all proposal-only/pending-agreement wording below. Implement the main full catalog and its reviewed operational rules, current-level mechanics plus tested future-level capability handlers; do not unlock entire unimplemented levels or invent clinical approvals. Additional specialty facilities listed as brainstorming remain outside the main catalog. No redundant numeric approval is required; use the catalog values except GLP-1=$50 and bladder scan uses Ultrasound Room. Founder self-consumption is non-revenue unless personal funds exist; no new personal-wallet scope. Cafeteria/meal rows are excluded. Global timing redesign remains outside scope; preserve current clinical route timing, apply catalog defaults to new operational workflows.

## Active execution milestones
1. Catalog + durable accounting + GLP1/bladder integration (Terra): baseline snapshots, typed catalog covering approved current/future lines, receipts/idempotency/migration, paid current clinical completion/GLP1, focused tests.
2. Scheduling/resource/visitor flows (Terra or Sol): actual current-level service arrivals, explicit future handlers, real shared resource guards, no education/FSRS mutation, persistence and tests.
3. Retail and customer activities (Terra): existing patient/staff/founder identities, outside shoppers/companions, budgets/costs/priority, routing and tests.
4. UI/renderer (Terra): service status/controls, actors, actual receipt popups, GLP1 card removal when staffed; preserve existing art/motion.
5. Integrated parent review, meaningful regression tests and isolated browser checks; handoff/feedback documentation; owner playtest. No owner server/save intervention or deployment. Backup after completion acceptance under standing instruction.

Active owner: Astra planning/review/integration. Sol completed catalog/accounting, service operations and retail; Terra implemented player presentation, with Sol handling final integration and browser escalation. Current full domain/player/clinical/balance suites pass; final browser evidence is recorded in the active plan and GS-021 handoff. Earlier pilot limitations and proposal-only wording below are historical.
# GS-021 expanded service and customer catalog

Status: owner-approved catalog in implementation, 2026-09-17. Approval and corrections above supersede proposal language retained below. Supersedes the small ultrasound/blood-draw pilot. Parent plan: clinic-income-service-visitors.md.

## Owner direction and intended delivery
The owner wants to identify all service-only/payment-only visitors and characters now, including later surgery-center levels, and implement the agreed system together. Purchases must be available to existing employees and waiting patients, not only outside visitors. The earlier decision to defer retail and the wider catalog is withdrawn. Scope expansion is authorized; exact catalog, clinical mappings and numeric choices remain proposals.

Implement one shared customer/activity/transaction system, not a new bespoke visitor type per product. Existing characters can acquire a purchase activity without being replaced or becoming a second patient. A visit may contain several distinct fulfilled services and purchases, each credited exactly once. Future-level service definitions should have working, tested handlers and capability gates; a dormant label without an operational handler does not count as implementation. Levels3–5 progression itself is currently absent and remains a separate product expansion unless expressly added. Future service behavior can be implemented and validated in isolated future-capability fixtures without unlocking those levels in owner saves.

## Evidence and status vocabulary
- CURRENT INFRASTRUCTURE: a room or clinical route already exists, but that does not mean an independent paid visitor exists.
- ROADMAP: an accepted later facility exists in design documents, but has no current runtime room/staff implementation.
- NEW CANDIDATE: proposed product/clinical service requiring an explicit catalog/capability decision; never inferred from a name alone.
- CURRENT INCOME: GLP-1 manual/automated consults already pay $25; preserve their existing receipt and timing rather than introducing duplicate payments.

Terra income_investigation read current balance rooms/staff/services, reducer settlement/expense/telehealth/coffee behavior, ambient pedestrians, persistence and later facility roadmap. Astra reviewed the key balance/accounting paths, roadmap boundaries and current endoscopy/X-ray routes. No runtime tests or game/save access were performed during planning.

Sources: packages/balance-config/src/prototype-balance.ts (levels/rooms/staff, service catalog at1021 onward); packages/game-domain/src/reducer.ts (clinical settlement around2018, hourly expenses3380, telehealth3931 and coffee3964); docs/features/facility-levels-and-clinical-release-points.md; GS-020 and GS-017 handoffs. GS-020 overrides stale roadmap X-ray/control-room rules. Current maximumPlayableLevel is2; Levels3–5 are not playable.

## Who can receive a service or buy something

| Character/customer class | Why they exist | Permitted activities |
| --- | --- | --- |
| Educational patient | Existing clinical encounter | Ordered eligible service fees; optional shopping while idle and permitted; return to their existing chart/route |
| Scheduled diagnostic patient | Pre-arranged service only | Imaging, collection, other approved tests; optional retail before/after if permitted |
| Scheduled procedure patient | Pre-arranged clinically authorized procedure | Approved minor procedures, endoscopy and later ASC operations; shopping only when explicitly permitted |
| Follow-up/support patient | Existing care plan or authorized appointment | Wound/dressing/suture/drain/ostomy/follow-up services whose distinct billing eligibility is explicitly mapped |
| Pharmacy customer | Valid prescription/order | Pickup/refill and approved supplies; may be existing patient or a new visitor |
| Retail-only street visitor | Low-rate local customer | Coffee, vending, gift shop and any agreed future food/supply product |
| Companion/family/escort | Accompanies another patient | Wait, support departure, buy refreshments/gifts; never consumes clinical appointment capacity |
| Employee | Existing staff identity | Purchases during free time/breaks only, respecting work and reservations |
| Founder | Existing founder identity | Same optional retail activities when free; preserve explicit player orders and single-task occupancy |
| Remote customer / specimen / read work item | Telehealth or completed upstream service | Remote consult, laboratory processing, radiology interpretation; does not manufacture an on-map patient |
| Courier, supplier, repair worker, inspector | Operational supporting actor if later implemented | Delivery/maintenance/inspection; no invented service revenue merely for entering the building |

Age/permission/product restrictions belong to the eligibility layer; do not assume every actor can consume every product. These are simulation roles, not demographic diagnosis generators.

## Complete service-line proposal for the planned surgery center
Prices below are proposed game receipts, not real clinical billing. Current-timing reuse means frozen educational workflows remain unchanged. Future procedures and subtype eligibility remain behind clinical review and actual equipment/provider capability; no room name automatically authorizes a clinical action.

### Diagnostics and clinical work

| Line / candidate subtypes | Availability and resources | Customer/payment model | Working fee proposal |
| --- | --- | --- | ---: |
| Ultrasound | Current L1 room, machine, shared Imaging Tech | Scheduled visitor or eligible existing patient; acquisition completion | $120 |
| X-ray | Current optional L2 room + Imaging Tech | Scheduled visitor or eligible existing patient; current local service completion | $90 |
| CT | Current L2 suite + Imaging Tech | Scheduled visitor or eligible existing patient; acquisition completion | $180 |
| Blood/specimen collection | Current L2 Phlebotomy Station + Phlebotomist; other specimen collection requires explicit mapping | Scheduled or walk-in collection customer; collection completion | $50 per collection episode, not per tube/analyte |
| Bladder scan | Current examination-capability route | Add-on to an already authorized encounter; no standalone street demand proposed | $20 |
| Minor procedures | Current L1 room; new procedure/provider/transaction mappings needed | Appointments and actual eligible educational procedures; founder or specifically authorized later provider | $100 simple / $150 tissue-sampling / $200 complex office-service bands, exact subtype mapping pending review |
| Routine endoscopy | Current L2 Endoscopy + Peri-op/Recovery, Endoscopy Nurse, Peri-op Nurse, Founder or Endoscopist | Scheduled appointment or eligible educational episode; pay after completed procedure and recovery | $400 per completed episode |
| Advanced endoscopy | Existing EUS/ERCP-sampling route; exact procedure/equipment eligibility must be reviewed | Same full staffing and explicit additional capability gates where needed; no automatic promotion of every named EUS/ERCP procedure | $550 per completed episode |
| GLP-1 telehealth | Current manual founder route / L2 suite + NP automation | Existing remote service; show its real receipt, no duplicate visitor or new consult fee | Keep current $25 pending separate requested rebalance |
| Onsite laboratory processing | Roadmap L3 Lab + Lab Tech; approved assay capabilities required | Existing collected samples or authorized specimen-only drop-off; processing completion | $80 per agreed basic panel; specialized panels require a reviewed price/capability row |
| Ambulatory operations | Roadmap L3 OR, recovery, Surgeon or permitted Founder, OR Nurse and necessary support | Pre-arranged clinically cleared ASC-eligible procedures; complete episode including recovery | $900 standard / $1,300 extended bands; subtype, provider/anesthesia and supply requirements unresolved |
| Pharmacy prescription pickup/refill | Roadmap L3 Pharmacy + Pharmacist | Existing patient or pickup-only visitor with valid prescription; actual dispense/handoff | Working basket $25 gross, $15 stock cost, $10 contribution; not a uniform real-drug price |
| MRI | Roadmap L4 MRI + Imaging Tech | Scheduled or eligible existing patient; completed acquisition | $240 |
| Onsite image interpretation | Roadmap L4 Reading Room + Radiologist | Work queue, usually no separate visitor; pay only for an actual distinct completed read | $40/read; no fee for external interpretation |
| APP-managed ordinary appointments | Roadmap L4 APP + appropriate exam room | Operational consult/follow-up with no player question or FSRS evidence | $80 per authorized completed consultation; no second consult fee for the same educational encounter |
| Pediatric operational appointments | Roadmap L4 Pediatric Exam + appropriately authorized provider | Separate age-appropriate authorized service/consult; companion may shop | Same appropriate service/consult fee, no extra charge simply for pediatric status |
| Wound care | Roadmap L4 Wound/Ostomy Clinic + approved provider; APP proposed, not Peri-op Nurse substitution | Dressing/wound-review service; debridement only if separately approved and equipped | $60 routine / $120 approved procedure band |
| Ostomy support | Same L4 clinic + approved provider | Fitting/education/check appointment and optional supply handoff | $75 service; supplies charged separately only when actually supplied |
| Post-procedure follow-up | Existing/future exam or specialty capability plus authorized provider | Review, wound check, suture/staple/drain removal only when supported by an approved care plan | Included follow-up $0 by default; $40 only for explicitly independent billable service |

Working prices for future services are catalog suggestions, not verified profit forecasts. Future room/salary/consumable values are undefined, so future profitability cannot yet be asserted. Owner agreement on the catalog should precede the final consolidated numeric signoff. Do not silently select unresolved clinical or staffing mappings while implementing.

### Explicit subtype review list (avoid vague 'all procedures')
- Minor-procedure inventory must account for the owner's SCC skin-biopsy example, cutaneous/pigmented-lesion biopsy, incision/drainage, aspiration, appropriate superficial excision, wound closure and later removal/check activities. These are candidates for review, not a declaration that each belongs in the existing Minor-Procedure Room.
- Breast core/excisional biopsy, thyroid FNA, image-guided aspiration and specialized sampling require individual equipment/provider/site checks. Do not lump them into a generic biopsy fee just because the source includes a test label.
- Endoscopy inventory must explicitly reconcile generic endoscopy, colonoscopy, upper endoscopy with biopsy, existing EUS/ERCP sampling, and esophageal multi-level biopsy routes. Some named source routes are currently offsite; a generic endoscopy room is insufficient evidence to convert them automatically.
- Imaging inventory must distinguish generic ultrasound from duplex/specialized ultrasound, generic CT from particular contrast/angiography protocols, and MRI/MRCP from specialized MRI routes. Specialized capability availability must be explicit.
- Laboratory inventory must distinguish collection, actual onsite analytical testing, and external laboratory/pathology/molecular work. Receiving an outside result never earns an onsite processing payment.
- Future surgery inventory must distinguish ASC-eligible procedures from hospital-only referral/transfer. Do not invent inpatient/ICU operations for this surgery center or treat a generic OR as enough for every operation.

### Retail and supplies — existing characters participate

| Product | Proposed facility/level | Who can buy | Working gross / stock cost / contribution |
| --- | --- | --- | --- |
| Coffee / hot beverage | Current Coffee Kiosk L2; actual sales are new | Eligible staff, Founder, waiting patients, service visitors, companions, street customers | $5 / $1 / $4 |
| Bottled non-hot drink | Kiosk L2 and roadmap Vending L3 | Eligible customers from all classes | $3 / $1 / $2 |
| Packaged snack | Kiosk L2 and Vending L3 | Eligible customers from all classes | $4 / $2 / $2 |
| Gift / card / small merchandise | Roadmap Gift Shop L5 | Staff, Founder, patients, companions, outside shoppers | $15 / $6 / $9 basket |
| Flowers / premium gift | Gift Shop L5, new product candidate | Eligible shoppers | $25 / $12 / $13 basket |
| Basic OTC / home-care supply basket | Pharmacy L3; new product assortment | Eligible customers; restricted products require explicit eligibility | $12 / $6 / $6 |
| Wound/ostomy take-home supply basket | Pharmacy L3 or specialty clinic L4, capability-dependent | Actual authorized recipient | $20 / $10 / $10 |
| Cafeteria / meals | Excluded by owner | No facility or purchases | Not implemented |

Vending and kiosk may sell the same products without creating separate customer identities. Gift-shop prices are basket defaults, not a reason to generate one transaction per tiny item. Stock cost and revenue post atomically; the overhead remains in the existing expense system. Receipt shows gross sale and net contribution separately; green +$ displays actual credited gross receipt, while costs are visible in finances. A transaction can never credit sales with no valid fulfillment/stock. Initial implementation may use automatic procurement with a per-sale cost rather than a separate restocking minigame; this choice needs owner agreement.

Do not monetize basic water, toilets, ordinary waiting seats, garden access, necessary recovery occupancy, staff gym/break room, or the act of checking in. These support care/staffing. Companions are not an entrance fee. Training/repair/EVS/inspection generally cost money or improve operation; their presence is not a sale. Hospital inpatient stays, emergency care, parking/valet and unrelated specialty retail are outside the planned ASC; include only if the owner deliberately expands the product.

## Customer behavior and traffic proposal
- Scheduled clinical appointments and spontaneous retail walk-ins are different arrival streams. Specimen/prescription pickups are service-purpose visitors; companions attach to a real visit. Ambient sidewalk decoration remains distinct.
- A character keeps one persistent identity with a primary purpose plus optional activities. Their purchases do not generate another clinical patient, scored answer, concept selection, review, or duplicate sprite.
- Patients may shop only during an explicitly permitted idle/result-wait phase and when the care plan allows the relevant purchase. Use authored/approved restrictions (for example a no-food/drink flag), not an AI inference from diagnosis during gameplay. Unknown restriction status blocks food/drink during active procedural care. Results becoming actionable cancel unstarted shopping; finish only an already atomic purchase, then return through ordinary routing.
- Employees shop only when free, never while booked for a procedure, cleaning, check-in, or another duty. New work cancels an unstarted shopping detour. Founder commands supersede optional shopping. Nobody buys on behalf of an unattended room just to create passive money.
- Working retail limits: at most one optional shopping trip per120 facility minutes; at most two food/drink purchases per600-minute operating day; one gift/supply basket per visit/day; $20/day personal discretionary budget for recurring staff/Founder, $30/visit for retail/patient/companion discretionary shopping. Prescribed services/supplies use their order allowance, not this leisure budget. Paid staff purchases are personal spending, not an extra clinic salary deduction; Founder personal funds must be explicitly modeled/authorized, otherwise founder consumption is non-revenue and costs supplies.
- Outside retail proposal: one arrival opportunity per120 facility minutes CLINIC-WIDE, 50% deterministic seeded chance when an eligible shop is open, at most two outside retail customers onsite. More shops do not independently multiply foot traffic. Proposed retail counter service2 facility minutes, vending1, max queue2 per outlet; abandon after10 minutes without payment/penalty. Optional shopping never takes an examination slot.
- Diagnostic appointment working cadences: US120, X-ray180, CT240, collection60, MRI240 facility minutes. Minor-procedure240, endoscopy300, advanced endoscopy600, later OR600, APP120, wound/ostomy180. Each is a maximum opportunity, not guaranteed demand. Shared appointment arrivals no more than one per30 facility minutes; no backlog catch-up or change to educational arrivals. Initial finite-capacity simulation must verify actual flow before these values are finalized.
- Clinical capacity uses the actual room, equipment, concrete employee and provider tasks. Educational work has first claim on free shared capacity, but started work is not preempted. One active episode per capacity slot, one waiting external customer per service line; no room is reserved while a remote result returns unless the workflow truly needs it. Bound clinic-wide external clinical waiting to two initially; skipped slots do not accumulate. A booked visitor unable to start within60 minutes leaves unpaid. Multi-room procedures reserve required downstream capacity before admitting the episode.
- Physical companions: propose at most one per procedural/pediatric appointment and no separate random companion generator. They share arrival/departure with the linked patient except an explicit retail detour; deferred exit cannot obstruct required discharge. Companion transport/escort requirements need clinical mapping, not invented blanket rules.

## Accounting, payment stages and visible feedback
- Quote and freeze an eligible service/price version when work is accepted; only actual completion posts money. No fees for a canceled booking, browsing a shop, walking past equipment, an offsite referral, a wrong answer, or reading a result.
- Each unique order/episode/component/purchase has a durable idempotency key and financial receipt. A procedure episode bundles its preparation, procedure and necessary recovery; do not bill the same work three times. Independent sampling, interpretation, tests or supplies may be separate ONLY when explicitly designated distinct services in the approved catalog.
- Collection and processing are distinct: collection-only $50, locally processed basic panel adds $80 only if actually processed onsite (total$130); outside processing produces no clinic test fee. Group components in one episode receipt so the player can see why it paid.
- Acquisition and a later onsite read may be distinct: US acquisition$120 plus actual local read$40 gives$160; the external read never earns that$40. Multiple questions about a single test do not create multiple orders/fees.
- Existing educational completion rewards stay separate and unchanged. No extra ordinary consult fee for that same educational encounter. Existing GLP-1 automation retains its existing payment, now exposed through the receipt system; it is not paid twice by a new timer.
- Green popup follows the customer above their head at the actual transaction, using the credited amount. Remote work with no present customer gets a small receipt at the responsible workstation/service panel, not a fabricated patient. Popups last1.5 real seconds; each receipt displays once in the active session, never from old restored event history. Finances retain durable receipts and totals.
- Save/reload preserves pending work, employee/room reservations, frozen prices, budgets, cooldowns and completed receipts. No retroactive credits from older completed or already-pending unpriced services. No offline income catch-up. Existing cash/history/FSRS/levels/rooms remain intact; all-wrong tutorial must still complete without any new service or purchase income.

## What needs owner agreement before product edits
1. Complete roster/category scope, including companions and all existing actor retail purchases.
2. Whether to add the proposed cafeteria/meal facility, or keep food to kiosk/vending. Other new test equipment below is optional, not silently included.
3. Product rule for later levels: implement and test service handlers/capability contracts now, keep them gated; do not claim the unimplemented Level3–5 progression is delivered. Building those full levels is a much larger separate scope.
4. Clinical service mapping table for procedures, special tests, prescriptions and restrictions. Operational software can be built without generating clinical content or bypassing review, but unmapped clinical subtypes must stay unavailable.
5. One final numeric table after accepted catalog/capacity choices, retaining actual current educational route timings unless a separately explicit timing redesign is approved. All working prices/cadences here remain proposals, not evidence of owner approval.

## Additional tests/equipment to consciously include or exclude
The source has educational labels for mammography, breast MRI, breast/core/excisional and thyroid biopsies, anoscopy, manometry, DXA, MRCP variants, reflux monitoring, tumor MMR/IHC, cutaneous/nipple biopsies, laryngeal exam, contrast swallow, ABI, rectal assessment, CTA, genetic tests, specialized MRI, biopsy/staging, venous duplex, serology, EUS molecular studies, aldosterone-renin tests, colonoscopy, esophageal biopsies, percutaneous transhepatic biopsy, PET-CT, CA19-9 testing, scintigraphy, defecography and urea breath testing. Most are offsite-only now. Proposed policy: catalog all as explicit external services with zero onsite revenue until the exact local capability/provider/clinical mapping exists. Do not make every label instantly purchasable inside a generic scanner/lab.

Other plausible NEW CANDIDATES for owner brainstorming: pre-op assessment appointment, ECG station, targeted vascular-testing station, pathology/specimen processing, dedicated mammography/DXA, injection/infusion clinic, rehabilitation consultation. These are not in the accepted room roadmap; each expands equipment/staff/clinical scope. No claim is made here that the ASC should or can clinically offer each one. Prefer completing the accepted roadmap plus reviewed minor-procedure coverage over adding every possible healthcare business.

## Implementation and validation after agreement
Sequential delegated milestones, normally one writer: (1) complete catalog/eligibility and transaction ledger; (2) shared service work/resource/provider scheduling, including future-capability handlers; (3) existing-character shopping and stock/cost/budget rules; (4) outside service/retail/companion arrivals and route persistence; (5) separate UI, receipts/popups and future locks; (6) integrated accounting/capacity/timing/legacy-save/tutorial and isolated browser acceptance. Astra reviews baseline-relative diffs and evidence at each milestone. Workers cannot independently change prices, clinical mappings, future progression or shared room/character art.

Preserve GS-015 rooms, GS-018 statics, GS-019 motion and GS-006 clinical ownership, GS-017 educational eligibility diagnosis and GS-020 mobile-tech implementation. Shared reducer/types/persistence/selectors/balance/session/FacilityScene files remain dirty; use new modules and narrow reviewed hooks. No PM-board edits, owner-save reads, server restart, deployment or peer loops. Canonical play remains START_GAME.cmd -> http://127.0.0.1:4173. Only planning documents changed in this turn.

