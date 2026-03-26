# MOLGENIS Documentation Site (GCC)

This is the MOLGENIS documentation site, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build). It is deployed to GitHub Pages at `https://molgenis.github.io/GCC/`.

## Project structure

```
GCC/
├── src/content/docs/     # Documentation pages (Markdown/MDX)
├── src/assets/           # Images, logos
├── src/styles/           # Custom CSS
├── astro.config.mjs      # Site config + sidebar navigation
├── sources/              # Background material (git submodules, read-only)
│   ├── molgenis-emx2/    # MOLGENIS EMX2 platform source code + docs
│   └── molgenis.org/     # MOLGENIS.org website content
└── .claude/commands/     # Slash commands for doc generation
```

## Background sources

The `sources/` directory contains git submodules with reference material that Claude should use when generating documentation:

- **`sources/molgenis-emx2/`** — The main MOLGENIS EMX2 platform repository. Key areas:
  - `docs/` — Existing Docsify documentation (usage, development, operations)
  - `backend/` — Java backend source code
  - `apps/` — Frontend applications (Vue.js, Svelte)
  - `README.md`, `ROADMAP.md`, `CONTRIBUTING.md`
- **`sources/molgenis.org/`** — The molgenis.org website (Jekyll). Contains:
  - Product descriptions, community info, partner info, news/blog posts
  - General context about the MOLGENIS ecosystem

To update submodules to latest master: `git submodule update --remote`

## Documentation standards

### Audience
MOLGENIS documentation serves multiple audiences: researchers setting up data catalogues/registries, system administrators installing and maintaining the platform, and developers extending it.

### Doc types
We use the [Diataxis framework](https://diataxis.fr/) with four doc types:
- **Getting Started** — Guided first steps for new users
- **How-To Guides** — Task-oriented recipes for specific goals
- **Scenarios** — Real-world user scenarios showing how features solve problems
- **Reference** — Technical details (APIs, configuration, data models)

### Writing style
- Write for clarity. Use short sentences and active voice.
- Use second person ("you") when addressing the reader.
- Include practical examples wherever possible.
- Link to related pages within the docs.

### Starlight conventions
- Pages go in `src/content/docs/` as `.md` or `.mdx` files.
- Each page needs YAML frontmatter with at least `title:`.
- New pages must be added to the `sidebar` in `astro.config.mjs`.
- Images go in `src/assets/` and are referenced with relative paths.

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start local dev server at localhost:4321
- `npm run build` — Build production site to `./dist/`

## When generating docs

1. Always read relevant source material from `sources/` first.
2. Cross-reference existing docs in `src/content/docs/` to avoid duplication.
3. Follow the doc type structure (getting-started, howto, scenarios, reference).
4. After creating a new page, update `astro.config.mjs` sidebar config.
