# E-commerce Frontend Audit — Modest Studio (`modest-frontend`)

**Stack:** Next.js 14.2 (Pages Router) · React 18 · TypeScript (strict) · Tailwind 3.4 · Razorpay (optional)
**Scope:** Storefront customer journey — browse → product → bag → checkout → payment → orders, plus auth, wishlist, search, and cross-cutting quality (SEO, a11y, brand consistency).
**Method:** Static review of all 80 source files, `tsc --noEmit`, `next build`, plus a dev-server smoke pass over `/`, `/cart`, `/checkout`, `/category/all`, `/product/:id`, `/orders`, `/wishlist`.

---

## 1. Executive summary

The app builds cleanly and every route renders, but the **commerce-critical path had several correctness defects** that directly cost money or trust:

* the bag quoted **free shipping** while checkout charged ₹99;
* **Buy Now** raced the cart mutation and could bounce the user back to an empty bag;
* adding quantity *N* fired *N* cart API calls (and *N* full cart refreshes);
* the product page invented **"120 Verified Ratings"** and a stock count of 10 when the backend reported nothing;
* a **backend outage** was rendered as "Product Not Found";
* **order details never opened** from the checkout redirect (string vs number id);
* category pages could show **"No designs found"** for a valid, populated collection;
* price filters were silently ignored on search results;
* a **guest wishlist was silently discarded on login**;
* the previous account's bag/wishlist could be shown to the next visitor after logout;
* brand-new accounts/logins landed on pages still themed with the previous **pink `#E80071`** palette and old "Moryella" name.

All of the above are **fixed** in this pass (23 files, +486/−247). One item is **deliberately left open** because it needs a product/ops decision: when Razorpay is disabled, the payment modal still simulates a successful payment (`§3.1`).

Verification after changes: `tsc --noEmit` clean · `next build` succeeds (20 routes) · all smoke-test routes return HTTP 200 · the `<title>` hydration warning that appeared in server logs is gone.

---

## 2. Fixed in this pass

