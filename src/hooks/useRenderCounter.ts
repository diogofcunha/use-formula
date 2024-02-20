import { useEffect, useRef } from "react";

export function useRenderCounter() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
  });

  return renderCount.current;
}
