import { expect, test, describe } from "vitest";
import { getEventEmitter } from "../getEventEmitter";
import { CellCoordinates } from "../types";

describe("getEventEmitter", () => {
  test("should emit and subscribe", () => {
    const { emitEvent, subscribe } = getEventEmitter();

    const calls: CellCoordinates[] = [];

    const cb = (c: CellCoordinates) => {
      calls.push(c);
    };

    emitEvent({ rowIdx: 0, columnIdx: 1 });

    const unsubscribe = subscribe(cb);

    emitEvent({ rowIdx: 2, columnIdx: 1 });
    emitEvent({ rowIdx: 3, columnIdx: 1 });

    unsubscribe();

    emitEvent({ rowIdx: 4, columnIdx: 1 });
    emitEvent({ rowIdx: 5, columnIdx: 1 });

    expect(calls).toEqual([
      { rowIdx: 2, columnIdx: 1 },
      { rowIdx: 3, columnIdx: 1 },
    ]);
  });
});
