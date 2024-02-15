import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { finished } from 'node:stream';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

async function main() {
	try {
		await setup();
		const files = await fetchTestFilePaths();
		runTests({
			files,
			teardown,
		});
	} catch (err) {
		await teardown();
		throw err;
	}
}

main();

async function fetchTestFilePaths() {
	const basePath = resolve('./build');
	const dirFiles = await readdir(basePath, {
		recursive: true,
		withFileTypes: true,
	}).then((files) =>
		files
			.filter((file) => !file.isDirectory() && file.name.endsWith('.test.js'))
			.map((file) => resolve(basePath, file.path, file.name)),
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

const runTests = ({
	files,
	teardown,
}: {
	files: string[];
	teardown: () => Promise<void>;
}) => {
	const stream = run({
		files,
	}).compose<NodeJS.ReadableStream>(new spec());

	finished(stream, teardown);

	stream.pipe(process.stdout);
};
