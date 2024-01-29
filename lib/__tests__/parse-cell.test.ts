import { expect, test, describe } from "vitest";
import { parseCell, Formula } from "../parse-cell";

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

  test("should handle sum formulas", () => {
    const { dependencies, calculate } = parseCell("=A1+A2+B1") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(1, 2, 3)).toEqual(6);
  });

  test("should handle sum formulas with repeated cells", () => {
    const { dependencies, calculate } = parseCell("=A1+A2+B1+A1") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(1, 2, 3)).toEqual(7);
  });

  test("should handle multiplication formulas", () => {
    const { dependencies, calculate } = parseCell("=A1*A2*B1") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(1, 2, 4)).toEqual(8);
  });

  test("should handle multiplication formulas with repeated cells", () => {
    const { dependencies, calculate } = parseCell("=A1*A2*B1*A2") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(1, 2, 4)).toEqual(16);
  });

  test("should handle division formulas", () => {
    const { dependencies, calculate } = parseCell("=A1/A2/B1") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(4, 2, 1)).toEqual(2);
  });

  test("should handle division formulas with repeated cells", () => {
    const { dependencies, calculate } = parseCell("=A1/A2/B1/A2") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0", "0-1"]);
    expect(calculate(4, 2, 1)).toEqual(1);
    expect(calculate(3, 2, 1)).toEqual(0.75);
  });

  test("should handle sqrt formulas", () => {
    const { dependencies, calculate } = parseCell("=sqrt(A1)") as Formula;
    expect(dependencies).toEqual(["0-0"]);
    expect(calculate(4)).toEqual(2);
  });
});
