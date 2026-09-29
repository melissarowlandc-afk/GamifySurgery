# Approved clinic procedure routing inventory

September 28 fee update: owner approved perianal/anorectal procedures at $200 and
breast/FNA procedures at $150. Implemented locally for new work: breast cyst
aspiration, breast abscess aspiration, thyroid FNA and breast core biopsy $150;
anoscopy, hemorrhoid banding and perianal abscess drainage $200. Future-only
thrombosed external hemorrhoid excision and pilonidal drainage have inert $200
price definitions. Skin biopsy $150, cutaneous drainage $100 and incisional
infection drainage $200 remain unchanged. Existing frozen quotes remain intact.
Room costs are unchanged. The generated inventory now includes these approved fees.
Terra ct_staffing_audit implemented; Astra reviewed the task-relative diff and
independently passed balance 15 and domain procedure 26 tests. Subsequent full
test-choice execution work passed domain594, player507, balance38 and five browser
scenarios. The completed audit and remaining visualization limitation are in
[the follow-up plan](../../execplans/test-choice-orders-and-procedure-fees.md).

Status: procedure routing **implemented and technically verified locally**
(2026-09-24), with the approved fee update above on September 28. Latest owner
direction supersedes the earlier hold. No GitHub push or Pages deployment was performed.
This is a simulation configuration review, not clinical guidance. The generated companion data is
[current-routing-inventory.json](current-routing-inventory.json); regenerate it
with the command recorded in that file.

## Approved local configuration

| Procedure/category | Approved facility minutes |
| --- | ---: |
| Aspiration (existing breast-cyst entry) | 15 |
| Abscess incision and drainage | 15 |
| Drainage (existing superficial-incisional-infection entry) | 15 |
| Diagnostic skin biopsy | 15 |
| Anoscopy | 15 |
| Office hemorrhoid banding | 30 |
| Excisional biopsy | 45 |
| Perianal abscess drainage | 15 |
| Thrombosed external hemorrhoid excision | 15 |
| Pilonidal abscess drainage | 15 |
| Cyst or lipoma removal | 45 |
| Seroma aspiration | 15 |

Ultrasound Room work: US-guided thyroid FNA, image-guided breast core biopsy,
and image-guided breast abscess aspiration each take **60 game minutes**.

Latest owner authorization: "If this is all we can think of, then we can push
these changes to the game". Apply the above bounded scope locally; no additional
brainstorming is needed to proceed. This supersedes the historical hold quoted
below, and does not authorize a GitHub/Pages deployment. Definitions for future
procedures do not turn existing incorrect answers into performed procedures.

These are procedure-room work durations in game minutes, not clinical time
estimates. Generic automatic procedure visitors are disabled; procedures come
through clinic patients. Unrelated service visitors retain their existing rules.
No duration is automatically extended to unreviewed procedures just because
their labels include "aspiration", "drainage", or "excision". Exact future
case/service mappings require review. Thrombosed external hemorrhoid excision,
pilonidal abscess drainage, cyst/lipoma removal and seroma aspiration currently
have no corresponding correct authored action: their approved definitions are
inert until such questions are added. Existing distractors remain distractors.
Owner gameplay approval does not promote clinical content review status.

The current JSON covers five result routes and 21 exact terminal case/node/choice
triggers, including Ultrasound Room procedures. Resource-bound work excludes
walking and external results. New biopsy/FNA patients return to a reserved
waiting destination after onsite work while external processing continues.
Displayed service/result estimates exclude walking. Existing already-frozen
procedures retain their saved timing; the new timing uses an explicit version.
Filing a terminal chart now keeps its patient onsite until the active procedure
finishes. The same correction repairs saved resolved-patient departure conflicts.

The approved September 28 fees above apply to new work. Cutaneous drainage remains
$100, superficial-incisional drainage $200, and skin sampling $150. Procedure
rows remain encounter-only rather than generic visitor offerings. Future cyst,
lipoma and seroma definitions still have no approved fee and do not execute.
Construction, upkeep and upgrade prices are unchanged.

