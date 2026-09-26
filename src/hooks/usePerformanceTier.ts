import { useEffect, useState } from 'react';

export type PerformanceTier = 'ULTRA' | 'BALANCED' | 'LITE' | 'STATIC';

interface TierConfig {
  dpr: number;
  postProcessing: string[];
  maxParticles: number;
  threeComplexity: 'full' | 'reduced' | 'hero-only' | 'none';
  scrollLibrary: 'lenis' | 'lenis-light' | 'native';
}

const TIER_CONFIGS: Record<PerformanceTier, TierConfig> = {
  ULTRA: {
    dpr: 2,
    postProcessing: ['bloom', 'depthOfField', 'chromaticAberration', 'noise'],
    maxParticles: 50000,
    threeComplexity: 'full',
    scrollLibrary: 'lenis',
  },
  BALANCED: {
    dpr: 1.5,
    postProcessing: ['bloom', 'noise'],
    maxParticles: 15000,
    threeComplexity: 'reduced',
    scrollLibrary: 'lenis',
  },
  LITE: {
    dpr: 1,
    postProcessing: [],
    maxParticles: 3000,
    threeComplexity: 'hero-only',
    scrollLibrary: 'lenis-light',
  },
  STATIC: {
    dpr: 1,
    postProcessing: [],
    maxParticles: 0,
    threeComplexity: 'none',
    scrollLibrary: 'native',
  },
};

let currentTier: PerformanceTier = 'BALANCED';
const listeners: Set<(tier: PerformanceTier) => void> = new Set();

export function usePerformanceTier(): { tier: PerformanceTier; config: TierConfig } {
  const [tier, setTier] = useState<PerformanceTier>(() => {
    if (typeof window === 'undefined') return 'BALANCED';
    return detectInitialTier();
  });

  useEffect(() => {
    listeners.add(setTier);
    return () => {
      listeners.delete(setTier);
    };
  }, []);

  return { tier, config: TIER_CONFIGS[tier] };
}

function detectInitialTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'BALANCED';

  // Check URL override first
  const params = new URLSearchParams(window.location.search);
  const override = params.get('tier') as PerformanceTier | null;
  if (override && override in TIER_CONFIGS) return override;

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'STATIC';
  }

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'STATIC';

  // Hardware signals
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 8;
  const saveData = (navigator as any).connection?.saveData;
  const isMobile = window.innerWidth < 768;

  if (isMobile || memory <= 4 || saveData || cores <= 4) {
    return 'LITE';
  }

  // High-end desktop
  if (cores >= 8 && memory >= 8 && !isMobile) {
    return 'ULTRA';
  }

  return 'BALANCED';
}

export function setPerformanceTier(tier: PerformanceTier) {
  currentTier = tier;
  listeners.forEach((cb) => cb(tier));
}

export function getCurrentTier(): PerformanceTier {
  return currentTier;
}

export function getTierConfig(tier: PerformanceTier): TierConfig {
  return TIER_CONFIGS[tier];
}

// Runtime adaptation based on FPS
let fpsSamples: number[] = [];
let animationFrameId: number | null = null;

export function startFPSMonitoring() {
  if (animationFrameId) return;
  
  let lastTime = performance.now();
  
  function tick(now: number) {
    const delta = now - lastTime;
    const fps = 1000 / delta;
    fpsSamples.push(fps);
    
    if (fpsSamples.length > 120) { // ~2 seconds at 60fps
      const avgFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
      
      if (avgFps < 45 && currentTier !== 'STATIC') {
        const tiers: PerformanceTier[] = ['ULTRA', 'BALANCED', 'LITE'];
        const currentIndex = tiers.indexOf(currentTier);
        if (currentIndex < tiers.length - 1) {
          setPerformanceTier(tiers[currentIndex + 1]);
        }
      }
      
      fpsSamples = [];
    }
    
    lastTime = now;
    animationFrameId = requestAnimationFrame(tick);
  }
  
  animationFrameId = requestAnimationFrame(tick);
}

export function stopFPSMonitoring() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}