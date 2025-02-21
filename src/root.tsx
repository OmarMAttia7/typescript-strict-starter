import { Effect } from 'effect';
import type { FC, Child } from 'hono/jsx';
import type { Manifest } from 'vite';
import { createScriptsComponent } from './shared/head/Scripts.js';
import { loadViteManifest } from './shared/vite/mod.js';

const Scripts = await Effect.runPromise(createScriptsComponent);
// The type errors here are inconsequential
const viteManifest = (await Effect.runPromise(
  loadViteManifest.pipe(Effect.sandbox),
)) as Manifest;
export const RootPage: FC<{
  children: Child;
  environment: 'development' | 'production';
}> = ({ children }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Vite Experiment</title>
        <Scripts manifest={viteManifest} />
      </head>
      <body class="bg-red-200">{children}</body>
    </html>
  );
};
