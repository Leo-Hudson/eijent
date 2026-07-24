# BPS Core – Credits APIs (Postman-style)

API reference for the Eijent web app team.

These are the **credits-related** Core APIs:

- GET Entitlements
- POST Sync Usage / Limit Check (`/api/entitlements/usage`)
- GET Feature Credit Costs
- GET Credit Balance
- POST Check Credits
- POST Deduct Credits

Use these from the Eijent web app (server side) with the Core **API key we will provide**.

---

## Base URL and auth


| Item     | Value                                                      |
| -------- | ---------------------------------------------------------- |
| Base URL | Your Core environment URL (example: `https://<core-host>`) |
| Auth     | API key provided                                           |


Send the key on every request as one of:

- `x-api-key: <your-key>`
- or `Authorization: Bearer <your-key>` / `Authorization: ApiKey <your-key>`

We configure the key’s access on our side. You do not need to manage permissions.

### Targeting a member / subscription

For endpoints that need a target, send **one** of:

- `memberId` (often easiest for the web app), or
- `subscriptionId`

---



## 1. GET Entitlements

What modules and limits the member’s plan includes, plus a credit wallet snapshot.


|                |                     |
| -------------- | ------------------- |
| **Method**     | `GET`               |
| **Path**       | `/api/entitlements` |
| **Auth**       | API key             |
| **Permission** | Subscriptions read  |




### Query params


| Param            | Required | Notes           |
| ---------------- | -------- | --------------- |
| `memberId`       | one of   | Member id       |
| `subscriptionId` | one of   | Subscription id |




### Example

```http
GET /api/entitlements?memberId=abc123
x-api-key: <key>
```



### Success `200` (shape)

```json
{
  "subscriptionId": "...",
  "status": "active",
  "servicePlan": { "id": "...", "key": "...", "name": "..." },
  "pricingPlan": { "id": "...", "name": "..." },
  "modules": ["Contacts", "Tasks"],
  "limits": [
    {
      "field": "maxContacts",
      "label": "Max Contacts",
      "module": "Contacts",
      "moduleEnabled": true,
      "unlimited": false,
      "limit": 1000,
      "used": 120,
      "remaining": 880,
      "status": "normal"
    }
  ],
  "usageCountsUpdatedAt": "2026-07-24T12:00:00.000Z",
  "credits": {
    "balance": 80,
    "allocation": 100,
    "resetCycle": "monthly",
    "customDays": null,
    "nextResetAt": "2026-08-01T00:00:00.000Z"
  }
}
```



### Notes for the web app

- Each limit row includes **max** (`limit`) and **used** when the product has synced usage.
- `used` is `null` until the product sends counts (see Sync Usage below).
- `status` is one of: `normal`, `warning` (≥80%), `reached`, `exceeded`, `unlimited`.
- Use `modules` / `limits` to decide what UI and create actions are allowed.
- Use `credits` for wallet display; for spend decisions prefer Check / Deduct.



### Common errors


| Status        | Meaning                               |
| ------------- | ------------------------------------- |
| `400`         | Missing `memberId` / `subscriptionId` |
| `401` / `403` | Auth / permission problem             |
| `404`         | Subscription or plan not found        |


---



## 1b. POST Sync Usage / Limit Check

Sync current entity counts onto the subscription, and optionally ask whether creating more is allowed.


|                |                             |
| -------------- | --------------------------- |
| **Method**     | `POST`                      |
| **Path**       | `/api/entitlements/usage`   |
| **Auth**       | API key                     |
| **Permission** | Subscriptions **update**    |
| **Body**       | JSON                        |




### Body fields


| Field            | Required | Notes |
| ---------------- | -------- | ----- |
| `memberId`       | one of   | |
| `subscriptionId` | one of   | |
| `usage`          | no       | Object of known limit keys → current counts, e.g. `{ "maxWorkspaces": 5 }` |
| `limitCheck`     | no       | `{ "field": "maxWorkspaces", "increment": 1 }` before create |



Keys in `usage` must match service-plan limit fields (`maxWorkspaces`, `maxContacts`, `maxTeamMembers`, …). Unknown keys are ignored.



### Example

```http
POST /api/entitlements/usage
x-api-key: <key>
Content-Type: application/json

{
  "memberId": "abc123",
  "usage": { "maxWorkspaces": 5, "maxTeamMembers": 3 },
  "limitCheck": { "field": "maxWorkspaces", "increment": 1 }
}
```



