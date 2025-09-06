import { describe, it, expect } from "vitest";
import { parseFormula } from "../src";

describe("parseFormula", () => {
  it("parses water", () => {
    expect(parseFormula("H_2O")).toEqual({ H: 2, O: 1 });
  });

  it("parses nested groups", () => {
    expect(parseFormula("Fe_2(SO_4)_3")).toEqual({ Fe: 2, S: 3, O: 12 });
  });

  it("parses hydrate dot", () => {
    expect(parseFormula("CuSO_4·5H_2O")).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
  });

  it("supports plain digits too", () => {
    expect(parseFormula("C6H12O6")).toEqual({ C: 6, H: 12, O: 6 });
  });
});
