import { ApiKeyRequiredError, JsonParsingError, UnknownError, unwrapError } from '../src/errors'

describe('unwrapError function', () => {
  it('should return ApiKeyRequiredError when TokenRequired error passed', () => {
    const error = unwrapError(new Error('TokenRequired:some message'))
    expect(error).toBeInstanceOf(ApiKeyRequiredError)
    expect(error.message).toBe('some message')
  })

  it('should return UnknownError with full message inside when something unknown passed', () => {
    const error = unwrapError(new Error('Something broken'))
    expect(error).toBeInstanceOf(UnknownError)
    expect(error.message).toBe('Something broken')
  })

  it('should keep error message full even with ":" inside', () => {
    const error = unwrapError(new Error('JsonParsingError:some:strange:message'))
    expect(error).toBeInstanceOf(JsonParsingError)
    expect(error.message).toBe('some:strange:message')
  })
})
