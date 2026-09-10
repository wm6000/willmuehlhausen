import { Link, Stack, Text } from "@/ui";
import { EXTERNAL } from "@/data/site";
import { Classifier } from "@/components/projects/disaster-response-pipeline/Classifier";
import { Metrics } from "@/components/projects/disaster-response-pipeline/Metrics";
import { Pipeline } from "@/components/projects/disaster-response-pipeline/Pipeline";
import { Samples } from "@/components/projects/disaster-response-pipeline/Samples";
import { PostNotes } from "@/components/projects/PostNotes";
import { PostSection } from "@/components/projects/PostSection";

const NOTES = [
  { label: "Task", value: "Multi-label text classification, 36 categories" },
  { label: "Data", value: "26,215 labelled disaster messages" },
  { label: "Stack", value: "Python, scikit-learn, NLTK, SQLAlchemy, Flask" },
  { label: "In the browser", value: "1,800 decision stumps as 210KB of JSON" },
];

export function Post() {
  return (
    <Stack gap={7}>
      <PostSection id="problem" title="The problem">
        <Text prose>
          In the first days after a disaster, messages arrive faster than any team can read
          them — social posts, texts, radio transcripts. People are asking for water, for
          shelter, for medical help, or for someone they can&rsquo;t find. Each request needs to
          reach the team equipped to answer it: the people coordinating water supply can&rsquo;t
          act on a report of a damaged bridge, and the people clearing roads can&rsquo;t act on a
          request for clean water.
        </Text>
        <Text prose>
          Sorting them is the whole job, and it&rsquo;s worth being careful about how
          &ldquo;working&rdquo; gets measured. A model with a good average score can still be
          weak on the categories where help is most urgent, and the average on its own
          won&rsquo;t show that. That is what happens here, which is why this page reports
          per-category numbers rather than a single headline figure.
        </Text>
      </PostSection>

      <PostSection id="pipeline" title="The pipeline">
        <Text prose>
          Two CSVs of real messages — from the 2010 Haiti and Chile earthquakes, the 2010
          Pakistan floods, Hurricane Sandy, and news coverage of hundreds of other events — merge
          into a table of 26,215 rows, each hand-labelled against 36 categories. A message can
          carry any number of them, so this is 36 independent yes/no questions rather than one
          choice between 36 options.
        </Text>
        <Pipeline />
        <Text prose>
          The features are ordinary: lemmatized unigrams, TF-IDF weighted over a 25,506-word
          vocabulary, with 36 small classifiers on top — one per category, each deciding its
          own yes or no.
        </Text>
      </PostSection>

      <PostSection id="demo" title="Try it">
        <Text prose>
          This is the trained model, not a keyword stand-in. AdaBoost&rsquo;s base estimator is a
          depth-1 decision tree, so the classifier is 36 &times; 50 stumps — each one a feature
          index, a threshold and two numbers. That is a table, not a library, and a table fits
          in a browser tab. The tokenizer ports exactly too, for a reason that is closer to luck
          than design: it strips punctuation{" "}
          <Text inline weight="semibold">
            before
          </Text>{" "}
          handing the text to NLTK, so the tokenizer collapses to a whitespace split.
        </Text>
        <Text prose>
          A build step replays 200 messages through the TypeScript and fails if a single one of
          the 7,200 predictions disagrees with what scikit-learn produced. Nothing is sent
          anywhere; the model runs on your machine.
        </Text>
        <Classifier />
      </PostSection>

      <PostSection id="labels" title="Checked against human labels">
        <Text prose>
          The demo above can only show what the model says, not whether it was right. These are
          real messages from the corpus shown alongside the labels a person assigned, so you can
          compare the two directly — which for this model mostly means seeing what it
          didn&rsquo;t pick up.
        </Text>
        <Samples />
      </PostSection>

      <PostSection id="results" title="What it catches, and what it misses">
        <Text prose>
          In aggregate the model is precise but cautious: 0.78 precision against 0.59 recall,
          micro-averaged. When it does route a message it&rsquo;s usually right; the gap is that
          it stays quiet more often than you&rsquo;d want. Recall is the number that matters most
          here, because a message that never gets routed is one nobody is prompted to read.
        </Text>
        <Text prose>
          <Text inline weight="semibold">
            Search and rescue
          </Text>{" "}
          is the clearest example: precision 0.54, recall 0.17. It surfaces roughly one message
          in six, which is why a tool like this belongs alongside someone reading the queue
          rather than in place of one. The categories it handles well — earthquake, water, food
          — are the common ones, and the categories where a miss matters most tend to be the
          rare ones. Rarity is what this model finds hardest.
        </Text>
        <Text prose>
          Handing the same task to an LLM moves the trade-off rather than removing it: recall
          rises to 0.71 while precision falls to 0.59, and search-and-rescue recall roughly
          doubles, to 0.35. Which you&rsquo;d prefer isn&rsquo;t really a modelling question. It
          depends on what&rsquo;s scarcest on the day — responder capacity, or the attention of
          the person working through the queue.
        </Text>
        <Metrics />
        <Text prose>
          One category is worth flagging, because it shows how a metric can mislead.{" "}
          <Text inline weight="semibold">
            Child alone
          </Text>{" "}
          reports precision 1.00, recall 1.00 and F1 1.00 — a perfect score. It also has zero
          positive examples across all 26,215 rows. The classifier for it never fitted a real
          split and can only ever answer &ldquo;no&rdquo;; scikit-learn&rsquo;s{" "}
          <Text inline mono size="sm">
            zero_division=1.0
          </Text>{" "}
          then renders that as a perfect row. It&rsquo;s left out of the chart above for that
          reason, and it&rsquo;s a good argument for reading support counts next to scores.
        </Text>
      </PostSection>

      <PostSection id="notes" title="Notes">
        <PostNotes notes={NOTES} />
        <Text prose>
          One thing exporting the model turned up: the pipeline carries a custom feature that
          checks whether a sentence starts with a verb, on the theory that imperatives signal
          requests. None of the 1,800 fitted stumps splits on it, so it changes no prediction.
          The browser version leaves it out.
        </Text>
        <Text prose>
          The training code, the exporter that turns the fitted pipeline into JSON, and the two
          evaluation reports are in{" "}
          <Link to={EXTERNAL.githubDisasterResponse} external>
            the project repo
          </Link>
          .
        </Text>
      </PostSection>
    </Stack>
  );
}
