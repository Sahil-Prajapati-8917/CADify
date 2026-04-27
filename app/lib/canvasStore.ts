'use client';

import { create } from 'zustand';
import { PathData } from '../lib/api';

interface CanvasState {
  paths: PathData[];
  selectedPathId: string | null;
  currentTool: 'select' | 'move' | 'delete' | 'add' | 'draw' | 'pan';
  zoom: number;
  gridEnabled: boolean;
  gridSize: number;
  undoStack: PathData[][];
  redoStack: PathData[][];
  imageWidth: number;
  imageHeight: number;
  backgroundImage: string | null;
  lineColor: string;
  lineWidth: number;
  showOriginalImage: boolean;
  
  setPaths: (paths: PathData[]) => void;
  setSelectedPathId: (id: string | null) => void;
  setCurrentTool: (tool: 'select' | 'move' | 'delete' | 'add' | 'draw' | 'pan') => void;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  updatePath: (id: string, updates: Partial<PathData>) => void;
  deletePath: (id: string) => void;
  addPath: (path: PathData) => void;
  undo: () => void;
  redo: () => void;
  saveForUndo: () => void;
  setImageDimensions: (width: number, height: number) => void;
  setBackgroundImage: (url: string | null) => void;
  setLineColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  toggleShowOriginal: () => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  paths: [],
  selectedPathId: null,
  currentTool: 'select',
  zoom: 100,
  gridEnabled: false,
  gridSize: 20,
  undoStack: [],
  redoStack: [],
  imageWidth: 800,
  imageHeight: 600,
  backgroundImage: null,
  lineColor: '#1A3C5E',
  lineWidth: 2,
  showOriginalImage: true,

  setPaths: (paths) => set({ paths }),
  setSelectedPathId: (id) => set({ selectedPathId: id }),
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setZoom: (zoom) => set({ zoom: Math.min(400, Math.max(25, zoom)) }),
  resetZoom: () => set({ zoom: 100 }),
  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  setGridSize: (size) => set({ gridSize: size }),
  
  updatePath: (id, updates) => {
    const { saveForUndo, paths } = get();
    saveForUndo();
    set({
      paths: paths.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  },
  
  deletePath: (id) => {
    const { saveForUndo } = get();
    saveForUndo();
    set((state) => ({
      paths: state.paths.filter(p => p.id !== id),
      selectedPathId: state.selectedPathId === id ? null : state.selectedPathId,
    }));
  },
  
  addPath: (path) => {
    const { saveForUndo, paths, lineColor, lineWidth } = get();
    saveForUndo();
    const newPath = {
      ...path,
      stroke: lineColor,
      stroke_width: lineWidth,
    };
    set({ paths: [...paths, newPath] });
  },
  
  saveForUndo: () => {
    const { paths, undoStack } = get();
    const newStack = [...undoStack, [...paths]].slice(-50);
    set({ undoStack: newStack, redoStack: [] });
  },
  
  undo: () => {
    const { undoStack, paths, redoStack } = get();
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    set({
      paths: previous,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, paths].slice(-50),
    });
  },
  
  redo: () => {
    const { redoStack, paths, undoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      paths: next,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, paths].slice(-50),
    });
  },
  
  setImageDimensions: (width, height) => set({ imageWidth: width, imageHeight: height }),
  setBackgroundImage: (url) => set({ backgroundImage: url }),
  setLineColor: (color) => set({ lineColor: color }),
  setLineWidth: (width) => set({ lineWidth: Math.max(0.5, Math.min(10, width)) }),
  toggleShowOriginal: () => set((state) => ({ showOriginalImage: !state.showOriginalImage })),
  clearCanvas: () => {
    const { saveForUndo } = get();
    saveForUndo();
    set({ paths: [], selectedPathId: null });
  },
}));