'use client';

import { useEffect, useRef } from 'react';
import { usePerformanceTier } from '../../hooks/usePerformanceTier';

export function Grain({ opacity = 0.03, className = '' }: { opacity?: number; className?: string }) {
  const { tier } = usePerformanceTier();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (tier !== 'LITE' && tier !== 'STATIC') return; // Only render CSS/GPU grain on lower tiers
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = opacity * 255; // A
      }
      
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tier, opacity]);

  if (tier !== 'LITE' && tier !== 'STATIC') {
    // For higher tiers, use CSS grain overlay
    return (
      <div
        className={`fixed inset-0 pointer-events-none z-50 ${className}`}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          opacity,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
      style={{ opacity, mixBlendMode: 'overlay' }}
      aria-hidden="true"
    />
  );
}