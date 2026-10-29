import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Stage, Layer, Line, Circle, Ellipse, RegularPolygon, Path as KPath, Image as KImage } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import {
    Download,
    Eraser,
    Hand,
    Maximize,
    Paintbrush,
    PaintBucket,
    Redo2,
    Trash2,
    Triangle,
    Undo2,
    Circle as CircleIcon,
} from "lucide-react";
import { PublishModal } from "../components/ui/PublishModal";
import { useAppDataStore } from "../zustand/store";
import { useNavbarStore } from "../zustand/navbarStore";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type ShapeStamp = "circle" | "oval" | "triangle";
type SmileStamp = "smile-classic" | "smile-grin" | "smile-surprised" | "smile-sleepy";
type Stamp = ShapeStamp | SmileStamp;

type Tool = "hand" | "brush" | "bucket" | "eraser" | Stamp;
type Pt = { x: number; y: number };
type View = { x: number; y: number; scale: number };

type Item =
    | { id: number; kind: "line"; points: number[]; color: string; size: number; erase: boolean }
    | { id: number; kind: "stamp"; shape: Stamp; x: number; y: number; color: string; size: number }
    | { id: number; kind: "fill"; canvas: HTMLCanvasElement };

// Centered ready-made smile paths from Landing2 (with origin at (0, 0))
const SMILE_PATHS: Record<SmileStamp, { path: string; baseScale: number; label: string }> = {
    "smile-classic": {
        path: "M -44 -20 L -28 -8 L -16 -20 L 0 -4 L 16 -20 L 28 -8 L 44 -20 L 38 4 Q 0 20 -38 4 Z",
        baseScale: 0.85,
        label: "Classic smile",
    },
    "smile-grin": {
        path: "M -44 -14 Q 0 42 44 -14 Q 0 14 -44 -14 Z",
        baseScale: 0.85,
        label: "Grin smile",
    },
    "smile-surprised": {
        path: "M -15 0 A 15 19 0 1 0 15 0 A 15 19 0 1 0 -15 0 Z",
        baseScale: 1.1,
        label: "Surprised mouth",
    },
    "smile-sleepy": {
        path: "M -20 -5 Q 0 9 20 -5 Q 0 15 -20 -5 Z",
        baseScale: 1.2,
        label: "Sleepy smile",
    },
};

// The pumpkin lives at a fixed spot in "world" space. Only the camera (View) moves.
const WORLD_W = 400;
const WORLD_H = 380;
const MIN_SCALE = 0.4;
const MAX_SCALE = 6;

const COLORS = ["#fef3c7", "#1c1917", "#f97316", "#facc15", "#a855f7", "#22c55e", "#ffffff"];

const PUMPKIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" width="800" height="760">
  <path d="M92 38 Q90 14 108 8 Q106 24 112 38 Z" fill="#3f6212"/>
  <ellipse cx="54" cy="108" rx="46" ry="70" fill="#c2410c"/>
  <ellipse cx="146" cy="108" rx="46" ry="70" fill="#c2410c"/>
  <ellipse cx="78" cy="108" rx="50" ry="74" fill="#ea580c"/>
  <ellipse cx="122" cy="108" rx="50" ry="74" fill="#ea580c"/>
  <ellipse cx="100" cy="108" rx="44" ry="76" fill="#f97316"/>
