# GMol

Parse chemical formulas (with underscore subscripts, e.g. `H_2O`, `Fe_2(SO_4)_3`) and compute molar masses. Works in Node and the browser. Includes a CLI.

## Install

```bash
npm i gmol
# or
pnpm add gmol
```

## Usage (Library)

```typescript
import { molarMass, parseFormula } from "gmol";

const { counts, molarMass: mw } = molarMass("Fe_2(SO_4)_3");
console.log(counts); // { Fe: 2, S: 3, O: 12 }
console.log(mw); // ~399.88
```

### Browser

The package has no Node-only APIs, so you can import it in bundlers (Vite/Next/Webpack) and use it client-side.

### API

- `tokenize(formula: string): Token[]`
- `parseFormula(formula: string): ElementCounts`
- `computeMolarMass(counts: ElementCounts, weights?: Record<string, number>): number`
- `molarMass(formula: string, weights?: Record<string, number>): { counts, molarMass }`
- `ATOMIC_WEIGHTS` – default weights map, override if you prefer specific standards.

## CLI

```bash
npx chem-formula H_2O
# H_2O → 18.0153 g/mol
# Counts: { H: 2, O: 1 }

npx chem-formula "Fe_2(SO_4)_3" --json
# { "formula": "Fe_2(SO_4)_3", "counts": { ... }, "molarMass": 399.877 }
```

## Dev

```bash
pnpm i
pnpm build
pnpm test
```

## Notes

- Supports underscores for numeric subscripts: `H_2`, `(SO_4)\_3`.
- Also accepts bare digits after elements/groups for convenience: `H2O`.
- Handles nested (), [], {} and hydrate dots `·` or `.` `(e.g., CuSO_4·5H_2O)`.
- For stricter underscore-only syntax, remove the bare-digit branch in `lexer.ts`.
