import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PumpkinModel } from './PumpkinModel';
import { CanvasLoader } from './CanvasLoader';
import { CarvingCanvas } from '../../utils/carvingCanvas';
import type { CarveSettings } from '../../types';

interface PumpkinSceneProps {
  modelUrl?: string;
  carvingCanvas: CarvingCanvas;
  settings: CarveSettings;
  onCanUndoChange: (canUndo: boolean) => void;
}

const FlickeringCandle: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime();
    const flicker =
      Math.sin(t * 14) * 0.18 + Math.sin(t * 27) * 0.12 + (Math.random() - 0.5) * 0.08;

    lightRef.current.intensity = isNight ? 3.0 + flicker : 1.0 + flicker * 0.5;
  });

  return (
    <pointLight ref={lightRef} position={[0, 0.35, 0.2]} color="#ff8800" distance={5} decay={2} />
  );
};

export const PumpkinScene: React.FC<PumpkinSceneProps> = ({
  modelUrl = '/pumpkin.glb',
  carvingCanvas,
  settings,
  onCanUndoChange,
}) => {
  const isNight = settings.isNightMode;

  return (
    <div
      className={`relative w-full h-full select-none transition-colors duration-700 ${
        isNight
          ? 'bg-gradient-to-b from-[#050409] via-[#0d0714] to-[#040307]'
          : 'bg-gradient-to-b from-stone-950 via-[#18121f] to-stone-950'
      }`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNight ? 1.4 : 1.2,
        }}
        className="w-full h-full"
      >
        {/* Dynamic Atmosphere Lighting */}
        <ambientLight intensity={isNight ? 0.2 : 0.85} />
        <directionalLight
          position={[5, 7, 4]}
          intensity={isNight ? 0.4 : 1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 2, -2]} intensity={isNight ? 0.2 : 0.8} color="#f97316" />
        <pointLight position={[3, -1, -3]} intensity={isNight ? 0.1 : 0.4} color="#a855f7" />

        {/* Flickering Candle Light */}
        <FlickeringCandle isNight={isNight} />

        <Suspense fallback={<CanvasLoader />}>
          <Center top>
            <PumpkinModel
              url={modelUrl}
              carvingCanvas={carvingCanvas}
              settings={settings}
              onCanUndoChange={onCanUndoChange}
            />
          </Center>

          {/* Soft Grounding Shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={isNight ? 0.85 : 0.7}
            scale={5}
            blur={2.4}
            far={4}
            color={isNight ? '#000000' : '#110b14'}
          />
        </Suspense>

        {/* Orbit Controls: Active ONLY during Rotate mode */}
        <OrbitControls
          makeDefault
          enabled={settings.mode === 'rotate'}
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
          // minDistance={1.2}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>
    </div>
  );
};
