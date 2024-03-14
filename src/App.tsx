import "./App.css";
import { FormulaProvider } from "../";
import Grid from "./components/Grid";

function App() {
  return (
    <FormulaProvider
      initialGrid={[
        [0, 1, 2, 3, 4],
        [0, "=A1+B1+C1+C3", 2, 3, 4],
        [0, 1, 2, 3, 4],
      ]}
    >
      <Grid />
    </FormulaProvider>
  );
}

export default App;
