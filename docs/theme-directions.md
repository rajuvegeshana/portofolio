# Three Distinct Visual Theme Directions

To ensure Harikrishna's portfolio stands out while remaining credible for senior product design roles, we will implement three distinct visual directions with a fully functional theme switcher.

---

## Theme A — Editorial Minimal (Default Theme)
*Direction:* Premium editorial portfolio with a sophisticated independent design-studio feel.

- **Typography:** High-contrast serif headlines paired with clean, readable sans-serif body text (e.g., *Playfair Display* or *Instrument Serif* + *Inter*).
- **Layout & Composition:** Generous whitespace, art-directed large project covers, asymmetrical single-column and two-column editorial layouts.
- **Color Palette:** Warm neutral canvas (`#FBFBF9`), deep charcoal ink (`#1A1A1A`), and a refined terracotta or muted gold accent (`#C85A32`).
- **Interactions:** Subtle, smooth opacity transitions, underline slide-ins, and restrained hover states.

---

## Theme B — Swiss Grid / Design Systems
*Direction:* Systematic, precise, structured, and detail-oriented.

- **Typography:** Monospaced technical accents paired with precise neo-grotesque sans-serif (e.g., *JetBrains Mono* + *Space Grotesk* / *Inter*).
- **Layout & Composition:** Visible grid lines, mathematical spacing (8pt/4pt grid), structured metadata tables, badge tags, and component-driven card layouts.
- **Color Palette:** High-contrast clinical neutrals (`#FFFFFF` / `#0F172A`), electric blue accent (`#2563EB`), and precise border lines (`#E2E8F0`).
- **Interactions:** Crisp snap-to-grid transitions, focus rings, and structured accordion disclosures.

---

## Theme C — Contemporary Creative
*Direction:* Distinctive, expressive, and experimental while remaining professional.

- **Typography:** Bold geometric sans-serif with strong personality (e.g., *Syne* or *Clash Display* + *Plus Jakarta Sans*).
- **Layout & Composition:** Dynamic asymmetric grid layouts, striking thumbnail crops, floating interactive filters, and rich typographic accents.
- **Color Palette:** Deep obsidian background (`#090A0F`), glowing subtle accent gradients (`#818CF8` / `#EC4899`), and crisp white typography (`#F8FAFC`).
- **Interactions:** Smooth spring-based micro-interactions, subtle glassmorphism, and vibrant hover previews.

---

## Theme Switcher Architecture
- Stored locally in `localStorage` (`portfolio_theme`).
- Applied instantly via a root `data-theme="editorial|swiss|creative"` attribute on the `<html>` element.
- Accessible via a floating or header-integrated theme selector available on all pages.
