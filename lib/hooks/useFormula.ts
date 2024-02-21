import { useContext } from "react";
import { FormulaContextValue } from "../types";
import { FormulaContext } from "../FormulaProvider";

export function useFormula(): FormulaContextValue {
  const { getGrid, updateCellValues } = useContext(FormulaContext);

  return {
    getGrid,
    updateCellValues,
  };
}
