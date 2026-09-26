import { Suspense, lazy, useState, useEffect } from 'react';
import { Scene } from './components/three/Scene';
import { CameraRig } from './components/three/CameraRig';
import { HeroObject } from './components/three/HeroObject';
import { ParticleField } from './components/three/ParticleField';
import { Loader } from './components/ui/Loader';
import { Cursor } from './components/ui/Cursor';
import { Grain } from './components/ui/Grain';
import { themeConfig } from './theme/theme.config';
import { initLenis } from './lib/gsap';
import './index.css';

// Lazy load sections for performance
const Hero = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })));
const Story = lazy(() => import('./sections/Story').then(m => ({ default: m.Story })));
const Features = lazy(() => import('./sections/Features').then(m => ({ default: m.Features })));
const Showcase = lazy(() => import('./sections/Showcase').then(m => ({ default: m.Showcase })));
const Stats = lazy(() => import('./sections/Stats').then(m => ({ default: m.Stats })));
const Contact = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })));

function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: themeConfig.palette.bg }}>
      <div className="text-center">
        <div className="text-4xl font-bold" style={{ fontFamily: themeConfig.typography.display.fontFamily, color: themeConfig.palette.text }}>
          DREAMFRAME
        </div>
        <div className="mt-4 h-2 w-48 mx-auto rounded-full overflow-hidden" style={{ backgroundColor: themeConfig.palette.surface }}>
          <div className="h-full rounded-full animate-pulse" style={{ background: `linear-gradient(90deg, ${themeConfig.palette.primary}, ${themeConfig.palette.accent})`, width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initLenis();
  }, []);

  return (
    <>
      {!isLoaded && (
        <Loader 
          onComplete={() => setIsLoaded(true)}
          assets={[]}
        />
      )}
      
      {isLoaded && (
        <>
          <Scene camera={{ position: [0, 0, 15], fov: 50 }}>
            <CameraRig />
            <HeroObject />
            <ParticleField />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={2} color={themeConfig.palette.primary} />
            <pointLight position={[-10, 5, 15]} intensity={1.5} color={themeConfig.palette.accent} />
            <directionalLight position={[5, 10, 5]} intensity={1} color={themeConfig.palette.secondary} />
          </Scene>

          <Cursor />
          <Grain />

          <main className="relative z-10 min-h-screen">
            <Suspense fallback={<LoadingFallback />}>
              <Hero />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Story />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Features />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Showcase />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Stats />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <Contact />
            </Suspense>
          </main>
        </>
      )}
    </>
  );
}