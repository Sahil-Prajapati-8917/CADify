'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toolbar } from '@/app/components/Toolbar';
import Canvas from '@/app/components/Canvas';
import { useCanvasStore } from '@/app/lib/canvasStore';
import { getJobStatus, getJobResult, exportDXF } from '@/app/lib/api';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('processing');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const { setPaths, paths, setImageDimensions } = useCanvasStore();

  const fetchResult = useCallback(async () => {
    try {
      const status = await getJobStatus(jobId);
      setProcessingStatus(status.status);
      
      if (status.status === 'failed') {
        setError(status.error || 'Processing failed');
        setLoading(false);
        return;
      }
      
      if (status.status === 'completed') {
        const result = await getJobResult(jobId);
        setPaths(result.paths);
        setImageDimensions(result.image_width, result.image_height);
        
        // Construct image URL from backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        setImageUrl(`${apiUrl}/uploads/${jobId}`);
        
        setLoading(false);
        return;
      }
      
      if (status.status === 'processing' || status.status === 'queued') {
        setTimeout(fetchResult, 2000);
      }
    } catch (e) {
      setError('Failed to fetch result');
      setLoading(false);
    }
  }, [jobId, setPaths, setImageDimensions]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const handleExportSVG = useCallback(() => {
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svgContent += `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">\n`;
    
    paths.forEach(pathData => {
      svgContent += `  <path d="M ${pathData.d}" stroke="${pathData.stroke}" stroke-width="${pathData.stroke_width}" fill="none"/>\n`;
    });
    
    svgContent += '</svg>';
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cadify-export.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [paths]);

  const handleExportDXF = useCallback(async () => {
    try {
      const blob = await exportDXF(jobId, paths);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cadify-export.dxf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('DXF export failed:', e);
    }
  }, [jobId, paths]);

  const handleNewProject = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #3b82f6', 
          borderTopColor: 'transparent', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px',
        }} />
        <p style={{ color: '#666' }}>{processingStatus === 'queued' ? 'Waiting in queue...' : 'Processing image...'}</p>
        <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>This usually takes 10-15 seconds</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: '#fee2e2', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <svg style={{ width: '32px', height: '32px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>Processing Failed</p>
        <p style={{ color: '#666', marginBottom: '16px' }}>{error}</p>
        <button
          onClick={handleNewProject}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Try Another Image
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ width: '100%', padding: '12px 16px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handleNewProject}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#666',
            cursor: 'pointer',
            borderRadius: '6px',
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '14px', color: '#999' }}>Job: {jobId}</span>
      </header>

      <Toolbar onExportSVG={handleExportSVG} onExportDXF={handleExportDXF} />

      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f3f4f6', padding: '16px' }}>
        <Canvas initialImageUrl={imageUrl || undefined} width={800} height={600} />
      </div>
    </div>
  );
}