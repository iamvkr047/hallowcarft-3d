import React from 'react';
import { Flame, Sparkles, PenTool } from 'lucide-react';
import type { AppMode } from '../../types';

interface HeaderProps {
  mode: AppMode;
  isNightMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ mode, isNightMode }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-lg backdrop-blur-md transition-colors ${isNightMode
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-orange-900/50'
              : 'bg-orange-600/20 border-orange-500/40 text-orange-400 shadow-orange-950/50'
            }`}
        >
          <Flame className="w-6 h-6 animate-pulse text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-md">
            HallowCraft 3D
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
              3D Carver
            </span>
          </h1>
          <p className="text-xs text-stone-400">
            Interactive 3D Jack-o'-Lantern Experience
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 bg-stone-900/80 backdrop-blur-md border border-stone-800/80 px-4 py-1.5 rounded-full text-xs text-stone-300 pointer-events-auto shadow-md">
        {mode === 'carve' ? (
          <>
            <PenTool className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            <span className="text-orange-200">
              Drag on pumpkin to carve • Click <strong>Rotate 3D</strong> to turn around
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Drag to rotate • Scroll to zoom • Click <strong>Carve Pumpkin</strong> below</span>
          </>
        )}
      </div>
    </header>
  );
};
