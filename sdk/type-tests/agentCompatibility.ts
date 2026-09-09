import * as Fingerprint from '@fingerprint/agent'
import * as SdkTypes from '../src/types'

const startOptions: SdkTypes.StartOptions = {
  apiKey: '',
}

const getOptions: SdkTypes.GetOptions = {}

// Call agent from @fingerprint/agent to verify type compatibility with SDK
void Fingerprint.start(startOptions).get(getOptions)
