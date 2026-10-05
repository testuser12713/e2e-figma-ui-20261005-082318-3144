# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Figma "businesshandler": a light, airy personal finance & schedule app — #F4F5FA canvas, white cards with soft blue-tinted shadows, one green action accent #6CC57C, near-black #23233C text, Aleo for headings and Inter for body, 40px screen insets, one 414×896 portrait viewport, bottom tab bar with floating green add button.

## Colors

- `--color-bg`: **#F4F5FA**
- `--color-bg-alt`: **#F4F4F4**
- `--color-bg-alt-2`: **#ECF1FA**
- `--color-surface`: **#FFFFFF**
- `--color-surface-top`: **#FFFFFF**
- `--color-fg`: **#23233C**
- `--color-fg-body`: **#1C1C1C**
- `--color-fg-inverse`: **#FFFFFF**
- `--color-accent`: **#6CC57C**
- `--color-accent-gradient-end`: **#179F2F**
- `--color-accent-soft`: **#61D27C**
- `--color-accent-translucent`: **#6CC57CD9**
- `--color-accent-block`: **#6CC57CA3**
- `--color-on-accent`: **#FFFFFF**
- `--color-secondary`: **#23233C**
- `--color-muted`: **#A5A5A5**
- `--color-muted-alt`: **#898888**
- `--color-muted-light`: **#B4B4B4**
- `--color-placeholder`: **#BBC7DB**
- `--color-icon-ink`: **#181461**
- `--color-border`: **#707070**
- `--color-border-soft`: **#DCE5F4**
- `--color-track`: **#E3E3E3**
- `--color-chart-deposit`: **#2B2B2B**
- `--color-warm-line`: **#C48B30**
- `--color-shadow-nav`: **#60719329**
- `--color-shadow-soft`: **#00000014**
- `--color-shadow-avatar`: **#00000029**
- `--color-shadow-login`: **#0D4E810D**
- `--color-shadow-card`: **#0000000F**
- `--color-shadow-header`: **#0000001A**

## Typography

- `font_family`: Aleo, Georgia, 'Times New Roman', serif
- `font_family_body`: Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
- `font_family_alt`: Ubuntu, 'Ubuntu Sans', Roboto, system-ui, sans-serif
- `font_family_login`: Actor, Inter, system-ui, sans-serif
- `heading_weight`: 700
- `body_weight`: 400
- `text-25`: Aleo 700 25px/30px
- `text-24`: Aleo 700 24px/29px
- `text-20`: Aleo 700 20px/25px
- `text-16`: Aleo 700 16px/19px
- `text-16-alt`: Inter 400 16px/19px
- `text-14`: Aleo 700 14px/17px
- `text-14-alt`: Inter 400 14px/17px
- `text-12`: Inter 100 12px/15px, letter-spacing 2.4px, uppercase
- `text-12-alt`: Inter 400 12px/14px
- `text-10`: Inter 400 10px/13px
- `text-9`: Inter 100 9px/11px, letter-spacing 1.8px, uppercase
- `text-7`: Aleo 700 7px/5px
- `amount-hero`: Inter 500 45px/57px
- `eyebrow-14`: Inter 100 14px/18px, letter-spacing 2.8px, uppercase
- `amount-row`: Inter 100 14px/18px
- `ubuntu-17`: Ubuntu 700 17px/20px
- `ubuntu-15`: Ubuntu 400 15px/20px, letter-spacing 0.4px
- `ubuntu-13`: Ubuntu 400 13px/15px
- `ubuntu-11`: Ubuntu 700 11px/12px, letter-spacing 0.3px
- `ubuntu-10`: Ubuntu 400 10px/12px
- `ubuntu-7`: Ubuntu 700 7px/10px

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 20px
- `--space-5`: 24px
- `--space-6`: 32px
- `--space-7`: 40px

## Border-Radii

- `--radius-sm`: 3px
- `--radius-md`: 5px
- `--radius-lg`: 8px
- `--radius-xl`: 10px
- `--radius-2xl`: 12px
- `--radius-3xl`: 18px
- `--radius-card`: 20px
- `--radius-pill`: 999px

