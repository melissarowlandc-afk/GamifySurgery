# Owner Row 45: Exact Right-Thoracotomy Exposure Approval

Status: Clinically approved and deferred to Future ED / Trauma

Approval date: 2026-08-06

Reviewer: Melissa Rowland, MD (surgeon)

Approval ID:
`approval.melissa-rowland-md.owner-row-045.2026-08-06`

Content version: `clinical.owner-row-045.2026-08-06.1`

## Source provenance

- Workbook: `Gamify Surgery Concepts (2).xlsx`
- Worksheet: `Sheet1`
- Source row: 45
- Source record: `owner-concept.sheet1.row-045`
- Earlier concept-review receipt:
  `melissa-rowland-md-2026-08-05-rows-2-56`
- Evidence handoff: `owner-concept-intake-2026-08-05-v3`
- Scope decision:
  `decision.owner-row-045.future-ed-trauma-right-thoracotomy-exposure.2026-08-06`

The owner approved one FSRS concept and four complete single-select Question
Variants, including two multiple-injury presentations, one reverse-anatomy
variant, one resuscitative boundary variant, their complete answer sets, keyed
answers, explanations, and Future ED / Trauma release point. Automated
validation is structural verification, not clinical approval.

## Approved Tested Concept

`concept.thoracic-trauma.right-thoracotomy-exposure`

- Concept type: `anatomy`
- Educational difficulty: advanced trauma operative anatomy
- Release point: `release.future.ed_trauma`
- Numeric facility stage: unassigned
- Required clinical setting: `hospital_or`
- Required facility capability: none
- Current-game eligibility: deferred

All four Question Variants share this one campaign-scoped FSRS identity.
Release point and clinical setting intentionally remain separate: the content
enters circulation with the future ED / Trauma workstream, while the tested
decision concerns planned operative exposure in a Hospital OR.

## Approved clinical scope

A right thoracotomy directly exposes the proximal or middle intrathoracic
esophagus, intrathoracic trachea, and azygos vein. A stable or stabilized
trauma patient with localized injuries involving a compatible combination of
these structures may appropriately undergo a planned right posterolateral
thoracotomy.

`Right thoracotomy` is the canonical concept. `Right posterolateral
thoracotomy` is the approved context-specific answer when the patient is stable
enough for a planned definitive exposure of a localized upper or middle
thoracic esophageal injury.

The rule is not universal. Distal esophageal injury generally favors a
left-sided approach. Major pleural contamination, cardiac injury,
great-arterial injury, trajectory, and other associated injuries can change or
extend the incision. A patient in traumatic arrest or extremis requiring
immediate resuscitative chest access does not fit this planned posterolateral
scenario; resuscitative access is generally anterior and may use a left
anterolateral or clamshell exposure according to the suspected injury and
protocol.

This package does not teach resuscitative-thoracotomy eligibility, a universal
intercostal space, patient positioning, esophageal repair, tracheal repair,
vascular repair, or drainage technique.

## Approved Question Variants

Every variant contains a brief patient presentation, four single-select
choices, one keyed answer, complete distractor rationales, and shuffled answer
order.

### Combined middle-esophagus and azygos injury

`question.thoracic-trauma.right-thoracotomy-esophagus-azygos.v1`

Presentation: A stable patient has a localized middle thoracic esophageal
perforation and azygos-vein injury without a competing cardiac,
great-arterial, distal-esophageal, or dominant left-pleural injury.

Approved answer: `Right posterolateral thoracotomy`

Incorrect choices:

- Left posterolateral thoracotomy for distal thoracic exposure
- Median sternotomy for central anterior mediastinal exposure
- Left anterolateral thoracotomy for immediate resuscitative access

### Reverse anatomy

`question.thoracic-trauma.right-thoracotomy-reverse-anatomy.v1`

Approved answer: `Proximal thoracic esophagus and azygos vein`

Incorrect choices:

- Distal thoracic esophagus and descending thoracic aorta
- Heart and ascending aorta in the anterior mediastinum
- Cervical esophagus and left carotid sheath

### Combined proximal-esophagus and intrathoracic-trachea injury

`question.thoracic-trauma.right-thoracotomy-esophagus-trachea.v1`

Presentation: A stable patient has localized proximal intrathoracic esophageal
and intrathoracic tracheal injuries below the thoracic inlet, without a
competing cardiac or great-arterial injury or need for immediate resuscitative
thoracotomy.

Approved answer: `Right thoracotomy`

Incorrect choices:

- Left thoracotomy for distal posterior mediastinal exposure
- Median sternotomy for anterior cardiac and aortic exposure
- Midline laparotomy for transabdominal upper-abdominal access

### Resuscitative boundary

`question.thoracic-trauma.right-thoracotomy-resuscitative-boundary.v1`

Approved answer:
`Traumatic arrest requiring immediate resuscitative chest access`

Incorrect choices:

- Stable proximal esophageal and azygos injuries requiring planned repair
- Stable localized right superior mediastinal injuries requiring operative
  control
- Stable middle thoracic esophageal perforation requiring planned primary
  repair

## Evidence limitation

Operative exposure depends on the patient's physiology, the exact injury
location, trajectory, associated injuries, pleural contamination, available
expertise, and need for rapid control. The approved content deliberately tests
a localized and sufficiently stable planned-repair scenario. It does not
convert an anatomic exposure relationship into one incision for all thoracic
trauma.

## Answer-length safeguard

The correct choice is not the uniquely longest answer in any approved
variant. Labels remain concise enough for the chart.

## Runtime boundary

This package is not added to the current playable release. It has no numeric
facility-level assignment and may not be admitted until Future ED / Trauma and
Hospital OR systems are designed and separately authorized.

Source metadata remains `needs_clinician_review`, separately from the named
clinical approval of this exact content version.
