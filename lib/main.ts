import { useState, useRef } from "react";
import { createFormulaStore } from "formula-store";
import { Grid, UseFormula } from "./types";
import { getIdxKey } from "./utils";

export default function useFormula(initialGrid: Grid): UseFormula {
  const [grid, setGrid] = useState<Grid>(initialGrid);
  const cellIdxById = useRef(new Map<string, [number, number]>());
  const cellIdByIdx = useRef(new Map<string, string>());

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
