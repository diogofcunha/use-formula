import { expect, test, describe } from "vitest";
import { parseCell } from "../parse-cell";
import { Formula } from "../types";

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

  test("should handle exponential formulas", () => {
    const { dependencies, calculate } = parseCell("=A1^B1") as Formula;
    expect(dependencies).toEqual(["0-0", "0-1"]);
    expect(calculate(4, 2)).toEqual(16);
  });

  test("should handle cos formulas", () => {
    const { dependencies, calculate } = parseCell("=cos(A1)") as Formula;
    expect(dependencies).toEqual(["0-0"]);
    expect(calculate(45)).toEqual(Math.cos(45));
  });

  test("should handle sin formulas", () => {
    const { dependencies, calculate } = parseCell("=sin(A1)") as Formula;
    expect(dependencies).toEqual(["0-0"]);
    expect(calculate(45)).toEqual(Math.sin(45));
  });

  test("should handle sin formulas", () => {
    const { dependencies, calculate } = parseCell("=tan(A1)") as Formula;
    expect(dependencies).toEqual(["0-0"]);
    expect(calculate(45)).toEqual(Math.tan(45));
  });

  test("should mix numbers and cells in formulas", () => {
    const { dependencies, calculate } = parseCell("=A1+A2*5") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0"]);
    expect(calculate(5, 6)).toEqual(35);
  });

  test("should handle order in formulas", () => {
    const { dependencies, calculate } = parseCell("=(A1+A2)*5") as Formula;
    expect(dependencies).toEqual(["0-0", "1-0"]);
    expect(calculate(5, 6)).toEqual(11 * 5);
  });

  test("should handle a complex formula with various operations and functions", () => {
    const complexFormula =
      "=A1 + B1 - C1 * (D1 / E1) + sqrt(F1) + cos(G1) + sin(H1) + tan(I1)";
    const { dependencies, calculate } = parseCell(complexFormula) as Formula;

    expect(dependencies).toEqual([
      "0-0", // A1
      "0-1", // B1
      "0-2", // C1
      "0-3", // D1
      "0-4", // E1
      "0-5", // F1
      "0-6", // G1
      "0-7", // H1
      "0-8", // I1
    ]);

    const result = calculate(
      10, // A1
      5, // B1
      3, // C1
      8, // D1
      2, // E1
      9, // F1
      45, // G1
      45, // H1
      45 // I1
    );

    // This is the expected value based on the formula
    const expectedValue =
      10 +
      5 -
      3 * (8 / 2) +
      Math.sqrt(9) +
      Math.cos(45) +
      Math.sin(45) +
      Math.tan(45);

    expect(result).toEqual(expectedValue);
  });
});
