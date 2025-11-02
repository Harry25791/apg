import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);     // <- use this folder as the spec root

const schemaPath = path.join(__dirname, 'schemas/ops.plan.schema.json');
const examplesDir = path.join(__dirname, 'examples');

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

let ok = true;
for (const f of readdirSync(examplesDir)) {
  if (!f.endsWith('.json')) continue;
  const data = JSON.parse(readFileSync(path.join(examplesDir, f), 'utf8'));
  const valid = validate(data);
  const shouldPass = f.includes('.pass.');
  if (shouldPass && !valid) {
    ok = false;
    console.error(`❌ Expected PASS, got FAIL: ${f}\n${ajv.errorsText(validate.errors, { separator: '\n' })}\n`);
  } else if (!shouldPass && valid) {
    ok = false;
    console.error(`❌ Expected FAIL, got PASS: ${f}\n`);
  } else {
    console.log(`✅ ${shouldPass ? 'PASS' : 'FAIL'} as expected: ${f}`);
  }
  validate.errors = null;
}
if (!ok) process.exit(1);
console.log('All conformance examples behaved as expected.');
