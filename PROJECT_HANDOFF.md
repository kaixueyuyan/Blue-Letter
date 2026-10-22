# Blue Letter World Expedition — Project Handoff

This document describes the **actual** repository as inspected on 22 Oct 2026. Implemented work and planned work are separated. File paths below exist in the working tree unless noted.

**Git snapshot at inspection**

- Branch: `main`, tracking `origin/main`
- Remote (verified): `https://github.com/kaixueyuyan/Blue-Letter.git`
- Latest **committed** commit: `8a2364b` — “Refine mission library copy”
- **Uncommitted in the working tree** (implemented locally, not on GitHub at inspection):
  - `app/missions/[slug]/`
  - `lib/mission-details.ts`
  - `components/missions/mission-detail.tsx`
  - `components/missions/accept-mission.tsx`
  - plus related edits to `lib/mission-library.ts`, `components/missions/library-card.tsx`, `components/layout/site-header.tsx`, `components/ui/segmented-tabs.tsx`

Treat Mission Detail as **implemented in the local tree**, not as already shipped to `origin` until those files are committed and pushed.

---

## 1. Project overview

**Blue Letter World Expedition** is a cultural-exchange site. Rural Chinese children and overseas volunteers complete the **same missions** from two latitudes. The product copy frames this as an expedition (shared assignments, letters, stamps), not a charity donation page.

**Audience (from site copy, not from a backend)**

- Overseas volunteers considering a crew berth
- Partner rural schools / children as field correspondents
- Anyone browsing the public mission board

**Intended user experience (as built)**

1. Land on Home: editorial hero, how a crew is formed, four featured missions, join CTA.
2. Open the Mission Library: ten briefs as berths, filter by category.
3. Open a Mission Detail dossier: briefing, checklist, reward stamp, accept / demo-complete, previous/next.
4. Open Expedition Passport: mock explorer identity, stamps, and local progress.

There is **no** login, matching, or real submission flow. Accept and complete are a local demo log.

---

## 2. Tech stack

| Layer | Actual |
| --- | --- |
| Framework | Next.js **16.4.1** App Router |
| UI | React **19.3.0**, React DOM **19.3.0** |
| Language | TypeScript **5** (`strict: true`) |
| Styling | Tailwind CSS **4** via `@import "tailwindcss"` and `@tailwindcss/turbopack` |
| Fonts | `next/font/google`: **Cormorant Garamond** (display/serif), **Outfit** (sans/UI) |
| Path alias | `@/*` → repo root (`tsconfig.json`) |
| Lint | ESLint 9 + `eslint-config-next` 16.4.1 |

**Runtime config** (`next.config.ts`): `cacheComponents: true`, `partialPrefetching: true`, `experimental.agentFeedback: true`, Turbopack CSS rule for Tailwind.

**Commands** (`package.json`)

```bash
npm run dev    # next dev
npm run build  # next build
npm run start  # next start
npm run lint   # eslint
```

**Not present:** database, auth library, CMS, form backend, tests.

**Client persistence:** `localStorage` key `blue-letter.passport.v1` (mission progress only; not auth).

**Deployment:** README still contains the Create Next App Vercel boilerplate. **No Vercel project config was verified in this repo.** GitHub remote exists; last pushed commit at inspection is `8a2364b`.

---

## 3. Current project structure

```
app/
  layout.tsx                 Root layout, fonts, metadata
  globals.css                Design tokens, utilities, motion
  page.tsx                   Home
  missions/page.tsx          Mission Library
  missions/[slug]/page.tsx   Mission Detail (dynamic)
  passport/page.tsx          Expedition Passport
components/
  landing/                   Home-only sections
  layout/                    SiteHeader, SiteFooter
  missions/                  Library + detail + home featured card
  passport/                  Passport identity, stamps, progress
  ui/                        Shared primitives
lib/
  missions.ts                Home featured missions (4) + expedition steps
  mission-library.ts         Library list (10) + lookup helpers
  mission-details.ts         Extra copy keyed by library id
  passport.ts                Explorer mock identity, ranks, local progress store
  cn.ts                      Class name join helper
public/                      Default CNA SVGs (unused by current pages)
```

Root layout does **not** wrap header/footer. Each page composes `SiteHeader` + `SiteFooter`.

### Shared UI (`components/ui/`)

- `button-link.tsx` — pill links (`primary` / `secondary` / `onDark`)
- `paper-card.tsx` — lifted ivory card, optional ruled background
- `stamp.tsx` — rounded status/reward chips (`red` / `navy` / `gold`)
- `section-heading.tsx` — eyebrow + h2 + kicker (Home)
- `segmented-tabs.tsx` — sliding-pill tabs; supports `href` (Next `Link` unless hash-only `#`)
- `world-map.tsx` — decorative SVG map + compass (Home hero)

### Layout

- `site-header.tsx` — sticky glass header; tabs Overview `/#top`, Brief `/#brief`, Missions `/missions`, Passport `/passport`; CTA “Join the Expedition” → `/#join`. Missions tab stays selected on `/missions*`; Passport on `/passport`. On Home, IntersectionObserver tracks hash sections.
- `site-footer.tsx` — gold rule + expedition tagline

