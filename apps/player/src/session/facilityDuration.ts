/** Display precision only; frozen work and facility clocks retain their fractions. */
export function formatFacilityDuration(value: number): string {
  if (value >= 60 && value % 60 === 0) {
    const hours = value / 60;
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  const rounded = Number(value.toFixed(3));
  // Multiplying approved modifiers can leave binary float noise. That is not
  // a meaningful rounding of the quoted duration.
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(value)) * 8;
  const approximate = Math.abs(value - rounded) > tolerance;
  return `${approximate ? "≈" : ""}${rounded} min`;
}
