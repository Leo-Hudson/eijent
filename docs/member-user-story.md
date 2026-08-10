# Eijent member journey (user story)

Full path for an Eijent customer: signup, approval, plan selection, wallet, login, dashboard, and how the product app uses Core.

Follow the same journey in:

- **Eijent landing site** (signup, login, choose plan, dashboard, credit ledger)
- **BPS Core admin** (Eijent Members, Products, Pricing Plans, Service Plans, Coupons, Credit Packages, Subscriptions, Audit / Sync logs)

Canonical architecture: `bps-core/docs/architecture/plans-credits-coupons.md`.  
API details: [apis.md](./apis.md).

---

## Big picture

1. Person signs up on the landing site (company + contact only; **no plan picker**).
2. Account is **Pending**. They cannot log in. No subscription yet.
3. Admin opens **Eijent Members → Pending approvals** (or **Approve member** on the edit screen).
4. Admin **approves only** (no plan assignment).
5. Core activates the member, emails “account is ready”. No subscription yet.
6. Member logs in → **Choose a plan** screen.
7. Free / $0 demo plan: selecting it creates a **Subscription** and unlocks the dashboard. Paid plans show **Coming soon** until checkout is live.
8. Product app uses Core entitlements / credits / coupons APIs to enforce access and spend.

---

## Where things live in Core

| Concept | Where in Core | Meaning |
| ------- | ------------- | ------- |
| **Member** | Eijent Members | Person / company account |
| **Product** | Products (type plan) | Marketing + billing config for landing |
| **Pricing Plan** | Pricing Plans | Catalog the member picks after approve (credits, packages, overage, limits) |
| **Service Plan** | Service Plans | Modules, caps, Allow extras |
| **Subscription** | Subscriptions | Member ↔ plan link + live wallet + usage counts |
| **Credit packages** | Credit Packages | Sellable top-ups (attached on Pricing Plan) |
| **Coupons** | Coupons + redemptions | Promo codes for plans / packs |
| **Credits ledger** | Credit Transactions | Grants, deducts, resets (optional workspace) |
| **Audit / Sync logs** | System group | Control-plane and integration events |

**Important:** subscription is created when the **member selects a plan** after login, not at signup or admin approve.

Wallet policy (allocation, unused-credits expire/rollover, low-credit threshold) comes from the **Pricing Plan**, not from editing the Service Plan.

---

## Account statuses

| Status | Can log in? | Meaning |
| ------ | ----------- | ------- |
| **Pending** | No | Waiting for admin approval |
| **Active** | Yes | Approved; may still need to choose a plan |
| **Suspended** | No | Blocked by admin |

No separate Reject action today; leaving someone Pending keeps them locked out. A Reject → Suspended flow can be added later if needed.

---

## Step 1: Create an account (landing site)

Person enters company name, first/last name, email, password. They do **not** choose a plan.

### What happens

- New Eijent Member with status **Pending**
- No subscription, no payment
- Not logged in; message that the account is pending review

### If they try again

- Same email still Pending: signup can refresh company details
- Same email Active / Suspended: account already exists

---

## Step 2: Login while Pending

Login blocked with a clear “pending review” message. Suspended gets a suspended message.

---

## Step 3: Admin reviews and approves (Core)

**Eijent Members** tabs: All | **Pending approvals** | Trash.

Document header also has **Approve member** for Pending records.

### Permissions

- Members **read** + **approve**

### Approving

1. Click Approve
2. Confirm (no plan picker)

### What Core does

1. Member → **Active**
2. Send account-ready email (no plan line; they choose after sign-in)
3. Audit: `member.approved`

If email fails, member stays Active.

### Payment today

- No card at signup or approve
- Member picks a plan after login
- Free / $0 plans self-serve; paid plans show Coming soon until Stripe (or similar)
- **Subscriptions in Core** remain source of truth for plan + access

---

## Step 4: Member logs in and chooses a plan

After approval (and email), same email/password → `/dashboard/choose-plan` if they have no subscription yet.

- Lists active Pricing Plans for the tenant
- **Free / $0**: `POST /api/plans/select` → Core `POST /api/members/:id/select-plan` creates Subscription (wallet snapshot via existing hooks), then dashboard
- **Paid**: Coming soon popup; no subscription created
- Audit on success: `member.plan.assigned`; sync log: `member.provision.start` (Task 11 still deferred)

Keep at least one active **$0 / free** Pricing Plan in Core for demo and QA.

---

## Step 5: Landing dashboard

Once a subscription exists, member shell with Overview / Plan / Credits / Team / Billing / Settings:

- **Overview** – Available credits, plan glance, key limits, team size; low-credit banner when `isLowOnCredits`
- **Plan** – subscription summary, module chips, limits (`used / max` or Not synced)
- **Credits** – Available vs Plan grant + full ledger (filters, workspace, CSV)
- **Team** – owner, sub-accounts, spend by user

Details: [member-dashboard.md](./member-dashboard.md).

**Go to app** may still be a placeholder until the main product entry is ready.

---

## Step 6: What the product app should do

1. Treat Core **subscription + entitlements** as access source of truth (modules, caps, Allow extras, overrides).
2. Sync entity usage (`POST /api/entitlements/usage`) and use `limitCheck` before creates.
3. For billable AI / features: **check** then **deduct** with idempotency keys; pass **workspace** when relevant.
4. For extras over the free cap: deduct with `overage` after (or with) create.
5. Optional: credit package purchase + coupons via Core APIs (owner wallet).
6. Show ledger via `GET /api/credits/ledger`.

API details: [apis.md](./apis.md).

---

## Related docs

- [Member dashboard](./member-dashboard.md)
- [APIs](./apis.md)