| # | Issue | Impact | Where |
|---|-------|--------|-------|
| 1 | Three conflicting shipping policies (₹999 on PDP, ₹1,500 at checkout, 1999/₹149 in `constants.ts`). Cart always said "Complimentary — Free". | Customers were quoted different totals on three screens; the bag contradicted the invoice. | `lib/constants.ts`, `pages/checkout.tsx`, `pages/cart.tsx`, `context/AddressContext.tsx`, `pages/product/[id].tsx` |
| 2 | Cart `addItem` had no quantity parameter; PDP looped `addItem()` per unit. | Qty 5 = 5 POSTs + 5 full cart re-fetches; last-write-wins races dropped updates. | `context/CartContext.tsx`, `pages/product/[id].tsx` |
| 3 | **Buy Now** fired `addItem()` without awaiting, then immediately pushed `/checkout`. | Checkout's "empty bag" guard could redirect straight back to `/cart`. | `pages/product/[id].tsx` |
| 4 | Fabricated social proof: `reviewCount \|\| reviews.length \|\| 120`, plus a rating badge shown with zero reviews. | Misleading claims on every product with no reviews (consumer-protection risk). | `pages/product/[id].tsx` |
| 5 | Stock defaulted to `10` when the variant reported none, so "In Stock (10 available)". | False inventory messaging; quantity capped at a made-up number. | `pages/product/[id].tsx` |
| 6 | Image `onError` swapped product photos for a random Unsplash image. | A broken image showed a *different product*; also an un-configured remote host. | `pages/product/[id].tsx` |
| 7 | `getServerSideProps` catch returned `initialProduct: null` → "Product Not Found" on API outage. | Outages were reported as 404s and lost the sale. Now shows "Temporarily Unavailable" + Retry. | `pages/product/[id].tsx` |
| 8 | Order detail panel compared `order.id` (number) with `?orderId=` (string). | Arriving from checkout, "My Orders" never highlighted/opened the order; details sidebar stayed empty. | `pages/orders.tsx`, `context/OrderContext.tsx` |
| 9 | Order line items rendered as `Variant #12`. | Customers couldn't tell what they bought. Now shows product name + colour/size. | `context/OrderContext.tsx`, `lib/types.ts`, `pages/orders.tsx` |
| 10 | Category page re-filtered server results by matching category/brand/product-name text. | Valid collections (e.g. slug `syrian-collection` vs category `Syrian`) rendered **zero** products. | `pages/category/[...slug].tsx` |
| 11 | Search mode returned early, skipping price and rating filters. | Filters appeared to work but were silently ignored. | `pages/category/[...slug].tsx` |
| 12 | Listing flashed "No designs found" before the client re-fetch finished. | Looked broken on first paint, especially on mobile. | `pages/category/[...slug].tsx` |
| 13 | Guest wishlist was overwritten by the server list at login. | Saved items vanished for every new customer who signed in. | `context/WishlistContext.tsx` |
| 14 | Cart & wishlist survived logout in memory + `localStorage`. | Shared-device privacy leak; next account could see the previous bag. Now cleared on a dedicated `moryelle:logout` event (not on incidental 401s, so a failed login no longer wipes a guest bag). | `context/AuthContext.tsx`, `context/CartContext.tsx`, `context/WishlistContext.tsx` |
| 15 | Cart page: negative "savings" when `originalPrice < price`; no shipping row; `toLocaleString()` without locale. | "You are enjoying ₹-500 in savings"; totals didn't match checkout. | `pages/cart.tsx` |
| 16 | Checkout leaked a stock reservation if order creation failed after `/cart/reserve`. | Inventory locked until timeout on any downstream error. Now released. | `pages/checkout.tsx` |
| 17 | Product card printed `Rs. 1,299.00` while the rest of the store printed `₹1,299`; strike-through price rendered even when higher than the sale price. | Pricing looked inconsistent/unprofessional across grid vs PDP. | `components/ProductCard.tsx` |
| 18 | `<title>{a} \| {b}</title>` on PDP & category. | React hydration warning, garbage in browser tab on some engines. Fixed with template literals. | `pages/product/[id].tsx`, `pages/category/[...slug].tsx` |
| 19 | Legacy **pink `#E80071` / "#d20060"** palette + "Moryella"/"Moreylla" copy on Orders, Wallet, Notifications, Notification settings, Addresses, Analytics, Recommendations, SearchBar, ReviewForm, NotificationBell. | Visible brand break from the burgundy/ivory system on exactly the post-purchase screens. | 10 files |
| 20 | Bag showed the empty state while the server cart was still syncing. | Empty-bag flash for every returning logged-in customer. | `pages/cart.tsx` |

---

## 3. Open issues (not changed — need your decision or a larger change)

### P0 — before launch

**3.1 Payment can be "successful" without money moving.**
`components/PaymentModal.tsx:190` — when Razorpay is not enabled, `handlePayment` calls `onSuccess('pay_<timestamp>')`, so checkout clears the bag and redirects to `/orders?success=true` for an order that was never paid. The API call fails first, the failure is swallowed, and the synthetic id is still returned.
Also `lib/payments/razorpay.ts:44` enables Razorpay whenever a key id is present, even if `NEXT_PUBLIC_RAZORPAY_ENABLED=false` — the flag documented as the kill switch does not kill anything.
*Recommended:* fail closed — if payments are not configured, disable the ONLINE option and offer COD; require `ENABLED === "true"` **and** a non-placeholder key.

**3.2 Auth tokens in `localStorage`** (`lib/apiFetch.ts:2-3`).
Any XSS or malicious dependency reads the refresh token. *Recommended:* move to HttpOnly, SameSite cookies via a Next API proxy, or at minimum keep the refresh token out of JS.

### P1 — high value, contained work

