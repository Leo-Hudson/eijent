# Eijent product APIs — account, credits & team

API reference for the **product web app** talking to **bps-core**.

**Base URL:** `CORE_API_BASE_URL`  

**Auth (all routes below):**

```http
Authorization: Bearer <API_KEY>
```

**Primary identifier:** `memberId` (the owner account).  
You do **not** need pricing-plan or subscription ids for normal reads; Core resolves the owner’s active subscription from `memberId`.

**Error shape (custom routes)**

```json
{
  "error": "Human-readable message",
  "code": "optional_machine_code",
  "details": {}
}
```

---

## 1. Start here — full owner snapshot

### `GET /api/account/overview?memberId=<uuid>`

One call for everything the product needs to render plan, credits, limits, and team for an owner.

**Auth:** API key with `subscriptions:read` for that member’s tenant.

**Query**

| Param | Required | Description |
|---|---|---|
| `memberId` | yes | Owner member id |

**Response**

```json
{
  "member": {
    "id": "…",
    "firstName": "…",
    "lastName": "…",
    "email": "…",
    "phone": null,
    "companyName": "…",
    "accountName": "…",
    "status": "Active"
  },
  "subscription": {
    "id": "…",
    "status": "active",
    "paymentStatus": "…",
    "price": 0,
    "currency": "USD",
    "billingCycle": "monthly",
    "startDate": "…",
    "nextBillingDate": null
  },
  "plan": {
    "pricingPlan": { "id": "…", "name": "…" },
    "servicePlan": { "id": "…", "key": "…", "name": "…" }
  },
  "modules": ["Workspaces", "Opportunities", "…"],
  "limits": [
    {
      "field": "maxWorkspaces",
      "label": "Max Workspaces",
      "module": "Workspaces",
      "used": 12,
      "limit": 10,
      "remaining": 0,
      "status": "exceeded",
      "unlimited": false
    }
  ],
  "usageCountsUpdatedAt": "…",
  "credits": {
    "balance": 1634,
    "allocation": 1000,
    "resetCycle": "monthly",
    "nextResetAt": "…",
    "unusedCreditsPolicy": "expire",
    "lowCreditAlertThreshold": 100,
    "isLowOnCredits": false
  },
  "team": {
    "ownerSeats": 1,
    "subAccountCount": 4,
    "members": [
      {
        "id": "…",
        "firstName": "Ava",
        "lastName": "…",
        "email": "…",
        "role": "…",
        "status": "Active",
        "pulseMemberId": "…"
      }
    ]
  }
}
```

Use this for Settings / billing / plan screens. Use the specialized credit routes below only when you need to **spend**, **check**, or pull **history / breakdowns**.

---

## 2. Credits — spend & history

Unless noted, pass **`memberId`**.

### `GET /api/credits/balance?memberId=`

Wallet only (balance, allocation, reset, low-credit flag). Prefer overview when you also need plan/limits.

### `GET /api/credits/usage?memberId=`

Optional `from` / `to` (ISO).  
Returns spend totals: `owner`, `bySubAccount[]`, `byFeature`, `totalDeducted`, `currentBalance`.

### `GET /api/credits/ledger?memberId=`

Paginated history.

| Query | Description |
|---|---|
| `from`, `to` | ISO range |
| `type` | `deduct` \| `reset` \| `grant` |
| `featureKey`, `workspaceId`, `subAccountId` | Filters |
| `ownerOnly` | `1` / `true` |
| `direction` | `credit` \| `debit` |
| `q` | Search |
| `sort` | `newest` \| `oldest` \| `largest_debit` \| `largest_credit` |
| `page`, `limit` | Pagination (max 100) |

Each row’s **`id`** is the credit transaction reference for UI.

### `POST /api/credits/check`

Preview cost. **Does not deduct.**

```json
{
  "memberId": "<uuid>",
  "featureKey": "launch_communication",
  "subAccountPulseId": "<optional>",
  "usage": { "maxContacts": 120 },
  "limitCheck": { "field": "maxContacts", "increment": 1 }
}
```

### `POST /api/credits/deduct`

Spend credits (or charge entity overage).

```json
{
  "memberId": "<uuid>",
  "featureKey": "launch_communication",
  "idempotencyKey": "unique-client-key",
  "subAccountPulseId": "<optional>",
  "workspaceId": "ws-123",
  "workspaceName": "Acme Demo"
}
```

Or overage:

