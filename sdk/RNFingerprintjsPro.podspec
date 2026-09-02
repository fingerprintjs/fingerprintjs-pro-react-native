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

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  # Never sweep build artifacts (e.g. generated Codegen headers under ios/build) into the pod's
  # sources. Otherwise CocoaPods exposes the C++ `*Spec.h`/`*SpecJSI.h` as public headers of this
  # pod, and building the Swift pod's ObjC module (`-import-underlying-module`) tries to compile
  # them as Obj-C, failing with "This file must be compiled as Obj-C++".
  s.exclude_files = "ios/build/**/*"
#   s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "Fingerprint-iOS", '~> 4.0'

  # Wires up the TurboModule/Codegen dependencies (ReactCommon, generated specs, ...) and defines
  # `RCT_NEW_ARCH_ENABLED` for the pod when the app is built with the New Architecture. On the old
  # architecture it is effectively a no-op, keeping the module backward compatible.
  install_modules_dependencies(s)
end
