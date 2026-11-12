// Actual dedicated V8 worker for public deterministic QA. This bridge loads
// checked-in TS directly; it never uses ignored/private inputs or the network.
import '../../../../../tools/economy-audit/source-loader.mjs';
import { parentPort } from 'node:worker_threads';
const { OperationalEngineProcessor } = await import('./operationalEngineProcessor.ts');
const { dispatchOperationalEngineRequest } = await import('./operationalEngineDispatch.ts');
globalThis.fetch = () => { throw Error('Offline operational-engine test'); };
const processor = new OperationalEngineProcessor();
parentPort.on('message', request => dispatchOperationalEngineRequest(processor, request, reply => parentPort.postMessage(reply)));
