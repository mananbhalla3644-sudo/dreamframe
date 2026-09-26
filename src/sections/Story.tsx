import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeConfig } from '../theme/theme.config';
import { SplitTextComponent } from '../components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animate story sections as they come into view
      gsap.utils.toArray('.story-block').forEach((block: any) => {
        gsap.fromTo(block.querySelector('.story-number'), 
          { opacity: 0, x: -30 }, 
          { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: block, start: 'top 80%' }}
        );
        gsap.fromTo(block.querySelector('.story-title'), 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.1, scrollTrigger: { trigger: block, start: 'top 80%' }}
        );
        gsap.fromTo(block.querySelector('.story-text'), 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.2, scrollTrigger: { trigger: block, start: 'top 80%' }}
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const stories = [
    {
      number: '01',
      title: 'Describe Your Vision',
      text: 'Type a sentence, a paragraph, or a detailed brief. DREAMFRAME understands natural language — no prompt engineering required.',
    },
    {
      number: '02',
      title: 'Watch It Render',
      text: 'Our diffusion engine interprets your words and generates a complete 3D scene in seconds. Lighting, materials, composition — all handled.',
    },
    {
      number: '03',
      title: 'Refine & Export',
      text: 'Adjust camera, lighting, and style with intuitive controls. Export high-res images, 3D assets, or animated sequences for any pipeline.',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="story"
      className="relative min-h-screen py-20 px-6"
      aria-labelledby="story-heading"
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
              id="story-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ 
                fontFamily: themeConfig.typography.display.fontFamily,
                background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.primary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              From words to worlds
            </h2>
          </SplitTextComponent>
          <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
            Three steps. No complexity. Just your imagination.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {stories.map((story) => (
            <div key={story.number} className="story-block relative group">
              <div 
                className="story-number text-6xl font-bold mb-4"
                style={{ 
                  fontFamily: themeConfig.typography.display.fontFamily,
                  color: themeConfig.palette.primary,
                  opacity: 0.3,
                }}
              >
                {story.number}
              </div>
              <SplitTextComponent
                split="lines"
                className="story-title"
                stagger={0.1}
                duration={0.8}
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: themeConfig.typography.display.fontFamily, color: themeConfig.palette.text }}>
                  {story.title}
                </h3>
              </SplitTextComponent>
              <SplitTextComponent
                split="lines"
                className="story-text"
                stagger={0.08}
                duration={0.8}
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
              >
                <p style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily, lineHeight: 1.7 }}>
                  {story.text}
                </p>
              </SplitTextComponent>
              
              {/* Decorative line */}
              <div 
                className="absolute left-0 top-12 bottom-0 w-0.5"
                style={{ 
                  background: `linear-gradient(180deg, ${themeConfig.palette.primary} 0%, transparent 100%)`,
                  opacity: 0.3,
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}