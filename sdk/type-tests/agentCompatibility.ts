import type { StartOptions as AgentStartOptions } from '@fingerprint/agent'
import type { CacheConfig, UrlHashing, WebStartOptions } from '../src/types'

type Equal<Left, Right> = (<T>() => T extends Left ? 1 : 2) extends <T>() => T extends Right ? 1 : 2 ? true : false

type Assert<Value extends true> = Value

type AgentCacheConfig = NonNullable<AgentStartOptions['cache']>
type AgentUrlHashing = NonNullable<AgentStartOptions['urlHashing']>

type AgentWebStartOptions = Pick<AgentStartOptions, 'storageKeyPrefix' | 'urlHashing' | 'cache'>

// These lines fail compilation when either contract drifts.
type CacheConfigMatchesAgent = Assert<Equal<CacheConfig, AgentCacheConfig>>

type UrlHashingMatchesAgent = Assert<Equal<UrlHashing, AgentUrlHashing>>

type WebOptionKeysMatchAgent = Assert<Equal<keyof WebStartOptions, keyof AgentWebStartOptions>>

export {}
