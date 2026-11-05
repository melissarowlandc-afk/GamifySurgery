/** Adopt an owned worker result while retaining frozen shared branches. Avoid
 * allocating a temporary values array for every changed JSON object/row. */
export function freezeOperationalValue<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const key in value) if (Object.hasOwn(value, key)) freezeOperationalValue(value[key]);
    Object.freeze(value);
  }
  return value;
}
