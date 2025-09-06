#!/usr/bin/env node
import { Command } from "commander";
import { molarMass } from "./index";

const program = new Command();

program
  .name("gmol")
  .description(
    "Compute molar mass from empirical formulas (H_2O, Fe_2(SO_4)_3, CuSO_4·5H_2O)."
  )
  .argument("<formula>", "chemical formula with underscores for subscripts")
  .option("-j, --json", "output JSON with counts and mass")
  .action((formula: string, opts: { json?: boolean }) => {
    try {
      const { counts, molarMass: mw } = molarMass(formula);
      if (opts.json) {
        console.log(
          JSON.stringify({ formula, counts, molarMass: mw }, null, 2)
        );
      } else {
        console.log(`${formula} → ${mw.toFixed(4)} g/mol`);
        console.log("Counts:", counts);
      }
    } catch (e) {
      console.error((e as Error).message);
      process.exitCode = 1;
    }
  });

program.parseAsync();
