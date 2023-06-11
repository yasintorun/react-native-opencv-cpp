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