import { useFormula } from "../..";
import Cell from "./Cell";
import { useRenderCounter } from "../hooks/useRenderCounter";

function Grid() {
  const { grid, updateCellValues } = useFormula();

  const renderCount = useRenderCounter();

  return (
    <>
      <div>Rendered {renderCount}</div>
      <h1>Simple example</h1>
      <table>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((column, columnIdx) => {
                  return (
                    <Cell
                      key={`${rowIdx}-${columnIdx}`}
                      columnIdx={columnIdx}
                      rowIdx={rowIdx}
                      value={column}
                      onChange={updateCellValues}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Grid;
