Pod::Spec.new do |s|
  s.name         = "RNFingerprintjsPro"
  s.version      = "1.0.4"
  s.summary      = "FingerprintJS Pro visitor identification in a React Native app"
  s.description  = "Official React Native client for FingerprintJS PRO. Best identification solution for React Native."
  s.homepage     = "https://github.com/fingerprintjs"
  s.license = { :type => "MIT", :file => "LICENSE" }
  s.author = { "FingerprintJS, Inc" => "support@fingerprint.com" }
  s.source       = { :git => "https://github.com/fingerprintjs/fingerprintjs-pro-react-native.git", :tag => "main" }
  s.ios.deployment_target = "13.0"
  s.tvos.deployment_target = "15.0"

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
#   s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "FingerprintPro", '~> 2.3.1'
end
