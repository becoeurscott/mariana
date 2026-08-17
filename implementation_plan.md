# Huff & Puff — Implementation Plan

**Visual source of truth:** the reference mockup images (cream ivory bg, terracotta/orange CTAs, deep forest green banners, gold tribal side patterns, floating basil leaves, editorial serif titles).

## Stack
- Next.js 16 App Router + React 19 (JS) — one repo, `/app` frontend + `/app/api` backend routes (no separate Express server — simpler, single `npm run dev`).
- Prisma + SQLite (file DB, zero-config).
- Framer Motion, socket.io (via Next custom server later if needed — for MVP poll for status).
- Stripe sandbox (fallback to mock clientSecret if no keys).

## Files (NEW unless noted)
```
package.json                            [NEW]
next.config.mjs                         [NEW]
jsconfig.json                           [NEW]
prisma/schema.prisma                    [NEW]
prisma/seed.mjs                         [NEW]
app/layout.js                           [NEW]
app/globals.css                         [NEW]  design tokens + patterns + leaves
app/page.js                             [NEW]  Home
app/menu/page.js                        [NEW]
app/checkout/page.js                    [NEW]
app/checkout/payment/page.js            [NEW]
app/track/[id]/page.js                  [NEW]
app/dashboard/page.js                   [NEW]
app/dashboard/menu/page.js              [NEW]
app/api/menu/route.js                   [NEW]
app/api/menu/items/route.js             [NEW]
app/api/menu/items/[id]/route.js        [NEW]
app/api/orders/route.js                 [NEW]
app/api/orders/my/route.js              [NEW]
app/api/orders/[id]/route.js            [NEW]
app/api/orders/[id]/status/route.js     [NEW]
app/api/payment/create-intent/route.js  [NEW]
app/api/auth/register/route.js          [NEW]
app/api/auth/login/route.js             [NEW]
app/api/auth/guest/route.js             [NEW]
components/Navbar.js                    [NEW]
components/Footer.js                    [NEW]
components/EthnicPattern.js             [NEW]
components/FloatingLeaves.js            [NEW]
components/Hero.js                      [NEW]
components/PopularCarousel.js           [NEW]
components/HarvestPromise.js            [NEW]
components/CuratedBox.js                [NEW]
components/RecipesFromHeart.js          [NEW]
components/MenuGrid.js                  [NEW]
components/OrderSummary.js              [NEW]
components/CartSidebar.js               [NEW]
components/DishModal.js                 [NEW]
context/CartContext.js                  [NEW]
lib/db.js                               [NEW]  Prisma singleton
lib/auth.js                             [NEW]  JWT helpers
lib/stripe.js                           [NEW]  Stripe with fallback
public/logo.svg                         [NEW]
public/leaf.svg                         [NEW]
public/hero-bowl.jpg-placeholder        [NEW] (use unsplash urls in JSX instead)
```

## Approach
1. Scaffold Next.js manually (avoid `create-next-app` interactivity).
2. Design system in globals.css matching image palette exactly.
3. Home page with all 4 sections + floating leaves + tribal patterns.
4. Menu with sticky order summary panel (deep green).
5. Cart context in localStorage.
6. Checkout with tip/delivery + Stripe sandbox intent.
7. Order tracking with polling (skip socket.io complexity for MVP).
8. Dashboard for owner (basic list + status change).
9. Prisma seed with 12 dishes matching mockup (Pappardelle, Ravioli, Wagyu Burger, Truffle Ravioli, Seared Scallops, Wild Mushroom Risotto, etc.).
10. Placeholder food images via Unsplash food URLs (no local binary assets needed).

## Executing now — no halt.
