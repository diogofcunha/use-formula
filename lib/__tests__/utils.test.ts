import { expect, test } from "vitest";
import { getIdxKey } from "../utils";

test("getIdxKey should return a match of rowidx and columnidx", () => {
  expect(getIdxKey(0, 20)).toBe(`0-20`);
});
