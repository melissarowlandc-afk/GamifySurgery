/** Read-only test control: same runtime/assertions/deadlines, entry clinical data.
 * This file is loaded only by the explicit offline diagnostic command. */
import {afterAll} from "vitest";
import {PROTOTYPE_DOMAIN_CONTEXT} from "@gamify-surgery/game-domain";
import {QUESTION_FLAGS_PRE_REVISION_RELEASE} from "@gamify-surgery/clinical-content";
const current=PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=QUESTION_FLAGS_PRE_REVISION_RELEASE;
console.info("Question flag entry-release control: 396 concept definitions; no timeout/assertion override.");
afterAll(()=>{PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=current;});
