import { Cell, Formula } from "./types";
import { getIdxKey } from "./utils";
import { evaluate } from "mathjs/number";

export function parseCell(cell: Cell): number | string | Formula {
  if (typeof cell === "number") {
    return cell;
  }

  if (typeof cell === "string") {
    if (!Number.isNaN(Number(cell))) {
      return Number(cell);
    }

    if (cell.startsWith("=")) {
      let formula = cell.slice(1);
      const dependencyRegex = /[A-Z]+[1-9][0-9]*/g;
      const matches = cell.match(dependencyRegex) || [];

      const dependencies: string[] = [];
      const dependencyTrack = new Set<string>();

      for (const match of matches) {
        const columnPart = match.match(/[A-Z]+/)?.[0];
        const rowPart = match.match(/[1-9][0-9]*/)?.[0];

        if (columnPart === undefined || rowPart === undefined) {
          return "#ERROR";
        }

        let column = 0;
        for (let i = 0; i < columnPart.length; i++) {
          column =
            column * 26 + (columnPart.charCodeAt(i) - "A".charCodeAt(0) + 1);
        }
        column -= 1;
        const row = parseInt(rowPart) - 1;

        if (dependencyTrack.has(getIdxKey(row, column))) {
          continue;
        }

        dependencyTrack.add(getIdxKey(row, column));
        dependencies.push(getIdxKey(row, column));
        const replaceRegex = new RegExp(match, "g");
        formula = formula.replace(replaceRegex, getIdxKey(row, column));
      }

      return {
        dependencies,
        calculate(...dependencyValues) {
          let toEvaluate = formula;

          dependencyValues.forEach((d, i) => {
            const replaceRegex = new RegExp(dependencies[i], "g");
            toEvaluate = toEvaluate.replace(replaceRegex, d);
          });

          return evaluate(toEvaluate);
        },
      };
    } else {
      return cell;
    }
  }

  throw new Error("Not implemented");
}
