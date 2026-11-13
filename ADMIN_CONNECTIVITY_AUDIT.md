# Backend ↔ Admin ↔ Storefront connectivity audit

**Date:** 2026-11-12 · **Storefront:** `0xjasil/Modest` (this repo) · **Admin:** `0xjasil/Moodest_admin` · **Backend:** `0xjasil/moodest-` → `backend/` (NestJS)

> **Note on scope:** only the storefront is checked out in this workspace. The admin panel and backend were inspected read-only from their GitHub repos; nothing in them was modified.

---

## 1. Topology

| App | Repo | Deployment | API base |
|---|---|---|---|
| Storefront | `0xjasil/Modest` (= `moodest-/MOODEST`) | `bkndmoodest.vercel.app` (API), admin media at `admin-moodest-25.vercel.app` | `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_API_PREFIX=/api` |
| Admin panel | `0xjasil/Moodest_admin` (identical copy vendored at `moodest-/Moodest admpanel`) | `admin-moodest-25.vercel.app` | `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`) |
| Backend | `moodest-/backend` | NestJS, global prefix `/api` | — |

The backend exposes **11 controllers**: `admin`, `auth`, `health`, `products`, `brands`, `categories`, `store` (coupons/reviews/wishlist/banners/wallet), `users`, `cart`, `orders` (+invoices), `payments`.

---

## 2. Storefront → backend: fully connected ✅

Every endpoint in `lib/api.ts` resolves to a real controller route:

auth (`/auth/login|register|refresh|logout|forgot-password|change-password`), products (`GET/POST /products`, `/:id/related`, variants, facets, autocomplete, trending), categories, brands, cart (`/cart`, `/cart/items`, `/cart/reserve`), orders (`/orders`, `/:id/cancel`, `/:id/return`, `/invoices/:id`), payments (`create-intent`, `retry/:orderId`, `verify`), users (`/users/me`, addresses), coupons (`/coupons/validate`), reviews (`/reviews/product/:id`), wishlist, wallet (`/wallet/me`, transactions, withdraw), banners.

**No dead or missing storefront endpoints.** The only cross-app hazard was a hardcoded admin deployment URL for uploaded media — now `NEXT_PUBLIC_MEDIA_URL` (see §5).

---

## 3. Admin → backend: partially connected

### 3.1 Working ✅

| Admin section | Endpoint(s) | Backend |
|---|---|---|
| Dashboard (`/`) | `GET /admin/dashboard` | `admin.controller` ✅ |
| Analytics | `/admin/dashboard`, `/products`, `/admin/low-stock`, `/brands`, `/categories` | ✅ |
| Products list / detail | `GET /products`, `GET /products/:id` | ✅ |
| Brands | `GET/POST/PATCH/DELETE /brands` | ✅ |
| Categories | `/categories` CRUD | ✅ |
| Coupons | `/coupons` | ✅ |
| Banners | `/banners` CRUD | ✅ |
| Gallery | `/banners` | ✅ |
| Orders | `GET /admin/orders`, `PATCH /admin/orders/:id/status` | ✅ |
| Payment logs | `GET /orders/admin/all` | ✅ |
| Activity logs | `GET /admin/audit-logs` | ✅ |
| Reports | `/admin/customer-analytics`, `/orders/admin/all` | ✅ |
| Reviews | `/products`, `/reviews/product/:id` | ✅ |
| Inventory list | `/products` (+ variant fallback) | ✅ |
| Settings (root `/settings`) | `/users/me`, `/auth/change-password` | ✅ |

### 3.2 Broken — calls endpoints that do not exist ❌

