# LUXE — Premium Editorial E-Commerce Frontend

A fully functional luxury fashion storefront built with React 18 + Vite 5, designed to preserve the editorial premium aesthetic of the reference design while maintaining a clean, scalable component architecture.

---

## Live Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.4.21 |
| Routing | React Router DOM v6.21 |
| Styling | CSS Modules (zero Tailwind, zero global cascade conflicts) |
| Icons | Font Awesome 6.4.0 (CDN) |
| Typography | Google Fonts — Inter + Playfair Display |
| State | React Context API (Cart, Wishlist, UI) |
| Persistence | localStorage |
| Testing | Jest 30 + Testing Library + user-event 14 |

---

## Project Structure

```
luxe-fe/
├── design/                        # Source-of-truth HTML reference
├── public/
├── src/
│   ├── components/                # 23 reusable UI primitives
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   ├── CartDrawer/
│   │   ├── WishlistDrawer/
│   │   ├── SearchModal/
│   │   ├── Toast/
│   │   ├── SkeletonCard/
│   │   ├── SizingAssistantModal/
│   │   └── ...
│   ├── context/                   # CartContext, WishlistContext, UIContext
│   ├── hooks/                     # useCart, useWishlist, useUI
│   ├── routes/                    # AppRoutes.jsx with React.lazy
│   ├── screens/                   # 6 route-level screen compositions
│   │   ├── HomeScreen.jsx
│   │   ├── ProductListingScreen.jsx
│   │   ├── ProductDetailScreen.jsx
│   │   ├── CartScreen.jsx
│   │   ├── WishlistScreen.jsx
│   │   └── CheckoutScreen.jsx
│   ├── styles/                    # Global CSS + screen CSS Modules
│   └── utils/
│       └── data/                  # Local ecommerce datasets (25 products)
├── tests/                         # All test files (outside src/)
│   ├── helpers/
│   │   └── renderWithProviders.jsx
│   ├── context/
│   └── screens/
├── jest.config.js
└── vite.config.js
```

---

## How This Project Was Built — Phase by Phase

The project was built in **11 structured phases**, each building on the previous. The HTML design reference (`design/design-reference.html`) served as the single source of truth throughout.

---

### Phase 1 — Project Foundation

Established the Vite + React scaffold with proper tooling:

- Vite 5.4.21 dev server with HMR
- React Router v6 with `BrowserRouter` wrapping the entire tree
- CSS Modules configured — no Tailwind, no global class leakage
- Font Awesome 6.4.0 via CDN in `index.html`
- Google Fonts: Inter (400/500/600/700) + Playfair Display (400/500/600 italic)
- Global CSS: custom scrollbar, `focus-visible` outline, `scroll-behavior: smooth`, `viewport-fit=cover`
- Two keyframe animations defined globally: `@keyframes heartPulse` (wishlist toggle) and `@keyframes flyToCart` (add-to-bag particle)

---

### Phase 2 — Data Architecture

All product data lives in local JS modules under `src/utils/data/` — no external API calls, no fetch latency, fully deterministic rendering.

- **25 luxury products** across 4 categories: Outerwear (8), Knitwear (6), Suits (6), Trousers (5)
- Each product has: `id`, `title`, `brand`, `price`, `category`, `images[]`, `sizes[]`, `soldOutSizes[]`, `colors[{ name, hex }]`, `relatedProducts[]`, `featured`, `limitedEdition`, `newArrival`, `description`, `details[]`, `care[]`
- `productIndex` export — O(1) lookup map keyed by product ID
- Supporting data files: `categories.js`, `filters.js`, `banners.js`, `collections.js`, `reviews.js`, `recommendations.js`, `testimonials.js`, `navigation.js`

---

### Phase 3 — Shared Reusable Components

Built 23 UI components with full isolation via CSS Modules:

**Active components (integrated into screens):**
- `Navbar` — sticky, backdrop-blur, cobalt brand dot, wishlist/cart/search icon buttons, ARIA navigation landmark
- `Footer` — 4-column layout, newsletter input, copyright
- `ProductCard` — dual-image hover swap, wishlist toggle, limitedEdition/newArrival badges, Quick Add bar
- `CartDrawer` — slide-in right panel, free-shipping progress bar, item list, checkout CTA
- `WishlistDrawer` — MOVE TO BAG action with default size, item grid
- `SearchModal` — autoFocus, Escape-to-close, trending pills, live suggestions with 200ms debounce
- `Toast` — ARIA live region, auto-dismiss at 3s, timer cancellation on rapid re-trigger
- `SkeletonCard` — shimmer loading placeholder matching ProductCard dimensions
- `SizingAssistantModal` — height/weight/build sliders, BMI algorithm, recommended size output

