import destr from 'destr';
import { Effect, Schema } from 'effect';
import { readFile } from 'fs/promises';
import { env } from '../env/mod.js';

const ViteManifestSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Struct({
    src: Schema.optional(Schema.String),
    file: Schema.String,
    name: Schema.optional(Schema.String),
    css: Schema.optional(Schema.Array(Schema.String)),
    imports: Schema.optional(Schema.Array(Schema.String)),
    isEntry: Schema.optional(Schema.Boolean),
    isDynamicEntry: Schema.optional(Schema.Boolean),
    dynamicImports: Schema.optional(Schema.Array(Schema.String)),
  }),
});

const loadManifest = Effect.tryPromise({
  try: async () => {
    return await readFile('dist/client/.vite/manifest.json', 'utf-8');
  },
  catch: (err) =>
    err instanceof Error
      ? err
      : new Error(`Failed to load Vite manifest, error: ${err}`),
}).pipe(
  Effect.map(destr),
  Effect.flatMap(Schema.decodeUnknown(ViteManifestSchema)),
);

export const loadViteManifest = Effect.gen(function* ($) {
  if (env.environment === 'development') {
    return {};
  } else {
    return yield* $(loadManifest);
  }
});
