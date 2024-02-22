import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Formula, Grid, FormulaContextValue } from "./types";
import { createFormulaStore } from "formula-store";
import { parseCell } from "./parse-cell";
import { v4 } from "uuid";
import { getIdxKey } from "./utils";
import { FormulaField } from "formula-store/lib/types";
import { getEventEmitter } from "./getEventEmitter";

export const FormulaContext = React.createContext<FormulaContextValue>({
  getGrid: () => [],
  updateCellValues: () => {},
});

const eventEmitter = getEventEmitter();

export function FormulaProvider({
  initialGrid,
  children,
}: PropsWithChildren<{ initialGrid: Grid }>) {
  const grid = useRef<Grid>(initialGrid);
  const cellIdxById = useRef(new Map<string, [number, number]>());
  const cellIdByIdx = useRef(new Map<string, string>());

  const mapDependencies = (formula: Formula) =>
    formula.dependencies.map((d) => {
      return cellIdByIdx.current.get(d)!;
    });

  const store = useRef(
    createFormulaStore({
      onChange: (updates) => {
        const newGrid = grid.current;

        for (const { id, value } of updates) {
          const idx = cellIdxById.current.get(id);

          if (!idx) {
            throw new Error(`Failed to get cell with id ${id}`);
          }

          const [rowIdx, columnIdx] = idx;

          newGrid[rowIdx] = newGrid[columnIdx].slice();

          const cell = newGrid[rowIdx][columnIdx];

          if (cell === undefined) {
            throw new Error(`Failed to get cell at (${rowIdx},${columnIdx})`);
          }

          const previousValue = newGrid[rowIdx][columnIdx];

          if (previousValue !== value) {
            newGrid[rowIdx][columnIdx] = value as number;
            eventEmitter.emitEvent({
              rowIdx,
              columnIdx,
              value: value as number,
              displayValue: value as string,
            });
          }
        }

        grid.current = newGrid;
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

  return (
    <FormulaContext.Provider
      value={{
        getGrid: () => grid.current,
        updateCellValues: (updates) => {
          const cells = updates.map((u) => {
            const id = cellIdByIdx.current.get(
              getIdxKey(u.rowIdx, u.columnIdx)
            );

            if (id === undefined) {
              throw new Error(`Cell (${u.rowIdx},${u.columnIdx}) not found.`);
            }

            return { cell: parseCell(u.value), id };
          });

          const simpleUpdates: Array<{ value: unknown; id: string }> = [];
          const fullFieldUpdates: Array<FormulaField<unknown>> = [];

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
      }}
    >
      {children}
    </FormulaContext.Provider>
  );
}
