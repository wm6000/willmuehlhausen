/**
 * The disaster-response tokenizer, ported exactly from the Python it has to agree with:
 * models/tokenizer.py in wm6000/disaster-response-pipeline.
 *
 * Porting NLTK is normally a bad idea. It works here because of two accidents of how
 * that function was written, and both are worth knowing before anyone "tidies" this:
 *
 *  - It runs `re.sub(r"[^a-zA-Z0-9]", " ", text.lower())` *before* `word_tokenize`, so
 *    the Treebank tokenizer is handed a string with no punctuation left to reason about
 *    and degenerates to a whitespace split. That is the only reason this is four lines.
 *  - It lemmatizes with `get_wordnet_pos(word)`, which tags each word *in isolation*.
 *    Lemmatization therefore has no context dependence, so a surface -> lemma table
 *    built from the training corpus reproduces it exactly rather than approximately.
 *
 * The table only covers words the corpus contained. An unseen inflection falls back to
 * itself, which then misses the vocabulary and drops out — the same outcome as an
 * genuinely unknown word, so it degrades quietly rather than wrongly.
 */

// The Python's URL regex, transliterated. Two things about it are deliberate and will
// look like bugs: `[$-_@.&+]` is a *range* from "$" to "_" rather than a set of four
// characters — it means the same thing in both languages, so it is left as-is — and the
// parentheses in `[!*(),]` are unescaped here only because a character class needs no
// escape in JavaScript. The matched set is identical.
const URL_PATTERN =
  /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*(),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;

export type Lexicon = {
  /** surface -> lemma, for the ~6.9k corpus words where the two differ. */
  lemmas: Record<string, string>;
  /** NLTK's English stopword list, exported rather than retyped. */
  stopwords: ReadonlySet<string>;
};

/**
 * Split, strip and lemmatize a message into the terms the vectorizer indexes.
 *
 * Stopwords are removed *before* lemmatization, matching the Python; swapping the two
 * changes which words survive, so the order is load-bearing.
 */
export function tokenize(text: string, lexicon: Lexicon): string[] {
  // URLs are collapsed while the text is still in its original case, because that is
  // when the Python does it.
  const withoutUrls = text.replace(URL_PATTERN, "urlplaceholder");
  const flattened = withoutUrls.toLowerCase().replace(NON_ALPHANUMERIC, " ");

  const tokens: string[] = [];
  for (const word of flattened.split(/\s+/)) {
    if (word === "" || lexicon.stopwords.has(word)) continue;
    tokens.push(lexicon.lemmas[word] ?? word);
  }
  return tokens;
}
