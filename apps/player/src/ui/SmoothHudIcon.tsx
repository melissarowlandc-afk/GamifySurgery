export type SmoothHudIconKind =
  | "learning"
  | "money"
  | "satisfaction"
  | "time";

interface SmoothHudIconProps {
  kind: SmoothHudIconKind;
  mood?: "happy" | "steady" | "sad";
}

/**
 * Quiet, scale-independent HUD symbols. These deliberately use smooth SVG
 * strokes instead of the shared pixel-sprite icon library so the resource bar
 * remains a visual-rest area beside the illustrated clinic.
 */
export function SmoothHudIcon({
  kind,
  mood = "steady",
}: SmoothHudIconProps) {
  const sharedProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.75,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      className={`smooth-hud-icon is-${kind}`}
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
      data-smooth-hud-icon={kind}
    >
      {kind === "learning" ? (
        <>
          <path {...sharedProps} d="m4.25 19.75 8.9-8.9 3.95 3.95-8.9 8.9H4.25z" />
          <path {...sharedProps} d="m13.15 10.85 5.35-7.8 2.45 2.45-7.8 5.35" />
          <path {...sharedProps} d="m6.45 17.55 3.95 3.95" />
        </>
      ) : null}

      {kind === "money" ? (
        <>
          <path {...sharedProps} d="M8.15 4.15h7.7l-1.6 3.1h-4.5z" />
          <path
            {...sharedProps}
            d="M9.75 7.25C6.7 9.3 5.2 12 5.2 15.25c0 3.4 2.55 5.6 6.8 5.6s6.8-2.2 6.8-5.6c0-3.25-1.5-5.95-4.55-8"
          />
          <path {...sharedProps} d="M9.25 15.9c.55.55 1.45.85 2.65.85 1.35 0 2.2-.55 2.2-1.4 0-2.15-4.3-.85-4.3-3.05 0-.85.8-1.45 2.15-1.45 1.05 0 1.85.25 2.45.75M12 9.65v8.3" />
        </>
      ) : null}

      {kind === "satisfaction" ? (
        <>
          <circle {...sharedProps} cx="12" cy="12" r="8.75" />
          <path {...sharedProps} d="M8.65 9.4h.05M15.3 9.4h.05" />
          {mood === "happy" ? (
            <path {...sharedProps} d="M8.25 14.05c.8 1.7 2.05 2.55 3.75 2.55s2.95-.85 3.75-2.55" />
          ) : mood === "sad" ? (
            <path {...sharedProps} d="M8.25 16.25c.8-1.7 2.05-2.55 3.75-2.55s2.95.85 3.75 2.55" />
          ) : (
            <path {...sharedProps} d="M8.75 15.15h6.5" />
          )}
        </>
      ) : null}

      {kind === "time" ? (
        <>
          <circle {...sharedProps} cx="12" cy="12" r="8.75" />
          <path {...sharedProps} d="M12 7.15v5.25l3.4 2.1" />
          <path {...sharedProps} d="M8.65 2.9h6.7" />
        </>
      ) : null}
    </svg>
  );
}
