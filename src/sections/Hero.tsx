import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeConfig } from '../theme/theme.config';
import { SplitTextComponent } from '../components/ui/SplitText';
import { Button } from '../components/ui/Button';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const magneticRef = useMagnetic({ strength: themeConfig.cursor.magneticStrength });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set('.hero-content > *', { opacity: 0, y: 40 });
      
      gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.3 });
      gsap.to('.hero-headline', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 });
      gsap.to('.hero-subheadline', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.7 });
      gsap.to('.hero-cta', { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.9 });
      gsap.to('.hero-wordmark', { opacity: 1, y: 0, duration: 1.5, ease: 'expo.out', delay: 1.2 });
    }, section);

    return () => ctx.revert();
  }, []);

  const combinedCtaRef = (el: HTMLButtonElement | null) => {
    ctaRef.current = el;
    magneticRef.current = el;
  };

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* Soft gradient behind headline for legibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 15% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />
      
      <div className="hero-content relative z-10 px-6 max-w-7xl mx-auto w-full">
        <div className="hero-badge inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-8" style={{ 
          backgroundColor: `${themeConfig.palette.primary}20`,
          color: themeConfig.palette.primary,
          border: `1px solid ${themeConfig.palette.primary}40`
        }}>
          Public Beta — Start Free
        </div>

        <SplitTextComponent
          split="lines"
          className="hero-headline"
          stagger={0.1}
          duration={1.2}
          ease="expo.out"
          from={{ opacity: 0, y: 50 }}
          to={{ opacity: 1, y: 0 }}
        >
          <h1 
            id="hero-headline"
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] max-w-4xl"
            style={{ 
              fontFamily: themeConfig.typography.display.fontFamily,
              background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.secondary} 50%, ${themeConfig.palette.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(138, 43, 226, 0.3))',
            }}
          >
            Turn a sentence into a world
          </h1>
        </SplitTextComponent>

        <SplitTextComponent
          split="lines"
          className="hero-subheadline"
          stagger={0.1}
          duration={1}
          delay={0.2}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
        >
          <p className="mt-6 text-lg md:text-xl max-w-2xl" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
            Describe any scene. Watch it render in seconds. No prompts, no complexity — just your imagination made visible.
          </p>
        </SplitTextComponent>

        <div className="hero-cta flex flex-col sm:flex-row gap-4 mt-10">
          <Button 
            ref={combinedCtaRef}
            size="lg"
            variant="primary"
            className="hero-cta-btn"
            style={{ 
              backgroundColor: themeConfig.palette.glow,
              fontFamily: themeConfig.typography.body.fontFamily,
            }}
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg"
            variant="ghost"
            className="hero-cta-btn"
            style={{ 
              color: themeConfig.palette.text,
              borderColor: themeConfig.palette.surfaceAlt,
              fontFamily: themeConfig.typography.body.fontFamily,
            }}
          >
            View Demos
          </Button>
        </div>

        {/* Oversized brand wordmark */}
        <SplitTextComponent
          split="chars"
          className="hero-wordmark"
          stagger={0.02}
          duration={1.5}
          delay={0.4}
          from={{ opacity: 0, y: 30, rotateX: -90 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
        >
          <div 
            className="hero-wordmark absolute bottom-8 left-1/2 -translate-x-1/2 w-[90vw] max-w-none text-center pointer-events-none"
            style={{ 
              fontFamily: themeConfig.typography.display.fontFamily,
              fontSize: 'clamp(8rem, 15vw, 24rem)',
              fontWeight: 400,
              color: `${themeConfig.palette.text}10`,
              lineHeight: 1,
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            DREAMFRAME
          </div>
        </SplitTextComponent>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: themeConfig.palette.textMuted }}>
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}