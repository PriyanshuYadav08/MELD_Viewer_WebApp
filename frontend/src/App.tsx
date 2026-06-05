// // import { useState } from 'react'
// // import './App.css'
// // import AuthPage from './pages/auth.tsx'
// // import DashboardPage from './pages/dashboard.tsx'

// // function App() {
// //   const [page, setPage] = useState<'auth' | 'dashboard'>('auth')
// //   const [userEmail, setUserEmail] = useState<string>('')

// //   const handleLoginSuccess = (email: string) => {
// //     setUserEmail(email)
// //     setPage('dashboard')
// //   }

// //   const handleLogout = () => {
// //     setUserEmail('')
// //     setPage('auth')
// //   }

// //   return (
// //     <div className="page-shell">
// //       <header className="topbar">
// //         <div>
// //           <strong>Meld Viewer</strong>
// //         </div>
// //         <div className="topbar-actions">
// //           <button
// //             type="button"
// //             className={page === 'auth' ? 'tab active' : 'tab'}
// //             onClick={() => setPage('auth')}
// //           >
// //             Auth
// //           </button>
// //           <button
// //             type="button"
// //             className={page === 'dashboard' ? 'tab active' : 'tab'}
// //             onClick={() => setPage('dashboard')}
// //           >
// //             Dashboard
// //           </button>
// //         </div>
// //       </header>

// //       <main className="page-content">
// //         {page === 'auth' ? (
// //           <AuthPage onLoginSuccess={handleLoginSuccess} />
// //         ) : (
// //           <DashboardPage onLogout={handleLogout} userEmail={userEmail} />
// //         )}
// //       </main>
// //     </div>
// //   )
// // }

// // export default App
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/dashboard.tsx";
// import Upload from "./pages/upload.tsx";
// import Viewer from "./pages/viewer.tsx";

// function App() {
//   return (
//     // <div>
//     //   <h1>Meld Viewer</h1>
//     // </div>

//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={<Dashboard />}
//         />

//         <Route
//           path="/upload"
//           element={<Upload />}
//         />

//         <Route
//           path="/viewer"
//           element={<Viewer />}
//         />
//       </Routes>
//     </BrowserRouter>

//     // <div>
//     //   <Dashboard />
//     // </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import Viewer from './components/Viewer.tsx';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setSelectedScanId(null);
  };

  if (!token) {
    return <Login onLoginSuccess={(receivedToken) => {
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
    }} />;
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#1e293b', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>NeuroImage MELD System Portal</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Logged in as Dr. Specialist</span>
          <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {selectedScanId ? (
          <div>
            <button onClick={() => setSelectedScanId(null)} style={{ marginBottom: '16px', backgroundColor: '#64748b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
              ← Return to Dashboard
            </button>
            <Viewer scanId={selectedScanId} token={token} />
          </div>
        ) : (
          <Dashboard token={token} onSelectScan={setSelectedScanId} />
        )}
      </main>
    </div>
  );
}