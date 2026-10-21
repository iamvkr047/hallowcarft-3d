export type AppMode = 'rotate' | 'carve';

export interface CarveToolSettings {
  mode: AppMode;
  brushSize: number;
  isNightMode: boolean;
}
