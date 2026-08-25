import { defineConfig } from 'tsdown'

const id = 'dsh-plus-catalog'

/**
 * Externals resolved from the loader module table at runtime (the host seeds
 * these entries). Everything else inlines into the single client factory.
 */
const CLIENT_EXTERNALS = ['react', 'react/jsx-runtime']

export default defineConfig({
  entry: { client: 'src/client/index.ts' },
  // The published artifact location: package.json exports "./client" points
  // at client/client.js, so the bundle lands there directly.
  outDir: 'client',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  // Host types ship from lib/types (tsc); dts here would wrap the
  // banner/footer into .d.cts and break parsing.
  dts: false,
  // Plugin code is fetched outside the host's module graph, so its own bundle
  // carries the TS/TSX sourcemap consumed by browser profiling tools.
  sourcemap: true,
  clean: false,
  external: [...CLIENT_EXTERNALS],
  // tsdown auto-externalizes package dependencies; anything NOT in the loader
  // module table must inline instead — a require() the table cannot answer is
  // a guaranteed runtime throw.
  noExternal: (source: string) => (CLIENT_EXTERNALS.includes(source) ? undefined : true),
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'import.meta.env.MODE': JSON.stringify('production'),
    'import.meta.env': JSON.stringify({ MODE: 'production' }),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
