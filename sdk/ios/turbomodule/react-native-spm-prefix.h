// Mirrors CocoaPods' default prefix header so this Objective-C++ source, which
// relies on an implicit Foundation import, compiles under SwiftPM (which
// has no prefix-header mechanism). Force-included via `-include` from the
// FingerprintjsProReactNative target in Package.swift. Inert for CocoaPods
// (excluded from the podspec's source_files).
#ifdef __OBJC__
#import <Foundation/Foundation.h>
#endif
