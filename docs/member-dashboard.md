# Eijent member dashboard (landing site)

What an approved member sees after they log in on the Eijent landing site.

This is for the Eijent web app team. You can open the same screens when you have landing-site access. No code access is required.

---

## Pages


| Page              | What it is for                                           |
| ----------------- | -------------------------------------------------------- |
| **Dashboard**     | Plan, modules, max limits, credits summary, sub-accounts |
| **Credit ledger** | Full credit history (search, filters, export)            |


Both pages require the member to be logged in. If they are not logged in, they are sent to the login page.

Only **Active** members can reach these pages. Pending and Suspended members cannot log in.

---



## Dashboard sections



### Header

- Member name
- Company name
- Sign out



### Subscription / plan

Shows the member’s current subscription from Core, including:

- Pricing plan name
- Linked service plan
- Subscription status and payment status
- Price / billing cycle when available
- Important dates
- Credit balance and monthly (or plan) allocation
- When credits reset next (when available)

This comes from the **Subscription** record created at approval time.

### Included modules and limits

Shows what the service plan allows:

- Which modules are included
- For each limit, the **Max** value:
  - a number (for example 1000 contacts)
  - Unlimited
  - Included (when that is how the plan defines it)

**Important:** this view shows the **maximum allowed**, not how many the member has already used (for example it will not show “12 / 1000 contacts” today).

### Credits

Shows credit wallet activity at a summary level:

- Remaining balance / allocation
- Total credits used (deducted)
- Breakdown for the owner and for sub-accounts when they exist

Credits are tracked in Core. Contact / workspace style counts are not.

### Sub-accounts

Lists team / sub-accounts linked to the member:

- Name
- Email
- Status (for example Active or Disabled)



### Credit ledger link

A link to the full **credit ledger** page for detailed history.

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
- User
- Reference
- Amount
- Balance after the transaction

The landing site always shows **only this member’s** ledger. A member cannot ask for someone else’s history through this page.

---



## Open question: used vs max



### What we show today


| Topic                                           | Who tracks it today                | What the dashboard shows       |
| ----------------------------------------------- | ---------------------------------- | ------------------------------ |
| Credit balance and deductions                   | Core                               | Balance, usage summary, ledger |
| Modules turned on / off                         | Core (service plan)                | Included modules               |
| Max caps (contacts, workspaces, etc.)           | Core (service plan → entitlements) | **Max only**                   |
| How many contacts / workspaces are already used | Product app responsibility         | **Not shown yet**              |




### Why

Core tells the product what the plan allows (caps). The Eijent web app is expected to enforce those caps when users create contacts, workspaces, and similar records.

Core does not currently receive “used contact count” from the product, so the landing dashboard cannot invent a reliable “12 / 1000” number.

### Decision still open

If the product wants “used / max” on the dashboard or in-app:

1. The web app needs to track or report usage for each limited resource, **or**
2. We need a later agreement for how usage is reported back into Core.

Until then, treat entitlements as **max / allowed**, and treat credits as the only fully tracked consumption in Core.

---



## Placeholder

**Go to app** on the dashboard is not wired to the main Eijent product yet. It is a coming-soon control until that entry point is ready.

---



## Related docs

- [Member user story](./member-user-story.md)
- [Credits APIs (Postman-style)](./apis.md)

