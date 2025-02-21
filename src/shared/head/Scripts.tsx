import { Config, Effect, Schema, String } from 'effect';
import { Manifest } from 'vite';

const EnvironmentSchema = Schema.Literal('development', 'production');

export const createScriptsComponent = Effect.gen(function* ($) {
  const environment = yield* $(
    Config.string('NODE_ENV'),
    Effect.map(String.toLowerCase),
    Effect.flatMap(Schema.decodeUnknown(EnvironmentSchema)),
    Effect.catchAll(() => Effect.succeed('development' as const)),
  );

  if (environment === 'development') {
    return function Scripts({}: { manifest?: Manifest }) {
      return (
        <>
          <script
            type="module"
            src="http://localhost:5173/@vite/client"
          ></script>
          <script
            blocking="render"
            type="module"
            src="http://localhost:5173/client.js"
          ></script>
        </>
      );
    };
  } else {
    return function Scripts({ manifest }: { manifest?: Manifest }) {
      return (
        <>
          {manifest &&
            Object.entries(manifest).map(([_filename, chunk]) => {
              if (chunk.file.endsWith('.css'))
                return (
                  <link
                    rel="stylesheet"
                    href={chunk.file}
                    key={chunk.file}
                  ></link>
                );
              return (
                <>
                  <script defer src={`/${chunk.file}`}></script>
                  {chunk.css &&
                    chunk.css.map((file) => (
                      <link rel="stylesheet" href={`/${file}`}></link>
                    ))}
                </>
              );
            })}
          {manifest &&
            Object.entries(manifest).map(([_filename, chunk]) => {
              return (
                <link
                  rel="modulepreload"
                  href={`/${chunk.file}`}
                  key={chunk.file}
                ></link>
              );
            })}
        </>
      );
    };
  }
});
