import { useState, useRef, useEffect } from "react";
import { createFormulaStore } from "formula-store";
import { Grid, UseFormula } from "./types";
import { getIdxKey } from "./utils";
import { v4 } from "uuid";

export default function useFormula(initialGrid: Grid): UseFormula {
  const [grid, setGrid] = useState<Grid>(initialGrid);
  const cellIdxById = useRef(new Map<string, [number, number]>());
  const cellIdByIdx = useRef(new Map<string, string>());

  useEffect(() => {
    for (let rowIdx = 0; rowIdx < initialGrid.length; rowIdx++) {
      const column = initialGrid[rowIdx];

      for (let columnIdx = 0; columnIdx < column.length; columnIdx++) {
        const id = v4();

        cellIdxById.current.set(id, [rowIdx, columnIdx]);
        cellIdByIdx.current.set(getIdxKey(rowIdx, columnIdx), id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const store = useRef(
    createFormulaStore({
      onChange: (updates) => {
        const newGrid = grid.slice();

        for (const { id, value } of updates) {
          const idx = cellIdxById.current.get(id);

          if (!idx) {
            throw new Error(`Failed to get cell with id ${id}`);
          }

          newGrid[idx[0]] = newGrid[idx[0]].slice();

          const cell = newGrid[(idx[0], idx[1])];

          if (cell === undefined) {
            throw new Error(`Failed to get cell at (${idx[0]},${idx[1]})`);
          }

          newGrid[idx[0]][idx[1]] = value as number;
        }

        setGrid(newGrid);
      },
    })
  );

  return {
    grid,
    updateCellValues: (updates) => {
      store.current.updateFieldsValue(
        updates.map((updt) => {
          const id = cellIdByIdx.current.get(
            getIdxKey(updt.rowIdx, updt.columnIdx)
          );

          if (id === undefined) {
            throw new Error(
              `Cell (${updt.rowIdx},${updt.columnIdx}) not found.`
            );
          }

          return {
            id,
            value: updt.value,
          };
        })
      );
    },
  };
}
