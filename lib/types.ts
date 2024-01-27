export type Cell = number;
export type Grid = Cell[][];

export interface UpdateCellPayload {
  rowIdx: number;
  columnIdx: number;
  value: Cell;
}

export interface UseFormula {
  grid: Grid;
  updateCellValue: (update: UpdateCellPayload) => void;
}
