/** Manager-approved ENG-I01b/c simulation equipment bundles. Existing operational
 * suites include these; no purchase, staffing rule, executed route or fee is added.
 * Actual live admission still verifies its source room, family and reserved team. */
export const PROCEDURE_ROOM_CAPABILITIES: Readonly<Record<string, readonly string[]>> = {
  "room.ambulatory_or": [
    "capability.fluoroscopy",
    "capability.intraoperative_cholangiography",
    "capability.transcystic_exploration",
    "capability.endocrine_surgery",
    "capability.intraoperative_pth",
    "capability.intraoperative_ultrasound",
    "capability.intraoperative_frozen_pathology",
  ],
  "room.endoscopy": [
    "capability.endoscopic_closure",
    "capability.endoscopic_rescue",
    "capability.chromoendoscopy",
  ],
};
