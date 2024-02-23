export interface Formula {
  dependencies: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculate: (...dependencies: any[]) => any;
}

export type Cell = number | string;
export type Grid = Cell[][];

export interface SheetCell {
  value: Cell;
  calculated: Cell;
}
export type Sheet = SheetCell;

export interface CellCoordinates {
  rowIdx: number;
  columnIdx: number;
}

export interface UpdateCellPayload {
  rowIdx: number;
  columnIdx: number;
  value: Cell;
}

export interface FormulaContextValue {
  getGrid: () => Grid;
  getSheet: () => Sheet;
  updateCellValues: (update: UpdateCellPayload[]) => void;
}
