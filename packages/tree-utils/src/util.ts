export const isPlainObject = <V>(
  value: unknown,
): value is Record<PropertyKey, V> =>
  !!value && typeof value === "object" && !Array.isArray(value)
