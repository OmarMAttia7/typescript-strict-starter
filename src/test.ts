import * as FileSystem from 'node:fs/promises';
import * as Path from 'node:path';
import * as NodeStream from 'node:stream/promises';
import * as NodeTest from 'node:test';
import * as NodeTestReporters from 'node:test/reporters';

async function main() {
  try {
    await setup();
    await runTests({
      files: await fetchTestFilePaths(),
    });
    await teardown();
  } catch (err) {
    await teardown();
    throw err;
  }
}

await main();

async function fetchTestFilePaths() {
  const basePath = Path.resolve('./build');
  const dirFiles = await FileSystem.readdir(basePath, {
    recursive: true,
    withFileTypes: true,
  }).then((files) =>
    files
      .filter((file) => !file.isDirectory() && file.name.endsWith('.test.js'))
      .map((file) => Path.resolve(basePath, file.path, file.name)),
  );
  if (dirFiles.length === 0) {
    throw new Error('No test files found');
  }
  return dirFiles;
}

async function setup() {
  await Promise.resolve();
  console.info('Setup test environment...');
}

async function teardown() {
  await Promise.resolve();
  console.info('Teardown test environment...');
}

function runTests({ files }: { files: string[] }) {
  return new Promise<void>((resolve) => {
    const stream = NodeTest.run({
      files,
    })
      .compose<NodeJS.ReadableStream>(new NodeTestReporters.spec())
      

    void NodeStream.finished(stream).then(resolve);

    stream.pipe(process.stdout);
  });
}
