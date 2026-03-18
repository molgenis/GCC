---
title: Installation
description: Deploy MOLGENIS EMX2 using Docker, Java + PostgreSQL, or Kubernetes.
---

## Quick start with Docker Compose

The fastest way to get MOLGENIS running. Requires [Docker](https://www.docker.com/products/docker-desktop/) (or [Colima](https://github.com/abiosoft/colima) on macOS).

Create `docker-compose.yml`:

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

```bash
docker compose up
```

:::note
PostgreSQL may restart 2–4 times on first boot. Wait for `Started MOLGENIS` in the logs, then open [http://localhost:8080](http://localhost:8080).
:::

**Default credentials:** username `admin`, password `admin`. Change the admin password immediately after first login.

### macOS without Docker Desktop (Colima)

```bash
# Install Colima and Docker CLI
brew install colima docker docker-compose

# Start Colima
colima start

# Then use docker compose as normal
docker compose up
```

Run `colima start` after each computer restart.

### Updating

```bash
docker compose pull
docker compose up -d
```

### Clean start

Remove the `psql_data` volume to reset all data:

```bash
docker compose down -v
docker compose up
```

## Java + PostgreSQL (local installation)

For development or when you need more control.

### Prerequisites

- Java 21 (e.g. [Eclipse Temurin](https://adoptium.net/))
- PostgreSQL 15+
- Optional: Python 3 (for the scripts feature)

### Set up PostgreSQL

```sql
-- Connect as postgres superuser
sudo -u postgres psql

CREATE DATABASE molgenis;
CREATE USER molgenis WITH LOGIN NOSUPERUSER INHERIT CREATEROLE
  ENCRYPTED PASSWORD 'molgenis';
GRANT ALL PRIVILEGES ON DATABASE molgenis TO molgenis;
```

On macOS with Homebrew:

```bash
brew install postgresql@15
brew services start postgresql@15
```

### Download and run

Download the latest `molgenis-emx2-<version>-all.jar` from [GitHub Releases](https://github.com/molgenis/molgenis-emx2/releases).

```bash
java -jar molgenis-emx2-<version>-all.jar
```

Open [http://localhost:8080](http://localhost:8080).

### Configuration

Configure via environment variables or Java system properties (`-D` flags):

| Variable | Default | Description |
|----------|---------|-------------|
| `MOLGENIS_POSTGRES_URI` | `jdbc:postgresql:molgenis` | JDBC connection string |
| `MOLGENIS_POSTGRES_USER` | `molgenis` | Database user |
| `MOLGENIS_POSTGRES_PASS` | `molgenis` | Database password |
| `MOLGENIS_HTTP_PORT` | `8080` | HTTP port |
| `MOLGENIS_ADMIN_PW` | `admin` | Initial admin password |

Example with custom settings:

```bash
java -DMOLGENIS_POSTGRES_URI=jdbc:postgresql:mydb \
     -DMOLGENIS_HTTP_PORT=9090 \
     -DMOLGENIS_ADMIN_PW=secure-password \
     -jar molgenis-emx2-<version>-all.jar
```

## Kubernetes + Helm

For production cloud deployments:

```bash
helm repo add emx2 https://github.com/molgenis/molgenis-ops-helm/tree/master/charts/molgenis-emx2
helm install emx2 emx2/emx2
```

Update:
```bash
helm repo update
helm upgrade emx2 emx2/emx2
```

## After installation

### First login

1. Open MOLGENIS in your browser
2. Click **Sign in** (top right)
3. Username: `admin`, Password: `admin` (or whatever you set via `MOLGENIS_ADMIN_PW`)
4. **Change the admin password immediately** — click your username → change password

### Explore the demo

MOLGENIS ships with a **Pet Store** demo database. Browse it to see how schemas, tables, and data entry work. Disable it in production with:

```
MOLGENIS_EXCLUDE_PETSTORE_DEMO=true
```

### Create your first database

1. Click the **+** icon to create a new database
2. Choose a name (e.g. `my-catalogue`)
3. Select a template: `DATA_CATALOGUE`, or leave blank for a custom schema
4. Optionally include demo data

### Enable metrics

```bash
java -DMOLGENIS_METRICS_ENABLED=true -jar molgenis-emx2-<version>-all.jar
```

Metrics are exposed at `/api/metrics` in Prometheus format.

### Logging

Control log verbosity with Log4j2:

```bash
java -Dlog4j2.level=DEBUG -jar molgenis-emx2-<version>-all.jar
```
