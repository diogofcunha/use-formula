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
          onChange([{ columnIdx, rowIdx, value: Number(e.target.value) }]);
        }}
      />
    </td>
  );
}
