#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .scriptName("apg")
  .command("plan validate <file>", "Validate ops.plan.json against schema", (y)=>
    y.positional("file", { type: "string", demandOption: true })
     .option("schema", { type: "string", describe: "Schema path or URL", default: "packages/spec/schemas/ops.plan.schema.json" })
  , async (args) => {
    const file = path.resolve(String(args.file));
    if (!fs.existsSync(file)) { console.error(`Missing file: ${file}`); process.exit(1); }
    console.log(`[stub] would validate ${file} against ${args.schema}`);
    process.exit(0);
  })
  .command("policy check", "Check repo policy budgets/allowlist against a diff", (y)=>
    y.option("policy", { type: "string", default: "policy.yaml" })
     .option("diff-from", { type: "string", default: "origin/main" })
  , async (args) => {
    console.log(`[stub] would check ${args.policy} vs diff from ${args["diff-from"]}`);
    process.exit(0);
  })
  .command("prompt-hash <file>", "Output SHA-256 hash of a prompt file", (y)=>
    y.positional("file", { type: "string", demandOption: true })
  , async (args) => {
    const f = path.resolve(String(args.file));
    if (!fs.existsSync(f)) { console.error(`Missing file: ${f}`); process.exit(1); }
    const data = fs.readFileSync(f);
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    console.log(`sha256:${hash}`);
  })
  .demandCommand(1)
  .help()
  .parse();
