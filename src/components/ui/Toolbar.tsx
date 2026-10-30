import React from 'react';
import {
  Rotate3d,
  PenTool,
  Eraser,
  Undo2,
  Trash2,
  Sun,
  Moon,
  Camera,
  Smile,
  Triangle,
} from 'lucide-react';
import type { CarveSettings, AppMode, ToolType } from '../../types';

interface ToolbarProps {
  settings: CarveSettings;
  onSettingsChange: (newSettings: Partial<CarveSettings>) => void;
  onUndo: () => void;
  onClear: () => void;
  onSnapshot: () => void;
  canUndo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onSettingsChange,
  onUndo,
  onClear,
  onSnapshot,
  canUndo,
}) => {
  const setMode = (mode: AppMode) => onSettingsChange({ mode });
  const setTool = (tool: ToolType) => onSettingsChange({ tool, mode: 'carve' });

  return (
    <div className="w-full shrink-0 z-20 flex flex-col items-center px-3 pt-1 pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="relative flex flex-col items-center">
        {/* Sub-panel for Carve Tools & Brush Sizes (floats above main bar without resizing canvas) */}
        {settings.mode === 'carve' && (
          <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2 px-3 py-2 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-orange-500/30 shadow-xl shadow-black/60 w-max max-w-[calc(100vw-1.5rem)] overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Freehand */}
            <button
              onClick={() => setTool('knife')}
              title="Brush (Freehand Draw)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                settings.tool === 'knife'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/40'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Brush</span>
            </button>

            {/* Eraser */}
            <button
              onClick={() => setTool('eraser')}
              title="Eraser (Patch Skin)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                settings.tool === 'eraser'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/40'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eraser</span>
            </button>

            <div className="w-[1px] h-5 bg-stone-700/80 mx-1" />

            {/* Stamps */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTool('triangle')}
                title="Stamp: Triangle Eye"
                className={`p-1.5 rounded-xl text-xs transition-all ${
                  settings.tool === 'triangle'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:bg-stone-800'
                }`}
              >
                <Triangle className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => setTool('smile')}
                title="Stamp: Spooky Smile"
                className={`p-1.5 rounded-xl text-xs transition-all ${
                  settings.tool === 'smile'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:bg-stone-800'
                }`}
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-5 bg-stone-700/80 mx-1" />

            {/* Brush Sizes */}
            <div className="flex items-center gap-1">
              {[2, 4, 8].map((size, idx) => (
                <button
                  key={size}
                  onClick={() => onSettingsChange({ brushSize: size })}
                  title={`Brush size: ${idx === 0 ? 'Fine (2px)' : idx === 1 ? 'Medium (4px)' : 'Wide (8px)'}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    settings.brushSize === size
                      ? 'bg-stone-700 text-orange-400 border border-orange-500/50'
                      : 'text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  <div
                    className="rounded-full bg-current"
                    style={{ width: `${4 + idx * 3}px`, height: `${4 + idx * 3}px` }}
                  />
                </button>
              ))}
            </div>

            <div className="w-[1px] h-5 bg-stone-700/80 mx-1" />

            {/* Undo & Clear */}
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              className={`p-1.5 rounded-xl text-xs transition-all ${
                canUndo ? 'text-stone-200 hover:bg-stone-800' : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClear}
              title="Clear all carving"
              className="p-1.5 rounded-xl text-xs text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Bar: Mode Toggle, Atmosphere, Snapshot */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 shadow-2xl shadow-black max-w-[calc(100vw-1.5rem)] overflow-x-auto">
          {/* Rotate Mode Button */}
          <button
            onClick={() => setMode('rotate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              settings.mode === 'rotate'
                ? 'bg-stone-800 text-white shadow border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Rotate3d className="w-4 h-4 text-orange-400" />
            <span>Rotate 3D</span>
          </button>

          {/* Carve Mode Button */}
          <button
            onClick={() => setMode('carve')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              settings.mode === 'carve'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Craft Pumpkin</span>
          </button>

          <div className="w-[1px] h-6 bg-stone-800 mx-1" />

          {/* Night / Day Candle Mode */}
          <button
            onClick={() => onSettingsChange({ isNightMode: !settings.isNightMode })}
            title={settings.isNightMode ? 'Switch to Day Light' : 'Switch to Spooky Night Candle'}
            className={`p-2 rounded-xl transition-all ${
              settings.isNightMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            {settings.isNightMode ? (
              <Moon className="w-4 h-4 fill-amber-400" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Snapshot / Download */}
          <button
            onClick={onSnapshot}
            title="Take Snapshot & Download"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all border border-stone-700"
          >
            <Camera className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
