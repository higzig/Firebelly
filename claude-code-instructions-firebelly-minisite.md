# Claude Code Instructions: Firebelly Food Truck Minisite Template

## Context

We are reviewing and improving `firebelly-pizza.html`, currently a single-file mobile-first food truck minisite. The concept is strong: a TikTok-style vertical snap one-page site for small businesses, where each screen handles a specific customer need.

The current page has a good foundation:

- Full-screen mobile snap panels
- Strong food truck / artisan pizza visual direction
- Hero section with location/status
- Find-us section
- Menu tabs
- Lightweight cart
- WhatsApp pre-order flow
- Private event enquiry section
- Reviews and social links
- Sticky bottom navigation

However, it still feels like a stylish prototype rather than a finished, reusable minisite template.

## Primary Goal

Turn this into a polished, mobile-friendly, reusable food truck minisite template that feels beautiful, useful, and business-ready.

The template should feel like a complete one-page business presence for a food truck, not just a landing page.

It should answer the customer’s main questions quickly:

- Are they open now?
- Where are they today?
- What is on the menu?
- Can I pre-order?
- When can I collect?
- Can I book them for an event?
- Are they good?
- How do I follow/contact them?

## Important Requirement: Document Everything

Create or update a Markdown file called:

```text
CHANGELOG_FIREBELLY_TEMPLATE.md
```

In that file, document:

- What you changed
- Why you changed it
- Any design decisions made
- Any UX tradeoffs
- Any remaining limitations
- Suggested next improvements

This Markdown file is important because we want to review the reasoning behind the changes, not just the final code.

## File Structure Requirement

Do not keep everything in one HTML file.

Split the current single-file prototype into a cleaner structure. A simple version is preferred over a heavy framework unless there is a clear reason to use one.

Recommended structure:

```text
firebelly-template/
  index.html
  css/
    base.css
    theme.css
    components.css
  js/
    config.js
    app.js
  assets/
    hero.jpg
    menu/
    social/
  CHANGELOG_FIREBELLY_TEMPLATE.md
```

If local image assets are not available, keep remote image URLs for now, but isolate them in the config/data layer so they can be replaced later.

## Template Reusability Requirement

Make the page less hardcoded.

Move business-specific content into a data/config file, such as `js/config.js`.

Config should include:

- Business name
- Tagline
- Hero status
- Current location
- Weekly schedule
- Menu categories
- Menu items
- Prices
- Dietary/allergen tags
- Sold-out state
- Reviews
- Social links
- WhatsApp number
- Event enquiry text
- Pickup time slots

The HTML should define structure. The config should define business content.

## Design Direction

Keep the premium, fire-cooked, artisan food truck feeling, but make the experience richer and more complete.

Keep:

- Strong food photography
- Warm fire/kraft/cream/ink palette
- Editorial typography
- Mobile-first full-screen rhythm
- Sticky bottom actions

Improve:

- More visual variety between panels
- More useful interaction states
- Better ordering flow
- Better real-world food truck utility
- Better desktop/tablet presentation
- More polished spacing around the fixed bottom nav

Avoid making it feel like a generic restaurant landing page. It should feel specifically useful for a mobile food truck business.

## UX Issues To Fix

### 1. Hero CTA Flow

The current primary CTA jumps to the empty order/cart panel. That is not ideal.

Change the primary flow so the user naturally goes:

```text
Hero -> Menu -> Add items -> Order/checkout
```

Recommended hero CTAs:

- Primary: `View menu`
- Secondary: `Find us today`

The sticky bottom bar can still include `Pre-order`, but it should be clear that ordering starts from menu items.

### 2. Bottom Navigation

The sticky bottom bar is useful, but make sure it never covers important content.

Add safe-area-aware spacing:

- Account for mobile browser UI
- Account for iPhone safe area
- Ensure order footer and WhatsApp button are never hidden behind the nav

Preferred nav items:

