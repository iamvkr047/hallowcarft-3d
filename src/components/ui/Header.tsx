import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-950/50 backdrop-blur-md">
          <Flame className="w-6 h-6 animate-pulse text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-md">
            HallowCraft 3D
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
              Carver
            </span>
          </h1>
          <p className="text-xs text-stone-400">
            Interactive 3D Jack-o'-Lantern Experience
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 bg-stone-900/80 backdrop-blur-md border border-stone-800/80 px-3.5 py-1.5 rounded-full text-xs text-stone-300 pointer-events-auto shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </header>
  );
};
