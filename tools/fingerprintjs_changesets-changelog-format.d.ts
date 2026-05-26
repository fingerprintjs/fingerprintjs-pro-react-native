declare module '@fingerprintjs/changesets-changelog-format' {
  import type { ChangelogFunctions } from '@changesets/types'

  const format: {
    default: ChangelogFunctions
  }

  export default format
}
