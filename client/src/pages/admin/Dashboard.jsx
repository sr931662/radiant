import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentActivity } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import {
  Users, Heart, FileText, TrendingUp, Activity,
  GraduationCap, HandHeart, BookOpen, BadgeCheck,
} from 'lucide-react'
import s from './admin.module.css'

function StatCard({ label, value, icon: Icon, variant }) {
  return (
    <div className={`${s.statCard} ${s[variant]}`}>
      <p className={s.statLabel}>{label}</p>
      <p className={s.statValue}>{value ?? '—'}</p>
      <div className={s.statIcon}><Icon size={54} strokeWidth={1.5} /></div>
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

  const fmtINR = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—'

  return (
    <div>
      <div className={s.pageHeader} style={{ marginBottom: '1.75rem' }}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Welcome back</h1>
          <p className={s.pageSub}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className={s.statsGrid}>
        <StatCard label="Total Users"      value={u.total_users}     icon={Users}        variant="statBlue" />
        <StatCard label="Active Students"  value={u.active_students} icon={BookOpen}     variant="statIndigo" />
        <StatCard label="Total Raised"     value={fmtINR(d.total_donations)} icon={TrendingUp} variant="statGreen" />
        <StatCard label="Donations"        value={d.total_count}     icon={Heart}        variant="statRose" />
        <StatCard label="Applications"     value={a.total_applications} icon={FileText}  variant="statAmber" />
        <StatCard label="Pending Review"   value={a.pending}         icon={Activity}     variant="statCyan" />
        <StatCard label="Faculty"          value={u.active_faculty}  icon={GraduationCap} variant="statPurple" />
        <StatCard label="Volunteers"       value={u.active_volunteers} icon={HandHeart}  variant="statSlate" />
      </div>

      <div className={s.sectionGrid}>
        {/* Admission breakdown */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Admission Pipeline</h3>
            <a href="/admin/admissions" className={`${s.btn} ${s.btnGhost}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>View all</a>
          </div>
          <div className={s.cardBody}>
            {[
              ['Pending',  a.pending,  '#d97706'],
              ['Approved', a.approved, '#059669'],
              ['Rejected', a.rejected, '#dc2626'],
            ].map(([label, val, color]) => (
              <div key={label} className={s.segmentRow}>
                <span className={s.segmentLabel}>{label}</span>
                <span className={s.segmentValue} style={{ color }}>{val ?? 0}</span>
              </div>
            ))}
            <div style={{ marginTop: '1rem', borderRadius: '6px', overflow: 'hidden', height: '8px', display: 'flex', gap: '2px' }}>
              {[
                [a.pending,  '#f59e0b'],
                [a.approved, '#10b981'],
                [a.rejected, '#ef4444'],
              ].map(([val, color], i) => {
                const total = (a.pending || 0) + (a.approved || 0) + (a.rejected || 0) || 1
                return <div key={i} style={{ flex: (val || 0) / total, background: color, borderRadius: '4px', minWidth: val ? 4 : 0 }} />
              })}
            </div>
          </div>
        </div>

        {/* User breakdown */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>User Breakdown</h3>
            <a href="/admin/users" className={`${s.btn} ${s.btnGhost}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>View all</a>
          </div>
          <div className={s.cardBody}>
            {[
              ['Faculty',    u.active_faculty,    '#7c3aed'],
              ['Students',   u.active_students,   '#2563eb'],
              ['Volunteers', u.active_volunteers, '#059669'],
              ['Banned',     u.banned_users,      '#dc2626'],
            ].map(([label, val, color]) => (
              <div key={label} className={s.segmentRow}>
                <span className={s.segmentLabel}>{label}</span>
                <span className={s.segmentValue} style={{ color }}>{val ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activity.length > 0 && (
        <div className={s.card} style={{ marginTop: '1.25rem' }}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Recent Activity</h3>
          </div>
          <div className={s.cardBody}>
            {activity.slice(0, 10).map((item, i) => (
              <div key={i} className={s.activityRow}>
                <span className={s.activityText}>
                  <strong>{item.action}</strong>{item.resource ? ` ${item.resource}` : ''}{item.user ? ` by ${item.user}` : ''}
                </span>
                <span className={s.activityTime}>
                  {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
