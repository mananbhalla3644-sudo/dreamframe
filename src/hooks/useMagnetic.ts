import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 100 } = options;
  const elementRef = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance < radius) {
        if (animationRef.current) animationRef.current.kill();
        animationRef.current = gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      if (animationRef.current) animationRef.current.kill();
      animationRef.current = gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove as EventListener);
    el.addEventListener('mouseleave', handleMouseLeave as EventListener);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove as EventListener);
      el.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [strength, radius]);

  return elementRef;
}