### Success `200`

Returns `synced`, `usageCounts`, and full `limits` (same shape as entitlements).



### Common errors


| Status        | Meaning |
| ------------- | ------- |
| `403` + `limit_exceeded` | Create would exceed plan max (`details`: field, used, limit, increment) |
| `403` + `module_disabled` | That module is not on the plan |
| `400` | Unknown `limitCheck.field` or missing target |


---



## 2. GET Feature Credit Costs

Catalog of how many credits each feature costs.


|                |                         |
| -------------- | ----------------------- |
| **Method**     | `GET`                   |
| **Path**       | `/api/credits/features` |
| **Auth**       | API key                 |
| **Permission** | Subscriptions read      |




### Query params


| Param | Required | Notes                     |
| ----- | -------- | ------------------------- |
| `key` | no       | Filter to one feature key |




### Example

```http
GET /api/credits/features
x-api-key: <key>
```



### Success `200` (shape)

```json
{
  "features": [
    {
      "key": "ai.email_draft",
      "module": "Communications",
      "feature": "Email draft",
      "description": null,
      "creditPoints": 5
    }
  ]
}
```



### Common errors


| Status        | Meaning                   |
| ------------- | ------------------------- |
| `401` / `403` | Auth / permission problem |


---



## 3. GET Credit Balance

Current credit wallet for one subscription / member.


|                |                        |
| -------------- | ---------------------- |
| **Method**     | `GET`                  |
| **Path**       | `/api/credits/balance` |
| **Auth**       | API key                |
| **Permission** | Subscriptions read     |




### Query params


| Param            | Required | Notes |
| ---------------- | -------- | ----- |
| `memberId`       | one of   |       |
| `subscriptionId` | one of   |       |




### Example

```http
GET /api/credits/balance?memberId=abc123
x-api-key: <key>
```



### Success `200` (shape)

```json
{
  "subscriptionId": "...",
  "balance": 80,
  "allocation": 100,
  "resetCycle": "monthly",
  "customDays": null,
  "lastResetAt": null,
  "nextResetAt": "2026-08-01T00:00:00.000Z"
}
```



### Common errors


| Status        | Meaning                   |
| ------------- | ------------------------- |
| `400`         | Missing target id         |
| `401` / `403` | Auth / permission problem |
| `404`         | Subscription not found    |


---



## 4. POST Check Credits

Ask: “Can this member afford this feature right now?”  
Does **not** spend credits.


|                |                      |
| -------------- | -------------------- |
| **Method**     | `POST`               |
| **Path**       | `/api/credits/check` |
| **Auth**       | API key              |
| **Permission** | Subscriptions read   |
| **Body**       | JSON                 |




### Body fields


| Field               | Required | Notes                        |
| ------------------- | -------- | ---------------------------- |
| `featureKey`        | yes      | Feature key from the catalog |
| `memberId`          | one of   |                              |
| `subscriptionId`    | one of   |                              |
| `subAccountId`      | no       | If a sub-account is acting   |
| `subAccountPulseId` | no       | Alternate sub-account id (not `pulse_memberId`) |
| `usage`             | no       | Sync entity counts (`maxWorkspaces`, …) |
| `limitCheck`        | no       | `{ "field": "maxWorkspaces", "increment": 1 }` before create |




### Example

```http
POST /api/credits/check
x-api-key: <key>
Content-Type: application/json

{
  "memberId": "abc123",
  "featureKey": "ai.email_draft",
  "usage": { "maxWorkspaces": 5 },
  "limitCheck": { "field": "maxWorkspaces", "increment": 1 }
}
```



### Success `200` (shape)

```json
{
  "subscriptionId": "...",
  "featureKey": "ai.email_draft",
  "cost": 5,
  "balance": 80,
  "affordable": true,
  "free": false,
  "subAccountId": null,
  "subAccountPulseId": null,
  "limits": [],
  "usageCountsUpdatedAt": "2026-07-24T12:00:00.000Z"
}
```



### Common errors


| Status        | Meaning                                                 |
| ------------- | ------------------------------------------------------- |
| `400`         | `featureKey` missing, or no member/subscription target  |
| `401` / `403` | Auth / permission / sub-account mismatch / `limit_exceeded` |
| `404`         | Unknown feature or subscription / sub-account not found |


---



## 5. POST Deduct Credits

