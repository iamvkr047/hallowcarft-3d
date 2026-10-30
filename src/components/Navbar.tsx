import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  LogOut,
  User as UserIcon,
  Plus,
  Upload,
  PenTool,
  Sparkles,
  Layers,
  Ghost,
} from 'lucide-react';
import { useAppDataStore } from '../zustand/store';
import { useNavbarStore } from '../zustand/navbarStore';
import { primaryBtn } from '../utils/btnUi';

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAppDataStore();
  const { publishHandler, craft3DSettings } = useNavbarStore();

  const isLanding = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isCraftChooser = pathname === '/craft';
  const isCraft2D = pathname === '/craft2d';
  const isCraft3D = pathname === '/craft3d';
  const isShowcase = pathname === '/showcase';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Container width dynamically tuned to page content
  const containerWidthClass = isLanding
    ? 'max-w-6xl mx-auto px-5'
    : isDashboard || isShowcase
      ? 'max-w-6xl mx-auto px-4 sm:px-8'
      : isCraftChooser
        ? 'max-w-6xl mx-auto px-4 sm:px-8'
        : 'w-full px-4 sm:px-6';

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-stone-800/70 bg-stone-950/80 backdrop-blur select-none">
      <nav className={`flex h-16 items-center justify-between ${containerWidthClass}`}>
        {/* Left Section: Back Button + Brand Logo */}
        <div className="flex items-center gap-3">
          {!isLanding && (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-400 bg-stone-900/60 hover:bg-stone-800 hover:text-white border border-stone-800 transition-all cursor-pointer"
                title="Go Back"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className={isCraft2D || isCraft3D || isShowcase ? `hidden md:block` : ''}>
                  Back
                </span>
              </button>
              <div className="h-4 w-px bg-stone-800 hidden sm:block" />
            </>
          )}

          {isLanding ? (
            <a href="#top" className="flex items-center gap-2.5 font-bold tracking-tight group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-md shadow-orange-950/40 group-hover:bg-orange-500/30 transition-colors">
                <Ghost className="h-4 w-4 text-orange-500 animate-pulse" aria-hidden />
              </div>
              <span className="text-base text-white tracking-tight">Hallowcraft</span>
            </a>
          ) : (
            <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight group">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-md shadow-orange-950/40 group-hover:bg-orange-500/30 transition-colors">
                <Ghost className="h-4 w-4 text-orange-500 animate-pulse" aria-hidden />
              </div>
              <span
                className={`${(isCraft2D || isCraft3D || isShowcase) && 'hidden md:block'} text-base text-white tracking-tight`}
              >
                Hallowcraft
              </span>
            </Link>
          )}

          {/* Studio Sub-Badges */}
          {isCraft2D && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hidden sm:inline-block">
              2D Canvas
            </span>
          )}
          {isCraft3D && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hidden sm:inline-block">
              3D Carver
            </span>
          )}
          {isShowcase && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hidden sm:inline-block">
              Showcase
            </span>
          )}
        </div>

        {/* Center Section: Navigation Links or Dynamic Context Banners */}
        <div className="flex items-center">
          {isLanding && (
            <div className="hidden items-center gap-8 text-sm text-stone-400 md:flex">
              <a href="#features" className="transition hover:text-stone-100">
                Features
              </a>
              <a href="#how" className="transition hover:text-stone-100">
                How it works
              </a>
              <Link to="/showcase" className="transition hover:text-orange-400">
                Showcase
              </Link>
            </div>
          )}

          {isCraft3D && (
            <div className="hidden md:flex items-center gap-2.5 bg-stone-900/80 backdrop-blur-md border border-stone-800/80 px-4 py-1.5 rounded-full text-xs text-stone-300 shadow-md">
              {craft3DSettings?.mode === 'carve' ? (
                <>
                  <PenTool className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                  <span className="text-orange-200">
                    Drag on pumpkin to carve • Click <strong>Rotate 3D</strong> to turn around
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Drag to rotate • Scroll to zoom • Click <strong>Carve Pumpkin</strong> below
                  </span>
                </>
              )}
            </div>
          )}

          {isCraft2D && (
            <div className="hidden md:flex items-center gap-2 bg-stone-900/60 border border-stone-800/60 px-3.5 py-1 rounded-full text-xs text-stone-400">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Draw stamps, brush strokes & flood fill with paint bucket</span>
            </div>
          )}
        </div>

        {/* Right Section: Actions & User Info */}
        <div className="flex items-center gap-3">
          {isLanding &&
            (user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden px-3 py-2 text-sm text-stone-300 transition hover:text-orange-400 sm:inline-block"
                >
                  Dashboard
                </Link>
                <Link to="/craft" className={`${primaryBtn} !px-5 !py-2`}>
                  Craft
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm text-stone-300 transition hover:text-orange-400"
                >
                  Log in
                </Link>
                <Link to="/login" className={`${primaryBtn} !px-5 !py-2`}>
                  Sign up
                </Link>
              </>
            ))}

          {isDashboard && (
            <>
              <Link
                to="/showcase"
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-stone-400 hover:text-orange-300 transition-colors"
              >
                Showcase
              </Link>
              <Link
                to="/craft"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 transition-all shadow-md shadow-orange-950/40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Craft</span>
              </Link>

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
            </>
          )}

          {isShowcase && (
            <>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white font-medium rounded-xl border border-stone-800 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>My Crafts</span>
                  </Link>
                  <Link to="/craft" className={`${primaryBtn} !px-4 !py-1.5 !text-xs`}>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Carve</span>
                  </Link>
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
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-stone-300 transition hover:text-orange-400"
                  >
                    Log in
                  </Link>
                  <Link to="/craft" className={`${primaryBtn} !px-4 !py-1.5 !text-xs`}>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Carve Pumpkin</span>
                  </Link>
                </>
              )}
            </>
          )}

          {isCraftChooser && (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white font-medium rounded-xl border border-stone-800 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>My Crafts</span>
              </Link>

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
            </>
          )}

          {(isCraft2D || isCraft3D) && (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white font-medium rounded-xl border border-stone-800 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">My Crafts</span>
              </Link>

              {publishHandler && (
                <button
                  type="button"
                  onClick={() => publishHandler()}
                  className="flex items-center gap-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 px-3.5 py-1.5 text-xs font-semibold transition-all shadow-md shadow-orange-950/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              )}

              {user && (
                <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-stone-300 font-medium max-w-[100px] truncate hidden lg:inline">
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
