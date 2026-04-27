from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
import uuid
from pathlib import Path
import threading
import time

app = FastAPI(title="CADify API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://10.12.124.35:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

JOBS = {}

@app.get("/")
async def root():
    return {"status": "ok", "message": "CADify API is running"}

@app.get("/uploads/{job_id}")
async def get_upload(job_id: str):
    # Find the file that starts with this job_id
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.name.startswith(job_id):
            ext = file_path.suffix.lower().lstrip('.')
            content_types = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp',
            }
            media_type = content_types.get(ext, 'application/octet-stream')
            
            return FileResponse(
                path=str(file_path),
                media_type=media_type
            )
    
    raise HTTPException(status_code=404, detail="File not found")

@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    sensitivity: str = Form("medium")
):
    if sensitivity not in ["low", "medium", "high"]:
        sensitivity = "medium"
    
    job_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{job_id}_{file.filename}"
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    JOBS[job_id] = {
        "status": "queued",
        "file_path": str(file_path),
        "sensitivity": sensitivity,
    }
    
    thread = threading.Thread(target=process_job_background, args=(job_id,))
    thread.start()
    
    return {"job_id": job_id}

@app.get("/job/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "status": JOBS[job_id]["status"]}

@app.get("/job/{job_id}/result")
async def get_job_result(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = JOBS[job_id]
    if job["status"] != "completed":
        return {"status": job["status"]}
    
    return job.get("result")

@app.post("/export/dxf")
async def export_dxf(request: dict):
    paths = request.get("paths", [])
    job_id = request.get("job_id", "export")
    
    if paths is None:
        raise HTTPException(status_code=400, detail="paths is required")
    
    from backend.services.dxf_generator import generate_dxf
    
    output_path = UPLOAD_DIR / f"{job_id}.dxf"
    generate_dxf(paths, str(output_path))
    
    return FileResponse(
        path=str(output_path),
        filename="cadify-export.dxf",
        media_type="application/dxf"
    )

@app.post("/export/svg")
async def export_svg(request: dict):
    paths = request.get("paths", [])
    job_id = request.get("job_id", "export")
    
    if paths is None:
        raise HTTPException(status_code=400, detail="paths is required")
    
    job = JOBS.get(job_id, {})
    
    svg_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    svg_content += '<svg xmlns="http://www.w3.org/2000/svg" '
    svg_content += f'width="{job.get("image_width", 1200)}" '
    svg_content += f'height="{job.get("image_height", 900)}">\n'
    
    for path in paths:
        svg_content += f'  <path d="{path.get("d", "")}" '
        svg_content += f'stroke="{path.get("stroke", "#1A3C5E")}" '
        svg_content += f'stroke-width="{path.get("stroke_width", 1.5)}" '
        svg_content += 'fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n'
    
    svg_content += '</svg>'
    
    return Response(content=svg_content, media_type="image/svg+xml")

def process_job_background(job_id: str):
    from backend.processing.pipeline import process_image
    
    job = JOBS.get(job_id)
    if not job:
        return
    
    JOBS[job_id]["status"] = "processing"
    
    try:
        result = process_image(job["file_path"], job["sensitivity"])
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["result"] = result
        JOBS[job_id]["image_width"] = result["image_width"]
        JOBS[job_id]["image_height"] = result["image_height"]
    except Exception as e:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(e)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)