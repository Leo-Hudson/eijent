# Eijent web app provision (signup/approve sync)

## Problem

When a member signs up on Eijent, Core only stores a one-way hashed password (Payload hash + salt). By admin **Approve** time, Core no longer has the plaintext password and cannot reverse or decode the hash.

So Core **cannot** call `POST /api/users/register` at approval time with the user's real password, because that endpoint requires plaintext.

Two approaches below. Either works. Tell us which you can support near-term.

---

## Option A: Provision at signup, activate on approval

**Idea:** Create the web app user while the password is still available. Keep them pending until Core approves.

### What Core / portal will do

1. **On signup:** call your register or provision API with the password the user just typed, plus profile and Core ids.
2. Store returned remote ids on the member.
3. **On approve:** call your activate/sync API (plan, company, `coreMemberId`, `coreTenantId`, etc.).

### What the web app team needs to do

1. **Pending/inactive status** that blocks app login until activated.
2. Create pending users via `POST /api/users/register`, or a dedicated provision endpoint.
3. **Activate/sync endpoint** for Core to call after approval.

---

## Option B: Go straight to phase 2 (provision on approve + handoff)

**Idea:** Skip pending-at-signup. Provision on approve without the user password. Seamless login via a one-time handoff token when they click **Go to app**.

### What Core / portal will do

**On approve**, after member is Active (plan selection may still be pending on the member site):

> Note (Aug 2026): Admin approve no longer creates a subscription. Prefer triggering
> full provision when the member selects a plan (`member.plan.assigned` /
> `member.provision.start` on `POST /api/members/:id/select-plan`), or keep a
> lighter activate-only call on approve.

1. Call your server-to-server provision API with profile + Core ids (**never** the user password).
2. Store returned remote ids; write sync log success/failed.
3. If provision fails: member stays **Active** in Core; retry later.

**Handoff mint** (new Core API): `POST /api/members/handoff/mint`  
Auth: member Bearer JWT. Issues a one-time short-lived handoff token (e.g. 30-90s). Returns `{ token, expiresAt, redirectUrl }`.

**Eijent Site UI:** **Go to app** calls mint, then redirects. Clear error if provision or mint fails.

Core will also provide a **shared key** (per env) so the web app can verify/decode the handoff token and read the member details (ids, email, profile fields, etc.). Never includes the user's password.

### What the web app team needs to do

1. **Server-to-server provision API** Core can call on approve:
  - Create the user (and normal signup side effects) **without** requiring the user's Core plaintext password.
  - Accept Core profile/ids (see field mapping below).
  - Return stable ids for Core to store.
  - Be safe to retry (same `coreMemberId` / email).
2. **Handoff entry point** on the tenant host that:
  - Accepts the handoff token from the redirect query string.
  - Verifies/decodes it with the key Core provides, reads the claims, and signs the user into the web app (how you start the session is up to you).
  - Handles invalid/expired tokens with a clear error.
3. Tell us the provision API URL and how Core should authenticate (e.g. API key).
4. Confirm the handoff path (see below).

### App URLs (Go to app redirect)

You already shared the tenant hosts. `accountName` is the subdomain. After mint, Core redirects the browser there with the handoff token.

**Please confirm the path** for this flow, for example:

- `https://{accountName}.development.eijent.com/sso?code=...`  
- or `/sso/callback?code=...`  
- or another path/query shape you prefer

Also confirm the query param name (`code`, `token`, etc.). Core will append the handoff token and build `redirectUrl` from your host + path.

---

## Comparison


|                                     | Option A                     | Option B                  |
| ----------------------------------- | ---------------------------- | ------------------------- |
| When web app user is created        | Signup                       | Approve                   |
| Needs plaintext password            | Yes (at signup only)         | No                        |
| Needs pending status                | Yes                          | No                        |
| Seamless Go to app login            | Not included (can add later) | Yes (handoff)             |
| Smaller near-term if pending exists | Likely                       | Needs provision + handoff |


**Out of scope for both:** syncing or decoding the Core password.

---

## Open questions

**Option A**

- Do you already have pending/inactive that blocks login?
- Can register create pending, or do you need a new API?
- Shape of activate/sync endpoint?

**Option B**

- Provision API URL and auth (per env)?
- Confirm handoff path + query param (e.g. `/sso?code=` vs something else)?
- Exact success response ids to store on provision?
- Duplicate email / `coreMemberId` / `accountName` behavior?

---

