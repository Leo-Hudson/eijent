# BPS Core – Credits APIs (Postman-style)

API reference for the Eijent web app team.

These are the **credits-related** Core APIs:

- GET Entitlements
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
      "limit": 1000
    }
  ],
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

- `limits` are **max caps**, not used counts.
- Use `modules` / `limits` to decide what UI and create actions are allowed.
- Use `credits` for wallet display; for spend decisions prefer Check / Deduct.



### Common errors


| Status        | Meaning                               |
| ------------- | ------------------------------------- |
| `400`         | Missing `memberId` / `subscriptionId` |
| `401` / `403` | Auth / permission problem             |
| `404`         | Subscription or plan not found        |


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
| `subAccountPulseId` | no       | Alternate sub-account id     |




### Example

```http
POST /api/credits/check
x-api-key: <key>
Content-Type: application/json

{
  "memberId": "abc123",
  "featureKey": "ai.email_draft"
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
  "subAccountPulseId": null
}
```



### Common errors


| Status        | Meaning                                                 |
| ------------- | ------------------------------------------------------- |
| `400`         | `featureKey` missing, or no member/subscription target  |
| `401` / `403` | Auth / permission / sub-account mismatch                |
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
| `subAccountPulseId` | no       | Alternate sub-account id                        |




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

---



## Suggested Postman setup

Collection name idea: **BPS Core – Credits API**


| Request name             | Method | Path                                         |
| ------------------------ | ------ | -------------------------------------------- |
| GET Entitlements         | `GET`  | `/api/entitlements?memberId={{memberId}}`    |
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
  -> POST /api/credits/check  (can they afford it?)
  -> run the feature
  -> POST /api/credits/deduct (with idempotencyKey)
  -> show updated balance
```

For plan / module gates (not credit spend), use **Entitlements**.

---



## Future note (important)

This documentation describes the **current** credits flow on Core.

We know these calls can put meaningful load on the Core server if the web app uses them heavily (especially frequent balance / usage style reads and high-volume deduct traffic).

We are going to research a better long-term approach, including the possibility of a **separate microservice** dedicated to these credit actions. **For now, these Core APIs are the ones to use.**

---



## Related docs

- [Member user story](./member-user-story.md)
- [Member dashboard](./member-dashboard.md)

