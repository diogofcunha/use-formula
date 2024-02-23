import { useContext } from "react";
import { FormulaContextValue } from "../types";
import { FormulaContext } from "../FormulaProvider";

export function useFormula(): FormulaContextValue {
  const { getGrid, updateCellValues, getSheet } = useContext(FormulaContext);

  return {
    getGrid,
    getSheet,
    updateCellValues,
  };
}
