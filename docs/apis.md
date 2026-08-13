# BPS Core – Credits, coupons, and entitlements APIs

API reference for the Eijent web app / product app team.

Canonical Core copy (kept in sync): `bps-core/docs/api/credits-coupons-entitlements.md`.

Architecture (Product vs Pricing Plan vs Service Plan): `bps-core/docs/architecture/plans-credits-coupons.md`.

---

## What’s covered

| Area | Endpoints |
| ---- | --------- |
| Entitlements | `GET /api/entitlements`, `POST /api/entitlements/usage` |
| Credits wallet | `GET /api/credits/balance`, `GET /api/credits/features` |
| Spend | `POST /api/credits/check`, `POST /api/credits/deduct` |
| History | `GET /api/credits/ledger`, `GET /api/credits/usage` |
| Top-ups | `POST /api/credits/packages/purchase` |
| Coupons | `POST /api/coupons/validate`, `POST /api/coupons/redeem` |
| Resets (ops) | `POST /api/credits/reset`, `POST /api/credits/reset/force` |

Call these from the **server** with the Core API key we provide.

---

## Base URL and auth

| Item | Value |
| ---- | ----- |
| Base URL | Core environment URL |
| Auth | API key |

Send on every request:

- `x-api-key: <your-key>`
- or `Authorization: Bearer <your-key>` / `Authorization: ApiKey <your-key>`

### Targeting a member / subscription

Send **one** of:

- `memberId` (often easiest), or
- `subscriptionId`

### Rate limits (credits / entitlements)

Core applies in-process limits on credits and entitlements routes:

| Scope | Limit |
| ----- | ----- |
| Per API key (or admin user) | 12000 requests / 60s (all credits + entitlements routes) |
| Per subscription (writes only) | 600 requests / 60s (`deduct`, `grant`, package `purchase`) |

Dashboard reads (balance, usage, ledger, entitlements, check) only count against the API key / user bucket, not a per-subscription read cap.

When exceeded, Core returns **429** with:

- JSON `code: "rate_limited"`
- Header `Retry-After` (seconds)

Back off and retry after that delay. Do not tight-loop retries.

---

## 1. GET Entitlements

What modules and limits the plan includes (including Pricing Plan overrides), usage when synced, and credit wallet.


| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/entitlements` |
| **Permission** | Subscriptions read |


### Query params

| Param | Required | Notes |
| ----- | -------- | ----- |
| `memberId` | one of | |
| `subscriptionId` | one of | |

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
      "field": "maxWorkspaces",
      "label": "Max Workspaces",
      "module": "Workspaces",
      "moduleEnabled": true,
      "unlimited": false,
      "limit": 8,
      "used": 5,
      "remaining": 3,
      "status": "normal",
      "allowExtras": true
    }
  ],
  "usageCountsUpdatedAt": "2026-07-24T12:00:00.000Z",
  "credits": {
    "balance": 80,
    "allocation": 100,
    "resetCycle": "monthly",
    "customDays": null,
    "lastResetAt": null,
    "nextResetAt": "2026-08-01T00:00:00.000Z",
    "unusedCreditsPolicy": "expire",
    "lowCreditAlertThreshold": 20,
    "isLowOnCredits": false
  }
}
```

### Notes

- `used` is `null` until the product syncs counts.
- Limit `status`: `normal`, `warning` (≥80%), `reached`, `exceeded`, `unlimited`.
- `isLowOnCredits` is true when threshold &gt; 0 and balance **&lt;** threshold (landing dashboard banner).
- Use `modules` / `limits` for UI gates; use Check / Deduct for spend.

### Common errors

| Status | Meaning |
| ------ | ------- |
| `400` | Missing target |
| `401` / `403` | Auth / permission |
| `404` | Subscription or plan not found |

---

## 1b. POST Sync Usage / Limit Check

Sync entity counts; optionally ask if creating more is allowed (no credit spend).


| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/entitlements/usage` |
| **Permission** | Subscriptions **update** |


### Body

| Field | Required | Notes |
| ----- | -------- | ----- |
| `memberId` / `subscriptionId` | one of | |
| `usage` | no | `{ "maxWorkspaces": 5, ... }` |
| `limitCheck` | no | `{ "field": "maxWorkspaces", "increment": 1 }` |

Unknown usage keys are ignored.

### Success `200`

`synced`, `usageCounts`, `limits`, and `limitCheck` when requested. `limitCheck` may include:

- `allowed` / `blocked`
- `overageUnits`, `overageCost`, `allowExtras`

### Common errors

| Status | Meaning |
| ------ | ------- |
| `403` + `limit_exceeded` | Over max and Allow extras is **off** |
| `403` + `module_disabled` | Module not on plan |
| `400` | Bad field / missing target |

---

## 2. GET Feature Credit Costs

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/credits/features` |
| **Permission** | Subscriptions read |

