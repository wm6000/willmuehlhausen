/**
 * Parity check: does the TypeScript classifier agree with scikit-learn?
 *
 * The demo on /projects/disaster-response-pipeline claims to run the trained model
 * rather than an impression of it. This is the check that keeps that claim true. It
 * replays 200 messages recorded straight out of the Python pipeline — the labels and
 * the decision-function scores it produced — and fails if a single one of the 7,200
 * bits disagrees.
 *
 * The threshold is zero. A classifier that is nearly right is a classifier making up
 * numbers, and it would be making them up on a page that says it isn't.
 *
 * Regenerate the fixture with `python models/export_web.py` in wm6000/disaster-response-pipeline.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MODELS = join(ROOT, "public", "models", "disaster-response");

// Scores are compared with a tolerance because the two runtimes sum 50 floats in the
// same order but not necessarily with the same intermediate rounding. Labels are
// compared exactly, which is what actually decides what a visitor sees.
const SCORE_TOLERANCE = 1e-9;

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

async function loadEngine() {
  // The app's imports are alias-based, which node can't resolve on its own, so bundle
  // the two modules under test and import the result.
  const result = await build({
    stdin: {
      contents: `export { predict } from "@/lib/disaster/predict";
                 export { assembleModel } from "@/lib/disaster/load";`,
      resolveDir: ROOT,
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    alias: { "@": join(ROOT, "src") },
  });

  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const { predict, assembleModel } = await loadEngine();

const model = assembleModel(
  readJson(join(MODELS, "model.json")),
  readJson(join(MODELS, "vocab.json")),
  readJson(join(MODELS, "lemmas.json"))
);

const fixture = readJson(join(ROOT, "scripts", "fixtures", "parity.json"));

let labelMismatches = 0;
let worstScoreError = 0;
let worstCase = null;
let bitsChecked = 0;

for (const testCase of fixture.cases) {
  const { predictions } = predict(testCase.text, model);

  for (let i = 0; i < fixture.categories.length; i += 1) {
    const expectedLabel = testCase.labels[i];
    const actualLabel = predictions[i].hit ? 1 : 0;
    bitsChecked += 1;

    if (expectedLabel !== actualLabel) {
      labelMismatches += 1;
      if (labelMismatches <= 5) {
        console.error(
          `  ✗ ${fixture.categories[i]}: expected ${expectedLabel}, got ${actualLabel}\n` +
            `    "${testCase.text.slice(0, 90)}"`
        );
      }
    }

    const error = Math.abs(testCase.scores[i] - predictions[i].score);
    if (error > worstScoreError) {
      worstScoreError = error;
      worstCase = fixture.categories[i];
    }
  }
}

const cases = fixture.cases.length;
console.log(
  `Parity: ${cases} messages x ${fixture.categories.length} categories = ${bitsChecked} bits`
);
console.log(`  label mismatches:  ${labelMismatches}`);
console.log(`  worst score error: ${worstScoreError.toExponential(3)} (${worstCase})`);
console.log(`  model exported:    ${model.provenance.exportedAt} from sklearn ${model.provenance.sklearn}`);

if (labelMismatches > 0) {
  console.error(`\nParity check failed: ${labelMismatches} of ${bitsChecked} bits disagree with scikit-learn.`);
  process.exit(1);
}

// The fixture rounds scores to 6dp, so this catches a real divergence in the maths
// without tripping on the recorded precision.
if (worstScoreError > Math.max(SCORE_TOLERANCE, 5e-7)) {
  console.error(`\nParity check failed: scores drifted by ${worstScoreError.toExponential(3)}.`);
  process.exit(1);
}

console.log("\nParity check passed — the browser and scikit-learn agree on every bit.");
