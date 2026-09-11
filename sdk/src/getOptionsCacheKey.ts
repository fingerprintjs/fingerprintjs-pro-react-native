import { UseVisitorDataOptions } from './useVisitorData'

function sortObjectKeys(value: unknown, seen = new Set<object>()): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeys(item, seen))
  }

  if (value !== null && typeof value === 'object') {
    if (seen.has(value)) {
      throw new TypeError('Cannot serialize a circular value')
    }

    seen.add(value)
    const sortedValue = Object.fromEntries(
      Object.entries(value)
        .sort(([leftKey], [rightKey]) => (leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0))
        .map(([key, item]) => [key, sortObjectKeys(item, seen)])
    )
    seen.delete(value)

    return sortedValue
  }

  return value
}

function serializeCacheValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined:'
  }

  if (value === null) {
    return 'null:'
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return `${typeof value}:${String(value)}`
  }

  try {
    return `json:${JSON.stringify(sortObjectKeys(value))}`
  } catch {
    return `unserializable:${typeof value}`
  }
}

/**
 * Stable (cache) key for `GetOptions` object used for request deduplication and semantic equality.
 */
export function getOptionsCacheKey(options?: UseVisitorDataOptions): string {
  if (!options) {
    return ''
  }

  return JSON.stringify([
    serializeCacheValue(options.tags),
    serializeCacheValue(options.linkedId),
    serializeCacheValue(options.timeout),
  ])
}

export function areGetOptionsEqual(a: UseVisitorDataOptions, b: UseVisitorDataOptions): boolean {
  return getOptionsCacheKey(a) === getOptionsCacheKey(b)
}
