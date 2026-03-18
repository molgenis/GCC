# Contributing to MOLGENIS Docs

This documentation site unifies content from across the MOLGENIS ecosystem. Different teams own different sections.

## Who writes what

| Section | Owner | Source of truth |
|---------|-------|----------------|
| **Data Catalogue** (`/catalogue/`) | Catalogue team | This repo + molgenis-emx2 catalogue app |
| **Patient Registry** (`/registry/`) | Registry team | This repo |
| **Armadillo** (`/armadillo/`) | Armadillo team | molgenis-service-armadillo repo + this repo |
| **Concepts** (`/concepts/`) | Platform team | This repo |
| **Platform** (`/platform/`) | Platform team | molgenis-emx2 repo + this repo |
| **Landing page** (`index.mdx`) | Documentation lead | This repo |

## Content model

The documentation follows a four-layer structure inspired by [Diátaxis](https://diataxis.fr/):

1. **Overview** (`index.md`) — what is this solution, who is it for, key features
2. **Getting Started** (`getting-started.md`) — minimal steps to a working setup
3. **Scenarios** (`scenarios.md`) — end-to-end narrative walkthroughs of the canonical use case, with real commands and config. Scenarios branch into how-to guides for variations.
4. **How-To Guides** (`howto-*.md`) — task-oriented recipes for specific operations

## Writing guidelines

- **Lead with the user's goal**, not the technology
- **Use real examples** — commands, config snippets, and GraphQL queries that actually work
- **Specify versions** — when behaviour depends on a version, say which version
- **Avoid placeholder text** — every page should contain real, accurate content
- **Keep pages focused** — one topic per page, link to related pages

## Local development

```bash
npm install
npm run dev
# Open http://localhost:4321/docs/
```

## File structure

```
src/content/docs/
├── index.mdx                    # Landing page with goal navigator
├── catalogue/
│   ├── index.md                 # Overview
│   ├── getting-started.md       # Setup guide
│   ├── scenarios.md             # End-to-end walkthrough
│   └── howto-configure.md       # Settings reference
├── registry/
│   ├── index.md                 # Overview
│   └── scenarios.md             # End-to-end walkthrough
├── armadillo/
│   ├── index.md                 # Overview
│   ├── getting-started.md       # Setup guide
│   └── scenarios.md             # End-to-end walkthrough
├── concepts/
│   ├── emx2.md                  # EMX2 data model
│   └── choosing.md              # Solution selection guide
└── platform/
    ├── installation.md          # Deployment guide
    ├── apis.md                  # API reference
    └── permissions.md           # Security and OIDC
```

## Multi-repo assembly

The GitHub Actions workflow (`.github/workflows/assemble-and-deploy.yml`) checks out content from multiple MOLGENIS repos at build time. Currently, all content is maintained directly in this repo. In the future, an assembly script will sync selected content from source repos.

To trigger a rebuild when a source repo updates, add a `repository_dispatch` event from that repo's CI:

```yaml
# In molgenis-emx2/.github/workflows/docs-notify.yml
- name: Notify docs repo
  uses: peter-evans/repository-dispatch@v3
  with:
    token: ${{ secrets.DOCS_REPO_TOKEN }}
    repository: molgenis/molgenis-docs
    event-type: docs-update
```

## Deployment

The site deploys to GitHub Pages at `molgenis.org/docs` via the `assemble-and-deploy` workflow. Every push to `main` triggers a build and deploy.

Build output goes to `/docs/` (configured via `base: '/docs'` in `astro.config.mjs`).
