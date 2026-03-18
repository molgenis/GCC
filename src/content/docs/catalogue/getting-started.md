---
title: "Getting Started: Data Catalogue"
description: Set up a MOLGENIS Data Catalogue from scratch — install, create a schema, load metadata, and configure the frontend.
---

This guide walks you through deploying a catalogue instance and loading your first metadata. By the end you'll have a running catalogue with searchable cohorts and variables.

## Prerequisites

- Docker and Docker Compose installed ([Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Colima](https://github.com/abiosoft/colima) on macOS)
- A browser (Chrome, Firefox, Safari, or Edge)
- Your cohort/biobank metadata in a spreadsheet (optional — we'll use demo data first)

## 1. Start MOLGENIS with Docker Compose

Create a file called `docker-compose.yml`:

```yaml
services:
  molgenis:
    image: molgenis/molgenis-emx2:latest
    ports:
      - "8080:8080"
    environment:
      MOLGENIS_POSTGRES_URI: jdbc:postgresql://postgres/molgenis
      MOLGENIS_POSTGRES_USER: molgenis
      MOLGENIS_POSTGRES_PASS: molgenis
      MOLGENIS_ADMIN_PW: admin
    depends_on:
      - postgres
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: molgenis
      POSTGRES_USER: molgenis
      POSTGRES_PASSWORD: molgenis
    volumes:
      - psql_data:/var/lib/postgresql/data

volumes:
  psql_data:
```

Start the services:

```bash
docker compose up
```

:::note
PostgreSQL may restart 2–4 times on first boot — this is expected. Wait until you see `Started MOLGENIS` in the logs.
:::

Open [http://localhost:8080](http://localhost:8080) in your browser.

## 2. Sign in and change the admin password

1. Click **Sign in** (top right)
2. Username: `admin`, Password: `admin`
3. **Immediately** change the admin password: click your username in the top bar → change password

## 3. Create a catalogue database

1. Click the **+** button to create a new database
2. Name it (e.g. `my-catalogue`)
3. Select the **DATA_CATALOGUE** template
4. Optionally tick **Include demo data** to pre-load example cohorts and variables
5. Click **Create**

The template creates all necessary tables (Resources, Subcohorts, Collection events, Variables, Networks, etc.) with the current catalogue data model (v7.x).

## 4. Explore the demo data

If you included demo data, navigate to your database and open the **catalogue** app:

```
http://localhost:8080/my-catalogue/catalogue/
```

You'll see a landing page with cohorts, networks, and variables. Try:

- Clicking **Cohorts** to browse cohort cards
- Using the **Variables** search to find harmonised variables across cohorts
- Viewing a cohort detail page with subcohort and collection event metadata

## 5. Load your own metadata

### Option A: Upload via Excel

1. Go to your database → **Tables** view (the schema editor)
2. Download the empty template: click **Download** → **Excel** — this gives you a spreadsheet with all catalogue tables as sheets
3. Fill in your metadata (start with the **Resources** sheet)
4. Upload: click **Upload** → select your filled Excel file

### Option B: Use the data-entry forms

1. Navigate to a table (e.g. **Resources**)
2. Click **+ Add** to open the data-entry form
3. Fill in the fields — required fields are marked with an asterisk
4. Save

### Option C: Use the Python client

```python
from molgenis_emx2_pyclient import Client

with Client('http://localhost:8080', schema='my-catalogue') as client:
    client.signin('admin', 'your-new-password')

    # Upload an Excel file
    client.upload_file('my-catalogue-data.xlsx')
```

Install the client with:

```bash
pip install molgenis-emx2-pyclient
```

## 6. Configure the catalogue appearance

Key settings you can change (under **Settings** in your database):

| Setting | Effect |
|---------|--------|
| `CATALOGUE_LOGO_SRC` | URL to your network/consortium logo |
| `CATALOGUE_LANDING_TITLE` | Main heading on the landing page |
| `CATALOGUE_LANDING_DESCRIPTION` | Subtitle text |
| `CATALOGUE_LANDING_COHORTS_CTA` | Label for the cohorts button (default: "Cohorts") |
| `CATALOGUE_BANNER_HTML` | HTML banner displayed at the top of every page |

For theming (colours and style), set the `CATALOGUE_THEME` setting or the `NUXT_PUBLIC_EMX2_THEME` environment variable.

See [Configuring Your Catalogue](/GCC/xK7mQ3docs/catalogue/howto-configure/) for the full list of settings.

## 7. Set up user access

Assign roles to control who can do what:

| Role | Can do |
|------|--------|
| **viewer** | Browse the catalogue |
| **editor** | Add/edit metadata records |
| **manager** | Edit schema, assign roles |

To add a user:
1. Go to **Members** in your database
2. Add the user's email and assign a role

For single sign-on, configure OIDC — see [Permissions & Security](/GCC/xK7mQ3docs/platform/permissions/).

## Next steps

- [Scenarios](/GCC/xK7mQ3docs/catalogue/scenarios/) — end-to-end walkthrough of setting up a multi-cohort catalogue
- [Configuring Your Catalogue](/GCC/xK7mQ3docs/catalogue/howto-configure/) — full settings reference
- [The EMX2 Data Model](/GCC/xK7mQ3docs/concepts/emx2/) — understand schemas and column types
