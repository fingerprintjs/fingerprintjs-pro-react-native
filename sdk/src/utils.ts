export function isDefined<T>(value: T | undefined): value is NonNullable<T> {
  return value !== undefined && value !== null
}

export function isTruthy<T>(value: T | undefined | null): value is T {
  return Boolean(value)
}
