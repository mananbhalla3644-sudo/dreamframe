import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeConfig } from '../theme/theme.config';
import { SplitTextComponent } from '../components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 10000, suffix: '+', label: 'Scenes Generated', icon: '🎬' },
  { value: 2.3, suffix: 's', label: 'Avg Render Time', icon: '⚡' },
  { value: 98, suffix: '%', label: 'User Satisfaction', icon: '⭐' },
  { value: 50, suffix: '+', label: 'Style Presets', icon: '🎨' },
];

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const targetValue = stat.value;
            const duration = 2;
            const startTime = performance.now();
            
            const animate = (now: number) => {
              const progress = Math.min((now - startTime) / (duration * 1000), 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              const currentValue = eased * targetValue;
              
              if (valueRef.current) {
                valueRef.current.textContent = Number.isInteger(targetValue) 
                  ? Math.floor(currentValue).toLocaleString() 
                  : currentValue.toFixed(1);
              }
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else if (valueRef.current) {
                valueRef.current.textContent = Number.isInteger(targetValue)
                  ? targetValue.toLocaleString()
                  : targetValue.toFixed(1);
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (valueRef.current) {
      observer.observe(valueRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div className="relative p-8 text-center stat-card" style={{ 
      backgroundColor: `${themeConfig.palette.surface}80`,
      border: `1px solid ${themeConfig.palette.surfaceAlt}40`,
      borderRadius: '1.5rem',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="text-4xl mb-4" aria-hidden="true">{stat.icon}</div>
      <div className="flex items-baseline justify-center gap-1">
        <SplitTextComponent
          split="chars"
          className="stat-value"
          stagger={0.03}
          duration={1.5}
          from={{ opacity: 0, y: 50, rotateX: -90 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
        >
          <span 
            ref={valueRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tabular-nums"
            style={{ 
              fontFamily: themeConfig.typography.display.fontFamily,
              background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.primary} 50%, ${themeConfig.palette.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {stat.value.toLocaleString()}
          </span>
        </SplitTextComponent>
        <span className="text-2xl md:text-3xl font-semibold" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.display.fontFamily }}>
          {stat.suffix}
        </span>
      </div>
      <SplitTextComponent
        split="lines"
        stagger={0.1}
        duration={0.8}
        delay={0.2}
        from={{ opacity: 0, y: 20 }}
        to={{ opacity: 1, y: 0 }}
      >
        <p className="mt-4 text-lg" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
          {stat.label}
        </p>
      </SplitTextComponent>
    </div>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card', 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.stats-grid', start: 'top 80%' }}
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="stats"
      className="relative py-20 px-6"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SplitTextComponent
            split="lines"
            stagger={0.1}
            duration={1}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          >
            <h2 
              id="stats-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ 
                fontFamily: themeConfig.typography.display.fontFamily,
                background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.glow} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              By the numbers
            </h2>
          </SplitTextComponent>
        </div>

        <div className="stats-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}