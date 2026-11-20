import { deterministicShuffle } from "./randomness";
import type { GameState, InspectionPresentationState } from "./types";

export const INSPECTION_PARTY_SIZE = 10;
export type AttendingReviewerStillId = `inspector-v7a.${string}`;

const programDirector = { stillId: "inspector-v7a.001", displayName: "Dr. Ivascu" } as const;
const attendingRows = [
  ["002", "Dr. Akay"],
  ["003", "Dr. Janczyk"],
  ["004", "Dr. Long"],
  ["005", "Dr. Novotny"],
  ["006", "Dr. Dekhne"],
  ["007", "Dr. Kiran"],
  ["008", "Dr. Shakir"],
  ["009", "Dr. Bauman"],
  ["010", "Dr. Deshmukh"],
  ["011", "Dr. Krasnick"],
  ["012", "Dr. Peeples"],
  ["013", "Dr. Pemmaraju"],
  ["014", "Dr. Shellnut"],
  ["015", "Dr. Wasvary"],
  ["016", "Dr. M Ziegler"],
  ["017", "Dr. Czako"],
  ["018", "Dr. Nagar"],
  ["019", "Dr. DeMare"],
  ["020", "Dr. Chengelis"],
  ["021", "Dr. Krause"],
  ["022", "Dr. K Ziegler"],
  ["023", "Dr. Iacco"],
  ["024", "Dr. Masters"],
  ["025", "Dr. Barnes"],
  ["026", "Dr. J Robbins"],
  ["027", "Dr. M Robbins"],
  ["028", "Dr. Finn"],
  ["029", "Dr. Mangla"],
  ["030", "Dr. Villalba"],
  ["031", "Dr. Cohn"],
  ["032", "Dr. Putchakayala"],
  ["033", "Dr. Zarinsefat"],
  ["034", "Dr. Al-Hadidi"],
  ["035", "Dr. Brahmamdam"],
  ["036", "Dr. Stallion"],
  ["037", "Dr. Coello"],
  ["038", "Dr. Kim"],
  ["039", "Dr. Jamil"],
  ["040", "Dr. Wahl"],
  ["041", "Dr. Watson"],
  ["042", "Dr. Bove"],
  ["043", "Dr. Major"],
  ["044", "Dr. Uzieblo"],
  ["045", "Dr. Frikker"],
  ["046", "Dr. Adeyemo"],
] as const;
const otherAttendings = attendingRows.map(([number, displayName]) => ({
  stillId: `inspector-v7a.${number}` as AttendingReviewerStillId,
  displayName,
}));
export const ATTENDING_REVIEWERS = [programDirector, ...otherAttendings] as const;
const reviewersById = new Map<string, (typeof ATTENDING_REVIEWERS)[number]>(
  ATTENDING_REVIEWERS.map(reviewer => [reviewer.stillId, reviewer]),
);

export function attendingReviewerByStillId(stillId: string | undefined) {
  return stillId === undefined ? undefined : reviewersById.get(stillId);
}

export function isLegacyInspectorStillId(stillId: string): boolean {
  return /^inspector-v6f\.(00[1-9]|010)$/.test(stillId);
}

export function inspectionReviewersForSeed(seed: string) {
  return [
    programDirector,
    ...deterministicShuffle(otherAttendings, seed, "inspection_reviewers.v1", "party").slice(0, INSPECTION_PARTY_SIZE - 1),
  ];
}

export function remapLegacyInspectionReviewers(state: GameState): GameState {
  const levelFive = state.levelFive;
  const presentation = levelFive?.inspectionPresentation;
  if (!levelFive || !presentation?.seed || !presentation.actors.some(actor => isLegacyInspectorStillId(actor.stillId))) return state;
  const reviewers = inspectionReviewersForSeed(presentation.seed);
  const remapped: InspectionPresentationState = {
    ...presentation,
    actors: presentation.actors.map((actor, index) => ({ ...actor, stillId: reviewers[index]!.stillId })),
  };
  return { ...state, levelFive: { ...levelFive, inspectionPresentation: remapped } };
}
