# Blue Letter World Expedition — Project Handoff

This document describes the **actual** repository as inspected on 22 Oct 2026. Implemented work and planned work are separated. File paths below exist in the working tree unless noted.

**Git snapshot at inspection**

- Branch: `main`, tracking `origin/main`
- Remote (verified): `https://github.com/kaixueyuyan/Blue-Letter.git`
- Latest commit: `c262cc5` — “Complete expedition passport and mission progress tracking”
- **Uncommitted locally:** Global Logbook (`app/logbook/`, `lib/logbook.ts`, `components/logbook/`, header Logbook tab)

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
5. Open Global Logbook: demo field notes, map pins, filters, story pages.

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

**Deployment:** README still contains the Create Next App Vercel boilerplate. **No Vercel project config was verified in this repo.** GitHub remote exists; HEAD at inspection is `c262cc5`.

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
  logbook/page.tsx           Global Logbook
  logbook/[slug]/page.tsx    Story detail (dynamic)
components/
  landing/                   Home-only sections
  layout/                    SiteHeader, SiteFooter
  missions/                  Library + detail + home featured card
  passport/                  expedition-passport, identity, stamps, progress, use-passport
  logbook/                   archive, map, featured, cards, story detail, visual plates
  ui/                        Shared primitives
lib/
  missions.ts                Home featured missions (4) + expedition steps
  mission-library.ts         Library list (10) + lookup helpers
  mission-details.ts         Extra copy keyed by library id
  passport.ts                Explorer mock identity, ranks, local progress store
  logbook.ts                 Eight fictional field notes; helpers; map projection
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

- `site-header.tsx` — sticky glass header; tabs Overview `/#top`, Brief `/#brief`, Missions `/missions`, Logbook `/logbook`, Passport `/passport`; CTA “Join the Expedition” → `/#join`. Locked tabs: `/missions*`, `/logbook*`, `/passport`. On Home, IntersectionObserver tracks hash sections.
- `site-footer.tsx` — gold rule + expedition tagline

### Mission data

| File | Role |
| --- | --- |
| `lib/missions.ts` | `featuredMissions` (4) for Home cards; `expeditionSteps` (I–III) |
| `lib/mission-library.ts` | Canonical **10** library rows: `id`, `number`, `title`, `description`, `category`, `difficulty`, `time`, `status` |
| `lib/mission-details.ts` | Extra copy per `id`: briefing, experience, why, objectives, reward stamp/text. Merges with library via `getMissionDossier(slug)`. Reuses Home `summary` / `fieldNote` / `stamp` for the four featured IDs when present. |
| `lib/passport.ts` | Mock explorer identity, rank table, **three-state progress store** (`not-started` / `in-progress` / `completed`) |
| `lib/logbook.ts` | Eight **fictional** field notes. `missionSlug` points at `LibraryMission.id`. Approximate `lat`/`lng` for the SVG chart only. |

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
| `/logbook` | `app/logbook/page.tsx` | Global Logbook gallery + map |
| `/logbook/[slug]` | `app/logbook/[slug]/page.tsx` | Story template; `generateStaticParams` from `logbookStories`; unknown slug → `notFound()` |
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

### Mission Detail (`/missions/[slug]`) — implemented

- Header: number, title, status, category, difficulty, time
- Briefing (what / experience / why)
- Objectives checklist (typically 5 steps)
- Reward stamp + copy
- **Accept Mission** (from NOT STARTED) → **IN PROGRESS**; stamp stays locked
- **Submit field report** → **PENDING PARTNER CONFIRMATION**. Demo panel then simulates partner confirmation and HQ review. Only **VERIFIED** unlocks the stamp
- Back to library; previous/next by library order
- Metadata title `${title} · Blue Letter`

### Expedition Passport (`/passport`) — implemented

- Route `app/passport/page.tsx`; body is client island `ExpeditionPassport` (reads storage after mount)
- Mock explorer identity from `explorerIdentity` in `lib/passport.ts` (not stored, not an account):
  - Name: Clara Moreau
  - Expedition ID: `BL-WE-26-0418`
  - Berth: Overseas correspondent · Expedition HQ
  - Join date: 12 March 2026
  - Rank derived from **completed** count (Cadet 0, Correspondent 1, Field Officer 4, Expedition Lead 7, Master Explorer 10)
- Ten unique visa stamps from `libraryMissions` + `getMissionDossier` reward copy
- Progress count/bar from **completed** missions only (accepted-but-unfinished do not count)
- Stamp click → `/missions/[id]`
- Stamp display follows the three progress states (see §8)

### Global Logbook (`/logbook`, `/logbook/[slug]`) — implemented

