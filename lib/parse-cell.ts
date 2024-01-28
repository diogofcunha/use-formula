import { Cell } from "./types";

export function parseCell(cell: Cell): number | string {
  if (typeof cell === "number") {
    return cell;
  }

  throw new Error("Not implemented");
}
