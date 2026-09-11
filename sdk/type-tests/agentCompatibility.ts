/* eslint-disable @typescript-eslint/no-unused-vars */

import type { GetOptions as AgentGetOptions, StartOptions as AgentStartOptions } from '@fingerprint/agent'
import type { CacheConfig, GetOptions as SdkGetOptions, UrlHashing, WebStartOptions } from '../src/types'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
type Equal<Left, Right> = (<T>() => T extends Left ? 1 : 2) extends <T>() => T extends Right ? 1 : 2 ? true : false

type Assert<Value extends true> = Value

type AgentCacheConfig = NonNullable<AgentStartOptions['cache']>
type AgentUrlHashing = NonNullable<AgentStartOptions['urlHashing']>

type AgentWebStartOptions = Pick<AgentStartOptions, 'storageKeyPrefix' | 'urlHashing' | 'cache'>

type AgentGetOptionsSubset = Pick<AgentGetOptions, keyof SdkGetOptions>

// These lines fail compilation when either contract drifts.
type CacheConfigMatchesAgent = Assert<Equal<CacheConfig, AgentCacheConfig>>

type UrlHashingMatchesAgent = Assert<Equal<UrlHashing, AgentUrlHashing>>

type WebOptionKeysMatchAgent = Assert<Equal<keyof WebStartOptions, keyof AgentWebStartOptions>>

type GetOptionsAcceptedByAgent = Assert<SdkGetOptions extends AgentGetOptionsSubset ? true : false>

export {}
