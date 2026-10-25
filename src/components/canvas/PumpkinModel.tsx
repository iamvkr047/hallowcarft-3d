import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF, useFBX, useTexture } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { CarvingCanvas } from '../../utils/carvingCanvas';
import type { CarveSettings } from '../../types';

interface PumpkinModelProps {
  url?: string;
  textureUrl?: string;
  scale?: number;
  carvingCanvas: CarvingCanvas;
  settings: CarveSettings;
  onCanUndoChange?: (canUndo: boolean) => void;
}

interface CommonModelProps {
  object: THREE.Object3D;
  scale: number;
  carvingCanvas: CarvingCanvas;
  settings: CarveSettings;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const ModelInteractive: React.FC<CommonModelProps> = ({
  object,
  scale,
  carvingCanvas,
  settings,
  onCanUndoChange,
}) => {
  const isDrawingRef = useRef(false);

  // Global pointerup safeguard
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        carvingCanvas.endStroke();
        onCanUndoChange?.(carvingCanvas.hasHistory());
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [carvingCanvas, onCanUndoChange]);

  const isFrontFacing = (e: ThreeEvent<PointerEvent>): boolean => {
    if (!e.face) return true;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(e.object.matrixWorld);
    const worldNormal = e.face.normal.clone().applyMatrix3(normalMatrix).normalize();
    const camDir = e.camera.position.clone().sub(e.point).normalize();
    return worldNormal.dot(camDir) >= 0.12;
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (settings.mode !== 'carve') return;
    if (!e.uv || !isFrontFacing(e)) return;

    e.stopPropagation();
    isDrawingRef.current = true;
    carvingCanvas.startStroke(e.uv, settings.tool, settings.brushSize);
    onCanUndoChange?.(carvingCanvas.hasHistory());
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (settings.mode !== 'carve' || !isDrawingRef.current) return;
    if (!e.uv || !isFrontFacing(e)) return;

    e.stopPropagation();
    carvingCanvas.continueStroke(e.uv, settings.tool, settings.brushSize);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDrawingRef.current) return;
    e.stopPropagation();
    isDrawingRef.current = false;
    carvingCanvas.endStroke();
    onCanUndoChange?.(carvingCanvas.hasHistory());
  };

  return (
    <primitive
      object={object}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};

const GLTFPumpkin: React.FC<PumpkinModelProps> = ({
  url = '/pumpkin.glb',
  scale = 0.05,
  carvingCanvas,
  settings,
  onCanUndoChange,
}) => {
  const { scene } = useGLTF(url);

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.emissiveMap = carvingCanvas.texture;
          mat.emissive = new THREE.Color(0xff8833);
          mat.emissiveIntensity = settings.glowIntensity;
          mat.needsUpdate = true;
          mesh.material = mat;
        }
      }
    });
  }, [scene, carvingCanvas]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = settings.isNightMode
            ? settings.glowIntensity * 1.8
            : settings.glowIntensity;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, settings.glowIntensity, settings.isNightMode]);

  return (
    <ModelInteractive
      object={scene}
      scale={scale}
      carvingCanvas={carvingCanvas}
      settings={settings}
      onCanUndoChange={onCanUndoChange}
    />
  );
};

const FBXPumpkin: React.FC<PumpkinModelProps> = ({
  url = '/Pumpkin.fbx',
  textureUrl = '/Textures/BaseColor.png',
  scale,
  carvingCanvas,
  settings,
  onCanUndoChange,
}) => {
  const fbx = useFBX(url);
  const texture = useTexture(textureUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.6,
          metalness: 0.0,
          emissiveMap: carvingCanvas.texture,
          emissive: new THREE.Color(0xff8833),
          emissiveIntensity: settings.glowIntensity,
        });
        mesh.material = mat;
      }
    });
  }, [fbx, texture, carvingCanvas]);

  useEffect(() => {
    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = settings.isNightMode
            ? settings.glowIntensity * 1.8
            : settings.glowIntensity;
          mat.needsUpdate = true;
        }
      }
    });
  }, [fbx, settings.glowIntensity, settings.isNightMode]);

  // Compute auto-scaling if scale is not specified or defaults to 0.01
  const effectiveScale = useMemo(() => {
    if (scale !== undefined) return scale;
    // Inspect bounding box to auto-normalize to ~1.2 units height/width
    const box = new THREE.Box3().setFromObject(fbx);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      // If the FBX is in centimeters (~50-100 units), normalize to ~1.4
      return 1.4 / maxDim;
    }
    return 0.01;
  }, [fbx, scale]);

  return (
    <ModelInteractive
      object={fbx}
      scale={effectiveScale}
      carvingCanvas={carvingCanvas}
      settings={settings}
      onCanUndoChange={onCanUndoChange}
    />
  );
};

export const PumpkinModel: React.FC<PumpkinModelProps> = (props) => {
  const isFBX = props.url?.toLowerCase().endsWith('.fbx');

  if (isFBX) {
    return <FBXPumpkin {...props} />;
  }

  return <GLTFPumpkin {...props} />;
};
