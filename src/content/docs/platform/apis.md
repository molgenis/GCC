---
title: APIs
description: GraphQL, RDF, CSV, and Python client APIs for programmatic access to MOLGENIS.
---

MOLGENIS exposes several APIs for programmatic access. GraphQL is the primary API; REST-style endpoints are available for batch operations, RDF, and reports.

## GraphQL API

Every schema automatically gets a GraphQL endpoint with full CRUD operations.

**Endpoints:**

| URL | Scope |
|-----|-------|
| `/api/graphql` | Server-level operations (sign in, list schemas) |
| `/{schema}/api/graphql` | Schema-level operations (query/mutate data) |
| `/{schema}/graphql-playground/` | Interactive query builder |

### Authentication

```graphql
# Sign in (returns a session token)
mutation {
  signin(email: "user@example.org", password: "secret") {
    token
    message
  }
}

# Create an API token for scripts/pipelines
mutation {
  createToken(email: "admin", tokenName: "my-pipeline") {
    token
    message
  }
}
```

Use the token in HTTP headers: `x-molgenis-token: <token>`

### Querying data

```graphql
# Basic query with relationships
{
  Patient {
    id
    name
    diagnosis { name }
    physician { name, department }
  }
  Patient_agg {
    count
  }
}
```

**Filtering:**

```graphql
{
  Patient(
    limit: 10
    offset: 0
    filter: {
      diagnosis: { equals: "Alzheimer" }
      age: { between: [60, 90] }
    }
    search: "amsterdam"
  ) {
    id
    name
    age
  }
}
```

Filter operators: `equals`, `like`, `notLike`, `between`, `greater`, `smaller`, `not_equals`, plus `_and` and `_or` for logical combinations.

**Aggregation:**

```graphql
{
  Patient_groupBy {
    count
    sum { age }
    diagnosis { name }
  }
}
```

### Mutations

```graphql
# Insert
mutation {
  insert(Patient: { name: "Jane Doe", age: 45 }) {
    message
  }
}

# Update, save (upsert), and delete use the same structure
mutation {
  delete(Patient: { id: "P001" }) {
    message
  }
}
```

### Schema introspection

```graphql
{
  _schema {
    name
    tables {
      name
      columns { name, columnType, key, required, refTable }
    }
    members { email, role }
  }
}
```

## CSV / Excel API

Batch import and export via file upload.

| Operation | Endpoint |
|-----------|----------|
| Download CSV | `GET /{schema}/api/csv/{table}` |
| Upload CSV | `POST /{schema}/api/csv/{table}` |
| Download with system columns | `GET /{schema}/api/csv/{table}?includeSystemColumns=true` |

System columns: `mg_draft`, `mg_insertedBy`, `mg_insertedOn`, `mg_updatedBy`, `mg_updatedOn`.

**Delete rows:** Add a column `mg_delete` with value `true` for rows to remove.

**File attachments:** Use CSV+ZIP format — files are stored in a `_files` folder within the ZIP.

## RDF / Linked Data API

MOLGENIS exposes semantically annotated data as RDF triples.

| Endpoint | Format |
|----------|--------|
| `/{schema}/api/rdf` | Content-negotiated (Turtle default) |
| `/{schema}/api/ttl` | Always Turtle |
| `/{schema}/api/jsonld` | Always JSON-LD |
| `/{schema}/api/rdf/{table}` | Single table |
| `/{schema}/api/rdf?shacls` | SHACL shapes |

Supported formats via `Accept` header: `text/turtle`, `application/ld+json`, `application/rdf+xml`, `application/n-triples`, `application/n-quads`, `text/n3`, `application/trig`.

## Reports API

SQL-based reports defined in database settings.

```json
[
  {
    "id": "cohort-summary",
    "description": "Participant counts by cohort",
    "sql": "SELECT name, \"numberOfParticipants\" FROM \"Resources\""
  }
]
```

Access at `/{schema}/api/reports/cohort-summary`.

Parameterised reports:
```json
{
  "id": "by-country",
  "sql": "SELECT * FROM \"Resources\" WHERE country = ANY(${country:string_array})"
}
```

Access: `/{schema}/api/reports/by-country?country=Netherlands,Germany`

## Python client

```bash
pip install molgenis-emx2-pyclient
```

```python
from molgenis_emx2_pyclient import Client
import os

token = os.environ.get("MOLGENIS_TOKEN")

with Client(url='https://my-molgenis.org', token=token) as client:
    # List schemas
    print(client.schema_names)

    # Query data
    data = client.get("Patient", schema="my-registry")

    # Query as pandas DataFrame
    df = client.get("Patient", schema="my-registry", as_df=True)

    # Filter
    filtered = client.get(
        "Patient",
        query_filter="age > 50 and sex == 'Female'",
        schema="my-registry"
    )

    # Upload data
    client.save_table("Patient", data=[
        {"name": "Jane", "age": 45},
        {"name": "John", "age": 52}
    ], schema="my-registry")

    # Upload file
    client.upload_file("data.xlsx", schema="my-registry")

    # Export
    client.export(schema="my-registry", filename="backup.xlsx", as_excel=True)
```

## Scripts and jobs

MOLGENIS can run Python or Bash scripts as asynchronous jobs.

```bash
# Submit a script
curl -X POST -H "x-molgenis-token: $TOKEN" \
  https://my-molgenis.org/api/script/my-script

# Check status
curl https://my-molgenis.org/api/tasks/<taskID>

# Download output
curl https://my-molgenis.org/api/tasks/<taskID>/output
```

Scripts can be scheduled with cron expressions and configured with dependencies, output file extensions, and failure notification emails.
