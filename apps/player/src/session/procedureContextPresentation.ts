import { getRoomDefinition, type EncounterState, type GameState } from "@gamify-surgery/game-domain";

const familyLabel = (id: string) => id.replace(/^procedure\./, "").split("_").join(" ");
const recordLabels = {operative_note: "Operative note", anesthesia_record: "Anesthesia record", endoscopy_report: "Endoscopy report"};

/** New optional source information uses the existing desktop/phone chart header. */
export function procedureChartDetails(state: GameState, encounter: EncounterState): string | undefined {
  const declared = encounter.frozenCase.procedureContext;
  if (!declared) return undefined;
  if (declared.mode === "chart_review") return `Hospital record review · ${recordLabels[declared.recordKind]} · ${declared.recordCheckpoint}`;
  if (!encounter.consult) return `Procedure chart · ${familyLabel(declared.familyId)}`;
  const source = state.serviceOperations.find(operation => operation.id === encounter.consult?.serviceOperationId);
  const room = state.rooms.find(room => room.id === encounter.consult?.roomInstanceId);
  const roomName = room ? getRoomDefinition(room.roomDefinitionId)?.displayName : undefined;
  const parent = source?.procedureContext?.pediatricFamilyContext?.parentName;
  return `${declared.kind === "operation" ? "Intra-op" : "Intra-endoscopy"} consult · ${familyLabel(declared.familyId)}${roomName ? ` · ${roomName}` : ""}${parent ? ` · ${parent} available for updates` : ""}`;
}
