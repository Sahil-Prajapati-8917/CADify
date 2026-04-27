import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export interface PathData {
  id: string;
  d: string;
  type: 'open' | 'closed';
  stroke: string;
  stroke_width: number;
}

export interface ProcessResult {
  job_id: string;
  image_width: number;
  image_height: number;
  paths: PathData[];
  processing_time_ms: number;
  sensitivity_used: string;
  confidence: number;
}

export interface JobStatus {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
  result?: ProcessResult;
}

export async function uploadImage(file: File, sensitivity: string = 'medium'): Promise<{ job_id: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sensitivity', sensitivity);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await api.get(`/job/${jobId}`);
  return response.data;
}

export async function getJobResult(jobId: string): Promise<ProcessResult> {
  const response = await api.get(`/job/${jobId}/result`);
  return response.data;
}

export async function exportDXF(jobId: string, paths: PathData[]): Promise<Blob> {
  const response = await api.post(`/export/dxf`, {
    job_id: jobId,
    paths,
  }, {
    responseType: 'blob',
  });
  return response.data;
}

export async function exportSVG(jobId: string, paths: PathData[]): Promise<Blob> {
  const response = await api.post(`/export/svg`, {
    job_id: jobId,
    paths,
  }, {
    responseType: 'blob',
  });
  return response.data;
}