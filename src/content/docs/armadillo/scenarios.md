---
title: "Scenario: Federated BMI Analysis Across Three Cohorts"
description: End-to-end walkthrough of deploying Armadillo servers, loading harmonised data, and running a federated regression analysis.
---

This scenario walks through a complete federated analysis project: three cohorts want to jointly analyse the relationship between BMI, age, sex, and physical activity — without sharing individual-level data.

## The brief

The **ActiveLife** consortium includes three cohorts:

| Cohort | Country | N | Data |
|--------|---------|---|------|
| FitNL | Netherlands | 5,200 | BMI, age, sex, physical activity, smoking |
| GesundDE | Germany | 3,800 | BMI, age, sex, physical activity, diet score |
| WellUK | United Kingdom | 7,100 | BMI, age, sex, physical activity, smoking, SES |

Research question: *Is higher physical activity associated with lower BMI, adjusting for age and sex, across all three cohorts?*

## Phase 1: Deploy Armadillo at each site

Each cohort deploys their own Armadillo instance. The recommended production setup:

```yaml
# docker-compose.yml (at each cohort site)
services:
  armadillo:
    image: molgenis/molgenis-armadillo:latest
    ports:
      - "8080:8080"
    environment:
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_OPAQUETOKEN_INTROSPECTION_URI: https://auth.activelife.eu/introspect
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_OPAQUETOKEN_CLIENT_ID: armadillo
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_OPAQUETOKEN_CLIENT_SECRET: ${CLIENT_SECRET}
    volumes:
      - armadillo_data:/data
    depends_on:
      - minio

  minio:
    image: minio/minio
    command: server /data
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASS}

volumes:
  armadillo_data:
  minio_data:
```

Each cohort starts their stack:
```bash
docker compose up -d
```

## Phase 2: Harmonise and upload data

Each cohort data manager maps their local variables to the agreed common data model and uploads using R:

```r
library(MolgenisArmadillo)

# Connect to local Armadillo
armadillo.login("http://localhost:8080")

# Load and harmonise local data
raw <- read.csv("fitnl_data.csv")
harmonised <- data.frame(
  id = raw$participant_id,
  age = raw$leeftijd,              # Dutch → English
  sex = ifelse(raw$geslacht == "M", 1, 2),  # recode
  bmi = raw$bmi,
  physical_activity = raw$sport_uren_week  # hours/week
)

# Upload to the activelife project
armadillo.upload_table(
  project = "activelife",
  folder = "harmonised",
  table = "baseline",
  harmonised
)
```

Each cohort uploads the same table structure (`activelife/harmonised/baseline`) with the same column names, enabling federated analysis.

## Phase 3: Configure permissions

Each cohort's data manager grants the lead researcher access:

1. Open the Armadillo web UI
2. Go to **Permissions**
3. Add researcher's email → assign to `activelife` project
4. The researcher can now run DataSHIELD analyses against this cohort's data

## Phase 4: Run the federated analysis

The lead researcher connects to all three servers from their R session:

```r
library(DSMolgenisArmadillo)
library(dsBaseClient)

# Connect to all three Armadillo servers
builder <- DSI::newDSLoginBuilder()
builder$append(server = "fitnl",
               url = "https://armadillo.fitnl.nl",
               driver = "ArmadilloDriver")
builder$append(server = "gesundde",
               url = "https://armadillo.gesundde.de",
               driver = "ArmadilloDriver")
builder$append(server = "welluk",
               url = "https://armadillo.welluk.ac.uk",
               driver = "ArmadilloDriver")
login_data <- builder$build()

conns <- DSI::datashield.login(logins = login_data)
```

### Assign data

```r
DSI::datashield.assign.table(
  conns = conns,
  symbol = "D",
  table = "activelife/harmonised/baseline"
)
```

### Explore the data (aggregates only)

```r
# Check dimensions at each server
dsBaseClient::ds.dim(x = "D")
# → fitnl: 5200 x 5
# → gesundde: 3800 x 5
# → welluk: 7100 x 5

# Summary statistics
dsBaseClient::ds.summary(x = "D$bmi")
dsBaseClient::ds.summary(x = "D$physical_activity")

# Federated means
dsBaseClient::ds.mean(x = "D$bmi")
# → pooled mean BMI across all 16,100 participants

dsBaseClient::ds.mean(x = "D$physical_activity")
```

### Run the regression

```r
# Federated linear regression: BMI ~ physical_activity + age + sex
model <- dsBaseClient::ds.glm(
  formula = "bmi ~ physical_activity + age + sex",
  data = "D",
  family = "gaussian"
)

# View results
summary(model)
# Coefficients show the pooled effect of physical activity on BMI
# adjusted for age and sex, estimated across all three cohorts
# without any individual data leaving the servers
```

### Disconnect

```r
DSI::datashield.logout(conns)
```

## Phase 5: Quality control

Before publishing results, validate the analysis:

1. **Check N per server** — ensure no cell counts below disclosure threshold (default: 5)
2. **Compare per-cohort estimates** — run the model per server to check for heterogeneity
3. **Sensitivity analysis** — exclude one cohort at a time to check robustness

DataSHIELD's built-in disclosure controls prevent:
- Returning results based on fewer than N observations
- Subsetting data to identify individuals
- Extracting individual-level values via iterative queries

## Variations

- **Adding more cohorts** — simply deploy Armadillo, upload harmonised data, grant permissions, and add the server to the login builder
- **Longitudinal analysis** — upload repeated-measures data to a separate table and use `dsBaseClient::ds.glmSLMA()` for study-level meta-analysis
- **Survival analysis** — use the `dsSurvivalClient` package for Cox proportional hazards models
- **Linking to the catalogue** — register the ActiveLife project in a MOLGENIS Catalogue so researchers can discover the available variables before requesting access

## Next steps

- [Data Catalogue](/GCC/xK7mQ3docs/catalogue/) — make your cohort data discoverable
- [Armadillo documentation](https://molgenis.github.io/molgenis-service-armadillo) — advanced server configuration
- [DataSHIELD packages](https://www.datashield.org/) — explore available analysis functions
