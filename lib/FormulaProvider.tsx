import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Formula, Grid, FormulaContextValue, Sheet, Cell } from "./types";
import { createFormulaStore } from "formula-store";
import { parseCell } from "./parse-cell";
import { v4 } from "uuid";
import { getIdxKey } from "./utils";
import { FormulaField } from "formula-store/lib/types";
import { FormulaFieldCircularDependencyError } from "formula-store/lib/errors";

import { getEventEmitter } from "./getEventEmitter";

export const FormulaContext = React.createContext<FormulaContextValue>({
  updateCellValues: () => {},
  getSheet: () => [],
});

const eventEmitter = getEventEmitter();
export const ERROR_CODE = "#ERROR";

export function FormulaProvider({
  initialGrid,
  children,
}: PropsWithChildren<{ initialGrid: Grid }>) {
  const sheet = useRef<Sheet>(
    initialGrid.map((r) => {
      return r.map((c) => {
        return {
          value: c,
          calculated: c,
        };
      });
    })
  );

  const cellIdxById = useRef(new Map<string, [number, number]>());
  const cellIdByIdx = useRef(new Map<string, string>());
  const formulasFieldsById = new Map<string, string>();

  const mapDependencies = (formula: Formula) =>
    formula.dependencies.map((d) => {
      return cellIdByIdx.current.get(d)!;
    });

  const store = useRef(
    createFormulaStore({
      onChange: (updates) => {
        const newSheet = sheet.current;

        for (const { id, value } of updates) {
          const idx = cellIdxById.current.get(id);

          if (!idx) {
            throw new Error(`Failed to get cell with id ${id}`);
          }

          const [rowIdx, columnIdx] = idx;

          newSheet[rowIdx] = newSheet[columnIdx].slice();

          const cell = newSheet[rowIdx][columnIdx];

          if (cell === undefined) {
            throw new Error(`Failed to get cell at (${rowIdx},${columnIdx})`);
          }

          const previousValue = newSheet[rowIdx][columnIdx];

          if (previousValue !== value) {
            const cellValue = formulasFieldsById.get(id) || (value as Cell);
            const cellCalculatedValue = value as Cell;

            newSheet[rowIdx][columnIdx].value = cellValue;
            newSheet[rowIdx][columnIdx].calculated = cellCalculatedValue;

            eventEmitter.emitEvent({
              rowIdx,
              columnIdx,
              value: cellValue,
              calculated: cellCalculatedValue as string,
            });
          }
        }

        sheet.current = newSheet;
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
          formulasFieldsById.set(id, column[columnIdx] as string);
          value = "";
          formulas.push({ ...cell, id });
        } else {
          formulasFieldsById.delete(id);
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
        getSheet: () => sheet.current,
        updateCellValues: (updates) => {
          const cells = updates.map((u) => {
            const id = cellIdByIdx.current.get(
              getIdxKey(u.rowIdx, u.columnIdx)
            );

            if (id === undefined) {
              throw new Error(`Cell (${u.rowIdx},${u.columnIdx}) not found.`);
            }

            return { cell: parseCell(u.value), id, original: u.value };
          });

          const simpleUpdates: Array<{ value: unknown; id: string }> = [];
          const fullFieldUpdates: Array<FormulaField<unknown>> = [];

          for (const { cell, id, original } of cells) {
            if (typeof cell === "object") {
              formulasFieldsById.set(id, original as string);
              fullFieldUpdates.push({
                calculate: cell.calculate,
                dependencies: mapDependencies(cell),
                id,
                value: "",
              });
            } else {
              if (formulasFieldsById.has(id)) {
                formulasFieldsById.delete(id);

                fullFieldUpdates.push({
                  dependencies: [],
                  id,
                  value: cell,
                });
              }

              simpleUpdates.push({ value: cell, id });
            }
          }

          for (const f of fullFieldUpdates) {
            try {
              store.current.editField({
                dependencies: f.dependencies,
                calculate: f.calculate,
                id: f.id,
                value: "",
              });
            } catch (ex) {
              if (ex instanceof FormulaFieldCircularDependencyError) {
                store.current.addField({
                  dependencies: [],
                  calculate: undefined,
                  id: f.id,
                  value: "",
                });
              }

              formulasFieldsById.delete(f.id);

              simpleUpdates.push({ value: ERROR_CODE, id: f.id });
            }
          }

          if (simpleUpdates.length) {
            store.current.updateFieldsValue(simpleUpdates);
          }
        },
      }}
    >
      {children}
    </FormulaContext.Provider>
  );
}