- **Demo archive only.** Eyebrows and captions say fictional / demonstration / not a verified student record. No uploads, comments, messaging, or real photos.
- Cover stories: two featured plates (`the-crate-that-smelled-of-rain`, `chili-cousins`) — magazine layout, large visuals, “Read field notes”.
- Expedition map: **Natural Earth 50m** country polygons, Natural Earth projection, navy ocean / parchment land / gold borders (`lib/world-atlas.ts`, regenerate with `scripts/build-world-atlas.mjs`). Gold pins from story `lat`/`lng` via `projectAtlasPoint`. Notes that share a coast cluster until zoomed. Hover shows region + country. Click opens a demo preview (title, mission, region, summary, Read field notes). Zoom, pan, and reset sit on the plate. No runtime mapping library. Home still uses the decorative `WorldMap`.
- Gallery: eight `StoryCard`s (title, mission, region, summary, date, gradient plate labeled “Demo plate · not a portrait”, “Read field notes”).
- Client filters: mission (from related library titles) and region; **All stories** clears both.
- Shared detail template `StoryDetail`: title, mission, region, date, visual, full story, discoveries, link to `/missions/{missionSlug}`, back to `/logbook`.
- Data: `lib/logbook.ts` — `LogbookStory`; lookups `getLogbookStory`, `getFeaturedStories`, `logbookRegions`, `logbookMissionFilters`. Related missions use existing library slugs; briefs are not duplicated.

### Interactions — implemented

| Interaction | Behavior |
| --- | --- |
| Header tabs | Hash links on Home; `/missions`; `/logbook`; `/passport` |
| Library category tabs | Client `useState` filter; not persisted |
| Home featured status tabs | Client filter on `featuredMissions.status` |
| Library card click | Navigates to detail |
| Accept Mission | NOT STARTED → IN PROGRESS in localStorage; survives refresh; does **not** unlock stamp |
| Submit field report | IN PROGRESS → pending partner confirmation. Text and attachment metadata stay in localStorage |
| Demo verification | Partner confirmation → pending admin review → verified. Stamp unlocks only then |
| Previous / Next | Static links from adjacent library rows |
| Passport stamps | Link to `/missions/[id]`; locked unless completed |
| Logbook filters | Client-only mission + region tabs; **All stories** resets both |
| Logbook map pins | Hover region/country; click opens preview; clustered notes split as you zoom; **View in gallery** scrolls to the card |
| Story card / featured CTA | `/logbook/[slug]` |

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
| gold | `#b89a5c` | Rules, borders, stamps, and gold text on navy | 
| gold-ink | `#7a653c` | Small gold text on ivory or paper (WCAG AA, about 5:1) |
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
- **Client islands only where needed:** filters, header scroll spy, accept/complete actions, passport body, tab indicator. Pages themselves are Server Components.
- **One progress store:** Detail and Passport both use `usePassport()` → `lib/passport.ts`. Do not add a second localStorage key for the same states.
- **Library `status` ≠ explorer progress.** Catalog copy on library cards (`Open berth`, `In the field`, `Logged`, `Sealed`) is static mock data. Explorer progress is `not-started` / `in-progress` / `completed` in localStorage.
- **Naming:** kebab `id` slugs; `LibraryCard` vs Home `MissionCard`; Tailwind `font-display`, color tokens `text-ink`, `bg-navy`, `text-gold` (accents and navy), `text-gold-ink` (labels on ivory/paper).
- **cacheComponents:** dynamic detail page awaits `params` inside a child wrapped in `<Suspense>` (required in this Next 16 setup).
- **Dependencies:** no extra packages beyond CNA defaults (Next, React, Tailwind, ESLint, TS).
- **Logbook vs Passport:** Logbook is a curated fictional archive (`lib/logbook.ts`). Passport is this browser’s explorer progress. Completing a mission does **not** write a logbook story.
- **Lightweight map:** Natural Earth 50m SVG atlas in `lib/world-atlas.ts`. Do not add Leaflet/Mapbox. Home `WorldMap` stays decorative.

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
- Next.js may warn about `scroll-behavior: smooth` on `<html>` during client navigations
- Default Next 404 for unknown slugs; not branded
- Logbook map is a Natural Earth plate with zoom and pan, not a street map. Gallery filters do not hide map pins.
- Two library missions (`my-corner-of-the-world`, `secret-mission`) have no demo field note yet

**Phase 6A polish (done)**

- Home featured filters scroll horizontally, matching the library and logbook, so 375px does not widen the page
- Mobile header tabs use a tighter pill and scroll the selected tab into view. Logbook and Passport stay on the same row
- Passport progress uses `useSyncExternalStore` (same `blue-letter.passport.v1` key). Segmented-tab indicator no longer sets state just to mark mount
- `text-gold-ink` (`#7a653c`) is for gold labels on ivory/paper. Accent gold `#b89a5c` stays on borders, stamps, and navy
- Keyboard focus uses a gold-ink ring on light surfaces and the original gold ring on navy (map controls, on-dark buttons)