| Admin section | Calls | Reality |
|---|---|---|
| **Customers** (`admin-user/*`) | `GET /users?page&search&status…`, `GET /users/:id`, `POST /users/:id/ban`, `/unban` | Backend has **no `/users` list** (only `/users/me`); the real route is `GET /admin/users` with a different response shape (`{ data, meta }` vs the `{ users, pagination }` the table expects). **Ban/unban do not exist at all.** The table also sends `credentials: "include"` with no `Authorization` header, so it cannot authenticate against the JWT backend. |
| **Pages (CMS)** | `GET/POST/PATCH/DELETE /pages` | **No pages controller** in the backend. Entire section 404s. |
| **Subcategories** | `GET /subcategories` | No such route — categories are self-referential (`parentId`). Use `/categories`. |
| **Attributes** (product edit) | `GET /attributes` | No such route. |
| **Variants** (product edit) | `POST /variants` | Variants live at `/products/:productId/variants`. |
| **Inventory delete** | `DELETE /inventory/:id` | No inventory controller — should be `DELETE /products/:id`. |
| **Settings sub-pages** (store-details, payments, checkout, shipping, locations, notifications) | *none* | Pure local `useState` + `toast()`. **"Save" reports success and persists nothing.** |
| **Profile / Teams / Connections / Projects**, **Referrals** | *none* | Template screens, no data source. |

These are all classic **purchased-template leftovers** (the Customers table was written for a better-auth backend: `res.users`, `res.pagination.totalPages`, `/users/:id/ban`). Two different backends are assumed by the same app.

---

## 4. Structural problems in the admin panel

1. **Duplicate routes** (same component, two URLs):
   - `/` ≡ `/dashboard` (`dashboard/page.tsx` literally imports `../page`)
   - `/products` ≡ `/products/list`
   - `/products/add` ≡ `/products/add-product`
   - `/products/categories` ≡ `/products/categories-list`
2. **Three login UIs**: `/dashboard-login` (the one `middleware.ts` redirects to), `/auth/login` (template "AuthDemo"), `/auth-cover/login` (second template variant) + 5 more auth-demo pages each.
3. **Template error pages shipped as navigation**: sidebar links to `/misc/404` and `/misc/maintenance`; `/misc/401`, `/misc/500`, `/pages/misc/error-page-404`, `/pages/misc/forbidden-403` also exist. Only `/misc/403` is actually used (middleware redirects non-ad mins there).
4. **Dead nav entry**: "Order Details" → `/orders/ORD-9421` (hardcoded fake id).
5. **Sidebar "Pages" group** contains Profile / Teams / 404 / Maintenance — a template artifact, not commerce functionality.

### Config defects

| # | Issue | Effect |
|---|---|---|
| 1 | `apps/admin/.env.example` sets `NEXT_PUBLIC_API_URL=http://localhost:5000/api`, but `lib/api.ts`, `lib/apiFetch.ts` and `app/api/[...slug]/route.ts` all default to **`:4000`** | Copying `.env.example` points the panel at nothing; dashboard/orders/products all fail. |
| 2 | Two transports: `apiFetch` calls `${API_URL}/…` **directly** (CORS, token from `localStorage`), while `apps/admin/src/app/api/[...slug]/route.ts` proxies with the `admin_access_token_v1` cookie | Inconsistent auth: client components and server components can disagree about who is logged in. Pick one (proxy + HttpOnly cookie is the safer one). |
| 3 | Storefront hardcoded `https://admin-moodest-25.vercel.app` for admin-uploaded category images | Fixed in this workspace → `NEXT_PUBLIC_MEDIA_URL` (fallback unchanged). |

---

## 5. What I already fixed in this workspace (storefront only)

- Removed dead `lib/services.ts` — it advertised a Vercel `ADMIN_SERVICE_URL` service binding that this repo has no `vercel.json` for, and nothing imported it.
- `components/moodest/DiscoverCategories.tsx`: admin media origin is now `NEXT_PUBLIC_MEDIA_URL` (same default), so an admin domain change no longer needs a storefront code change.
- `.env.example`: documented `NEXT_PUBLIC_MEDIA_URL`.
- `next.config.js`: allowed `admin-moodest-25.vercel.app` in `images.remotePatterns` so future `next/image` usage doesn't break.
- Verified: `tsc --noEmit` clean.

---

## 6. Cleanup applied (Tier 1 + Tier 2)