Validation: domain 552/552, player 496/496, balance 34/34, audit 1/1, workspace
type checks, boundaries/launcher contract and isolated production build passed.
Four isolated browser scenarios passed: FNA live room occupancy, skin biopsy
departure and reload, banding with a filed chart, and offsite reflux/no generic
procedure visitor. Astra reviewed Sol's runtime diff and Terra's audit, browser
spec, actual results and screenshots. Browser tests used private port 4198,
which was stopped afterward; the owner origin/profile at 127.0.0.1:4173 was not
accessed or reset. These were synthetic clinic fixtures, not a natural tutorial
walkthrough or a reproduction of the owner's original saved reflux incident.

## Historical audit before implementation

The remaining sections describe the pre-change audit and old runtime values,
including its visible-dwell defect. They are retained for comparison only.
The exact old JSON is [pre-change-routing-inventory.json](pre-change-routing-inventory.json);
[current-routing-inventory.json](current-routing-inventory.json) is regenerated
from the implemented configuration. Historical pending decisions below do not
override the approved routing/work durations above.

## Report under review

The reported event occurred in the local owner game at `http://127.0.0.1:4173`:
the choice **Reflux monitoring off PPI** appeared to send the patient and
founder to the Minor-Procedure Room. The current loaded catalog does not do
that: it selects `route.ambulatory_reflux_monitoring.outsourced`, which has no
room target, local resource requirement, room revenue line, or founder
reservation. This inventory does not reproduce the reported behavior, so it
does not assign a cause. A frozen historical pending result or an independent
scheduled minor-procedure visitor remains possible until the local campaign is
reproduced read-only.

The owner has rejected the reported reflux-monitoring room wait. Later timing
and clinic-only routing decisions are recorded above; prices remain pending.

## Room cost and clock

| Item | Current configured value | Decision |
| --- | --- | --- |
| Construction | $800 once | Pending |
| Upkeep | $15 per facility hour, plus $2/hour for each upgrade level above 1 | Pending |
| Expense posting | Accrues every facility minute; cash posts every 15 facility minutes | Pending |
| Upgrades | $220, $330, $480, $680; configuration advertises 5% duration reduction per level | Pending |
| Runtime effect of duration reduction | No current route/operation caller uses it, so it does not reduce a current procedure duration | Pending |
| Clock | 1 facility minute = 1 real second at 1x; 0.5 seconds at 2x; 0.25 seconds at 4x | Informational |

## Direct case-result routes to this room

Both entries require `capability.minor_procedure`, reserve the room during the
resource-bound phase, and can reserve the founder or an APP as provider.

| Route | Total route clock | Resource-bound room phase | Route-linked revenue | Decision |
| --- | --- | --- | --- | --- |
| `route.skin_excisional_biopsy.in_house` | 180 min / 180s at 1x | Sampling: 60 min / 60s | `income.minor_procedure_sampling`: $150 at resource completion | Pending |
| `route.cutaneous_lesion_biopsy.in_house` | 180 min / 180s at 1x | Sampling: 60 min / 60s | `income.minor_procedure_sampling`: $150 at resource completion | Pending |

Each route then has a 120-minute external-pathology phase. The $150 is gross
revenue credited by the simulation after the resource-bound phase; it is not a
separate procedure-room expense or a statement about a patient charge.

### Visible dwell caveat

For these two routes, resource reservation ends after 60 facility minutes, but
the patient movement code holds the patient at the Minor-Procedure Room until
the return leg begins. With a 180-minute total route, visible room dwell is
`180 − outbound travel minutes − return travel minutes`, not necessarily 60
minutes. The exact travel amount is layout/save dependent. This means the
patient can visibly remain in the room during much or all of the 120-minute
external-pathology phase even after the founder/provider and room resource are
released. This is a routing-presentation issue for review, not an approved
duration.

### Case-gate appendix: all 8 active gate variants

For each of these nonterminal nodes, the reducer schedules the gate after
**any** submitted answer, including a wrong answer. It does not use the answer
wording to decide whether to start the route. The four pigmented-lesion nodes
all use the excisional-biopsy route; the four cutaneous-SCC nodes all use the
cutaneous-lesion-biopsy route.

