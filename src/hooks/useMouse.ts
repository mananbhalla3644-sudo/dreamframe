import { useEffect, useRef, useState } from 'react';

export function useMouse(damping = 0.1) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smoothed, setSmoothed ] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    const smooth = () => {
      setSmoothed(prev => ({
        x: prev.x + (position.x - prev.x) * damping,
        y: prev.y + (position.y - prev.y) * damping,
      }));
      rafRef.current = requestAnimationFrame(smooth);
    };
    smooth();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [damping]);

  return { position, smoothed };
}

export function useNormalizedMouse(damping = 0.1) {
  const { smoothed } = useMouse(damping);
  
  return {
    x: (smoothed.x / window.innerWidth) * 2 - 1,
    y: -(smoothed.y / window.innerHeight) * 2 + 1,
  };
}