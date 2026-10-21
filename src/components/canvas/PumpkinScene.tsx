import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PumpkinModel } from './PumpkinModel';
import { CanvasLoader } from './CanvasLoader';

interface PumpkinSceneProps {
  modelUrl?: string;
}

export const PumpkinScene: React.FC<PumpkinSceneProps> = ({
  modelUrl = '/pumpkin.glb',
}) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-stone-950 via-[#120e17] to-stone-950 select-none">
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        className="w-full h-full"
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#f97316" />
        <pointLight position={[3, -1, -3]} intensity={0.4} color="#a855f7" />

        <Suspense fallback={<CanvasLoader />}>
          <Center top>
            <PumpkinModel url={modelUrl} />
          </Center>

          {/* Soft grounding shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={5}
            blur={2.4}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1.2}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking completely underneath
        />
      </Canvas>
    </div>
  );
};
