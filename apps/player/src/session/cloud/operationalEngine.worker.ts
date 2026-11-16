import { prepareRuntimeCaseCatalogue } from "../../mobile/performance/runtimeCatalogue";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import type { OperationalEngineWorkerReply, OperationalEngineRequest } from "./operationalEngineProtocol";
import { createWorkerReceiptReceiver } from "./workerDelivery";

const engine = new OperationalEngineProcessor();
const port = globalThis as unknown as {
  onmessage: ((event: MessageEvent<OperationalEngineRequest>) => void) | null;
  postMessage(reply: OperationalEngineWorkerReply): void;
};
let ready: Promise<void> | undefined;
const receive = createWorkerReceiptReceiver(reply => port.postMessage(reply), (request: OperationalEngineRequest) => {
  ready ??= prepareRuntimeCaseCatalogue();
  void ready.then(() => dispatchOperationalEngineRequest(engine, request, reply => port.postMessage(reply)))
    .catch(() => port.postMessage({ id: request.id, kind: "failure", code: "engine-catalogue" }));
});
port.onmessage = event => { receive(event.data); };
port.postMessage({ ready: true });
