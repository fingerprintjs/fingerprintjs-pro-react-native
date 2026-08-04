let newArch = true

export function disableNewArch() {
  newArch = false
}

export function getNewArch() {
  const env = process.env.E2E_NEW_ARCH
  if (env === 'true' || env === 'false') {
    return env === 'true'
  }

  return newArch
}
