require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
folly_compiler_flags = '-DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "OpencvCpp"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platforms    = { :ios => "11.0" }

  s.source       = { :git => "https://github.com/yasintorun/react-native-opencv-cpp.git", :tag => "#{s.version}" }
  s.source_files  = "ios/**/*.{h,mm}", "cpp/**/*.{cpp,h}"
  
  s.dependency "React"
  s.library = "c++"
end