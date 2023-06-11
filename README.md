# React Native OpenCV C++

C++ dilinde native modül yazmak için şu adımları takip edin.

- Proje klasöründe *C++ dosyalarını koyacağınız* bir klasör oluşturun. (Ben `cpp` adında bir klasör oluşturdum.)
- `.h ve .cpp` dosyalarını oluşturun. (Ben `opencv-cpp.h` ve `opencv-cpp.cpp` dosyalarını oluşturdum.)

### Android için
__`commit`__: [384b402](https://github.com/yasintorun/react-native-opencv-cpp/commit/384b402eb984269fc17bacd6f5dacde0e3f00965)
- `android/app` klasöründe `cpp-adapter.cpp` dosyası oluşturun. İçeriğini kendinize göre değiştirin. (Ben şimdilik basit bir createMessage fonksiyonu yazdım);
```cpp
#include <jni.h>
#include "opencv-cpp.h"

extern "C"
JNIEXPORT jstring JNICALL
Java_com_opencvcpp_OpencvCppModule_nativeCreateMessage(JNIEnv *env, jclass type, jstring jMessage) {
    std::string msg = std::string(env->GetStringUTFChars(jMessage, NULL));
    std::string result = opencvcpp::createMessage(msg);
    return env->NewStringUTF(result.c_str());
}
```
- `android/app` klasöründe `CMakeLists.txt` dosyası oluşturun.
```cmake
cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)
SET(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} ${GCC_COVERAGE_COMPILE_FLAGS}")
SET(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} ${GCC_COVERAGE_LINK_FLAGS}")

add_library(cpp
            SHARED
            ../../cpp/opencv-cpp.cpp
            cpp-adapter.cpp
)

# Specifies a path to native header files.
include_directories(
            ../../cpp
)

target_link_libraries (
        cpp
)
```

- `android/app/build.gradle` dosyasında;
```gradle
android {
    // Add the following block
    packagingOptions {
        pickFirst '**/*.so'
    }
    // ...
    defaultConfig {
        // ...
        // Add the following block
        externalNativeBuild {
            cmake {
                cppFlags "-std=c++11 -O2 -frtti -fexceptions -Wall -fstack-protector-all"
                abiFilters "x86", "x86_64", "armeabi-v7a", "arm64-v8a"
                arguments "-DANDROID_STL=c++_shared"
            }
        }
    }
    // ...
    externalNativeBuild {
        cmake {
            path "CMakeLists.txt"
        }
    }
}
```
- `android/app/src/main/java/com/opencvcpp` klasöründe `OpencvCppModule.java` dosyası oluşturun. (Adlandırmaları kendinize göre yapın. Ben *OpencvCppModule* olarak adlandırdım.)
```java
package com.opencvcpp;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = OpencvCppModule.NAME)
public class OpencvCppModule extends ReactContextBaseJavaModule {
  public static final String NAME = "OpencvCpp";

  public OpencvCppModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }
  static {
    System.loadLibrary("cpp");
  }

  private static native String nativeCreateMessage(String message);

  @ReactMethod
  public void createMessage(String message, Promise promise) {
    promise.resolve(nativeCreateMessage(message));
  }
}
```
- `android/app/src/main/java/com/opencvcpp` klasöründe `OpencvCppPackage.java` dosyası oluşturun. (Adlandırmaları kendinize göre yapın. Ben *OpencvCppPackage* olarak adlandırdım.)
```java
package com.opencvcpp;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OpencvCppPackage implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new OpencvCppModule(reactContext));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
```
- `android/app/src/main/java/com/opencvcpp` klasöründe `MainApplication.java` dosyasını açın. `getPackages` fonksiyonuna `new OpencvCppPackage()` satırını ekleyin.
```java
@Override
protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new OpencvCppPackage()); // Add this line with your package name.
    return packages;
}
```
**Android için artık C++ kodunu çapırabiliriz.**


### iOS için
__`commit`__: [0e8a006](https://github.com/yasintorun/react-native-opencv-cpp/commit/0e8a006a9bbe14978fce68abfbda3d2da9e9d820)

Öncelikle yazdığımız c++ kodunu XCode kullanarak içe aktaralım.
- XCode'u açın.
- Projenizin target kısmına gelin ve Build Settings sekmesine tıklayın.
- Arama kısmına `Header Search Paths` yazın.
- `Header Search Paths` kısmına `$(SRCROOT)/../cpp` yazın.
- Sol panel de `Frameworks` kısmına sağ tıklayın ve `Add files "bla bla"` kısmına tıklayın ve cpp klasörünü seçip add butonuna tıklayın.
- Eğer arm64 hatası alırsanız, Podfile dosyasında pod_install içerisine alttkai kodu ekleyin.
```ruby
installer.pods_project.build_configurations.each do |config|       
    config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
end
```
- XCode da projenize sağ tıklayın ve `new file` kısmına tıklayın.
- `Header File` seçin ve `RCTOpencvCppModule` adında bir header dosyası oluşturun. İçeriğini;
```objc
//
//  RCTOpencvCppModule.h
//

#ifdef __cplusplus
#import "opencv-cpp.h"
#endif


#ifndef RCTOpencvCppModule_h
#define RCTOpencvCppModule_h

#import <React/RCTBridgeModule.h>
@interface OpencvCpp : NSObject <RCTBridgeModule>
@end

#endif /* RCTOpencvCppModule_h */
```
- Aynı şekilde yine New File kısmından ObjectiveC++ dosyası oluşturun. Adını `RCTOpencvCppModule.mm` olarak adlandırın. İçeriğini;
```objc
//
//  RCTOpencvCppModule.
//

#import "RCTOpencvCppModule.h"

@implementation OpencvCpp

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(createMessage,
                 withMessage:(NSString *)message
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *result = @(opencvcpp::createMessage(std::string([message UTF8String])).c_str());

    resolve(result);
}

@end
```
- `ios` klasörüne gelin ve 
```bash
pod install
```
komutunu çalıştırın.

**iOS için artık C++ kodunu çağırabiliriz.**

### React Native tarafı
```javascript
import { NativeModules } from 'react-native';
const { OpencvCpp } = NativeModules;
OpencvCpp.createMessage('Hello World!').then(console.log); 
// You will see "CPP: Hello World!" in console.
```
