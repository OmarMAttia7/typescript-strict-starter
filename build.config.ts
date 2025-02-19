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
    emitCJS: true,
    esbuild: {
      target: 'esnext',
    },
    inlineDependencies: true,
  },
});
