// import { useState } from 'react'

// type DashboardPageProps = {
//   userEmail: string
//   onLogout: () => void
// }

// export default function DashboardPage({ userEmail, onLogout }: DashboardPageProps) {
//   const [summary, setSummary] = useState<{
//     total_projects: number
//     total_files: number
//     active_users: number
//     recent_activity: string[]
//     message: string
//   } | null>(null)
//   const [stats, setStats] = useState<{
//     total_annotations: number
//     merged_views: number
//     active_sessions: number
//   } | null>(null)
//   const [status, setStatus] = useState('')
//   const [loading, setLoading] = useState(false)

//   const fetchDashboard = async () => {
//     setStatus('')
//     setLoading(true)
//     try {
//       const [summaryRes, statsRes] = await Promise.all([
//         fetch('http://localhost:8000/dashboard/summary'),
//         fetch('http://localhost:8000/dashboard/stats'),
//       ])

//       if (!summaryRes.ok || !statsRes.ok) {
//         throw new Error('Failed to load dashboard data')
//       }

//       setSummary(await summaryRes.json())
//       setStats(await statsRes.json())
//       setStatus('Dashboard data loaded')
//     } catch (error) {
//       if (error instanceof Error) {
//         setStatus(error.message)
//       } else {
//         setStatus('Failed to load dashboard data')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="panel">
//       <div className="panel-header space-between">
//         <div>
//           <h1>Dashboard</h1>
//           <p>Welcome back{userEmail ? `, ${userEmail}` : ''}.</p>
//         </div>
//         <button type="button" className="secondary-button" onClick={onLogout}>
//           Log out
//         </button>
//       </div>

//       <div className="dashboard-actions">
//         <button type="button" className="primary-button" onClick={fetchDashboard} disabled={loading}>
//           {loading ? 'Refreshing…' : 'Refresh data'}
//         </button>
//       </div>

//       {status && <div className="status-message">{status}</div>}

//       <div className="grid-cards">
//         <div className="info-card">
//           <strong>Total projects</strong>
//           <span>{summary ? summary.total_projects : '—'}</span>
//         </div>
//         <div className="info-card">
//           <strong>Total files</strong>
//           <span>{summary ? summary.total_files : '—'}</span>
//         </div>
//         <div className="info-card">
//           <strong>Active users</strong>
//           <span>{summary ? summary.active_users : '—'}</span>
//         </div>
//       </div>

//       {stats && (
//         <div className="grid-cards">
//           <div className="info-card">
//             <strong>Annotations</strong>
//             <span>{stats.total_annotations}</span>
//           </div>
//           <div className="info-card">
//             <strong>Merged views</strong>
//             <span>{stats.merged_views}</span>
//           </div>
//           <div className="info-card">
//             <strong>Active sessions</strong>
//             <span>{stats.active_sessions}</span>
//           </div>
//         </div>
//       )}

//       {summary && (
//         <div className="panel-section">
//           <h2>Recent activity</h2>
//           <ul>
//             {summary.recent_activity.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </section>
//   )
// }
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>MRI Analysis Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-box">
          <h2>120</h2>
          <p>Total Scans</p>
        </div>

        <div className="stat-box">
          <h2>115</h2>
          <p>Completed</p>
        </div>

        <div className="stat-box">
          <h2>5</h2>
          <p>Running</p>
        </div>
      </div>

      <button
        className="upload-btn"
        onClick={() => navigate("/upload")}
      >
        Upload New Scan
      </button>
    </div>
  );
};

export default Dashboard;