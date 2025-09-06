import { ElementCounts, Token } from "./types";

function mergeCounts(
  into: ElementCounts,
  add: ElementCounts,
  factor = 1
): ElementCounts {
  for (const [el, count] of Object.entries(add)) {
    into[el] = (into[el] ?? 0) + count * factor;
  }
  return into;
}

function parseSequence(
  tokens: Token[],
  idx: { i: number },
  stopOn: Set<Token["t"]>
): ElementCounts {
  const out: ElementCounts = {};
  while (idx.i < tokens.length) {
    const tok = tokens[idx.i];
    if (stopOn.has(tok.t)) break;

    if (tok.t === "ELEMENT") {
      idx.i++;
      const el = tok.v;
      let mult = 1;
      if (tokens[idx.i]?.t === "NUMBER") {
        mult = (tokens[idx.i] as any).v;
        idx.i++;
      }
      out[el] = (out[el] ?? 0) + mult;
      continue;
    }

    if (tok.t === "LP") {
      const opener = tok.v;
      const closer = opener === "(" ? ")" : opener === "[" ? "]" : "}";
      idx.i++;
      const inner = parseSequence(tokens, idx, new Set<Token["t"]>(["RP"]));
      if (tokens[idx.i]?.t !== "RP" || (tokens[idx.i] as any).v !== closer) {
        const found =
          tokens[idx.i]?.t === "RP"
            ? (tokens[idx.i] as any).v
            : tokens[idx.i]?.t;
        throw new Error(
          `Mismatched grouping: expected "${closer}" but found "${
            found ?? "end"
          }"`
        );
      }
      idx.i++;
      let mult = 1;
      if (tokens[idx.i]?.t === "NUMBER") {
        mult = (tokens[idx.i] as any).v;
        idx.i++;
      }
      mergeCounts(out, inner, mult);
      continue;
    }

    if (tok.t === "NUMBER") {
      const coeff = tok.v;
      idx.i++;
      const next = tokens[idx.i];
      if (!next || (next.t !== "ELEMENT" && next.t !== "LP")) {
        throw new Error(
          `Coefficient ${coeff} must precede an element or group`
        );
      }
      if (next.t === "ELEMENT") {
        idx.i++;
        const el = next.v;
        let mult = 1;
        if (tokens[idx.i]?.t === "NUMBER") {
          mult = (tokens[idx.i] as any).v;
          idx.i++;
        }
        out[el] = (out[el] ?? 0) + coeff * mult;
        continue;
      }
      if (next.t === "LP") {
        const opener = next.v;
        const closer = opener === "(" ? ")" : opener === "[" ? "]" : "}";
        idx.i++;
        const inner = parseSequence(tokens, idx, new Set<Token["t"]>(["RP"]));
        if (tokens[idx.i]?.t !== "RP" || (tokens[idx.i] as any).v !== closer) {
          const found =
            tokens[idx.i]?.t === "RP"
              ? (tokens[idx.i] as any).v
              : tokens[idx.i]?.t;
          throw new Error(
            `Mismatched grouping: expected "${closer}" but found "${
              found ?? "end"
            }"`
          );
        }
        idx.i++;
        let mult = 1;
        if (tokens[idx.i]?.t === "NUMBER") {
          mult = (tokens[idx.i] as any).v;
          idx.i++;
        }
        mergeCounts(out, inner, coeff * mult);
        continue;
      }
    }

    if (tok.t === "DOT" || tok.t === "END") break;

    throw new Error(`Unexpected token ${tok.t} while parsing`);
  }
  return out;
}

export function parseHydrateProduct(tokens: Token[]): ElementCounts {
  const total: ElementCounts = {};
  const idx = { i: 0 };
  while (idx.i < tokens.length) {
    const partCounts = parseSequence(
      tokens,
      idx,
      new Set<Token["t"]>(["DOT", "END"])
    );
    mergeCounts(total, partCounts, 1);
    const tok = tokens[idx.i];
    if (tok?.t === "DOT") {
      idx.i++;
      continue;
    }
    if (tok?.t === "END") break;
    break;
  }
  return total;
}