Optional query: `key` to filter one feature.

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

---

## 3. GET Credit Balance

Same wallet fields as `credits` on entitlements (including unused-credits policy and low-credit alert).

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/credits/balance` |
| **Permission** | Subscriptions read |

Query: `memberId` | `subscriptionId`.

---

## 4. POST Check Credits

“Can they afford this?” Does **not** spend.


| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/credits/check` |
| **Permission** | Subscriptions read |


### Body

| Field | Required | Notes |
| ----- | -------- | ----- |
| `featureKey` | yes | From catalog |
| `memberId` / `subscriptionId` | one of | |
| `subAccountId` / `subAccountPulseId` | no | Attribution only |
| `usage` | no | Sync counts |
| `limitCheck` | no | Pre-create check |

### Success `200`

```json
{
  "subscriptionId": "...",
  "featureKey": "ai.email_draft",
  "cost": 5,
  "overageCost": 0,
  "totalCost": 5,
  "balance": 80,
  "affordable": true,
  "free": false,
  "subAccountId": null,
  "subAccountPulseId": null,
  "limits": [],
  "usageCountsUpdatedAt": "2026-07-24T12:00:00.000Z"
}
```

---

## 5. POST Deduct Credits

Spend for a feature **or** entity overage.


| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/credits/deduct` |
| **Permission** | Subscriptions **update** |


### Body (choose one mode)

**Feature spend**

| Field | Required | Notes |
| ----- | -------- | ----- |
| `featureKey` | yes* | |
| `idempotencyKey` | yes | Retry-safe |
| `memberId` / `subscriptionId` | one of | |
| `subAccountId` / `subAccountPulseId` | no | Who spent (owner wallet) |
| `usage` | no | Sync only (does not enforce caps) |
| `workspace` or `workspaceId` + `workspaceName` | no | Stored on ledger for product attribution |

**Entity overage**

| Field | Required | Notes |
| ----- | -------- | ----- |
| `overage` | yes* | `{ "field": "maxWorkspaces", "units": 1 }` |
| `idempotencyKey` | yes | |
| target + optional workspace / sub-account / usage | | |

\* Provide **either** `featureKey` **or** `overage`, not both.

`overage.units` is the **create count**, not the credit charge. Core derives cost from current usage + Pricing Plan `additionalEntityCosts`. Rejects `units: 0`.

### Success `200`

```json
{
  "success": true,
  "subscriptionId": "...",
  "featureKey": "ai.email_draft",
  "deducted": 5,
  "balance": 75,
  "subAccountId": null,
  "workspaceId": "ws_123",
  "workspaceName": "Acme HQ"
}
```

- Same idempotency key for the same subscription + actor returns `idempotent: true`.
- Free features: `deducted: 0`, may skip ledger row.

### Common errors

| Status | Meaning |
| ------ | ------- |
| `400` | Missing key / invalid overage / both modes |
| `402` | `insufficient_credits` |
| `401` / `403` | Auth / permission / sub-account mismatch |
| `404` | Unknown feature / subscription / sub-account |

### Web app guidance

1. Prefer **Check** before expensive work for UX.
2. Always send a stable **idempotencyKey** per user action.
3. **Deduct** when the billable action commits.
4. Before creating capped entities: **usage** + **limitCheck**.
5. If over free cap and Allow extras is on: deduct with `overage` after create (or as your product flow requires).
6. Pass **workspace** when the spend belongs to a workspace so the member ledger can filter it.

---

## 6. GET Credit Ledger

Full history for the landing **credit ledger** page (filters, KPIs, CSV).


| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/credits/ledger` |
| **Permission** | Subscriptions read |


### Useful query params

| Param | Notes |
| ----- | ----- |
| `memberId` / `subscriptionId` | Target |
| `from` / `to` | Date range |
| `type` | `deduct` \| `reset` \| `grant` |
| `featureKey` | Filter |
| `workspaceId` | Workspace attribution |
| `subAccountId` / `ownerOnly` | Actor filter |
| `direction` | `credit` \| `debit` |
| `q` | Text |
| `page` / `limit` | Pagination (limit max 100) |

