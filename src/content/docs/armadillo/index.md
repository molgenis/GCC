---
title: Armadillo (DataSHIELD)
description: Federated analysis across cohorts without moving data — powered by DataSHIELD and MOLGENIS Armadillo.
---

MOLGENIS Armadillo is a lightweight server for **federated analysis** using [DataSHIELD](https://www.datashield.org/). It lets researchers run statistical analyses across multiple cohort servers simultaneously — without any individual-level data ever leaving the cohort's infrastructure.

## Why Armadillo?

Traditional multi-cohort research requires pooling data in a central location. This creates GDPR complications, governance overhead, and security risks. Armadillo flips this model:

- **Data stays where it is** — each cohort runs an Armadillo server locally
- **Analysis goes to the data** — researchers send analysis commands to all servers simultaneously
- **Only aggregates return** — individual-level data never leaves the server
- **Multi-layer disclosure prevention** — system-level, analysis-level, and governance-level protections prevent re-identification

## How it works

```
┌────────────────────┐
│  Researcher's R    │  ← DSMolgenisArmadillo R package
│  session           │
└──────┬─────────────┘
       │  DataSHIELD commands
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Armadillo    │  │ Armadillo    │  │ Armadillo    │
│ Server A     │  │ Server B     │  │ Server C     │
│ (Cohort NL)  │  │ (Cohort DE)  │  │ (Cohort UK)  │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Data (parquet│  │ Data (parquet│  │ Data (parquet│
│  on MinIO)   │  │  on MinIO)   │  │  on MinIO)   │
└──────────────┘  └──────────────┘  └──────────────┘
       │                 │                 │
       └─────────┬───────┘                 │
                 ▼                         │
         Aggregate results only ◄──────────┘
```

1. Each cohort deploys an Armadillo server with their data in Parquet format
2. Researchers connect from R using the `DSMolgenisArmadillo` package
3. DataSHIELD sends the same analysis command to all servers
4. Each server executes the analysis locally and returns only aggregate/summary statistics
5. The researcher combines the aggregate results

## Key roles

| Role | Responsibilities |
|------|-----------------|
| **Researcher** | Request access, run DataSHIELD analyses, work with aggregate results |
| **Cohort data manager** | Upload data, manage permissions, create data subsets, run quality control |
| **System administrator** | Deploy Armadillo, configure authentication, manage the server |

## Features

- **Parquet-based storage** — efficient columnar storage via MinIO (S3-compatible)
- **Fine-grained permissions** — control access at the project and dataset level
- **Data subsetting** — create views of data for specific research projects
- **Quality control** — preview and validate data before making it available
- **Audit logging** — track who accessed what and when
- **OIDC authentication** — integrate with institutional identity providers
- **R client library** — `DSMolgenisArmadillo` for seamless DataSHIELD integration

## Publication

> Cadman T, et al. *MOLGENIS Armadillo: a lightweight server for federated analysis using DataSHIELD.* Bioinformatics, 2024.

## Next steps

- [Getting Started](/docs/armadillo/getting-started/) — deploy your first Armadillo server
- [Scenarios](/docs/armadillo/scenarios/) — end-to-end walkthrough: federated BMI analysis across three cohorts
- [Data Catalogue](/docs/catalogue/) — catalogue your cohort metadata alongside Armadillo
