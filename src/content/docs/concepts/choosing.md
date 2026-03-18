---
title: Choosing a Solution
description: Catalogue, registry, Armadillo, or custom database? Pick the right MOLGENIS solution for your use case.
---

MOLGENIS is a flexible platform — the same EMX2 engine powers data catalogues, patient registries, and custom research databases. This guide helps you choose the right starting point.

## Decision flowchart

```
What's your primary need?
│
├─ "I need to make data/samples findable across organisations"
│  → Data Catalogue
│
├─ "I need to track patients, mutations, or clinical observations"
│  → Patient Registry
│
├─ "I need to analyse data across sites without moving it"
│  → Armadillo (DataSHIELD)
│
├─ "I need a custom research database"
│  → EMX2 Platform (blank schema)
│
└─ "I need several of these"
   → Start with the most urgent; they all run on the same platform
```

## Comparison

| | Data Catalogue | Patient Registry | Armadillo | Custom Database |
|---|---|---|---|---|
| **Purpose** | Metadata discovery and harmonisation | Structured clinical/genetic data collection | Federated statistical analysis | Any structured data management |
| **Primary users** | Researchers browsing, data managers curating | Clinicians entering data, researchers querying | Statisticians running analyses | Domain-specific |
| **Schema template** | DATA_CATALOGUE | RD_REGISTRY / custom | N/A (separate service) | Blank — design your own |
| **Key features** | Variable harmonisation, faceted search, FAIR Data Point, access requests | Data-entry forms, validation, ontology lookups, changelog | DataSHIELD integration, disclosure control, Parquet storage | Full EMX2 flexibility |
| **Deployment** | MOLGENIS EMX2 | MOLGENIS EMX2 | Armadillo server (separate) | MOLGENIS EMX2 |
| **Examples** | BBMRI-ERIC Directory, LifeLines | Deb-Central, MVID-Central, CHD7 | LifeCycle, ATHLETE, LongITools | WormQTL, HFGP |

## When to use the Data Catalogue

Choose the catalogue when:
- You represent a **consortium or network** with multiple cohorts, biobanks, or data sources
- Your goal is **discoverability** — helping researchers find what data exists and how to access it
- You need **variable harmonisation** across cohorts with different local variable names
- You want standards-compliant metadata (DCAT-AP, FAIR Data Points)
- You're working in biobanking, epidemiology, or multi-centre cohort studies

Real-world examples: BBMRI-ERIC Directory (515+ biobanks across Europe), LifeLines Data Catalogue (167,000 participants), RD-Connect Sample Catalogue.

[Get started with the Catalogue →](/GCC/xK7mQ3docs/catalogue/getting-started/)

## When to use a Patient Registry

Choose the registry when:
- You're collecting **individual patient records** with clinical observations, genetic variants, or phenotypes
- You need **structured data entry** with validation, mandatory fields, and ontology-based coding
- You're working on **rare diseases** where patient numbers are small but data richness is high
- You need a **changelog** to track who modified what and when
- Data entry is done by clinicians or study coordinators via web forms

Real-world examples: Deb-Central (Epidermolysis Bullosa), MVID-Central (Microvillus Inclusion Disease), ARVD/C Genetic Variants Database, CHD7/CHARGE database.

[Learn about the Registry →](/GCC/xK7mQ3docs/registry/)

## When to use Armadillo

Choose Armadillo when:
- You need to **analyse data across multiple sites** without centralising it
- **GDPR or data governance** prevents moving individual-level data
- You want to run standard statistical analyses (regression, survival, meta-analysis) in a federated way
- You're working with **DataSHIELD** or your consortium requires privacy-preserving analytics

Armadillo is often used **alongside** a Data Catalogue — the catalogue makes the data discoverable, and Armadillo enables the analysis.

Real-world examples: LifeCycle (19 birth cohorts), ATHLETE (exposome), LongITools (cardiovascular), CONCEPTION (medication safety in pregnancy).

[Get started with Armadillo →](/GCC/xK7mQ3docs/armadillo/getting-started/)

## When to build a custom database

Choose a blank EMX2 schema when:
- None of the templates match your domain
- You need a **bespoke data model** for a specific research project
- You want the EMX2 platform features (GraphQL API, forms, permissions, file storage) but with your own table structure

Start by reading [The EMX2 Data Model](/GCC/xK7mQ3docs/concepts/emx2/) and then create a database without a template.

## Combining solutions

The solutions are complementary, not exclusive:

- **Catalogue + Armadillo**: catalogue your cohort metadata for discovery, then use Armadillo for federated analysis. This is the most common combination.
- **Catalogue + Registry**: a national registry feeds metadata into a network catalogue for cross-border discovery.
- **Custom + Catalogue**: collect project-specific data in a custom schema, expose standardised metadata through the catalogue schema on the same server.

All MOLGENIS solutions share the same authentication, API layer, and hosting infrastructure — you can run multiple schemas on a single server.
