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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f0f0f' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          position: 'relative',
          marginBottom: '24px',
        }}>
          <div style={{ 
            position: 'absolute',
            inset: 0,
            border: '3px solid #262626', 
            borderRadius: '50%',
          }} />
          <div style={{ 
            position: 'absolute',
            inset: 0,
            border: '3px solid #3b82f6', 
            borderTopColor: 'transparent', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
        <p style={{ color: '#fff', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
          {processingStatus === 'queued' ? 'Waiting in queue...' : 'Processing your image...'}
        </p>
        <p style={{ color: '#525252', fontSize: '14px' }}>This usually takes 10-15 seconds</p>
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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f0f0f' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '20px', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <svg style={{ width: '40px', height: '40px', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Processing Failed</p>
        <p style={{ color: '#737373', marginBottom: '24px' }}>{error}</p>
        <button
          onClick={handleNewProject}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Try Another Image
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f0f0f' }}>
      <header style={{ 
        width: '100%', 
        padding: '16px 20px', 
        borderBottom: '1px solid #262626', 
        backgroundColor: '#171717', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px' 
      }}>
        <button
          onClick={handleNewProject}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            border: '1px solid #404040',
            backgroundColor: '#262626',
            color: '#a3a3a3',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: '#262626',
          borderRadius: '8px'
        }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
          <span style={{ fontSize: '13px', color: '#a3a3a3' }}>Job: {jobId.slice(0, 8)}...</span>
        </div>
      </header>

      <Toolbar onExportSVG={handleExportSVG} onExportDXF={handleExportDXF} />

      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0f0f0f', padding: '24px' }}>
        <Canvas initialImageUrl={imageUrl || undefined} width={1200} height={600} />
      </div>
    </div>
  );
}