---
title: The EMX2 Data Model
description: Understand schemas, tables, columns, types, and ontologies — the building blocks of every MOLGENIS database.
---

EMX2 is the data modelling format at the heart of MOLGENIS. It defines how you structure databases using **schemas**, **tables**, and **columns** — all manageable through spreadsheets, APIs, or the web UI. Each schema automatically gets its own GraphQL endpoint, permission scope, and set of apps.

## Core concepts

### Databases and schemas

A MOLGENIS server can host multiple databases. Each database is organised using a **schema** — a definition of its tables, columns, relationships, and constraints. Under the hood, each schema maps to a PostgreSQL schema, providing full isolation and independent permissions.

**Database naming rules:**
- Start with a letter, followed by letters, numbers, spaces, dashes, or underscores
- Maximum 31 characters
- No space immediately before or after an underscore

### Tables

Tables hold your data. Each table needs:
- A unique name (same naming rules as databases, max 31 characters)
- At least one column
- A primary key (column with `key=1`)

### Columns

Columns define the fields in your tables. Column names can be up to 63 characters (PostgreSQL limit) and follow the same naming pattern.

## Column types

### Basic types

| Type | Description |
|------|-------------|
| `string` | Default type — short text |
| `text` | Long text (rendered as text area) |
| `bool` | True/false |
| `int` | Integer |
| `bigint` | Large integer |
| `decimal` | Floating-point number |
| `date` | Date (YYYY-MM-DD) |
| `datetime` | Date and time |
| `period` | ISO 8601 duration (e.g. `P2Y4M30D`) |
| `uuid` | UUID |
| `json` | Valid JSON (must be array or object) |
| `file` | File upload |
| `email` | Email address (rendered as link) |
| `hyperlink` | URL (rendered as link) |
| `auto_id` | Automatically assigned ID |

### Relationship types

| Type | Cardinality | UI rendering |
|------|-------------|-------------|
| `ref` | Many-to-one | _(deprecated, use select)_ |
| `select` | Many-to-one | Dropdown menu |
| `radio` | Many-to-one | Radio button group |
| `ref_array` | Many-to-many | _(deprecated, use multiselect)_ |
| `multiselect` | Many-to-many | Multi-select dropdown |
| `checkbox` | Many-to-many | Checkbox group |
| `ontology` | Many-to-one | Ontology tree browser |
| `ontology_array` | Many-to-many | Ontology tree browser |
| `refback` | Reverse reference | Read-only bidirectional link |

### Array types

Most basic types have array variants: `string_array`, `int_array`, `decimal_array`, `date_array`, `bool_array`, `text_array`, `email_array`, `hyperlink_array`, etc.

### Layout types

| Type | Purpose |
|------|---------|
| `heading` | Display column name as a section header in forms |
| `section` | Same as heading, but displayed on a separate form page |

## Defining a schema

The simplest way to define a schema is with an Excel file containing a sheet named **molgenis** (or a `molgenis.csv` file). Each row defines a column:

| tableName | columnName | type | key | required | description |
|-----------|-----------|------|-----|----------|-------------|
| Patient | id | auto_id | 1 | | Unique patient identifier |
| Patient | name | string | 2 | TRUE | Patient name |
| Patient | dateOfBirth | date | | | |
| Patient | diagnosis | ontology | | | ICD-10 diagnosis code |
| Patient | physician | select | | | Treating physician |
| Physician | id | auto_id | 1 | | |
| Physician | name | string | 2 | TRUE | |
| Physician | department | string | | | |

Upload this file to create all tables, columns, and relationships at once.

## Keys

- **`key=1`** — primary key, used in the UI, uploads, and API. Values must be unique.
- **`key=2`, `key=3`, ...** — secondary/composite keys for additional uniqueness constraints.

## References

Link tables together using relationship types:

```
# In the molgenis sheet:
tableName: Patient
columnName: physician
type: select
refTable: Physician
```

Cross-schema references are possible with `refSchema`:

```
tableName: Patient
columnName: diagnosis
type: ontology
refTable: ICD10
refSchema: shared-ontologies
```

### refLabel

By default, references display using the primary key. Override this with `refLabel`:

```
columnName: physician
refLabel: ${name} (${department})
```

## Ontologies

Columns of type `ontology` or `ontology_array` automatically create a lookup table with:

| Column | Purpose |
|--------|---------|
| `name` | The code/identifier (primary key) |
| `label` | Human-readable display name |
| `parent` | For hierarchical ontologies |
| `ontologyTermURI` | Persistent URI (e.g. ICD-10 code URI) |
| `order` | Custom sort order |

## Expressions

EMX2 supports JavaScript expressions for computed values, validation, and visibility control.

### Computed columns

```
columnName: fullName
computed: firstName + " " + lastName
```

With auto_id:
```
columnName: studyCode
type: auto_id
computed: STUDY-${mg_autoid}
```

### Validation

```
columnName: age
validation: if(age < 0 || age > 150) 'Age must be between 0 and 150'
```

### Conditional visibility

```
columnName: pregnancyDetails
visible: sex === 'Female'
```

### Conditional required

```
columnName: surname
required: if(name != null) 'Surname is required when name is provided'
```

## Table inheritance

Use `tableExtends` to create specialised tables that inherit columns from a parent:

| tableName | tableExtends | columnName | type |
|-----------|-------------|-----------|------|
| Animal | | name | string |
| Animal | | weight | decimal |
| Dog | Animal | breed | string |
| Cat | Animal | indoor | bool |

Rows in `Dog` and `Cat` are also visible in the `Animal` table.

## Migrations

Rename or remove tables and columns using annotations in the molgenis sheet:

| tableName | columnName | oldName | drop |
|-----------|-----------|---------|------|
| NewTableName | | OldTableName | |
| MyTable | newColumn | oldColumn | |
| MyTable | removedColumn | | TRUE |

## Internationalisation

Enable multi-language labels by setting the `locale` database setting:

```json
["en", "nl", "de", "fr"]
```

Then use language-specific label columns in your schema: `label:en`, `label:nl`, `label:de`, etc.

## Semantics (RDF)

Add semantic annotations to tables and columns using the `semantics` field:

```
tableName: Patient
semantics: schema:Patient, foaf:Person
```

These annotations drive the RDF/Linked Data API, producing standards-compliant triples with proper ontology mappings. MOLGENIS includes 40+ pre-configured namespace prefixes (schema.org, Dublin Core, DCAT, FOAF, OBO, etc.).
