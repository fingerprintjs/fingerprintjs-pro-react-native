export function humanizeMavenStyleVersionRange(versionRange: string) {
  return versionRange
    .trim()
    .replace(/\s*\[\s*(.*?)\s*,\s*(.*?)\s*]\s*/g, '>= $1 and <= $2')
    .replace(/\s*\(\s*(.*?)\s*,\s*(.*?)\s*]\s*/g, '> $1 and <= $2')
    .replace(/\s*\[\s*(.*?)\s*,\s*(.*?)\s*\)\s*/g, '>= $1 and < $2')
    .replace(/\s*\(\s*(.*?)\s*,\s*(.*?)\s*\)\s*/g, '> $1 and < $2')
    .replace(/\s*\[\s*(.*?)\s*]/g, '>=$1')
    .replace(/\s*\(\s*(.*?)\s*\)/g, '>$1')
}

export function isNotFoundErrorCode(code?: number) {
  // 127 means command not found (https://tldp.org/LDP/abs/html/exitcodes.html)
  return code === 127
}
