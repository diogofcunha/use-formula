import { useContext } from "react";
import { FormulaContextValue } from "../types";
import { FormulaContext } from "../FormulaProvider";

export function useFormula(): FormulaContextValue {
  const { updateCellValues, getSheet } = useContext(FormulaContext);

  return {
    getSheet,
    updateCellValues,
  };
}