* **No stock ceiling in the bag** (`context/CartContext.tsx` `updateQty`): the `+` button can exceed variant stock; the error only surfaces at reserve/order time. Clamp against the product's reported stock and show "only N left".
* **Coupons go stale** (`pages/checkout.tsx`): discount is validated once; changing bag contents can invalidate min-order rules, and shipping is computed on the pre-discount subtotal (matches backend, but worth confirming).
* **Mobile has no filters at all** (`pages/category/[...slug].tsx:249`) — the entire price/rating sidebar is `hidden md:block`. This is the majority of fashion traffic.
* **No pagination** — category and grid requests are hard-capped at `limit: 50/40` with no "load more"; catalogue growth silently truncates the store.
* **Sort is partly fake** — "Popularity" and "New Arrivals" are no-ops client-side (`pages/category`), so selecting them reorders nothing.
* **Two parallel search implementations** (`pages/search.tsx` + `SearchContext` vs header routing to `/category/all?q=`). Diverging behaviour and double maintenance; pick one and redirect the other.
* **Product page fetches twice** — SSR plus an unconditional client re-fetch of the same product and reviews on every mount.
* **No request timeouts** (`lib/apiFetch.ts`): a hung backend blocks SSR. Add `AbortSignal.timeout` and a server-side timeout.
* **`/analytics` is a public route** (`pages/analytics.tsx`) exposing a customer-facing analytics dashboard; it should be admin-gated or removed.

### P2 — quality, performance, SEO

* **Raw `<img>` everywhere** (~30 instances across `components/moodest/*`, `ProductCard`, PDP, cart) instead of `next/image` → no AVIF/WebP, no responsive `srcset`, no width/height (CLS), no CDN optimisation even though `remotePatterns` is configured.
* **Homepage is SSR per request** (`pages/index.tsx:131`) with three API calls; ISR (`getStaticProps` + `revalidate`) or client hydration would cut TTFB and backend load. Note: switching to ISR makes the API a *build-time* dependency.
* **Render-blocking Google Fonts** — `pages/_document.tsx` loads Inter/Jost from `fonts.googleapis.com` with a stylesheet `<link>` (and `next build` cannot optimise it). Use `next/font/google` for self-hosting, `display: swap` and zero layout shift.
* **SEO gaps** — no `robots.txt`, no `sitemap.xml`, no canonical URLs, no OpenGraph/Twitter cards, no `Product`/`Offer` JSON-LD on PDP (rich results unlikely), and `/category` has a title but no meta description.
* **Accessibility** — `PaymentModal` has no `role="dialog"`, `aria-modal`, Escape handling, or focus trap; PDP thumbnails use `role="tablist"` without `role="tab"`/`aria-selected`; wishlist heart uses `♥` text without `aria-pressed` (PDP) while the card version does it correctly.
* **Mock/legacy assets** — `products.json` at repo root (`[]`), duplicated unused `banners.json`, unused `data/TopBrands.js`.
* **Dead components** — `lib/services.ts`, `components/ProductGrid.tsx`, `moodest/RadarSection.tsx`, `moodest/UnmissableOffers.tsx`, `moodest/TopBrandsSection.tsx`, `components/RecommendedProducts.tsx`, `components/NotificationBell.tsx` are referenced by no route (the bell is therefore invisible despite a full notification system).
* **Storage keys are still `moryelle_*`** — renaming is safe only with a migration read; left untouched to avoid emptying live carts.
* **`useMediaQuery`** (`lib/hooks.ts`) starts `false` (hydration flash) and re-subscribes on every `matches` change.

### P3 — polish

* Cart badge counts units; PDP "In Your Bag" doesn't reflect quantity or variant, and adding a *different* size of the same product increments the same line (keyed by `product.id`), so two sizes cannot coexist in the bag. **This is the most notable remaining commerce-model limitation.**
* No skeleton on PDP while client re-fetch runs; `loading.tsx`-style states are inconsistent across pages.
* `alert()` / `confirm()` used for concierge, cancel and return flows.

---

## 4. Suggested next sprint (in order)

1. Decide and implement **3.1** (payment fail-closed) — blocking for real orders.
2. Make the bag **variant-aware** (cart line key = variant id), with stock clamping.
3. Mobile filter sheet + "load more" pagination on listings.
4. Move to `next/image`, add JSON-LD + sitemap/robots + OG tags.
5. Consolidate the two search paths; add admin-gating for `/analytics`.
6. Extract the ~600-line `Header`/`ProductDetail` components and add tests around pricing/shipping utilities (`getShippingFee`, `getAmountToFreeShipping`) so the three-way shipping drift cannot reappear.

---

*Prepared as a read-only analysis plus a contained fix set; nothing outside the storefront was modified.*
