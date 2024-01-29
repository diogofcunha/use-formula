export interface Formula {
  dependencies: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculate: (...dependencies: any[]) => any;
}

export type Cell = number | string;
export type Grid = Cell[][];

export interface UpdateCellPayload {
  rowIdx: number;
  columnIdx: number;
  value: Cell;
}

export interface UseFormula {
  grid: Grid;
  updateCellValues: (update: UpdateCellPayload[]) => void;
}
