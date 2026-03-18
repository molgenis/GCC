---
title: Patient Registry
description: Structured registries for rare-disease patients, mutations, and phenotypes using MOLGENIS.
---

MOLGENIS provides best-practice templates for building **patient registries** — structured databases for capturing clinical observations, genetic variants, and phenotypic data. Registries are a cornerstone of rare-disease research, where every patient counts.

## Who uses it?

| Role | What you do |
|------|-------------|
| **Clinician / study coordinator** | Enter patient data via structured web forms |
| **Researcher** | Query the registry, export data for analysis |
| **Data manager** | Manage the schema, import bulk data, maintain ontologies |
| **Administrator** | Deploy the platform, manage users and permissions |

## Live instances

MOLGENIS registries are used worldwide for rare-disease research:

- **[Deb-Central](https://www.deb-central.org)** — international patient registry for Dystrophic Epidermolysis Bullosa
- **[MVID-Central](https://www.mvid-central.org)** — international registry for Microvillus Inclusion Disease
- **[ARVD/C Database](https://arvc.molgeniscloud.org)** — Arrhythmogenic Right Ventricular Dysplasia/Cardiomyopathy genetic variants
- **[CHD7 Database](https://www.CHD7.org)** — CHD7 mutations in CHARGE syndrome

## Key features

- **Structured data-entry forms** — auto-generated from the schema, with validation, required fields, and conditional visibility
- **Ontology integration** — code diagnoses, phenotypes, and mutations using standard ontologies (ICD-10, HPO, OMIM) with tree-based selection
- **Changelog** — track every data change with user, timestamp, and old/new values
- **Multi-language support** — form labels in multiple languages for international registries
- **Fine-grained permissions** — control who can view, edit, or manage data at the schema level
- **Excel/CSV import/export** — bulk data management alongside form-based entry
- **GraphQL and REST APIs** — programmatic access for analysis pipelines

## Getting started

1. Deploy MOLGENIS EMX2 (see [Installation](/GCC/xK7mQ3docs/platform/installation/))
2. Create a new database and choose a registry template (or design your own schema)
3. Define your tables: patients, diagnoses, genetic variants, clinical observations
4. Set up ontology columns for standardised coding
5. Enable the changelog: set `isChangelogEnabled: true` in database settings
6. Add users and assign roles (viewer, editor, manager)

For the data model mechanics, see [The EMX2 Data Model](/GCC/xK7mQ3docs/concepts/emx2/).

## Architecture

Registries run on the same MOLGENIS EMX2 platform as catalogues. The key difference is in the schema design — registries typically have:

- **Patient-centric tables** with clinical observations as columns
- **Ontology columns** for standardised coding
- **Validation expressions** to enforce data quality
- **Sections** to organise long forms into logical pages
- **Changelog enabled** for audit trails

## Next steps

- [Scenarios](/GCC/xK7mQ3docs/registry/scenarios/) — end-to-end walkthrough: building a rare-disease patient registry
- [The EMX2 Data Model](/GCC/xK7mQ3docs/concepts/emx2/) — schema design for registries
- [Choosing a Solution](/GCC/xK7mQ3docs/concepts/choosing/) — registry vs. catalogue vs. custom database
