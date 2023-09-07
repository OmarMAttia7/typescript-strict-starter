import * as assert from "node:assert";
import { test } from "node:test";
import { msg } from "../index.js";

await test("Hello, world!", () => {
  assert.strictEqual(msg, "Hello, world!");
});
