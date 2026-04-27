'use client';

import { useCanvasStore } from '../lib/canvasStore';

interface ToolbarProps {
  onExportSVG: () => void;
  onExportDXF: () => void;
}

const tools = [
  { id: 'select', icon: 'cursor', label: 'Select (V)', shortcut: 'V' },
  { id: 'move', icon: 'move', label: 'Move (M)', shortcut: 'M' },
  { id: 'pan', icon: 'pan', label: 'Pan (H)', shortcut: 'H' },
  { id: 'delete', icon: 'trash', label: 'Delete (Del)', shortcut: '' },
  { id: 'add', icon: 'plus', label: 'Add Line (L)', shortcut: 'L' },
  { id: 'draw', icon: 'pencil', label: 'Draw (D)', shortcut: 'D' },
] as const;

const colors = [
  '#1A3C5E', // Dark blue (default)
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
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
      padding: '8px 16px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e5e5',
      flexWrap: 'wrap',
    }}>
      {/* Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id as any)}
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: currentTool === tool.id ? '#3b82f6' : 'transparent',
              color: currentTool === tool.id ? '#fff' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px',
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
            {tool.id === 'pan' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            )}
            {tool.id === 'delete' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {tool.id === 'add' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {tool.id === 'draw' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 15.232l5.536 5.536m-5.536-5.536l-5.536 5.536M4 18l.01.01M9 13l3 3-3 3m-3-3l3-3-3-3" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Color Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setLineColor(color)}
            title={color}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: color,
              border: lineColor === color ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Line Width */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Width:</span>
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
          }}
        >
          {widths.map((w) => (
            <option key={w} value={w}>{w}px</option>
          ))}
        </select>
      </div>

      {/* Zoom Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        <button
          onClick={() => setZoom(Math.max(25, zoom - 25))}
          title="Zoom Out"
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span style={{ fontSize: '12px', color: '#666', minWidth: '45px', textAlign: 'center' }}>{zoom}%</span>
        <button
          onClick={() => setZoom(Math.min(400, zoom + 25))}
          title="Zoom In"
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
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
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Fit
        </button>
      </div>

      {/* Undo/Redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer',
            opacity: undoStack.length === 0 ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer',
            opacity: redoStack.length === 0 ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6 6" />
          </svg>
        </button>
      </div>

      {/* Grid Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '12px', borderRight: '1px solid #e5e5e5' }}>
        <button
          onClick={toggleGrid}
          title="Toggle Grid"
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: gridEnabled ? '#3b82f6' : '#fff',
            color: gridEnabled ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Grid
        </button>
        {gridEnabled && (
          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '11px',
            }}
          >
            <option value={10}>10px</option>
            <option value={20}>20px</option>
            <option value={50}>50px</option>
          </select>
        )}
      </div>

      {/* Show Original Image */}
      <button
        onClick={toggleShowOriginal}
        title="Toggle Original Image"
        style={{
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundColor: showOriginalImage ? '#3b82f6' : '#fff',
          color: showOriginalImage ? '#fff' : '#666',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Image
      </button>

      {/* Delete Selected */}
      {selectedPathId && currentTool === 'select' && (
        <button
          onClick={() => deletePath(selectedPathId)}
          title="Delete Selected"
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #dc2626',
            backgroundColor: '#dc2626',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      )}

      {/* Clear Canvas */}
      <button
        onClick={clearCanvas}
        title="Clear All"
        style={{
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid #666',
          backgroundColor: '#fff',
          color: '#666',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Clear
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Export Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onExportSVG}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            color: '#333',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
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
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
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