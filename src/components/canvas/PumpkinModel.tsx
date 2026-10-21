import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PumpkinModelProps {
  url?: string;
  scale?: number;
}

export const PumpkinModel: React.FC<PumpkinModelProps> = ({
  url = '/pumpkin.glb',
  scale = 0.01,
}) => {
  const { scene } = useGLTF(url);

  // Traverse model to ensure shadows and materials look optimal
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={scale} />;
};

// Preload the model
useGLTF.preload('/pumpkin.glb');
