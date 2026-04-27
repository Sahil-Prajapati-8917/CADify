'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function UploadZone() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState('medium');
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

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={uploading}
        style={{
          width: '100%',
          border: '2px dashed #ccc',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          backgroundColor: '#f9f9f9',
          transition: 'all 0.2s',
          fontSize: 'inherit',
          fontFamily: 'inherit',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #3b82f6', 
              borderTopColor: 'transparent', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: '#666', fontSize: '18px' }}>Processing image...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{ width: '32px', height: '32px', color: '#999' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>Click to select an image</p>
            </div>
            <p style={{ fontSize: '12px', color: '#999' }}>JPG, PNG, WebP or GIF (max 20MB)</p>
          </div>
        )}
      </button>

      {error && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <p style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
          Edge Detection Sensitivity
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSensitivity(level)}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: sensitivity === level ? '#3b82f6' : '#f3f4f6',
                color: sensitivity === level ? '#fff' : '#666',
                border: 'none',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.5 : 1,
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
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