### Mission data

| File | Role |
| --- | --- |
| `lib/missions.ts` | `featuredMissions` (4) for Home cards; `expeditionSteps` (I–III) |
| `lib/mission-library.ts` | Canonical **10** library rows: `id`, `number`, `title`, `description`, `category`, `difficulty`, `time`, `status` |
| `lib/mission-details.ts` | Extra copy per `id`: briefing, experience, why, objectives, reward stamp/text. Merges with library via `getMissionDossier(slug)`. Reuses Home `summary` / `fieldNote` / `stamp` for the four featured IDs when present. |

**Library slugs (`id` = URL slug)**

| id | Number | Title |
| --- | --- | --- |
| `mission-crate` | 01 | Mission Crate |
| `one-second-on-earth` | 02 | One Second on Earth |
| `role-swap-24-hours` | 03 | Role Swap 24 Hours |
| `cook-my-hometown` | 04 | Cook My Hometown |
| `story-relay` | 05 | Story Relay |
| `time-capsule` | 06 | Time Capsule |
| `treasure-hunt` | 07 | Treasure Hunt |
| `teach-me-one-phrase` | 08 | Teach Me One Phrase |
| `my-corner-of-the-world` | 09 | My Corner of the World |
| `secret-mission` | 10 | Secret Mission |

### Routing

| URL | File | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home |
| `/missions` | `app/missions/page.tsx` | Library |
| `/missions/[slug]` | `app/missions/[slug]/page.tsx` | `generateStaticParams` from `libraryMissions`; unknown slug → `notFound()` |
| `/passport` | `app/passport/page.tsx` | Expedition Passport (client island for localStorage) |
| No API routes | — | — |

Home `#top`, `#brief`, `#missions`, `#join` are in-page section ids, not separate routes.

---

## 4. Completed features

### Home (`/`) — implemented

- Navy cinematic hero, map, compass, two CTAs (`#join`, `#missions`)
- Expedition brief: field note + three steps from `expeditionSteps`
- Featured missions: **four** cards from `featuredMissions`, filter tabs All / Recruiting / In the field / Logged
- Join CTA block (copy + link to `#missions`; **no form**)
- Header / footer as above

Home featured cards (`MissionCard`) are **not** linked to detail pages.

### Mission Library (`/missions`) — implemented

- Intro copy, category filter pills (All + unique categories)
- Ten `LibraryCard`s: number, status stamp, title, description, category, difficulty, time
- Cards wrap `Link` to `/missions/${id}`

### Mission Detail (`/missions/[slug]`) — implemented **in the local working tree**

- Header: number, title, status, category, difficulty, time
- Briefing (what / experience / why)
- Objectives checklist (typically 5 steps)
- Reward stamp + copy
- **Accept Mission** → local **in progress** (stamp stays locked)
- **Mark as completed** (only after accept) → local **completed**, stamp date, demo disclaimer
- Back to library; previous/next by library order
- Metadata title `${title} · Blue Letter`

### Expedition Passport (`/passport`) — implemented

- Mock explorer identity (Clara Moreau), expedition ID, rank, join date
- Ten unique visa stamps from library + `getMissionDossier` reward copy
- Progress count/bar from **completed** missions only
- Stamp states: not started (locked), in progress (locked + gold label), completed (unlocked + date)

### Interactions — implemented

| Interaction | Behavior |
| --- | --- |
| Header tabs | Hash links on Home; `/missions` for Missions; `/passport` for Passport |
| Library category tabs | Client `useState` filter; not persisted |
| Home featured status tabs | Client filter on `featuredMissions.status` |
| Library card click | Navigates to detail |
| Accept Mission | Sets `in-progress` in `localStorage`; survives refresh; does **not** unlock stamp |
| Mark as completed | Allowed only from in-progress; sets `completed` + date; unlocks stamp; demo only |
| Previous / Next | Static links from adjacent library rows |
| Passport stamps | Link to `/missions/[id]`; locked unless completed |

### Other

- Path alias `@/`
- `cn()` helper
- Reduced-motion CSS for listed animations
- **No** custom `app/not-found.tsx` (Next default 404)

---

## 5. Design system

**Identity:** luxury editorial expedition — ivory field, navy hero/CTA, gold rules and eyebrows, passport stamps. Not parchment/airmail (that look was replaced).

### Colors (`app/globals.css` `@theme inline`)

| Token | Hex | Typical use |
| --- | --- | --- |
| ivory / background | `#f4f1ea` | Page canvas |
| paper / parchment | `#fbfaf6` | Cards |
| ink | `#0e1320` | Body text |
| ink-soft | `#5b6272` | Secondary text |
| navy | `#0b1c3d` | Hero, pills, primary buttons |
| air-blue | `#1a3a73` | Button hover |
| air-red | `#8a3a32` | “Open berth” stamp |
| gold | `#b89a5c` | Eyebrows, labels, gold stamps |
| wax | `#6e4a32` | Token exists; little current use |

