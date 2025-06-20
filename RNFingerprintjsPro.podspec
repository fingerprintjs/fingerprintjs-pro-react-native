Pod::Spec.new do |s|
  s.name         = "RNFingerprintjsPro"
  s.version      = "1.0.4"
  s.summary      = "Fingerprint Pro visitor identification in a React Native app"
  s.description  = "Official React Native client for Fingerprint. Best identification solution for React Native."
  s.homepage     = "https://github.com/fingerprintjs"
  s.license = { :type => "MIT", :file => "LICENSE" }
  s.author = { "FingerprintJS, Inc" => "support@fingerprint.com" }
  s.source       = { :git => "https://github.com/fingerprintjs/fingerprintjs-pro-react-native.git", :tag => "main" }
  s.ios.deployment_target = "13.0"
  s.tvos.deployment_target = "15.0"

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
#   s.requires_arc = true

  s.dependency "React-Core"
  # See: https://guides.cocoapods.org/using/the-podfile.html#specifying-pod-versions
  # ~> 2.8.2 means >= 2.8.2 and < 2.9.0 (pessimistic operator)
  s.dependency "FingerprintPro", '~> 2.8.2'
end
