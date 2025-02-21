import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/main'],
  declaration: true,
  clean: true,
  alias: {
    '~': './',
  },
  sourcemap: true,
  rollup: {
    esbuild: {
      target: 'esnext',
      jsxImportSource: 'hono/jsx',
      jsx: 'automatic',
    },
    inlineDependencies: true,
  },
});
