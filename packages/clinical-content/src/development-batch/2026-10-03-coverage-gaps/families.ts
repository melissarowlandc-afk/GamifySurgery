import { CRITICAL_CARE_FAMILY } from "./critical-care";
import { TRAUMA_FAMILIES } from "./trauma";
import { FLUIDS_ACID_BASE_FAMILY } from "./fluids-acid-base";
import { HYPERKALAEMIA_FAMILY } from "./hyperkalaemia";
import { DIALYSIS_ACCESS_FAMILY } from "./dialysis-access";
import { ANESTHESIA_FAMILY } from "./anesthesia";
import { GERIATRICS_FAMILY } from "./geriatrics";
import { THORACIC_FAMILIES } from "./thoracic";

export const FIRST_SIX_FAMILIES=[CRITICAL_CARE_FAMILY,...TRAUMA_FAMILIES] as const;
export const REMAINING_FOURTEEN_FAMILIES=[FLUIDS_ACID_BASE_FAMILY,HYPERKALAEMIA_FAMILY,DIALYSIS_ACCESS_FAMILY,ANESTHESIA_FAMILY,GERIATRICS_FAMILY,...THORACIC_FAMILIES] as const;
export const COVERAGE_GAP_FAMILIES=[...FIRST_SIX_FAMILIES,...REMAINING_FOURTEEN_FAMILIES] as const;
