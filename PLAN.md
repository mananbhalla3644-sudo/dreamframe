# MODE D RESTYLE PLAN: Anime/Manga → Organic/Bioluminescent

**Target devices:** PC only (visual-max performance)  
**Phase 1 Audit:** Every token location to change

## 1. Design Concept (5 lines)
Deep-sea bioluminescence replaces anime/manga's ink aesthetic: obsidian ocean floor, glowing neon-blue primary glow, cyan/teal bioluminescent accents, iridescent pearlescent surfaces reacting to mouse like plankton fields. Caustic-light materials replace cel-shaded crystal; caustic particles drift instead of sakura petals; water refraction shaders replace transmission ink outlines. Camera still travels 4 scenes but each is an underwater habitat: coral reef → thermal vent → abyssal plain → bioluminescent jellyfish field → midnight ocean.

## 2. Theme Derivation (Section 3.3)

| Token | Current → New |
|-------|---------------|
| **Palette** | Sumi-ink black (#08080D) → Deep ocean obsidian (#020507) | Primary vermilion (#FF3B30) → Bioluminescent cyan (#00F0FF) | Sakura pink (#FF9ECF) → Iridescent pearlescent (#C8F4E8) | Text #F2F0F5 → Sea foam white (#E8F4F8) |
| **Typography** | Anton/Zen Kaku (kinetic) → Outfit/Satoshi (organic curves, fluid) | Display: bold 600 (not condensed) | Body: Satoshi 400, more legible at small sizes |
| **Motion** | Impact/back-out (playful) → smooth-sine (fluid, oceanic drift) | Fast 0.28 → 0.5 | Base 0.6 → 0.9 | Scene transitions 1.5 → 2.2s |
| **3D Motif** | Cel-shaded crystal → Metaball-style noise-displaced sphere (blob) | Surface: toon-ramp celSteps → soft noise displacement + iridescent coating | Body color: #FF3B30 → pearlescent gradient (#7DD3FC→#C8F4E8) | Rim/speed-lines → caustic light rays, refracting through water |
| **Shader Mood** | Ink→shu→ember→paper ramp → Deep blue→cyan glow→pearlescent highlights→ocean teal | Noise speed 0.35 → 0.15 (slower drift) | Chromatic aberration: keep but shift hue from warm to cyan fringe |
| **Cursor** | Red ring (#FF3B30) → Cyan glow (#00F0FF), larger (48px) for oceanic scale | Damping 0.1 → 0.25 (slower, more liquid) |
| **Layout** | Tight anime panel rhythm → Airy open spacing, soft rounded corners (layout.radius 30px vs 6px) | Section gap: clamp(5.5rem...) → clamp(7rem...) for breathing room |

## 3. Performance Tier Plan (PC-only visual-max)
- **Detected tier:** ULTRA (no data-saver, desktop, high GPU assumed)  
- **DPR cap:** 2  
- **Particles:** ultra=12000 (metablob field + caustic rays), balanced=6000, lite=2500  
- **Post-processing:** Bloom intensity 0.7 (ocean glow), noise opacity 0.08 (water grain), chromatic aberration 0.003 (caustic shimmer)  
- **Budgets:** Initial JS ≤150KB gzip, 3D chunk lazy-loaded ≤550KB, first-load ≤2.5MB  
- **WebGL context:** Single persistent canvas (existing Scene.tsx structure unchanged)

## 4. Files to Change (Audit Complete — Section 5.3)
**Only these will be modified:**
1. `src/theme/theme.config.ts` — All token definitions replaced
2. `src/theme/tokens.css` — Auto-generated from theme.config.ts via kagero-theme-tokens plugin
3. Any inline hex values found in:
   - `src/sections/Hero.tsx` (gradient backgrounds if any)
   - `src/components/ui/*` (hover/focus states)
   - `src/shaders/*.glsl` (uniform values, colour ramps)
   - `src/lib/gsap.ts` or `src/lib/assetLoader.ts` (if colours/durations hardcoded)

**Hard Boundary (unchanged):**
- Component structure, props, file locations
- DOM semantic markup, heading order, landmarks
- Section order/count/purpose
- Interaction logic: what triggers when fires where
- Camera path waypoints and scene sequence (only lighting/colour/mood changes)
- Performance tier detection/runtime downgrade logic
- Accessibility behaviour, reduced-motion fallbacks
- State management, routing, data fetching

## 5. Hard Boundary Restated (Section 5.2)
**May change:**
✓ All values in `theme.config.ts` (colours, fonts, easings, durations, 3D mood)  
✓ Shader uniforms: colour ramps, noise speed, distortion strength, material properties  
✓ CSS classes for hover/focus states, cursor shape/colour  
✓ Imagery/iconography tone only if explicitly approved  
✓ Layout radius, section spacing from `theme.config.ts`  

**Must never change:**
✗ Component file structure or hierarchy  
✗ Props, event handlers, callback logic  
✗ DOM elements: `<header>`, `<nav>`, `<main>` sections in order  
✗ Section sequence: Hero→Story→Features→Showcase→Stats→Contact (or existing order)  
✗ What triggers what: hover on button = scale, scroll = camera moves  
✗ Tier detection/runtime stepdown logic  
✗ Accessibility features: keyboard nav, aria attributes, skip links  
✗ Performance budgets against pre-restyle measurements

## 6. Execution Order (Section 5.5)
**Iterate by token group:**
1. **Palette everywhere** — theme.config.ts + tokens.css + any inline hex → confirm visual change only
2. **Typography everywhere** — font-family CSS, className references → verify no layout break
3. **Motion personality** — easing curves, duration values in GSAP/Framer Motion → test transitions still work
4. **3D/shader mood** — theme.three.* + GLSL uniforms → confirm materials render correctly
5. **Cursor/micro-interactions** — cursor component styles, hover states → verify magnetic behaviour unchanged
6. **Layout spacing/shape** — layout.radius, sectionGap tokens → ensure no overlap or clipping

After each group: run dev server, check for console errors, review diff shows only style changes.

## 7. Risks & Trade-offs
- **Risk:** Outfit font may have different x-height than Zen Kaku, affecting line-length assumptions in tight cards  
  **Mitigation:** Preload font-display: swap, test at 375px and 1280px, adjust clamp() values if needed
  
- **Risk:** Metaball blob geometry is heavier than crystal; on first-load may impact LCP  
  **Mitigation:** Use procedural mesh (no external GLB), lazy-load 3D chunk after initial paint, verify ≤2.5MB budget
  
- **Risk:** Caustic shaders are complex; ensure they don't trigger WebGL extension errors  
  **Mitigation:** Keep distortionStrength ≤0.15 for ULTRA, fallback to baked caustics on BALANCED/lite

## 8. Pre-restyle Baseline (for Section 5.6 before/after report)
- Current theme: `theme.config.ts` version "1.0.0", mode 'A', anime/manga
- Palette bg: #08080D, primary: #FF3B30, accent: #38E1FF  
- Motion ease.primary: cubic-bezier(0.16,1,0.3,1), dur.base: 0.6s  
- Three motif: celShadedCore, particles.ultra: 9000  
- Cursor size: 38px, color: #FF3B30, damping: 0.1

---
**Ready for approval gate:** Phase 0 complete. Diff empty (no files changed yet). Hard boundary explicit. Awaiting your approval to begin Phase 1 (re-derive theme.config.ts and propagate tokens).
