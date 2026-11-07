import type { DomainContext, GameCommand, GameEvidenceCheckpoint, GameEvidenceDelta, GameState } from "@gamify-surgery/game-domain";
import type { OperationalStatePatch } from "./operationalStatePatch";
import type { PrototypePlayerView } from "../viewModels";
import type { OperationalViewArguments } from "./operationalViewProjection";
import type { JournalRow } from "../localJournal";

export type OperationalContextFlags = Pick<DomainContext, "guidanceTipsDeliveryBlocked" | "guidanceAttentionBlocked" | "guidanceBlockedTopicIds">;
export interface OperationalJournalHashInput { row: JournalRow; deltaVersion?: number }
export interface OperationalViewRequest { revision: number; args: OperationalViewArguments; asOfRealMs?: number; followOpenChart?: boolean }
export interface OperationalViewReply { revision: number; asOfRealMs: number; patch?: OperationalStatePatch; computeMs: number; diffMs: number }

export type OperationalEngineRequest = { id: number } & (
  | { kind: "initialize"; checkpoint: GameEvidenceCheckpoint; visibleState: GameState; context?: DomainContext; contextFlags?: OperationalContextFlags; atRealMs: number; projection?: OperationalViewRequest; snapshotOnly?: boolean }
  | { kind: "command"; expectedVersion: number; command: GameCommand; context?: DomainContext; contextFlags?: OperationalContextFlags; projection?: OperationalViewRequest }
  | { kind: "undo"; expectedVersion: number; target: GameState; operationId: string; projection?: OperationalViewRequest }
  | { kind: "project"; expectedVersion: number; projection: OperationalViewRequest }
  | { kind: "checkpoint"; expectedVersion: number }
  | { kind: "compact"; expectedVersion: number }
  | { kind: "journalHashes"; rows: readonly OperationalJournalHashInput[] }
);
export type OperationalEngineReply =
  | { id: number; kind: "initialized"; version: number; head: GameEvidenceCheckpoint["snapshot"]["head"]; projection?: OperationalViewReply }
  | { id: number; kind: "applied"; baseVersion: number; version: number; head: GameEvidenceCheckpoint["snapshot"]["head"];
      replayed: boolean; patch?: OperationalStatePatch; snapshotPatch?: OperationalStatePatch; delta: GameEvidenceDelta | null; computeMs: number; diffMs: number; projection?: OperationalViewReply }
  | { id: number; kind: "projected"; version: number; projection: OperationalViewReply }
  | { id: number; kind: "checkpoint"; version: number; checkpoint: GameEvidenceCheckpoint }
  | { id: number; kind: "compacted"; baseVersion: number; version: number; checkpoint: GameEvidenceCheckpoint }
  | { id: number; kind: "journalHashes"; hashes: string[]; missing?: never }
  | { id: number; kind: "journalHashes"; missing: true; hashes?: never }
  | { id: number; kind: "failure"; code: string };

/** Private state snapshots are immutable. The reply contains only an ordered
 * raw-state patch and the existing journal delta, never the full archive/tail.
 */
export interface OperationalEngineResult {
  state: GameState;
  replayed: boolean;
  delta: GameEvidenceDelta | null;
  head: GameEvidenceCheckpoint["snapshot"]["head"];
  view?: PrototypePlayerView;
  viewArguments?: OperationalViewArguments;
  projection?: Omit<OperationalViewReply, "patch">;
  timing: { captureMs: number; postMs: number; publishMs: number; statePatchMs?: number; viewPatchMs?: number; freezeMs?: number; recoveryMs?: number;
    workerComputeMs: number; workerDiffMs: number; elapsedMs: number };
}
