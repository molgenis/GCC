---
title: Permissions & Security
description: Roles, permissions, OIDC single sign-on, and security configuration for MOLGENIS.
---

## Roles

MOLGENIS uses schema-level roles to control access. Each user is assigned a role per database.

### Standard roles

| Role | Capabilities |
|------|-------------|
| **manager** | Create/modify/delete tables and columns (schema changes); assign roles to users |
| **editor** | Insert, update, delete data rows; no schema changes |
| **viewer** | View data only |

### Aggregation roles

For restricted access where individual records shouldn't be visible:

| Role | Capabilities |
|------|-------------|
| **aggregator** | Count rows (suppressed if <10); view ontology data |
| **count** | Count rows; view ontology data |
| **range** | Count rows in steps of 10 (10, 20, 30...); view ontology data |
| **exists** | Check if data exists given filters; view ontology data |

### Special users

| User | Description |
|------|-------------|
| **admin** | Full access to everything server-wide. Cannot be removed. |
| **anonymous** | Any unauthenticated user. Can be granted `viewer` role for public databases. |
| **user** | Any authenticated user (before schema-specific role assignment). |

### Admin delegation

The root admin can grant admin rights to other users. Admin users can manage all schemas, users, and permissions — but cannot change the root admin's password or revoke root admin access.

## Managing members

1. Navigate to your database
2. Go to **Members**
3. Add a user by email and assign their role
4. Users receive access on their next login

## OIDC (Single Sign-On)

Connect MOLGENIS to your institutional identity provider using OpenID Connect.

### Configuration

Set these environment variables on the MOLGENIS server:

| Variable | Description |
|----------|-------------|
| `MOLGENIS_OIDC_CLIENT_ID` | Client ID from your auth provider |
| `MOLGENIS_OIDC_CLIENT_SECRET` | Client secret |
| `MOLGENIS_OIDC_DISCOVERY_URI` | Provider's discovery endpoint (e.g. `https://keycloak.example.org/realms/myrealm/.well-known/openid-configuration`) |
| `MOLGENIS_OIDC_CALLBACK_URL` | Your MOLGENIS server URL for login callback (e.g. `https://molgenis.example.org/_callback`) |
| `MOLGENIS_OIDC_CLIENT_NAME` | Display name for the login button (default: `MolgenisAuth`) |

### How it works

- The auth provider must return a valid `email` claim
- If the email matches an existing MOLGENIS user → logs in as that user
- If the email is new → creates a new user account
- Admin can still access the admin interface at `/apps/central/#/admin`

### Example: Keycloak setup

1. Create a realm in Keycloak
2. Enable email as username in the realm's login settings
3. Create a client with Access Type = `confidential`
4. Copy the client secret from the Credentials tab
5. Set the environment variables:

```bash
MOLGENIS_OIDC_CLIENT_ID="my-molgenis"
MOLGENIS_OIDC_CLIENT_SECRET="copy-from-keycloak"
MOLGENIS_OIDC_DISCOVERY_URI="https://keycloak.example.org/realms/myrealm/.well-known/openid-configuration"
MOLGENIS_OIDC_CALLBACK_URL="https://molgenis.example.org"
```

### Disabling OIDC

Remove the `MOLGENIS_OIDC_CLIENT_ID` environment variable and restart MOLGENIS.
