Pod::Spec.new do |s|
  s.name         = "RNFingerprintjsPro"
  s.version      = "1.0.4"
  s.summary      = "Fingerprint Pro visitor identification in a React Native app"
  s.description  = "Official React Native client for Fingerprint. Best identification solution for React Native."
  s.homepage     = "https://github.com/fingerprintjs"
  s.license = { :type => "MIT", :file => "LICENSE" }
  s.author = { "FingerprintJS, Inc" => "support@fingerprint.com" }
  s.source       = { :git => "https://github.com/fingerprintjs/fingerprintjs-pro-react-native.git", :tag => "main" }
  s.ios.deployment_target = "14.0"
  s.tvos.deployment_target = "15.0"

  fingerprint_version = '4.0'

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  # Never sweep build artifacts (e.g. generated Codegen headers under ios/build) into the pod's
  # sources. Otherwise CocoaPods exposes the C++ `*Spec.h`/`*SpecJSI.h` as public headers of this
  # pod, and building the Swift pod's ObjC module (`-import-underlying-module`) tries to compile
  # them as Obj-C, failing with "This file must be compiled as Obj-C++".
  # react-native-spm-prefix.h is a SwiftPM-only shim (force-included via Package.swift);
  # CocoaPods provides its own prefix header, so keep it out of the pod sources.
  s.exclude_files = "ios/build/**/*", "ios/**/react-native-spm-prefix.h"
#   s.requires_arc = true

  s.dependency "React-Core"

  # Opt-in to consuming Fingerprint iOS SDK via Swift Package Manager.
  # When `SENTRY_USE_SPM=1` is set, RNFingerprintPro pulls `Fingerprint` from the
  # Fingerprint iOS SDK SPM package as a binary xcframework instead of from
  # the Sentry CocoaPods source build. Defaults to CocoaPods consumption
  # for backward compatibility with the full RN version range we support.
  #
  # Requires React Native >= 0.75 because the SPM helper
  # (`react-native/scripts/cocoapods/spm.rb`) is loaded transitively from
  # the Podfile via `react_native_pods.rb`
	if ENV['FINGERPRINT_USE_SPM'] == '1'
		unless defined?(SPM) && SPM.respond_to?(:dependency)
			raise 'FINGERPRINT_USE_SPM=1 is set but the SPM helper is not loaded. ' \
						'This requires React Native >= 0.75 and a Podfile that imports ' \
						'react_native_pods.rb.'
		end
		SPM.dependency(s,
			url: 'https://github.com/fingerprintjs/fingerprint-ios',
			requirement: { kind: 'upToNextMajorVersion', version: "#{fingerprint_version}.0" },
			products: ['Fingerprint']
		)
	else
		s.dependency 'Fingerprint-iOS', "~> #{fingerprint_version}"
	end

  # Wires up the TurboModule/Codegen dependencies (ReactCommon, generated specs, ...) and defines
  # `RCT_NEW_ARCH_ENABLED` for the pod when the app is built with the New Architecture.
  install_modules_dependencies(s)
end