## Components

### Button — Primary (green)

334×43 (full content width, 40px screen inset), radius 8px (from the Login Slide 'Next' button, the frames' only rounded CTA), fill #6CC57C, label Inter 400 16px/19px #FFFFFF centred, padding 10px/16px, shadow 0/3 blur 16 #00000014, min touch target 44px (hitSlop 1px top/bottom). Used as 'Add Expense', 'Add Appointment', 'Add a new appointment'. States — not shown in the frames, filled in the frames' style with frame colours only: hover = fill #61D27C (accent-soft from the Login footer), active = fill #5EBB6D plus pressed overlay #23233C14 and no shadow, focus = 1px inset border #23233C, disabled = fill #6CC57C at opacity 0.4, label #FFFFFF, no shadow, no press feedback.

### Button — Secondary (translucent green)

334×43, fill #6CC57CD9 (accent at 85% opacity, verbatim from 'Overview' in Time Management), same radius/label/shadow as Primary. States as Primary; active = fill #6CC57C at full opacity; disabled = fill #6CC57CD9 at opacity 0.4.

### Button — Dark (Login primary, out of this sprint's scope)

333×54, fill #23233C, radius 18px, label Aleo 700 20px/25px #FFFFFF centred. Kept in the theme so the token set stays complete; the Login frames are out of scope.

### Floating Add Button (FAB)

64×63 ellipse, fill linear-gradient(180deg, #6CC57C 0%, #179F2F 100%), 4px #FFFFFF inside stroke, shadow 0/3 blur 40 #00000029, centred horizontally (x 179–243), absolutely positioned over the tab bar: circle bottom at y=841, tab-bar surface starts y=819. Icon: cross of two 3px #FFFFFF lines, 20×20, centred (the two 1×20 and 20×1 white lines of the frame). Used on Money and Time; opens the add sheet.

### Bottom Tab Bar

Pinned group 413×118 at the bottom (y 778–896). Surface: 413×77 white from y=819, radius 20px top corners (notch shape), shadow 0/3 blur 20 #60719329. Slots: 5, icons 22×21, labels Aleo 700 7px/5px, ~4px below the icon, x centres ≈ 46/103/207/306/363. Inactive icon+label #BBC7DB (verbatim). Active state filled in: icon+label #6CC57C (frames only show #BBC7DB, the spec requires a visible active tab). Centre slot sits behind the FAB and shows no label. Whole row is a 77px-tall tap area (≥44px).

### Card / Quick Categories panel (Money Management)

330×276, fill #FFFFFF, radius 20px, centred with 40px insets, no border, no shadow. Eyebrow 'QUICK CATEGORIES' Inter 100 12px/15px letter-spacing 2.4px uppercase #000000, centred, 34px below the card top. Tiles: 55×55, radius 12px, fill #FFFFFF, 1px inside dashed border #000000, icon 36–42px #000000 centred. Grid: columns at x 69/175/284 (51px gap), rows at y 530/622 (37px gap). First tile in the frame carries the dashed stroke without radius. Inactive/no-data tiles are the visible disabled state (dashed border, no press feedback).

### Card / White header block

0,0 414×406 fill #FFFFFF (Money Management) / 414×407 (Money Management 2) / 414×138 (Money Management 3 add sheet). Bottom edge is straight; content sits on top. Detail/add states keep this white block so the stacked screen always reads as the same surface.

### Eyebrow + amount hero (Money header)

Eyebrow 'MONTHLY EXPENSES' Inter 100 12px/15px letter-spacing 2.4px uppercase #000000 at 49/282; amount '1,345.00€' Inter 500 45px/57px uppercase #000000 at 49/298, left-aligned, single line, never wraps (414px viewport, 217×57 box).

### Avatar badge

51×51 circle, fill #6CC57C, shadow 0/3 blur 6 #00000029, letter Aleo 700 32px/41px #FFFFFF centred ('R'). Absolutely positioned at 296/77 on the Money header (floats over the illustration).

### Transaction row (Money Management 2)

Row pitch 83px, no dividers. Thumbnail 53×53 at x 28 (PNG asset). Text block at x 103: category Inter 100 9px/11px letter-spacing 1.8px uppercase, title Inter 100 12px/15px, date Inter 100 9px/11px uppercase — all #000000; the three lines sit 11px/15px/11px tall in that order (category, title, date). Amount right-aligned, right edge at x 354, Inter 100 14px/18px. Colour rule verbatim from the frame's own legend: expenses amount #6CC57C (green), deposits/incomes amount #2B2B2B (dark) — legend swatches 13×13 radius 3px, label Inter 100 9px/11px uppercase #000000.

### Money list header / Weekly Report chart

White block 414×407; title 'WEEKLY REPORT' Inter 100 14px/18px letter-spacing 2.8px uppercase #000000, centred at y 61; illustration 256×218 centred (asset illustration-256x218.png). Chart: 7 vertical bars, 8px wide, 3px radius top, track #E3E3E3, segments stacked bottom-up: expenses #6CC57C, deposit #2B2B2B; legend at y 358 with two 13×13 radius-3 swatches (#6CC57C and #2B2B2B) and labels 'expenses'/'deposit'. Back control: 32×32 dark rounded square (icon-32x32.svg) at 47/55, top-left.

### Time entry row (Time Management)

Group 337×57, row pitch 72px, divider 336×1 stroke 0.5px #1C1C1C at opacity 0.2 at the row bottom. Line 1: date Inter 400 12px/22px #1C1C1C at opacity 0.4. Line 2 (17px below): title Aleo 700 14px/17px #1C1C1C left, right-aligned 'Modify' Aleo 700 14px/17px #23233C with a 12×12 pencil icon 4px before it; info icon 12×12 #23233C sits behind the title and opens the detail state. Whole row is tappable (≥44px). Field labels from the frame: 'Dentist - Clara Odding', 'Cardiologist - Steven Pauliner', 'Dermatologist - Noemi Shinte'.

### Segmented tabs (Upcoming / Past)

336×38 group at y 194. Active label Aleo 700 16px/19px #23233C left, inactive label Inter 400 16px/19px #1C1C1C right-aligned. Underline under the active label: 51×2 fill #23233C at y 229; full-width track 336×1 stroke 0.5px #1C1C1C at opacity 0.2 at y 231. Tap target = label + underline, min 44px with hitSlop.

### Search field

334×43, fill #FFFFFF, radius 8px (filled in — the frames give no radius for these), shadow 0/3 blur 16 #00000014, no border. Placeholder Inter 400 16px/19px #1C1C1C at opacity 0.2 ('Search'), 16px inset from the left edge. Trailing icon 16×16 #1C1C1C, 18px inset from the right edge. States: default (above), focus = same surface plus 1px inset border #6CC57C (filled in), disabled = text and icon at opacity 0.2 with no press feedback. Inputs in the add sheets are the same box with a leading icon 14–16×18 #23233C and a label Inter 400 16px/19px #1C1C1C at 37px from the field's left edge.

### Form field (Add Expense / Add appointment)

334×43, fill #FFFFFF, radius 8px, shadow 0/3 blur 16 #00000014, leading icon 14–16×16–18 #23233C at 15–16px inset, label/placeholder Inter 400 16px/19px #1C1C1C at 37–38px from the left edge. Vertical pitch 63px (20px gap). Labels verbatim: 'Name', 'Beschreibung', 'Amount', 'Select Date'. States — not shown in the frames, filled in the frames' style: untouched = neutral placeholder (no error), focused = 1px inset border #6CC57C, error = 1px inset border and message Inter 400 12px/14px #C48B30 (the only warm tone the frames contain, from the #C48B30 event divider) shown only after typing or a save attempt, disabled = label and icon at opacity 0.4.

### Header with back chevron (stacked state)

Header group 40px insets at y 25. Back chevron = noun_back_1227057.svg, 11×18, fill #181461 (verbatim), 44px tap target. Money Management 2/3 use the filled dark 32×32 rounded square (icon-32x32.svg) at 47/55 instead. Time Management 3 header: 414×126 white, shadow 0/3 blur 16 #0000001A, menu icon 18×15 #181461 at 20/33, avatar 27×27 at 367/25, title 'Add an appointment' Aleo 700 24px/29px #23233C at 18/62.

### Date strip + week navigator (Time Management - 2)

Selected day: 42×42 circle fill #6CC57C at y 213, weekday letters Ubuntu 400 13–15px/18–20px #000000 with letter-spacing 0.3–0.4px, day numbers Ubuntu 400 13–15px #000000 in one row (7 columns, dots of 10px below for the slide indicator). Range label '15-21 April 2019' Ubuntu 400 13px/15px #000000 centred with 8×14 chevrons (icon-8x14.svg / .png) 51px left and right of the label. Below: white sheet 164×34 with a 10×6 chevron (icon-10x6.png) as its handle.

### Calendar event block (agenda grid)

286×118, fill #6CC57CA3 (accent at 64% opacity), radius 3px, left column x 94, time gutter x 34–41 on the frame background #F4F5FA. Inside: 'Work' Ubuntu 700 11px/12px #23233C, description 'Besprechung' Ubuntu 400 10px/12px #000000 at opacity 0.42, time '10AM - 11AM' Ubuntu 700 7px/10px #23233C with an 11×11 clock icon #23233C, avatar image 56×56 at the right edge (asset fc8cc65f046eeb0b9efb159aad932e2b.png). Bottom line 286×1 stroke #C48B30 at opacity 0.18. Time labels in the gutter: Aleo 700 11px/12px letter-spacing 0.3px #000000, with a 22×1 tick #707070 at opacity 0.18; date separator '18 April 2019' Ubuntu 700 11px/12px #000000 at opacity 0.44. Row pitch 135px.

### Quick Adds row (Time Management - 3)

336×90, pitch 109px, divider 336×1 stroke 0.5px #1C1C1C at opacity 0.2 at the bottom. Image 69×69 at x 39 (radius 0 — the frames show no radius), title Aleo 700 14px/17px #1C1C1C at x 121, subtitle Inter 400 12px/14px #1C1C1C at opacity 0.4 20px below, drag handle = three 3×3 ellipses fill #23233C at x 372. Section title 'Quick Adds' Inter 400 16px/19px #1C1C1C and filter icon 25×22 #23233C. Rows: 'Gym / Customize Plan', 'Work / Normal Day', 'Birthday / Friend', 'Dr. Jeff Smiths / Dermatologist'.

### Disabled / inert control

Every element that looks interactive but has no function this sprint: opacity 0.4 on its own colours (the frames' own muted-opacity convention: 0.2 for placeholders, 0.4 for muted text, 0.44 for the date separator), no press feedback, accessibilityState disabled. Never leave such an element silently dead. Fully visible deactivated example from the frames: the 'Overview' and 'Modify' rows and the empty category tiles.

### Asset inventory

Use the exported files as-is, never redraw: illustration-525x387.png, illustration-256x218.png, illustration-53x53(-2/-3/-4).png, noun-back-1227057.svg, icon-32x32.svg, icon-15x16.png, icon-8x14.svg, icon-8x14.png, icon-10x6.png, noun-user-1335326.png, noun-pencil-2174975.png, noun-info-1174604.png, fc8cc65f046eeb0b9efb159aad932e2b.png, image-69x69(-2/-3/-4).png, facebook-2.svg, search-1.svg. Icons the frames render empty must be drawn from the frame outlines to match, in #000000 or #23233C/#BBC7DB as listed: home-icon, dish-spoon-knife-icon, briefcase-icon, friends-icon, shopping-bag-icon, gas-station-icon, shop, noun_Favorite_1481179, noun_Search_860389, noun_Map_2404959, noun_filters_1245150, clock, noun_menu_933312, check, view. All bundled locally for offline use.

## Layout Principles

- One viewport only: 414×896 portrait. No breakpoints, no responsive behaviour, no max-width container, no desktop grid.
- Horizontal screen inset 39–41px for all content blocks (form fields, list rows, search, CTAs); headers sit at x 18–47 depending on the frame (money/time detail 40px, add sheet 18px).
- Vertical stack, top-down: header (y 25–126) → title/eyebrow block → content → pinned bottom tab bar. Sections are separated by 20–43px, list rows by a fixed pitch (72px time rows, 83px transaction rows, 109px quick-add rows, 135px calendar blocks), never by arbitrary margins.
- Only the FAB, the avatar badge and the tab-bar notch are absolutely positioned over the layout; everything else is flex/stack ordering that reproduces the frame's arrangement.
- Bottom tab bar is always pinned (413×118 from y 778): white 413×77 surface from y 819 with radius 20px top corners and shadow 0/3 blur 20 #60719329, the 64×63 FAB overlapping its top edge, centred.
- Scrollable lists use FlatList and scroll under the tab bar with a bottom content inset of 118px so nothing is cut off at 414×896; no horizontal overflow anywhere.
- Stacked states stay inside their tab screen (React Navigation stack): list → detail, list → add sheet, with the frames' back chevron (11×18 #181461) or the 32×32 dark square as the back control.
- Type hierarchy is always eyebrow (uppercase, letter-spacing 1.8–2.8px) → Aleo heading → Inter body; amounts are right-aligned on the row; category/date meta lines sit above and below the title.
- Surfaces: #F4F5FA page, #FFFFFF cards and header blocks, #F4F4F4 for the Money frames' page fill; separation comes from white-on-light plus a soft blue-tinted shadow (0/3 blur 16–20 #00000014 / #60719329), never from a hard border — borders only as 0.5–1px #1C1C1C/#707070 at 0.18–0.2 opacity dividers.
- Every tappable element (tab, button, row, icon) reaches at least 44px of touch area, and anything without a function this sprint is visibly disabled (opacity 0.4, no press feedback) instead of silently inert.

## Source Frames

This design was taken from the Figma frames below. They are the reference; the tokens above were read from them. Each frame's spec carries its exact sizes, colours, fonts and texts and the arrangement to lay out (not to pin to pixels); `design/figma/README.md` is the index.

Platform: mobile app (`mobile-app`) — design viewport 414×896 (phone, portrait) — one viewport, the design is not responsive.

- **Money Management** · businesshandler — spec `design/figma/money-management.md` — `design/figma/money-management.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2446
- **Money Management 2** · businesshandler — spec `design/figma/money-management-2.md` — `design/figma/money-management-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2573
- **Money Management 3** · businesshandler — spec `design/figma/money-management-3.md` — `design/figma/money-management-3.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2673
- **Time Management** · businesshandler — spec `design/figma/time-management.md` — `design/figma/time-management.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-803
- **Time Management - 2** · businesshandler — spec `design/figma/time-management-2.md` — `design/figma/time-management-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-3047
- **Time Management - 3** · businesshandler — spec `design/figma/time-management-3.md` — `design/figma/time-management-3.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-1029
- **Login** · businesshandler — spec `design/figma/login.md` — `design/figma/login.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-81
- **Login Slide** · businesshandler — spec `design/figma/login-slide.md` — `design/figma/login-slide.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-20
- **Login Slide 2** · businesshandler — spec `design/figma/login-slide-2.md` — `design/figma/login-slide-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-208
- **Dashboard** · businesshandler — spec `design/figma/dashboard.md` — `design/figma/dashboard.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-681
- **Dashboard Menu** · businesshandler — spec `design/figma/dashboard-menu.md` — `design/figma/dashboard-menu.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2973
- **Dashboard Stats** · businesshandler — spec `design/figma/dashboard-stats.md` — `design/figma/dashboard-stats.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-900
