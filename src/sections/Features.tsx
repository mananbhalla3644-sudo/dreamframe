import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeConfig } from '../theme/theme.config';
import { SplitTextComponent } from '../components/ui/SplitText';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: 'sparkles',
    title: 'Natural Language Input',
    desc: 'Describe scenes in plain English. No prompt syntax, no modifiers — just write what you see.',
  },
  {
    icon: 'cube',
    title: 'Full 3D Scene Output',
    desc: 'Get complete scenes with geometry, materials, lighting, and camera — not just flat images.',
  },
  {
    icon: 'sliders',
    title: 'Granular Control',
    desc: 'Adjust every parameter: camera angle, time of day, material properties, composition.',
  },
  {
    icon: 'download',
    title: 'Pipeline-Ready Exports',
    desc: 'Export USD, glTF, OBJ, EXR sequences, or high-res PNGs ready for any workflow.',
  },
  {
    icon: 'layers',
    title: 'Style Presets',
    desc: 'Cinematic, architectural, product, artistic — one-click style transfer for consistent results.',
  },
  {
    icon: 'zap',
    title: 'Real-Time Iteration',
    desc: 'See changes instantly. Tweak and re-render in seconds, not minutes or hours.',
  },
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const magneticRef = useMagnetic({ strength: 0.15, radius: 60 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    magneticRef.current = card;
  }, [magneticRef]);

  const icons: Record<string, JSX.Element> = {
    sparkles: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2v20M17 5H7M17 19H7M5 12h14" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    cube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <path d="M2 17l10 5 10-5M2 7l10 5 10-5" />
      </svg>
    ),
    sliders: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
    layers: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    zap: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  };

  return (
    <div
      ref={cardRef}
      className="group relative p-8 rounded-2xl transition-all duration-500"
      style={{
        backgroundColor: `${themeConfig.palette.surface}80`,
        border: `1px solid ${themeConfig.palette.surfaceAlt}40`,
        backdropFilter: 'blur(20px)',
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          y: -8,
          boxShadow: `0 20px 40px -10px ${themeConfig.palette.primary}30`,
          duration: 0.4,
          ease: 'expo.out',
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          y: 0,
          boxShadow: 'none',
          duration: 0.4,
          ease: 'expo.out',
        });
      }}
    >
      <div 
        className="mb-6 transition-transform duration-500 group-hover:scale-110"
        style={{ color: themeConfig.palette.primary }}
      >
        {icons[feature.icon]}
      </div>
      <SplitTextComponent
        split="lines"
        stagger={0.1}
        duration={0.6}
        from={{ opacity: 0, y: 20 }}
        to={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: themeConfig.typography.display.fontFamily, color: themeConfig.palette.text }}>
          {feature.title}
        </h3>
      </SplitTextComponent>
      <SplitTextComponent
        split="lines"
        stagger={0.08}
        duration={0.6}
        delay={0.1}
        from={{ opacity: 0, y: 15 }}
        to={{ opacity: 1, y: 0 }}
      >
        <p style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily, lineHeight: 1.6 }}>
          {feature.desc}
        </p>
      </SplitTextComponent>
    </div>
  );
}

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.features-grid > *', 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }}
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="features"
      className="relative min-h-screen py-20 px-6"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SplitTextComponent
            split="lines"
            stagger={0.1}
            duration={1}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          >
            <h2 
              id="features-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ 
                fontFamily: themeConfig.typography.display.fontFamily,
                background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built for creators
            </h2>
          </SplitTextComponent>
          <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
            Every feature designed to keep you in the flow — from first idea to final asset.
          </p>
        </div>

        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}