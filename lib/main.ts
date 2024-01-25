import { useState } from "react";

export default function useFormula() {
  const [count, setCount] = useState(0);

  return [count, setCount];
}