---

### Phase 4 — Homepage

The editorial landing page with 5 distinct sections:

- **Hero** — `5fr / 7fr` desktop split, fluid `clamp(2.5rem, 5vw, 5rem)` title, caption overlay, two CTA buttons navigating to `/products` and the first featured PDP
- **Category Strip** — 2-col mobile → 4-col desktop; each chip navigates with `?category=` query param
- **Featured Products** — 3 curated items (`featured: true`), hover image swap, wishlist toggle with heartPulse animation
- **Narrative Banner** — 1-col mobile → 2-col desktop editorial layout
- **Mobile Bottom Nav** — hidden at 768px breakpoint, shows Home / Shop / Wishlist / Cart icons

---

### Phase 5 — Product Listing Page

A fully functional filter-and-browse experience:

- URL param hydration: reads `?category=` and `?q=` on mount to pre-populate filters
- Filters: category, size, price range (bins), color swatches, star rating
- Active filter chips with individual remove and "Clear All"
- Mobile filter drawer (slide-in panel)
- Sort: Newest First, Price Low→High, Price High→Low
- Load More pagination (12 items per page)
- Quick Add hover bar on each card
- SkeletonCard loading state, empty state with illustration
- 1 / 2 / 3 column grid toggle

---

### Phase 6 — Product Detail Page

The most feature-dense screen:

- **Image Gallery** — thumbnail rail, active cobalt border, main image swap on thumbnail click
- **Zoom Lens** — cursor-tracking magnification on hover (`backgroundSize: 220% 220%`)
- **Size Grid** — auto-skips sold-out sizes on mount, disabled state for sold-out, 2s auto-clear after add
- **Color Swatches** — rendered from `color.hex` directly, active ring indicator
- **Sizing Assistant** — launches `SizingAssistantModal` with BMI-based size recommendation
- **Add to Bag** — validates size selection, triggers Toast, opens CartDrawer, button transitions to ADDED TO BAG checkmark
- **Wishlist Toggle** — heartPulse animation on toggle, persists across sessions
- **Accordions** — Sourcing & Composition, Delivery & Returns (expand/collapse)
- **Recently Viewed** — tracked on mount, capped at 5, excludes current product, displayed as card row
- **Related Products** — drawn from `product.relatedProducts[]` IDs
- **Mobile Quick-Add Bar** — fixed bottom bar with size selector + add button
- **Not Found State** — graceful fallback for invalid product IDs

---

### Phase 7 — Cart System

Three-layer cart implementation:

**CartContext:**
- `addItem(product, size, color)` — deduplicates by `id+size+color` key, increments qty if duplicate
- `updateQty(itemId, delta)` — removes item automatically when qty reaches 0
- `clearCart()` — used post-checkout
- `subtotal` derived value, localStorage persistence via `useEffect`

**CartDrawer:**
- Free shipping progress bar toward $500 threshold
- Qty +/- controls, remove button, item thumbnail
- Checkout CTA, empty state

**CartScreen:**
- `7fr 5fr` two-column grid at 1024px+, sticky order summary
- Same qty/remove controls as CartDrawer

**CheckoutScreen:**
- 3-section form: Contact Specifications, Courier Destination Address, Payment Parameters
- Card number auto-formats to `XXXX XXXX XXXX XXXX`
- Expiry auto-formats to `MM / YY`
- CVV strips non-numeric input
- Post-submit success screen with generated `LX-XXXXXX-XX` order reference and confirmation email display
- `7fr 5fr` grid matching CartScreen

---

### Phase 8 — Wishlist + Recently Viewed

**WishlistContext:**
- `toggleItem(productId)` — adds if absent, removes if present
- `trackView(productId)` — pushes to recently-viewed array, caps at 5
- `removeItem(productId)` — explicit removal (used by WishlistScreen)
- All functions memoized with `useCallback` to prevent stale closure issues
- localStorage persistence

**WishlistScreen:**
- Full editorial grid, dual-image hover swap
- MOVE TO BAG action (adds at `sizes[1]` default, moves to CartDrawer)
- Remove button with accessible aria-label
- Piece count header (`1 piece saved` / `N pieces saved`)
- Empty state with EXPLORE THE COLLECTION CTA

---

### Phase 9 — Advanced UX Features

Interaction polish layer:

