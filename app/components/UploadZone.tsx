'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function UploadZone() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState('medium');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sensitivity', sensitivity);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Upload failed');
      }

      const { job_id } = await response.json();
      router.push(`/editor/${job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } } as any);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div
        onClick={triggerFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: '100%',
          border: `2px dashed ${isDragOver ? '#3b82f6' : '#404040'}`,
          borderRadius: '20px',
          padding: '56px 32px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.05)' : '#171717',
          transition: 'all 0.3s ease',
          borderColor: isDragOver ? '#3b82f6' : '#404040',
          boxShadow: isDragOver ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              position: 'relative',
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
            <div>
              <p style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Processing your image...</p>
              <p style={{ color: '#737373', fontSize: '14px' }}>This usually takes 10-15 seconds</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px', 
              backgroundColor: '#262626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}>
              <svg style={{ width: '36px', height: '36px', color: '#525252' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Drop your image here</p>
              <p style={{ fontSize: '14px', color: '#737373' }}>or click to browse</p>
            </div>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#262626',
              borderRadius: '100px'
            }}>
              <svg style={{ width: '16px', height: '16px', color: '#a3a3a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span style={{ fontSize: '13px', color: '#a3a3a3' }}>JPG, PNG, WebP, GIF (max 20MB)</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}>
          <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        <p style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#a3a3a3', marginBottom: '12px', textAlign: 'center' }}>
          Edge Detection Sensitivity
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSensitivity(level)}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: sensitivity === level ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : '#262626',
                color: sensitivity === level ? '#fff' : '#a3a3a3',
                border: sensitivity === level ? 'none' : '1px solid #404040',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: '#525252', marginTop: '12px', textAlign: 'center' }}>
          {sensitivity === 'low' && 'Less detail, cleaner output'}
          {sensitivity === 'medium' && 'Balanced - recommended'}
          {sensitivity === 'high' && 'More detail, may have noise'}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}