import { ElementCounts, ParseResult } from "./types";
import { tokenize } from "./lexer";
import { parseHydrateProduct } from "./parser";
import { ATOMIC_WEIGHTS } from "../constants/weights";

export function parseFormula(formula: string): ElementCounts {
  const tokens = tokenize(formula);
  return parseHydrateProduct(tokens);
}

export function computeMolarMass(
  counts: ElementCounts,
  weights: Record<string, number> = ATOMIC_WEIGHTS
): number {
  let total = 0;
  for (const [el, n] of Object.entries(counts)) {
    const w = weights[el];
    if (w == null) {
      throw new Error(
        `Unknown element "${el}". Add it to the atomic weights table to proceed.`
      );
    }
    total += w * n;
  }
  return total;
}

export function molarMass(
  formula: string,
  weights: Record<string, number> = ATOMIC_WEIGHTS
): ParseResult {
  const counts = parseFormula(formula);
  const molarMass = computeMolarMass(counts, weights);
  return { counts, molarMass };
}