Applied in a separate clone at `/home/user/Moodest_admin` (this workspace) — **34 files changed, +11 / −1579 lines**. Packaged as **`/home/user/admin-panel-cleanup.patch`** (reverse-apply checked).

### Removed

| Area | Paths |
|---|---|
| Duplicate login UIs | `(auth)/auth/*` (6 pages), `(auth)/auth-cover/*` (6 pages), `components/auth-demo/*` |
| Template error pages | `misc/401`, `misc/500`, `misc/maintenance`, `pages/misc/error-page-404`, `pages/misc/forbidden-403` |
| Template profile | `profile/connections`, `profile/projects`, `profile/teams`, `profile-teams-page.tsx`, Teams tab in `profile-header.tsx` |
| Template page | `referrals/` (194 lines, no data source) |
| Duplicate product routes | `products/list` (link → `/products`), `products/add` (canonical `/products/add-product` kept), `products/categories` (`categories-list` kept) |
| Second nav source of truth | `src/config/navigation.ts` (394 lines, imported by nothing, pointed at deleted routes) |
| Sidebar entries | "Order Details → /orders/ORD-9421" (fake id), the whole **Pages** group (Profile/Teams/404/Maintenance), all six **Settings** children (fake saves), hardcoded Orders badge `12` |
| Config | `.env.example` API URL `:5000` → `:4000` (matches the three code defaults); middleware public-path list cleaned |
| Dangling links | `CommerceoCategoryList` → `/products`; `revalidatePath("/products/list")` → `/products` |

### Kept deliberately
`/dashboard-login` (middleware target) · `/misc/403` (middleware redirect for non-admins) · `/misc/404` · `/products/add-product` · `/products/categories-list` · `/profile` (linked from the header avatar) · `/settings` root · Customers, Pages CMS, Inventory, Subcategories, Analytics — **routes still exist** but Customer/Pages wiring remains broken until Tier 3 is decided (`§7`).

### Sidebar after cleanup

```
MAIN      Dashboard · Products ▾ · Orders ▾ · Customers · Marketing ▾ · Analytics · Logs ▾
SETTINGS  Settings
```

### Verification

- `tsc --noEmit -p apps/admin/tsconfig.json` → clean
- `next build` → success (Next 15.5.9, 40 routes)
- `.next/app-path-routes-manifest.json`: all 13 deleted routes absent; `/dashboard-login`, `/misc/403`, `/misc/404`, `/products/add-product`, `/products/categories-list`, `/profile`, `/settings` present

### To apply on the real repo

```bash
git clone https://github.com/0xjasil/Moodest_admin && cd Moodest_admin
git checkout -b chore/remove-template-sections
git apply --stat  /path/to/admin-panel-cleanup.patch   # review
git apply         /path/to/admin-panel-cleanup.patch
pnpm install && pnpm --filter admin exec tsc --noEmit && pnpm --filter admin build
```

`packages/db`'s `prisma generate` postinstall needs `binaries.prisma.sh`, which this sandbox cannot reach — use `pnpm install --ignore-scripts` here, or a normal install on your machine/CI. The admin app does not import `@repo/db` or `better-auth` anywhere.

---

## 7. Remaining decision — Tier 3 (broken wiring)

These sections build but cannot work against the current NestJS API; they were **not** touched:

| Section | Problem | Fix |
|---|---|---|
| Customers | `GET /users`, `/users/:id`, `/users/:id/ban|unban` do not exist; response shape assumes better-auth | Point at `GET /admin/users`; drop ban/unban |
| Pages (CMS) | No `pages` module in the backend | Build module or delete |
| Subcategories | No `/subcategories` route | Use `/categories?parentId=` |
| Attributes / standalone variants | No `/attributes`, no `/variants` | Use `/products/:productId/variants` |
| Inventory delete | `DELETE /inventory/:id` does not exist | `DELETE /products/:id` |
| Settings sub-pages | 6 pages persist nothing (local state + toast) | Remove, or add a settings module |

The admin panel is a different repository from the session's repo (`0xjasil/Modest`), so nothing was committed or pushed there — the patch is the hand-off.
