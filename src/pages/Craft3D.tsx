import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PumpkinScene } from '../components/canvas/PumpkinScene';
import { Toolbar } from '../components/ui/Toolbar';
import { PublishModal } from '../components/ui/PublishModal';
import { CarvingCanvas } from '../utils/carvingCanvas';
import type { CarveSettings } from '../types';
import { useAppDataStore } from '../zustand/store';
import { useNavbarStore } from '../zustand/navbarStore';

export const Craft3D = () => {
  const navigate = useNavigate();
  const { addSticker } = useAppDataStore();
  const { setPublishHandler, setCraft3DSettings } = useNavbarStore();

  const carvingCanvas = useMemo(() => new CarvingCanvas(2048), []);
  const [canUndo, setCanUndo] = useState(false);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishPreviewUrl, setPublishPreviewUrl] = useState<string | null>(null);
  const [publishImageFile, setPublishImageFile] = useState<File | null>(null);

  const [settings, setSettings] = useState<CarveSettings>({
    mode: 'rotate',
    tool: 'knife',
    brushSize: 4,
    isNightMode: false,
    glowIntensity: 2.5,
  });

  const handleSettingsChange = useCallback((newSettings: Partial<CarveSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const handleUndo = useCallback(() => {
    carvingCanvas.undo();
    setCanUndo(carvingCanvas.hasHistory());
  }, [carvingCanvas]);

  const handleClear = useCallback(() => {
    if (window.confirm('Clear all Craftings on this pumpkin?')) {
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

  const handleOpenPublish = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('Could not find 3D canvas to capture craft snapshot.');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setPublishPreviewUrl(dataUrl);

      // Convert base64 dataURL to File
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `pumpkin-${Date.now()}.png`, { type: 'image/png' });

      setPublishImageFile(file);
      setIsPublishModalOpen(true);
    } catch (err) {
      console.error('Failed to capture snapshot for publishing:', err);
    }
  }, []);

  useEffect(() => {
    setPublishHandler(handleOpenPublish);
    return () => setPublishHandler(null);
  }, [handleOpenPublish, setPublishHandler]);

  useEffect(() => {
    setCraft3DSettings({ mode: settings.mode, isNightMode: settings.isNightMode });
    return () => setCraft3DSettings(null);
  }, [settings.mode, settings.isNightMode, setCraft3DSettings]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-stone-950 font-sans select-none">
      <div className="flex-1 min-h-0 w-full relative">
        <PumpkinScene
          modelUrl="/Pumpkin.fbx"
          carvingCanvas={carvingCanvas}
          settings={settings}
          onCanUndoChange={setCanUndo}
        />
      </div>

      <Toolbar
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onUndo={handleUndo}
        onClear={handleClear}
        onSnapshot={handleSnapshot}
        canUndo={canUndo}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        previewUrl={publishPreviewUrl}
        imageFile={publishImageFile}
        settings={settings}
        onSuccess={(newSticker) => {
          addSticker(newSticker);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};
