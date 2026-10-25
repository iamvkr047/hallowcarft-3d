import * as THREE from 'three';
import type { ToolType } from '../types';

export class CarvingCanvas {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;
  private width: number;
  private height: number;
  private lastUv: { x: number; y: number } | null = null;
  private history: ImageData[] = [];
  private maxHistory = 15;

  constructor(size = 1024) {
    this.width = size;
    this.height = size;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;

    // Initialize with black (no glow / uncarved)
    this.clear(false);

    // Create Three.js texture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
    this.texture.needsUpdate = true;
  }

  private saveState() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    const state = this.ctx.getImageData(0, 0, this.width, this.height);
    this.history.push(state);
  }

  public undo(): boolean {
    if (this.history.length === 0) return false;
    const previousState = this.history.pop()!;
    this.ctx.putImageData(previousState, 0, 0);
    this.texture.needsUpdate = true;
    return true;
  }

  public hasHistory(): boolean {
    return this.history.length > 0;
  }

  public clear(saveHistory = true) {
    if (saveHistory) {
      this.saveState();
    }
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    if (this.texture) {
      this.texture.needsUpdate = true;
    }
  }

  private uvToCanvas(uv: { x: number; y: number }): { x: number; y: number } {
    return {
      x: uv.x * this.width,
      y: (1 - uv.y) * this.height,
    };
  }

  public startStroke(uv: { x: number; y: number }, tool: ToolType, brushSize: number) {
    this.saveState();
    this.lastUv = uv;

    if (tool === 'triangle' || tool === 'smile' || tool === 'bat') {
      this.drawStamp(uv, tool, brushSize);
      this.lastUv = null;
      return;
    }

    // Draw initial contact point
    const { x, y } = this.uvToCanvas(uv);
    this.drawGlowPoint(x, y, brushSize, tool === 'eraser');
    this.texture.needsUpdate = true;
  }

  public continueStroke(uv: { x: number; y: number }, tool: ToolType, brushSize: number) {
    if (!this.lastUv) {
      this.startStroke(uv, tool, brushSize);
      return;
    }

    if (tool === 'triangle' || tool === 'smile' || tool === 'bat') {
      return; // Stamps only apply once per click
    }

    // UV Seam & Disjoint Island Bleed Prevention:
    // If the UV coordinates jump significantly (e.g. crossing a seam boundary or disjoint ribs),
    // do not draw a connecting line across the texture map.
    const uvDist = Math.hypot(uv.x - this.lastUv.x, uv.y - this.lastUv.y);
    const MAX_SEAM_JUMP = 0.05; // ~5% of UV space — tighter threshold for fine brush

    const curr = this.uvToCanvas(uv);

    if (uvDist > MAX_SEAM_JUMP) {
      // Discontinuous jump: draw a point at the new location without connecting line
      this.drawGlowPoint(curr.x, curr.y, brushSize, tool === 'eraser');
      this.lastUv = uv;
      this.texture.needsUpdate = true;
      return;
    }

    const prev = this.uvToCanvas(this.lastUv);
    this.drawGlowLine(prev.x, prev.y, curr.x, curr.y, brushSize, tool === 'eraser');
    this.lastUv = uv;
    this.texture.needsUpdate = true;
  }

  public endStroke() {
    this.lastUv = null;
  }

  private drawGlowPoint(x: number, y: number, size: number, isEraser: boolean) {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Outer warm fiery orange
    ctx.fillStyle = '#ff4d00';
    ctx.beginPath();
    ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright candle amber
    ctx.fillStyle = '#ffd000';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Hot flame core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawGlowLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number,
    isEraser: boolean
  ) {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = size * 2.0;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return;
    }

    // Layer 1: Burnt orange halo
    ctx.strokeStyle = '#ff3700';
    ctx.lineWidth = size * 1.3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Layer 2: Candle gold core
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = size * 0.75;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Layer 3: White-hot cut
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.35;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  public drawStamp(uv: { x: number; y: number }, stamp: 'triangle' | 'smile' | 'bat', size: number) {
    const { x, y } = this.uvToCanvas(uv);
    const ctx = this.ctx;
    // Scaled down stamp size so eyes/mouth fit properly on the pumpkin face
    const s = size * 1.1;

    ctx.save();
    ctx.translate(x, y);

    if (stamp === 'triangle') {
      this.renderTriangleStamp(ctx, s);
    } else if (stamp === 'smile') {
      this.renderSmileStamp(ctx, s);
    } else if (stamp === 'bat') {
      this.renderBatStamp(ctx, s);
    }

    ctx.restore();
    this.texture.needsUpdate = true;
  }

  private renderTriangleStamp(ctx: CanvasRenderingContext2D, s: number) {
    // Outer fiery border
    ctx.fillStyle = '#ff4d00';
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.9, s * 0.8);
    ctx.lineTo(-s * 0.9, s * 0.8);
    ctx.closePath();
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffea75';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.lineTo(s * 0.6, s * 0.55);
    ctx.lineTo(-s * 0.6, s * 0.55);
    ctx.closePath();
    ctx.fill();

    // Hot center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.4);
    ctx.lineTo(s * 0.3, s * 0.3);
    ctx.lineTo(-s * 0.3, s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  private renderSmileStamp(ctx: CanvasRenderingContext2D, s: number) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Jagged jack-o-lantern grin
    const drawMouthPath = (scaleFactor: number) => {
      ctx.beginPath();
      const w = s * 1.4 * scaleFactor;
      const h = s * 0.6 * scaleFactor;
      ctx.moveTo(-w, -h * 0.2);
      ctx.quadraticCurveTo(-w * 0.5, h * 0.7, 0, h);
      ctx.quadraticCurveTo(w * 0.5, h * 0.7, w, -h * 0.2);
      ctx.lineTo(w * 0.7, 0);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * 0.25, 0);
      ctx.lineTo(0, h * 0.6);
      ctx.lineTo(-w * 0.25, 0);
      ctx.lineTo(-w * 0.5, h * 0.5);
      ctx.lineTo(-w * 0.7, 0);
      ctx.closePath();
    };

    ctx.fillStyle = '#ff4d00';
    drawMouthPath(1.1);
    ctx.fill();

    ctx.fillStyle = '#ffd000';
    drawMouthPath(0.85);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    drawMouthPath(0.5);
    ctx.fill();
  }

  private renderBatStamp(ctx: CanvasRenderingContext2D, s: number) {
    const drawBat = (scaleFactor: number) => {
      ctx.beginPath();
      const r = s * scaleFactor;
      ctx.moveTo(0, -r * 0.2);
      // Left ear & wing
      ctx.lineTo(-r * 0.15, -r * 0.5);
      ctx.lineTo(-r * 0.25, -r * 0.2);
      ctx.quadraticCurveTo(-r * 0.7, -r * 0.6, -r * 1.2, -r * 0.2);
      ctx.quadraticCurveTo(-r * 0.8, r * 0.2, -r * 0.5, r * 0.5);
      ctx.quadraticCurveTo(-r * 0.2, r * 0.3, 0, r * 0.6);
      // Right wing & ear
      ctx.quadraticCurveTo(r * 0.2, r * 0.3, r * 0.5, r * 0.5);
      ctx.quadraticCurveTo(r * 0.8, r * 0.2, r * 1.2, -r * 0.2);
      ctx.quadraticCurveTo(r * 0.7, -r * 0.6, r * 0.25, -r * 0.2);
      ctx.lineTo(r * 0.15, -r * 0.5);
      ctx.closePath();
    };

    ctx.fillStyle = '#ff4d00';
    drawBat(1.1);
    ctx.fill();

    ctx.fillStyle = '#ffd000';
    drawBat(0.85);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    drawBat(0.5);
    ctx.fill();
  }
}
