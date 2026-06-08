import registerRootComponent from 'expo/src/launch/registerRootComponent'

import App from './App'
import { ComponentType } from 'react'

registerRootComponent(App as ComponentType)