Spend credits for a feature action.  
This is the write call the web app should use after (or as part of) a billable action.


|                |                          |
| -------------- | ------------------------ |
| **Method**     | `POST`                   |
| **Path**       | `/api/credits/deduct`    |
| **Auth**       | API key                  |
| **Permission** | Subscriptions **update** |
| **Body**       | JSON                     |




### Body fields


| Field               | Required | Notes                                           |
| ------------------- | -------- | ----------------------------------------------- |
| `featureKey`        | yes      | Feature key                                     |
| `idempotencyKey`    | yes      | Unique key for this logical action (retry-safe) |
| `memberId`          | one of   |                                                 |
| `subscriptionId`    | one of   |                                                 |
| `subAccountId`      | no       | Who spent (still from owner wallet)             |
| `subAccountPulseId` | no       | Alternate sub-account id (not `pulse_memberId`) |
| `usage`             | no       | Sync entity counts only (does **not** enforce plan caps) |




### Example

```http
POST /api/credits/deduct
x-api-key: <key>
Content-Type: application/json

{
  "memberId": "abc123",
  "featureKey": "ai.email_draft",
  "idempotencyKey": "email-draft-2026-07-23-req-001"
}
```



### Success `200` (new spend)

```json
{
  "success": true,
  "subscriptionId": "...",
  "featureKey": "ai.email_draft",
  "deducted": 5,
  "balance": 75,
  "subAccountId": null,
  "subAccountPulseId": null
}
```



### Success notes

- Same `idempotencyKey` retried for the same subscription / actor returns the original result (`idempotent: true`) instead of charging twice.
- Free features (`creditPoints` 0) succeed with `deducted: 0` and may not write a ledger row.



### Common errors


| Status        | Meaning                                                 |
| ------------- | ------------------------------------------------------- |
| `400`         | Missing `featureKey` or `idempotencyKey`                |
| `402`         | Insufficient credits                                    |
| `401` / `403` | Auth / permission / sub-account mismatch                |
| `404`         | Unknown feature or subscription / sub-account not found |




### Web app guidance

1. Prefer **Check** before expensive work if you want a friendly “not enough credits” UX first.
2. Always send a stable **idempotencyKey** per user action (so retries do not double-charge).
3. Then call **Deduct** when the billable action is committed.
4. Before creating workspaces / contacts / seats, call **POST /api/entitlements/usage** (or Check) with `usage` + `limitCheck`.
5. Include current `usage` on Check / Deduct so the member dashboard can show used / max.

---



## Suggested Postman setup

Collection name idea: **BPS Core – Credits API**


| Request name             | Method | Path                                         |
| ------------------------ | ------ | -------------------------------------------- |
| GET Entitlements         | `GET`  | `/api/entitlements?memberId={{memberId}}`    |
| POST Sync Usage          | `POST` | `/api/entitlements/usage`                    |
| GET Feature Credit Costs | `GET`  | `/api/credits/features`                      |
| GET Credit Balance       | `GET`  | `/api/credits/balance?memberId={{memberId}}` |
| POST Check Credits       | `POST` | `/api/credits/check`                         |
| POST Deduct Credits      | `POST` | `/api/credits/deduct`                        |


Collection variables:

- `baseUrl`
- `apiKey`
- `memberId`
- `featureKey`
- `idempotencyKey`

---



## Typical web app flow

```text
User triggers a billable feature
  -> GET /api/entitlements (optional, for module / limit UI)
  -> POST /api/credits/check  (can they afford it? optional usage + limitCheck)
  -> run the feature
  -> POST /api/credits/deduct (with idempotencyKey, optional usage sync)
  -> show updated balance

User creates a capped entity (workspace, contact, …)
  -> POST /api/entitlements/usage with usage + limitCheck
  -> if allowed, create in product
  -> optionally sync updated usage again
```

For plan / module gates (not credit spend), use **Entitlements** / **Sync Usage**.

---



## Future note (important)

This documentation describes the **current** credits flow on Core.

We know these calls can put meaningful load on the Core server if the web app uses them heavily (especially frequent balance / usage style reads and high-volume deduct traffic).

We are going to research a better long-term approach, including the possibility of a **separate microservice** dedicated to these credit actions. **For now, these Core APIs are the ones to use.**

---



## Related docs

- [Member user story](./member-user-story.md)
- [Member dashboard](./member-dashboard.md)

