# CHANGELOG — Firebelly Pizza Minisite Template

---

## Pass 2 — Fix pass

**Date:** 2026-05-28  
**Source:** Output of Pass 1 (`firebelly-template/`)

---

### P1 — Business-safe ordering logic

#### What changed

Config now carries `startTime` and `endTime` (24-hour `"HH:MM"`) on every schedule entry alongside the existing human-readable `hours` string.

A new `getTradingStatus()` function in `app.js` computes one of four states at runtime by comparing `new Date()` to those fields:

| State | Condition |
|---|---|
| `open_now` | Today has a schedule entry, `isOpen: true`, and current time is within `startTime`–`endTime` |
| `opening_later` | Same entry exists and `isOpen: true`, but current time is before `startTime` |
| `closed_today` | Same entry exists and `isOpen: true`, but current time is past `endTime` |
| `no_service` | No entry for today, or entry has `isOpen: false` |

#### Ordering disabled when not open

- **Hero badge** reflects the state precisely: `"Open now"`, `"Opening at 4:30pm"`, or `"Not trading today"`. Badge colour changes per state (fire, kraft, smoke).
- **Menu add buttons** become a disabled `add-btn--closed` button labelled `"Opens 4:30pm"` or `"Not ordering today"` when `!isOrderingOpen()`. The menu is still fully browsable.
- A **closed banner** appears at the top of the first menu tab when ordering is closed, explaining why.
- **Order panel** renders an `order-closed` state when `!isOrderingOpen()`, showing the next upcoming stop and links to the schedule and events sections. The order footer (total, time select, WhatsApp button) gets `opacity: 0.35; pointer-events: none` via the `.is-ordering-closed` class on `#order`.
- `sendWhatsApp()` guards with `isOrderingOpen()` and alerts before doing anything else.
- **Private event enquiries always work.** The events section CTA is unaffected by trading status.

#### Design decision: time-aware vs. day-aware

The previous logic treated a whole day as "open" if an entry existed. This meant a customer visiting at 9am on a Friday that only opens at 4:30pm saw "Open now". The new `startTime`/`endTime` fix this without adding operational complexity — the operator still only touches the config file. The `isOpen` flag remains for cancellations (bad weather, mechanical issue) where the entry should be suppressed entirely.

#### UX tradeoff

When `state === 'closed_today'` (service has finished for the day), the quick pre-order link on the schedule card is hidden. Users can still see upcoming stops and the next location. The order panel shows a "Not taking orders right now" message rather than an active cart. This is correct: an order sent after service ends cannot be fulfilled.

---

### P2 — True snap experience restored

#### What changed

**Root cause:** `.panel { min-height: 100svh }` allowed content-heavy panels to grow beyond one viewport, breaking the snap rhythm. Panels must be *exactly* one screen tall.

**Fix:** Changed `.panel` from `min-height: 100svh` to `height: 100svh` in `base.css`. Combined with `overflow: hidden` on each panel, no panel can grow beyond one viewport.

**Scrollable inner containers:** For sections with more content than fits in one viewport, the inner wrapper becomes the scroll area:

| Panel | Scroll container | Implementation |
|---|---|---|
| `#today` | `.today-inner` | `flex: 1; overflow-y: auto; padding-bottom: var(--nav-h)` |
| `#menu` | `.menu-list` | `flex: 1; overflow-y: auto; padding-bottom: var(--nav-h)` |
| `#order` | `.order-body` | `flex: 1; overflow-y: auto; min-height: 0` |
| `#social` | `.social-inner` | `flex: 1; overflow-y: auto; padding-bottom: var(--nav-h); min-height: 0` |
| `#hero`, `#events` | — | Content fits naturally in one viewport |

`min-height: 0` is required on flex children so they can shrink below their content size; without it some browsers refuse to scroll the inner container.

**Safe area:** Every scrollable container gets `padding-bottom: var(--nav-h)` where `--nav-h = var(--bar-h) + env(safe-area-inset-bottom)`. This ensures the last list item is never hidden behind the fixed bottom nav on any device, including iPhone home-indicator devices.

**Order panel height budget:**  
`order-header` (~76px) + `order-footer` (~230px including nav-h clearance) leaves ≥ 250px for `order-body` on the smallest supported viewport (600px). Sufficient for 2–3 cart items.

**Snap stop tuning:** `#today` moved to `scroll-snap-stop: normal` to match the other scrollable panels (`#menu`, `#order`, `#social`). This prevents users feeling trapped when swiping through a section with internal scroll.

---

### P3 — Desktop feels designed

#### What changed

A fixed `.desktop-sidebar` element was added to `index.html` and styled in `components.css`. It is `display: none` on mobile and becomes `position: fixed; left: 0` on screens ≥ 900px, occupying the empty left margin beside the centred 480px panel column.

**Sidebar content:**
- Business name (from `config.business.titleLine1 + titleLine2`)
- Tagline (from `config.business.tagline`)
- Live trading status badge (computed by `getTradingStatus()`, same states as hero badge)
- Quick nav links: View menu, Find us today, Pre-order, Private event, Reviews
- Decorative fire mark

**Background:** On ≥ 900px, a `body::before` pseudo-element renders a warm dual-radial-gradient (fire + kraft tones) over the ink background, giving the desktop wrapper a branded atmospheric feel rather than a plain black void.

**Design decision: fixed sidebar over structural reflow**

