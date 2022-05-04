Pod::Spec.new do |s|
  s.name         = "RNFingerprintjsPro"
  s.version      = "0.0.1"
  s.summary      = "FingerprintJS Pro visitor identification in a React Native app"
  s.description  = "Official React Native client for FingerprintJS PRO. Best identification solution for React Native."
  s.homepage     = "https://github.com/fingerprintjs"
  s.license = { :type => "MIT", :file => "LICENSE" }
  s.author = { "FingerprintJS, Inc" => "support@fingerprintjs.com" }
  s.source       = { :git => "https://github.com/fingerprintjs/fingerprintjs-pro-react-native.git", :tag => "main" }
  s.platform     = :ios, "10.0"

  s.source_files  = "ios/**/*.{h,m,mm,swift}"
#   s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "FingerprintJSPro", '~> 1.1.0'
end
