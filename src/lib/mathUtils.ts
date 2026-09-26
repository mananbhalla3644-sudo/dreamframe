import * as THREE from 'three';

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const lerpVec3 = (a: THREE.Vector3, b: THREE.Vector3, t: number, out = new THREE.Vector3()): THREE.Vector3 => {
  return out.lerpVectors(a, b, t);
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomVec3 = (radius: number, out = new THREE.Vector3()): THREE.Vector3 => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.cbrt(Math.random());
  out.set(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
  return out;
};

export const createCatmullRomCurve = (points: THREE.Vector3[]): THREE.CatmullRomCurve3 => {
  return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
};

export const getPointOnCurve = (curve: THREE.CatmullRomCurve3, progress: number, out = new THREE.Vector3()): THREE.Vector3 => {
  return curve.getPointAt(progress, out);
};