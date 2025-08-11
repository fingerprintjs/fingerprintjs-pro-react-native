import { defineConfig } from 'tsup'
import esbuildPluginLicense from 'esbuild-plugin-license'
import * as fs from 'node:fs'

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
  ],
})
