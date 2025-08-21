import { defineConfig } from 'tsup'
import esbuildPluginLicense from 'esbuild-plugin-license'
import * as fs from 'node:fs'
import * as pkg from './package.json'
import { replacePlugin } from './esbuild/replace.plugin'

const licenseBanner = fs.readFileSync('res/license_banner.txt', 'utf-8')

export default defineConfig({
  entry: ['src'],
  splitting: false,
  bundle: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  format: ['esm', 'cjs'],
  legacyOutput: true,
  dts: true,
  esbuildPlugins: [
    esbuildPluginLicense({
      banner: `/**\n${licenseBanner}\n*/`,
    }),
    replacePlugin({
      __VERSION__: pkg.version,
    }),
  ],
})
