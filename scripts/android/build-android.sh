#!/usr/bin/env bash
# Local, zero-cost Android debug build + install for ATLAS on Windows (Git Bash). See docs/TOOLING.md.
# Usage: bash scripts/android/build-android.sh <adb-serial>        (adb devices -l lists serials)
set -euo pipefail
SERIAL="${1:?usage: build-android.sh <adb-serial>}"
GH="C:/Users/Admin/gh"                       # short Gradle home (Windows 260-char path limit)
CMAKE_DIR="$GH/cmake-3.31.6"                 # CMake 3.31.6 from the Android SDK repo (long-path-aware ninja 1.12.1)

[ -d "$CMAKE_DIR/bin" ] || { echo "Missing $CMAKE_DIR (see docs/TOOLING.md 'Android dev build')"; exit 1; }
mkdir -p "$GH/init.d"
cp "$(dirname "$0")/atlas-gradle-init.gradle" "$GH/init.d/atlas-maven-mirror.gradle"
printf 'sdk.dir=C:/Users/Admin/AppData/Local/Android/Sdk\ncmake.dir=C:/Users/Admin/gh/cmake-3.31.6\n' > android/local.properties

export GRADLE_USER_HOME="$GH"
export ANDROID_HOME="$LOCALAPPDATA/Android/Sdk"
export ORG_GRADLE_PROJECT_reactNativeArchitectures=arm64-v8a   # phone ABI only; remove for other devices
export CI=1
npx expo run:android --device "$SERIAL" --no-bundler
