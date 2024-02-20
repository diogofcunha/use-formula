import { useState, useRef, useEffect } from "react";
import { createFormulaStore } from "formula-store";
import { Formula, Grid, UseFormula } from "./types";
import { getIdxKey } from "./utils";
import { v4 } from "uuid";
import { parseCell } from "./parse-cell";
import { FormulaField } from "formula-store/lib/types";

export default function useFormula(initialGrid: Grid): UseFormula {
  const [grid, setGrid] = useState<Grid>(initialGrid);
  const cellIdxById = useRef(new Map<string, [number, number]>());
  const cellIdByIdx = useRef(new Map<string, string>());

  const mapDependencies = (formula: Formula) =>
    formula.dependencies.map((d) => {
      return cellIdByIdx.current.get(d)!;
    });

  const store = useRef(
    createFormulaStore({
      onChange: (updates) => {
        setGrid((g) => {
          const newGrid = g.slice();

          for (const { id, value } of updates) {
            const idx = cellIdxById.current.get(id);

            if (!idx) {
              throw new Error(`Failed to get cell with id ${id}`);
            }

            newGrid[idx[0]] = newGrid[idx[0]].slice();

            const cell = newGrid[idx[0]][idx[1]];

            if (cell === undefined) {
              throw new Error(`Failed to get cell at (${idx[0]},${idx[1]})`);
            }

            newGrid[idx[0]][idx[1]] = value as number;
          }

          return newGrid;
        });
      },
    })
  );

  useEffect(() => {
    const formulas: Array<Formula & { id: string }> = [];

    for (let rowIdx = 0; rowIdx < initialGrid.length; rowIdx++) {
      const column = initialGrid[rowIdx];

      for (let columnIdx = 0; columnIdx < column.length; columnIdx++) {
        const cell = parseCell(column[columnIdx]);
        const id = v4();

        let value: string | number = "";

        if (typeof cell === "object") {
          value = "";
          formulas.push({ ...cell, id });
        } else {
          value = cell;
        }

        store.current.addField({
          dependencies: [],
          id,
          value,
        });

        cellIdxById.current.set(id, [rowIdx, columnIdx]);
        cellIdByIdx.current.set(getIdxKey(rowIdx, columnIdx), id);
      }
    }

    for (const f of formulas) {
      store.current.editField({
        dependencies: mapDependencies(f),
        calculate: f.calculate,
        id: f.id,
        value: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    grid,
    updateCellValues: (updates) => {
      const cells = updates.map((u) => {
        const id = cellIdByIdx.current.get(getIdxKey(u.rowIdx, u.columnIdx));

        if (id === undefined) {
          throw new Error(`Cell (${u.rowIdx},${u.columnIdx}) not found.`);
        }

        return { cell: parseCell(u.value), id };
      });

      const simpleUpdates: Array<{ value: unknown; id: string }> = [];
      const fullFieldUpdates: Array<FormulaField<any>> = [];

      for (const { cell, id } of cells) {
        if (typeof cell === "object") {
          fullFieldUpdates.push({
            calculate: cell.calculate,
            dependencies: mapDependencies(cell),
            id,
            value: "",
          });
        } else {
          simpleUpdates.push({ value: cell, id });
        }
      }

      if (simpleUpdates.length) {
        store.current.updateFieldsValue(simpleUpdates);
      }

      for (const f of fullFieldUpdates) {
        store.current.editField({
          dependencies: f.dependencies,
          calculate: f.calculate,
          id: f.id,
          value: "",
        });
      }
    },
  };
}
