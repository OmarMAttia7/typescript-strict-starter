import { readFile } from 'fs/promises';
import type { FC, Child } from 'hono/jsx';
import type { Manifest } from 'vite';

let viteManifest: Manifest = {};

if (process.env['NODE_ENV'] === 'production') {
  await readFile('dist/client/.vite/manifest.json', 'utf-8')
    .then(JSON.parse)
    .then((data: Manifest) => {
      viteManifest = data;
    });
}

export const RootPage: FC<{
  children: Child;
  environment: 'development' | 'production';
}> = ({ children, environment }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Vite Experiment</title>
        {environment === 'development' && (
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
        )}
        {environment === 'production' &&
          Object.entries(viteManifest).map(([_filename, chunk]) => {
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
        {environment === 'production' &&
          Object.entries(viteManifest).map(([_filename, chunk]) => {
            return (
              <link
                rel="modulepreload"
                href={`/${chunk.file}`}
                key={chunk.file}
              ></link>
            );
          })}
      </head>
      <body class="bg-red-500">{children}</body>
    </html>
  );
};
