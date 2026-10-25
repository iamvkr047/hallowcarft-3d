import React, { useState, useMemo, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundry';
import { Header } from './components/ui/Header';
import { Toolbar } from './components/ui/Toolbar';
import { PumpkinScene } from './components/canvas/PumpkinScene';
import { CarvingCanvas } from './utils/carvingCanvas';
import type { CarveSettings } from './types';

const App: React.FC = () => {
  const carvingCanvas = useMemo(() => new CarvingCanvas(1024), []);
  const [canUndo, setCanUndo] = useState(false);

  const [settings, setSettings] = useState<CarveSettings>({
    mode: 'rotate',
    tool: 'knife',
    brushSize: 4,
    isNightMode: false,
    glowIntensity: 2.5,
  });

  const handleSettingsChange = useCallback(
    (newSettings: Partial<CarveSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  const handleUndo = useCallback(() => {
    carvingCanvas.undo();
    setCanUndo(carvingCanvas.hasHistory());
  }, [carvingCanvas]);

  const handleClear = useCallback(() => {
    if (window.confirm('Clear all carving on this pumpkin?')) {
      carvingCanvas.clear();
      setCanUndo(false);
    }
  }, [carvingCanvas]);

  const handleSnapshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `spooky-pumpkin-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to take snapshot:', err);
    }
  }, []);

  return (
    <ErrorBoundary>
      <main className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
        <Header mode={settings.mode} isNightMode={settings.isNightMode} />

        <PumpkinScene
          modelUrl="/Pumpkin.fbx"
          carvingCanvas={carvingCanvas}
          settings={settings}
          onCanUndoChange={setCanUndo}
        />

        <Toolbar
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onUndo={handleUndo}
          onClear={handleClear}
          onSnapshot={handleSnapshot}
          canUndo={canUndo}
        />
      </main>
    </ErrorBoundary>
  );
};

export default App;