import { LaunchArguments } from 'react-native-launch-arguments'

import { Config } from '@/src/config.types'

const config: Config = LaunchArguments.value<Config>()

export default config