An alternative was restructuring the HTML to use a CSS Grid with a snap-scroll column and a sidebar column. This would require wrapping all panels in a `.snap-container` div and moving the snap declarations off `html` onto that container. That is architecturally cleaner but would break any existing links/embeds pointing at `#section` hashes, and would add complexity to the scroll behaviour.

The fixed-sidebar approach keeps all existing snap/scroll behaviour intact, requires only one new HTML element and a media query, and still answers all the desktop requirements: branded background, business summary, quick actions, no empty margins.

**Tradeoff:** The sidebar is static in position regardless of which panel the user is currently viewing. It doesn't highlight the active section. A future improvement could add scroll-position detection to activate the corresponding nav link. Current behaviour is intentional — the sidebar is orientation, not navigation feedback.

---

### P4 — Hero title fixed

#### What changed

Config gains two fields: `business.titleLine1` and `business.titleLine2`, replacing the combined `name` + `nameSuffix` pattern.

`renderHero()` now renders:

```html
<h1>Firebelly<br><em>Pizza</em></h1>
```

This restores the original two-line rhythm: a large upright word followed by a line-break and the italic accent word. Both strings are HTML-escaped via `esc()` before insertion.

The CSS `hero-title` line-height is `0.9`, and `clamp(3rem, 13vw, 5rem)` is preserved for proportional scaling. The `<em>` inside the heading inherits `font-style: italic; color: var(--fire2)` from the shared heading em rule.

---

### P5 — Safer config rendering

#### What changed

**HTML escaping:** An `esc()` function was added to `app.js` that escapes `& < > " '` in all strings from config before they are passed to `innerHTML`. Previously, a config entry containing `<`, `>`, or `&` could break the rendered markup.

**Event delegation replacing inline onclick:**  
All `onclick=` attributes have been removed from both the static HTML and from app.js-generated markup. Instead:

| Old pattern | New pattern |
|---|---|
| `onclick="switchTab(this,'classics')"` | `data-cat="classics"` + listener on `#menuTabs` |
| `onclick="addToCart('id',this)"` | `data-action="add" data-id="id"` + listener on `#menuList` |
| `onclick="changeQty('id',-1)"` | `data-action="qty-minus" data-id="id"` + listener on `#orderBody` |
| `onclick="scrollToSection('order')"` | `data-scroll-to="order"` + listener in `bindEvents()` |
| `onclick="sendWhatsApp()"` | `id="whatsappBtn"` + `addEventListener` in `bindEvents()` |

The `bindEvents()` function is called once in `DOMContentLoaded`. Because `#orderBody` is re-rendered on cart changes, qty buttons use event delegation on the container — the listener is attached to `#orderBody` which persists, not to individual buttons that get replaced.

**Impact:** Item names, venue names, review text, and all other config-driven strings can now contain HTML special characters without breaking the page.

---

### P6 — Remaining limitations

1. **Trading status is read-only computed.** `startTime`/`endTime` are checked on page load. If the operator changes config mid-session (e.g., closes early), customers with the page already open won't see the update until they reload.

2. **No service-worker / offline support.** The page requires network access for Google Fonts and Unsplash images on first load.

3. **Cart clears on refresh.** No `localStorage` persistence.

4. **Instagram grid is static.** Images are placeholder Unsplash photos, not real Instagram posts.

5. **Desktop sidebar width scales with viewport.** On very wide screens (> 1600px), the sidebar can grow wider than is comfortable. A `max-width: 340px` cap is applied but there is no right-side content on the opposite margin.

6. **Single time zone assumption.** `new Date()` uses the visitor's local time, which is correct for a food truck customers typically in the same city as the truck. For multi-city deployments, a timezone field in config would be needed.

---

### Recommended next pass (Pass 3)

1. **`localStorage` cart** — persist cart and notes across page refreshes; clear on order sent or on a new date.
2. **Active section nav highlighting** — use `IntersectionObserver` to mark the current panel in the desktop sidebar and optionally the bottom bar.
3. **Schedule timezone field** — add `timezone: "Europe/Dublin"` to config so status calculation works correctly if the page is served from a CDN.
4. **Template extraction** — move Firebelly-specific colours and images into a `theme.css` layer so a second truck only needs a new `config.js` and `theme.css`.
5. **Real Instagram grid** — fetch last 6 posts via Instagram oEmbed or the Basic Display API; fall back to `instagramGrid` config array if the API fails.
6. **Desktop sidebar scroll tracking** — highlight the active section link as the user snaps between panels.

---

## Pass 1 — Initial refactor

**Date:** 2026-05-28  
**Source file:** `firebelly-pizza.html`

### Summary of Pass 1 changes

- Split single-file HTML/CSS/JS prototype into `index.html`, `css/base.css`, `css/theme.css`, `css/components.css`, `js/config.js`, `js/app.js`
- All business content moved to `config.js`
- Hero CTA changed from "Pre-order now → empty cart" to "View menu → Find us today"
- Bottom nav changed to Menu / Find / Order; Instagram removed from nav
- Menu items config-driven with badge support (popular, special, veg, spicy, GF) and sold-out state
- Order cart includes quantity controls, notes field, pickup location in WhatsApp message
- Schedule auto-detects today by weekday name
- Events enquiry WhatsApp message has placeholder fields
- Review cards show source as pill badge
- Desktop: centred mobile column with subtle background gradient
- `scroll-snap-stop: normal` on scrollable panels; `always` on simple panels
- Safe-area-aware bottom nav
- Full accessibility pass: semantic elements, aria-live, aria-label, alt text, focus ring, reduced motion
