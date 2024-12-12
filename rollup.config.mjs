import typescript from '@rollup/plugin-typescript'
import jsonPlugin from '@rollup/plugin-json'
import external from 'rollup-plugin-peer-deps-external'
import dtsPlugin from 'rollup-plugin-dts'
import licensePlugin from 'rollup-plugin-license'
import pkg from './package.json' with { type: 'json' }
import { fileURLToPath } from 'node:url'

const dependencies = pkg.devDependencies

const inputFile = 'src/index.ts'
const outputDirectory = 'dist'
const artifactName = 'fpjs-pro-react-native'

const commonBanner = licensePlugin({
  banner: {
    content: {
      file: fileURLToPath(new URL('res/license_banner.txt', import.meta.url)),
    },
  },
})

const commonInput = {
  input: inputFile,
  plugins: [jsonPlugin(), typescript(), external(), commonBanner],
}

const commonOutput = {
  exports: 'named',
  sourcemap: true,
}

export default [
  // NPM bundles. They have all the dependencies excluded for end code size optimization.
  {
    ...commonInput,
    external: Object.keys(dependencies),
    output: [
      // CJS for usage with `require()`
      {
        ...commonOutput,
        file: `${outputDirectory}/${artifactName}.cjs.js`,
        format: 'cjs',
      },

      // ESM for usage with `import`
      {
        ...commonOutput,
        file: `${outputDirectory}/${artifactName}.esm.js`,
        format: 'es',
      },
    ],
  },

  // TypeScript definition
  {
    ...commonInput,
    plugins: [dtsPlugin(), commonBanner],
    output: {
      file: `${outputDirectory}/${artifactName}.d.ts`,
      format: 'es',
    },
  },
]