</svg>`;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Keep the world point under `from` glued to `to`, while changing scale.
const zoomPan = (v: View, from: Pt, to: Pt, nextScale: number): View => {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const wx = (from.x - v.x) / v.scale;
    const wy = (from.y - v.y) / v.scale;
    return { scale, x: to.x - wx * scale, y: to.y - wy * scale };
};

const fitView = (w: number, h: number): View => {
    const scale = clamp(Math.min(w / (WORLD_W + 80), h / (WORLD_H + 80)), MIN_SCALE, MAX_SCALE);
    return { scale, x: (w - WORLD_W * scale) / 2, y: (h - WORLD_H * scale) / 2 };
};

/* ------------------------------------------------------------------ */
/*  Flood Fill Algorithm Helpers                                      */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
    let clean = hex.replace("#", "").trim();
    if (clean.length === 3) {
        clean = clean.split("").map((c) => c + c).join("");
    }
    const num = parseInt(clean, 16);
    if (Number.isNaN(num)) {
        return { r: 254, g: 243, b: 199, a: 255 };
    }
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
        a: 255,
    };
}

function drawItemsToContext(ctx: CanvasRenderingContext2D, items: Item[], scale: number) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const it of items) {
        if (it.kind === "fill") {
            ctx.save();
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(it.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
            continue;
        }

        if (it.kind === "line") {
            if (it.points.length < 2) continue;
            ctx.save();
            ctx.lineWidth = it.size * scale;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (it.erase) {
                ctx.globalCompositeOperation = "destination-out";
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = it.color;
            }
            ctx.beginPath();
            ctx.moveTo(it.points[0] * scale, it.points[1] * scale);
            if (it.points.length === 4) {
                ctx.lineTo(it.points[2] * scale, it.points[3] * scale);
            } else {
                let i = 2;
                for (; i < it.points.length - 2; i += 2) {
                    const xc = (it.points[i] * scale + it.points[i + 2] * scale) / 2;
                    const yc = (it.points[i + 1] * scale + it.points[i + 3] * scale) / 2;
                    ctx.quadraticCurveTo(it.points[i] * scale, it.points[i + 1] * scale, xc, yc);
                }
                ctx.lineTo(it.points[i] * scale, it.points[i + 1] * scale);
            }
            ctx.stroke();
            ctx.restore();
            continue;
        }

        if (it.kind === "stamp") {
            if (it.shape.startsWith("smile-")) {
                const smile = SMILE_PATHS[it.shape as SmileStamp];
                if (smile) {
                    const s = (it.size / 8) * smile.baseScale * scale;
                    const strokeW = Math.max(2.5, Math.round(it.size * 0.25)) * scale;

                    ctx.save();
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = it.color;
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";

                    ctx.translate(it.x * scale, it.y * scale);
                    ctx.scale(s, s);
                    ctx.lineWidth = strokeW / s;

                    const path2d = new Path2D(smile.path);
                    ctx.stroke(path2d);
                    ctx.restore();
                    continue;
                }
            }

            const r = Math.max(14, it.size * 1.8) * scale;
            const strokeW = Math.max(3, Math.round(it.size * 0.25)) * scale;

            ctx.save();
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = it.color;
            ctx.lineWidth = strokeW;
            ctx.beginPath();

            if (it.shape === "circle") {
                ctx.arc(it.x * scale, it.y * scale, r, 0, Math.PI * 2);
            } else if (it.shape === "oval") {
                ctx.ellipse(it.x * scale, it.y * scale, r * 1.4, r * 0.8, 0, 0, Math.PI * 2);
            } else if (it.shape === "triangle") {
                const rad = r * 1.2;
                for (let s = 0; s < 3; s++) {
                    const angle = -Math.PI / 2 + (s * 2 * Math.PI) / 3;
                    const px = it.x * scale + rad * Math.cos(angle);
                    const py = it.y * scale + rad * Math.sin(angle);
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            }
            ctx.stroke();
            ctx.restore();
        }
    }
}

function floodFill(
    items: Item[],
    startX: number,
    startY: number,
    fillHex: string
): HTMLCanvasElement | null {
    const SCALE = 2;
    const W = Math.round(WORLD_W * SCALE);
    const H = Math.round(WORLD_H * SCALE);

    const px = Math.round(startX * SCALE);
    const py = Math.round(startY * SCALE);

    if (px < 0 || px >= W || py < 0 || py >= H) return null;

    // 1. Render all current items onto offscreen canvas
    const baseCanvas = document.createElement("canvas");
    baseCanvas.width = W;
    baseCanvas.height = H;
    const baseCtx = baseCanvas.getContext("2d");
    if (!baseCtx) return null;

    drawItemsToContext(baseCtx, items, SCALE);

    const imgData = baseCtx.getImageData(0, 0, W, H);
    const data32 = new Uint32Array(imgData.data.buffer);

    const startIdx = py * W + px;
    const targetVal = data32[startIdx];

    const fillRgba = hexToRgba(fillHex);
    const fillVal =
        (((fillRgba.a & 0xff) << 24) |
            ((fillRgba.b & 0xff) << 16) |
            ((fillRgba.g & 0xff) << 8) |
            (fillRgba.r & 0xff)) >>>
        0;

    // If clicking on identical color, do nothing
    if (targetVal === fillVal) return null;

    const targetA = (targetVal >>> 24) & 0xff;
    const targetB = (targetVal >> 16) & 0xff;
    const targetG = (targetVal >> 8) & 0xff;
    const targetR = targetVal & 0xff;
    const isTargetTransparent = targetA < 32;

    const matchesTarget = (color: number): boolean => {
        const a = (color >>> 24) & 0xff;
        if (isTargetTransparent) {
            return a < 32;
        }
        if (a < 32) return false;
        const b = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const r = color & 0xff;
        return (
            Math.abs(r - targetR) < 36 &&
            Math.abs(g - targetG) < 36 &&
            Math.abs(b - targetB) < 36 &&
            Math.abs(a - targetA) < 36
        );
    };

    const totalPixels = W * H;
    const queue = new Int32Array(totalPixels);
    const visited = new Uint8Array(totalPixels);
    let head = 0;
    let tail = 0;

    queue[tail++] = startIdx;
    visited[startIdx] = 1;

    while (head < tail) {
        const idx = queue[head++];
        const x = idx % W;
        const y = (idx / W) | 0;

        if (x > 0) {
            const nIdx = idx - 1;
            if (!visited[nIdx] && matchesTarget(data32[nIdx])) {
                visited[nIdx] = 1;
                queue[tail++] = nIdx;
            }
        }
        if (x < W - 1) {
            const nIdx = idx + 1;
            if (!visited[nIdx] && matchesTarget(data32[nIdx])) {
                visited[nIdx] = 1;
                queue[tail++] = nIdx;
            }
        }
        if (y > 0) {
            const nIdx = idx - W;
            if (!visited[nIdx] && matchesTarget(data32[nIdx])) {
                visited[nIdx] = 1;
                queue[tail++] = nIdx;
            }
        }
        if (y < H - 1) {
            const nIdx = idx + W;
            if (!visited[nIdx] && matchesTarget(data32[nIdx])) {
                visited[nIdx] = 1;
                queue[tail++] = nIdx;
            }
        }
    }

    if (tail === 0) return null;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = W;
    outCanvas.height = H;
    const outCtx = outCanvas.getContext("2d");
    if (!outCtx) return null;

    const outImgData = outCtx.createImageData(W, H);
    const outData32 = new Uint32Array(outImgData.data.buffer);

    for (let i = 0; i < tail; i++) {
        outData32[queue[i]] = fillVal;
    }

    // 1-pixel dilation along visited boundary to ensure seamless contact with stroke
    for (let i = 0; i < tail; i++) {
        const idx = queue[i];
        const x = idx % W;
        const y = (idx / W) | 0;
        if (x > 0 && !visited[idx - 1]) outData32[idx - 1] = fillVal;
        if (x < W - 1 && !visited[idx + 1]) outData32[idx + 1] = fillVal;
        if (y > 0 && !visited[idx - W]) outData32[idx - W] = fillVal;
        if (y < H - 1 && !visited[idx + W]) outData32[idx + W] = fillVal;
    }

    outCtx.putImageData(outImgData, 0, 0);
    return outCanvas;
}

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */

function OvalIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <ellipse cx="12" cy="12" rx="9" ry="6" />
        </svg>
    );
}

function ClassicSmileIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 8 L6 11 L9 8 L12 12 L15 8 L18 11 L21 8 L20 14 Q12 20 4 14 Z" />
        </svg>
    );
}

function GrinSmileIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 10 Q12 21 20 10 Q12 14 4 10 Z" />
        </svg>
    );
}

function SurprisedMouthIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <ellipse cx="12" cy="12" rx="6" ry="8" />
        </svg>
    );
}

function SleepySmileIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 11 Q12 16 19 11 Q12 19 5 11 Z" />
        </svg>
    );
}

function ToolBtn({
    label,
    active = false,
    disabled = false,
    onClick,
    children,
}: {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onClick={onClick}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-30 ${active ? "bg-orange-500 text-stone-950" : "text-stone-300 hover:bg-stone-800"
                }`}
        >
            {children}
        </button>
    );
}

