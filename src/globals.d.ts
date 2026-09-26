// Global type declarations for @react-three/fiber JSX elements
import 'react';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    // Core
    group: any;
    mesh: any;
    points: any;
    primitive: any;
    scene: any;
    
    // Lights
    ambientLight: any;
    pointLight: any;
    directionalLight: any;
    spotLight: any;
    hemisphereLight: any;
    rectAreaLight: any;
    
    // Camera
    perspectiveCamera: any;
    orthographicCamera: any;
    
    // Helpers
    gridHelper: any;
    axesHelper: any;
    boxHelper: any;
    skeletonHelper: any;
    
    // Effects
    effectComposer: any;
    renderPass: any;
    bloomEffect: any;
    noiseEffect: any;
    chromaticAberrationEffect: any;
    depthOfFieldEffect: any;
    
    // Misc
    color: any;
    fog: any;
    background: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // R3F elements
      group: any;
      mesh: any;
      points: any;
      primitive: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      hemisphereLight: any;
      rectAreaLight: any;
      perspectiveCamera: any;
      orthographicCamera: any;
      gridHelper: any;
      axesHelper: any;
      boxHelper: any;
      skeletonHelper: any;
      effectComposer: any;
      renderPass: any;
      bloomEffect: any;
      noiseEffect: any;
      chromaticAberrationEffect: any;
      depthOfFieldEffect: any;
      color: any;
      fog: any;
      background: any;
    }
  }
}