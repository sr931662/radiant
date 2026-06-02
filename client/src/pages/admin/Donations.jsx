import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminDonations, getDonationStats } from '../../services/adminService'
import Spinner from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import { TrendingUp, IndianRupee, BarChart2, Users, Heart } from 'lucide-react'
import s from './admin.module.css'

export default function AdminDonations() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-donations', page, statusFilter],
    queryFn: () => getAdminDonations(page, 20, statusFilter),
  })

  const { data: stats } = useQuery({ queryKey: ['donation-stats'], queryFn: getDonationStats })
  const st = stats || {}

  const fmtINR = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—'

  const items = data?.items || []

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Donations</h1>
          <p className={s.pageSub}>{st.total_count ?? 0} total donations received</p>
        </div>
        <div style={{ margin: 0 }}>
          <select className={s.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            {['PENDING', 'SUCCESS', 'FAILED'].map((sv) => <option key={sv} value={sv}>{sv}</option>)}
          </select>
        </div>
      </div>

      <div className={s.statsGrid}>
        {[
          { label: 'Total Raised',    value: fmtINR(st.total_donations),   icon: IndianRupee, variant: 'statGreen'  },
          { label: 'Total Donations', value: st.total_count,               icon: Users,       variant: 'statBlue'   },
          { label: 'Avg Donation',    value: st.average_donation != null ? `₹${Number(st.average_donation).toFixed(0)}` : '—', icon: BarChart2, variant: 'statIndigo' },
          { label: 'This Month',      value: fmtINR(st.this_month_total),  icon: TrendingUp,  variant: 'statAmber'  },
        ].map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`${s.statCard} ${s[variant]}`}>
            <p className={s.statLabel}>{label}</p>
            <p className={s.statValue}>{value}</p>
            <div className={s.statIcon}><Icon size={54} strokeWidth={1.5} /></div>
          </div>
        ))}
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {['Amount', 'Currency', 'Donor', 'Status', 'Date'].map((h) => (
                  <th key={h} className={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((d) => (
                <tr key={d.id}>
                  <td className={s.td} style={{ fontWeight: 700, color: '#059669' }}>{fmtINR(d.amount)}</td>
                  <td className={s.td}><span className={`${s.chip} ${s.chipSlate}`}>{d.currency}</span></td>
                  <td className={s.td}>{d.anonymous ? <span className={`${s.chip} ${s.chipSlate}`}>Anonymous</span> : (d.user_id?.slice(0, 10) + '…')}</td>
                  <td className={s.td}><StatusBadge status={d.status} /></td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><Heart size={24} /></div>
                    <p className={s.emptyStateText}>No donations found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
    </div>
  )
}
