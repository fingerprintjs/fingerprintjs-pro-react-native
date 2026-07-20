import { deepEqual, isDefined, isTruthy } from '../src/utils'

describe('isDefined', () => {
  it('returns false for undefined and null', () => {
    expect(isDefined(undefined)).toBe(false)
    expect(isDefined(null)).toBe(false)
  })

  it('returns true for falsy-but-defined values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined(NaN)).toBe(true)
  })
})

describe('isTruthy', () => {
  it('returns false for falsy values', () => {
    expect(isTruthy(undefined)).toBe(false)
    expect(isTruthy(null)).toBe(false)
    expect(isTruthy(0)).toBe(false)
    expect(isTruthy('')).toBe(false)
    expect(isTruthy(false)).toBe(false)
  })

  it('returns true for truthy values', () => {
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy('a')).toBe(true)
    expect(isTruthy({})).toBe(true)
  })
})

describe('deepEqual', () => {
  describe('primitives', () => {
    it('treats identical primitives as equal', () => {
      expect(deepEqual(1, 1)).toBe(true)
      expect(deepEqual('a', 'a')).toBe(true)
      expect(deepEqual(true, true)).toBe(true)
      expect(deepEqual(null, null)).toBe(true)
      expect(deepEqual(undefined, undefined)).toBe(true)
    })

    it('treats different primitives as not equal', () => {
      expect(deepEqual(1, 2)).toBe(false)
      expect(deepEqual('a', 'b')).toBe(false)
      expect(deepEqual(true, false)).toBe(false)
      expect(deepEqual(0, '0')).toBe(false)
      expect(deepEqual(null, undefined)).toBe(false)
      expect(deepEqual(1, '1')).toBe(false)
    })

    it('treats NaN as equal to NaN', () => {
      expect(deepEqual(NaN, NaN)).toBe(true)
    })

    it('does not treat NaN as equal to other numbers', () => {
      expect(deepEqual(NaN, 1)).toBe(false)
      expect(deepEqual(1, NaN)).toBe(false)
    })
  })

  describe('objects vs non-objects', () => {
    it('returns false when only one side is an object', () => {
      expect(deepEqual({}, 1)).toBe(false)
      expect(deepEqual(1, {})).toBe(false)
      expect(deepEqual({}, null)).toBe(false)
      expect(deepEqual(null, {})).toBe(false)
    })

    it('returns false for values with different constructors', () => {
      expect(deepEqual([], {})).toBe(false)
      expect(deepEqual(new Map(), new Set())).toBe(false)
    })
  })

  describe('plain objects', () => {
    it('treats structurally equal objects as equal', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    })

    it('ignores key order', () => {
      expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    })

    it('compares nested objects recursively', () => {
      expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true)
      expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false)
    })

    it('returns false when key counts differ', () => {
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    })

    it('returns false when a key is missing on the other side', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false)
    })

    it('returns false when values differ', () => {
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    })

    it('distinguishes undefined values from missing keys', () => {
      expect(deepEqual({ a: undefined }, {})).toBe(false)
    })

    it('treats empty objects as equal', () => {
      expect(deepEqual({}, {})).toBe(true)
    })
  })

  describe('arrays', () => {
    it('treats equal arrays as equal', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(deepEqual([], [])).toBe(true)
    })

    it('returns false for arrays of different length', () => {
      expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    })

    it('is order-sensitive', () => {
      expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false)
    })

    it('compares nested arrays recursively', () => {
      expect(deepEqual([[1], [2, 3]], [[1], [2, 3]])).toBe(true)
      expect(deepEqual([[1], [2, 3]], [[1], [2, 4]])).toBe(false)
    })

    it('compares arrays of objects', () => {
      expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
      expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
    })
  })

  describe('Map', () => {
    it('treats equal maps as equal', () => {
      const a = new Map([
        ['x', 1],
        ['y', 2],
      ])
      const b = new Map([
        ['y', 2],
        ['x', 1],
      ])
      expect(deepEqual(a, b)).toBe(true)
    })

    it('returns false for maps of different size', () => {
      expect(deepEqual(new Map([['x', 1]]), new Map())).toBe(false)
    })

    it('returns false when a key is missing', () => {
      expect(deepEqual(new Map([['x', 1]]), new Map([['y', 1]]))).toBe(false)
    })

    it('compares values deeply', () => {
      expect(deepEqual(new Map([['x', { a: 1 }]]), new Map([['x', { a: 1 }]]))).toBe(true)
      expect(deepEqual(new Map([['x', { a: 1 }]]), new Map([['x', { a: 2 }]]))).toBe(false)
    })
  })

  describe('Set', () => {
    it('treats equal sets as equal regardless of insertion order', () => {
      expect(deepEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true)
    })

    it('returns false for sets of different size', () => {
      expect(deepEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false)
    })

    it('returns false when a member is missing', () => {
      expect(deepEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false)
    })
  })

  describe('typed arrays', () => {
    it('treats equal typed arrays as equal', () => {
      expect(deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true)
    })

    it('returns false for typed arrays with different contents', () => {
      expect(deepEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false)
    })

    it('returns false for typed arrays of different length', () => {
      expect(deepEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false)
    })

    it('distinguishes typed arrays of different constructors', () => {
      expect(deepEqual(new Uint8Array([1, 2, 3]), new Int8Array([1, 2, 3]))).toBe(false)
    })

    it('compares multi-byte typed arrays', () => {
      expect(deepEqual(new Uint32Array([1, 2, 3]), new Uint32Array([1, 2, 3]))).toBe(true)
      expect(deepEqual(new Uint32Array([1, 2, 3]), new Uint32Array([1, 2, 4]))).toBe(false)
    })
  })

  describe('RegExp', () => {
    it('treats equal regexes as equal', () => {
      expect(deepEqual(/abc/gi, /abc/gi)).toBe(true)
    })

    it('returns false when source differs', () => {
      expect(deepEqual(/abc/, /abd/)).toBe(false)
    })

    it('returns false when flags differ', () => {
      expect(deepEqual(/abc/g, /abc/i)).toBe(false)
    })
  })

  describe('objects with custom valueOf', () => {
    it('treats dates with equal timestamps as equal', () => {
      expect(deepEqual(new Date('2020-01-01'), new Date('2020-01-01'))).toBe(true)
    })

    it('returns false for dates with different timestamps', () => {
      expect(deepEqual(new Date('2020-01-01'), new Date('2021-01-01'))).toBe(false)
    })
  })

  describe('objects with custom toString', () => {
    class Version {
      constructor(private readonly value: string) {}
      toString(): string {
        return this.value
      }
    }

    it('compares via toString when valueOf is not overridden', () => {
      expect(deepEqual(new Version('1.0.0'), new Version('1.0.0'))).toBe(true)
      expect(deepEqual(new Version('1.0.0'), new Version('2.0.0'))).toBe(false)
    })
  })

  it('does not treat different container types as equal', () => {
    expect(deepEqual({ 0: 1, 1: 2, length: 2 }, [1, 2])).toBe(false)
  })

  it('treats the same reference as equal', () => {
    const shared = { a: { b: 1 } }
    expect(deepEqual(shared, shared)).toBe(true)
  })
})
