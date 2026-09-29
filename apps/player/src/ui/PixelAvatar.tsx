import type { PixelRoleStyle } from "@gamify-surgery/game-domain";
import { useEffect, useMemo, useState } from "react";
import type { CharacterDirection, CharacterPose } from "../art/characterArt";
import { characterBitmapLayers } from "../art/characterBitmapArt";
import { resolveCharacterStillAssetUrl } from "../art/characterStillRegistry";
import type { PixelAvatarView } from "./types";

interface PixelAvatarProps {
  avatar?: PixelAvatarView;
  label: string;
  size?: "small" | "medium" | "large";
  className?: string;
  representation?: "portrait" | "full";
  direction?: CharacterDirection;
  pose?: CharacterPose;
  roleStyle?: PixelRoleStyle;
  movingRight?: boolean;
}

const FALLBACK_AVATAR: PixelAvatarView = {
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
  hairShade: 3, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
  accessory: "none", headVariant: 0, bodyVariant: 0, roleStyle: "patient",
};

export function PixelAvatar({
  avatar = FALLBACK_AVATAR,
  label,
  size = "medium",
  className = "",
  representation = "portrait",
  direction = "front",
  pose = "idle",
  roleStyle,
  movingRight = false,
}: PixelAvatarProps) {
  const layers = useMemo(() => characterBitmapLayers(
    { ...avatar, roleStyle: roleStyle ?? avatar.roleStyle },
    representation === "portrait" ? "front" : direction,
    representation === "portrait" ? "idle" : pose,
    movingRight,
  ), [avatar, direction, movingRight, pose, representation, roleStyle]);
  const src = layers ? resolveCharacterStillAssetUrl(layers.actor.asset) : undefined;
  const [assetFailed, setAssetFailed] = useState(false);
  useEffect(() => setAssetFailed(false), [src]);

  return (
    <span
      className={`pixel-avatar pixel-avatar-${size} is-${representation} is-idle ${className}`.trim()}
      data-role={roleStyle ?? avatar.roleStyle ?? "patient"}
      data-still-id={layers?.actor.stillId ?? avatar.stillId ?? "unavailable"}
      data-art-source={layers ? "gs026-character-still-v1" : "neutral-placeholder"}
      role="img"
      aria-label={label}
    >
      {src && !assetFailed ? (
        <img
          className="pixel-avatar-still"
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setAssetFailed(true)}
        />
      ) : (
        <span className="pixel-avatar-neutral" aria-hidden="true" />
      )}
    </span>
  );
}
