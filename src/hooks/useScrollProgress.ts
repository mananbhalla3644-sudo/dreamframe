import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateProgress = () => {
      setProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const registerSection = (sectionId: string, element: HTMLElement | null) => {
    if (!element) return;

    ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        setSectionProgress(prev => ({ ...prev, [sectionId]: self.progress }));
      },
    });
  };

  return { progress, sectionProgress, registerSection };
}