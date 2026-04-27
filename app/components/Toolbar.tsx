'use client';

import { useCanvasStore } from '../lib/canvasStore';

interface ToolbarProps {
  onExportSVG: () => void;
  onExportDXF: () => void;
}

const tools = [
  { id: 'select', icon: 'cursor', label: 'Select (V)', shortcut: 'V' },
  { id: 'move', icon: 'move', label: 'Move (M)', shortcut: 'M' },
  { id: 'add', icon: 'plus', label: 'Add Line (L)', shortcut: 'L' },
] as const;

const colors = [
  '#1A3C5E',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFA500',
  '#800080',
  '#FFC0CB',
];

const widths = [1, 2, 3, 4, 5, 6, 8];

export function Toolbar({ onExportSVG, onExportDXF }: ToolbarProps) {
  const {
    currentTool,
    setCurrentTool,
    zoom,
    setZoom,
    resetZoom,
    gridEnabled,
    toggleGrid,
    gridSize,
    setGridSize,
    undo,
    redo,
    undoStack,
    redoStack,
    selectedPathId,
    deletePath,
    lineColor,
    setLineColor,
    lineWidth,
    setLineWidth,
    showOriginalImage,
    toggleShowOriginal,
    clearCanvas,
  } = useCanvasStore();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      backgroundColor: '#171717',
      borderBottom: '1px solid #262626',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id as any)}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentTool === tool.id ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'transparent',
              color: currentTool === tool.id ? '#fff' : '#a3a3a3',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px',
              transition: 'all 0.2s',
            }}
          >
            {tool.id === 'select' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            )}
            {tool.id === 'move' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            )}
            {tool.id === 'add' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setLineColor(color)}
            title={color}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: color,
              border: lineColor === color ? '2px solid #fff' : '2px solid transparent',
              cursor: 'pointer',
              padding: 0,
              boxShadow: lineColor === color ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        <span style={{ fontSize: '12px', color: '#737373' }}>Width:</span>
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #404040',
            fontSize: '13px',
            backgroundColor: '#262626',
            color: '#fff',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {widths.map((w) => (
            <option key={w} value={w}>{w}px</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        <button
          onClick={() => setZoom(Math.max(25, zoom - 25))}
          title="Zoom Out"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            color: '#a3a3a3',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span style={{ fontSize: '12px', color: '#a3a3a3', minWidth: '50px', textAlign: 'center' }}>{zoom}%</span>
        <button
          onClick={() => setZoom(Math.min(400, zoom + 25))}
          title="Zoom In"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            color: '#a3a3a3',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0-3v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          title="Reset Zoom"
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            color: '#a3a3a3',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Fit
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer',
            opacity: undoStack.length === 0 ? 0.4 : 1,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#a3a3a3' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer',
            opacity: redoStack.length === 0 ? 0.4 : 1,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#a3a3a3' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6 6" />
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px', borderRight: '1px solid #262626' }}>
        <button
          onClick={toggleGrid}
          title="Toggle Grid"
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: gridEnabled ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : '#262626',
            color: gridEnabled ? '#fff' : '#a3a3a3',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          Grid
        </button>
        {gridEnabled && (
          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #404040',
              fontSize: '11px',
              backgroundColor: '#262626',
              color: '#a3a3a3',
              outline: 'none',
            }}
          >
            <option value={10}>10px</option>
            <option value={20}>20px</option>
            <option value={50}>50px</option>
          </select>
        )}
      </div>

      <button
        onClick={toggleShowOriginal}
        title="Toggle Original Image"
        style={{
          padding: '8px 14px',
          borderRadius: '6px',
          border: '1px solid #404040',
          backgroundColor: showOriginalImage ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : '#262626',
          color: showOriginalImage ? '#fff' : '#a3a3a3',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        Image
      </button>

      {selectedPathId && currentTool === 'select' && (
        <button
          onClick={() => deletePath(selectedPathId)}
          title="Delete Selected"
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#dc2626',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          Delete
        </button>
      )}

      <button
        onClick={clearCanvas}
        title="Clear All"
        style={{
          padding: '8px 14px',
          borderRadius: '6px',
          border: '1px solid #404040',
          backgroundColor: 'transparent',
          color: '#a3a3a3',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Clear
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExportSVG}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          SVG
        </button>
        <button
          onClick={onExportDXF}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DXF
        </button>
      </div>
    </div>
  );
}