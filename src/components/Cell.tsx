import { useWatchCell } from "../..";
import { UpdateCellPayload } from "../../lib/types";

interface Props {
  columnIdx: number;
  rowIdx: number;
  onChange: (value: UpdateCellPayload[]) => void;
}

export default function Cell({ columnIdx, rowIdx, onChange }: Props) {
  const { value } = useWatchCell({ rowIdx, columnIdx });

  return (
    <td>
      <input
        type="text"
        defaultValue={`${value}`}
        onBlur={(e) => {
          let value: string | number = e.target.value;

          if (value && !Number.isNaN(Number(value))) {
            value = Number(value);
          }

          onChange([{ columnIdx, rowIdx, value }]);
        }}
      />
    </td>
  );
}
