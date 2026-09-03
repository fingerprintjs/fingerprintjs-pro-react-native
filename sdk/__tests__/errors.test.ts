import { FingerprintError, isFingerprintError } from '../src/errors'
import { unwrapError } from '../src/unwrapError'
import { unwrapError as unwrapWebError } from '../src/unwrapError.web'

describe('unwrapError (native)', () => {
  it('parses the "<code>:<message>" format into a FingerprintError', () => {
    const error = unwrapError(new Error('too_many_requests:Rate limit reached'))
    expect(error).toBeInstanceOf(FingerprintError)
    expect(error.code).toBe('too_many_requests')
    expect(error.message).toBe('Rate limit reached')
    expect(error.event_id).toBeNull()
  })

  it('parses the "<code>|<eventId>:<message>" format, restoring the event id', () => {
    const error = unwrapError(new Error('too_many_requests|evt_123:Rate limit reached'))
    expect(error.code).toBe('too_many_requests')
    expect(error.message).toBe('Rate limit reached')
    expect(error.event_id).toBe('evt_123')
  })

  it('falls back to unknown_error and keeps the full message when there is no code', () => {
    const error = unwrapError(new Error('Something broken'))
    expect(error).toBeInstanceOf(FingerprintError)
    expect(error.code).toBe('unknown_error')
    expect(error.message).toBe('Something broken')
  })

  it('keeps the message intact even with ":" inside it', () => {
    const error = unwrapError(new Error('bad_response_format:some:strange:message'))
    expect(error.code).toBe('bad_response_format')
    expect(error.message).toBe('some:strange:message')
  })

  it('returns the same instance when a FingerprintError is passed through', () => {
    const original = new FingerprintError({ code: 'failed', message: 'boom' })
    expect(unwrapError(original)).toBe(original)
  })
})

describe('unwrapError (web)', () => {
  /**
   * Builds an error shaped like the one thrown by `@fingerprint/agent`.
   */
  function makeAgentError(code: string, message: string, event_id: string | null = null): Error {
    const error = new Error(message)
    error.name = 'FingerprintError'
    Object.assign(error, { code, event_id })
    return error
  }

  it('re-wraps an agent FingerprintError, preserving code, message and event_id', () => {
    const error = unwrapWebError(makeAgentError('too_many_requests', 'Rate limit reached', 'evt_123'))
    expect(error).toBeInstanceOf(FingerprintError)
    expect(error.name).toBe('FingerprintError')
    expect(error.code).toBe('too_many_requests')
    expect(error.message).toBe('Rate limit reached')
    expect(error.event_id).toBe('evt_123')
  })

  it('preserves a null event_id from the agent error', () => {
    const error = unwrapWebError(makeAgentError('failed', 'boom'))
    expect(error.code).toBe('failed')
    expect(error.event_id).toBeNull()
  })

  it('wraps a plain Error as unknown_error with a null event_id', () => {
    const error = unwrapWebError(new Error('boom'))
    expect(error).toBeInstanceOf(FingerprintError)
    expect(error.code).toBe('unknown_error')
    expect(error.message).toBe('boom')
    expect(error.event_id).toBeNull()
  })

  it('wraps a non-error value as unknown_error', () => {
    const error = unwrapWebError('nope')
    expect(error).toBeInstanceOf(FingerprintError)
    expect(error.code).toBe('unknown_error')
    expect(error.message).toBe('nope')
  })

  it('returns the same instance when the SDK FingerprintError is passed through', () => {
    const original = new FingerprintError({ code: 'failed', message: 'boom', event_id: 'evt_9' })
    expect(unwrapWebError(original)).toBe(original)
  })
})

describe('isFingerprintError', () => {
  it('recognizes a FingerprintError', () => {
    expect(isFingerprintError(new FingerprintError({ code: 'failed' }))).toBe(true)
  })

  it('rejects a plain Error and non-errors', () => {
    expect(isFingerprintError(new Error('nope'))).toBe(false)
    expect(isFingerprintError({ code: 'failed' })).toBe(false)
    expect(isFingerprintError(null)).toBe(false)
  })
})
