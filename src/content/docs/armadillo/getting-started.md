---
title: "Getting Started: Armadillo"
description: Deploy a MOLGENIS Armadillo server for federated analysis with DataSHIELD.
---

This guide walks you through deploying an Armadillo server, loading data, and running your first federated analysis.

## Prerequisites

- Docker and Docker Compose
- R (4.1+) with the `DSMolgenisArmadillo` and `dsBaseClient` packages
- Cohort data in a tabular format (CSV, SPSS, or similar)

## 1. Deploy Armadillo with Docker

Clone the Armadillo repository and start the services:

```bash
git clone https://github.com/molgenis/molgenis-service-armadillo
cd molgenis-service-armadillo
docker compose up -d
```

Armadillo will be available at [http://localhost:8080](http://localhost:8080).

The default deployment includes:
- **Armadillo server** (Spring Boot application)
- **MinIO** — S3-compatible object storage for Parquet files
- **R environment** — with DataSHIELD packages pre-installed

## 2. Sign in

Open the Armadillo web UI and sign in. The default setup uses basic authentication — configure OIDC for production (see the Armadillo documentation for details).

## 3. Upload data

Cohort data managers upload data using the R client:

```r
library(MolgenisArmadillo)

# Connect to Armadillo
armadillo.login("http://localhost:8080")

# Load your data
my_data <- read.csv("cohort_data.csv")

# Upload to a project/folder
armadillo.upload_table(
  project = "my-project",
  folder = "core",
  table = "nonrep",  # non-repeated measures
  my_data
)
```

Data is stored as Parquet files in MinIO, organised by project and folder.

## 4. Set permissions

In the Armadillo web UI, navigate to the **Permissions** section:

1. Add the researcher's email address
2. Assign them to the relevant project
3. They will only be able to analyse data in projects they have access to

## 5. Run a DataSHIELD analysis

From the researcher's R session:

```r
library(DSMolgenisArmadillo)
library(dsBaseClient)

# Build a login dataframe
builder <- DSI::newDSLoginBuilder()
builder$append(
  server = "armadillo",
  url = "http://localhost:8080",
  driver = "ArmadilloDriver",
  profile = "default"
)
login_data <- builder$build()

# Connect
connections <- DSI::datashield.login(logins = login_data)

# Assign data to the server-side R session
DSI::datashield.assign.table(
  conns = connections,
  symbol = "D",
  table = "my-project/core/nonrep"
)

# Run analysis — e.g. summary statistics
dsBaseClient::ds.summary(x = "D$age")
dsBaseClient::ds.mean(x = "D$bmi")

# Run a linear model
dsBaseClient::ds.glm(
  formula = "bmi ~ age + sex",
  data = "D",
  family = "gaussian"
)

# Disconnect
DSI::datashield.logout(connections)
```

All computations happen on the Armadillo server. Only aggregate results (means, coefficients, standard errors) are returned to the researcher.

## 6. Multi-server federated analysis

The real power of DataSHIELD is analysing across multiple servers simultaneously:

```r
builder <- DSI::newDSLoginBuilder()
builder$append(server = "nl", url = "https://armadillo-nl.example.org",
               driver = "ArmadilloDriver")
builder$append(server = "de", url = "https://armadillo-de.example.org",
               driver = "ArmadilloDriver")
builder$append(server = "uk", url = "https://armadillo-uk.example.org",
               driver = "ArmadilloDriver")
login_data <- builder$build()

connections <- DSI::datashield.login(logins = login_data)

# Assign the same table structure from each server
DSI::datashield.assign.table(connections, "D", "project/core/nonrep")

# Federated mean — combines results from all three servers
dsBaseClient::ds.mean(x = "D$bmi")

# Federated regression
dsBaseClient::ds.glm(formula = "bmi ~ age + sex", data = "D", family = "gaussian")

DSI::datashield.logout(connections)
```

## Next steps

- [Scenarios](/GCC/xK7mQ3docs/armadillo/scenarios/) — complete walkthrough: federated BMI analysis across three cohorts
- [Armadillo documentation](https://molgenis.github.io/molgenis-service-armadillo) — full server administration guide
- [DataSHIELD wiki](https://www.datashield.org/) — available analysis functions and tutorials
