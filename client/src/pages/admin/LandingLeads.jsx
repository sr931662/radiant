import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import { getAdminLandingLeads, updateLandingLeadStatus } from '../../services/landingLeadService'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import s from './admin.module.css'

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED']

export default function AdminLandingLeads() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-landing-leads', page],
    queryFn: () => getAdminLandingLeads(page, 20),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateLandingLeadStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-landing-leads'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update status.'),
  })

  const items = data?.items || []
  const newCount = items.filter((i) => i.status === 'NEW').length

  return (
    <div>
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Landing Page Leads</h1>
          <p className={s.pageSub}>{data?.total ?? 0} total · {newCount} new on this page</p>
        </div>
      </div>

      {isLoading ? <Spinner center /> : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>{['Name', 'Phone', 'State', 'Course', 'Status', 'Received'].map((h) => <th key={h} className={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody className={s.tbody}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={s.tdPrimary}>{item.name}</td>
                  <td className={s.td}>{item.phone}</td>
                  <td className={s.td}>{item.state}</td>
                  <td className={s.td}>
                    <div className={s.tdMain}>{item.course}</div>
                    <div className={s.tdSub}>{item.course_type}</div>
                  </td>
                  <td className={s.td}>
                    <select
                      value={item.status}
                      onChange={(e) => mutation.mutate({ id: item.id, status: e.target.value })}
                      disabled={mutation.isPending}
                      style={{ fontSize: '0.78rem', padding: '4px 6px', borderRadius: 6, border: '1px solid #e2e8f0' }}
                    >
                      {STATUS_OPTIONS.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className={s.td} style={{ whiteSpace: 'nowrap' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—'}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6}>
                  <div className={s.emptyState}>
                    <div className={s.emptyStateIcon}><UserPlus size={24} /></div>
                    <p className={s.emptyStateText}>No leads yet</p>
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
