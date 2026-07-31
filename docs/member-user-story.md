# Eijent member journey (user story)

Full path for an Eijent customer: signup, approval, plan + wallet, login, dashboard, and how the product app uses Core.

Follow the same journey in:

- **Eijent landing site** (signup, login, dashboard, credit ledger)
- **BPS Core admin** (Eijent Members, Products, Pricing Plans, Service Plans, Coupons, Credit Packages, Subscriptions, Audit / Sync logs)

Canonical architecture: `bps-core/docs/architecture/plans-credits-coupons.md`.  
API details: [apis.md](./apis.md).

---

## Big picture

1. Person signs up on the landing site (company + contact only; **no plan picker**).
2. Account is **Pending**. They cannot log in. No subscription yet.
3. Admin opens **Eijent Members → Pending approvals** (or **Approve member** on the edit screen).
4. Admin picks a **Pricing Plan** and approves.
5. Core activates the member, creates a **Subscription**, snapshots the **credit wallet** from the Pricing Plan, emails “account is ready”, and writes audit + a **pending agent provision** sync log (Task 11: real agent sync still to wire).
6. Member logs in and sees dashboard (plan, modules, limits, credits, low-credit banner when relevant).
7. Product app uses Core entitlements / credits / coupons APIs to enforce access and spend.

---

## Where things live in Core

| Concept | Where in Core | Meaning |
| ------- | ------------- | ------- |
| **Member** | Eijent Members | Person / company account |
| **Product** | Products (type plan) | Marketing + billing config for landing |
| **Pricing Plan** | Pricing Plans | What admin assigns: credits, packages, overage costs, optional limit overrides |
| **Service Plan** | Service Plans | Modules, caps, Allow extras |
| **Subscription** | Subscriptions | Member ↔ plan link + live wallet + usage counts |
| **Credit packages** | Credit Packages | Sellable top-ups (attached on Pricing Plan) |
| **Coupons** | Coupons + redemptions | Promo codes for plans / packs |
| **Credits ledger** | Credit Transactions | Grants, deducts, resets (optional workspace) |
| **Audit / Sync logs** | System group | Control-plane and integration events |

**Important:** subscription is created at **approve**, not at signup.

Wallet policy (allocation, unused-credits expire/rollover, low-credit threshold) comes from the **Pricing Plan**, not from editing the Service Plan.

---

## Account statuses

| Status | Can log in? | Meaning |
| ------ | ----------- | ------- |
| **Pending** | No | Waiting for admin approval |
| **Active** | Yes | Approved and ready |
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
- Subscriptions **create** for that tenant

### Approving

1. Click Approve
2. Choose Pricing Plan
3. Confirm

### What Core does

1. Member → **Active**
2. Create **Subscription** (offline / paid style so access works without checkout)
3. Snapshot **credit wallet** from Pricing Plan (balance, allocation, reset, unused policy, low-credit threshold)
4. Send account-ready email
5. Audit: `member.approved`
6. Sync log: `member.provision.start` (pending). Agent DB provision is **not** completed until Task 11; member stays Active even if agent sync later fails

If subscription create fails, member rolls back to Pending.  
If email fails, member stays Active.

### Payment today

- No card at signup
- Approval = admin-activated / offline paid
- Self-serve Stripe (or similar) is a separate product decision
- **Subscriptions in Core** remain source of truth for plan + access

---

## Step 4: Member logs in

After approval (and email), same email/password → member dashboard.

---

## Step 5: Landing dashboard

Member shell with Overview / Plan / Credits / Team:

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