- `Menu`
- `Find`
- `Order`

Instagram should be available, but not necessarily one of the three primary bottom nav actions.

### 3. Snap Scrolling

Keep the TikTok-style vertical snap concept, but tune it carefully.

Potential issue: menu and order sections have internal scrolling, which may conflict with page-level snap scrolling.

Improve the experience so users do not feel trapped inside a panel.

Options:

- Keep snap panels but make internal scroll areas obvious and comfortable
- Reduce internal scrolling where possible
- Make menu categories compact enough to browse naturally
- Consider section heights and bottom-nav spacing carefully

### 4. Menu Improvements

The menu should feel like a real food truck ordering surface.

Add support for:

- Popular / signature item badge
- Vegetarian badge
- Spicy badge
- Gluten-free available indicator
- Allergen note
- Sold-out state
- Weekly special
- Item detail expansion or clearer descriptions
- Quantity controls after adding

Do not overcomplicate checkout, but make the menu feel more commercially real.

### 5. Ordering Improvements

Improve the lightweight cart/order flow.

Must include:

- Add/remove quantity
- Pickup time
- Total
- WhatsApp order message
- Empty-cart state
- Open/closed awareness if possible

Nice to have:

- Customer notes field
- Pickup location included in WhatsApp message
- Sold-out items disabled
- Confirmation before opening WhatsApp if cart/time is incomplete

### 6. Find-Us / Schedule Improvements

Food trucks live and die by location clarity.

Improve the schedule section so it includes:

- Open now / closed state
- Today’s location
- Address
- Service hours
- Directions link
- Upcoming stops for the week

Make this one of the most practical sections on the page.

### 7. Private Events

The private hire section is good but could be more useful.

Add or improve:

- Event types
- Minimum guest count or service area if useful
- “Request event quote” CTA
- WhatsApp message that asks for date, location, guest count, and event type

### 8. Social Proof

Reviews are good, but the section could work harder.

Improve:

- Review layout polish
- Add source labels
- Add Instagram/photo grid
- Make it feel credible, not filler

### 9. Desktop / Tablet

The current desktop behavior simply constrains the page to a mobile-width column.

That is acceptable for an MVP, but make it feel intentional.

Options:

- Present it as a centered mobile minisite preview
- Add a subtle desktop background
- Use a wider two-column layout for desktop while preserving mobile snap
- Keep the snap experience mobile-first

Do not let desktop feel like an accidental stretched phone page.

## Accessibility and Quality

Improve basic accessibility:

- Use semantic buttons and links
- Add useful alt text for meaningful images
- Ensure contrast is readable
- Ensure tap targets are comfortable
- Avoid text being hidden or clipped
- Respect reduced motion if animations are added

Also check:

- Small mobile viewport
- Large mobile viewport
- Tablet
- Desktop
- Long menu item names
- Empty cart
- Several cart items
- Sold-out menu item

## Technical Guidance

Keep the implementation simple, readable, and easy to customize.

Preferred:

- Plain HTML/CSS/JS
- Config-driven rendering
- No build step unless needed
- Clear component-like rendering functions in JS
- CSS split by purpose

Avoid:

- Overengineering
- Heavy dependencies
- Keeping business data scattered through HTML
- Inline styles
- Hardcoded repeated WhatsApp links
- Making the design generic

## Deliverables

Please produce:

1. A refactored project folder, not one giant HTML file
2. Updated mobile-first food truck minisite design
3. Config/data-driven business content
4. Improved ordering and schedule UX
5. Better bottom navigation behavior
6. `CHANGELOG_FIREBELLY_TEMPLATE.md` explaining all changes

## Final Review Criteria

The result should feel:

- Beautiful
- Mobile-native
- Useful for a real food truck
- Easy to customize for another food truck
- Strong enough to become the first template in a broader minisite-template system

Design target:

```text
Not just a landing page.
Not just a menu.
A complete one-page business operating surface for a food truck.
```
