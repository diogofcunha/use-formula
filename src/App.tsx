import "./App.css";
import useFormula from "../";
import Cell from "./components/Cell";
import { useRenderCounter } from "./hooks/useRenderCounter";

function App() {
  const { grid, updateCellValues } = useFormula([
    [0, 1, 2, 3, 4],
    [0, "=A1+B1+C1+C3", 2, 3, 4],
    [0, 1, 2, 3, 4],
  ]);

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

export default App;
