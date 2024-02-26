import { expect, test, describe, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import App from "../App";

describe("integration", () => {
  const getCell = (rowIdx: number, columnIdx: number) => {
    return screen.getByTestId(
      `cell-${rowIdx}-${columnIdx}`
    ) as HTMLInputElement;
  };

  afterEach(() => {
    cleanup();
  });

  test("should render provided value for simple cells", () => {
    render(<App />);

    expect(getCell(0, 0).value).toEqual("0");
    expect(getCell(1, 3).value).toEqual("3");
    expect(getCell(2, 4).value).toEqual("4");
  });

  test("should render final calculation value for formula cells", () => {
    render(<App />);

    expect(getCell(1, 1).value).toEqual("5");
  });

  test("should update simple cell value", () => {
    render(<App />);

    const targetInput = getCell(0, 0);

    fireEvent.change(targetInput, { target: { value: "7" } });
    fireEvent.blur(targetInput);

    expect(getCell(0, 0).value).toEqual("7");
  });

  test("should update formula cell value when dependency value is changed", () => {
    render(<App />);

    const targetInput = getCell(0, 0);

    fireEvent.change(targetInput, { target: { value: "1" } });
    fireEvent.blur(targetInput);

    expect(getCell(1, 1).value).toEqual("6");
  });

  test("should transform simple cell into formula", () => {
    render(<App />);

    // Setup 2 cells
    const a1 = getCell(0, 0);
    fireEvent.change(a1, { target: { value: "5" } });
    fireEvent.blur(a1);
    const b3 = getCell(2, 1);
    fireEvent.change(b3, { target: { value: "2" } });
    fireEvent.blur(b3);

    // Transform numeric cell into formula
    const c3 = getCell(2, 2);
    fireEvent.change(c3, { target: { value: "=(A1+B3)*2" } });
    fireEvent.blur(c3);

    expect(getCell(2, 2).value).toEqual(`${(5 + 2) * 2}`);
  });

  test("should transform formula cell into numeric cell", () => {
    render(<App />);

    const targetInput = getCell(1, 1);

    fireEvent.change(targetInput, { target: { value: "2" } });
    fireEvent.blur(targetInput);

    expect(getCell(1, 1).value).toEqual("2");
  });

  test("should show error when trying to add a circular dependency", () => {
    render(<App />);

    const targetInput = getCell(0, 0);

    fireEvent.change(targetInput, { target: { value: "=B2" } });
    fireEvent.blur(targetInput);

    expect(getCell(0, 0).value).toEqual("#ERROR");
  });

  test("should show error when trying to add a dependency to a cell that doesn't exist", () => {
    render(<App />);

    const targetInput = getCell(0, 0);

    fireEvent.change(targetInput, { target: { value: "=X1" } });
    fireEvent.blur(targetInput);

    expect(getCell(0, 0).value).toEqual("#ERROR");
  });

  test("should show error in formula cell if one of the reference cells has an error", () => {
    render(<App />);

    // Change depenency cell.
    const targetInput = getCell(0, 0);
    fireEvent.change(targetInput, { target: { value: "=X1" } });
    fireEvent.blur(targetInput);

    expect(getCell(1, 1).value).toEqual("#ERROR");
  });
});
