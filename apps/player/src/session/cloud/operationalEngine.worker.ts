import { prepareRuntimeCaseCatalogue } from "../../mobile/performance/runtimeCatalogue";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";

const engine = new OperationalEngineProcessor();
const port = globalThis as unknown as {
  onmessage: ((event: MessageEvent<OperationalEngineRequest>) => void) | null;
  postMessage(reply: OperationalEngineReply): void;
};
let ready: Promise<void> | undefined;
port.onmessage = event => {
  ready ??= prepareRuntimeCaseCatalogue();
  void ready.then(() => dispatchOperationalEngineRequest(engine, event.data, reply => port.postMessage(reply)))
    .catch(() => port.postMessage({ id: event.data.id, kind: "failure", code: "engine-catalogue" }));
};
