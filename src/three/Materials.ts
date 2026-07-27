import * as THREE from 'three';
import { THREE_DEFAULTS } from './constants';

export const createAetherMaterial = (color: string = THREE_DEFAULTS.colors.primary) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.8,
    roughness: 0.2,
    wireframe: false,
  });
};

export const createGlowMaterial = (color: string = THREE_DEFAULTS.colors.secondary) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.6,
  });
};
