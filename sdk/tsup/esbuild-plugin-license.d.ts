declare module 'esbuild-plugin-license' {
  import { Plugin } from 'esbuild'

  export default function (options: { banner: string }): Plugin
}