Utilities: `.site-canvas`, `.surface-lift`, `.gold-rule`, `.hairline`, `.animate-ink`, `.route-dash`, `.compass-spin`.

### Typography

- **Display / serif:** Cormorant Garamond — `font-display` (titles, italic briefing lines)
- **Sans:** Outfit — body, tabs, stamps, buttons
- UI labels: ~11px, wide tracking, uppercase, gold or ink-soft
- Buttons: ~12px, tracking `0.18em`, uppercase, `rounded-full`

### Layout patterns

- Max width `max-w-6xl` for site chrome and library/home grids; detail dossier `max-w-3xl`
- Horizontal padding `px-5 sm:px-8`
- Sticky header with gold hairline + ivory/blur bar
- Cards: `rounded-[1.6rem]`, paper fill, gold top hairline, lift shadow
- Grids: Home featured and library `md:grid-cols-2`

### Component styles

- Segmented tabs: navy sliding pill, ivory selected text
- Stamps: `rounded-full` border chips (not rotated wax seals)
- Primary button: navy fill, ivory text
- Secondary: hairline border, paper fill

---

## 6. Architectural decisions

- **Page-composed chrome:** header/footer imported per page, not in `app/layout.tsx`.
- **Two mission datasets:** Home keeps a richer 4-item `Mission` type (`code`, `origin`, `fieldNote`, status `Recruiting | In the field | Logged`). Library/detail use `LibraryMission` with `Open berth | In the field | Logged | Sealed`. IDs overlap for the first four missions; **do not assume the types are interchangeable**.
- **Data-driven details:** one `[slug]` page; `getMissionDossier` merges library row + detail copy. Slug **is** `LibraryMission.id`.
- **Avoid duplicating featured summaries:** `mission-details.ts` reads `featuredMissions` for briefing/stamp/field note on those four IDs.
- **Client islands only where needed:** filters, header scroll spy, accept button, tab indicator. Pages themselves are Server Components.
- **Naming:** kebab `id` slugs; `LibraryCard` vs Home `MissionCard`; Tailwind `font-display`, color tokens `text-ink`, `bg-navy`, `text-gold`.
- **cacheComponents:** dynamic detail page awaits `params` inside a child wrapped in `<Suspense>` (required in this Next 16 setup).
- **Dependencies:** no extra packages beyond CNA defaults (Next, React, Tailwind, ESLint, TS).

---

## 7. Current limitations

**Mock data only.** No API, database, CMS, or env-based content.

**Missing backend / product features**

- No authentication or accounts
- No real student or volunteer records
- No mission enrollment, pairing, or submissions
- Join CTA is static copy
- Accept / complete are a **browser demo**, not verified mission work
- Home featured cards do not deep-link to `/missions/[slug]`
- No custom 404 page
- `README.md` still describes Geist / Create Next App, not this product

**Known issues / unfinished interactions**

- Header “Join the Expedition” always goes to `/#join` (Home join section), including from Library/Detail
- Library and Home use **different status vocabularies** for overlapping missions (e.g. Home “Recruiting” vs Library “Open berth”)
- Mission Detail + library card linking exist locally; **not in `origin/main` at inspection** (`8a2364b`)
- Next.js may warn about `scroll-behavior: smooth` on `<html>` during client navigations
- Default Next 404 for unknown slugs; not branded

---

## 8. Mission progress store (**implemented**)

Single key: `localStorage["blue-letter.passport.v1"]`.

```json
{
  "version": 2,
  "missions": {
    "mission-crate": {
      "status": "completed",
      "acceptedAt": "2026-10-22T…",
      "completedAt": "2026-10-22T…"
    },
    "treasure-hunt": {
      "status": "in-progress",
      "acceptedAt": "2026-10-22T…"
    }
  }
}
```

- Missing id → **not started**
- `in-progress` → accepted; stamp locked; does not count toward completed
- `completed` → stamp unlocked; date shown; counts toward rank/progress
- Legacy v1 `{ "completed": { "<id>": "<iso>" } }` migrates those ids to **completed** (progress is not dropped)
- Explorer identity remains mock constants in `lib/passport.ts`, not stored
- `usePassport()` is the shared client hook for Detail and Passport

---

## 9. Development rules

- Preserve the existing design system (navy / ivory / gold, Outfit + Cormorant, pills, paper cards, stamps).
- Reuse existing components and mission data; extend `lib/` rather than duplicating the 10 briefs.
- Do not add dependencies unless unavoidable.
- Do not modify unrelated pages. Home and Library should stay visually as they are unless a change is required for Passport integration (e.g. wiring Accept).
- No authentication, no database, no real student/volunteer PII.
- Mock data and `localStorage` only; no real student records.
- Prefer small copy or wiring changes over redesigns.

---

## Quick start for the next agent

1. Read this file, then `lib/passport.ts`, `app/passport/page.tsx`, `app/missions/[slug]/page.tsx`.
2. Run `npm run dev` → `/`, `/missions`, `/missions/mission-crate`, `/passport`.
3. Progress lives in one store; do not add a second localStorage key for the same states.
