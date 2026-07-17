export function isDefined<T>(value?: T): value is NonNullable<T> {
  return value !== undefined && value !== null
}

export function isTruthy<T>(value?: T | null): value is T {
  return Boolean(value)
}
