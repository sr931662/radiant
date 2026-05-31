import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentActivity } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import { Users, Heart, FileText, TrendingUp, Activity } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '12px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{value ?? '—'}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: getDashboardStats })
  const { data: activity = [] } = useQuery({ queryKey: ['admin-activity'], queryFn: getRecentActivity })

  if (isLoading) return <Spinner center size="lg" />

  const u = stats?.users || {}
  const d = stats?.donations || {}
  const a = stats?.admissions || {}

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Overview of platform activity</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Users"     value={u.total_users}    icon={Users}   color="#2563eb" />
        <StatCard label="Active Students" value={u.active_students} icon={Users}   color="#7c3aed" />
        <StatCard label="Total Donations" value={d.total_count}    icon={Heart}   color="#e11d48" />
        <StatCard label="Donations Raised" value={d.total_donations != null ? `₹${Number(d.total_donations).toLocaleString('en-IN')}` : '—'} icon={TrendingUp} color="#059669" />
        <StatCard label="Applications"    value={a.total_applications} icon={FileText} color="#d97706" />
        <StatCard label="Pending Review"  value={a.pending}        icon={Activity} color="#0891b2" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Admission Status</h3>
          {[['Pending', a.pending, '#f59e0b'], ['Approved', a.approved, '#10b981'], ['Rejected', a.rejected, '#ef4444']].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.88rem', color: '#374151' }}>{label}</span>
              <span style={{ fontWeight: 700, color }}>{val ?? 0}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>User Breakdown</h3>
          {[['Faculty', u.active_faculty, '#7c3aed'], ['Volunteers', u.active_volunteers, '#059669'], ['Banned', u.banned_users, '#ef4444']].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.88rem', color: '#374151' }}>{label}</span>
              <span style={{ fontWeight: 700, color }}>{val ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {activity.length > 0 && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Activity</h3>
          {activity.slice(0, 10).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
              <span style={{ color: '#374151' }}><strong>{a.action}</strong> {a.resource} {a.user ? `by ${a.user}` : ''}</span>
              <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
