'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AssetLoader } from '../../lib/assetLoader';
import { themeConfig } from '../../theme/theme.config';
import { SplitTextComponent } from './SplitText';

interface LoaderProps {
  onComplete: () => void;
  assets?: string[];
}

export function Loader({ onComplete, assets = [] }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef<AssetLoader>(new AssetLoader());

  useEffect(() => {
    const loader = loaderRef.current;
    
    loader.addMultiple([
      // Critical hero assets would go here
      ...assets,
    ]);

    loader.load({
      onProgress: (p: { percentage: number }) => setProgress(p.percentage),
      onComplete: () => {
        gsap.to('.loader-content', {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set('.loader', { display: 'none' });
            onComplete();
          },
        });
      },
      onError: (error: Error) => {
        console.error('Asset loading failed:', error);
        onComplete();
      },
    });

    return () => loader.abort();
  }, [assets, onComplete]);

  return (
    <div 
      className="loader fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: themeConfig.palette.bg }}
      role="status"
      aria-label="Loading DREAMFRAME"
    >
      <div className="loader-content text-center">
        <SplitTextComponent
          split="chars"
          stagger={0.03}
          duration={1.5}
          ease="expo.out"
          from={{ opacity: 0, y: 50, rotateX: -90 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
        >
          DREAMFRAME
        </SplitTextComponent>
        
        <div className="mt-8 w-64 mx-auto">
          <div 
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: themeConfig.palette.surface }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${themeConfig.palette.primary}, ${themeConfig.palette.accent})`,
              }}
            />
          </div>
          <p className="mt-4 text-textMuted text-sm font-mono">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}