import type React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isCanvasPage = pathname === '/craft2d' || pathname === '/craft3d';

  return (
    <div
      className={`w-full bg-stone-950 text-stone-100 ${
        isCanvasPage ? 'h-dvh flex flex-col overflow-hidden' : 'min-h-screen flex flex-col'
      }`}
    >
      {/* Omit navbar on auth page */}
      {pathname !== '/login' && <Navbar />}

      <main
        className={
          isCanvasPage
            ? 'flex-1 min-h-0 flex flex-col overflow-hidden relative'
            : 'flex-1 flex flex-col'
        }
      >
        {children}
      </main>
    </div>
  );
};
