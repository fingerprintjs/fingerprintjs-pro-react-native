package com.fingerprint.reactnative

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider


/**
 * Registers the module as a TurboModule via `BaseReactPackage` + `ReactModuleInfoProvider`.
 */
class RNFingerprintPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == RNFingerprintModule.NAME) {
            RNFingerprintModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                RNFingerprintModule.NAME to ReactModuleInfo(
                    RNFingerprintModule.NAME,
                    RNFingerprintModule.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // isCxxModule
                    true // isTurboModule
                )
            )
        }
    }
}
