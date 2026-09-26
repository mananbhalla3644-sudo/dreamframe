# DREAMFRAME — Immersive 3D Product Landing Page

A production-quality, performance-adaptive 3D website built with React, Three.js, GSAP, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Theme System

All design tokens live in `src/theme/theme.config.ts` — **this is the single source of truth**.

```typescript
// Change the entire look by editing this file
export const themeConfig = {
  palette: { ... },
  typography: { ... },
  motion: { ... },
  three: { ... },
  // ...
}
```

### Customizing

1. **Colors**: Edit `palette` values (WCAG AA contrast verified)
2. **Fonts**: Change `typography.display.fontFamily` and `typography.body.fontFamily`
3. **Motion**: Adjust `motion.ease`, `durFast`, `durBase`, `durSlow`, `stagger`
4. **3D Mood**: Modify `three.shaderMood.colorRamp`, `noiseSpeed`, `distortionStrength`
5. **Sections**: Reorder `sectionOrder` array

## 📁 Project Structure

```
src/
├── app/main.tsx              # Entry point with providers
├── theme/
│   └── theme.config.ts       # ALL design tokens (single source)
├── hooks/
│   ├── usePerformanceTier.ts # Device detection & tier adaptation
│   ├── useScrollProgress.ts  # Scroll-driven animation coordinator
│   ├── useReducedMotion.ts   # prefers-reduced-motion handler
│   ├── useMagnetic.ts        # Magnetic button logic
│   └── useMouse.ts           # Smoothed mouse position
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── SplitText.tsx
│   │   ├── Marquee.tsx
│   │   ├── Cursor.tsx
│   │   ├── Grain.tsx
│   │   └── Loader.tsx
│   └── three/                # Three.js components
│       ├── Scene.tsx
│       ├── CameraRig.tsx
│       ├── HeroObject.tsx
│       └── ParticleField.tsx
├── sections/                 # Page sections
│   ├── Hero.tsx
│   ├── Story.tsx
│   ├── Features.tsx
│   ├── Showcase.tsx
│   ├── Stats.tsx
│   └── Contact.tsx
├── lib/
│   ├── gsap.ts               # GSAP + Lenis + ScrollTrigger setup
│   ├── mathUtils.ts          # Vector math helpers
│   └── assetLoader.ts        # Progressive asset loading
└── shaders/                  # Custom GLSL (if needed)
```

## ⚡ Performance Tiers

The site automatically adapts to device capabilities:

| Tier | Device | DPR | Post-Processing | Particles | 3D Complexity |
|------|--------|-----|-----------------|-----------|---------------|
| **ULTRA** | High-end desktop | 2.0 | Bloom, DoF, CA, Noise | 50,000 | Full |
| **BALANCED** | Typical laptop | 1.5 | Bloom, Noise | 15,000 | Reduced |
| **LITE** | Mobile / Low-end | 1.0 | CSS Grain only | 3,000 | Hero only |
| **STATIC** | Reduced motion / No WebGL | 1.0 | None | 0 | Poster image |

### Testing Tiers

Add `?tier=ultra|balanced|lite|static` to the URL to force a specific tier.

## 🎬 Animation System

- **GSAP + ScrollTrigger** for scroll-driven timelines
- **Lenis** for smooth scrolling (synced with GSAP ticker)
- **Framer Motion** for page transitions & UI micro-interactions
- **SplitText** for staggered text reveals
- **Custom cursor** with magnetic hover effects

## 🎯 Performance Budgets

| Metric | Target |
|--------|--------|
| Initial JS (gz) | ≤ 200 KB |
| 3D Chunk (gz) | ≤ 600 KB |
| First-load payload | ≤ 3 MB |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Lighthouse Perf (Desktop) | ≥ 85 |
| Lighthouse Perf (Mobile) | ≥ 70 |

## ♿ Accessibility

- Semantic HTML landmarks & heading hierarchy
- Visible focus states on all interactive elements
- `prefers-reduced-motion` → STATIC tier (no canvas)
- `aria-hidden` on decorative 3D canvas with DOM equivalents
- Form labels, validation, `aria-live` error messages
- Keyboard-only navigation verified

## 📦 Asset Guidelines

- **Images**: AVIF/WebP, responsive `srcset`, explicit `width`/`height`
- **Textures**: KTX2/Basis preferred, max 2048px desktop / 1024px mobile
- **Models**: GLB with Draco/Meshopt, ≤ 300k tris desktop / 80k mobile
- **Fonts**: Self-hosted via Fontsource, `font-display: swap`, preload hero font only

## 🔧 Adding 3D Models

1. Place `.glb` files in `public/models/`
2. Import in component:
   ```tsx
   import { useGLTF } from '@react-three/drei'
   
   function MyModel() {
     const { scene } = useGLTF('/models/my-model.glb')
     return <primitive object={scene} />
   }
   ```
3. Run `gltf-transform draco` / `meshopt` for compression

## 📝 License

- **Code**: MIT
- **Fonts**: Orbitron (SIL OFL 1.1), Inter (SIL OFL 1.1)
- **Assets**: Custom/user-provided (verify licenses)

## 📊 Performance Results

Run `npm run build && npx serve dist` then test with Lighthouse.

```
# Example results (to be filled after build)
Desktop Performance: 92
Mobile Performance: 78
Accessibility: 100
Best Practices: 95
SEO: 100
```

## 🐛 Troubleshooting

**Black screen / WebGL errors**
- Check browser WebGL support: `chrome://gpu`
- Try `?tier=static` to bypass 3D

**Low FPS on mobile**
- Site auto-detects and switches to LITE tier
- Reduce particle count in `theme.config.ts` → `three.shaderMood`

**Fonts not loading**
- Ensure `@fontsource` imports in `index.css`
- Check network tab for font requests

**Build too large**
- Run `npx vite-bundle-analyzer` to visualize chunks
- Check `manualChunks` in `vite.config.ts`