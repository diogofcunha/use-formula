import "./App.css";
import useFormula from "../";

function App() {
  const { grid, updateCellValues } = useFormula([
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4],
  ]);

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
                    <td key={columnIdx}>
                      <input
                        value={column}
                        onChange={(up) => {
                          updateCellValues([
                            {
                              columnIdx,
                              rowIdx,
                              value: Number(up.target.value),
                            },
                          ]);
                        }}
                      />
                    </td>
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
