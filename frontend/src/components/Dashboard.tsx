import React, { useState, useEffect } from 'react';

interface Scan {
  id: string;
  filename: string;
  extension: string;
  status: string;
}

interface DashboardProps {
  token: string;
  onSelectScan: (id: string) => void;
}

export default function Dashboard({ token, onSelectScan }: DashboardProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchScans = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/scans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setScans(data);
      }
    } catch (err) {
      console.error("Error reading file logs:", err);
    }
  };

  useEffect(() => {
    fetchScans();
    const pollInterval = setInterval(fetchScans, 3000); // Poll status modifications every 3 seconds
    return () => clearInterval(pollInterval);
  }, [token]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('http://127.0.0.1:8000/scans/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) fetchScans();
    } catch (err) {
      alert("Pipeline initialization failure");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Upload Neuroimaging Series</h3>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Accepts clinical DICOM (.dcm), structural NIfTI (.nii.gz), or diagnostic image sequences (.png/.jpg) for target analysis alignment.</p>
        
        <label style={{ display: 'inline-block', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'medium' }}>
          {uploading ? 'Injecting Target Stream...' : 'Select Target Matrix Volume'}
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </section>

      <section style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Patient Diagnostic Execution Registry</h3>
        {scans.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>No execution sequences mapped to active registry.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px' }}>Filename Source</th>
                <th style={{ padding: '12px' }}>Dimension Profile</th>
                <th style={{ padding: '12px' }}>Operational State</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {scans.map(scan => (
                <tr key={scan.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{scan.filename}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{scan.extension.toUpperCase()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: scan.status === 'Completed' ? '#dcfce7' : scan.status.startsWith('Failed') ? '#fee2e2' : '#fef9c3',
                      color: scan.status === 'Completed' ? '#166534' : scan.status.startsWith('Failed') ? '#991b1b' : '#854d0e',
                    }}>{scan.status}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => onSelectScan(scan.id)}
                      disabled={scan.status !== 'Completed'}
                      style={{ backgroundColor: scan.status === 'Completed' ? '#0f172a' : '#cbd5e1', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: scan.status === 'Completed' ? 'pointer' : 'not-allowed' }}>
                      Inspect Analytics Workspace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}