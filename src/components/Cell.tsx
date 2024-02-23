import { useState } from "react";
import { useWatchCell } from "../..";
import { UpdateCellPayload } from "../../lib/types";

interface Props {
  columnIdx: number;
  rowIdx: number;
  onChange: (value: UpdateCellPayload[]) => void;
}

export default function Cell({ columnIdx, rowIdx, onChange }: Props) {
  const { value, calculated } = useWatchCell({ rowIdx, columnIdx });

  const [uncommitedValue, setUncommitedValue] = useState<null | string>(null);

  return (
    <td style={{ position: "relative" }}>
      <input
        onFocus={() => setUncommitedValue(value.toString())}
        type="text"
        value={uncommitedValue === null ? calculated : uncommitedValue}
        onChange={(e) => {
          setUncommitedValue(e.target.value);
        }}
        onBlur={(e) => {
          let value: string | number = e.target.value;

          if (value && !Number.isNaN(Number(value))) {
            value = Number(value);
          }

          onChange([{ columnIdx, rowIdx, value }]);
          setUncommitedValue(null);
        }}
      />
    </td>
  );
}
