---
title: Data Catalogue
description: Create FAIR data catalogues for cohorts, biobanks, and research networks using MOLGENIS.
---

The MOLGENIS Data Catalogue is a specialised application for metadata management and data discovery. It helps research consortia make their data and samples **findable, accessible, interoperable, and reusable (FAIR)** — with built-in support for DCAT-AP, FAIR Data Points, and federated analysis via Armadillo/DataSHIELD.

## Who uses it?

| Role | What you do |
|------|-------------|
| **Researcher** | Search cohorts, filter variables, view harmonisation status, request data access |
| **Resource data manager** | Enter metadata for your cohort/biobank, define data dictionaries, manage harmonisation mappings |
| **Network data manager** | Define the common data model, configure network-wide settings, manage the catalogue schema |
| **System administrator** | Deploy the platform, configure theming, set up analytics and OIDC |

## Live instances

The catalogue powers production systems across Europe:

- **[BBMRI-ERIC Directory](https://directory.bbmri-eric.eu)** — 515+ biobanks, 60M+ samples across 30 countries
- **[European Health Data & Sample Catalogue](https://molgeniscatalogue.org)** — multi-network discovery portal
- **[LifeLines Data Catalogue](https://data-catalogue.lifelines.nl)** — 167,000-participant cohort from the Northern Netherlands
- **[BBMRI-NL Catalogue](https://catalogue.bbmri.nl)** — Dutch national biobank catalogue
- **[RD-Connect Sample Catalogue](https://samples.rd-connect.eu)** — rare-disease biobank samples
- **[PALGA Open Data Bank](https://www.palgaopenbaredatabank.nl)** — Dutch national pathology archive

## Key features

- **Multi-cohort metadata management** — model resources, subcohorts, collection events, and sample collections in a standardised schema (current version: 7.x)
- **Variable harmonisation** — map cohort-specific variables to a common data model; track harmonisation status per variable per cohort
- **Faceted search** — researchers filter by disease area, population, design, age range, data type, and more
- **Access request workflow** — catalogue-integrated request flow with configurable approval chains
- **FAIR Data Point** — automatic FDP/DCAT-AP metadata exposure for machine-readable discovery
- **Theming and branding** — per-network logos, colours, landing page copy, and custom HTML banners
- **Analytics integration** — Google Analytics or SiteImprove, configurable per instance

## Data model

The catalogue uses the **Data Catalogue** schema template built on EMX2. Core entities include:

- **Resources** (cohorts, biobanks, data sources) — with descriptions, design, population details, funding
- **Subcohorts** — subgroups within a resource (e.g. age bands, disease subtypes)
- **Collection events** — longitudinal time points at which data/samples were collected
- **Variables** — individual data points with labels, units, value sets, and harmonisation mappings
- **Networks** — consortia or collaborations that group multiple resources
- **Organisations** and **Contacts** — institutional metadata

See [The EMX2 Data Model](/docs/concepts/emx2/) for the underlying schema mechanics.

## Architecture

```
┌──────────────────────────────────┐
│         Catalogue UI (Vue.js)    │  ← Nuxt-based frontend
├──────────────────────────────────┤
│    MOLGENIS EMX2 Backend (Java)  │  ← GraphQL + REST APIs
├──────────────────────────────────┤
│         PostgreSQL 15+           │  ← data, files, search
└──────────────────────────────────┘
```

The catalogue is a Vue.js/Nuxt application that runs on top of the MOLGENIS EMX2 platform. It communicates with the backend exclusively via GraphQL. PostgreSQL handles storage, full-text search, permissions, and file management.

## Next steps

- [Getting Started](/docs/catalogue/getting-started/) — set up your first catalogue instance
- [Scenarios](/docs/catalogue/scenarios/) — end-to-end walkthrough: catalogue for a five-cohort consortium
- [Configuring Your Catalogue](/docs/catalogue/howto-configure/) — theming, landing page, analytics
