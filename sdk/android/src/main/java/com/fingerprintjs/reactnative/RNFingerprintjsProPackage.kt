package com.fingerprintjs.reactnative

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider


/**
 * Registers the module as a TurboModule via `BaseReactPackage` + `ReactModuleInfoProvider`.
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
