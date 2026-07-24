package com.fingerprintjs.reactnative

import android.util.Log
import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider


/**
 * New-architecture package. Uses `BaseReactPackage` + `ReactModuleInfoProvider` so the module is
 * registered as a TurboModule. These APIs only exist on newer React Native; the old-architecture
 * counterpart in `src/oldarch` uses the legacy [com.facebook.react.ReactPackage] API instead.
 */
class RNFingerprintjsProPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == RNFingerprintjsProModule.NAME) {
            // TEMP(new-arch verification): this new-arch-only package is used only when the module
            // is resolved as a TurboModule (New Architecture). The old-arch build uses the legacy
            // `ReactPackage` in `src/oldarch` instead.
            Log.d("RNFingerprintjsPro", "getModule via new-arch package — running as a TurboModule (New Architecture)")
            RNFingerprintjsProModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                RNFingerprintjsProModule.NAME to ReactModuleInfo(
                    RNFingerprintjsProModule.NAME,
                    RNFingerprintjsProModule.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // isCxxModule
                    true // isTurboModule
                )
            )
        }
    }
}
