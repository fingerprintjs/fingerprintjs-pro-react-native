import fs from 'node:fs'
import { Plugin } from 'esbuild'

type Options = Record<string, string>

function doReplace(source: string, values: Options) {
  const pattern = /__\w+__/g
  const replacements = Object.keys(values).reduce((acc, key) => {
    acc[key] = values[key]
    return acc
  }, {} as Record<string, string>)
  return source.replace(pattern, (match) => replacements[match])
}

export function replacePlugin(options: Options): Plugin {
  return {
    name: 'replace',
    setup(build) {
      build.onLoad({ filter: /.ts/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8')
        const contents = doReplace(source, options)
        return { contents, loader: 'default' }
      })
    },
  }
}
