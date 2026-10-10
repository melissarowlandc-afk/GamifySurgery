import type {
  ApprovedActorSupport, ApprovedFixturePresentation, ApprovedProceduralDrawRecord,
  ApprovedRoomDrawRecord, ApprovedRoomPresentation,
} from "./approvedRoomPresentation";
import mri from "./level4/mri.json";
import pediatricWaiting from "./level4/pediatric-waiting.json";
import pediatricExam from "./level4/pediatric-exam.json";
import woundOstomy from "./level4/wound-ostomy.json";

export interface ApprovedLevel4RoomData extends ApprovedRoomPresentation {
  readonly records: readonly ApprovedRoomDrawRecord[];
  readonly supports: readonly ApprovedActorSupport[];
  readonly procedural: readonly ApprovedProceduralDrawRecord[];
  readonly approachRoutes: readonly Readonly<{
    doorSegment: string; supportId: string; standingApproach: Readonly<{ x: number; y: number }>;
    walkingPath: readonly (readonly [number, number])[]; actorRadius: number; step: number;
    seatingTransition: "static-contact-after-walking";
  }>[];
  readonly provenance: Readonly<{ receiptPath: string; receiptSha256: string; designSha256: string;
    approved: readonly Readonly<{ source: string; sha256: string }>[] }>;
}

// Active proof placements, without its example actor identities or UI.
const sources = [mri, pediatricWaiting, pediatricExam, woundOstomy] as unknown as readonly ApprovedLevel4RoomData[];
export const APPROVED_LEVEL4_ROOM_DATA = new Map(sources.map((room) => [room.roomDefinitionId, room]));
export const APPROVED_LEVEL4_ROOM_PRESENTATIONS: readonly ApprovedRoomPresentation[] = sources.map((room) => ({
  ...room,
  fixtures: room.records.map((record): ApprovedFixturePresentation => ({
    id: record.id, assetId: record.assetId,
    collision: record.footprint ? "solid" : "none",
    depth: record.depthPolicy === "wall" ? "wall" : "floor",
    contacts: record.worldLocalGround ? [record.worldLocalGround] : [],
    ...(record.footprint ? { footprint: [record.footprint.left, record.footprint.top, record.footprint.width, record.footprint.height] } : {}),
    doorOwners: record.doorOwners, backedOwners: record.backedOwners,
    touchupKeepWhenBacked: record.touchupKeepWhenBacked,
  })),
}));
