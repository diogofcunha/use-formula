import { expect, test, describe } from "vitest";
import { parseCell } from "../parse-cell";

describe("parseCell", () => {
  test("should return a number if a number is provided", () => {
    expect(parseCell(123)).toEqual(123);
    expect(parseCell(123.23)).toEqual(123.23);
  });

  test("should return a number if a number as string is provided", () => {
    expect(parseCell("123")).toEqual(123);
    expect(parseCell("123.23")).toEqual(123.23);
  });

  test("should return a string if a simple string is provided", () => {
    expect(parseCell("Hello")).toEqual("Hello");
    expect(parseCell("Hello 234")).toEqual("Hello 234");
  });
});
