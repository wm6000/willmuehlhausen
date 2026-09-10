/**
 * The trained classifier, running in the browser.
 *
 * Not a stand-in and not a re-implementation of the idea — the same 1,800 decision
 * stumps the scikit-learn pipeline fitted, evaluated with the same arithmetic. The
 * exporter (models/export_web.py in the pipeline repo) refuses to write its JSON unless
 * this representation reproduces `pipeline.predict()` exactly, and scripts/parity.mjs
 * re-checks that against 200 recorded cases on every run of `npm run lint`.
 *
 * Why it fits in a browser at all: AdaBoostClassifier's default base estimator is a
 * depth-1 tree, so each of the 36 categories is 50 stumps, and each stump is one
 * feature index, one threshold and two numbers. The whole model is a table.
 */

import { tokenize, type Lexicon } from "@/lib/disaster/tokenize";

/** One category's 50 stumps, as parallel arrays — smaller over the wire than objects. */
export type Booster = {
  feature: number[];
  threshold: number[];
  left: number[];
  right: number[];
};

export type Provenance = {
  repo: string;
  commit: string;
  sklearn: string;
  exportedAt: string;
  rows: number;
};

export type DisasterModel = {
  categories: string[];
  /** null where the category had a single class in training and can never fire. */
  boosters: (Booster | null)[];
  vocabSize: number;
  provenance: Provenance;
  /** term -> column index in the TF-IDF matrix. */
  vocabulary: Map<string, number>;
  idf: number[];
  lexicon: Lexicon;
};

export type Prediction = {
  category: string;
  hit: boolean;
  /** AdaBoost's decision function: positive routes, and the magnitude is the margin. */
  score: number;
  /**
   * False when the category had no positive examples to learn from, so a negative is
   * not evidence of anything. Exactly one category — child_alone — is in this state.
   */
  trainable: boolean;
};

/**
 * TF-IDF for one message, as a sparse map of column -> weight.
 *
 * Only terms present in the message can be non-zero, so the L2 norm over the full
 * 25,506-wide row is exactly the norm over these few entries. That is what keeps this
 * honest without materialising a vector the width of the vocabulary.
 */
function vectorize(tokens: string[], model: DisasterModel): Map<number, number> {
  const counts = new Map<number, number>();
  for (const token of tokens) {
    const column = model.vocabulary.get(token);
    if (column === undefined) continue; // out of vocabulary: dropped, as in sklearn
    counts.set(column, (counts.get(column) ?? 0) + 1);
  }

  const weights = new Map<number, number>();
  let sumOfSquares = 0;
  for (const [column, count] of counts) {
    const weight = count * (model.idf[column] ?? 0);
    weights.set(column, weight);
    sumOfSquares += weight * weight;
  }

  const norm = Math.sqrt(sumOfSquares);
  if (norm === 0) return weights;
  for (const [column, weight] of weights) weights.set(column, weight / norm);
  return weights;
}

/**
 * One category's AdaBoost decision function.
 *
 * Under SAMME.R each stump contributes log(p1) - log(p0) at the leaf the sample lands
 * in, and the ensemble averages those. The exporter collapsed each leaf to that single
 * number, so there is no probability arithmetic left to do here.
 */
function scoreBooster(booster: Booster, weights: Map<number, number>): number {
  let total = 0;
  for (let i = 0; i < booster.feature.length; i += 1) {
    const feature = booster.feature[i] ?? -1;
    // A stump that never split contributes the same either way; absent terms are 0,
    // which is the left branch for every threshold the model learned.
    const value = feature < 0 ? 0 : weights.get(feature) ?? 0;
    const goesLeft = feature < 0 || value <= (booster.threshold[i] ?? 0);
    total += (goesLeft ? booster.left[i] : booster.right[i]) ?? 0;
  }
  return total / booster.feature.length;
}

export type PredictionResult = {
  predictions: Prediction[];
  /** The in-vocabulary terms that survived tokenization — what the model actually saw. */
  terms: string[];
  /** Tokens the model has no column for, so they could not affect the result. */
  unknown: string[];
};

export function predict(text: string, model: DisasterModel): PredictionResult {
  const tokens = tokenize(text, model.lexicon);
  const weights = vectorize(tokens, model);

  const terms: string[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();
  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    (model.vocabulary.has(token) ? terms : unknown).push(token);
  }

  const predictions = model.categories.map((category, index) => {
    const booster = model.boosters[index] ?? null;
    if (booster === null) {
      return { category, hit: false, score: 0, trainable: false };
    }
    const score = scoreBooster(booster, weights);
    return { category, hit: score > 0, score, trainable: true };
  });

  return { predictions, terms, unknown };
}

/** Human-readable form of the underscored category names the dataset ships. */
export function categoryLabel(category: string): string {
  const words = category.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
