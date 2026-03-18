---
title: "Scenario: Catalogue for a Five-Cohort Consortium"
description: End-to-end walkthrough — from schema design to a live search interface — for a multi-cohort data catalogue.
---

This scenario walks through the complete journey of setting up a MOLGENIS Data Catalogue for a fictional consortium called **NeuroCohort** that brings together five European cohorts studying neurodegenerative diseases. By the end, you'll have a branded catalogue with searchable cohorts, harmonised variables, and access-request workflows.

## The brief

NeuroCohort is a Horizon Europe project with five partners:

| Cohort | Country | Participants | Focus |
|--------|---------|-------------|-------|
| BrainAge NL | Netherlands | 12,000 | Population-based ageing study |
| NeuroGen DE | Germany | 8,500 | Genetic risk factors for Alzheimer's |
| CogTrack UK | United Kingdom | 15,000 | Longitudinal cognitive tracking |
| MediterMind IT | Italy | 6,200 | Mediterranean diet and neurodegeneration |
| NordicBrain SE | Sweden | 9,800 | Registry-based neurological outcomes |

The project needs a central catalogue where researchers can:
1. Discover which cohorts have which variables
2. See harmonisation status across cohorts
3. Request access to individual cohort data

## Phase 1: Deploy the platform

Start with a Docker Compose deployment. For a production consortium, you'd typically run this on a cloud VM (4 CPU, 8 GB RAM is sufficient for most catalogues).

```yaml
# docker-compose.yml
services:
  molgenis:
    image: molgenis/molgenis-emx2:latest
    ports:
      - "8080:8080"
    environment:
      MOLGENIS_POSTGRES_URI: jdbc:postgresql://postgres/molgenis
      MOLGENIS_POSTGRES_USER: molgenis
      MOLGENIS_POSTGRES_PASS: ${DB_PASSWORD}
      MOLGENIS_ADMIN_PW: ${ADMIN_PASSWORD}
      MOLGENIS_OIDC_CLIENT_ID: ${OIDC_CLIENT_ID}
      MOLGENIS_OIDC_CLIENT_SECRET: ${OIDC_CLIENT_SECRET}
      MOLGENIS_OIDC_DISCOVERY_URI: https://login.neurocohort.eu/realms/neurocohort/.well-known/openid-configuration
      MOLGENIS_OIDC_CALLBACK_URL: https://catalogue.neurocohort.eu/_callback
    depends_on:
      - postgres
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: molgenis
      POSTGRES_USER: molgenis
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d
```

Sign in as `admin` and immediately change the password.

## Phase 2: Create the catalogue schema

1. Create a new database named `neurocohort`
2. Select the **DATA_CATALOGUE** template
3. Leave demo data unchecked — we'll load real metadata

The template creates all standard catalogue tables. Verify by browsing to **Tables** and confirming you see:

- Resources, Subcohorts, Collection events
- Variables, Variable values, Harmonisations
- Networks, Organisations, Contacts
- Dataset mappings, Variable mappings

## Phase 3: Define the common data model

The network data manager defines which variables all cohorts should harmonise to. Create a **common data model** (CDM) by adding entries to the Variables table.

Prepare an Excel sheet named `Variables` with your CDM:

| resource.id | dataset.resource.id | dataset.name | name | label | format.name | unit.name | description |
|-------------|---------------------|--------------|------|-------|-------------|-----------|-------------|
| NeuroCohort CDM | NeuroCohort CDM | Demographics | age_at_baseline | Age at baseline | Continuous | years | Age of participant at study entry |
| NeuroCohort CDM | NeuroCohort CDM | Demographics | sex | Sex | Categorical | | Biological sex |
| NeuroCohort CDM | NeuroCohort CDM | Cognitive | mmse_score | MMSE Score | Continuous | points | Mini-Mental State Examination score (0-30) |
| NeuroCohort CDM | NeuroCohort CDM | Cognitive | moca_score | MoCA Score | Continuous | points | Montreal Cognitive Assessment score (0-30) |
| NeuroCohort CDM | NeuroCohort CDM | Biomarkers | apoe_genotype | APOE Genotype | Categorical | | APOE allele combination |
| NeuroCohort CDM | NeuroCohort CDM | Biomarkers | csf_abeta42 | CSF A-beta 42 | Continuous | pg/mL | Cerebrospinal fluid amyloid beta 42 level |

Upload this via **Upload → Excel** or the Python client.

