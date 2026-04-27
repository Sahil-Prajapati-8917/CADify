'use client';

import { UploadZone } from "./components/UploadZone";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ width: '100%', padding: '16px 24px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111' }}>CADify</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>
            Transform Images to CAD
          </h1>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px' }}>
            Upload a photo or sketch of any wooden element — doors, windows, cabinets — 
            and get an editable vector drawing in seconds.
          </p>
        </div>

        <UploadZone />

        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '800px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#111', marginBottom: '4px' }}>Fast Processing</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Get your CAD drawing in under 15 seconds</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 15.232l5.536 5.536m-5.536-5.536l-5.536 5.536M4 18l.01.01M9 13l3 3-3 3m-3-3l3-3-3-3" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#111', marginBottom: '4px' }}>Editable Canvas</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Fix AI errors with powerful editing tools</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '24px', height: '24px', color: '#9333ea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 style={{ fontWeight: '600', color: '#111', marginBottom: '4px' }}>Export to CAD</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Download as SVG or DXF for any CAD software</p>
          </div>
        </div>
      </main>

      <footer style={{ width: '100%', padding: '16px 24px', borderTop: '1px solid #e5e5e5', backgroundColor: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>CADify v1.0 — AI-Powered Image to CAD Converter</p>
      </footer>
    </div>
  );
}