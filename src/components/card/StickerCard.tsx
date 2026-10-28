import React from "react";
import { Calendar, Tag, Trash2, Download, Loader2 } from "lucide-react";
import type { UserStickersType } from "../../appwrite/db";
import { getStickerThumbnailUrl } from "../../appwrite/storage";

interface StickerCardProps {
  craft: UserStickersType;
  onDownload: (craft: UserStickersType) => void;
  onDelete: (craft: UserStickersType) => void;
  isDeleting?: boolean;
  isDownloading?: boolean;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  craft,
  onDownload,
  onDelete,
  isDeleting = false,
  isDownloading = false,
}) => {
  const previewUrl = getStickerThumbnailUrl(craft.fileId, 500, 500);
  const formattedDate = new Date(craft.$createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-stone-900/80 hover:border-orange-500/40 overflow-hidden shadow-lg hover:shadow-orange-950/20 transition-all duration-300 flex flex-col group rounded-[2rem] border-2 border-dashed border-stone-800">
      {/* Sticker Snapshot Thumbnail */}
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden border-stone-800/80 bg-stone-950">
        <img
          src={previewUrl}
          alt={craft.title}
          loading="lazy"
          draggable="false"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Date Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-stone-900/85 backdrop-blur-md border border-stone-700/50 rounded-md text-[10px] text-stone-300 flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5 text-orange-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Action Buttons (Download & Delete) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={() => onDownload(craft)}
            disabled={isDownloading}
            title="Download Sticker Card"
            className="p-1.5 bg-stone-900/85 hover:bg-orange-950/80 hover:text-orange-300 backdrop-blur-md border border-stone-700/50 hover:border-orange-500/50 rounded-lg text-stone-300 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => onDelete(craft)}
            disabled={isDeleting}
            title="Delete Sticker"
            className="p-1.5 bg-stone-900/85 hover:bg-red-950/80 hover:text-red-300 backdrop-blur-md border border-stone-700/50 hover:border-red-700/50 rounded-lg text-stone-300 hover:text-red-300 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Sticker Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
            {craft.title}
          </h3>
          {craft.description && (
            <p className="text-xs text-stone-400 line-clamp-2 mt-1">
              {craft.description}
            </p>
          )}
        </div>

        {/* Tags List */}
        {craft.tags && craft.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {craft.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 bg-stone-950 border border-stone-800 text-stone-400 rounded-md"
              >
                <Tag className="w-2.5 h-2.5 text-orange-500/80" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