---

## 8. Mission progress tracking (**implemented**)

Explorer progress is a **frontend demo** in this browser only. It is not authentication, not enrollment, and not a real review by a partner or HQ.

### Five states

Stored values use kebab-case. The UI labels them in title case.

| State | Stored `status` | How it is reached | Mission Detail | Passport stamp | Counts as verified? |
| --- | --- | --- | --- | --- | --- |
| **NOT STARTED** | *(id absent)* | Default | **Accept Mission** | Locked, “Not started” | No |
| **IN PROGRESS** | `in-progress` | **Accept Mission** | **Submit field report** opens the report form. Stamp stays locked | Locked, “In progress” | No |
| **PENDING PARTNER CONFIRMATION** | `pending-partner` | Submit a reflection and a discovery note. Optional attachment metadata only | Confirmation copy plus **Demo verification panel** → **Simulate partner confirmation** | Locked, “Awaiting partner” | No |
| **PENDING ADMIN REVIEW** | `pending-admin` | Demo partner confirmation | Same panel → **Simulate admin review** | Locked, “Awaiting review” | No |
| **VERIFIED** | `verified` | Demo admin review | Stamp copy and date | Unlocked, verification date | Yes — count, bar, rank |

There is no **Mark as completed** control. A stamp unlocks only from `verified`.

Rules in `lib/passport.ts`:

- `acceptMission` writes `in-progress` only if that id is absent.
- `submitFieldReport` writes `pending-partner` plus the text report only from `in-progress`. Empty text is ignored. Attachment metadata is name, type, and size. File bytes are not stored.
- `confirmPartner` moves `pending-partner` → `pending-admin`.
- `approveReview` moves `pending-admin` → `verified` and sets `verifiedAt`.
- Unknown mission ids are ignored.

### localStorage persistence

| Item | Actual |
| --- | --- |
| Key | `blue-letter.passport.v1` (`PASSPORT_STORAGE_KEY`) |
| Event | `blue-letter-passport` dispatched after writes; `storage` listened for other tabs |
| Hook | `components/passport/use-passport.ts` — `useSyncExternalStore`; server snapshot until the client store is read |
| Readers | Mission Detail (`AcceptMission`) and Passport (`ExpeditionPassport`) |

Payload (`version: 3`):

```json
{
  "version": 3,
  "missions": {
    "treasure-hunt": {
      "status": "pending-partner",
      "acceptedAt": "2026-10-22T05:14:10.509Z",
      "report": {
        "reflection": "We looked for the unnamed stone.",
        "discovery": "The nearest cousin was a river pebble.",
        "submittedAt": "2026-11-02T03:00:00.000Z",
        "attachment": { "name": "pebble.jpg", "type": "image/jpeg", "size": 1200 }
      }
    }
  }
}
```

- **Not stored:** explorer name, expedition ID, join date, rank, or file contents.
- **SSR:** `readPassport()` / `writePassport()` no-op when `typeof window === "undefined"`.
- **Legacy:** version 1 `{ "completed": { id: date } }` and version 2 `status: "completed"` migrate on read to `verified` with that date as `verifiedAt`, then rewrite as version 3. Prior demo stamps stay in the book. A `completed` entry without a date falls back to `in-progress`.

Clearing the key in DevTools resets all explorer progress to NOT STARTED.

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
2. Run `npm run dev` → `/`, `/missions`, `/missions/mission-crate`, `/passport`, `/logbook`, `/logbook/chili-cousins`.
3. Progress lives in one store; do not add a second localStorage key for the same states.
4. Logbook stories are demo fiction in `lib/logbook.ts`; do not treat them as real student records.

---

## 10. Privacy and safety (minors)

Blue Letter involves children. Current product rules that are **already encoded in copy and architecture**:

- Fictional names only (e.g. “Crew 07”); no real student names
- Region-level pins only — not homes, schools, or GPS
- Gradient visual plates, not identifying photographs
- No public uploads, comments, or messaging
- Pages labeled as demonstration / not verified records

Do not add real participant content, geolocation, or UGC without a separate safety design.

---

## 11. Suggested next work (not built)

- Custom branded 404
- Optional: Home featured cards linking to `/missions/[slug]`
- Product copy / README aligned with this expedition (README is still Create Next App)
- Future phases only if requested: pairing, real submissions, accounts — none of these should ship without privacy review

Passport progress and Global Logbook (demo archive) are **done**. Do not rebuild them unless asked.
