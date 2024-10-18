import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { sum } from '#src/main.js';

await describe('sum', async () => {
  await Promise.all([
    test('adds two numbers', () => {
      assert.equal(sum(1, 3), 4);
    }),
    test('adds negative numbers', () => {
      assert.equal(sum(2, -5), -3);
    }),
  ]);
});
