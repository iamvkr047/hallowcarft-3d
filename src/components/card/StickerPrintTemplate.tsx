import React from 'react';
import type { UserStickersType } from '../../appwrite/db';

interface StickerPrintTemplateProps {
  craft: UserStickersType;
  imageSrc: string;
}

export const StickerPrintTemplate = React.forwardRef<HTMLDivElement, StickerPrintTemplateProps>(
  ({ craft, imageSrc }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[200px] rounded-[1rem] border-1 border-dashed border-stone-700 bg-stone-900 p-3 font-sans select-none flex flex-col justify-between shadow-2xl"
      >
        {/* Sticker Image Container */}
        <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden rounded-2xl bg-stone-950/60 p-3">
          <img
            src={imageSrc}
            alt={craft.title}
            crossOrigin="anonymous"
            className="mx-auto w-full h-full object-cover drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Card Metadata */}
        <div className="mt-2 flex flex-col gap-1">
          <p className="truncate font-semibold text-sm text-white">
            {craft.title || 'Spooky Pumpkin'}
          </p>

          {craft.description && (
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {craft.description}
            </p>
          )}

          <p className="truncate text-xs text-stone-500 mt-1">
            by @{craft.authorName || 'anonymous'}
          </p>
        </div>
      </div>
    );
  }
);

StickerPrintTemplate.displayName = 'StickerPrintTemplate';
