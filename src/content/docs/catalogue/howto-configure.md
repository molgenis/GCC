---
title: Configuring Your Catalogue
description: Full reference for catalogue settings — branding, landing page, analytics, and theming.
---

All catalogue settings are managed in the **Settings** panel of your database. Navigate to your database → click the gear icon or go to `/{schema}/settings/`.

## Branding

| Setting | Description | Default |
|---------|-------------|---------|
| `CATALOGUE_LOGO_SRC` | URL to your logo image | MOLGENIS logo |
| `CATALOGUE_BANNER_HTML` | HTML displayed as a banner at the top of every page | _(none)_ |

## Landing page content

| Setting | Description | Default |
|---------|-------------|---------|
| `CATALOGUE_LANDING_TITLE` | Main heading | "Browse all catalogue contents" |
| `CATALOGUE_LANDING_DESCRIPTION` | Subtitle text | "Select one of the content categories listed below." |
| `CATALOGUE_LANDING_COHORTS_CTA` | Label for cohorts button | "Cohorts" |
| `CATALOGUE_LANDING_NETWORKS_CTA` | Label for networks button | "Networks" |
| `CATALOGUE_LANDING_VARIABLES_CTA` | Label for variables button | "Variables" |
| `CATALOGUE_LANDING_COHORTS_TEXT` | Description below cohorts button | "A complete overview of all cohorts and biobanks." |
| `CATALOGUE_LANDING_NETWORKS_TEXT` | Description below networks button | "Collaborations of multiple institutions..." |
| `CATALOGUE_LANDING_VARIABLES_TEXT` | Description below variables button | "A complete overview of available variables." |

## Information cards

| Setting | Description |
|---------|-------------|
| `CATALOGUE_LANDING_PARTICIPANTS_LABEL` | Label for participants count card |
| `CATALOGUE_LANDING_PARTICIPANTS_TEXT` | Description for participants card |
| `CATALOGUE_LANDING_SAMPLES_LABEL` | Label for samples count card |
| `CATALOGUE_LANDING_SAMPLES_TEXT` | Description for samples card |
| `CATALOGUE_LANDING_DESIGN_LABEL` | Label for study design card |
| `CATALOGUE_LANDING_DESIGN_TEXT` | Description for design card |
| `CATALOGUE_LANDING_SUBCOHORTS_LABEL` | Label for subcohorts card |
| `CATALOGUE_LANDING_SUBCOHORTS_TEXT` | Description for subcohorts card |

## Additional HTML

| Setting | Description |
|---------|-------------|
| `CATALOGUE_ALL_ADDITIONAL_HTML` | Custom HTML injected into the "all" / default page |

## Theming

Themes control colours, fonts, and visual style. Set themes at different levels:

1. **Deploy time** — set `NUXT_PUBLIC_EMX2_THEME` environment variable in your Docker Compose or systemd config
2. **Runtime** — create or update the `CATALOGUE_THEME` setting in the database
3. **Debug** — add `?theme=my-theme` to any catalogue URL to preview a theme

To create a custom theme, place a `[theme-name].ico` favicon in the `public/img` folder of your deployment.

## Analytics

| Setting | Description |
|---------|-------------|
| `NUXT_PUBLIC_ANALYTICS_KEY` | Measurement ID for your analytics provider |
| `NUXT_PUBLIC_ANALYTICS_PROVIDER` | `google-analytics` or `site-improve` |
| `NUXT_PUBLIC_ANALYTICS_DOMAIN` | Optional domain restriction |

Set these as environment variables on the MOLGENIS container.

## Server-level settings

These affect all databases on the server:

| Setting | Description | Default |
|---------|-------------|---------|
| `MOLGENIS_INCLUDE_CATALOGUE_DEMO` | Include demo data on startup | `false` |
| `LANDING_PAGE` | Redirect root URL to a specific app | `/apps/central` |
| `MOLGENIS_EXCLUDE_PETSTORE_DEMO` | Disable the pet store demo database | `false` |
