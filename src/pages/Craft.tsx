import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Box, Sparkles, ArrowRight, Check } from 'lucide-react';

export const Craft: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex flex-col justify-center font-sans select-none overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-600/10 blur-[130px] rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/5 blur-[140px] rounded-full"
        aria-hidden
      />

      {/* Hero / Header Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col items-center justify-center relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Choose Your Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Which dimension do you want to <span className="text-orange-500">carve</span> in?
          </h1>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            Design a flat 2D Jack-o'-Lantern with custom stamps and paint bucket fills, or sculpt in
            interactive 3D with rotational physics and candle flame glow.
          </p>
        </div>

        {/* Studio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* 2D Studio Card */}
          <div
            onClick={() => navigate('/craft2d')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/craft2d');
            }}
            className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950 border border-stone-800 p-6 sm:p-8 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {/* Glow accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />

            <div>
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
                  <Palette className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400 group-hover:text-orange-400 group-hover:border-orange-500/30 transition-colors">
                  2D Canvas
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-orange-400 transition-colors flex items-center gap-2">
                <span>2D Pumpkin Canvas</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                Draw freehand cuts, place hollow shapes and ready-made smile stamps, and flood fill
                enclosed shapes with the color bucket.
              </p>

              {/* Features list */}
              <ul className="space-y-2.5 mb-8 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Freehand brush & precision eraser</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Color bucket tool for fast enclosed fills</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Hollow stamps: circles, triangles & 4 smile faces</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Smooth zoom, pan, undo/redo & instant PNG save</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 group-hover:bg-orange-500 text-stone-200 group-hover:text-stone-950 text-sm font-bold flex items-center justify-between border border-stone-800 group-hover:border-orange-400 transition-all duration-300 shadow-md">
              <span>Launch 2D Studio</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3D Studio Card */}
          <div
            onClick={() => navigate('/craft3d')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/craft3d');
            }}
            className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950 border border-stone-800 p-6 sm:p-8 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {/* Glow accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />

            <div>
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
                  <Box className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                  3D WebGL
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                <span>3D Jack-o'-Lantern</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                Sculpt directly onto a 3D pumpkin mesh with 360° rotation, realistic glowing candle
                light, and atmospheric night mode.
              </p>

              {/* Features list */}
              <ul className="space-y-2.5 mb-8 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>360° orbital rotation & surface knife carving</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Flickering candle glow & night mode toggle</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Publish custom crafts to community feed</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Snapshot image & collectible sticker card export</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 group-hover:bg-orange-500 text-stone-200 group-hover:text-stone-950 text-sm font-bold flex items-center justify-between border border-stone-800 group-hover:border-orange-400 transition-all duration-300 shadow-md">
              <span>Launch 3D Carver</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-stone-500 mt-10">
          You can switch between 2D and 3D anytime or craft multiple pumpkins for your sticker
          collection.
        </p>
      </main>
    </div>
  );
};
