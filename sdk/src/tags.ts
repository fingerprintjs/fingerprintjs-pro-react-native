import { InvalidArgumentError } from './errors'
import { isDefined } from './utils'

function getTypeName(value: unknown): string {
  if (value === null) {
    return 'null'
  }
  if (value === undefined) {
    return 'undefined'
  }
  if (typeof value === 'object') {
    if ('constructor' in value && typeof value.constructor === 'function') {
      const name = value.constructor.name
      if (typeof name === 'string' && name.length > 0 && name !== 'Object') {
        return name
      }
    }
    return 'Object'
  }
  return typeof value
}

function isPlainObject(value: unknown): value is Record<string | symbol, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const proto: unknown = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

function checkNotEnclosing(collection: unknown, path: string, enclosing: unknown[]): void {
  if (enclosing.includes(collection)) {
    throw new InvalidArgumentError(collection, path, 'Tags cannot contain themselves')
  }
}

function validate(value: unknown, path: string, enclosing: unknown[]): void {
  if (value === null || value === undefined || typeof value === 'string' || typeof value === 'boolean') {
    return
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new InvalidArgumentError(value, path, 'Tags cannot hold a non-finite number')
    }
    return
  }

  if (Array.isArray(value)) {
    checkNotEnclosing(value, path, enclosing)
    enclosing.push(value)
    for (let index = 0; index < value.length; index++) {
      validate(value[index], `${path}[${index.toString()}]`, enclosing)
    }
    enclosing.pop()
    return
  }

  if (isPlainObject(value)) {
    checkNotEnclosing(value, path, enclosing)
    enclosing.push(value)
    const symbols = Object.getOwnPropertySymbols(value)
    if (symbols.length > 0) {
      throw new InvalidArgumentError(symbols[0], path, `Tag map keys must be strings, got ${getTypeName(symbols[0])}`)
    }
    for (const [key, entryValue] of Object.entries(value)) {
      validate(entryValue, `${path}['${key}']`, enclosing)
    }
    enclosing.pop()
    return
  }

  throw new InvalidArgumentError(value, path, `Tags must be JSON-compatible, got ${getTypeName(value)}`)
}

/**
 * Throws an {@link InvalidArgumentError} unless `tags` is recursively JSON-compatible.
 *
 * Root is a string-keyed map or primitive. Values may be string, number, boolean, null,
 * array, or nested maps. Rejects non-JSON objects, non-string keys, non-finite numbers, and cycles.
 */
export function validateTags(tags?: unknown): void {
  if (isDefined(tags)) {
    validate(tags, 'tags', [])
  }
}
