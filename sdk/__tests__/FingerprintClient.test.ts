import { NativeModules } from 'react-native'
import { FingerprintError, start } from '../src'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const { getVisitorData } = NativeModules.RNFingerprintjsPro as unknown as Record<string, jest.Mock>

const nativeResponse = {
  visitorId: 'some-visitor-id',
  eventId: 'some-event-id',
  suspectScore: 42,
  sealedResult: 'sealed-base64',
}

describe('start().get()', () => {
  beforeEach(() => {
    getVisitorData.mockReset()
    getVisitorData.mockResolvedValue(nativeResponse)
  })

  it('normalizes the native response into the snake_case shape', async () => {
    const result = await start({ apiKey: 'key' }).get()

    expect(result).toStrictEqual({
      visitor_id: 'some-visitor-id',
      event_id: 'some-event-id',
      suspect_score: 42,
      sealed_result: 'sealed-base64',
    })
  })

  it('maps a negative suspectScore to undefined and empty sealedResult to null', async () => {
    getVisitorData.mockResolvedValueOnce({
      visitorId: 'v',
      eventId: 'e',
      suspectScore: -1,
      sealedResult: '',
    })

    const result = await start({ apiKey: 'key' }).get()

    expect(result.suspect_score).toBeUndefined()
    expect(result.sealed_result).toBeNull()
  })

  it('passes an object tag through unchanged, plus linkedId and timeout', async () => {
    const tag = { userAction: 'login', count: 1, ok: true }
    await start({ apiKey: 'key' }).get({ tags: tag, linkedId: 'user_1234', timeout: 15_000 })

    expect(getVisitorData).toHaveBeenCalledWith(tag, 'user_1234', 15_000)
  })

  it('wraps a primitive tag under a `tag` key for the native contract', async () => {
    await start({ apiKey: 'key' }).get({ tags: 'login' })

    expect(getVisitorData).toHaveBeenCalledWith({ tag: 'login' }, null, null)
  })

  it('sends nulls when no options are provided', async () => {
    await start({ apiKey: 'key' }).get()

    expect(getVisitorData).toHaveBeenCalledWith(null, null, null)
  })

  it('rejects with a FingerprintError carrying the parsed code', async () => {
    getVisitorData.mockRejectedValueOnce(Object.assign(new Error('Rate limit reached'), { code: 'too_many_requests' }))

    const error = await start({ apiKey: 'key' })
      .get()
      .catch((e: unknown) => e)

    expect(error).toBeInstanceOf(FingerprintError)
    expect(error).toMatchObject({
      name: 'FingerprintError',
      code: 'too_many_requests',
      message: 'Rate limit reached',
    })
  })
})
