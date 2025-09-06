import { Token } from "./types";

const isUpper = (c: string) => /[A-Z]/.test(c);
const isLower = (c: string) => /[a-z]/.test(c);
const isDigit = (c: string) => /[0-9]/.test(c);

/** Tokenize formula, supporting underscores before numbers and dots for hydrates. */
export function tokenize(inputRaw: string): Token[] {
  const input = inputRaw.replace(/\s+/g, "").replace(/·/g, ".");
  const tokens: Token[] = [];
  let i = 0;

  const readNumber = (): number => {
    let s = "";
    while (i < input.length && isDigit(input[i])) s += input[i++];
    return s.length ? parseInt(s, 10) : NaN;
  };

  while (i < input.length) {
    const c = input[i];

    if (c === "(" || c === "[" || c === "{") {
      tokens.push({ t: "LP", v: c as any });
      i++;
      continue;
    }
    if (c === ")" || c === "]" || c === "}") {
      tokens.push({ t: "RP", v: c as any });
      i++;
      continue;
    }
    if (c === ".") {
      tokens.push({ t: "DOT" });
      i++;
      continue;
    }

    if (isUpper(c)) {
      let symbol = c;
      i++;
      if (i < input.length && isLower(input[i])) symbol += input[i++];
      tokens.push({ t: "ELEMENT", v: symbol });
      if (i < input.length && input[i] === "_") {
        i++;
        const n = readNumber();
        if (Number.isNaN(n))
          throw new Error(`Expected digits after "_" at ${i} in "${inputRaw}"`);
        tokens.push({ t: "NUMBER", v: n });
      } else if (i < input.length && isDigit(input[i])) {
        tokens.push({ t: "NUMBER", v: readNumber() });
      }
      continue;
    }

    if (isDigit(c)) {
      tokens.push({ t: "NUMBER", v: readNumber() });
      continue;
    }

    if (c === "_") {
      i++;
      const n = readNumber();
      if (Number.isNaN(n))
        throw new Error(`Expected digits after "_" at ${i} in "${inputRaw}"`);
      tokens.push({ t: "NUMBER", v: n });
      continue;
    }

    throw new Error(
      `Unexpected character "${c}" at position ${i} in "${inputRaw}"`
    );
  }

  tokens.push({ t: "END" });
  return tokens;
}