const Divider = () => <span className="mx-1 h-6 w-px shrink-0 bg-stone-800" aria-hidden />;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Craft3D() {
    const navigate = useNavigate();
    const { addSticker } = useAppDataStore();
    const { setPublishHandler } = useNavbarStore();

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [publishPreviewUrl, setPublishPreviewUrl] = useState<string | null>(null);
    const [publishImageFile, setPublishImageFile] = useState<File | null>(null);

    const [tool, setTool] = useState<Tool>("brush");
    const [color, setColor] = useState(COLORS[0]);
    const [size, setSize] = useState(8);

    const [items, setItems] = useState<Item[]>([]);
    const [redoStack, setRedoStack] = useState<Item[]>([]);

    const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 });
    const [box, setBox] = useState({ w: 0, h: 0 });
    const [pumpkin, setPumpkin] = useState<HTMLImageElement | null>(null);

    const wrapRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const nextId = useRef(1);
    const fitted = useRef(false);

    // gesture bookkeeping (refs, so pointer-move doesn't depend on stale state)
    const pointers = useRef(new Map<number, Pt>());
    const gesture = useRef<{ dist: number; center: Pt } | null>(null);
    const drawing = useRef(false);
    const panning = useRef<Pt | null>(null);

    /* ---- load the pumpkin SVG as an image ---- */
    useEffect(() => {
        const img = new window.Image();
        img.onload = () => setPumpkin(img);
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(PUMPKIN_SVG);
    }, []);

    /* ---- keep the stage the size of its container ---- */
    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setBox({ w: width, h: height });
            if (!fitted.current && width > 0 && height > 0) {
                fitted.current = true;
                setView(fitView(width, height));
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    /* ---- release pointers even if they end outside the canvas ---- */
    useEffect(() => {
        const end = (e: PointerEvent) => {
            pointers.current.delete(e.pointerId);
            if (pointers.current.size < 2) gesture.current = null;
            if (pointers.current.size === 0) {
                drawing.current = false;
                panning.current = null;
            }
        };
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
        return () => {
            window.removeEventListener("pointerup", end);
            window.removeEventListener("pointercancel", end);
        };
    }, []);

    /* ---- helpers ---- */
    const rel = (e: { clientX: number; clientY: number }): Pt => {
        const r = wrapRef.current!.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const toWorld = (p: Pt): Pt => ({ x: (p.x - view.x) / view.scale, y: (p.y - view.y) / view.scale });

    const measure = () => {
        const [a, b] = [...pointers.current.values()];
        return { dist: Math.hypot(a.x - b.x, a.y - b.y), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    };

    const addItem = (item: Item) => {
        setItems((prev) => [...prev, item]);
        setRedoStack([]);
    };

    /* ---- actions ---- */
    const undo = () =>
        setItems((prev) => {
            if (!prev.length) return prev;
            setRedoStack((r) => [...r, prev[prev.length - 1]]);
            return prev.slice(0, -1);
        });

    const redo = () =>
        setRedoStack((r) => {
            if (!r.length) return r;
            setItems((prev) => [...prev, r[r.length - 1]]);
            return r.slice(0, -1);
        });

    const clearAll = () => {
        setItems([]);
        setRedoStack([]);
    };

    /* ---- keyboard shortcuts (Ctrl+Z / Ctrl+Y) ---- */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
                redo();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    /* ---- pointer handlers (mouse, pen and touch all arrive here) ---- */
    const onDown = (e: KonvaEventObject<PointerEvent>) => {
        const ev = e.evt;
        const p = rel(ev);
        pointers.current.set(ev.pointerId, p);

        // second finger: cancel whatever the first finger started, switch to pinch/pan
        if (pointers.current.size === 2) {
            if (drawing.current) {
                setItems((prev) => prev.slice(0, -1));
                drawing.current = false;
            }
            panning.current = null;
            gesture.current = measure();
            return;
        }
        if (pointers.current.size > 2) return;

        if (tool === "hand" || ev.button === 1) {
            panning.current = p;
            return;
        }
        if (ev.pointerType === "mouse" && ev.button !== 0) return;

        const w = toWorld(p);

        // Paint bucket tool: flood fill contiguous region
        if (tool === "bucket") {
            const filledCanvas = floodFill(items, w.x, w.y, color);
            if (filledCanvas) {
                addItem({
                    id: nextId.current++,
                    kind: "fill",
                    canvas: filledCanvas,
                });
            }
            return;
        }

        drawing.current = true;
        if (tool === "brush" || tool === "eraser") {
            addItem({
                id: nextId.current++,
                kind: "line",
                points: [w.x, w.y, w.x, w.y], // duplicated point = a dot on a simple tap
                color,
                size,
                erase: tool === "eraser",
            });
        } else {
            addItem({ id: nextId.current++, kind: "stamp", shape: tool, x: w.x, y: w.y, color, size });
        }
    };

    const onMove = (e: KonvaEventObject<PointerEvent>) => {
        const ev = e.evt;
        if (!pointers.current.has(ev.pointerId)) return;
        const p = rel(ev);
        pointers.current.set(ev.pointerId, p);

        // pinch zoom + two-finger pan
        if (pointers.current.size === 2 && gesture.current) {
            const prev = gesture.current;
            const next = measure();
            if (prev.dist > 0) {
                setView((v) => zoomPan(v, prev.center, next.center, v.scale * (next.dist / prev.dist)));
            }
            gesture.current = next;
            return;
        }

        // hand tool / middle mouse pan
        if (panning.current) {
            const last = panning.current;
            setView((v) => zoomPan(v, last, p, v.scale));
            panning.current = p;
            return;
        }

        // freehand drawing
        if (drawing.current && (tool === "brush" || tool === "eraser")) {
            const w = toWorld(p);
            setItems((prev) => {
                const last = prev[prev.length - 1];
                if (!last || last.kind !== "line") return prev;
                return [...prev.slice(0, -1), { ...last, points: [...last.points, w.x, w.y] }];
            });
        }
    };

    const onWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const p = rel(e.evt);
        const factor = e.evt.deltaY > 0 ? 1 / 1.1 : 1.1;
        setView((v) => zoomPan(v, p, p, v.scale * factor));
    };

    const savePng = () => {
        const stage = stageRef.current;
        if (!stage) return;
        const pad = 20;
        const uri = stage.toDataURL({
            x: view.x - pad * view.scale,
            y: view.y - pad * view.scale,
            width: (WORLD_W + pad * 2) * view.scale,
            height: (WORLD_H + pad * 2) * view.scale,
            pixelRatio: 2 / view.scale, // same output size whatever the zoom
        });
        const a = document.createElement("a");
        a.href = uri;
        a.download = "my-pumpkin.png";
        a.click();
    };

    const handleOpenPublish = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            alert("Could not find 2D canvas to capture craft snapshot.");
            return;
        }

        try {
            const pad = 20;
            const dataUrl = stage.toDataURL({
                x: view.x - pad * view.scale,
                y: view.y - pad * view.scale,
                width: (WORLD_W + pad * 2) * view.scale,
                height: (WORLD_H + pad * 2) * view.scale,
                pixelRatio: 2 / view.scale,
            });
            setPublishPreviewUrl(dataUrl);

            // Convert base64 dataURL to File
            const byteString = atob(dataUrl.split(",")[1]);
            const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], `pumpkin-2d-${Date.now()}.png`, { type: "image/png" });

            setPublishImageFile(file);
            setIsPublishModalOpen(true);
        } catch (err) {
            console.error("Failed to capture snapshot for publishing:", err);
        }
    }, [view]);

    useEffect(() => {
        setPublishHandler(handleOpenPublish);
        return () => setPublishHandler(null);
    }, [handleOpenPublish, setPublishHandler]);

    /* ---- render helpers ---- */
    const renderItem = (it: Item) => {
        if (it.kind === "fill") {
            return <KImage key={it.id} image={it.canvas} x={0} y={0} width={WORLD_W} height={WORLD_H} />;
        }
        if (it.kind === "line") {
            return (
                <Line
                    key={it.id}
                    points={it.points}
                    stroke={it.erase ? "#000" : it.color}
                    strokeWidth={it.size}
                    lineCap="round"
                    lineJoin="round"
                    tension={0.4}
                    globalCompositeOperation={it.erase ? "destination-out" : "source-over"}
                />
            );
        }

        // Hollow shape & smile stamps: outlined with stroke, interior transparent so paint bucket can fill them
        if (it.shape.startsWith("smile-")) {
            const smile = SMILE_PATHS[it.shape as SmileStamp];
            if (smile) {
                const s = (it.size / 8) * smile.baseScale;
                const strokeW = Math.max(2.5, Math.round(it.size * 0.25));
                return (
                    <KPath
                        key={it.id}
                        data={smile.path}
                        x={it.x}
                        y={it.y}
                        scaleX={s}
                        scaleY={s}
                        stroke={it.color}
                        strokeWidth={strokeW}
                        strokeScaleEnabled={false}
                        lineJoin="round"
                        lineCap="round"
                        fill="transparent"
                    />
                );
            }
        }

        const r = Math.max(14, it.size * 1.8);
        const strokeW = Math.max(3, Math.round(it.size * 0.25));

        if (it.shape === "circle") {
            return (
                <Circle
                    key={it.id}
                    x={it.x}
                    y={it.y}
                    radius={r}
                    stroke={it.color}
                    strokeWidth={strokeW}
                    fill="transparent"
                />
            );
        }
        if (it.shape === "oval") {
            return (
                <Ellipse
                    key={it.id}
                    x={it.x}
                    y={it.y}
                    radiusX={r * 1.4}
                    radiusY={r * 0.8}
                    stroke={it.color}
                    strokeWidth={strokeW}
                    fill="transparent"
                />
            );
        }
        return (
            <RegularPolygon
                key={it.id}
                x={it.x}
                y={it.y}
                sides={3}
                radius={r * 1.2}
                stroke={it.color}
                strokeWidth={strokeW}
                fill="transparent"
            />
        );
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-stone-950 text-stone-100">
            {/* Canvas */}
            <div
                ref={wrapRef}
                className={`relative min-h-0 flex-1 select-none ${tool === "hand" ? "cursor-grab" : "cursor-crosshair"}`}
                style={{ touchAction: "none" }}
            >
                {box.w > 0 && (
                    <Stage
                        ref={stageRef}
                        width={box.w}
                        height={box.h}
                        x={view.x}
                        y={view.y}
                        scaleX={view.scale}
                        scaleY={view.scale}
                        onPointerDown={onDown}
                        onPointerMove={onMove}
                        onWheel={onWheel}
                    >
                        {/* Base layer: the fixed pumpkin */}
                        <Layer listening={false}>
                            {pumpkin && <KImage image={pumpkin} x={0} y={0} width={WORLD_W} height={WORLD_H} />}
                        </Layer>
                        {/* Drawing layer: strokes, hollow stamps, smile stamps, and paint bucket fills */}
                        <Layer listening={false}>{items.map(renderItem)}</Layer>
                    </Stage>
                )}
                <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-stone-600">
                    Draw with one finger · pinch or scroll to zoom · two fingers to pan
                </p>
            </div>

            {/* Bottom toolbar */}
            <footer className="shrink-0 border-t border-stone-800 bg-stone-900 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <div className="mx-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto pb-1">
                    <ToolBtn label="Pan" active={tool === "hand"} onClick={() => setTool("hand")}>
                        <Hand className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Brush" active={tool === "brush"} onClick={() => setTool("brush")}>
                        <Paintbrush className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Color bucket" active={tool === "bucket"} onClick={() => setTool("bucket")}>
                        <PaintBucket className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")}>
                        <Eraser className="h-5 w-5" />
                    </ToolBtn>

                    <Divider />

                    <ToolBtn label="Circle stamp" active={tool === "circle"} onClick={() => setTool("circle")}>
                        <CircleIcon className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Oval stamp" active={tool === "oval"} onClick={() => setTool("oval")}>
                        <OvalIcon />
                    </ToolBtn>
                    <ToolBtn label="Triangle stamp" active={tool === "triangle"} onClick={() => setTool("triangle")}>
                        <Triangle className="h-5 w-5" />
                    </ToolBtn>

                    <Divider />

                    <ToolBtn label="Classic smile stamp" active={tool === "smile-classic"} onClick={() => setTool("smile-classic")}>
                        <ClassicSmileIcon />
                    </ToolBtn>
                    <ToolBtn label="Grin smile stamp" active={tool === "smile-grin"} onClick={() => setTool("smile-grin")}>
                        <GrinSmileIcon />
                    </ToolBtn>
                    <ToolBtn label="Surprised mouth stamp" active={tool === "smile-surprised"} onClick={() => setTool("smile-surprised")}>
                        <SurprisedMouthIcon />
                    </ToolBtn>
                    <ToolBtn label="Sleepy smile stamp" active={tool === "smile-sleepy"} onClick={() => setTool("smile-sleepy")}>
                        <SleepySmileIcon />
                    </ToolBtn>

                    <Divider />

                    <ToolBtn label="Undo" disabled={!items.length} onClick={undo}>
                        <Undo2 className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Redo" disabled={!redoStack.length} onClick={redo}>
                        <Redo2 className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Clear all" disabled={!items.length} onClick={clearAll}>
                        <Trash2 className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Fit to screen" onClick={() => setView(fitView(box.w, box.h))}>
                        <Maximize className="h-5 w-5" />
                    </ToolBtn>
                    <ToolBtn label="Save PNG" onClick={savePng}>
                        <Download className="h-5 w-5" />
                    </ToolBtn>
                </div>

                <div className="mx-auto flex w-fit max-w-full items-center gap-3 overflow-x-auto px-1 pb-1 pt-1">
                    <div className="flex items-center gap-2">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                aria-label={`Color ${c}`}
                                aria-pressed={color === c}
                                onClick={() => setColor(c)}
                                style={{ backgroundColor: c }}
                                className={`h-8 w-8 shrink-0 rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${color === c ? "scale-110 border-orange-500" : "border-stone-700"
                                    }`}
                            />
                        ))}
                    </div>
                    <Divider />
                    <label className="flex shrink-0 items-center gap-2 text-xs text-stone-400">
                        Size
                        <input
                            type="range"
                            min={3}
                            max={40}
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="h-8 w-28 accent-orange-500"
                        />
                    </label>
                </div>
            </footer>

            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                previewUrl={publishPreviewUrl}
                imageFile={publishImageFile}
                onSuccess={(newSticker) => {
                    addSticker(newSticker);
                    navigate("/dashboard");
                }}
            />
        </div>
    );
}
