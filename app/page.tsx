'use client';

import { UploadZone } from "./components/UploadZone";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <header style={{ width: '100%', padding: '20px 32px', backgroundColor: 'rgba(15, 15, 15, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #262626', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <svg style={{ width: '22px', height: '22px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>CADify</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#737373' }}>AI-Powered</span>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px', maxWidth: '700px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '100px', 
            marginBottom: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 500 }}>For Wood Industry Professionals</span>
          </div>
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: '800', 
            color: '#fff', 
            marginBottom: '20px',
            letterSpacing: '-1.5px',
            lineHeight: 1.1
          }}>
            Transform Photos to{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              CAD Drawings
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#a3a3a3', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
            Upload a photo of doors, windows, cabinets, or furniture. 
            Get editable vector paths in seconds. Export to SVG or DXF.
          </p>
        </div>

        <UploadZone />

        <div style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px' }}>
          <div style={{ 
            padding: '32px 24px', 
            backgroundColor: '#171717', 
            borderRadius: '16px', 
            border: '1px solid #262626',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 16px', 
              backgroundColor: 'rgba(59, 130, 246, 0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <svg style={{ width: '28px', height: '28px', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px', fontSize: '16px' }}>Lightning Fast</h3>
            <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.5 }}>Get your CAD drawing in under 15 seconds</p>
          </div>
          <div style={{ 
            padding: '32px 24px', 
            backgroundColor: '#171717', 
            borderRadius: '16px', 
            border: '1px solid #262626',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 16px', 
              backgroundColor: 'rgba(34, 197, 94, 0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <svg style={{ width: '28px', height: '28px', color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 15.232l5.536 5.536m-5.536-5.536l-5.536 5.536M4 18l.01.01M9 13l3 3-3 3m-3-3l3-3-3-3" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px', fontSize: '16px' }}>Fully Editable</h3>
            <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.5 }}>Click to select, drag to move, double-click to add lines</p>
          </div>
          <div style={{ 
            padding: '32px 24px', 
            backgroundColor: '#171717', 
            borderRadius: '16px', 
            border: '1px solid #262626',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 16px', 
              backgroundColor: 'rgba(168, 85, 247, 0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <svg style={{ width: '28px', height: '28px', color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px', fontSize: '16px' }}>Export Anywhere</h3>
            <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.5 }}>Download as SVG or DXF for any CAD software</p>
          </div>
        </div>
      </main>

      <footer style={{ width: '100%', padding: '24px 32px', borderTop: '1px solid #262626', backgroundColor: '#0f0f0f', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#525252' }}>CADify v1.0 — AI-Powered Image to CAD Converter</p>
      </footer>
    </div>
  );
}