import { Cell } from "./types";

export function parseCell(cell: Cell): number | string {
  if (typeof cell === "number") {
    return cell;
  }

  if (typeof cell === "string") {
    if (!Number.isNaN(Number(cell))) {
      return Number(cell);
    }

    if (cell.startsWith("=")) {
      //
    } else {
      return cell;
    }
  }

  throw new Error("Not implemented");
}
