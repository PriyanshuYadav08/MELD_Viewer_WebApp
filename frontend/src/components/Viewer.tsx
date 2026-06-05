import React, { useState, useEffect } from 'react';

interface ViewerProps {
  scanId: string;
  token: string;
}

export default function Viewer({ scanId, token }: ViewerProps) {
  const [scan, setScan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'2d' | '3d' | '4d'>('2d');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/scans/${scanId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setScan(data));
  }, [scanId, token]);

  if (!scan || !scan.output_views) {
    return <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Retrieving Matrix Analysis Assets...</div>;
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '6px' }}>Workspace Diagnostic Viewer</h2>
      <p style={{ color: '#64748b', margin: 0, marginBottom: '24px' }}>Active Reference Sequence ID: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{scan.id}</code></p>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', paddingBottom: '2px' }}>
        {(['2d', '3d', '4d'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
              borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab ? '#2563eb' : '#64748b'
            }}>
            {tab.toUpperCase()} Matrix Configuration View
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#0f172a', padding: '24px', borderRadius: '6px' }}>
        {activeTab === '2d' && (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <p style={{ marginBottom: '12px', color: '#94a3b8' }}>Axial 2D Cross-Section Sequence Slice</p>
            <img src={scan.output_views.view_2d} alt="2D MRI Slice" style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '4px', border: '2px solid #334155' }} />
          </div>
        )}
        {activeTab === '3d' && (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <p style={{ marginBottom: '12px', color: '#94a3b8' }}>Coronal 3D Topography Surface Map</p>
            <img src={scan.output_views.view_3d} alt="3D MRI Mesh View" style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '4px', border: '2px solid #334155' }} />
          </div>
        )}
        {activeTab === '4d' && (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <p style={{ marginBottom: '12px', color: '#94a3b8' }}>MELD Spatial Segmentation Mask / Time Sequence Matrix</p>
            <img src={scan.output_views.view_4d} alt="4D/Segmentation Matrix View" style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '4px', border: '2px solid #334155' }} />
          </div>
        )}
      </div>
    </div>
  );
}