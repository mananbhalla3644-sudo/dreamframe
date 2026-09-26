'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceTier } from '../../hooks/usePerformanceTier';
import { randomVec3 } from '../../lib/mathUtils';
import { themeConfig } from '../../theme/theme.config';

export function ParticleField() {
  const { tier, config } = usePerformanceTier();
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  if (config.maxParticles === 0 || config.threeComplexity === 'none') return null;

  const particleCount = Math.min(config.maxParticles, tier === 'ULTRA' ? 50000 : tier === 'BALANCED' ? 15000 : 3000);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(themeConfig.three.shaderMood.colorRamp[0]);
    const colorB = new THREE.Color(themeConfig.three.shaderMood.colorRamp[1]);

    for (let i = 0; i < particleCount; i++) {
      const pos = randomVec3(50);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      sizes[i] = Math.random() * 2 + 0.5;

      const t = Math.random();
      const color = new THREE.Color().lerpColors(colorA, colorB, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      alphas[i] = Math.random() * 0.5 + 0.2;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geo;
  }, [particleCount, tier]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_state, delta) => {
    timeRef.current += delta;
    
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = pointsRef.current.geometry.attributes.velocity.array as Float32Array;
      const alphas = pointsRef.current.geometry.attributes.alpha.array as Float32Array;
      
      // Subtle rotation of entire field
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x += delta * 0.002;
      
      // Animate individual particles
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        
        // Pulsing alpha
        alphas[i] = 0.2 + Math.sin(timeRef.current * 2 + i * 0.01) * 0.3;
        
        // Wrap around
        const dist = Math.sqrt(
          positions[i * 3] ** 2 + 
          positions[i * 3 + 1] ** 2 + 
          positions[i * 3 + 2] ** 2
        );
        if (dist > 60) {
          const newPos = randomVec3(50);
          positions[i * 3] = newPos.x;
          positions[i * 3 + 1] = newPos.y;
          positions[i * 3 + 2] = newPos.z;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.alpha.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}