| Case ID | Question choices that all schedule its gate | Decision |
| --- | --- | --- |
| `case.pigmented-skin-lesion.changing-back-lesion` | Complete excisional biopsy; Superficial shave biopsy; Partial punch biopsy; Definitive wide local excision | Pending |
| `case.pigmented-skin-lesion.shoulder-border` | Complete excisional biopsy; Superficial shave biopsy; Partial punch biopsy; Definitive wide local excision | Pending |
| `case.pigmented-skin-lesion.calf-growth` | Complete excisional biopsy; Superficial shave biopsy; Partial punch biopsy; Definitive wide local excision | Pending |
| `case.pigmented-skin-lesion.forearm-change` | Complete excisional biopsy; Superficial shave biopsy; Partial punch biopsy; Definitive wide local excision | Pending |
| `case.cutaneous-scc.forearm-low` | Diagnostic skin biopsy; Cryotherapy treatment; Clinical observation; Refer for Mohs surgery | Pending |
| `case.cutaneous-scc.trunk-low` | Diagnostic skin biopsy; Cryotherapy treatment; Clinical observation; Refer for Mohs surgery | Pending |
| `case.cutaneous-scc.ear-high` | Diagnostic skin biopsy; Cryotherapy treatment; Clinical observation; Refer for Mohs surgery | Pending |
| `case.cutaneous-scc.recurrent-high` | Diagnostic skin biopsy; Cryotherapy treatment; Clinical observation; Refer for Mohs surgery | Pending |

## Procedure-room service operations

These are simulation income operations, separate from the clinical case route
above. “Scheduled” can create a generic visitor on its cadence when the room
is operational. “Explicit only” has no automatic cadence; the reducer’s exact
terminal-answer allowlist below can start an encounter operation.

| Income line | Entry mode | Room phase | Gross revenue / payment stage | Decision |
| --- | --- | --- | --- | --- |
| `income.minor_procedure_simple` | Scheduled, nominal 240-facility-minute cadence | 45 min / 45s at 1x | $100 / episode completion | Pending |
| `income.minor_procedure_sampling` | Explicit only | 60 min / 60s at 1x | $150 / resource completion | Pending |
| `income.minor_procedure_complex` | Explicit only | 60 min / 60s at 1x | $200 / episode completion | Pending |

All three have zero configured stock cost. Their net cash delta therefore
equals the stated gross revenue when the configured payment event completes.
The simple scheduled visitor represents no more specific procedure in the
catalog. It can arrive only while its line is installed and operational, and
the shared scheduler also applies waiting and concurrency limits. The three
operation rows name no provider-role requirement: the founder is the only
available provider path. That differs from the two biopsy routes above, which
prefer an APP but permit the founder.

## Exact terminal-choice triggers

The current reducer starts a procedure operation only for these exact correct
terminal tuples, subject to facility operational and path checks:

| Income line | Case / choice | Decision |
| --- | --- | --- |
| Simple | Painful simple breast cyst — “Offer needle aspiration of the cyst for symptom relief” | Pending |
| Simple | Four cutaneous-abscess variants — “Perform incision and drainage” | Pending |
| Complex | Four superficial-incisional-infection variants — “Open and drain incision” | Pending |

The JSON appendix names every stable case, node, and answer-choice ID and
includes the display text for all nine tuples. The extractor verifies both
directions against the private reducer allowlist and verifies each is a correct
choice on the final node.

## Exclusions and compatibility

- Reflux monitoring off PPI is **not** an active direct Minor-Procedure Room
  trigger in the current catalog; its only route is outsourced for 180 facility
  minutes.
- Other off-site tests likewise have no direct room route unless an individual
  route declares a `patientTravel.destinationRoomDefinitionId`.
- Existing frozen pending results retain their saved paths and timings. This
  review does not modify them.
- Existing legacy room instances may persist in saves. The inventory covers
  the current runtime catalogs and reducer allowlist, not uninspected saved
  state.
