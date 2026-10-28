import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Flame,
    Plus,
    Sparkles,
    Calendar,
    Tag,
    Trash2,
    LogOut,
    User as UserIcon,
    RefreshCw,
    Layers,
} from "lucide-react";
import { useAppDataStore } from "../zustand/store";
import { getUserStickers, deleteSticker, type UserStickersType } from "../appwrite/db";
import { getStickerThumbnailUrl } from "../appwrite/storage";

export const Dashboard: React.FC = () => {
    const { user, logout } = useAppDataStore();
    const navigate = useNavigate();

    const [stickers, setStickers] = useState<UserStickersType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUserCrafts = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        const res = await getUserStickers(user.$id);
        if (res.status && res.data) {
            setStickers(res.data);
        } else {
            setError(res.message || "Failed to fetch your crafts.");
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchUserCrafts();
    }, [fetchUserCrafts]);

    const handleDelete = async (rowId: string, fileId: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setIsDeletingId(rowId);
        const res = await deleteSticker(rowId, fileId);
        setIsDeletingId(null);

        if (res.status) {
            setStickers((prev) => prev.filter((s) => s.$id !== rowId));
        } else {
            alert(res.message || "Failed to delete sticker.");
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
                    {/* <Link
                        to="/craft"
                        className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Craft</span>
                    </Link> */}

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
                            onClick={fetchUserCrafts}
                            disabled={isLoading}
                            title="Refresh crafts"
                            className="p-2 text-stone-400 hover:text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                        <Link
                            to="/craft"
                            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600/90 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-orange-950/40"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Craft Pumpkin</span>
                        </Link>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-4 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-2xl flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={fetchUserCrafts}
                            className="underline text-red-200 hover:text-white font-medium"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading Skeletons */}
                {isLoading && (
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
                {!isLoading && stickers.length === 0 && (
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
                            <span>Craft a Pumpkin</span>
                        </Link>
                    </div>
                )}

                {/* Populated Grid of Sticker Cards */}
                {!isLoading && stickers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {stickers.map((craft) => {
                            const previewUrl = getStickerThumbnailUrl(craft.fileId, 500, 500);
                            const isDeleting = isDeletingId === craft.$id;
                            const formattedDate = new Date(craft.$createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });

                            return (
                                <div
                                    key={craft.$id}
                                    className="bg-stone-900/80 border border-stone-800 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-950/20 transition-all duration-300 flex flex-col group"
                                >
                                    {/* Sticker Snapshot Thumbnail */}
                                    <div className="relative w-full aspect-square bg-stone-950 flex items-center justify-center overflow-hidden border-b border-stone-800/80">
                                        <img
                                            src={previewUrl}
                                            alt={craft.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Date Badge */}
                                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-stone-900/85 backdrop-blur-md border border-stone-700/50 rounded-md text-[10px] text-stone-300 flex items-center gap-1">
                                            <Calendar className="w-2.5 h-2.5 text-orange-400" />
                                            <span>{formattedDate}</span>
                                        </div>

                                        {/* Delete Action Button */}
                                        <button
                                            onClick={() => handleDelete(craft.$id, craft.fileId, craft.title)}
                                            disabled={isDeleting}
                                            title="Delete Sticker"
                                            className="absolute top-2.5 right-2.5 p-1.5 bg-stone-900/85 hover:bg-red-950/80 hover:text-red-300 backdrop-blur-md border border-stone-700/50 hover:border-red-700/50 rounded-lg text-stone-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
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
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};