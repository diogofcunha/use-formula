import { useEffect, useState } from "react";
import { Cell, CellCoordinates } from "../types";
import { useFormula } from "./useFormula";
import { getEventEmitter } from "../getEventEmitter";

export interface CellWatchResult {
  value: Cell;
  calculated: Cell;
}

const eventEmitter = getEventEmitter();

export function useWatchCell({
  rowIdx,
  columnIdx,
}: CellCoordinates): CellWatchResult {
  const { getSheet } = useFormula();

  const [value, setValue] = useState<CellWatchResult>({
    value: getSheet()[rowIdx][columnIdx].value,
    calculated: getSheet()[rowIdx][columnIdx].calculated,
  });

  useEffect(() => {
    const unsubscribe = eventEmitter.subscribe((change) => {
      if (change.columnIdx === columnIdx && change.rowIdx === rowIdx) {
        setValue({
          value: change.value,
          calculated: change.calculated,
        });
      }
    });

    return () => unsubscribe();
  }, [rowIdx, columnIdx]);

  return value;
}
