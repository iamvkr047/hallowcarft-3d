import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { useAppDataStore } from "../zustand/store";

export const LandingPage: React.FC = () => {
    const { user } = useAppDataStore();

    return (
        <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col items-center justify-center px-4 select-none relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-xl shadow-orange-950/60">
                    <Flame className="w-9 h-9 animate-pulse" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                        HallowCraft <span className="text-orange-500">3D</span>
                    </h1>
                    <p className="text-sm sm:text-base text-stone-400">
                        Craft 3D Jack-o'-Lanterns, carve unique pumpkins, and publish your stickers to the community showcase.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Go to Carver</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/dashboard"
                                className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <span>Try Crafter</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};