---
title: "Scenario: Building a Rare-Disease Patient Registry"
description: End-to-end walkthrough of creating a patient registry for a rare genetic skin disease, from schema design to data entry.
---

This scenario walks through building a MOLGENIS registry for a fictional rare disease — **Hereditary Cutaneous Syndrome (HCS)** — from schema design through to a working registry with clinician data entry and researcher queries.

## The brief

An international consortium of five dermatology centres wants to create a shared patient registry for HCS, a rare genetic skin disease affecting approximately 1 in 50,000 people. They need to:

1. Capture structured patient data (demographics, clinical features, genetic variants)
2. Use standard ontologies for diagnoses and phenotypes
3. Track data changes for regulatory compliance
4. Allow clinicians at each centre to enter data via web forms
5. Let researchers query aggregated data

## Phase 1: Deploy and create the database

Start MOLGENIS with Docker Compose (see [Installation](/docs/platform/installation/)), then:

1. Sign in as admin
2. Create a new database named `hcs-registry`
3. Don't select a template — we'll design a custom schema

## Phase 2: Design the schema

Create an Excel file with a **molgenis** sheet defining the data model:

| tableName | columnName | type | key | required | description |
|-----------|-----------|------|-----|----------|-------------|
| Patient | id | auto_id | 1 | | Auto-generated patient ID |
| Patient | registrationHeading | heading | | | Registration Details |
| Patient | centre | select | | TRUE | Contributing centre |
| Patient | dateRegistered | date | | TRUE | Date of registration |
| Patient | consent | bool | | TRUE | Patient/guardian consent obtained |
| Patient | demographicsHeading | heading | | | Demographics |
| Patient | yearOfBirth | int | | TRUE | Year of birth |
| Patient | sex | ontology | | TRUE | Biological sex |
| Patient | countryOfResidence | ontology | | | Country of residence |
| Patient | clinicalHeading | section | | | Clinical Features |
| Patient | ageAtOnset | int | | | Age at first symptoms (years) |
| Patient | diagnosis | ontology | | TRUE | Primary diagnosis |
| Patient | severity | radio | | | Disease severity |
| Patient | skinInvolvement | checkbox | | | Areas of skin involvement |
| Patient | mucosalInvolvement | bool | | | Mucosal involvement present |
| Patient | geneticsHeading | section | | | Genetics |
| Patient | geneTested | ontology | | | Gene(s) tested |
| Patient | variants | refback | | | Genetic variants (from Variant table) |
| Patient | notes | text | | | Free-text clinical notes |
| Variant | id | auto_id | 1 | | |
| Variant | patient | select | | TRUE | |
| Variant | gene | ontology | | TRUE | Gene symbol |
| Variant | hgvsCoding | string | | | HGVS coding DNA notation |
| Variant | hgvsProtein | string | | | HGVS protein notation |
| Variant | zygosity | radio | | | Homozygous / Heterozygous / Compound het |
| Variant | classification | radio | | | ACMG classification |
| Variant | source | string | | | Reference / publication |
| Centre | id | string | 1 | TRUE | Centre code |
| Centre | name | string | 2 | TRUE | Full centre name |
| Centre | country | ontology | | TRUE | Country |
| Centre | contactEmail | email | | TRUE | |
| Severity | name | string | 1 | TRUE | |
| Severity | order | int | | | |
| SkinArea | name | string | 1 | TRUE | |
| Zygosity | name | string | 1 | TRUE | |
| ACMGClassification | name | string | 1 | TRUE | |

Upload this schema via the **Upload** button in the Tables view.

## Phase 3: Populate reference data

Load the lookup tables with reference data:

**Centres:**
| id | name | country.name | contactEmail |
|----|------|-------------|-------------|
| UMCG | UMC Groningen | Netherlands | registry@umcg.nl |
| CHAR | Charité Berlin | Germany | registry@charite.de |
| GOSH | Great Ormond Street | United Kingdom | registry@gosh.nhs.uk |
| NECKER | Hôpital Necker | France | registry@necker.fr |
| BAMBI | Bambino Gesù | Italy | registry@opbg.net |

**Severity:** Mild, Moderate, Severe

**SkinArea:** Hands, Feet, Trunk, Face, Scalp, Limbs

**Zygosity:** Homozygous, Heterozygous, Compound heterozygous, Hemizygous

**ACMGClassification:** Pathogenic, Likely pathogenic, VUS, Likely benign, Benign

Upload these as Excel sheets or via the data-entry forms.

## Phase 4: Configure the registry

Enable audit tracking and form organisation:

```
# In Settings:
isChangelogEnabled: true
isChaptersEnabled: true
```

With `isChaptersEnabled`, the `section` type columns split the data-entry form into tabbed pages — so clinicians see "Registration Details" and "Demographics" on one page, "Clinical Features" on the next, and "Genetics" on the third.

## Phase 5: Set up users and permissions

Create user accounts for each centre and assign roles:

| User | Role | Access |
|------|------|--------|
| Centre data managers | **editor** | Enter and edit patient records |
| Centre PIs | **viewer** | Browse data, export for analysis |
| Registry coordinator | **manager** | Edit schema, manage users |
| Admin | **admin** | Full server access |

For production, configure OIDC so clinicians log in with their institutional credentials.

## Phase 6: Enter data

Clinicians at each centre open the registry URL, sign in, and use the structured form to enter patient data:

1. Navigate to the **Patient** table
2. Click **+ Add**
3. Fill in registration details and demographics
4. Tab to **Clinical Features** and enter diagnosis, severity, skin involvement
5. Tab to **Genetics** — add genetic variants (these create linked records in the Variant table)
6. Click **Save**

The ontology columns (diagnosis, sex, gene) show a tree browser for standardised selection. The `required` flag ensures critical fields are always filled.

## Phase 7: Query and export

Researchers can:

- **Browse** the Patient table with column filters
- **Search** using the search bar (full-text search across all text fields)
- **Export** filtered data as Excel or CSV via the download button
- **Query via API** using GraphQL:

```graphql
{
  Patient(filter: { severity: { equals: "Severe" } }) {
    id
    yearOfBirth
    sex { name }
    diagnosis { name }
    ageAtOnset
    variants {
      gene { name }
      hgvsCoding
      classification { name }
    }
  }
  Patient_agg {
    count
  }
}
```

## Variations

- **Adding follow-up visits** — create a `Visit` table linked to Patient, with visit date, clinical assessments, and treatment changes
- **Connecting to a catalogue** — expose registry metadata (number of patients, data elements collected) in a MOLGENIS Catalogue for cross-registry discovery
- **Multi-language forms** — set `locale: ["en", "fr", "de", "it", "nl"]` and add translated labels
- **Computed fields** — use `computed` expressions to auto-calculate derived values (e.g. disease duration from year of birth and current year)
- **Conditional forms** — use `visible` expressions to show genetics fields only when genetic testing was performed

## Next steps

- [The EMX2 Data Model](/docs/concepts/emx2/) — deep dive into schema design
- [Permissions & Security](/docs/platform/permissions/) — OIDC setup and role management
- [APIs](/docs/platform/apis/) — programmatic access for analysis pipelines
