# Pokédex Explorer

A modern, responsive Pokémon explorer built with **React**, **TypeScript**, and **Tailwind CSS**, powered entirely by the public [PokéAPI](https://pokeapi.co/). Browse, search, filter, sort, favorite, and compare Pokémon in a fast, polished interface.

**Live features:** card-based browsing with infinite "Load More," name search, type filtering, stat-based sorting, a detailed stat readout per Pokémon, favorites, side-by-side comparison, and full light/dark theming — all client-side, no backend required.

---

## ✨ Features

### Core
- **Pokémon listing** — responsive card grid (2 → 5 columns) with artwork, name, Pokédex number, and type badges styled per type.
- **Search** — debounced search by exact name, with a friendly "not found" state for typos or invalid names.
- **Load More pagination** — fetches 20 Pokémon at a time instead of loading the whole Pokédex up front.
- **Detail view** — dedicated page per Pokémon (`/pokemon/:name`) with large artwork, height/weight, abilities, animated base-stat bars, and a scrollable moves list. Includes prev/next navigation between Pokédex numbers.
- **Type filtering** — filter the grid by any of the 18 battle types, fetched live from `/type`. Only lightweight name/URL references are fetched up front; full detail data is hydrated 20 at a time as you page through, exactly like browse mode — selecting a type never fires 100+ requests at once.
- **Responsive design** — tested down to small mobile widths, up through desktop.
- **Loading states** — shimmer skeleton cards, never a bare "Loading…" string.
- **Error handling** — distinguishes network failures, 404s, and server errors, each with a clear message and a **Try again** button.
- **Empty states** — friendly, actionable messaging when a search or filter returns nothing.

### Bonus
- ❤️ **Favorites** — saved to `localStorage` behind a shared `FavoritesContext` (single source of truth, no per-component drift), with a dedicated `/favorites` page and a live count badge in the header.
- 🌗 **Dark mode** — persisted toggle, respects system preference on first visit.
- ↕️ **Sorting** — by Pokédex number, name, Attack, Speed, or HP.
- ⚖️ **Compare** — select two Pokémon from the grid and compare their base stats side by side at `/compare`.
- ⌨️ **Keyboard & screen-reader friendly** — labeled controls, visible focus rings, semantic buttons/links.
- 🔗 **URL-based routing** — every view (detail, compare, favorites) is a real, shareable URL via React Router.

---

## 🧱 Tech stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Framework  | React 19 + TypeScript                     |
| Build tool | Vite                                      |
| Styling    | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing    | React Router v7                           |
| Icons      | lucide-react                              |
| Data       | [PokéAPI](https://pokeapi.co/api/v2/) — no auth required |

---

## 📁 Project structure

```
pokemon-explorer/
├── src/
│   ├── components/          # Reusable UI building blocks
│   │   ├── ui/
│   │   │   └── TypeBadge.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TypeFilter.tsx
│   │   ├── SortSelect.tsx
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonGrid.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── StatBar.tsx
│   │   └── CompareBar.tsx
│   ├── pages/                # Route-level views
│   │   ├── HomePage.tsx
│   │   ├── DetailPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   └── pokeapi.ts         # All PokéAPI calls + error normalization
│   ├── hooks/
│   │   ├── usePokemonExplorer.ts  # Search / filter / sort / pagination state
│   │   ├── useDebounce.ts
│   │   └── useDarkMode.ts
│   ├── context/
│   │   ├── CompareContext.tsx
│   │   └── FavoritesContext.tsx   # Single source of truth for favorites (localStorage-backed)
│   ├── types/
│   │   └── pokemon.ts         # PokéAPI response + app-level types
│   ├── utils/
│   │   └── typeColors.ts      # Type → color/gradient theme map
│   ├── App.tsx                 # Routes
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + design tokens
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## 🎨 Design notes

The visual language borrows from a physical Pokédex device rather than a generic dashboard: a warm cream/near-black theme, a Pokédex-red accent, monospace numerals for IDs and stats (like a device readout), and a subtle diagonal "scanline" texture on card headers and the detail-page hero. Every type gets its own two-stop gradient so cards and the detail screen carry real color identity instead of a single flat swatch.

Type colors follow the assignment's palette (Fire → red/orange, Water → blue, Grass → green, Electric → yellow, Psychic → pink, Ghost → purple) extended to cover all 18 official types.

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+ and npm

### Install & run

```bash
cd pokemon-explorer
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

Outputs an optimized static bundle to `dist/`.

### Preview the production build locally

```bash
npm run preview
```

---

## 🌐 API usage

All requests go straight to `https://pokeapi.co/api/v2/` — no API key needed.

| Purpose            | Endpoint                                  |
|---------------------|--------------------------------------------|
| Paginated list      | `GET /pokemon?limit=20&offset=0`          |
| Detail by name/ID   | `GET /pokemon/{name-or-id}`               |
| All types           | `GET /type`                               |
| Pokémon by type     | `GET /type/{type}`                        |

The list endpoint doesn't include sprites or types, so `fetchPokemonPage` hydrates each entry with a follow-up detail call. All API access is centralized in `src/services/pokeapi.ts`, which throws a typed `PokeApiError` (`'not-found' | 'network' | 'server'`) so the UI can branch on failure kind without string-matching error messages.

---

## ☁️ Deployment

This is a static single-page app — any static host works. Two common options:

### Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**. Every push to your main branch redeploys automatically.

Or via CLI:
```bash
npm install -g vercel
vercel        # first deploy, follow prompts
vercel --prod # promote to production
```

### Netlify

1. Push the project to a Git repo.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**.

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --build          # draft deploy
netlify deploy --build --prod   # production deploy
```

### Client-side routing note
Since this app uses React Router, direct visits to routes like `/pokemon/pikachu` need a rewrite rule pointing back to `index.html`:
- **Vercel:** works out of the box for Vite/SPA projects; if needed, add a `vercel.json` with a catch-all rewrite to `/index.html`.
- **Netlify:** add a `public/_redirects` file containing:
  ```
  /*  /index.html  200
  ```

---

## 📸 Screenshots

See [`/screenshots`](./screenshots) for `home.png`, `detail.png`, and `mobile.png` — drop in real captures of your running app before submitting (see that folder's README for exact shots to take).

---

## 🧗 Challenges faced

- **PokéAPI has no fuzzy/partial search or bulk-by-type detail endpoint.** `/type/{name}` returns only lightweight name/URL references for every member of a type — not the full detail payload search/cards need (sprite, stats, etc). The first pass fetched every member's full detail with `Promise.all` the moment a type was selected, which meant selecting a large type like Water (100+ Pokémon) fired 100+ concurrent requests, was slow, and risked PokéAPI's rate limits. This directly violated the "don't load everything at once" requirement.
  **Fix:** `fetchPokemonRefsByType` now does one cheap request for the full name/URL list, and `usePokemonExplorer` hydrates only the first 20 into full detail. "Load More" hydrates the next 20 from the same cached ref list — no re-fetching, no fetching Pokémon the user hasn't scrolled to yet.
- **Favorites state drifting across components.** Each card/page originally ran its own `useFavorites()` hook instance with an independent `localStorage`-backed `useState`, so a component could show a stale favorite/unfavorite state relative to another mounted at the same time. Centralizing this into a `FavoritesContext` (mirroring the existing `CompareContext` pattern) made favorites a single shared source of truth, and also made a live favorites-count badge in the header trivial to add.
- **Fixed CompareBar overlapping page content.** The comparison bar is `position: fixed` at the bottom of the viewport, which could sit on top of the "Load More" button on tall pages, especially on mobile. Fixed by reserving permanent bottom padding on the main content area sized to the bar's height, so there's never a layout jump when the bar appears or disappears.
- **Balancing type-based visual identity with accessibility.** Giving all 18 types distinct gradient themes while keeping text contrast (WCAG-friendly) on every combination took a few iterations — solved with a consistent light-text-on-dark-gradient pattern rather than per-type contrast tuning.

## 🔭 Future improvements

- **Smarter search UX** — instant client-side substring matching against already-loaded pages while the authoritative exact-match API call resolves in the background, so typing feels responsive even before the debounced request completes.
- **Server-side/edge caching** — a thin caching proxy (or PokéAPI's own CDN headers respected more aggressively) to cut down repeat requests across sessions, since PokéAPI responses are effectively static.
- **Virtualized list rendering** — swap the plain grid for a windowed/virtualized list (e.g. `react-window`) once a type or browse session accumulates hundreds of loaded cards, to keep DOM size and scroll performance bounded.
- **Deeper accessibility pass** — full keyboard trap management for any future modal, ARIA live-region announcements for search/filter result counts, and an automated audit (axe-core) in CI.
- **Richer animations** — shared-element/page transitions between the grid and detail view (e.g. via the View Transitions API) instead of a hard route swap.
- **Offline support** — a service worker caching visited Pokémon so the app remains browsable without a connection.

---

## 🧪 Notes on scope

- Search matches Pokémon by **exact name** (PokéAPI has no fuzzy/partial search endpoint); typos surface the "not found" empty state rather than silently failing. See "Future improvements" for a planned instant-partial-match layer on top of this.
- Type filtering fetches only lightweight name/URL references up front, then hydrates full detail data 20 at a time — first page on selection, further pages on "Load More" — exactly mirroring the browse-mode pagination pattern rather than fetching an entire type's data at once.
- Favorites and dark-mode preference persist in `localStorage`, are shared across the whole app via React Context, sync across same-origin tabs, and are scoped to the browser (not synced across devices).
