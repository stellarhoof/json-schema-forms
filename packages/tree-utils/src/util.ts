export const isPlainObject = <V>(value: unknown): value is Record<any, V> =>
  !!value && typeof value === "object" && !Array.isArray(value)
