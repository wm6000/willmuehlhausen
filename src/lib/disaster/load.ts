/**
 * Fetches the exported model and assembles it into the shape predict() wants.
 *
 * The four files total roughly 210KB gzipped, which is far too much to put in the
 * bundle for the sake of one section of one post. So they are static assets under
 * public/, fetched on demand and memoised: a visitor who never opens the demo never
 * pays for them, and one who opens it twice pays once.
 */

import type { Booster, DisasterModel, Provenance } from "@/lib/disaster/predict";

const BASE = "/models/disaster-response";

export type ModelFile = {
  provenance: Provenance;
  categories: string[];
  nEstimators: number;
  vocabSize: number;
  boosters: (Booster | null)[];
};

export type VocabFile = {
  /** Newline-joined, in column order — about half the bytes of a JSON array. */
  terms: string;
  idf: number[];
  stopwords: string[];
};

export type Sample = {
  text: string;
  predicted: string[];
  actual: string[];
};

export type CategoryMetric = {
  precision: number;
  recall: number;
  f1: number;
  support: number;
};

export type MetricsFile = {
  categories: {
    category: string;
    positives: number;
    adaboost: CategoryMetric;
    llm: CategoryMetric;
  }[];
  averages: {
    adaboost: Record<string, CategoryMetric>;
    llm: Record<string, CategoryMetric>;
  };
  /** False here is the whole reason the page has to caveat the comparison. */
  comparable: boolean;
  note: string;
  provenance: Provenance;
};

async function getJson<T>(name: string): Promise<T> {
  const response = await fetch(`${BASE}/${name}`);
  if (!response.ok) {
    throw new Error(`Could not load ${name} (${response.status})`);
  }
  return (await response.json()) as T;
}

/**
 * Assemble the three files into the runtime model. Separated from the fetching so the
 * parity check in scripts/parity.mjs can exercise this exact code against the recorded
 * scikit-learn output, rather than a second copy of it that could drift.
 */
export function assembleModel(
  model: ModelFile,
  vocab: VocabFile,
  lemmas: Record<string, string>
): DisasterModel {
  const vocabulary = new Map<string, number>();
  const terms = vocab.terms.split("\n");
  for (let i = 0; i < terms.length; i += 1) {
    const term = terms[i];
    if (term !== undefined) vocabulary.set(term, i);
  }

  return {
    categories: model.categories,
    boosters: model.boosters,
    vocabSize: model.vocabSize,
    provenance: model.provenance,
    vocabulary,
    idf: vocab.idf,
    lexicon: { lemmas, stopwords: new Set(vocab.stopwords) },
  };
}

let modelPromise: Promise<DisasterModel> | null = null;
let samplesPromise: Promise<Sample[]> | null = null;
let metricsPromise: Promise<MetricsFile> | null = null;

export function loadModel(): Promise<DisasterModel> {
  // Memoised on the promise, not the result, so two components mounting in the same
  // tick share one request instead of racing.
  modelPromise ??= (async () => {
    const [model, vocab, lemmas] = await Promise.all([
      getJson<ModelFile>("model.json"),
      getJson<VocabFile>("vocab.json"),
      getJson<Record<string, string>>("lemmas.json"),
    ]);
    return assembleModel(model, vocab, lemmas);
  })();
  return modelPromise;
}

export function loadSamples(): Promise<Sample[]> {
  samplesPromise ??= getJson<{ samples: Sample[] }>("samples.json").then((file) => file.samples);
  return samplesPromise;
}

export function loadMetrics(): Promise<MetricsFile> {
  metricsPromise ??= getJson<MetricsFile>("metrics.json");
  return metricsPromise;
}
