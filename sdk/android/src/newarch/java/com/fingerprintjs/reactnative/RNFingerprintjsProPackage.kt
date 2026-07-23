package com.fingerprintjs.reactnative

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
