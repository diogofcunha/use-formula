import { useContext } from "react";
import { FormulaContextValue } from "../types";
import { FormulaContext } from "../FormulaProvider";

export function useFormula(): FormulaContextValue {
  const { grid, updateCellValues } = useContext(FormulaContext);

  return {
    grid,
    updateCellValues,
  };
}
