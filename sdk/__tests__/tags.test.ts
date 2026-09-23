import { validateTags } from '../src/tags'

describe('validateTags', () => {
  it.each([Infinity, -Infinity, NaN])('rejects invalid numeric values', (value) => {
    expect(() => {
      validateTags(value)
    }).toThrow(new TypeError('tags must be a finite number'))
  })

  it.each([Infinity, -Infinity, NaN])('rejects nested invalid numeric values', (value) => {
    expect(() => {
      validateTags({
        value: {
          numeric: value,
        },
      })
    }).toThrow(new TypeError("tags['value']['numeric'] must be a finite number"))
  })
})
