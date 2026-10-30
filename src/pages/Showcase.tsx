import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, RefreshCw, Sparkles, Search, Loader2, Ghost, Flame } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useAppDataStore } from '../zustand/store';
import type { UserStickersType } from '../appwrite/db';
import { getStickerThumbnailUrl, downloadStickerThumbnailUrl } from '../appwrite/storage';
import { StickerPrintTemplate } from '../components/card/StickerPrintTemplate';
import { primaryBtn } from '../utils/btnUi';

export const Showcase: React.FC = () => {
  const { publishedStickers, isPublishedStickersLoading, fetchPublishedStickers } =
    useAppDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingCraftId, setDownloadingCraftId] = useState<string | null>(null);
  const [exportTarget, setExportTarget] = useState<{
    craft: UserStickersType;
    imageSrc: string;
  } | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPublishedStickers();
  }, [fetchPublishedStickers]);

  const handleRefresh = () => {
    fetchPublishedStickers(true);
  };

  const handleDownload = async (craft: UserStickersType) => {
    try {
      setDownloadingCraftId(craft.$id);

      // 1. Get high-res thumbnail URL
      const rawImageUrl = getStickerThumbnailUrl(craft.fileId, 800, 800);

      // 2. Mount export target into off-screen template
      setExportTarget({ craft, imageSrc: rawImageUrl });

      // 3. Allow React to render offscreen template
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!printRef.current) {
        throw new Error('Print template DOM node not available');
      }

      // 4. Convert template into PNG
      const dataUrl = await toPng(printRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      // 5. Trigger download
      const cleanTitle = (craft.title || 'pumpkin-sticker')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '-');
      const link = document.createElement('a');
      link.download = `${cleanTitle}-sticker.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Card PNG export failed, attempting direct download:', error);
      try {
        const downloadUrl = downloadStickerThumbnailUrl(craft.fileId);
        const cleanTitle = (craft.title || 'pumpkin-sticker')
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, '-');
        const link = document.createElement('a');
        link.download = `${cleanTitle}.png`;
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Direct download also failed:', fallbackError);
        alert('Could not download sticker. Please try again.');
      }
    } finally {
      setExportTarget(null);
      setDownloadingCraftId(null);
    }
  };

  const filteredStickers = useMemo(() => {
    if (!searchQuery.trim()) return publishedStickers;
    const q = searchQuery.toLowerCase().trim();
    return publishedStickers.filter((craft) => {
      const titleMatch = craft.title?.toLowerCase().includes(q);
      const authorMatch = craft.authorName?.toLowerCase().includes(q);
      const tagMatch = craft.tags?.some((t) => t.toLowerCase().includes(q));
      return titleMatch || authorMatch || tagMatch;
    });
  }, [publishedStickers, searchQuery]);

  const tilts = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'];

  return (
    <div className="flex-1 w-full flex flex-col font-sans select-none">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Sparkles className="w-3 h-3" />
                Community Patch
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Pumpkin Showcase</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400">
                {publishedStickers.length} {publishedStickers.length === 1 ? 'sticker' : 'stickers'}
              </span>
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-xl">
              Collect and download die-cut Jack-o'-Lantern stickers carved by crafters across the
              globe.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isPublishedStickersLoading}
              title="Refresh stickers"
              className="p-2.5 text-stone-400 hover:text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isPublishedStickersLoading ? 'animate-spin' : ''}`}
              />
            </button>

            <Link
              to="/craft"
              className={`${primaryBtn} !px-4 !py-2 !text-xs sm:!text-sm flex items-center gap-1.5`}
            >
              <Flame className="w-4 h-4" />
              <span>Carve Your Own</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {publishedStickers.length > 0 && (
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by sticker name, crafter, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-900/70 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/40 transition-all"
            />
          </div>
        )}

        {/* Loading Skeletons */}
        {isPublishedStickersLoading && publishedStickers.length === 0 && (
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <li
                key={i}
                className="rounded-[2rem] border-2 border-dashed border-stone-800 bg-stone-900/50 p-5 flex flex-col space-y-4 animate-pulse"
              >
                <div className="aspect-square w-full bg-stone-800/60 rounded-2xl" />
                <div className="flex justify-between items-end gap-2 pt-1">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-stone-800/60 rounded-md w-3/4" />
                    <div className="h-3 bg-stone-800/40 rounded-md w-1/2" />
                  </div>
                  <div className="h-8 w-8 bg-stone-800/50 rounded-xl shrink-0" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty State: No stickers at all */}
        {!isPublishedStickersLoading && publishedStickers.length === 0 && (
          <div className="border-2 border-dashed border-stone-800 bg-stone-900/30 rounded-3xl p-10 sm:p-16 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shadow-lg shadow-orange-950/30">
              <Ghost className="w-8 h-8 opacity-80 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">The Pumpkin Patch is Empty</h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm">
                No stickers have been published yet. Be the first to carve a pumpkin and share it
                with the world!
              </p>
            </div>

            <Link
              to="/craft"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-950/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Carve First Pumpkin</span>
            </Link>
          </div>
        )}

        {/* Empty State: Search found nothing */}
        {!isPublishedStickersLoading &&
          publishedStickers.length > 0 &&
          filteredStickers.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <p className="text-stone-400 text-sm">
                No stickers matched your search for{' '}
                <span className="text-orange-400 font-semibold">"{searchQuery}"</span>.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-orange-500 hover:text-orange-400 underline underline-offset-4 cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}

        {/* Sticker Grid (Landing line 327 design) */}
        {filteredStickers.length > 0 && (
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredStickers.map((craft, idx) => {
              const tilt = tilts[idx % tilts.length];
              const previewUrl = getStickerThumbnailUrl(craft.fileId, 500, 500);
              const isDownloading = downloadingCraftId === craft.$id;

              return (
                <li
                  key={craft.$id}
                  className={`transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${tilt}`}
                >
                  {/* die-cut sticker look */}
                  <div className="rounded-[2rem] border-2 border-dashed border-stone-700 bg-stone-900 p-5 group hover:border-orange-500/50 transition-colors flex flex-col justify-between h-full shadow-lg hover:shadow-orange-950/20">
                    {/* Sticker Image */}
                    <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden rounded-2xl bg-stone-950/60 p-3">
                      <img
                        src={previewUrl}
                        alt={craft.title}
                        loading="lazy"
                        draggable="false"
                        className="mx-auto w-full h-full max-w-[11rem]_ object-cover transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    {/* Card Metadata & Download Action */}
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white group-hover:text-orange-300 transition-colors">
                          {craft.title || 'Spooky Pumpkin'}
                        </p>
                        <p className="truncate text-sm text-stone-500">
                          by @{craft.authorName || 'anonymous'}
                        </p>
                      </div>

                      {/* Download Icon Button */}
                      <button
                        onClick={() => handleDownload(craft)}
                        disabled={isDownloading}
                        title="Download sticker"
                        aria-label={`Download ${craft.title || 'sticker'}`}
                        className="flex shrink-0 items-center justify-center p-2 rounded-xl text-stone-400 hover:text-orange-400 hover:bg-stone-800/80 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                        ) : (
                          <Download className="h-4 w-4 transition-transform hover:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Hidden Off-Screen Sticker Print Template (for high-res export) */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          pointerEvents: 'none',
          zIndex: -100,
        }}
        aria-hidden="true"
      >
        {exportTarget && (
          <StickerPrintTemplate
            ref={printRef}
            craft={exportTarget.craft}
            imageSrc={exportTarget.imageSrc}
          />
        )}
      </div>
    </div>
  );
};

export default Showcase;
