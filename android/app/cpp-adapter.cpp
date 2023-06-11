#include <jni.h>
#include "opencv-cpp.h"

extern "C"
JNIEXPORT jstring JNICALL
Java_com_opencvcpp_OpencvCppModule_nativeCreateMessage(JNIEnv *env, jclass type, jstring jMessage) {
    std::string msg = std::string(env->GetStringUTFChars(jMessage, NULL));
    std::string result = opencvcpp::createMessage(msg);
    return env->NewStringUTF(result.c_str());
}