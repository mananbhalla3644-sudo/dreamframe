import { Canvas, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  EffectComposer, 
  RenderPass, 
  BloomPass, 
  NoisePass, 
  ChromaticAberrationPass, 
  DepthOfFieldPass 
} from '@react-three/postprocessing';
import { usePerformanceTier } from '../../hooks/usePerformanceTier';
import { themeConfig } from '../../theme/theme.config';

extend({ 
  EffectComposer, 
  RenderPass, 
  BloomPass, 
  NoisePass, 
  ChromaticAberrationPass, 
  DepthOfFieldPass 
});

interface SceneProps {
  children: React.ReactNode;
  camera?: THREE.PerspectiveCamera;
}

export function Scene({ children, camera }: SceneProps) {
  const { tier, config } = usePerformanceTier();

  return (
    <Canvas
      camera={camera}
      gl={{ 
        antialias: tier !== 'LITE', 
        alpha: true, 
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      dpr={Math.min(config.dpr, window.devicePixelRatio)}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(config.dpr, window.devicePixelRatio));
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <color attach="background" args={[themeConfig.palette.bg]} />
      <fog attach="fog" args={[themeConfig.palette.bg, 10, 100]} />
      
      {children}
      
      {config.postProcessing.length > 0 && (
        <effectComposer multisampling={tier === 'ULTRA'}>
          <renderPass />
          {config.postProcessing.includes('bloom') && (
            <bloomPass
              intensity={tier === 'ULTRA' ? 1.2 : 0.8}
              mipmapBlur={true}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.025}
            />
          )}
          {config.postProcessing.includes('noise') && (
            <noisePass opacity={0.02} />
          )}
          {config.postProcessing.includes('chromaticAberration') && (
            <chromaticAberrationPass offset={[0.002, 0.002]} />
          )}
          {config.postProcessing.includes('depthOfField') && (
            <depthOfFieldPass
              focusDistance={10}
              focalLength={0.05}
              bokehScale={2}
              height={480}
            />
          )}
        </effectComposer>
      )}
    </Canvas>
  );
}