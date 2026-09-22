import { validateTags } from '../src/tags'
import { InvalidArgumentError } from '../src'

class NotJson {
  public notJson = true
}

describe('validateTags', () => {
  it('accepts every JSON type, nested to depth', () => {
    expect(() => {
      validateTags({
        string: 'a',
        int: 1,
        double: 1.5,
        bool: true,
        null: null,
        list: [1, 'a', null, { nested: true }],
        map: {
          deep: {
            deeper: ['x'],
          },
        },
      })
    }).not.toThrow()
  })

  it('accepts an empty root map and a nested empty list', () => {
    expect(() => {
      validateTags({})
    }).not.toThrow()
    expect(() => {
      validateTags({
        items: [],
      })
    }).not.toThrow()
  })

  it('rejects a nested value with no JSON form', () => {
    expect(() => {
      validateTags({ value: new NotJson() })
    }).toThrow(InvalidArgumentError)

    try {
      validateTags({ value: new NotJson() })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.message).toContain('JSON-compatible')
      }
    }
  })

  it('rejects a non-string nested map key', () => {
    const nestedMap = new Map<unknown, unknown>([[1, 'a']])
    expect(() => {
      validateTags({ nested: nestedMap })
    }).toThrow(InvalidArgumentError)

    try {
      validateTags({ nested: nestedMap })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.message).toContain('Tags must be JSON-compatible, got Map')
      }
    }
  })

  it('rejects a non-finite number, which has no JSON literal', () => {
    expect(() => {
      validateTags({ value: Number.NaN })
    }).toThrow(InvalidArgumentError)
    expect(() => {
      validateTags({ value: Number.POSITIVE_INFINITY })
    }).toThrow(InvalidArgumentError)
    expect(() => {
      validateTags({ value: Number.NEGATIVE_INFINITY })
    }).toThrow(InvalidArgumentError)
  })

  it('names the path to a rejected value inside a list', () => {
    try {
      validateTags({
        items: [1, new NotJson()],
      })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.path).toBe("tags['items'][1]")
      }
    }
  })

  it('names the path to a rejected value inside a nested map', () => {
    try {
      validateTags({
        outer: { inner: new NotJson() },
      })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.path).toBe("tags['outer']['inner']")
      }
    }
  })

  it('rejects a non-string key nested in a list', () => {
    const nestedMap = new Map<unknown, unknown>([[2, 'a']])
    try {
      validateTags({
        items: [nestedMap],
      })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.path).toBe("tags['items'][0]")
      }
    }
  })

  it('accepts null, meaning no tags', () => {
    expect(() => {
      validateTags(null)
    }).not.toThrow()
  })

  it('accepts undefined, meaning no tags', () => {
    expect(() => {
      validateTags(undefined)
    }).not.toThrow()
  })

  it('rejects a list that contains itself', () => {
    const cyclic: unknown[] = ['a']
    cyclic.push(cyclic)

    try {
      validateTags({ items: cyclic })
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.message).toContain('cannot contain themselves')
      }
    }
  })

  it('rejects a map that contains itself', () => {
    const cyclic: Record<string, unknown> = {}
    cyclic.self = cyclic

    expect(() => {
      validateTags(cyclic)
    }).toThrow(InvalidArgumentError)
  })

  it('rejects a cycle that closes further down', () => {
    const outer: Record<string, unknown> = {}
    outer.items = [{ back: outer }]

    try {
      validateTags(outer)
      throw new Error('Expected validateTags to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidArgumentError)
      if (error instanceof InvalidArgumentError) {
        expect(error.path).toBe("tags['items'][0]['back']")
      }
    }
  })

  it('accepts the same collection twice when it is not a cycle', () => {
    const shared = { nested: true }

    expect(() => {
      validateTags({ left: shared, right: shared })
    }).not.toThrow()

    expect(() => {
      validateTags({
        items: [shared, shared],
      })
    }).not.toThrow()
  })
})
