'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCatmullRomCurve, getPointOnCurve } from '../../lib/mathUtils';

gsap.registerPlugin(ScrollTrigger);

interface CameraRigProps {
  waypoints?: THREE.Vector3[];
  lookAtPoints?: THREE.Vector3[];
}

export function CameraRig({ waypoints, lookAtPoints }: CameraRigProps) {
  const { camera } = useThree();
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const lookAtCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Default waypoints for 4 scenes
  const defaultWaypoints = [
    new THREE.Vector3(0, 0, 15),   // Scene 1: Close to hero
    new THREE.Vector3(5, 3, 20),   // Scene 2: Pull back and up
    new THREE.Vector3(-8, 5, 30),  // Scene 3: Through particle field
    new THREE.Vector3(0, 10, 50),  // Scene 4: Wide vista
  ];

  const defaultLookAtPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(0, 2, -30),
  ];

  const points = waypoints || defaultWaypoints;
  const lookPoints = lookAtPoints || defaultLookAtPoints;

  useEffect(() => {
    curveRef.current = createCatmullRomCurve(points);
    lookAtCurveRef.current = createCatmullRomCurve(lookPoints);

    // Create scroll trigger for camera animation
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [points, lookPoints]);

  useFrame(() => {
    if (!curveRef.current || !lookAtCurveRef.current) return;
    
    const position = getPointOnCurve(curveRef.current, scrollProgress);
    const lookAt = getPointOnCurve(lookAtCurveRef.current, scrollProgress);
    
    camera.position.lerp(position, 0.1);
    camera.lookAt(lookAt);
  });

  return null; // This component doesn't render anything, just controls the camera
}

export function useCameraPath() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  return progress;
}