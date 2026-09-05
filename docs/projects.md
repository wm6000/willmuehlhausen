# Projects, as a blog

The projects section is written like a blog rather than listed like a CV. Each project
is a post, and **each post is free to be its own thing** — a live demo, a set of stats,
a gallery, or plain prose. That freedom is the design; the machinery below exists to
protect it.

## The two halves

```
src/data/projects.ts                  the INDEX — uniform, so the listing
                                      can sort, filter and summarise it
    slug, title, date, updated,
    blurb, tags, kind

src/components/projects/
    registry.ts                       slug -> post component
    PostCard, PostHeader,             shared furniture, so only the body
    PostSection, PostNotes,           has to be bespoke
    DraftNotice
    disaster-response-pipeline/
        Post.tsx                      this project's body
        Classifier.tsx                this project's custom feature
    whale-blog/
        Post.tsx
        Topics.tsx                    a completely different feature
```

The index is uniform because the listing needs to reason about every project at once.
The body is bespoke because no two projects explain themselves the same way. Keeping
those apart is what lets both stay simple.

## Adding a project

Two edits:

1. An entry in `PROJECTS` in [src/data/projects.ts](../src/data/projects.ts).
2. A line in `POSTS` in [src/components/projects/registry.ts](../src/components/projects/registry.ts),
   pointing at a `Post` component in `src/components/projects/<slug>/`.

An index entry with no registered post renders as a 404 rather than an empty page — a
half-added project should read as missing, not as broken.

## Writing the custom feature

The feature is an ordinary component in the project's own folder. Two constraints:

- **It composes from `@/ui`.** Rule 3 allows raw DOM tags only inside `src/ui/`, and
  that includes `<svg>`. A post that wants a bespoke diagram needs a primitive, or an
  escape in `src/ui/escapes/` — it can't inline the markup in its own folder. This is a
  real limit on "custom", and worth knowing before designing a feature around it.
- **It's honest about what it is.** `Classifier` is a keyword stand-in for a trained
  model and says so on the page. A demo that quietly implies a model is running is the
  same failure as a page claiming live conditions on mock data.

Sharing is opt-in, not imposed. `PostNotes` exists because a facts block turned out to be
wanted twice; the whale-blog post doesn't use it, and shouldn't have to.

## Why not MDX

MDX would be nicer for long prose, and it was the alternative considered. It costs a
build plugin, and markdown emits raw DOM tags, so rule 3 would need a carve-out for the
whole content pipeline. A component per post keeps the dependency count and the rules
intact, at the price of prose being JSX. Revisit if the writing gets long enough that
JSX prose becomes the bottleneck.

## Status

Both posts are **drafts**: the structure and the interactive pieces are real, the prose
is placeholder, and `PostNotes` values that state facts about the work say "To fill in".
Each renders a `DraftNotice` saying so. Replace the prose before launch.
