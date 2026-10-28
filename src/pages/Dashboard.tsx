import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Flame,
    Plus,
    Sparkles,
    LogOut,
    User as UserIcon,
    RefreshCw,
    Layers,
} from "lucide-react";
import { toPng } from "html-to-image";
import { useAppDataStore } from "../zustand/store";
import { deleteSticker, type UserStickersType } from "../appwrite/db";
import { getStickerThumbnailUrl } from "../appwrite/storage";
import { StickerCard } from "../components/card/StickerCard";
import { StickerPrintTemplate } from "../components/card/StickerPrintTemplate";

export const Dashboard: React.FC = () => {
    const {
        user,
        logout,
        stickers,
        isStickersLoading,
        fetchStickers,
        removeSticker,
    } = useAppDataStore();
    const navigate = useNavigate();

    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [downloadingCraftId, setDownloadingCraftId] = useState<string | null>(null);
    const [exportTarget, setExportTarget] = useState<{
        craft: UserStickersType;
        imageSrc: string;
    } | null>(null);

    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            fetchStickers(user.$id);
        }
    }, [user, fetchStickers]);

    const handleRefresh = () => {
        if (user) {
            fetchStickers(user.$id, true);
        }
    };

    const handleDelete = async (rowId: string, fileId: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setIsDeletingId(rowId);
        const res = await deleteSticker(rowId, fileId);
        setIsDeletingId(null);

        if (res.status) {
            removeSticker(rowId);
        } else {
            alert(res.message || "Failed to delete sticker.");
        }
    };

    const handleDownloadStickerCard = async (craft: UserStickersType) => {
        try {
            setDownloadingCraftId(craft.$id);

            // 1. Get raw thumbnail URL
            const rawImageUrl = getStickerThumbnailUrl(craft.fileId, 800, 800);

            // 2. Fetch image as blob and convert to local data URL
            // This prevents any cross-origin canvas taint issues in html-to-image
            let inlineImageSrc = rawImageUrl;
            // try {
            //     const response = await fetch(rawImageUrl);
            //     const blob = await response.blob();
            //     inlineImageSrc = await new Promise<string>((resolve, reject) => {
            //         const reader = new FileReader();
            //         reader.onloadend = () => resolve(reader.result as string);
            //         reader.onerror = reject;
            //         reader.readAsDataURL(blob);
            //     });
            // } catch (err) {
            //     console.warn("Could not inline blob image, using direct URL fallback:", err);
            // }

            // 3. Mount export target into the off-screen template
            setExportTarget({ craft, imageSrc: inlineImageSrc });

            // 4. Brief delay to let React finish rendering the offscreen template
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (!printRef.current) {
                throw new Error("Print template DOM node not available");
            }

            // 5. Convert off-screen sticker template to PNG at 2x sharpness
            const dataUrl = await toPng(printRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            });

            // 6. Trigger download
            const cleanTitle = (craft.title || "pumpkin-sticker")
                .toLowerCase()
                .replace(/[^a-z0-9]/gi, "-");
            const link = document.createElement("a");
            link.download = `${cleanTitle}-sticker.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download sticker card:", error);
            alert("Could not generate sticker card image. Please try again.");
        } finally {
            setExportTarget(null);
            setDownloadingCraftId(null);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col font-sans select-none overflow-y-auto">
            {/* Top Navbar */}
            <header className="sticky top-0 z-30 w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-lg shadow-orange-950/50 group-hover:bg-orange-500/30 transition-colors">
                            <Flame className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                                HallowCraft <span className="text-orange-500">3D</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {user && (
                        <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-xl shadow-sm">
                            <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                                <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs text-stone-300 font-medium max-w-[120px] truncate hidden sm:inline">
                                {user.name || user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                title="Log Out"
                                className="p-1 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors ml-0.5 cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
                {/* Banner Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                            <span>My Pumpkin Crafts</span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400">
                                {stickers.length} {stickers.length === 1 ? "craft" : "crafts"}
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-400 mt-1">
                            Your published 3D Jack-o'-Lantern stickers showcased on the web.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={isStickersLoading}
                            title="Refresh crafts"
                            className="p-2 text-stone-400 hover:text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isStickersLoading ? "animate-spin" : ""}`} />
                        </button>
                        <Link
                            to="/craft"
                            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600/90 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-orange-950/40"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Open Carver</span>
                        </Link>
                    </div>
                </div>

                {/* Loading Skeletons */}
                {isStickersLoading && stickers.length === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 flex flex-col space-y-3 animate-pulse"
                            >
                                <div className="w-full aspect-square bg-stone-800/60 rounded-xl" />
                                <div className="h-4 bg-stone-800/60 rounded-md w-3/4" />
                                <div className="h-3 bg-stone-800/40 rounded-md w-1/2" />
                                <div className="pt-2 flex justify-between items-center">
                                    <div className="h-3 bg-stone-800/40 rounded-md w-1/3" />
                                    <div className="h-6 w-6 bg-stone-800/50 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State Shell */}
                {!isStickersLoading && stickers.length === 0 && (
                    <div className="border-2 border-dashed border-stone-800 bg-stone-900/30 rounded-3xl p-10 sm:p-16 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-5">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shadow-lg shadow-orange-950/30">
                            <Layers className="w-8 h-8 opacity-80" />
                        </div>

                        <div className="space-y-1.5">
                            <h2 className="text-xl font-bold text-white">No Crafts Found</h2>
                            <p className="text-xs sm:text-sm text-stone-400 max-w-sm">
                                You haven't published any pumpkin craft stickers yet. Enter the 3D carver and create your first masterpiece!
                            </p>
                        </div>

                        <Link
                            to="/craft"
                            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-950/60 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Carve a Pumpkin</span>
                        </Link>
                    </div>
                )}

                {/* Populated Grid of Sticker Cards */}
                {stickers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {stickers.map((craft) => (
                            <StickerCard
                                key={craft.$id}
                                craft={craft}
                                onDownload={handleDownloadStickerCard}
                                onDelete={(c) => handleDelete(c.$id, c.fileId, c.title)}
                                isDeleting={isDeletingId === craft.$id}
                                isDownloading={downloadingCraftId === craft.$id}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Hidden Off-Screen Sticker Print Template (for high-res export) */}
            <div
                style={{
                    position: "fixed",
                    left: "-9999px",
                    top: "-9999px",
                    pointerEvents: "none",
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