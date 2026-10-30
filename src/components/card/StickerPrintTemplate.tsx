import React from 'react';
import { Flame, Calendar, Tag, User as UserIcon, Sparkles } from 'lucide-react';
import type { UserStickersType } from '../../appwrite/db';

interface StickerPrintTemplateProps {
  craft: UserStickersType;
  imageSrc: string;
}

export const StickerPrintTemplate = React.forwardRef<HTMLDivElement, StickerPrintTemplateProps>(
  ({ craft, imageSrc }, ref) => {
    const formattedDate = new Date(craft.$createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <div
        ref={ref}
        className="w-[420px] bg-stone-950 p-5 rounded-[2.5rem] border-[6px] border-white shadow-2xl text-stone-100 font-sans select-none flex flex-col gap-4 relative overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(249, 115, 22, 0.25)',
        }}
      >
        {/* Decorative Die-Cut Outer Stitching / Contour Line */}
        <div className="absolute inset-2 border border-dashed border-stone-800 rounded-[2.2rem] pointer-events-none" />

        {/* Header Banner */}
        <div className="relative z-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1">
                HallowCraft <span className="text-orange-500">3D</span>
              </span>
              <span className="text-[9px] text-stone-400 font-medium block">
                Official Collectible Sticker
              </span>
            </div>
          </div>

          <div className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">
              2026 Edition
            </span>
          </div>
        </div>

        {/* Main Craft Image Frame */}
        <div className="relative z-10 w-full aspect-square bg-stone-900 rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-inner flex items-center justify-center">
          <img
            src={imageSrc}
            alt={craft.title}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />

          {/* Date Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-950/85 backdrop-blur-md border border-stone-700/60 rounded-xl text-[10px] font-semibold text-stone-300 flex items-center gap-1.5 shadow-md">
            <Calendar className="w-3 h-3 text-orange-400" />
            <span>{formattedDate}</span>
          </div>

          {/* Die-Cut Shiny Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        </div>

        {/* Card Metadata / Body */}
        <div className="relative z-10 px-1 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <h2 className="text-lg font-black text-white tracking-tight leading-snug line-clamp-1">
                {craft.title}
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                <UserIcon className="w-3 h-3 text-orange-400" />
                <span>Crafted by</span>
                <span className="text-stone-200 font-semibold truncate max-w-[180px]">
                  {craft.authorName || 'Spooky Crafter'}
                </span>
              </div>
            </div>
          </div>

          {craft.description && (
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 bg-stone-900/60 border border-stone-800/80 rounded-xl p-2.5">
              "{craft.description}"
            </p>
          )}

          {/* Tags */}
          {craft.tags && craft.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {craft.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 bg-stone-900 border border-stone-700 text-stone-300 rounded-lg shadow-sm"
                >
                  <Tag className="w-2.5 h-2.5 text-orange-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Branding Bar */}
        <div className="relative z-10 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[9px] text-stone-500 font-medium px-1">
          <span>Verified Digital Craft Sticker</span>
          <span className="text-stone-400">hallowcraft.app</span>
        </div>
      </div>
    );
  }
);

StickerPrintTemplate.displayName = 'StickerPrintTemplate';
