'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useCanvasStore } from '../lib/canvasStore';
import { PathData } from '../lib/api';

interface CanvasProps {
  initialPaths?: PathData[];
  initialImageUrl?: string;
  width?: number;
  height?: number;
}

export default function Canvas({ 
  initialPaths = [], 
  initialImageUrl,
  width = 1200, 
  height = 600 
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const {
    paths,
    setPaths,
    currentTool,
    zoom,
    gridEnabled,
    gridSize,
    updatePath,
    deletePath,
    lineColor,
    lineWidth,
    showOriginalImage,
    setLineColor,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useCanvasStore();

  const CANVAS_WIDTH = width;
  const CANVAS_HEIGHT = height;
  const ORIGINAL_PANEL_WIDTH = CANVAS_WIDTH / 2;
  const GENERATED_PANEL_START = ORIGINAL_PANEL_WIDTH;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#171717';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const gradient1 = ctx.createLinearGradient(0, 0, ORIGINAL_PANEL_WIDTH, 0);
    gradient1.addColorStop(0, '#1a1a1a');
    gradient1.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, ORIGINAL_PANEL_WIDTH, CANVAS_HEIGHT);

    const gradient2 = ctx.createLinearGradient(ORIGINAL_PANEL_WIDTH, 0, CANVAS_WIDTH, 0);
    gradient2.addColorStop(0, '#0f0f0f');
    gradient2.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient2;
    ctx.fillRect(ORIGINAL_PANEL_WIDTH, 0, CANVAS_WIDTH - ORIGINAL_PANEL_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ORIGINAL_PANEL_WIDTH, 0);
    ctx.lineTo(ORIGINAL_PANEL_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Original Image', 16, 28);
    ctx.fillText('Generated Paths', ORIGINAL_PANEL_WIDTH + 16, 28);

    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#525252';
    ctx.fillText('Click to select paths • Double-click to add lines', ORIGINAL_PANEL_WIDTH + 16, 48);

    if (showOriginalImage && image && imageLoaded) {
      const imgWidth = ORIGINAL_PANEL_WIDTH - 20;
      const imgHeight = CANVAS_HEIGHT - 40;
      const scale = Math.min(imgWidth / image.width, imgHeight / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (ORIGINAL_PANEL_WIDTH - drawWidth) / 2;
      const y = (CANVAS_HEIGHT - drawHeight) / 2;
      ctx.drawImage(image, x, y, drawWidth, drawHeight);
    }

    if (gridEnabled) {
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 0.5;
      for (let x = ORIGINAL_PANEL_WIDTH; x <= CANVAS_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(ORIGINAL_PANEL_WIDTH, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    }

    const pathsInGeneratedArea = paths.map((pathData, index) => {
      const coords = pathData.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
      if (coords.length < 4) return { pathData, index, minX: Infinity, minY: Infinity };
      
      const xs = [];
      const ys = [];
      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          xs.push(Number(coords[i]));
          ys.push(Number(coords[i + 1]));
        }
      }
      return { pathData, index, minX: Math.min(...xs), minY: Math.min(...ys) };
    });

    paths.forEach((pathData, index) => {
      const coords = pathData.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
      if (coords.length < 4) return;

      const isSelected = index === selectedPathIndex;
      ctx.strokeStyle = isSelected ? '#3b82f6' : (pathData.stroke || lineColor);
      ctx.lineWidth = isSelected ? (pathData.stroke_width || lineWidth) + 2 : (pathData.stroke_width || lineWidth);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          const x = GENERATED_PANEL_START + Number(coords[i]);
          const y = Number(coords[i + 1]);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      if (pathData.type === 'closed') {
        ctx.closePath();
      }
      ctx.stroke();

      if (isSelected) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#3b82f6';
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    if (selectedPathIndex !== null && paths[selectedPathIndex]) {
      const pathData = paths[selectedPathIndex];
      const coords = pathData.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
      
      ctx.fillStyle = '#3b82f6';
      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          const x = GENERATED_PANEL_START + Number(coords[i]);
          const y = Number(coords[i + 1]);
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [paths, selectedPathIndex, lineColor, lineWidth, showOriginalImage, image, imageLoaded, gridEnabled, gridSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    draw();
  }, [draw]);

  useEffect(() => {
    if (initialPaths.length > 0 && paths.length === 0) {
      const centeredPaths = initialPaths.map((p, i) => {
        const coords = p.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
        let minX = Infinity, maxX = -Infinity;
        for (let i = 0; i < coords.length; i += 2) {
          if (i + 1 < coords.length) {
            minX = Math.min(minX, Number(coords[i]));
          }
        }
        const offsetX = 50 - minX;
        
        const newCoords = coords.map((c, idx) => {
          if (idx % 2 === 0) return String(Number(c) + offsetX);
          return c;
        });
        
        return { ...p, d: newCoords.join(' ') };
      });
      setPaths(centeredPaths);
    }
  }, [initialPaths, paths, setPaths]);

  useEffect(() => {
    if (initialImageUrl && !image) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImage(img);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageLoaded(true);
      };
      img.src = initialImageUrl;
    }
  }, [initialImageUrl, image]);

  const getCanvasCoords = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasCoords(e);
    
    if (pos.x < ORIGINAL_PANEL_WIDTH) {
      return;
    }

    const pathInGenerated = paths.map((pathData, index) => {
      const coords = pathData.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
      if (coords.length < 4) return { index, hit: false };
      
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          const x = GENERATED_PANEL_START + Number(coords[i]);
          const y = Number(coords[i + 1]);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
      
      const padding = 10;
      const hit = pos.x >= minX - padding && pos.x <= maxX + padding && 
                  pos.y >= minY - padding && pos.y <= maxY + padding;
      return { index, hit, bounds: { minX, maxX, minY, maxY } };
    });

    const hitPath = pathInGenerated.filter(p => p.hit).pop();
    
    if (hitPath) {
      setSelectedPathIndex(hitPath.index);
      
      if (currentTool === 'select' || currentTool === 'move') {
        setIsDragging(true);
        setDragStart(pos);
      }
    } else {
      setSelectedPathIndex(null);
    }
  }, [paths, currentTool, getCanvasCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || selectedPathIndex === null) return;
    
    const pos = getCanvasCoords(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    
    if (dx === 0 && dy === 0) return;
    
    const pathData = paths[selectedPathIndex];
    const coords = pathData.d.split(/[\s,]+/).filter(c => c && !isNaN(Number(c)));
    
    const newCoords = coords.map((c, idx) => {
      if (idx % 2 === 0) return String(Number(c) + dx);
      return String(Number(c) + dy);
    });
    
    updatePath(pathData.id, { d: newCoords.join(' ') });
    setDragStart(pos);
  }, [isDragging, selectedPathIndex, dragStart, paths, updatePath, getCanvasCoords]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasCoords(e);
    
    if (pos.x < ORIGINAL_PANEL_WIDTH) return;
    if (currentTool === 'add') {
      const { saveForUndo } = useCanvasStore.getState();
      saveForUndo();
      
      const newPath: PathData = {
        id: `path_${Date.now()}`,
        d: `${pos.x - GENERATED_PANEL_WIDTH} ${pos.y} ${pos.x - GENERATED_PANEL_WIDTH + 50} ${pos.y + 50}`,
        type: 'open',
        stroke: lineColor,
        stroke_width: lineWidth
      };
      setPaths([...paths, newPath]);
    }
  }, [paths, currentTool, lineColor, lineWidth, setPaths, getCanvasCoords]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPathIndex !== null) {
        e.preventDefault();
        deletePath(paths[selectedPathIndex]?.id || '');
        setSelectedPathIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPathIndex, paths, undo, redo, deletePath]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f0f0f'
    }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{ 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px #262626',
          borderRadius: '12px',
          cursor: currentTool === 'add' ? 'crosshair' : 'default'
        }}
      />
    </div>
  );
}