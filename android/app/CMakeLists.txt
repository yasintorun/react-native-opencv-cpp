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