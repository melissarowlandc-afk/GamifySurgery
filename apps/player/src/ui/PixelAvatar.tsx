import type { PixelRoleStyle } from "@gamify-surgery/game-domain";
import { useState } from "react";
import {
  getCharacterPixelFrame,
  getCharacterPortraitFrame,
  type CharacterDirection,
  type CharacterPose,
} from "../art/characterArt";
import {
  characterAtlasCellStyle,
  characterBitmapLayers,
  isPatientV1Appearance,
} from "../art/characterBitmapArt";
import { resolvePublicArtAssetUrl } from "../art/bitmapAssetManifest";
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
  movingRight?: boolean;
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
  representation: "portrait" | "thumbnail" | "full";
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

function AuthoredBitmapAvatar({
  avatar,
  representation,
  direction,
  pose,
  roleStyle,
  onAssetError,
  className = "",
  movingRight = false,
}: {
  avatar: PixelAvatarView;
  representation: "portrait" | "thumbnail" | "full";
  direction: CharacterDirection;
  pose: CharacterPose;
  roleStyle?: PixelRoleStyle;
  onAssetError: () => void;
  className?: string;
  movingRight?: boolean;
}) {
  const layeredPose = representation === "portrait" || representation === "thumbnail"
    ? "idle"
    : pose;
  const bitmapRepresentation = representation === "thumbnail"
    ? "thumbnail"
    : representation === "portrait"
      ? "portrait"
      : undefined;
  const layers = characterBitmapLayers(
    { ...avatar, roleStyle: roleStyle ?? avatar.roleStyle },
    representation === "portrait" || representation === "thumbnail" ? "front" : direction,
    layeredPose,
    movingRight,
    bitmapRepresentation,
  );
  return (
    <span
      className={`pixel-avatar-authored ${className}`.trim()}
      data-art-source={
        layers.actor.atlas.id.includes("patients-")
          ? "canonical-patient-atlas-v1"
          : layers.actor.atlas.id.includes("founders-")
          ? "canonical-founder-atlas-v4"
          : "canonical-character-atlas-v3"
      }
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
        imageRendering: "auto",
      }}
    >
      <span
        aria-hidden="true"
        className="pixel-avatar-authored-actor"
        style={{
          ...characterAtlasCellStyle(layers.actor),
          position: "absolute",
          left: "0%",
          top: "0%",
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "auto",
        }}
      />
      {/* A hidden image provides a reliable browser load-error signal while
          spans retain exact background-position atlas cropping. */}
      <img
        alt=""
        aria-hidden="true"
        src={layers.actor.atlas.relativePath
          ? resolvePublicArtAssetUrl(layers.actor.atlas.relativePath)
          : undefined}
        onError={onAssetError}
        style={{ display: "none" }}
      />
    </span>
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
  movingRight = false,
}: PixelAvatarProps) {
  const starJump = animation === "star-jump";
  const patientThumbnail = representation === "portrait" &&
    size === "small" &&
    isPatientV1Appearance({ ...avatar, roleStyle: roleStyle ?? avatar.roleStyle });
  const [assetFailed, setAssetFailed] = useState(false);
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
      {!assetFailed && starJump ? (
        <>
          <AuthoredBitmapAvatar
            avatar={avatar}
            representation={representation}
            direction={direction}
            pose="jump-recovery"
            roleStyle={roleStyle}
            movingRight={movingRight}
            className="pixel-avatar-frame-a"
            onAssetError={() => setAssetFailed(true)}
          />
          <AuthoredBitmapAvatar
            avatar={avatar}
            representation={representation}
            direction={direction}
            pose="star-jump"
            roleStyle={roleStyle}
            movingRight={movingRight}
            className="pixel-avatar-frame-b"
            onAssetError={() => setAssetFailed(true)}
          />
        </>
      ) : !assetFailed ? (
        <AuthoredBitmapAvatar
          avatar={avatar}
          representation={patientThumbnail ? "thumbnail" : representation}
          direction={direction}
          pose={pose}
          roleStyle={roleStyle}
          movingRight={movingRight}
          className="pixel-avatar-frame-a"
          onAssetError={() => setAssetFailed(true)}
        />
      ) : (
        <PixelFrameSvg
          avatar={avatar}
          representation={representation}
          direction={direction}
          pose={starJump ? "idle" : pose}
          className="pixel-avatar-svg pixel-avatar-frame-a"
          roleStyle={roleStyle}
        />
      )}
      {starJump && assetFailed ? (
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
