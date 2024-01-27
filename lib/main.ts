import { useState, useRef } from "react";
import { createFormulaStore } from "formula-store";
import { Grid } from "./types";

export default function useFormula() {
  const [grid, setGrid] = useState<Grid>([[]]);
  const cellIdxById = useRef(new Map<string, [number, number]>());

  useRef(
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

  return grid;
}
