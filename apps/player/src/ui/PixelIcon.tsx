import { PIXEL_ICONS, type PixelIconName } from "../art/iconArt";
import { PIXEL_PALETTE } from "../art/pixelPalette";

interface PixelIconProps {
  name: PixelIconName;
  label?: string;
  className?: string;
}

export function PixelIcon({
  name,
  label,
  className = "",
}: PixelIconProps) {
  const sprite = PIXEL_ICONS[name];
  return (
    <span
      className={`pixel-icon ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox={`0 0 ${sprite.width} ${sprite.height}`}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
        focusable="false"
        aria-hidden="true"
      >
        {sprite.cells.map((cell) => (
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
    </span>
  );
}
