#!/usr/bin/env bash
# Sets the podspec s.version to the version in package.json.
set -euo pipefail

cd "$(dirname "$0")/.."

version=$(node -p "require('./package.json').version")
podspec=RNFingerprintjsPro.podspec

sed -i '' -E "s/^([[:space:]]*s\.version[[:space:]]*=[[:space:]]*).*/\1\"$version\"/" "$podspec"

grep -E '^\s*s\.version' "$podspec"
