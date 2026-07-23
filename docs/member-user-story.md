# Eijent member journey (user story)

This document explains the full path for an Eijent customer: creating an account, waiting for approval, getting a plan and subscription, logging in, and using the landing dashboard.

It is written for the Eijent web app team. You can follow the same journey in:

- **Eijent landing site** (signup, login, dashboard)
- **BPS Core admin** (Eijent Members, Pricing Plans, Subscriptions, Service Plans, credits-related collections)

---

## Big picture

1. A person signs up on the Eijent landing site with company and contact details only (no plan picker).
2. Their account is created as **Pending**. They cannot log in yet. No subscription is created yet.
3. An admin in Core reviews the request under **Eijent Members → Pending approvals** (tab between All and Trash), or opens the member and uses **Approve member** next to Save.
4. The admin assigns a pricing plan and approves the member.
5. Core activates the member, creates their **subscription**, and emails them that the account is ready.
6. The member logs in on the landing site and sees their dashboard (plan, modules, limits, credits).
7. Later, the main Eijent web app will use Core **Credits APIs** (entitlements, check, deduct, etc.) to enforce what the member can use.

---

## Where things live in Core

Think of Core as the system of record for Eijent membership and billing-related records.


| Concept                  | Where it lives in Core                           | What it means                                                                       |
| ------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Member**               | Eijent Members                                   | The person / company account (email, name, status, company info)                    |
| **Pricing plan**         | Pricing Plans                                    | What an admin assigns at approval (price, billing cycle, linked service plan)       |
| **Service plan**         | Service Plans                                    | What the product includes: modules, max limits, credit allocation rules             |
| **Subscription**         | Subscriptions                                    | The active commercial link between a member and a pricing plan, plus credit balance |
| **Credits**              | Subscription credit fields + credit transactions | Wallet balance and history of AI / feature usage                                    |
| **Feature credit costs** | Feature Credits                                  | How many credits each feature action costs                                          |


Important: the **subscription** is not created at signup. It is created when an admin **approves** the pending member.

---

## Account statuses


| Status        | Can log in? | Meaning                               |
| ------------- | ----------- | ------------------------------------- |
| **Pending**   | No          | Signed up, waiting for admin approval |
| **Active**    | Yes         | Approved and ready to use             |
| **Suspended** | No          | Blocked by admin                      |


There is no separate “reject” button today. If you do not approve someone, they simply stay **Pending** and cannot log in. We can add a **Reject** action later if needed (for example, reject and set the member to **Suspended** so the request is clearly closed instead of left pending).

---

## Step 1: Create an account (landing site)

On the Eijent signup page, the person enters:

- Company name
- First name / last name
- Email
- Password

They do **not** choose a pricing plan. The admin assigns the plan later.

### What happens

- A new **Eijent Member** is created in Core with status **Pending**.
- Company name is stored on the member for the approver.
- **No subscription** is created.
- **No payment** is taken at this moment.
- They are **not** logged in. They see a message that the account is pending review.

### If they try again

- Same email still **Pending**: signup can refresh company details; they remain pending.
- Same email already **Active** or **Suspended**: they are told the account already exists.

---

## Step 2: Try to log in while Pending

If they try to sign in before approval:

- Login is blocked.
- They see a clear message that the account is pending review and will work after an admin approves it.

Suspended accounts get a suspended message instead.

---

## Step 3: Admin reviews and approves (Core)

In Core admin, open **Eijent Members**.

You will see the list header tabs: **All Eijent Members** | **Pending approvals** | **Trash**. Pending approvals shows a count badge when members are waiting.

You can also open a **Pending** member’s edit page and use **Approve member** in the document header (before Save). Same plan picker and activation flow.

### Who can use Pending approvals

Your Core role needs permission to:

- **see** Eijent Members (Read)
- **approve** Eijent Members (Approve)

Approving also needs permission to **create subscriptions** for that tenant.

If you do not have those permissions, the button will not appear (or approval will fail).

### What the drawer shows

Clicking **Pending approvals** opens a side panel with:

- Search (name, email, company)
- Pagination
- Each pending member: name, email, company, signup time
- **Approve** action

### Approving a member

1. Click **Approve** on a row.
2. Choose the **pricing plan** to assign.
3. Confirm.

### What Core does on approve

1. Sets the member status to **Active**.
2. Creates a **Subscription** for that member + pricing plan.
3. Marks that subscription as ready for access (current approval flow uses an **offline / paid** style activation so the member can use the product without a checkout step at this stage).
4. Sets up their **credit wallet** from the plan (allocation / balance rules from the linked service plan).
5. Sends an **“account is ready”** email with a sign-in link.

If subscription creation fails, the member is put back to **Pending** so they are not left half-activated.

If the email fails, the account still stays Active (admin can tell them to log in manually).

### How “payment” works today

For this pending-approval flow:

- Signup does **not** charge a card.
- Approval creates the subscription as **admin-activated / offline paid**.
- That means access is granted by the admin assigning a plan, not by a self-serve checkout on the landing site.

Self-serve card payment (for example Stripe checkout at signup or upgrade) is a separate product decision. The web app team should treat **Subscriptions in Core** as the source of truth for “what plan this member is on” and “whether they have access.”

---

## Step 4: Member logs in (landing site)

After approval (and the email):

1. Member opens the landing site login.
2. Signs in with the same email and password from signup.
3. They land on the **member dashboard**.

---

## Step 5: Landing dashboard (what they see)

The landing dashboard is a member-facing summary. It shows:

- Who they are / company
- Current subscription and plan
- Included modules
- Max limits from the service plan (caps, not “how many they already used”)
- Credit balance / usage summary
- Sub-accounts (if any)
- Link to the **credit ledger** (full credit history)

See [member-dashboard.md](./member-dashboard.md) for the detailed dashboard breakdown and the open question about used vs max.

**Go to app** on the dashboard is still a placeholder until the main Eijent web app entry is ready.

---

## Step 6: What the Eijent web app should do next

Once the main product app is live, it should:

1. Treat Core **subscription + entitlements** as the source of “what this member can access.”
2. Use Core **Credits APIs** before and after AI / billable features:
  - read entitlements / balance
  - check if an action is affordable
  - deduct credits when the action runs
3. Enforce entity caps (contacts, workspaces, etc.) in the product app using the **max** values from entitlements. Core does not currently track “12 of 1000 contacts used.”

API details for credits are in [apis.md](./apis.md).

---

## Related docs

- [Member dashboard](./member-dashboard.md)
- [Credits APIs (Postman-style)](./apis.md)

