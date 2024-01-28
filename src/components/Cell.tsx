import { UpdateCellPayload } from "../../lib/types";

interface Props<T> {
  columnIdx: number;
  rowIdx: number;
  value: T;
  onChange: (value: UpdateCellPayload[]) => void;
}

export default function Cell<T>({
  columnIdx,
  rowIdx,
  value,
  onChange,
}: Props<T>) {
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
