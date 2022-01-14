
Pod::Spec.new do |s|
  s.name         = "RNFingerprintjsPro"
  s.version      = "1.0.0"
  s.summary      = "RNFingerprintjsPro"
  s.description  = <<-DESC
                  RNFingerprintjsPro
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNFingerprintjsPro.git", :tag => "master" }
  s.source_files  = "RNFingerprintjsPro/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency "FingerprintJSPro"

end

