import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";

const engine = new OperationalEngineProcessor();
const port = globalThis as unknown as {
  onmessage: ((event: MessageEvent<OperationalEngineRequest>) => void) | null;
  postMessage(reply: OperationalEngineReply): void;
};
port.onmessage = event => dispatchOperationalEngineRequest(engine, event.data, reply => port.postMessage(reply));
