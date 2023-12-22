import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { sum } from './main.js';

await describe('sum', () => {
	test('should add two numbers', () => {
		assert.equal(sum(1, 3), 4);
	});
});
