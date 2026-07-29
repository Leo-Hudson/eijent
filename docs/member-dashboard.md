# Eijent member dashboard (landing site)

What an approved member sees after login on the Eijent landing site.

For the Eijent web app team. Open the same screens with landing-site access; no Core code access required.

---

## Pages

Shared **member shell**: sidebar on desktop (Overview / Plan / Credits / Team / Go to app / Sign out), tab strip on mobile.

| Route | Purpose |
| ----- | ------- |
| `/dashboard` | **Overview** – available credits, plan glance, key limits, team size |
| `/dashboard/plan` | **Plan** – subscription, module chips, entity limits |
| `/dashboard/credits` | **Credits** – Available / Plan grant KPIs + full ledger |
| `/dashboard/team` | **Team** – owner strip + searchable / paged people table with spend |
| `/dashboard/ledger` | Redirects to `/dashboard/credits` |

All require a logged-in **Active** member. Pending / Suspended cannot log in.

---

## Credit number vocabulary

Do **not** show balance as `X / allocation` (that reads like a hard cap).

| Label | Meaning |
| ----- | ------- |
| **Available** | Spendable balance now (can be above plan grant after top-ups / rollover) |
| **Plan grant** | Credits from the plan each cycle |
| **Used this cycle** | Deductions in the period (`totalDeducted` / ledger) |
| **Low alert** | Banner when `isLowOnCredits` |

When available &gt; plan grant, hint that the difference includes top-up.

---

## Overview

Above the fold:

1. Greeting + low-credit banner when needed
2. **Available credits** (large, only hero number on this page) + link to Credits history
3. Plan name, status, and quiet seats / workspaces meta (`Seats 3 / Unlimited · Workspaces 9 / 10`)
4. Team count + link to Team

No full module grid and no duplicate credit walls.

---

## Plan

- Pricing / service plan summary (billing cycle, next invoice, credit reset, Available, Plan grant)
- Modules as compact chips; optional accordion for limits by module
- Limits with `used / max` when synced, or `Not synced / max` when `used` is null
- Progress bars only when `used` is known
- If more than 8 limits, show the first 8 with **Show all**

---

## Credits (ledger)

Top: Available · Plan grant · Credited · Deducted (filter-scoped)

Below: ledger with sticky filters; advanced filters behind **More filters**; CSV export.

Deep link from Team: `/dashboard/credits?user=owner` or `/dashboard/credits?user=<subAccountId>` (also accepts `subAccountId`) pre-selects the Who filter.

Columns: Date · Type · Workspace · Service · Who · Amount · Balance after · Reference · Description

Mobile: card rows instead of a wide table.

Empty state: no movements yet until grants, resets, or spend appear.

Legacy `/dashboard/ledger` redirects here.

---

## Team

- Compact owner strip (name, email, status, company, account, phone, team size)
- **One People table** (owner + sub-accounts) with credits used per person
- Client controls for larger orgs: search (name/email), status filter, sort (name / highest spend), page size 10
- **View in Credits** opens the ledger filtered to that person
- Sub-accounts spend from the **owner wallet**
- Dashboard currently loads up to 100 sub-accounts; larger orgs need a paged Core proxy later
- Invite / disable management is not on this landing surface yet

---

## Low-credit banner

Shown when Core returns `credits.isLowOnCredits` (balance **below** `lowCreditAlertThreshold`, and threshold &gt; 0).

Threshold is set on the **Pricing Plan** and snapshotted onto the subscription at approve / plan assign.

---

## Used vs max (entity limits)

| Topic | Who tracks it | What the UI shows |
| ----- | ------------- | ----------------- |
| Credit balance / deductions | Core | Available, Plan grant, by user, ledger |
| Modules on / off | Core (Service Plan ± Pricing Plan overrides) | Module chips |
| Max caps | Core entitlements | Progress used / max when synced |
| Current used counts | Product app → Core sync | Used after first sync |
| Over free cap | Service Plan Allow extras + Pricing Plan entity costs | Product must check + optionally deduct overage |

### How sync works

Product sends counts (e.g. `maxWorkspaces: 5`) on Check, Deduct, or `POST /api/entitlements/usage`. Core stores them on the subscription and returns used / max / status.

Before create, call usage sync (or Check) with `limitCheck`. If over cap and extras allowed, charge via `POST /api/credits/deduct` with `overage`.

Until the first sync, dashboard shows `Not synced / max` (not `— / max`).

See [apis.md](./apis.md).

---

## Placeholder

**Go to app** may not be wired to the main Eijent product yet.

---

## Related docs

- [Member user story](./member-user-story.md)
- [APIs](./apis.md)
- [Dashboard / ledger redesign plan](./dashboard-ledger-redesign-plan.md)
