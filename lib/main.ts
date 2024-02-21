import { useContext } from "react";
import { UseFormula } from "./types";
import { FormulaContext } from "./FormulaProvider";

export function useFormula(): UseFormula {
  const { grid, updateCellValues } = useContext(FormulaContext);

  return {
    grid,
    updateCellValues,
  };
}

export { FormulaProvider } from "./FormulaProvider";
