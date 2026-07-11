# Weather Clean Utility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a cleaner weather utility UI and repair city search behavior.

**Architecture:** Keep the existing React components and CSS modules. Update the search component behavior, then refresh global theme tokens, home layout, shell spacing, and the weather card.

**Tech Stack:** React, Vite, Ant Design, CSS Modules, TanStack Query, OpenWeatherMap.

## Global Constraints

- No new UI framework.
- Keep Ant Design.
- Keep Russian visible copy.
- Keep dark and light themes.
- Build must pass with `npm run build`.

---

### Task 1: Fix Search

**Files:**
- Modify: `frontend/src/components/SearchBar/SearchBar.jsx`

**Interfaces:**
- Consumes: `getCitiesByQuery(q, limit)`, `useWeatherStore().dispatch`, `useNavigate()`
- Produces: reliable selection by unique autocomplete value and Enter fallback

- [ ] Create unique option values from city name, country, lat, lon.
- [ ] Add shared `selectCity(city)` helper.
- [ ] Add `onInputKeyDown` so Enter selects the first enabled result.
- [ ] Keep error and empty states readable.

### Task 2: Refresh App Visual System

**Files:**
- Modify: `frontend/src/index.css`
- Modify: `frontend/src/components/AppShell/AppShell.module.css`
- Modify: `frontend/src/pages/HomePage/HomePage.jsx`
- Modify: `frontend/src/pages/HomePage/HomePage.module.css`

**Interfaces:**
- Consumes: current CSS variables
- Produces: lightweight background, stronger hero search area, better favorite chips

- [ ] Replace base64 image background with CSS gradients.
- [ ] Add tokens for surface, accent, radius, and focus states.
- [ ] Recompose home page with hero copy and search panel.
- [ ] Improve favorite city chips.

### Task 3: Improve Weather Card

**Files:**
- Modify: `frontend/src/components/WeatherCard/WeatherCard.jsx`
- Modify: `frontend/src/components/WeatherCard/WeatherCard.module.css`

**Interfaces:**
- Consumes: existing weather data and child metric blocks
- Produces: clearer current weather header, better loading state, responsive metrics grid

- [ ] Give current weather a stronger visual hierarchy.
- [ ] Move details into CSS classes instead of inline style.
- [ ] Improve card surface, spacing, and responsive grid.
- [ ] Keep reduced-motion handling.

### Task 4: Verify

**Files:**
- Build output only

- [ ] Run `npm run build`.
- [ ] Confirm no React runtime error and Vite build succeeds.
