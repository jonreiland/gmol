export type ElementCounts = Record<string, number>;

export interface ParseResult {
  counts: ElementCounts;
  molarMass: number; // g/mol
}

export type Token =
  | { t: "ELEMENT"; v: string }
  | { t: "NUMBER"; v: number }
  | { t: "LP"; v: "(" | "[" | "{" }
  | { t: "RP"; v: ")" | "]" | "}" }
  | { t: "DOT" }
  | { t: "END" };
