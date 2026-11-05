import { journalRowText } from "../localJournal";
import { sha256Utf8 } from "./codecJson";
import type { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";

/** Hashing immutable journal rows is independent of the game version. It may
 * await WebCrypto without holding a player command behind storage preparation. */
export function dispatchOperationalEngineRequest(engine: OperationalEngineProcessor, request: OperationalEngineRequest,
  post: (reply: OperationalEngineReply) => void): void {
  if (request.kind !== "journalHashes") { post(engine.handle(request)); return; }
  try {
    const versions: number[] = [];
    const rows = request.rows.map(input => {
      if (input.deltaVersion === undefined) return input.row;
      const delta = engine.journalDelta(input.deltaVersion);
      if (!delta) return null;
      versions.push(input.deltaVersion); return { ...input.row, delta };
    });
    if (rows.some(row => row === null)) { post({ id: request.id, kind: "journalHashes", missing: true }); return; }
    void Promise.all(rows.map(row => sha256Utf8(journalRowText(row!)))).then(hashes => {
      post({ id: request.id, kind: "journalHashes", hashes }); engine.releaseJournalDeltas(versions);
    }).catch(() => post({ id: request.id, kind: "failure", code: "engine-journal-hash" }));
  } catch { post({ id: request.id, kind: "failure", code: "engine-journal-hash" }); }
}
