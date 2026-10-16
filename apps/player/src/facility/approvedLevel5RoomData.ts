import type { ApprovedActorSupport, ApprovedFixturePresentation, ApprovedRoomDrawRecord,
  ApprovedRoomPresentation, ApprovedProceduralDrawRecord } from "./approvedRoomPresentation";
import founder from "./level5/founders-office.json";
import executive from "./level5/executive-office.json";
import gift from "./level5/gift-shop.json";
import garden from "./level5/indoor-garden.json";
import gym from "./level5/staff-gym.json";

export interface ApprovedLevel5Contact {
  readonly id: string;
  readonly world: Readonly<{ x: number; y: number }>;
  readonly standingApproach: Readonly<{ x: number; y: number }>;
  readonly supportId?: string;
  readonly fixtureId?: string;
  readonly necessary: boolean;
}
export interface ApprovedLevel5RoomTier {
  readonly level: number;
  readonly name: string;
  readonly records: readonly ApprovedRoomDrawRecord[];
  readonly supports: readonly ApprovedActorSupport[];
  readonly contacts: readonly ApprovedLevel5Contact[];
  readonly routeClearances: readonly Readonly<{ recordId: string; footprint: Readonly<{ left: number; top: number; width: number; height: number }>; doorOwners: readonly string[] }>[];
  readonly approachRoutes: readonly Readonly<{ openDoorSegments: readonly string[]; doorSegment: string;
    targetId: string; supportId?: string; standingApproach: Readonly<{ x: number; y: number }>;
    logicalPath: readonly (readonly [number, number])[];
    walkingPath: readonly (readonly [number, number])[]; actorRadius: number; step: number;
    seatingTransition: "static-contact-after-walking" | "standing-contact-after-walking" }>[];
}
export interface ApprovedLevel5RoomData extends ApprovedRoomPresentation {
  readonly records: readonly ApprovedRoomDrawRecord[];
  readonly supports: readonly ApprovedActorSupport[];
  readonly contacts: readonly ApprovedLevel5Contact[];
  readonly procedural: readonly ApprovedProceduralDrawRecord[];
  readonly appearanceChanges: boolean;
  readonly tiers: readonly ApprovedLevel5RoomTier[];
  readonly provenance: Readonly<{ receiptPath: string; receiptSha256: string; designSha256: string; geometrySha256: string;
    approved: readonly Readonly<{ source: string; sha256: string }>[] }>;
}
const sources = [founder, executive, gift, garden, gym] as unknown as readonly ApprovedLevel5RoomData[];
export const APPROVED_LEVEL5_ROOM_DATA = new Map(sources.map(room => [room.roomDefinitionId, room]));
export const APPROVED_LEVEL5_ROOM_PRESENTATIONS: readonly ApprovedRoomPresentation[] = sources.map(room => ({
  ...room,
  fixtures: room.records.map((record): ApprovedFixturePresentation => ({
    id: record.id, assetId: record.assetId, collision: record.footprint ? "solid" : "none",
    depth: record.depthPolicy === "wall" ? "wall" : "floor",
    contacts: record.worldLocalGround ? [record.worldLocalGround] : [],
    ...(record.footprint ? { footprint: [record.footprint.left, record.footprint.top, record.footprint.width, record.footprint.height] } : {}),
    doorOwners: record.doorOwners, backedOwners: record.backedOwners, touchupKeepWhenBacked: record.touchupKeepWhenBacked,
  })),
}));

/** Only Founder changes look; future effect purchases remain dormant in M2. */
export function getApprovedLevel5RoomTier(definitionId: string, level = 1): ApprovedLevel5RoomTier | undefined {
  const room = APPROVED_LEVEL5_ROOM_DATA.get(definitionId);
  if (!room) return undefined;
  return room.tiers[room.appearanceChanges ? Math.max(0, Math.min(4, Math.floor(Number.isFinite(level) ? level : 1) - 1)) : 0];
}
