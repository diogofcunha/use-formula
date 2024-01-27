import "./App.css";
import useFormula from "../";
import Cell from "./components/Cell";

function App() {
  const { grid, updateCellValues } = useFormula([
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
  ]);

  console.log(grid);

  return (
    <>
      <div></div>
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
