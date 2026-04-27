# CADify - AI-Powered Image to CAD Converter

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Stack-Next.js%2016%20%2B%20FastAPI-green" alt="Stack">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

## Overview

CADify is an AI-powered web application that converts images (photos, sketches) of wooden elements (doors, windows, cabinets, furniture) into editable vector CAD drawings. Built with Next.js 16 (frontend) and FastAPI (backend), it uses OpenCV for edge detection and provides an ARTCAM-like editing experience.

## Features

### Core Features
- **Image to CAD Conversion** - Upload photos/sketches, get vector paths automatically
- **Dual-Panel Editor** - Original image (left) + Generated paths (right)
- **Shadow Removal** - Automatic preprocessing to remove shadows for cleaner results
- **Movable Paths** - Click and drag paths to reposition
- **Add/Delete Lines** - Create new paths with double-click, delete with keyboard

### Editing Tools
- **Select Tool** - Click to select paths
- **Move Tool** - Drag paths to new positions
- **Add Line** - Double-click to add new lines
- **Color Picker** - 8 color options
- **Line Width** - Adjustable 1-8px
- **Grid Overlay** - Toggle with configurable size
- **Undo/Redo** - Full history (Ctrl+Z / Ctrl+Y)

### Export Options
- **SVG Export** - Scalable vector graphics
- **DXF Export** - CAD-compatible format (AutoCAD, FreeCAD)

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Zustand** - State management
- **React Dropzone** - File upload

### Backend
- **FastAPI** - Python REST API
- **OpenCV** - Image processing & edge detection
- **ezdxf** - DXF file generation

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
```bash
cd /Users/sahil/Desktop/cad
```

2. **Install frontend dependencies**
```bash
pnpm install
```

3. **Install backend dependencies**
```bash
cd backend
python3 -m pip install -r requirements.txt
cd ..
```

### Running the Application

**Terminal 1 - Frontend (Next.js)**
```bash
pnpm run dev
```

**Terminal 2 - Backend (FastAPI)**
```bash
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Access the Application
- Open http://localhost:3000 in your browser

## Usage

1. **Upload Image** - Click the upload button and select an image (JPG, PNG, WebP)
2. **Select Sensitivity** - Choose Low/Medium/High edge detection
3. **Wait for Processing** - The backend processes the image (~10-15 seconds)
4. **Edit in Canvas** - 
   - Left panel shows original image
   - Right panel shows generated paths
   - Click "Image" button to toggle original visibility
   - Drag paths to move them
   - Double-click to add new lines
5. **Export** - Click SVG or DXF to download

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| V | Select tool |
| M | Move tool |
| L | Add line tool |
| Delete | Delete selected path |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |

## Project Structure

```
/cad
├── app/                      # Next.js frontend
│   ├── components/
│   │   ├── Canvas.tsx        # Dual-panel canvas editor
│   │   ├── Toolbar.tsx      # Editing toolbar
│   │   └── UploadZone.tsx   # File upload component
│   ├── editor/[jobId]/
│   │   └── page.tsx          # Editor page
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── canvasStore.ts   # Zustand state
│   └── page.tsx             # Home/Landing page
├── backend/                  # FastAPI backend
│   ├── main.py              # API server
│   ├── processing/
│   │   └── pipeline.py      # OpenCV edge detection
│   └── services/
│       └── dxf_generator.py # DXF export
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /upload | Upload image, returns job_id |
| GET | /job/{job_id} | Get processing status |
| GET | /job/{job_id}/result | Get generated paths |
| POST | /export/dxf | Export paths as DXF |
| POST | /export/svg | Export paths as SVG |
| GET | /uploads/{job_id} | Get original image |

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend Settings (backend/main.py)
- Upload directory: `backend/uploads/`
- Max file size: 20MB
- Supported formats: JPG, PNG, WebP, GIF, PDF

## Known Issues

- Fabric.js has compatibility issues with Next.js 16 Turbopack - using native HTML5 Canvas instead

## Future Enhancements

- Layer management (cut lines, engraving)
- Snap-to-grid and angle constraints
- Scale tool for real-world measurements
- Template library (door styles, window types)
- Batch processing
- AI dimension estimation

## License

MIT License - See LICENSE file for details.

## Credits

Created by Sahil Prajapati
Stack: Next.js 16 + Python FastAPI + OpenCV + ezdxf