### Success `200`

`docs[]` (rows with display fields), `summary` (totals for KPI cards), `currentBalance`, pagination, `featureOptions`.

If `summary` is missing (older Core build), the landing UI may aggregate from `docs` as a fallback.

---

## 7. GET Credits Usage (by user)

Rollup of deductions for owner vs sub-accounts (dashboard “by user”).

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/credits/usage` |
| **Permission** | Subscriptions read |

Query: target, optional `from` / `to`.

---

## 8. POST Credit Package Purchase

Top-up the **owner** wallet. Sub-accounts can spend credits but do not purchase packs as the buyer.


| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/credits/packages/purchase` |
| **Permission** | Subscriptions **update** |


### Body

| Field | Required | Notes |
| ----- | -------- | ----- |
| `creditPackageId` | yes | Must be on the Pricing Plan |
| `idempotencyKey` | yes | |
| `memberId` / `subscriptionId` | one of | |
| `couponCode` | no | Pack-eligible coupons only |
| `paymentRef` | no | External payment reference |
| `notes` | no | |

### Success `200`

`granted`, `balance`, `listPrice`, `discountAmount`, `pricePaid`, `couponCode`, `redemptionId`, optional `idempotent`.

Money collection stays outside Core for now; pass `paymentRef` when paid elsewhere.

---

## 9. Coupons

### `POST /api/coupons/validate`

Preview only. Does not increment uses.

**Body:** `code` (required), optional `tenantId`, `pricingPlanId`, `memberId`, `amount`, `forCreditPackage`.

### `POST /api/coupons/redeem`

Atomic reserve + redemption row.

**Body:** `code`, `memberId`, `idempotencyKey` (required); optional `amount`, `pricingPlanId`, `source`, cart/subscription ids, `forCreditPackage`.

### Coupon error codes (examples)

`coupon_not_found`, `coupon_expired`, `coupon_inactive`, `coupon_not_started`, `coupon_not_for_packages`, `pricing_plan_required`, `coupon_plan_mismatch`, `coupon_max_uses`, `coupon_already_used`.

---

## 10. Credit resets (ops)

| Endpoint | Who | Purpose |
| -------- | --- | ------- |
| `POST /api/credits/reset` | Platform secret or authorized caller | Due-cycle sweep (`expire` / `rollover`) |
| `POST /api/credits/reset/force` | Super Admin | Immediate refill for one subscription |

Product apps normally do not call these.

---

## Suggested Postman collection

| Request | Method | Path |
| ------- | ------ | ---- |
| GET Entitlements | `GET` | `/api/entitlements?memberId={{memberId}}` |
| POST Sync Usage | `POST` | `/api/entitlements/usage` |
| GET Feature Costs | `GET` | `/api/credits/features` |
| GET Balance | `GET` | `/api/credits/balance?memberId={{memberId}}` |
| POST Check | `POST` | `/api/credits/check` |
| POST Deduct | `POST` | `/api/credits/deduct` |
| POST Deduct Overage | `POST` | `/api/credits/deduct` |
| GET Ledger | `GET` | `/api/credits/ledger?memberId={{memberId}}` |
| GET Usage by user | `GET` | `/api/credits/usage?memberId={{memberId}}` |
| POST Buy Package | `POST` | `/api/credits/packages/purchase` |
| POST Validate Coupon | `POST` | `/api/coupons/validate` |
| POST Redeem Coupon | `POST` | `/api/coupons/redeem` |

Variables: `baseUrl`, `apiKey`, `memberId`, `featureKey`, `idempotencyKey`, `creditPackageId`, `couponCode`.

---

## Typical product flows

```text
Billable feature
  -> POST /api/credits/check
  -> run feature
  -> POST /api/credits/deduct { featureKey, idempotencyKey, workspace? }

Create capped entity
  -> POST /api/entitlements/usage { usage, limitCheck }
  -> if allowed, create
  -> if overage charged, POST /api/credits/deduct { overage, idempotencyKey }

Buy credit pack
  -> POST /api/credits/packages/purchase

Member ledger UI
  -> GET /api/credits/ledger
```

---

## Load note

High-volume check / deduct traffic can load Core. A dedicated credits service may come later. **For now these Core APIs are the ones to use.**

---

## Related docs

- [Member user story](./member-user-story.md)
- [Member dashboard](./member-dashboard.md)
