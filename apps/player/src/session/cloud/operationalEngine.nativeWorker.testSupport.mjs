// Actual dedicated V8 worker for public deterministic QA. This bridge loads
// checked-in TS directly; it never uses ignored/private inputs or the network.
import '../../../../../tools/economy-audit/source-loader.mjs';
import { parentPort } from 'node:worker_threads';
const { OperationalEngineProcessor } = await import('./operationalEngineProcessor.ts');
const { dispatchOperationalEngineRequest } = await import('./operationalEngineDispatch.ts');
const { createWorkerReceiptReceiver } = await import('./workerDelivery.ts');
globalThis.fetch = () => { throw Error('Offline operational-engine test'); };
const processor = new OperationalEngineProcessor();
parentPort.on('message', createWorkerReceiptReceiver(reply => parentPort.postMessage(reply),
  request => dispatchOperationalEngineRequest(processor, request, reply => parentPort.postMessage(reply))));
parentPort.postMessage({ ready: true });
