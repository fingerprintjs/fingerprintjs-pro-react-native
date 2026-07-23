package com.fingerprintjs.reactnative

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * Old-architecture package. Registers the module through the legacy [ReactPackage] API, which is
 * available across every supported React Native version (including the oldest in the CI matrix).
 * The New Architecture counterpart in `src/newarch` uses `BaseReactPackage` +
 * `ReactModuleInfoProvider`, which only exist on newer React Native, so keeping the two apart
 * avoids referencing APIs that are missing on old React Native.
 */
class RNFingerprintjsProPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(RNFingerprintjsProModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
