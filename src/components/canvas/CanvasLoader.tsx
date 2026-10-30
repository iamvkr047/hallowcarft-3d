import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export const CanvasLoader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-orange-500/30 text-white shadow-2xl">
        <span className="text-4xl animate-bounce mb-2">🎃</span>
        <p className="font-semibold text-orange-400 tracking-wider text-sm uppercase mb-2">
          Summoning Pumpkin...
        </p>
        <div className="w-40 h-2 bg-stone-800 rounded-full overflow-hidden border border-orange-950">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-300"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <span className="text-xs text-stone-400 mt-2 font-mono">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
};
