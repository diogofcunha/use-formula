import { useContext } from "react";
import { FormulaContextValue } from "../types";
import { FormulaContext } from "../FormulaProvider";

export function useFormula(): FormulaContextValue {
  const { getGrid, updateCellValues, watchCell } = useContext(FormulaContext);

  return {
    getGrid,
    updateCellValues,
    watchCell,
  };
}