- **Toast system** — UIContext manages `toastMessage` + `toastTimerRef`; auto-dismisses at 3s; calling `showToast` before prior toast expires cancels the running timer to prevent stale clears
- **Search** — live product title suggestions with 200ms debounce; results navigate to `/products?q=`; Escape closes modal; `autoFocus` on open
- **heartPulse animation** — CSS `@keyframes heartPulse` (`scale(1.0) → 1.3 → 1.0`) wired to wishlist toggle on PDP and featured products on HomeScreen
- **Zoom lens** — PDP image magnification via `backgroundPosition` tracking mouse coordinates relative to image bounds
- **Quick Add** — hover bar on ProductCard with direct add-to-bag, bypasses PDP
- **focus-visible** — universal `outline: 2px solid cobalt` on keyboard focus across all interactive elements
- **SkeletonCard** — shimmer placeholder rendered during simulated load delay on PLP

---

### Phase 10 — Responsive Polish

All 6 screens validated across three breakpoints (640px / 768px / 1024px):

- Mobile-first layout with grid reflow at each breakpoint
- Hero: fluid `clamp()` title, stacked layout on mobile
- CartScreen + CheckoutScreen: `1fr` stacked on mobile → `7fr 5fr` at 1024px
- Drawers: `min(100%, 28rem)` width, full-height overlay
- Navbar: icon-only on mobile, full labels on desktop
- Mobile bottom nav: visible below 768px, hidden above
- ProductCard grid: 1-col → 2-col → 3-col with media queries
- PDP gallery: horizontal scroll thumbnails on mobile → vertical rail on desktop

---

### Phase 11 — Testing (84 tests, 10 suites)

Comprehensive test coverage written after all screens were complete:

**Test infrastructure:**
- `tests/helpers/renderWithProviders.jsx` — wraps `CartProvider + WishlistProvider + UIProvider + MemoryRouter` for all screen tests
- `userEvent.setup({ delay: null })` — removes artificial keystroke delays, prevents Jest 5s timeout under parallel CPU load
- Context seeding pattern — helper components call `useContext(CartContext).addItem(...)` / `useContext(WishlistContext).toggleItem(...)` within the provider tree to populate state before assertions

**Coverage by file:**

| File | Tests | Key Cases |
|---|---|---|
| `context/CartContext.test.jsx` | 10 | addItem dedup, updateQty, qty=0 remove, clearCart, subtotal, localStorage |
| `context/WishlistContext.test.jsx` | 8 | toggle add/remove, trackView max-5 cap, removeItem, localStorage |
| `context/UIContext.test.jsx` | 5 | showToast, auto-dismiss, timer cancel on rapid re-call |
| `screens/App.test.jsx` | 3 | Suspense resolution, nav landmark, hero headline, brand name |
| `screens/HomeScreen.test.jsx` | 6 | Hero render, category strip, featured products, wishlist toggle, CTA navigation |
| `screens/ProductListingScreen.test.jsx` | 7 | Product grid, filter by category, sort, URL param hydration, empty state |
| `screens/ProductDetailScreen.test.jsx` | 13 | Title, not-found, ADD TO BAG, sold-out disabled sizes, size auto-skip, thumbnail gallery swap, wishlist toggle, accordions |
| `screens/CartScreen.test.jsx` | 7 | Empty state, seeded item display, qty controls, remove item, subtotal, checkout navigate |
| `screens/WishlistScreen.test.jsx` | 12 | Empty state, item seeding, piece count, MOVE TO BAG with size label, remove aria-label, multi-item, price format, toggle-off restores empty |
| `screens/CheckoutScreen.test.jsx` | 13 | Form sections, submit button, empty/seeded cart summary, Grand Total, card/expiry/CVV formatting, full submit → success screen, email + ref code in confirmation |

**Run tests:**
```
npm test
```

---

## Architecture Decisions

**CSS Modules over Tailwind** — Each component and screen owns its own `.module.css` file. No global class leakage, no purge configuration, trivial to rename or delete without side effects.

**Context API over Redux** — Three lightweight contexts (Cart, Wishlist, UI) with `useCallback`-memoized functions. No boilerplate reducers. State is simple enough that Redux would add friction without benefit.

**Local data modules over API calls** — All 25 products live in `src/utils/data/products.js`. Deterministic rendering, no network dependency, instant iteration. The `productIndex` map provides O(1) lookup for PDP and related product resolution.

**Context seeding in tests** — Instead of mocking context values, test files render real provider trees and trigger real state mutations via helper buttons. This tests actual context behavior rather than testing against mocked state that may diverge from production.

**`tests/` outside `src/`** — Test files live at project root under `tests/`, not inside `src/`. This keeps test infrastructure clearly separate from production code and avoids accidentally bundling test utilities.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run production build
npm run build

# Run all tests
npm test
```

---

## Design Reference

The file `design/design-reference.html` is the single source of truth for all visual decisions — spacing, color, typography scale, grid ratios, animation timing. All CSS values in this project were derived from or cross-checked against that reference.
