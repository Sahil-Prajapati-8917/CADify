import cv2
import numpy as np
from pathlib import Path
import time
import uuid

SENSITIVITY_PRESETS = {
    "low": {"t1": 80, "t2": 200},
    "medium": {"t1": 50, "t2": 150},
    "high": {"t1": 20, "t2": 80},
}

def process_image(file_path: str, sensitivity: str = "medium") -> dict:
    start_time = time.time()
    
    image = cv2.imread(file_path)
    if image is None:
        raise ValueError(f"Failed to load image: {file_path}")
    
    original_height, original_width = image.shape[:2]
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    _, shadow_removed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    bg_removed = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    shadow_clean = cv2.morphologyEx(bg_removed, cv2.MORPH_CLOSE, np.ones((3,3), np.uint8))
    
    gray = shadow_clean
    
    if max(original_width, original_height) > 2000:
        scale = 2000 / max(original_width, original_height)
        new_width = int(original_width * scale)
        new_height = int(original_height * scale)
        gray = cv2.resize(gray, (new_width, new_height), interpolation=cv2.INTER_AREA)
        original_width, original_height = new_width, new_height
    
    denoised = cv2.fastNlMeansDenoising(gray, None, h=10, templateWindowSize=7, searchWindowSize=21)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)
    
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
    
    preset = SENSITIVITY_PRESETS.get(sensitivity, SENSITIVITY_PRESETS["medium"])
    t1, t2 = preset["t1"], preset["t2"]
    
    edges = cv2.Canny(blurred, t1, t2, apertureSize=3)
    
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)
    
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    paths = []
    for i, contour in enumerate(contours):
        area = cv2.contourArea(contour)
        if area < 100:
            continue
        
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        if len(approx) < 3:
            continue
        
        path_d = contour_to_svg_path(contour)
        
        is_closed = cv2.isContourConvex(contour) or len(approx) >= 4
        
        paths.append({
            "id": f"path_{i+1}",
            "d": path_d,
            "type": "closed" if is_closed else "open",
            "stroke": "#1A3C5E",
            "stroke_width": 1.5
        })
    
    if len(paths) < 3:
        paths = fallback_hough_lines(edges, original_width, original_height)
    
    confidence = calculate_confidence(paths, edges)
    
    processing_time = int((time.time() - start_time) * 1000)
    
    return {
        "job_id": Path(file_path).stem.split("_")[0],
        "image_width": original_width,
        "image_height": original_height,
        "paths": paths,
        "processing_time_ms": processing_time,
        "sensitivity_used": sensitivity,
        "confidence": confidence
    }

def contour_to_svg_path(contour: np.ndarray) -> str:
    if len(contour) == 0:
        return ""
    
    path_parts = []
    for j, point in enumerate(contour):
        x, y = point[0]
        if j == 0:
            path_parts.append(f"M {x} {y}")
        else:
            path_parts.append(f"L {x} {y}")
    
    path_parts.append("Z")
    return " ".join(path_parts)

def fallback_hough_lines(edges, width, height):
    lines = cv2.HoughLinesP(
        edges,
        rho=1,
        theta=np.pi / 180,
        threshold=80,
        minLineLength=50,
        maxLineGap=10
    )
    
    if lines is None:
        return []
    
    paths = []
    for i, line in enumerate(lines[:100]):
        x1, y1, x2, y2 = line[0]
        path_d = f"M {x1} {y1} L {x2} {y2}"
        paths.append({
            "id": f"path_{i+1}",
            "d": path_d,
            "type": "open",
            "stroke": "#1A3C5E",
            "stroke_width": 1.5
        })
    
    return paths

def calculate_confidence(paths, edges) -> float:
    if len(paths) == 0:
        return 0.0
    
    if len(paths) < 3:
        return 0.3
    
    if len(paths) > 2000:
        return 0.4
    
    edge_ratio = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
    
    if edge_ratio < 0.01:
        return 0.3
    elif edge_ratio < 0.05:
        return 0.7
    elif edge_ratio < 0.15:
        return 0.85
    else:
        return 0.6