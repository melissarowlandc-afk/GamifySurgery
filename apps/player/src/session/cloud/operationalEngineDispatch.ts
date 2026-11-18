import { runtimeCaseCatalogueEnabled, withRuntimeCaseSlices } from "../../mobile/performance/runtimeCatalogue";
import { journalRowText } from "../localJournal";
import { encodeJournalValue } from "../journalEncoding";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "../localStorageBuildPolicy";
import { joinClockJournalDeltas, MAX_CLOCK_JOURNAL_COMMANDS } from "../clockJournalDelta";
import { sha256Utf8 } from "./codecJson";
import type { OperationalEngineProcessor } from "./operationalEngineProcessor";
import type { OperationalEngineProgress, OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";

/** Hashing immutable journal rows is independent of the game version. It may
 * await WebCrypto without holding a player command behind storage preparation. */
export function dispatchOperationalEngineRequest(engine: OperationalEngineProcessor, request: OperationalEngineRequest,
  post: (reply: OperationalEngineReply) => void, progress?: (reply: OperationalEngineProgress) => void): void {
  if (request.kind !== "journalHashes") {
    const run = () => engine.handle(request, stage => progress?.({ id: request.id, progress: stage }));
    if (!runtimeCaseCatalogueEnabled()) { post(run()); return; }
    void withRuntimeCaseSlices(run).then(post)
      .catch(() => post({ id: request.id, kind: "failure", code: "engine-catalogue" })); return;
  }
  try {
    const versions: number[] = [];
    const rows = request.rows.map(input => {
      if (input.deltaVersions !== undefined) {
        if (input.deltaVersions.length < 2 || input.deltaVersions.length > MAX_CLOCK_JOURNAL_COMMANDS ||
          input.deltaVersions.some(version => !Number.isSafeInteger(version) || version < 1)) throw Error("Invalid clock delta versions");
        const deltas = input.deltaVersions.map(version => engine.journalDelta(version));
        if (deltas.some(delta => !delta)) return null;
        let delta = deltas[0]!;
        for (const next of deltas.slice(1)) {
          const joined = joinClockJournalDeltas(delta, next!);
          if (!joined) throw Error("Invalid clock delta continuity");
          delta = joined;
        }
        versions.push(...input.deltaVersions); return { ...input.row, delta };
      }
      if (input.deltaVersion === undefined) return input.row;
      const delta = engine.journalDelta(input.deltaVersion);
      if (!delta) return null;
      versions.push(input.deltaVersion); return { ...input.row, delta };
    });
    if (rows.some(row => row === null)) { post({ id: request.id, kind: "journalHashes", missing: true }); return; }
    // One compression stream at a time. Await each row's native crypto/stream
    // work before starting the next, rather than serializing a whole batch in
    // one turn ahead of newly admitted player commands.
    void (async () => {
      const values = [];
      for (const row of rows) {
        progress?.({ id: request.id, progress: "journal-hash" });
        const sha256 = await sha256Utf8(journalRowText(row!));
        progress?.({ id: request.id, progress: "journal-encode" });
        values.push({ sha256, ...(LOCAL_STORAGE_COMPRESSION_WRITES ? { value: { ...await encodeJournalValue({ ...row!, sha256 }), version: row!.version } } : {}) });
        progress?.({ id: request.id, progress: "journal-row" });
      }
      return values;
    })().then(values => {
      post({ id: request.id, kind: "journalHashes", hashes: values.map(value => value.sha256),
        ...(LOCAL_STORAGE_COMPRESSION_WRITES ? { encodedRows: values.map(value => value.value) } : {}) }); engine.releaseJournalDeltas(versions);
    }).catch(() => post({ id: request.id, kind: "failure", code: "engine-journal-hash" }));
  } catch { post({ id: request.id, kind: "failure", code: "engine-journal-hash" }); }
}
