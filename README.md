# Pokédex Explorer

A modern, responsive Pokémon explorer built with **React**, **TypeScript**, and **Tailwind CSS**, powered entirely by the public [PokéAPI](https://pokeapi.co/). Browse, search, filter, sort, favorite, and compare Pokémon in a fast, polished interface.

🔗 **Live demo:** [pokemon-explorer-brown-sigma.vercel.app](https://pokemon-explorer-brown-sigma.vercel.app/)
📦 **Source:** [github.com/supreetgupta93/pokemon-explorer](https://github.com/supreetgupta93/pokemon-explorer)

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