```json
{
  "memberId": "<uuid>",
  "idempotencyKey": "unique-client-key",
  "overage": { "field": "maxWorkspaces", "units": 1 }
}
```

- `idempotencyKey` is required (safe retries).
- Use either `featureKey` **or** `overage`, not both.
- Attribute to a teammate with `subAccountId` or `subAccountPulseId` (omit both for owner).

### `GET /api/credits/features`

Feature credit price catalog.

### `POST /api/credits/packages/purchase`

Grant a credit pack after external payment.

```json
{
  "memberId": "<uuid>",
  "creditPackageId": "<uuid>",
  "idempotencyKey": "unique-client-key",
  "paymentRef": "external-payment-ref",
  "couponCode": "OPTIONAL"
}
```

---

## 3. Entitlements — sync usage from the product

Overview already returns current modules/limits. Use these when the product **writes** usage.

### `GET /api/entitlements?memberId=`

Same plan/limits/credits slice as overview (without member profile / team list).

### `POST /api/entitlements/usage`

Push entity counts from the product into Core. **Does not deduct credits.**

```json
{
  "memberId": "<uuid>",
  "usage": {
    "maxWorkspaces": 12,
    "maxContacts": 340,
    "maxTeamMembers": 16
  },
  "limitCheck": { "field": "maxContacts", "increment": 1 }
}
```

If extras are allowed and the check exceeds the cap, use the returned overage with `POST /api/credits/deduct`.

**Limit fields:**  
`maxWorkspaces`, `maxOpportunities`, `maxAccounts`, `maxContacts`, `maxTasks`, `maxProducts`, `maxAudiences`, `maxCommunications`, `maxTeamMembers`, `maxEijentAgents`, `maxEmailTemplates`, `maxCustomFields`, `maxPipelines`, `maxDriveFiles`, `maxEngagementFlows`, `maxSalesGoals`, `maxAnalytics`

---

## 4. Team (sub-accounts)

Included in overview under `team.members`.

To manage team records directly:

```http
GET /api/member-sub-accounts?where[member_owner][equals]=<memberId>&limit=100
POST /api/member-sub-accounts
PATCH /api/member-sub-accounts/:id
```

| Field | Use |
|---|---|
| `id` | Pass as `subAccountId` on credit APIs |
| `pulse_memberId` | Pass as `subAccountPulseId` on credit APIs |
| `member_owner` | Owner member id |
| `email`, `firstName`, `lastName`, `role`, `status` | Profile |

Sub-accounts are attribution records, not a separate login surface for these APIs.

---

## 5. Coupons (optional)

- `POST /api/coupons/validate` — preview  
- `POST /api/coupons/redeem` — consume (needs `memberId` + `idempotencyKey`)

Often used with credit-pack purchase.

---

## 6. Recommended flows

### Load Settings / Plan / Credits home

```http
GET /api/account/overview?memberId=<ownerId>
```

### Run a billable feature

1. `POST /api/credits/check`  
2. If affordable → `POST /api/credits/deduct` with a new `idempotencyKey`  
3. Refresh with overview or `GET /api/credits/balance`

### Create an entity that may hit a plan cap

1. `POST /api/entitlements/usage` with counts + `limitCheck`  
2. If overage allowed → `POST /api/credits/deduct` with `overage`  
3. If blocked → prompt upgrade / sales

### Attribute usage to a teammate

Pass `subAccountId` or `subAccountPulseId` on check / deduct.  
Report with `GET /api/credits/usage` or ledger filters.

### Buy a credit pack

1. `GET /api/credit-packages`  
2. Optional coupon validate  
3. Charge externally  
4. `POST /api/credits/packages/purchase`

---

## 7. Quick index

| Goal | Endpoint |
|---|---|
| **Everything for an owner** | `GET /api/account/overview?memberId=` |
| Balance only | `GET /api/credits/balance` |
| Usage breakdown | `GET /api/credits/usage` |
| Ledger history | `GET /api/credits/ledger` |
| Feature prices | `GET /api/credits/features` |
| Can we afford this? | `POST /api/credits/check` |
| Spend credits | `POST /api/credits/deduct` |
| Buy pack | `POST /api/credits/packages/purchase` |
| Sync entity counts | `POST /api/entitlements/usage` |
| Manage team records | `/api/member-sub-accounts` |

---

*Audience: Eijent product / web app. Identify owners by `memberId`. Use `/api/account/overview` as the default read.*
