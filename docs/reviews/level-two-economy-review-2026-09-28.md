# Level 1–2 economy review — September 28, 2026

> Subsequent owner decision: keep GLP-1 at $50/hour per NP and allow two NPs per
> suite; routine/advanced endoscopy fees become $450/$600, targeting nominal
> scheduled gross of $150/hour. Complex-question rewards stay unchanged. This
> supersedes the $75 proposal below. Implementation/validation is tracked in
> `docs/execplans/clinic-economy-names-test-expansion.md`.

Review only; no gameplay values changed. Current dirty worktree is the source of
truth. This is fictional game balancing, not real clinical reimbursement.

## Recommendation

The owner reports that income now feels much more reasonable since patients
started completing paid services. Keep general question payouts, room upkeep,
approved procedure fees and appointment cadences unchanged while playtesting
this corrected baseline. The strongest isolated problem is GLP-1 automation:
its default room and employee cost exceeds its receipts even when operational.

Propose **$75 per automated GLP-1 consultation**, up from $50, retaining the
60-game-minute interval and $50 manual emergency payment. This is a product
proposal, not an approved change. With default salary, one suite would earn
$23/hour after its own $52/hour costs instead of losing $2/hour. Its $1,800
construction/hire cost would take about 78.3 operating hours (7.8 ten-hour days)
to recover, excluding shared overhead and interruptions. Five operational suites
would contribute $115/hour before shared costs; consider that scaling before
approval. Keep the displayed automated-service fee consistent with its payout.

Endoscopy deserves observation before adjustment. Shared imaging and recent
clinic-order fixes make a blanket fee increase or upkeep cut premature.

## Current cash model

One tick is one game minute. Expenses accrue each minute and post every 15
minutes. Pause freezes progress and costs; speed changes real waiting time, not
game-hour economics. Base salaries below exclude owner salary adjustments,
room upgrades, advertising, hallways and optional amenities.

At Levels 1 and 2, encounter payment is $20 + $15 per answered decision + $65
per correct decision. All-correct one/two/three-decision cases pay $100/$180/$260.
Level 0 uses $15 + $10 per decision + $50 per correct decision. There is no
separate complexity bonus or direct wrong-answer cash fine. Configured legacy
reward-tier values are not the active settlement formula.

Encounter payment happens at the terminal answer; performed-service fees arrive
separately when work completes. Do not count a pending service as received cash.
Existing operation quotes remain frozen.

## Expansion economics

All rows are incremental bundles, not complete clinics. Scheduled gross is an
ideal long-run fee/cadence ceiling, not measured income or guaranteed visits.

| Bundle | Build + hire | Own cost/game hour | Scheduled gross/game hour | Margin at that ceiling |
| --- | ---: | ---: | ---: | ---: |
| Ultrasound + one imaging tech | $1,250 | $42 | $60 | +$18 |
| CT + an additional shared imaging tech | $1,900 | $52 | $45 | −$7 |
| Phlebotomy + phlebotomist | $900 | $37 | $50 | +$13 |
| Endoscopy + recovery + two nurses + endoscopist | $4,200 | $170 | $135 | −$35 |
| GLP-1 suite + NP | $1,800 | $52 | $50 | −$2 |

CT costs only $26/hour extra if an existing tech has spare capacity. Its added
tech can also cover other imaging rooms. At $180/scan, the $52/hour bundle needs
one completed scan per 3.46 hours to cover its own recurring costs. The nominal
four-hour external cadence falls short, but clinic orders can fill the gap.

Endoscopy's $135/hour combines routine $400 every five hours and advanced $550
every ten hours. At that ideal scheduled throughput, one additional $400 clinic
procedure per 11.43 hours would cover the $35/hour gap, before recovering capital.
If the founder supplies the provider role, omitting the $900 hire/$60 hourly
endoscopist reduces the bundle to $3,300/$110 per hour; this consumes founder
time and may reduce question/procedure throughput elsewhere.

The minimal front desk + exam + ultrasound + minor procedure + one tech clinic
costs **$69/hour**. Adding the fully staffed endoscopy bundle makes **$239/hour**;
adding CT + second tech and phlebotomy + phlebotomist makes **$328/hour**.
Before service income, those require respectively 0.69, 2.39 and 3.28 all-correct
one-decision settlements/hour. These are expense thresholds, not predictions:
routine arrivals average about one/hour without advertising, and cases may have
multiple decisions and separately paid services.

The ultrasound/minor/tech setup required to leave Level 1 costs $2,050 beyond the
existing front desk/exam, excluding layout. Endoscopy is optional at Level 2;
current Level-2 goals do not unlock a playable Level 3.

## Limits on passive income

Scheduled US/X-ray/CT work consumes 45/60/60 minutes of tech time. A single shared
tech cannot provide unlimited parallel work. All external service arrivals share
30-minute spacing, waiting limits and cancellations; travel, resource contention,
founder work and access can lower receipts. Do not sum the table as guaranteed
passive profit. Generic minor-procedure visitors are disabled; those fees depend
on actual clinic orders. Retail also has stock costs and limited demand.

## Remaining owner requests and next review

- **Complex-case rewards:** still unresolved. The active release has 183 concepts
  and 703 decision nodes with no runtime educational-tier value. Its 450 cases
  contain 203 one-node, 241 two-node and six three-node cases. Extra correct
  decisions already add $80 each. A true difficulty bonus needs an owner-reviewed
  economic classification; do not substitute acuity or facility level. Defer a
  numeric bonus until specific under-rewarded cases are identified.
- **Lower upkeep / more Level-2 income:** reassess with corrected service routes.
  No broad reduction recommended now. More income sources already exist locally.
- **Sustainable automation:** prioritize the proposed GLP-1 correction. For
  endoscopy, compare actual receipts and completed clinic/external procedures
  against its own costs over several game days before changing fees or staffing.

Useful playtest evidence is opening/closing cash, build/hire spending, operating
expenses, completed encounters, service receipts and staffing over the same
game-time window. Separate expansion purchases from recurring profitability.
This review did not inspect or modify the owner's save and is not an empirical
campaign simulation.

## Evidence and validation

Terra `ct_staffing_audit` performed the bounded read-only inventory. Astra reviewed
the extraction scripts and runtime expense/automation/catalog code, recomputed
the bundle arithmetic, and independently reran both extraction checks: 2/2 pass.
Ignored evidence: `.local-dev/economy-review/parent-validation.log`.

Source anchors (current worktree):
- `packages/balance-config/src/prototype-balance.ts`: rooms/staff 44–570,
  stages 573, automation 707, arrivals 715, advertising 729, settlement 815.
- `packages/balance-config/src/service-income-catalog.ts`: service fees/cadences
  41–78. Per-procedure route timing can override generic catalog timing.
- `packages/game-domain/src/reducer.ts`: settlement 2238, expenses 4246,
  automated GLP-1 payouts 4972.

Historical progression and income proposals are not authoritative where they
disagree with runtime. No runtime/clinical edits, server/save changes, commit,
push or deployment were made for this review. Preserve all pre-existing dirt.
