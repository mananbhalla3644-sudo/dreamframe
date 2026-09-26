'use client';

import { useEffect, useRef, useState } from 'react';
import { themeConfig } from '../../theme/theme.config';

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window) return; // Disable on touch devices

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const smooth = () => {
      const damping = 0.15;
      smoothed.current.x += (mouse.current.x - smoothed.current.x) * damping;
      smoothed.current.y += (mouse.current.y - smoothed.current.y) * damping;

      if (cursor) {
        cursor.style.transform = `translate(${smoothed.current.x}px, ${smoothed.current.y}px) translate(-50%, -50%)`;
      }
      if (follower) {
        follower.style.transform = `translate(${smoothed.current.x}px, ${smoothed.current.y}px) translate(-50%, -50%) scale(${isHovering ? themeConfig.cursor.hoverScale : 1})`;
      }

      rafRef.current = requestAnimationFrame(smooth);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    smooth();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('button, a, [role="button"], input, textarea, select, .magnetic');
      setIsHovering(isInteractive);
    };

    document.addEventListener('mouseover', handleHover);
    return () => document.removeEventListener('mouseover', handleHover);
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          width: themeConfig.cursor.size,
          height: themeConfig.cursor.size,
          borderRadius: '50%',
          backgroundColor: themeConfig.cursor.color,
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'difference',
        }}
        aria-hidden="true"
      />
      <div
        ref={followerRef}
        className="fixed pointer-events-none z-[9998] transition-all duration-300"
        style={{
          width: themeConfig.cursor.size * 1.5,
          height: themeConfig.cursor.size * 1.5,
          borderRadius: '50%',
          border: `2px solid ${themeConfig.cursor.color}`,
          opacity: isVisible ? 0.6 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}