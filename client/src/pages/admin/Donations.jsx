import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminDonations, getDonationStats } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import { TrendingUp, IndianRupee, BarChart2, Users } from 'lucide-react'

export default function AdminDonations() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-donations', page, statusFilter],
    queryFn: () => getAdminDonations(page, 20, statusFilter),
  })

  const { data: stats } = useQuery({ queryKey: ['donation-stats'], queryFn: getDonationStats })

  const items = data?.items || []
  const s = stats || {}

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Donations</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Raised', value: s.total_donations != null ? `₹${Number(s.total_donations).toLocaleString('en-IN')}` : '—', icon: IndianRupee, color: '#059669' },
          { label: 'Total Donations', value: s.total_count, icon: Users, color: '#2563eb' },
          { label: 'Average Donation', value: s.average_donation != null ? `₹${Number(s.average_donation).toFixed(0)}` : '—', icon: BarChart2, color: '#7c3aed' },
          { label: 'This Month', value: s.this_month_total != null ? `₹${Number(s.this_month_total).toLocaleString('en-IN')}` : '—', icon: TrendingUp, color: '#d97706' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color={color} /></div>
            <div><p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{label}</p><p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{value ?? '—'}</p></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <option value="">All Status</option>
          {['PENDING', 'SUCCESS', 'FAILED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? <Spinner center /> : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Amount', 'Currency', 'Status', 'Anonymous', 'Date'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{d.currency}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>{d.anonymous ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
    </div>
  )
}
