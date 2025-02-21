import { Config, Effect, Schema, String } from 'effect';

const EnvironmentSchema = Schema.Literal('development', 'production');

export const env = await Effect.gen(function* ($) {
  const environment = yield* $(
    Config.string('NODE_ENV'),
    Effect.map(String.toLowerCase),
    Effect.flatMap(Schema.decodeUnknown(EnvironmentSchema)),
    Effect.catchAll(() => Effect.succeed('development' as const)),
  );

  const building = yield* $(
    Config.boolean('BUILD'),
    Effect.catchAll(() => Effect.succeed(false)),
  );

  return {
    environment,
    building,
  };
}).pipe(Effect.runPromise);
