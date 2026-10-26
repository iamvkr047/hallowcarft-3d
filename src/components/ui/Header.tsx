import React from 'react';
import { Flame, Sparkles, PenTool, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AppMode } from '../../types';
import { useAppDataStore } from '../../zustand/store';

interface HeaderProps {
  mode: AppMode;
  isNightMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ mode, isNightMode }) => {
  const { user, logout } = useAppDataStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="w-full shrink-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 select-none">
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

      <div className="hidden md:flex items-center gap-3 bg-stone-900/80 backdrop-blur-md border border-stone-800/80 px-4 py-1.5 rounded-full text-xs text-stone-300 pointer-events-auto shadow-md">
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

      <div className="flex items-center gap-2 pointer-events-auto">
        {user ? (
          <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800/80 px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-stone-200 font-medium max-w-[120px] truncate">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
