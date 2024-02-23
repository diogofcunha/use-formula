import { expect, test, describe, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
});
