import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { finished } from 'node:stream';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

async function main() {
	await setup();
	const files = await fetchTestFilePaths();
	runTests({
		files,
	})(teardown);
}

main();

async function fetchTestFilePaths() {
	const basePath = resolve('./build');
	const dirFiles = await readdir(basePath, { recursive: true });
	return dirFiles
		.filter((file) => file.endsWith('.test.js'))
		.map((file) => resolve(basePath, file));
}

async function setup() {
	await Promise.resolve();
	console.info('Setup test environment...');
}

async function teardown() {
	await Promise.resolve();
	console.info('Teardown test environment...');
}

const runTests =
	(options: {
		files: string[];
	}) =>
	(teardown: () => Promise<void>) => {
		const { files } = options;

		const stream = run({
			files,
		}).compose<NodeJS.ReadableStream>(new spec());

		finished(stream, teardown);

		stream.pipe(process.stdout);
	};
