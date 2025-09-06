import { describe, it, expect } from "vitest";
import { molarMass } from "../src";

// Loose bounds so different atomic weight tables still pass
describe("molarMass", () => {
  it("computes H_2O within tolerance", () => {
    const { molarMass: mw } = molarMass("H_2O");
    expect(mw).toBeGreaterThan(18);
    expect(mw).toBeLessThan(19);
  });
});
