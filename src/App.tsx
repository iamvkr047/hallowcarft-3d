import React from 'react';
import ErrorBoundary from './ErrorBoundry';
import { Header } from './components/ui/Header';
import { PumpkinScene } from './components/canvas/PumpkinScene';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <main className="relative w-screen h-screen overflow-hidden bg-stone-950">
        <Header />
        <PumpkinScene modelUrl="/pumpkin.glb" />
      </main>
    </ErrorBoundary>
  );
};

export default App;