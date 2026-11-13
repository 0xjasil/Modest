# Admin panel cleanup — patch (cross-repo)

`docs/moodest-admin-cleanup.patch` contains the admin-panel cleanup that belongs to
[`0xjasil/Moodest_admin`](https://github.com/0xjasil/Moodest_admin), kept here because this
workspace's GitHub credentials only allow writes to `0xjasil/Modest`.

Base commit: `15ba674` (*Remove cover banner image and overlapping layout from admin profile header*)
Contents: 34 files changed, +8 / −1581.

## What it does

**Deletes template surfaces**

- `(auth)/auth/*`, `(auth)/auth-cover/*` (12 pages) and `components/auth-demo/*` — three competing login UIs; `/dashboard-login` is the real one.
- `misc/{401,500,maintenance}`, `pages/misc/{error-page-404,forbidden-403}` — stand-in pages. `/misc/403` and `/misc/404` stay (middleware redirect targets).
- `profile/{connections,projects,teams}` + `profile-teams-page.tsx` + the Teams tab in the profile header.
- `referrals/` — 194 lines of template UI with no data source.
- `products/{list,add,categories}` — duplicates of `/products`, `/products/add-product`, `/products/categories-list`. All links repointed.
- `src/config/navigation.ts` — a second navigation tree imported by nothing that still pointed at deleted routes.

**Sidebar (`src/config/sidebar-menu.json`)**

Drops the `Pages` group, all six `Settings` children (those pages only show a toast — they persist nothing),
the fake `Order Details → /orders/ORD-9421` entry, and the hardcoded Orders badge `12`.
Result: `Dashboard · Products · Orders · Customers · Marketing · Analytics · Logs` + `Settings`.

**Fixes**

- `.env.example` `NEXT_PUBLIC_API_URL` port `5000 → 4000`, matching `lib/api.ts`, `lib/apiFetch.ts` and the `/api` proxy.
- `middleware.ts` public paths no longer list deleted routes.
- `revalidatePath("/products/list")` → `/products` (3 call sites).
- Category-list back-link points at `/products`.

## Apply

```bash
git clone https://github.com/0xjasil/Moodest_admin && cd Moodest_admin
git checkout -b chore/remove-template-sections
git apply --stat ../moodest-admin-cleanup.patch   # review first
git apply ../moodest-admin-cleanup.patch
pnpm install
pnpm --filter admin exec tsc --noEmit && pnpm --filter admin build
```

`packages/db` runs `prisma generate` on install, which needs `binaries.prisma.sh`; in a
network-restricted sandbox use `pnpm install --ignore-scripts`.

## Verified against the patch

- `tsc --noEmit -p apps/admin/tsconfig.json` → exit 0
- `next build` → success, 47 routes
- Route manifest: none of the 15 removed paths remain; `/dashboard-login`, `/misc/403`,
  `/misc/404`, `/profile`, `/settings`, `/products/add-product`, `/products/categories-list` all present

Delete this folder once the patch has landed in `Moodest_admin`.
