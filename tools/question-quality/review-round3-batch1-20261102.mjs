// Current pipeline entry point; pre-adversarial implementation is retained in the entry snapshot.
import {main} from "./review-adversarial-r7-20261102.mjs";
export {buildReview,main} from "./review-adversarial-r7-20261102.mjs";
import {pathToFileURL} from "node:url";
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.stack);process.exitCode=1;});
