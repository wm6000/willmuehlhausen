import { Diagram, type DiagramEdge, type DiagramNode } from "@/ui";

/**
 * The shape of the pipeline, from two CSVs to 36 independent yes/no decisions.
 *
 * Data only — the drawing lives in the Diagram escape, because rule 3 keeps raw SVG
 * markup inside src/ui/. The split is worth the indirection here: what this post knows
 * is the *shape* of its pipeline, not how to lay out a box.
 */

const NODES: readonly DiagramNode[] = [
  { id: "csv", x: 8, y: 60, width: 96, height: 46, label: "2 CSVs", detail: "messages + labels" },
  { id: "etl", x: 132, y: 60, width: 96, height: 46, label: "process_data", detail: "merge, dedupe" },
  { id: "db", x: 256, y: 60, width: 96, height: 46, label: "SQLite", detail: "26,215 rows" },
  {
    id: "tokens",
    x: 380,
    y: 14,
    width: 116,
    height: 46,
    label: "Tokenize",
    detail: "lemmatize, stop",
  },
  {
    id: "tfidf",
    x: 380,
    y: 74,
    width: 116,
    height: 46,
    label: "TF-IDF",
    detail: "25,506 terms",
  },
  {
    id: "verb",
    x: 380,
    y: 134,
    width: 116,
    height: 46,
    label: "Starting verb",
    detail: "1 feature",
  },
  {
    id: "clf",
    x: 528,
    y: 60,
    width: 116,
    height: 46,
    label: "36 x AdaBoost",
    detail: "50 stumps each",
    emphasis: true,
  },
  { id: "out", x: 672, y: 60, width: 104, height: 46, label: "36 labels", detail: "multi-label" },
];

const EDGES: readonly DiagramEdge[] = [
  { from: "csv", to: "etl" },
  { from: "etl", to: "db" },
  { from: "db", to: "tokens" },
  { from: "db", to: "tfidf" },
  { from: "db", to: "verb" },
  { from: "tokens", to: "clf" },
  { from: "tfidf", to: "clf" },
  { from: "verb", to: "clf" },
  { from: "clf", to: "out" },
];

export function Pipeline() {
  return (
    <Diagram
      nodes={NODES}
      edges={EDGES}
      width={790}
      height={196}
      title="The disaster response pipeline"
      description={
        "Two CSVs are merged and deduplicated into a SQLite table of 26,215 messages. " +
        "Each message is tokenized and lemmatized into a 25,506-term TF-IDF vector, " +
        "alongside a feature marking whether the sentence starts with a verb. " +
        "Thirty-six independent AdaBoost classifiers, fifty decision stumps each, then " +
        "produce thirty-six independent yes/no labels."
      }
    />
  );
}
