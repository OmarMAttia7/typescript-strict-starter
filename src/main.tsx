// Import h3 as npm dependency
import {
  createApp,
  createRouter,
  defineEventHandler,
  serveStatic,
  toNodeListener,
} from 'h3';
import { RootPage } from './root.js';
import { listen } from 'listhen';
import { readFile, stat } from 'fs/promises';
import { join, resolve } from 'path';

// Create an app instance
export const app = createApp();

// Create a new router and register it in app
const router = createRouter();
app.use(router);

const homePage = (
  <RootPage
    environment={
      process.env['NODE_ENV'] === 'production' ? 'production' : 'development'
    }
  >
    <h1 class="font-bold text-3xl">Hello, Vite!!!</h1>
  </RootPage>
).toString();

app.use(
  '/assets',
  defineEventHandler((event) => {
    return serveStatic(event, {
      getContents: async (id) => {
        return await readFile(join('./dist/client/assets', id)).catch(() => {
          return undefined;
        });
      },
      getMeta: async (id) => {
        const stats = await stat(join('./dist/client/assets', id)).catch(
          () => {},
        );

        if (!stats || !stats.isFile()) {
          return;
        }

        return {
          size: stats.size,
          mtime: stats.mtimeMs,
          type: id.endsWith('js') ? 'application/javascript' : 'text/css',
        };
      },
    });
  }),
);

// Add a new route that matches GET requests to / path
router.get(
  '/',
  defineEventHandler(() => {
    return new Response(homePage, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }),
);

listen(toNodeListener(app), {
  port: 3000,
});
