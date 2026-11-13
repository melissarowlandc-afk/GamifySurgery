import { runtimeCaseCatalogueEnabled, withRuntimeCaseSlices } from "../../mobile/performance/runtimeCatalogue";
import { journalRowText } from "../localJournal";
import { encodeJournalValue } from "../journalEncoding";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "../localStorageBuildPolicy";
import { sha256Utf8 } from "./codecJson";
import type { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";

/** Hashing immutable journal rows is independent of the game version. It may
 * await WebCrypto without holding a player command behind storage preparation. */
export function dispatchOperationalEngineRequest(engine: OperationalEngineProcessor, request: OperationalEngineRequest,
  post: (reply: OperationalEngineReply) => void): void {
  if (request.kind !== "journalHashes") {
    if (!runtimeCaseCatalogueEnabled()) { post(engine.handle(request)); return; }
    void withRuntimeCaseSlices(() => engine.handle(request)).then(post)
      .catch(() => post({ id: request.id, kind: "failure", code: "engine-catalogue" })); return;
  }
  try {
    const versions: number[] = [];
    const rows = request.rows.map(input => {
      if (input.deltaVersion === undefined) return input.row;
      const delta = engine.journalDelta(input.deltaVersion);
      if (!delta) return null;
      versions.push(input.deltaVersion); return { ...input.row, delta };
    });
    if (rows.some(row => row === null)) { post({ id: request.id, kind: "journalHashes", missing: true }); return; }
    void Promise.all(rows.map(async row => {
      const sha256 = await sha256Utf8(journalRowText(row!));
      return { sha256, ...(LOCAL_STORAGE_COMPRESSION_WRITES ? { value: { ...await encodeJournalValue({ ...row!, sha256 }), version: row!.version } } : {}) };
    })).then(values => {
      post({ id: request.id, kind: "journalHashes", hashes: values.map(value => value.sha256),
        ...(LOCAL_STORAGE_COMPRESSION_WRITES ? { encodedRows: values.map(value => value.value) } : {}) }); engine.releaseJournalDeltas(versions);
    }).catch(() => post({ id: request.id, kind: "failure", code: "engine-journal-hash" }));
  } catch { post({ id: request.id, kind: "failure", code: "engine-journal-hash" }); }
}
