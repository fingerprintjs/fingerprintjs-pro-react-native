package com.fingerprintjs.reactnative

import android.util.Log
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
        // TEMP(old-arch verification): this legacy `ReactPackage` is only compiled/used on the Old
        // Architecture. The new-arch build uses `BaseReactPackage` in `src/newarch` instead.
        Log.d("RNFingerprintjsPro", "createNativeModules via legacy ReactPackage — running on the Old Architecture")
        return listOf(RNFingerprintjsProModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
