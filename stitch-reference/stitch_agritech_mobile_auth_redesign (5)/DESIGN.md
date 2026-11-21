---
name: Terrace Earth
colors:
  surface: '#f8faf5'
  surface-dim: '#d8dbd6'
  surface-bright: '#f8faf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4ef'
  surface-container: '#ecefea'
  surface-container-high: '#e7e9e4'
  surface-container-highest: '#e1e3de'
  on-surface: '#191c1a'
  on-surface-variant: '#41493c'
  inverse-surface: '#2e312e'
  inverse-on-surface: '#eff1ec'
  outline: '#727a6b'
  outline-variant: '#c1c9b8'
  surface-tint: '#336b1f'
  primary: '#185004'
  on-primary: '#ffffff'
  primary-container: '#31691d'
  on-primary-container: '#a7e78b'
  inverse-primary: '#98d77d'
  secondary: '#765934'
  on-secondary: '#ffffff'
  secondary-container: '#fed6a7'
  on-secondary-container: '#795b36'
  tertiary: '#274e29'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e663f'
  on-tertiary-container: '#b5e2b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b3f496'
  primary-fixed-dim: '#98d77d'
  on-primary-fixed: '#052100'
  on-primary-fixed-variant: '#1a5206'
  secondary-fixed: '#ffddb6'
  secondary-fixed-dim: '#e6c093'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#5c421f'
  tertiary-fixed: '#c1eebc'
  tertiary-fixed-dim: '#a5d2a2'
  on-tertiary-fixed: '#002106'
  on-tertiary-fixed-variant: '#284f2a'
  background: '#f8faf5'
  on-background: '#191c1a'
  surface-variant: '#e1e3de'
typography:
  headline-lg:
    fontFamily: Cairo
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Cairo
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Cairo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Cairo
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Cairo
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Cairo
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system is crafted specifically for agricultural technology applications serving Arabic-speaking farmers, agronomists, and agribusiness owners across the Arabian Peninsula and North Africa. It pays visual homage to traditional terraced agriculture, high-altitude coffee cultivations, and fertile valleys.

The visual direction combines modern digital utility with grounded organic aesthetics. Clean, uncluttered layouts ensure immediate legibility under harsh sunlight, while gentle agricultural landscape motifs evoke trust, heritage, and sustainable prosperity. The design prioritizes ergonomic thumb navigation, high-clarity forms, and intuitive right-to-left visual cadence.

## Colors

The palette establishes an earthy, dependable baseline anchored in natural flora and fertile soils:

- **Primary (`#31691D`):** Deep canopy green representing crop vitality, used for key actions, brand marks, and active states.
- **Secondary (`#8C6D46`):** Warm roasted coffee earth tone used for subtle accentuation, agricultural categorizations, and grounding elements.
- **Tertiary (`#588157`):** Muted foliage sage for supporting badges, icon backplates, and non-blocking indicators.
- **Neutral Surface (`#F7F9F4`):** Soft cream base that avoids harsh clinical whites, reducing eye strain during outdoor fieldwork.
- **Form Surface & Card Background (`#FFFFFF`):** Crisp pure white applied to cards and inputs for contrast against the neutral backdrop.
- **Border & Outline Tone (`#E2E8DC`):** Subtle olive-tinted gray maintaining low-contrast boundaries.

## Typography

The typographic system exclusively implements **Cairo**, a contemporary geometric Arabic typeface known for high legibility at varying weights and vertical rhythm calibrated for RTL reading.

- **Vertical Proportion:** Because Arabic letterforms feature prominent ascenders and diacritics, line-heights are set wider than Latin defaults (at least 1.45–1.6× font size) to prevent stroke clipping.
- **RTL Alignment:** Default text alignment is right (`dir="rtl"`). Numeric input such as phone prefixes (`+967`) and OTP codes remain strictly LTR formatted while preserving natural RTL parent layout.
- **Weight Pairing:** Bold (700) is reserved for screen titles and primary button actions. SemiBold (600) drives field labels and card selections, while Regular (400) and Medium (500) guide instructional subtext.

## Layout & Spacing

Designed primarily for mobile portrait orientation, the grid establishes a focused single-column authentication layout with clear vertical breathing room:

- **Horizontal Margins:** Outer screen padding is set at `1.25rem` (20px), optimizing readable line lengths on standard mobile viewports.
- **Component Spacing:** Distinct input groups adhere to `space-md` (16px) vertical stacking, while related items (e.g., input labels to fields) maintain an immediate `space-sm` (8px) proximity.
- **Illustration Integration:** Landscape terrace banners anchor the top third of authentication views, smoothly feathering into `#F7F9F4` to yield space for functional cards.

## Elevation & Depth

This system utilizes soft, organic tactile elevation rather than harsh drop shadows:

- **Surface Layering:** The primary canvas sits at `#F7F9F4`. Cards and form sheet modules rise at `#FFFFFF` with ultra-diffused, foliage-tinted ambient shadows (`0 8px 24px rgba(49, 105, 29, 0.04)`).
- **Outlines & Dividers:** Form fields and selectable modules rely on crisp 1px borders (`#E2E8DC`) that transition to an active primary ring (`#31691D`) upon focus.
- **Overlay & Sheets:** Bottom sheets and elevated selection cards employ soft 1.5px borders combined with ambient blur to maintain physical presence over background terrace artwork.

## Shapes

The geometry mirrors botanical contours and terrace curves:

- **Input Fields & Buttons:** Constructed with balanced 0.5rem–0.75rem (8px–12px) radiuses, producing approachable, ergonomic tap targets without appearing toy-like.
- **Card Containers:** Auth cards and selector tiles carry a `rounded-lg` (1rem / 16px) corner radius, softening the frame.
- **Icon Pods & Checkpoints:** Circular elements (radio selectors, status avatars, floating back arrows) utilize full circular forms (`rounded-full`).

## Components

### Buttons
- **Primary Action:** Solid `#31691D` fill with `#FFFFFF` Cairo SemiBold text. Height is 52px to ensure ergonomic tapping during field use. Includes end-anchored contextual icons (such as paper planes or user-plus icons placed logically to the left of the text for RTL flows).
- **Secondary / Outline Action:** Transparent background with a 1.5px `#31691D` border and matching text color. Ideal for secondary navigations such as "Back to Login".

### Input Fields
- **Container:** High-contrast `#FFFFFF` background with a 1px `#E2E8DC` border, transitioning to a distinct 1.5px `#31691D` border when focused.
- **RTL Structure:** Right-aligned placeholder and input text. Trailing/leading iconography mirrors standard RTL conventions: field descriptor icons (e.g., mail, phone, lock) are anchored at the right side of the input, while state toggles (e.g., eye password visibility) sit at the left edge.
- **Country Selectors:** Prefixed country flag and dial code (+967) container grouped within the phone input field, clearly delineated by a soft vertical separator.

### Account Type Selector Cards
- Dual-card selection system (e.g., "Farmer" vs. "Administrator").
- Unselected state uses an outline `#E2E8DC` card with neutral text and icons.
- Selected state activates a `#31691D` border with a subtle green-tinted interior wash, accompanied by a check badge in the upper right corner.

### Status Bar & Top App Bar
- Designed for modern Android edge-to-edge screens with dark icons against light backgrounds.
- Simple, distraction-free back navigation using a mirrored back chevron or directional arrow positioned on the top right corner.