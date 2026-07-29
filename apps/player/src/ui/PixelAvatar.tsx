import type { PixelRoleStyle } from "@gamify-surgery/game-domain";
import {
  getCharacterPixelFrame,
  getCharacterPortraitFrame,
  type CharacterDirection,
  type CharacterPose,
} from "../art/characterArt";
import { PIXEL_PALETTE } from "../art/pixelPalette";
import type { PixelAvatarView } from "./types";

interface PixelAvatarProps {
  avatar?: PixelAvatarView;
  label: string;
  size?: "small" | "medium" | "large";
  className?: string;
  representation?: "portrait" | "full";
  direction?: CharacterDirection;
  pose?: CharacterPose;
  animation?: "idle" | "star-jump";
  roleStyle?: PixelRoleStyle;
}

const FALLBACK_AVATAR: PixelAvatarView = {
  version: "pixel-avatar.v1",
  bodyShape: "average",
  hairStyle: "short",
  skinTone: 1,
  hairShade: 3,
  faceStyle: "round",
  outfitStyle: "plain",
  outfitShade: 1,
  accessory: "none",
  headVariant: 0,
  bodyVariant: 0,
  roleStyle: "patient",
};

function PixelFrameSvg({
  avatar,
  representation,
  direction,
  pose,
  className,
  roleStyle,
}: {
  avatar: PixelAvatarView;
  representation: "portrait" | "full";
  direction: CharacterDirection;
  pose: CharacterPose;
  className: string;
  roleStyle?: PixelRoleStyle;
}) {
  const portrait = representation === "portrait";
  const frame = portrait
    ? getCharacterPortraitFrame(avatar, roleStyle)
    : getCharacterPixelFrame(avatar, {
        direction,
        pose,
        roleStyle,
      });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {frame.cells.map((cell) => (
        <rect
          key={`${cell.x}:${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill={PIXEL_PALETTE[cell.color]}
        />
      ))}
    </svg>
  );
}

/**
 * Canonical character representation.
 *
 * Portraits, founder previews, the happy ending, visual QA, and Phaser map
 * sprites all consume the exact same persisted descriptor. Portraits use a
 * dedicated higher-detail bust renderer, while map sprites use directional
 * full-body frames; neither path invents a second identity.
 */
export function PixelAvatar({
  avatar = FALLBACK_AVATAR,
  label,
  size = "medium",
  className = "",
  representation = "portrait",
  direction = "front",
  pose = "idle",
  animation = "idle",
  roleStyle,
}: PixelAvatarProps) {
  const starJump = animation === "star-jump";
  return (
    <span
      className={`pixel-avatar pixel-avatar-${size} is-${representation}${
        starJump ? " is-star-jump" : " is-idle"
      } ${className}`.trim()}
      data-role={roleStyle ?? avatar.roleStyle ?? "patient"}
      data-appearance={`${avatar.skinTone ?? "legacy"}-${
        avatar.headVariant ?? "legacy"
      }-${avatar.bodyVariant ?? "legacy"}`}
      role="img"
      aria-label={label}
    >
      <PixelFrameSvg
        avatar={avatar}
        representation={representation}
        direction={direction}
        pose={starJump ? "idle" : pose}
        className="pixel-avatar-svg pixel-avatar-frame-a"
        roleStyle={roleStyle}
      />
      {starJump ? (
        <PixelFrameSvg
          avatar={avatar}
          representation={representation}
          direction={direction}
          pose="star-jump"
          className="pixel-avatar-svg pixel-avatar-frame-b"
          roleStyle={roleStyle}
        />
      ) : null}
    </span>
  );
}
