import type { CSSProperties } from "react";
import type { PixelAvatarView } from "./types";

interface PixelAvatarProps {
  avatar?: PixelAvatarView;
  label: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const FALLBACK_AVATAR: PixelAvatarView = {
  version: "pixel-avatar.v1",
  bodyShape: "average",
  hairStyle: "short",
  hairShade: 3,
  faceStyle: "round",
  outfitStyle: "plain",
  outfitShade: 1,
  accessory: "none",
};

const HAIR_TONES = ["#e6e6e0", "#a6a6a0", "#60605c", "#191918"];
const CLOTHING_TONES = ["#f2f2ed", "#c8c8c2", "#777772", "#252523"];

/**
 * Reusable large-pixel portrait assembled from CSS shapes. The same persisted
 * descriptor can be projected into Phaser so a person remains recognizable
 * in the chart and on the facility map.
 */
export function PixelAvatar({
  avatar = FALLBACK_AVATAR,
  label,
  size = "medium",
  className = "",
}: PixelAvatarProps) {
  const style = {
    "--avatar-face": "#d8d8d2",
    "--avatar-hair": HAIR_TONES[avatar.hairShade],
    "--avatar-clothes": CLOTHING_TONES[avatar.outfitShade],
  } as CSSProperties;

  return (
    <span
      className={`pixel-avatar pixel-avatar-${size} ${className}`.trim()}
      style={style}
      data-hair={avatar.hairStyle}
      data-accessory={avatar.accessory}
      data-body={avatar.bodyShape}
      data-face={avatar.faceStyle}
      data-outfit={avatar.outfitStyle}
      role="img"
      aria-label={label}
    >
      <span className="pixel-avatar-shadow" aria-hidden="true" />
      <span className="pixel-avatar-body" aria-hidden="true">
        <span className="pixel-avatar-neck" />
        <span className="pixel-avatar-shirt" />
        <span className="pixel-avatar-collar" />
        <span className="pixel-avatar-arm is-left" />
        <span className="pixel-avatar-arm is-right" />
        <span className="pixel-avatar-leg is-left" />
        <span className="pixel-avatar-leg is-right" />
      </span>
      <span className="pixel-avatar-head" aria-hidden="true">
        <span className="pixel-avatar-hair" />
        <span className="pixel-avatar-ear is-left" />
        <span className="pixel-avatar-ear is-right" />
        <span className="pixel-avatar-brow is-left" />
        <span className="pixel-avatar-brow is-right" />
        <span className="pixel-avatar-eye is-left" />
        <span className="pixel-avatar-eye is-right" />
        <span className="pixel-avatar-nose" />
        <span className="pixel-avatar-mouth" />
        <span className="pixel-avatar-accessory" />
      </span>
    </span>
  );
}
