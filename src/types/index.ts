export type AppMode = 'rotate' | 'carve';

export type ToolType = 'knife' | 'eraser' | 'triangle' | 'smile' | 'bat';

export interface CarveSettings {
  mode: AppMode;
  tool: ToolType;
  brushSize: number;
  isNightMode: boolean;
  glowIntensity: number;
}

export interface StickersType {
  userId: string;
  title: string;
  authorName: string;
  fileId: string;
  description?: string;
  likesCount?: string;
  tags?: string[];
  settings?: string;
}