# Eijent member dashboard (landing site)

What an approved member sees after they log in on the Eijent landing site.

This is for the Eijent web app team. You can open the same screens when you have landing-site access. No code access is required.

---

## Pages


| Page              | What it is for                                           |
| ----------------- | -------------------------------------------------------- |
| **Dashboard**     | Plan, modules, used/max limits, credits, sub-accounts    |
| **Credit ledger** | Full credit history (search, filters, export)            |


Both pages require the member to be logged in. If they are not logged in, they are sent to the login page.

Only **Active** members can reach these pages. Pending and Suspended members cannot log in.

---



## Dashboard sections



### Header

- Member name
- Credit ledger link
- Sign out



### Account owner

- Email, phone, account name, company
- Team size (owner + sub-accounts)
- Credits available
- Account status



### Subscription / plan

Shows the member’s current subscription from Core, including:

- Pricing plan name
- Linked service plan
- Subscription status and payment status
- Price / billing cycle when available
- Important dates
- When credits reset next (when available)

Below the plan details, a **summary strip** shows:

- Monthly credits and credits left
- Seats used / allowed
- Workspaces used / allowed
- Active modules count
- Billing cycle / renew date

This comes from the **Subscription** record created at approval time, plus entitlements usage when the product has synced counts.



### Modules

One card per enabled module from the service plan:

- Module name and Enabled badge
- Related limits for that module (used / max when synced)



### Limits

Numeric caps from the plan with progress bars:

- Used / max
- Status: normal, warning (~80%+), reached, exceeded
- Remaining count when known

Unlimited or non-numeric rows are omitted from this section.



### Sub-accounts

Lists team / sub-accounts linked to the member:

- Name
- Email
- Status (for example Active or Disabled)



### Credits & usage

Summary cards:

- Current balance
- Monthly allocation
- Used this cycle

Then:

- **By user** — owner and each sub-account’s deductions
- **By service** — top feature keys from credit usage (when present)

A link opens the full **credit ledger** for detailed history.

---



## Credit ledger page

The ledger is the audit trail of credit movements for that member’s subscription.

Members can:

- Filter by date range, type, feature, user, direction, and text search
- Sort and page through results
- Export to CSV
- See current balance

Typical row information:

- Date
- Type (for example AI usage, monthly allocation, manual adjustment)
- Service / feature
- Description
- Sub-account (or owner)
- Reference
- Amount
- Balance after the transaction

The landing site always shows **only this member’s** ledger. A member cannot ask for someone else’s history through this page.

---



## Used vs max (entity limits)



### What we show today


| Topic                                           | Who tracks it today                | What the dashboard shows              |
| ----------------------------------------------- | ---------------------------------- | ------------------------------------- |
| Credit balance and deductions                   | Core                               | Balance, by user, by service, ledger  |
| Modules turned on / off                         | Core (service plan)                | Module cards                          |
| Max caps (contacts, workspaces, etc.)           | Core (service plan → entitlements) | Progress bars with used / max         |
| How many contacts / workspaces are already used | Product app reports into Core      | Used / max after sync                 |




### How it works

The product app sends current counts (for example `maxWorkspaces: 5`) on Check, Deduct, or `POST /api/entitlements/usage`. Core stores them on the subscription and returns used / max / status on entitlements.

Before creating a capped entity, the product should call usage sync (or Check) with `limitCheck` so Core can reject when the plan max is reached.

Until the first sync, the dashboard shows `— / max` for usage.

See [apis.md](./apis.md) for the exact payload.

---



## Placeholder

**Go to app** on the dashboard is not wired to the main Eijent product yet. It is a coming-soon control until that entry point is ready.

---



## Related docs

- [Member user story](./member-user-story.md)
- [Credits APIs (Postman-style)](./apis.md)