## Phase 4: Register the cohorts

Each cohort data manager fills in their resource metadata. At minimum, each cohort needs:

```python
from molgenis_emx2_pyclient import Client

with Client('https://catalogue.neurocohort.eu', schema='neurocohort') as client:
    client.signin('admin', 'secure-password')

    # Add a cohort
    client.save_table('Resources', data=[{
        'id': 'brainage-nl',
        'name': 'BrainAge NL',
        'acronym': 'BrainAge',
        'type': [{'name': 'Population cohort'}],
        'design': [{'name': 'Longitudinal'}],
        'numberOfParticipants': 12000,
        'description': 'Population-based ageing study in the Northern Netherlands...',
        'contactEmail': 'info@brainage.nl',
        'website': 'https://brainage.nl',
        'startYear': 2008,
    }])
```

Repeat for each cohort, adding subcohorts and collection events as needed.

## Phase 5: Harmonise variables

Each cohort maps their local variables to the CDM. The harmonisation table tracks the mapping status:

| **CDM variable** | **BrainAge NL** | **NeuroGen DE** | **CogTrack UK** | **MediterMind IT** | **NordicBrain SE** |
|-------------------|----------------|-----------------|-----------------|--------------------|--------------------|
| age_at_baseline | complete | complete | complete | complete | complete |
| sex | complete | complete | complete | complete | complete |
| mmse_score | complete | complete | partial | complete | not available |
| moca_score | not available | complete | complete | complete | complete |
| apoe_genotype | complete | complete | complete | partial | complete |
| csf_abeta42 | complete | not available | partial | complete | not available |

Cohort data managers upload their harmonisation mappings as Variable mappings, indicating:
- **complete** — direct mapping exists
- **partial** — mapping requires transformation or has caveats
- **not available** — cohort does not collect this variable

## Phase 6: Brand the catalogue

Configure the look and feel in **Settings**:

```
CATALOGUE_LOGO_SRC = https://neurocohort.eu/logo.png
CATALOGUE_LANDING_TITLE = NeuroCohort Data Catalogue
CATALOGUE_LANDING_DESCRIPTION = Discover and request access to harmonised data across five European neurodegenerative disease cohorts.
CATALOGUE_LANDING_COHORTS_CTA = Cohorts
CATALOGUE_LANDING_VARIABLES_CTA = Harmonised Variables
CATALOGUE_LANDING_NETWORKS_CTA = The Consortium
CATALOGUE_BANNER_HTML = <div style="background:#f0f7ff;padding:8px;text-align:center">NeuroCohort is funded by Horizon Europe grant #123456</div>
```

For custom colours, set the `CATALOGUE_THEME` setting or provide a CSS file.

## Phase 7: Configure access requests

The catalogue supports integrated access-request workflows. Researchers browsing the catalogue can click "Request access" on a cohort page, which triggers:

1. The request is logged in the catalogue
2. The cohort data manager receives a notification
3. The manager reviews and approves/denies via the admin interface

Configure the access request flow by setting the relevant contact emails on each Resource record.

## Phase 8: Go live

Final checklist before launch:

- [ ] All five cohorts have complete resource metadata
- [ ] CDM variables are defined and harmonisation status is current
- [ ] OIDC is configured for institutional login
- [ ] HTTPS is set up via a reverse proxy (nginx/Caddy)
- [ ] Backups are configured for the PostgreSQL volume
- [ ] Analytics are enabled (`NUXT_PUBLIC_ANALYTICS_KEY`)

Point your DNS to the server and you're live.

## Variations

From this base scenario, common enhancements include:

- **Adding a FAIR Data Point** — the catalogue automatically exposes DCAT-AP metadata at the `/api/fdp` endpoint
- **Connecting Armadillo** — enable federated analysis so researchers can run DataSHIELD scripts against cohort data without downloading it. See [Armadillo Overview](/docs/armadillo/)
- **Custom landing page sections** — use `CATALOGUE_ALL_ADDITIONAL_HTML` to add project-specific content
- **Multi-language support** — set `locales` to enable translated labels in data-entry forms
- **Extending the data model** — add custom tables or columns to the catalogue schema for project-specific metadata

## Next steps

- [Configuring Your Catalogue](/docs/catalogue/howto-configure/) — full settings reference
- [Armadillo: Federated Analysis](/docs/armadillo/) — connect your catalogue to DataSHIELD
- [EMX2 Data Model](/docs/concepts/emx2/) — customise the schema
