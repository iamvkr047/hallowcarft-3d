import { useCallback, useMemo, useState } from "react";
import { PumpkinScene } from "../components/canvas/PumpkinScene"
import { Header } from "../components/ui/Header"
import { Toolbar } from "../components/ui/Toolbar"
import { CarvingCanvas } from "../utils/carvingCanvas";
import type { CarveSettings } from "../types";

export const Dashboard = () => {
    const carvingCanvas = useMemo(() => new CarvingCanvas(2048), []);
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
        <main className="flex flex-col w-full h-dvh overflow-hidden bg-stone-950 font-sans select-none">
            <Header mode={settings.mode} isNightMode={settings.isNightMode} />

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
        </main>
    )
}