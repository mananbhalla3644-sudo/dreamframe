'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  reversed?: boolean;
}

export function Marquee({
  children,
  className = '',
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  reversed = false,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationId, setAnimationId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = ref.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerWidth = container.offsetWidth;
    const contentWidth = content.scrollWidth;
    
    if (contentWidth <= containerWidth) return;

    let position = reversed ? contentWidth : -contentWidth;
    const step = speed / 60;

    const animate = () => {
      if (!isPaused) {
        if (direction === 'left') {
          position -= step;
          if (position <= -contentWidth) position = containerWidth;
        } else {
          position += step;
          if (position >= containerWidth) position = -contentWidth;
        }
        content.style.transform = `translateX(${position}px)`;
      }
      setAnimationId(requestAnimationFrame(animate));
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [speed, direction, isPaused, reversed]);

  useEffect(() => {
    if (!pauseOnHover) return;
    
    const container = ref.current;
    if (!container) return;

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pauseOnHover]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={contentRef} className="flex whitespace-nowrap" aria-hidden="true">
        {children}
        {children}
      </div>
    </div>
  );
}