import { expect, test, describe, afterEach } from "vitest";
import { FormulaProvider, useFormula } from "../main";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { Grid } from "../types";
import { useState } from "react";

const TestComponent = () => {
  const { getSheet } = useFormula();
  const [sheet, setSheet] = useState(() => getSheet());

  return (
    <div>
      <button
        data-testid={"refetch-sheet"}
        onClick={() => {
          const sheet = getSheet();

          setSheet([...sheet]);
        }}
      >
        Refetch
      </button>
      {sheet.map((r, rowIdx) => {
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

const setup = (
  grid: Grid = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ]
) => {
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
    test("should output initial grid values correctly (simple)", () => {
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

    test("should output initial grid values correctly (with formulas)", () => {
      const { container, grid } = setup([
        [1, 2, 3, 4, "=A1+B1+C1+D1"],
        [6, 7, 8, 9, "=A2+B2+C2+D2"],
        [11, 12, 13, 14, "=A3+B3+C3+D3"],
      ]);

      fireEvent.click(container.getByTestId("refetch-sheet"));

      let visitedCellCount = 0;

      for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const row = grid[rowIdx];
        let sum = 0;

        for (let columnIdx = 0; columnIdx < row.length; columnIdx++) {
          const cell = row[columnIdx];
          visitedCellCount++;

          const value = container.getByTestId(`value-${rowIdx}-${columnIdx}`);
          const calculated = container.getByTestId(
            `calculated-${rowIdx}-${columnIdx}`
          );

          expect(value.innerText).toEqual(cell.toString());

          if (columnIdx === 4) {
            expect(calculated.innerText).toEqual(sum.toString());
          } else {
            sum += cell as number;
            expect(calculated.innerText).toEqual(cell.toString());
          }
        }
      }

      expect(visitedCellCount).toBe(container.getAllByRole("cell").length);
    });
  });
});
