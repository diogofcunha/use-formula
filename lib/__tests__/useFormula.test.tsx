import { expect, test, describe } from "vitest";
import { FormulaProvider, useFormula } from "../main";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "node:test";
import { Grid } from "../types";

const TestComponent = () => {
  const { getSheet } = useFormula();

  return (
    <div>
      {getSheet().map((r, rowIdx) => {
        return r.map((c, columnIdx) => {
          return (
            <div role="cell" key={`${rowIdx}-${columnIdx}`}>
              <span data-testid={`value-${rowIdx}-${columnIdx}`}>
                {c.value}
              </span>
              <span data-testid={`calculated-${rowIdx}-${columnIdx}`}>
                {c.calculated}
              </span>
            </div>
          );
        });
      })}
    </div>
  );
};

const setup = () => {
  const grid: Grid = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ];

  return {
    container: render(
      <FormulaProvider initialGrid={grid}>
        <TestComponent />
      </FormulaProvider>
    ),
    grid,
  };
};

describe("useFormula", () => {
  afterEach(() => {
    cleanup();
  });

  describe("getSheet", () => {
    test("should output initial grid values correctly", () => {
      const { container, grid } = setup();

      let visitedCellCount = 0;

      for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const row = grid[rowIdx];

        for (let columnIdx = 0; columnIdx < row.length; columnIdx++) {
          const cell = row[columnIdx];
          visitedCellCount++;

          const value = container.getByTestId(`value-${rowIdx}-${columnIdx}`);
          const calculated = container.getByTestId(
            `calculated-${rowIdx}-${columnIdx}`
          );

          expect(value.innerText).toEqual(cell.toString());
          expect(calculated.innerText).toEqual(cell.toString());
        }
      }

      expect(visitedCellCount).toBe(container.getAllByRole("cell").length);
    });
  });
});
